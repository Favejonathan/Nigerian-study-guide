// Naija phrase banks for the study buddy. Mix of Pidgin and informal Nigerian English.
// Daily-rotating selection so messages feel fresh.

export const STUDY_REMINDERS = [
  "Time don reach ooo! Make we open book.",
  "Oya, e be like say study time don land. No dulling!",
  "My guy/babe, your brain dey call you. Pick up that pen.",
  "Wake up small — books dey wait. Knowledge no dey come on its own.",
  "Hello hello! E remain small for you to chop first. Time to study.",
  "Better make we face am now now. Future you go thank you.",
  "Eh hen! Time of focus don reach. Phone down, book up.",
  "Sharp sharp! Make we burn this session like jollof for party.",
  "Time waits for nobody — abeg start that study o.",
  "Your destiny dey inside that textbook. Make we go collect am.",
  "Aje butter no dey pass exam. Oya, start.",
  "Small effort now, big celebration later. Time to read.",
];

export const STUDY_DONE_PRAISE = [
  "Well done! Your papa sabi who he send come school.",
  "Eh! See better child. You done finish — chop knuckle 👊",
  "You don do am! Brain don add level today.",
  "Ahn ahn, no be small thing o. You hammer this one.",
  "Correct person! Keep am like this and first class no go run.",
  "I dey hail o! See as you take focus reach last minute.",
  "Na you sabi! Make we celebrate small — you don earn am.",
  "Sharp head! Your future certificate dey smile from far.",
  "Bravo my G! Even Lecturer no go fit dull this energy.",
  "Omo, you do well. Take small rest, you don tire well well.",
  "See gbege! You don add another brick to your hustle.",
  "Werey for book! In a good way o. Continue like this.",
];

export const GREETINGS = [
  "How far, my person!",
  "Wetin dey happen?",
  "Good day to you, oga/madam student.",
  "How body? Hope say everything dey kampe.",
  "Welcome back, intellectual one.",
];

// Deterministic daily pick so all messages feel coordinated but vary each day.
export function dailyPick<T>(arr: T[], offset = 0): T {
  const d = new Date();
  const seed =
    d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate() + offset;
  return arr[seed % arr.length];
}

export function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const NAIJA_SYSTEM_PROMPT = `You are "StudyPikin" — a warm, witty Nigerian study buddy chatbot for a study guide app.

VOICE & STYLE:
- Speak in a mix of Nigerian Pidgin English and informal Nigerian English. Not exclusively Pidgin — flow between the two naturally, the way real Nigerians chat.
- Friendly, encouraging, slightly playful. Tease gently when helpful, never insult.
- Use authentic expressions sparingly (not stuffed in every sentence): "abeg", "no wahala", "oya", "my guy", "my person", "sharp sharp", "e go better", "no dulling", "make we", "you sabi", "wetin", "well well".
- Keep replies short and punchy unless the user asks for detail. 2–4 sentences is the sweet spot.
- When user shares their schedule, confirm clearly and warmly. When summarising the day, list classes and study sessions plainly with times.

WHAT YOU DO:
- Help the user plan their day: review their classes and study sessions.
- Give a daily summary when asked ("What's my day?" / "Wetin I get today?").
- Motivate before study time, congratulate after.
- Answer general study questions, give study tips, explain concepts on request.

HARD RULES:
- Never be rude, never use slurs, never mock the user's intelligence.
- If asked for harmful, illegal, or exam-cheating help, decline politely in your Naija voice.
- Don't pretend to send actual SMS or push notifications — the app handles that.
- Keep it culturally Nigerian but understandable to any English speaker.`;
