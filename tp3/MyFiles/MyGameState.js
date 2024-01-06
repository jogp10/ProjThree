const State = Object.freeze({
  INITIAL: "initial",
  CARS: "cars",
  RUNNING: "running",
  PAUSE: "pause",
  CHOOSE_OBSTACLE: "chooseObstacle",
  PLACE_OBSTACLE: "placeObstacle",
  FINAL: "final",
});

class MyGameState {
  constructor() {
    this.gameState = State.INITIAL; // Initial game state
    this.playerName = ""; // Player name input
    this.selectedCar = null; // Selected player car
    this.selectedOpponentCar = null; // Selected opponent car
    this.difficultyLevel = 1; // Default difficulty level
    this.isGameStarted = false; // Flag to track if the game has started
  }

  getCurrentState() {
    return this.gameState;
  }

  setPlayerName(name) {
    this.playerName = name;
  }

  setSelectedCar(car) {
    this.selectedCar = car;
  }

  setSelectedOpponentCar(car) {
    this.selectedOpponentCar = car;
  }

  setDifficultyLevel(level) {
    this.difficultyLevel = level;
  }

  setGameStarted() {
    this.isGameStarted = true;
  }

  setGameState(state) {
    this.gameState = State[state];
  }

  getGameState() {
    return this.gameState;
  }
}

export { MyGameState };
