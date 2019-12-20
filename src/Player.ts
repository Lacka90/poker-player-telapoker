import { GameState } from "./interfaces";
import * as _ from "lodash";

function hasEqualRank(rankGroups: { [rank: string]: string[] }, num: number) {
  return _.some(
    Object.keys(rankGroups),
    rank => rankGroups[rank].length === num
  );
}

export class Player {
  public betRequest(
    gameState: GameState,
    betCallback: (bet: number) => void
  ): void {
    const me = gameState.players[gameState.in_action];
    const cards = me.hole_cards;
    const pair = cards[0].rank === cards[1].rank;
    const ranks = [
      ...cards.map(c => c.rank),
      ...gameState.community_cards.map(c => c.rank)
    ];
    const rankGroups = _.groupBy(ranks, r => r);
    const allIn = me.stack - me.bet;
    if (hasEqualRank(rankGroups, 4)) {
      betCallback(allIn);
    }

    if (hasEqualRank(rankGroups, 3)) {
      betCallback(200);
    }

    if (hasEqualRank(rankGroups, 2)) {
      betCallback(100);
    }

    betCallback(0);
  }

  public showdown(gameState: any): void {}
}

export default Player;
