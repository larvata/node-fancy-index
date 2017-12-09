const serveFile = async (options, req, res, next) => {
  const { fullpath, filename } = options;
  res.download(fullpath);
};

module.exports = serveFile;
