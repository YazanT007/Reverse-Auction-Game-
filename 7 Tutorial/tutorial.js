const mediaContainer = document.querySelector(".media-container");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

// 🖼️ Media sequence: 2 videos + images
const media = [
  { type: "video", src: "../zimages/tutVid1.mp4" },
  { type: "video", src: "../zimages/tutVid2.mp4" },
  { type: "image", src: "../zimages/tutPic3.png" },
  { type: "image", src: "../zimages/tutPic4.png" },
  { type: "image", src: "../zimages/tutPic5.png" },
  { type: "image", src: "../zimages/tutPic7.png" },
  { type: "image", src: "../zimages/tutPic8.png" },
  { type: "image", src: "../zimages/tutPic9.png" },
  { type: "image", src: "../zimages/tutPic10.png" },
  { type: "image", src: "../zimages/tutPic11.png" }
  
];

let currentIndex = 0;

// Function to show current media
function showMedia(index) {
  mediaContainer.innerHTML = ""; // Clear old content

  const item = media[index];
  let element;

  if (item.type === "video") {
    element = document.createElement("video");
    element.src = item.src;
    element.autoplay = true;
    element.loop = true;
    element.muted = true;
    element.classList.add("tutorial-media");
  } else {
    element = document.createElement("img");
    element.src = item.src;
    element.classList.add("tutorial-media");
  }

  mediaContainer.appendChild(element);
}

// Navigation
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % media.length;
  showMedia(currentIndex);
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + media.length) % media.length;
  showMedia(currentIndex);
});

// Initial load
showMedia(currentIndex);
