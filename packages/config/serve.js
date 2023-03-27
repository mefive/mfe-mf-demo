const path = require('path');
const serve = require('../../serve');
const apps = require('../../apps.json');

serve(path.resolve(__dirname, 'public'), apps.config.port);
