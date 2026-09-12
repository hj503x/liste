import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Plus,
  X,
  Check,
  Download,
  Sun,
  Moon,
  Trash2,
  Pencil,
  ArrowLeft,
  Copy,
  ListChecks,
} from "lucide-react";
import "./App.css";

const LISTS_KEY = "liste_lists_v1";
const THEME_KEY = "liste_theme_v1";

// Accent color rotation, one pair (light/dark) per list, assigned at creation.
const TAB_COLORS = [
  { light: "#2F5233", dark: "#8FC28E" }, // pine
  { light: "#A23E2A", dark: "#E0897B" }, // brick
  { light: "#B8860B", dark: "#E0B24D" }, // ochre
  { light: "#2C5B82", dark: "#7DB3D9" }, // denim
  { light: "#6B4577", dark: "#C79FD1" }, // plum
];

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function loadLists() {
  try {
    const raw = localStorage.getItem(LISTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "dark" || t === "light" ? t : "light";
  } catch {
    return "light";
  }
}

export default function App() {
  const [theme, setTheme] = useState(loadTheme);
  const [lists, setLists] = useState(loadLists);
  const [activeId, setActiveId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);
  const newListRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    if (creating && newListRef.current) newListRef.current.focus();
  }, [creating]);

  const flash = useCallback((msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1700);
  }, []);

  function addList(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const color = TAB_COLORS[lists.length % TAB_COLORS.length];
    const list = { id: uid(), title: trimmed, items: [], color, createdAt: Date.now() };
    setLists((prev) => [list, ...prev]);
    setNewListName("");
    setCreating(false);
    setActiveId(list.id);
  }

  function deleteList(id) {
    setLists((prev) => prev.filter((l) => l.id !== id));
    if (activeId === id) setActiveId(null);
  }

  function renameList(id, title) {
    const t = title.trim();
    if (!t) return;
    setLists((prev) => prev.map((l) => (l.id === id ? { ...l, title: t } : l)));
  }

  function addItem(listId, text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setLists((prev) =>
      prev.map((l) =>
        l.id === listId
          ? { ...l, items: [...l.items, { id: uid(), text: trimmed, checked: false }] }
          : l
      )
    );
  }

  function toggleItem(listId, itemId) {
    setLists((prev) =>
      prev.map((l) =>
        l.id === listId
          ? {
              ...l,
              items: l.items.map((it) => (it.id === itemId ? { ...it, checked: !it.checked } : it)),
            }
          : l
      )
    );
  }

  function deleteItem(listId, itemId) {
    setLists((prev) =>
      prev.map((l) => (l.id === listId ? { ...l, items: l.items.filter((it) => it.id !== itemId) } : l))
    );
  }

  function clearChecked(listId) {
    setLists((prev) =>
      prev.map((l) => (l.id === listId ? { ...l, items: l.items.filter((it) => !it.checked) } : l))
    );
  }

  function exportList(list) {
    const lines = [list.title, "-".repeat(list.title.length), "", ...list.items.map((it) => `${it.checked ? "[x]" : "[ ]"} ${it.text}`)];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${list.title.replace(/[^\w-]+/g, "_").slice(0, 60) || "list"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    flash("List exported");
  }

  function copyList(list) {
    const lines = list.items.map((it) => `${it.checked ? "☑" : "☐"} ${it.text}`);
    const text = [list.title, ...lines].join("\n");
    navigator.clipboard
      ?.writeText(text)
      .then(() => flash("Copied to clipboard"))
      .catch(() => flash("Couldn't copy"));
  }

  const active = lists.find((l) => l.id === activeId) || null;

  return (
    <>
      {!active ? (
        <HomeView
          theme={theme}
          setTheme={setTheme}
          lists={lists}
          creating={creating}
          setCreating={setCreating}
          newListName={newListName}
          setNewListName={setNewListName}
          addList={addList}
          deleteList={deleteList}
          setActiveId={setActiveId}
          newListRef={newListRef}
        />
      ) : (
        <ListView
          theme={theme}
          list={active}
          onBack={() => setActiveId(null)}
          onRename={(title) => renameList(active.id, title)}
          onAddItem={(text) => addItem(active.id, text)}
          onToggleItem={(itemId) => toggleItem(active.id, itemId)}
          onDeleteItem={(itemId) => deleteItem(active.id, itemId)}
          onClearChecked={() => clearChecked(active.id)}
          onExport={() => exportList(active)}
          onCopy={() => copyList(active)}
          onDeleteList={() => deleteList(active.id)}
        />
      )}
      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </>
  );
}

