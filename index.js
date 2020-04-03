#!/usr/bin/env node

const yargs = require('yargs')
const yargsParser = require('yargs-parser')

const get = require('./get/get')
const pkg = require('./package.json')
const {findRcFile, loadRcFile} = require('./utils/rc')

function createYargsConfigArguments() {
  const simpleArgv = yargsParser(process.argv.slice(2), {envPrefix: 'RFP'})
  const configOption = ['config', loadRcFile]
  // If they're using the config option or opting out of auto-detection, use the config option.
  if (simpleArgv.config) return configOption
  const rcFile = findRcFile()
  // If they don't currently have an rc file, use the config option for awareness.
  if (!rcFile) return configOption
  return [loadRcFile(rcFile)]
}

async function run() {
  const argv = yargs
    .help('help')
    .version(pkg.version)
    .usage('rfp <command> <options>')
    .command('get', 'Prepare report from repo PRs', commandYargs =>
      get.buildCommand(commandYargs),
    )
    .config(...createYargsConfigArguments()).argv

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
