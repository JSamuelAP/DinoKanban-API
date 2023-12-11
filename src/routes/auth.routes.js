import { Router } from "express";

const router = Router();

router.post("/signup");
router.post("/login");
router.post("/refresh-token");
router.delete("/logout");

export default router;
