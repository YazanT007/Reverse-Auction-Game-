window.onload = function () {
    const cost = Math.floor(Math.random() * 100) + 150;
    const suppliers = Math.floor(Math.random() * 5) + 4;

    document.getElementById("auction-cost").textContent = `Your cost to fulfill the contract is: $${cost}`;
    document.getElementById("auction-suppliers").textContent = `Number of suppliers you are competing with: ${suppliers}`;
    document.getElementById("important-information").textContent = "Your goal here is to submit a bid amount that maximizes your profit.\
    Bidding too low may result in minimal or no profit, while bidding too high could cause you to lose the contract to competing suppliers. ";

    const submitBtn = document.getElementById("submit-bid");
    const playerBidInput = document.getElementById("player-bid");
    const AIBidSection = document.getElementById("AI-bidding-section");
    const result = document.getElementById("result-text");
    const AIresult = document.getElementById("AIWins");
    const profit = document.getElementById("profit");
    const errMsg = document.getElementById("errMsg");

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



    window.submitBid = function () {
        errMsg.textContent = "";
        playerBid = parseFloat(playerBidInput.value);

        if (isNaN(playerBid)) {
            errMsg.textContent = "Please Enter a Valid Number";
            return;
        }

        submitBtn.disabled = true;
        playerBidInput.disabled = true;

        AIBids = [];
        let completedCount = 0;

        for (let i = 0; i < suppliers; i++) {
            const delayBid = Math.floor(Math.random() * 5000) + 2000;

            setTimeout(() => {
                const bidForAI = cost + Math.floor(Math.random() * 20) + 20;
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
                    };
                }
            }, delayBid);
        }
    };

    function revealResults() {
        for (let i = 0; i < suppliers; i++) {
            const para = document.getElementById(`ai-status-${i}`);
            para.textContent = `Supplier ${i + 1} bid: $${AIBids[i]}`;
        }

        let lowestAIBid = Math.min(...AIBids);
        let winningSupplier = AIBids.indexOf(lowestAIBid) + 1;

        let finalWinner;
        let finalProfit;

        if (playerBid < cost) {
            result.textContent = "You Won the Contract ✅";
            AIresult.textContent = "But You Lost Profit ❌";
            finalWinner = "Player";
            finalProfit = playerBid - cost;
        }
        else if (playerBid < lowestAIBid) {
            result.textContent = "You Won the Contract ✅";
            AIresult.textContent = `You outbid Supplier ${winningSupplier}`;
            finalWinner = "Player";
            finalProfit = playerBid - cost;
        }
        else {
            result.textContent = "You Lost the Contract ❌";
            AIresult.textContent = `Supplier ${winningSupplier} Won With a Bid of $${lowestAIBid}`;
            finalWinner = `Supplier ${winningSupplier}`;
            finalProfit = 0;
        }

        profit.textContent = `Your profit: $${finalProfit}`;
        submitBtn.disabled = true;

        // Store game results
        const gameResult = {
            gameNumber: Date.now(), // temporary unique number
            playerBid: playerBid,
            lowestBid: Math.min(...AIBids, playerBid),
            winner: finalWinner,
            profit: finalProfit,
            gameMode: "Sealed Bid First Price",
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

}

window.restartGame = function () {
    location.reload();
}

