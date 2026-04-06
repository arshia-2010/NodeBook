import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/all";
import "./index.css";

gsap.registerPlugin(Flip);
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ── Icons ─────────────────────────────────────────────────────────────
const Ico = {
  Search: () => <svg viewBox="0 0 14 14"><path d="M13.793 12.378l-3.32-3.32a5.454 5.454 0 001.378-3.607C11.851 2.444 9.407 0 6.425 0 3.444 0 1 2.444 1 5.425s2.444 5.425 5.425 5.425a5.454 5.454 0 003.607-1.378l3.32 3.32a1 1 0 101.414-1.414zM2.4 5.425c0-2.22 1.805-4.025 4.025-4.025s4.025 1.805 4.025 4.025-1.805 4.025-4.025 4.025S2.4 7.645 2.4 5.425z"/></svg>,
  Home: () => <svg viewBox="0 0 14 14"><path d="M7 1L1 6v7h4V9h4v4h4V6L7 1z"/></svg>,
  Inbox: () => <svg viewBox="0 0 14 14"><path d="M1.5 2h11v2h-11z M1 5h12l-1 8h-10z"/></svg>,
  Settings: () => <svg viewBox="0 0 14 14"><circle cx="7" cy="7" r="2.5"/><path d="M13 7a5.97 5.97 0 01-1.03 3.33l1.37 1.37-1.41 1.41-1.37-1.37A5.97 5.97 0 017 13a5.97 5.97 0 01-3.33-1.03l-1.37 1.37-1.41-1.41 1.37-1.37A5.97 5.97 0 011 7a5.97 5.97 0 011.03-3.33L.66 2.3 2.07.89l1.37 1.37A5.97 5.97 0 017 1a5.97 5.97 0 013.33 1.03l1.37-1.37 1.41 1.41-1.37 1.37A5.97 5.97 0 0113 7z"/></svg>,
  Page: () => <svg viewBox="0 0 14 14"><path d="M3 1h5l4 4v8H3V1z M8 1v4h4"/></svg>,
  Database: () => <svg viewBox="0 0 14 14"><rect x="1" y="2" width="12" height="3" rx="1"/><rect x="1" y="6" width="12" height="3" rx="1"/><rect x="1" y="10" width="12" height="3" rx="1"/></svg>,
  List: () => <svg viewBox="0 0 14 14"><path d="M4 3h9 M4 7h9 M4 11h9 M1 3h1 M1 7h1 M1 11h1" strokeWidth="1.5" stroke="currentColor"/></svg>,
  CheckList: () => <svg viewBox="0 0 14 14"><rect x="1" y="2" width="3" height="3" rx="0.5"/><rect x="1" y="7" width="3" height="3" rx="0.5"/><path d="M6 3.5h7 M6 8.5h7" strokeWidth="1.5" stroke="currentColor"/></svg>,
  Text: () => <svg viewBox="0 0 14 14"><path d="M2 3h10v2h-4v7h-2v-7h-4z"/></svg>,
  Heading1: () => <svg viewBox="0 0 14 14"><path d="M1 2h2v4h4v-4h2v10h-2v-4h-4v4h-2z" fill="currentColor"/></svg>,
  Heading2: () => <svg viewBox="0 0 14 14"><path d="M1 3h1.5v3h3v-3h1.5v8h-1.5v-3.5h-3v3.5h-1.5z" fill="currentColor"/></svg>,
  Divider: () => <svg viewBox="0 0 14 14"><path d="M1 7h12" stroke="currentColor" strokeWidth="1.5"/></svg>,
  Plus: () => <svg viewBox="0 0 14 14"><path d="M6.5 1v12 M1 6.5h12" stroke="currentColor" strokeWidth="1.5"/></svg>,
  ChevronDown: () => <svg viewBox="0 0 14 14"><path d="M2.5 4.5l4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>,
  Grip: () => <svg viewBox="0 0 14 14"><circle cx="4.5" cy="3" r="1"/><circle cx="9.5" cy="3" r="1"/><circle cx="4.5" cy="7" r="1"/><circle cx="9.5" cy="7" r="1"/><circle cx="4.5" cy="11" r="1"/><circle cx="9.5" cy="11" r="1"/></svg>,
  Share: () => <svg viewBox="0 0 14 14"><path d="M8.5 1v3.5c-4 0-6 2.5-6 6 1.5-2.5 3-3.5 6-3.5v3.5l5-4.75z"/></svg>,
  Clock: () => <svg viewBox="0 0 14 14"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" fill="none"/><path d="M7 3.5v3.5l2 2" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>,
  TextAa: () => <svg viewBox="0 0 14 14"><path d="M2.5 11.5l3-8 3 8m-5-2.5h4 M11.5 11.5v-3m0 0a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>,
  Hash: () => <svg viewBox="0 0 14 14"><path d="M5 2v10 m4-10v10 m-7-7h10 m-10 4h10" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>,
  CirclePlus: () => <svg viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" fill="none"/><path d="M7 4v6 M4 7h6" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>,
  CircleMinus: () => <svg viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" fill="none"/><path d="M4 7h6" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>,
  Book: () => <svg viewBox="0 0 14 14"><path d="M7 2.5v10.5 M7 2.5a3 3 0 00-3-3H1v10.5h3a3 3 0 013 3 M7 2.5a3 3 0 013-3h3v10.5H10a3 3 0 00-3 3" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>,
  Calendar: () => <svg viewBox="0 0 14 14"><rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none"/><path d="M1 5h12 M4 1v3 M10 1v3" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>,
  User: () => <svg viewBox="0 0 14 14"><path d="M7 7a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm-5 6v-1a4 4 0 014-4h2a4 4 0 014 4v1" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>,
  External: () => <svg viewBox="0 0 14 14"><path d="M6 2H2v10h10V8 M13 1v5 M8 1h5 M13 1L7 7" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>,
  Menu: () => <svg viewBox="0 0 14 14"><path d="M1 3h12 M1 7h12 M1 11h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  ChevronsLeft: () => <svg viewBox="0 0 14 14"><path d="M6.5 11l-4-4 4-4 M11.5 11l-4-4 4-4" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>,
  Lock: () => <svg viewBox="0 0 14 14"><path d="M3.5 6V4a3.5 3.5 0 117 0v2 m-9 0h11v7h-11z" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>
};

