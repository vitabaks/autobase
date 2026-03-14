## —— Docker —————————————————————————————————————————————————————————————————————————————————————
TAG ?= local
DOCKER_REGISTRY ?= autobase
DOCKER_BUILD_PLATFORM ?= linux/amd64
DOCKER_PLATFORMS ?= linux/amd64,linux/arm64
DOCKER_BUILDX_BUILDER ?= autobase-builder

# Sanitize the tag by replacing slashes with hyphens for Docker compatibility
SANITIZED_TAG := $(subst /,-,$(TAG))

.PHONY: docker-lint docker-lint-console-ui docker-lint-console-api docker-lint-console-db docker-lint-console
docker-lint: docker-lint-automation docker-lint-console-ui docker-lint-console-api docker-lint-console-db docker-lint-console ## Lint all Dockerfiles

docker-lint-automation: ## Lint automation Dockerfile
	@echo "Lint automation container Dockerfile"
	docker run --rm -i -v $(PWD)/automation/Dockerfile:/Dockerfile \
	hadolint/hadolint hadolint --ignore DL3002 --ignore DL3008 --ignore DL3013 --ignore DL3059 /Dockerfile

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

.PHONY: docker-buildx-setup
docker-buildx-setup: ## Set up Docker Buildx builder
	docker buildx inspect $(DOCKER_BUILDX_BUILDER) > /dev/null 2>&1 || docker buildx create --name $(DOCKER_BUILDX_BUILDER) --use
	docker buildx use $(DOCKER_BUILDX_BUILDER)
	docker buildx inspect --bootstrap > /dev/null

.PHONY: docker-build docker-build-console-ui docker-build-console-api docker-build-console-db docker-build-console
docker-build: ## Build for all Docker images
	$(MAKE) docker-buildx-setup
	$(MAKE) docker-build-automation
	$(MAKE) docker-build-console-ui
	$(MAKE) docker-build-console-api
	$(MAKE) docker-build-console-db
	$(MAKE) docker-build-console

docker-build-automation: ## Build automation image
	@echo "Build automation docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))";
	docker buildx build --no-cache --platform $(DOCKER_BUILD_PLATFORM) --tag automation:$(SANITIZED_TAG) --file automation/Dockerfile --load .

docker-build-console-ui: ## Build console ui image
	@echo "Build console ui docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))"
	docker buildx build --no-cache --platform $(DOCKER_BUILD_PLATFORM) --tag console_ui:$(SANITIZED_TAG) --file console/ui/Dockerfile --load .

docker-build-console-api: ## Build console api image
	@echo "Build console api docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))"
	docker buildx build --no-cache --platform $(DOCKER_BUILD_PLATFORM) --tag console_api:$(SANITIZED_TAG) --file console/service/Dockerfile --load .

docker-build-console-db: ## Build console db image
	@echo "Build console db docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))"
	docker buildx build --no-cache --platform $(DOCKER_BUILD_PLATFORM) --tag console_db:$(SANITIZED_TAG) --file console/db/Dockerfile --load .

docker-build-console: ## Build console image (all services)
	@echo "Build console docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))"
	docker buildx build --no-cache --platform $(DOCKER_BUILD_PLATFORM) --tag console:$(SANITIZED_TAG) --file console/Dockerfile --load .

.PHONY: docker-push docker-push-console-ui docker-push-console-api docker-push-console-db docker-push-console
docker-push: ## Push all images to Dockerhub (example: make docker-push TAG=my_tag DOCKER_REGISTRY=my_repo DOCKER_REGISTRY_USER="my_username" DOCKER_REGISTRY_PASSWORD="my_password")
	$(MAKE) docker-buildx-setup
	$(MAKE) docker-push-automation
	$(MAKE) docker-push-console-ui
	$(MAKE) docker-push-console-api
	$(MAKE) docker-push-console-db
	$(MAKE) docker-push-console

docker-push-automation: ## Push automation to Dockerhub
	@echo "Push automation docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))";
	echo "$(DOCKER_REGISTRY_PASSWORD)" | docker login --username "$(DOCKER_REGISTRY_USER)" --password-stdin
	docker buildx build --platform $(DOCKER_PLATFORMS) --tag $(DOCKER_REGISTRY)/automation:$(SANITIZED_TAG) --file automation/Dockerfile --push .

docker-push-console-ui: ## Push console ui image to Dockerhub
	@echo "Push console ui docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))"
	echo "$(DOCKER_REGISTRY_PASSWORD)" | docker login --username "$(DOCKER_REGISTRY_USER)" --password-stdin
	docker buildx build --platform $(DOCKER_PLATFORMS) --tag $(DOCKER_REGISTRY)/console_ui:$(SANITIZED_TAG) --file console/ui/Dockerfile --push .

docker-push-console-api: ## Push console api image to Dockerhub
	@echo "Push console api docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))"
	echo "$(DOCKER_REGISTRY_PASSWORD)" | docker login --username "$(DOCKER_REGISTRY_USER)" --password-stdin
	docker buildx build --platform $(DOCKER_PLATFORMS) --tag $(DOCKER_REGISTRY)/console_api:$(SANITIZED_TAG) --file console/service/Dockerfile --push .

docker-push-console-db: ## Push console db image to Dockerhub
	@echo "Push console db docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))"
	echo "$(DOCKER_REGISTRY_PASSWORD)" | docker login --username "$(DOCKER_REGISTRY_USER)" --password-stdin
	docker buildx build --platform $(DOCKER_PLATFORMS) --tag $(DOCKER_REGISTRY)/console_db:$(SANITIZED_TAG) --file console/db/Dockerfile --push .

docker-push-console: ## Push console image to Dockerhub (all services)
	@echo "Push console docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))"
	echo "$(DOCKER_REGISTRY_PASSWORD)" | docker login --username "$(DOCKER_REGISTRY_USER)" --password-stdin
	docker buildx build --platform $(DOCKER_PLATFORMS) --tag $(DOCKER_REGISTRY)/console:$(SANITIZED_TAG) --file console/Dockerfile --push .

.PHONY: docker-tests
docker-tests: ## Run tests for docker
	$(MAKE) docker-lint
	$(MAKE) docker-build
