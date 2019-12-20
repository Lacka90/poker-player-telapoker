export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    const amount =
      gameState.current_buy_in - gameState.players[gameState.in_action].bet;
    betCallback(amount);
  }

  public showdown(gameState: any): void {}
}

export default Player;
