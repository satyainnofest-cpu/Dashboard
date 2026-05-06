import type {
  ImpactStat,
  Mentor,
  Milestone,
  Project,
  SiteMeta,
  SkillAxis,
} from "./types";

export const site: SiteMeta = {
  name: "Aarav Sharma",
  age: 14,
  location: "Bengaluru, India",
  tagline: "Impact through Innovation",
  mission:
    "I'm a 14-year-old student building small, honest AI tools for problems I can see — climate, health, education, community. The goal isn't a demo. It's a thing that helps one real person, then a thousand.",
  url: "https://aarav.example.com",
  description:
    "Portfolio of Aarav Sharma — Grade 9 student in Bengaluru building AI for Good projects across climate, health, education, and community.",
  contact: {
    email: "hello@example.com",
    github: "aarav-ai",
    linkedin: "aarav-sharma-ai",
  },
};

export const impactStats: ImpactStat[] = [
  {
    label: "people reached",
    value: 4280,
    delta: "+812 this quarter",
    description: "Across pilots in 14 schools and 3 ASHA cohorts.",
  },
  {
    label: "model accuracy",
    value: 94,
    unit: "%",
    delta: "+6 pts since v1",
    description: "Average across the 5 deployed models, on held-out data.",
  },
  {
    label: "projects shipped",
    value: 5,
    delta: "+2 this year",
    description: "From crop-disease CV to solar load forecasting.",
  },
  {
    label: "deployment cost",
    value: 0,
    unit: "$",
    delta: "edge-only",
    description: "All inference runs on-device or on a $35 board.",
  },
];

const months = [
  "Jun '24",
  "Jul '24",
  "Aug '24",
  "Sep '24",
  "Oct '24",
  "Nov '24",
  "Dec '24",
  "Jan '25",
  "Feb '25",
  "Mar '25",
  "Apr '25",
  "May '25",
];

