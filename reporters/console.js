const {prsToString} = require('../utils')

function report({closed, open, template}) {
  const sections = [
    ['WIP', open],
    ['Done', closed],
  ]
  for (const [title, prs] of sections) {
    if (prs.length) {
      console.log(title)
      console.log(prsToString(prs, template))
    }
  }
}

module.exports = {
  report,
}
