import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [guide, setGuide] = useState("");

  const handleAnalyze = (e) => {
    e.preventDefault();

    if (!repoUrl.trim()) return;

    const getGuide = async () => {
      try {
        const res = await axiosInstance.post("/themes/generateGuide", { githubUrl: repoUrl });
        setGuide(res.data.data);
      } catch (error) {
        console.error(error);
      }
    }

    getGuide();

    console.log("Analyzing:", repoUrl);
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 px-6 shadow-sm">
        <div className="flex-1">
          <a className="text-2xl font-bold tracking-tight">
            Theme<span className="text-primary">Dex</span>
          </a>
        </div>

        <div className="flex-none">
          <a className="btn btn-ghost">GitHub</a>
        </div>
      </div>

      {/* Hero */}
      <main className="flex min-h-[calc(100vh-65px)] items-center justify-center px-6">
        <div className="w-full max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex rounded-full bg-base-100 px-4 py-2 text-sm shadow-sm">
            🐧 Built for Linux customization
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-bold leading-tight md:text-6xl">
            Understand any Linux
            <span className="text-primary"> customization repo.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-base-content/60">
            Found a cool theme, icon pack, dotfiles or rice on GitHub?
            Paste the repository and get a clear guide for installing and
            using it.
          </p>

          {/* URL input */}
          <form
            onSubmit={handleAnalyze}
            className="mx-auto mt-10 max-w-2xl"
          >
            <div className="flex flex-col gap-3 rounded-2xl bg-base-100 p-3 shadow-lg sm:flex-row">
              <input
                type="url"
                placeholder="https://github.com/user/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="input input-lg w-full border-0 bg-transparent focus:outline-none"
                required
              />

              <button
                type="submit"
                className="btn btn-primary btn-lg sm:px-8"
              >
                Analyze
              </button>
            </div>
          </form>

          <div className="mt-4 text-start">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {guide}
            </ReactMarkdown>
          </div>

          {/* Examples */}
          <div className="mt-6 text-sm text-base-content/50">
            Try a repo containing:
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <span className="badge badge-outline">🎨 GTK themes</span>
            <span className="badge badge-outline">🖼️ Icons</span>
            <span className="badge badge-outline">🖱️ Cursors</span>
            <span className="badge badge-outline">⚙️ Dotfiles</span>
            <span className="badge badge-outline">🪟 Hyprland</span>
            <span className="badge badge-outline">🐚 Shell configs</span>
          </div>

          {/* Trust / explanation */}
          <div className="mt-14 grid gap-4 text-left sm:grid-cols-3">
            <div className="rounded-xl bg-base-100 p-5 shadow-sm">
              <div className="text-2xl">🔍</div>
              <h3 className="mt-3 font-semibold">Analyze the repo</h3>
              <p className="mt-1 text-sm text-base-content/60">
                We inspect the README, scripts and relevant files.
              </p>
            </div>

            <div className="rounded-xl bg-base-100 p-5 shadow-sm">
              <div className="text-2xl">🤖</div>
              <h3 className="mt-3 font-semibold">Understand it</h3>
              <p className="mt-1 text-sm text-base-content/60">
                The repository context is used to understand how it actually
                works.
              </p>
            </div>

            <div className="rounded-xl bg-base-100 p-5 shadow-sm">
              <div className="text-2xl">📖</div>
              <h3 className="mt-3 font-semibold">Get your guide</h3>
              <p className="mt-1 text-sm text-base-content/60">
                Receive a straightforward installation and configuration
                guide.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
