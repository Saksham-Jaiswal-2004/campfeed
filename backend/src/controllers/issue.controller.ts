import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebaseAdmin.js";
import cacheKeys from "../redis/cacheKeys.js";
import { getCache, setCache, deleteCache } from "../redis/cacheService.js";
import { getIO } from "../index.js";

export async function getCampusIssues(req: any, res: any) {
  try {
    const cached = await getCache<any[]>(cacheKeys.campusIssues);

    if (cached) {
      return res.json({
        source: "redis",
        data: cached,
      });
    }

    const snapshot = await db
      .collection("issues")
      .where("shareOnFeed", "==", true)
      .orderBy("created_at", "desc")
      .get();

    const issues = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    await setCache(cacheKeys.campusIssues, issues, 600);

    return res.json({
      source: "firestore",
      data: issues,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getUserIssues(req: any, res: any) {
  try {
    const { userId } = req.params;

    const cached = await getCache<any[]>(cacheKeys.userIssues(userId));

    if (cached) {
      return res.json({
        source: "redis",
        data: cached,
      });
    }

    const snapshot = await db
      .collection("issues")
      .where("student_id", "==", userId)
      .orderBy("created_at", "desc")
      .get();

    const issues = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    await setCache(cacheKeys.userIssues(userId), issues, 600);

    return res.json({
      source: "firestore",
      data: issues,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getAdminIssues(req: any, res: any) {
  try {
    const cached = await getCache<any[]>(cacheKeys.adminIssues);

    if (cached) {
      return res.json({
        source: "redis",
        data: cached,
      });
    }

    const snapshot = await db
      .collection("issues")
      .orderBy("created_at", "desc")
      .get();

    const issues = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    await setCache(cacheKeys.adminIssues, issues, 600);

    return res.json({
      source: "firestore",
      data: issues,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getIssueById(req: any, res: any) {
  try {
    const { issueId } = req.params;

    const key = cacheKeys.issue(issueId);

    const cached = await getCache<any>(key);

    if (cached) {
      return res.json({
        source: "redis",
        data: cached,
      });
    }

    const doc = await db.collection("issues").doc(issueId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Issue not found" });
    }

    const issue = {
      id: doc.id,
      ...doc.data(),
    };

    await setCache(key, issue, 600);

    return res.json({
      source: "firestore",
      data: issue,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function createIssue(req: any, res: any) {
  try {
    const issue = {
      ...req.body,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("issues").add(issue);

    const newIssue = { id: docRef.id, ...issue };

    await setCache(cacheKeys.issue(docRef.id), newIssue, 600);

    const adminListCache = await getCache<any[]>(cacheKeys.adminIssues);
    if (adminListCache) {
      await setCache(cacheKeys.adminIssues, [newIssue, ...adminListCache], 600);
    }

    if (newIssue.shareOnFeed) {
      const campusListCache = await getCache<any[]>(cacheKeys.campusIssues);
      if (campusListCache) {
        await setCache(
          cacheKeys.campusIssues,
          [newIssue, ...campusListCache],
          600,
        );
      }
    }

    const userListCache = await getCache<any[]>(
      cacheKeys.userIssues(newIssue.student_id),
    );
    if (userListCache) {
      await setCache(
        cacheKeys.userIssues(newIssue.student_id),
        [newIssue, ...userListCache],
        600,
      );
    }

    return res.json({
      success: true,
      docId: docRef.id,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function issueVote(req: any, res: any) {
  try {
    const { issueId } = req.params;

    const upvotedBy = req.user.uid;

    const docRef = db.collection("issues").doc(issueId);

    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        error: "Issue not found",
      });
    }

    const data = doc.data();
    const alreadyUpvoted = data?.upvotedBy?.includes(upvotedBy);

    await docRef.update({
      upvotes: FieldValue.increment(alreadyUpvoted ? -1 : 1),
      upvotedBy: alreadyUpvoted ? FieldValue.arrayRemove(upvotedBy) : FieldValue.arrayUnion(upvotedBy),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const updatedDoc = await docRef.get();
    const updatedIssue = { id: updatedDoc.id, ...updatedDoc.data(), };

    const shouldInvalidateCampus = doc.data()?.shareOnFeed === true;

    await Promise.all([
      deleteCache(cacheKeys.adminIssues),
      deleteCache(cacheKeys.userIssues(doc.data()?.student_id)),
      shouldInvalidateCampus ? deleteCache(cacheKeys.campusIssues) : "",
    ]);

    getIO().emit("issue_upvote", { issue: updatedIssue })

    return res.json({
      success: true,
      data: updatedIssue,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message,
    });
  }
}

export async function editIssue(req: any, res: any) {
  try {
    const { issueId } = req.params;

    const docRef = db.collection("issues").doc(issueId);

    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        error: "Issue not found",
      });
    }

    await docRef.update({
      ...req.body,
      updatedAt: FieldValue.serverTimestamp(),
    });

    const updatedDoc = await docRef.get();
    const updatedIssue = { id: updatedDoc.id, ...updatedDoc.data(), };

    const shouldInvalidateCampus =
      doc.data()?.shareOnFeed !== req.body.shareOnFeed ||
      doc.data()?.shareOnFeed === true;

    await Promise.all([
      deleteCache(cacheKeys.adminIssues),
      deleteCache(cacheKeys.userIssues(doc.data()?.student_id)),
      shouldInvalidateCampus ? deleteCache(cacheKeys.campusIssues) : "",
    ]);

    getIO().emit("issue_updated", { issue: updatedIssue })

    return res.json({
      success: true,
      data: updatedIssue,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message,
    });
  }
}

export async function deleteIssue(req: any, res: any) {
  try {
    const { issueId } = req.params;

    const docRef = db.collection("issues").doc(issueId);

    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        error: "Issue not found",
      });
    }

    await docRef.delete();

    await Promise.all([
      deleteCache(cacheKeys.adminIssues),
      deleteCache(cacheKeys.userIssues(doc.data()?.student_id)),
      doc.data()?.shareOnFeed ? deleteCache(cacheKeys.campusIssues) : "",
    ]);

    return res.json({
      success: true,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message,
    });
  }
}
