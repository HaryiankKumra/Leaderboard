const leaderboard = document.getElementById("leaderboard");
let teams = [{ name: "Team A", score: 0 }, { name: "Team B", score: 0 }];

// Load data from localStorage when the page loads
function loadFromLocalStorage() {
    const savedData = localStorage.getItem("leaderboard");
    if (savedData) {
        teams = JSON.parse(savedData);
    }
    renderLeaderboard(true);  // Trigger animation when data is loaded
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem("leaderboard", JSON.stringify(teams));
}

// Render the leaderboard
function renderLeaderboard(animated = false) {
    const oldOrder = teams.map(team => team.name);
    teams.sort((a, b) => b.score - a.score);
    const newOrder = teams.map(team => team.name);

    leaderboard.innerHTML = ""; // Clear existing leaderboard content
    teams.forEach((team, index) => {
        const teamElement = document.createElement("div");
        teamElement.classList.add("team");

        if (animated) {
            const oldIndex = oldOrder.indexOf(team.name);
            if (oldIndex > index) {
                teamElement.classList.add("move-up");
            } else if (oldIndex < index) {
                teamElement.classList.add("move-down");
            }
        }

        teamElement.innerHTML = `
            <input type="text" value="${team.name}" onchange="updateTeamName(${index}, this.value)">
            <span class="score">${team.score}</span>
            <button onclick="updateScore(${index}, 100)">+</button>
            <button onclick="updateScore(${index}, -100)">-</button>
            <button onclick="removeTeam(${index})">x</button>
        `;
        leaderboard.appendChild(teamElement);
    });

    if (animated) {
        setTimeout(() => {
            document.querySelectorAll(".team").forEach(team => {
                team.classList.remove("move-up", "move-down");
            });
        }, 1000);
    }
}

// Update score
function updateScore(index, change) {
    teams[index].score = Math.max(0, Math.min(100000, teams[index].score + change));
    saveToLocalStorage(); // Save data to localStorage
    renderLeaderboard(true);
}

// Add a new team
function addTeam() {
    teams.push({ name: "New Team", score: 0 });
    saveToLocalStorage(); // Save data to localStorage
    renderLeaderboard(true);
}

// Remove a team
function removeTeam(index) {
    teams.splice(index, 1);
    saveToLocalStorage(); // Save data to localStorage
    renderLeaderboard(true);
}

// Update team name
function updateTeamName(index, newName) {
    teams[index].name = newName;
    saveToLocalStorage(); // Save data to localStorage
}

// Load data when the page loads
window.onload = loadFromLocalStorage;

// CSS for animations
document.head.insertAdjacentHTML("beforeend", `
    <style>
        .move-up {
            animation: moveUp 1s ease-in-out;
            background-color: #4CAF50 !important;
            transform: scale(1.1);
        }
        .move-down {
            animation: moveDown 1s ease-in-out;
            background-color: #FF5733 !important;
            transform: scale(1.1);
        }
        @keyframes moveUp {
            from { transform: translateY(10px); opacity: 0.7; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes moveDown {
            from { transform: translateY(-10px); opacity: 0.7; }
            to { transform: translateY(0); opacity: 1; }
        }
    </style>
`);
