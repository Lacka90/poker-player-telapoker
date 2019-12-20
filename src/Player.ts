import { GameState, Card, rankOrder } from "./interfaces";
import * as _ from "lodash";
import { handValue } from "./hand-value";

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
    const suits = [
      ...cards.map(c => c.suit),
      ...(gameState.community_cards || []).map(c => c.suit)
    ];
    const rankGroups = _.groupBy(ranks, r => r);
    const suitGroups = _.groupBy(suits, s => s);

    const allIn = me.stack - me.bet;
    if (!gameState.community_cards.length) {
      const value = handValue(cards);
      if (value === 1) return betCallback(allIn);
      if (value > 4)
        return betCallback(
          Math.max(gameState.current_buy_in - me.bet, gameState.small_blind)
        );
      if (value <= 4 && value > 7) {
        if (gameState.current_buy_in < 50) {
          return betCallback(
            Math.max(gameState.current_buy_in - me.bet, gameState.small_blind)
          );
        }
      } else return betCallback(0);
    }

    if (hasEqualRank(rankGroups, 4).found) {
      return betCallback(allIn);
    }

    const hasFlush = this.isFlush(suitGroups);
    if (hasFlush) {
      return betCallback(allIn);
    }

    const hasStraight = this.isStraight([...gameState.community_cards, ...cards]);
    if (hasStraight) {
      return betCallback(250);
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

    return betCallback(0);
  }

  public showdown(gameState: any): void {}

  private isStraight(allCards: Card[]): boolean {
    //szamsor
    if (!allCards || allCards.length < 5) {
      return false;
    }
    const sortedUnique = _.uniq(
      allCards.map(card => rankOrder.indexOf(card.rank)).sort()
    );
    if (sortedUnique.length < 5) {
      return false;
    }
    for (let i = 0; i <= sortedUnique.length - 5; i++) {
      const current = sortedUnique[i];
      const next1 = sortedUnique[i + 1];
      const next2 = sortedUnique[i + 2];
      const next3 = sortedUnique[i + 3];
      const next4 = sortedUnique[i + 4];
      if (
        this.isBiggerByOne(current, next1) &&
        this.isBiggerByOne(next1, next2) &&
        this.isBiggerByOne(next2, next3) &&
        this.isBiggerByOne(next3, next4)
      ) {
        return true;
      }
    }
    return false;
  }

  private isFlush(suitGroups: _.Dictionary<("clubs" | "spades" | "hearts" | "diamonds")[]> = {}): boolean { //szinsor
    Object.keys(suitGroups).forEach(key => {
      if (suitGroups[key].length >= 5) {
        return true;
      }
    });
    return false;
  }

  private isBiggerByOne(i: number, j: number): boolean {
    return j === i + 1;
  }
}

export default Player;
