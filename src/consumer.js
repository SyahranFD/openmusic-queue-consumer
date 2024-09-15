require('dotenv').config();
const amqp = require('amqplib');
const SongsPlaylistsService = require('./SongsPlaylistsService');
const MailSender = require('./MailSender');
const Listener = require('./listener');
const config = require('./utils/config');

const init = async () => {
  const songsPlaylistsService = new SongsPlaylistsService();
  const mailSender = new MailSender();
  const listener = new Listener(songsPlaylistsService, mailSender);

  const connection = await amqp.connect(config.rabbitMq.server);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:openmusic', {
    durable: true,
  });

  channel.consume('export:openmusic', listener.listen, { noAck: true });
};

init();
