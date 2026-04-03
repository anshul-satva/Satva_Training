import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { Task } from "./task.types.js";

const tasksFilePath = resolve(process.cwd(), "data", "tasks.json");

const ensureStorage = async (): Promise<void> => {
  await mkdir(dirname(tasksFilePath), { recursive: true });

  try {
    await readFile(tasksFilePath, "utf-8");
  } catch {
    await writeFile(tasksFilePath, JSON.stringify([], null, 2), "utf-8");
  }
};

const loadTasks = async (): Promise<Task[]> => {
  await ensureStorage();
  const fileContent = await readFile(tasksFilePath, "utf-8");

  try {
    const parsed = JSON.parse(fileContent) as Task[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveTasks = async (tasks: Task[]): Promise<void> => {
  await ensureStorage();
  await writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), "utf-8");
};

export const taskRepository = {
  async findAll(): Promise<Task[]> {
    return loadTasks();
  },

  async findById(id: number): Promise<Task | null> {
    const tasks = await loadTasks();
    return tasks.find((task) => task.id === id) ?? null;
  },

  async create(title: string): Promise<Task> {
    const tasks = await loadTasks();
    const nextId =
      tasks.length === 0 ? 1 : Math.max(...tasks.map((task) => task.id)) + 1;

    const newTask: Task = {
      id: nextId,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    await saveTasks(tasks);

    return newTask;
  },

  async delete(id: number): Promise<Task | null> {
    const tasks = await loadTasks();
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      return null;
    }

    const [deletedTask] = tasks.splice(index, 1);
    await saveTasks(tasks);

    return deletedTask;
  },

  async updateStatus(id: number, completed: boolean): Promise<Task | null> {
    const tasks = await loadTasks();
    const task = tasks.find((item) => item.id === id);

    if (!task) {
      return null;
    }

    task.completed = completed;
    await saveTasks(tasks);

    return task;
  },
};