const khetiAi: Project = {
  slug: "kheti-ai",
  name: "Kheti AI",
  tagline: "On-device crop disease detection for smallholder farmers",
  domain: "Climate",
  status: "pilot",
  startedAt: "2024-08",
  tech: ["TensorFlow Lite", "MobileNetV3", "React Native", "Expo", "Edge"],
  problem: [
    "India has more than 100 million smallholder farmers, most working under two hectares. When a leaf turns yellow, the closest agronomist might be a two-hour bus ride away. By the time advice arrives, a third of the field is gone.",
    "The two existing tools — printed disease charts and WhatsApp groups with extension officers — both fail in the same way. Charts can't tell apart early-stage blight from nitrogen deficiency. WhatsApp groups silt up with fifty-message threads where the wrong call gets the most likes.",
    "I spent three weekends in late 2024 with farmers in Mandya district watching them photograph diseased leaves on a Redmi 9. Every single one tried Google Lens first. Every single one got back generic search results, mostly in English, mostly wrong. The problem isn't sensors. It's that smartphone cameras already exist in every pocket — the missing piece is a model that runs there.",
    "Network is the second problem. Most fields I visited had two bars of 2G. Any tool that needs the cloud is a tool that doesn't work when you need it.",
  ],
  pullStat: {
    value: "30–40%",
    caption: "of yield lost annually to detectable, treatable diseases",
    source: "FAO 2023, Crop Protection Compendium",
  },
  solution: [
    "Kheti AI is a 14 MB Android app that runs a quantized MobileNetV3 model entirely on the device. Point your camera at a leaf, get a diagnosis in 200 ms — even in airplane mode. The model recognises 24 diseases across rice, tomato, and chilli, the three crops Mandya farmers grow most.",
    "Training data came from PlantVillage augmented with 3,200 photos I collected on field visits, each labelled with the help of two agronomists from UAS Bangalore. Field photos were critical: PlantVillage is shot in studio lighting, and a 9 AM Mandya field looks nothing like that.",
    "The output isn't just a label. It's a label, a confidence score, two-line treatment guidance in Kannada, and a 'when to ask a human' threshold. If confidence drops below 70 percent the app refuses to commit and sends the farmer to the local extension officer instead — the worst failure mode is a wrong, confident answer.",
  ],
  solutionBullets: [
    { label: "Model", value: "MobileNetV3-Small, INT8 quantized, 4.2 MB" },
    { label: "Data", value: "PlantVillage + 3.2k field photos from Mandya" },
    { label: "Deployment", value: "TFLite on-device, no network required" },
  ],
  impact: [
    "Early pilot with 38 farmers across two villages over 9 weeks. Recorded 412 diagnoses, 87% confirmed correct on follow-up by extension officers. The wins that mattered most were the small ones — a paddy field flagged for early bacterial leaf blight three weeks before symptoms would have been visible to the eye.",
    "Average response time from photo to action dropped from 2.4 days (WhatsApp baseline) to 4 minutes (app baseline). Farmers reported using the app 1.6 times per day on average — far more than I expected.",
    "Projected impact at scale assumes the 14-village expansion already in conversation with the local agri co-op. Treat these as hypotheses, not promises.",
  ],
  metrics: [
    { label: "farmers in pilot", value: 38 },
    { label: "diagnoses recorded", value: 412 },
    { label: "diagnostic accuracy", value: 87, unit: "%" },
    { label: "avg. response time", value: 4, unit: "min" },
  ],
  reachBaseline: 38,
  links: { github: "#", demo: "#" },
  buildTimeline: [
    {
      date: "Aug 2024",
      title: "Prototype on Colab",
      body: "Trained a baseline ResNet on PlantVillage. 92% on validation, 41% on a phone-shot test set.",
    },
    {
      date: "Sep 2024",
      title: "Field trip #1, Mandya",
      body: "Two days collecting photos. Hard truth: lab models break in real light.",
    },
    {
      date: "Nov 2024",
      title: "MobileNetV3 + INT8",
      body: "Quantized to 4.2 MB. Device latency 200 ms on a Redmi 9.",
    },
    {
      date: "Feb 2025",
      title: "Pilot launch",
      body: "Deployed to 38 farmers via APK + side-load workshop.",
    },
    {
      date: "May 2025",
      title: "Field pilot review",
      body: "412 diagnoses, 87% accuracy. Two false-negatives caught by humans.",
    },
  ],
  toolsUsed: [
    "TensorFlow / TFLite",
    "Expo + React Native",
    "Roboflow",
    "Figma",
    "OpenCV",
  ],
  lessonsLearned: [
    "Studio data is a lie. Half my training time should have been field photo collection.",
    "Confidence thresholds save users from wrong answers more than any accuracy improvement does.",
    "Kannada-first beats English-with-translate. Always.",
  ],
  gallery: [],
  codeSnippet: {
    filename: "infer.ts",
    language: "ts",
    code: `import * as tflite from "react-native-fast-tflite";

const model = await tflite.loadTensorflowModel(
  require("./assets/kheti-v3-int8.tflite")
);

export async function classifyLeaf(image: Uint8Array) {
  const input = preprocess(image, { size: 224, mean: 127.5 });
  const [logits] = model.runSync([input]);
  const { label, confidence } = topK(logits, LABELS)[0];

  // Refuse to commit on low confidence — escalate to a human.
  if (confidence < 0.7) {
    return { kind: "uncertain", suggestEscalate: true };
  }
  return { kind: "diagnosis", label, confidence };
}`,
  },
  quote: {
    text: "Pehle ek hafta lagta tha. Ab phone se hi pata chal jata hai.",
    attribution: "Lakshmi Devi, paddy farmer, Belakavadi village",
  },
  monthly: [0, 0, 4, 12, 28, 41, 58, 76, 102, 138, 184, 232],
  domainShare: 0.34,
};

