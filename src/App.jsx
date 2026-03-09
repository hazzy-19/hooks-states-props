import { useState } from "react";

const sections = [
  {
    id: "structure",
    title: "Project Structure",
    icon: "🗂️",
    react: null,
    next: `my-app/
├── app/                  ← replaces src/
│   ├── layout.tsx        ← root layout (like App.jsx)
│   ├── page.tsx          ← homepage = /
│   ├── about/
│   │   └── page.tsx      ← /about route (automatic!)
│   └── blog/
│       ├── page.tsx      ← /blog
│       └── [slug]/
│           └── page.tsx  ← /blog/any-post
├── components/           ← same as React
├── public/               ← static files
└── next.config.ts`,
    note: "Every folder in /app with a page.tsx becomes a URL. No router config needed.",
  },
  {
    id: "routing",
    title: "Routing",
    icon: "🔀",
    react: `// React (manual setup)
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog/:slug" element={<Post />} />
      </Routes>
    </BrowserRouter>
  )
}`,
    next: `// Next.js (file = route, zero config)
// app/page.tsx        → /
// app/about/page.tsx  → /about
// app/blog/[slug]/page.tsx → /blog/:slug

// To read the dynamic param:
export default function Post({
  params
}: {
  params: { slug: string }  // ← TypeScript: just describe the shape
}) {
  return <h1>{params.slug}</h1>
}`,
    note: "Dynamic routes use [brackets]. The folder name becomes the param name.",
  },
  {
    id: "components",
    title: "Server vs Client Components",
    icon: "⚡",
    react: `// React: everything runs in browser`,
    next: `// Next.js: components are SERVER by default
// Server = faster, no JS shipped, can fetch data directly

// app/page.tsx (Server Component — default)
export default async function Page() {
  const data = await fetch('https://api.example.com/posts')
  const posts = await data.json()
  return <ul>{posts.map(p => <li>{p.title}</li>)}</ul>
}

// Need interactivity (useState, onClick, etc)?
// Add "use client" at the top ↓

"use client"  // ← this one line switches it to client

import { useState } from "react"

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}`,
    note: '"use client" is only needed when you use hooks or browser events. Default to server.',
  },
  {
    id: "navigation",
    title: "Navigation & Links",
    icon: "🔗",
    react: `import { Link, useNavigate } from 'react-router-dom'

function Nav() {
  const navigate = useNavigate()
  return (
    <>
      <Link to="/about">About</Link>
      <button onClick={() => navigate('/home')}>Go Home</button>
    </>
  )
}`,
    next: `import Link from 'next/link'
import { useRouter } from 'next/navigation'  // ← note: /navigation not /router

"use client"  // needed for useRouter

function Nav() {
  const router = useRouter()
  return (
    <>
      <Link href="/about">About</Link>
      <button onClick={() => router.push('/home')}>Go Home</button>
    </>
  )
}`,
    note: "next/link works the same as react-router Link. useRouter lives in next/navigation.",
  },
  {
    id: "typescript",
    title: "TypeScript Basics",
    icon: "🔷",
    react: `// React JS — no types
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>
}`,
    next: `// Next.js TS — describe your props in {}
// Think of types as labels that describe what a variable is

// Basic types: string, number, boolean, string[], number[]
// For objects: use an interface

interface ButtonProps {
  label: string        // must be text
  onClick: () => void  // a function that returns nothing
  count?: number       // ? = optional
}

function Button({ label, onClick, count }: ButtonProps) {
  return <button onClick={onClick}>{label} {count}</button>
}

// Arrays of objects:
interface Post {
  id: number
  title: string
  published: boolean
}

const posts: Post[] = []  // array of Post objects`,
    note: "You don't need to type everything. Start with props (the : after the variable name) and build from there.",
  },
  {
    id: "fetching",
    title: "Data Fetching",
    icon: "📡",
    react: `// React: useEffect + useState
import { useState, useEffect } from 'react'

function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false) })
  }, [])

  if (loading) return <p>Loading...</p>
  return <ul>{posts.map(p => <li>{p.title}</li>)}</ul>
}`,
    next: `// Next.js Server Component: just async/await, no hooks needed
export default async function Posts() {
  const res = await fetch('/api/posts')
  const posts: Post[] = await res.json()  // typed!

  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}

// Need loading state? Create app/posts/loading.tsx
// It auto-shows while the page fetches
export default function Loading() {
  return <p>Loading...</p>
}`,
    note: "Server components make data fetching dead simple — async/await directly in the component.",
  },
  {
    id: "layout",
    title: "Layouts",
    icon: "📐",
    react: `// React: manually wrap every page
function App() {
  return (
    <BrowserRouter>
      <Navbar />       {/* repeated on every page */}
      <Routes>...</Routes>
      <Footer />
    </BrowserRouter>
  )
}`,
    next: `// Next.js: app/layout.tsx wraps everything automatically
export default function RootLayout({
  children
}: {
  children: React.ReactNode  // ← TS type for JSX content
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}   {/* each page renders here */}
        <Footer />
      </body>
    </html>
  )
}

// Nested layout: app/dashboard/layout.tsx
// Only wraps /dashboard/* routes`,
    note: "Layouts persist between route changes — perfect for navbars and sidebars.",
  },
];

