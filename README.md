# Reverse Auction Game (Capstone Project)

## Project Overview  
This project is my **Capstone Project**, developed to simulate a **Reverse Auction Game** that allows players to experience competitive bidding strategies used in real-world procurement scenarios.  

The system models both **Sealed-Bid First-Price** and **Open-Bid English Auctions**, where the player competes against AI-driven suppliers that adapt their behavior based on the difficulty level.  
The project demonstrates the integration of **game theory, user interaction, and artificial intelligence** in a web-based environment.

---

## Game Concept  
In a reverse auction, multiple suppliers compete by submitting bids to win a buyer’s contract. The supplier with the **lowest bid** wins the auction.  

This game allows the player to act as one of the suppliers and experience different auction types and AI competitiveness levels.  

### **Key Game Modes**
- **Sealed-Bid First-Price Auction** – Players submit a single hidden bid without seeing competitors’ bids.  
- **Open-Bid English Auction** – Bidding continues in rounds until one supplier wins.

### **Difficulty Levels**
- **Easy:** AI bids are relaxed and leave more profit margin for the player.  
- **Normal:** AI becomes moderately competitive with tighter bidding behavior.  
- **Hard:** AI acts strategically and aggressively, mirroring real procurement dynamics.

---

## Key Features
- Two auction modes: **Sealed-Bid First-Price** and **Open-Bid English Auction**  
- Three difficulty levels: **Easy, Normal, Hard**  
- Intelligent AI supplier simulation  
- Buyer reputation and cost-based strategy system  
- Interactive feedback messages and detailed results display  
- Modern UI with clean transitions and hover effects

---

## System Architecture and Technologies Used

### **Front-End Development**
- **HTML:** Used to create the overall structure and layout of the game’s web pages, including menus, forms, and gameplay screens.  
- **CSS:** Applied for styling and visual consistency, ensuring a **modern, clean, and responsive design**. Smooth hover animations and dynamic highlights enhance the user experience.  
- **JavaScript (Frontend):** Handles user interactions such as bid inputs, UI updates, and dynamic displays during auction gameplay.  

### **Back-End Development**
- **Node.js & Express.js:** Power the game logic and backend APIs. They handle AI behavior simulation, bid evaluations, and communication between the frontend and database.  
- **Custom AI Algorithms:** Written in JavaScript to simulate realistic supplier bidding behavior that varies by difficulty level.

### **Database Management**
- **MongoDB:** Used to store game data such as user bids, auction results, and historical records. This enables tracking and comparison of multiple auction sessions.

---

## Live Demo  
A link for the full game will be published soon

---

## Author
**Yazan El-Taha**
  
  Software Engineering Student – Capstone Project
  
  Developed with HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB.