const triageSaheli: Project = {
  slug: "triage-saheli",
  name: "Triage Saheli",
  tagline: "Multilingual symptom triage assistant for ASHA workers",
  domain: "Health",
  status: "pilot",
  startedAt: "2024-10",
  tech: ["Llama 3", "RAG", "FastAPI", "React", "IndexedDB"],
  problem: [
    "ASHA workers — Accredited Social Health Activists — are India's first line of community health. Each one serves 1,000 people. They walk between houses with a printed manual that hasn't been updated in three years and a phone that maybe gets signal.",
    "When a child presents symptoms an ASHA worker hasn't seen often, the decision is the same one every time: refer to PHC or treat at home? Refer too aggressively and the PHC clogs; refer too late and a treatable case becomes a tragedy. The decision happens in 90 seconds, with no senior to consult.",
    "I shadowed two ASHAs in north Karnataka for a week. Their phones already had WhatsApp. None of them had ever used a chatbot for triage — every existing one was English-only, internet-only, and confidently wrong on Indian-context cases.",
  ],
  pullStat: {
    value: "1.04M",
    caption: "ASHA workers serving roughly 1.04 billion rural Indians",
    source: "MoHFW NHM dashboard, 2024",
  },
  solution: [
    "Triage Saheli is a phone-first chat tool that runs on-device for the common 80% of cases and falls back to a small Llama 3 8B endpoint for the ambiguous tail. The on-device path uses a hand-curated decision tree distilled from the WHO IMNCI guidelines, rendered in Kannada and Hindi.",
    "The RAG corpus is 92 PDFs from MoHFW, WHO, and the Karnataka NHM training cell, chunked at the section level so the model can cite the actual page when an ASHA asks 'why'. Without citations the tool is just a confident guess engine.",
    "Crucially the UI surfaces three things on every answer: the recommendation, the confidence, and the source. ASHAs don't need an oracle, they need a credible second pair of eyes.",
  ],
  solutionBullets: [
    { label: "Model", value: "Llama 3 8B for tail; on-device tree for common 80%" },
    { label: "Data", value: "92 vetted MoHFW/WHO PDFs, section-chunked" },
    { label: "Deployment", value: "PWA, IndexedDB cache, ~12 MB after first load" },
  ],
  impact: [
    "Pilot ran with 11 ASHAs across Yadgir district for 6 weeks. They consulted the tool 287 times. 78% of consultations matched what the supervising medical officer would have advised — a baseline of 'matches an MO' rather than 'is right' is the honest framing here.",
    "Three documented cases where the tool flagged severe dehydration the ASHA was about to treat at home. The PHC referral happened, the children recovered.",
    "Where the tool was wrong, it was usually overcautious — referring when home care would have been fine. That's the failure mode I want.",
  ],
  metrics: [
    { label: "ASHAs in pilot", value: 11 },
    { label: "consultations", value: 287 },
    { label: "MO-aligned answers", value: 78, unit: "%" },
    { label: "severe cases caught", value: 3 },
  ],
  reachBaseline: 11000,
  links: { github: "#" },
  buildTimeline: [
    {
      date: "Oct 2024",
      title: "Shadowed ASHAs in Yadgir",
      body: "Five days, four ASHAs, fifteen home visits. Notebook full of UX notes.",
    },
    {
      date: "Dec 2024",
      title: "First RAG prototype",
      body: "FastAPI endpoint over 92 chunked PDFs. English only. ~70% match rate.",
    },
    {
      date: "Feb 2025",
      title: "Kannada + on-device tree",
      body: "Hand-built decision tree for the common 80% so the app works offline.",
    },
    {
      date: "Apr 2025",
      title: "Pilot launch",
      body: "11 ASHAs trained over a Saturday workshop in Yadgir.",
    },
  ],
  toolsUsed: ["Llama 3", "FastAPI", "Together.ai", "Whisper", "Vite + React"],
  lessonsLearned: [
    "Citations beat accuracy. Trust is what gets the tool used twice.",
    "On-device first, cloud second — not the reverse.",
    "Translation isn't enough. The decision tree had to be re-shaped for the local presentation of cases.",
  ],
  gallery: [],
  codeSnippet: {
    filename: "triage.ts",
    language: "ts",
    code: `export async function triage(symptoms: Symptoms, lang: "kn" | "hi") {
  // Try the deterministic tree first — fast, offline, predictable.
  const local = await runDecisionTree(symptoms, lang);
  if (local.confidence > 0.85) return local;

  // Tail of ambiguity goes to the model with cited sources.
  const docs = await retrieve(symptoms, { topK: 4, lang });
  const result = await llama3.chat({
    system: SYSTEM_PROMPT[lang],
    user: format(symptoms),
    context: docs,
  });

  return { ...result, citations: docs.map(d => d.source) };
}`,
  },
  monthly: [0, 0, 0, 0, 11, 36, 84, 142, 198, 251, 287, 340],
  domainShare: 0.28,
};

