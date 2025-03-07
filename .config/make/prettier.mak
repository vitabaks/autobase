## —— Formatting ——————————————————————————————————————————————————————————————————————————-------

.PHONY: prettier
prettier: ## Run Prettier formatting
	npx prettier --write .

.PHONY: prettier-check
prettier-check: ## Check formatting with Prettier (without modifying files)
	npx prettier --check .
