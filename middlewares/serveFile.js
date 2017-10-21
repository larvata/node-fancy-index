const serveFile = async (options, req, res, next) => {
  const { fullpath, filename } = options;
  res.download(fullpath, encodeURIComponent(filename));
};

module.exports = serveFile;