const gurukul: Project = {
  slug: "gurukul",
  name: "Gurukul",
  tagline: "Adaptive offline-first tutor in regional languages",
  domain: "Education",
  status: "prototype",
  startedAt: "2024-06",
  tech: ["DistilBERT", "Whisper.cpp", "Tauri", "SQLite"],
  problem: [
    "Government schools in rural India often have one teacher for two grades. The teacher is excellent — the situation isn't. A student stuck on a Class 7 math concept may wait a week for individual help.",
    "Edtech apps exist but they assume two things rural classrooms don't have: reliable internet and English fluency. BYJU'S works on a 5G phone in Mumbai. It does not work on a 32 GB Android in a school with one shared hotspot.",
    "What's needed is software that runs locally, in the local language, that adapts to where each student is rather than assuming a Class 7 child knows Class 5 material.",
  ],
  pullStat: {
    value: "55%",
    caption: "of Class 5 children in rural India who can't read a Class 2 text",
    source: "ASER 2023 report",
  },
  solution: [
    "Gurukul is a desktop+tablet app that ships a 180 MB bundle including a small DistilBERT-based content recommender, Whisper.cpp for voice input, and 600 hours of pre-recorded lessons in Kannada, Hindi, and Tamil.",
    "The adaptive piece isn't fancy. After every quiz, a tiny model — 4 MB — re-ranks the next 5 lessons based on which sub-skills the student struggled on. Boring, predictable, useful.",
    "Voice input matters because typing in Kannada on a touchscreen is brutal. Whisper.cpp is small and runs on a Pi 4 in real time, which means the app works on the cheapest classroom hardware.",
  ],
  solutionBullets: [
    { label: "Model", value: "DistilBERT recommender + Whisper.cpp for voice" },
    { label: "Data", value: "600h of regional-language content, locally bundled" },
    { label: "Deployment", value: "Tauri desktop, 180 MB, runs on a Pi 4" },
  ],
  impact: [
    "Tested with 24 students at Government Higher Primary School, Belakavadi, over 4 weeks. Pre/post assessments showed an average 17-percentage-point gain on the targeted Class 5 reading benchmark — small sample, real signal.",
    "Self-reported time-on-task more than doubled compared to textbook-only baseline. Teachers reported being able to free up 40 minutes per period for the children who needed direct help.",
    "Projected reach treats the app as a pure software cost — no cloud, no per-seat license — so the bottleneck is hardware, not software.",
  ],
  metrics: [
    { label: "students in pilot", value: 24 },
    { label: "weeks tested", value: 4 },
    { label: "reading-benchmark gain", value: 17, unit: "pp" },
    { label: "time-on-task lift", value: 112, unit: "%" },
  ],
  reachBaseline: 24,
  links: { github: "#" },
  buildTimeline: [
    {
      date: "Jun 2024",
      title: "First spike",
      body: "Just a Tauri shell + a CSV of lessons. Worked; ugly.",
    },
    {
      date: "Sep 2024",
      title: "Whisper.cpp on Pi",
      body: "Real-time Kannada voice on a Pi 4. Felt like magic.",
    },
    {
      date: "Jan 2025",
      title: "Adaptive ranker",
      body: "Tiny DistilBERT distilled to 4 MB; quiz-driven re-ranking.",
    },
    {
      date: "Apr 2025",
      title: "Belakavadi pilot",
      body: "24 students, 4 weeks. First measured learning lift.",
    },
  ],
  toolsUsed: ["Tauri", "DistilBERT", "Whisper.cpp", "SQLite", "Audacity"],
  lessonsLearned: [
    "Adaptive learning doesn't need to be fancy to be useful.",
    "Voice-first changes who can use the tool.",
    "Bundle content; don't stream it.",
  ],
  gallery: [],
  codeSnippet: {
    filename: "rank.py",
    language: "python",
    code: `def rerank_next_lessons(student_id: str, recent_quiz: QuizResult):
    # Pull last 5 quizzes; encode weak sub-skills.
    history = db.recent_quizzes(student_id, limit=5)
    skills_vec = encode_weakness(history + [recent_quiz])

    # 4 MB DistilBERT scores candidates; pick top 5.
    candidates = db.candidate_lessons(grade=recent_quiz.grade)
    scores = model.score(skills_vec, [c.embedding for c in candidates])
    return sorted(zip(candidates, scores), key=lambda x: -x[1])[:5]
`,
  },
  monthly: [0, 4, 6, 9, 12, 12, 14, 18, 20, 22, 24, 26],
  domainShare: 0.18,
};

