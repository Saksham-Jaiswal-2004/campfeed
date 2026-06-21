import { Router } from "express";
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  editAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.controller.js";
import { firebaseAuth } from "../middleware/firebaseAuth.js";
import { notAStudent } from "../middleware/notAStudent.js";

const router = Router();

router.get("/all-announcements", firebaseAuth, getAnnouncements);

router.get("/:announcementId", firebaseAuth, getAnnouncementById);

router.post("/post-announcement", notAStudent, createAnnouncement);

router.patch("/:announcementId/edit", notAStudent, editAnnouncement);

router.delete("/:announcementId/delete", notAStudent, deleteAnnouncement);

export default router;
