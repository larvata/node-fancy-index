const http = require('http');
const fs = require('fs');
const path = require('path');

const argv = require('yargs').argv;
const pug = require('pug');

const Koa = require('koa');

const basePath = argv.p || argv.path || '.';
// const configPath = argv.c || argv.config;

// for test
console.log('basePath: ', basePath);


const FANCY_INDEX_SORT = {
  COLUMN_FILE_NAME: 'N',
  COLUMN_FILE_SIZE: 'S',
  COLUMN_MODIFY_DATE: 'M',
  ORDER_ASC: 'A',
  ORDER_DESC: 'D',

  KEY_COLUMN: 'C',
  KEY_ORDER: 'O',
};

const compileIndex = pug.compileFile('views/default.pug');


const getFileList = (relativePath) => {
  const pth = path.join(basePath, relativePath);
  const exists = fs.existsSync(pth);
  if (!exists) {
    return null;
  }
  console.log('file path:', pth);
  const dirs = fs.readdirSync(pth);

  // todo better mtime and size for display
  const filelist = dirs.map((d) => {
    const filePath = path.join(pth, d);
    const stats = fs.statSync(filePath);
    const { size, mtime } = stats;
    const dmtime = new Date(mtime);
    const isDirectory = stats.isDirectory();
    const isFile = stats.isFile();
    return {
      name: d,
      size,
      mtime: dmtime,
      // dmtime,
      isDirectory,
      isFile,
    };
  });

  return filelist;
};

const sortFileList = (filelist, sortQuery) => {
  const sort = {
    // default: sort name by asc
    column: 'N',
    order: 'A',
  };

  const { C, O } = sortQuery;


  if (sortq) {
    expression
  }


  const match = sortString.match(/\S=\S/g);
  if (match) {
    match.forEach((m) => {
      const parts = m.split('=');
      const key = parts[0];
      if (key === FANCY_INDEX_SORT.KEY_COLUMN) {
        [, sort.column] = parts;
      }
      else if (key === FANCY_INDEX_SORT.KEY_ORDER) {
        [, sort.order] = parts;
      }
    });
  }

  const sorted = filelist.sort((a, b) => {
    // first list all of the directory
    if (a.isDirectory !== b.isDirectory) {
      return (b.isDirectory | 0) - (a.isDirectory | 0);
    }

    if (sort.column === FANCY_INDEX_SORT.COLUMN_FILE_NAME) {
      if (sort.order === FANCY_INDEX_SORT.ORDER_ASC) {
        if (a.name > b.name) {
          return 1;
        } else if (a.name < b.name) {
          return -1;
        }
        return 0;
      }
    } else if (sort.column === FANCY_INDEX_SORT.COLUMN_FILE_SIZE) {
      return a.size - b.size;
    } else if (sort.column === FANCY_INDEX_SORT.COLUMN_MODIFY_DATE) {
      return a.mtime - b.mtime;
    }
    return 0;
  });

  // build sort data
  const sortdata = {};
  sortdata[FANCY_INDEX_SORT.COLUMN_FILE_NAME] = FANCY_INDEX_SORT.ORDER_ASC;
  sortdata[FANCY_INDEX_SORT.COLUMN_FILE_SIZE] = FANCY_INDEX_SORT.ORDER_ASC;
  sortdata[FANCY_INDEX_SORT.COLUMN_MODIFY_DATE] = FANCY_INDEX_SORT.ORDER_ASC;
  sortdata[sort.column] = (sort.order === FANCY_INDEX_SORT.ORDER_ASC) ? FANCY_INDEX_SORT.ORDER_DESC : FANCY_INDEX_SORT.ORDER_ASC;

  console.log('sortdata', sortdata);

  return {
    sortdata,
    filelist: sorted,
  };
};

const app = new Koa();
app.use(async (ctx, next) => {
  const { path:pth, query } = ctx;
  const filelist = getFileList(pth);

  // console.log('query', ctx.query);

  if (filelist === null) {
    // path not found
    return next();
  }

  const sorted = sortFileList(filelist, query);

  // console.log('filelist', filelist);
  const content = compileIndex(sorted);
  ctx.body = content;
});
app.listen(8181);
