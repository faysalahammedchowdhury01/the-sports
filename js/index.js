// global variables
const teamContainer = document.getElementById('team-container');
const teamDetailsContainer = document.getElementById('team-details-container');
const loader = `<div class="text-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>`;
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/1';

// load teams by name
const loadTeams = async (teamName) => {
  teamContainer.innerHTML = loader;
  const url = `${BASE_URL}/searchteams.php?t=${teamName}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.teams;
  } catch (error) {
    alert('Something went wrong!!');
  }
};

// load team by id
const loadTeamById = async (id) => {
  teamDetailsContainer.innerHTML = loader;
  const url = `${BASE_URL}/lookupteam.php?id=${id}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.teams[0];
  } catch (error) {
    alert('Something went wrong!!');
  }
};

// display team details
const displayTeamDetails = async (id) => {
  // back  to top
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

  // get and display team details
  const team = await loadTeamById(id);
  const {
    strTeam,
    strTeamBadge,
    strLeague,
    strStadium,
    strDescriptionEN,
    strGender,
  } = team;
  teamDetailsContainer.innerHTML = `
  <div class="col-md-8">
        <div class="card">
            <div class="card-body text-center text-dark">
                <img
                    class="mb-2"
                    style="width: 150px"
                    src="${strTeamBadge}/preview"
                    alt=""
                />
                <p class="my-1"><strong>Team:</strong> ${strTeam}</p>
                <p class="my-1"><strong>Gender:</strong> ${strGender}</p>
                <p class="my-1">
                    <strong>League:</strong>
                    ${strLeague}
                </p>
                <p class="my-1"><strong>Stadium:</strong> ${strStadium}</p>
                <p class="my-1">
                    <strong>Description:</strong>
                    ${strDescriptionEN}
                </p>
            </div>
        </div>
    </div>
  `;
};

// display teams
const displayTeams = (teams) => {
  // if there is no team found
  if (teams.length == 0) {
    teamContainer.innerHTML =
      '<p class="text-danger text-center">Team not Found!!</p>';
    return;
  }

  teamContainer.innerHTML = teams
    .map((team) => {
      const { idTeam, strTeam, strTeamBadge, strLeague, strGender } = team;
      return `
        <div class="team col-sm-6 col-lg-4">
            <div class="card h-100">
                <div class="card-body text-center text-dark">
                    <img
                        class="mb-2"
                        style="width: 120px"
                        src="${strTeamBadge}/preview"
                        alt="${strTeam}"
                    />
                    <p class="my-1"><strong>Team:</strong> ${strTeam}</p>
                    <p class="my-1"><strong>Gender:</strong> ${strGender}</p>
                    <p class="my-1">
                        <strong>League:</strong> ${strLeague}
                    </p>
                    <button
                      onclick="displayTeamDetails('${idTeam}')"
                      class="btn btn-primary mt-3"
                    >
                      See Details
                    </button>
                </div>
            </div>
        </div>
      `;
    })
    .join('');
};

// search teams
const searchTeams = async (event) => {
  event.preventDefault();

  // get input and inputvalue
  const searchTeamInput = document.getElementById('search-team-input');
  const searchTeam = searchTeamInput.value;

  // validate
  if (searchTeam.trim() == '') {
    alert("Can't be black!");
    return;
  }

  // clear team details
  teamDetailsContainer.innerHTML = '';

  // get and display teams
  const teams = await loadTeams(searchTeam);
  displayTeams(teams || []);

  // clear input value after submitted
  searchTeamInput.value = '';
};

// when submit form
document
  .getElementById('search-team-form')
  .addEventListener('submit', searchTeams);
