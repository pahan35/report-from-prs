## Motivation

I had some burden during preparing weekly notes about my work:
I copy-pasted PR name with link to it.

I noticed that I can automate this work with script which I did here

## Usage

1. Install this package globally
    ```
    npm i -g report-from-prs
    ```
2. Setup [Github token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) with `repo` scope as your env var
    ```
    export GITHUB_REPO_TOKEN=<your-repo-token>
    ```
   Note: if you want to provide access only to your public repos, you may use `public_repo` scope
3. Run package in terminal providing required params `--repo` and `--login`.
   For example, to get my active prs from this repo for last 7 days, use next command
   ```
   report-from-prs get --repo pahan35/report-from-prs --login pahan35
   ```
    Tip: you can use alias `rfp`
    
    
## Commands

### `get`

Prepare reports for provided repo and login with possibility to provide default params
```bash
report-from-prs get --help

Prepare report from repo PRs

Options:
  --help      Show help                                                [boolean]
  --version   Show version number                                      [boolean]
  --repo      Repo from which you want to take reports in [user/org]/repo format
                                                                        [string]
  --login     User login for which you want to collect report           [string]
  --forDays   Number of days before today to get report    [number] [default: 7]
  --reporter  Selected reporter        [choices: "console"] [default: "console"]
  --template  Template to convert PR to string.
                  Possible replacements:
                      [title] - PR title
                      [htmlUrl] - Link to PR in Github
                                    [string] [default: "[title] [pr] [htmlUrl]"]
              
```
