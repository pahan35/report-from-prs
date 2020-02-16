#!/usr/bin/env node

const yargs = require('yargs')

const get = require('./get/get')
const pkg = require('./package.json')

async function run() {
  const argv = yargs
    .help('help')
    .version(pkg.version)
    .usage('rfp <command> <options>')
    .command('get', 'Prepare report from repo PRs', commandYargs =>
      get.buildCommand(commandYargs),
    ).argv

  const [command] = argv._
  switch (command) {
    case 'get':
      await get.runCommand(argv)
      break
    default:
      throw new Error(`Unrecognized command ${command}`)
  }
}

run()
