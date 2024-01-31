const { createProxyMiddleware } = require('http-proxy-middleware');
const remote = false;
module.exports = function(app) {
    app.use(
        '/api/',
        createProxyMiddleware({
            target: remote ? 'http://sn.fednik.ru/' : 'http://localhost/',
            changeOrigin: true,
        })
    );
    app.use(
        '/oauth/',
        createProxyMiddleware({
            target: remote ? 'http://sn.fednik.ru/' : 'http://localhost/',
            changeOrigin: true,
        })
    );
};
