const {Client} = require('castv2-client');
const {DefaultMediaReceiver} = require('castv2-client');
const mdns = require('node-dns-sd');
const promisifyAndCall = require('./promisify_and_call.js');

class CastClient {
  static async find(name) {
    const devices = await mdns.discover({
      name: '_googlecast._tcp.local',
      filter: (device) => {
        return device.familyName === name;
      },
    });
    const device = devices[0];
    return new CastClient(device.address, device.service.port);
  }

  constructor(host, port) {
    this._host = host;
    this._port = port;
    this._client = null;
  }

  async connect() {
    if (this._client) {
      return;
    }
    const client = new Client();
    await promisifyAndCall(client, client.connect, {
      host: this._host,
      port: this._port,
    });
    this._client = client;
  }

  async close() {
    if (this._client !== null) {
      this._client.close();
      this.client = null;
    }
  }

  async getStatus() {
    await this.connect();
    const status = await promisifyAndCall(this._client, this._client.getStatus);
    return status;
  }

  async getVolume() {
    const status = await this.getStatus();
    return status.volume.level;
  }

  async setVolume(volume) {
    await promisifyAndCall(
        this._client, this._client.setVolume, {level: volume});
  }

  async play(url) {
    const media = {
      contentId: url,
      contentType: 'audio/mp3',
      streamType: 'BUFFERED',
    };
    await this.connect();
    let playing = false;
    const player = await promisifyAndCall(
        this._client, this._client.launch, DefaultMediaReceiver);
    return new Promise((resolveFunc, rejectFunc) => {
      player.on('status', (status) => {
        if (status.playerState === 'PLAYING') {
          playing = true;
        }
        if (playing && status.playerState === 'IDLE') {
          resolveFunc();
        }
      });
      player.load(media, {autoplay: true}, (err, status) => {
        if (err) {
          rejectFunc(err);
        }
        if (status.playerState === 'PLAYING') {
          playing = true;
        }
      });
    });
  }
}

module.exports = CastClient;
