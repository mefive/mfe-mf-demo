const path = require('path');
const serve = require('../../serve');
const apps = require('../../apps');

serve(path.resolve(__dirname, 'dist'), apps.host.port);
