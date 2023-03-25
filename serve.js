const handler = require('serve-handler');
const http = require('http');
const apps = require('./apps.json');

Object.values(apps).forEach(app => {
    if (app.disabled) {
        return;
    }

    http.createServer((req, res) => {
        return handler(req, res, {
            public: app.path,
            headers: [
                {
                    source: '**/*.js',
                    headers: [
                        {
                            key: 'Cache-Control',
                            value: 'max-age=7200',
                        },
                    ],
                },
                {
                    source: '*RemoteEntry.js',
                    headers: [
                        {
                            key: 'Cache-Control',
                            value: 'no-cache',
                        },
                    ],
                },
            ],
            rewrites: [{ source: '/*', destination: '/index.html' }],
        });
    }).listen(app.port, () => {
        console.log(`Running at http://localhost:${app.port}`);
    });
});
