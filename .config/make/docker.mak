## —— Docker —————————————————————————————————————————————————————————————————————————————————————
TAG ?= local
DOCKER_REGISTRY ?= autobase

.PHONY: docker-lint docker-lint-console-ui docker-lint-console-api docker-lint-console-db docker-lint-console
docker-lint: docker-lint-automation docker-lint-console-ui docker-lint-console-api docker-lint-console-db docker-lint-console ## Lint all Dockerfiles

docker-lint-automation: ## Lint automation Dockerfile
	@echo "Lint automation container Dockerfile"
	docker run --rm -i -v $(PWD)/automation/Dockerfile:/Dockerfile \
	hadolint/hadolint hadolint --ignore DL3002 --ignore DL3008 --ignore DL3059 /Dockerfile

docker-lint-console-ui: ## Lint console ui Dockerfile
	@echo "Lint console ui container Dockerfile"
	docker run --rm -i -v $(PWD)/console/ui/Dockerfile:/Dockerfile \
	hadolint/hadolint hadolint --ignore DL3002 --ignore DL3008 --ignore DL3059 /Dockerfile

docker-lint-console-api: ## Lint console api Dockerfile
	@echo "Lint console api container Dockerfile"
	docker run --rm -i -v $(PWD)/console/service/Dockerfile:/Dockerfile \
	hadolint/hadolint hadolint --ignore DL3002 --ignore DL3008 --ignore DL3059 /Dockerfile

docker-lint-console-db: ## Lint console db Dockerfile
	@echo "Lint console db container Dockerfile"
	docker run --rm -i -v $(PWD)/console/db/Dockerfile:/Dockerfile \
	hadolint/hadolint hadolint --ignore DL3002 --ignore DL3008 --ignore DL3059 --ignore DL4001 /Dockerfile

docker-lint-console: ## Lint console Dockerfile (all services)
	@echo "Lint console container Dockerfile"
	docker run --rm -i -v $(PWD)/console/Dockerfile:/Dockerfile \
	hadolint/hadolint hadolint --ignore DL3002 --ignore DL3008 --ignore DL3059 --ignore DL4001 /Dockerfile

.PHONY: docker-build docker-build-console-ui docker-build-console-api docker-build-console-db docker-build-console
docker-build: docker-build-automation docker-build-console-ui docker-build-console-api docker-build-console-db docker-build-console ## Build for all Docker images

docker-build-automation: ## Build automation image
	@echo "Build automation docker image with tag $(TAG)";
	docker build --no-cache --platform linux/amd64 --tag automation:$(TAG) --file automation/Dockerfile .

docker-build-console-ui: ## Build console ui image
	@echo "Build console ui docker image with tag $(TAG)"
	docker build --no-cache --platform linux/amd64 --tag console_ui:$(TAG) --file console/ui/Dockerfile .

docker-build-console-api: ## Build console api image
	@echo "Build console api docker image with tag $(TAG)"
	docker build --no-cache --platform linux/amd64 --tag console_api:$(TAG) --file console/service/Dockerfile .

docker-build-console-db: ## Build console db image
	@echo "Build console db docker image with tag $(TAG)"
	docker build --no-cache --platform linux/amd64 --tag console_db:$(TAG) --file console/db/Dockerfile .

docker-build-console: ## Build console image (all services)
	@echo "Build console docker image with tag $(TAG)"
	docker build --no-cache --platform linux/amd64 --tag console:$(TAG) --file console/Dockerfile .

.PHONY: docker-push docker-push-console-ui docker-push-console-api docker-push-console-db docker-push-console
docker-push: docker-push-automation docker-push-console-ui docker-push-console-api docker-push-console-db docker-push-console ## Push all images to Dockerhub (example: make docker-push TAG=my_tag DOCKER_REGISTRY=my_repo DOCKER_REGISTRY_USER="my_username" DOCKER_REGISTRY_PASSWORD="my_password")

docker-push-automation: ## Push automation to Dockerhub
	@echo "Push automation docker image with tag $(TAG)";
	echo "$(DOCKER_REGISTRY_PASSWORD)" | docker login --username "$(DOCKER_REGISTRY_USER)" --password-stdin
	docker tag automation:$(TAG) $(DOCKER_REGISTRY)/automation:$(TAG)
	docker push $(DOCKER_REGISTRY)/automation:$(TAG)

docker-push-console-ui: ## Push console ui image to Dockerhub
	@echo "Push console ui docker image with tag $(TAG)"
	echo "$(DOCKER_REGISTRY_PASSWORD)" | docker login --username "$(DOCKER_REGISTRY_USER)" --password-stdin
	docker tag console_ui:$(TAG) $(DOCKER_REGISTRY)/console_ui:$(TAG)
	docker push $(DOCKER_REGISTRY)/console_ui:$(TAG)

docker-push-console-api: ## Push console api image to Dockerhub
	@echo "Push console api docker image with tag $(TAG)"
	echo "$(DOCKER_REGISTRY_PASSWORD)" | docker login --username "$(DOCKER_REGISTRY_USER)" --password-stdin
	docker tag console_api:$(TAG) $(DOCKER_REGISTRY)/console_api:$(TAG)
	docker push $(DOCKER_REGISTRY)/console_api:$(TAG)

docker-push-console-db: ## Push console db image to Dockerhub
	@echo "Push console db docker image with tag $(TAG)"
	echo "$(DOCKER_REGISTRY_PASSWORD)" | docker login --username "$(DOCKER_REGISTRY_USER)" --password-stdin
	docker tag console_db:$(TAG) $(DOCKER_REGISTRY)/console_db:$(TAG)
	docker push $(DOCKER_REGISTRY)/console_db:$(TAG)

docker-push-console: ## Push console image to Dockerhub (all services)
	@echo "Push console docker image with tag $(TAG)"
	echo "$(DOCKER_REGISTRY_PASSWORD)" | docker login --username "$(DOCKER_REGISTRY_USER)" --password-stdin
	docker tag console:$(TAG) $(DOCKER_REGISTRY)/console:$(TAG)
	docker push $(DOCKER_REGISTRY)/console:$(TAG)

.PHONY: docker-tests
docker-tests: ## Run tests for docker
	$(MAKE) docker-lint
	$(MAKE) docker-build
