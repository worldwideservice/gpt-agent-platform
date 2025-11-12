DEV_COMPOSE = docker compose -f docker-compose.dev.yml
STAGING_COMPOSE = docker compose -f docker-compose.staging.yml
MONITORING_COMPOSE = docker compose -f monitoring/docker-compose.yml

.PHONY: dev dev-down staging staging-down monitoring monitoring-down verify-env

dev:
	$(DEV_COMPOSE) up --build

dev-down:
	$(DEV_COMPOSE) down

staging:
	$(STAGING_COMPOSE) up --build

staging-down:
	$(STAGING_COMPOSE) down

monitoring:
	$(MONITORING_COMPOSE) up -d

monitoring-down:
	$(MONITORING_COMPOSE) down

verify-env:
	npm run verify:env
