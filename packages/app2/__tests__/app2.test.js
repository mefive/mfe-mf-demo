'use strict';

const app2 = require('..');
const assert = require('assert').strict;

assert.strictEqual(app2(), 'Hello from app2');
console.info('app2 tests passed');
