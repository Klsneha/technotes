import express, { Router, Request, Response } from "express";
import path from "path";
const router = Router();

// Possible routes /, /index, /index.html
router.get("^/$|/index(.html)?", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname,"..","views","index.html"));
});

export default router;