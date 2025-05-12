ifndef GO_BIN
override GO_BIN = "pg-console"
endif

APP = main.go

swagger_install:
	{ \
	export my_dir=$$(pwd) ;\
	export dir=$$(mktemp -d) ;\
	retry_count=0 ;\
	max_retries=5 ;\
	until [ "$$retry_count" -ge "$$max_retries" ]; do \
		git clone https://github.com/go-swagger/go-swagger "$$dir" && break ;\
		retry_count=$$((retry_count+1)) ;\
		echo "Retry $$retry_count/$$max_retries" ;\
		sleep 1 ;\
	done ;\
	cd "$$dir" ;\
	go install ./cmd/swagger ;\
	cd "$$my_dir" ;\
	swagger version ;\
	}

ensure_deps: ## Ensure Go module dependencies are tidy
	@go mod tidy

build: ## Build app
	@go build -o $(GO_BIN) $(APP)

swagger:
	@swagger generate server --name PgConsole --spec api/swagger.yaml --principal interface{} --exclude-main

build_in_docker: swagger_install swagger ensure_deps build
