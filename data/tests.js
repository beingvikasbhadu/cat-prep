// Timed tests. Each question: text, format (TITA or MCQ), answer key, the question type (used to find weak types), target seconds, solution.
// ans.kind: "num" (number, tol = allowed difference, abs = ignore the sign), "ratio" (any equivalent ratio), "mcq" (option letter).
window.TESTS = [
  {
    id: "percentages-1", topic: "percentages", title: "Percentages Test 1",
    questions: [
      { text: "A's salary is 25% more than B's. By what percent is B's salary less than A's?", fmt: "TITA", ans: { kind: "num", v: 20 }, show: "20%", type: "Base change (more than / less than)", target: 60,
        steps: ["Take B = 100, so A = 125.", "B is 25 less than A, on a base of 125: 25/125 × 100 = 20%."] },
      { text: "The price of sugar rises by 25%. By what percent must a family cut its consumption to keep its spending the same?", fmt: "TITA", ans: { kind: "num", v: 20 }, show: "20%", type: "Price–consumption", target: 60,
        steps: ["Cut = r/(100 + r) × 100 = 25/125 × 100 = 20%."] },
      { text: "A number is increased by 20% and then decreased by 20%. By what percent does it fall overall?", fmt: "TITA", ans: { kind: "num", v: 4, abs: true }, show: "4% (decrease)", type: "Successive % change", target: 60,
        steps: ["100 → 120 → 96.", "Or: 20 − 20 − (20 × 20)/100 = −4."] },
      { text: "A town's population of 50,000 grows by 10% in the first year and 20% in the second year. What is the population after 2 years?", fmt: "TITA", ans: { kind: "num", v: 66000 }, show: "66,000", type: "Successive % change", target: 90,
        steps: ["50,000 × 1.1 × 1.2 = 66,000."] },
      { text: "In an election between two candidates, 20% of the votes cast were invalid. The winner got 58% of the valid votes and won by 4,800 votes. How many votes were cast in total?", fmt: "TITA", ans: { kind: "num", v: 37500 }, show: "37,500", type: "Votes and elections", target: 120,
        steps: ["Winner 58%, loser 42% of valid votes: the margin is 16% of valid votes.", "16% of valid = 4,800 → valid = 30,000.", "Valid votes are 80% of the total → total = 30,000 / 0.8 = 37,500."] },
      { text: "A rectangle's length is increased by 20% and its breadth is decreased by 10%. By what percent does its area change?", fmt: "TITA", ans: { kind: "num", v: 8 }, show: "+8%", type: "Successive % change", target: 60,
        steps: ["Area = length × breadth, so this is successive change: 20 − 10 − (20 × 10)/100 = +8%."] },
      { text: "40% of A equals 60% of B. A is what percent more than B?", fmt: "TITA", ans: { kind: "num", v: 50 }, show: "50%", type: "Comparing with percentages", target: 90,
        steps: ["0.4A = 0.6B → A/B = 1.5.", "So A is 50% more than B."] },
      { text: "A student needs 40% to pass. She scores 180 marks and fails by 20 marks. What are the maximum marks?", fmt: "TITA", ans: { kind: "num", v: 500 }, show: "500", type: "Marks and passing", target: 60,
        steps: ["Pass mark = 180 + 20 = 200.", "200 is 40% of the maximum → maximum = 500."] },
      { text: "A man spends 20% of his salary on rent and 25% of what is left on food. He has ₹18,000 left. What is his salary?", fmt: "TITA", ans: { kind: "num", v: 30000 }, show: "₹30,000", type: "Successive % of the remainder", target: 90,
        steps: ["Left = S × 0.8 × 0.75 = 0.6S.", "0.6S = 18,000 → S = 30,000."] },
      { text: "A shop raises its price by 10%, and its sales fall by 10%. What happens to its revenue?", fmt: "MCQ", opts: ["(a) No change", "(b) Rises by 1%", "(c) Falls by 1%", "(d) Falls by 10%"], ans: { kind: "mcq", v: "c" }, show: "(c) Falls by 1%", type: "Successive % change", target: 60,
        steps: ["Revenue = price × sales: 10 − 10 − (10 × 10)/100 = −1%."] }
    ]
  },
  {
    id: "profit-loss-1", topic: "profit-loss", title: "Profit & Loss Test 1",
    questions: [
      { text: "An article costs ₹800. It is marked 25% above cost and sold at a 10% discount. What is the profit percent?", fmt: "TITA", ans: { kind: "num", v: 12.5 }, show: "12.5%", type: "Markup and discount", target: 90,
        steps: ["MP = 1,000. SP = 900.", "Profit = 100 on 800 = 12.5%. (Formula: 25 − 10 − 2.5 = 12.5.)"] },
      { text: "By selling 20 articles, a shopkeeper makes a profit equal to the selling price of 4 articles. What is his profit percent?", fmt: "TITA", ans: { kind: "num", v: 25 }, show: "25%", type: "Articles: SP and CP", target: 90,
        steps: ["SP of 20 − CP of 20 = SP of 4 → CP of 20 = SP of 16.", "Profit = 4 on a cost of 16 = 25%."] },
      { text: "Two items are sold for ₹1,200 each, one at 20% profit and the other at 20% loss. What is the overall loss in rupees?", fmt: "TITA", ans: { kind: "num", v: 100 }, show: "₹100", type: "Same SP, x% profit and x% loss", target: 90,
        steps: ["CP₁ = 1,200/1.2 = 1,000. CP₂ = 1,200/0.8 = 1,500.", "Total CP 2,500, total SP 2,400 → loss ₹100 (4%)."] },
      { text: "A dealer claims to sell at cost price but uses a 900 g weight instead of 1 kg. What is his profit percent? (Answer to 2 decimal places.)", fmt: "TITA", ans: { kind: "num", v: 11.11, tol: 0.06 }, show: "11.11%", type: "False weights", target: 60,
        steps: ["Profit % = (1,000 − 900)/900 × 100 = 11.11%."] },
      { text: "Two successive discounts of 20% and 10% are equal to a single discount of how many percent?", fmt: "TITA", ans: { kind: "num", v: 28 }, show: "28%", type: "Successive discounts", target: 45,
        steps: ["20 + 10 − (20 × 10)/100 = 28%."] },
      { text: "A shop offers 'Buy 3, get 1 free'. What is the effective discount percent?", fmt: "TITA", ans: { kind: "num", v: 25 }, show: "25%", type: "Free-item offers", target: 45,
        steps: ["You pay for 3 and get 4: discount = 1/4 = 25%."] },
      { text: "A sells an item to B at 20% profit. B sells it to C at 10% loss. C pays ₹1,080. What did it cost A?", fmt: "TITA", ans: { kind: "num", v: 1000 }, show: "₹1,000", type: "Chain selling", target: 90,
        steps: ["A's cost × 1.2 × 0.9 = 1,080.", "A's cost = 1,080 / 1.08 = 1,000."] },
      { text: "An item costs ₹600. At what price must it be marked so that after a 20% discount the shopkeeper still makes 20% profit?", fmt: "TITA", ans: { kind: "num", v: 900 }, show: "₹900", type: "Markup and discount", target: 90,
        steps: ["SP = 600 × 1.2 = 720.", "MP × 0.8 = 720 → MP = 900."] },
      { text: "A shop sells 300 bottles a day at ₹40 each; each costs ₹25. For every ₹1 rise in price, it sells 10 fewer bottles a day. At what price (in ₹) is its daily profit the highest?", fmt: "TITA", ans: { kind: "num", v: 47.5 }, show: "₹47.50", type: "Price–demand maximisation", target: 180,
        steps: ["Raise the price by x: margin = 15 + x, sales = 300 − 10x.", "Profit = (15 + x)(300 − 10x). Brackets are 0 at x = −15 and x = 30.", "Best x = halfway = 7.5 → price = ₹47.50 (profit 22.5 × 225 = ₹5,062.50)."] },
      { text: "By selling an article for ₹1,140, a man loses 5%. At what price should he sell it to gain 5%?", fmt: "MCQ", opts: ["(a) ₹1,197", "(b) ₹1,254", "(c) ₹1,260", "(d) ₹1,280"], ans: { kind: "mcq", v: "c" }, show: "(c) ₹1,260", type: "CP from a loss or gain", target: 60,
        steps: ["CP = 1,140 / 0.95 = 1,200.", "SP for 5% gain = 1,200 × 1.05 = 1,260."] }
    ]
  },
  {
    id: "si-ci-1", topic: "si-ci", title: "SI & CI Test 1",
    questions: [
      { text: "What is the simple interest on ₹5,000 at 8% a year for 3 years?", fmt: "TITA", ans: { kind: "num", v: 1200 }, show: "₹1,200", type: "Basic SI", target: 45,
        steps: ["5,000 × 8 × 3 / 100 = 1,200."] },
      { text: "What is the compound interest on ₹10,000 at 10% a year for 2 years?", fmt: "TITA", ans: { kind: "num", v: 2100 }, show: "₹2,100", type: "Basic CI", target: 45,
        steps: ["10,000 × 1.21 = 12,100 → CI = 2,100."] },
      { text: "What is the difference between CI and SI on ₹8,000 for 2 years at 5% a year?", fmt: "TITA", ans: { kind: "num", v: 20 }, show: "₹20", type: "CI − SI", target: 60,
        steps: ["P(r/100)² = 8,000 × 0.05 × 0.05 = 20."] },
      { text: "A sum doubles itself in 5 years at simple interest. What is the rate percent per year?", fmt: "TITA", ans: { kind: "num", v: 20 }, show: "20%", type: "SI doubling", target: 45,
        steps: ["Doubling means interest = principal: R × T = 100 → R = 100/5 = 20."] },
      { text: "A sum becomes 4 times itself in 6 years at compound interest. In how many years will it become 16 times itself?", fmt: "TITA", ans: { kind: "num", v: 12 }, show: "12 years", type: "CI multiples", target: 60,
        steps: ["16 = 4². So it takes 2 × 6 = 12 years."] },
      { text: "₹10,000 is invested at 20% a year, compounded half-yearly. What is the amount after 1 year?", fmt: "TITA", ans: { kind: "num", v: 12100 }, show: "₹12,100", type: "Half-yearly compounding", target: 60,
        steps: ["10% per half-year for 2 half-years: 10,000 × 1.1² = 12,100."] },
      { text: "At compound interest, a sum amounts to ₹6,050 after 2 years and ₹6,655 after 3 years. What is the rate percent?", fmt: "TITA", ans: { kind: "num", v: 10 }, show: "10%", type: "Rate from consecutive amounts", target: 60,
        steps: ["6,655 / 6,050 = 1.1 → 10%."] },
      { text: "In the question above (₹6,050 after 2 years, ₹6,655 after 3 years), what was the principal?", fmt: "TITA", ans: { kind: "num", v: 5000 }, show: "₹5,000", type: "Rate from consecutive amounts", target: 60,
        steps: ["6,050 / 1.1² = 6,050 / 1.21 = 5,000."] },
      { text: "A loan of ₹2,100 is repaid in 2 equal yearly instalments at 10% compound interest. What is each instalment?", fmt: "TITA", ans: { kind: "num", v: 1210 }, show: "₹1,210", type: "Equal instalments (CI)", target: 180,
        steps: ["x/1.1 + x/1.21 = 2,100.", "Multiply by 1.21: 1.1x + x = 2,541 → 2.1x = 2,541 → x = 1,210."] },
      { text: "The difference between CI and SI on a sum for 3 years at 10% a year is ₹31. What is the sum?", fmt: "MCQ", opts: ["(a) ₹1,000", "(b) ₹1,100", "(c) ₹1,200", "(d) ₹3,100"], ans: { kind: "mcq", v: "a" }, show: "(a) ₹1,000", type: "CI − SI", target: 120,
        steps: ["CI for 3 years = 33.1%, SI = 30%: the difference is 3.1% of P.", "0.031P = 31 → P = 1,000."] }
    ]
  },
  {
    id: "ratio-1", topic: "ratio", title: "Ratio & Partnership Test 1",
    questions: [
      { text: "A : B = 3 : 4 and B : C = 6 : 5. Find A : B : C.", fmt: "TITA", ans: { kind: "ratio", v: [9, 12, 10] }, show: "9 : 12 : 10", type: "Joining ratios", target: 60,
        steps: ["Make B = 12: A:B = 9:12, B:C = 12:10.", "A:B:C = 9:12:10."] },
      { text: "₹1,560 is divided among A, B and C so that 2A = 3B = 4C. What is A's share?", fmt: "TITA", ans: { kind: "num", v: 720 }, show: "₹720", type: "Fractions to ratio", target: 90,
        steps: ["A : B : C = 1/2 : 1/3 : 1/4 = 6 : 4 : 3 (13 parts).", "1,560 / 13 = 120 → A = 720."] },
      { text: "Two numbers are in the ratio 4 : 7. When 6 is added to each, the ratio becomes 3 : 5. What is the smaller number?", fmt: "TITA", ans: { kind: "num", v: 48 }, show: "48", type: "Changing a ratio", target: 90,
        steps: ["(4k + 6)/(7k + 6) = 3/5 → 20k + 30 = 21k + 18 → k = 12.", "Numbers 48 and 84."] },
      { text: "The incomes of A and B are in the ratio 4 : 3, and their spending is in the ratio 3 : 2. Each saves ₹6,000. What is A's income?", fmt: "TITA", ans: { kind: "num", v: 24000 }, show: "₹24,000", type: "Income–spending–savings", target: 120,
        steps: ["4x − 3y = 6,000 and 3x − 2y = 6,000.", "From these, x = 6,000 and y = 6,000.", "A's income = 4x = 24,000."] },
      { text: "The cost of booking a hall is partly fixed and partly depends on the number of guests. 100 guests cost ₹16,000 and 150 guests cost ₹21,000. What do 220 guests cost?", fmt: "TITA", ans: { kind: "num", v: 28000 }, show: "₹28,000", type: "Fixed + variable cost", target: 90,
        steps: ["50 more guests cost 5,000 more → ₹100 per guest.", "Fixed = 16,000 − 10,000 = 6,000.", "220 guests: 6,000 + 22,000 = 28,000."] },
      { text: "The time to cook rice varies as the square root of its weight. 4 kg takes 30 minutes. How many minutes does 9 kg take?", fmt: "TITA", ans: { kind: "num", v: 45 }, show: "45 minutes", type: "Variation (√, square)", target: 90,
        steps: ["t = k√w: 30 = k × 2 → k = 15.", "t = 15 × √9 = 45."] },
      { text: "A starts a business with ₹60,000. After 4 months, B joins with ₹80,000. At the end of month 8, A withdraws ₹20,000. The year's profit is ₹1,10,000. What is B's share?", fmt: "TITA", ans: { kind: "num", v: 55000 }, show: "₹55,000", type: "Partnership (time changes)", target: 150,
        steps: ["A: 60,000 × 8 + 40,000 × 4 = 6.4 lakh.", "B: 80,000 × 8 = 6.4 lakh.", "Ratio 1 : 1 → B = 55,000."] },
      { text: "A invests ₹40,000 and B invests ₹60,000. A is the working partner and first takes 20% of the profit as salary; the rest is split by capital. The profit is ₹50,000. How much does A get in all?", fmt: "TITA", ans: { kind: "num", v: 26000 }, show: "₹26,000", type: "Partnership (salary)", target: 120,
        steps: ["Salary = 10,000. Rest = 40,000 split 4 : 6 → A gets 16,000.", "A's total = 10,000 + 16,000 = 26,000."] },
      { text: "x/(y + z) = y/(z + x) = z/(x + y) = k, and x + y + z = 0. What is k?", fmt: "MCQ", opts: ["(a) ½", "(b) −1", "(c) 2", "(d) 0"], ans: { kind: "mcq", v: "b" }, show: "(b) −1", type: "k-method (two cases)", target: 60,
        steps: ["x + y + z = 0 → y + z = −x.", "k = x/(−x) = −1."] },
      { text: "4, x, y and 108 are in continued proportion. Find x + y.", fmt: "TITA", ans: { kind: "num", v: 48 }, show: "48", type: "Continued proportion", target: 90,
        steps: ["4 × r³ = 108 → r³ = 27 → r = 3.", "x = 12, y = 36 → x + y = 48."] }
    ]
  },
  {
    id: "averages-mixtures-1", topic: "averages", topics: ["averages", "mixtures"], title: "Averages & Mixtures Test 1",
    questions: [
      { text: "The average of 8 numbers is 25. One number, 39, is replaced by 15. What is the new average?", fmt: "TITA", ans: { kind: "num", v: 22 }, show: "22", type: "Replacing an item", target: 60,
        steps: ["Total falls by 24 → average falls by 24/8 = 3.", "25 − 3 = 22."] },
      { text: "A cricketer averages 40 runs over 20 innings. How many runs must he score in the 21st innings to raise his average to 42?", fmt: "TITA", ans: { kind: "num", v: 82 }, show: "82", type: "Average change after a new entry", target: 60,
        steps: ["New entry = new average + old count × rise = 42 + 20 × 2 = 82."] },
      { text: "The average of 9 numbers is 18. The average of the first 5 is 16 and the average of the last 5 is 20. What is the 5th number?", fmt: "TITA", ans: { kind: "num", v: 18 }, show: "18", type: "Overlapping groups", target: 90,
        steps: ["80 + 100 − 162 = 18."] },
      { text: "In what ratio must wheat at ₹24/kg be mixed with wheat at ₹32/kg to get a mixture worth ₹27/kg?", fmt: "TITA", ans: { kind: "ratio", v: [5, 3] }, show: "5 : 3", type: "Alligation on price", target: 60,
        steps: ["Cheap : dear = (32 − 27) : (27 − 24) = 5 : 3."] },
      { text: "Class A has 30 students averaging 60 marks; class B has 20 students averaging 70. What is the combined average?", fmt: "TITA", ans: { kind: "num", v: 64 }, show: "64", type: "Weighted average", target: 60,
        steps: ["(30 × 60 + 20 × 70)/50 = 3,200/50 = 64."] },
      { text: "Milk costs ₹48 a litre. A milkman adds water and sells the mixture at ₹48 a litre, making a 20% profit. What is the ratio of water to milk?", fmt: "TITA", ans: { kind: "ratio", v: [1, 5] }, show: "1 : 5", type: "Alligation with water (cost 0)", target: 90,
        steps: ["Cost of 1 L of mixture = 48 / 1.2 = 40.", "Water : milk = (48 − 40) : (40 − 0) = 8 : 40 = 1 : 5."] },
      { text: "30 litres of a 20% alcohol solution is mixed with 20 litres of a 45% alcohol solution. What percent of the mixture is alcohol?", fmt: "TITA", ans: { kind: "num", v: 30 }, show: "30%", type: "Mixing two mixtures", target: 60,
        steps: ["Alcohol = 6 + 9 = 15 L in 50 L → 30%."] },
      { text: "A cask has 100 litres of pure wine. 10 litres are taken out and replaced with water. This is done 3 times in all. How much wine is left?", fmt: "TITA", ans: { kind: "num", v: 72.9 }, show: "72.9 litres", type: "Repeated replacement", target: 90,
        steps: ["100 × 0.9³ = 72.9."] },
      { text: "A car goes from P to Q at 40 km/h and comes back at 60 km/h. What is its average speed for the whole trip?", fmt: "MCQ", opts: ["(a) 50 km/h", "(b) 48 km/h", "(c) 45 km/h", "(d) 52 km/h"], ans: { kind: "mcq", v: "b" }, show: "(b) 48 km/h", type: "Average speed (equal distances)", target: 45,
        steps: ["Equal distances: 2ab/(a + b) = 2 × 40 × 60/100 = 48."] },
      { text: "The average of 6 different positive whole numbers is 15. What is the largest possible value of the biggest one?", fmt: "TITA", ans: { kind: "num", v: 75 }, show: "75", type: "Largest/smallest with conditions", target: 90,
        steps: ["Total = 90. Make the other five as small as possible: 1 + 2 + 3 + 4 + 5 = 15.", "Biggest = 90 − 15 = 75."] }
    ]
  }
];
