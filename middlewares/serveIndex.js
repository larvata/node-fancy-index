/* eslint-disable camelcase */
const fs = require('fs');
const path = require('path');

const { FANCY_INDEX_SORT } = require('../lib/common');

const {
  prettyFileSize,
  dateFormat,
  buildSortOptions,
  composeIndexHtml,
} = require('../lib/utils');

const updateFileList = (filelist, options) => {
  const {
    exact_size,
    name_length,
    time_format,
  } = options;

  const result = filelist.map((f) => {
    const additionalFields = {};

    if (exact_size) {
      additionalFields.display_size = f.size;
    }
    else {
      additionalFields.display_size = prettyFileSize(f.size);
    }

    if (name_length < f.name.length) {
      additionalFields.display_name = `${f.name.substr(0, name_length)}...`;
    }
    else {
      additionalFields.display_name = f.name;
    }

    additionalFields.display_mtime = dateFormat(f.mtime, time_format);

    const r = Object.assign({}, f, additionalFields);
    return r;
  });

  return result;
};

const sortFileList = (filelist, options) => {
  const { sort, directories_first } = options;

  const sorted = filelist.sort((a, b) => {
    // first list all of the directory
    if (directories_first && a.isDirectory !== b.isDirectory) {
      return (b.isDirectory | 0) - (a.isDirectory | 0);
    }

    const multiple = (sort.order === FANCY_INDEX_SORT.ORDER_ASC) ? 1 : -1;

    if (sort.column === FANCY_INDEX_SORT.COLUMN_FILE_NAME) {
      let fileOrder = 0;
      if (a.name > b.name) {
        fileOrder = -1;
      } else if (a.name < b.name) {
        fileOrder = 1;
      }
      fileOrder = fileOrder * multiple;
      return fileOrder;
    } else if (sort.column === FANCY_INDEX_SORT.COLUMN_FILE_SIZE) {
      return (b.size - a.size) * multiple;
    } else if (sort.column === FANCY_INDEX_SORT.COLUMN_MODIFY_DATE) {
      return (b.mtime - a.mtime) * multiple;
    }
    return 0;
  });

  return sorted;
};

const serveIndex = (options, req, res, next) => {
  const { path: pth, query } = req;
  const { fullpath, configs } = options;

  const dirs = fs.readdirSync(fullpath);

  // build filelist
  const filelist = dirs
    .filter((f) => {
      const { ignore } = configs;
      const ignoreRules = [].concat(ignore);

      return !ignoreRules.some((ir) => {
        return ir.test(f);
      });
    }).map((d) => {
      const filePath = path.join(fullpath, d);
      const stats = fs.lstatSync(filePath);

      const { size, mtime } = stats;
      const dmtime = new Date(mtime);
      const isDirectory = stats.isDirectory();
      const isFile = stats.isFile();

      const result = {
        name: d,
        path: path.join(pth, encodeURIComponent(d)),
        // displayName: d,
        size,
        // displaySize: size,
        mtime: dmtime,
        // dmtime,
        isDirectory,
        isFile,
      };
      return result;
    });

  const {
    exact_size,
    name_length,
    time_format,
    default_sort,
    directories_first,
  } = configs;
  const { sort, sort_full } = buildSortOptions(default_sort, query);

  const filelistOptions = {
    exact_size,
    name_length,
    time_format,
    default_sort,
    directories_first,
    sort,
  };

  // update fields by user configuration
  const updatedFilelist = updateFileList(filelist, filelistOptions);

  // sort the file list
  const sortedFilelist = sortFileList(updatedFilelist, filelistOptions);

  const renderData = {
    filelist: sortedFilelist,
    sortOptions: sort_full,
    isRoot: (pth === '/'),
    path: decodeURI(pth),
  };
  const content = composeIndexHtml(configs, renderData);
  res.send(content);
};

module.exports = serveIndex;
