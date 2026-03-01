import { useState, useRef, useEffect } from "react";

// ─── Storage ─────────────────────────────────────────────────────────
const STORE = {
  profile: "fp-profile-v2",
  signature: "fp-signature-v2",
};

const _memStore = {};
async function store(key, val) {
  _memStore[key] = JSON.stringify(val);
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}
async function load(key) {
  try {
    const r = localStorage.getItem(key);
    if (r) {
      try { return JSON.parse(r); } catch { return r; }
    }
  } catch {}
  if (_memStore[key]) {
    try { return JSON.parse(_memStore[key]); } catch { return _memStore[key]; }
  }
  return null;
}
async function remove(key) {
  delete _memStore[key];
  try { localStorage.removeItem(key); } catch {}
}

// ─── Country → Greeting Map ─────────────────────────────────────────
const COUNTRIES = [
  { name: "Pakistan", greeting: "AOA" },
  { name: "India", greeting: "Namaste" },
  { name: "Bangladesh", greeting: "Assalamu Alaikum" },
  { name: "Sri Lanka", greeting: "Ayubowan" },
  { name: "Nepal", greeting: "Namaste" },
  { name: "Saudi Arabia", greeting: "Assalamu Alaikum" },
  { name: "UAE", greeting: "Marhaba" },
  { name: "Qatar", greeting: "Marhaba" },
  { name: "Kuwait", greeting: "Marhaba" },
  { name: "Egypt", greeting: "Ahlan" },
  { name: "Jordan", greeting: "Marhaba" },
  { name: "Lebanon", greeting: "Marhaba" },
  { name: "Turkey", greeting: "Merhaba" },
  { name: "Iran", greeting: "Salam" },
  { name: "Iraq", greeting: "Marhaba" },
  { name: "Oman", greeting: "Marhaba" },
  { name: "Bahrain", greeting: "Marhaba" },
  { name: "Morocco", greeting: "Salam" },
  { name: "Japan", greeting: "Konnichiwa" },
  { name: "China", greeting: "Ni Hao" },
  { name: "South Korea", greeting: "Annyeonghaseyo" },
  { name: "Indonesia", greeting: "Selamat" },
  { name: "Malaysia", greeting: "Selamat" },
  { name: "Philippines", greeting: "Kamusta" },
  { name: "Thailand", greeting: "Sawasdee" },
  { name: "Vietnam", greeting: "Xin Chao" },
  { name: "United States", greeting: "Hi" },
  { name: "Canada", greeting: "Hi" },
  { name: "United Kingdom", greeting: "Hi" },
  { name: "Australia", greeting: "G'day" },
  { name: "New Zealand", greeting: "Kia ora" },
  { name: "France", greeting: "Bonjour" },
  { name: "Germany", greeting: "Hallo" },
  { name: "Spain", greeting: "Hola" },
  { name: "Italy", greeting: "Ciao" },
  { name: "Portugal", greeting: "Olá" },
  { name: "Netherlands", greeting: "Hallo" },
  { name: "Russia", greeting: "Privet" },
  { name: "Poland", greeting: "Cześć" },
  { name: "Sweden", greeting: "Hej" },
  { name: "Norway", greeting: "Hei" },
  { name: "Denmark", greeting: "Hej" },
  { name: "Finland", greeting: "Hei" },
  { name: "Greece", greeting: "Yia sou" },
  { name: "Ireland", greeting: "Dia dhuit" },
  { name: "Mexico", greeting: "Hola" },
  { name: "Brazil", greeting: "Olá" },
  { name: "Argentina", greeting: "Hola" },
  { name: "Colombia", greeting: "Hola" },
  { name: "Nigeria", greeting: "Hello" },
  { name: "Kenya", greeting: "Jambo" },
  { name: "South Africa", greeting: "Howzit" },
].sort((a, b) => a.name.localeCompare(b.name));

// ─── Handwriting Font Families (loaded via Google Fonts) ────────────
const SIGNATURE_FONTS = [
  { id: "dancing", family: "Dancing Script", weight: 700, gImport: "Dancing+Script:wght@700" },
  { id: "greatvibes", family: "Great Vibes", weight: 400, gImport: "Great+Vibes" },
  { id: "pacifico", family: "Pacifico", weight: 400, gImport: "Pacifico" },
  { id: "sacramento", family: "Sacramento", weight: 400, gImport: "Sacramento" },
  { id: "allura", family: "Allura", weight: 400, gImport: "Allura" },
  { id: "alexbrush", family: "Alex Brush", weight: 400, gImport: "Alex+Brush" },
];

// ─── Signature Style Templates ──────────────────────────────────────
const SIGNATURE_STYLES = [
  {
    id: "minimal",
    label: "Minimal",
    icon: "—",
    font: "dancing",
    color: "#c8a064",
    build: (p) => {
      const lines = [`Talk soon,`, `${p.name}`];
      return lines.join("\n");
    },
  },
  {
    id: "professional",
    label: "Professional",
    icon: "✦",
    font: "greatvibes",
    color: "#c8a064",
    build: (p) => {
      const lines = [`Best,`, `${p.name}`];
      if (p.title) lines.push(p.title);
      const stats = [];
      if (p.jobSuccess) stats.push(p.jobSuccess + " Job Success");
      if (p.totalJobs) stats.push(p.totalJobs + "+ projects");
      if (stats.length) lines.push(stats.join(" · "));
      return lines.join("\n");
    },
  },
  {
    id: "friendly",
    label: "Friendly",
    icon: "👋",
    font: "pacifico",
    color: "#6aaa5a",
    build: (p) => {
      const lines = [`Looking forward to hearing from you!`, ``, `— ${p.name}`];
      if (p.title) lines[2] += `, ${p.title}`;
      return lines.join("\n");
    },
  },
  {
    id: "confident",
    label: "Confident",
    icon: "💪",
    font: "sacramento",
    color: "#e85040",
    build: (p) => {
      let line = `Let's make it happen — ${p.name}`;
      if (p.title) line += `\n${p.title}`;
      const stats = [];
      if (p.jobSuccess) stats.push(p.jobSuccess + " JSS");
      if (p.totalJobs) stats.push(p.totalJobs + "+ jobs delivered");
      if (stats.length) line += `\n${stats.join(" · ")}`;
      return line;
    },
  },
  {
    id: "full",
    label: "Full Card",
    icon: "📇",
    font: "allura",
    color: "#b070d0",
    build: (p) => {
      const lines = [`Cheers,`, ``, `${p.name}`];
      if (p.title) lines.push(p.title);
      const stats = [];
      if (p.jobSuccess) stats.push(p.jobSuccess + " Job Success");
      if (p.totalJobs) stats.push(p.totalJobs + "+ projects");
      if (p.totalEarnings) stats.push(p.totalEarnings + " earned");
      if (stats.length) lines.push(stats.join(" · "));
      if (p.profileUrl) lines.push(p.profileUrl);
      return lines.join("\n");
    },
  },
  {
    id: "casual",
    label: "Casual",
    icon: "✌️",
    font: "alexbrush",
    color: "#50a0d0",
    build: (p) => `Cheers!\n${p.name}`,
  },
];

function buildSignature(profile, styleId) {
  if (!profile?.name) return "";
  const style = SIGNATURE_STYLES.find((s) => s.id === styleId) || SIGNATURE_STYLES[1];
  return style.build(profile);
}

// ─── Visual Signature Name Renderer ─────────────────────────────────
function SignatureNamePreview({ name, fontId, color, size = 32 }) {
  const fontDef = SIGNATURE_FONTS.find((f) => f.id === fontId) || SIGNATURE_FONTS[0];
  return (
    <span style={{
      fontFamily: `'${fontDef.family}', cursive`,
      fontWeight: fontDef.weight,
      fontSize: size,
      color: color || "#c8a064",
      lineHeight: 1.3,
      display: "inline-block",
    }}>
      {name}
    </span>
  );
}

// ─── AI: Extract Profile from Pasted Content ─────────────────────────
async function aiExtractProfile(content, url) {
  const sys = `You extract Upwork/LinkedIn freelancer profile data from pasted text. Return ONLY valid JSON — no markdown, no backticks, no explanation.

CRITICAL JSON RULES:
- All string values must use double quotes with proper escaping
- No trailing commas after last array/object elements
- Newlines inside strings must be \\n not actual line breaks
- Escape any double quotes inside strings with \\"

JSON schema:
{"name":"","title":"","location":"","country":"","hourlyRate":"","overview":"","skills":[],"certifications":[],"pastProjects":[{"title":"","description":"","result":"","clientFeedback":""}],"experience":"","jobSuccess":"","totalEarnings":"","totalJobs":"","portfolio":[],"languages":[],"education":[],"profileUrl":"${url || ""}"}

Rules:
- Fill every field you can find in the pasted content
- Use "" for unknown strings, [] for unknown arrays
- For pastProjects extract title, brief description, any measurable result, AND any client feedback/review text
- Keep string values concise to avoid JSON issues
- Return ONLY the JSON object, nothing else`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: sys,
      messages: [{ role: "user", content: `Extract profile data as JSON:\n\n${content}` }],
    }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e?.error?.message || `API ${res.status}`);
  }
  const d = await res.json();
  const raw = d.content?.find((b) => b.type === "text")?.text?.trim();
  if (!raw) throw new Error("Empty AI response");

  // Extract JSON object from response
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON found in response");
  let jsonStr = raw.slice(start, end + 1);

  // Attempt 1: direct parse
  try { return JSON.parse(jsonStr); } catch {}

  // Attempt 2: fix trailing commas
  let fixed = jsonStr.replace(/,\s*([}\]])/g, "$1");
  try { return JSON.parse(fixed); } catch {}

  // Attempt 3: fix unescaped control characters line by line
  // Replace real newlines/tabs inside strings with escaped versions
  fixed = fixed.replace(/\r\n/g, "\\n").replace(/\r/g, "\\n").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
  try { return JSON.parse(fixed); } catch {}

  // Attempt 4: close unclosed brackets/braces
  const openBrackets = (fixed.match(/\[/g) || []).length - (fixed.match(/\]/g) || []).length;
  const openBraces = (fixed.match(/\{/g) || []).length - (fixed.match(/\}/g) || []).length;
  let attempt = fixed;
  for (let i = 0; i < openBrackets; i++) attempt += "]";
  for (let i = 0; i < openBraces; i++) attempt += "}";
  attempt = attempt.replace(/,\s*([}\]])/g, "$1");
  try { return JSON.parse(attempt); } catch {}

  // Attempt 5: aggressive cleanup — remove problematic characters
  let aggressive = jsonStr
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // remove control chars except \n \r \t
    .replace(/\r\n/g, "\\n").replace(/\r/g, "\\n").replace(/\n/g, "\\n").replace(/\t/g, "\\t")
    .replace(/,\s*([}\]])/g, "$1");
  try { return JSON.parse(aggressive); } catch (finalErr) {
    throw new Error("Could not parse profile data. Try pasting less content or use Fill Manually instead.");
  }
}

