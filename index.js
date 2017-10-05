#!/usr/bin/env node

const { argv } = require('yargs');
const Koa = require('koa');
const createServeIndexMiddleware = require('./middlewares/serve');

const bind = argv.b || argv.bind || '127.0.0.1';
const port = argv.p || argv.port || 8080;
const basePath = argv.r || argv.root || '.';
const configPath = argv.c || argv.config || './config.js';

const userConfigs = require(`${__dirname}/${configPath}`);

const app = new Koa();
app.use(createServeIndexMiddleware(basePath, userConfigs));
app.listen(port, bind);
console.log('server started at: ', `http://${bind}:${port}`);
