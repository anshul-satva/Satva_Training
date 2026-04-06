import { Card, Tag, Typography } from "antd";
import type { TaskSummary, TaskStatus } from "../../types/task.types";

interface TaskBoardProps {
  columns: Array<{
    key: TaskStatus;
    title: string;
    tasks: TaskSummary[];
  }>;
  onDropTask: (taskId: string, status: TaskStatus) => Promise<void>;
  onOpenTask: (taskId: string) => Promise<void>;
}

export const TaskBoard = ({ columns, onDropTask, onOpenTask }: TaskBoardProps) => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, taskId: string) => {
    event.dataTransfer.setData("taskId", taskId);
  };

  const handleDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    status: TaskStatus,
  ) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("taskId");

    if (!taskId) {
      return;
    }

    await onDropTask(taskId, status);
  };

  return (
    <div className="board-grid">
      {columns.map((column) => (
        <Card key={column.key} className="board-column" variant="borderless">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Typography.Title level={5} className="mb-0">
              {column.title}
            </Typography.Title>
            <Tag>{column.tasks.length}</Tag>
          </div>

          <div
            className="board-dropzone"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => void handleDrop(event, column.key)}
          >
            {column.tasks.map((task) => (
              <Card
                key={task.id}
                className="board-task-card"
                hoverable
                draggable
                onDragStart={(event) => handleDragStart(event, task.id)}
                onClick={() => void onOpenTask(task.id)}
              >
                <div className="board-task-card-title-wrap">
                  <Typography.Text strong className="board-task-card-title">
                    {task.title}
                  </Typography.Text>
                </div>
                <div className="d-flex gap-2 flex-wrap mt-auto">
                  <Tag color={task.priority === "HIGH" ? "volcano" : task.priority === "MEDIUM" ? "gold" : "cyan"}>
                    {task.priority}
                  </Tag>
                  {task.dueDate ? <Tag color="blue">{new Date(task.dueDate).toLocaleDateString()}</Tag> : null}
                </div>
              </Card>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
