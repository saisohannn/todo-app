
import { useState } from 'react';
import './App.css';

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="task">
      <label>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span className={task.completed ? 'completed' : ''}>
          {task.text}
        </span>
      </label>

      <button
        className="delete-btn"
        onClick={() => onDelete(task.id)}
      >
        Delete
      </button>
    </li>
  );
}

function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty">No tasks yet. Add one above!</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('todo-tasks')) || [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  function updateTasks(updatedTasks) {
    setTasks(updatedTasks);
    localStorage.setItem('todo-tasks', JSON.stringify(updatedTasks));
  }

  function addTask(event) {
    event.preventDefault();

    if (!input.trim()) return;

    const newTask = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    };

    updateTasks([newTask, ...tasks]);
    setInput('');
  }

  function toggleTask(id) {
    updateTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id) {
    updateTasks(tasks.filter((task) => task.id !== id));
  }

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="app">
      <header className="header">
        <p className="eyebrow">YOUR DAILY PLANNER</p>
        <h1>My To-Do List</h1>
        <p className="subtitle">
          Plan your day. Complete your goals.
        </p>
      </header>

      <section className="card">
        <form className="add-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="What do you need to do?"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={120}
            aria-label="New task"
          />
          <button type="submit" className="add-btn">
            + Add Task
          </button>
        </form>

        <div className="summary">
          <span>{tasks.length - completedCount} tasks remaining</span>
          <span>{completedCount}/{tasks.length} completed</span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${tasks.length ? completedCount / tasks.length * 100 : 0}%`,
            }}
          />
        </div>

        <div className="filters">
          {['all', 'active', 'completed'].map((item) => (
            <button
              type="button"
              key={item}
              className={filter === item ? 'selected' : ''}
              onClick={() => setFilter(item)}
            >
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>

        <TaskList
          tasks={visibleTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      </section>

      <footer className="footer">
        Made with focus and consistency ✦
      </footer>
    </main>
  );
}
