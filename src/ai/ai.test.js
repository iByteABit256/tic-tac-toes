import { calculateBestMove } from "./ai";

// Mock logging
beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});

// Mock data for testing
const mockBoards = [
  ["O", "O", null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, "X", null, null, null, "X"],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
];
const mockActiveBoards = new Set([0]); // Assuming the first board is active

describe("calculateBestMove", () => {
  it("should return a valid move", () => {
    const move = calculateBestMove(
      "X",
      "O",
      mockBoards,
      mockActiveBoards,
      true,
      0,
      2,
    );

    // Ensure that the move is an array with two elements: [boardIndex, squareIndex]
    expect(Array.isArray(move)).toBe(true);
    expect(move.length).toBe(2);

    // Ensure that the board index and square index are within valid ranges
    expect(move[0]).toBeGreaterThanOrEqual(0);
    expect(move[0]).toBeLessThan(mockBoards.length);
    expect(move[1]).toBeGreaterThanOrEqual(0);
    expect(move[1]).toBeLessThan(9);
  });

  it("should choose a move that wins a board", () => {
    const move = calculateBestMove(
      "X",
      "O",
      mockBoards,
      mockActiveBoards,
      true,
      0,
      2,
    );
    expect(move).toEqual([0, 2]);
  });

  it("should choose a move that wins the game", () => {
    const mockBoards = [
      ["X", "O", "X", "X", "O", "O", null, "X", "O"],
      ["X", "O", "X", "X", "O", "O", "X", "X", "O"],
      ["X", "O", "X", "X", "O", "O", "X", "X", "O"],
      ["X", "O", "X", "X", "O", "O", "X", "X", "O"],
      ["X", "O", "X", "X", "O", "O", "X", "X", "O"],
      ["X", "O", "X", "X", "O", "O", "X", "X", "O"],
      ["X", "O", "X", "X", "O", "O", "X", "X", "O"],
      ["X", "O", "X", "X", "O", "O", "X", "X", "O"],
      ["X", "O", "X", "X", "O", "O", "X", "X", "O"],
    ];
    const mockActiveBoards = new Set([0]);

    const move = calculateBestMove(
      "X",
      "O",
      mockBoards,
      mockActiveBoards,
      true,
      0,
      2,
    );
    expect(move).toEqual([0, 6]);
  });

  it("should block a move that would win the game", () => {
    const mockBoards = [
      ["X", "O", "X", null, "X", "O", null, null, "O"],
      ["X", "O", "X", "X", "O", "O", "X", "X", "O"],
      ["X", "O", "X", "X", "O", "O", "X", "X", "O"],
      ["X", "O", "X", "X", "O", "O", "X", "X", "O"],
      ["X", "O", "X", "X", "O", "O", "X", "X", "O"],
      ["X", "O", "X", "X", "O", "O", "X", "X", "O"],
      ["X", "O", "X", "X", "O", "O", "X", "X", "O"],
      ["X", "O", "X", "X", "O", "O", "X", "X", "O"],
      ["X", "O", "X", "X", "O", "O", "X", "X", "O"],
    ];
    const mockActiveBoards = new Set([0]);

    const move = calculateBestMove(
      "X",
      "O",
      mockBoards,
      mockActiveBoards,
      true,
      0,
      2,
    );
    expect(move).toEqual([0, 6]);
  });
});
