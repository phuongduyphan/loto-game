const { generateBoard } = require('./board');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.emit('init_board', generateBoard());
  });
};
