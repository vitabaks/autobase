# Python default launcher
python_launcher := python$(shell cat .config/python_version.config | cut -d '=' -f 2)
python_requirements_file ?= automation/requirements.txt
python_requirements_dev_file ?= .config/python/dev/requirements.txt

# Activate virtual environment
ACTIVATE_VENV = . .venv/bin/activate

## —— Python —————————————————————————————————————————————————————————————————————————————————————
.PHONY: python-bootstrap
python-bootstrap: ## Bootstrap python
	$(MAKE) python-venv-init
	$(MAKE) python-venv-upgrade
	$(MAKE) python-venv-requirements

.PHONY: python-bootstrap-dev
python-bootstrap-dev: ## Bootstrap python for dev env
	$(MAKE) python-venv-requirements-dev
	$(MAKE) python-venv-linters-install

# ===============================================================================================
# .venv
# ===============================================================================================
.PHONY: python-venv-init
python-venv-init: ## Create venv ".venv/" if not exist
	@echo "Checking if .venv directory exists..."; \
	if [ ! -d .venv ]; then echo "Creating virtual environment using $(python_launcher)..."; $(python_launcher) -m venv .venv; else echo ".venv directory already exists. Skipping creation."; fi

.PHONY: python-venv-upgrade
python-venv-upgrade: ## Upgrade venv with pip, setuptools and wheel
	@echo "Upgrading virtual environment..."
	$(ACTIVATE_VENV) && pip install --upgrade pip setuptools wheel

.PHONY: python-venv-requirements
python-venv-requirements: ## Install or upgrade from $(python_requirements_file)
	@echo "Installing or upgrading requirements from $(python_requirements_file)..."
	$(ACTIVATE_VENV) && pip install --upgrade --requirement $(python_requirements_file)

.PHONY: python-venv-requirements-dev
python-venv-requirements-dev: ## Install or upgrade from $(python_requirements_dev_file)
	@echo "Installing or upgrading dev requirements from $(python_requirements_dev_file)..."
	$(ACTIVATE_VENV) && pip install --upgrade --requirement $(python_requirements_dev_file)

.PHONY: python-venv-linters-install
python-venv-linters-install: ## Install or upgrade linters
	@echo "Installing or upgrading linters..."
	$(ACTIVATE_VENV) && pip install --upgrade flake8

.PHONY: python-venv-purge
python-venv-purge: ## Remove venv ".venv/" folder
	@echo "Removing .venv directory..."
	@rm -rf .venv

# ===============================================================================================
# Utils
# ===============================================================================================
.PHONY: python-purge-cache
python-purge-cache: ## Purge cache to avoid used cached files
	@echo "Purging pip cache..."
	@if [ -d .venv ] ; then $(ACTIVATE_VENV) && pip cache purge; fi

.PHONY: python-version
python-version: ## Displays the python version used for the .venv
	$(ACTIVATE_VENV) && $(python_launcher) --version

.PHONY: python-flake8
python-flake8: ## Run flake8 linter for python
	$(ACTIVATE_VENV) && flake8 --config .config/.flake8

.PHONY: python-pytest
python-pytest: ## Run pytest to test python scripts
	$(ACTIVATE_VENV) && cd scripts/ && $(python_launcher) -m pytest
