const handler = require('serve-handler');
const http = require('http');

module.exports = function (path, port) {
    http.createServer((req, res) => {
        return handler(req, res, {
            public: path,
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
    }).listen(port, () => {
        console.log(`Running at http://localhost:${port}`);
    });
};