const eWasteMapper: Project = {
  slug: "e-waste-mapper",
  name: "E-Waste Mapper",
  tagline: "Crowd-sourced e-waste hotspot mapping for Bengaluru wards",
  domain: "Community",
  status: "shipped",
  startedAt: "2024-04",
  tech: ["YOLOv8", "Mapbox", "PWA", "Supabase", "Cron"],
  problem: [
    "Bengaluru generates an estimated 200,000 tonnes of e-waste per year. The formal recycling system handles less than 5%. The rest sits in alley corners, gets burned in informal yards, or ends up leaching into groundwater.",
    "The civic body, BBMP, has a complaint portal. It's underused because the friction is too high — find the form, fill in the address, attach a photo, never hear back.",
    "What if a citizen could photograph a pile, the app would identify it as e-waste, geolocate it, and pin it on a public ward-by-ward heatmap? Pressure becomes visible. Visible problems get fixed.",
  ],
  pullStat: {
    value: "<5%",
    caption: "of Bengaluru's e-waste enters the formal recycling stream",
    source: "Karnataka State PCB 2023 report",
  },
  solution: [
    "E-Waste Mapper is a PWA — no install required, opens from any link. The user takes a photo. A small YOLOv8 model classifies the image into 'e-waste / mixed waste / not waste' and counts items. The pin lands on a public Mapbox heatmap visible to anyone, including BBMP officers.",
    "Anti-spam is the hard part. Every report is rate-limited per session, photos are EXIF-stripped but compared by perceptual hash to detect duplicates, and 'not waste' classifications are silently dropped.",
    "The data is the moat. Six months of pinning gives a ward-level heatmap of where the problem lives — which is exactly the input civic-tech advocates have been asking for.",
  ],
  solutionBullets: [
    { label: "Model", value: "YOLOv8n, 6.2 MB, runs in browser via ONNX" },
    { label: "Data", value: "1,140 user reports across 4 BBMP wards" },
    { label: "Deployment", value: "PWA, Supabase backend, Mapbox tiles" },
  ],
  impact: [
    "Live for 9 months. 1,140 reports across 4 wards (out of 198 in the city). Two formal collection drives organised in Indiranagar and HSR off the back of the heatmap, recovering an estimated 4.2 tonnes.",
    "Two local councillors now reference the heatmap in monthly ward meetings — the tool succeeded the moment it became something officials use, not just citizens.",
    "Honest caveat: 4 wards is a tiny slice of the city. Expanding past early adopters is the unsolved problem.",
  ],
  metrics: [
    { label: "reports collected", value: 1140 },
    { label: "wards covered", value: 4 },
    { label: "tonnes recovered", value: 4.2 },
    { label: "council mentions", value: 12 },
  ],
  reachBaseline: 1140,
  links: { github: "#", demo: "#" },
  buildTimeline: [
    {
      date: "Apr 2024",
      title: "Idea + first mock",
      body: "Started after seeing a TV pile burning in a Koramangala alley.",
    },
    {
      date: "Jun 2024",
      title: "Browser ONNX model",
      body: "YOLOv8n compiled to ONNX, runs at 8 FPS on a mid-range Android.",
    },
    {
      date: "Aug 2024",
      title: "Public launch",
      body: "Quiet launch via a Twitter thread. Rate-limiting added the next day.",
    },
    {
      date: "Dec 2024",
      title: "First collection drive",
      body: "Indiranagar pile cluster mapped → BBMP organised pickup.",
    },
  ],
  toolsUsed: ["YOLOv8", "ONNX Runtime Web", "Mapbox GL JS", "Supabase", "Vercel"],
  lessonsLearned: [
    "Civic tech only works when officials use it. Build for them too.",
    "Anti-spam is half the engineering on any open-data tool.",
    "Heatmaps create accountability faster than dashboards.",
  ],
  gallery: [],
  codeSnippet: {
    filename: "classify.ts",
    language: "ts",
    code: `import * as ort from "onnxruntime-web";

const session = await ort.InferenceSession.create("/yolov8n-ewaste.onnx");

export async function classifyImage(blob: Blob): Promise<Detection[]> {
  const tensor = await preprocess(blob, 640, 640);
  const { output } = await session.run({ images: tensor });
  return decode(output, { iouThreshold: 0.45, scoreThreshold: 0.5 })
    .filter(d => d.label === "e-waste");
}`,
  },
  monthly: [12, 38, 92, 168, 256, 401, 562, 718, 854, 962, 1054, 1140],
  domainShare: 0.12,
};

