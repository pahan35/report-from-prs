const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

/*
// Leave this code to be able to regenerate rc files
const filePrefixes = ['rfp', 'report-from-prs']
const supportedFormats = ['js', 'json', 'yaml', 'yml']

const rcFileNames = filePrefixes.reduce((carry, prefix) => {
  return carry.concat(
    supportedFormats.reduce((formatCarry, format) => {
      const fileName = `${prefix}rc.${format}`
      return formatCarry.concat([fileName, `.${fileName}`])
    }, []),
  )
}, [])

console.log(rcFileNames)
 */

const RC_FILE_NAMES = [
  'rfprc.js',
  '.rfprc.js',
  'rfprc.json',
  '.rfprc.json',
  'rfprc.yaml',
  '.rfprc.yaml',
  'rfprc.yml',
  '.rfprc.yml',
  'report-from-prsrc.js',
  '.report-from-prsrc.js',
  'report-from-prsrc.json',
  '.report-from-prsrc.json',
  'report-from-prsrc.yaml',
  '.report-from-prsrc.yaml',
  'report-from-prsrc.yml',
  '.report-from-prsrc.yml',
]

const JS_FILE_EXTENSION_REGEX = /\.(js)$/i
const YAML_FILE_EXTENSION_REGEX = /\.(yml|yaml)$/i

/**
 * @param {string} dir
 * @return {string|undefined}
 */
function findRcFileInDirectory(dir) {
  for (const file of RC_FILE_NAMES) {
    if (fs.existsSync(path.join(dir, file))) return path.join(dir, file)
  }
}

/**
 * @param {string} startDir
 * @param {{recursive: boolean?}} opts
 * @return {string|undefined}
 */
function findRcFile(startDir, opts = {}) {
  const {recursive = false} = opts
  let lastDir = ''
  let dir = startDir || process.cwd()
  if (!recursive) return findRcFileInDirectory(dir)

  while (lastDir.length !== dir.length) {
    const rcFile = findRcFileInDirectory(dir)
    if (rcFile) return rcFile
    lastDir = dir
    dir = path.join(dir, '..')
  }
}

/**
 * Parse file content to JSON.
 * @param {string} pathToRcFile
 * @param {string} contents
 * @return {{}}
 */
function parseFileContentToJSON(pathToRcFile, contents) {
  // Check if file path ends in .js
  if (JS_FILE_EXTENSION_REGEX.test(pathToRcFile)) {
    return require(pathToRcFile)
  }

  // Check if file path ends in .yaml or .yml
  if (YAML_FILE_EXTENSION_REGEX.test(pathToRcFile)) {
    // Parse yaml content to JSON
    return yaml.safeLoad(contents)
  }

  // Fallback to JSON parsing
  return JSON.parse(contents)
}

/**
 * Load file, parse and convert all `.` in key names to `:`
 * @param {string} pathToRcFile
 * @return {{}}
 */
function loadRcFile(pathToRcFile) {
  // Load file
  const contents = fs.readFileSync(pathToRcFile, 'utf8')
  return parseFileContentToJSON(pathToRcFile, contents)
}

module.exports = {
  findRcFile,
  loadRcFile,
}
