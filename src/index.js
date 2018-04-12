import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = props => {
    return (
      <button className="square" 
      onClick={props.onClick}>
        {props.value}
      </button>
    )
}

class Board extends React.Component {
 
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
       <React.Fragment>
       {this.props.squares.map((square, i) => {
           return this.renderSquare(i)
       })
       }
       </React.Fragment>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          row: null,
          col: null
        }
      ],
      xIsNext: true,
      stepNumber: 0
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0,this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
   
    let row = Math.floor(i / 3) + 1;
    let col = (i % 3) + 1;
    console.log(i, i % 3);
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([
        {
          squares: squares,
          row: row,
          col: col
        }
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);

    const moves = history.map((step, moveNum) => {
      console.log({ step }, { moveNum });
      const desc = moveNum ? `Go to move #${moveNum} Row:${step.row} Col:${step.col}` : 'Go to game start';
      const currentStepClass = moveNum === this.state.stepNumber ? 'currentStep btn-underline' : 'btn-underline';
      return <li key={moveNum}>
          <button className={currentStepClass} onClick={() => this.jumpTo(moveNum)}>
            {desc}
          </button>
        </li>;
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <span className="status">{status}</span>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  calculateWinner(squares) {
    const winningmoves = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < winningmoves.length; i++) {
      const [a, b, c] = winningmoves[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }
}


// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
