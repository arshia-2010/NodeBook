import { useState, useRef, useEffect } from "react";

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const initialPages = [
  { id: uid(), title: "", blocks: [{ id: uid(), content: "" }] }
];

function App() {
  const [pages, setPages] = useState(initialPages);
  const [activePageId, setActivePageId] = useState(pages[0].id);
  const blockRefs = useRef({});

  const activePage = pages.find((p) => p.id === activePageId) ?? pages[0];

  const updateTitle = (value) =>
    setPages((prev) =>
      prev.map((p) => (p.id === activePageId ? { ...p, title: value } : p))
    );

  const updateBlock = (id, value) =>
    setPages((prev) =>
      prev.map((p) =>
        p.id !== activePageId
          ? p
          : { ...p, blocks: p.blocks.map((b) => (b.id === id ? { ...b, content: value } : b)) }
      )
    );

  const addBlock = (afterId) => {
    const newId = uid();
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== activePageId) return p;
        const idx = p.blocks.findIndex((b) => b.id === afterId);
        const blocks = [...p.blocks];
        blocks.splice(idx + 1, 0, { id: newId, content: "" });
        return { ...p, blocks };
      })
    );
    setTimeout(() => blockRefs.current[newId]?.focus(), 0);
  };

  const deleteBlock = (id) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== activePageId || p.blocks.length === 1) return p;
        const idx = p.blocks.findIndex((b) => b.id === id);
        const blocks = p.blocks.filter((b) => b.id !== id);
        const focusId = blocks[Math.max(0, idx - 1)].id;
        setTimeout(() => blockRefs.current[focusId]?.focus(), 0);
        return { ...p, blocks };
      })
    );
  };

  const addPage = () => {
    const newPage = { id: uid(), title: "", blocks: [{ id: uid(), content: "" }] };
    setPages((prev) => [...prev, newPage]);
    setActivePageId(newPage.id);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-header">
            <span className="logo">NB</span>
            <span className="logo-text">NodeBook</span>
          </div>

          <div className="pages-list">
            {pages.map((page) => (
              <div
                key={page.id}
                className={`page-item ${page.id === activePageId ? "active" : ""}`}
                onClick={() => setActivePageId(page.id)}
              >
                {page.title || "Untitled"}
              </div>
            ))}
          </div>

          <button className="add-page-btn" onClick={addPage}>
            + New page
          </button>
        </aside>

        <main className="editor">
          <div className="editor-inner">
            <input
              className="page-title-input"
              value={activePage.title}
              onChange={(e) => updateTitle(e.target.value)}
              placeholder="Untitled"
              spellCheck={false}
            />

            <div className="blocks">
              {activePage.blocks.map((block) => (
                <Block
                  key={block.id}
                  block={block}
                  blockRefs={blockRefs}
                  isOnly={activePage.blocks.length === 1}
                  onUpdate={updateBlock}
                  onEnter={addBlock}
                  onDelete={deleteBlock}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function Block({ block, blockRefs, isOnly, onUpdate, onEnter, onDelete }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.textContent = block.content;
  }, []); 

  return (
    <div
      ref={(el) => { ref.current = el; blockRefs.current[block.id] = el; }}
      className="block"
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => onUpdate(block.id, e.currentTarget.textContent)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onEnter(block.id);
        }
        if (e.key === "Backspace" && !isOnly && e.currentTarget.textContent === "") {
          e.preventDefault();
          onDelete(block.id);
        }
      }}
    />
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@300;400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0f0f0d;
  --sidebar-bg: #151512;
  --surface: #1c1c19;
  --border: #2a2a25;
  --accent: #c8b560;
  --text: #e8e4d8;
  --text-muted: #6b6757;
  --text-dim: #4a4840;
  --sidebar-w: 220px;
}

html, body, #root { height: 100%; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  -webkit-font-smoothing: antialiased;
}

.app { display: flex; height: 100vh; overflow: hidden; }

.sidebar {
  width: var(--sidebar-w);
  min-width: var(--sidebar-w);
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px 16px;
  border-bottom: 1px solid var(--border);
}

.logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--accent);
  color: #0f0f0d;
  font-size: 11px;
  border-radius: 3px;
  flex-shrink: 0;
}

.logo-text {
  font-size: 12px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.pages-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.page-item {
  padding: 7px 16px;
  cursor: pointer;
  font-size: 12px;
  color: var(--text);
  opacity: 0.75;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: background 0.12s;
}
.page-item:hover { background: var(--surface); opacity: 1; }
.page-item.active {
  background: var(--surface);
  border-left: 2px solid var(--accent);
  padding-left: 14px;
  opacity: 1;
}

.add-page-btn {
  margin: 10px 12px 16px;
  background: none;
  border: 1px dashed var(--border);
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: .06em;
  padding: 8px;
  transition: border-color .15s, color .15s;
}
.add-page-btn:hover { border-color: var(--accent); color: var(--accent); }

.editor {
  flex: 1;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  padding: 60px 32px 80px;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.editor-inner { width: 100%; max-width: 680px; }

.page-title-input {
  background: none;
  border: none;
  outline: none;
  width: 100%;
  font-family: 'Instrument Serif', serif;
  font-size: 36px;
  font-style: italic;
  color: var(--text);
  margin-bottom: 32px;
  caret-color: var(--accent);
}
.page-title-input::placeholder { color: var(--text-dim); }

.blocks { display: flex; flex-direction: column; gap: 2px; }

.block {
  min-height: 1.6em;
  outline: none;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.75;
  color: var(--text);
  caret-color: var(--accent);
  border-radius: 4px;
  padding: 1px 4px;
  transition: background .1s;
  word-break: break-word;
  white-space: pre-wrap;
}
.block:focus { background: rgba(255,255,255,.02); }
`;

export default App;