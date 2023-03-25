const handler = require('serve-handler');
const http = require('http');

const PORT = 3001;

const server = http.createServer((req, res) => {
    return handler(req, res, {
        public: 'dist',
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
    });
});

server.listen(PORT, () => {
    console.log(`Running at http://localhost:${PORT}`);
});
