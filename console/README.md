# Autobase Console Stack

Autobase stack running with Caddy as reverse proxy. The stack includes:

- Caddy (reverse proxy with automatic HTTPS)
- Console API
- Console UI
- Console DB (PostgreSQL)

You can find the Docker Compose file at [`console/docker-compose.yml`](docker-compose.yml)

## Quick Start

1. Clone the repository:
    ```sh
    git clone https://github.com/vitabaks/autobase.git
    ```

2. Navigate to the `console` directory:
    ```sh
    cd autobase/console
    ```

3. Setup environment:
    ```sh
    cp .env.example .env
    ```

4. Configure your `.env`:
    ```sh
    DOMAIN=your-domain.com  # Set your domain
    EMAIL=your@email.com    # Required for Caddy SSL
    AUTH_TOKEN=your-token   # Your authorization token
    ```

5. Run Docker Compose:
    ```sh
    docker compose up -d
    ```

## Notes

- Caddy will automatically handle SSL certificates for your domain
- Data is persisted in Docker volumes: `console_postgres` and `caddy_data`
- The Caddy network is created automatically by Docker Compose
- All services are configured to restart automatically unless stopped manually.
- Additional [environment variables](https://github.com/vitabaks/autobase/tree/master/console/service#configuration) can be configured based on your project needs
- Using the `latest` versions is great for testing. For production installations, specify release versions in the [docker-compose.yml](docker-compose.yml) file.
