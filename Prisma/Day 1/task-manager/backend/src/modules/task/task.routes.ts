import { Router } from "express";
import protect from "../../shared/middlewares/auth.middleware";
import { uploadAttachment } from "../../shared/middlewares/upload.middleware";
import {
  addAttachment,
  addComment,
  addReaction,
  assignTags,
  create,
  getAll,
  getAttachments,
  getComments,
  getOne,
  remove,
  removeAttachment,
  removeReaction,
  removeTag,
  update,
} from "./task.controller";

const router = Router();

router.use(protect);

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", update);
router.delete("/:id", remove);

router.post("/:id/tags", assignTags);
router.delete("/:id/tags/:tagId", removeTag);

router.post("/:id/attachments", uploadAttachment.single("file"), addAttachment);
router.get("/:id/attachments", getAttachments);
router.delete("/:id/attachments/:attachmentId", removeAttachment);

router.post("/:id/comments", addComment);
router.get("/:id/comments", getComments);

router.post("/comments/:commentId/reactions", addReaction);
router.delete("/comments/:commentId/reactions", removeReaction);

export default router;
