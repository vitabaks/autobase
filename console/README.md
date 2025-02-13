# Console Stack

Simple stack running with Caddy as reverse proxy.

## Quick Start

1. Setup environment:

```bash
cp .env.example .env
```

2. Configure your `.env`:

```bash
PG_CONSOLE_DOMAIN=your-domain.com  # Set your domain
EMAIL=your@email.com              # Required for Caddy SSL
PG_CONSOLE_API_URL=https://your-domain.com/api/v1
PG_CONSOLE_AUTH_TOKEN=your-token
PG_CONSOLE_LOGGER_LEVEL=info
EMAIL=your@email.com              # Required for Caddy SSL
```

3. Run the stack:

```bash
docker compose up -d
```

The stack includes:

- Caddy reverse proxy with automatic HTTPS
- Console API
- Console UI
- PostgreSQL database

All services are configured to restart automatically unless stopped manually.

## Notes

- Caddy will automatically handle SSL certificates for your domain
- Data is persisted in Docker volumes: `console_postgres` and `caddy_data`
- The Caddy network is created automatically by Docker Compose
