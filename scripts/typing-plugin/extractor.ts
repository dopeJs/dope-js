import { Extractor, ExtractorConfig, ExtractorResult } from '@microsoft/api-extractor'
import chalk from 'chalk'
import { existsSync, rmSync, statSync } from 'fs'
import { resolve } from 'path'

export function extract(pkgName: string, cwd: string) {
  console.log(chalk.bold('API Extractor start'))

  const extractorJsonPath: string = resolve(cwd, 'packages', pkgName, 'api-extractor.json')
  if (!existsSync(extractorJsonPath) || !statSync(extractorJsonPath).isFile()) {
    console.log(chalk.red(`api-extractor.json not found.`))
    return
  }

  const extractorConfig: ExtractorConfig = ExtractorConfig.loadFileAndPrepare(extractorJsonPath)

  const extractorResult: ExtractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true,
  })

  if (extractorResult.succeeded) {
    console.log(chalk.bold.green(`API Extractor completed successfully`))
  } else {
    console.error(
      chalk.bold(
        `API Extractor completed with ${chalk.red(`${extractorResult.errorCount} errors`)}` +
          ` and ${chalk.yellow(`${extractorResult.warningCount} warnings`)}`
      )
    )
    process.exit(1)
  }

  console.log(`Remove .typing.temp`)
  rmSync(resolve(cwd, 'packages', pkgName, 'lib', '.typing.temp'), { force: true, recursive: true })
}
