#!/usr/bin/env node

const fetch = require('isomorphic-fetch')
const yargs = require('yargs')

const pkg = require('./package.json')

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
  const {
    login,
    repo,
    forDays = 7,
    reporter = 'console',
    template = '[title] [pr] [htmlUrl]',
  } = options
  const carriedGetPRs = getPRs(login, repo, forDays)
  const openPRs = await carriedGetPRs('open')
  const closedPRs = await carriedGetPRs('closed')
  const {report} = require(`./reporters/${reporter}`)
  report({closed: closedPRs, open: openPRs, template})
  // TODO(pavlo): Render as HTML
}

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
      type: 'string',
      description: 'Selected reporter',
      default: 'console',
    },
    template: {
      type: 'string',
      description: 'Template to convert PR to string',
      default: '[title] [pr] [htmlUrl]',
    },
  })
}

const argv = yargs
  .help('help')
  .version(pkg.version)
  .usage('rfp <command> <options>')
  .command('Report', 'Prepare report from repo PRs', commandYargs =>
    buildCommand(commandYargs),
  ).argv

if (argv.repo && argv.login) {
  runCommand(argv)
}
