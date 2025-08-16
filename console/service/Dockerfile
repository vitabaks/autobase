FROM golang:1.24-bookworm as builder
WORKDIR /go/src/pg-console

COPY console/service/ .

RUN make build_in_docker

FROM debian:bookworm-slim
LABEL maintainer="Vitaliy Kukharik vitabaks@gmail.com"

COPY --from=builder /go/src/pg-console/pg-console /usr/local/bin/
COPY console/db/migrations /etc/db/migrations

RUN apt-get clean && rm -rf /var/lib/apt/lists/partial \
   && apt-get update -o Acquire::CompressionTypes::Order::=gz \
   && DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y curl

CMD ["/usr/local/bin/pg-console"]
