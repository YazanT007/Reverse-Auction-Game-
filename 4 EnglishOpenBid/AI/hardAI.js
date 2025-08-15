window.onload = function () {
    const cost = Math.floor(Math.random() * 40) + 40;
    const suppliers = Math.floor(Math.random() * 7) + 10; 

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

    let supplierBids = new Array(suppliers).fill(null);
    let activeSuppliers = new Array(suppliers).fill(true);
    let currentBid = null;
    let playerWithdrew = false;
    let lastBidder = "You";
    let SupplierElements = [];
    let lastSupplierIndex = null;


    let relationshipStrengths = [];

    for (let i = 0; i < suppliers; i++) {
        const container = document.createElement("div");
        container.className = "supplier-container";

        const status = document.createElement("p");
        status.id = `ai-status-${i}`;
        status.innerHTML = `Supplier ${i + 1} is bidding<span class="dots">...</span>`;

        const trustContainer = document.createElement("div");
        trustContainer.className = "trust-bar-container";

        const trustFill = document.createElement("div");
        trustFill.className = "trust-bar-fill";

        const knownRelation = Math.random() > 0.25;
        let trust;

        if(knownRelation){
            if(reputation >= 70){
                trust = Math.floor(Math.random() * 66) + 30;
                relationshipStrengths[i] = trust;
                trustFill.style.width = trust + "%";
            }
            else if(reputation >= 45){
                trust = Math.floor(Math.random() * 60) + 27;
                relationshipStrengths[i] = trust;
                trustFill.style.width = trust + "%";
            }
            else{
                trust = Math.floor(Math.random() * 70) + 10;
                relationshipStrengths[i] = trust;
                trustFill.style.width = trust + "%";
            }

            if (trust < 45) {
                trustFill.style.backgroundColor = "crimson";

                }
            else if (trust < 70) {
                trustFill.style.backgroundColor = "goldenrod";
                }
            else {
                trustFill.style.backgroundColor = "limegreen";
            }
        }
        else{
            trustFill.classList.add("unknown");
            trustFill.textContent = "Unknown";
        }

        trustContainer.appendChild(trustFill);
        container.appendChild(status);
        container.appendChild(trustContainer);

        AIBidSection.appendChild(container);
        SupplierElements.push(status);
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
                // Player withdrew, continue AI bidding cycle after a short delay
                setTimeout(() => nextSupplier(0), 700);
            }
            return;
        }

        if (!activeSuppliers[index]) {
            nextSupplier(index + 1);
            return;
        }

        let supplierTrust = relationshipStrengths[index];
        let supplierStatus;
        //case high reputation
        if(reputation >= 70){
            if(supplierTrust >=70 || supplierTrust >=45){
                supplierStatus = "competitive";
            }
            else{
                supplierStatus = "notInterested";
            }
        }
        //case normal reputation
        else if(reputation >= 45){
            if(supplierTrust >=70){
                supplierStatus = "competitive";
            }
            else if (supplierTrust >= 45){
                supplierStatus = "normal";
            }
            else{
                supplierStatus = "notInterested";
            }
        }
        //case low reputation
        else{
            if(supplierTrust >=70){
                supplierStatus = "competitive";
            }
            else{
                supplierStatus = "notInterested";
            }
        }

        let threshold;
        const minNextBid = currentBid - Math.floor(Math.random() * 3) - 5;
        
        if(supplierStatus == "competitive"){
            threshold = cost + Math.floor(Math.random() * 5) + 5;
        }

        else if(supplierStatus == "normal"){
            threshold = cost + Math.floor(Math.random() * 10) + 10;
        }

        else if (supplierStatus == "notInterested") {
            threshold = cost + Math.floor(Math.random() * 10) + 15;
        }
        else{
            threshold = cost + Math.floor(Math.random() * 30) + 5;
        }

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
        if (playerWithdrew){
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

        if(currentBid === null){
            currentBid = cost + 150;
        }

        nextSupplier(0);
    };

    function endAuction() {
        withdrawBtn.disabled = true;
        submitBtn.disabled = true;
        playerBidInput.disabled = true;

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
            } else {
                result.textContent = `You withdrew ❌`;
                AIresult.textContent = `No supplier submitted a bid. No one wins.`;
            }

            profit.textContent = `Your profit: $0`;
            return;
        }


        result.textContent = `${lastBidder} won the contract ✅`;

        if (lastBidder === "You") {
            const playerProfit = currentBid - cost;
            if (playerProfit < 0) {
                AIresult.textContent = "But you lost profit ❌";
            } else {
                AIresult.textContent = "Well done!";
            }
            profit.textContent = `Your profit: $${playerProfit}`;
        } else {
            const winnerIndex = parseInt(lastBidder.split(" ")[1]);
            AIresult.textContent = `Supplier ${winnerIndex} won at $${currentBid}`;
            profit.textContent = `Your profit: $0`;
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
    };
};
