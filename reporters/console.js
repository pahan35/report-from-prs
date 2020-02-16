const {prsToString} = require('../utils')

function report({closed, open, template}) {
  console.log('WIP')
  console.log(prsToString(open, template))
  console.log('Done')
  console.log(prsToString(closed, template))
}

module.exports = {
  report,
}
