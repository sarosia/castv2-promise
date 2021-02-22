# castv2-promise

[![Build Status][build-image]][build-url]
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

A promisified [castv2-client](https://www.npmjs.com/package/castv2-client) with builtin discovery support.

## Installation

```
npm install castv2-promise
```

## Usage

```js
cosnt CastClient = require('castv2-promise');

const client = await CastClient.find('My Chromecast Device');
await client.play('http://url/to/mp3');
await client.close();
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/castv2-promise.svg
[npm-url]: https://npmjs.org/package/castv2-promise
[downloads-image]: https://img.shields.io/npm/dm/castv2-promise.svg
[downloads-url]: https://npmjs.org/package/castv2-promise
[build-image]: https://github.com/sarosia/castv2-promise/workflows/Node.js%20CI/badge.svg
[build-url]: https://github.com/sarosia/castv2-promise/actions
