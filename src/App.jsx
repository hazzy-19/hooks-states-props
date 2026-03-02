import { useState, useEffect, useReducer, useRef, useCallback, useMemo, useContext, createContext } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080810; color: #e8e6ff; font-family: 'Syne', sans-serif; min-height: 100vh; }
  :root {
    --accent: #7c6fff; --accent2: #ff6fd8; --accent3: #6fffd4;
    --bg: #080810; --card: #0f0f1e; --border: #1e1e38;
    --mono: 'Space Mono', monospace; --dim: #6b6890;
  }
  .app { max-width: 960px; margin: 0 auto; padding: 40px 20px 120px; }
  .hero { text-align: center; padding: 60px 0 50px; }
  .hero h1 { font-size: clamp(2.4rem, 6vw, 4rem); font-weight: 800; line-height: 1.1;
    background: linear-gradient(135deg, #7c6fff, #ff6fd8, #6fffd4);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .hero p { color: var(--dim); margin-top: 14px; font-size: 1.1rem; }
  .nav { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 48px; }
  .nav button { background: var(--card); border: 1px solid var(--border); color: var(--dim);
    padding: 8px 18px; border-radius: 999px; font-family: var(--mono); font-size: 0.75rem;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.04em; }
  .nav button:hover { border-color: var(--accent); color: var(--accent); }
  .nav button.active { background: var(--accent); border-color: var(--accent); color: #fff; }
  .section { margin-bottom: 72px; }
  .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
  .section-tag { font-family: var(--mono); font-size: 0.7rem; background: var(--accent);
    color: #fff; padding: 4px 10px; border-radius: 4px; letter-spacing: 0.08em; }
  .section-tag.green { background: #1a5c4a; color: var(--accent3); }
  .section-tag.pink { background: #5c1a4a; color: var(--accent2); }
  .section h2 { font-size: 1.7rem; font-weight: 800; }
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; margin-bottom: 20px; }
  .card-head { padding: 18px 24px 14px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px; }
  .card-head .dot { width: 10px; height: 10px; border-radius: 50%; }
  .card-head h3 { font-size: 1rem; font-weight: 600; }
  .card-head .num { font-family: var(--mono); font-size: 0.7rem; color: var(--dim); margin-left: auto; }
  .card-body { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
  @media(max-width:640px) { .card-body { grid-template-columns: 1fr; } }
  .code-panel { background: #05050d; padding: 20px 24px; font-family: var(--mono);
    font-size: 0.78rem; line-height: 1.75; overflow-x: auto; border-right: 1px solid var(--border); }
  .demo-panel { padding: 24px; display: flex; flex-direction: column; gap: 12px;
    justify-content: center; background: #0a0a18; }
  .demo-panel label { font-size: 0.82rem; color: var(--dim); }
  .demo-panel .value { font-family: var(--mono); font-size: 1.4rem; font-weight: 700; color: var(--accent); }
  .demo-panel .value.green { color: var(--accent3); }
  .demo-panel .value.pink { color: var(--accent2); }
  .btn { padding: 9px 20px; border-radius: 8px; border: none; cursor: pointer;
    font-family: var(--mono); font-size: 0.78rem; font-weight: 700; transition: all 0.15s; letter-spacing: 0.04em; }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: #9b8fff; transform: translateY(-1px); }
  .btn-secondary { background: var(--border); color: var(--dim); }
  .btn-secondary:hover { background: #2e2e50; color: #e8e6ff; }
  .btn-danger { background: #3d1a1a; color: #ff7070; }
  .btn-danger:hover { background: #5a2020; }
  .btn-green { background: #1a3d30; color: var(--accent3); }
  .btn-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .kw { color: #ff6fd8; } .fn { color: #7c6fff; } .str { color: #6fffd4; }
  .cm { color: #3a3a5c; } .nl { color: #ffb86c; }
  .concept-box { background: #0c0c1e; border: 1px solid #1e1e38; border-left: 3px solid var(--accent);
    border-radius: 0 12px 12px 0; padding: 16px 20px; margin-bottom: 20px; font-size: 0.9rem;
    line-height: 1.7; color: #b0aed8; }
  .concept-box.green { border-left-color: var(--accent3); }
  .concept-box.pink { border-left-color: var(--accent2); }
  .concept-box strong { color: #e8e6ff; }
  input[type=text], input[type=number] {
    background: #05050d; border: 1px solid var(--border); color: #e8e6ff;
    padding: 8px 12px; border-radius: 8px; font-family: var(--mono); font-size: 0.82rem;
    width: 100%; outline: none; transition: border 0.2s; }
  input:focus { border-color: var(--accent); }
  .tag { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 0.75rem;
    font-family: var(--mono); margin: 2px; }
  .tag-purple { background: #1e1a40; color: var(--accent); }
  .tag-green { background: #0e2a22; color: var(--accent3); }
  .tag-pink { background: #2a0e1e; color: var(--accent2); }
  .list-item { display: flex; gap: 10px; align-items: center; padding: 8px 12px;
    background: #07071a; border: 1px solid var(--border); border-radius: 8px; font-size: 0.85rem; }
  .list-item button { background: none; border: none; color: #ff7070; cursor: pointer;
    font-family: var(--mono); font-size: 0.75rem; margin-left: auto; padding: 2px 8px;
    border-radius: 4px; transition: background 0.15s; }
  .list-item button:hover { background: #3d1a1a; }
  .progress-bar { height: 8px; border-radius: 999px; background: var(--border); overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 999px;
    background: linear-gradient(90deg, var(--accent), var(--accent2)); transition: width 0.4s ease; }
  .ticker { font-family: var(--mono); font-size: 2rem; font-weight: 700; color: var(--accent3); letter-spacing: 0.1em; }
  .scroll-area { max-height: 180px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; padding-right: 4px; }
  .scroll-area::-webkit-scrollbar { width: 4px; }
  .scroll-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  .fade-in { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
`;

// ── SYNTAX HIGHLIGHT HELPERS ──────────────────────────────────────────────────
function K({ c, children }) {
    return <span style={{color: c}}>{children}</span>;
}

function CodeBlock({ lines }) {
    return (
        <div className="code-panel">
            <pre style={{whiteSpace:"pre-wrap"}}>{lines}</pre>
        </div>
    );
}

// ── CARD LAYOUT ───────────────────────────────────────────────────────────────
function Card({ title, num, color, code, demo }) {
    return (
        <div className="card">
            <div className="card-head">
                <div className="dot" style={{background: color}} />
                <h3>{title}</h3>
                <span className="num">{num}</span>
            </div>
            <div className="card-body">
                <CodeBlock lines={code} />
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
            <button className="btn btn-danger" onClick={() => setCount(c => c-1)}>−</button>
            <button className="btn btn-secondary" onClick={() => setCount(0)}>Reset</button>
            <button className="btn btn-primary" onClick={() => setCount(c => c+1)}>+</button>
        </div>
    </>;
}

function ToggleDemo() {
    const [on, setOn] = useState(false);
    return <>
        <label>Status</label>
        <div className="value" style={{color: on?"var(--accent3)":"#ff7070"}}>{on?"ON ●":"OFF ○"}</div>
        <button className="btn btn-primary" onClick={() => setOn(v=>!v)}>Toggle</button>
    </>;
}

function InputDemo() {
    const [text, setText] = useState("");
    return <>
        <label>Controlled input</label>
        <input type="text" value={text} onChange={e=>setText(e.target.value)} placeholder="type here..." />
        <div className="value" style={{fontSize:"0.9rem"}}>"{text}"</div>
        <span className="tag tag-purple">{text.length} chars</span>
    </>;
}

function ObjectDemo() {
    const [user, setUser] = useState({name:"Ada", age:28});
    return <>
        <label>User object</label>
        <div className="value" style={{fontSize:"0.9rem"}}>{user.name}, {user.age}</div>
        <button className="btn btn-primary" onClick={() => setUser(u=>({...u, age:u.age+1}))}>Birthday 🎂</button>
        <button className="btn btn-secondary" onClick={() => setUser({name:"Grace", age:35})}>Switch user</button>
    </>;
}

function ArrayDemo() {
    const [items, setItems] = useState(["React","Hooks"]);
    const [input, setInput] = useState("");
    return <>
        <input type="text" value={input} onChange={e=>setInput(e.target.value)} placeholder="Add item..." />
        <button className="btn btn-primary" onClick={()=>{if(input.trim()){setItems(i=>[...i,input.trim()]);setInput("");}}}>Add</button>
        <div className="scroll-area" style={{maxHeight:100}}>
            {items.map((it,i)=>(
                <div key={i} className="list-item">
                    <span>{it}</span>
                    <button onClick={()=>setItems(a=>a.filter((_,j)=>j!==i))}>✕</button>
                </div>
            ))}
        </div>
    </>;
}

function WizardDemo() {
    const steps = ["Install deps","Setup routes","Add state","Deploy 🚀"];
    const [step, setStep] = useState(1);
    const [done, setDone] = useState([]);
    return <>
        <div className="progress-bar"><div className="progress-fill" style={{width:`${(step/steps.length)*100}%`}}/></div>
        <div style={{fontSize:"0.85rem"}}>{steps[step-1]}</div>
        <div className="btn-row">
            <button className="btn btn-secondary" onClick={()=>setStep(s=>Math.max(1,s-1))}>← Back</button>
            <button className="btn btn-primary" onClick={()=>{setDone(d=>[...d,step]);setStep(s=>Math.min(steps.length,s+1));}}>Next →</button>
        </div>
        <div>{steps.map((_,i)=><span key={i} className={`tag ${done.includes(i+1)?"tag-green":"tag-purple"}`}>{i+1}</span>)}</div>
    </>;
}

// ── HOOK DEMOS ────────────────────────────────────────────────────────────────
function EffectDemo() {
    const [tick, setTick] = useState(0);
    const [running, setRunning] = useState(false);
    useEffect(() => {
        if (!running) return;
        const id = setInterval(() => setTick(t=>t+1), 1000);
        return () => clearInterval(id);
    }, [running]);
    return <>
        <label>useEffect timer + cleanup</label>
        <div className="ticker">{String(tick).padStart(3,"0")}</div>
        <button className="btn btn-primary" onClick={()=>setRunning(r=>!r)}>{running?"⏸ Pause":"▶ Start"}</button>
        <button className="btn btn-secondary" onClick={()=>{setRunning(false);setTick(0);}}>Reset</button>
    </>;
}

function ReducerDemo() {
    const reducer = (state, action) => {
        switch(action.type) {
            case "inc": return {...state, count: state.count + state.step};
            case "dec": return {...state, count: state.count - state.step};
            case "setStep": return {...state, step: action.payload};
            case "reset": return {count:0, step:1};
            default: return state;
        }
    };
    const [state, dispatch] = useReducer(reducer, {count:0, step:1});
    return <>
        <label>Step size</label>
        <input type="number" min={1} max={10} value={state.step}
               onChange={e=>dispatch({type:"setStep",payload:+e.target.value})} style={{width:80}} />
        <div className="value">{state.count}</div>
        <div className="btn-row">
            <button className="btn btn-danger" onClick={()=>dispatch({type:"dec"})}>−{state.step}</button>
            <button className="btn btn-secondary" onClick={()=>dispatch({type:"reset"})}>Reset</button>
            <button className="btn btn-primary" onClick={()=>dispatch({type:"inc"})}>+{state.step}</button>
        </div>
    </>;
}

function RefDemo() {
    const inputRef = useRef(null);
    const renderCount = useRef(0);
    const [val, setVal] = useState("");
    renderCount.current += 1;
    return <>
        <label>useRef — DOM + mutable value</label>
        <input ref={inputRef} type="text" value={val} onChange={e=>setVal(e.target.value)} placeholder="Click Focus Me..." />
        <div className="btn-row">
            <button className="btn btn-primary" onClick={()=>inputRef.current?.focus()}>Focus Me</button>
            <button className="btn btn-secondary" onClick={()=>inputRef.current?.select()}>Select All</button>
        </div>
        <span className="tag tag-purple">Renders: {renderCount.current}</span>
    </>;
}

function MemoDemo() {
    const [num, setNum] = useState(10);
    const [dark, setDark] = useState(false);
    const fib = useMemo(() => {
        const f = n => n <= 1 ? n : f(n-1)+f(n-2);
        return f(Math.min(num,30));
    }, [num]);
    return <>
        <label>useMemo fib({num}) = </label>
        <div className="value" style={{color:"var(--accent3)"}}>{fib}</div>
        <input type="number" min={1} max={30} value={num} onChange={e=>setNum(+e.target.value)} style={{width:80}} />
        <button className="btn btn-secondary" onClick={()=>setDark(d=>!d)}>Toggle theme (no recalc): {dark?"🌙":"☀️"}</button>
    </>;
}

function CallbackDemo() {
    const [count, setCount] = useState(0);
    const items = ["Alpha","Beta","Gamma"];
    const handleClick = useCallback((item) => {
        setCount(c=>c+1);
    }, []);
    return <>
        <label>useCallback — stable fn ref</label>
        <span className="tag tag-purple">Total clicks: {count}</span>
        <div className="btn-row">
            {items.map(item=>(
                <button key={item} className="btn btn-primary" onClick={()=>handleClick(item)}>{item}</button>
            ))}
        </div>
        <div style={{fontSize:"0.78rem",color:"var(--dim)"}}>handleClick reference never changes</div>
    </>;
}

const ThemeCtx = createContext("purple");
function ThemedBox() {
    const theme = useContext(ThemeCtx);
    const c = {purple:"var(--accent)",green:"var(--accent3)",pink:"var(--accent2)"};
    return (
        <div style={{padding:"12px 16px",border:`2px solid ${c[theme]}`,borderRadius:10,textAlign:"center"}}>
            <span style={{fontFamily:"var(--mono)",color:c[theme]}}>Theme: {theme}</span>
        </div>
    );
}
function ContextDemo() {
    const [theme, setTheme] = useState("purple");
    return (
        <ThemeCtx.Provider value={theme}>
            <label>useContext — shared value</label>
            <ThemedBox />
            <div className="btn-row">
                {["purple","green","pink"].map(t=>(
                    <button key={t} className="btn btn-secondary" onClick={()=>setTheme(t)}>{t}</button>
                ))}
            </div>
        </ThemeCtx.Provider>
    );
}

// ── PROP DEMOS ────────────────────────────────────────────────────────────────
function Badge({label, count, color="purple"}) {
    return <span className={`tag tag-${color}`}>{label}: {count}</span>;
}
function BasicPropsDemo() {
    const [n, setN] = useState(42);
    return <>
        <label>Props passed to Badge</label>
        <div className="btn-row">
            <Badge label="Stars" count={n} color="purple" />
            <Badge label="Forks" count={n*2} color="green" />
            <Badge label="Issues" count={3} color="pink" />
        </div>
        <button className="btn btn-primary" onClick={()=>setN(n=>n+1)}>Update stars</button>
    </>;
}

function Btn({children, onClick, variant="primary"}) {
    return <button className={`btn btn-${variant}`} onClick={onClick}>{children}</button>;
}
function ChildrenDemo() {
    const [log, setLog] = useState([]);
    return <>
        <label>children prop — compose anything</label>
        <div className="btn-row">
            <Btn onClick={()=>setLog(l=>[`click @ ${Date.now()%10000}`,...l])}>Click me 🚀</Btn>
            <Btn variant="secondary" onClick={()=>setLog([])}>Clear</Btn>
        </div>
        <div className="scroll-area" style={{maxHeight:90}}>
            {log.map((l,i)=><div key={i} className="tag tag-purple fade-in">{l}</div>)}
        </div>
    </>;
}

function StatCard({title, value, delta, unit=""}) {
    const up = delta >= 0;
    return (
        <div style={{background:"#07071a",border:"1px solid var(--border)",borderRadius:10,padding:"10px 14px"}}>
            <div style={{fontSize:"0.72rem",color:"var(--dim)",fontFamily:"var(--mono)"}}>{title}</div>
            <div style={{fontSize:"1.2rem",fontWeight:700,color:"var(--accent)",fontFamily:"var(--mono)"}}>{value}{unit}</div>
            <div style={{fontSize:"0.72rem",color:up?"var(--accent3)":"#ff7070"}}>{up?"▲":"▼"} {Math.abs(delta)}{unit}</div>
        </div>
    );
}
function SpreadPropsDemo() {
    const [data, setData] = useState([
        {title:"Revenue",value:84200,delta:1200,unit:"$"},
        {title:"Users",value:12400,delta:-300,unit:""},
        {title:"Uptime",value:99.9,delta:0.1,unit:"%"},
    ]);
    return <>
        <label>Spread operator on props</label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {data.map(d=><StatCard key={d.title} {...d} />)}
        </div>
        <button className="btn btn-primary" onClick={()=>setData(d=>d.map(i=>({...i,value:i.value+Math.floor(Math.random()*100),delta:Math.floor(Math.random()*200)-100})))}>Refresh</button>
    </>;
}

function CallbackPropsDemo() {
    const [selected, setSelected] = useState(null);
    function Opt({label, onSelect, sel}) {
        return (
            <div onClick={()=>onSelect(label)} style={{padding:"10px 14px",border:`1px solid ${sel?"var(--accent)":"var(--border)"}`,borderRadius:10,cursor:"pointer",transition:"border 0.2s",background:sel?"#1a1a35":"transparent",fontSize:"0.85rem"}}>
                {sel?"✓ ":""}{label}
            </div>
        );
    }
    return <>
        <label>Callback props — child → parent</label>
        {["Option Alpha","Option Beta","Option Gamma"].map(o=>(
            <Opt key={o} label={o} onSelect={setSelected} sel={selected===o} />
        ))}
        <span className="tag tag-green">Selected: {selected||"none"}</span>
    </>;
}

function DefaultPropsDemo() {
    const [color, setColor] = useState("#7c6fff");
    function Box({bg, label}) {
        return <div style={{background:bg+"22",border:`2px solid ${bg}`,borderRadius:12,padding:"12px 16px",textAlign:"center",fontFamily:"var(--mono)",fontSize:"0.8rem",color:bg}}>{label}</div>;
    }
    return <>
        <label>Default props + props flow down</label>
        <div className="btn-row">
            {["#7c6fff","#6fffd4","#ff6fd8","#ffb86c"].map(c=>(
                <div key={c} onClick={()=>setColor(c)} style={{width:26,height:26,borderRadius:"50%",background:c,cursor:"pointer",border:color===c?"3px solid #fff":"3px solid transparent",transition:"border 0.15s"}} />
            ))}
        </div>
        <Box bg={color} label={`color: "${color}"`} />
    </>;
}

// ── CHEATSHEET ────────────────────────────────────────────────────────────────
function Cheatsheet() {
    const rows = [
        {hook:"useState",does:"Local component data",when:"Any changing data"},
        {hook:"useEffect",does:"Side effects",when:"APIs, timers, subscriptions"},
        {hook:"useReducer",does:"Complex state logic",when:"Many related vars / actions"},
        {hook:"useRef",does:"DOM access / mutable value",when:"Focus, animation, counters"},
        {hook:"useMemo",does:"Cache computation",when:"Expensive calculations"},
        {hook:"useCallback",does:"Cache function ref",when:"Stable refs for children"},
        {hook:"useContext",does:"Global shared state",when:"Theme, auth, language"},
    ];
    return (
        <div className="section">
            <div className="section-header">
                <span className="section-tag" style={{background:"#1a2040",color:"#aaf"}}>CHEATSHEET</span>
                <h2>Hook Quick-Ref</h2>
            </div>
            <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"var(--mono)",fontSize:"0.8rem"}}>
                    <thead>
                    <tr style={{borderBottom:"1px solid var(--border)"}}>
                        {["Hook","Does","Use when"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 16px",color:"var(--dim)"}}>{h}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((r,i)=>(
                        <tr key={i} style={{borderBottom:"1px solid #0f0f20"}}>
                            <td style={{padding:"10px 16px",color:"var(--accent)"}}>{r.hook}</td>
                            <td style={{padding:"10px 16px",color:"#b0aed8"}}>{r.does}</td>
                            <td style={{padding:"10px 16px",color:"var(--dim)"}}>{r.when}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <br/>
            <div className="concept-box">
                <strong>The Golden Mental Model:</strong> Props flow <em>down</em>, events bubble <em>up</em> via callbacks. State lives at the lowest common ancestor that needs it. Hooks let you plug into React's engine — side effects, memoization, shared values — without classes.
            </div>
            <div className="concept-box green">
                <strong>3 Rules of Hooks:</strong> (1) Only call at the <em>top level</em> — not inside loops, ifs, or nested functions. (2) Only call inside React function components or custom hooks. (3) Name custom hooks <em>useSomething</em> so React can enforce rule 1.
            </div>
            <div className="concept-box pink">
                <strong>useState vs useRef:</strong> Need to trigger a re-render when data changes? → <em>useState</em>. Need to remember a value across renders WITHOUT causing a re-render? → <em>useRef</em>. Mutating ref.current is invisible to React.
            </div>
            <div className="concept-box">
                <strong>useMemo vs useCallback:</strong> <em>useMemo</em> caches a computed <em>value</em>. <em>useCallback</em> caches a <em>function</em>. Both accept a deps array and only recompute when deps change. Don't overuse — the memoization itself has a cost.
            </div>
        </div>
    );
}

// ── SECTION DATA ──────────────────────────────────────────────────────────────
const SECTIONS = {
    state: {
        label: "STATE",
        tagClass: "",
        desc: <><strong>State</strong> is data that lives <em>inside</em> a component and can change over time. When state changes, React re-renders that component. Always use the setter function — never mutate state directly.</>,
        cards: [
            {
                title:"Basic counter — number state", num:"01", color:"#7c6fff",
                demo:<CounterDemo/>,
                code:`const [count, setCount] = useState(0)

// Always use functional update when
// new value depends on old value:
setCount(c => c + 1)
setCount(c => c - 1)
setCount(0)  // reset directly`
            },
            {
                title:"Boolean toggle", num:"02", color:"#ff6fd8",
                demo:<ToggleDemo/>,
                code:`const [on, setOn] = useState(false)

// Flip it
setOn(v => !v)

// Conditional rendering
{on ? <Online /> : <Offline />}`
            },
            {
                title:"Controlled input — string state", num:"03", color:"#6fffd4",
                demo:<InputDemo/>,
                code:`const [text, setText] = useState("")

<input
  value={text}
  onChange={e => setText(e.target.value)}
/>

// input is now "controlled" —
// React owns the value`
            },
            {
                title:"Object state — spread to update", num:"04", color:"#ffb86c",
                demo:<ObjectDemo/>,
                code:`const [user, setUser] = useState({
  name: "Ada", age: 28
})

// ALWAYS spread — don't lose keys!
setUser(u => ({ ...u, age: u.age + 1 }))

// Full replace (loses other keys):
setUser({ name: "Grace", age: 35 })`
            },
            {
                title:"Array state — add / remove", num:"05", color:"#7c6fff",
                demo:<ArrayDemo/>,
                code:`const [items, setItems] = useState([])

// Add item (never push directly!)
setItems(i => [...i, newItem])

// Remove by index
setItems(arr =>
  arr.filter((_, j) => j !== idx)
)

// Update one item
setItems(arr =>
  arr.map((it, j) =>
    j === idx ? {...it, done: true} : it
  )
)`
            },
            {
                title:"Multiple state vars — wizard steps", num:"06", color:"#ff6fd8",
                demo:<WizardDemo/>,
                code:`const [step, setStep] = useState(1)
const [done, setDone] = useState([])

// Totally fine to have multiple
// useState calls — each is independent.

// Group into object ONLY if they
// always update together.`
            },
        ]
    },
    hooks: {
        label: "HOOKS",
        tagClass: "green",
        desc: <><strong>Hooks</strong> are functions that let you "hook into" React features from function components. They must be called at the top level (never conditionally) and only inside function components or custom hooks.</>,
        cards: [
            {
                title:"useEffect — side effects & cleanup", num:"07", color:"#6fffd4",
                demo:<EffectDemo/>,
                code:`useEffect(() => {
  if (!running) return

  const id = setInterval(
    () => setTick(t => t + 1), 1000
  )

  // Cleanup runs on unmount or
  // before next effect runs
  return () => clearInterval(id)

}, [running]) // re-run when running changes`
            },
            {
                title:"useReducer — complex state logic", num:"08", color:"#ffb86c",
                demo:<ReducerDemo/>,
                code:`const reducer = (state, action) => {
  switch (action.type) {
    case 'inc':
      return {...state,
        count: state.count + state.step}
    case 'reset':
      return { count: 0, step: 1 }
    default: return state
  }
}

const [state, dispatch] = useReducer(
  reducer, { count: 0, step: 1 }
)

dispatch({ type: 'inc' })`
            },
            {
                title:"useRef — DOM refs & mutable values", num:"09", color:"#7c6fff",
                demo:<RefDemo/>,
                code:`const inputRef = useRef(null)
const renderCount = useRef(0)

// Increment WITHOUT re-rendering
renderCount.current += 1

// Imperatively control DOM
inputRef.current?.focus()
inputRef.current?.select()

<input ref={inputRef} />`
            },
            {
                title:"useMemo — cache expensive calc", num:"10", color:"#ff6fd8",
                demo:<MemoDemo/>,
                code:`const result = useMemo(() => {
  return expensiveFib(num)
}, [num]) // only re-runs when num changes

// Changing unrelated state (e.g. theme)
// will NOT re-run this computation.
// Great for heavy transforms on data.`
            },
            {
                title:"useCallback — stable function refs", num:"11", color:"#6fffd4",
                demo:<CallbackDemo/>,
                code:`const handleClick = useCallback(
  (item) => {
    doSomethingWith(item)
  },
  [] // empty = created once, never again
)

// Why? If you pass a fn as prop to a
// memo'd child, a new fn ref on every
// render breaks memoization.`
            },
            {
                title:"useContext — global shared state", num:"12", color:"#ffb86c",
                demo:<ContextDemo/>,
                code:`// 1. Create context
const ThemeCtx = createContext("purple")

// 2. Wrap tree in Provider
<ThemeCtx.Provider value={theme}>
  <DeepChild /> // any nesting level!
</ThemeCtx.Provider>

// 3. Consume anywhere in tree
function DeepChild() {
  const theme = useContext(ThemeCtx)
}`
            },
        ]
    },
    props: {
        label: "PROPS",
        tagClass: "pink",
        desc: <><strong>Props</strong> are how parent components pass data <em>down</em> to children. They are <strong>read-only</strong> inside the child — never modify props directly. To communicate upward, pass a callback function as a prop.</>,
        cards: [
            {
                title:"Basic props — primitives", num:"13", color:"#ff6fd8",
                demo:<BasicPropsDemo/>,
                code:`function Badge({ label, count, color }) {
  return (
    <span className={\`tag-\${color}\`}>
      {label}: {count}
    </span>
  )
}

<Badge label="Stars" count={42} color="purple" />`
            },
            {
                title:"children prop — slot pattern", num:"14", color:"#7c6fff",
                demo:<ChildrenDemo/>,
                code:`function Button({ children, onClick, variant }) {
  return (
    <button
      className={\`btn-\${variant}\`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// children = whatever you put inside tags
<Button onClick={fn}>Click me 🚀</Button>`
            },
            {
                title:"Spread props — data-driven UI", num:"15", color:"#6fffd4",
                demo:<SpreadPropsDemo/>,
                code:`const data = [
  { title: "Revenue", value: 84200, delta: 1200 },
  { title: "Users",   value: 12400, delta: -300 },
]

// Spread the whole object as props!
{data.map(d => (
  <StatCard key={d.title} {...d} />
))}`
            },
            {
                title:"Callback props — child calls parent", num:"16", color:"#ffb86c",
                demo:<CallbackPropsDemo/>,
                code:`// Parent OWNS the state
const [selected, setSelected] = useState(null)

// Pass the setter as a callback prop
<OptionCard
  onSelect={setSelected}
  isSelected={selected === label}
/>

// Child just calls it:
function OptionCard({ onSelect }) {
  return <div onClick={() => onSelect(label)}>`
            },
            {
                title:"Default props & unidirectional flow", num:"17", color:"#ff6fd8",
                demo:<DefaultPropsDemo/>,
                code:`// Set defaults in destructuring
function Box({ bg = "#7c6fff", label }) {
  return <div style={{ background: bg }}>
    {label}
  </div>
}

// Data flows ONE way: down
// Parent → Child → Grandchild
// To go up: use callback props`
            },
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
                    {Object.entries(SECTIONS).map(([key,s])=>(
                        <button key={key} className={active===key?"active":""} onClick={()=>setActive(key)}>
                            {s.label}
                        </button>
                    ))}
                    <button className={active==="summary"?"active":""} onClick={()=>setActive("summary")}>CHEATSHEET</button>
                </div>

                {active === "summary" ? <Cheatsheet /> : (
                    <div className="section">
                        <div className="section-header">
                            <span className={`section-tag ${sec.tagClass}`}>{sec.label}</span>
                            <h2>{sec.label}</h2>
                        </div>
                        <div className="concept-box">{sec.desc}</div>
                        {sec.cards.map(c=>(
                            <Card key={c.num} title={c.title} num={c.num} color={c.color} code={c.code} demo={c.demo} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}