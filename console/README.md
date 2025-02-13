# Console Stack

Autobase stack running with Caddy as reverse proxy. The stack includes:

- Caddy reverse proxy with automatic HTTPS
- Console API
- Console UI
- PostgreSQL database

## Quick Start

1. Setup environment:

```bash
cp .env.example .env
```

2. Configure your `.env`:

```bash
DOMAIN=your-domain.com  # Set your domain
EMAIL=your@email.com    # Required for Caddy SSL
AUTH_TOKEN=your-token   # Your authorization token
```

3. Run the stack:

```bash
docker compose up -d
```

## Notes

- Caddy will automatically handle SSL certificates for your domain
- Data is persisted in Docker volumes: `console_postgres` and `caddy_data`
- The Caddy network is created automatically by Docker Compose
- All services are configured to restart automatically unless stopped manually.
- Additional [environment variables](https://github.com/vitabaks/autobase/tree/master/console/service#configuration) can be configured based on your project needs
- Using the `latest` versions is great for testing. For production installations, specify release versions in the [docker-compose.yml](docker-compose.yml) file.
