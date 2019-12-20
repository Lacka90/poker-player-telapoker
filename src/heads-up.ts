import { GameState } from "./interfaces";

export const headsUpWithHighCard = (gameState: GameState): number => {
  const me = gameState.players[gameState.in_action];
  const cards = me.hole_cards;
  const communityCards = gameState.community_cards;
  return 0;
};

export const lastPositionBet = (gameState: GameState): number => {
  const me = gameState.players[gameState.in_action];
  const cards = me.hole_cards;
  const communityCards = gameState.community_cards;
  const lastPosition = gameState.in_action === gameState.dealer;
  if (lastPosition && communityCards.length === 0) {
    if (gameState.pot < me.stack / 40) {
      return 20;
    }
  }
  if (lastPosition && communityCards.length < 4) {
    if (gameState.pot < me.stack / 30) {
      return 30;
    }
  }
  if (lastPosition && communityCards.length < 6) {
    if (gameState.pot < me.stack / 20) {
      return 40;
    }
  }
  return 0;
};
