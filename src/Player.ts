export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    const me = gameState.players[gameState.in_action];
    const cards = me.hole_cards;
    const pair = cards[0].rank === cards[1].rank;

    if (!pair) {
      betCallback(0);
    }
    const amount =
      gameState.current_buy_in - gameState.players[gameState.in_action].bet;
    betCallback(amount);
  }

  public showdown(gameState: any): void {}
}

export default Player;
