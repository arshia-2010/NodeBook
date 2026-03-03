// import { useState } from "react";
import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [pages, setPages] = useState([
    {
      id: "page-1",
      title: "Untitled",
      blocks: [{ id: "block-1", content: "" }]
    }
  ]);

  const [activePageId, setActivePageId] = useState("page-1");

  const activePage = pages.find(page => page.id === activePageId);

  const updateBlockContent = (blockIndex, value) => {
    setPages(prevPages =>
      prevPages.map(page => {
        if (page.id !== activePageId) return page;

        const updatedBlocks = page.blocks.map((block, index) =>
          index === blockIndex ? { ...block, content: value } : block
        );

        return { ...page, blocks: updatedBlocks };
      })
    );
  };

  const addBlock = (blockIndex) => {
    setPages(prevPages =>
      prevPages.map(page => {
        if (page.id !== activePageId) return page;

        const newBlock = {
          id: Date.now().toString(),
          content: ""
        };

        const newBlocks = [...page.blocks];
        newBlocks.splice(blockIndex + 1, 0, newBlock);

        return { ...page, blocks: newBlocks };
      })
    );
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>NodeBook</h2>

        <div className="pages">
          {pages.map(page => (
            <div
              key={page.id}
              className={`page-item ${
                page.id === activePageId ? "active" : ""
              }`}
              onClick={() => setActivePageId(page.id)}
            >
              {page.title || "Untitled"}
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            const newPage = {
              id: Date.now().toString(),
              title: "Untitled",
              blocks: [{ id: "block-1", content: "" }]
            };

            setPages([...pages, newPage]);
            setActivePageId(newPage.id);
          }}
        >
          + Add Page
        </button>
      </aside>

      <main className="editor">
        <input
          type="text"
          className="page-title"
          value={activePage.title}
          onChange={(e) => {
            const updatedPages = pages.map(page =>
              page.id === activePageId
                ? { ...page, title: e.target.value }
                : page
            );
            setPages(updatedPages);
          }}
        />

        <div className="blocks">
          {activePage.blocks.map((block, index) => (
            <div
              key={block.id}
              className="block"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) =>
                updateBlockContent(index, e.currentTarget.textContent)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addBlock(index);
                }
              }}
            >
              {block.content}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;