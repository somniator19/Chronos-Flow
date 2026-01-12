# ⏳ Chronos-Flow

Chronos-Flow is a lightweight meeting planner that visualizes time-based events and highlights scheduling conflicts using **cluster logic**.

It supports:
- 📋 **List view** — readable meeting summaries
- 📊 **Range view** — timeline-based visualization
- ⚠️ **Conflict detection** — overlapping meetings are clustered
- 🎛️ **Filters & sorting** — focus on what matters

The goal of the project is to explore **time interval overlap**, **pairwise intersection**, and **conflict clustering**, while keeping the UI simple and readable.

## Features

- 🧠 Automatic conflict clustering  
- ⏱️ Time-based sorting (start / end)  
- 🔍 “Conflicts only” filter  
- 🧩 Modular rendering logic (list vs range views)  
- 🎨 Clean, minimal UI with visual conflict cues  

---

## Tech Stack

- **HTML5**
- **CSS3**
- **Vanilla JavaScript (ES6+)**
- No external frameworks — logic-first design

---

##  How to Run

1. Clone the repository
2. Open `index.html` (or use Live Server)
3. Add meetings and explore conflict behavior

---

## Notes

- Meetings are grouped into **conflict clusters** when their time intervals overlap.
- Range view visually maps meetings onto a timeline.
- Invalid or malformed meetings are safely skipped with warnings.

---

## Credits

- 🌿 **Iran & Eliza** — HTML structure and CSS styling  
- 🧠 **Eva** — conflict clustering logic  
- 🔧 **Tim** — documentation, debugging, merging, pairwise intersection logic  
- 🧩 **Lilia** — assistance with pairwise intersection logic  

---

Built with logic, patience, and respect for time itself ⏳

