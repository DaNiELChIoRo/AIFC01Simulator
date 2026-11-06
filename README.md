# ⏱ AIF-C01 Exam Sim

A full-length, timed **exam simulator** for the **AWS Certified AI Practitioner (AIF-C01)**. Zero dependencies, no build step — plain HTML/CSS/JS that runs from GitHub Pages or straight off the filesystem.

> Unofficial. Not affiliated with or endorsed by Amazon Web Services, and not real exam content. A study aid — always confirm details against the official [exam guide](https://aws.amazon.com/certification/certified-ai-practitioner/).

## Sister project: CCA-F Exam Sim

The same engine also runs a simulator for the **Claude Certified Architect – Foundations (CCA-F)** exam, in its own repo: [CCAFSimulator](https://github.com/DaNiELChIoRo/CCAFSimulator) ([live](https://danielchioro.github.io/CCAFSimulator/)).

## Simulator, not a quiz

This is the companion to the [AIF-C01 Trainer](https://github.com/DaNiELChIoRo/AIFC01Trainer), and it deliberately behaves differently. The Trainer teaches you one question at a time; the Sim rehearses exam day.

| | AIF-C01 Trainer | **AIF-C01 Exam Sim** |
|---|---|---|
| Session | Pick domains, pick a length | One fixed 65-question paper |
| Timing | Untimed | **90-minute countdown**, auto-submits at zero |
| Feedback | Immediately after each answer | **Nothing until you submit** |
| Navigation | Forward only | **Jump anywhere, flag, change answers** |
| Result | Percentage + per-domain bars | **Scaled 100–1000 score vs. the 700 pass mark** |

## What it does

- **65 questions, 90 minutes, one clock.** The countdown is derived from a wall-clock deadline, so it keeps running when the tab is backgrounded or closed — no pausing your way to a better score.
- **Exam-day silence.** No verdicts, no explanations, no score hints while the paper is open.
- **Flag and revisit.** A navigator grid shows which questions are answered and which are flagged, and jumps to any of them in one click.
- **Crash-safe.** Every answer and flag is checkpointed to `localStorage`. Reload or reopen the tab and it offers to resume, clock intact. A paper whose time already expired is discarded rather than resumed.
- **Scaled score report.** A 100–1000 scaled score against the real 700 pass mark, time taken, blanks, flags, and a per-domain breakdown showing each domain's score beside its official exam weight.
- **Targeted study links.** Any domain under 70% gets curated official-AWS-doc links on the results screen.
- **Full answer review.** Every question with the key and an explanation, filterable to **incorrect** or **flagged** only.
- **Attempt history** and best scaled score, kept in the browser.
- **Keyboard-driven:** `A`–`D` or `1`–`4` to answer, `←`/`→` to move, `F` to flag, `Enter` to advance, `Esc` to dismiss a dialog.
- Light/dark theme following your OS by default, and a reduced-motion path.

## The exam, at a glance

| | |
|---|---|
| Exam code | **AIF-C01** |
| Level | Foundational |
| Questions | 65 (50 scored + 15 unscored) |
| Time | 90 minutes |
| Passing score | Scaled **700** (100–1,000) |
| Cost | US$100 |

## Question bank

66 scenario questions, translated to English from a Spanish AIF-C01 study set, each mapped to one of the five official domains:

| Domain | Weight | In bank |
|---|--:|--:|
| 🧠 Fundamentals of AI and ML | 20% | 25 |
| ✨ Fundamentals of Generative AI | 24% | 9 |
| 🏗️ Applications of Foundation Models | 28% | 13 |
| ⚖️ Guidelines for Responsible AI | 14% | 10 |
| 🔐 Security, Compliance & Governance | 14% | 9 |

Each paper draws 65 of the 66 and shuffles both the question order and every question's options, so repeat attempts are not the same paper in the same order.

**One caveat worth knowing:** the bank over-weights Domain 1 (38% of items vs. its 20% exam weight) and under-weights Domain 2, because the source set leans heavily on "which AWS AI service fits this use case?" questions. Your per-domain percentages are sound, but treat the overall scaled score as an indicator rather than a calibrated prediction. Adding Domain 2 and 3 questions is the highest-value way to improve it.

## How the scaled score is computed

AWS does not publish its raw-to-scaled mapping. This simulator uses a linear interpolation anchored so that 70% correct lands exactly on 700:

- `0%` → 100, `70%` → **700**, `100%` → 1000

That makes the number directly comparable to the real score report's shape without pretending to reproduce AWS's actual (undisclosed) equating. See `scaledFrom()` in `assets/js/app.js`.

## Run locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Opening `index.html` directly from the filesystem works too — there are no module imports or fetches.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repo.
2. **Settings → Pages → Source: _Deploy from a branch_ → `main` / `(root)`**, Save.
3. Live at `https://<user>.github.io/<repo>/`. The `.nojekyll` file makes Pages serve the files as-is.

## Add or edit questions

**`assets/js/questions.js`** — the bank. Each entry:

```js
{
  id: "q67",
  domain: "d3",                  // key from EXAM_DOMAINS in domains.js
  prompt: "Your scenario question?",
  options: [
    { text: "The right answer", correct: true },
    { text: "A plausible distractor", correct: false },
  ],
  explanation: "Why the right answer is right, and why the distractors are not.",
}
```

More than one `correct: true` makes it a multiple-response item automatically — the engine switches the prompt to "Select all that apply" and the option markers to checkboxes, and requires an exact match to score.

Because options are **shuffled at runtime**, never write an explanation or option that refers to another option by letter ("both A and B").

**`assets/js/domains.js`** — the five domains, their official weights, and the documentation links the results screen offers for a weak domain.

## Project structure

```
index.html              # AIF-C01 shell: top bar, main region, dialog host
.nojekyll
assets/
  css/styles.css        # exam-console theme (cyan accent, monospace clock)
  js/domains.js         # the 5 domains: weights, blurbs, study links
  js/questions.js       # the 66-question bank
  js/app.js             # exam engine: paper, clock, scoring, report, review
```

A page can sit a different exam on the same engine by defining `window.EXAM_CONFIG` before `app.js` loads: `spec` overrides the question count, minutes, pass mark, and the raw % mapped to it (`passPct`); `copy` overrides the exam name and source labels; and `storagePrefix` keeps that exam's history separate. The [CCA-F Exam Sim](https://github.com/DaNiELChIoRo/CCAFSimulator) is the worked example.

The engine is one IIFE with a small state object and four views (`intro → exam → report → review`), re-rendered from state on each interaction. The only exception is the clock, which patches its own node every second so a 65-dot navigator isn't rebuilt 5,400 times per paper.
