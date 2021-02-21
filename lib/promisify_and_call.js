const util = require('util');

function promisifyAndCall(ctx, func, ...params) {
  return util.promisify(func).apply(ctx, params);
}

module.exports = promisifyAndCall;
