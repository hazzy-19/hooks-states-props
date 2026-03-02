import { useState, useEffect, useReducer, useRef, useCallback, useMemo, useContext, createContext } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; }
  body { background: #060d0d; color: #e0f0ee; font-family: 'Syne', sans-serif; min-height: 100vh; }
  :root {
    --accent: #2dd4bf;
    --accent-dark: #0f9d8a;
    --accent-dim: #134e48;
    --accent2: #f472b6;
    --accent3: #fbbf24;
    --bg: #060d0d;
    --card: #0a1514;
    --border: #163030;
    --mono: 'Space Mono', monospace;
    --dim: #4a7a74;
    --text: #e0f0ee;
    --text-muted: #8ab8b3;
  }

  .app { max-width: 960px; margin: 0 auto; padding: 32px 16px 100px; }
  @media(min-width:600px) { .app { padding: 40px 24px 120px; } }

  /* HERO */
  .hero { text-align: center; padding: 40px 0 36px; }
  @media(min-width:600px) { .hero { padding: 60px 0 50px; } }
  .hero h1 {
    font-size: clamp(2rem, 7vw, 3.8rem); font-weight: 800; line-height: 1.1;
    color: var(--accent);
  }
  .hero p { color: var(--dim); margin-top: 12px; font-size: clamp(0.9rem, 3vw, 1.1rem); }

  /* NAV */
  .nav {
    display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;
    margin-bottom: 36px;
  }
  .nav button {
    background: var(--card); border: 1px solid var(--border); color: var(--dim);
    padding: 10px 16px; border-radius: 999px; font-family: var(--mono); font-size: 0.72rem;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.05em; touch-action: manipulation;
    min-height: 40px;
  }
  @media(min-width:400px) { .nav button { padding: 8px 18px; font-size: 0.75rem; } }
  .nav button:hover { border-color: var(--accent); color: var(--accent); }
  .nav button.active { background: var(--accent); border-color: var(--accent); color: #060d0d; font-weight: 700; }

  /* SECTION */
  .section { margin-bottom: 60px; }
  .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
  .section-tag {
    font-family: var(--mono); font-size: 0.68rem; background: var(--accent); color: #060d0d;
    padding: 4px 10px; border-radius: 4px; letter-spacing: 0.08em; font-weight: 700;
  }
  .section-tag.amber { background: #451a03; color: var(--accent3); }
  .section-tag.pink { background: #4a0a2a; color: var(--accent2); }
  .section h2 { font-size: clamp(1.3rem, 4vw, 1.7rem); font-weight: 800; }

  /* CARDS */
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; margin-bottom: 16px; }
  .card-head {
    padding: 14px 18px 12px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .card-head .dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
  .card-head h3 { font-size: 0.9rem; font-weight: 600; line-height: 1.3; }
  .card-head .num { font-family: var(--mono); font-size: 0.68rem; color: var(--dim); margin-left: auto; flex-shrink: 0; }
  /* On mobile: stack code on top, demo below */
  .card-body { display: flex; flex-direction: column; }
  @media(min-width:640px) { .card-body { display: grid; grid-template-columns: 1fr 1fr; } }

  /* CODE PANEL */
  .code-panel {
    background: #030a09; padding: 18px 20px; font-family: var(--mono);
    font-size: 0.74rem; line-height: 1.8; overflow-x: auto;
    border-bottom: 1px solid var(--border);
  }
  @media(min-width:640px) {
    .code-panel { border-bottom: none; border-right: 1px solid var(--border); font-size: 0.76rem; }
  }
  .code-panel pre { white-space: pre-wrap; word-break: break-word; }

  /* DEMO PANEL */
  .demo-panel {
    padding: 20px 18px; display: flex; flex-direction: column; gap: 12px;
    justify-content: center; background: #080f0f; min-height: 160px;
  }
  .demo-panel label { font-size: 0.8rem; color: var(--dim); }
  .demo-panel .value { font-family: var(--mono); font-size: 1.3rem; font-weight: 700; color: var(--accent); }
  .demo-panel .value.amber { color: var(--accent3); }
  .demo-panel .value.pink { color: var(--accent2); }

  /* BUTTONS */
  .btn {
    padding: 10px 18px; border-radius: 8px; border: none; cursor: pointer;
    font-family: var(--mono); font-size: 0.76rem; font-weight: 700; transition: all 0.15s;
    letter-spacing: 0.04em; touch-action: manipulation; min-height: 40px;
  }
  .btn-primary { background: var(--accent); color: #060d0d; }
  .btn-primary:hover { background: #5eead4; }
  .btn-secondary { background: var(--border); color: var(--text-muted); }
  .btn-secondary:hover { background: #1e3e3e; color: var(--text); }
  .btn-danger { background: #3d1010; color: #f87171; }
  .btn-danger:hover { background: #5a1a1a; }
  .btn-row { display: flex; gap: 8px; flex-wrap: wrap; }

  /* CONCEPT BOX */
  .concept-box {
    background: #080f0f; border: 1px solid var(--border); border-left: 3px solid var(--accent);
    border-radius: 0 10px 10px 0; padding: 14px 18px; margin-bottom: 18px;
    font-size: 0.88rem; line-height: 1.7; color: var(--text-muted);
  }
  .concept-box.amber { border-left-color: var(--accent3); }
  .concept-box.pink { border-left-color: var(--accent2); }
  .concept-box strong { color: var(--text); }
  .concept-box code { font-family: var(--mono); font-size: 0.82rem; color: var(--accent); }

  /* INPUTS */
  input[type=text], input[type=number] {
    background: #030a09; border: 1px solid var(--border); color: var(--text);
    padding: 10px 12px; border-radius: 8px; font-family: var(--mono); font-size: 0.82rem;
    width: 100%; outline: none; transition: border 0.2s;
    -webkit-appearance: none; appearance: none;
  }
  input:focus { border-color: var(--accent); }

  /* TAGS */
  .tag { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 0.74rem; font-family: var(--mono); margin: 2px; }
  .tag-teal { background: #0a2a26; color: var(--accent); }
  .tag-amber { background: #2a1a04; color: var(--accent3); }
  .tag-pink { background: #2a0a18; color: var(--accent2); }

  /* LIST ITEMS */
  .list-item {
    display: flex; gap: 10px; align-items: center; padding: 8px 12px;
    background: #050c0b; border: 1px solid var(--border); border-radius: 8px; font-size: 0.84rem;
  }
  .list-item button {
    background: none; border: none; color: #f87171; cursor: pointer;
    font-family: var(--mono); font-size: 0.75rem; margin-left: auto;
    padding: 4px 8px; border-radius: 4px; transition: background 0.15s; min-height: 32px;
  }
  .list-item button:hover { background: #3d1010; }

  /* MISC */
  .progress-bar { height: 8px; border-radius: 999px; background: var(--border); overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 999px;
    background: var(--accent); transition: width 0.4s ease; }
  .ticker { font-family: var(--mono); font-size: 2rem; font-weight: 700; color: var(--accent); letter-spacing: 0.1em; }
  .scroll-area { max-height: 160px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; padding-right: 4px; }
  .scroll-area::-webkit-scrollbar { width: 4px; }
  .scroll-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  .fade-in { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

  /* CHEATSHEET TABLE */
  .cheat-table { width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.76rem; }
  .cheat-table th { text-align: left; padding: 10px 14px; color: var(--dim); border-bottom: 1px solid var(--border); }
  .cheat-table td { padding: 10px 14px; border-bottom: 1px solid #0d1f1e; }
  .cheat-table td:first-child { color: var(--accent); }
  .cheat-table td:nth-child(2) { color: var(--text-muted); }
  .cheat-table td:last-child { color: var(--dim); }
  @media(max-width:480px) {
    .cheat-table th:last-child, .cheat-table td:last-child { display: none; }
  }
  .table-wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; }
`;

// ── HELPERS ───────────────────────────────────────────────────────────────────
function CodeBlock({ code }) {
    return (
        <div className="code-panel">
            <pre>{code}</pre>
        </div>
    );
}

function Card({ title, num, color, code, demo }) {
    return (
        <div className="card">
            <div className="card-head">
                <div className="dot" style={{ background: color }} />
                <h3>{title}</h3>
                <span className="num">{num}</span>
            </div>
            <div className="card-body">
                <CodeBlock code={code} />
                <div className="demo-panel">{demo}</div>
            </div>
        </div>
    );
}

// ── STATE DEMOS ───────────────────────────────────────────────────────────────
function CounterDemo() {
    const [count, setCount] = useState(0);
    return <>
        <label>Count</label>
        <div className="value">{count}</div>
        <div className="btn-row">
            <button className="btn btn-danger" onClick={() => setCount(c => c - 1)}>−</button>
            <button className="btn btn-secondary" onClick={() => setCount(0)}>Reset</button>
            <button className="btn btn-primary" onClick={() => setCount(c => c + 1)}>+</button>
        </div>
    </>;
}

function ToggleDemo() {
    const [on, setOn] = useState(false);
    return <>
        <label>Status</label>
        <div className="value" style={{ color: on ? "var(--accent)" : "#f87171" }}>{on ? "ON ●" : "OFF ○"}</div>
        <button className="btn btn-primary" onClick={() => setOn(v => !v)}>Toggle</button>
    </>;
}

function InputDemo() {
    const [text, setText] = useState("");
    return <>
        <label>Controlled input</label>
        <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="type here..." />
        <div className="value" style={{ fontSize: "0.9rem" }}>"{text}"</div>
        <span className="tag tag-teal">{text.length} chars</span>
    </>;
}

function ObjectDemo() {
    const [user, setUser] = useState({ name: "Ada", age: 28 });
    return <>
        <label>User object</label>
        <div className="value" style={{ fontSize: "0.9rem" }}>{user.name}, {user.age}</div>
        <button className="btn btn-primary" onClick={() => setUser(u => ({ ...u, age: u.age + 1 }))}>Birthday 🎂</button>
        <button className="btn btn-secondary" onClick={() => setUser({ name: "Grace", age: 35 })}>Switch user</button>
    </>;
}

function ArrayDemo() {
    const [items, setItems] = useState(["React", "Hooks"]);
    const [input, setInput] = useState("");
    return <>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Add item..." />
        <button className="btn btn-primary" onClick={() => { if (input.trim()) { setItems(i => [...i, input.trim()]); setInput(""); } }}>Add</button>
        <div className="scroll-area" style={{ maxHeight: 100 }}>
            {items.map((it, i) => (
                <div key={i} className="list-item">
                    <span>{it}</span>
                    <button onClick={() => setItems(a => a.filter((_, j) => j !== i))}>✕</button>
                </div>
            ))}
        </div>
    </>;
}

function WizardDemo() {
    const steps = ["Install deps", "Setup routes", "Add state", "Deploy 🚀"];
    const [step, setStep] = useState(1);
    const [done, setDone] = useState([]);
    return <>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${(step / steps.length) * 100}%` }} /></div>
        <div style={{ fontSize: "0.85rem" }}>{steps[step - 1]}</div>
        <div className="btn-row">
            <button className="btn btn-secondary" onClick={() => setStep(s => Math.max(1, s - 1))}>← Back</button>
            <button className="btn btn-primary" onClick={() => { setDone(d => [...d, step]); setStep(s => Math.min(steps.length, s + 1)); }}>Next →</button>
        </div>
        <div>{steps.map((_, i) => <span key={i} className={`tag ${done.includes(i + 1) ? "tag-teal" : "tag-amber"}`}>{i + 1}</span>)}</div>
    </>;
}

// ── HOOK DEMOS ────────────────────────────────────────────────────────────────
function EffectDemo() {
    const [tick, setTick] = useState(0);
    const [running, setRunning] = useState(false);
    useEffect(() => {
        if (!running) return;
        const id = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(id);
    }, [running]);
    return <>
        <label>Timer with cleanup</label>
        <div className="ticker">{String(tick).padStart(3, "0")}</div>
        <button className="btn btn-primary" onClick={() => setRunning(r => !r)}>{running ? "⏸ Pause" : "▶ Start"}</button>
        <button className="btn btn-secondary" onClick={() => { setRunning(false); setTick(0); }}>Reset</button>
    </>;
}

function ReducerDemo() {
    const reducer = (state, action) => {
        switch (action.type) {
            case "inc": return { ...state, count: state.count + state.step };
            case "dec": return { ...state, count: state.count - state.step };
            case "setStep": return { ...state, step: action.payload };
            case "reset": return { count: 0, step: 1 };
            default: return state;
        }
    };
    const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });
    return <>
        <label>Step size</label>
        <input type="number" min={1} max={10} value={state.step}
               onChange={e => dispatch({ type: "setStep", payload: +e.target.value })} style={{ width: 80 }} />
        <div className="value">{state.count}</div>
        <div className="btn-row">
            <button className="btn btn-danger" onClick={() => dispatch({ type: "dec" })}>−{state.step}</button>
            <button className="btn btn-secondary" onClick={() => dispatch({ type: "reset" })}>Reset</button>
            <button className="btn btn-primary" onClick={() => dispatch({ type: "inc" })}>+{state.step}</button>
        </div>
    </>;
}

function RefDemo() {
    const inputRef = useRef(null);
    const renderCount = useRef(0);
    const [val, setVal] = useState("");
    renderCount.current += 1;
    return <>
        <label>DOM ref + render counter</label>
        <input ref={inputRef} type="text" value={val} onChange={e => setVal(e.target.value)} placeholder="Click Focus Me..." />
        <div className="btn-row">
            <button className="btn btn-primary" onClick={() => inputRef.current?.focus()}>Focus Me</button>
            <button className="btn btn-secondary" onClick={() => inputRef.current?.select()}>Select All</button>
        </div>
        <span className="tag tag-teal">Renders: {renderCount.current}</span>
    </>;
}

function MemoDemo() {
    const [num, setNum] = useState(10);
    const [dark, setDark] = useState(false);
    const fib = useMemo(() => {
        const f = n => n <= 1 ? n : f(n - 1) + f(n - 2);
        return f(Math.min(num, 30));
    }, [num]);
    return <>
        <label>fib({num}) =</label>
        <div className="value">{fib}</div>
        <input type="number" min={1} max={30} value={num} onChange={e => setNum(+e.target.value)} style={{ width: 80 }} />
        <button className="btn btn-secondary" onClick={() => setDark(d => !d)}>Unrelated state (no recalc): {dark ? "🌙" : "☀️"}</button>
    </>;
}

function CallbackDemo() {
    const [count, setCount] = useState(0);
    const items = ["Alpha", "Beta", "Gamma"];
    const handleClick = useCallback(() => { setCount(c => c + 1); }, []);
    return <>
        <label>Stable function ref</label>
        <span className="tag tag-teal">Total clicks: {count}</span>
        <div className="btn-row">
            {items.map(item => (
                <button key={item} className="btn btn-primary" onClick={handleClick}>{item}</button>
            ))}
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--dim)" }}>handleClick never re-created</div>
    </>;
}

const ThemeCtx = createContext("teal");
function ThemedBox() {
    const theme = useContext(ThemeCtx);
    const c = { teal: "var(--accent)", amber: "var(--accent3)", pink: "var(--accent2)" };
    return (
        <div style={{ padding: "12px 16px", border: `2px solid ${c[theme]}`, borderRadius: 10, textAlign: "center" }}>
            <span style={{ fontFamily: "var(--mono)", color: c[theme] }}>Theme: {theme}</span>
        </div>
    );
}
function ContextDemo() {
    const [theme, setTheme] = useState("teal");
    return (
        <ThemeCtx.Provider value={theme}>
            <label>Shared value via context</label>
            <ThemedBox />
            <div className="btn-row">
                {["teal", "amber", "pink"].map(t => (
                    <button key={t} className="btn btn-secondary" onClick={() => setTheme(t)}>{t}</button>
                ))}
            </div>
        </ThemeCtx.Provider>
    );
}

// ── PROP DEMOS ────────────────────────────────────────────────────────────────
function Badge({ label, count, color = "teal" }) {
    return <span className={`tag tag-${color}`}>{label}: {count}</span>;
}
function BasicPropsDemo() {
    const [n, setN] = useState(42);
    return <>
        <label>Props passed to Badge</label>
        <div className="btn-row">
            <Badge label="Stars" count={n} color="teal" />
            <Badge label="Forks" count={n * 2} color="amber" />
            <Badge label="Issues" count={3} color="pink" />
        </div>
        <button className="btn btn-primary" onClick={() => setN(n => n + 1)}>Update stars</button>
    </>;
}

function Btn({ children, onClick, variant = "primary" }) {
    return <button className={`btn btn-${variant}`} onClick={onClick}>{children}</button>;
}
function ChildrenDemo() {
    const [log, setLog] = useState([]);
    return <>
        <label>children prop</label>
        <div className="btn-row">
            <Btn onClick={() => setLog(l => [`click @ ${Date.now() % 10000}`, ...l])}>Click me 🚀</Btn>
            <Btn variant="secondary" onClick={() => setLog([])}>Clear</Btn>
        </div>
        <div className="scroll-area" style={{ maxHeight: 90 }}>
            {log.map((l, i) => <div key={i} className="tag tag-teal fade-in">{l}</div>)}
        </div>
    </>;
}

function StatCard({ title, value, delta, unit = "" }) {
    const up = delta >= 0;
    return (
        <div style={{ background: "#050c0b", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--dim)", fontFamily: "var(--mono)" }}>{title}</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--mono)" }}>{value}{unit}</div>
            <div style={{ fontSize: "0.7rem", color: up ? "var(--accent)" : "#f87171" }}>{up ? "▲" : "▼"} {Math.abs(delta)}{unit}</div>
        </div>
    );
}
function SpreadPropsDemo() {
    const [data, setData] = useState([
        { title: "Revenue", value: 84200, delta: 1200, unit: "$" },
        { title: "Users", value: 12400, delta: -300, unit: "" },
        { title: "Uptime", value: 99.9, delta: 0.1, unit: "%" },
    ]);
    return <>
        <label>Spread object as props</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {data.map(d => <StatCard key={d.title} {...d} />)}
        </div>
        <button className="btn btn-primary" onClick={() => setData(d => d.map(i => ({ ...i, value: i.value + Math.floor(Math.random() * 100), delta: Math.floor(Math.random() * 200) - 100 })))}>Refresh</button>
    </>;
}

function CallbackPropsDemo() {
    const [selected, setSelected] = useState(null);
    function Opt({ label, onSelect, sel }) {
        return (
            <div onClick={() => onSelect(label)} style={{ padding: "10px 14px", border: `1px solid ${sel ? "var(--accent)" : "var(--border)"}`, borderRadius: 10, cursor: "pointer", transition: "border 0.2s", background: sel ? "#0a2a26" : "transparent", fontSize: "0.85rem" }}>
                {sel ? "✓ " : ""}{label}
            </div>
        );
    }
    return <>
        <label>Callback props — child → parent</label>
        {["Option Alpha", "Option Beta", "Option Gamma"].map(o => (
            <Opt key={o} label={o} onSelect={setSelected} sel={selected === o} />
        ))}
        <span className="tag tag-teal">Selected: {selected || "none"}</span>
    </>;
}

function DefaultPropsDemo() {
    const [color, setColor] = useState("#2dd4bf");
    function Box({ bg, label }) {
        return <div style={{ background: bg + "22", border: `2px solid ${bg}`, borderRadius: 12, padding: "12px 16px", textAlign: "center", fontFamily: "var(--mono)", fontSize: "0.8rem", color: bg }}>{label}</div>;
    }
    return <>
        <label>Default values + data flows down</label>
        <div className="btn-row">
            {["#2dd4bf", "#fbbf24", "#f472b6", "#a78bfa"].map(c => (
                <div key={c} onClick={() => setColor(c)} style={{ width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer", border: color === c ? "3px solid #fff" : "3px solid transparent", transition: "border 0.15s" }} />
            ))}
        </div>
        <Box bg={color} label={`color: "${color}"`} />
    </>;
}

// ── CHEATSHEET ────────────────────────────────────────────────────────────────
function Cheatsheet() {
    const rows = [
        { hook: "useState", does: "Local component data", when: "Any changing data" },
        { hook: "useEffect", does: "Side effects", when: "APIs, timers, subscriptions" },
        { hook: "useReducer", does: "Complex state logic", when: "Many related actions" },
        { hook: "useRef", does: "DOM access / mutable value", when: "Focus, animation, counters" },
        { hook: "useMemo", does: "Cache computation", when: "Expensive calculations" },
        { hook: "useCallback", does: "Cache function ref", when: "Stable refs for children" },
        { hook: "useContext", does: "Global shared state", when: "Theme, auth, language" },
    ];
    return (
        <div className="section">
            <div className="section-header">
                <span className="section-tag">CHEATSHEET</span>
                <h2>Hook Quick-Ref</h2>
            </div>
            <div className="table-wrap">
                <table className="cheat-table">
                    <thead>
                    <tr>
                        {["Hook", "Does", "Use when"].map(h => <th key={h}>{h}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((r, i) => (
                        <tr key={i}>
                            <td>{r.hook}</td>
                            <td>{r.does}</td>
                            <td>{r.when}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <br />
            <div className="concept-box">
                <strong>The Golden Mental Model:</strong> Props flow <em>down</em>, events bubble <em>up</em> via callbacks. State lives at the lowest common ancestor that needs it. Hooks let you plug into React's engine — no classes needed.
            </div>
            <div className="concept-box amber">
                <strong>3 Rules of Hooks:</strong> (1) Only call at the <em>top level</em> — never inside loops, ifs, or nested functions. (2) Only call inside React function components or custom hooks. (3) Name custom hooks <code>useSomething</code>.
            </div>
            <div className="concept-box pink">
                <strong>useState vs useRef:</strong> Need a re-render when data changes? → <code>useState</code>. Need to remember a value WITHOUT re-rendering? → <code>useRef</code>. Mutating <code>ref.current</code> is invisible to React.
            </div>
            <div className="concept-box">
                <strong>useMemo vs useCallback:</strong> <code>useMemo</code> caches a computed <em>value</em>. <code>useCallback</code> caches a <em>function reference</em>. Both take a deps array. Don't overuse — memoization has its own overhead.
            </div>
        </div>
    );
}

// ── SECTION DATA ──────────────────────────────────────────────────────────────
const SECTIONS = {
    state: {
        label: "STATE", tagClass: "",
        desc: <><strong>State</strong> is data that lives <em>inside</em> a component and can change. When state changes, React re-renders. Always use the setter — never mutate state directly. State is local: each component instance has its own copy.</>,
        cards: [
            { title: "Basic counter — number state", num: "01", color: "#2dd4bf", demo: <CounterDemo />, code: `const [count, setCount] = useState(0)\n\n// Functional update — safe when new\n// value depends on old value:\nsetCount(c => c + 1)\nsetCount(c => c - 1)\nsetCount(0)  // reset directly` },
            { title: "Boolean toggle", num: "02", color: "#f472b6", demo: <ToggleDemo />, code: `const [on, setOn] = useState(false)\n\n// Flip it\nsetOn(v => !v)\n\n// Conditional rendering\n{on ? <Online /> : <Offline />}` },
            { title: "Controlled input — string state", num: "03", color: "#fbbf24", demo: <InputDemo />, code: `const [text, setText] = useState("")\n\n<input\n  value={text}\n  onChange={e => setText(e.target.value)}\n/>\n\n// React owns the value now —\n// this is a "controlled input"` },
            { title: "Object state — always spread", num: "04", color: "#2dd4bf", demo: <ObjectDemo />, code: `const [user, setUser] = useState({\n  name: "Ada", age: 28\n})\n\n// ALWAYS spread to keep other keys!\nsetUser(u => ({ ...u, age: u.age + 1 }))\n\n// Full replace (loses other keys):\nsetUser({ name: "Grace", age: 35 })` },
            { title: "Array state — add / remove", num: "05", color: "#f472b6", demo: <ArrayDemo />, code: `const [items, setItems] = useState([])\n\n// Add (never .push directly!)\nsetItems(i => [...i, newItem])\n\n// Remove by index\nsetItems(arr =>\n  arr.filter((_, j) => j !== idx)\n)\n\n// Update one item\nsetItems(arr =>\n  arr.map((it, j) =>\n    j === idx ? {...it, done: true} : it\n  )\n)` },
            { title: "Multiple state vars — wizard", num: "06", color: "#fbbf24", demo: <WizardDemo />, code: `const [step, setStep] = useState(1)\nconst [done, setDone] = useState([])\n\n// Fine to have many useState calls.\n// Each one is completely independent.\n\n// Group into one object ONLY when\n// they always update together.` },
        ]
    },
    hooks: {
        label: "HOOKS", tagClass: "amber",
        desc: <><strong>Hooks</strong> are functions that let you "hook into" React features from function components. Rules: call only at the <strong>top level</strong> (never in loops or ifs), and only inside <strong>function components</strong> or custom hooks.</>,
        cards: [
            { title: "useEffect — side effects & cleanup", num: "07", color: "#2dd4bf", demo: <EffectDemo />, code: `useEffect(() => {\n  if (!running) return\n\n  const id = setInterval(\n    () => setTick(t => t + 1), 1000\n  )\n\n  // Cleanup runs before next effect\n  // and on unmount\n  return () => clearInterval(id)\n\n}, [running]) // re-run when running changes` },
            { title: "useReducer — complex state logic", num: "08", color: "#f472b6", demo: <ReducerDemo />, code: `const reducer = (state, action) => {\n  switch (action.type) {\n    case 'inc':\n      return {...state,\n        count: state.count + state.step}\n    case 'reset':\n      return { count: 0, step: 1 }\n    default: return state\n  }\n}\n\nconst [state, dispatch] = useReducer(\n  reducer, { count: 0, step: 1 }\n)\n\ndispatch({ type: 'inc' })` },
            { title: "useRef — DOM refs & mutable values", num: "09", color: "#fbbf24", demo: <RefDemo />, code: `const inputRef = useRef(null)\nconst renderCount = useRef(0)\n\n// Mutating .current does NOT\n// trigger a re-render\nrenderCount.current += 1\n\n// Imperatively control DOM\ninputRef.current?.focus()\n\n<input ref={inputRef} />` },
            { title: "useMemo — cache expensive calc", num: "10", color: "#2dd4bf", demo: <MemoDemo />, code: `const result = useMemo(() => {\n  return expensiveFib(num)\n}, [num]) // only recalculates when num changes\n\n// Changing unrelated state (e.g. theme)\n// will NOT re-run this — that's the point` },
            { title: "useCallback — stable function refs", num: "11", color: "#f472b6", demo: <CallbackDemo />, code: `const handleClick = useCallback(\n  (item) => {\n    doSomethingWith(item)\n  },\n  [] // empty = created once forever\n)\n\n// Prevents unnecessary re-renders of\n// memo'd children that receive this fn` },
            { title: "useContext — global shared state", num: "12", color: "#fbbf24", demo: <ContextDemo />, code: `// 1. Create\nconst ThemeCtx = createContext("teal")\n\n// 2. Provide (wrap your tree)\n<ThemeCtx.Provider value={theme}>\n  <AnyDepthChild />\n</ThemeCtx.Provider>\n\n// 3. Consume anywhere\nfunction Child() {\n  const theme = useContext(ThemeCtx)\n}` },
        ]
    },
    props: {
        label: "PROPS", tagClass: "pink",
        desc: <><strong>Props</strong> are how parents pass data <em>down</em> to children. They're <strong>read-only</strong> inside the child. To communicate back up, pass a <strong>callback function</strong> as a prop — the child calls it, the parent reacts.</>,
        cards: [
            { title: "Basic props — primitives", num: "13", color: "#2dd4bf", demo: <BasicPropsDemo />, code: `function Badge({ label, count, color }) {\n  return (\n    <span className={\`tag-\${color}\`}>\n      {label}: {count}\n    </span>\n  )\n}\n\n<Badge label="Stars" count={42} color="teal" />` },
            { title: "children prop — slot pattern", num: "14", color: "#f472b6", demo: <ChildrenDemo />, code: `function Button({ children, onClick, variant }) {\n  return (\n    <button\n      className={\`btn-\${variant}\`}\n      onClick={onClick}\n    >\n      {children}\n    </button>\n  )\n}\n\n// children = whatever lives inside the tags\n<Button onClick={fn}>Click me 🚀</Button>` },
            { title: "Spread props — data-driven UI", num: "15", color: "#fbbf24", demo: <SpreadPropsDemo />, code: `const data = [\n  { title: "Revenue", value: 84200, delta: 1200 },\n  { title: "Users",   value: 12400, delta: -300 },\n]\n\n// Spread entire object as props\n{data.map(d => (\n  <StatCard key={d.title} {...d} />\n))}` },
            { title: "Callback props — child → parent", num: "16", color: "#2dd4bf", demo: <CallbackPropsDemo />, code: `// Parent OWNS the state\nconst [selected, setSelected] = useState(null)\n\n// Pass setter as a prop\n<OptionCard\n  onSelect={setSelected}\n  isSelected={selected === label}\n/>\n\n// Child just calls it:\nfunction OptionCard({ onSelect }) {\n  return <div onClick={() => onSelect(label)}>` },
            { title: "Default props & unidirectional flow", num: "17", color: "#f472b6", demo: <DefaultPropsDemo />, code: `// Defaults in destructuring\nfunction Box({ bg = "#2dd4bf", label }) {\n  return (\n    <div style={{ background: bg }}>\n      {label}\n    </div>\n  )\n}\n\n// Data flows ONE direction: down\n// Parent → Child → Grandchild\n// Up = callback props only` },
        ]
    }
};

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
    const [active, setActive] = useState("state");
    const sec = SECTIONS[active];

    return (
        <>
            <style>{style}</style>
            <div className="app">
                <div className="hero">
                    <h1>React Fundamentals</h1>
                    <p>State · Hooks · Props — interactive examples, no fluff</p>
                </div>
                <div className="nav">
                    {Object.entries(SECTIONS).map(([key, s]) => (
                        <button key={key} className={active === key ? "active" : ""} onClick={() => setActive(key)}>
                            {s.label}
                        </button>
                    ))}
                    <button className={active === "summary" ? "active" : ""} onClick={() => setActive("summary")}>CHEATSHEET</button>
                </div>

                {active === "summary" ? <Cheatsheet /> : (
                    <div className="section">
                        <div className="section-header">
                            <span className={`section-tag ${sec.tagClass}`}>{sec.label}</span>
                            <h2>{sec.label}</h2>
                        </div>
                        <div className="concept-box">{sec.desc}</div>
                        {sec.cards.map(c => (
                            <Card key={c.num} title={c.title} num={c.num} color={c.color} code={c.code} demo={c.demo} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}