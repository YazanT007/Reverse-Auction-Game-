// Make sure a sessionId exists in localStorage
if (!localStorage.getItem("sessionId")) {
    const newSessionId = "session_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
    localStorage.setItem("sessionId", newSessionId);
}

// Retrieve sessionId
const sessionId = localStorage.getItem("sessionId");
// Store current game URL
localStorage.setItem('currentGameUrl', window.location.href);

//Grabbing cost and supplier from player input
const params = new URLSearchParams(window.location.search);
const cost = parseInt(params.get("cost"));
const suppliers = parseInt(params.get("suppliers"));

window.onload = function () {
    document.getElementById("auction-cost").textContent = `Your cost to fulfill the contract is: $${cost}`;
    document.getElementById("auction-suppliers").textContent = `Number of suppliers you are competing with: ${suppliers}`;
    document.getElementById("important-information").textContent = "In this open auction, suppliers will respond to your bid one after another. Try to win the contract without sacrificing your profit.";

    const submitBtn = document.getElementById("submit-bid");
    const withdrawBtn = document.getElementById("withdraw");
    const playerBidInput = document.getElementById("player-bid");
    const AIBidSection = document.getElementById("AI-bidding-section");
    const result = document.getElementById("result-text");
    const AIresult = document.getElementById("AIWins");
    const profit = document.getElementById("profit");
    const errMsg = document.getElementById("errMsg");

    let supplierBids = new Array(suppliers).fill(null);
    let activeSuppliers = new Array(suppliers).fill(true);
    let currentBid = null;
    let playerWithdrew = false;
    let lastBidder = "You";
    let SupplierElements = [];
    let lastSupplierIndex = null;

    for (let i = 0; i < suppliers; i++) {
        const p = document.createElement("p");
        p.id = `ai-status-${i}`;
        p.innerHTML = `Supplier ${i + 1} is waiting <span class="dots">...</span>`
        AIBidSection.appendChild(p);
        SupplierElements.push(p);
    }

    let dotIntervals = [];

    SupplierElements.forEach((el, i) => {
        const span = el.querySelector(".dots");
        let dotCount = 1;

        const interval = setInterval(() => {
            dotCount = (dotCount % 3) + 1;
            const dots = ".".repeat(dotCount).padEnd(3, "\u00A0");
            span.textContent = dots;
        }, 500);

        dotIntervals.push(interval);
    });

    function nextSupplier(index) {
        if (index >= suppliers) {
            if (activeSuppliers.every(active => !active)) {
                endAuction();
            } else if (!playerWithdrew) {
                // Only give turn to player if they have not withdrawn
                submitBtn.disabled = false;
                playerBidInput.disabled = false;
                errMsg.style.color = '#4ce3d2';
                errMsg.textContent = "Your turn to bid.";
            } else {
                // Player withdrew: continue AI bidding cycle after a short delay
                setTimeout(() => nextSupplier(0), 700);
            }
            return;
        }

        if (!activeSuppliers[index]) {
            nextSupplier(index + 1);
            return;
        }

        const threshold = cost + Math.floor(Math.random() * 6) + 15;
        const minNextBid = currentBid - Math.floor(Math.random() * 3) - 5;

        if (minNextBid <= threshold) {

            document.getElementById(`ai-status-${index}`).textContent = `Supplier ${index + 1} withdrew.`;
            activeSuppliers[index] = false;

        } else {
            supplierBids[index] = minNextBid;
            currentBid = minNextBid;
            lastBidder = `Supplier ${index + 1}`;
            lastSupplierIndex = index;
            document.getElementById(`ai-status-${index}`).textContent = `Supplier ${index + 1} bids $${minNextBid}`;
        }

        setTimeout(() => nextSupplier(index + 1), 700);
    }


    window.submitBid = function () {
        // No bidding if withdrawn
        if (playerWithdrew) {
            return;
        }

        errMsg.textContent = "";
        const bid = parseInt(playerBidInput.value);

        if (isNaN(bid) || bid <= 0) {
            errMsg.textContent = "Please enter a valid number.";
            return;
        }

        if (currentBid !== null && bid >= currentBid) {
            errMsg.textContent = `Your bid must be lower than the current lowest bid ($${currentBid}).`;
            return;
        }

        currentBid = bid;
        lastBidder = "You";
        playerBidInput.disabled = true;
        submitBtn.disabled = true;

        nextSupplier(0);
    };


    window.withdraw = function () {
        errMsg.style.color = '#4ce3d2';
        errMsg.textContent = "You withdrew from the auction. Suppliers are still bidding.";
        playerWithdrew = true;
        playerBidInput.disabled = true;
        submitBtn.disabled = true;
        withdrawBtn.disabled = true;

        if (currentBid === null) {
            currentBid = cost + 150;
        }

        nextSupplier(0);
    };

    function endAuction() {
        withdrawBtn.disabled = true;
        submitBtn.disabled = true;
        playerBidInput.disabled = true;
        let finalWinner;
        let finalProfit;
        let playerBid = 0;
        let finalLowestBid;

        if (playerWithdrew) {
            SupplierElements.forEach((el, i) => {
                if (i === lastSupplierIndex) {
                    el.textContent = `Supplier ${i + 1} bids $${supplierBids[i]}`;
                } else {
                    el.textContent = `Supplier ${i + 1} withdrew.`;
                }
            });

            if (lastSupplierIndex !== null && supplierBids[lastSupplierIndex] !== null) {
                result.textContent = `You withdrew ❌`;
                AIresult.textContent = `Supplier ${lastSupplierIndex + 1} wins the contract at $${currentBid}`;
                finalWinner = `Supplier ${lastSupplierIndex + 1}`;
            } else {
                result.textContent = `You withdrew ❌`;
                AIresult.textContent = `No supplier submitted a bid. No one wins.`;
                finalWinner = "No Winner";
            }

            profit.textContent = `Your profit: $0`;
            finalProfit = 0;
        } else {
            result.textContent = `${lastBidder} won the contract ✅`;

            if (lastBidder === "You") {
                playerBid = currentBid;
                finalProfit = currentBid - cost;
                finalWinner = "Player";

                if (finalProfit < 0) {
                    AIresult.textContent = "But you lost profit ❌";
                } else {
                    AIresult.textContent = "Well done!";
                }

                profit.textContent = `Your profit: $${finalProfit}`;
            } else {
                const winnerIndex = parseInt(lastBidder.split(" ")[1]);
                finalWinner = `Supplier ${winnerIndex}`;
                finalProfit = 0;

                AIresult.textContent = `Supplier ${winnerIndex} won at $${currentBid}`;
                profit.textContent = `Your profit: $0`;
            }
        }
        // Store game results
        const gameResult = {
            sessionId: sessionId,
            playerBid: playerBid || null, // might be null if player withdrew
            lowestBid: currentBid,
            winner: finalWinner,
            profit: finalProfit,
            gameMode: "English Open Bid",
            levelDifficulty: "Easy"
        };

        // Send result to backend
        fetch("http://localhost:5000/api/games/save-result", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gameResult)
        })
            .then(res => res.json())
            .then(data => console.log("Game saved:", data))
            .catch(err => console.error("Error saving game:", err));
    }

    window.restartGame = function () {
        const params = new URLSearchParams(window.location.search);
        const mode = params.get("mode");
        const level = params.get("level");

        // Redirect back to setup page with same mode & level
        window.location.href = `../../6 gameSetup/gameSetup.html?mode=${encodeURIComponent(mode)}&level=${encodeURIComponent(level)}`;
    };
};
