const fs = require('fs');
const path = require('path');

const serveIndex = require('./serveIndex');
const serveFile = require('./serveFile');

const createServeIndexMiddleware = (basePath, configs) => {
  return (ctx, next) => {
    const { path: pth, query } = ctx;

    const fullpath = path.join(basePath, decodeURIComponent(pth));

    const exists = fs.existsSync(fullpath);
    if (!exists) {
      return next();
    }

    const options = {
      basePath,
      fullpath,
      query,
      configs,
    };

    // determine is file or directory
    const stat = fs.statSync(fullpath);
    if (stat.isDirectory()) {
      return serveIndex(options, ctx, next);
    } else if (stat.isFile()) {
      return serveFile(options, ctx, next);
    }
  };
};

module.exports = createServeIndexMiddleware;
