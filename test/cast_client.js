const {expect} = require('chai');
const {Client} = require('castv2-client');
const CastClient = require('../lib/cast_client');
const mdns = require('node-dns-sd');
const sinon = require('sinon');

describe('CastClient', () => {
  const connectStub = sinon.stub(Client.prototype, 'connect');
  const onStub = sinon.stub(Client.prototype, 'on');
  const onDiscover = sinon.stub(mdns, 'discover');

  it('discover', async () => {
    onDiscover.callsFake(() => {
      return [{address: '1.1.1.1', service: {port: 12345}}];
    });
    const client = await CastClient.find('my_device');
    expect(client).to.not.equal(null);
  });

  it('discover no devices found', async () => {
    onDiscover.callsFake(() => {
      return [];
    });
    try {
      await CastClient.find('my_device');
    } catch (e) {
      expect(e.message).to.be.equal(
          'Cannot find any devices matching the name: my_device');
      return;
    }
    throw new Error('Error should be thrown.');
  });

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
