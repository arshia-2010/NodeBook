// ===== APP STATE =====
let appData = {
  pages: [
    {
      id: "page-1",
      title: "Untitled",
      blocks: [
        { id: "block-1", type: "text", content: "" }
      ]
    }
  ],
  activePageId: "page-1"
};

// ===== DOM ELEMENTS =====
const pagesList = document.getElementById("pagesList");
const addPageBtn = document.getElementById("addPageBtn");
const pageTitleInput = document.getElementById("pageTitle");
const blocksContainer = document.getElementById("blocksContainer");

function renderPages() {
  pagesList.innerHTML = "";

  appData.pages.forEach(page => {
    const pageDiv = document.createElement("div");
    pageDiv.classList.add("page-item");

    if (page.id === appData.activePageId) {
      pageDiv.classList.add("active");
    }

    pageDiv.textContent = page.title || "Untitled";

    pageDiv.addEventListener("click", () => {
      appData.activePageId = page.id;
      renderApp();
    });

    pagesList.appendChild(pageDiv);
  });
}

function renderEditor() {
  const activePage = appData.pages.find(
    page => page.id === appData.activePageId
  );

  pageTitleInput.value = activePage.title;
  blocksContainer.innerHTML = "";

  activePage.blocks.forEach((block, index) => {
    const blockDiv = document.createElement("div");
    blockDiv.classList.add("block");
    blockDiv.contentEditable = true;
    blockDiv.textContent = block.content;

    // Update state when typing
    blockDiv.addEventListener("input", () => {
      block.content = blockDiv.textContent;
    });

    blocksContainer.appendChild(blockDiv);
  });
}

function renderApp() {
  renderPages();
  renderEditor();
}

// ===== TITLE UPDATE =====
pageTitleInput.addEventListener("input", () => {
  const activePage = appData.pages.find(
    page => page.id === appData.activePageId
  );

  activePage.title = pageTitleInput.value;

  renderPages(); // update sidebar title
});

renderApp();