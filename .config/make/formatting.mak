## —— Formatting ——————————————————————————————————————————————————————————————————————————-------

.PHONY: prettier
prettier: ## Run Prettier formatting
	npx prettier --write .

.PHONY: prettier-check
prettier-check: ## Check formatting with Prettier (without modifying files)
	npx prettier --check .

.PHONY: sql-format
sql-format: ## Format all SQL files using sql-formatter
	find . -name "*.sql" -print0 | xargs -0 -n1 sql-formatter --fix

# https://hub.docker.com/r/backplane/pgformatter
.PHONY: pg-format
pg-format: ## Format all SQL files using pgFormatter (PostgreSQL SQL queries and PL/PGSQL code beautifier)
	find . -name "*.sql" -print0 | xargs -0 -I{} \
		docker run --rm -v "$(shell pwd):/work" -u $(shell id -u):$(shell id -g) \
		backplane/pgformatter -u 1 -U 1 -f 1 -s 2 -W 0 -w 160 -i "{}"
