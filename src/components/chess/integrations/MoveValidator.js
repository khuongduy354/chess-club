import React from "react";
import Chess from "chess.js";
import Chessboard from "chessboardjsx";
import { useState, useEffect } from "react";
// position,
// onDrop,  check valid and fetch

// onMouseOverSquare,  predict
// onMouseOutSquare,   remove the predict highlight
// squareStyles,   store the styles
// onSquareClick,  click highhight and check move if click
const MoveValidator = ({ player, socket, roomName, doStart }) => {
  // states
  const [chessGame, setChessGame] = useState(new Chess());
  const [fen, setFen] = useState("start");
  const [history, setHistory] = useState([]);
  const [pieceSquare, setPieceSquare] = useState(""); //the square of the selected piece
  const [squareStyles, setSquareStyles] = useState({}); //styles for squares
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  useEffect(() => {
    setHistory([]);
  }, [doStart]);
  useEffect(() => {
    socket.on("update-game", (newFen) => {
      setFen(newFen);
      setChessGame(new Chess(newFen));
    });
    return () => {
      socket.removeListener("update-game");
    };
  }, [fen, chessGame]);
  useEffect(() => {
    setIsPlayerTurn(
      chessGame.fen()[chessGame.fen().indexOf(" ") + 1] ===
        (player === "black" ? "b" : "w")
    );
  }, [chessGame, player]);
  useEffect(() => {
    if (!player) return;
    if (chessGame.in_checkmate()) {
      const lostSide = chessGame.fen()[chessGame.fen().indexOf(" ") + 1];
      return socket.emit("checkmated", lostSide, roomName);
    }
    if (chessGame.in_draw()) return socket.emit("draw", roomName);
  }, [chessGame]);

  if (!doStart) return <Chessboard position="start" />;
  // functions
  const pieceAndHistorySquareStyling = ({ pieceSquare, history }) => {
    const sourceSquare = history.length && history[history.length - 1].from;
    const targetSquare = history.length && history[history.length - 1].to;

    return {
      [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
      ...(history.length && {
        [sourceSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)",
        },
      }),
      ...(history.length && {
        [targetSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)",
        },
      }),
    };
  };

  const highlighSquare = (sourceSquare, squaresToHighlight) => {
    const highlightStyle = [...squaresToHighlight].reduce((sum, el) => {
      return {
        ...sum,
        [el]: {
          width: "20px",
          height: "20px",
          margin: "auto",
          background: "#AEB187",
          borderRadius: "50%",
        },
        ...pieceAndHistorySquareStyling({
          piece: pieceSquare,
          history: history,
        }),
      };
    }, {});
    setSquareStyles({
      ...squareStyles,
      ...highlightStyle,
    });
  };

  const removeHighlightSquare = () => {
    setSquareStyles(pieceAndHistorySquareStyling({ pieceSquare, history }));
  };

  // callback functions
  const onDrop = ({ sourceSquare, targetSquare }) => {
    //emit socket
    if (player && isPlayerTurn) {
      let move = chessGame.move({
        from: sourceSquare,
        to: targetSquare,
      });
      if (!move) return;
      socket.emit("move", chessGame.fen(), roomName, ({ error }) => {
        if (error) return alert(error);
      });
      socket.emit("send-time", "pause", player, roomName);
      socket.emit(
        "send-time",
        "resume",
        player === "black" ? "white" : "black",
        roomName
      );
    }
    setFen(chessGame.fen());
    setHistory(chessGame.history({ verbose: true }));
    setPieceSquare("");
  };
  const onMouseOverSquare = (square) => {
    const moves = chessGame.moves({ square: square, verbose: true });
    if (!moves || !isPlayerTurn) return;
    let highlightSquares = [];
    for (let i = 0; i < moves.length; i++) {
      highlightSquares.push(moves[i].to);
    }
    highlighSquare(square, highlightSquares);
  };

  const onMouseOutSquare = () => {
    removeHighlightSquare();
  };
  const onSquareClick = (square) => {
    setSquareStyles(
      pieceAndHistorySquareStyling({
        pieceSquare: square,
        history: history,
      })
    );
    setPieceSquare(square);
    // Check draw or checkmated?
    if (player && isPlayerTurn) {
      const moves = chessGame.move({ from: pieceSquare, to: square });
      if (!moves) return;
      socket.emit("move", chessGame.fen(), roomName, ({ error }) => {
        if (error) return alert(error);
      });
      socket.emit("send-time", "pause", player, roomName);
      socket.emit(
        "send-time",
        "resume",
        player === "black" ? "white" : "black",
        roomName
      );
    }
    setFen(chessGame.fen());
    setHistory(chessGame.history({ verbose: true }));
    setPieceSquare("");
  };
  return (
    <Chessboard
      squareStyles={squareStyles}
      position={doStart ? fen : "start"}
      onDrop={onDrop}
      onMouseOverSquare={onMouseOverSquare}
      onMouseOutSquare={onMouseOutSquare}
      onSquareClick={onSquareClick}
      boardStyle={{
        borderRadius: "5px",
        boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
      }}
    />
  );
};

export default MoveValidator;
