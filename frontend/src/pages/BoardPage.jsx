import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import NewTaskForm from "../components/NewTaskForm";

const COLUMNS = [
  { key: "todo", label: "To Do", color: "var(--status-todo)" },
  { key: "in_progress", label: "In Progress", color: "var(--status-progress)" },
  { key: "done", label: "Done", color: "var(--status-done)" },
];

const STATUS_ORDER = ["todo", "in_progress", "done"];

export default function BoardPage() {
  const { user, logout } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [addingTo, setAddingTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async (projectId, filters = {}) => {
    const data = await api.listTasks({ project_id: projectId, ...filters });
    setTasks(data);
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const projects = await api.listProjects();
        let activeProject = projects[0];
        if (!activeProject) {
          activeProject = await api.createProject("My Board", "Default project");
        }
        setProject(activeProject);
        await loadTasks(activeProject.id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [loadTasks]);

  async function handleFilterChange(value) {
    setPriorityFilter(value);
    if (project) await loadTasks(project.id, { priority: value });
  }

  async function handleCreate(columnKey, taskData) {
    const created = await api.createTask({ ...taskData, status: columnKey, project_id: project.id });
    setTasks((prev) => [created, ...prev]);
  }

  async function handleMove(task, direction) {
    const idx = STATUS_ORDER.indexOf(task.status);
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= STATUS_ORDER.length) return;
    const nextStatus = STATUS_ORDER[nextIdx];
    const updated = await api.updateTask(task.id, { status: nextStatus });
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
  }

  async function handleDelete(task) {
    await api.deleteTask(task.id);
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  }

  if (loading) {
    return <div style={styles.centered}>Loading your board…</div>;
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <span style={styles.brandMark}>[ ]</span>
          <span style={styles.brandName}>Task Tracker</span>
        </div>
        <div style={styles.headerRight}>
          <select
            value={priorityFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All priorities</option>
            <option value="high">High priority</option>
            <option value="medium">Medium priority</option>
            <option value="low">Low priority</option>
          </select>
          <span style={styles.username}>{user?.username}</span>
          <button type="button" onClick={logout} style={styles.logoutBtn}>
            Sign out
          </button>
        </div>
      </header>

      {error && <div style={styles.errorBanner}>{error}</div>}

      <main style={styles.board}>
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          const direction = STATUS_ORDER.indexOf(col.key);
          return (
            <section key={col.key} style={styles.column}>
              <div style={styles.columnHeader}>
                <span style={{ ...styles.dot, background: col.color }} />
                <h2 style={styles.columnTitle}>{col.label}</h2>
                <span style={styles.count}>{String(colTasks.length).padStart(2, "0")}</span>
              </div>

              <div style={styles.cardList}>
                {colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onAdvance={(t) => handleMove(t, 1)}
                    onRetreat={(t) => handleMove(t, -1)}
                    onDelete={handleDelete}
                  />
                ))}

                {addingTo === col.key ? (
                  <NewTaskForm
                    onCreate={(data) => handleCreate(col.key, data)}
                    onClose={() => setAddingTo(null)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setAddingTo(col.key)}
                    style={styles.addBtn}
                  >
                    + Add task
                  </button>
                )}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  centered: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--ink-soft)",
    fontSize: "14px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid var(--line)",
    background: "var(--surface)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  brandMark: {
    fontFamily: "var(--font-mono)",
    fontWeight: 600,
    color: "var(--accent)",
    fontSize: "16px",
  },
  brandName: {
    fontWeight: 700,
    fontSize: "16px",
    letterSpacing: "-0.01em",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  filterSelect: {
    border: "1px solid var(--line)",
    borderRadius: "6px",
    padding: "6px 10px",
    fontSize: "13px",
    background: "var(--bg)",
    color: "var(--ink)",
  },
  username: {
    fontSize: "13px",
    color: "var(--ink-soft)",
    fontFamily: "var(--font-mono)",
  },
  logoutBtn: {
    border: "1px solid var(--line)",
    background: "transparent",
    borderRadius: "6px",
    padding: "6px 12px",
    fontSize: "13px",
    color: "var(--ink-soft)",
  },
  errorBanner: {
    margin: "16px 24px 0",
    padding: "10px 14px",
    background: "#FBEEEA",
    border: "1px solid #F0D4CB",
    color: "var(--danger)",
    borderRadius: "8px",
    fontSize: "13px",
  },
  board: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(260px, 1fr))",
    gap: "16px",
    padding: "24px",
    alignItems: "start",
  },
  column: {
    background: "var(--bg)",
    border: "1px solid var(--line)",
    borderRadius: "10px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  columnHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    display: "inline-block",
  },
  columnTitle: {
    margin: 0,
    fontSize: "13px",
    fontWeight: 600,
    flex: 1,
  },
  count: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--ink-soft)",
  },
  cardList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  addBtn: {
    border: "1px dashed var(--line)",
    background: "transparent",
    borderRadius: "8px",
    padding: "10px",
    fontSize: "13px",
    color: "var(--ink-soft)",
  },
};
