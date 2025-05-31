## —— Docker —————————————————————————————————————————————————————————————————————————————————————
TAG ?= local
DOCKER_REGISTRY ?= autobase

# Sanitize the tag by replacing slashes with hyphens for Docker compatibility
SANITIZED_TAG := $(subst /,-,$(TAG))

.PHONY: docker-lint docker-lint-console-ui docker-lint-console-api docker-lint-console-db docker-lint-console docker-lint-patroni
docker-lint: docker-lint-automation docker-lint-console-ui docker-lint-console-api docker-lint-console-db docker-lint-console docker-lint-patroni ## Lint all Dockerfiles

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

docker-lint-patroni: ## Lint patroni Dockerfile
	@echo "Lint Patroni container Dockerfile"
	docker run --rm -i -v $(PWD)/docker/patroni/Dockerfile:/Dockerfile \
	hadolint/hadolint hadolint --ignore DL3002 --ignore DL3008 --ignore DL3059 --ignore DL4001 /Dockerfile

.PHONY: docker-build docker-build-console-ui docker-build-console-api docker-build-console-db docker-build-console docker-build-patroni
docker-build: docker-build-automation docker-build-console-ui docker-build-console-api docker-build-console-db docker-build-console docker-build-patroni ## Build for all Docker images

docker-build-automation: ## Build automation image
	@echo "Build automation docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))";
	docker build --no-cache --platform linux/amd64 --tag automation:$(SANITIZED_TAG) --file automation/Dockerfile .

docker-build-console-ui: ## Build console ui image
	@echo "Build console ui docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))"
	docker build --no-cache --platform linux/amd64 --tag console_ui:$(SANITIZED_TAG) --file console/ui/Dockerfile .

docker-build-console-api: ## Build console api image
	@echo "Build console api docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))"
	docker build --no-cache --platform linux/amd64 --tag console_api:$(SANITIZED_TAG) --file console/service/Dockerfile .

docker-build-console-db: ## Build console db image
	@echo "Build console db docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))"
	docker build --no-cache --platform linux/amd64 --tag console_db:$(SANITIZED_TAG) --file console/db/Dockerfile .

docker-build-console: ## Build console image (all services)
	@echo "Build console docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))"
	docker build --no-cache --platform linux/amd64 --tag console:$(SANITIZED_TAG) --file console/Dockerfile .

docker-build-patroni: ## Build patroni image
	@echo "Build Patroni docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))"
	docker build --no-cache --platform linux/amd64 --tag patroni:$(SANITIZED_TAG) --file docker/patroni/Dockerfile .

.PHONY: docker-push docker-push-console-ui docker-push-console-api docker-push-console-db docker-push-console
docker-push: docker-push-automation docker-push-console-ui docker-push-console-api docker-push-console-db docker-push-console ## Push all images to Dockerhub (example: make docker-push TAG=my_tag DOCKER_REGISTRY=my_repo DOCKER_REGISTRY_USER="my_username" DOCKER_REGISTRY_PASSWORD="my_password")

docker-push-automation: ## Push automation to Dockerhub
	@echo "Push automation docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))";
	echo "$(DOCKER_REGISTRY_PASSWORD)" | docker login --username "$(DOCKER_REGISTRY_USER)" --password-stdin
	docker tag automation:$(SANITIZED_TAG) $(DOCKER_REGISTRY)/automation:$(SANITIZED_TAG)
	docker push $(DOCKER_REGISTRY)/automation:$(SANITIZED_TAG)

docker-push-console-ui: ## Push console ui image to Dockerhub
	@echo "Push console ui docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))"
	echo "$(DOCKER_REGISTRY_PASSWORD)" | docker login --username "$(DOCKER_REGISTRY_USER)" --password-stdin
	docker tag console_ui:$(SANITIZED_TAG) $(DOCKER_REGISTRY)/console_ui:$(SANITIZED_TAG)
	docker push $(DOCKER_REGISTRY)/console_ui:$(SANITIZED_TAG)

docker-push-console-api: ## Push console api image to Dockerhub
	@echo "Push console api docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))"
	echo "$(DOCKER_REGISTRY_PASSWORD)" | docker login --username "$(DOCKER_REGISTRY_USER)" --password-stdin
	docker tag console_api:$(SANITIZED_TAG) $(DOCKER_REGISTRY)/console_api:$(SANITIZED_TAG)
	docker push $(DOCKER_REGISTRY)/console_api:$(SANITIZED_TAG)

docker-push-console-db: ## Push console db image to Dockerhub
	@echo "Push console db docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))"
	echo "$(DOCKER_REGISTRY_PASSWORD)" | docker login --username "$(DOCKER_REGISTRY_USER)" --password-stdin
	docker tag console_db:$(SANITIZED_TAG) $(DOCKER_REGISTRY)/console_db:$(SANITIZED_TAG)
	docker push $(DOCKER_REGISTRY)/console_db:$(SANITIZED_TAG)

docker-push-console: ## Push console image to Dockerhub (all services)
	@echo "Push console docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))"
	echo "$(DOCKER_REGISTRY_PASSWORD)" | docker login --username "$(DOCKER_REGISTRY_USER)" --password-stdin
	docker tag console:$(SANITIZED_TAG) $(DOCKER_REGISTRY)/console:$(SANITIZED_TAG)
	docker push $(DOCKER_REGISTRY)/console:$(SANITIZED_TAG)

docker-push-patroni: ## Push patroni image to Dockerhub
	@echo "Push Patroni docker image with tag $(TAG) (sanitized as $(SANITIZED_TAG))"
	echo "$(DOCKER_REGISTRY_PASSWORD)" | docker login --username "$(DOCKER_REGISTRY_USER)" --password-stdin
	docker tag patroni:$(SANITIZED_TAG) $(DOCKER_REGISTRY)/patroni:$(SANITIZED_TAG)
	docker push $(DOCKER_REGISTRY)/patroni:$(SANITIZED_TAG)

.PHONY: docker-tests
docker-tests: ## Run tests for docker
	$(MAKE) docker-lint
	$(MAKE) docker-build
