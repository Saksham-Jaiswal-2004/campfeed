import { Router } from "express";
import {
  getCampusIssues,
  getUserIssues,
  getAdminIssues,
  getIssueById,
  createIssue,
  editIssue,
  deleteIssue,
  issueVote,
} from "../controllers/issue.controller.js";
import { firebaseAuth } from "../middleware/firebaseAuth.js";
import { notAStudent } from "../middleware/notAStudent.js";

const router = Router();

router.get("/campus-feed", firebaseAuth, getCampusIssues);

router.get("/userIssues/:userId", firebaseAuth, getUserIssues);

router.get("/admin", notAStudent, getAdminIssues);

router.get("/:issueId", firebaseAuth, getIssueById);

router.post("/post-issue", firebaseAuth, createIssue);

router.patch("/:issueId/vote", firebaseAuth, issueVote);

router.patch("/:issueId/edit", firebaseAuth, editIssue);

router.delete("/:issueId/delete", firebaseAuth, deleteIssue);

export default router;
