#!/bin/sh

node_modules/.bin/tsc -p . && sh -c 'node_modules/.bin/nodemon --experimental-specifier-resolution=node build/index.js & node_modules/.bin/tsc -p . -w'