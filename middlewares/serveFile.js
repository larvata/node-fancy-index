const serveFile = async (options, req, res, next) => {
  const { fullpath } = options;
  res.download(fullpath);
};

module.exports = serveFile;
