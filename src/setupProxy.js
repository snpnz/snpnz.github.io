const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api/',
        createProxyMiddleware({
            target: 'http://localhost/',
            changeOrigin: true,
        })
    );
    app.use(
        '/oauth/',
        createProxyMiddleware({
            target: 'http://localhost/',
            changeOrigin: true,
        })
    );
};