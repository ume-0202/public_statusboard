import express from "express";

const router = express.Router();
router.get("/health", (_, res) => {
  res.send({
    status: "ok",
    details: "Everything is just peachy 🍑",
    time: new Date().toISOString()
  });
});

export default router;