const vidyut: Project = {
  slug: "vidyut",
  name: "Vidyut",
  tagline: "Solar microgrid load forecasting for rural schools",
  domain: "Climate",
  status: "research",
  startedAt: "2025-01",
  tech: ["LSTM", "Prophet", "Raspberry Pi", "MQTT", "Grafana"],
  problem: [
    "About 12,000 government schools across rural India run on small solar microgrids — 5–20 kW systems, often donated. The systems work but the operators don't have visibility. When a panel underperforms or load spikes, no one knows until lights stop coming on.",
    "Forecasting is the missing layer. If you can predict tomorrow's generation and the school's likely load, you can pre-charge batteries, alert when a panel is failing, and avoid the 4 PM blackout right when classes are wrapping up.",
    "Most existing forecasting tools are built for utility-scale grids. They want a Met-station feed and a SCADA system. Schools have neither.",
  ],
  pullStat: {
    value: "12,000+",
    caption: "rural Indian schools running on small solar microgrids",
    source: "MNRE 2024 dashboard",
  },
  solution: [
    "Vidyut is a research prototype: a $35 Raspberry Pi 4 sits next to the inverter, listens on MQTT for current/voltage, and pulls weather forecasts from IMD's open API. Two models run in parallel — a small LSTM for next-24h load, Prophet for next-7-day generation.",
    "The interesting bit is that with 30 days of school-specific data the model already beats the persistence baseline by 23%. With 90 days it beats it by 41%. The story here is 'small data, useful model'.",
    "Output is a single Grafana page the operator can pull up on a phone, plus three SMS alerts: panel underperforming, battery below threshold, big load expected.",
  ],
  solutionBullets: [
    { label: "Model", value: "Tiny LSTM (load) + Prophet (generation)" },
    { label: "Data", value: "30+ days of per-school MQTT + IMD forecasts" },
    { label: "Deployment", value: "Raspberry Pi 4, ~$35 BoM, runs offline" },
  ],
  impact: [
    "Currently running at 2 schools in Tumakuru district as a research deployment. Too early for hard outcomes — but the operator now sees a 5 PM dip three hours before it happens.",
    "Projected impact at 100 schools assumes the same per-school engineering effort, which is generous; deployment is what's hard, not the model.",
    "Filed under 'research' deliberately — the model works; the support model doesn't yet.",
  ],
  metrics: [
    { label: "schools online", value: 2 },
    { label: "RMSE vs persistence", value: -41, unit: "%" },
    { label: "avg. uptime", value: 96, unit: "%" },
    { label: "BoM per node", value: 35, unit: "$" },
  ],
  reachBaseline: 2,
  links: { github: "#" },
  buildTimeline: [
    {
      date: "Jan 2025",
      title: "Concept + lit review",
      body: "Read 22 papers; only 3 were small-grid-specific.",
    },
    {
      date: "Feb 2025",
      title: "Pi prototype on bench",
      body: "MQTT plumbing + IMD API working in 2 weeks.",
    },
    {
      date: "Mar 2025",
      title: "First school deploy",
      body: "Tumakuru. Discovered the inverter was 12 years older than its docs claimed.",
    },
    {
      date: "May 2025",
      title: "Forecast beats baseline",
      body: "23% RMSE improvement after 30 days of local data.",
    },
  ],
  toolsUsed: ["TensorFlow", "Prophet", "Mosquitto", "Grafana", "Twilio"],
  lessonsLearned: [
    "Edge hardware reality is messier than any spec sheet suggests.",
    "Per-school data is small but very local; a 4 MB model beats a generic 200 MB one here.",
    "SMS is still the most reliable last-mile channel.",
  ],
  gallery: [],
  codeSnippet: {
    filename: "forecast.py",
    language: "python",
    code: `def forecast_load(school_id: str, horizon_hours: int = 24):
    history = mqtt_store.last_n_days(school_id, n=30)
    weather = imd.forecast(school_id, hours=horizon_hours)

    # Tiny LSTM trained per school; ~120 KB weights.
    model = load_local_model(school_id)
    x = build_features(history, weather)
    return model.predict(x).tolist()
`,
  },
  monthly: [0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2],
  domainShare: 0.08,
};

