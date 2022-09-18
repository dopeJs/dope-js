const { readFile, writeFile, readdir, stat } = require('fs/promises')
const { resolve } = require('path')

const ROOT = resolve(__dirname, '../')

let version = (process.argv[2] || process.env.VERSION || '').trim()
let config

;(async () => {
  if (!version) {
    version = (
      await readFile(resolve(__dirname, '../message.txt'), 'utf8')
    ).trim()
  }
  config = { version }

  // @see https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
  if (
    !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][\dA-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][\dA-Za-z-]*))*))?(?:\+([\dA-Za-z-]+(?:\.[\dA-Za-z-]+)*))?$/.test(
      version
    )
  ) {
    process.stderr.write(`version ${JSON.stringify(version)} is not a semver\n`)
    process.exit(1)
  }

  const pkgs = []
  for (const name of await readdir(`${ROOT}/packages`)) {
    if (await fileExists(`${ROOT}/packages/${name}/package.json`)) {
      pkgs.push(name)
    }
  }

  const versionRE = new RegExp(
    `"(version|@faster/(?:${pkgs.join('|')}))":\\s*"\\d+\\.\\d+\\.\\d+[^"]*"`,
    'g'
  )

  {
    const rootPkgPath = `${ROOT}/package.json`
    const rootPkgMetaTxt = await readFile(rootPkgPath, 'utf8')
    await writeFile(
      rootPkgPath,
      replacePkgMetaVersion(rootPkgMetaTxt, version, versionRE)
    )
  }

  if (await fileExists(`${ROOT}/packages/core/dist`)) {
    await Promise.all([
      replaceBundleConfig(`${ROOT}/packages/core/dist`, 'core', 'umd'),
      replaceBundleConfig(`${ROOT}/packages/core/dist`, 'core', 'cjs'),
      replaceBundleConfig(`${ROOT}/packages/core/dist`, 'core', 'es'),
    ])
  }

  for (const name of pkgs) {
    const pkgMetaPath = `${ROOT}/packages/${name}/package.json`
    const pkgMetaTxt = await readFile(pkgMetaPath, 'utf8')
    const pkgMetaData = JSON.parse(pkgMetaTxt)

    // 忽略版本号独立的包
    if (pkgMetaData.independent) {
      // eslint-disable-next-line no-continue
      continue
    }

    await writeFile(
      pkgMetaPath,
      replacePkgMetaVersion(pkgMetaTxt, version, versionRE)
    )

    if (await fileExists(`${ROOT}/packages/${name}/dist`)) {
      await Promise.all([
        replaceVersion(`${ROOT}/packages/${name}/dist`, name, 'umd'),
        replaceVersion(`${ROOT}/packages/${name}/dist`, name, 'cjs'),
        replaceVersion(`${ROOT}/packages/${name}/dist`, name, 'es'),
      ])
    }
  }
})()

function readJSON(path) {
  return readFile(path, 'utf8').then(JSON.parse)
}

function fileExists(path) {
  return stat(path).then(
    () => true,
    () => false
  )
}

function replacePkgMetaVersion(
  pkgMetaTxt,
  version,
  regex = /"(version)":\s*"\d+\.\d+\.\d+[^"]*"/
) {
  return pkgMetaTxt.replace(regex, `"$1": ${JSON.stringify(version)}`)
}

async function replaceBundleConfig(pkgPath, pkgName, fmt) {
  const bundlePath = resolve(pkgPath, `${pkgName}.${fmt}.js`)
  const content = await readFile(bundlePath, 'utf8')
  await writeFile(
    bundlePath,
    content.replace(
      /\/\*\* <dev-config> \*\/[\S\s]+\/\*\* <\/dev-config> \*\//g,
      JSON.stringify(config)
    ),
    'utf8'
  )
}

async function replaceVersion(pkgPath, pkgName, fmt) {
  const bundlePath = resolve(pkgPath, `${pkgName}.${fmt}.js`)
  const content = await readFile(bundlePath, 'utf8')
  await writeFile(
    bundlePath,
    content.replace(
      /\/\*\* <version> \*\/[\S\s]+?\/\*\* <\/version> \*\//g,
      `'${version}'`
    ),
    'utf8'
  )
}
