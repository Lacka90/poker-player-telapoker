import Player from "./Player";
import { gameState } from "./example";

test("ace pair", () => {
  const player = new Player();

  player.betRequest(
    gameState([
      { rank: "A", suit: "diamonds" },
      { rank: "A", suit: "spades" }
    ]),
    bet => {
      console.log({ bet });

      expect(bet).toBe(990);
    }
  );
});

test('howManyOfTheSameRank double pair', () => {
  const player = new Player();

  player.betRequest(
    gameState([
      { rank: "A", suit: "diamonds" },
      { rank: "A", suit: "spades" },

      { rank: "2", suit: "diamonds" },
      { rank: "2", suit: "spades" },
    ]),
    bet => {
      console.log({ bet });

      expect(bet).toBe(150);
    }
  );
})
