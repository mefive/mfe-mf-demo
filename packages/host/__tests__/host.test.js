'use strict';

const host = require('..');
const assert = require('assert').strict;

assert.strictEqual(host(), 'Hello from host');
console.info('host tests passed');
