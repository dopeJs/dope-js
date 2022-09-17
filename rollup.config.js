import { existsSync } from 'fs'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'
import svg from 'rollup-plugin-svg'
import svgson from '@faster/rollup-plugin-svgson'
import markSideEffects from './scripts/rollup-plugin-mark-sideeffects.mjs'

// rollup cannot properly import commonjs module with `import` syntax
const { getPackages } = require('./scripts/get-packages')

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV =
    process.env.ROLLUP_WATCH === 'true' ? 'development' : 'production'
}

const exportConditions = [process.env.NODE_ENV]

/** @type {import('rollup').Plugin[]} */
const commonPlugins = [
  markSideEffects({
    extensions: ['.css', '.less'],
  }),
  resolve({
    exportConditions,
  }),
  commonjs(),
  typescript({
    clean: process.env.ROLLUP_WATCH !== 'true',
    check: false,
    tsconfigOverride: {
      /** @type {import('typescript').CompilerOptions} */
      compilerOptions: {
        skipLibCheck: true,
        declaration: false,
      },
    },
  }),
  babel({
    extensions: ['.tsx', '.jsx'],
    exclude: 'node_modules/**',
    babelHelpers: 'bundled',
    presets: ['@babel/preset-react'],
    plugins: [
      ['@babel/plugin-syntax-typescript', { isTSX: true }],
      'module:@faster/jsx-plugin',
      '@babel/plugin-transform-arrow-functions',
      '@babel/plugin-transform-spread',
    ],
  }),
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.VERSION': JSON.stringify(
      process.env.VERSION || require('./package.json').version
    ),
    'process.env.VARIANT': JSON.stringify(''),
  }),
  json(),
  svgson(),
  svg({ base64: true }),
  sourceMaps(),
]

function genCfg(pkgPath, name, fmts, variant = '') {
  // eslint-disable-next-line import/no-dynamic-require
  const pkg = require(`${pkgPath}/package.json`)
  const external = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies })

  const config = {
    input: existsSync(`${pkgPath}/src/index.ts`)
      ? `${pkgPath}/src/index.ts`
      : `${pkgPath}/index.ts`,
    output: fmts.map((fmt) => ({
      name: `__FASTER_META__.${name}`,
      // eslint-disable-next-line consistent-return
      globals: (id) => {
        if (id.startsWith('@faster/')) {
          return `__FASTER_META__.${id.slice(8)}`
        }
      },
      file: `packages/${name}/dist/${name}${
        variant ? `.${variant}` : ''
      }.${fmt}.js`,
      format: fmt,
      sourcemap: true,
    })),
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [...external, /@babel\/runtime/, 'fs', 'path'],
    watch: {
      include: 'packages/**',
    },
    plugins: [...commonPlugins],
  }

  if (variant) {
    for (let i = 0; i < config.plugins.length; i++) {
      if (config.plugins[i].name === 'replace') {
        config.plugins.splice(
          i,
          0,
          replace({
            preventAssignment: true,
            'process.env.VARIANT': JSON.stringify(variant),
          })
        )
        break
      }
    }
  }

  return config
}

/**
 * @param opts {
 *   @param fmts
 *   @param needBundle
 *   @param plugins
 * }
 */
function customBundleCfg(pkgPath, name, opts, variant = '') {
  const { fmts, needBundle, plugins } = opts
  const cfg = genCfg(pkgPath, name, fmts, variant)

  if (needBundle) {
    cfg.external =
      cfg.external && cfg.external.filter((pkg) => !needBundle.includes(pkg))
  }

  if (plugins && plugins.length > 0) {
    cfg.plugins = [...cfg.plugins, ...plugins]
  }

  if (opts.conditions) {
    for (let i = 0; i < cfg.plugins.length; i++) {
      if (cfg.plugins[i].name === 'node-resolve') {
        cfg.plugins[i] = resolve({
          exportConditions: Array.isArray(opts.conditions)
            ? opts.conditions
            : [opts.conditions],
        })
        break
      }
    }
  }

  cfg.plugins = cfg.plugins.filter(Boolean)

  return cfg
}

function addGlobalWrapper(pkgPath, name, cfg) {
  // eslint-disable-next-line import/no-dynamic-require
  const pkg = require(`${pkgPath}/package.json`)
  const { version } = pkg
  const versionStr = `/** <version> */'${version}'/** </version> */`
  cfg.output.forEach((output) => {
    if (output.format === 'cjs' || output.format === 'umd') {
      output.intro = `
      var glb = typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {};

      function setVersion(version, key, obj) {
        if (typeof glb.__FASTER_VERSION__[version] === 'undefined') {
          glb.__FASTER_VERSION__[version] = [];
        }
        var space = glb.__FASTER_VERSION__[version], versionObj;
        for (var i = 0, l = space.length; i < l; i++) {
          versionObj = space[i];
          if (typeof versionObj[key] === 'undefined') {
            break;
          }
        }
        if (i === l) {
          versionObj = {};
          space.push(versionObj);
        }
        versionObj[key] = obj;
        return i;
      }

      if (typeof glb.__FASTER_META__ === 'undefined') {
        glb.__FASTER_META__ = {};
      }

      if (typeof glb.__FASTER_VERSION__ === 'undefined') {
        glb.__FASTER_VERSION__ = {};
      }

      if (typeof glb.__USE_FASTER_VERSION__ === 'undefined') {
        glb.__USE_FASTER_VERSION__ = function(v, c) {
          var versionSpace = glb.__FASTER_VERSION__[v];
          if (versionSpace) {
            c = typeof c === 'undefined' ? 0 : c;
            var version = versionSpace[c];
            if (version) {
              glb.__FASTER_META__ = Object.assign({}, version);
            }
          }
        }
      }
      `
      output.outro = `
      glb.__USE_FASTER_VERSION__(${versionStr}, setVersion(${versionStr}, '${name}', exports));
      `
      if (name === 'core') {
        output.outro += `
        glb.__USE_FASTER_VERSION__(${versionStr}, setVersion(${versionStr}, 'config', /** <dev-config> */ {
          version: ${versionStr},
          devtoolsUrl: 'http://0.0.0.0:9000/packages/devtools/dist/devtools.umd.js',
          recorderUrl: 'http://0.0.0.0:9000/packages/shadow/dist/shelter.umd.js',
        }/** </dev-config> */));
        `
      }
    }
  })
  return cfg
}

export default getPackages().then((pkgs) => {
  // fix demo
  // FIXME: remove this
  if (!pkgs.includes('adapter')) {
    pkgs.push('adapter', 'wdk', 'shape')
  }

  const config = []
  pkgs.forEach((pkg) => {
    const partialCfg = customBundleCfg(`./packages/${pkg}`, pkg, {
      fmts: ['umd', 'cjs', 'es'],
      plugins: [
        pkg === 'widget' &&
          postcss({
            minimize: true,
            inject: true,
            extensions: ['less'],
          }),
      ],
    })

    if (pkg === 'core') {
      config.push(addGlobalWrapper(`./packages/${pkg}`, pkg, partialCfg))

      const variants = ['development']
      variants.forEach((variant) => {
        const cfg = customBundleCfg(
          `./packages/${pkg}`,
          pkg,
          {
            fmts: ['umd', 'cjs', 'es'],
            conditions: [variant],
          },
          variant
        )
        config.push(addGlobalWrapper(`./packages/${pkg}`, pkg, cfg))
      })
    } else {
      config.push(partialCfg)
    }
  })

  return config
})
