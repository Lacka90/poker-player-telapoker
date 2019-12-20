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

const compareCards = (a: Card, b: Card) => {
  if (a.rank < b.rank) return -1;
  if (a.rank > b.rank) return 1;
  return 0;
};

const suited = (cards: Card2[]) => {
  return cards[0].suit === cards[1].suit;
};

const pair = (cards: Card2[]) => {
  return cards[0].rank === cards[1].rank;
};

const includes = (array: any[], item: any) => array.indexOf(item) !== -1;

const handValue = (_cards: Card[]): number => {
  const cards = _cards.sort(compareCards).map(card => rankToNumber(card));

  if (suited(cards)) {
    if (cards[1].rank === 14) {
      if (cards[0].rank === 13) return 1;
      if (includes([12, 11], cards[0].rank)) return 2;
      if (includes([10], cards[0].rank)) return 3;
      if (cards[0].rank < 10) return 5;
    }
    if (cards[1].rank === 13) {
      if (cards[0].rank === 12) return 2;
      if (cards[0].rank === 11) return 3;
      if (cards[0].rank === 10) return 4;
      if (cards[0].rank === 9) return 6;
      if (cards[0].rank < 9) return 7;
    }
  } else {
    if (pair) {
      if (cards[0].rank > 10) return 1;
      if (cards[0].rank === 10) return 2;
      if (cards[0].rank === 9) return 3;
      if (cards[0].rank === 8) return 4;
      if (cards[0].rank === 7) return 5;
      if ([5, 6].indexOf(cards[0].rank) !== -1) return 6;
      else return 7;
    } else {
      if (cards[0].rank < 8) return -1;
      if (cards[0].rank === 8 && includes([10, 11], cards[1].rank)) return 8;
      if (cards[0].rank === 8 && includes([9], cards[1].rank)) return 7;
      if (cards[0].rank === 9 && includes([14, 13, 12], cards[1].rank))
        return 8;
      if (cards[0].rank === 9 && includes([11, 10], cards[1].rank)) return 7;
      if (cards[0].rank === 10 && includes([14, 13, 12], cards[1].rank))
        return 6;
      if (cards[0].rank === 10 && includes([11], cards[1].rank)) return 5;
      if (cards[0].rank === 11 && includes([14], cards[1].rank)) return 4;
      if (cards[0].rank === 11 && includes([13, 12], cards[1].rank)) return 5;
      if (cards[0].rank === 12 && includes([14], cards[1].rank)) return 3;
      if (cards[0].rank === 12 && includes([13], cards[1].rank)) return 4;
      if (cards[0].rank === 13 && cards[1].rank === 14) return 2;
    }
  }
};