export const projects: Project[] = [
  khetiAi,
  triageSaheli,
  gurukul,
  eWasteMapper,
  vidyut,
];

export const featuredSlugs = ["kheti-ai", "triage-saheli", "gurukul"];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function adjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) return { prev: undefined, next: undefined };
  const prev = i > 0 ? projects[i - 1] : projects[projects.length - 1];
  const next = i < projects.length - 1 ? projects[i + 1] : projects[0];
  return { prev, next };
}

export const timeSeriesMonths = months;

export const timeSeriesData = months.map((label, i) => ({
  month: label,
  kheti: khetiAi.monthly[i] ?? 0,
  triage: triageSaheli.monthly[i] ?? 0,
  gurukul: gurukul.monthly[i] ?? 0,
  ewaste: eWasteMapper.monthly[i] ?? 0,
  vidyut: vidyut.monthly[i] ?? 0,
}));

export const journey: Milestone[] = [
  {
    id: "spark",
    date: "2023 · sep",
    title: "First model on a Colab notebook",
    short:
      "MNIST. Of course. But the moment the loss curve dropped, something switched on.",
    body: "I was 12. A YouTube tutorial got me through the first epoch. The line going down felt like the most important line I'd ever seen.",
    side: "left",
  },
  {
    id: "first-fail",
    date: "2024 · jan",
    title: "First failed pilot",
    short:
      "Built a chatbot for my school's library. Three students used it. None came back.",
    body: "I thought the model was the project. The model was 5% of the project. Lesson learned the only way it can be — the hard way.",
    side: "right",
  },
  {
    id: "field-trip",
    date: "2024 · sep",
    title: "Mandya field trip",
    short:
      "Two days with farmers. The hour I learned my lab data was a lie.",
    body: "Held a Redmi 9 in 9 AM sun and watched my 92%-validation model collapse to 41%. Walked back with a notebook full of UX notes.",
    side: "left",
    links: [{ label: "Field notes", href: "#" }],
  },
  {
    id: "asha-shadow",
    date: "2024 · oct",
    title: "Shadowed ASHA workers in Yadgir",
    short:
      "Five days of home visits. Every one ended with the same triage decision.",
    body: "Watched the same 90-second decision happen fifteen times. That night I sketched what would become Triage Saheli on the back of a railway timetable.",
    side: "right",
  },
  {
    id: "kheti-pilot",
    date: "2025 · feb",
    title: "Kheti AI pilot launch",
    short:
      "38 farmers, 2 villages, 4 months later. First real users.",
    body: "Workshops on a Saturday in a village hall. Side-loaded an APK on 38 phones. Eight worked first time. The rest needed help.",
    side: "left",
  },
  {
    id: "first-talk",
    date: "2025 · mar",
    title: "First public talk",
    short:
      "Spoke at a regional civic-tech meetup. 80 people, 25 minutes, somehow survived.",
    body: "The Q&A went 40 minutes longer than the talk. Most of the questions were better than my answers.",
    side: "right",
  },
  {
    id: "research-pivot",
    date: "2025 · apr",
    title: "Vidyut research deployment",
    short:
      "First project I shipped while explicitly calling it research — not a pilot.",
    body: "Honesty about state matters. Calling it research bought me permission to fail in public, which is when I started learning faster.",
    side: "left",
  },
  {
    id: "now",
    date: "2025 · may",
    title: "Now",
    short:
      "Five projects, four domains, one strict goal: don't ship a demo.",
    body: "The next 12 months are about depth, not breadth. Pick two projects, push them past pilot.",
    side: "right",
  },
];

