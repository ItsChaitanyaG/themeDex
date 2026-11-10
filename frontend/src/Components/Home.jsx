import React, { useEffect, useState } from "react";
import axiosInstance from "../Utils/axiosInstance";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Palette,
  Image as ImageIcon,
  MousePointer2,
  Settings2,
  AppWindow,
  Terminal,
  Search,
  Cpu,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState(() => sessionStorage.getItem("repoUrl") ?? "");
  const [guide, setGuide] = useState(() => sessionStorage.getItem("guide") ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem("repoUrl", repoUrl);
      sessionStorage.setItem("guide", guide);
    } catch {}
  }, [repoUrl, guide])

  const handleAnalyze = (e) => {
    e.preventDefault();

    if (!repoUrl.trim()) return;

    setLoading(true);

    const getGuide = async () => {
      try {
        const res = await axiosInstance.post("/themes/generateGuide", { githubUrl: repoUrl });
        setGuide(res.data.data);
      } catch (error) {
        toast.error(error.response?.data?.message ?? error.message);
      } finally {
        setLoading(false);
      }
    }

    getGuide();

    console.log("Analyzing:", repoUrl);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#FF5252] pb-16 text-black"
      style={{ fontFamily: "'Montserrat', system-ui, sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&display=swap');`}</style>

      {/* Background rings */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full border-[36px] border-[#E04545]" />
        <div className="absolute -bottom-52 -left-40 h-[30rem] w-[30rem] rounded-full border-[36px] border-[#E04545]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5">
        {/* Navbar */}
        <header className={`${CARD} mt-6 flex items-center justify-between rounded-2xl px-5 py-3`}>
          <span href="#" className="text-2xl text-black font-extrabold tracking-tight">
            ThemeDex
          </span>
          <a
            href="https://github.com/ItsChaitanyaG/themeDex"
            target="_blank"
            className="rounded-xl border-[3px] border-black bg-white text-black px-4 py-1.5 text-sm font-bold shadow-[3px_3px_0_0_#111] transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            GitHub
          </a>
        </header>

        <main className="mt-10">

          {/* Headline */}
          <div className={`${CARD} ${DOTS} mt-10 rounded-3xl p-6 sm:p-8`}>
            <h1 className="text-3xl font-medium leading-tight sm:text-4xl">
              Understand any Linux <strong className="font-extrabold">customization repo.</strong>
            </h1>
            <p className="mt-4 max-w-xl text-base font-medium text-black/70">
              Found a cool theme, icon pack, dotfiles or rice on GitHub? Paste the repository and
              get a clear guide for installing and using it.
            </p>

            <form onSubmit={handleAnalyze} className="mt-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="url"
                  required
                  aria-label="GitHub repository URL"
                  placeholder="https://github.com/user/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full rounded-xl border-[3px] border-black bg-white px-4 py-3 font-semibold shadow-[4px_4px_0_0_#111] placeholder:text-black/40 focus:outline-none focus:bg-[#FFFBD6] focus:shadow-[6px_6px_0_0_#111]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="hover:cursor-pointer rounded-xl border-[3px] border-black bg-[#D7FF1F] px-8 py-3 text-lg font-extrabold shadow-[4px_4px_0_0_#111] transition active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-60 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  {loading ? "Analyzing…" : "Analyze"}
                </button>
              </div>
            </form>
          </div>

          {/* Guide */}
          {guide && (
            <section className="mt-10">
              <span className="inline-block rounded-t-xl border-[3px] border-b-0 border-black bg-[#D7FF1F] px-5 py-1.5 text-sm font-extrabold">
                Guide
              </span>
              <div className={`${CARD} rounded-b-2xl rounded-tr-2xl p-6`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>
                  {guide}
                </ReactMarkdown>
              </div>
            </section>
          )}

          {/* Examples */}
                    <p className="mt-10 text-center text-sm font-bold text-white">Try a repo containing:</p>
                    <div className="mt-3 flex flex-wrap justify-center gap-3">
                      {chips.map(([Icon, label, bg]) => (
                        <span
                          key={label}
                          className={`${bg} inline-flex items-center gap-2 rounded-xl border-[3px] border-black px-3 py-1 text-sm font-bold shadow-[3px_3px_0_0_#111]`}
                        >
                          <Icon size={16} strokeWidth={2.5} aria-hidden />
                          {label}
                        </span>
                      ))}
                    </div>

                    {/* How it works */}
                    <div className="mt-12 grid gap-5 sm:grid-cols-3">
                      {steps.map(([Icon, bg, title, text]) => (
                        <div key={title} className={`${CARD} rounded-2xl p-5`}>
                          <span
                            className={`${bg} grid h-12 w-12 place-items-center rounded-xl border-[3px] border-black shadow-[3px_3px_0_0_#111]`}
                          >
                            <Icon size={24} strokeWidth={2.5} aria-hidden />
                          </span>
                          <h3 className="mt-3 font-extrabold">{title}</h3>
                          <p className="mt-1 text-sm font-medium text-black/70">{text}</p>
                        </div>
                      ))}
                    </div>
        </main>
      </div>
    </div>
  );
}


const CARD = "border-[3px] border-black bg-[#FBF9EE] shadow-[6px_6px_0_0_#111]";
const DOTS =
  "[background-image:radial-gradient(#d9d6c3_1px,transparent_1px)] [background-size:14px_14px]";

// Styles for the rendered guide (no typography plugin needed)
const md = {
  h1: ({ children }) => <h2 className="mb-2 mt-6 text-2xl font-extrabold">{children}</h2>,
  h2: ({ children }) => <h2 className="mb-2 mt-6 text-xl font-extrabold">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-1 mt-4 text-lg font-bold">{children}</h3>,
  p: ({ children }) => <p className="my-3 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="my-3 list-disc space-y-1 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 list-decimal space-y-1 pl-6">{children}</ol>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noreferrer" className="font-bold underline">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-4 border-black bg-[#D7FF1F]/40 py-1 pl-4">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-xl border-[3px] border-black">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-2 border-black bg-[#A8E4FF] px-3 py-2 text-left font-bold">{children}</th>
  ),
  td: ({ children }) => <td className="border-2 border-black px-3 py-2 align-top">{children}</td>,
  pre: ({ children }) => (
    <pre className="my-3 overflow-x-auto rounded-xl border-[3px] border-black bg-[#111] p-4 text-sm text-[#FBF9EE]">
      {children}
    </pre>
  ),
  code: ({ className, children }) => {
    const isBlock = /language-/.test(className || "") || String(children).includes("\n");
    return isBlock ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="rounded bg-[#A8E4FF] px-1.5 py-0.5 text-[0.9em] font-semibold text-black">
        {children}
      </code>
    );
  },
};

const chips = [
  [Palette, "GTK themes", "bg-[#A8E4FF]"],
  [ImageIcon, "Icons", "bg-[#A6EE7A]"],
  [MousePointer2, "Cursors", "bg-[#FFB8DE]"],
  [Settings2, "Dotfiles", "bg-[#D7FF1F]"],
  [AppWindow, "Hyprland", "bg-[#A8E4FF]"],
  [Terminal, "Shell configs", "bg-[#A6EE7A]"],
];

const steps = [
  [Search, "bg-[#A8E4FF]", "Analyze the repo", "We inspect the README, scripts and relevant files."],
  [Cpu, "bg-[#D7FF1F]", "Understand it", "The repository context is used to understand how it actually works."],
  [BookOpen, "bg-[#FFB8DE]", "Get your guide", "Receive a straightforward installation and configuration guide."],
];
