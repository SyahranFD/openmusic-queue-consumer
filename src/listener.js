const autoBind = require('auto-bind');

class Listener {
  constructor(songsPlaylistsService, mailSender) {
    this._songsPlaylistsService = songsPlaylistsService;
    this._mailSender = mailSender;

    autoBind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());

      const playlistIdValue = playlistId.id;

      const playlist = await this._songsPlaylistsService.getPlaylistById(playlistIdValue);

      const songs = await this._songsPlaylistsService.getSongsFromPlaylist(playlistIdValue);

      const exportData = {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          songs,
        },
      };

      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(exportData));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
