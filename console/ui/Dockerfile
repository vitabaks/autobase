FROM node:20-bookworm AS builder

WORKDIR /usr/src/pg-console

COPY . .

RUN yarn install --frozen-lockfile --network-timeout 1000000 && yarn vite build

FROM nginx:1.26-bookworm AS runtime
LABEL maintainer="Vitaliy Kukharik vitabaks@gmail.com"

WORKDIR /usr/share/nginx/html

COPY --from=builder /usr/src/pg-console/dist ./
COPY nginx/nginx.conf /etc/nginx/
COPY env.sh .env .env.production ./

RUN chmod +x ./env.sh

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