export default function NextJSGuide() {
  const [active, setActive] = useState("structure");
  const [showReact, setShowReact] = useState(true);

  const current = sections.find((s) => s.id === active);

  return (
    <div style={{
      fontFamily: "'Courier New', monospace",
      background: "#0a0a0f",
      minHeight: "100vh",
      color: "#e2e8f0",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1e293b",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        background: "#0d0d14",
      }}>
        <div style={{
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          borderRadius: "8px",
          padding: "6px 12px",
          fontSize: "13px",
          fontWeight: "bold",
          letterSpacing: "0.05em",
        }}>NEXT.JS</div>
        <span style={{ color: "#475569", fontSize: "13px" }}>React → Next.js transition guide</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          {["#ef4444","#f59e0b","#22c55e"].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div style={{
          width: "220px",
          borderRight: "1px solid #1e293b",
          padding: "16px 0",
          background: "#0d0d14",
          flexShrink: 0,
        }}>
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              padding: "10px 20px",
              background: active === s.id ? "#1e293b" : "transparent",
              border: "none",
              borderLeft: active === s.id ? "2px solid #3b82f6" : "2px solid transparent",
              color: active === s.id ? "#e2e8f0" : "#64748b",
              cursor: "pointer",
              fontSize: "13px",
              textAlign: "left",
              transition: "all 0.15s",
            }}>
              <span>{s.icon}</span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          <div style={{ maxWidth: "860px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", color: "#f1f5f9" }}>
                {current.icon} {current.title}
              </h2>
              {current.react && (
                <div style={{ display: "flex", background: "#1e293b", borderRadius: "8px", padding: "3px" }}>
                  {["React","Next.js"].map((label, i) => (
                    <button key={label} onClick={() => setShowReact(i === 0)} style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      border: "none",
                      fontSize: "12px",
                      cursor: "pointer",
                      background: (i === 0) === showReact ? (i === 0 ? "#0ea5e9" : "#8b5cf6") : "transparent",
                      color: (i === 0) === showReact ? "#fff" : "#64748b",
                      transition: "all 0.15s",
                    }}>{label}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Code Block */}
            <div style={{
              background: "#111827",
              borderRadius: "12px",
              border: "1px solid #1e293b",
              overflow: "hidden",
            }}>
              <div style={{
                padding: "10px 16px",
                background: "#0f172a",
                borderBottom: "1px solid #1e293b",
                fontSize: "12px",
                color: "#475569",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                <span style={{ color: current.react && !showReact ? "#8b5cf6" : "#0ea5e9" }}>●</span>
                {current.react
                  ? (showReact ? "React equivalent" : "Next.js way")
                  : "Next.js project tree"}
              </div>
              <pre style={{
                margin: 0,
                padding: "20px",
                fontSize: "13px",
                lineHeight: "1.7",
                overflowX: "auto",
                color: "#a5f3fc",
                whiteSpace: "pre",
              }}>
                {current.react
                  ? (showReact ? current.react : current.next)
                  : current.next}
              </pre>
            </div>

            {/* Note */}
            <div style={{
              marginTop: "16px",
              padding: "14px 18px",
              background: "#0f2030",
              border: "1px solid #1e3a5f",
              borderRadius: "8px",
              fontSize: "13px",
              color: "#7dd3fc",
              display: "flex",
              gap: "10px",
            }}>
              <span>💡</span>
              <span>{current.note}</span>
            </div>

            {/* Quick mental model */}
            {active === "components" && (
              <div style={{
                marginTop: "16px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}>
                {[
                  { label: "Server Component", when: "Default. Data fetching, static UI, no interactivity", color: "#8b5cf6" },
                  { label: "Client Component", when: 'Add "use client". Hooks, events, browser APIs', color: "#0ea5e9" },
                ].map(item => (
                  <div key={item.label} style={{
                    padding: "14px",
                    background: "#111827",
                    border: `1px solid ${item.color}40`,
                    borderRadius: "8px",
                  }}>
                    <div style={{ color: item.color, fontSize: "12px", fontWeight: "bold", marginBottom: "6px" }}>{item.label}</div>
                    <div style={{ color: "#94a3b8", fontSize: "12px" }}>{item.when}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
