# Makefile for the Grindly backend
#
# The `node_modules` target uses package.json as a prerequisite so that
# dependencies are only reinstalled when package.json changes. The Prisma
# client is generated as part of installation, because @prisma/client has
# no usable types until `prisma generate` runs against prisma/schema.prisma.

.PHONY: install generate clean typecheck dev build

# Install dependencies and generate the Prisma client.
# Rebuilt whenever package.json changes.
node_modules: package.json
	npm install
	npx prisma generate
	@touch node_modules

# Convenience alias.
install: node_modules

# Regenerate the Prisma client (needed after editing prisma/schema.prisma).
generate: node_modules
	npx prisma generate

# Type-check the project.
typecheck: node_modules
	npx tsc --noEmit

# Run the dev server.
dev: node_modules
	npm run dev

# Build for production.
build: node_modules
	npm run build

# Remove installed dependencies and generated client.
clean:
	rm -rf node_modules dist
