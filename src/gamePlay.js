const _ = require('lodash');

const gameStatus = require('./gameStatus');
const playerStatus = require('./playerStatus');

class GamePlay {
  constructor(io) {
    this.io = io;
    this.players = {};
    this.playerIds = [];
    this.status = gameStatus.PENDING;
    this.listOfNumbers = [];
  }

  addNewPlayer(player) {
    this.playerIds.push(player.id);
    this.players = {
      ...this.players,
      [player.id]: player,
    };
  }

  checkAllReady() {
    return _.every(this.players, { status: playerStatus.READY });
  }

  updateStatus(status) {
    this.status = status;
    if (this.status === gameStatus.START) {
      this.startGame();
    }
  }

  updateAndCheckReady(id) {
    this.players[id].status = playerStatus.READY;
    if (this.checkAllReady()) {
      this.updateStatus(gameStatus.START);
    }
  }
}

module.exports = GamePlay;
