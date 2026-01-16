
# Tetris (Vanilla JavaScript)

This project is a classic implementation of **Tetris**, built from scratch using **HTML5 Canvas and vanilla JavaScript**.
The goal of the project was to understand and implement the core mechanics of a real-time game engine without relying on external libraries or frameworks.

The focus was on correctness, clarity, and learning rather than visual polish.

---

## Features

* Standard **10 × 20 Tetris grid**
* All **7 tetrominoes** (I, O, T, S, Z, J, L)
* Gravity handled using `requestAnimationFrame`
* Keyboard controls for movement and rotation
* Matrix-based rotation logic (clockwise and counter-clockwise)
* Collision detection with walls and placed blocks
* Line clearing logic with support for multiple simultaneous clears
* Scoring based on number of lines cleared
* Game over detection when new pieces cannot be placed
* Deltarune background music with looping playback

---

## Controls

* Arrow Left: Move piece left
* Arrow Right: Move piece right
* Arrow Down: Soft drop
* X: Rotate clockwise
* Z: Rotate counter-clockwise

---

## Core Concepts Implemented

This project was used to practice and understand:

* Game loops and frame timing
* Grid-based collision detection
* Matrix transformations for rotation
* Safe state mutation and rollback
* Array manipulation for line clearing
* Separation of game logic and rendering
* Basic game state management (play, reset, game over)

---

## Technologies Used

* HTML5 Canvas
* JavaScript (ES6)

No external libraries or game engines were used.

---

## How to Run

1. Clone the repository
2. Open `tetris.html` in a browser
   (or use a local development server)

---

## Notes

This project was built as a learning exercise.
All mechanics were implemented manually to better understand how classic games like Tetris work internally.

The code prioritizes readability and correctness over optimization.

---


## Acknowledgement

This project was built with the help of external references used for learning and debugging.
All logic and implementation details were understood and written by me.


