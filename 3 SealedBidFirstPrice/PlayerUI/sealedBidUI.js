window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const level = params.get("level");

    if (mode && level) {
        const title = `${mode} - Level ${level}`;
        document.getElementById("title").textContent = title;
        document.title = title;
    }

    const whichLevel = level?.toLowerCase();
    if (whichLevel ==="normal" || whichLevel === "hard"){
        const reputationStatus = document.getElementById("reputation-container");
        if(reputationStatus) reputationStatus.style.display = "block";
    }

    const AIScript = document.createElement("script");
    AIScript.src = `../AI/${level.toLowerCase()}AI.js`;  
    AIScript.onload = () => console.log(`${level} AI loaded successfully.`);
    AIScript.onerror = () => console.error(`Failed to load ${level} AI.`);

    document.body.appendChild(AIScript);
});
