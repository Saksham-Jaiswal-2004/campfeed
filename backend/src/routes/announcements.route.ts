import { Router } from "express";
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  editAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.controller.js";
import { firebaseAuth } from "../middleware/firebaseAuth.js";

const router = Router();

router.get("/all-announcements", firebaseAuth, getAnnouncements);

router.get("/:announcementId", firebaseAuth, getAnnouncementById);

router.post("/post-announcement", firebaseAuth, createAnnouncement);

router.patch("/:announcementId/edit", firebaseAuth, editAnnouncement);

router.delete("/:announcementId/delete", firebaseAuth, deleteAnnouncement);

export default router;
