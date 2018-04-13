import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = props => {
  let classDesc = 'square';

  if (props.winningInfo && props.winningInfo.includes(props.index)) {
    classDesc = "square winner"
  }

  return (
      <button className={classDesc} 
      onClick={props.onClick}>
        {props.value}
      </button>
  )
}

class Board extends React.Component {
 
  renderSquare(i) {
    return (
      <Square key={i}
        index={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winningInfo={this.props.winningInfo}
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

  restartGame() {
     let newState = { history: [{ squares: Array(9).fill(null), row: null, col: null }], 
                 xIsNext: true, 
                stepNumber: 0 };
     this.setState(newState);
  }

  handleClick(i) {
    const history = this.state.history.slice(0,this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let isThereAWinner = this.calculateWinner(squares).winner;
  
    if (isThereAWinner || squares[i]) {
      return;
    }
   
    let row = Math.floor(i / 3) + 1;
    let col = (i % 3) + 1;

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
    const winningInfo = this.calculateWinner(current.squares);

    const moves = history.map((step, moveNum) => {
    const desc = moveNum ? `Go to move #${moveNum} Row:${step.row} Col:${step.col}` : 'Go to game beginning';
    const currentStepClass = moveNum === this.state.stepNumber ? 'currentStep btn-underline' : 'btn-underline';
    return <li key={moveNum}>
          <button className={currentStepClass} onClick={() => this.jumpTo(moveNum)}>
            {desc}
          </button>
        </li>;
    });

    let status;
    let winner = winningInfo.winner;
    if (winner) {
      status = 'Winner: ' + winningInfo.winner;
    } else if (!winner && this.state.history.length === 10) {
      status = 'The game is a draw: there is no winner';
    } else {
      status = 'Current player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return <div className="game">
        <div className="game-board">
          <Board squares={current.squares} winningInfo={winningInfo.winningMoves} onClick={i => this.handleClick(i)} />
          <span className="status">{status}</span>
        </div>
        <div className="game-info">
          <button className="restart" onClick={() => this.restartGame()}>
            Restart Game
          </button>
          <ol>{moves}</ol>
        </div>
      </div>;
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  calculateWinner(squares) {
    const winningMoves = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < winningMoves.length; i++) {
      const [a, b, c] = winningMoves[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return {
                winningMoves: winningMoves[i],
                winner: squares[a]
              };
      }
    }
    return {winningMoves: null, winner: null};
  }
}


// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
