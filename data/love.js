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
    "Kabhi Khushi Kabhie Gham? Nahi. Mere liye hamesha sirf Khushi 💗",
    "DDLJ mein Raj ne train se haath badha ke Simran ko pakda tha. Main tumhara haath poore CAT tak pakad ke rakhunga 🚂😌",
    "Tujhe dekha toh ye jaana sanam… ki tum TITA ho: no negative, only positive 💞",
    "Mere paas formula sheet hai, mock tests hain… tumhare paas kya hai? 'Mere paas tum ho' 🥹",
    "Pehla Nasha vibes: pehla sawaal, pehli chai, aur tum. Perfect combo 😍",
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

  // "Open when…" letters on the Us page.
  // Each has an original shayari, a filmy moment and a song dedication (title, film, year: tapping it searches YouTube).
  letters: [
    {
      id: "stressed", emoji: "😣", title: "Open when you're stressed",
      text: "Meri pyaari {name}, ek minute ke liye pen neeche rakh do. Aankhein band karo, 4 tak saans andar, 4 tak roko, 4 tak bahar. Stress ka matlab hai ki tumhe fark padta hai, aur yahi tumhari sabse badi taakat hai. Aaj sab kuch khatam nahi karna hai, bas agla ek chhota sa kadam.",
      shayari: ["Thak jaaye jo nazar, toh meri baahon mein aa jaana,","har bojh utaar dena, bas thoda sa muskura jaana.","Ishq ki dargah pe maine, teri khaatir dua maangi hai,","tera har din roshan ho, bas itni si khwahish baaki hai."],
      filmy: "Yaad hai 'Anand' (1971) mein Rajesh Khanna kehte hain: zindagi badi honi chahiye, lambi nahi. Waise hi padhai gehri honi chahiye, ghanton lambi nahi. Toh 10 minute ka break lo, Babumoshai… I mean, Khushi 😄",
      song: { title: "Zindagi Ek Safar Hai Suhana", film: "Andaz", year: 1971 },
      end: "Chai banao, ek gaana suno, aur phir wapas aao. Main yahin hoon. 💗"
    },
    {
      id: "giveup", emoji: "🏳️", title: "Open when you want to give up",
      text: "{name}, yaad karo tumne shuru kyun kiya tha. Woh IIM hoodie, woh campus, woh call jab tum mujhe apna result bataogi. Bure din har success story ka hissa hote hain; woh tumhari mehnat ko mitaa nahi sakte. Break lo, ro lo, mujhe call karo… par haar mat maano.",
      shayari: ["Girte hain shahsawar hi maidan-e-jung mein,","woh tifl kya gire jo ghutnon ke bal chale.","— an old 19th-century sher: only riders fall in battle; a child who only crawls never does.","Haar ke baithna tujhe bilkul nahi jachta meri jaan,","tujh mein hai woh hausla, jo jhuka de saara aasmaan.","Gir bhi jaaye toh kya, main thaam lunga har baar,","tere sapnon ki chaukhat pe, baitha hoon ban ke pehredaar."],
      filmy: "Fun fact: 1974 mein ek film aayi thi jiska naam hi 'Imtihan' tha, matlab exam 😄 Aur uska gaana 'Ruk Jana Nahin' jaise tumhare liye hi bana tha. Kishore Kumar bhi keh rahe hain, rukna nahi hai!",
      song: { title: "Ruk Jana Nahin", film: "Imtihan", year: 1974 },
      end: "Main tumhara haath pakad ke chal raha hoon. Har kadam, har mock, har din. 🤝"
    },
    {
      id: "scored", emoji: "🏆", title: "Open when you score really well",
      text: "YESSSS!!! Maine kaha tha na? Mujhe pata tha! Abhi ke abhi us score ka screenshot bhejo 📸 Phir ek chhota sa dance karo. Har ek mark tumne kamaaya hai, {name}. I'm SO proud of you.",
      shayari: ["Teri har jeet pe falak bhi, jhuk ke salaam karta hai,","mera dil aaj phir tera, naam le ke kalaam karta hai.","Ye toh bas pehli manzil thi, abhi aasmaan baaki hai,","tu chalti reh meri jaan, abhi poori udaan baaki hai."],
      filmy: "Sholay style mein: 'Kitne sawaal the?' '22, Sardar!' 'Aur kitne sahi kiye?' 'Sab ke sab!' 😎 Gabbar bhi aaj tumse darr gaya.",
      song: { title: "Aaj Main Upar Aasman Neeche", film: "Khamoshi: The Musical", year: 1996 },
      end: "Aaj ka treat mere taraf se. Tum bas jagah choose karo. 😘🍰"
    },
    {
      id: "lowscore", emoji: "📉", title: "Open when a mock goes badly",
      text: "Ek mock sirf ek data point hai, tumhari kismat nahi. Galtiyan dekho, error log mein likho, aur unhe tumhe sikhane do. Sabse ache score hamesha sabse bure analysis ke baad aate hain. Aur haan, main tumse utna hi pyaar karta hoon 20 marks pe bhi aur 99 percentile pe bhi. 🤍",
      shayari: ["Ek raat andheri thi toh kya, subah toh aani hai,","ye mock bas ek panna tha, poori abhi kahaani hai.","Main tere har aansoo ko, apni palkon pe utha lunga,","teri har haar ko main, apni dua se jeet bana dunga."],
      filmy: "DDLJ ke Raj ki tarah: 'Bade bade exams mein, Senorita, aisi chhoti chhoti galtiyan hoti rehti hain.' 😌",
      song: { title: "Jab Koi Baat Bigad Jaaye", film: "Jurm", year: 1990 },
      end: "Aaj ka mock gaya, kal ka abhi baaki hai. Aur main hamesha tumhari side pe hoon. 💪"
    },
    {
      id: "miss", emoji: "🥺", title: "Open when you miss me",
      text: "Main bhi tumhe miss kar raha hoon, shayad tumse bhi zyada 🥺 Aankhein band karo aur socho main tumhare bagal mein baitha hoon, tumhare snacks chura raha hoon jab tum sawaal solve kar rahi ho. Ab ek sawaal solve karo, aur phir mujhe call karo. Main wait kar raha hoon.",
      shayari: ["Door ho kar bhi tu, meri har saans mein basti hai,","teri yaad ki khushboo se, meri har shaam mehakti hai.","Rooh ka rishta hai ye, kilometre isse kya naapenge,","tu jahan bhi ho meri jaan, hum dil se tujhe pukaarenge."],
      filmy: "Purane gaane wala pyaar: 'Lag Ja Gale' (1964) chalao aur imagine karo main tumhare saath besura gaa raha hoon 🎶 Lata ji maaf karna 🙏",
      song: { title: "Lag Ja Gale", film: "Woh Kaun Thi?", year: 1964 },
      end: "Distance sirf kilometres mein hota hai, dil mein nahi. 📞💕"
    },
    {
      id: "sleep", emoji: "🌙", title: "Open when you can't sleep",
      text: "Hey night owl 🦉 Phone jaldi rakh do, theek hai? Tumhare dimaag ko neend chahiye taaki jo aaj padha woh yaad rahe. Hamari ek pyaari si memory socho, aur dheere dheere so jao.",
      shayari: ["So ja ab meri jaan, chaand pehra de raha hai,","taaron ki chaadar odhe, aasmaan tujhe dua de raha hai.","Khwaabon ki dargah mein, main chiragh jalaaye baitha hoon,","tu aaye toh roshan ho, bas isi intezaar mein baitha hoon."],
      filmy: "Aradhana (1969) ki lori 'Chanda Hai Tu' yaad hai? Aaj woh main tumhare liye gaa raha hoon. Chupchaap so jao, warna kal ki DILR tumse naraz ho jaayegi 😄",
      song: { title: "Chanda Hai Tu", film: "Aradhana", year: 1969 },
      end: "Good night, meri jaan. Sapne mein milte hain. 🌙💤"
    },
    {
      id: "bored", emoji: "🥱", title: "Open when you're bored of studying",
      text: "Bore ho gayi? Chalo ek game khelte hain: 5 quick sawaal karo, aur har sahi jawab pe hamari agli long drive ke liye ek gaana choose karo 🚗🎶 Deal? Waise, bore hoti hui bhi tum bahut cute lagti ho. 😌",
      shayari: ["Kitaab bhi thak gayi hogi, tujhe itna takte takte,","sawaal bhi sharma gaye, tere sawaal hal karte karte.","Bas paanch aur kar le, phir chai pe hamari mulaqaat,","ishq mein itni si mohlat, aur itni si saugaat."],
      filmy: "Madhuri ne 'Ek Do Teen' (Tezaab, 1988) mein 13 tak gina tha. Tum 13 sawaal gino, phir humari video call pakki 😉",
      song: { title: "Ek Do Teen", film: "Tezaab", year: 1988 },
      end: "Dance break allowed. Bas 2 minute. Phir padhai. 💃"
    },
    {
      id: "notenough", emoji: "🪞", title: "Open when you feel you're not good enough",
      text: "Ruko. Jo bhi tumhare dimaag mein abhi chal raha hai, woh sach nahi hai. Tum smart ho, mehnati ho, aur sabse zaroori, tum kabhi haar nahi maanti. Main tumhe roz dekhta hoon, aur roz thoda aur proud hota hoon.",
      shayari: ["Aaina bhi jhooth bole, toh meri aankhon mein dekh lena,","jo noor wahan dikhega, use apni pehchaan samajh lena.","Tu kam nahi kisi se, tu meri dua ka asar hai,","khuda ki sabse pyaari ghazal, tu meri har sehar hai."],
      filmy: "Jab We Met (2007) ki Geet ki tarah bolo: 'Main apni favourite hoon!' Aur haan, tum meri bhi favourite ho 🥰",
      song: { title: "Tujhe Dekha To Ye Jaana Sanam", film: "Dilwale Dulhania Le Jayenge", year: 1995 },
      end: "Aaine mein dekho aur bolo: 'IIM, I'm coming.' 💗"
    },
    {
      id: "angry", emoji: "😤", title: "Open when you're angry with me",
      text: "Okay okay, kaan pakad liye 🙉 Galti meri thi. (Agar meri nahi bhi thi, tab bhi meri thi 😌) Gussa karna tumhara haq hai, bas zyada der mat karna, kyunki tumhare bina mera din adhoora lagta hai.",
      shayari: ["Teri naraazgi bhi meri jaan, mujhe ibadat lagti hai,","tere gusse mein bhi chhupi, meri hi chahat lagti hai.","Maaf kar de is baar, main sar jhukaaye khada hoon,","tere bina ek pal bhi, main khud se hi juda hoon."],
      filmy: "DDLJ mein Simran train ke peeche bhaagi thi aur Raj ne haath badhaya tha 🚂 Main bhi haath badha raha hoon, ek sorry aur tumhari favourite chocolate ke saath.",
      song: { title: "Tujhse Naraz Nahi Zindagi", film: "Masoom", year: 1983 },
      end: "Ab ek smile? Bas ek. Please? 🥺👉👈"
    },
    {
      id: "mockdone", emoji: "📝", title: "Open when you finish a full mock",
      text: "Do ghante ka full mock khatam! 🎉 Score jo bhi ho, sabse pehle khud ko shabaashi do. Itni der focus karna aasaan nahi hota. Ab 15 minute ka break, phir analysis. Main tumhare liye chai virtually bana raha hoon ☕",
      shayari: ["Do ghante ki ye jung, tune hans ke jeet li hai,","har sawaal se ladi, aur himmat se preet ki hai.","Ab thodi der aaram kar, meri baahon ki chhaon mein,","kal phir se chalenge hum, sapnon ke us gaon mein."],
      filmy: "Jaise 'Sholay' (1975) mein Jai-Veeru ki dosti, waise hi tumhari aur mock tests ki. Thodi nok-jhok, par end mein jeet hamesha tumhari 😄",
      song: { title: "Yeh Dosti", film: "Sholay", year: 1975 },
      end: "Mistakes error log mein, aur tension dustbin mein. 🗑️💗"
    },
    {
      id: "rain", emoji: "🌧️", title: "Open when it's raining",
      text: "Baarish ho rahi hai? Ek cup chai banao, khidki khol do, aur 10 minute sirf baarish suno. Main bhi wahi kar raha hoon, tumhare baare mein sochte hue. Phir ek topic revise karna, perfect mausam hai.",
      shayari: ["Baarish ki har boond mein, tera hi naam likha hai,","bheegi hawa ne aaj phir, tera paigaam likha hai.","Khidki pe tu ho, haathon mein chai ka pyaala,","is mausam ko bhi lagta hai, tujhse hi hai ujaala."],
      filmy: "Shree 420 (1955) ka woh chhatri wala scene yaad hai? Raj Kapoor aur Nargis, ek chhatri, poori baarish. Hamari bhi ek chhatri wali walk pakki hai, CAT ke baad ☔",
      song: { title: "Rim Jhim Gire Saawan", film: "Manzil", year: 1979 },
      end: "Baarish ke saath saath pyaar bhi barse. ☔💕"
    },
    {
      id: "focus", emoji: "🎯", title: "Open when you can't focus",
      text: "Dimaag idhar udhar bhaag raha hai? Normal hai. Ek kaam karo: phone ulta rakho, Us page pe 25 minute ki study date shuru karo, aur sirf ek topic pakdo. Bas ek. Main bhi saath mein padh raha hoon.",
      shayari: ["Mann bhatke toh ek pal, mujhe yaad kar lena,","mere naam ki tasbeeh pe, phir se dhyaan dhar lena.","Pachchees minute ki ye ibadat, sirf tere sapnon ke naam,","phir jo pal bachenge, woh saare mere naam."],
      filmy: "'Pal Pal Dil Ke Paas' (Blackmail, 1973)… haan, main pal pal dil ke paas hoon, par phone ko dil se door rakho 😄📵",
      song: { title: "Pal Pal Dil Ke Paas", film: "Blackmail", year: 1973 },
      end: "25 minute baad 3 kisses milenge. Deal? 💋"
    },
    {
      id: "hug", emoji: "🫂", title: "Open when you need a hug",
      text: "Koi wajah nahi chahiye. Bas aa jao. Ye ek lambi, tight, kabhi na khatam hone wali jhappi hai, sirf tumhare liye. Saari thakaan, saara darr, sab yahin chhod do.",
      shayari: ["Aa, meri baahon mein aa ja, saari thakaan yahin rakh de,","apna har dard, har darr, mere dil ki chaukhat pe rakh de.","Ye jhappi nahi, ek dua hai, jo teri rooh ko chhoo jaaye,","tu jab bhi toote meri jaan, ye tujhe phir se jod jaaye."],
      filmy: "Shah Rukh ne 'Main Hoon Na' (2004) bola tha, aur main bhi wahi bolunga, har din: main hoon na. 🤗",
      song: { title: "Tere Bina Zindagi Se Koi", film: "Aandhi", year: 1975 },
      end: "Jhappi refill unlimited hai. Jab chahe, yahan aa jaana. 💞"
    },
    {
      id: "exam", emoji: "🐯", title: "Open on exam morning", unlock: "2026-11-29",
      text: "Aaj ka din aa gaya, {name}! Halka kuch khao, time se pahuncho, aur andar aise jao jaise centre tumhara hai. Section mein: pehle aasaan sawaal, 3 minute se zyada kisi pe mat ruko, aur apni preparation pe bharosa rakho. Jo bhi ho, main aaj bhi tumpe proud hoon aur hamesha rahunga.",
      shayari: ["Aaj ka din tera hai, aaj kismat tujhse milegi,","mehnat ki har ek boond, aaj phool ban ke khilegi.","Jaa, sar utha ke chal, meri saari duaayein saath hain,","tere haathon mein aaj, khuda ke bhi haath hain."],
      filmy: "Om Shanti Om (2007) mein kaha tha na, kisi cheez ko dil se chaho toh poori kaynaat use tumse milaane mein lag jaati hai. Aaj poori kaynaat tumhare saath hai. Aur main bhi. ✨",
      song: { title: "Aaj Phir Jeene Ki Tamanna Hai", film: "Guide", year: 1965 },
      end: "Jaao, cheer jaao. 화이팅!! 사랑해, meri jaan. 💗🐯"
    },
    {
      id: "afterexam", emoji: "🎉", title: "Open after the exam", unlock: "2026-11-29",
      text: "KHATAM!!! 🎉🎉 Tumne kar dikhaya. Mahino ki mehnat, raaton ki padhai, aur aaj ka din. Paper kaisa bhi gaya ho, aaj sirf celebrate karna hai. Aaj na koi analysis, na koi tension. Aaj sirf hum.",
      shayari: ["Imtehaan ki raat dhal gayi, ab ishq ki subah hai,","tu saamne ho meri jaan, bas yahi meri dua hai.","Nateeja jo bhi aaye, woh kismat ka ek panna hai,","par tu hi meri kitaab hai, tu hi mera afsaana hai."],
      filmy: "Kabhi Khushi Kabhie Gham (2001)? Na na. Mere liye toh hamesha sirf Khushi. Aaj ki date meri taraf se, aur dessert bhi 🍨",
      song: { title: "Dekha Ek Khwaab", film: "Silsila", year: 1981 },
      end: "I'm so, so proud of you. Ab phone uthao aur mujhe call karo! 📞💗"
    },
    {
      id: "result", emoji: "📜", title: "Open on result day",
      text: "Result ka din. Dil zor se dhadak raha hoga, mera bhi dhadak raha hai. Ek baat yaad rakhna: ye number tumhari mehnat ka ek hissa batata hai, poori kahaani nahi. Jo bhi aaye, hum saath mein dekhenge, saath mein celebrate karenge, aur zaroorat pade toh saath mein agla plan banayenge.",
      shayari: ["Kaagaz ke number kya batayenge, teri keemat kya hai,","jo rooh ko roshan kar de, woh tera ishq-e-wafa hai.","Jo bhi aaye aaj, main tera haath nahi chhodunga,","har manzil pe saath chalunga, ye waada nahi todunga."],
      filmy: "Guide (1965) ka gaana 'Gaata Rahe Mera Dil' sunna. Mera dil aaj bhi tumhare liye hi gaata hai, result chahe jo bhi ho. 🎶",
      song: { title: "Gaata Rahe Mera Dil", film: "Guide", year: 1965 },
      end: "Result se pehle ek jhappi, result ke baad do. 🤗🤗"
    }
  ],

  // Shayari of the day (original two-liners), shown on the Us page
  shayari: [
    ["Tujhe dekha toh laga, koi dua qubool hui,","meri bikhri hui rooh, tujhse hi mukammal hui."],
    ["Sajde mein jab bhi jhuka, tera hi naam aaya,","khuda se jo bhi maanga, har baar tujhe paaya."],
    ["Na mandir ki khabar mujhe, na masjid ka pata,","tere dil tak jo jaaye, wahi mera raasta."],
    ["Teri aankhon mein jo noor hai, woh kisi chiragh mein kahan,","tu saath ho toh lagta hai, mil gaya mujhe saara jahaan."],
    ["Main toh ek musafir tha, bhatakta hua fiza mein,","tu mili toh ghar mil gaya, tere dil ki panaah mein."],
    ["Ishq ki is dargah pe, maine dil ka chiragh jalaaya hai,","har shaam teri yaad ne, use phir se roshan banaaya hai."],
    ["Tasbeeh ke har daane pe, tera naam piroya hai,","tujhe paane ki chahat mein, maine khud ko khoya hai."],
    ["Rooh se rooh ka rishta hai, isme koi faasla nahi,","tu door ho ya paas ho, dil kabhi akela nahi."],
    ["Khuda ne jab likhi hogi, meri qismat ki kitaab,","har panne pe tera naam likha, aur har sawaal ka jawaab."],
    ["Fana ho jaaun tujh mein, yahi meri aarzoo hai,","main jahan bhi dekhoon, bas tu hi tu hai."],
    ["Teri ek muskaan pe, saare zamaane ki rehmat hai,","tu meri dua ka jawaab, tu hi meri barkat hai."],
    ["Raat bhar jaagi hai tu, sapnon ko sajaane ke liye,","main bhi jaagta hoon har shab, tujhe dua mein bulaane ke liye."],
    ["Chaand bhi sharma jaaye, jab tu nazar uthaati hai,","meri saans ki har dor, tere naam se bandh jaati hai."],
    ["Tu meri dua ka asar hai, tu hi mera sukoon hai,","jo dil mein dhadakta hai, woh bas tera junoon hai."],
    ["Ishq ne sikhaya mujhe, khud se pehle tujhe chaahna,","teri har jeet ko apni jeet, har dard ko apna maanna."],
    ["Khushi naam hai tera, aur meri har khushi tujhse hai,","ye saans, ye dhadkan, ye zindagi, sab kuch tujhse hai."]
  ],

  // Our songs: old Bollywood dedications. yt = the official YouTube video (opens on YouTube); without it, a YouTube search opens.
  // What they say in the 3D animation. who: "v" = Vikas, "k" = Khushi. from/to are story seconds
  // (kiss story runs 0–10 and plays at 1.4× slower; hug runs 0–4.6 at 1.3× slower).
  talk: {
    kiss: [
      { who: "v", from: 0.05, to: 1.25, text: "Baby, ek baat bolun? 🙈" },
      { who: "k", from: 0.75, to: 1.45, text: "Haan bolo na 🥰" },
      { who: "k", from: 2.2, to: 3.2, text: "Ye kya tha?! 😳💗" },
      { who: "v", from: 2.8, to: 4.3, text: "Kuch nahi… bas aise hi 🙈" },
      { who: "k", from: 4.4, to: 5.5, text: "Ruko na… kahan ja rahe ho? 🥺" },
      { who: "v", from: 5.45, to: 6.5, text: "Tumhare paas hi toh aa raha hoon, baby 💗" },
      { who: "v", from: 7.0, to: 8.3, text: "I love you, baby 💖" },
      { who: "k", from: 8.2, to: 9.6, text: "I love you too, meri jaan 🥰" }
    ],
    hug: [
      { who: "v", from: 0, to: 1.3, text: "Idhar aao, baby 🤗" },
      { who: "k", from: 1.4, to: 2.9, text: "Bas aise hi pakad ke rakhna 🥺💗" },
      { who: "v", from: 2.9, to: 4.6, text: "Hamesha, baby. Promise 💖" }
    ]
  },

  // Quotes under the animation on the home page (one per replay)
  quotes: [
    "Baby, tum meri har dua ka jawaab ho 💗",
    "Duniya ki saari khushiyan ek taraf, aur meri Khushi ek taraf 💞",
    "Baby, tumhare saath har pal ek pyaari si kahaani hai 📖",
    "Main tumhe har roz thoda aur chahta hoon, baby 🥰",
    "Tum ho toh sab kuch hai, baby. Tum nahi toh kuch bhi nahi 🌸",
    "Mera sukoon, meri muskaan, meri baby: sab tum ho 💖",
    "Baby, tumhari ek hasi meri saari thakaan utaar deti hai ✨",
    "Har janam mein bas tum, baby 💍"
  ],

  // Our special song: featured on the home page and at the top of the songs
  specialSong: { title: "Humko Pyar Hua", film: "Ready", year: 2011, yt: "EB25MOJIHRQ", note: "Hamara gaana 💖 Jab bhi ye suno, bas itna yaad rakhna: main hamesha tumhare saath hoon." },

  playlist: [
    { title: "Humko Pyar Hua", film: "Ready", year: 2011, note: "Our special song 💖", yt: "EB25MOJIHRQ", special: true },
    { title: "Tujhe Dekha To Ye Jaana Sanam", film: "Dilwale Dulhania Le Jayenge", year: 1995, note: "Hamara forever song 💛", yt: "cNV5hLSa9H8" },
    { title: "Pehla Nasha", film: "Jo Jeeta Wohi Sikandar", year: 1992, note: "Jab pehli baar tumhe dekha tha, bilkul aisa laga tha", yt: "Ki41AKu0iHc" },
    { title: "Lag Ja Gale", film: "Woh Kaun Thi?", year: 1964, note: "Jab miss karo, ye suno", yt: "br6C4U3Dyfo" },
    { title: "Pyar Hua Ikrar Hua", film: "Shree 420", year: 1955, note: "Baarish + chhatri + hum ☔", yt: "X3Twhs6Tnws" },
    { title: "Kabhi Kabhi Mere Dil Mein", film: "Kabhi Kabhie", year: 1976, note: "Kabhi kabhi nahi, hamesha 😌", yt: "o-j2hFfLOSE" },
    { title: "Kuch Kuch Hota Hai", film: "Kuch Kuch Hota Hai", year: 1998, note: "Tum paas aati ho toh kuch kuch hota hai 🙈", yt: "bKZTnnFU9HA" },
    { title: "Achchi Lagti Ho", film: "Kuch Naa Kaho", year: 2003, note: "Sach mein, tum bahut achhi lagti ho 🥰", yt: "HJIRktKAahU" },
    { title: "Pari Pari", film: "Hungama", year: 2003, note: "Meri pari toh tum ho 🧚‍♀️💗", yt: "bsIF4KQZ5k0" },
    { title: "Ek Ladki Ko Dekha", film: "1942: A Love Story", year: 1994, note: "Woh ladki tum ho", yt: "htMvfOfixuM" },
    { title: "Mere Sapno Ki Rani", film: "Aradhana", year: 1969, note: "Sapno wali rani? Woh toh tum ho 😍", yt: "Nw7lcCNSYy8" },
    { title: "Pal Pal Dil Ke Paas", film: "Blackmail", year: 1973, note: "Har pal, har second", yt: "Qa-uVqnv-No" },
    { title: "Zindagi Ek Safar Hai Suhana", film: "Andaz", year: 1971, note: "Jab stress ho, ye suno 🚗", yt: "mzxHflxI-es" },
    { title: "Chanda Hai Tu", film: "Aradhana", year: 1969, note: "Neend na aaye toh 🌙", yt: "nGj54u_PjXg" },
    { title: "Tujhse Naraz Nahi Zindagi", film: "Masoom", year: 1983, note: "Jab mujhse naraz ho 🙉", yt: "tHK7f4VpJ48" },
    { title: "Rim Jhim Gire Saawan", film: "Manzil", year: 1979, note: "Baarish wala gaana ☔", yt: "6C7R_CUJgHQ" },
    { title: "Dekha Ek Khwaab", film: "Silsila", year: 1981, note: "CAT ke baad ka sapna ✨", yt: "7dO_MS9tZ5E" },
    { title: "Gaata Rahe Mera Dil", film: "Guide", year: 1965, note: "Result day ka gaana 🎶", yt: "63l_CnFV4Cw" },
    { title: "Ruk Jana Nahin", film: "Imtihan", year: 1974, note: "Exam wala gaana, literally 😄", yt: "6J9okctVu58" },
    { title: "Ae Mere Humsafar", film: "Qayamat Se Qayamat Tak", year: 1988, note: "Mere humsafar, IIM tak aur uske baad bhi", yt: "sWqjZpBtcxc" },
    { title: "Aaj Phir Jeene Ki Tamanna Hai", film: "Guide", year: 1965, note: "Exam morning ka gaana", yt: "sACLGUkLo3Q" },
    { title: "Aaj Main Upar Aasman Neeche", film: "Khamoshi: The Musical", year: 1996, note: "Jab score acha aaye 🏆", yt: "zb_hBIMoS6A" },
    { title: "Ek Do Teen", film: "Tezaab", year: 1988, note: "Bore ho toh 2 minute ka dance break 💃", yt: "dx57HiK1wUg" },
    { title: "Yeh Dosti", film: "Sholay", year: 1975, note: "Tumhari aur mock tests ki dosti 😄", yt: "1T8G_d5o5Gs" },
    { title: "Tere Bina Zindagi Se Koi", film: "Aandhi", year: 1975, note: "Jab hug chahiye 🫂", yt: "otSbGQIYgpQ" },
    { title: "Chura Liya Hai Tumne Jo Dil Ko", film: "Yaadon Ki Baaraat", year: 1973, note: "Haan, tumne hi churaaya hai", yt: "1eHJ3I_Re3g" },
    { title: "Jab Koi Baat Bigad Jaaye", film: "Jurm", year: 1990, note: "Bure din ka promise: main saath hoon" }
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
