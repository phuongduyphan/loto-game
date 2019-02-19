const _ = require('lodash');

const gameStatus = require('./gameStatus');
const playerStatus = require('./playerStatus');
const appConfig = require('./appConfig');
const { checkPlayerWaitStatus, checkPlayerWinStatus, generateBoard } = require('./board');

class GamePlay {
  constructor(io) {
    this.io = io;
    this.players = {};
    this.playerIds = [];
    this.status = gameStatus.PENDING;
    this.listOfGeneratedNumbers = [];
    this.intervalId = null;
  }

  emitStateChange() {
    const data = {
      players: this.players,
      playerIds: this.playerIds,
      status: this.status,
      listOfGeneratedNumbers: this.listOfGeneratedNumbers,
    };
    this.io.emit('gameplay_update', data);
  }

  addNewPlayer(player) {
    this.playerIds.push(player.id);
    this.players = {
      ...this.players,
      [player.id]: player,
    };
    this.emitStateChange();
  }

  addPlayerBoard(id) {
    const board = generateBoard();
    this.players[id].board = board;

    return board;
  }

  checkAllReady() {
    return _.every(this.players, { status: playerStatus.READY });
  }

  updateAndCheckReady(id) {
    this.players[id].status = playerStatus.READY;
    this.emitStateChange();

    if (this.checkAllReady()) {
      this.updateGameStatus(gameStatus.START);
    }
  }

  updateGameStatus(status) {
    this.status = status;
    this.emitStateChange();

    if (this.status === gameStatus.START) {
      this.startGame();
    }

    if (this.status === gameStatus.PENDING) {
      this.initNewGame();
    }
  }

  startGame() {
    this.intervalId = setInterval(() => {
      const listOfRemainingNumbers = this.getListOfRemainingNumbers();
      const generatedNumber = _.sample(listOfRemainingNumbers);
      this.listOfGeneratedNumbers.push(generatedNumber);

      this.io.emit('new_number', generatedNumber);
    }, 3000);
  }

  initNewGame() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.listOfGeneratedNumbers = [];
    this.emptyPlayerBoard();
    this.status = gameStatus.PENDING;
  }

  emptyPlayerBoard() {
    this.playerIds.forEach((id) => {
      this.players[id].board = null;
    });
  }

  getListOfRemainingNumbers() {
    const listOfRemainingNumbers = [];
    for (let i = 1; i <= appConfig.totalNum; i += 1) {
      listOfRemainingNumbers.push(i);
    }

    return listOfRemainingNumbers.filter(element => (
      !this.listOfGeneratedNumbers.includes(element)
    ));
  }

  updatePlayerBoard(socket, cell) {
    const { id } = socket;
    this.players[id].board[cell.row][cell.col] = cell;

    if (checkPlayerWaitStatus(this.players[id].board)) {
      this.players[id].status = playerStatus.WAIT;
      this.emitStateChange();
    }

    if (checkPlayerWinStatus(this.players[id].board)) {
      this.players[id].status = playerStatus.WIN;
      this.updatePlayerLoseStatus();
      this.updateWinMoney();
      this.emitStateChange();
      this.updateGameStatus(gameStatus.PENDING);
    }
  }

  updatePlayerLoseStatus() {
    this.playerIds.forEach((id) => {
      if (this.players[id].status !== playerStatus.WIN) {
        this.players[id].status = playerStatus.LOSE;
      }
    });
  }

  updateWinMoney() {
    this.playerIds.forEach((id) => {
      if (this.players[id].status === playerStatus.WIN) {
        this.players[id].money += appConfig.betLevel;
      } else {
        this.players[id].money -= appConfig.betLevel;
      }
    });
  }
}

module.exports = GamePlay;