// ─── URL Detection & Content Fetching ───────────────────────────────
function detectUrls(text) {
  const urlRegex = /https?:\/\/[^\s,)<>\]]+/gi;
  const matches = text.match(urlRegex) || [];
  // Deduplicate and classify
  return [...new Set(matches)].map((url) => {
    let type = "webpage";
    const lower = url.toLowerCase();
    if (lower.includes("loom.com/share")) type = "loom_video";
    else if (lower.includes("youtube.com") || lower.includes("youtu.be")) type = "youtube_video";
    else if (lower.includes("docs.google.com/document")) type = "google_doc";
    else if (lower.includes("docs.google.com/spreadsheet") || lower.includes("sheets.google.com")) type = "google_sheet";
    else if (lower.includes("drive.google.com")) type = "google_drive";
    else if (lower.includes("figma.com")) type = "figma";
    else if (lower.includes("notion.so") || lower.includes("notion.site")) type = "notion";
    else if (lower.includes("github.com")) type = "github";
    else if (lower.includes("dropbox.com")) type = "dropbox";
    return { url, type };
  });
}

function getUrlTypeLabel(type) {
  const labels = {
    loom_video: "🎥 Loom Video",
    youtube_video: "🎬 YouTube Video",
    google_doc: "📄 Google Doc",
    google_sheet: "📊 Google Sheet",
    google_drive: "📁 Google Drive",
    figma: "🎨 Figma",
    notion: "📝 Notion",
    github: "💻 GitHub",
    dropbox: "📦 Dropbox",
    webpage: "🌐 Webpage",
  };
  return labels[type] || "🔗 Link";
}

async function fetchUrlContent(urlInfo) {
  const { url, type } = urlInfo;
  try {
    // For Loom videos — use the oEmbed API to get title/description
    if (type === "loom_video") {
      // Try fetching the page directly via Anthropic API with web_search tool
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: `Search for and describe this Loom video. Tell me what the video is about, what instructions it gives, and any key details: ${url}` }],
        }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const d = await res.json();
      const texts = d.content?.filter((b) => b.type === "text").map((b) => b.text).join("\n") || "";
      return { ...urlInfo, content: texts || `Loom video at: ${url}`, status: texts ? "fetched" : "partial" };
    }

    // For YouTube videos — use web search to get description
    if (type === "youtube_video") {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: `Search for and describe this YouTube video. Tell me what it's about and the key points: ${url}` }],
        }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const d = await res.json();
      const texts = d.content?.filter((b) => b.type === "text").map((b) => b.text).join("\n") || "";
      return { ...urlInfo, content: texts || `YouTube video at: ${url}`, status: texts ? "fetched" : "partial" };
    }

    // For Google Docs, Sheets, and other web pages — use web search to find/describe content
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 3000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: `Fetch and summarize the content at this URL. Describe what it contains in detail — all key information, instructions, lists, data, requirements. Be thorough:\n${url}` }],
      }),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const d = await res.json();
    const texts = d.content?.filter((b) => b.type === "text").map((b) => b.text).join("\n") || "";
    return { ...urlInfo, content: texts || `Content at: ${url}`, status: texts ? "fetched" : "partial" };
  } catch (err) {
    return { ...urlInfo, content: `Could not fetch: ${url} (${err.message})`, status: "failed" };
  }
}

async function fetchAllUrls(urls, onProgress) {
  const results = [];
  for (let i = 0; i < urls.length; i++) {
    if (onProgress) onProgress({ current: i + 1, total: urls.length, url: urls[i] });
    const result = await fetchUrlContent(urls[i]);
    results.push(result);
  }
  return results;
}

function buildUrlContext(fetchedUrls) {
  if (!fetchedUrls || fetchedUrls.length === 0) return "";
  const sections = fetchedUrls.map((u) => {
    const label = getUrlTypeLabel(u.type);
    return `\n--- ${label}: ${u.url} ---\n${u.content}\n--- END ---`;
  });
  return `\n\n=== LINKED RESOURCES FROM JOB POST (AI fetched these) ===\n${sections.join("\n")}\n=== END LINKED RESOURCES ===`;
}

// ─── Detected URLs Display Component ────────────────────────────────
function DetectedUrlsBar({ urls, fetchStatus }) {
  if (!urls || urls.length === 0) return null;
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10, marginBottom: 4,
    }}>
      {urls.map((u, i) => {
        const status = fetchStatus?.[i];
        const color = status === "fetched" ? "#6aaa5a" : status === "fetching" ? "#c8a064" : status === "failed" ? "#c8655a" : "#685e52";
        const icon = status === "fetched" ? "✓" : status === "fetching" ? "⟳" : status === "failed" ? "✕" : "•";
        return (
          <span key={i} style={{
            fontFamily: "'Outfit',sans-serif", fontSize: 10.5, padding: "4px 10px",
            borderRadius: 100, background: `${color}12`, border: `1px solid ${color}25`,
            color: color, display: "inline-flex", alignItems: "center", gap: 4,
            maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }} title={u.url}>
            <span style={{ fontSize: 9 }}>{icon}</span>
            {getUrlTypeLabel(u.type)}
          </span>
        );
      })}
    </div>
  );
}

