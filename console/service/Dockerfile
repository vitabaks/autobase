FROM golang:1.24-bookworm as builder
WORKDIR /go/src/pg-console

COPY console/service/ .

RUN make build_in_docker

FROM debian:bookworm-slim
LABEL maintainer="Vitaliy Kukharik vitabaks@gmail.com"

COPY --from=builder /go/src/pg-console/pg-console /usr/local/bin/
COPY console/db/migrations /etc/db/migrations

CMD ["/usr/local/bin/pg-console"]
