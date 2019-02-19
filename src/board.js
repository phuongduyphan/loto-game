function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

module.exports.generateBoard = () => {

  const data = [];
  for (let i = 1; i <= 90; i++) {
    data.push(i);
  }

  shuffle(data);

  const col = 9, row = 9;
  let board = [];
  for (let i = 0; i < col; i++) {
    board[i] = [];
    for (let j = 0; j < row; j++) {
      board[i][j] = {
        num: data[data.length - 1],
        open: true,
        choosen: false,
        col: i,
        row: j,
      }
      data.pop();
    }
  }
  return board;
};
