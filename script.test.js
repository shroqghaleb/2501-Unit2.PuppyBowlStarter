const {
  fetchAllPuppies,
  fetchSinglePuppy,
  addNewPuppy
} = require("./script");

describe("fetchAllPuppies", () => {
  let puppies;
  
  beforeAll(async () => {
    puppies = await fetchAllPuppies();
  });

  test("returns an array", async () => {
    expect(Array.isArray(puppies)).toBe(true);
  });

  test("returns puppies with name and id", async () => {
    puppies.forEach((puppy) => {
      expect(puppy).toHaveProperty("name");
      expect(puppy).toHaveProperty("id");
    });
  });
});

describe("fetchSinglePuppy", () => {
  let puppy;
  let testPuppyId;

  beforeAll(async () => {
    // Get a valid puppy ID first
    const puppies = await fetchAllPuppies();
    testPuppyId = puppies[0].id; // Use the first puppy's ID
    puppy = await fetchSinglePuppy(testPuppyId);
  });

  test("returns a single puppy object", async () => {
    expect(typeof puppy).toBe("object");
    expect(Array.isArray(puppy)).toBe(false);
  });

  test("returns puppy with expected properties", async () => {
    expect(puppy).toHaveProperty("id");
    expect(puppy).toHaveProperty("name");
    expect(puppy).toHaveProperty("breed");
    expect(puppy).toHaveProperty("status");
  });

  test("returns puppy with correct id", async () => {
    expect(puppy.id).toBe(testPuppyId);
  });
});

describe("addNewPuppy", () => {
  test("adds a new puppy", async () => {
    const newPuppy = {
      name: "Test Puppy",
      breed: "Test Breed",
      imageUrl: "https://example.com/puppy.jpg"
    };

    const addedPuppy = await addNewPuppy(newPuppy);
    
    // First check if we got a response
    expect(addedPuppy).toBeDefined();
    
    // Then check the specific properties
    expect(addedPuppy).toHaveProperty("id");
    expect(addedPuppy.name).toBe(newPuppy.name);
    expect(addedPuppy.breed).toBe(newPuppy.breed);
    expect(addedPuppy.status).toBe("bench"); // Default status
  });
});

