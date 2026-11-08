import { Guide } from "../models/theme.model.js"

const GUIDE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

const searchGuide = async(githubUrl) => {
  const guide = await Guide.findOne({ githubUrl }).lean();

  if (!guide) return null;

  const isFresh = guide?.content && Date.now() - guide.generatedAt < GUIDE_MAX_AGE;

  if (!isFresh) return null;

  return guide.content;
}

export default searchGuide;
