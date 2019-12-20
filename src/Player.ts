import { GameState } from "./interfaces";
import * as _ from "lodash";

function hasEqualRank(rankGroups: { [rank: string]: string[] }, num: number) {
  let rank;
  let found = false;
  Object.keys(rankGroups).forEach(r => {
    if (!found) {
      rank = r;
      found = rankGroups[r].length === num;
    }
  });

  return { rank, found };
}

export class Player {
  public betRequest(
    gameState: GameState,
    betCallback: (bet: number) => void
  ): void {
    const me = gameState.players[gameState.in_action];
    const cards = me.hole_cards;
    const ranks = [
      ...cards.map(c => c.rank),
      ...(gameState.community_cards || []).map(c => c.rank)
    ];
    const rankGroups = _.groupBy(ranks, r => r);
    const allIn = me.stack - me.bet;
    if (hasEqualRank(rankGroups, 4).found) {
      betCallback(allIn);
    }

    const drill = hasEqualRank(rankGroups, 3);

    if (drill.found) {
      delete rankGroups[drill.rank];

      const fullHouse = hasEqualRank(rankGroups, 2);

      if (fullHouse.found) {
        return betCallback(allIn / 2);
      }

      return betCallback(200);
    }

    if (hasEqualRank(rankGroups, 2).found) {
      return betCallback(100);
    }

    if (gameState.current_buy_in < 50) {
      return betCallback(gameState.current_buy_in - me.bet);
    }

    return betCallback(0);
  }

  public showdown(gameState: any): void {}
}

export default Player;
