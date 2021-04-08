const {expect} = require('chai');
const {Client} = require('castv2-client');
const CastClient = require('../lib/cast_client');
const sinon = require('sinon');

describe('CastClient', () => {
  const connectStub = sinon.stub(Client.prototype, 'connect');
  const onStub = sinon.stub(Client.prototype, 'on');

  it('connect', async () => {
    connectStub.callsFake((options, callback) => {
      callback();
    });
    const castClient = new CastClient();
    await castClient.connect();
    connectStub.reset();
  });

  it('connect timeout', async () => {
    connectStub.callsFake((options, callback) => {
    });
    onStub.callsFake((event, callback) => {
      if (event == 'error') {
        callback(new Error('Timeout'));
      }
    });
    const castClient = new CastClient();
    try {
      await castClient.connect();
    } catch (e) {
      expect(e.message).to.be.equal('Timeout');
      return;
    }
    throw new Error('Error should be thrown.');
  });
});
