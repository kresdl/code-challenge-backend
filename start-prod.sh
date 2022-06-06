#!/bin/sh

node_modules/.bin/tsc -p . && node --experimental-specifier-resolution=node build/index.js