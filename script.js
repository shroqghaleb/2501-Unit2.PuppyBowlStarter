//If you would like to, you can create a variable to store the API_URL here.
//This is optional. if you do not want to, skip this and move on.


/////////////////////////////
/*This looks like a good place to declare any state or global variables you might need*/

////////////////////////////

// Global variables
const API_URL = "https://fsa-puppy-bowl.herokuapp.com/api/2501-FTB-ET-WEB-AM";

/**
 * Fetches all players from the API.
 * This function should not be doing any rendering
 * @returns {Object[]} the array of player objects
 */

const fetchAllPlayers = async () => {
  try {
    const response = await fetch("https://fsa-puppy-bowl.herokuapp.com/api/2501-FTB-ET-WEB-AM/players");
    console.log("Response:", response);
    
    const json = await response.json();
    console.log("JSON data:", json);
    
    const allPlayers = json.data.players;
    console.log("All players:", allPlayers);
    
    return allPlayers; 
  } catch (error) {
    console.error("Error fetching players:", error);
    return []; 
  }
};

fetchAllPlayers();
/*
 * Fetches a single player from the API.
 * This function should not be doing any rendering
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  const response = await fetch(`https://fsa-puppy-bowl.herokuapp.com/api/2803-PUPPIES/players/${playerId}`);
  const json = await response.json();
  return json.data.player;
};

/**
 * Adds a new player to the roster via the API.
 * Once a player is added to the database, the new player
 * should appear in the all players page without having to refresh
 * @param {Object} newPlayer the player to add
 */
/* Note: we need data from our user to be able to add a new player
 * Do we have a way to do that currently...? 
*/
/**
 * Note#2: addNewPlayer() expects you to pass in a
 * new player object when you call it. How can we
 * create a new player object and then pass it to addNewPlayer()?
 */
/**
 * FOR TESTING PURPOSES ONLY PLEASE OBSERVE THIS SECTION
 * @returns {Object} the new player object added to database
 */

const addNewPlayer = async (newPlayer) => {
  
  if (!newPlayer.name || !newPlayer.breed) {
    console.log("Please fill in all required fields");
    return;
  }

  try {
   
    const response = await fetch("https://fsa-puppy-bowl.herokuapp.com/api/2803-PUPPIES/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPlayer)
    });

    
    if (!response.ok) {
      throw new Error("Failed to add player");
    }

    
    const data = await response.json();
    console.log("New player added:", data);

    
    await render();

  } catch (error) {
    console.log("Error adding player:", error);
  }
};

/**
 * Removes a player from the roster via the API.
 * Once the player is removed from the database,
 * the player should also be removed from our view without refreshing
 * @param {number} playerId the ID of the player to remove
 */
/**
 * Note: In order to call removePlayer() some information is required.
 * Unless we get that information, we cannot call removePlayer()....
 */
/**
 * Note#2: Don't be afraid to add parameters to this function if you need to!
 */

