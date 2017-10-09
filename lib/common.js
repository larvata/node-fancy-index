const path = require('path');

const FANCY_INDEX_SORT = {
  COLUMN_FILE_NAME: 'N',
  COLUMN_FILE_SIZE: 'S',
  COLUMN_MODIFY_DATE: 'M',
  ORDER_ASC: 'A',
  ORDER_DESC: 'D',

  KEY_COLUMN: 'C',
  KEY_ORDER: 'O',
};

const TEMPLATE_FILE = {
  HEADER: path.join(__dirname, '../views/header.html'),
  BODY: path.join(__dirname, '../views/body.pug'),
  FOOTER: path.join(__dirname, '../views/footer.html'),
};

const BASE_CONFIGURATIONS_PATH = path.join(__dirname, '../configs.default.js');
const BASE_CONFIGURATIONS = require(BASE_CONFIGURATIONS_PATH);

module.exports = {
  FANCY_INDEX_SORT,
  TEMPLATE_FILE,
  BASE_CONFIGURATIONS,
  BASE_CONFIGURATIONS_PATH,
};
