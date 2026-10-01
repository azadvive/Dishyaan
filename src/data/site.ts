import type { Faq, PartnerType, StudentProject, Testimonial } from "../types";

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Catalogue", to: "/catalog" },
  { label: "Mentors", to: "/mentors" },
  { label: "Community", to: "/community" },
  { label: "Plans", to: "/plans" },
];

export const SECONDARY_LINKS = [
  { label: "Book a one-to-one session", to: "/book" },
  { label: "Path Finder", to: "/pathfinder" },
  { label: "About Us", to: "/about" },
  { label: "For schools & centres", to: "/partners" },
];

export const JOURNEY_STEPS = [
  {
    id: "01",
    title: "Discover",
    body: "A short Path Finder conversation about interests, subjects and what you actually enjoy doing after school hours.",
  },
  {
    id: "02",
    title: "Diagnose",
    body: "We check where you genuinely are — concepts, habits, accuracy and time available each week.",
  },
  {
    id: "03",
    title: "Match",
    body: "You are matched with a mentor seat in the right domain, language and schedule slot.",
  },
  {
    id: "04",
    title: "Learn",
    body: "A structured path with weekly sessions, concept support and revision systems you can sustain.",
  },
  {
    id: "05",
    title: "Build",
    body: "Every learner ships projects. Robotics rigs, AI models, drone missions, research notes or market studies.",
  },
  {
    id: "06",
    title: "Achieve",
    body: "Progress is reviewed against the goal charter, the roadmap updates, and parents see the same picture.",
  },
];

export const FAQS: Faq[] = [
  {
    q: "Is DishaYaaN a coaching institute?",
    a: "No. DishaYaaN is a mentorship and future-readiness platform. Exam preparation is one layer of it; exploration, projects, career discovery and human mentorship sit alongside it.",
  },
  {
    q: "Which classes do you work with?",
    a: "Students from Class 6 to Class 12. Exploration tracks start from Class 6, technology labs from around Class 7–8, and exam pathways from Class 9 upwards.",
  },
  {
    q: "What exactly can my child explore in v1?",
    a: "Artificial Intelligence and Machine Learning, Robotics, Drone Technology, Computer Science, Stock Market & Trading, plus Biotechnology, Physics, Engineering, Research and Entrepreneurship exploration tracks.",
  },
  {
    q: "Does the Path Finder predict my future?",
    a: "It does not, and we will never claim that. It is an exploration tool: it shows which areas you may enjoy exploring next and gives a mentor something concrete to talk with you about.",
  },
  {
    q: "How does the AI assistant relate to a real mentor?",
    a: "DishaYaaN AI helps you explore quickly and asks the right context questions. It never replaces a human mentor — every AI conversation ends with an option to talk to a person.",
  },
  {
    q: "What do parents actually get to see?",
    a: "A progress view covering sessions attended, projects in flight, mentor feedback, skills being built and the next recommended step. Parents see the same roadmap the student does.",
  },
  {
    q: "How does payment work?",
    a: "Plans are billed monthly, with a one-time option for the twelve-week Goal Sprint. You pay online from the Plans page and receive a receipt; nothing is charged without your knowledge.",
  },
  {
    q: "How do bookings and scheduling work?",
    a: "Pick a domain, a format and a slot on the booking page. The request lands with the mentor-matching team, you get a confirmation on WhatsApp, and the session appears in your dashboard with everything the mentor already knows about you.",
  },
  {
    q: "Can students publish their own work?",
    a: "Yes. Every learner can post an update, upload a file or an image, and comment on other students' posts in the community area. Posts are visible to the DishaYaaN community and to mentors.",
  },
  {
    q: "Who can see my work and my conversations?",
    a: "Your posts are visible to the community and to mentors. Your private sessions, bookings and payment records are visible only to you, your mentor and the DishaYaaN team.",
  },
  {
    q: "We are a school or coaching centre. Can we partner?",
    a: "Yes. DishaYaaN runs alongside institutions as an add-on lab, a mentor pool or a future-readiness programme. Send a requirement through the partnership form and we will scope it with you.",
  },
  {
    q: "What if the plan is not right for us?",
    a: "Tell us inside the first seven days and we will refund the current period. We would rather fix the mismatch than keep a fee that is not earning its place.",
  },
];

