const {prsToString} = require('../utils')

function report({sections, template}) {
  for (const [title, prs] of sections) {
    console.log(title)
    console.log(prsToString(prs, template))
  }
}

module.exports = {
  report,
}
