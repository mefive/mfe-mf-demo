'use strict';

const app1 = require('..');
const assert = require('assert').strict;

assert.strictEqual(app1(), 'Hello from app1');
console.info('app1 tests passed');
