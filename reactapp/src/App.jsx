import React, { useEffect, useState } from "react";
import "./App.css";

function Task({ task, setShowForm, setSelectedTask }) {
  const handleClick = () => {
    setSelectedTask(task);
    setShowForm(true);
  };

  return (
    <tr id={task?.id} onClick={handleClick}>
      <td>{task?.assignee}</td>
      <td>{task?.dueDate}</td>
      <td className="description">{task?.description}</td>
      <td>
        <progress value={task.percentCompleted} max="100">
          task.percentCompleted
        </progress>
      </td>
      <td>{task?.isPriority ? "Yes" : "No"}</td>
    </tr>
  );
}

function TaskTable({ tasks, setShowForm, setSelectedTask, deleteTask }) {
  return (
    <table>
      <thead>
        <tr>
          <th className="assignee">Assignee</th>
          <th className="dueDate">Due Date</th>
          <th className="description">Description</th>
          <th className="percentCompleted">Percent Completed</th>
          <th className="priority">Priority</th>
        </tr>
      </thead>
      <tbody>
        {tasks?.map((task) => (
          <Task
            key={task.id}
            task={task}
            setShowForm={setShowForm}
            setSelectedTask={setSelectedTask}
            deleteTask={deleteTask}
          />
        ))}
      </tbody>
    </table>
  );
}

function TaskForm({
  addTask,
  updateTask,
  deleteTask,
  setShowForm,
  selectedTask,
}) {
  const defaultFormData = {
    assignee: "",
    dueDate: new Date(),
    description: "",
    percentCompleted: 0,
    isPriority: false,
  };
  const [formData, setFormData] = useState(selectedTask || defaultFormData);

  useEffect(() => {
    setFormData(selectedTask || defaultFormData);
  }, [selectedTask]);

  const handlePost = async (e) => {
    e.preventDefault();
    const response = await fetch("task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const id = await response.json();
      addTask({ ...formData, id });
      handleClose();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await fetch(`task/${formData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      updateTask(formData);
      handleClose();
    }
  };

  const handleTaskDelete = async (e, id) => {
    e.preventDefault();
    const response = await fetch(`task/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      deleteTask(id);
    }
  };

  const handleClose = () => {
    setFormData(defaultFormData);
    setShowForm(false);
  };

  return (
    <form method="post" onSubmit={selectedTask ? handleUpdate : handlePost}>
      <div className="flex-container inputs">
        <label>
          Asignee*:
          <input
            type="text"
            required
            onChange={(e) =>
              setFormData({ ...formData, assignee: e.target.value })
            }
            value={formData.assignee}
          />
        </label>

        <label label="Due Date">
          Due Date*:
          <input
            type="datetime-local"
            required
            min={new Date(Date.now)}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            value={formData.dueDate}
          />
        </label>
        <label>
          Percent Completed:
          <input
            type="number"
            min="0"
            max="100"
            onChange={(e) =>
              setFormData({ ...formData, percentCompleted: e.target.value })
            }
            value={formData.percentCompleted}
          />
        </label>

        <label label="Priority">
          Priority:
          <input
            type="checkbox"
            onChange={() =>
              setFormData({ ...formData, isPriority: !formData.isPriority })
            }
            checked={formData.isPriority}
          />
        </label>
      </div>

      <div className="flex-container-col description">
        <label htmlFor="descriptionInput">Description*:</label>
        <textarea
          id="descriptionInput"
          rows="7"
          cols="65"
          required
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          value={formData.description}
        />
        <div className="flex-container formButtons">
          <button>{selectedTask ? "Update" : "Create"}</button>
          <button onClick={handleClose}>Cancel</button>
          {selectedTask ? (
            <button onClick={(e) => handleTaskDelete(e, selectedTask.id)}>
              Delete
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div />
    </form>
  );
}

export function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState();
  const [filters, setFilters] = useState({
    name: "",
  });

  const populateTaskData = async () => {
    const response = await fetch("task");
    const data = await response.json();
    setTasks(data);
  };

  useEffect(() => {
    populateTaskData();
  }, []);

  const addTask = (task) => {
    setTasks([...tasks, task]);
    setSelectedTask(null);
  };

  const updateTask = (task) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) return task;
        return t;
      }),
    );
    setSelectedTask(null);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
    setSelectedTask(null);
  };

  const handleShowCreateForm = () => {
    setSelectedTask(null);
    setShowForm(true);
  };

  const handleNameFilter = (e) => {
    setFilters({ ...filters, name: e.target.value });
  };

  const filterTasks = (tasks) =>
    tasks.filter((t) =>
      filters.name.toLowerCase()
        ? t.assignee.toLowerCase() === filters.name.toLowerCase()
        : t,
    );

  return (
    <div className="flex-container-col root">
      <h1>Tasks</h1>
      <div className="flex-container filters">
        <label>
          Search:
          <input
            type="text"
            placeholder="Assignee"
            onChange={handleNameFilter}
          />
        </label>
      </div>

      <div className="taskTableContainer">
        <TaskTable
          tasks={filterTasks(tasks)}
          setShowForm={setShowForm}
          setSelectedTask={setSelectedTask}
        />
      </div>

      <div className="flex-container">
        {showForm ? (
          <></>
        ) : (
          <button onClick={handleShowCreateForm}>Create Task</button>
        )}
      </div>
      <div className="flex-container">
        {showForm ? (
          <TaskForm
            addTask={addTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
            setShowForm={setShowForm}
            selectedTask={selectedTask}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
