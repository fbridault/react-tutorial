// @ts-check

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const player1 = 'X';
const player2 = 'O';
const draw = 'D';
const size = 3;

/**
 * @param {{ onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; value: React.ReactNode; }} props
 */
function Square(props) {
  let style = props.win ? "square-win" : "square";
  return (
    <button className={style} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Row extends React.Component {

  /**x
   * @param {number} i
   */
  renderSquare(i) {
    let win = false;
    if (this.props.winner) {
      if (this.props.winner.includes(i)) {
        win = true;
      }
    }

    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        win={win}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render() {
    return (
      <div className="board-row">
        {[...Array(size)].map((x, i) =>
          this.renderSquare(this.props.id * size + i)
        )}
      </div>
    );
  }
}

class Board extends React.Component {


  render() {
    return (
      <div>
        {[...Array(size)].map((x, i) =>
          <div key={i} className="board-row">
            <Row key={i} id={i} squares={this.props.squares} winner={this.props.winner} onClick={this.props.onClick} />
          </div>
        )}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(size * size).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      winner: null
    }
  }

  /**
   * @param {number} step
   */
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      winner: null
    });
  }

  reset() {
    this.setState({
      history: [{
        squares: Array(size * size).fill(null),
      }],
      xIsNext: !this.state.xIsNext,
      winner: null,
      stepNumber: 0
    })
  }

  /**
   * @param {number} i
   */
  handleClick(i) {
    if (this.state.winner) {
      return;
    }
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (squares[i] === null) {
      squares[i] = this.state.xIsNext ? player1 : player2;
      const winner = calculateWinner(squares);
      if (winner) {
        /** Prevent rolling back when someone wins */
      }

      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
        winner: winner
      });
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}
          </button>
        </li>
      )
    })
    let status;
    if (this.state.winner) {
      let winner = current.squares[this.state.winner[0]];
      if (winner === player1 || winner === player2) {
        status = 'Gagnant: ' + (winner === player2 ? "Flavien" : "Léonard");
      }
      else if (winner === draw) {
        status = 'Match nul !!!';
      }
    }
    else {
      status = 'Joueur suivant: ' + (this.state.xIsNext ? 'Léonard' : 'Flavien');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winner={this.state.winner}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <button onClick={() => this.reset()}>Start new game</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function isDraw(squares) {

  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      return false;
    }
  }
  return true;
}

function calculateWinner(squares) {

  let lines = [];

  for (let i = 0; i < size; i++) {
    let row = [];
    let col = [];
    for (let j = 0; j < size; j++) {
      row.push(i * size + j);
      col.push(size * j + i)
    }
    lines.push(row);
    lines.push(col);
  }

  let diag = [], diag2 = [];
  for (let k = 0; k < size; k++) {
    diag.push(k * size + k);
    diag2.push(size - 1 + (k * size) - k);
  }
  lines.push(diag);
  lines.push(diag2);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (squares[line[0]]) {
      let win = true;
      for (let k = 0; k < line.length - 1; k++) {
        if (squares[line[k]] !== squares[line[k + 1]]) {
          win = false;
          break;
        }
      }
      if (win) {
        return line;
      }
    }
  }
  if (isDraw(squares)) {
    return draw;
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
