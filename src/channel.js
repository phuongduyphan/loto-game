const { generateBoard } = require('./board');
const playerStatus = require('./playerStatus');
const GamePlay = require('./gamePlay');

module.exports = (io) => {
  const gamePlay = new GamePlay(io);

  io.on('connection', (socket) => {

    socket.on('new_player', (player, cb) => {
      const newPlayer = {
        id: socket.id,
        ...player,
        money: 0,
        status: playerStatus.NOT_READY,
      };
      gamePlay.addNewPlayer(newPlayer);

      const returnData = {
        board: generateBoard(),
        player: {
          ...newPlayer,
        },
      };
      cb(returnData);
    });

    socket.on('player_ready', () => {
      gamePlay.updateAndCheckReady(socket.id);
    });

  });
};
