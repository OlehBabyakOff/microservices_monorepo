# Docker Compose Commands for API-Gateway

## Development

docker-compose -f docker-compose.dev.yml up

## Production

docker-compose up -d --scale api-gateway=(num of replicas)

