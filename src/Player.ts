import { GameState, Card, rankOrder } from "./interfaces";
import * as _ from "lodash";
import { handValue } from "./hand-value";

function howManyOfTheSameRank(rankGroups: { [rank: string]: string[] }, numberOfAppearancesToSearchFor: number): {ranks: string[], found: number} {
  let ranks = [];
  let found = 0;
  Object.keys(rankGroups).forEach(r => {
    if (rankGroups[r].length === numberOfAppearancesToSearchFor) {
      ranks.push[r];
      found += 1;
    }
  });

  return { ranks, found };
}

function hasPoker(rankGroups: _.Dictionary<("2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A")[]>) {
  return howManyOfTheSameRank(rankGroups, 4).found === 1;
}

function hasStraight(allCards: Card[]): boolean {
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
      isBiggerByOne(current, next1) &&
      isBiggerByOne(next1, next2) &&
      isBiggerByOne(next2, next3) &&
      isBiggerByOne(next3, next4)
    ) {
      return true;
    }
  }
  return false;
}

function hasFlush(suitGroups: _.Dictionary<("clubs" | "spades" | "hearts" | "diamonds")[]> = {}): boolean { //szinsor
  Object.keys(suitGroups).forEach(key => {
    if (suitGroups[key].length >= 5) {
      return true;
    }
  });
  return false;
}

function isBiggerByOne(i: number, j: number): boolean {
  return j === i + 1;
}

function potSizedBet(pot: number, percent: number, max = 4000, min = 0) {
  const bet = Math.floor(pot * percent);
  return bet < min ? min : bet > max ? max : bet;
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
      if (value < 4)
        return betCallback(
          Math.max(gameState.current_buy_in - me.bet, gameState.small_blind)
        );
      if (value >= 4 && value < 7) {
        if (gameState.current_buy_in < 50) {
          return betCallback(
            Math.max(gameState.current_buy_in - me.bet, gameState.small_blind)
          );
        }
      }
    }

    if (hasPoker(rankGroups)) {
      return betCallback(allIn);
    }

    if (hasFlush(suitGroups)) {
      return betCallback(potSizedBet(gameState.pot, 1, 1500, 250));
    }

    if (hasStraight([...gameState.community_cards, ...cards])) {
      return betCallback(potSizedBet(gameState.pot, 0.6, 1000, 200));
    }

    const drill = howManyOfTheSameRank(rankGroups, 3);
    if (drill.found === 1) {
      const drillRankGroups = _.cloneDeep(rankGroups);
      delete drillRankGroups[drill.ranks[0]];
      const pairAboveDrill = howManyOfTheSameRank(drillRankGroups, 2);

      if (pairAboveDrill.found >= 1) { // fullhouse
        return betCallback(potSizedBet(gameState.pot, 1.2, 4000, 300));
      }

      return betCallback(potSizedBet(gameState.pot, 0.6, 800, 150));
    }

    if (howManyOfTheSameRank(rankGroups, 2).found >= 2) {
      return betCallback(potSizedBet(gameState.pot, 0.8, 150, 10));
    }

    if (howManyOfTheSameRank(rankGroups, 2).found === 1) {
      return betCallback(potSizedBet(gameState.pot, 0.8, 100, 10));
    }

    return betCallback(0);
  }

  public showdown(gameState: any): void {}
}

export default Player;
