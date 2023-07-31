const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/task"
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://localhost:7013',
        secure: false
    });

    app.use(appProxy);
};
