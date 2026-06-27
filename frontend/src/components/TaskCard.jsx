const PRIORITY_COLOR = {
  low: "var(--priority-low)",
  medium: "var(--priority-medium)",
  high: "var(--priority-high)",
};

const STATUS_ORDER = ["todo", "in_progress", "done"];
const STATUS_LABEL = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

export default function TaskCard({ task, onAdvance, onRetreat, onDelete }) {
  const canAdvance = task.status !== "done";
  const canRetreat = task.status !== "todo";

  return (
    <div style={{ ...styles.card, borderLeftColor: PRIORITY_COLOR[task.priority] }}>
      <div style={styles.cardTop}>
        <span style={styles.id}>#{String(task.id).padStart(3, "0")}</span>
        <span style={{ ...styles.priorityTag, color: PRIORITY_COLOR[task.priority] }}>
          {task.priority}
        </span>
      </div>

      <p style={styles.title}>{task.title}</p>
      {task.description && <p style={styles.description}>{task.description}</p>}

      <div style={styles.actions}>
        {canRetreat && (
          <button
            type="button"
            onClick={() => onRetreat(task)}
            style={styles.actionBtn}
            aria-label={`Move back to ${STATUS_LABEL[STATUS_ORDER[STATUS_ORDER.indexOf(task.status) - 1]]}`}
          >
            ←
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(task)}
          style={styles.deleteBtn}
        >
          Delete
        </button>
        {canAdvance && (
          <button
            type="button"
            onClick={() => onAdvance(task)}
            style={styles.actionBtnPrimary}
            aria-label={`Move to ${STATUS_LABEL[STATUS_ORDER[STATUS_ORDER.indexOf(task.status) + 1]]}`}
          >
            →
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--surface)",
    border: "1px solid var(--line)",
    borderLeft: "3px solid",
    borderRadius: "8px",
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  id: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    color: "var(--ink-soft)",
  },
  priorityTag: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  title: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--ink)",
    lineHeight: 1.4,
  },
  description: {
    margin: 0,
    fontSize: "13px",
    color: "var(--ink-soft)",
    lineHeight: 1.4,
  },
  actions: {
    display: "flex",
    gap: "6px",
    marginTop: "6px",
  },
  actionBtn: {
    border: "1px solid var(--line)",
    background: "var(--bg)",
    borderRadius: "6px",
    width: "28px",
    height: "28px",
    fontSize: "13px",
    color: "var(--ink-soft)",
  },
  actionBtnPrimary: {
    border: "1px solid var(--line)",
    background: "var(--bg)",
    borderRadius: "6px",
    width: "28px",
    height: "28px",
    fontSize: "13px",
    color: "var(--accent)",
    marginLeft: "auto",
  },
  deleteBtn: {
    border: "none",
    background: "transparent",
    fontSize: "12px",
    color: "var(--ink-soft)",
    padding: "0 6px",
  },
};
