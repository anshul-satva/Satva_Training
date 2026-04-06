import { App, Button, Card, Input, List, Modal, Space, Tag, Typography, Upload } from "antd";
import { useState } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import {
  DeleteFilled,
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  PaperClipOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import {
  addAttachment,
  addReaction,
  createComment,
  deleteAttachment,
  deleteTask,
  removeReaction,
} from "../api/task.api";
import type { ReactionType, TaskDetail } from "../types/task.types";
import { getApiErrorMessage } from "../../../shared/utils/error";
import { useAuth } from "../../../app/providers/AuthProvider";

interface TaskDetailModalProps {
  open: boolean;
  task: TaskDetail | null;
  onClose: () => void;
  onEdit: (task: TaskDetail) => void;
  onDeleted: (taskId: string) => void;
  onRefresh: () => Promise<void>;
}

export const TaskDetailModal = ({
  open,
  task,
  onClose,
  onEdit,
  onDeleted,
  onRefresh,
}: TaskDetailModalProps) => {
  const { message } = App.useApp();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [attachmentFiles, setAttachmentFiles] = useState<UploadFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  if (!task) {
    return null;
  }

  const handleDelete = async () => {
    setIsSaving(true);
    try {
      await deleteTask(task.id);
      void message.success("Task deleted successfully.");
      onDeleted(task.id);
      onClose();
    } catch (err) {
      void message.error(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      return;
    }

    try {
      await createComment(task.id, commentText.trim());
      setCommentText("");
      await onRefresh();
      void message.success("Comment added successfully.");
    } catch (err) {
      void message.error(getApiErrorMessage(err));
    }
  };

  const handleAddAttachment = async () => {
    const file = attachmentFiles[0]?.originFileObj;

    if (!file) {
      return;
    }

    try {
      await addAttachment(task.id, file);
      setAttachmentFiles([]);
      await onRefresh();
      void message.success("Attachment added successfully.");
    } catch (err) {
      void message.error(getApiErrorMessage(err));
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
      await deleteAttachment(task.id, attachmentId);
      await onRefresh();
      void message.success("Attachment deleted successfully.");
    } catch (err) {
      void message.error(getApiErrorMessage(err));
    }
  };

  const handleReaction = async (commentId: string, reactionType: ReactionType) => {
    try {
      const comment = task.comments.find((item) => item.id === commentId);
      const myReaction = comment?.reactions.find((reaction) => reaction.userId === user?.id);

      if (myReaction?.reactionType === reactionType) {
        await removeReaction(commentId);
        void message.success("Reaction removed successfully.");
      } else {
        if (myReaction) {
          await removeReaction(commentId);
        }
        await addReaction(commentId, reactionType);
        void message.success("Reaction updated successfully.");
      }

      await onRefresh();
    } catch (err) {
      void message.error(getApiErrorMessage(err));
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered width={860} title={task.title}>
      <Space direction="vertical" size="large" className="w-100">
        <Card variant="borderless" className="task-detail-card">
          <Typography.Paragraph>{task.description || "No description added."}</Typography.Paragraph>
          <Space wrap>
            <Tag color={task.status === "DONE" ? "green" : task.status === "IN_PROGRESS" ? "blue" : "gold"}>
              {task.status}
            </Tag>
            <Tag color={task.priority === "HIGH" ? "volcano" : task.priority === "MEDIUM" ? "gold" : "cyan"}>
              {task.priority}
            </Tag>
            {task.category?.name ? <Tag color="purple">{task.category.name}</Tag> : null}
            {task.tagNames?.map((tagName) => (
              <Tag key={tagName}>{tagName}</Tag>
            ))}
          </Space>

          <div className="d-flex gap-2 flex-wrap mt-4">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                onClose();
                onEdit(task);
              }}
            >
              Edit Task
            </Button>
            <Button danger icon={<DeleteOutlined />} loading={isSaving} onClick={() => void handleDelete()}>
              Delete Task
            </Button>
          </div>
        </Card>

        <Card title="Comments" variant="borderless" className="task-detail-card">
          <Space.Compact className="w-100 mb-3">
            <Input
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Write a comment"
            />
            <Button type="primary" icon={<MessageOutlined />} onClick={() => void handleAddComment()}>
              Add
            </Button>
          </Space.Compact>

          <List
            locale={{ emptyText: "No comments yet." }}
            dataSource={task.comments}
            renderItem={(comment) => (
              <List.Item>
                <List.Item.Meta
                  title={comment.content}
                  description={
                    <Space wrap>
                        {(["LIKE", "HELPFUL", "QUESTION"] as ReactionType[]).map((reactionType) => {
                          const isSelected = comment.reactions.some(
                            (reaction) =>
                              reaction.userId === user?.id &&
                              reaction.reactionType === reactionType,
                          );

                          return (
                            <Button
                              key={reactionType}
                              size="small"
                              type={isSelected ? "primary" : "default"}
                              className={isSelected ? "" : "comment-reaction-button"}
                              icon={
                                reactionType === "LIKE" ? (
                                  <SmileOutlined />
                                ) : reactionType === "HELPFUL" ? (
                                  <InfoCircleOutlined />
                                ) : undefined
                              }
                              onClick={() => void handleReaction(comment.id, reactionType)}
                            >
                              {reactionType === "LIKE"
                                ? "Like"
                                : reactionType === "HELPFUL"
                                  ? "Helpful"
                                : "Question"}
                            </Button>
                          );
                        })}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        <Card title="Attachments" variant="borderless" className="task-detail-card">
          <Space direction="vertical" className="w-100 mb-3">
            <Upload
              beforeUpload={() => false}
              fileList={attachmentFiles}
              maxCount={1}
              onChange={({ fileList }) => setAttachmentFiles(fileList)}
            >
              <Button icon={<PaperClipOutlined />}>Choose file</Button>
            </Upload>
            <Typography.Text type="secondary">
              Upload images, PDFs, Excel files, docs, or other task files directly.
            </Typography.Text>
            <Button type="primary" icon={<PaperClipOutlined />} onClick={() => void handleAddAttachment()}>
              Upload Attachment
            </Button>
          </Space>

          <List
            locale={{ emptyText: "No attachments yet." }}
            dataSource={task.attachments}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key={item.id}
                    danger
                    type="text"
                    icon={<DeleteFilled />}
                    onClick={() => void handleDeleteAttachment(item.id)}
                  >
                    Remove
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={<a href={item.url} target="_blank" rel="noreferrer">{item.filename}</a>}
                  description={`${item.fileSize} bytes`}
                />
              </List.Item>
            )}
          />
        </Card>
      </Space>
    </Modal>
  );
};
