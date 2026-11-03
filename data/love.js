// Every message on the site lives here, so Vikas can edit any of them.
// {name} becomes Khushi, {n} becomes a number where it makes sense.
window.LOVE = {
  me: "Vikas",
  her: "Khushi",

  // Optional special dates (MM-DD). Add your anniversary, her birthday, etc.
  // Example: { date: "02-14", title: "Happy Valentine's Day 💘", text: "..." }
  special: [
    { date: "11-29", title: "It's CAT day, {name}! 🐯", text: "Breathe. You've done the work. Go in calm, attempt smart, and come back to me with a big smile. I'm so proud of you already. 화이팅!! 💗" },
    { date: "11-28", title: "Tomorrow is the day 🌙", text: "No new questions today. Revise the formula sheet, eat well, sleep early. You're ready, and I'm right here 🤍" }
  ],

  // On a correct answer
  correct: [
    "Correct! Smart AND cute? That's unfair, {name} 😤💗",
    "Sahi jawab! One kiss deposited in your kiss jar 💋",
    "You got it! IIM is calling… and so am I 📞💕",
    "Perfect answer. Just like you 🥹✨",
    "잘했어! (You did great!) 🎀",
    "Brain: 100. Cuteness: 1000. 💯",
    "Ye dekho, topper aa gayi 😎✨",
    "Correct! I'm telling everyone my girlfriend is a genius 📢💗",
    "Right again?! Okay, now you're just showing off 😌💕",
    "CAT ko bolo, {name} aa rahi hai 🐯🔥",
    "That was so fast I didn't even see it 😳⚡",
    "최고! (The best!) Just like my {name} 🏆",
    "Correct! Can I be your next question? You'd get me right too 😏",
    "My heart: 💓💓💓 Your answer: ✅",
    "Kya baat hai! Ek aur kiss pakki 😘",
    "You're so good at this, the formulas are blushing 🙈",
    "Correct! If being smart was a crime, you'd be in jail 🚔💕",
    "Bilkul sahi! Main proud boyfriend mode ON 🫶",
    "Another one! At this rate the kiss jar will need a bigger jar 🫙💋",
    "You just made CAT nervous 😼",
    "Right answer. Right girl. Right future 💍✨",
    "Uff, itni smart kaise ho? 😍",
    "Correct! Mentally giving you a forehead kiss right now 😚",
    "Wohoo! Do a little dance, you earned it 💃",
    "That's my girl 🥰"
  ],

  // On a wrong answer
  wrong: [
    "Oops! Even I get confused when I look at you, it's okay 🙈",
    "Wrong, but still my favourite person 💗 Read the explanation once.",
    "No tension, galti se hi seekhte hain. Next one, cutie 🐣",
    "That option lied to you. Not your fault 😤",
    "One wrong answer won't stop you. 화이팅! (Fighting!) 💪",
    "Breathe, smile, next question. I'm proud of you anyway 🫶",
    "Mistakes now = marks on 29 Nov. Good trade 😉",
    "Even toppers miss some. Hug first, then the explanation 🤗",
    "It's okay jaan, even I get questions wrong. Like when I asked if you'd miss me. (Obviously yes 😌)",
    "Wrong today, right forever. That's how learning works 🌱",
    "Chalo koi baat nahi, I still think you're the smartest 🧠💗",
    "Hmm, that one was tricky. Not as tricky as you though 😏",
    "Read the why, then smile. You'll never miss this one again 🫡",
    "Plot twist: wrong answers make the right ones stick 📌",
    "Sending a hug through the screen 🤗 Next one!",
    "Don't frown, it gives wrinkles to my favourite face 🙃💕"
  ],

  // When she marks a topic as revised
  revised: [
    "Topic revised! You deserve a virtual hug 🤗💗",
    "Another one done. Khushi 1 – CAT 0 🏆",
    "Revision complete. Now drink some water, cutie 💧",
    "Look at you go! One step closer to IIM 🎓✨",
    "Revised! My heart is doing a little happy dance 💃💕",
    "Checked off! Your future self is clapping 👏",
    "Done and dusted ✨ I'm so lucky to have such a hardworking girlfriend",
    "Revision = love language. You're speaking it fluently 💌",
    "One more topic in the bag 👜💗",
    "Yay! Treat yourself to one chocolate. Doctor's (my) orders 🍫"
  ],

  // After a quiz or test, by score
  finishGreat: [
    "WOW {name}!! Come here, kiss for my topper 😘🏆",
    "Full marks energy! I'm so proud of you, I could cry 🥹💗",
    "You're unstoppable. IIM, get ready for {name} 🎓💖",
    "That score deserves a party 🎉 And a hug. And a kiss. In that order? Any order 😚",
    "Okay genius, teach me also 🤓💕",
    "I'm framing this score in my heart 🖼️💗"
  ],
  finishGood: [
    "Good one! A little more practice and you'll be untouchable 💪💕",
    "Nice score! Revise the wrong ones and come back stronger 🌸",
    "So close to perfect. I believe in you, always 🫶",
    "Solid work! Two more rounds and this topic is yours 👑",
    "Proud of you! Every round you're getting sharper ✨",
    "Good job, cutie. Water break, then one more? 💧"
  ],
  finishLow: [
    "Tough round, but you finished it, and that matters most 🤍",
    "Today's score is not your final score. Revise and retry, I'm with you 🤝💗",
    "Bad day for the quiz, not for you. You're still my favourite genius 🧸",
    "Every topper has rounds like this. Read the notes once and come back 📚💕",
    "It's okay to find this hard. Hard things are how you grow 🌱",
    "Hug break first 🤗 Then we try again, together."
  ],
  perfect: "PERFECT SCORE!!! 😍 I'm officially the luckiest boyfriend in the world. 사랑해, {name}! 💯💗",

  // When a test level is fully done
  levelDone: {
    1: "Level 1 cleared! Warm-up done, cutie 🎀",
    2: "Level 2 done! That's real CAT level 💪💕",
    3: "Level 3 finished!! The hard ones. I'm so proud 🥹🏆"
  },

  // Greeting when she opens the site
  welcome: [
    "Welcome back, {name}! I missed you (and so did these formulas) 🥺",
    "You're back! Visit #{n}. Someone's serious about IIM 😍",
    "Hi jaan! Ready to make CAT cry today? 😼",
    "보고 싶었어! (I missed you!) Let's study a little 💗",
    "Look who's here! My favourite student 🎀",
    "Aagayi meri cutie! Let's do one small thing today 🌸",
    "Hello sunshine ☀️ The site feels brighter already",
    "Visit #{n}! Every visit is a step closer to IIM 🎓",
    "Hey you 😚 Quick quiz or a topic revision?",
    "Welcome back! Your kiss jar missed you 🫙💋",
    "Hi {name}! Reminder: you're doing amazing 💪💗",
    "Hehe, you came back. I knew you would 😌💕"
  ],
  comeback: "{name}! It's been {n} days 🥺 I missed you here. No guilt, just one small quiz today, okay? 💗",
  firstVisit: "Hi {name}! I made this little corner just for you. Revise, play the quizzes, and collect kisses 💋",

  // Time spent on the site today (minutes → message)
  time: {
    5: "5 minutes of study already! Proud of you 🥰",
    15: "15 minutes! You're on fire 🔥 Stretch your neck a little 🧘‍♀️",
    30: "30 minutes!! Water break + one smile for me please 💧😊",
    45: "45 minutes! Your focus is so attractive 😳💕",
    60: "One whole hour! Take 5 minutes off, you've earned it 🍫💗",
    90: "90 minutes?! Okay superstar, rest your eyes for a bit 👀💤",
    120: "Two hours!! I'm in awe. Go eat something nice, please 🍜💗"
  },

  // Idle for a few minutes (not during a timed test)
  idle: [
    "Hello? Are you thinking about me again? 😏",
    "Daydreaming? Me too. About you. Now one question please 😚",
    "Psst… the next question misses you 👀",
    "Taking a break? Good. Drink water and come back 💧💕",
    "I see you resting 👀 One quick quiz and then nap, deal? 🤝"
  ],

  // Tapping the heart logo
  logoTap: [
    "Are you a CAT question? Because I can't stop thinking about you 😳",
    "You must be a TITA question, because there's no negative in you 💗",
    "If you were a percentage, you'd be 100% my type 💯",
    "Are you a ratio? Because you and me are 1 : 1 forever 💞",
    "You're like a perfect square. No irrational thoughts, just love 😌",
    "I'd solve P&C all day just to find the one arrangement with you 🥹",
    "Our love is like CI: it keeps growing every year 📈💗",
    "You're my favourite variable. I can't solve life without you ✨",
    "Even without a calculator, I know you're priceless 💎",
    "Tap again for more love. (Warning: infinite supply 💘)"
  ],

  // Streaks (days in a row)
  streak: "Day {n} in a row! 🔥 Consistency looks so good on you 💗",
  streakSpecial: {
    3: "3 days in a row! 🔥 A habit is starting. I'm so proud 🥹",
    7: "ONE WEEK STREAK!!! 🔥🔥 You deserve a date. Pick the place 💕",
    14: "Two weeks without a break?! You're my hero 🦸‍♀️💗",
    21: "21 days! They say that's how habits are made. IIM habit unlocked 🎓"
  },

  // Late at night / time of day
  lateNight: "It's late, {name}. Sleep is part of the plan too. Good night, I love you 🌙💤",
  morning: [
    "Good morning sunshine ☀️ Start with 5 easy questions, then breakfast 🍳",
    "Rise and shine, future IIM-ian 🌅💗",
    "Good morning cutie! One coffee, one quiz, one smile ☕😊"
  ],

  // Days left to CAT → shown once that day
  countdown: {
    25: "25 days to go. That's 25 chances to get 1% better every day 🌱",
    21: "3 weeks left! Mocks are coming, and so is your best version 💪",
    20: "20 days. Breathe. You're on track, I promise 🫶",
    15: "15 days! Half a month. Focus on the weak spots this week 🧸",
    14: "Two weeks to go. You've come so far, {name} 🥹",
    10: "10 DAYS! Double digits for the last time. Let's go!! 🔥",
    7: "One week left. Mocks + error log + sleep. You've got this 💗",
    5: "5 days. Revise, don't panic. You know more than you think 📚",
    3: "3 days. Light revision, good food, early nights 🌙",
    2: "2 days. Formula sheet + confidence. That's it 😌",
    1: "Tomorrow!! I'm so proud of you, whatever happens. 사랑해 💗"
  },

  // Mood check-in on the Us page
  moods: [
    { id: "happy", emoji: "😊", label: "Happy", reply: "Yay! Happy {name} = happy me. Use this energy for one hard topic today 🌸" },
    { id: "tired", emoji: "😴", label: "Tired", reply: "Aww. Do one small quiz, then rest. Small steps still count, my love 🧸" },
    { id: "stressed", emoji: "😣", label: "Stressed", reply: "Come here 🤗 Close your eyes, three deep breaths. You're doing better than you think. One topic at a time." },
    { id: "motivated", emoji: "🔥", label: "Motivated", reply: "THAT'S MY GIRL 🔥 Go take a timed test and show CAT who's boss 😼" },
    { id: "missing", emoji: "🥺", label: "Missing you", reply: "I miss you too, so much 🥺💗 Study a little, then call me. Deal? 📞" },
    { id: "low", emoji: "😔", label: "Low", reply: "It's okay to have low days. You're not behind, you're human. I'm proud of you, always 🤍" }
  ],

  hug: [
    "Biggest, tightest hug 🤗 You're doing so well.",
    "*hugs you and doesn't let go* 🫂💗",
    "A hug for every question you've solved. That's a LOT of hugs 🤗🤗🤗",
    "Hug delivered! Refills unlimited 💞"
  ],
  kiss: [
    "Muah! 😘 One for luck.",
    "Forehead kiss for my hardworking girl 😚",
    "Cheek kiss! Now go solve something 😘",
    "Mwah mwah! Two, because one is never enough 💋💋"
  ],

  // "Reasons I'm proud of you" cards
  reasons: [
    "You keep going even on days you feel tired.",
    "You finished the whole study material. That takes real discipline.",
    "You aren't scared of hard questions, you learn from them.",
    "You study after a full day, and still find time to smile.",
    "You're kind to everyone, even when you're stressed.",
    "You set a big goal and you're actually chasing it.",
    "You ask questions until you understand. That's how toppers think.",
    "You make me want to work harder too.",
    "You never give up on a topic, even after a bad score.",
    "You're going to be an amazing IIM student, and an even better leader.",
    "You care about doing things properly, not just quickly.",
    "You're my favourite person to be proud of."
  ],

  // "Open when…" letters on the Us page
  letters: [
    { id: "stressed", emoji: "😣", title: "Open when you're stressed", text: "Hey {name}. Put the pen down for one minute. Breathe in for 4, hold for 4, out for 4. Stress means you care, and caring is your superpower. You don't have to finish everything today, just the next small thing. I believe in you more than you know. 💗" },
    { id: "giveup", emoji: "🏳️", title: "Open when you want to give up", text: "Remember why you started. Remember the IIM hoodie you're going to wear. Bad days are part of every success story; they don't erase how far you've come. Take a break if you need to, but don't quit. I'm holding your hand the whole way. 🤝" },
    { id: "scored", emoji: "🏆", title: "Open when you score really well", text: "YESSS!!! I knew it. I always knew it. Screenshot that score and send it to me right now 📸 Then do a little dance. You earned every mark. So, so proud of you, {name}. 😘" },
    { id: "lowscore", emoji: "📉", title: "Open when a mock goes badly", text: "One mock is one data point, not your destiny. Look at the mistakes, add them to the error log, and let them teach you. The best scores come after the worst analysis sessions. I love you the same at 20 marks and at 99 percentile. 🤍" },
    { id: "miss", emoji: "🥺", title: "Open when you miss me", text: "I miss you too, probably more 🥺 Close your eyes and imagine me sitting next to you, stealing your snacks while you solve questions. Now go solve one, and then call me. I'll be waiting. 📞💕" },
    { id: "sleep", emoji: "🌙", title: "Open when you can't sleep", text: "Hey night owl. Put the phone down soon, okay? Your brain needs sleep to remember everything you studied. Think of one happy memory of us and drift off. Good night, my love. 🌙💤" },
    { id: "bored", emoji: "🥱", title: "Open when you're bored of studying", text: "Bored? Let's make it a game: do 5 quick questions, and for each right one, pick a song for our next car ride 🚗🎶 Deal? Also, you're cute when you're bored. 😌" },
    { id: "exam", emoji: "🐯", title: "Open on exam morning", unlock: "2026-11-29", text: "Today's the day, {name}! Eat something light, reach early, and walk in like you own the place. In the section: easy ones first, leave anything over 3 minutes, and trust your preparation. Whatever happens, I'm proud of you today and every day. Go get it. 화이팅!! 사랑해 💗" }
  ],

  // Study date (focus timer)
  focusStart: "Study date started! 25 minutes, phone face down. I'm studying with you in spirit 📚💕",
  focusHalf: "Halfway there! You're doing so well, keep going 💪",
  focusEnd: "25 minutes done!! 🎉 5-minute break: stretch, water, and one smile for me 😊",
  focusBreakEnd: "Break over, cutie! Ready for one more round? 🌸",

  // Kiss-jar milestones
  milestones: [
    { at: 10, text: "10 kisses earned! 😚 Redeem one in person, no expiry date." },
    { at: 25, text: "25 kisses! One coffee date on me ☕💕" },
    { at: 50, text: "50 kisses!! You pick the movie, no complaints from me 🎬🍿" },
    { at: 100, text: "100 kisses!!! Anything you want (within budget 😅💸)" },
    { at: 150, text: "150 kisses! A whole day of me doing everything you say 🫡💗" },
    { at: 200, text: "200 kisses. Marry me after IIM? 💍 (Just kidding… or am I? 😳)" },
    { at: 300, text: "300 kisses!!! You're a legend. Surprise gift incoming 🎁" }
  ],

  // Love note of the day on the home page (one per day, in order)
  daily: [
    "Every question you solve today is a step towards the life we keep talking about 💗",
    "You don't have to be perfect. You just have to keep going. I'm right here 🤝",
    "Reminder: you're smarter than you think and cuter than you know 🌸",
    "Small steps every day. Big result on 29 Nov. 화이팅! 💪",
    "If you feel tired, take a break. If you feel stuck, call me 📞💕",
    "I'm so proud of how hard you're working. Seriously. 🥹",
    "One topic at a time. One kiss at a time 😘",
    "Your future self in an IIM hoodie is waiting. Let's make her proud 🎓",
    "You + coffee + formulas = unstoppable ☕✨",
    "Today's goal: learn one thing, smile once, drink water. Easy 💧😊",
    "Nobody I know works as hard as you. That's why you'll make it 💖",
    "Even on bad days, you're still my favourite person 🧸",
    "사랑해 (I love you). Now go solve something 😌💗",
    "Count down the days, but don't count yourself out. Ever. 💪",
    "Accuracy first, speed later. And hugs always 🤗",
    "The error log is just a list of things you're about to master 📒✨",
    "You make hard things look cute. How? 😍",
    "Some days you'll fly, some days you'll crawl. Both move you forward 🐢🦋",
    "I'm not just proud of your scores. I'm proud of you 💗",
    "Imagine the call where you tell me your percentile. I'm already smiling 📞😊",
    "Study hard, sleep well, eat on time. In that order, cutie 🍜😴",
    "You're my favourite notification 🔔💕",
    "Every formula you learn is one less worry on exam day 📚",
    "Be gentle with yourself today. You're doing enough 🤍",
    "When this is over, we celebrate BIG. Keep that picture in your head 🎉"
  ]
};
