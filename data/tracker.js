// Your revision-plan tracker. Claude updates this file after every test report you paste in chat.
window.TRACKER = {
  updated: "2026-11-07",
  examDate: "2026-11-29",
  targets: { qa: 12, varc: 15, lrdi: 12 },
  goalNote: "QA: attempt 14–15 at about 85% accuracy (12 right + 2 wrong = 34 marks).",

  // status: "Not started" | "In progress" | "Done"
  topics: {
    "percentages": { status: "In progress", score: "Set 1: not sent yet", weak: "Successive % change" },
    "profit-loss": { status: "In progress", score: "Set 1, Set 2 (hard): not sent yet", weak: "Price–demand maximisation" },
    "si-ci": { status: "In progress", score: "Set 2 (7 Nov): 10/12 (L1 3/3, L2 6/6, L3 1/3) in 34:38 vs 28 target · 2 warm-ups skipped (3rd time)", weak: "Equal instalments; CI − SI difference is slow" },
    "ratio": { status: "In progress", score: "Set 1: 15/20 (L1 5/5, L2 6/9, L3 2/6) · L2–3 took 52 min vs 36 target · all 7 wrong ones redone 3 Nov · Fresh check 5 Nov: 4.5/6, missed partnership and coins", weak: "Variation (√n, x²), partnership with mid-year changes, two-case k-method, continued proportion, coins (count vs value)" },
    "mixtures": { status: "In progress", score: "Set 1 (with Averages): 12/20 overall (L1 3/5, L2 4/9, L3 5/6) in 61 min vs 40 target · mixture questions 5/10 · Fresh check 5 Nov: 7/8 in 23 min vs 16 · Two-mixtures drill 5 Nov: 2/2", weak: "Alligation when the mean must be worked out first (cost price after profit, milk fraction); replacement solved for x; water added vs water after" },
    "averages": { status: "In progress", score: "Set 1 (with Mixtures): average questions 7/10 · 13 of 20 questions over target time · Fresh check 5 Nov: overlap and consecutive both right", weak: "Overlapping groups; weighted average of two groups (use alligation); consecutive odd numbers" },
    "tsd": { status: "In progress", score: "Set 1 (5–6 Nov): 11/15 TSD (L1 4/4, L2 5/7, L3 2/4) in 54 min vs 34 target · 2 warm-ups skipped · Fresh check 6 Nov: 5/8 in 32 min vs 18 · Set 2 (races, circular tracks) kept for the weekly review", weak: "Two trains in the same direction; boats from distance and time; '3 hours more' equation; accident / delay" },
    "time-work": { status: "In progress", score: "Set 1 (with pipes, 7 Nov): 11/12 (L1 3/3, L2 6/6, L3 2/3) in 21:40 vs 24 target · 2 warm-ups skipped", weak: "Men and women equivalence (or / and type)" },
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
    { what: "Variation: treated a √n or x² rule as a straight-line rule", found: "Ratio Set 1, Q9, Q20; fresh check 5 Nov: Q1(a) and Q2 right, Q1(b) wrong (answered 9 coaches, max is 10)", fix: "Write the equation with k first (speed = 42 − k√n), find k from the given case, then use it", status: "Practising" },
    { what: "Partnership with money added or withdrawn mid-year", found: "Ratio Set 1, Q10; fresh check 5 Nov Q3 wrong again (answered ₹23,250, answer ₹19,375); TSD fresh check 6 Nov Q2 right (1 of 3)", fix: "Draw a 12-month line; capital × months for each piece, then add", status: "Practising" },
    { what: "Equal ratios (k-method): forgot the second case", found: "Ratio Set 1, Q15; fresh check 5 Nov Q4 right, both values (1 of 3)", fix: "Always check a + b + c = 0 as well; it gives k = −1", status: "Practising" },
    { what: "Continued proportion", found: "Ratio Set 1, Q16; fresh check 5 Nov Q5 right (1 of 3)", fix: "4 terms: d = a × r³. Find r, then b = ar and c = ar²", status: "Practising" },
    { what: "Alligation when the mean must be worked out first", found: "A&M Set 1, Q8, Q10, Q14; fresh check Q2 (two mixtures) wrong again; drill 5 Nov Q7 and Q8 right (2 of 3)", fix: "Get both 'prices' and the mean before the cross: CP = SP ÷ (1 + profit%), milk as a fraction, group averages as prices", status: "Practising" },
    { what: "Overlapping groups: the shared item is counted twice", found: "A&M Set 1, Q2", fix: "Shared item = sum of group 1 + sum of group 2 − total", status: "Practising" },
    { what: "Repeated replacement, solving for x", found: "A&M Set 1, Q20", fix: "Milk left ÷ start = (1 − x/V)ⁿ, then take the nth root", status: "Practising" },
    { what: "Answering a different quantity than asked (total vs added, rounded vs exact)", found: "A&M Set 1, Q5, Q9; TSD Set 1 Q16 (read '3 hours more' as '3 hours'); TSD fresh check Q5 (gave the boat speed 10, asked the stream speed 2)", fix: "Before writing the answer, reread the last line of the question; underline 'more', 'than', 'each', 'total'", status: "Practising" },
    { what: "Speed: too many questions over target time", found: "Ratio Set 1 (Q8 7 min, Q19 9 min); A&M Set 1: 61 min vs 40; Ratio fresh check: 30 min vs 16; TSD Set 1: 54 min vs 34, Q17 13.5 min with no answer; TSD fresh check: 32 min vs 18 (Q6 7.5 min); Time & Work Set 1 (7 Nov): 21.7 min vs 24, first set under target; SI & CI Set 2 (7 Nov): 34.6 min vs 24, Q12 8.6 min", fix: "Leave a question at 3 min; redo slow ones untimed, then timed", status: "Open" },
    { what: "Coins: ratio of values vs ratio of counts", found: "Ratio Set 1, Q7; fresh check 5 Nov Q6 blank after 7 min; TSD fresh check Q1 wrong (110, answer 90)", fix: "Values ratio: split the ₹ first, then ÷ coin value. Counts ratio: value of one set first", status: "Open" },
    { what: "Calculation slips (unit conversion, division)", found: "Ratio Set 1 Q18; A&M Set 1 Q12; TSD Set 1 Q9, Q12; TSD fresh check Q3, Q4 right; SI & CI Set 2 Q14 (12,500 vs 50,000: likely 0.4 × 5,000 written as 500)", fix: "Write every step on paper; before marking, rough-check the size of the answer (300 m at about 3 m/s is about 100 s)", status: "Open" },
    { what: "Accident / delay: slower speed for part of the trip", found: "TSD Set 1, Q17 (blank after 13.5 min); TSD fresh check Q7 right, Q8 wrong (90, answer 60)", fix: "Split the wording into Case 1 and Case 2. Extra per km: speed a/b → extra (b − a)/a of normal time (3/5 → 2/3, 4/5 → 1/4, 2/3 → 1/2). Gap between the two late times = that extra on the shifted km", status: "Practising" }
,
    { what: "Men and women equivalence (or / and type)", found: "Time & Work Set 1, Q14 (answered 21.7, answer 9)", fix: "OR = two equal teams: 12 men = 18 women → 1 man = 1.5 women. Turn everyone into women, then effort ÷ team", status: "Open" },
    { what: "Equal instalments (CI loan repaid in equal parts)", found: "SI & CI Set 2, Q13 (answered 1,230, answer 1,331)", fix: "2 instalments: payment = loan ÷ 2.1 × 1.21 at 10% (÷ 2.2 × 1.44 at 20%). Check with a bank-statement table: it must end at 0", status: "Open" }
  ],

  // Newest first. Redo each after 1, 3 and 7 days in the warm-up.
  errorLog: [
    { date: "7 Nov", where: "SI & CI Set 2, Q14", topic: "SI & CI", reason: "Calculation slip (likely; answered 12,500)", takeaway: "0.44x = 0.4(x + 5,000) = 0.4x + 2,000 → 0.04x = 2,000 → x = 50,000" },
    { date: "7 Nov", where: "SI & CI Set 2, Q13", topic: "SI & CI", reason: "Cause not found yet (answered 1,230)", takeaway: "2,310 ÷ 2.1 = 1,100 → × 1.21 = 1,331. Check: 2,310 → 2,541, pay 1,331 → 1,210 → 1,331, pay → 0" },
    { date: "7 Nov", where: "Time & Work Set 1, Q14", topic: "Time & Work", reason: "Cause not found yet (answered 21.7)", takeaway: "1 man = 1.5 women → 8 men + 16 women = 28 women. Work 18 × 14 = 252 → 252 ÷ 28 = 9 days" },
    { date: "6 Nov", where: "TSD fresh check, Q8", topic: "TSD", reason: "Cause not found yet (answered 90)", takeaway: "4/5 speed → extra 1/4 per km. 15 min saved = 1/4 × normal time for 60 km → 60 min → 60 km/h" },
    { date: "6 Nov", where: "TSD fresh check, Q5", topic: "TSD", reason: "Answered a different quantity (boat speed, not stream)", takeaway: "Down 12, up 8: boat = (12 + 8)/2 = 10, stream = (12 − 8)/2 = 2. Reread the last line" },
    { date: "6 Nov", where: "TSD fresh check, Q1", topic: "Ratio", reason: "Cause not found yet (answered 110)", takeaway: "₹90 as 4 : 3 : 2 → ₹40, ₹30, ₹20 → ÷ ₹2, ₹1, ₹0.50 → 20 + 30 + 40 = 90" },
    { date: "6 Nov", where: "TSD Set 1, Q17", topic: "TSD", reason: "Concept + tricky wording; blank after 13.5 min", takeaway: "50 km more at full speed saves 40 min = 2/3 of those 50 km's normal time → 50 km takes 1 h → 50 km/h" },
    { date: "6 Nov", where: "TSD Set 1, Q16", topic: "TSD", reason: "Question not read properly", takeaway: "'3 hours more' = up time − down time = 3 → b = 9 (6 km/h up: 6 h, 12 km/h down: 3 h)" },
    { date: "6 Nov", where: "TSD Set 1, Q12", topic: "TSD", reason: "Calculation slip", takeaway: "Turn distance + time into speeds first: down 15, up 10 → boat (15 + 10)/2 = 12.5" },
    { date: "6 Nov", where: "TSD Set 1, Q9", topic: "TSD", reason: "Calculation slip", takeaway: "Same direction: 10 km/h = 25/9 m/s; 300 ÷ 25/9 = 108 s" },
    { date: "5 Nov", where: "Ratio fresh check, Q6", topic: "Ratio", reason: "Left blank after 7 min", takeaway: "Values 1 : 2 : 3 → ₹30, ₹60, ₹90 → ÷ ₹1, ₹0.50, ₹0.25 → 30 + 120 + 360 = 510" },
    { date: "5 Nov", where: "Ratio fresh check, Q3", topic: "Ratio", reason: "Concept (likely counted Q's ₹40,000 for 6 months, not 3)", takeaway: "Q joins after month 3: 40k × 3 + 30k × 6 = 3.0L vs P 4.2L → 7 : 5 → ₹19,375" },
    { date: "5 Nov", where: "Ratio fresh check, Q1(b)", topic: "Ratio", reason: "Boundary slip (answered 9)", takeaway: "Plug in: 10 coaches → 60 − 50 = 10 km/h, still moves; 11 → 60 − 60.5 < 0, stops. Max 10" },
    { date: "5 Nov", where: "A&M Fresh check, Q2", topic: "Mixtures", reason: "Concept (two mixtures, answered 1:1)", takeaway: "Milk fractions over one denominator: 5/8, 2/8, mean 4/8 → P : Q = (4 − 2) : (5 − 4) = 2 : 1" },
    { date: "4 Nov", where: "A&M Set 1, Q20", topic: "Mixtures", reason: "Left blank after 1 min", takeaway: "Work backwards: (1 − x/60)² = 38.4/60 = 0.64 → 0.8 → x = 12" },
    { date: "4 Nov", where: "A&M Set 1, Q14", topic: "Mixtures", reason: "Left blank after 5.5 min", takeaway: "Remove the profit first: CP = 286/1.1 = 260; cross → 40 : 60 = 2 : 3" },
    { date: "4 Nov", where: "A&M Set 1, Q12", topic: "Averages", reason: "Calculation slip (likely stepped by 1)", takeaway: "Odd numbers go up in 2s: 33 is the 4th of 7, so 33 + 3 × 2 = 39" },
    { date: "4 Nov", where: "A&M Set 1, Q10", topic: "Mixtures", reason: "Left blank after 6.5 min", takeaway: "Milk fractions 3/4 and 3/8, mean 1/2 on the cross → 1/8 : 1/4 = 1 : 2" },
    { date: "4 Nov", where: "A&M Set 1, Q9", topic: "Mixtures", reason: "Rounded (58 vs 58.32)", takeaway: "TITA needs the exact value: 80 × 0.9³ = 58.32" },
    { date: "4 Nov", where: "A&M Set 1, Q8", topic: "Averages", reason: "Left blank after 3.5 min", takeaway: "Weighted average = alligation: boys : girls = (80 − 75) : (75 − 72) = 5 : 3 → 15 girls" },
    { date: "4 Nov", where: "A&M Set 1, Q5", topic: "Mixtures", reason: "Misread the ask (likely)", takeaway: "Milk stays 48 L → total 64 L → add 4 L. 16 L is the water after, not the water added" },
    { date: "4 Nov", where: "A&M Set 1, Q2", topic: "Averages", reason: "Cause not found (answered 18)", takeaway: "First 6 + last 6 = 606 counts the 6th twice: 606 − 550 = 56" },
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
      { date: "2026-11-05", text: "Averages + Mixtures & alligation: Set 1 12/20 in 61 min (done 4 Nov), fresh check 7/8 in 23 min", done: true },
      { date: "2026-11-06", text: "Time-Speed-Distance 1: relative speed, trains, boats & streams. Set 1 done: 11/15 TSD in 54 min; fresh check 5/8 in 32 min", done: true },
      { date: "2026-11-07", text: "Time & Work notes + Set 1 done: 11/12 in 21:40 vs 24. SI & CI notes + Set 2 done: 10/12 in 34:38 vs 28", done: true },
      { date: "2026-11-08", text: "Time & Work set + weekly review: redo this week's error log", done: false },
      { date: "2026-11-09", text: "Arithmetic PYQ day: mixed past CAT questions (incl. P&L, %, SI & CI) + Arithmetic sectional, then fix the weakest types", done: false }
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
