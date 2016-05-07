#
# Binaries.
#

ESLINT := node_modules/.bin/eslint
KARMA := node_modules/.bin/karma

#
# Files.
#

SRCS_DIR = lib
SRCS = $(shell find lib -type f -name "*.js")
TESTS_DIR = test
TESTS = test/index.js

#
# Task arguments.
#

KARMA_FLAGS ?= \
	--fail-on-empty-test-suite \
	--single-run

#
# Chore tasks.
#

# Install node dependencies.
node_modules: package.json $(wildcard node_modules/*/package.json)
	@npm install
	@touch $@

# Remove temporary files and build artifacts.
clean:
	@rm -rf *.log
.PHONY: clean

# Remove temporary files, build artifacts, and vendor dependencies.
distclean: clean
	@rm -rf node_modules
.PHONY: distclean

# Lint JavaScript source.
lint: node_modules
	@$(ESLINT) $(wildcard lib/*.js test/index.js)
.PHONY: lint

# TODO: Add make fmt

# Test locally in PhantomJS.
test-phantom: node_modules
	@$(KARMA) start $(KARMA_FLAGS) --browsers PhantomJS
.PHONY: test-phantom

# Test locally in the browser.
test-browser: node_modules
	@$(KARMA) start $(KARMA_FLAGS) --browsers Chrome
.PHONY: test-browser

# Test in Sauce Labs.
test-sauce: node_modules
	@echo "TODO: IMPLEMENT ME"
.PHONY: test-sauce

# Default test target.
test: lint test-phantom
.PHONY: test
.DEFAULT_GOAL = test
