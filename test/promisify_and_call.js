const {expect} = require('chai');
const promisifyAndCall = require('../lib/promisify_and_call');

describe('promisifyAndCall', () => {
  it('Without context', async () => {
    const ret = await promisifyAndCall(null, function(callback) {
      callback(null, 'OK');
    });
    expect(ret).to.be.equal('OK');
  });

  it('With context', async () => {
    const ret = await promisifyAndCall({'ret': 'OK'}, function(callback) {
      callback(null, this.ret); // eslint-disable-line no-invalid-this
    });
    expect(ret).to.be.equal('OK');
  });

  it('With error', async () => {
    let error = null;
    try {
      await promisifyAndCall({'ret': 'OK'}, function(callback) {
        callback('Error');
      });
    } catch (e) {
      error = e;
    }
    expect(error).to.be.equal('Error');
  });
});
