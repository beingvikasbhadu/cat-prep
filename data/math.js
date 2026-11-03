// Quick-revision notes for every QA topic. Each topic: key ideas, worked examples (try first, then reveal), traps.
// weight = approximate questions per CAT slot for the topic's group (from memory of public slot analyses, not looked up).
window.MATH_BLOCKS = [
  { id: "arithmetic", name: "Arithmetic", note: "The main scoring area: aim for 6 of its ~8 questions." },
  { id: "algebra", name: "Algebra", note: "Aim for 4 of ~7: equations, inequalities, logs, progressions." },
  { id: "geometry", name: "Geometry & Mensuration", note: "Know the core results; solve the direct questions." },
  { id: "number", name: "Number System", note: "Remainders, factors, HCF/LCM: about 2 questions." },
  { id: "modern", name: "Modern Math", note: "Basics only, for one bonus question." }
];

window.MATH = [
  {
    id: "percentages", name: "Percentages", block: "arithmetic", weight: "~3 Qs with P&L and SI/CI", priority: "Must-do",
    summary: "Percent means 'out of 100'. Almost every CAT percentage question is really about multipliers.",
    ideas: [
      { t: "Use multipliers", d: "+20% means × 1.2. −15% means × 0.85. For several changes, multiply them one after another." },
      { t: "Successive change", d: "a% then b%: net change = a + b + ab/100. Example: +20 then −10 → 20 − 10 − 2 = +8%. Use all three terms." },
      { t: "The 100 method", d: "Start at 100 and apply each change. 100 → 120 → 108 shows +8% straight away, with no formula." },
      { t: "'More than' vs 'less than'", d: "If A is r% more than B, then B is r/(100 + r) × 100 % less than A. 25% more → 20% less." },
      { t: "Price and consumption", d: "If the price rises r%, consumption must fall r/(100 + r) × 100 % to keep spending the same. Same formula as above." },
      { t: "Fractions you must know", d: "1/3 = 33.33%, 1/6 = 16.67%, 1/7 = 14.28%, 1/8 = 12.5%, 1/9 = 11.11%, 1/11 = 9.09%, 1/12 = 8.33%." },
      { t: "Points vs percent", d: "10% → 12% is a rise of 2 percentage points, but a 20% rise." }
    ],
    examples: [
      { q: "A shirt's price goes up 20% and then comes down 20%. What is the net change?", steps: ["Start at 100.", "Up 20%: 100 → 120.", "Down 20% of 120 = 24: 120 → 96."], a: "4% decrease (not 0%)" },
      { q: "The price of rice rises 25%. By what % must a family cut its consumption to spend the same?", steps: ["Use r/(100 + r) × 100.", "25/125 × 100 = 20."], a: "20%" }
    ],
    traps: ["Dropping the ab/100 term in successive change.", "Taking the % on the wrong base: 'more than B' means B is the base.", "Mixing up percentage points and percent."],
    testId: "percentages-1"
  },
  {
    id: "profit-loss", name: "Profit & Loss", block: "arithmetic", weight: "~3 Qs with Percentages and SI/CI", priority: "Must-do",
    summary: "Profit % is always on the cost price. Discount is always on the marked price.",
    ideas: [
      { t: "Profit on CP", d: "SP = CP × (1 + p/100). A 25% profit means SP = 1.25 × CP. To go back, divide by 1.25." },
      { t: "Markup and discount", d: "MP = CP × (1 + m/100), SP = MP × (1 − d/100). Profit % = m − d − md/100." },
      { t: "Successive discounts", d: "d1 then d2 = one discount of d1 + d2 − d1·d2/100. 20% then 10% = 28%." },
      { t: "Same SP, x% profit on one, x% loss on the other", d: "Always an overall loss of x²/100 %. 20% each way → 4% loss." },
      { t: "False weights", d: "Profit % = (true weight − false weight)/false weight × 100. 900 g for 1 kg → 100/900 = 11.11%." },
      { t: "Buy n, get m free", d: "Discount = m/(n + m) × 100. Buy 3 get 1 free = 25% off." },
      { t: "Price–demand maximum", d: "Profit = (margin + x)(units − kx). Find where each bracket is 0; the best x is halfway between those two values." }
    ],
    examples: [
      { q: "CP ₹500, marked 40% above CP, then sold at a 20% discount. Profit %?", steps: ["MP = 700.", "SP = 700 × 0.8 = 560.", "Profit = 60 on 500 = 12%. (Formula: 40 − 20 − 8 = 12.)"], a: "12%" },
      { q: "A shop sells 100 items a day at ₹20 each; each costs ₹10. Every ₹1 price rise loses 2 sales. What price gives the most profit?", steps: ["Raise the price by x: margin = 10 + x, sales = 100 − 2x.", "Profit = (10 + x)(100 − 2x). Brackets are 0 at x = −10 and x = 50.", "Best x = halfway = 20, so price = ₹40. Profit = 30 × 60 = ₹1,800."], a: "₹40 (profit ₹1,800)" }
    ],
    traps: ["Taking profit % on SP instead of CP.", "Taking discount on CP instead of MP.", "Writing price instead of margin (price − cost) in price–demand questions."],
    testId: "profit-loss-1"
  },
  {
    id: "si-ci", name: "SI & CI", block: "arithmetic", weight: "~3 Qs with Percentages and P&L", priority: "Must-do",
    summary: "Simple interest grows by the same amount every year. Compound interest is just successive % change.",
    ideas: [
      { t: "Simple interest", d: "SI = P × R × T / 100. It doubles when R × T = 100." },
      { t: "Compound interest", d: "Amount = P(1 + r/100)ⁿ. CI = Amount − P." },
      { t: "CI as % change", d: "10% for 2 years = 21% total; 10% for 3 years = 33.1% total." },
      { t: "CI − SI", d: "2 years: P(r/100)². 3 years: P(r/100)²(3 + r/100)." },
      { t: "Half-yearly / quarterly", d: "Half-yearly: rate ÷ 2, periods × 2. Quarterly: rate ÷ 4, periods × 4." },
      { t: "Consecutive amounts", d: "Amount after year n+1 ÷ amount after year n = 1 + r/100." },
      { t: "Multiples at CI", d: "If money doubles in t years, it becomes 4× in 2t, 8× in 3t." },
      { t: "Equal instalments", d: "Bring each instalment back to today: x/(1 + r) + x/(1 + r)² = P (r as a decimal)." }
    ],
    examples: [
      { q: "CI − SI on ₹5,000 for 2 years at 10%?", steps: ["Use P(r/100)².", "5,000 × 0.1 × 0.1 = 50."], a: "₹50" },
      { q: "At 10% CI, an amount becomes ₹1,210 after 2 years. What was the principal?", steps: ["1.1² = 1.21.", "1,210 / 1.21 = 1,000."], a: "₹1,000" }
    ],
    traps: ["Using the SI formula for CI.", "Not halving the rate for half-yearly.", "Thinking each instalment is P/n."],
    testId: "si-ci-1"
  },
  {
    id: "ratio", name: "Ratio, Proportion & Partnership", block: "arithmetic", weight: "~3 Qs with Mixtures and Averages", priority: "Must-do",
    summary: "Write every ratio with a multiplier k. Most questions then become one simple equation.",
    ideas: [
      { t: "k-method", d: "A : B = 3 : 5 → A = 3k, B = 5k." },
      { t: "Joining ratios", d: "Make the common term equal. A:B = 2:3 and B:C = 4:5 → 8:12:15." },
      { t: "Fractions to ratio", d: "2A = 3B = 4C → A : B : C = 1/2 : 1/3 : 1/4 = 6 : 4 : 3 (multiply by 12)." },
      { t: "Equal ratios: two cases", d: "a/(b+c) = b/(c+a) = c/(a+b) = k. If a + b + c ≠ 0, k = ½. If a + b + c = 0, k = −1. Always check both." },
      { t: "Variation", d: "'y varies as x²/z' means y = kx²/z. Find k from the given case first. 'Drop varies as √n' means drop = k√n, not a fixed amount per item." },
      { t: "Proportionals", d: "Mean proportional of a and b = √(ab). Third proportional to a and b = b²/a. Four terms in continued proportion: d = a × r³." },
      { t: "Partnership", d: "Profit is shared in the ratio capital × months. When money is added or withdrawn, draw a 12-month line and add each piece. A working partner's salary comes out first." },
      { t: "Coins", d: "If the ratio is of the number of coins, find the value of one 'set' first. A count can never be a fraction." }
    ],
    examples: [
      { q: "A:B = 2:3 and B:C = 4:5. Find A:B:C.", steps: ["Make B the same: 2:3 → 8:12 and 4:5 → 12:15.", "A:B:C = 8:12:15."], a: "8 : 12 : 15" },
      { q: "A stone's price varies as the square of its weight. A ₹1,000 stone breaks into two pieces with weights in the ratio 1:4. What is the loss?", steps: ["Weights 1 and 4, total 5, so the whole stone is worth k × 25 = 1,000 → k = 40.", "Pieces: 40 × 1 + 40 × 16 = 680.", "Loss = 1,000 − 680."], a: "₹320" }
    ],
    traps: ["Coins: treating the count ratio as a value ratio.", "Equal ratios: forgetting the a + b + c = 0 case.", "Partnership: using capital only, without months.", "Variation: treating a √ or square rule as linear."],
    testId: "ratio-1"
  },
  {
    id: "mixtures", name: "Mixtures & Alligation", block: "arithmetic", weight: "~3 Qs with Ratio and Averages", priority: "Must-do",
    summary: "Alligation is a see-saw: the mix balances between the two things you mix.",
    ideas: [
      { t: "The cross", d: "Cheap : dear = (dear − mean) : (mean − cheap). ₹40 and ₹55 to get ₹45 → 10 : 5 = 2 : 1." },
      { t: "Sense check", d: "The mean sits closer to the item you have more of." },
      { t: "Works for any average", d: "Prices, % profit, % milk, marks, speeds. A loss counts as a negative %." },
      { t: "Water costs ₹0", d: "Put water at 0 on the cross. Put the COST price of the mixture in the middle: divide out the profit first." },
      { t: "Mixing two mixtures", d: "Use the fraction of milk in each as the 'price'. Give them a common denominator." },
      { t: "Pouring equal vessels together", d: "Convert each ratio to fractions and add. Never add the ratio numbers." },
      { t: "Adding water", d: "The milk stays the same. Work from the milk." },
      { t: "Repeated replacement", d: "Milk left = V × (1 − x/V)ⁿ, where x is taken out and refilled with water n times." }
    ],
    examples: [
      { q: "Milk costs ₹40/L. A milkman adds water and sells at ₹40/L, making 25% profit. Water : milk?", steps: ["Cost of 1 L of mixture = 40 / 1.25 = ₹32.", "Cross: water 0, milk 40, mean 32.", "Water : milk = (40 − 32) : (32 − 0) = 8 : 32."], a: "1 : 4" },
      { q: "50 L of pure milk. 5 L is taken out and replaced with water, twice. How much milk is left?", steps: ["Each time 5/50 = 1/10 of the milk goes, so 0.9 stays.", "50 × 0.9 × 0.9."], a: "40.5 L" }
    ],
    traps: ["Putting the selling price in the middle of the cross.", "Adding ratio numbers when pouring vessels together.", "Answering milk : water when asked water : milk."],
    testId: "averages-mixtures-1"
  },
  {
    id: "averages", name: "Averages", block: "arithmetic", weight: "~3 Qs with Ratio and Mixtures", priority: "Must-do",
    summary: "Work with totals, not averages. Total = average × count.",
    ideas: [
      { t: "Totals", d: "Turn every average into a total, do the adding or subtracting, then divide back." },
      { t: "Someone joins", d: "New member = new average + old count × change in average." },
      { t: "Replacement", d: "New person = old person + count × rise in average." },
      { t: "Overlapping groups", d: "First 5 + last 5 of 9 numbers counts the 5th twice: 5th = sum of both groups − total." },
      { t: "Consecutive numbers / AP", d: "Average = middle term = (first + last)/2." },
      { t: "Ages", d: "In t years, a group of n people adds n × t to its total age." },
      { t: "Largest possible value", d: "To make one number as big as possible, make all the others as small as the rules allow." },
      { t: "Average speed", d: "Same distance at a and b: 2ab/(a + b). Same time at a and b: (a + b)/2." }
    ],
    examples: [
      { q: "A class of 20 averages 50. A new student joins and the average becomes 51. The new student's marks?", steps: ["New student = 51 + 20 × 1."], a: "71" },
      { q: "9 numbers average 20. The first 5 average 18 and the last 5 average 23. Find the 5th number.", steps: ["Totals: 180 for all 9, 90 for the first 5, 115 for the last 5.", "5th = 90 + 115 − 180."], a: "25" }
    ],
    traps: ["Averaging averages of groups with different sizes.", "Average speed as (a + b)/2 for equal distances.", "Forgetting that 'different' numbers can't repeat."],
    testId: "averages-mixtures-1"
  },
  {
    id: "tsd", name: "Time, Speed & Distance", block: "arithmetic", weight: "~2 Qs with Time & Work", priority: "Must-do",
    summary: "Distance = speed × time. Most questions are about relative speed or ratios.",
    ideas: [
      { t: "Units", d: "km/h × 5/18 = m/s. m/s × 18/5 = km/h. 72 km/h = 20 m/s." },
      { t: "Ratios", d: "Same distance: speed ∝ 1/time. Same time: distance ∝ speed." },
      { t: "Relative speed", d: "Same direction: subtract the speeds. Opposite directions: add them." },
      { t: "Trains", d: "Passing a pole or person: distance = train length. Passing a platform: train + platform. Two trains: sum of lengths ÷ relative speed." },
      { t: "Boats and streams", d: "Downstream = b + s, upstream = b − s. b = (down + up)/2, s = (down − up)/2." },
      { t: "Meeting", d: "Moving towards each other: time to meet = distance ÷ (a + b). If after meeting they take t1 and t2 to finish: a/b = √(t2/t1)." },
      { t: "Races", d: "'A beats B by x m in an L m race' means when A runs L, B runs L − x, so their speeds are in the ratio L : (L − x)." },
      { t: "Circular track", d: "Opposite directions: they meet every L/(a + b). Same direction: every L/(a − b). First meeting at the start = LCM of their lap times." }
    ],
    examples: [
      { q: "A 200 m train at 72 km/h passes a 300 m platform. How long does it take?", steps: ["72 km/h = 20 m/s.", "Distance = 200 + 300 = 500 m.", "500 / 20 = 25."], a: "25 seconds" },
      { q: "A boat goes 24 km downstream in 2 h and comes back in 3 h. Speed of the stream?", steps: ["Down = 12 km/h, up = 8 km/h.", "Stream = (12 − 8)/2."], a: "2 km/h (boat 10 km/h)" }
    ],
    traps: ["Mixing km/h and m/s.", "Average speed as the simple mean.", "Forgetting to add both lengths when trains cross."]
  },
  {
    id: "time-work", name: "Time & Work", block: "arithmetic", weight: "~2 Qs with TSD", priority: "Must-do",
    summary: "Take the total work as the LCM of the days. Then everything is whole-number rates.",
    ideas: [
      { t: "LCM method", d: "A takes 10 days, B 15 days. Work = 30 units. A does 3/day, B 2/day. Together 5/day → 6 days." },
      { t: "Efficiency", d: "Efficiency is the inverse of time. Twice as efficient = half the time." },
      { t: "Man-days", d: "M1 × D1 × H1 / W1 = M2 × D2 × H2 / W2 (men, days, hours, work)." },
      { t: "Pipes", d: "A filling pipe adds units; an emptying pipe or leak subtracts them." },
      { t: "Alternate days", d: "Work in 2-day cycles, then check the last part carefully: it may finish mid-cycle." },
      { t: "Wages", d: "Share wages in the ratio of work done, not days present." },
      { t: "Someone leaves", d: "Add up each person's work separately for the days they actually worked." }
    ],
    examples: [
      { q: "A can do a job in 12 days and B in 18 days. Together?", steps: ["Work = 36 units. A = 3/day, B = 2/day.", "Together 5/day → 36/5."], a: "7.2 days" },
      { q: "Pipe A fills a tank in 6 h; pipe B empties it in 9 h. Both are open. Time to fill?", steps: ["Tank = 18 units. A +3/h, B −2/h.", "Net +1/h → 18 h."], a: "18 hours" }
    ],
    traps: ["Adding the days instead of the rates.", "Splitting wages by days instead of work.", "Getting the last cycle wrong in alternate-day questions."]
  },
  {
    id: "equations", name: "Linear & Quadratic Equations", block: "algebra", weight: "~4 Qs with Inequalities", priority: "Must-do",
    summary: "Most CAT equation questions test the sum and product of roots, or whole-number solutions.",
    ideas: [
      { t: "Two linear equations", d: "Solve by elimination. a1/a2 ≠ b1/b2: one solution. a1/a2 = b1/b2 ≠ c1/c2: none. All equal: infinitely many." },
      { t: "Sum and product of roots", d: "For ax² + bx + c = 0: sum = −b/a, product = c/a." },
      { t: "Discriminant", d: "D = b² − 4ac. D > 0: two real roots. D = 0: equal roots. D < 0: no real roots." },
      { t: "Building an equation", d: "x² − (sum)x + (product) = 0." },
      { t: "Signs of roots", d: "Product > 0: same sign. Then the sum's sign tells you which." },
      { t: "Whole-number solutions", d: "For 3x + 5y = 47: find one solution, then step x by 5 and y by 3 in opposite directions." },
      { t: "Max or min of a quadratic", d: "At x = −b/(2a)." }
    ],
    examples: [
      { q: "Solve x² − 7x + 10 = 0.", steps: ["Two numbers with sum 7 and product 10: 2 and 5."], a: "x = 2 or 5" },
      { q: "How many positive whole-number solutions does 3x + 5y = 47 have?", steps: ["y = 1 → x = 14.", "Step: (14, 1), (9, 4), (4, 7). Next x = −1 is not allowed."], a: "3" }
    ],
    traps: ["Dividing both sides by a variable that could be 0.", "Forgetting negative roots.", "Counting 0 as a positive number."]
  },
  {
    id: "inequalities", name: "Inequalities & Modulus", block: "algebra", weight: "~4 Qs with Equations", priority: "Must-do",
    summary: "Treat |x − a| as the distance from a, and draw a number line for every inequality.",
    ideas: [
      { t: "Flipping", d: "Multiplying or dividing by a negative number flips the sign." },
      { t: "Quadratic inequality", d: "(x − a)(x − b) < 0 → x is between a and b. > 0 → x is outside them." },
      { t: "Wavy curve", d: "Mark the critical points; signs alternate, starting with + on the far right (for simple factors)." },
      { t: "Modulus as distance", d: "|x − a| < k → a − k < x < a + k. |x − a| > k → x < a − k or x > a + k." },
      { t: "Sum of distances", d: "|x − a| + |x − b| is smallest (= |a − b|) for any x between a and b." },
      { t: "AM ≥ GM", d: "For positive a, b: (a + b)/2 ≥ √(ab). The minimum of x + 1/x for x > 0 is 2." },
      { t: "No blind cross-multiplying", d: "Don't cross-multiply when you don't know the sign of the denominator." }
    ],
    examples: [
      { q: "Solve x² − 5x + 6 < 0.", steps: ["(x − 2)(x − 3) < 0.", "Less than 0 → between the roots."], a: "2 < x < 3" },
      { q: "How many whole numbers x satisfy |x − 3| ≤ 4?", steps: ["−4 ≤ x − 3 ≤ 4 → −1 ≤ x ≤ 7.", "Count −1 to 7."], a: "9" }
    ],
    traps: ["Not flipping the sign for a negative multiplier.", "Cross-multiplying with an unknown sign.", "Solving only one case of a modulus."]
  },
  {
    id: "functions", name: "Functions & Graphs", block: "algebra", weight: "~3 Qs with Logs and Progressions", priority: "Good-to-do",
    summary: "Standard types only: composition, domain, graph shifts and simple functional equations.",
    ideas: [
      { t: "Composition", d: "f(g(x)): put g(x) inside f. Order matters." },
      { t: "Domain", d: "No division by 0, no square root of a negative, logs only of positive numbers." },
      { t: "Even and odd", d: "Even: f(−x) = f(x), symmetric about the y-axis. Odd: f(−x) = −f(x)." },
      { t: "Graph shifts", d: "f(x) + k: up by k. f(x − k): right by k. −f(x): flip over the x-axis. |f(x)|: the part below the x-axis flips up." },
      { t: "max and min", d: "For max(f, g), draw both graphs and take the upper one; for min, the lower one." },
      { t: "Functional equations", d: "Try x = 0, 1, −1, or replace x with 1/x." },
      { t: "Inverse", d: "Swap x and y, then solve for y." }
    ],
    examples: [
      { q: "f(x) = 2x + 3 and g(x) = x². Find f(g(2)) and g(f(2)).", steps: ["g(2) = 4, f(4) = 11.", "f(2) = 7, g(7) = 49."], a: "11 and 49" },
      { q: "Domain of √(x − 2) / (x − 5)?", steps: ["Need x − 2 ≥ 0 → x ≥ 2.", "Need x ≠ 5."], a: "x ≥ 2, x ≠ 5" }
    ],
    traps: ["Doing the composition in the wrong order.", "Forgetting a domain exclusion."]
  },
  {
    id: "logs", name: "Logs, Surds & Indices", block: "algebra", weight: "~3 Qs with Functions and Progressions", priority: "Must-do",
    summary: "Make the bases the same, then compare the powers.",
    ideas: [
      { t: "Index rules", d: "aᵐ·aⁿ = aᵐ⁺ⁿ, aᵐ/aⁿ = aᵐ⁻ⁿ, (aᵐ)ⁿ = aᵐⁿ, a⁰ = 1, a⁻ⁿ = 1/aⁿ." },
      { t: "Same base", d: "4ˣ = 8 → 2²ˣ = 2³ → x = 1.5." },
      { t: "What a log means", d: "log_a b = c means aᶜ = b." },
      { t: "Log rules", d: "log(mn) = log m + log n. log(m/n) = log m − log n. log(mᵏ) = k log m." },
      { t: "Change of base", d: "log_a b = log b / log a, so log_a b × log_b a = 1." },
      { t: "Log domain", d: "Only positive numbers have logs; the base must be positive and not 1. Check answers against this." },
      { t: "Surds", d: "1/(√a + √b) = (√a − √b)/(a − b). Compare surds by raising both to the same power." },
      { t: "Values to know", d: "log₁₀ 2 ≈ 0.301, log₁₀ 3 ≈ 0.477." }
    ],
    examples: [
      { q: "log₂ 8 + log₃ 81 = ?", steps: ["2³ = 8 → 3.", "3⁴ = 81 → 4."], a: "7" },
      { q: "Solve 9ˣ = 27.", steps: ["3²ˣ = 3³.", "2x = 3."], a: "x = 1.5" }
    ],
    traps: ["log(m + n) is NOT log m + log n.", "Not checking log answers against the domain."]
  },
  {
    id: "progressions", name: "Progressions", block: "algebra", weight: "~3 Qs with Functions and Logs", priority: "Must-do",
    summary: "AP: add the same number. GP: multiply by the same number. Count the terms carefully.",
    ideas: [
      { t: "AP basics", d: "nth term = a + (n − 1)d. Sum = n/2 × (first + last)." },
      { t: "Number of terms", d: "n = (last − first)/d + 1." },
      { t: "Three terms in AP", d: "Take them as a − d, a, a + d. The average is the middle term." },
      { t: "GP basics", d: "nth term = arⁿ⁻¹. Sum = a(rⁿ − 1)/(r − 1). Infinite sum = a/(1 − r), only when |r| < 1." },
      { t: "Three terms in GP", d: "Take them as a/r, a, ar. b² = ac." },
      { t: "Standard sums", d: "1 + … + n = n(n + 1)/2. Squares: n(n + 1)(2n + 1)/6. Cubes: [n(n + 1)/2]²." },
      { t: "AM ≥ GM ≥ HM", d: "For positive numbers, with equality only when all are equal." }
    ],
    examples: [
      { q: "Sum of all 2-digit multiples of 7?", steps: ["14, 21, …, 98: n = (98 − 14)/7 + 1 = 13.", "Sum = 13/2 × (14 + 98) = 13 × 56."], a: "728" },
      { q: "8 + 4 + 2 + 1 + … forever = ?", steps: ["a = 8, r = ½.", "8 / (1 − ½)."], a: "16" }
    ],
    traps: ["Counting terms as (last − first)/d without the +1.", "Using the infinite GP sum when |r| ≥ 1."]
  },
  {
    id: "triangles", name: "Triangles", block: "geometry", weight: "~3.5 Qs for all of Geometry", priority: "Good-to-do",
    summary: "Most triangle questions use Pythagoras, similar triangles or one area formula.",
    ideas: [
      { t: "Angles", d: "The angles add to 180°. An exterior angle = sum of the two opposite interior angles." },
      { t: "Side rule", d: "Any side is less than the sum of the other two and more than their difference." },
      { t: "Pythagorean triplets", d: "3-4-5, 5-12-13, 8-15-17, 7-24-25, 20-21-29 (and their multiples)." },
      { t: "Area", d: "½ × base × height. Heron: √(s(s−a)(s−b)(s−c)). Equilateral: (√3/4)a². Also ½ab sin C." },
      { t: "Similar triangles", d: "Sides in ratio k → areas in ratio k². A line parallel to one side cuts the other two in the same ratio." },
      { t: "Angle bisector", d: "It divides the opposite side in the ratio of the two sides next to it." },
      { t: "Special triangles", d: "30-60-90 sides: 1 : √3 : 2. 45-45-90 sides: 1 : 1 : √2." },
      { t: "Centres", d: "The centroid divides each median 2 : 1. In a right triangle, circumradius = hypotenuse/2. Inradius = area / s." }
    ],
    examples: [
      { q: "A triangle has sides 13, 14 and 15. Find its area and inradius.", steps: ["s = 21.", "Area = √(21 × 8 × 7 × 6) = √7056 = 84.", "Inradius = 84 / 21 = 4."], a: "Area 84, inradius 4" },
      { q: "Two sides are 7 and 10. How many whole-number values can the third side take?", steps: ["10 − 7 < x < 10 + 7 → 3 < x < 17.", "x = 4 to 16."], a: "13" }
    ],
    traps: ["Area ratio of similar triangles is k², not k.", "The side rule is strict: < not ≤."]
  },
  {
    id: "circles", name: "Circles & Polygons", block: "geometry", weight: "~3.5 Qs for all of Geometry", priority: "Good-to-do",
    summary: "Learn the five circle theorems and the polygon angle formulas.",
    ideas: [
      { t: "Basics", d: "Area πr², circumference 2πr. Arc = θ/360 × 2πr. Sector = θ/360 × πr²." },
      { t: "Angles", d: "The angle at the centre = 2 × the angle at the circumference on the same arc. The angle in a semicircle = 90°." },
      { t: "Tangents", d: "A tangent is perpendicular to the radius at the point of contact. Two tangents from one point are equal." },
      { t: "Cyclic quadrilateral", d: "Opposite angles add to 180°." },
      { t: "Chords", d: "The perpendicular from the centre bisects a chord. Crossing chords: AE × EB = CE × ED." },
      { t: "Tangent and secant", d: "PT² = PA × PB." },
      { t: "Polygons", d: "Interior angle sum = (n − 2) × 180°. Each exterior angle of a regular polygon = 360/n. Diagonals = n(n − 3)/2." },
      { t: "Regular hexagon", d: "Six equilateral triangles: area = (3√3/2)a²." }
    ],
    examples: [
      { q: "Each interior angle of a regular polygon is 150°. How many sides?", steps: ["Exterior angle = 180 − 150 = 30°.", "n = 360 / 30."], a: "12" },
      { q: "A chord of 16 cm is in a circle of radius 10 cm. How far is it from the centre?", steps: ["Half-chord = 8.", "√(10² − 8²) = √36."], a: "6 cm" }
    ],
    traps: ["Mixing up the angle at the centre and at the circumference.", "Using n(n − 1)/2 for diagonals (that counts the sides too)."]
  },
  {
    id: "mensuration", name: "Mensuration & Coordinate Geometry", block: "geometry", weight: "~3.5 Qs for all of Geometry", priority: "Good-to-do",
    summary: "Know the solid formulas, and that melting or recasting keeps the volume the same.",
    ideas: [
      { t: "Cube and cuboid", d: "Cube: a³, surface 6a², diagonal a√3. Cuboid: lbh, 2(lb + bh + hl), diagonal √(l² + b² + h²)." },
      { t: "Cylinder", d: "Volume πr²h, curved surface 2πrh, total 2πr(r + h)." },
      { t: "Cone", d: "Volume ⅓πr²h, slant l = √(r² + h²), curved surface πrl." },
      { t: "Sphere", d: "Volume (4/3)πr³, surface 4πr². Hemisphere: (2/3)πr³, curved 2πr², total 3πr²." },
      { t: "Melting and recasting", d: "The total volume stays the same." },
      { t: "Distance and midpoint", d: "Distance = √((x₂ − x₁)² + (y₂ − y₁)²). Section in ratio m:n: (mx₂ + nx₁)/(m + n)." },
      { t: "Lines", d: "Slope = (y₂ − y₁)/(x₂ − x₁). Parallel: equal slopes. Perpendicular: m₁m₂ = −1. x/a + y/b = 1 makes a triangle of area ½|ab| with the axes." },
      { t: "Point to line", d: "Distance = |ax₁ + by₁ + c| / √(a² + b²)." }
    ],
    examples: [
      { q: "A sphere of radius 6 cm is melted into cones of radius 3 cm and height 4 cm. How many cones?", steps: ["Sphere = (4/3)π × 216 = 288π.", "Cone = ⅓π × 9 × 4 = 12π.", "288π / 12π."], a: "24" },
      { q: "Area of the triangle made by 3x + 4y = 12 with the axes?", steps: ["x-intercept 4, y-intercept 3.", "½ × 4 × 3."], a: "6" }
    ],
    traps: ["Mixing cm and m.", "Curved surface vs total surface.", "Sign errors in the slope."]
  },
  {
    id: "number-system", name: "Number System", block: "number", weight: "~2 Qs", priority: "Good-to-do",
    summary: "Prime factorise first. Most factor, remainder and zero questions follow from it.",
    ideas: [
      { t: "Divisibility", d: "3 and 9: digit sum. 4: last two digits. 8: last three. 11: alternating digit sum." },
      { t: "Number of factors", d: "N = pᵃ qᵇ rᶜ → (a + 1)(b + 1)(c + 1) factors, including 1 and N." },
      { t: "HCF and LCM", d: "HCF × LCM = product of the two numbers." },
      { t: "Remainders", d: "Work with the remainder of each part: (a × b) mod n = (a mod n)(b mod n) mod n. Negative remainders help: 15 mod 8 = −1." },
      { t: "Last digit cycles", d: "2: 2,4,8,6. 3: 3,9,7,1. 7: 7,9,3,1. 8: 8,4,2,6. 4 and 9 cycle in 2. 0, 1, 5, 6 never change." },
      { t: "Zeros at the end of n!", d: "n/5 + n/25 + n/125 … (whole parts only)." },
      { t: "Fermat", d: "If p is prime and a is not a multiple of p, a^(p − 1) leaves remainder 1 when divided by p." },
      { t: "Useful fact", d: "aⁿ − bⁿ is always divisible by a − b." }
    ],
    examples: [
      { q: "How many factors does 360 have?", steps: ["360 = 2³ × 3² × 5.", "(3 + 1)(2 + 1)(1 + 1)."], a: "24" },
      { q: "Remainder when 2¹⁰⁰ is divided by 7?", steps: ["2³ = 8 leaves remainder 1.", "2⁹⁹ = (2³)³³ → 1, so 2¹⁰⁰ → 2."], a: "2" },
      { q: "How many zeros are at the end of 100!?", steps: ["100/5 = 20, 100/25 = 4.", "20 + 4."], a: "24" }
    ],
    traps: ["Forgetting that 1 and N are factors.", "Leaving a negative remainder unconverted."]
  },
  {
    id: "pnc", name: "P&C and Probability", block: "modern", weight: "~1.5 Qs with Sets", priority: "Good-to-do",
    summary: "Basics only: AND means multiply, OR means add, and 'at least one' = total − none.",
    ideas: [
      { t: "Counting", d: "AND → multiply. OR → add." },
      { t: "Arrange vs select", d: "Order matters: nPr = n!/(n − r)!. Order doesn't matter: nCr = n!/(r!(n − r)!)." },
      { t: "Repeated letters", d: "LEVEL: 5!/(2! 2!) = 30." },
      { t: "Circular", d: "n people round a table: (n − 1)!. Necklace (can flip): (n − 1)!/2." },
      { t: "At least one", d: "Total − none." },
      { t: "Identical items", d: "n identical items among r people (each can get 0): (n + r − 1)C(r − 1)." },
      { t: "Probability", d: "Favourable / total. P(not A) = 1 − P(A). Independent events: multiply." },
      { t: "Two dice", d: "36 outcomes. A sum of 7 is the most likely (6 ways)." }
    ],
    examples: [
      { q: "Choose a committee of 3 from 5 men and 4 women with at least 1 woman.", steps: ["Total = 9C3 = 84.", "No women = 5C3 = 10.", "84 − 10."], a: "74" },
      { q: "Two dice are thrown. P(sum = 8)?", steps: ["(2,6), (3,5), (4,4), (5,3), (6,2) = 5 ways.", "5/36."], a: "5/36" }
    ],
    traps: ["Arranging when you should be selecting.", "Double counting in 'at least' questions: use total − none."]
  },
  {
    id: "sets", name: "Sets & Venn Diagrams", block: "modern", weight: "~1.5 Qs with P&C", priority: "Good-to-do",
    summary: "Draw the Venn diagram and fill it from the centre outwards.",
    ideas: [
      { t: "Two sets", d: "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)." },
      { t: "Three sets", d: "n(A ∪ B ∪ C) = A + B + C − (AB + BC + CA) + ABC." },
      { t: "Exactly vs at least", d: "At least two = exactly two + all three." },
      { t: "Neither", d: "Neither = total − n(A ∪ B)." },
      { t: "Smallest and largest overlap", d: "Least n(A ∩ B) = A + B − total (if positive). Most = the smaller of A and B." },
      { t: "Fill from the centre", d: "Put 'all three' in the middle first, then the 'exactly two' parts, then the 'only' parts." }
    ],
    examples: [
      { q: "Of 100 students, 60 like tea, 50 like coffee and 20 like both. How many like neither?", steps: ["Tea or coffee = 60 + 50 − 20 = 90.", "100 − 90."], a: "10" },
      { q: "Of 100 people, 70 read A and 80 read B. At least how many read both?", steps: ["70 + 80 − 100."], a: "50" }
    ],
    traps: ["Mixing up 'exactly two' and 'at least two'.", "Counting the centre region more than once."]
  }
];
