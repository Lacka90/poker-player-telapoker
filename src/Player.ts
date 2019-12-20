import { GameState, Card, rankOrder } from "./interfaces";
import * as _ from "lodash";
import { handValue } from "./hand-value";
import { lastPositionBet } from "./heads-up";

function howManyOfTheSameRank(
  rankGroups: { [rank: string]: string[] },
  numberOfAppearancesToSearchFor: number
): { ranks: string[]; found: number } {
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

function hasPoker(
  rankGroups: _.Dictionary<
    (
      | "2"
      | "3"
      | "4"
      | "5"
      | "6"
      | "7"
      | "8"
      | "9"
      | "10"
      | "J"
      | "Q"
      | "K"
      | "A"
    )[]
  >
) {
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

function hasFlush(
  suitGroups: _.Dictionary<("clubs" | "spades" | "hearts" | "diamonds")[]> = {}
): boolean {
  //szinsor
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

function potSizedBet(
  ourMoney: number,
  pot: number,
  percent: number,
  max = 4000,
  min = 0
) {
  max = Math.min(ourMoney, max);
  min = Math.min(ourMoney, min, 0);
  const bet = Math.floor(pot * percent);
  return bet < min ? min : bet > max ? max : bet;
}

function failSafeBet(gameState: GameState, bet: number) {
  const me = gameState.players[gameState.in_action];
  const minRaise = gameState.current_buy_in - me.bet + gameState.minimum_raise;
  if (bet > gameState.current_buy_in - me.bet && bet < minRaise) bet = minRaise;
  if (bet < 0) bet = 0;
  if (bet > me.stack) bet = me.stack;
  return bet;
}

export class Player {
  public betRequest(
    gameState: GameState,
    _betCallback: (bet: number) => void
  ): void {
    const betCallback = (bet: number) => {
      _betCallback(failSafeBet(gameState, bet));
    };
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

    const inGamePlayers = gameState.players.reduce(
      (acc, player) => acc + (player.status !== "out" ? 1 : 0),
      0
    );
    console.error("ingameplayers", inGamePlayers);

    if (gameState.community_cards.length > 3) {
      if (gameState.pot > Math.floor(me.stack / 3) || me.stack < 200) {
        return betCallback(
          Math.max(gameState.current_buy_in - me.bet, gameState.small_blind)
        );
      }
    }

    const allIn = Math.max(me.stack, 0);
    if (!gameState.community_cards.length) {
      const value = handValue(cards);
      if (inGamePlayers > 2) {
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
      } else {
        if (value === 2) return betCallback(allIn);
        if (value < 5)
          return betCallback(
            Math.max(gameState.current_buy_in - me.bet, gameState.small_blind)
          );
        if (value >= 5 && value < 6) {
          if (gameState.current_buy_in < 100) {
            return betCallback(
              Math.max(gameState.current_buy_in - me.bet, gameState.small_blind)
            );
          }
        }
        if (value >= 6 && value <= 8) {
          if (gameState.current_buy_in < 50) {
            return betCallback(
              Math.max(gameState.current_buy_in - me.bet, gameState.small_blind)
            );
          }
        }
      }

      if (lastPositionBet(gameState) > 0) {
        return betCallback(lastPositionBet(gameState));
      }
    }

    console.error("abovePoker");

    if (hasPoker(rankGroups)) {
      return betCallback(allIn);
    }

    if (hasFlush(suitGroups)) {
      return betCallback(potSizedBet(allIn, gameState.pot, 1, 1500, 250));
    }

    if (hasStraight([...gameState.community_cards, ...cards])) {
      return betCallback(potSizedBet(allIn, gameState.pot, 0.6, 1000, 200));
    }

    const drill = howManyOfTheSameRank(rankGroups, 3);
    if (drill.found === 1) {
      const drillRankGroups = _.cloneDeep(rankGroups);
      delete drillRankGroups[drill.ranks[0]];
      const pairAboveDrill = howManyOfTheSameRank(drillRankGroups, 2);

      if (pairAboveDrill.found >= 1) {
        // fullhouse
        return betCallback(potSizedBet(allIn, gameState.pot, 1.2, 4000, 300));
      }

      return betCallback(potSizedBet(allIn, gameState.pot, 0.6, 800, 150));
    }

    if (howManyOfTheSameRank(rankGroups, 2).found >= 2) {
      return betCallback(potSizedBet(allIn, gameState.pot, 0.8, 150, 50));
    }

    if (howManyOfTheSameRank(rankGroups, 2).found === 1) {
      return betCallback(potSizedBet(allIn, gameState.pot, 0.8, 100, 10));
    }
    if (lastPositionBet(gameState) > 0)
      return betCallback(lastPositionBet(gameState));
    return betCallback(0);
  }

  public showdown(gameState: any): void {}
}

export default Player;
