# node-fancy-index

An nginx fancy index like static file server wrote in nodejs.

[![npm version](https://badge.fury.io/js/node-fancy-index.svg)](https://badge.fury.io/js/fancy-index)

## Usage

```
npm install -g fancy-index
```

```
# cd to the folder you want to expose
# export the configuraltion
> fancy-index --defaultConfig > fancy-index.config.js

# edit the config file
> nano fancy-index.config.js

# run the server
> fancy-index
```

## Theme

node-fancy-index is compatiable with the nginx fancy index themes.

The following themes demonstrate the level of customization which can be
achieved using the module:

* [Theme](https://github.com/TheInsomniac/Nginx-Fancyindex-Theme) by
  [@TheInsomniac](https://github.com/TheInsomniac). Uses custom header and
  footer.
* [Theme](https://github.com/Naereen/Nginx-Fancyindex-Theme) by
  [Naereen](https://github.com/Naereen/). Uses custom header and footer, the
  header includes search field to filter by filename using JavaScript.

