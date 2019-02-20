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
      cb(newPlayer);
    });

    socket.on('gameplay_update', () => {
      gamePlay.emitStateChange();
    });

    socket.on('init_board', (cb) => {
      const board = gamePlay.addPlayerBoard(socket.id);
      cb(board);
    });

    socket.on('player_ready', () => {
      gamePlay.updateAndCheckReady(socket.id);
    });

    socket.on('click', (cell) => {
      gamePlay.updatePlayerBoard(socket, cell);
    });

    socket.on('stop_game', () => {
      gamePlay.initNewGame();
      gamePlay.emitStateChange();
    });

    socket.on('disconnect', () => {
      gamePlay.removePlayer(socket.id);
    });

  });
};
