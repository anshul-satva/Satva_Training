export interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface CreateTaskBody {
  title: string;
  done?: boolean;
}

export interface UpdateTaskStatusBody {
  completed?: boolean;
}

export interface TaskParams {
  id: string;
}
