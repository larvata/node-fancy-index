const path = require('path');

const serveFile = async (options, req, res, next) => {
  const { path: pth } = req;
  const { basePath } = options;

  // await send(ctx, pth, { root: basePath });
  const fileFullPath = path.join(basePath, pth);
  res.download(fileFullPath);
};

module.exports = serveFile;
