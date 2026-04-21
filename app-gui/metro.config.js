const http = require('http');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

const prevEnhance = config.server?.enhanceMiddleware;

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware, server) => {
    const inner = prevEnhance ? prevEnhance(middleware, server) : middleware;
    return (req, res, next) => {
      if (!req.url?.startsWith('/laravel')) {
        return inner(req, res, next);
      }

      const host = process.env.LARAVEL_DEV_HOST || '127.0.0.1';
      const port = Number(process.env.LARAVEL_DEV_PORT || '8000');
      const u = new URL(req.url, 'http://placeholder.local');
      const path = (u.pathname.slice('/laravel'.length) || '/') + u.search;

      const hdrs = { ...req.headers, host: `${host}:${port}` };
      delete hdrs['accept-encoding'];

      const pReq = http.request(
        { hostname: host, port, path, method: req.method, headers: hdrs },
        (pRes) => {
          res.writeHead(pRes.statusCode || 502, pRes.headers);
          pRes.pipe(res);
        },
      );

      pReq.on('error', () => {
        if (!res.headersSent) {
          res.writeHead(502, { 'content-type': 'application/json' });
        }
        res.end(JSON.stringify({ ok: false, message: 'Laravel not reachable (is php artisan serve running?)' }));
      });

      req.pipe(pReq);
    };
  },
};

module.exports = withNativeWind(config, { input: './global.css' });
