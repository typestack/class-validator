#!/bin/bash
npm ci --ignore-scripts
npm run i18n:extract
npm run i18n:fix
npm run prettier:fix
npm run lint:fix
npm run prettier:check
npm run lint:check
npm run test:ci
npm run build:es2015
npm run build:esm5
npm run build:cjs
npm run build:umd
npm run build:types
cp -r i18n build/i18n
cp LICENSE build/LICENSE
cp README.md build/README.md
jq 'del(.devDependencies) | del(.scripts)' package.json > build/package.json