export const PARTNER_TYPES: PartnerType[] = [
  {
    id: "schools",
    name: "Schools",
    line: "Add future-readiness without adding timetable pressure.",
    detail:
      "AI, robotics, drone and financial-literacy labs delivered inside your school calendar, with mentors provided by DishaYaaN and progress reported to your academic team.",
    icon: "school",
    accent: "blue",
  },
  {
    id: "colleges",
    name: "Colleges & Universities",
    line: "Bridge the gap between syllabus and industry practice.",
    detail:
      "Project-based cohorts, industry mentor pools and research-readiness modules for undergraduate and pre-final year students.",
    icon: "graduation-cap",
    accent: "violet",
  },
  {
    id: "coaching",
    name: "Coaching Centres",
    line: "Keep your academic strength. Add the missing future layer.",
    detail:
      "Your faculty handle the exam pedagogy; DishaYaaN adds exploration tracks, project labs and mentor matching on top of what you already run.",
    icon: "building",
    accent: "cyan",
  },
  {
    id: "ngos",
    name: "NGOs & Community Labs",
    line: "Reach students who have ambition but not exposure.",
    detail:
      "Sponsored seats, low-bandwidth delivery and mentor time donated by the DishaYaaN network for students in government and aided schools.",
    icon: "heart-handshake",
    accent: "green",
  },
];

export const STUDENT_PROJECTS: StudentProject[] = [
  {
    id: "proj-1",
    title: "Sign-language letter recogniser",
    student: "Example student project",
    studentClass: "Class 10",
    problem:
      "A student wanted a way for their younger sibling to practise sign-language letters without a teacher present.",
    solution:
      "A camera-based classifier that recognises hand shapes and shows the letter with a confidence score.",
    stack: ["Python", "Computer vision", "Model training"],
    mentor: "Applied AI & Machine Learning Mentor",
    learned: "Data quality matters more than model choice — the first dataset was unusable.",
    accent: "blue",
    isExample: true,
  },
  {
    id: "proj-2",
    title: "Line-following rover with sensor fusion",
    student: "Example student project",
    studentClass: "Class 9",
    problem:
      "A rover kept losing the track on curves because a single sensor was not enough.",
    solution:
      "Three sensors combined with a weighted control rule, tuned with a mentor over four sessions.",
    stack: ["Arduino", "IR sensors", "Control logic"],
    mentor: "Robotics & Embedded Systems Mentor",
    learned: "Debugging is a method, not luck. The build log showed exactly where it drifted.",
    accent: "violet",
    isExample: true,
  },
  {
    id: "proj-3",
    title: "Village mapping flight plan",
    student: "Example student project",
    studentClass: "Class 11",
    problem:
      "A student wanted to understand how aerial surveys are actually planned for real terrain.",
    solution:
      "A simulated mapping mission with waypoints, altitude bands, overlap percentage and a safety checklist.",
    stack: ["Flight simulation", "Mission planning", "Regulation research"],
    mentor: "Drone Technology & Flight Systems Mentor",
    learned: "Regulation and safety come before flying — and they are part of the engineering.",
    accent: "cyan",
    isExample: true,
  },
  {
    id: "proj-4",
    title: "A paper-trading portfolio with a written thesis",
    student: "Example student project",
    studentClass: "Class 12",
    problem:
      "A student was interested in markets but had no process beyond looking at price movement.",
    solution:
      "A five-stock paper portfolio with research notes, position sizing rules and a weekly review sheet.",
    stack: ["Financial statements", "Risk rules", "Spreadsheets"],
    mentor: "Markets, Trading & Financial Literacy Mentor",
    learned: "Writing down why you bought something is the whole discipline.",
    accent: "green",
    isExample: true,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Parent testimonials publish here after the first cohort completes a full term and gives written consent to being quoted.",
    author: "Parent story coming soon",
    context: "First DishaYaaN cohort in progress",
    placeholder: true,
  },
  {
    quote:
      "Student stories publish here after the first cohort completes a full term and consents to being quoted.",
    author: "Student story coming soon",
    context: "First DishaYaaN cohort in progress",
    placeholder: true,
  },
  {
    quote:
      "Mentor notes publish here once verification is complete and the mentor approves the wording.",
    author: "Mentor note coming soon",
    context: "Mentor verification in progress",
    placeholder: true,
  },
];

export const AI_STARTERS = [
  "I'm confused about my career",
  "I want to explore AI & ML",
  "I want to learn Robotics",
  "I want Drone Technology",
  "I want stock market guidance",
  "I want JEE guidance",
  "I want NEET guidance",
  "I'm a parent",
  "Help me choose a plan",
];

export const AI_CHIPS = [
  "Robotics starter plan for Class 8",
  "Is AI a good fit for me?",
  "How do I start paper trading?",
  "JEE vs NEET planning",
  "Drone careers in India",
  "What should I build first?",
];
