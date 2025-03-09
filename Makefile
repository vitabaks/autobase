.PHONY: all SHELL

# Makefile global config
.DEFAULT_GOAL:=help
.EXPORT_ALL_VARIABLES:
.ONESHELL:
.SILENT:
MAKEFLAGS += "-j$(NUM_CORES) -l$(NUM_CORES)"
MAKEFLAGS += --silent
SHELL:=/bin/bash
.SHELLFLAGS = -eu -o pipefail -c

# Makefile colors config
bold=$(shell tput bold)
normal=$(shell tput sgr0)
errorTitle=$(shell tput setab 1 && tput bold && echo '\n')
recommendation=$(shell tput setab 4)
underline=$(shell tput smul)
reset=$(shell tput -Txterm sgr0)
black=$(shell tput setaf 0)
red=$(shell tput setaf 1)
green=$(shell tput setaf 2)
yellow=$(shell tput setaf 3)
blue=$(shell tput setaf 4)
magenta=$(shell tput setaf 5)
cyan=$(shell tput setaf 6)
white=$(shell tput setaf 7)

define HEADER
How to use me:
	make && make bootstrap
	make ${cyan}<target>${reset}

endef
export HEADER

python_launcher := python$(shell cat .config/python_version.config | cut -d '=' -f 2)

-include $(addsuffix /*.mak, $(shell find .config/make -type d))

## —— Bootstrap ——————————————————————————————————————————————————————————————————————————————————
.PHONY: bootstrap
bootstrap: ## Bootstrap Ansible collection
	$(MAKE) python-bootstrap

.PHONY: bootstrap-dev
bootstrap-dev: ## Bootstrap Ansible collection for development
	$(MAKE) bootstrap
	$(MAKE) python-bootstrap-dev

## —— Virtualenv —————————————————————————————————————————————————————————————————————————————————
.PHONY: reinitialization
reinitialization: ## Return to initial state of Bootstrap Ansible collection
	$(MAKE) clean
	$(MAKE) bootstrap

.PHONY: reinitialization-dev
reinitialization-dev: ## Return to initial state of Bootstrap Ansible collection for development
	$(MAKE) reinitialization
	$(MAKE) bootstrap-dev

## —— Tests ——————————————————————————————————————————————————————————————————————————————————————
.PHONY: tests
tests: ## tests Ansible
	$(MAKE) docker-tests
	$(MAKE) lint
	$(MAKE) molecule-test-all

.PHONY: tests-fast
tests-fast: ## tests Ansible quickly
	$(MAKE) lint
	$(MAKE) molecule-converge

## —— Clean ——————————————————————————————————————————————————————————————————————————————————————
.PHONY: clean
	$(MAKE) clean
clean: ## Clean
	rm -rf .venv/
	rm -rf vendor/
	rm -f *.mak
	rm -rf .pytest_cache/
	rm -rf scripts/.pytest_cache/
	rm -rf scripts/tests/__pycache__/
	rm -rf scripts/modules/__pycache__/
	rm -rf scripts/modules/services/__pycache__/
	rm -rf scripts/modules/utils/__pycache__/
