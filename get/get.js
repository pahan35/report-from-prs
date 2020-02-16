const fetch = require('isomorphic-fetch')

function buildCommand(commandYargs) {
  return commandYargs.options({
    repo: {
      type: 'string',
      description:
        'Repo from which you want to take reports in [user/org]/repo format',
    },
    login: {
      type: 'string',
      description: 'User login for which you want to collect report',
    },
    forDays: {
      type: 'number',
      description: 'Number of days before today to get report',
      default: 7,
    },
    reporter: {
      description: 'Selected reporter',
      choices: ['console', 'html'],
      default: 'html',
    },
    template: {
      type: 'string',
      description: `Template to convert PR to string.
         Possible replacements:
          [title] - PR title
          [htmlUrl] - Link to PR in Github`,
    },
  })
}

async function fetchPRs(slug, state) {
  const githubToken = process.env.GITHUB_REPO_TOKEN
  if (!githubToken) {
    throw new Error(`Missing GITHUB_REPO_TOKEN in env!`)
  }
  if (!slug || !slug.includes('/')) {
    throw new Error(`Wrong slug: ${slug}`)
  }
  const url = `https://api.github.com/repos/${slug}/pulls?state=${state}&sort=updated&direction=desc`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `token ${githubToken}`,
    },
  })
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        `Provided Github token has no access to provided repo ${slug}`,
      )
    }
    throw new Error('Unknown problem on prs retrieving from Github')
  }

  return response.json()
}

const filterUserPRs = login => pr => pr.user.login === login
const filterAfterDate = afterDate => pr =>
  new Date(pr.merged_at || pr.updated_at) > afterDate

function filterForDays(forLatestDays) {
  const afterDate = new Date()
  afterDate.setDate(afterDate.getDate() - forLatestDays)
  return filterAfterDate(afterDate)
}

const getPRs = (login, repo, forLatestDays) => async state =>
  (await fetchPRs(repo, state))
    .filter(filterUserPRs(login))
    .filter(filterForDays(forLatestDays))

async function runCommand(options) {
  const {login, repo, forDays = 7, reporter = 'console', template} = options
  const carriedGetPRs = getPRs(login, repo, forDays)
  const sections = []
  for (const [title, state] of [
    ['WIP', 'open'],
    ['Done', 'closed'],
  ]) {
    const prs = await carriedGetPRs(state)
    if (prs.length) {
      sections.push([title, prs])
    }
  }
  const {report} = require(`../reporters/${reporter}`)
  report({
    sections,
    template,
  })
}

module.exports = {
  buildCommand,
  runCommand,
}