// ── Constants & Helpers ─────────────────────────────────────────────────────────────────
const BLOCKS = [
  { type: "text",   label: "Text",         desc: "Just start typing with plain text.", icon: Ico.Text },
  { type: "todo",   label: "To-do list",   desc: "Track tasks with a to-do list.",     icon: Ico.CheckList },
  { type: "h1",     label: "Heading 1",    desc: "Big section heading.",               icon: Ico.Heading1 },
  { type: "h2",     label: "Heading 2",    desc: "Medium section heading.",            icon: Ico.Heading2 },
  { type: "h3",     label: "Heading 3",    desc: "Small section heading.",             icon: Ico.Heading2 },
  { type: "bullet", label: "Bulleted list",desc: "Create a simple bulleted list.",     icon: Ico.List },
  { type: "db",     label: "Table view",   desc: "Inline database table.",             icon: Ico.Database },
  { type: "budget", label: "Budget Dual view", desc: "Dual table layout for budget.",  icon: Ico.Database },
  { type: "divider",label: "Divider",      desc: "Visually divide blocks.",            icon: Ico.Divider },
];

function makeBlock(t = "text", val = "") { return { id: uid(), type: t, content: val, checked: false }; }
function makeRow() { return { id: uid(), title: "New task", date: "Today", checked: false }; }
function makeBudgetRow(name="", amt="0.00") { return { id: uid(), title: name, amount: amt }; }

const mockState = {
  pages: [
    { id: "1", title: "Getting Started", icon: "👋", blocks: [makeBlock("h1", "Welcome to Notion!")] },
    { id: "2", title: "To Do List", icon: "✔️", blocks: [
        makeBlock("text", "See finished items in the Done view"),
        makeBlock("db", JSON.stringify([
          { id: "r1", title: "Check the box to mark done", date: "Feb 10, 2026", checked: true },
          { id: "r2", title: "Click me to see details", date: "Feb 10, 2026", checked: false },
          { id: "r3", title: "Click the blue New button", date: "Feb 10, 2026", checked: false }
        ])),
      ]
    },
    { id: "3", title: "Weekly To-do List", icon: "⚡", cover: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1500&q=80",
      blocks: [
        makeBlock("text", "Add your weekly to-dos. You can always add more by typing /todo in an empty space."),
        makeBlock("divider"),
        makeBlock("h2", "March 4 - March 9"),
        makeBlock("todo", "Call Mom"),
        makeBlock("todo", "Book appt"),
      ]
    },
    { id: "4", title: "Monthly Budget", icon: "🪙", cover: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1500&q=80",
      blocks: [
        makeBlock("text", "Use this template to figure out how much you make and spend in a given month. List your income sources for the month and their amount in the Income table and your expenses in the Expenses table. Find your totals at the bottom of each table, labelled SUM."),
        makeBlock("budget", JSON.stringify({
          income: [makeBudgetRow("Salary", "$3,500.00"), makeBudgetRow("Side Gig", "$450.00"), makeBudgetRow("Bday Cash", "$150.00")],
          expenses: [makeBudgetRow("Rent", "$2,000.00"), makeBudgetRow("Groceries", "$150.00"), makeBudgetRow("Dinner with Rachel", "$65.00")]
        }))
      ]
    }
  ]
};

// ── Toast Manager ────────────────────────────────────────────────────────────────
let toastRef = null;
function notify(msg) { toastRef?.(msg); }
function Toaster() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    toastRef = (msg) => {
      const id = uid();
      setToasts(t => [...t, { id, msg }]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2500);
    };
  }, []);
  return (
    <div className="toast-container">
      {toasts.map(t => (<div key={t.id} className="toast">{t.msg}</div>))}
    </div>
  );
}

// ── Components ─────────────────────────────────────────────────────────────────