export const skillsRadar: SkillAxis[] = [
  { axis: "ML", value: 75 },
  { axis: "Web Dev", value: 82 },
  { axis: "Hardware / IoT", value: 58 },
  { axis: "Research", value: 64 },
  { axis: "Design", value: 70 },
  { axis: "Communication", value: 72 },
];

export const mentors: Mentor[] = [
  { name: "Dr. Anjali Rao", attribution: "Plant pathology, UAS Bangalore — patient supervisor" },
  { name: "Sanjay Pillai", attribution: "Civic-tech engineer, kept E-Waste Mapper from imploding" },
  { name: "Dr. Mehul Shah", attribution: "Public health, gave Triage Saheli its safety thresholds" },
  { name: "Priya Krishnan", attribution: "Designer; taught me confidence ≠ certainty in UI" },
  { name: "Ravi Kumar", attribution: "School maths teacher; first person to call my work serious" },
  { name: "Aditi Banerjee", attribution: "MNRE field engineer who let me near a real microgrid" },
];

export const navLinks = [
  { href: "/", label: "Home", short: "h" },
  { href: "/projects", label: "Projects", short: "p" },
  { href: "/impact", label: "Impact", short: "i" },
  { href: "/journey", label: "Journey", short: "j" },
  { href: "/contact", label: "Contact", short: "c" },
] as const;

export const marqueeKeywords = [
  "edge ml",
  "regional languages",
  "asha workers",
  "smallholder farmers",
  "microgrids",
  "civic tech",
  "on-device",
  "honest projections",
  "kannada-first",
  "one user, then a thousand",
];

export const openTo = [
  "collaborations on AI for Good — especially Indian-context problems",
  "mentorship; I learn fast and listen hard",
  "ideas that scare you a little",
];
