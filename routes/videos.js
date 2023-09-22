import express from "express";
import {
  addVideo,
  addView,
  deleteVideo,
  getByTag,
  getVideo,
  random,
  search,
  sub,
  trend,
  updateVideo,
} from "../controllers/Video.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, addVideo);
router.put("/:id", verifyToken, updateVideo);
router.delete("/:id", verifyToken, deleteVideo);
router.get("/find/:id", getVideo);
router.get("/view/:id", addView);
router.get("/trend/:id", trend);
router.get("/random", random);
router.get("/sub", verifyToken, sub); //subscribed channels
router.get("/tags", getByTag);
router.get("/search", search);

export default router;
