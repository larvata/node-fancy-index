const fs = require('fs');
const pug = require('pug');

const { FANCY_INDEX_SORT, TEMPLATE_FILE } = require('./common');

const compileIndexBody = pug.compileFile(TEMPLATE_FILE.BODY);

const prettyFileSize = (sizeInByte) => {
  const units = ['KB', 'MB', 'GB', 'TB', 'PB'];
  let size = sizeInByte;
  let unit = '';
  while (size > 1024) {
    size = size / 1024;
    unit = units.shift();
  }
  return (`${size.toFixed(2)} ${unit}`).replace(/\.00\s$/, '');
};

const dateLeftPadding = (num) => {
  return num.toString().replace(/^\d$/, n => `0${n}`);
};

const dateFormat = (d, format) => {
  const day = d.getDay();
  const month = d.getMonth();
  const date = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  const year = d.getFullYear();
  const pa = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day];
  const pA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
  const pb = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month];
  const pB = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month];
  const pd = dateLeftPadding(date);
  const pe = pd.replace(/^0/, ' ');
  const pF = '%Y-%m-%d';
  const pk = hours;
  const pl = hours > 12 ? hours - 12 : hours;
  const pH = dateLeftPadding(pk);
  const pI = dateLeftPadding(pl);
  const pm = dateLeftPadding(month + 1);
  const pM = dateLeftPadding(minutes);
  const pp = hours > 12 ? 'PM' : 'AM';
  const pP = pp.toLowerCase();
  const pr = '%I:%M:%S %p';
  const pR = '%H:%M';
  const pS = dateLeftPadding(seconds);
  const pT = '%H:%M:%S';
  const pu = day + 1;
  const pw = day;
  const py = year.toString().substr(0, 2);
  const pY = year;

  const result = format
    .replace('%F', pF)
    .replace('%r', pr)
    .replace('%R', pR)
    .replace('%T', pT)
    .replace('%a', pa)
    .replace('%A', pA)
    .replace('%b', pb)
    .replace('%B', pB)
    .replace('%d', pd)
    .replace('%e', pe)
    .replace('%k', pk)
    .replace('%l', pl)
    .replace('%H', pH)
    .replace('%I', pI)
    .replace('%m', pm)
    .replace('%M', pM)
    .replace('%p', pp)
    .replace('%P', pP)
    .replace('%S', pS)
    .replace('%u', pu)
    .replace('%w', pw)
    .replace('%y', py)
    .replace('%Y', pY);

  return result;
};

const buildSortOptions = (defaultSort, query) => {
  let sort = {
    column: FANCY_INDEX_SORT.COLUMN_FILE_NAME,
    order: FANCY_INDEX_SORT.ORDER_ASC,
  };

  switch (defaultSort) {
    case 'name_desc':
      sort = {
        column: FANCY_INDEX_SORT.COLUMN_FILE_NAME,
        order: FANCY_INDEX_SORT.ORDER_DESC,
      };
      break;
    case 'size':
      sort = {
        column: FANCY_INDEX_SORT.COLUMN_FILE_SIZE,
        order: FANCY_INDEX_SORT.ORDER_ASC,
      };
      break;
    case 'size_desc':
      sort = {
        column: FANCY_INDEX_SORT.COLUMN_FILE_SIZE,
        order: FANCY_INDEX_SORT.ORDER_DESC,
      };
      break;
    case 'date':
      sort = {
        column: FANCY_INDEX_SORT.COLUMN_MODIFY_DATE,
        order: FANCY_INDEX_SORT.ORDER_ASC,
      };
      break;
    case 'date_desc':
      sort = {
        column: FANCY_INDEX_SORT.COLUMN_MODIFY_DATE,
        order: FANCY_INDEX_SORT.ORDER_DESC,
      };
      break;
    case 'name':
    default:
      break;
  }

  if (query) {
    const { C, O } = query;
    if (C && O) {
      sort.column = C;
      sort.order = O;
    }
  }

  // build sort data
  const sort_full = {};
  sort_full[FANCY_INDEX_SORT.COLUMN_FILE_NAME] = null;
  sort_full[FANCY_INDEX_SORT.COLUMN_FILE_SIZE] = null;
  sort_full[FANCY_INDEX_SORT.COLUMN_MODIFY_DATE] = null;
  sort_full[sort.column] =
    (sort.order === FANCY_INDEX_SORT.ORDER_ASC)
    ? FANCY_INDEX_SORT.ORDER_DESC
    : FANCY_INDEX_SORT.ORDER_ASC;

  return {
    sort,
    sort_full,
  };
};

const loadFileContent = (filePath, defaultFilePath) => {
  let file = filePath;
  const isExist = fs.existsSync(filePath);
  if (!isExist) {
    file = defaultFilePath;
  }

  const content = fs.readFileSync(file, 'utf8');
  return content;
};

const composeIndexHtml = (configs, renderData) => {
  const bodyContent = compileIndexBody(renderData);

  // load header and footer
  const { footer, header } = configs;
  const headerContent = loadFileContent(`.${header}`, TEMPLATE_FILE.HEADER);
  const footerContent = loadFileContent(`.${footer}`, TEMPLATE_FILE.FOOTER);

  const _footerContent = footerContent.replace('</body>', '<footer>Powered by <a href="https://github.com/larvata/node-fancy-index">node-fancy-index</a></footer></body>');

  const _bodyContent = bodyContent.replace(/^<h1>/, '');
  const context = headerContent + _bodyContent + _footerContent;
  return context;
};

module.exports = {
  buildSortOptions,
  prettyFileSize,
  dateFormat,
  composeIndexHtml,
  loadFileContent,
};
