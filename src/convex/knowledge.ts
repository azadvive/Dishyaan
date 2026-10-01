import { EXPLORE_TRACKS, PROGRAMS, EXAM_PROGRAMS } from "../data/catalog";
import { MENTORS } from "../data/mentors";
import { PLANS, inr } from "../data/plans";
import { FAQS } from "../data/site";

/**
 * The assistant's grounded knowledge. Everything here is real Dishayaan content,
 * so the AI recommends what the platform actually offers instead of inventing
 * courses, prices or mentors.
 */
export const AI_KNOWLEDGE = `You are Dishayaan AI, the first guide for students of Class 6-12 and their parents.

TONE
- Warm, specific and honest. Never hype. Never promise ranks, selections or outcomes.
- Short paragraphs. At most 4 sentences plus a short bullet list.
- Always end by naming one concrete next step inside Dishayaan.
- You are a guide, not a replacement for a mentor. If the student seems unsure, suggest talking to a human mentor.

PLATFORM LAYERS
1. Explore the future: ${EXPLORE_TRACKS.map((t) => t.short).join(", ")}.
2. Prepare for a goal: ${EXAM_PROGRAMS.map((e) => e.name).join(", ")}.
3. Find your direction: Path Finder, mentor matching, a personal 90-day goal charter.

PROGRAMMES
${PROGRAMS.map((p) => `- ${p.title} (${p.classRange}, ${p.durationWeeks} weeks, ${p.mode}): ${p.summary}`).join("\n")}

PLANS
${PLANS.map((p) => `- ${p.name} — ${inr(p.priceInr)} ${p.billingPeriod === "monthly" ? "per month" : "one-time"}. Best for: ${p.bestFor} Includes: ${p.features.slice(0, 3).join("; ")}.`).join("\n")}

MENTOR SEATS (profiles are still being verified — never state a mentor's employer, college or years of experience)
${MENTORS.map((m) => `- ${m.role}: ${m.expertise.join(", ")}. Helps with ${m.helpsWith.join("; ")}. Available ${m.availability}.`).join("\n")}

FAQ
${FAQS.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n")}

RULES
- Never invent prices, mentors, colleges, employers, testimonials or exam results.
- The Path Finder is an exploration tool, never a prediction of a student's future.
- If asked something outside Dishayaan's scope, say so plainly and offer the closest real option.
- When a student seems ready to commit, recommend either the Plans page or a free mentor conversation.`;

interface GuidedRule {
  match: RegExp;
  answer: string;
}

