import React, { Component } from "react";
import Chessboard from "chessboardjsx";

import StockFish from "./integrations/Stockfish";

class Demo extends Component {
  render() {
    return (
      <div style={boardsContainer}>
        <StockFish playerColor={this.props.playerColor}>
          {({ position, onDrop }) => (
            <Chessboard
              id="stockfish"
              position={position}
              width={320}
              onDrop={onDrop}
              boardStyle={boardStyle}
              orientation={this.props.playerColor}
            />
          )}
        </StockFish>
      </div>
    );
  }
}

export default Demo;

const boardsContainer = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
};
const boardStyle = {
  borderRadius: "5px",
  boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
};
