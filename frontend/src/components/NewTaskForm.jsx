import { useState } from "react";

export default function NewTaskForm({ onCreate, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onCreate({ title: title.trim(), description: description.trim() || undefined, priority });
      setTitle("");
      setDescription("");
      setPriority("medium");
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        style={styles.input}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        style={styles.textarea}
      />
      <div style={styles.row}>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} style={styles.select}>
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <div style={styles.rowActions}>
          <button type="button" onClick={onClose} style={styles.cancelBtn}>
            Cancel
          </button>
          <button type="submit" disabled={submitting || !title.trim()} style={styles.submitBtn}>
            Add task
          </button>
        </div>
      </div>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    background: "var(--accent-soft)",
    border: "1px solid var(--line)",
    borderRadius: "8px",
    padding: "10px",
  },
  input: {
    border: "1px solid var(--line)",
    borderRadius: "6px",
    padding: "8px 10px",
    fontSize: "14px",
    background: "var(--surface)",
  },
  textarea: {
    border: "1px solid var(--line)",
    borderRadius: "6px",
    padding: "8px 10px",
    fontSize: "13px",
    background: "var(--surface)",
    resize: "vertical",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
  },
  select: {
    border: "1px solid var(--line)",
    borderRadius: "6px",
    padding: "6px 8px",
    fontSize: "12px",
    background: "var(--surface)",
  },
  rowActions: {
    display: "flex",
    gap: "6px",
  },
  cancelBtn: {
    border: "none",
    background: "transparent",
    fontSize: "13px",
    color: "var(--ink-soft)",
    padding: "6px 10px",
  },
  submitBtn: {
    border: "none",
    background: "var(--accent)",
    color: "white",
    fontSize: "13px",
    fontWeight: 600,
    borderRadius: "6px",
    padding: "6px 12px",
  },
};
