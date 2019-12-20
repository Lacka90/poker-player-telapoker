export const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export interface GameState {
  /** ID of the current tournament */
  tournament_id: string;
  /**
   * Id of the current sit'n'go game. You can use this to link a
   * sequence of game states together for logging purposes, or to
   * make sure that the same strategy is played for an entire game
   */
  game_id: string;
  /** Index of the current round within a sit'n'go */
  round: number;
  /** Index of the betting opportunity within a round */
  bet_index: number;
  /** The small blind in the current round. The big blind is twice the small blind */
  small_blind: number;
  /** The amount of the largest current bet from any one player */
  current_buy_in: number;
  /** The size of the pot (sum of the player bets) */
  pot: number;
  /**
   * Minimum raise amount. To raise you have to return at least:
   * current_buy_in - players[in_action][bet] + minimum_raise
   */
  minimum_raise: number;
  /**
   * The index of the player on the dealer button in this round
   * The first player is (dealer+1)%(players.length)
   */
  dealer: number;
  /**
   * Number of orbits completed.
   * (The number of times the dealer button returned to the same player.)
   */
  orbits: number;
  /** The index of your player, in the players array */
  in_action: number;
  /**
   * An array of the players.
   * The order stays the same during the
   * entire tournament
   */
  players: Player[];
  /** Finally the array of community cards. */
  community_cards: Card[];
}

export interface Player {
  /** Id of the player (same as the index) */
  id: number;
  /** Name specified in the tournament config */
  name: string;
  /**
   * Status of the player:
   * - active: the player can make bets, and win the current pot
   * - folded: the player folded, and gave up interest in
   *    the current pot. They can return in the next round.
   * - out: the player lost all chips, and is out of this sit'n'go
   */
  status: "active" | "folded" | "out";
  /** Version identifier returned by the player */
  version: string;
  /**
   * Amount of chips still available for the player.
   * (Not including the chips the player bet in this round.)
   */
  stack: number;
  /** The amount of chips the player put into the pot */
  bet: number;
  /**
   * The cards of the player.
   * This is only visible for your own player except after showdown, when cards revealed are also included.
   */
  hole_cards?: Card[];
}
export interface Card {
  /** Rank of the card. Possible values are numbers 2-10 and J,Q,K,A */
  rank:
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
    | "A";
  /** Suit of the card. Possible values are: clubs,spades,hearts,diamonds */
  suit: "clubs" | "spades" | "hearts" | "diamonds";
}
