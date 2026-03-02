#  React Fundamentals — Interactive Tutorial

An interactive, single-file React tutorial covering **State**, **Hooks**, and **Props** with 17 live, hands-on examples. No fluff — every concept has working code side-by-side with a live demo you can click, type, and break.

---

##  What's Inside

| Section | Examples | Concepts |
|---|---|---|
| **State** | 6 | `useState` with numbers, booleans, strings, objects, arrays, and multiple vars |
| **Hooks** | 6 | `useEffect`, `useReducer`, `useRef`, `useMemo`, `useCallback`, `useContext` |
| **Props** | 5 | Primitives, `children`, spread, callback props, default values |
| **Cheatsheet** | — | Hook reference table + mental model breakdowns |

---

##  Getting Started

### Option 1 — Online (zero setup, fastest)

1. Go to [stackblitz.com/edit/vitejs-vite-react](https://stackblitz.com/edit/vitejs-vite-react) or [codesandbox.io](https://codesandbox.io)
2. Replace `src/App.jsx` with `react-tutorial.jsx`
3. It runs instantly in the browser — no install needed

### Option 2 — Local with Vite (recommended)

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
```

Replace `src/App.jsx` with `react-tutorial.jsx`, then:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Option 3 — Local with Create React App

```bash
npx create-react-app my-app
cd my-app
```

Replace `src/App.jsx` with `react-tutorial.jsx`, then:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

##  Project Structure

```
react-tutorial.jsx   ← the entire tutorial, self-contained
README.md            ← this file
```

The tutorial is intentionally a **single file** — no extra dependencies, no config, no separate CSS files. Just drop it into any React project and run.

---

##  Concepts Covered

### State
- `useState` with primitive values (numbers, booleans, strings)
- Functional updates (`setState(prev => ...)`) vs direct updates
- Object state with the spread pattern (`{ ...prev, key: newVal }`)
- Array state — immutable add, remove, and update patterns
- Controlled inputs

### Hooks
- `useEffect` — running side effects, the dependency array, and cleanup functions
- `useReducer` — managing related state with actions and a reducer function
- `useRef` — accessing DOM nodes directly and storing mutable values without re-rendering
- `useMemo` — caching expensive computations
- `useCallback` — stabilising function references across renders
- `useContext` + `createContext` — sharing state across the component tree without prop drilling

### Props
- Passing primitives, objects, and functions as props
- The `children` prop and the slot/composition pattern
- Spreading objects as props (`<Component {...data} />`)
- Lifting state up with callback props
- Default prop values via destructuring

---

##  Requirements

- **Node.js** 18+ (for local setup)
- **React** 18+ (peer dependency via Vite or CRA)
- No additional npm packages required

---

##  Fonts

The tutorial loads two Google Fonts at runtime:
- [Syne](https://fonts.google.com/specimen/Syne) — UI headings and body
- [Space Mono](https://fonts.google.com/specimen/Space+Mono) — code panels and values

An internet connection is needed to render them. The tutorial works offline but will fall back to system fonts.

---

##  Tips for Learning

- **Break things on purpose** — remove the cleanup return from `useEffect` and watch the timer leak
- **Comment out deps** — remove items from a `useEffect` dependency array and see stale closure bugs appear
- **Mutate state directly** — try `state.count++` instead of `setState(...)` and watch nothing update
- **The Cheatsheet tab** has mental model summaries for the most commonly confused concepts (`useState` vs `useRef`, `useMemo` vs `useCallback`, the 3 rules of hooks)

---

##  License

MIT — free to use, modify, and share.