function HomeView({
  theme,
  setTheme,
  lists,
  creating,
  setCreating,
  newListName,
  setNewListName,
  addList,
  deleteList,
  setActiveId,
  newListRef,
}) {
  return (
    <div>
      <div className="header">
        <div>
          <div className="logo-text">
            LiST
            <span className="logo-e">e</span>
          </div>
          <p className="tagline">
            {lists.length === 0 ? "no lists yet" : `${lists.length} list${lists.length === 1 ? "" : "s"}`} — a
            list for anything.
          </p>
        </div>
        <button
          className="theme-btn"
          aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>

      {creating ? (
        <form
          className="inline-form"
          onSubmit={(e) => {
            e.preventDefault();
            addList(newListName);
          }}
        >
          <input
            ref={newListRef}
            className="field"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setNewListName("");
                setCreating(false);
              }
            }}
            placeholder="Name this list — groceries, packing, reading..."
            autoComplete="off"
          />
          <button type="submit" className="btn-solid">
            Create
          </button>
        </form>
      ) : (
        <button className="new-trigger" onClick={() => setCreating(true)}>
          <Plus size={16} />
          New list
        </button>
      )}

      {lists.length === 0 && !creating ? (
        <div className="empty">
          <ListChecks size={30} />
          <p>Make a list of anything — it'll show up here.</p>
        </div>
      ) : (
        <div className="grid">
          {lists.map((list) => {
            const done = list.items.filter((i) => i.checked).length;
            const total = list.items.length;
            const pct = total ? (done / total) * 100 : 0;
            const tab = list.color ? list.color[theme] : TAB_COLORS[0][theme];
            return (
              <div key={list.id} className="card" style={{ "--tab": tab }} onClick={() => setActiveId(list.id)}>
                <div className="card-top">
                  <div className="card-title">{list.title}</div>
                  <button
                    className="card-del"
                    aria-label="Delete list"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteList(list.id);
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="card-meta">{total === 0 ? "empty" : `${done} / ${total} done`}</div>
                <div className="card-bar">
                  <div className="card-bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ListView({
  theme,
  list,
  onBack,
  onRename,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onClearChecked,
  onExport,
  onCopy,
  onDeleteList,
}) {
  const [newItem, setNewItem] = useState("");
  const [titleDraft, setTitleDraft] = useState(list.title);
  const itemInputRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    setTitleDraft(list.title);
  }, [list.id, list.title]);

  const done = list.items.filter((i) => i.checked).length;
  const total = list.items.length;
  const tab = list.color ? list.color[theme] : TAB_COLORS[0][theme];

  return (
    <div>
      <div className="toolbar">
        <button className="icon-btn" aria-label="Back to lists" onClick={onBack}>
          <ArrowLeft size={16} />
        </button>
        <div className="toolbar-actions">
          <button className="icon-btn" aria-label="Copy list" onClick={onCopy}>
            <Copy size={15} />
          </button>
          <button className="icon-btn" aria-label="Export as .txt" onClick={onExport}>
            <Download size={15} />
          </button>
          <button className="icon-btn danger" aria-label="Delete list" onClick={onDeleteList}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="detail-title-row">
        <input
          ref={titleRef}
          className="detail-title"
          value={titleDraft}
          onChange={(e) => setTitleDraft(e.target.value)}
          onBlur={() => onRename(titleDraft)}
          onKeyDown={(e) => {
            if (e.key === "Enter") titleRef.current?.blur();
          }}
        />
        <Pencil size={13} className="edit-pencil" />
      </div>
      <p className="detail-sub">{total === 0 ? "nothing on this list yet" : `${done} of ${total} done`}</p>

      <form
        className="inline-form"
        onSubmit={(e) => {
          e.preventDefault();
          onAddItem(newItem);
          setNewItem("");
          itemInputRef.current?.focus();
        }}
      >
        <input
          ref={itemInputRef}
          className="field"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add an item..."
          autoComplete="off"
        />
        <button type="submit" className="btn-icon-solid" aria-label="Add item">
          <Plus size={16} />
        </button>
      </form>

      {list.items.length === 0 ? (
        <div className="empty" style={{ padding: "2.25rem 1rem" }}>
          <p>Add the first item above.</p>
        </div>
      ) : (
        <div>
          {list.items.map((item) => (
            <div key={item.id} className="item-row">
              <button
                className={`checkbox${item.checked ? " checked" : ""}`}
                style={{ "--tab": tab }}
                aria-label={item.checked ? "Mark not done" : "Mark done"}
                onClick={() => onToggleItem(item.id)}
              >
                {item.checked && <Check size={13} strokeWidth={3} />}
              </button>
              <span className={`item-text${item.checked ? " checked" : ""}`}>{item.text}</span>
              <button className="item-del" aria-label="Delete item" onClick={() => onDeleteItem(item.id)}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {done > 0 && (
        <button className="clear-btn" onClick={onClearChecked}>
          Clear {done} checked item{done === 1 ? "" : "s"}
        </button>
      )}
    </div>
  );
}
