import { Router } from "express";
import {
  addTheme,
  generateThemeGuide,
  getAllThemes,
  getTheme,
} from "../controllers/theme.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getAllThemes);
router.route("/:id").get(getTheme);
router.route("/:id/generateGuide").get(generateThemeGuide);

//secured routes
router.route("/addTheme").post(verifyJWT, addTheme);

export default router;
