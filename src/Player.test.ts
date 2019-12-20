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
