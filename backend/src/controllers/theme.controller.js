import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { genGuidePrompt, systemInstruction } from "../utils/genAiPrompts.js";
import groq from "../services/grokService.js";
import axios from "axios";

console.log('GROQ KEY:', process.env.GROQ_API_KEY)

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

// const fetchTheme = async (userId, githubUrl, platform) => {
//   const repoFullName = githubUrl
//     .replace("https://github.com/", "")
//     .replace(".git", "")
//     .replace(/\/$/, "");

//   const repoRes = await fetch(`https://api.github.com/repos/${repoFullName}`);

//   if (!repoRes.ok) {
//     throw new ApiError(404, "Repository not found");
//   }

//   const repo = await repoRes.json();

//   const readmeRes = await fetch(
//     `https://api.github.com/repos/${repoFullName}/readme`,
//   );

//   let images;

//   if (!readmeRes.ok) {
//     images = [];
//   } else {
//     const readmeData = await readmeRes.json();
//     const readme = Buffer.from(readmeData.content, "base64").toString("utf-8");
//     const imageRegex = /!\[.*?\]\((.*?)\)/g;

//     const htmlImageRegex = /<img[^>]+src=["']([^"']+)["']/g;

//     const markdownImages = [...readme.matchAll(imageRegex)]
//       .map(m => m[1])
//       .filter(url => url && typeof url === 'string') // ← filter out undefined/null first
//       .map(url => {
//         if (url.startsWith('http')) return url
//         return `${repoRawBase}/${url.replace('./', '')}`
//       })

//     const htmlImages = [...readme.matchAll(htmlImageRegex)]
//       .map(m => m[1])
//       .filter(url => url && typeof url === 'string') // ← same here
//       .map(url => {
//         if (url.startsWith('http')) return url
//         return `${repoRawBase}/${url.replace('./', '')}`
//       })

//     images = [...markdownImages, ...htmlImages].filter(Boolean)
//   }

//   return await Theme.create({
//     name: repo.name,
//     description: repo.description,
//     author: repo.owner.login,
//     submittedBy: userId,
//     images,
//     githubUrl,
//     platform,
//   });
// };

// const addTheme = asyncHandler(async (req, res) => {
//   const { githubUrl, platform } = req.body;
//   const userId = req.user._id;

//   if (!githubUrl || !platform) {
//     throw new ApiError(400, "githubUrl and platform are required");
//   }

//   if (!userId) {
//     throw new ApiError(401, "User not authenticated");
//   }

//   const theme = await fetchTheme(userId, githubUrl, platform); //which will get details from github and will save it to the database

//   if (!theme) {
//     throw new ApiError(404, "Theme not Found, please check the githubUrl");
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, theme, "Theme added successfully"));
// });

const analyseRepo = async (githubUrl) => {
  try {
    if (!githubUrl) return null;
      const match = githubUrl.match(
        /^https?:\/\/(www\.)?github.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/
      );
    if (!match || !(match.groups?.owner && match.groups?.name)) return null;

    const owner = match.groups.owner;
    const repo = match.groups.name;

    const repoData = await axios.get(`${process.env.REPO_ANALYZER_URL}/analyze`, { params: { "owner": owner, "repo": repo } })

    return repoData.data;

  } catch (error) {
    console.error(error);
  }
}

const generateThemeGuide = asyncHandler(async (req, res) => {
  const { githubUrl } = req.body;

  if (!githubUrl) {
    throw new ApiError(400, "githubUrl is required");
  }

  const repoData = await analyseRepo(githubUrl);

  const guide = await genGuide(genGuidePrompt(repoData));

  if (!guide) {
    throw new ApiError(500, "Failed to generate guide");
  }

  res
    .status(200)
    .json(new ApiResponse(200, guide, "Guide generated successfully"));
});

export { generateThemeGuide };
