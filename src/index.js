// @ts-check

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const player1 = 'X';
const player2 = 'O';
const draw = 'D';

/**
 * @param {{ onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; value: React.ReactNode; }} props
 */
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  /**
   * @param {number} i
   */
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
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
        squares: Array(9).fill(null),
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
      if(winner){
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
    if (this.state.winner === player1 || this.state.winner === player2) {
      status = 'Gagnant: ' + (this.state.winner === player2 ? "Flavien" : "Arthur");
    }
    else if (this.state.winner === draw) {
      status = 'Match nul !!!';
    }
    else {
      status = 'Joueur suivant: ' + (this.state.xIsNext ? 'Arthur' : 'Flavien');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
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
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
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