const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`https://fsa-puppy-bowl.herokuapp.com/api/2803-PUPPIES/players/${playerId}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log("Player removed:", data);

    
    await render();

  } catch (error) {
    console.error("Error removing player:", error);
   
    const app = document.querySelector("#app");
    app.innerHTML = `<div class="error-message">Error removing player: ${error.message}</div>`;
  }
};

/**
 * Updates html to display a list of all players or a single player page.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player in the all player list is displayed with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, for each player we should be able to:
 * - See details of a single player. When clicked, should be redirected
 *    to a page with the appropriate hashroute. The page should show
 *    specific details about the player clicked 
 * - Remove from roster. when clicked, should remove the player
 *    from the database and our current view without having to refresh
 *
 */
const render = async () => {
  const app = document.querySelector("#app");
  app.innerHTML = "<div class='loading'>Loading...</div>";

  try {
    const hash = window.location.hash.slice(1);
    console.log("Current hash:", hash);

    if (hash.startsWith("puppy-")) {
      const puppyId = parseInt(hash.split("-")[1]);
      console.log("Fetching puppy with ID:", puppyId);
      const puppy = await fetchSinglePuppy(puppyId);
      app.innerHTML = renderSinglePuppy(puppy);
      return;
    }

    const puppies = await fetchAllPuppies();
    console.log("All puppies:", puppies);

    const puppyList = puppies.map((puppy) => {
      return `
        <div class="puppy-card">
          <h3>${puppy.name}</h3>
          <p>ID: ${puppy.id}</p>
          <img src="${puppy.imageUrl}" alt="${puppy.name}" />
          <div class="puppy-actions">
            <button class="view-details" onclick="window.location.hash='puppy-${puppy.id}'">View Details</button>
            <button class="remove-puppy" onclick="removePuppy(${puppy.id})">Remove Puppy</button>
          </div>
        </div>
      `;
    });

    app.innerHTML = `
      <div class="puppies-container">
        ${puppyList.join("")}
      </div>
    `;

  } catch (error) {
    console.error("Error rendering:", error);
    app.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
  }
};

/**
 * Updates html to display a single player.
 * A detailed page about the player is displayed with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The page also contains a "Back to all players" that, when clicked,
 * will redirect to the approriate hashroute to show all players.
 * The detailed page of the single player should no longer be shown.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  if (!player) {
    const app = document.querySelector("#app");
    app.innerHTML = "<div class='error-message'>Player not found</div>";
    return;
  }

  return `
    <div class="player-details">
      <button class="back-button" onclick="window.location.hash=''">Back to All Players</button>
      
      <div class="player-info">
        <h2>${player.name}</h2>
        <img src="${player.imageUrl}" alt="${player.name}" />
        
        <div class="player-details-info">
          <p><strong>ID:</strong> ${player.id}</p>
          <p><strong>Breed:</strong> ${player.breed}</p>
          <p><strong>Status:</strong> ${player.status || 'Unassigned'}</p>
        </div>

        <button class="remove-player" onclick="removePlayer(${player.id})">Remove Player</button>
      </div>
    </div>
  `;
};


const fetchAllPuppies = async () => {
  try {
    const response = await fetch(`${API_URL}/players`);
    const json = await response.json();
    console.log("All puppies:", json.data.players);
    return json.data.players;
  } catch (error) {
    console.error('Error fetching puppies:', error);
    return [];
  }
};


const fetchSinglePuppy = async (puppyId) => {
  try {
    const response = await fetch(`${API_URL}/players/${puppyId}`);
    const json = await response.json();
    console.log("Single puppy:", json.data.player);
    return json.data.player;
  } catch (error) {
    console.error('Error fetching single puppy:', error);
    return null;
  }
};


const renderSinglePuppy = (puppy) => {
  if (!puppy) {
    return `<div class="error-message">Puppy not found</div>`;
  }

  return `
    <div class="puppy-details">
      <button class="back-button" onclick="window.location.hash=''">Back to All Puppies</button>
      
      <div class="puppy-info">
        <h2>${puppy.name}</h2>
        <img src="${puppy.imageUrl}" alt="${puppy.name}" />
        
        <div class="puppy-details-info">
          <p><strong>ID:</strong> ${puppy.id}</p>
          <p><strong>Breed:</strong> ${puppy.breed}</p>
          <p><strong>Status:</strong> ${puppy.status || 'Unassigned'}</p>
        </div>

        <button class="remove-puppy" onclick="removePuppy(${puppy.id})">Remove Puppy</button>
      </div>
    </div>
  `;
};


const init = async () => {

  window.addEventListener("hashchange", render);
  

  const newPuppyForm = document.querySelector("#newPuppyForm");
  
  if (newPuppyForm) {  
    newPuppyForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      const newPuppy = {
        name: event.target.puppyName.value,
        breed: event.target.puppyBreed.value,
        imageUrl: event.target.puppyImage.value
      };

      try {
        await addNewPuppy(newPuppy);
        event.target.reset();
        await render(); 
      } catch (error) {
        console.error("Error adding puppy:", error);
      }
    });
  } else {
    console.error("Form not found!"); 
  }

  await render();
};


const addNewPuppy = async (newPuppy) => {
  try {
    const response = await fetch(`${API_URL}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPuppy)
    });
    const data = await response.json();
    return data.data.player;
  } catch (error) {
    console.log("Error adding puppy:", error);
  }
};


const removePuppy = async (puppyId) => {
  try {
    await fetch(`${API_URL}/players/${puppyId}`, {
      method: "DELETE"
    });
    render(); 
  } catch (error) {
    console.log("Error removing puppy:", error);
  }
};


window.removePuppy = removePuppy;

/**THERE IS NO NEED TO EDIT THE CODE BELOW =) **/

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
  };
} else {
  init();
}
