## [0.3.12](https://github.com/variablesoftware/mock-kv/compare/v0.3.11...v0.3.12) (2025-06-13)

## [0.3.11](https://github.com/variablesoftware/mock-kv/compare/v0.3.10...v0.3.11) (2025-06-09)

## [0.3.10](https://github.com/variablesoftware/mock-kv/compare/v0.3.9...v0.3.10) (2025-06-07)

## [0.3.9](https://github.com/variablesoftware/mock-kv/compare/v0.3.8...v0.3.9) (2025-06-07)

## [0.3.8](https://github.com/variablesoftware/mock-kv/compare/v0.3.7...v0.3.8) (2025-06-07)

## [0.3.7](https://github.com/variablesoftware/mock-kv/compare/v0.3.6...v0.3.7) (2025-06-07)

## [0.3.6](https://github.com/variablesoftware/mock-kv/compare/v0.3.5...v0.3.6) (2025-06-07)

## [0.3.5](https://github.com/variablesoftware/mock-kv/compare/v0.3.4...v0.3.5) (2025-06-07)

## [0.3.4](https://github.com/variablesoftware/mock-kv/compare/v0.3.3...v0.3.4) (2025-06-07)

## [0.3.3](https://github.com/variablesoftware/mock-kv/compare/v0.3.2...v0.3.3) (2025-06-06)

## [0.3.2](https://github.com/variablesoftware/mock-kv/compare/v0.3.1...v0.3.2) (2025-06-06)

## [0.3.1](https://github.com/variablesoftware/mock-kv/compare/v0.3.0...v0.3.1) (2025-06-06)

# [0.3.0](https://github.com/variablesoftware/mock-kv/compare/v0.2.2...v0.3.0) (2025-06-06)

## [0.2.2](https://github.com/variablesoftware/mock-kv/compare/v0.2.1...v0.2.2) (2025-06-01)


### Bug Fixes

* lock file. Remove Rollup configuration file (rollup.config.js) as part of project restructuring. ([398a3bc](https://github.com/variablesoftware/mock-kv/commit/398a3bcdc3d2db7d08dfcb23880187f70553ec44))

## [0.2.1](https://github.com/variablesoftware/mock-kv/compare/v0.2.0...v0.2.1) (2025-05-29)


### Bug Fixes

* trigger release for test ([3c56f1d](https://github.com/variablesoftware/mock-kv/commit/3c56f1dd336c576afd3af5e7b1b03dfa36c35ea8))

# [0.2.0](https://github.com/variablesoftware/mock-kv/compare/v0.1.4...v0.2.0) (2025-05-22)


### Features

* 100% test coverage. feat: enhance putHandler to always store metadata, even if null, and update test imports to use index.js ([7aded5e](https://github.com/variablesoftware/mock-kv/commit/7aded5e6c2122bd04f8ea08a5b2d8d4b4547cf94))
* add getWithMetadata functionality and enhance get/put methods with metadata support ([dbbeabe](https://github.com/variablesoftware/mock-kv/commit/dbbeabe4908d6f5c998a379cb5ebe4eb4d04ac93))
* refactor mockKVNamespace implementation and enhance get/put methods with improved handling for metadata and edge cases ([1ee7c97](https://github.com/variablesoftware/mock-kv/commit/1ee7c973755ad0e227e9a0d707a2b99dff333090))

# [0.1.0](https://github.com/variablesoftware/mock-kv/compare/v0.0.2...v0.1.0) (2025-05-09)


### Bug Fixes

* remove unused semantic-release dependencies from package.json and yarn.lock ([64930cb](https://github.com/variablesoftware/mock-kv/commit/64930cbf4087b0910cbc15fdaad58bf69f6339a1))
* reorder build:test and lint commands for improved workflow in CI ([61a5de5](https://github.com/variablesoftware/mock-kv/commit/61a5de5436da1f83bae63b77815eb64a5ee1011f))
* reorder lint and build:test commands in pre-push hook for improved execution flow ([e3fa9f0](https://github.com/variablesoftware/mock-kv/commit/e3fa9f07dd2ba637a26554cc5294aad9f118884e))


### Features

* add comprehensive expiration tests for mockKVNamespace, covering immediate expiration, TTL handling, and key deletion ([cea06d7](https://github.com/variablesoftware/mock-kv/commit/cea06d788996619da43e57701ddf30763d9837e4))
* add comprehensive instruction files and update package dependencies for improved project structure and testing ([ff8fd03](https://github.com/variablesoftware/mock-kv/commit/ff8fd03ba9c5a3a5a36889087da8d3ca843d283e))
* add set -x to pre-commit and pre-push hooks for better debugging ([42fa3de](https://github.com/variablesoftware/mock-kv/commit/42fa3de50cebde9bdbe792997ef37fe1973736b2))
* enhance mockKVNamespace with improved key/value handling, metadata support, and comprehensive tests ([a64562b](https://github.com/variablesoftware/mock-kv/commit/a64562bcc3c96c4710229485e39df3d1fe997e05))
* enhance stress tests for mockKVNamespace with analytics on key/value lengths and operation counts ([2e7d9c1](https://github.com/variablesoftware/mock-kv/commit/2e7d9c1ac323e8d3e79b8cb59c276764c5234d86))
* update .gitignore to include vim swap files and tarball builds ([33e85cc](https://github.com/variablesoftware/mock-kv/commit/33e85ccccd35fe5a746ab5b77a4dcfaeb36e7b51))
* update build scripts to use yarn for rollup commands and upgrade logface dependency to version 0.1.14 ([df1dc18](https://github.com/variablesoftware/mock-kv/commit/df1dc18ef1487401fe7e48d4a3915697650ef328))
* update husky hooks for linting, add rollup configuration, and enhance package dependencies ([3f0462a](https://github.com/variablesoftware/mock-kv/commit/3f0462af24822766e03c4699429a43507b816f21))

# Changelog

All notable changes to this project will be documented in this file. See [Conventional Commits](https://www.conventionalcommits.org/) for commit guidelines.
