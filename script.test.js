const {
  fetchAllPlayers,
  fetchSinglePlayer,
  addNewPlayer,
} = require("./script"); 

describe("fetchAllPlayers", () => {
  // Make the API call once before all the tests run
  let players;
  beforeAll(async () => {
    players = await fetchAllPlayers();
  });

  test("returns an array", async () => {
    expect(Array.isArray(players)).toBe(true);
  });

  test("returns players with name and id", async () => {
    players.forEach((player) => {
      expect(player).toHaveProperty("name");
      expect(player).toHaveProperty("id");
    });
  });
});

describe("fetchSinglePlayer", () => {
  let player;
  const testPlayerId = 1; // Use a valid player ID from your API

  beforeAll(async () => {
    player = await fetchSinglePlayer(testPlayerId);
  });

  test("returns a single player object", async () => {
    expect(typeof player).toBe("object");
    expect(Array.isArray(player)).toBe(false);
  });

  test("returns player with expected properties", async () => {
    expect(player).toHaveProperty("id");
    expect(player).toHaveProperty("name");
    expect(player).toHaveProperty("breed");
    expect(player).toHaveProperty("status");
  });

  test("returns player with correct id", async () => {
    expect(player.id).toBe(testPlayerId);
  });
});

// TODO: Tests for `addNewPlayer`

