//session ID
if (!localStorage.getItem("sessionId")) {
    const sessionId = Date.now() + "_" + Math.floor(Math.random() * 10000);
    localStorage.setItem("sessionId", sessionId);
}

const sessionId = localStorage.getItem("sessionId");

// fetching game results from backend
fetch(`http://localhost:5000/api/games/results/${sessionId}`)
    .then(res => res.json())
    .then(data => {
        const tbody = document.querySelector("#resultsTable tbody");
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8">No results found yet. Play a game!</td></tr>`;
        }
        else {
            data.forEach((result, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
          <td>${index + 1}</td>
          <td>${result.gameMode}</td>
          <td>${result.levelDifficulty}</td>
          <td>${result.playerBid ?? "Withdrew"}</td>
          <td>${result.lowestBid ?? "Withdrew"}</td>
          <td>${result.winner}</td>
          <td>${result.profit}</td>
          <td>${new Date(result.timestamp).toLocaleString()}</td>
        `;
                tbody.appendChild(row);
            });
        }
    })
    .catch(err => console.error("Error fetching results:", err));