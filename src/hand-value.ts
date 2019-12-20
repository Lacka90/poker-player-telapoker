interface Card {
  rank: string;
  suit: string;
}

interface Card2 {
  rank: number;
  suit: string;
}

const rankToNumber = (card: Card): Card2 => {
  const _rank = card.rank.toUpperCase();
  const rank = !isNaN(Number(card.rank))
    ? Number(card.rank)
    : _rank === "J"
    ? 11
    : _rank === "Q"
    ? 12
    : _rank === "K"
    ? 13
    : 14;
  return {
    rank,
    suit: card.suit
  };
};

const compareCards = (a: Card2, b: Card2) => {
  if (a.rank < b.rank) return -1;
  if (a.rank > b.rank) return 1;
  return 0;
};

const suited = (cards: Card2[]) => {
  return cards[0].suit === cards[1].suit;
};

const matrix = [
  [1, 1, 2, 2, 3, 5, 5, 5, 5, 5, 5, 5, 5],
  [2, 1, 2, 3, 4, 6, 7, 7, 7, 7, 7, 7, 7],
  [3, 4, 1, 3, 4, 5, 7, 9, 9, 9, 9, 9, 9],
  [4, 5, 5, 1, 3, 4, 6, 8, 9, 9, 9, 9, 9],
  [6, 6, 6, 5, 2, 4, 5, 7, 9, 9, 9, 9, 9],
  [8, 8, 8, 7, 7, 3, 4, 5, 8, 9, 9, 9, 9],
  [9, 9, 9, 8, 8, 7, 4, 5, 6, 8, 9, 9, 9],
  [9, 9, 9, 9, 9, 9, 8, 5, 5, 6, 8, 9, 9],
  [9, 9, 9, 9, 9, 9, 9, 8, 6, 7, 7, 9, 9],
  [9, 9, 9, 9, 9, 9, 9, 9, 8, 6, 6, 7, 9],
  [9, 9, 9, 9, 9, 9, 9, 9, 9, 8, 7, 7, 8],
  [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 7, 8],
  [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 7]
];

const getFromMatrix = (card1: number, card2: number): number => {
  const col = 14 - card1;
  const row = 14 - card2;
  return matrix[row][col];
};

export const handValue = (_cards: Card[]): number => {
  const cards: Card2[] = _cards
    .map(card => rankToNumber(card))
    .sort(compareCards);
  if (suited(cards)) {
    return getFromMatrix(cards[0].rank, cards[1].rank);
  } else {
    return getFromMatrix(cards[1].rank, cards[0].rank);
  }
};
