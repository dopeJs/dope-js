#! /usr/bin/env node
const { existsSync } = require('fs')
const { resolve } = require('path')

async function dope() {
  const entry = resolve(__dirname, '..', 'lib', 'cli.cjs.js')

  const isEntryExist = existsSync(entry)

  if (isEntryExist) {
    require(entry)
  } else {
    console.warn('DopeJS core file missing, please reinstall @dope-js/core globally')
  }
}

dope()
