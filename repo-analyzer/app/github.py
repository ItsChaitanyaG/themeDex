import httpx
import base64

async def get_readme(owner, repo):
    url= f"https://api.github.com/repos/{owner}/{repo}/readme"

    async with httpx.AsyncClient() as client:
        res = await client.get(url)

    res.raise_for_status()

    data = res.json()

    content = data["content"]

    new_data = base64.b64decode(content).decode("utf-8")

    return new_data

async def get_file(url):
    async with httpx.AsyncClient() as client:
        res = await client.get(url)

    res.raise_for_status()

    data = res.json()

    content = data["content"]

    new_data = base64.b64decode(content).decode("utf-8")

    return new_data

async def get_fileTree(owner, repo):
    branch = await get_default_branch(owner, repo)


    url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/{branch}?recursive=1"

    async with httpx.AsyncClient() as client:
        res = await client.get(url)

    res.raise_for_status()

    data = res.json()

    tree = data["tree"]

    return tree

async def get_default_branch(owner, repo):
    url = f"https://api.github.com/repos/{owner}/{repo}"

    async with httpx.AsyncClient() as client:
        res = await client.get(url)

    res.raise_for_status()

    data = res.json()

    return data["default_branch"]