const GUIDED_RULES: GuidedRule[] = [
  {
    match: /robotic|robot|arduino|microcontroller/i,
    answer:
      "Robotics is one of the strongest places to start because every week ends with something physical. In v1 you would join the Robotics Starter Lab or the Autonomous Systems Lab and build an obstacle-avoiding robot, then a line follower, then a small robotic arm. The skills underneath are circuits, sensors, microcontroller programming and control logic.\n\nNext step: run the Path Finder so we can see whether you lean hardware or software, then take one free conversation with a Robotics mentor.",
  },
  {
    match: /drone|uav|flight|aerial/i,
    answer:
      "Drone Technology & Flight Systems covers aerodynamics, flight controllers, telemetry and Indian drone regulation, taught through simulation before any supervised flying. You would plan a real mapping mission as your project.\n\nNext step: share your class on the enquiry form and we will slot you into the drone track — most students start it around Class 8 onwards.",
  },
  {
    match: /ai\b|artificial intelligence|machine learning|ml\b|generative/i,
    answer:
      "Start with AI & Machine Learning Foundations: you learn how a model learns, prepare a real dataset, then ship a working project like an image classifier or a study-buddy chatbot. If that lands well, the Generative AI Builder Lab takes you into APIs, embeddings and evaluation.\n\nNext step: tell me your class and I will point you at the right entry level, or book a free conversation with an Applied AI mentor.",
  },
  {
    match: /stock|share market|trading|invest|finance|portfolio/i,
    answer:
      "Our Stock Market, Trading & Financial Literacy track teaches discipline first: reading financial statements, understanding market mechanics, chart basics and position-sizing rules. All trading practice is paper trading with a written thesis for every position — never tips or signals.\n\nNext step: start the track and keep a paper portfolio for a term, then review it with a Markets mentor.",
  },
  {
    match: /jee|iit/i,
    answer:
      "The IIT-JEE pathway pairs subject mentors with an exam-planning mentor. You get a chapter map tied to the exam calendar, weekly problem labs, doubt clinics and a mock analysis that feeds back into your error journal. Parents see the same progress board.\n\nNext step: send an enquiry with your current class so we can check the foundation first, then book a free mentor conversation.",
  },
  {
    match: /neet|medical|doctor|biology/i,
    answer:
      "NEET preparation here is NCERT-anchored biology with diagram-first learning and spaced revision, plus accuracy tracking under time. The Biotechnology track is a good companion if you want lab and bioinformatics exposure alongside the syllabus.\n\nNext step: book a free conversation with a NEET mentor — they will check your recall system before recommending a plan.",
  },
  {
    match: /nda|defence|army|navy|air force/i,
    answer:
      "NDA preparation holds academics and physical readiness together: maths and general ability, mock tests, plus SSB interview and personality preparation. The mentor reviews the written score and the routine in the same session.\n\nNext step: tell us your class and preferred service, then talk to the NDA mentor.",
  },
  {
    match: /parent|my child|my son|my daughter/i,
    answer:
      "You can see exactly what your child is doing: sessions attended, projects in progress, mentor feedback, skills being built and the next recommended step. Dishayaan exists so parents do not have to guess what happens after school hours.\n\nNext step: submit the enquiry form as a parent. We will do a free 20-minute call to understand your child's interests before recommending any plan.",
  },
  {
    match: /plan|price|fee|cost|payment|pay/i,
    answer:
      "There are five plans: Explore at ₹1,499/month, Mentorship at ₹4,999/month, Specialized Projects at ₹7,499/month, Exam Preparation at ₹6,499/month, and a one-time Goal Sprint at ₹3,499. Every plan can be paid for online from the Plans page and the first seven days are refundable.\n\nNext step: open the Plans page and compare what each one includes, or ask a mentor which fits your goal.",
  },
  {
    match: /path ?finder|confused|not sure|don't know|dont know|which field|career/i,
    answer:
      "That is exactly what the Path Finder is for. It asks about your class, subjects, interests and how you like solving problems, then shows areas you may want to explore — with strengths as percentages. It is an exploration tool, not a prediction of your future.\n\nNext step: run the Path Finder, then bring the result to a mentor conversation so it turns into an actual plan.",
  },
  {
    match: /mentor|teacher|guidance|guide/i,
    answer:
      "Mentors are matched by domain, language and schedule. Every mentor seat lists what it covers and when it is available, and profiles publish with a 2-minute introduction video once verification is complete.\n\nNext step: start a free conversation with a mentor — we will match you based on everything you explored here.",
  },
  {
    match: /project|build|portfolio/i,
    answer:
      "Every Dishayaan track ends in something built, not just understood. Project briefs include an image classifier, a line-following rover, a drone mapping mission, a bioinformatics exploration and a paper-trading portfolio with a written thesis.\n\nNext step: pick the domain that excites you and we will pick a project sized for your class.",
  },
];

export function guidedAnswer(message: string, studentClass?: string): string {
  const rule = GUIDED_RULES.find((r) => r.match.test(message));
  const classLine = studentClass ? ` Noting that you are in ${studentClass}.` : "";
  if (rule) {
    return `${rule.answer}${classLine}`;
  }
  return `Dishayaan brings together three things: exploring emerging fields like AI, Machine Learning, Robotics, Drone Technology, Computer Science and Stock Market literacy; preparing for a specific exam such as JEE, NEET, NDA, CS or CMA; and finding your direction through the Path Finder and human mentorship.${classLine}\n\nTell me what you are most curious about — or which goal you are aiming at — and I will point you at the right track. If you would rather talk it through with a person, a free mentor conversation is always available.`;
}
