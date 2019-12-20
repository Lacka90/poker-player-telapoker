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
  if (lastPosition) {
  }
  return 0;
};