function BlockDataView({ content, onUpdate }) {
  const [view, setView] = useState("table");
  let rows = [];
  try { rows = JSON.parse(content); } catch (e) { rows = [makeRow()]; }

  const addRow = () => { onUpdate(JSON.stringify([...rows, makeRow()])); };
  const toggle = (id) => { onUpdate(JSON.stringify(rows.map(r => r.id === id ? {...r, checked: !r.checked} : r))); };

  return (
    <div className="db-container">
      <div className="db-tabs">
        <div className={`db-tab ${view === 'table' ? 'active' : ''}`} onClick={() => setView('table')}>Table</div>
        <div className={`db-tab ${view === 'board' ? 'active' : ''}`} onClick={() => setView('board')}>Board</div>
        <div className="db-tab" onClick={() => notify('Views configuration opening...')}><Ico.Plus/></div>
      </div>
      
      {view === 'table' ? (
        <table className="db-grid">
          <thead>
            <tr>
              <th style={{ width: 300 }}><div className="db-col-header"><Ico.Text/> Name</div></th>
              <th><div className="db-col-header"><Ico.Clock/> Date</div></th>
              <th style={{ width: 60 }}><Ico.Plus/></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>
                  <div className="db-cell-title">
                    <div className={`todo-check ${r.checked ? "checked" : ""}`} onClick={() => toggle(r.id)} style={{marginTop:0}}><Ico.ChevronDown/></div>
                    {r.title}
                  </div>
                </td>
                <td style={{ color: "var(--text-muted)" }}>{r.date}</td>
                <td></td>
              </tr>
            ))}
            <tr><td colSpan={3} className="add-row" onClick={addRow}><Ico.Plus/> New</td></tr>
          </tbody>
        </table>
      ) : (
        <div className="board-grid">
          <div className="board-col">
            <div className="board-col-header">To Do <span style={{color:"var(--text-muted)", marginLeft:4, fontWeight:400}}>{rows.filter(x=>!x.checked).length}</span></div>
            {rows.filter(r => !r.checked).map(r => (
              <div key={r.id} className="board-card" onClick={() => toggle(r.id)}>
                <div className="board-card-title">{r.title}</div>
                <div className="board-card-date">{r.date}</div>
              </div>
            ))}
            <div className="add-row" onClick={addRow}><Ico.Plus/> New</div>
          </div>
          <div className="board-col">
            <div className="board-col-header">Done <span style={{color:"var(--text-muted)", marginLeft:4, fontWeight:400}}>{rows.filter(x=>x.checked).length}</span></div>
            {rows.filter(r => r.checked).map(r => (
              <div key={r.id} className="board-card" onClick={() => toggle(r.id)}>
                <div className="board-card-title" style={{textDecoration:'line-through', color:'var(--text-muted)'}}>{r.title}</div>
                <div className="board-card-date">{r.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Hoisted top-level component — fixes focus-loss bug caused by nesting inside BudgetDualView render
function BudgetTable({ title, icon: Icon, color, rows, type, isIncome, onAdd, onUpdateRow, onDeleteRow, calcSum }) {
  const [filterText, setFilterText] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [sortAsc, setSortAsc] = useState(null); // null = unsorted, true = asc, false = desc
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Track history whenever rows change
  const prevRowsRef = useRef(rows);
  useEffect(() => {
    const prev = prevRowsRef.current;
    if (prev !== rows) {
      const now = new Date().toLocaleTimeString();
      if (prev.length < rows.length) {
        setHistory(h => [{ time: now, msg: `Added row "${rows[rows.length-1].title}"` }, ...h].slice(0, 20));
      } else if (prev.length > rows.length) {
        setHistory(h => [{ time: now, msg: `Deleted a row` }, ...h].slice(0, 20));
      } else {
        // Find changed row
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].title !== prev[i]?.title) {
            setHistory(h => [{ time: now, msg: `Renamed "${prev[i]?.title}" → "${rows[i].title}"` }, ...h].slice(0, 20));
            break;
          } else if (rows[i].amount !== prev[i]?.amount) {
            setHistory(h => [{ time: now, msg: `Changed "${rows[i].title}" amount to ${rows[i].amount}` }, ...h].slice(0, 20));
            break;
          }
        }
      }
      prevRowsRef.current = rows;
    }
  }, [rows]);

  let displayed = filterText
    ? rows.filter(r => r.title.toLowerCase().includes(filterText.toLowerCase()))
    : [...rows];

  if (sortAsc === true) displayed.sort((a, b) => a.title.localeCompare(b.title));
  else if (sortAsc === false) displayed.sort((a, b) => b.title.localeCompare(a.title));

  const cycleSort = () => setSortAsc(s => s === null ? true : s === true ? false : null);
  const sortLabel = sortAsc === true ? 'A→Z' : sortAsc === false ? 'Z→A' : 'Sort';

  return (
    <div className="budget-table-wrap">
      <div className="budget-header">
        <div style={{display:'flex', alignItems:'center', gap:8, fontWeight:600, color:"var(--text)"}}>
          <div style={{color}}><Icon/></div> {title}
        </div>
        <div className="budget-actions">
          <span className="budget-action-btn" title="Search" onClick={() => setShowFilter(v => !v)}><Ico.Search/></span>
          <span className="budget-action-btn" title={sortLabel} onClick={cycleSort} style={sortAsc !== null ? {color:'var(--accent)'} : {}}>
            <Ico.List/> {sortAsc !== null && <span style={{fontSize:10, marginLeft:2}}>{sortLabel}</span>}
          </span>
          <span className="budget-action-btn" title="Edit history" onClick={() => setShowHistory(v => !v)} style={showHistory ? {color:'var(--accent)'} : {}}><Ico.Clock/></span>
          <div className="btn-blue" onClick={onAdd}>New <Ico.ChevronDown/></div>
        </div>
      </div>

      {showFilter && (
        <div className="budget-filter-bar">
          <Ico.Search/>
          <input
            autoFocus
            className="db-input"
            placeholder={`Filter ${isIncome ? 'income' : 'expenses'}...`}
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
          {filterText && <span className="budget-filter-clear" onClick={() => setFilterText('')}>✕</span>}
        </div>
      )}

      {showHistory && (
        <div className="budget-history-panel">
          <div className="budget-history-title">Edit History</div>
          {history.length === 0
            ? <div className="budget-history-empty">No edits yet</div>
            : history.map((h, i) => (
              <div key={i} className="budget-history-row">
                <span className="budget-history-time">{h.time}</span>
                <span>{h.msg}</span>
              </div>
            ))
          }
        </div>
      )}

      <table className="db-grid budget-grid">
        <thead>
          <tr>
            <th style={{width: '55%'}}><div className="db-col-header"><Ico.TextAa/> {isIncome ? 'Income Item' : 'Expense Item'}</div></th>
            <th><div className="db-col-header"><Ico.Hash/> Amount</div></th>
            <th style={{ width: 56 }}></th>
          </tr>
        </thead>
        <tbody>
          {displayed.map(r => (
            <tr key={r.id} className="budget-row">
              <td style={{fontWeight:500, color:"var(--text)"}}>
                <div className="db-cell-title">
                  <Ico.Page/>
                  <input
                    className="db-input"
                    value={r.title}
                    onChange={e => onUpdateRow(type, r.id, 'title', e.target.value)}
                  />
                </div>
              </td>
              <td style={{color:"var(--text-dim)"}}>
                <input
                  className="db-input db-input-amount"
                  value={r.amount}
                  onChange={e => onUpdateRow(type, r.id, 'amount', e.target.value)}
                />
              </td>
              <td>
                <span
                  className="budget-delete-btn"
                  title="Delete row"
                  onClick={() => onDeleteRow(type, r.id)}
                >✕</span>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={3} className="add-row" onClick={onAdd} style={{padding: '8px 12px', fontSize: 13, borderBottom:'none'}}>
              <Ico.Plus/> New row
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} style={{textAlign:'right', fontSize:12, color:'var(--text-muted)', paddingTop:12, borderBottom:'none'}}>
              <span className="sum-tag">SUM</span> {calcSum(rows)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function BudgetDualView({ content, onUpdate }) {
  let data = { income: [], expenses: [] };
  try { data = JSON.parse(content); } catch (e) {}

  const updateRow = (type, id, key, val) => {
    onUpdate(JSON.stringify({
      ...data, [type]: data[type].map(r => r.id === id ? { ...r, [key]: val } : r)
    }));
  };

  const deleteRow = (type, id) => {
    onUpdate(JSON.stringify({
      ...data, [type]: data[type].filter(r => r.id !== id)
    }));
  };

  const addInc = () => onUpdate(JSON.stringify({...data, income: [...data.income, makeBudgetRow("New item", "0")]}));
  const addExp = () => onUpdate(JSON.stringify({...data, expenses: [...data.expenses, makeBudgetRow("New item", "0")]}));

  const calcSum = (arr) => {
    let sum = 0;
    arr.forEach(r => {
      const v = parseFloat((r.amount || "0").replace(/[^0-9.-]+/g,""));
      if (!isNaN(v)) sum += v;
    });
    return "$" + sum.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  return (
    <div className="budget-dual-view">
      <BudgetTable
        title="Income ..." icon={Ico.CirclePlus} color="#2ba150"
        rows={data.income || []} type="income" isIncome={true}
        onAdd={addInc} onUpdateRow={updateRow} onDeleteRow={deleteRow} calcSum={calcSum}
      />
      <BudgetTable
        title="Expenses ..." icon={Ico.CircleMinus} color="#e64a4a"
        rows={data.expenses || []} type="expenses" isIncome={false}
        onAdd={addExp} onUpdateRow={updateRow} onDeleteRow={deleteRow} calcSum={calcSum}
      />
    </div>
  );
}

function HomeView({ pages, switchPage }) {
  const greeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 18) return "Good afternoon";
    return "Good evening";
  };

  const learns = [
    { title: "The ultimate guide to Notion templates", img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&q=80", time: "5m read" },
    { title: "Customize & style your content", img: "https://images.unsplash.com/photo-1542435503-956c469947f6?w=500&q=80", time: "9m read" },
    { title: "Getting started with projects and tasks", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80", time: "8m read" },
    { title: "Using Notion for your impact", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80", time: "3m read" }
  ];

  return (
    <div className="home-view">
      <div className="home-greeting">{greeting()}</div>

      <div className="home-section">
        <div className="home-section-title"><Ico.Clock/> Recently visited</div>
        <div className="home-card-grid">
          {pages.map((p, i) => (
            <div key={p.id} className="home-card" onClick={() => switchPage(p.id)}>
              <div className="home-card-cover" style={p.cover ? {backgroundImage: `url(${p.cover})`} : {backgroundColor:'rgba(255,255,255,0.02)'}}>
                 {!p.cover && <div style={{opacity:0.2, margin: 'auto', marginTop: 12}}><Ico.Page/></div>}
              </div>
              <div className="home-card-body">
                <div className="home-card-icon">{p.icon || <Ico.Page/>}</div>
                <div className="home-card-title">{p.title || "Untitled"}</div>
                <div className="home-card-meta">{i===0?'10m':'1h'} ago</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="home-section">
        <div className="home-section-title"><Ico.Book/> Learn</div>
        <div className="home-card-grid">
          {learns.map((l, i) => (
            <div key={i} className="home-card" onClick={() => notify('Opening tutorial...')}>
              <div className="home-card-cover" style={{backgroundImage: `url(${l.img})`, height: 110}}></div>
              <div className="home-card-body">
                <div className="home-card-title">{l.title}</div>
                <div className="home-card-meta"><Ico.Book/> {l.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="home-section">
        <div className="home-section-title"><Ico.Calendar/> Upcoming events</div>
        <div style={{background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding: 24, paddingBottom: 48, color:'var(--text-muted)', fontSize: 13}}>
           Connect AI Meeting Notes...
        </div>
      </div>
    </div>
  );
}

function SearchModal({ pages, onClose, switchPage }) {
  const [query, setQuery] = useState("");
  const [selIdx, setSelIdx] = useState(0);

  // Flatten all pages and content blocks so they are individually searchable
  const searchable = useMemo(() => {
    const arr = [];
    pages.forEach(p => {
      // The page itself
      arr.push({
        type: 'page', id: p.id, pageId: p.id,
        title: p.title || "Untitled", icon: p.icon || <Ico.Page/>,
        path: "Private", parentIcon: null
      });

      // Internal blocks / tasks
      p.blocks.forEach(b => {
        if (['text', 'todo', 'h1', 'h2', 'h3'].includes(b.type) && b.content?.trim()) {
          arr.push({
            type: 'block', id: b.id, pageId: p.id,
            title: b.content, icon: b.type === 'todo' ? <Ico.CheckList/> : <Ico.TextAa/>,
            path: p.title || "Untitled", parentIcon: p.icon || <Ico.Page/>
          });
        }
        if (b.type === 'db') {
           try {
             JSON.parse(b.content).forEach(r => arr.push({
               type: 'db_row', id: r.id, pageId: p.id,
               title: r.title, icon: <Ico.Page/>, path: p.title || "Untitled", parentIcon: p.icon || <Ico.Page/>
             }));
           } catch(e){}
        }
        if (b.type === 'budget') {
           try {
             const bdg = JSON.parse(b.content);
             (bdg.income||[]).forEach(r => arr.push({
               type: 'budget_inc', id: r.id, pageId: p.id,
               title: r.title, icon: <Ico.CirclePlus/>, path: p.title || "Untitled", parentIcon: p.icon || <Ico.Page/>
             }));
             (bdg.expenses||[]).forEach(r => arr.push({
               type: 'budget_exp', id: r.id, pageId: p.id,
               title: r.title, icon: <Ico.CircleMinus/>, path: p.title || "Untitled", parentIcon: p.icon || <Ico.Page/>
             }));
           } catch(e){}
        }
      });
    });
    return arr;
  }, [pages]);

  const filtered = searchable.filter(s => !query || s.title.toLowerCase().includes(query.toLowerCase()));
  
  useEffect(() => { setSelIdx(0); }, [query]);

  const active = filtered[selIdx] || null;

  const handleKeySwap = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelIdx(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (active) { switchPage(active.pageId); onClose(); }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="search-backdrop" onMouseDown={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="search-modal">
        <div className="search-input-wrap">
          <Ico.Search/>
          <input autoFocus placeholder="Search or ask a question in vikash vaibhav's Space..."
                 value={query} onChange={e => setQuery(e.target.value)}
                 onKeyDown={handleKeySwap} />
          <div style={{color:'var(--accent)', cursor:'pointer', border:'1px solid var(--border)', borderRadius:4, padding:'2px 6px', fontSize:11}}>⌘ /</div>
        </div>
        
        <div className="search-filters">
          <span className="search-filter-btn">Aa Title only</span>
          <span className="search-filter-btn"><Ico.User/> Created by <Ico.ChevronDown/></span>
          <span className="search-filter-btn"><Ico.Page/> In <Ico.ChevronDown/></span>
          <span className="search-filter-btn"><Ico.Plus/> Filter</span>
        </div>

        <div className="search-body">
          <div className="search-left">
             <div className="search-section-title">Today</div>
             {filtered.map((s, i) => (
               <div key={s.id} className={`search-res ${i === selIdx ? 'active' : ''}`}
                    onMouseEnter={() => setSelIdx(i)}
                    onClick={() => { switchPage(s.pageId); onClose(); }}>
                 <div className="search-res-icon" style={s.type !== 'page' ? {color: 'var(--text-muted)'} : {}}>{s.icon}</div>
                 <div className="search-res-text">
                    <span className="search-res-title">{s.title}</span>
                    <span className="search-res-path"> — {s.path}</span>
                 </div>
                 {i === selIdx && <div className="search-res-enter">↵</div>}
               </div>
             ))}
             {filtered.length === 0 && <div className="search-res-empty">No results found</div>}
          </div>

          <div className="search-right">
             {active && (
               <div className="search-preview-card">
                 <div className="search-preview-header">
                   <span className="search-preview-action"><Ico.External/></span>
                 </div>
                 <div className="search-preview-main">
                    <div className="search-preview-icon">{active.type === 'page' ? active.icon : active.parentIcon}</div>
                    <div className="search-preview-path">{active.path}</div>
                    <div className="search-preview-title">{active.type === 'page' ? active.title : active.path}</div>
                    {active.type !== 'page' && <div style={{marginTop:12, fontSize:13, color:'var(--text)', borderLeft:'2px solid var(--border)', paddingLeft:8}}>{active.title}</div>}
                 </div>
               </div>
             )}
          </div>
        </div>
        <div className="search-footer">
          <span><span style={{color:'var(--text)', opacity:0.7, marginRight:4}}>Ctrl+↵</span> Open in new tab</span>
          <span style={{marginLeft:'auto'}}><Ico.Settings/></span>
        </div>
      </div>
    </div>
  )
}

function InputBlock({ block, idx, onUpdate, onEnter, onDelete, blockRefs, draggedId, setDraggedId, onReorder, slash, setSlash }) {
  const ta = useRef(null);

  useEffect(() => { blockRefs.current[block.id] = ta.current; });

  const resize = () => {
    if (!ta.current) return;
    ta.current.style.height = "auto";
    ta.current.style.height = ta.current.scrollHeight + "px";
  };
  
  useEffect(() => { resize(); }, [block.content]);

  // Drag handlers
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => setDraggedId(block.id), 0);
  };
  const handleDragOver = (e) => {
    e.preventDefault(); e.dataTransfer.dropEffect = "move";
    e.currentTarget.classList.add('drag-over');
  };
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (draggedId && draggedId !== block.id) {
      onReorder(draggedId, block.id);
    }
    setDraggedId(null);
  };
  const commonDragProps = {
    draggable: true,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
    onDragEnd: () => setDraggedId(null)
  };

  const isDragging = draggedId === block.id;
  const slashActive = slash?.blockId === block.id;

  if (block.type === "divider") {
    return <div className={`block-row ${isDragging?'dragging':''}`} {...commonDragProps}><div className="block-handle"><Ico.Grip/></div> <hr style={{ flex: 1, borderColor: "var(--border)", margin: "12px 0" }}/></div>;
  }
  if (block.type === "db") {
    return <div className={`block-row ${isDragging?'dragging':''}`} {...commonDragProps}><div className="block-handle"><Ico.Grip/></div> <div style={{flex:1, minWidth:0}}><BlockDataView content={block.content} onUpdate={v => onUpdate(block.id, v)} /></div></div>;
  }
  if (block.type === "budget") {
    return <div className={`block-row ${isDragging?'dragging':''}`} {...commonDragProps}><div className="block-handle"><Ico.Grip/></div> <div style={{flex:1, minWidth:0}}><BudgetDualView content={block.content} onUpdate={v => onUpdate(block.id, v)} /></div></div>;
  }

  const checkSlash = (val) => {
    if (val === "/") return { open: true, query: "" };
    if (val.endsWith(" /")) return { open: true, query: "" };
    const lastSlash = val.lastIndexOf("/");
    if (lastSlash !== -1 && !val.slice(lastSlash).includes(" ")) return { open: true, query: val.slice(lastSlash + 1) };
    return null;
  };

  return (
    <div className={`block-row ${isDragging?'dragging':''}`} data-type={block.type} style={{position: 'relative', zIndex: slashActive ? 100 : 1}} {...commonDragProps}>
      <button className="block-handle" onMouseDown={(e)=>e.stopPropagation()} onClick={() => onEnter(block.id)}><Ico.Plus/></button>
      <button className="block-handle" style={{marginLeft:-16, cursor:'grab'}}><Ico.Grip/></button>
      
      {block.type === "bullet" && <span className="block-prefix">•</span>}
      {block.type === "todo" && (
        <div className={`todo-check ${block.checked ? 'checked' : ''}`} onMouseDown={e=>e.stopPropagation()} onClick={() => onUpdate(block.id, block.content, { checked: !block.checked })}>
          <Ico.ChevronDown/>
        </div>
      )}
      <textarea
        ref={ta}
        className="block"
        data-type={block.type}
        value={block.content}
        placeholder={block.type === "text" ? "Type '/' for commands" : block.type}
        rows={1}
        onChange={e => {
          onUpdate(block.id, e.target.value, null, checkSlash(e.target.value));
          resize();
        }}
        onBlur={() => {
          setTimeout(() => { if(window.activeSlashId === block.id) setSlash(null); }, 200);
        }}
        onFocus={() => {
          window.activeSlashId = block.id;
          const s = checkSlash(block.content);
          if (s) onUpdate(block.id, block.content, null, s);
        }}
        onKeyDown={e => {
          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onEnter(block.id); }
          if (e.key === "Backspace" && !e.target.value) { e.preventDefault(); onDelete(block.id); }
        }}
      />
      {slashActive && (
        <div className="slash-menu" style={{ top: 'calc(100% + 4px)', left: 32 }} onMouseDown={e => e.preventDefault()}>
          <div style={{padding: '4px 8px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)'}}>BASIC BLOCKS</div>
          {BLOCKS.filter(b => b.label.toLowerCase().includes(slash.query.toLowerCase())).map((b) => (
            <div
              key={b.type} className="slash-item"
              onClick={() => {
                onUpdate(block.id, '', null);
                setTimeout(() => {
                  onUpdate(block.id, '', { type: b.type });
                  setSlash(null);
                }, 10);
              }}
            >
              <div className="slash-icon">{b.icon()}</div>
              <div className="slash-info">
                <span className="slash-label">{b.label}</span>
                <span className="slash-desc">{b.desc}</span>
              </div>
            </div>
          ))}
          {BLOCKS.filter(b => b.label.toLowerCase().includes(slash.query.toLowerCase())).length === 0 && (
            <div style={{padding: '8px', color: 'var(--text-muted)'}}>No blocks match "{slash.query}"</div>
          )}
        </div>
      )}
    </div>
  );
}

// ── App Core ─────────────────────────────────────────────────────────────────
export default function App() {
  const [pages, setPages] = useState(mockState.pages);
  const [activeId, setActiveId] = useState("3");
  const [slash, setSlash] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarState, setSidebarState] = useState('locked'); // 'locked', 'collapsed', 'floating'
  const blockRefs = useRef({});

  // Global dismiss for slash command tracking
  useEffect(() => {
    const hk = (e) => {
      if (e.key === "Escape") setSlash(null);
    };
    const hc = (e) => {
      if (!e.target.closest('.slash-menu')) setSlash(null);
    }
    document.addEventListener("keydown", hk);
    document.addEventListener("mousedown", hc);
    return () => { document.removeEventListener("keydown", hk); document.removeEventListener("mousedown", hc); };
  }, []);

  const activePage = activeId === 'home' ? null : (pages.find(p => p.id === activeId) || pages[0]);

  const upd = (fn) => setPages(p => fn(p));

  const uTitle = (val) => upd(ps => ps.map(p => p.id === activeId ? { ...p, title: val } : p));
  
  const switchPage = (id) => {
    setActiveId(id);
    setSlash(null);
  };

  const addPage = () => {
    const id = uid();
    const p = { id, title: "", icon: "📄", blocks: [makeBlock("h1", "")] };
    setPages([...pages, p]);
    switchPage(id);
  };

  const uBlock = (id, txt, extraArgs, slashData) => {
    upd(ps => ps.map(p => {
      if (p.id !== activeId) return p;
      return { ...p, blocks: p.blocks.map(b => b.id === id ? { ...b, content: txt, ...extraArgs } : b) };
    }));
    
    if (slashData?.open) {
      const el = blockRefs.current[id];
      const rect = el?.getBoundingClientRect() || { bottom: 0, left: 0 };
      setSlash({ pos: { top: rect.bottom + 5, left: rect.left }, query: slashData.query, blockId: id, txt });
    } else {
      setSlash(null);
    }
  };

  const aBlock = (afterId) => {
    const n = makeBlock();
    upd(ps => ps.map(p => {
      if (p.id !== activeId) return p;
      const idx = p.blocks.findIndex(b => b.id === afterId);
      const bx = [...p.blocks]; bx.splice(idx + 1, 0, n);
      return { ...p, blocks: bx };
    }));
    setSlash(null);
    setTimeout(() => blockRefs.current[n.id]?.focus(), 50);
  };

  const dBlock = (id) => {
    upd(ps => ps.map(p => {
      if (p.id !== activeId || p.blocks.length <= 1) return p;
      const idx = p.blocks.findIndex(b => b.id === id);
      const bx = p.blocks.filter(b => b.id !== id);
      setTimeout(() => blockRefs.current[bx[Math.max(0, idx - 1)]?.id]?.focus(), 50);
      return { ...p, blocks: bx };
    }));
  };

  const reorderBlocks = (dragId, dropTargetId) => {
    upd(ps => ps.map(p => {
      if (p.id !== activeId) return p;
      const bx = [...p.blocks];
      const fromIdx = bx.findIndex(b => b.id === dragId);
      const toIdx = bx.findIndex(b => b.id === dropTargetId);
      if (fromIdx === -1 || toIdx === -1) return p;
      
      const [moved] = bx.splice(fromIdx, 1);
      bx.splice(toIdx, 0, moved);
      return { ...p, blocks: bx };
    }));
  };

  const execSlash = (type) => {
    if (!slash) return;
    const clean = slash.txt.slice(0, slash.txt.lastIndexOf("/"));
    upd(ps => ps.map(p => {
      if (p.id !== activeId) return p;
      return { ...p, blocks: p.blocks.map(b => b.id === slash.blockId ? { ...b, type, content: clean } : b) };
    }));
    setSlash(null);
    setTimeout(() => blockRefs.current[slash.blockId]?.focus(), 50);
  };

  let sidebarClass = "sidebar";
  if (sidebarState === 'collapsed') sidebarClass += " sidebar-collapsed";
  if (sidebarState === 'floating') sidebarClass += " sidebar-floating";

  return (
    <div className="app">
      <Toaster />
      
      {sidebarState !== 'locked' && (
        <div className="sidebar-trigger-btn"
             onMouseEnter={() => setSidebarState('floating')}
             onClick={() => setSidebarState('floating')}
             title="Lock sidebar open (Ctrl+\)">
          <Ico.Menu/>
        </div>
      )}
      
      {sidebarState === 'floating' && (
        <div className="sidebar-backdrop" onClick={() => setSidebarState('collapsed')} />
      )}

      <aside className={sidebarClass} onMouseLeave={() => sidebarState === 'floating' && setSidebarState('collapsed')}>
        <div className="sidebar-inner">
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px 4px'}}>
            <div className="ws-select" onClick={()=>notify('Account switcher opening...')} style={{flex: 1, padding: 0}}>
              <div className="ws-avatar">V</div>
              <div className="ws-name">vikash vaibhav's...</div>
              <div style={{ marginLeft: "auto", color: "var(--text-muted)" }}><Ico.ChevronDown/></div>
            </div>
            <div className="sidebar-lock-btn" onClick={() => setSidebarState(s => s === 'locked' ? 'collapsed' : 'locked')} title="Lock sidebar open">
               {sidebarState === 'locked' ? <Ico.ChevronsLeft/> : <Ico.Lock/>}
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-item" onClick={() => setShowSearch(true)}><Ico.Search/><span className="nav-label">Search</span></div>
            <div className={`nav-item ${activeId === 'home' ? 'active' : ''}`} onClick={() => switchPage('home')}><Ico.Home/><span className="nav-label">Home</span></div>
            <div className="nav-item" onClick={()=>notify('Looking at Inbox...')}><Ico.Inbox/><span className="nav-label">Inbox</span></div>
          </div>

          <div className="nav-group-title">Private</div>
          <div className="add-page-btn" onClick={addPage}><Ico.Plus/> New page</div>
          
          <div className="pages-list">
            {pages.map(p => (
              <div key={p.id} className={`nav-item ${p.id === activeId ? 'active' : ''}`} onClick={() => switchPage(p.id)}>
                <span style={{fontSize:16}}>{p.icon || <Ico.Page/>}</span>
                <span className="nav-label">{p.title || "Untitled"}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="main">
        {activeId === 'home' ? (
          <HomeView pages={pages} switchPage={switchPage} />
        ) : (
          <>
            <header className="topbar">
              <div className="topbar-left">
                <div className="breadcrumb">
                  <div className="bc-item" style={{marginLeft:-4}} onClick={()=>notify('Page settings')}><Ico.Settings/></div>
                  <div className="bc-item">
                    <span>{activePage?.icon}</span> {activePage?.title}
                  </div>
                </div>
                <div className="pill pill-blue">Private</div>
              </div>
              <div className="topbar-right">
                <span style={{ fontSize:12, color:"var(--text-muted)", marginRight:12 }}>Edited just now</span>
                <div className="icon-btn" onClick={()=>notify('Share menu opened')} style={{width: 'auto', padding: '4px 8px'}}><Ico.Share/> <span style={{marginLeft:4}}>Share</span></div>
                <div className="icon-btn" onClick={()=>notify('View page updates')}><Ico.Clock/></div>
                <div className="icon-btn" onClick={()=>notify('More options')}><Ico.Plus/></div>
              </div>
            </header>

            <div className="editor" onClick={(e) => {
                if (e.target.className === 'editor') setSlash(null);
            }}>
              {activePage?.cover && (
                <div className="cover-area">
                  <img
                    src={activePage.cover} alt="cover" className="cover-img"
                    onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                  />
                  <div className="cover-fallback" style={{display:'none'}}>📷 Cover unavailable</div>
                  <button className="cover-btn" onClick={()=>notify('Opening cover picker...')}>Change cover</button>
                </div>
              )}
              <div className="editor-inner">
                
                <div style={{ fontSize: 64, marginBottom: 16 }}>{activePage?.icon}</div>
                
                <textarea
                  className="page-title"
                  value={activePage?.title || ''}
                  onChange={e => {
                    uTitle(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  placeholder="Untitled" rows={1}
                />

                <div className="blocks-wrap">
                  {activePage?.blocks.map((b, i) => (
                    <InputBlock
                      key={b.id} block={b} idx={i}
                      onUpdate={uBlock} onEnter={aBlock} onDelete={dBlock}
                      blockRefs={blockRefs} draggedId={draggedId} setDraggedId={setDraggedId} onReorder={reorderBlocks}
                      slash={slash} setSlash={setSlash}
                    />
                  ))}
                </div>
                <div style={{ height: 100, cursor: "text" }} onClick={() => {
                  if (activePage?.blocks.length) blockRefs.current[activePage.blocks[activePage.blocks.length-1].id]?.focus();
                }}/>
              </div>
            </div>
          </>
        )}
      </main>


      {showSearch && <SearchModal pages={pages} onClose={() => setShowSearch(false)} switchPage={switchPage} />}
    </div>
  );
}