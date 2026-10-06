# ThemeDex

> AI-powered installation guide generator for Linux customization themes and configurations.

ThemeDex helps beginners install Linux customization projects such as **dotfiles, shell themes, cursor themes, terminal configurations, and other customization setups** hosted on GitHub.

Instead of trying to understand a project's README and installation scripts on their own, users can paste a public GitHub repository URL and ThemeDex generates a **beginner-friendly, step-by-step installation guide** with explanations and common problems they may encounter.

## Why ThemeDex?

Linux customization projects often assume that users already understand Linux, shell commands, configuration files, and the project's installation process.

A README might say:

```bash
./install.sh
```

without explaining:

* What the script does
* What needs to be installed first
* Where files will be placed
* Which commands should be run
* What to do if something goes wrong

ThemeDex attempts to bridge this gap by analyzing the repository's available installation information and using an LLM to turn it into an easier-to-follow guide.

## How It Works

ThemeDex does not simply send the repository URL to an LLM and ask it to guess how the project works.

Instead, it uses a small repository-analysis layer to provide the model with relevant information from the actual repository.

### Current workflow

```text
GitHub Repository URL
        │
        ▼
   Fetch README
        │
        ▼
Check for referenced shell scripts
        │
        ├── No script found
        │       │
        │       ▼
        │   README → LLM
        │
        └── Script referenced
                │
                ▼
        Fetch repository file tree
                │
                ▼
       Locate referenced script
                │
                ▼
       Fetch script contents
                │
                ▼
       README + Script → LLM
                │
                ▼
      Beginner-friendly guide
```

When the README references an installation shell script, ThemeDex retrieves the relevant script from the repository and provides it alongside the README as context for guide generation.

This gives the LLM access to the project's actual installation logic instead of relying entirely on assumptions.

## Architecture

ThemeDex currently consists of three main components:

### Frontend

Built with:

* React
* Vite
* JavaScript
* React Markdown

The frontend accepts a GitHub repository URL and displays the generated installation guide.

### Backend

Built with:

* Node.js
* Express.js
* JavaScript
* REST API
* Groq API

The backend handles requests from the frontend, coordinates repository analysis, constructs the LLM prompt, and returns the generated guide.

### Repository Analyzer

Built with:

* Python
* GitHub API

The repository analyzer retrieves information from a GitHub repository.

Its current purpose is to:

1. Retrieve the repository README.
2. Look for references to shell installation scripts.
3. Retrieve the repository file tree when such a script is referenced.
4. Locate the referenced script.
5. Retrieve the script contents.
6. Return the relevant repository information to the backend.

## LLM Context Strategy

One of the main design decisions in ThemeDex is to avoid giving the LLM incomplete information and asking it to fill in the gaps.

For example, if a README references:

```bash
./install.sh
```

ThemeDex attempts to retrieve the actual `install.sh` file and provide it as context.

The generated guide is instructed to rely on information available in the repository rather than inventing installation commands or procedures.

This is intended to reduce hallucinated installation instructions and make the generated guide more faithful to the original project.

## Example Use Case

A beginner finds a Linux customization project on GitHub but doesn't fully understand its installation instructions.

Instead of manually figuring out the repository structure and installation script, they can:

1. Copy the GitHub repository URL.
2. Paste it into ThemeDex.
3. Generate the guide.
4. Follow the resulting steps.
5. Use the troubleshooting information when they encounter common problems.

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* React Markdown

### Backend

* Node.js
* Express.js
* Groq API

### Repository Analysis

* Python
* GitHub API

## Project Structure

```text
themeDex/
├── backend/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   └── ...
│
└── repo-analyzer/
    └── app/
        └── ...
```

## Current Limitations

ThemeDex is currently an MVP.

The repository-analysis logic primarily focuses on **shell installation scripts referenced by the project's README**.

Projects that use other installation mechanisms or provide incomplete documentation may not be analyzed as thoroughly.

ThemeDex also currently works with publicly accessible GitHub repositories.

## Future Improvements

Possible future improvements include:

* Detecting more installation mechanisms beyond `.sh` files
* Better identification of installation-related files
* Improved handling of repositories with incomplete documentation
* More detailed source/evidence references in generated guides
* Better error handling and user feedback
* Support for additional repository hosting platforms
* Improved troubleshooting based on repository-specific information

## Project Status

ThemeDex is a personal project/MVP built to explore:

* LLM-powered applications
* Repository analysis
* Retrieval of relevant context
* Prompt engineering
* Backend API design
* AI-assisted documentation
* Building beginner-focused developer tools

## Disclaimer

Generated guides should be treated as assistance rather than a guarantee that an installation is safe or appropriate for every system.

Always review installation scripts and commands from repositories you do not trust before executing them on your machine.
