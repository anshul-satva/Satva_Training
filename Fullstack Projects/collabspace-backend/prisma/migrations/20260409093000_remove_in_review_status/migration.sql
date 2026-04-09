ALTER TYPE "TaskStatus" RENAME TO "TaskStatus_old";

CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

ALTER TABLE "Task"
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "TaskStatus"
  USING (
    CASE
      WHEN "status"::text = 'IN_REVIEW' THEN 'IN_PROGRESS'
      ELSE "status"::text
    END
  )::"TaskStatus",
  ALTER COLUMN "status" SET DEFAULT 'TODO';

ALTER TABLE "ActivityLog"
  ALTER COLUMN "previousStatus" TYPE "TaskStatus"
  USING (
    CASE
      WHEN "previousStatus"::text = 'IN_REVIEW' THEN 'IN_PROGRESS'
      ELSE "previousStatus"::text
    END
  )::"TaskStatus",
  ALTER COLUMN "newStatus" TYPE "TaskStatus"
  USING (
    CASE
      WHEN "newStatus"::text = 'IN_REVIEW' THEN 'IN_PROGRESS'
      ELSE "newStatus"::text
    END
  )::"TaskStatus";

DROP TYPE "TaskStatus_old";
