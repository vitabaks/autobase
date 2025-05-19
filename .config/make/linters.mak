## —— Linter —————————————————————————————————————————————————————————————————————————————————————

# Activate virtual environment
ACTIVATE_VENV = source .venv/bin/activate

# Configuration files
YAMLLINT_CONFIG = .config/.yamllint
FLAKE8_CONFIG = .config/.flake8

# Collection metadata
COLLECTION_NAMESPACE := vitabaks
COLLECTION_NAME := autobase
COLLECTION_SRC := $(CURDIR)/automation
COLLECTION_ROOT := $(CURDIR)/.ansible-lint-env
COLLECTION_PATH := $(COLLECTION_ROOT)/ansible_collections/$(COLLECTION_NAMESPACE)/$(COLLECTION_NAME)

.PHONY: prepare-collections
prepare-collections: ## Prepare collection for ansible-lint
	mkdir -p $(dir $(COLLECTION_PATH))
	ln -sfn $(COLLECTION_SRC) $(COLLECTION_PATH)

.PHONY: linter-ansible-lint
linter-ansible-lint: prepare-collections ## Lint Ansible files using ansible-lint
	echo "ansible-lint #########################################################"
	$(ACTIVATE_VENV) && \
	ANSIBLE_COLLECTIONS_PATH=$(COLLECTION_ROOT) \
	ansible-lint --force-color --parseable ./automation

.PHONY: linter-yamllint
linter-yamllint: ## Lint YAML files using yamllint
	echo "yamllint #############################################################"
	$(ACTIVATE_VENV) && \
	yamllint --strict -c $(YAMLLINT_CONFIG) $(COLLECTION_SRC)

.PHONY: linter-flake8
linter-flake8: ## Lint Python files using flake8
	echo "flake8 ###############################################################"
	$(ACTIVATE_VENV) && \
	flake8 --config $(FLAKE8_CONFIG)

.PHONY: lint
lint: ## Run all linters
	$(MAKE) linter-yamllint
	$(MAKE) linter-ansible-lint
	$(MAKE) linter-flake8
