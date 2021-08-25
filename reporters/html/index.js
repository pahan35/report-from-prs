const path = require('path')
const ejs = require('ejs')
const open = require('open')
const tempWrite = require('temp-write')

const {prToString} = require('../../utils')

async function report({
  sections,
  source,
  template = '[title] [<a href="[htmlUrl]">pr<a>]',
}) {
  const now = new Date()
  const since = new Date()
  since.setDate(now.getDate() - source.forDays)
  source.range = {
    now,
    since,
  }
  const html = await ejs.renderFile(path.resolve(__dirname, './report.ejs'), {
    formatDate: (date) => date.toLocaleString(),
    prToString,
    sections,
    source,
    template,
  })
  const reportPath = await tempWrite(html, 'report.html')
  await open(reportPath)
}

module.exports = {
  report,
}
