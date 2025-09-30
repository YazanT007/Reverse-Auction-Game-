document.getElementById("setupForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const level = params.get("level");
    const cost = document.getElementById("cost").value;
    const suppliers = document.getElementById("suppliers").value;

    let targetUrl;

    if (mode.includes("Sealed-Bid")) {
        targetUrl = `../3 SealedBidFirstPrice/PlayerUI/sealedBidUI.html`;
    } else if (mode.includes("Open-Bid")) {
        targetUrl = `../4 EnglishOpenBid/PlayerUI/englishBidUI.html`;
    }

    window.location.href = `${targetUrl}?mode=${encodeURIComponent(mode)}&level=${encodeURIComponent(level)}&cost=${cost}&suppliers=${suppliers}`;

});