'use strict';

const dymanicHost = require('..');
const assert = require('assert').strict;

assert.strictEqual(dymanicHost(), 'Hello from dymanicHost');
console.info('dymanicHost tests passed');
