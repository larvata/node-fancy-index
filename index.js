#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const { argv } = require('yargs');
const express = require('express');

const pkg = require('./package');
console.log(`node-fancy-index ${pkg.version}`);

const createServeIndexMiddleware = require('./middlewares/serve');
const { BASE_CONFIGURATIONS, BASE_CONFIGURATIONS_PATH } = require('./lib/common');
const { loadFileContent } = require('./lib/utils');

if (argv.defaultConfig) {
  const baseConfigsContent = loadFileContent(BASE_CONFIGURATIONS_PATH);
  console.log(baseConfigsContent);
  process.exit();
}

if (argv.v || argv.version) {
  process.exit();
}

const configPath = argv.c || argv.config || 'node-fancy-index.config.js';

const configFullPath = path.join(process.cwd(), configPath);
let userConfigs = null;
if (fs.existsSync(configFullPath)) {
  userConfigs = require(configFullPath);
}

// const mergedConfigs = buildConfigs(userConfigs);
const configs = Object.assign({}, BASE_CONFIGURATIONS, userConfigs);
configs.bind = configs.bind || argv.b || argv.bind;
configs.port = configs.port || argv.p || argv.port;

// const basePath = argv.r || argv.root || '.';

const app = express();
app.use(createServeIndexMiddleware(process.cwd(), configs));
app.listen(configs.port, configs.bind);

console.log(`Configuration loaded: ${configFullPath}`);
console.log('server started at: ', `http://${configs.bind}:${configs.port}`);
