const path = require('path')
const ejs = require('ejs')
const open = require('open')
const tempWrite = require('temp-write')

const {prToString} = require('../../utils')

async function report({
  sections,
  template = '[title] [<a href="[htmlUrl]">pr<a>]',
}) {
  const html = await ejs.renderFile(path.resolve(__dirname, './report.ejs'), {
    prToString,
    sections,
    template,
  })
  const reportPath = await tempWrite(html, 'report.html')
  await open(reportPath)
}

module.exports = {
  report,
}
