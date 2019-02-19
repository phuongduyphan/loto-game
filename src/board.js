const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const appConfig = require('./appConfig');

const listOfBoard = [];

fs.readdir(path.join(__dirname, '/boardData'), (err, filenames) => {
  if (err) {
    throw err;
  }
  filenames.forEach((filename) => {
    fs.readFile(path.join(__dirname, `/boardData/${filename}`), 'utf-8', (err1, data) => {
      if (err1) {
        console.log(err1);
        throw err1;
      }

      const arr = data.split(/[\s\n]/);

      let count = 0;
      const board = [];
      for (let i = 0; i < appConfig.row; i += 1) {
        board[i] = [];
        for (let j = 0; j < appConfig.col; j += 1) {
          board[i][j] = {
            num: arr[count] !== '0' ? arr[count] : null,
            open: arr[count] !== '0',
            choosen: false,
            row: i,
            col: j,
          };
          count += 1;
        }
      }
      listOfBoard.push(board);
    });
  });
});

const generateBoard = () => (
  _.sample(listOfBoard)
);

const checkPlayerWaitStatus = (board) => {
  for (let i = 0; i < appConfig.row; i += 1) {
    let count = 0;
    for (let j = 0; j < appConfig.col; j += 1) {
      if (board[i][j].open && board[i][j].choosen) {
        count += 1;
      }
    }
    if (count === appConfig.maxCountRow - 1) {
      return true;
    }
  }
  return false;
};

const checkPlayerWinStatus = (board) => {
  for (let i = 0; i < appConfig.row; i += 1) {
    let count = 0;
    for (let j = 0; j < appConfig.col; j += 1) {
      if (board[i][j].open && board[i][j].choosen) {
        count += 1;
      }
    }
    if (count === appConfig.maxCountRow) {
      return true;
    }
  }
  return false;
};

module.exports = {
  generateBoard,
  checkPlayerWaitStatus,
  checkPlayerWinStatus,
};
