from fastapi import FastAPI
from github import get_file, get_readme, get_fileTree
import re

app = FastAPI()

@app.get("/")
def root():
    return{"message": "repo analyzer is running"}

@app.get("/analyze")
async def analyze(owner: str, repo: str):
   new_repo = repo.removesuffix(".git")

   readme_data = await get_readme(owner, new_repo)
   tree = await get_fileTree(owner, new_repo)
   file_data = {'readme':readme_data, 'scripts':[]}

   matches = re.findall(r'[\w./-]+\.sh', readme_data)

   if len(matches) == 0:
      return file_data

   set_matches = set()
   for match in matches:
       set_matches.add(match.lstrip("./"))

   print(set_matches)

   for match in set_matches:
       for item in tree:
           if match == item["path"]:
               script_data = await get_file(item["url"])
               file_data["scripts"].append({"file_path": item["path"], "content": script_data})


   return file_data
