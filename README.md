# PIUPhoenixMyBestPortal

[![Build and Deploy to GitHub Pages](https://github.com/infhyroyage/PIUPhoenixMyBestPortal/actions/workflows/build-deploy-pages.yaml/badge.svg)](https://github.com/infhyroyage/PIUPhoenixMyBestPortal/actions/workflows/build-deploy-pages.yaml)
[![Fetch Pump It Up Phoenix My Best Scores](https://github.com/infhyroyage/PIUPhoenixMyBestPortal/actions/workflows/fetch-scores.yaml/badge.svg)](https://github.com/infhyroyage/PIUPhoenixMyBestPortal/actions/workflows/fetch-scores.yaml)
![coverage](https://infhyroyage.github.io/PIUPhoenixMyBestPortal/badges.svg)

## Overview

Web application that publishes a list of your Pump It Up Phoenix my best scores Over Lv.20 and CO-OP.

## How to use

1. Create your [GitHub](https://github.com/) account.
   - GitHub Docs: [Sign up for a new GitHub account](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github#signing-up-for-a-new-personal-account)
2. Create your [GitHub Personal Access Token](https://github.com/settings/tokens) with read and write access to gists.
   - GitHub Docs: [Creating a fine-grained personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)
   - You should grant a fine-grained personal access token with only an account permission to read and write gists.
   - You should copy the token, because it can't be accessed later.
3. Fork [infhyroyage/PIUPhoenixMyBestPortal](https://github.com/infhyroyage/PIUPhoenixMyBestPortal).
4. Set the following secrets for your forked repository:
   - GitHub Docs: [Creating secrets for a repository](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository)
     | Name | Description | Required |
     | -- | -- | -- |
     | `GITHUB_PAT` | Token of GitHub Personal Access Token | ✓ |
     | `PIU_PHOENIX_PASSWORD` | Password of Pump It Up Phoenix account | ✓ |
5. Set the following configuration variables for your forked repository:
   - GitHub Docs: [Creating configuration variables for a repository](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#creating-configuration-variables-for-a-repository)
     | Name | Description | Required |
     | -- | -- | -- |
     | `PIU_PHOENIX_EMAIL` | Email of Pump It Up Phoenix account | ✓ |
     | `PLAYER_NAME` | Name of Pump It Up Phoenix account | |
6. Wait to trigger and complete the workflow named `Fetch Pump It Up Phoenix My Best Scores`.
   - It is scheduled to run every day at 23:00 UTC.
7. Access the application at `https://<your-username>.github.io/PIUPhoenixMyBestPortal`.
   - Example: `https://infhyroyage.github.io/PIUPhoenixMyBestPortal`

## How to develop

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

[MIT](./LICENSE)
