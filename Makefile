.PHONY: help setup dev deploy db-migrate db-migrate-local build-cli check clean

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## First-time setup (install deps, create local DB, copy configs)
	npm install
	cp -n .dev.vars.example .dev.vars 2>/dev/null || true
	cp -n wrangler.toml.example wrangler.toml 2>/dev/null || true
	@echo "\n Edit .dev.vars and wrangler.toml with your credentials, then run: make db-migrate-local"

dev: ## Start local development server
	npm run dev

deploy: ## Deploy to Cloudflare Workers
	npm run deploy

db-migrate: ## Run all migrations on remote D1 database
	@for f in migrations/*.sql; do echo "Running $$f..."; npx wrangler d1 execute claude-leaderboard-db --file=$$f; done

db-migrate-local: ## Run all migrations on local D1 database
	@for f in migrations/*.sql; do echo "Running $$f..."; npx wrangler d1 execute claude-leaderboard-db --local --file=$$f; done

build-cli: ## Build the Go CLI binary for current platform
	cd cli/ccrank-git && go build -ldflags "-s -w" -o ccrank-git .

check: ## Verify the build compiles without deploying
	npx wrangler deploy --dry-run

clean: ## Remove build artifacts
	rm -rf node_modules dist .wrangler cli/ccrank-git/ccrank-git cli/ccrank-git/dist
	@echo "Cleaned. Run 'make setup' to reinstall."
