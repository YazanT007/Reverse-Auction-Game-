// Make sure a sessionId exists in localStorage
if (!localStorage.getItem("sessionId")) {
    const newSessionId = "session_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
    localStorage.setItem("sessionId", newSessionId);
}

// Retrieve sessionId
const sessionId = localStorage.getItem("sessionId");

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const level = params.get("level") || "Normal";

    const cost = Math.floor(Math.random() * 40) + 70;
    const suppliers = Math.floor(Math.random() * 6) + 8;

    const reputation = Math.floor(Math.random() * 69) + 30;
    updateReputationMeter(reputation);

    document.getElementById("auction-cost").textContent = `Your cost to fulfill the contract is: $${cost}`;
    document.getElementById("auction-suppliers").textContent = `Number of suppliers you are competing with: ${suppliers}`;

    const submitBtn = document.getElementById("submit-bid");
    const withdrawBtn = document.getElementById("withdraw");
    const playerBidInput = document.getElementById("player-bid");
    const AIBidSection = document.getElementById("AI-bidding-section");
    const result = document.getElementById("result-text");
    const AIresult = document.getElementById("AIWins");
    const profit = document.getElementById("profit");
    const errMsg = document.getElementById("errMsg");
    const importantInfo = document.getElementById("important-information");

    if (reputation >= 70) {
        importantInfo.textContent = `The buyer's reputation is ${reputation}%. 
    Suppliers are highly motivated and will bid competitively, sensing strong value and trust in the buyer. Bid Carefully`;
    }
    else if (reputation >= 45) {
        importantInfo.textContent = `The buyer's reputation is ${reputation}%. 
        Suppliers view this as an average opportunity and will bid with moderate competitiveness.`;
    }
    else {
        importantInfo.textContent = `The buyer's reputation is ${reputation}%. 
        Suppliers are hesitant and less interested, which may result in higher bids or even withdrawal from the auction. Bid Carfully`;
    }


    let AIBids = [];
    let playerBid = 0;
    let SupplierElements = [];

    for (let i = 0; i < suppliers; i++) {
        const p = document.createElement("p");
        p.id = `ai-status-${i}`;
        p.innerHTML = `Supplier ${i + 1} is bidding<span class="dots">...</span>`;
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

    let playerWithdrew = false;

    window.submitBid = function () {
        errMsg.textContent = "";
        playerBid = parseFloat(playerBidInput.value);

        if (!playerWithdrew) {
            playerBid = parseInt(playerBidInput.value);

            if (isNaN(playerBid) || playerBid === 0) {
                errMsg.textContent = "Please Enter a Valid Number";
                return;
            }
        }
        else {
            playerBid = null;
            errMsg.style.color = '#4ce3d2';
            errMsg.textContent = "You Withdrew From the Auction";
        }

        withdrawBtn.disabled = true;
        submitBtn.disabled = true;
        playerBidInput.disabled = true;

        AIBids = [];
        let completedCount = 0;

        for (let i = 0; i < suppliers; i++) {
            const delayBid = Math.floor(Math.random() * 5000) + 2000;


            setTimeout(() => {


                let bidForAI;

                if (reputation >= 70) {
                    bidForAI = cost + Math.floor(Math.random() * 18) + 10;
                }

                else if (reputation >= 45) {
                    bidForAI = cost + Math.floor(Math.random() * 33) + 13;
                }

                else {
                    const AIWithdrawChance = Math.random();
                    if (AIWithdrawChance < 0.2) {
                        const para = document.getElementById(`ai-status-${i}`);
                        para.textContent = `Supplier ${i + 1} withdrew from the bid.`;
                        completedCount++;
                        if (completedCount === suppliers) {
                            submitBtn.textContent = "Reveal";
                            submitBtn.disabled = false;
                            submitBtn.onclick = function () {
                                revealResults();
                            }
                        }
                        return;
                    }

                    else {
                        bidForAI = cost + Math.floor(Math.random() * 30) + 30;
                    }
                }
                AIBids[i] = bidForAI;

                const para = document.getElementById(`ai-status-${i}`);
                para.textContent = `Supplier ${i + 1} has submitted their bid.`;
                clearInterval(dotIntervals[i]);
                completedCount++;

                if (completedCount === suppliers) {
                    submitBtn.textContent = "Reveal";
                    submitBtn.disabled = false;
                    submitBtn.onclick = function () {
                        revealResults();
                    }
                }
            }, delayBid);
        }
    };

    window.withdraw = function () {
        playerWithdrew = true;
        submitBtn.disabled = true;
        withdrawBtn.disabled = true;
        playerBidInput.disabled = true;
        submitBid();
    }

    function revealResults() {
        for (i = 0; i < suppliers; i++) {
            const para = document.getElementById(`ai-status-${i}`);

            if (AIBids[i] === undefined) {
                para.textContent = `Supplier ${i + 1} withdrew from the bid.`;
            }
            else {
                para.textContent = `Supplier ${i + 1} bid: $${AIBids[i]}`;
            }
        }

        let validBids = AIBids.filter(bid => bid !== undefined);
        let lowestAIBid = Math.min(...validBids);
        let winningSupplier = AIBids.indexOf(lowestAIBid) + 1;
        let finalWinner;
        let finalProfit;
        let finalLowestBid;


        if (playerWithdrew || playerBid === null) {
            result.textContent = "You Withdrew From the Auction ❌";
            AIresult.textContent = `Supplier ${winningSupplier} Won With a Bid of $${lowestAIBid}`;
            finalWinner = `Supplier${winningSupplier}`;
            finalProfit = 0;
            finalLowestBid = lowestAIBid;
        }

        else if (playerBid < cost) {
            result.textContent = "You Won the Contract ✅";
            AIresult.textContent = "But You Lost Profit ❌"
            finalWinner = "Player";
            finalProfit = playerBid - cost;
            finalLowestBid = playerBid
        }
        else if (playerBid < lowestAIBid) {
            result.textContent = "You Won the Contract ✅";
            AIresult.textContent = `You outbid Supplier ${winningSupplier}`;
            finalWinner = "Player";
            finalProfit = playerBid - cost;
            finalLowestBid = playerBid;

        }

        else {
            result.textContent = "You Lost the Contract ❌";
            AIresult.textContent = `Supplier ${winningSupplier} Won With a Bid of $${lowestAIBid}`;
            finalWinner = `Supplier ${winningSupplier}`;
            finalProfit = 0;
            finalLowestBid = lowestAIBid;
        }
        profit.textContent = `Your Profit: $${finalProfit}`;
        submitBtn.disabled = true;

        // Store game results
        const gameResult = {
            sessionId: sessionId,
            playerBid: playerBid,
            lowestBid: finalLowestBid,
            winner: finalWinner,
            profit: finalProfit,
            gameMode: "Sealed Bid First Price",
            levelDifficulty: "Normal"
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

}

function updateReputationMeter(percent) {
    const fill = document.getElementById("reputationFill");

    fill.style.width = percent + "%";
    fill.textContent = percent + "%";

    if (percent < 45) {
        fill.style.backgroundColor = "crimson";
    } else if (percent <= 70) {
        fill.style.backgroundColor = "goldenrod";
    } else {
        fill.style.backgroundColor = "seagreen";
    }
}

window.restartGame = function () {
    location.reload();
}


