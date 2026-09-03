import { Router } from "express";
import {
  generateThemeGuide,
} from "../controllers/theme.controller.js";


const router = Router();

router.route("/generateGuide").post(generateThemeGuide);


export default router;
