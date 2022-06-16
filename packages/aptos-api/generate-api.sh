#!/usr/bin/env -S bash -xe

rm -fr fixtures/
mkdir -p fixtures/
curl https://raw.githubusercontent.com/aptos-labs/aptos-core/devnet/api/doc/openapi.yaml >fixtures/openapi.yaml

yarn dlx swagger-typescript-api@latest -p fixtures/openapi.yaml \
    --modular --single-http-client --extract-request-params --extract-request-body --responses \
    -o src/
