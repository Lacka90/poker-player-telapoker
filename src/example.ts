import { Card, GameState } from "./interfaces";

export const gameState = (cards: Card[]) =>
  ({
    tournament_id: "5dfa0f3f557a0b0004000007",
    game_id: "5dfccf000c8b7f0004000100",
    round: 2,
    players: [
      {
        name: "TelaPoker",
        stack: 994,
        status: "folded",
        bet: 4,
        hole_cards: cards,
        version: "Default TypeScript folding player",
        id: 0
      },
      {
        name: "MehetMindenBele",
        stack: 0,
        status: "out",
        bet: 0,
        hole_cards: [],
        version: "ERROR: Unreachable",
        id: 1
      },
      {
        name: "allWin",
        stack: 1000,
        status: "folded",
        bet: 0,
        hole_cards: [
          { rank: "Q", suit: "hearts" },
          { rank: "4", suit: "clubs" }
        ],
        version: "Sziasztok3.2",
        id: 2
      },
      {
        name: "DROP TABLE users",
        stack: 996,
        status: "active",
        bet: 6,
        hole_cards: [
          { rank: "K", suit: "diamonds" },
          { rank: "K", suit: "clubs" }
        ],
        version: "Default TypeScript folding player",
        id: 3
      }
    ],
    small_blind: 2,
    big_blind: 4,
    orbits: 0,
    dealer: 2,
    community_cards: [
      // { rank: "8", suit: "spades" },
      // { rank: "6", suit: "hearts" },
      // { rank: "2", suit: "spades" },
      // { rank: "5", suit: "hearts" }
    ],
    current_buy_in: 6,
    pot: 200,
    in_action: 0,
    bet_index: 0,
    minimum_raise: 10
  } as GameState);
