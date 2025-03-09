# Contributing Guide

Help improve this project by:

- [Creating an issue](https://help.github.com/articles/creating-an-issue/) (Check for [known issues](https://github.com/search?q=user%3Avitabaks+is%3Aissue+state%3Aopen) first)
- [Submitting a pull request](https://docs.github.com/fr/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) to fix a problem or add a feature

Your contributions are appreciated and will be taken seriously.

## How to Contribute

### 1. Create an issue

Report problems or suggest improvements by [creating an issue](https://github.com/vitabaks/autobase/issues).

### 2. Fork the project

[Fork the repository](https://github.com/vitabaks/autobase) to your GitHub account.

### 3. Make changes

Clone your fork locally and make the necessary changes:

```bash
git clone git@github.com:YOURNAMESPACE/autobase.git
```

### 4. Test your changes

#### 4.1 Desktop

Install [make](https://www.gnu.org/software/make/), [Python3.12](https://www.python.org/), [venv](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/), and [docker](https://docs.docker.com/engine/install/ubuntu/).

Run `make` for Makefile help.

1. Initialize virtualenv and install dependencies with: `make bootstrap-dev`
2. Run Prettier formatting: `make prettier`
3. Lint your code with `make lint`
4. Test your changes with: `make tests` or `make molecule-converge`

To test a specific distribution, set `distro`, `tag`, and `namespace`:

```bash
IMAGE_NAMESPACE=geerlingguy IMAGE_DISTRO=debian12 make molecule-converge
```

#### 4.2 Gitpod

Use Gitpod for a cloud-based development environment:

1. Sign up for Gitpod: https://gitpod.io
2. Fork the `autobase` repository
3. Open your fork in Gitpod: `https://gitpod.io/#https://github.com/username/autobase`
4. Create a new branch: `git checkout -b my-feature-branch`
5. Make your changes and commit: `git add .` and `git commit -m "Description of changes"`
6. Run Prettier formatting: `make prettier`
7. Test with linters: `make lint`
8. Test with Molecule: `make tests` or `make molecule-converge`
9. Push your changes: `git push origin my-feature-branch`

Keep your Gitpod workspace synced with the main repository.

### 5. Submit a pull request

[Create a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork) and [refer to the issue number](https://help.github.com/en/github/writing-on-github/autolinked-references-and-urls) using #123, where 123 is the issue number.

### 6. Wait

Your pull request will be reviewed, and you’ll receive feedback. Thanks for contributing!

Consider sponsoring the maintainer via [GitHub](https://github.com/sponsors/vitabaks) or [Patreon](https://patreon.com/vitabaks).