// ─── AI: Generate Proposal ───────────────────────────────────────────
async function generateProposal({ jobDesc, clientName, clientCountry, tone, profile, signature, screeningQuestions, urlContext }) {
  const toneGuide = {
    casual: "Texting a friend who posted a job. Short, relaxed, contractions everywhere, a bit cheeky.",
    conversational: "Chatting at a coffee shop — friendly, warm, competent. Natural flow, contractions throughout.",
    professional: "Confident expert emailing a business partner. Warm but polished, no corporate buzzwords.",
  };

  const greeting = clientCountry
    ? COUNTRIES.find((c) => c.name === clientCountry)
    : null;

  const n = profile?.name || "[Your Name]";
  const skills = profile?.skills?.join(", ") || "";
  const certs = profile?.certifications?.length ? profile.certifications.join(", ") : "";
  const projects = profile?.pastProjects?.length
    ? profile.pastProjects.map((p) => `${p.title}: ${p.description}${p.result ? " (" + p.result + ")" : ""}${p.clientFeedback ? " [Client said: " + p.clientFeedback + "]" : ""}`).join("; ")
    : "";
  const stats = [
    profile?.jobSuccess ? profile.jobSuccess + " Job Success" : "",
    profile?.totalJobs ? profile.totalJobs + "+ jobs" : "",
    profile?.experience || "",
  ].filter(Boolean).join(", ");

  const sys = `You are a top-rated Upwork freelancer ghostwriter. You write SHORT, CONCISE, PERSUASIVE proposals that sound 100% human and win jobs.

=== UNIQUENESS RULES (CRITICAL) ===
Every proposal you write MUST be completely unique. NEVER reuse phrases, structures, or patterns from previous proposals.
- Randomize your opening approach: sometimes lead with empathy, sometimes with a bold claim, sometimes with a question, sometimes with a micro-story
- Vary sentence lengths wildly — mix 4-word punches with 20-word flowing sentences
- Vary paragraph count: sometimes 2 paragraphs, sometimes 3, sometimes 4 short ones
- Use different CTA styles each time: question, bold statement, casual invite, specific next step
- NEVER start two proposals the same way. Pick from: greeting+hook, greeting+question, greeting+observation, greeting+micro-story
- Each proposal must feel like a different person wrote it — same quality, different voice angle
- Use the SEED number below to shift your writing angle. Odd = more casual/story-driven. Even = more direct/results-driven. High = more confident. Low = more empathetic.
SEED: ${Math.floor(Math.random() * 1000)}

=== FORMAT ===

GREETING:
${greeting ? `Use "${greeting.greeting} ${clientName || ""}," — the client is from ${greeting.name}. This regional greeting builds instant rapport.` : `Use "Hi ${clientName || "there"},"`}

HOOK LINE (right after greeting):
One SHORT line (max 12 words) that directly addresses the client's SPECIFIC pain point. Extract the core problem from the job description. Make them think "this person gets it." NEVER use generic hooks like "I'd love to help" or "I'm excited about this project."

BODY:
IMPORTANT — Read the job description like a detective. Extract:
1. The EXACT problem the client needs solved
2. Any specific tools, platforms, deliverables mentioned
3. Any questions the client asks (explicit or implied)
4. The client's emotional state (frustrated? excited? urgent?)
5. Budget/timeline constraints

Then write 2-3 TIGHT paragraphs that:
- Answer the client's questions NATURALLY woven in (never Q&A format)
- Reference SPECIFIC job details — tool names, deliverable types, industry terms
- Show PROOF you've done this before with real results
- Match the client's energy — if they're frustrated, acknowledge it; if excited, match it

SMART CREDENTIAL MATCHING:
${profile?.title ? "Title: " + profile.title : ""}
${skills ? "Skills: " + skills : ""}
${certs ? "Certs: " + certs : ""}
${projects ? "Past Projects + Client Feedback: " + projects : ""}
${stats ? "Stats: " + stats : ""}
${profile?.overview ? "Bio: " + profile.overview : ""}

Pick ONLY the 1-2 most relevant past projects. Mention specific results. If client feedback relates to what THIS client needs, weave it in naturally.

CTA (last 1-2 lines):
End with a SPECIFIC, actionable next step. Not "let's chat" but something concrete like:
- "Want me to start with [specific first deliverable] so you can see my approach?"
- "I can have the first [deliverable] done by [timeframe] — should I get started?"
- "Quick question about [specific detail] — once I know that, I can scope this precisely."

LINKED RESOURCES:
If the job post contains URLs (Loom videos, Google Docs, websites, etc.), their content has been fetched and appended below the job description. You MUST:
1. Reference specific details from these resources — mention exact things you saw/read
2. If there's a video — mention a SPECIFIC visual detail or instruction from it
3. If there's a document — reference specific data points, numbers, or requirements from it
4. NEVER say generic things like "I watched your video" — prove it with specifics

SIGNATURE (MANDATORY — copy EXACTLY):
${signature || `Talk soon,\n\n${n}`}

=== HARD RULES ===
1. Every sentence earns its place — delete anything generic
2. 100-170 words MAXIMUM. Shorter wins. Be ruthless.
3. Contractions everywhere. Dashes for rhythm. Real human voice.
4. ZERO formatting — no bullets, lists, bold, headers, markdown. Plain text only.
5. BANNED WORDS: "leverage", "utilize", "streamline", "cutting-edge", "delve", "rest assured", "proven track record", "I am confident", "Best regards", "Sincerely", "I would love to", "I am writing to", "I believe", "feel free"
6. NEVER start with "I" — start with the client's problem or a hook
7. First sentence must grab attention in under 8 words
8. Include at least ONE specific number (timeline, result, percentage, count)

TONE: ${toneGuide[tone]}`;

  const user = `Write a winning Upwork proposal. Plain text only, no formatting.

Job:
---
${jobDesc}
---${urlContext || ""}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: sys,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e?.error?.message || `API ${res.status}`);
  }
  const d = await res.json();
  const t = d.content?.find((b) => b.type === "text")?.text;
  if (!t) throw new Error("Empty response");
  return t.trim();
}

// ─── AI: Generate Screening Question Answers ─────────────────────────
async function generateScreeningAnswers({ screeningQuestions, jobDesc, profile }) {
  const projects = profile?.pastProjects?.length
    ? profile.pastProjects.map((p) => `${p.title}: ${p.description}${p.result ? " (" + p.result + ")" : ""}${p.clientFeedback ? " [Feedback: " + p.clientFeedback + "]" : ""}`).join("; ")
    : "";
  const skills = profile?.skills?.join(", ") || "";

  const questionsFormatted = screeningQuestions
    .filter(q => q.question.trim())
    .map((q, i) => `Q${i + 1}: ${q.question}`)
    .join("\n");

  const sys = `You answer Upwork screening questions for a freelancer. Each answer must be:
- Direct, specific, and confident
- Reference relevant experience/projects from the freelancer's profile
- 2-4 sentences max per answer
- Sound human and natural, not robotic
- Match the freelancer's actual capabilities — don't lie or exaggerate

FREELANCER PROFILE:
${profile?.name ? "Name: " + profile.name : ""}
${profile?.title ? "Title: " + profile.title : ""}
${skills ? "Skills: " + skills : ""}
${projects ? "Past Projects: " + projects : ""}
${profile?.experience ? "Experience: " + profile.experience : ""}
${profile?.overview ? "Bio: " + profile.overview : ""}

Return ONLY valid JSON array — no markdown, no backticks. Format:
[{"question":"...","answer":"..."},...]`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: sys,
      messages: [{ role: "user", content: `Job context:\n${jobDesc}\n\nScreening questions to answer:\n${questionsFormatted}` }],
    }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e?.error?.message || `API ${res.status}`);
  }
  const d = await res.json();
  const raw = d.content?.find((b) => b.type === "text")?.text?.trim();
  if (!raw) throw new Error("Empty AI response");
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("No JSON array found");
  return JSON.parse(raw.slice(start, end + 1));
}

// ─── AI: Generate Sample Work File ───────────────────────────────────
async function generateSampleWork({ jobDesc, profile, signatureStyle }) {
  const skills = profile?.skills?.join(", ") || "";
  const freelancerName = profile?.name || profile?.title?.split(" ")[0] || "Your Name";
  const freelancerTitle = profile?.title || "Professional Freelancer";
  const jobSuccess = profile?.jobSuccess || "";
  const totalJobs = profile?.totalJobs || "";
  const projects = profile?.pastProjects?.length
    ? profile.pastProjects.map((p) => `${p.title}: ${p.description}${p.result ? " (" + p.result + ")" : ""}${p.clientFeedback ? " [Feedback: " + p.clientFeedback + "]" : ""}`).join("; ")
    : "";

  // Get the selected signature font
  const activeStyle = SIGNATURE_STYLES.find((s) => s.id === signatureStyle) || SIGNATURE_STYLES[1];
  const fontDef = SIGNATURE_FONTS.find((f) => f.id === activeStyle.font) || SIGNATURE_FONTS[0];
  const sigColor = activeStyle.color || "#c8a064";

  const sys = `You are an expert freelancer who creates REAL, IMPRESSIVE sample work to attach with Upwork proposals. The goal is to make the client think "this person already started working on my project."

CRITICAL — REAL DATA ONLY:
- ALL data must be REAL, GENUINE, verifiable — use actual statistics, market data, real tools, real URLs
- If the job mentions a specific company/website/product, use REAL data about that company
- NEVER use "Lorem ipsum", "Company XYZ", "John Doe", "$XX,XXX", or fake placeholder data
- All numbers must be realistic and defensible

TABLE DATA RULE — MANDATORY:
- Tables MUST have EXACTLY 5 data rows (not counting the header)
- Each row must contain REAL, GENUINE data — real figures, real names, real URLs, real metrics
- Every <a> tag MUST have target="_blank" rel="noopener noreferrer"

WHAT TO CREATE: Analyze the job and create the most relevant professional deliverable.

OUTPUT — Complete standalone HTML with:

1. <head> must include:
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=${fontDef.gImport}&display=swap" rel="stylesheet">

2. PROFESSIONAL HEADER with "${freelancerName}" / "${freelancerTitle}" / "Sample Work Preview"

3. UPWORK-STYLE BADGE STAMPS (MANDATORY) — positioned top-right as floating badges:
   Create TWO badges that look exactly like Upwork's real "100% Job Success" and "Top Rated" badges:

   HTML structure:
   <div class="upwork-badges">
     <div class="upwork-badge">
       <div class="badge-icon jss-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg></div>
       <span class="badge-text">${jobSuccess || "100%"} Job Success</span>
     </div>
     <div class="upwork-badge">
       <div class="badge-icon top-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z"/></svg></div>
       <span class="badge-text">Top Rated</span>
     </div>
   </div>

   CSS (EXACT styles — must look like real Upwork badges):
   .upwork-badges { position: fixed; top: 20px; right: 20px; z-index: 100; display: flex; flex-direction: column; gap: 8px; }
   .upwork-badge {
     display: flex; align-items: center; gap: 10px;
     padding: 8px 18px 8px 8px; border-radius: 50px;
     background: #ffffff; box-shadow: 0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04);
     font-family: 'Inter', sans-serif; transition: box-shadow 0.3s;
   }
   .upwork-badge:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.12); }
   .badge-icon {
     width: 36px; height: 36px; border-radius: 50%;
     display: flex; align-items: center; justify-content: center;
   }
   .jss-icon { background: linear-gradient(135deg, #1f57c3, #3d85c6); }
   .top-icon { background: linear-gradient(135deg, #1a5276, #2e86c1); }
   .badge-text { font-weight: 600; font-size: 13px; color: #1a1a2e; letter-spacing: -0.2px; white-space: nowrap; }

   @media print { .upwork-badges { position: absolute; } }

4. BODY with executive summary, main deliverable, a 5-row REAL data table, and insights

5. HANDWRITTEN SIGNATURE (MANDATORY at bottom):
   <div style="margin-top:50px; padding-top:25px; border-top:1px solid #ddd; text-align:center;">
     <p style="font-size:12px; color:#888; margin-bottom:8px;">Prepared by</p>
     <p style="font-family:'${fontDef.family}',cursive; font-size:40px; color:${sigColor}; margin:0; line-height:1.3;">${freelancerName}</p>
     <p style="font-size:13px; color:#666; margin-top:4px;">${freelancerTitle}</p>
     ${profile?.profileUrl ? `<p style="margin-top:8px;"><a href="${profile.profileUrl}" target="_blank" rel="noopener noreferrer" style="font-size:12px; color:#0066cc;">View Full Profile →</a></p>` : ""}
   </div>

Output ONLY the complete HTML — no markdown, no backticks, no explanation.

FREELANCER: ${freelancerName} — ${freelancerTitle}
SKILLS: ${skills}
${projects ? "PAST RELEVANT WORK: " + projects : ""}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      system: sys,
      messages: [{ role: "user", content: `Create a professional sample work HTML for this job. REAL data only, Upwork-style Job Success + Top Rated badge stamps (blue icons, white pill-shaped), 5-row data table, all links target="_blank", handwritten signature at end:\n\n${jobDesc}` }],
    }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e?.error?.message || `API ${res.status}`);
  }
  const d = await res.json();
  let html = d.content?.find((b) => b.type === "text")?.text?.trim();
  if (!html) throw new Error("Empty response");

  // Strip markdown code fences if AI wrapped it
  html = html.replace(/^```html?\s*/i, "").replace(/\s*```$/i, "").trim();

  // Ensure it's valid HTML
  if (!html.toLowerCase().includes("<!doctype") && !html.toLowerCase().includes("<html")) {
    html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Sample Preview</title></head><body>${html}</body></html>`;
  }

  // Force ALL links to open in new tab (safety net — catch any the AI missed)
  html = html.replace(/<a\s+(?![^>]*target=)/gi, '<a target="_blank" rel="noopener noreferrer" ');

  // Add print-friendly styles if not present
  if (!html.includes("@media print")) {
    html = html.replace("</style>", `
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .upwork-badges { position: absolute !important; }
        @page { margin: 0.5in; }
      }
    </style>`);
  }

  // Generate a smart filename based on job content
  const jobLower = jobDesc.toLowerCase();
  let fileName = "sample-preview.html";
  let title = "Sample Work Preview";
  if (jobLower.includes("landing page") || jobLower.includes("website")) {
    fileName = "landing-page-mockup.html"; title = "Landing Page Mockup";
  } else if (jobLower.includes("report") || jobLower.includes("analysis")) {
    fileName = "sample-report.html"; title = "Sample Analysis Report";
  } else if (jobLower.includes("blog") || jobLower.includes("article") || jobLower.includes("content")) {
    fileName = "sample-content.html"; title = "Sample Content Draft";
  } else if (jobLower.includes("email") || jobLower.includes("newsletter")) {
    fileName = "sample-email-template.html"; title = "Sample Email Template";
  } else if (jobLower.includes("dashboard") || jobLower.includes("admin")) {
    fileName = "dashboard-mockup.html"; title = "Dashboard UI Mockup";
  } else if (jobLower.includes("seo") || jobLower.includes("audit")) {
    fileName = "seo-audit-preview.html"; title = "SEO Audit Preview";
  } else if (jobLower.includes("logo") || jobLower.includes("brand")) {
    fileName = "brand-concept-board.html"; title = "Brand Concept Board";
  } else if (jobLower.includes("data") || jobLower.includes("excel") || jobLower.includes("spreadsheet")) {
    fileName = "data-analysis-sample.html"; title = "Data Analysis Sample";
  } else if (jobLower.includes("social media") || jobLower.includes("instagram") || jobLower.includes("facebook")) {
    fileName = "social-media-strategy.html"; title = "Social Media Strategy";
  } else if (jobLower.includes("ad") || jobLower.includes("ppc") || jobLower.includes("google ads")) {
    fileName = "ad-campaign-preview.html"; title = "Ad Campaign Preview";
  }

  return {
    shouldCreate: true,
    fileType: "html",
    fileName,
    title,
    content: html,
  };
}

// ─── Small Components ────────────────────────────────────────────────
const S = {
  input: {
    width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(200,160,100,0.1)", borderRadius: 10, color: "#ddd2c4",
    fontSize: 14, fontFamily: "'Outfit', sans-serif", transition: "border-color 0.3s",
  },
  textarea: {
    width: "100%", padding: "16px 18px", background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(200,160,100,0.1)", borderRadius: 14, color: "#ddd2c4",
    fontSize: 14, fontFamily: "'Outfit', sans-serif", lineHeight: 1.7,
    resize: "vertical", transition: "border-color 0.3s",
  },
  label: {
    fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600,
    color: "#807060", letterSpacing: "0.8px", textTransform: "uppercase",
    display: "block", marginBottom: 7,
  },
  hint: { fontFamily: "'Outfit', sans-serif", fontSize: 11, color: "#4a4238", marginTop: 5, lineHeight: 1.5 },
  card: {
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(200,160,100,0.08)",
    borderRadius: 20, padding: "clamp(20px, 4vw, 34px)", marginBottom: 20,
  },
};

const focus = (e) => (e.target.style.borderColor = "rgba(200,160,100,0.35)");
const blur = (e) => (e.target.style.borderColor = "rgba(200,160,100,0.1)");

function Spinner() {
  return (
    <span style={{ display: "inline-flex", gap: 4, padding: "2px 0" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: "#c8a064",
          animation: `bounce 1.2s ease-in-out ${i * 0.16}s infinite`, display: "inline-block",
        }} />
      ))}
    </span>
  );
}

function Toggle({ label, badge, open, onClick }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
      color: "#685e52", cursor: "pointer", display: "flex", alignItems: "center",
      gap: 8, padding: "8px 0", border: "none", background: "none",
      marginBottom: open ? 16 : 0, transition: "color 0.2s", width: "100%", textAlign: "left",
    }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#c8a064")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#685e52")}
    >
      <span style={{ fontSize: 13, transition: "transform 0.2s", transform: open ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>▸</span>
      {label}
      {badge && <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: "rgba(90,160,80,0.12)", color: "#6aaa5a", marginLeft: 4 }}>{badge}</span>}
    </button>
  );
}

function Btn({ children, onClick, primary, danger, small, disabled, style: sx }) {
  const base = {
    fontFamily: "'Outfit', sans-serif", fontWeight: 600, border: "none",
    borderRadius: small ? 8 : 12, cursor: disabled ? "default" : "pointer",
    transition: "all 0.25s", fontSize: small ? 12 : 14,
    padding: small ? "6px 14px" : "13px 24px",
    opacity: disabled ? 0.5 : 1,
    background: danger ? "rgba(200,70,55,0.08)" : primary ? "linear-gradient(135deg, #c8a064, #a87840)" : "rgba(200,160,100,0.08)",
    color: danger ? "#c8655a" : primary ? "#0c0c18" : "#c8a064",
    ...sx,
  };
  return <button onClick={onClick} disabled={disabled} style={base}>{children}</button>;
}

// ─── Profile Edit Modal ──────────────────────────────────────────────
function ProfileEditor({ profile, onSave, onCancel }) {
  const [p, setP] = useState({ ...profile });
  const set = (k, v) => setP((prev) => ({ ...prev, [k]: v }));
  const setArr = (k, v) => set(k, v.split(",").map((s) => s.trim()).filter(Boolean));

  const fields = [
    { key: "name", label: "Full Name", ph: "Your full name" },
    { key: "title", label: "Professional Title", ph: "e.g. Full Stack Developer" },
    { key: "location", label: "Location", ph: "e.g. Lahore, Pakistan" },
    { key: "hourlyRate", label: "Hourly Rate", ph: "e.g. $25/hr" },
    { key: "experience", label: "Experience", ph: "e.g. 5 years in web dev" },
    { key: "jobSuccess", label: "Job Success Score", ph: "e.g. 98%" },
    { key: "totalJobs", label: "Total Jobs", ph: "e.g. 45" },
    { key: "totalEarnings", label: "Total Earnings", ph: "e.g. $50K+" },
    { key: "profileUrl", label: "Profile URL", ph: "https://upwork.com/freelancers/~..." },
  ];

  return (
    <div style={{ animation: "fadeUp 0.3s ease-out" }}>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, color: "#c8a064", marginBottom: 16 }}>Edit Profile</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }} className="info-grid">
        {fields.map(({ key, label, ph }) => (
          <div key={key}>
            <label style={S.label}>{label}</label>
            <input value={p[key] || ""} onChange={(e) => set(key, e.target.value)} placeholder={ph} style={S.input} onFocus={focus} onBlur={blur} />
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={S.label}>Overview / Bio</label>
        <textarea value={p.overview || ""} onChange={(e) => set("overview", e.target.value)} rows={3} placeholder="Your profile overview..." style={S.textarea} onFocus={focus} onBlur={blur} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }} className="info-grid">
        <div>
          <label style={S.label}>Skills <span style={{ opacity: 0.5, fontWeight: 400 }}>(comma-separated)</span></label>
          <input value={(p.skills || []).join(", ")} onChange={(e) => setArr("skills", e.target.value)} placeholder="React, Node.js, Python..." style={S.input} onFocus={focus} onBlur={blur} />
        </div>
        <div>
          <label style={S.label}>Certifications <span style={{ opacity: 0.5, fontWeight: 400 }}>(comma-separated)</span></label>
          <input value={(p.certifications || []).join(", ")} onChange={(e) => setArr("certifications", e.target.value)} placeholder="AWS, Google Ads, PMP..." style={S.input} onFocus={focus} onBlur={blur} />
        </div>
        <div>
          <label style={S.label}>Languages <span style={{ opacity: 0.5, fontWeight: 400 }}>(comma-separated)</span></label>
          <input value={(p.languages || []).join(", ")} onChange={(e) => setArr("languages", e.target.value)} placeholder="English, Urdu, Arabic..." style={S.input} onFocus={focus} onBlur={blur} />
        </div>
        <div>
          <label style={S.label}>Education <span style={{ opacity: 0.5, fontWeight: 400 }}>(comma-separated)</span></label>
          <input value={(p.education || []).join(", ")} onChange={(e) => setArr("education", e.target.value)} placeholder="BS Computer Science..." style={S.input} onFocus={focus} onBlur={blur} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
        <Btn onClick={onCancel}>Cancel</Btn>
        <Btn primary onClick={() => onSave(p)}>Save Profile</Btn>
      </div>
    </div>
  );
}

// ─── Profile Display Card ────────────────────────────────────────────
function ProfileCard({ profile, onEdit, onClear }) {
  if (!profile?.name) return null;
  return (
    <div style={{
      background: "rgba(90,160,80,0.04)", border: "1px solid rgba(90,160,80,0.15)",
      borderRadius: 16, padding: "18px 20px", animation: "fadeUp 0.3s ease-out",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600, color: "#6aaa5a", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 5 }}>✓ PROFILE SAVED</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#efe6d8", marginBottom: 1 }}>{profile.name}</div>
          {profile.title && <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#908070" }}>{profile.title}</div>}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <Btn small onClick={onEdit}>✎ Edit</Btn>
          <Btn small danger onClick={onClear}>✕ Clear</Btn>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {[
          profile.location && "📍 " + profile.location,
          profile.jobSuccess && "⭐ " + profile.jobSuccess,
          profile.totalJobs && "📋 " + profile.totalJobs + "+ jobs",
          profile.hourlyRate && "💰 " + profile.hourlyRate,
        ].filter(Boolean).map((t, i) => (
          <span key={i} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, padding: "3px 10px", borderRadius: 100, background: "rgba(200,160,100,0.06)", border: "1px solid rgba(200,160,100,0.08)", color: "#908070" }}>{t}</span>
        ))}
      </div>

      {profile.skills?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
          {profile.skills.slice(0, 10).map((s, i) => (
            <span key={i} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10.5, padding: "2px 9px", borderRadius: 100, background: "rgba(200,160,100,0.08)", color: "#c8a064" }}>{s}</span>
          ))}
        </div>
      )}

      {profile.pastProjects?.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600, color: "#685e52", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 4 }}>Past Projects</div>
          {profile.pastProjects.slice(0, 3).map((p, i) => (
            <div key={i} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11.5, color: "#807060", lineHeight: 1.5, marginBottom: 2 }}>
              <span style={{ color: "#c8a064" }}>{p.title}</span> — {p.description}{p.result ? " → " + p.result : ""}
              {p.clientFeedback && <span style={{ color: "#6aaa5a", fontSize: 10.5 }}> ★ "{p.clientFeedback}"</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Signature Editor ────────────────────────────────────────────────
function SignatureBlock({ signature, signatureStyle, onChangeStyle, onChange, profile }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(signature);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => { setDraft(signature); }, [signature]);

  const activeStyle = SIGNATURE_STYLES.find((s) => s.id === signatureStyle) || SIGNATURE_STYLES[1];
  const activeFontDef = SIGNATURE_FONTS.find((f) => f.id === activeStyle.font) || SIGNATURE_FONTS[0];

  return (
    <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(200,160,100,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600, color: "#685e52", letterSpacing: "0.8px", textTransform: "uppercase" }}>Signature Style</span>
        <Btn small onClick={() => { setIsCustom(!isCustom); setEditing(!isCustom); if (!isCustom) setDraft(signature); }}>
          {isCustom ? "← Styles" : "✎ Custom"}
        </Btn>
      </div>

      {!isCustom ? (
        <>
          {/* Style picker grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }} className="info-grid">
            {SIGNATURE_STYLES.map((style) => {
              const isActive = signatureStyle === style.id;
              const fontDef = SIGNATURE_FONTS.find((f) => f.id === style.font) || SIGNATURE_FONTS[0];
              return (
                <button
                  key={style.id}
                  onClick={() => onChangeStyle(style.id)}
                  style={{
                    fontFamily: "'Outfit', sans-serif", textAlign: "center",
                    padding: "14px 12px", borderRadius: 12, cursor: "pointer",
                    border: `1.5px solid ${isActive ? style.color : "rgba(200,160,100,.08)"}`,
                    background: isActive ? "rgba(200,160,100,.08)" : "rgba(255,255,255,0.015)",
                    transition: "all 0.2s",
                    minHeight: 90,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  {/* Handwritten name preview */}
                  <div style={{
                    fontFamily: `'${fontDef.family}', cursive`,
                    fontWeight: fontDef.weight,
                    fontSize: 22,
                    color: isActive ? style.color : "#807060",
                    lineHeight: 1.2,
                    transition: "color 0.2s",
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {profile?.name || "Jane Smith"}
                  </div>
                  {/* Style label */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 11 }}>{style.icon}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 600,
                      color: isActive ? style.color : "#4a4238",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}>{style.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Large preview of selected signature */}
          <div style={{
            padding: "20px 24px",
            background: "rgba(0,0,0,0.2)",
            borderRadius: 14,
            border: `1px solid ${activeStyle.color}22`,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Decorative underline swoosh */}
            <div style={{
              position: "absolute", bottom: "38%", left: "50%", transform: "translateX(-50%)",
              width: "60%", height: 1, background: `linear-gradient(90deg, transparent, ${activeStyle.color}40, transparent)`,
            }} />
            {/* Closing text (e.g. "Best,") */}
            {(() => {
              const lines = signature.split("\n").filter(Boolean);
              const closingLine = lines[0] || "";
              const nameLine = profile?.name || "";
              const otherLines = lines.slice(1).filter(l => l.trim() !== nameLine.trim());
              return (
                <>
                  <div style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#685e52",
                    marginBottom: 8,
                  }}>{closingLine}</div>
                  <div style={{
                    fontFamily: `'${activeFontDef.family}', cursive`,
                    fontWeight: activeFontDef.weight,
                    fontSize: 38,
                    color: activeStyle.color,
                    lineHeight: 1.3,
                    marginBottom: 8,
                    textShadow: `0 0 30px ${activeStyle.color}15`,
                  }}>
                    {nameLine}
                  </div>
                  {otherLines.length > 0 && (
                    <div style={{
                      fontFamily: "'Outfit', sans-serif", fontSize: 11.5, color: "#685e52",
                      lineHeight: 1.6, whiteSpace: "pre-wrap",
                    }}>
                      {otherLines.join("\n")}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </>
      ) : (
        /* Custom editor */
        <div>
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={4} style={S.textarea} onFocus={focus} onBlur={blur} />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn small onClick={() => { setIsCustom(false); }}>Cancel</Btn>
            <Btn small primary onClick={() => { onChange(draft); setIsCustom(false); }}>Save Custom</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Screening Questions Component ───────────────────────────────────
function ScreeningQuestionsSection({ questions, onChange, answers, isGenerating }) {
  const addQuestion = () => {
    onChange([...questions, { question: "", answer: "" }]);
  };
  const removeQuestion = (idx) => {
    onChange(questions.filter((_, i) => i !== idx));
  };
  const updateQuestion = (idx, val) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], question: val };
    onChange(updated);
  };

  return (
    <div style={{ animation: "fadeUp 0.3s ease-out" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <label style={{ ...S.label, marginBottom: 0 }}>
          Screening Questions
          <span style={{ opacity: .5, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}> — Upwork's separate Q&A section</span>
        </label>
        <Btn small onClick={addQuestion}>+ Add</Btn>
      </div>

      {questions.length === 0 && (
        <div style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 12.5, color: "#4a4238",
          padding: "16px 18px", borderRadius: 12, border: "1px dashed rgba(200,160,100,.12)",
          textAlign: "center", cursor: "pointer",
        }} onClick={addQuestion}>
          Click "+ Add" to add screening questions from the job post
        </div>
      )}

      {questions.map((q, idx) => (
        <div key={idx} style={{
          marginBottom: 10, padding: "14px 16px", borderRadius: 14,
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(200,160,100,0.08)",
        }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
            <span style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700,
              color: "#c8a064", minWidth: 24, height: 24, display: "flex",
              alignItems: "center", justifyContent: "center", borderRadius: 8,
              background: "rgba(200,160,100,0.1)", flexShrink: 0, marginTop: 2,
            }}>Q{idx + 1}</span>
            <textarea
              value={q.question}
              onChange={(e) => updateQuestion(idx, e.target.value)}
              placeholder="Paste the screening question here..."
              rows={2}
              style={{ ...S.textarea, padding: "10px 14px", borderRadius: 10, fontSize: 13, flex: 1 }}
              onFocus={focus} onBlur={blur}
            />
            <button onClick={() => removeQuestion(idx)} style={{
              background: "none", border: "none", color: "#c8655a", cursor: "pointer",
              fontSize: 16, padding: "4px 8px", opacity: 0.6, flexShrink: 0, marginTop: 2,
            }} title="Remove">✕</button>
          </div>

          {/* Show AI-generated answer if available */}
          {answers && answers[idx] && (
            <div style={{
              marginLeft: 32, padding: "10px 14px", borderRadius: 10,
              background: "rgba(90,160,80,0.04)", border: "1px solid rgba(90,160,80,0.1)",
            }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600, color: "#6aaa5a", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 4 }}>AI Answer</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#d4c8ba", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {answers[idx].answer}
              </div>
            </div>
          )}
        </div>
      ))}

      {questions.length > 0 && (
        <p style={S.hint}>These will be answered separately by AI — ready to paste into Upwork's screening question fields.</p>
      )}
    </div>
  );
}

// ─── Sample Work Preview Component ───────────────────────────────────
function SampleWorkCard({ sampleWork, isGenerating, onUpdate }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingCode, setEditingCode] = useState(false);
  const [editedHtml, setEditedHtml] = useState("");
  const [copied, setCopied] = useState(false);

  // Sync edited HTML when sampleWork changes
  useEffect(() => {
    if (sampleWork?.content) setEditedHtml(sampleWork.content);
  }, [sampleWork?.content]);

  if (!sampleWork && !isGenerating) return null;

  const currentContent = editedHtml || sampleWork?.content || "";

  const handleDownload = () => {
    if (!currentContent) return;
    try {
      const blob = new Blob([currentContent], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = sampleWork.fileName || "sample-preview.html";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 200);
    } catch {
      try {
        navigator.clipboard.writeText(currentContent);
        alert("Download blocked by sandbox. HTML code copied to clipboard instead — paste it into a .html file.");
      } catch {
        const w = window.open("", "_blank");
        if (w) { w.document.write(currentContent); w.document.close(); }
      }
    }
  };

  const handleCopy = () => {
    if (!currentContent) return;
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveEdit = () => {
    if (onUpdate) onUpdate({ ...sampleWork, content: editedHtml });
    setEditingCode(false);
  };

  if (isGenerating) {
    return (
      <div style={{ ...S.card, padding: "24px", textAlign: "center", animation: "fadeUp 0.4s ease-out" }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2.5px solid rgba(200,160,100,.1)", borderTopColor: "#c8a064", animation: "spin .9s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#685e52" }}>
          Creating sample work file to showcase your skills...
        </p>
      </div>
    );
  }

  if (!sampleWork?.content) return null;

  return (
    <div style={{ ...S.card, overflow: "hidden", padding: 0, animation: "fadeUp 0.5s ease-out" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 20px", borderBottom: "1px solid rgba(200,160,100,.06)",
        background: "rgba(120,100,200,0.03)", flexWrap: "wrap", gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>📎</span>
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, color: "#d4c8ba" }}>
              {sampleWork.title || "Sample Work Preview"}
            </div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#685e52" }}>
              {sampleWork.fileName} — Attach with your proposal to stand out
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Btn small onClick={() => { setPreviewOpen(!previewOpen); setEditingCode(false); }}>
            {previewOpen ? "▾ Hide" : "▸ Preview"}
          </Btn>
          <Btn small onClick={() => { setEditingCode(!editingCode); setPreviewOpen(false); if (!editingCode) setEditedHtml(currentContent); }}>
            {editingCode ? "👁 Preview" : "✎ Edit"}
          </Btn>
          <Btn small onClick={handleCopy}>
            {copied ? "✓ Copied" : "📋 Code"}
          </Btn>
          <Btn small primary onClick={handleDownload}>⬇ Download</Btn>
        </div>
      </div>

      {/* Code Editor */}
      {editingCode && (
        <div style={{ padding: "16px", borderTop: "1px solid rgba(200,160,100,.06)" }}>
          <textarea
            value={editedHtml}
            onChange={(e) => setEditedHtml(e.target.value)}
            style={{
              width: "100%", minHeight: 350, padding: "16px", fontSize: 12.5,
              fontFamily: "'Courier New', monospace", lineHeight: 1.6,
              background: "rgba(0,0,0,0.3)", color: "#d4c8ba",
              border: "1px solid rgba(200,160,100,.12)", borderRadius: 12,
              resize: "vertical",
            }}
            onFocus={focus} onBlur={blur}
          />
          <div style={{ display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#4a4238" }}>
              Edit the HTML directly — your changes will be reflected in preview and download
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn small onClick={() => { setEditedHtml(sampleWork.content); }}>↩ Reset</Btn>
              <Btn small primary onClick={handleSaveEdit}>✓ Save Changes</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {previewOpen && (
        <div style={{ padding: "16px", borderTop: "1px solid rgba(200,160,100,.06)" }}>
          <iframe
            srcDoc={currentContent}
            style={{
              width: "100%", height: 450, border: "1px solid rgba(200,160,100,.1)",
              borderRadius: 12, background: "#fff",
            }}
            title="Sample Work Preview"
            sandbox="allow-scripts"
          />
          <div style={{
            marginTop: 10, padding: "10px 14px", borderRadius: 10,
            background: "rgba(200,160,100,0.04)", border: "1px solid rgba(200,160,100,0.08)",
            fontFamily: "'Outfit',sans-serif", fontSize: 11.5, color: "#685e52", lineHeight: 1.6,
          }}>
            💡 <strong style={{ color: "#c8a064" }}>To upload on Upwork:</strong> Download the HTML file → Open in Chrome → Press Ctrl+P (or Cmd+P) → "Save as PDF" → Upload the PDF with your proposal
          </div>
        </div>
      )}
    </div>
  );
}


// ─── Proposal Preview with Handwritten Signature ────────────────────
function ProposalPreview({ text, profile, signatureStyle }) {
  if (!text) return null;
  const name = profile?.name || "";
  const activeStyle = SIGNATURE_STYLES.find((s) => s.id === signatureStyle) || SIGNATURE_STYLES[1];
  const fontDef = SIGNATURE_FONTS.find((f) => f.id === activeStyle.font) || SIGNATURE_FONTS[0];

  // Split text to find where the name appears in the signature area (last few lines)
  if (!name) {
    return (
      <div style={{ padding: "26px 24px", fontSize: 14.5, lineHeight: 1.85, color: "#d4c8ba", whiteSpace: "pre-wrap", fontFamily: "'Outfit',sans-serif" }}>
        {text}
      </div>
    );
  }

  // Find the LAST occurrence of the name in the text (that's the signature)
  const lastNameIdx = text.lastIndexOf(name);
  if (lastNameIdx === -1) {
    return (
      <div style={{ padding: "26px 24px", fontSize: 14.5, lineHeight: 1.85, color: "#d4c8ba", whiteSpace: "pre-wrap", fontFamily: "'Outfit',sans-serif" }}>
        {text}
      </div>
    );
  }

  const beforeName = text.slice(0, lastNameIdx);
  const afterName = text.slice(lastNameIdx + name.length);

  return (
    <div style={{ padding: "26px 24px", fontSize: 14.5, lineHeight: 1.85, color: "#d4c8ba", whiteSpace: "pre-wrap", fontFamily: "'Outfit',sans-serif" }}>
      {beforeName}
      <span style={{
        fontFamily: `'${fontDef.family}', cursive`,
        fontWeight: fontDef.weight,
        fontSize: 32,
        color: activeStyle.color,
        lineHeight: 1.4,
        display: "inline",
      }}>
        {name}
      </span>
      {afterName}
    </div>
  );
}


// ─── MAIN APP ────────────────────────────────────────────────────────
export default function ProposalGenerator() {
  // Profile
  const [profile, setProfile] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [showProfile, setShowProfile] = useState(true);
  const [profileMode, setProfileMode] = useState("paste");
  const [pasteContent, setPasteContent] = useState("");
  const [pasteUrl, setPasteUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Signature
  const [signature, setSignature] = useState("");
  const [signatureStyle, setSignatureStyle] = useState("professional");

  // Job
  const [jobDesc, setJobDesc] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientCountry, setClientCountry] = useState("");
  const [tone, setTone] = useState("conversational");

  // Screening Questions (Upwork's separate section)
  const [screeningQuestions, setScreeningQuestions] = useState([]);
  const [screeningAnswers, setScreeningAnswers] = useState(null);
  const [showScreening, setShowScreening] = useState(false);

  // Sample Work
  const [sampleWork, setSampleWork] = useState(null);
  const [isGeneratingSample, setIsGeneratingSample] = useState(false);

  // Output
  const [proposal, setProposal] = useState("");
  const [editedProposal, setEditedProposal] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [genCount, setGenCount] = useState(0);
  const [error, setError] = useState("");

  const outputRef = useRef(null);

  // Load saved data on mount
  useEffect(() => {
    (async () => {
      const p = await load(STORE.profile);
      if (p?.name) {
        setProfile(p);
        setProfileLoaded(true);
        setShowProfile(false);
        const savedStyle = await load("fp-sig-style-v1");
        const style = savedStyle || "professional";
        setSignatureStyle(style);
        const s = await load(STORE.signature);
        setSignature(s || buildSignature(p, style));
      }
    })();
  }, []);

  // Word count
  const displayText = isEditing ? editedProposal : proposal;
  useEffect(() => {
    if (displayText) setWordCount(displayText.split(/\s+/).filter(Boolean).length);
  }, [displayText]);

  // Scroll to output
  useEffect(() => {
    if (proposal && outputRef.current) {
      setTimeout(() => outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [proposal]);

  // ── Profile handlers
  const saveProfileData = async (p) => {
    setProfile(p);
    setProfileLoaded(true);
    setProfileMode("view");
    await store(STORE.profile, p);
    const sig = buildSignature(p, signatureStyle);
    setSignature(sig);
    await store(STORE.signature, sig);
  };

  const clearProfileData = async () => {
    setProfile(null);
    setProfileLoaded(false);
    setProfileMode("paste");
    setSignature("");
    setSignatureStyle("professional");
    setPasteContent("");
    setPasteUrl("");
    await remove(STORE.profile);
    await remove(STORE.signature);
    await remove("fp-sig-style-v1");
  };

  const handleExtract = async () => {
    if (!pasteContent.trim()) return;
    setIsExtracting(true);
    setProfileError("");
    try {
      const extracted = await aiExtractProfile(pasteContent, pasteUrl);
      await saveProfileData(extracted);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveSignature = async (sig) => {
    setSignature(sig);
    await store(STORE.signature, sig);
  };

  const handleChangeSignatureStyle = async (styleId) => {
    setSignatureStyle(styleId);
    await store("fp-sig-style-v1", styleId);
    if (profile?.name) {
      const sig = buildSignature(profile, styleId);
      setSignature(sig);
      await store(STORE.signature, sig);
    }
  };

  // URL detection state
  const [detectedUrls, setDetectedUrls] = useState([]);
  const [urlFetchStatus, setUrlFetchStatus] = useState([]);
  const [fetchProgress, setFetchProgress] = useState(null);

  // Detect URLs when job desc changes
  useEffect(() => {
    const urls = detectUrls(jobDesc);
    setDetectedUrls(urls);
    setUrlFetchStatus(urls.map(() => "pending"));
  }, [jobDesc]);

  // ── Generate
  const handleGenerate = async () => {
    if (!jobDesc.trim()) return;
    setIsGenerating(true);
    setProposal("");
    setEditedProposal("");
    setIsEditing(false);
    setCopied(false);
    setError("");
    setScreeningAnswers(null);
    setSampleWork(null);
    setFetchProgress(null);

    try {
      // Step 1: Detect and fetch URLs from job description
      const urls = detectUrls(jobDesc);
      let urlContext = "";
      let fetchedUrls = [];

      if (urls.length > 0) {
        setDetectedUrls(urls);
        setUrlFetchStatus(urls.map(() => "fetching"));

        fetchedUrls = await fetchAllUrls(urls, ({ current, total, url }) => {
          setFetchProgress({ current, total, url });
          setUrlFetchStatus((prev) => {
            const next = [...prev];
            next[current - 1] = "fetching";
            if (current > 1) next[current - 2] = "fetched";
            return next;
          });
        });

        setUrlFetchStatus(fetchedUrls.map((u) => u.status));
        setFetchProgress(null);
        urlContext = buildUrlContext(fetchedUrls);
      }

      // Step 2: Build enriched job description for sample work
      const enrichedJobDesc = jobDesc + urlContext;

      // Step 3: Run proposal generation with URL context
      const proposalPromise = generateProposal({
        jobDesc, clientName, clientCountry, tone, profile, signature, screeningQuestions, urlContext,
      });

      // Run screening answers generation in parallel if questions exist
      const hasScreeningQs = screeningQuestions.some(q => q.question.trim());
      const screeningPromise = hasScreeningQs
        ? generateScreeningAnswers({ screeningQuestions: screeningQuestions.filter(q => q.question.trim()), jobDesc: enrichedJobDesc, profile })
        : Promise.resolve(null);

      const [proposalResult, screeningResult] = await Promise.all([proposalPromise, screeningPromise]);

      setProposal(proposalResult);
      setEditedProposal(proposalResult);
      setGenCount((c) => c + 1);

      if (screeningResult) {
        setScreeningAnswers(screeningResult);
      }

      // Generate sample work in background (non-blocking) — with enriched job desc
      setIsGeneratingSample(true);
      try {
        const sample = await generateSampleWork({ jobDesc: enrichedJobDesc, profile, signatureStyle });
        setSampleWork(sample);
      } catch (e) {
        console.log("Sample work generation skipped:", e.message);
      } finally {
        setIsGeneratingSample(false);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(isEditing ? editedProposal : proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyScreening = () => {
    if (!screeningAnswers) return;
    const text = screeningAnswers.map((a, i) => `Q: ${a.question}\nA: ${a.answer}`).join("\n\n");
    navigator.clipboard.writeText(text);
  };

  const greetingInfo = clientCountry ? COUNTRIES.find((c) => c.name === clientCountry) : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg, #0c0c18 0%, #111422 35%, #0a1525 70%, #0c0c18 100%)",
      fontFamily: "'Libre Baskerville', Georgia, serif", color: "#ddd2c4",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Dancing+Script:wght@700&family=Great+Vibes&family=Pacifico&family=Sacramento&family=Allura&family=Alex+Brush&display=swap');
        @keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:.35} 40%{transform:translateY(-10px);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes softPulse { 0%,100%{box-shadow:0 0 20px rgba(200,160,100,.04)} 50%{box-shadow:0 0 40px rgba(200,160,100,.08)} }
        *{box-sizing:border-box;margin:0;padding:0}
        textarea:focus,input:focus,select:focus{outline:none}
        ::selection{background:rgba(200,160,100,.25)}
        button{font-family:inherit}
        select{appearance:none;-webkit-appearance:none}
        @media(max-width:640px){.info-grid{grid-template-columns:1fr!important}.tips-grid{grid-template-columns:1fr!important}}
      `}</style>

      <div style={{ position: "fixed", top: -250, right: -150, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(200,160,100,.025) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 20px 100px" }}>

        {/* ═══ HEADER ═══ */}
        <header style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 16px", borderRadius: 100, background: "rgba(200,160,100,.06)", border: "1px solid rgba(200,160,100,.1)", marginBottom: 20, fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 600, color: "#c8a064", letterSpacing: "1.5px" }}>
            ✦ UPWORK PROPOSAL WRITER
          </div>
          <h1 style={{ fontSize: "clamp(26px,5vw,42px)", fontWeight: 400, lineHeight: 1.2, marginBottom: 12, color: "#efe6d8" }}>
            Proposals That Sound Like{" "}
            <em style={{ fontWeight: 700, fontStyle: "italic", background: "linear-gradient(135deg,#c8a064,#e0c890,#c8a064)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 5s linear infinite" }}>You</em>, Not AI
          </h1>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14.5, color: "#685e52", maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
            Set up your profile once. Paste any job. Get a proposal, screening answers, and a sample work file — all personalized from your credentials.
          </p>
        </header>

        {/* ═══ SEO CONTENT SECTION ═══ */}
        <div style={{ marginBottom: 36, padding: "24px 28px", background: "rgba(200,160,100,0.02)", border: "1px solid rgba(200,160,100,0.06)", borderRadius: 18 }}>
          <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10, color: "#efe6d8", fontFamily: "'Libre Baskerville', Georgia, serif" }}>
            Write Winning Upwork Proposals with AI
          </h2>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#685e52", lineHeight: 1.8 }}>
            <p style={{ marginBottom: 10 }}>
              This free AI proposal writer helps freelancers craft personalized, job-specific Upwork proposals in seconds. Paste any job description — including Loom videos, Google Docs, and other linked resources — and get a human-sounding proposal that references your actual skills, past projects, and client feedback.
            </p>
            <p style={{ marginBottom: 10 }}>
              Unlike generic templates, every proposal is dynamically generated to be unique, concise, and tailored to the specific job requirements. The AI reads the full job post, detects screening questions, matches your most relevant credentials, and even creates a downloadable sample work file with your Upwork badges and handwritten signature.
            </p>
            <p>
              Whether you're a web developer, designer, virtual assistant, writer, or marketer — set up your profile once and generate unlimited winning proposals. Top freelancers know that speed and specificity win contracts. Apply faster, stand out more, and close more clients.
            </p>
          </div>
        </div>

        {/* ═══ PROFILE CARD ═══ */}
        <div style={{ ...S.card, border: profileLoaded ? "1px solid rgba(90,160,80,.12)" : S.card.border }}>
          <Toggle label="Your Profile" badge={profileLoaded ? "Saved" : null} open={showProfile} onClick={() => setShowProfile(!showProfile)} />

          {showProfile && (
            <div style={{ animation: "fadeUp 0.3s ease-out" }}>
              {profileLoaded && profileMode === "view" && (
                <>
                  <ProfileCard profile={profile} onEdit={() => setProfileMode("edit")} onClear={clearProfileData} />
                  <SignatureBlock signature={signature} signatureStyle={signatureStyle} onChangeStyle={handleChangeSignatureStyle} onChange={handleSaveSignature} profile={profile} />
                </>
              )}

              {profileLoaded && profileMode === "edit" && (
                <ProfileEditor profile={profile} onSave={saveProfileData} onCancel={() => setProfileMode("view")} />
              )}

              {!profileLoaded && (
                <div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    {[
                      { key: "paste", label: "📋 Paste Profile" },
                      { key: "manual", label: "✏️ Fill Manually" },
                    ].map(({ key, label }) => (
                      <button key={key} onClick={() => setProfileMode(key)} style={{
                        fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: profileMode === key ? 600 : 400,
                        padding: "7px 16px", borderRadius: 100, cursor: "pointer", transition: "all 0.2s",
                        border: `1.5px solid ${profileMode === key ? "#c8a064" : "rgba(200,160,100,.1)"}`,
                        background: profileMode === key ? "rgba(200,160,100,.1)" : "transparent",
                        color: profileMode === key ? "#c8a064" : "#685e52",
                      }}>{label}</button>
                    ))}
                  </div>

                  {profileMode === "paste" && (
                    <>
                      <div style={{ marginBottom: 12 }}>
                        <label style={S.label}>Profile URL <span style={{ opacity: .5, fontWeight: 400 }}>(optional)</span></label>
                        <input value={pasteUrl} onChange={(e) => setPasteUrl(e.target.value)} placeholder="https://upwork.com/freelancers/~..." style={S.input} onFocus={focus} onBlur={blur} />
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <label style={S.label}>Paste Your Profile Content</label>
                        <textarea value={pasteContent} onChange={(e) => setPasteContent(e.target.value)} rows={8} placeholder={"Go to your Upwork or LinkedIn profile page\n→ Select All (Ctrl+A) → Copy (Ctrl+C) → Paste here\n\nInclude: title, overview, skills, work history, certifications, reviews — everything visible on your profile."} style={S.textarea} onFocus={focus} onBlur={blur} />
                        <p style={S.hint}>Works with both Upwork and LinkedIn. The AI extracts everything including past project feedback automatically.</p>
                      </div>
                      <Btn primary disabled={!pasteContent.trim() || isExtracting} onClick={handleExtract} style={{ width: "100%" }}>
                        {isExtracting ? <span>Extracting profile... <Spinner /></span> : "🔍  Extract & Save Profile"}
                      </Btn>
                      {profileError && (
                        <div style={{ background: "rgba(200,70,55,.07)", border: "1px solid rgba(200,70,55,.18)", borderRadius: 10, padding: "12px 16px", marginTop: 12, fontFamily: "'Outfit',sans-serif", fontSize: 12.5, color: "#c8655a", lineHeight: 1.5 }}>
                          {profileError}
                        </div>
                      )}
                    </>
                  )}

                  {profileMode === "manual" && (
                    <ProfileEditor
                      profile={{ name: "", title: "", location: "", hourlyRate: "", overview: "", skills: [], certifications: [], pastProjects: [], experience: "", jobSuccess: "", totalEarnings: "", totalJobs: "", portfolio: [], languages: [], education: [], profileUrl: "" }}
                      onSave={saveProfileData}
                      onCancel={() => setProfileMode("paste")}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══ JOB INPUT CARD ═══ */}
        <div style={S.card}>
          {/* Job Description */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ ...S.label, marginBottom: 8 }}>Job Description *</label>
            <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} rows={8} placeholder="Paste the full Upwork job posting here..." style={S.textarea} onFocus={focus} onBlur={blur} />
            {jobDesc && <div style={{ textAlign: "right", ...S.hint }}>{jobDesc.split(/\s+/).filter(Boolean).length} words</div>}
            <DetectedUrlsBar urls={detectedUrls} fetchStatus={urlFetchStatus} />
          </div>

          {/* Client Name + Country + Tone — single row */}
          <div className="info-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div>
              <label style={S.label}>Client Name</label>
              <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Sarah" style={S.input} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={S.label}>Client Country {greetingInfo && <span style={{ color: "#6aaa5a", fontWeight: 400, textTransform: "none" }}>→ "{greetingInfo.greeting}"</span>}</label>
              <select value={clientCountry} onChange={(e) => setClientCountry(e.target.value)} style={{ ...S.input, cursor: "pointer", paddingRight: 32, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23807060' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
                <option value="">— Select —</option>
                {COUNTRIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.name} ({c.greeting})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={S.label}>Tone</label>
              <div style={{ display: "flex", gap: 6, paddingTop: 2 }}>
                {[
                  { key: "casual", label: "😎" },
                  { key: "conversational", label: "💬" },
                  { key: "professional", label: "👔" },
                ].map(({ key, label }) => (
                  <button key={key} onClick={() => setTone(key)} title={key} style={{
                    fontSize: 18, padding: "6px 14px", borderRadius: 10, cursor: "pointer",
                    border: `1.5px solid ${tone === key ? "#c8a064" : "rgba(200,160,100,.1)"}`,
                    background: tone === key ? "rgba(200,160,100,.12)" : "transparent",
                    transition: "all 0.2s",
                  }}>{label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Screening Questions (Upwork's separate section) */}
          <Toggle
            label="Screening Questions"
            badge={screeningQuestions.length > 0 ? `${screeningQuestions.length}` : null}
            open={showScreening}
            onClick={() => setShowScreening(!showScreening)}
          />
          {showScreening && (
            <div style={{ marginTop: 12, marginBottom: 18 }}>
              <ScreeningQuestionsSection
                questions={screeningQuestions}
                onChange={setScreeningQuestions}
                answers={screeningAnswers}
                isGenerating={isGenerating}
              />
            </div>
          )}

          {/* Generate */}
          <button onClick={handleGenerate} disabled={!jobDesc.trim() || isGenerating} style={{
            width: "100%", fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 15,
            border: "none", borderRadius: 14, padding: "16px 28px", cursor: jobDesc.trim() && !isGenerating ? "pointer" : "default",
            transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
            background: jobDesc.trim() && !isGenerating ? "linear-gradient(135deg,#c8a064,#a87840)" : "rgba(200,160,100,.1)",
            color: jobDesc.trim() && !isGenerating ? "#0c0c18" : "#4a4238",
            opacity: isGenerating ? 0.7 : 1,
          }}>
            {isGenerating ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>Crafting proposal <Spinner /></span>
              : genCount > 0 ? "⟳  Regenerate" : "✦  Generate Proposal"}
          </button>

          {error && <div style={{ background: "rgba(200,70,55,.07)", border: "1px solid rgba(200,70,55,.18)", borderRadius: 10, padding: "12px 16px", marginTop: 14, fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#c8655a", lineHeight: 1.5 }}>{error}</div>}
        </div>

        {/* ═══ LOADING ═══ */}
        {isGenerating && (
          <div style={{ ...S.card, padding: "40px 24px", textAlign: "center", animation: "fadeUp 0.4s ease-out" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", border: "2.5px solid rgba(200,160,100,.1)", borderTopColor: "#c8a064", animation: "spin .9s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13.5, color: "#685e52", lineHeight: 1.6 }}>
              {fetchProgress
                ? `🔗 Reading linked resource ${fetchProgress.current}/${fetchProgress.total}...`
                : greetingInfo ? `Crafting a ${greetingInfo.name}-aware proposal...` : "Matching credentials to this job..."}
              <br /><span style={{ fontSize: 11.5, color: "#4a4238" }}>
                {fetchProgress
                  ? getUrlTypeLabel(detectedUrls[fetchProgress.current - 1]?.type)
                  : <>
                      {profile?.name ? `Using ${profile.name}'s profile` : "Concise & persuasive"}
                      {detectedUrls.length > 0 ? ` + ${detectedUrls.length} linked resource${detectedUrls.length > 1 ? "s" : ""}` : ""}
                      {screeningQuestions.some(q => q.question.trim()) ? " + answering screening questions" : ""}
                    </>
                }
              </span>
            </p>
          </div>
        )}

        {/* ═══ OUTPUT ═══ */}
        {proposal && (
          <div ref={outputRef} style={{ animation: "fadeUp 0.5s ease-out" }}>
            {/* Proposal */}
            <div style={{ ...S.card, overflow: "hidden", padding: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid rgba(200,160,100,.06)", flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[`📝 ${wordCount}w`, `🎲 v${genCount}`, ...(greetingInfo ? [`🌍 ${greetingInfo.greeting}`] : [])].map((t, i) => (
                    <span key={i} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, padding: "3px 10px", borderRadius: 100, background: "rgba(200,160,100,.06)", border: "1px solid rgba(200,160,100,.08)", color: "#807060" }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn small onClick={() => { setIsEditing(!isEditing); if (!isEditing) setEditedProposal(proposal); }}>
                    {isEditing ? "👁 Preview" : "✎ Edit"}
                  </Btn>
                  <Btn small onClick={handleGenerate}>⟳ New</Btn>
                  <Btn small primary onClick={handleCopy}>{copied ? "✓ Copied!" : "📋 Copy"}</Btn>
                </div>
              </div>

              {isEditing ? (
                <textarea
                  value={editedProposal}
                  onChange={(e) => setEditedProposal(e.target.value)}
                  style={{
                    width: "100%", padding: "26px 24px", fontSize: 14.5, lineHeight: 1.85,
                    color: "#d4c8ba", background: "rgba(255,255,255,.015)", border: "none",
                    fontFamily: "'Outfit',sans-serif", resize: "vertical", minHeight: 200,
                  }}
                  rows={12}
                />
              ) : (
                <ProposalPreview
                  text={editedProposal || proposal}
                  profile={profile}
                  signatureStyle={signatureStyle}
                />
              )}
            </div>

            {/* Tags */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 6 }}>
              {[
                "✅ Job-specific", "✅ Human tone",
                ...(greetingInfo ? ["✅ " + greetingInfo.greeting + " greeting"] : []),
                ...(profileLoaded ? ["✅ Auto-matched credentials"] : []),
                ...(detectedUrls.length > 0 ? ["✅ " + detectedUrls.length + " link" + (detectedUrls.length > 1 ? "s" : "") + " reviewed"] : []),
                "✅ CTA", "✅ Concise",
              ].map((t, i) => (
                <span key={i} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#5a8a50", padding: "3px 10px", borderRadius: 100, background: "rgba(90,138,80,.06)", border: "1px solid rgba(90,138,80,.1)" }}>{t}</span>
              ))}
            </div>

            {/* Screening Answers Output */}
            {screeningAnswers && screeningAnswers.length > 0 && (
              <div style={{ ...S.card, overflow: "hidden", padding: 0, animation: "fadeUp 0.5s ease-out" }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 20px", borderBottom: "1px solid rgba(200,160,100,.06)",
                  background: "rgba(100,170,90,0.03)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>🎯</span>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, color: "#d4c8ba" }}>
                      Screening Question Answers
                      <span style={{ fontSize: 11, fontWeight: 400, color: "#685e52", marginLeft: 8 }}>
                        Copy each into Upwork's screening fields
                      </span>
                    </div>
                  </div>
                  <Btn small primary onClick={handleCopyScreening}>📋 Copy All</Btn>
                </div>
                <div style={{ padding: "20px 24px" }}>
                  {screeningAnswers.map((a, i) => (
                    <div key={i} style={{ marginBottom: i < screeningAnswers.length - 1 ? 18 : 0 }}>
                      <div style={{
                        fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, color: "#c8a064",
                        marginBottom: 6, display: "flex", alignItems: "center", gap: 8,
                      }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, minWidth: 22, height: 22, display: "flex",
                          alignItems: "center", justifyContent: "center", borderRadius: 6,
                          background: "rgba(200,160,100,0.1)",
                        }}>Q{i + 1}</span>
                        {a.question}
                      </div>
                      <div style={{
                        fontFamily: "'Outfit',sans-serif", fontSize: 13.5, color: "#d4c8ba",
                        lineHeight: 1.7, padding: "12px 16px", borderRadius: 10,
                        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(200,160,100,0.06)",
                        marginLeft: 30, whiteSpace: "pre-wrap", position: "relative",
                      }}>
                        {a.answer}
                        <button
                          onClick={() => { navigator.clipboard.writeText(a.answer); }}
                          style={{
                            position: "absolute", top: 8, right: 8, background: "rgba(200,160,100,0.08)",
                            border: "none", borderRadius: 6, padding: "3px 8px", cursor: "pointer",
                            fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#c8a064",
                          }}
                          title="Copy this answer"
                        >📋</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sample Work Output */}
            <SampleWorkCard sampleWork={sampleWork} isGenerating={isGeneratingSample} onUpdate={setSampleWork} />
          </div>
        )}

        {/* ═══ TIPS ═══ */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 5, color: "#c8a064", fontFamily: "'Outfit',sans-serif" }}>Before You Submit</h2>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12.5, color: "#4a4238", marginBottom: 18, lineHeight: 1.6 }}>Quick checks from top freelancers</p>
          <div className="tips-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { icon: "🌍", title: "Regional greeting", desc: "Select client's country — AI greets in their language." },
              { icon: "🎯", title: "Auto-detects questions", desc: "AI reads the job post and answers any questions the client asked." },
              { icon: "🔗", title: "Reads linked resources", desc: "Loom videos, Google Docs, websites — AI fetches & references them in your proposal." },
              { icon: "⭐", title: "Auto-matched creds", desc: "AI picks the most relevant past projects & feedback automatically." },
              { icon: "📞", title: "Short CTA", desc: "Ends with a punchy hook about why you + next step." },
              { icon: "⚡", title: "Apply fast", desc: "First 5 proposals get 10x views. Speed wins." },
            ].map((t, i) => (
              <div key={i} style={{ background: "rgba(200,160,100,.03)", border: "1px solid rgba(200,160,100,.07)", borderRadius: 12, padding: "14px 16px", transition: "all 0.3s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(200,160,100,.18)"; e.currentTarget.style.background = "rgba(200,160,100,.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(200,160,100,.07)"; e.currentTarget.style.background = "rgba(200,160,100,.03)"; }}
              >
                <div style={{ fontSize: 16, marginBottom: 6 }}>{t.icon}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 12, color: "#ddd2c4", marginBottom: 3 }}>{t.title}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#685e52", lineHeight: 1.5 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ INVOICE GENERATOR AD ═══ */}
        <a
          href="https://invoice-generator-new-eight.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", display: "block" }}
        >
          <div style={{
            marginTop: 30, marginBottom: 30, padding: "28px 30px",
            background: "linear-gradient(135deg, rgba(90,160,220,0.08) 0%, rgba(100,200,140,0.06) 50%, rgba(200,160,100,0.08) 100%)",
            border: "1px solid rgba(90,160,220,0.15)", borderRadius: 20,
            display: "flex", alignItems: "center", gap: 24, cursor: "pointer",
            transition: "all 0.3s ease", position: "relative", overflow: "hidden",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(90,160,220,0.35)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(90,160,220,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(90,160,220,0.15)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            {/* Decorative background glow */}
            <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(90,160,220,0.08), transparent)", pointerEvents: "none" }} />

            {/* Icon */}
            <div style={{
              minWidth: 64, height: 64, borderRadius: 16,
              background: "linear-gradient(135deg, #4a9eda, #3d85c6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 15px rgba(74,158,218,0.25)",
              fontSize: 28, flexShrink: 0,
            }}>
              🧾
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "'Outfit',sans-serif", fontSize: 10, fontWeight: 600,
                color: "#4a9eda", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 5,
              }}>
                FREE TOOL — FROM THE MAKERS OF THIS APP
              </div>
              <div style={{
                fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 18, fontWeight: 700,
                color: "#efe6d8", marginBottom: 6, lineHeight: 1.3,
              }}>
                AI Invoice Generator for Freelancers
              </div>
              <div style={{
                fontFamily: "'Outfit',sans-serif", fontSize: 12.5, color: "#685e52", lineHeight: 1.6,
              }}>
                Won the job? Create professional invoices instantly — branded, itemized, and ready to send. No signup needed.
              </div>
              <div style={{
                fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600,
                color: "#4a9eda", marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                Try it free → invoice-generator-new-eight.vercel.app
                <span style={{ fontSize: 14, transition: "transform 0.2s" }}>↗</span>
              </div>
            </div>
          </div>
        </a>

        <div style={{ textAlign: "center", marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(200,160,100,.05)" }}>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#3a3228", lineHeight: 1.7 }}>
            Free AI Upwork Proposal Writer — Profile saved locally. Your data never leaves your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
