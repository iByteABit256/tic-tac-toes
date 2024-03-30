import { useState, useEffect } from "react";
import { getUnfinishedBoards } from "./utils";
import { makeAIMove, simulateMove } from "./ai/ai";
import About from "./about/about";
import ScoreBoard from "./scoreboard/scoreboard";
import Board from "./board/board";
import StartScreen from "./startpage/startpage";
import EndScreen from "./endgame/endgame";
import Peer from "peerjs";

export class GameStartProperties {
  computerOpponentModeEnabled;
  playerSymbol;
  opponentSymbol;
  difficulty;
  online;
  joinId;

  constructor(
    computerOpponentModeEnabled,
    playerSymbol,
    opponentSymbol,
    difficulty,
    online = false,
    joinId = null,
  ) {
    this.computerOpponentModeEnabled = computerOpponentModeEnabled;
    this.playerSymbol = playerSymbol;
    this.opponentSymbol = opponentSymbol;
    this.difficulty = difficulty;
    this.online = online;
    this.joinId = joinId;
  }
}

export default function Game() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState("X");
  const [opponentSymbol, setOpponentSymbol] = useState("O");

  // AI
  const [difficulty, setDifficulty] = useState(5);
  const [computerOpponentModeEnabled, setComputerOpponentModeEnabled] =
    useState(false);

  const [turn, setTurn] = useState(0);
  const [boards, setBoards] = useState(Array(9).fill(Array(9).fill(null)));
  const [activeBoards, setActiveBoards] = useState(
    new Set([...Array(9).keys()]),
  );
  const [gamesEnded, setGamesEnded] = useState(new Set());
  const [scores, setScores] = useState(
    new Map([
      ["X", 0],
      ["O", 0],
    ]),
  );

  const [soundEnabled, setSoundEnabled] = useState(true);

  // online
  const [online, setOnline] = useState(false);
  const [joinId, setJoinId] = useState(null);
  const [receivedOnlineMove, setReceivedOnlineMove] = useState(null);

  // peerjs
  const [peer, setPeer] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [peerId, setPeerId] = useState(null);

  // Called by startpage to begin the game
  function onGameStarted(props) {
    if (props.online) {
      setupPtPConection(props);
    }
    // Computer opponent
    else if (props.computerOpponentModeEnabled) {
      setPlayerSymbol(props.playerSymbol);
      setOpponentSymbol(props.opponentSymbol);
      setDifficulty(props.difficulty);
      setComputerOpponentModeEnabled(props.computerOpponentModeEnabled);
      setGameStarted(true);
    }
    // Local multiplayer
    else {
      setGameStarted(true);
    }
  }

  function setupPtPConection(props) {
    // State variables for online mode
    setOnline(true);
    setJoinId(props.joinId);
    setPlayerSymbol(props.playerSymbol);
    setOpponentSymbol(props.opponentSymbol);

    // Create peer connection
    var tempPeer = new Peer();
    setPeer(tempPeer);

    tempPeer.on("open", (id) => {
      console.log("Peer ID: " + id);
      setPeerId(id);

      // Join game
      if (props.joinId != null) {
        console.log(`connecting to opponent with ID: ${props.joinId}...`);

        var conn = tempPeer.connect(props.joinId);

        // Connected to peer
        conn.on("open", () => {
          console.log("connected to opponent with ID: " + conn.peer);
          setPeerConnection(conn);
          setupListener(conn);
          setGameStarted(true);
        });

        // Handle errors during connection
        conn.on("error", (err) => {
          console.warn("Error connecting to peer:", err.message);
          console.warn(
            `Cannot connect to peer with join ID: ${props.joinId}. Maybe the ID wasn't typed correctly?`,
          );
        });
      }
      // Create game
      else {
        setGameStarted(true);

        console.log("waiting for opponent...");
        tempPeer.on("connection", function (conn) {
          console.log("connected to opponent with ID: " + conn.peer);
          setPeerConnection(conn);
          setupListener(conn);
        });
      }
    });
  }

  function setupListener(conn) {
    conn.on("data", function (data) {
      const [boardNum, squareChanged] = JSON.parse(data);
      setReceivedOnlineMove([boardNum, squareChanged]);
    });
  }

  useEffect(() => {
    if (receivedOnlineMove != null) {
      simulateMove(receivedOnlineMove);
    }
  }, [receivedOnlineMove]);

  function onSoundButtonClick() {
    setSoundEnabled(!soundEnabled);
  }

  function isItMyTurn(playerSymbol) {
    return joinId == null || playerSymbol === "X"
      ? turn % 2 === 0
      : turn % 2 === 1;
  }

  function shouldPlaySound() {
    // Sound must be enabled, it should be the player's turn,
    // and if online, it should be disabled until the game starts
    return (
      soundEnabled && isItMyTurn(playerSymbol) && (!online || peerConnection)
    );
  }

  // Resets state variables to initial values
  function resetState() {
    setTurn(0);
    setBoards(Array(9).fill(Array(9).fill(null)));
    setActiveBoards(new Set([...Array(9).keys()]));
    setGamesEnded(new Set());
    setScores(
      new Map([
        ["X", 0],
        ["O", 0],
      ]),
    );
    setGameStarted(false);
    setGameOver(false);
    setComputerOpponentModeEnabled(false);
    setPlayerSymbol("X");
    setOpponentSymbol("O");
    setDifficulty(5);
  }

  useEffect(() => {
    // X always plays first
    const isAiTurn = playerSymbol === "X" ? turn % 2 === 1 : turn % 2 === 0;

    // AI's turn
    if (computerOpponentModeEnabled && isAiTurn && !gameOver) {
      const aiMove = makeAIMove(
        playerSymbol,
        opponentSymbol,
        boards,
        activeBoards,
        difficulty,
      );
      simulateMove(aiMove);
    }
  }, [gameStarted, turn, boards, activeBoards]);

  // Handles a player move
  function handlePlay(boardNum, nextSquares, squareChanged) {
    // online and no connection
    if (online && !peerConnection) {
      return;
    }

    // send move to opponent
    if (online && peerConnection && isItMyTurn(playerSymbol)) {
      peerConnection.send(JSON.stringify([boardNum, squareChanged]));
    }

    const nextBoards = boards.slice();
    nextBoards[boardNum] = nextSquares;
    setBoards(nextBoards);
    setTurn(turn + 1);
    setReceivedOnlineMove(null);

    const unfinishedBoards = getUnfinishedBoards(gamesEnded);

    // Game has ended
    if (online && peerConnection && unfinishedBoards.size === 0) {
      peerConnection.close();
      setPeerConnection(null);
      setJoinId(null);
      setOnline(false);
    }

    if (unfinishedBoards.size === 0) {
      setGameOver(true);
    }

    // If next board has ended, start on any unfinished board
    if (gamesEnded.has(squareChanged)) {
      setActiveBoards(unfinishedBoards);
    } else {
      setActiveBoards(new Set([squareChanged]));
    }
  }

  // Gets called whenever the score needs to be changed
  function handleScoreChange(boardIdx, changes) {
    changes.forEach((player) => {
      scores.set(player, scores.get(player) + 1);
    });
    setScores(scores);

    gamesEnded.add(boardIdx);
    setGamesEnded(gamesEnded);
  }

  const gameRows = [];

  for (let i = 0; i < 3; i++) {
    const gameRow = [];

    for (let j = 0; j < 3; j++) {
      const boardIdx = i * 3 + j;

      gameRow.push(
        <div className="game-board">
          <Board
            key={`game-board-${boardIdx}`}
            turn={turn}
            boardNum={boardIdx}
            squares={boards[boardIdx]}
            onPlay={handlePlay}
            isActive={activeBoards.has(boardIdx)}
            onScoreChange={handleScoreChange}
            soundEnabled={shouldPlaySound()}
            isItMyTurn={isItMyTurn(playerSymbol)}
            onlineMode={online}
            receivedOnlineMove={receivedOnlineMove}
          />
        </div>,
      );
    }
    gameRows.push(
      <div key={`game-row-${i}`} className="game-row">
        {gameRow}
      </div>,
    );
  }

  return (
    <div key="Game" className="game">
      <a
        href="https://github.com/iByteABit256/tic-tac-toes"
        className="github-link"
      />
      <About />
      {!gameStarted && <StartScreen onStart={onGameStarted} />}
      {gameStarted && !gameOver && (
        <>
          <button
            className={soundEnabled ? "sound-on" : "sound-off"}
            onClick={onSoundButtonClick}
          />
          {online && (
            <div className="online-info">
              <p onClick={() => navigator.clipboard.writeText(peerId)}>
                Your ID: {peerId}
              </p>
              {peerConnection &&
                (isItMyTurn(playerSymbol) ? (
                  <p>{`Your (${playerSymbol}) turn`}</p>
                ) : (
                  <p>{`Opponent's (${opponentSymbol}) turn`}</p>
                ))}
              {!peerConnection && <p>Waiting for opponent...</p>}
            </div>
          )}

          <ScoreBoard scores={scores} />
          {gameRows}
        </>
      )}
      {gameOver && <EndScreen scores={scores} onRestart={resetState} />}
    </div>
  );
}
