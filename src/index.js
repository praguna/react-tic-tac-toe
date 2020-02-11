import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props){
    return (
        <button className={"square " + (props.name?props.name : "")} onClick = {props.onClick}>
            {props.value}
        </button>
    );
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
    let isFill = true;
    for(let i=0 ;i<3 ;i++){
      for(let j=0;j<lines[i].length;j++) 
        if(squares[lines[i][j]] === null) isFill = false
    }
    if(isFill) return ["Draw", null];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a], lines[i]];
      }
    }
    return [null,null];
  }

  class Board extends React.Component {

    handleClick(i){
        const squares = this.state.squares.slice();
        const [winner, places] = calculateWinner(squares)
        if(winner || squares[i]) return;
        squares[i] = this.state.xisNext ?'X' : 'O';
        this.setState({squares:squares, xisNext : !this.state.xisNext});
    }

    renderSquare(i) {
      let squares = this.props.winner_squares
      return (<Square key={i} value = {this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}  name = {squares && squares.includes(i)?"winner":null}/>);
    }
  
    render() {
      const board = [0,1,2].map((i)=>{
          return(
            <div key= {i} className="board-row">
            {[0,1,2].map(j => {
              return this.renderSquare(3*i + j)
            })}
            </div>
          );
      });
      return (
        <div> 
         {board}
        </div>
      );
    }
  }
  
  class Game extends React.Component {

    constructor(props){
        super(props);
        this.state={
            history : [{
                squares : Array(9).fill(null),
                move : Array(2).fill(null),
            }],
            xisNext : true,
            stepNumber : 0,
            sort : true,
        }
    }

    handleClick(i){
        const history = this.state.history.slice(0 , this.state.stepNumber+1);
        const current = history[history.length - 1].squares
        const squares = current.slice();
        const [winner , places] = calculateWinner(squares);
        if(winner || squares[i]) return;
        squares[i] = this.state.xisNext ?'X' : 'O';
        const row = ((i+1) % 3 === 0)? Math.floor( (i+1) / 3) : Math.floor((i+1) / 3) + 1;
        const col =  i%3 + 1 
        this.setState({
            history : history.concat({squares : squares, move : [row,col],}), 
            stepNumber : this.state.stepNumber + 1,
            xisNext : !this.state.xisNext,
            });
    }    
    
    jumpTo(step){
        this.setState({
            stepNumber : step,
            xisNext : (step % 2) === 0
        })
    }

    sort_moves(){
        this.setState({sort : !this.state.sort});
    }

    render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const [winner , places] = calculateWinner(current.squares);
    let list = [...Array(this.state.stepNumber+1).keys()]
    list = this.state.sort? list : list.reverse();
    const moves_ = list.map((move)=>{
      const player = (move % 2 === 0)? 'X' : 'O';
      let step  = this.state.history[move];
      const desc = move ? 
        'Go to move #'+move+'\t=>\t '+player+' ('+step.move[0]+','+step.move[1]+')' : 'Go to game start'
      return (
        <li key = {move}>
            <button className={this.state.stepNumber === move?"bolden": ""} onClick = {()=>this.jumpTo(move)}>{desc}</button>
        </li>
    );  
    })

    let status;
    if(winner === "Draw")
        status = "Game is Drawn"; 
      else if(winner === "X" || winner === "O") 
        status = 'Winner : ' + winner
      else
        status = 'Next player: ' + (this.state.xisNext? 'X' : 'O');
      return (
        <div className="game">
          <div className="game-board">
          <h4>
          <u>Tic-Tac-Toe in React</u>
          </h4>
            <Board 
                squares = {current.squares}
                onClick = {(i)=>this.handleClick(i)}
                winner_squares = {places}
            />
          </div>
          <div className="game-info">
            <button onClick = {()=>{this.sort_moves()}}>Sort</button>
            <div>{status}</div>
            <ol>{moves_}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  