import type { TaskStatus } from "@prisma/client";
import { TASK_STATUS_ORDER } from "../constants/app.constant.js";

export const canMoveTaskStatus = (
  currentStatus: TaskStatus,
  nextStatus: TaskStatus,
) => {
  const currentIndex = TASK_STATUS_ORDER.indexOf(currentStatus);
  const nextIndex = TASK_STATUS_ORDER.indexOf(nextStatus);

  if (currentIndex === -1 || nextIndex === -1) {
    return false;
  }

  if (currentStatus === "TODO" && nextStatus === "DONE") {
    return false;
  }

  return true;
};
