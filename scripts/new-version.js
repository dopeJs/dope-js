const semver = require('semver')

const findLatestVersion = (versionSet) => {
  return [...versionSet].find((v) => v === semver.coerce(v).raw)
}

function main() {
  const versionList = JSON.parse(process.env.VERSION_LIST)
  const releaseType = process.env.VERSION_TYPE
  const sortedVersionList = versionList.sort(semver.rcompare)
  console.log(sortedVersionList)
  // const sortedVersionSet = new Set(sortedVersionList)
  // return generateVersions(sortedVersionSet, releaseType)
}

// console.log(main())
