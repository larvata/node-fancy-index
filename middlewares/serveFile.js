const send = require('koa-send');

const serveFile = async (options, ctx, next) => {
  const { path: pth } = ctx;
  const { basePath } = options;

  await send(ctx, pth, { root: basePath });
};

module.exports = serveFile;
