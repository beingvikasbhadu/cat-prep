// Your revision-plan tracker. Claude updates this file after every test report you paste in chat.
window.TRACKER = {
  updated: "2026-11-04",
  examDate: "2026-11-29",
  targets: { qa: 12, varc: 15, lrdi: 12 },
  goalNote: "QA: attempt 14–15 at about 85% accuracy (12 right + 2 wrong = 34 marks).",

  // status: "Not started" | "In progress" | "Done"
  topics: {
    "percentages": { status: "In progress", score: "Set 1: not sent yet", weak: "Successive % change" },
    "profit-loss": { status: "In progress", score: "Set 1, Set 2 (hard): not sent yet", weak: "Price–demand maximisation" },
    "si-ci": { status: "Not started", score: "Set 1 given 3 Nov", weak: "" },
    "ratio": { status: "In progress", score: "Set 1: 15/20 (L1 5/5, L2 6/9, L3 2/6) · L2–3 took 52 min vs 36 target · all 7 wrong ones redone 3 Nov", weak: "Variation (√n, x²), partnership with mid-year changes, two-case k-method, continued proportion, coins (count vs value)" },
    "mixtures": { status: "Not started", score: "Set 1 (with Averages) given 3 Nov", weak: "" },
    "averages": { status: "Not started", score: "Set 1 (with Mixtures) given 3 Nov", weak: "" },
    "tsd": { status: "Not started", score: "", weak: "" },
    "time-work": { status: "Not started", score: "", weak: "" },
    "equations": { status: "Not started", score: "", weak: "" },
    "inequalities": { status: "Not started", score: "", weak: "" },
    "functions": { status: "Not started", score: "", weak: "" },
    "logs": { status: "Not started", score: "", weak: "" },
    "progressions": { status: "Not started", score: "", weak: "" },
    "triangles": { status: "Not started", score: "", weak: "" },
    "circles": { status: "Not started", score: "", weak: "" },
    "mensuration": { status: "Not started", score: "", weak: "" },
    "number-system": { status: "Not started", score: "", weak: "" },
    "pnc": { status: "Not started", score: "", weak: "" },
    "sets": { status: "Not started", score: "", weak: "" }
  },

  // status: "Open" | "Practising" | "Fixed" (Fixed = 3 fresh questions of that type right in a row)
  weaknesses: [
    { what: "Price–demand maximisation: profit = (a + x)(b − x)", found: "P&L Set 2, Q15", fix: "Find where each bracket becomes 0; the maximum is halfway between. Drill P1–P3", status: "Open" },
    { what: "Successive % change: stopped at the ab/100 term", found: "Percentages Set 1, Q1(b)", fix: "100 method: 100 → 120 → 108, so the net change is +8%", status: "Open" },
    { what: "Variation: treated a √n or x² rule as a straight-line rule", found: "Ratio Set 1, Q9, Q20", fix: "Write the equation with k first (speed = 42 − k√n), find k from the given case, then use it", status: "Practising" },
    { what: "Partnership with money added or withdrawn mid-year", found: "Ratio Set 1, Q10", fix: "Draw a 12-month line; capital × months for each piece, then add", status: "Practising" },
    { what: "Equal ratios (k-method): forgot the second case", found: "Ratio Set 1, Q15", fix: "Always check a + b + c = 0 as well; it gives k = −1", status: "Practising" },
    { what: "Continued proportion", found: "Ratio Set 1, Q16", fix: "4 terms: d = a × r³. Find r, then b = ar and c = ar²", status: "Practising" },
    { what: "Speed: 8 of 15 questions over target time", found: "Ratio Set 1 (Q8 7 min, Q19 9 min)", fix: "Leave a question at 3 min; redo slow ones untimed, then timed", status: "Open" }
  ],

  // Newest first. Redo each after 1, 3 and 7 days in the warm-up.
  errorLog: [
    { date: "3 Nov", where: "Ratio Set 1, Q20", topic: "Ratio", reason: "Concept", takeaway: "Fall ∝ √n, not a fixed amount per wagon: 18 = 3k, k = 6; 6√n = 42 → n = 49, so max 48" },
    { date: "3 Nov", where: "Ratio Set 1, Q18", topic: "Ratio", reason: "Calculation slip (likely)", takeaway: "4 + 9 + 25 = 38, not 48: value 38,000, loss ₹62,000" },
    { date: "3 Nov", where: "Ratio Set 1, Q16", topic: "Ratio", reason: "Cause not found; redone right 3 Nov", takeaway: "r³ = 192/3 = 64, r = 4; b = 12, c = 48 → 60" },
    { date: "3 Nov", where: "Ratio Set 1, Q15", topic: "Ratio", reason: "Concept (trap)", takeaway: "Equal ratios: case a + b + c = 0 gives k = −1, so (c)" },
    { date: "3 Nov", where: "Ratio Set 1, Q10", topic: "Ratio", reason: "Cause not found; redone right 3 Nov", takeaway: "Capital × months per piece: A 4.2L, B 4.8L → 7:8 → B ₹20,800" },
    { date: "3 Nov", where: "Ratio Set 1, Q9", topic: "Ratio", reason: "Cause not found; redone right 3 Nov", takeaway: "y = kx²/z: find k = 6 first, then put in x = 4, z = 6 → 16" },
    { date: "3 Nov", where: "Ratio Set 1, Q7", topic: "Ratio", reason: "Concept", takeaway: "Coins: the ratio is the count. One set = ₹10, 21 sets, so 6 × 21 = 126. A coin count is never 10.5" },
    { date: "2 Nov", where: "Percentages Set 1, Q1(b)", topic: "Percentages", reason: "Formula misapplied", takeaway: "Net change = a + b + ab/100, all three terms" },
    { date: "2 Nov", where: "P&L Set 2, Q15", topic: "Profit & Loss", reason: "Concept", takeaway: "Write profit per unit (price − cost), not the price" }
  ],

  calendar: [
    { block: "Arithmetic", items: [
      { date: "2026-11-03", text: "Ratio, proportion & partnership Set 1, Levels 2–3: done, 8/15 in 52 min", done: true },
      { date: "2026-11-04", text: "Diagnostic: one past CAT QA section (22 Qs, 40 min) + analysis, then SI & CI set 1", done: false },
      { date: "2026-11-05", text: "Averages + Mixtures & alligation", done: false },
      { date: "2026-11-06", text: "Time-Speed-Distance 1: relative speed, trains, boats & streams", done: false },
      { date: "2026-11-07", text: "Time-Speed-Distance 2: races, circular tracks + Time & Work (pipes, efficiency)", done: false },
      { date: "2026-11-08", text: "Arithmetic PYQ day: 30 mixed past CAT questions + Arithmetic sectional (15 Qs, 30 min)", done: false },
      { date: "2026-11-09", text: "Fix the 3 weakest arithmetic types on the weakness board", done: false }
    ]},
    { block: "Algebra", items: [
      { date: "2026-11-10", text: "Linear + quadratic equations", done: false },
      { date: "2026-11-11", text: "Inequalities & modulus", done: false },
      { date: "2026-11-12", text: "Functions & graphs (standard types only)", done: false },
      { date: "2026-11-13", text: "Logs, surds, indices", done: false },
      { date: "2026-11-14", text: "Progressions + Algebra sectional (15 Qs, 30 min)", done: false },
      { date: "2026-11-15", text: "Full mock 1 + analysis", done: false }
    ]},
    { block: "Geometry, Number System, Modern Math", items: [
      { date: "2026-11-16", text: "Triangles + Circles", done: false },
      { date: "2026-11-17", text: "Polygons, Mensuration, basic coordinate geometry", done: false },
      { date: "2026-11-18", text: "Number System", done: false },
      { date: "2026-11-19", text: "P&C, Probability, Sets (basics only)", done: false },
      { date: "2026-11-20", text: "Mixed sectional on 16–19 Nov topics + fix mistakes", done: false }
    ]},
    { block: "Mocks and weak areas", items: [
      { date: "2026-11-21", text: "Full mock 2 + analysis", done: false },
      { date: "2026-11-22", text: "Weekly review: fix the top 3 weaknesses + 20 arithmetic PYQs", done: false },
      { date: "2026-11-23", text: "QA sectional (22 Qs, 40 min) + analysis", done: false },
      { date: "2026-11-24", text: "Full mock 3 + analysis", done: false },
      { date: "2026-11-25", text: "Fix the weaknesses from mock 3 + redo the error log", done: false },
      { date: "2026-11-26", text: "Full mock 4 at your exam-slot time + analysis", done: false },
      { date: "2026-11-27", text: "Formula sheet + full error log + one easy set for confidence", done: false },
      { date: "2026-11-28", text: "Rest. Formula sheet only, no new questions, sleep early", done: false },
      { date: "2026-11-29", text: "CAT 2026", done: false }
    ]}
  ]
};
