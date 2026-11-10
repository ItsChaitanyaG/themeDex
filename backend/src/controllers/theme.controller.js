import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { genGuidePrompt, systemInstruction } from "../utils/genAiPrompts.js";
import groq from "../services/grokService.js";
import analyse from "../services/repoParser.js";
import searchGuide from "../services/guideSearch.js";
import { Guide } from "../models/theme.model.js";

const genGuide = async (prompt) => {
  try {
    const result = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt },
      ],
    });

    const response = result.choices[0]?.message?.content;

    if (!response) {
      throw new ApiError(500, "Failed to generate response");
    }

    return response;
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to generate guide");
  }
};

const analyseRepo = async (githubUrl) => {
    if (!githubUrl) return null;
      const match = githubUrl.match(
        /^https?:\/\/(www\.)?github\.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/
      );
    if (!match || !(match.groups?.owner && match.groups?.name)) return null;

    const owner = match.groups.owner;
    const repo = match.groups.name.replace(/\.git$/, "");

    // const repoData = await axios.get(`${process.env.REPO_ANALYZER_URL}/analyze`, { params: { "owner": owner, "repo": repo } })
    const repoData = await analyse(owner, repo);

    return repoData;
}

const generateThemeGuide = asyncHandler(async (req, res) => {
  const { githubUrl } = req.body;

  if (!githubUrl) {
    throw new ApiError(400, "githubUrl is required");
  }

  if (typeof githubUrl !== "string") throw new ApiError(400, "Please enter a valid URL");

  const existingGuide = await searchGuide(githubUrl);

  if (existingGuide) {
    return res.status(200)
      .json(new ApiResponse(200, existingGuide, "Guide served successfully"))
  }

  const repoData = await analyseRepo(githubUrl);

  if (repoData === null) {
    throw new ApiError(400, "Wrong repository link")
  }

  const guide = await genGuide(genGuidePrompt(repoData));

  if (!guide) {
    throw new ApiError(500, "Failed to generate guide");
  }

  await Guide.findOneAndUpdate({
    content: guide,
    generatedAt: new Date(),
    githubUrl: githubUrl,
  }, {upsert: true})

  res
    .status(200)
    .json(new ApiResponse(200, guide, "Guide generated successfully"));
});

export { generateThemeGuide };
