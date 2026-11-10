import ApiError from "../utils/ApiError.js";

const analyse = async (owner, repo) => {

  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);

  if (!repoRes.ok) {
    throw new ApiError(404, "Repository not found");
  }

  const repoJson = await repoRes.json();

  const defaultBranch = repoJson.default_branch;

  const readmeData = await getReadme(owner, repo);
  const tree = await getTree(owner, repo, defaultBranch);
  const fileData = {
    readme : readmeData,
    scripts : [],
  }

//   if (!readmeData) {
//     const SCRIPT_RE = /(^|\/)(install|setup|bootstrap)[^/]*\.sh$/i;
//
//     const scriptItems = tree
//       .filter((i) => i.type === "blob" && SCRIPT_RE.test(i.path) && (i.size ?? 0) < 100_000)
//       .slice(0, 5);
//
//     if (!scriptItems) return fileData;
//
//     for (const item of scriptItems) {
//       const content = await getFile(item.url);
//       if (content) fileData.scripts.push({ "filePath": item.path, "content": content });
//     }
//
//     return fileData;
//   }

  const matches = [...new Set(readmeData?.match(/[\w./-]+\.sh/g) ?? [])];

  if (matches.length === 0) {
    // return fileData;
    const SCRIPT_RE = /(^|\/)(install|setup|bootstrap)[^/]*\.sh$/i;

    const scriptItems = tree
      .filter((i) => i.type === "blob" && SCRIPT_RE.test(i.path) && (i.size ?? 0) < 100_000)
      .slice(0, 5);

    if (!scriptItems) return fileData;

    for (const item of scriptItems) {
      const content = await getFile(item.url);
      if (content) fileData.scripts.push({ "filePath": item.path, "content": content });
    }

    return fileData;
  }

  for (const match of matches) {
    for (const item of tree) {
      if (match === item.path) {
        const scriptData = await getFile(item.url);
        fileData.scripts.push({ "filePath": item.path, "content": scriptData });
      }
    }
  }

  return fileData;
}

const getReadme = async(owner, repo) => {

  const url = `https://api.github.com/repos/${owner}/${repo}/readme`;

  const res = await fetch(url);

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new ApiError(res.status, "Failed to fetch Readme");
  }

  const data = await res.json();
  const readme = Buffer.from(data.content, "base64").toString("utf-8");

  return readme;
}

const getTree = async (owner, repo, defaultBranch) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`

  const res = await fetch(url);
  if (!res.ok) {
    throw new ApiError(res.status, "Failed to fetch tree")
  }

  const data = await res.json();

  const tree = data.tree;

  return tree;
}

const getFile = async (url) => {
  const res = await fetch(url);

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new ApiError(res.status, "Failed to fetch File")
  }

  const data = await res.json();

  const fileData = Buffer.from(data.content, "base64").toString("utf-8");

  return fileData;
}

export default analyse;
