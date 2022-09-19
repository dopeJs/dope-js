#! /usr/bin/env node
const { existsSync } = require('fs')
const { resolve } = require('path')

async function melon() {
  const entry = resolve(__dirname, '..', 'lib', 'cli.js')

  const isEntryExist = existsSync(entry)

  if (isEntryExist) {
    require(entry)
  } else {
    console.warn(
      'Melon JS core file missing, please reinstall @melon-js/core globally'
    )
  }
}

melon()
