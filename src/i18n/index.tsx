import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * DishaYaaN language layer.
 *
 * English is the source of truth: every key exists in `EN`, and a language only
 * overrides the keys it has translated. Anything missing falls back to English
 * automatically, so the product stays complete in every locale while
 * translations land incrementally.
 */

export const LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "or", name: "Odia (Oriya)", native: "ଓଡ଼ିଆ" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export function isLanguageCode(value: unknown): value is LanguageCode {
  return LANGUAGES.some((language) => language.code === value);
}

export const EN = {
  // Navigation & chrome
  "nav.home": "Home",
  "nav.catalog": "Catalogue",
  "nav.mentors": "Mentors",
  "nav.community": "Community",
  "nav.plans": "Plans",
  "nav.pathfinder": "Path Finder",
  "nav.about": "About Us",
  "nav.partners": "For schools & centres",
  "nav.bookSession": "Book a one-to-one session",
  "nav.askAi": "Ask DishaYaaN AI",
  "nav.askAiShort": "Ask AI",
  "nav.talkToMentor": "Talk to a Mentor",
  "nav.connectMentor": "Connect with mentor",
  "nav.login": "Login",
  "nav.dashboard": "My dashboard",
  "nav.account": "Account",
  "nav.more": "More",
  "nav.openMenu": "Open menu",
  "nav.closeMenu": "Close menu",
  "lang.label": "Language",

  // Hero
  "hero.eyebrow": "Mentorship × Technology × Career × Exams",
  "hero.titleTop": "Your Future Is",
  "hero.titleHighlight": "Bigger Than",
  "hero.titleBottom": "Your Syllabus.",
  "hero.lead":
    "DishaYaaN is a mentorship programme for students of Class 6–12: one-to-one counselling, emerging technology, real projects and honest guidance from mentors who have walked the path.",
  "hero.ctaDiscover": "Discover Your Path",
  "hero.ctaMentors": "Meet Our Mentors",
  "hero.trustStudents": "Guidance for students",
  "hero.trustParents": "Visibility for parents",
  "hero.trustMentors": "Perspective from mentors",
  "hero.bookOneToOne": "Book a one-to-one session →",
  "hero.exploring": "Exploring:",
  "hero.exploringHint": "— read the details beside the network.",
  "hero.networkLabel": "Future path network — hover a node",
  "hero.pathsSuffix": "paths",
  "hero.networkNote":
    "Every node is a real DishaYaaN track. Hover to see the skills and projects inside it. On phones and low-power devices this renders as a lighter 2D map so the page stays fast.",
  "hero.loading3d": "Loading 3D network…",

  // Footer
  "footer.intro":
    "Your future is bigger than your syllabus. DishaYaaN helps students of Class 6–12 explore emerging technology, prepare for real goals and learn from mentors who have walked the path.",
  "footer.colExplore": "Explore",
  "footer.colStudents": "Students",
  "footer.colParents": "Parents",
  "footer.colInstitutions": "Institutions",
  "footer.colCompany": "Company",
  "footer.colLegal": "Legal",
  "footer.linkProgrammes": "Programmes",
  "footer.linkMentors": "Mentors",
  "footer.linkPlans": "Plans & pricing",
  "footer.linkAbout": "About Us",
  "footer.linkPathFinder": "Path Finder",
  "footer.linkCatalog": "Course & exam catalogue",
  "footer.linkAskMentor": "Ways to ask a mentor",
  "footer.linkDashboard": "My dashboard",
  "footer.linkParentGuide": "Parent guide",
  "footer.linkProgress": "Progress visibility",
  "footer.linkTalkMentor": "Talk to a mentor",
  "footer.linkFees": "Fees & payment",
  "footer.linkSchools": "Schools",
  "footer.linkColleges": "Colleges",
  "footer.linkCoaching": "Coaching centres",
  "footer.linkPartner": "Partner with us",
  "footer.linkAboutBrand": "About DishaYaaN",
  "footer.linkRequirement": "Requirement form",
  "footer.linkContact": "Contact",
  "footer.linkCareers": "Careers",
  "footer.linkPrivacy": "Privacy",
  "footer.linkTerms": "Terms",
  "footer.linkRefund": "Refund policy",
  "footer.bookFree": "Book a free session",
  "footer.rights": "© {year} DishaYaaN. Built for students, parents and mentors.",
  "footer.verification":
    "Mentor profiles, testimonials and student stories publish only after verification and consent.",

  // Home sections
  "home.audience.eyebrow": "Start here",
  "home.audience.title": "Who are you exploring DishaYaaN for?",
  "home.audience.lead":
    "The answer changes what we show you first — a student needs possibilities, a parent needs visibility.",
  "home.tracks.eyebrow": "Future exploration",
  "home.tracks.title1": "Don't choose your future too early.",
  "home.tracks.title2": "Explore it first.",
  "home.tracks.lead":
    "Ten ecosystems, each with real skills, real projects and a mentor who works in it. Pick one to see what it actually contains.",
  "home.catalog.eyebrow": "Course & exam catalogue",
  "home.catalog.title": "Three layers. One clear path.",
  "home.catalog.lead":
    "Most students are handed a random list of courses. DishaYaaN is organised so you always know which layer you are standing in.",
  "home.mentors.eyebrow": "Mentorship",
  "home.mentors.title": "Learn from people who've walked the path.",
  "home.mentors.lead":
    "Mentors are matched by domain, language and schedule. Every seat below lists exactly what it covers — and publishes a 2-minute introduction once the mentor completes verification.",
  "home.projects.eyebrow": "Project-based learning",
  "home.projects.title": "Don't just learn. Build.",
  "home.projects.lead":
    "Every track ends in something that exists. Here is the shape of a DishaYaaN project: a problem, a build, a mentor, and a lesson you keep.",
  "home.journey.eyebrow": "How DishaYaaN works",
  "home.journey.title": "Six steps, in this order, every time.",
  "home.journey.lead": "No student is dropped into content. The sequence is the product.",
  "home.parents.eyebrow": "Parent experience",
  "home.parents.title": "Parents shouldn't have to guess what their child is learning.",
  "home.parents.lead":
    "You see the same picture your child does: what was attended, what is being built, what the mentor observed, and what comes next.",
  "home.partners.eyebrow": "Institution collaboration",
  "home.partners.title": "Schools, colleges and coaching centres — let's build the layer you don't have.",
  "home.partners.lead":
    "DishaYaaN runs alongside your institution: we bring the mentors, labs and future-readiness pathways, you keep your academic strength.",
  "home.voices.eyebrow": "Social proof",
  "home.voices.title": "We would rather show nothing than show fake proof.",
  "home.voices.lead":
    "DishaYaaN's first cohort is in progress. These slots fill with real, consented voices as soon as we have them.",
  "home.faq.eyebrow": "Questions",
  "home.faq.title": "Straight answers.",
  "home.faq.lead": "If your question is not here, ask DishaYaaN AI or a mentor directly.",
  "home.final.eyebrow": "Your next step",
  "home.final.title": "Your next step can start here.",
  "home.final.lead":
    "Two minutes to tell us what you need. Or skip the form and have a free conversation with a mentor who works in the field you are curious about.",
  "home.final.connect": "Connect with a mentor",
  "home.final.compare": "Compare plans",
  "home.final.pathfinder": "Run the Path Finder",
  "home.final.aside": "What happens after you reach out",
  "home.final.step1": "We read what you sent — a person, not an autoresponder.",
  "home.final.step2": "A mentor in your domain messages you on WhatsApp within a day.",
  "home.final.step3": "You get a free 20-minute conversation before any payment.",
  "home.final.step4": "If DishaYaaN is not the right fit, we will say so.",
  "home.demand.eyebrow": "Tell us what you need",
  "home.demand.title":
    "We are building DishaYaaN around students and parents — not assumptions.",
  "home.demand.lead":
    "Every answer here goes into what we design next: which programmes exist, what earns trust, and what parents actually want to see.",
  "home.ai.eyebrow": "DishaYaaN AI",
  "home.ai.title": "Your first guide to what comes next.",
  "home.ai.lead":
    "Ten free questions to explore domains, plans and pathways. DishaYaaN AI asks about your class and interests so its answers are useful — and every conversation ends with the option to speak to a human.",
} as const;

export type TranslationKey = keyof typeof EN;

type TranslationTable = Partial<Record<TranslationKey, string>>;

const HI: TranslationTable = {
  "nav.home": "होम",
  "nav.catalog": "कोर्स सूची",
  "nav.mentors": "मेंटर",
  "nav.community": "समुदाय",
  "nav.plans": "प्लान",
  "nav.pathfinder": "पाथ फाइंडर",
  "nav.about": "हमारे बारे में",
  "nav.partners": "स्कूल और संस्थान",
  "nav.bookSession": "वन-टू-वन सत्र बुक करें",
  "nav.askAi": "DishaYaaN AI से पूछें",
  "nav.askAiShort": "AI से पूछें",
  "nav.talkToMentor": "मेंटर से बात करें",
  "nav.connectMentor": "मेंटर से जुड़ें",
  "nav.login": "लॉग इन",
  "nav.dashboard": "मेरा डैशबोर्ड",
  "nav.account": "खाता",
  "nav.more": "और",
  "nav.openMenu": "मेन्यू खोलें",
  "nav.closeMenu": "मेन्यू बंद करें",
  "lang.label": "भाषा",
  "hero.eyebrow": "मार्गदर्शन × तकनीक × करियर × परीक्षाएँ",
  "hero.titleTop": "आपका भविष्य",
  "hero.titleHighlight": "आपके सिलेबस से बड़ा",
  "hero.titleBottom": "है।",
  "hero.lead":
    "DishaYaaN कक्षा 6–12 के विद्यार्थियों के लिए एक मेंटरशिप कार्यक्रम है: वन-टू-वन काउंसलिंग, उभरती तकनीक, असली प्रोजेक्ट और उन मेंटरों से ईमानदार मार्गदर्शन जो यह रास्ता खुद चल चुके हैं।",
  "hero.ctaDiscover": "अपना रास्ता खोजें",
  "hero.ctaMentors": "हमारे मेंटर से मिलें",
  "hero.trustStudents": "विद्यार्थियों के लिए मार्गदर्शन",
  "hero.trustParents": "अभिभावकों के लिए पारदर्शिता",
  "hero.trustMentors": "मेंटरों का दृष्टिकोण",
  "hero.bookOneToOne": "वन-टू-वन सत्र बुक करें →",
  "hero.exploring": "देख रहे हैं:",
  "hero.exploringHint": "— बगल के नेटवर्क में ब्यौरा पढ़ें।",
  "hero.networkLabel": "भविष्य का पाथ नेटवर्क — किसी नोड पर हॉवर करें",
  "hero.pathsSuffix": "रास्ते",
  "hero.networkNote":
    "हर नोड DishaYaaN का असली ट्रैक है। उसमें मौजूद कौशल और प्रोजेक्ट देखने के लिए हॉवर करें। फ़ोन और कम-शक्ति वाले डिवाइस पर यह हल्का 2D नक्शा बनकर पेज को तेज़ रखता है।",
  "hero.loading3d": "3D नेटवर्क लोड हो रहा है…",
  "footer.intro":
    "आपका भविष्य आपके सिलेबस से बड़ा है। DishaYaaN कक्षा 6–12 के विद्यार्थियों को उभरती तकनीक समझने, असली लक्ष्यों की तैयारी करने और उन मेंटरों से सीखने में मदद करता है जो यह रास्ता खुद चल चुके हैं।",
  "footer.colExplore": "जानें",
  "footer.colStudents": "विद्यार्थी",
  "footer.colParents": "अभिभावक",
  "footer.colInstitutions": "संस्थान",
  "footer.colCompany": "कंपनी",
  "footer.colLegal": "कानूनी",
  "footer.linkProgrammes": "कार्यक्रम",
  "footer.linkMentors": "मेंटर",
  "footer.linkPlans": "प्लान और शुल्क",
  "footer.linkAbout": "हमारे बारे में",
  "footer.linkPathFinder": "पाथ फाइंडर",
  "footer.linkCatalog": "कोर्स और परीक्षा सूची",
  "footer.linkAskMentor": "मेंटर से पूछने के तरीके",
  "footer.linkDashboard": "मेरा डैशबोर्ड",
  "footer.linkParentGuide": "अभिभावक गाइड",
  "footer.linkProgress": "प्रगति की जानकारी",
  "footer.linkTalkMentor": "मेंटर से बात करें",
  "footer.linkFees": "शुल्क और भुगतान",
  "footer.linkSchools": "स्कूल",
  "footer.linkColleges": "कॉलेज",
  "footer.linkCoaching": "कोचिंग सेंटर",
  "footer.linkPartner": "हमारे साथ साझेदारी",
  "footer.linkAboutBrand": "DishaYaaN के बारे में",
  "footer.linkRequirement": "ज़रूरत फ़ॉर्म",
  "footer.linkContact": "संपर्क",
  "footer.linkCareers": "करियर",
  "footer.linkPrivacy": "गोपनीयता",
  "footer.linkTerms": "शर्तें",
  "footer.linkRefund": "रिफ़ंड नीति",
  "footer.bookFree": "निःशुल्क सत्र बुक करें",
  "footer.rights": "© {year} DishaYaaN. विद्यार्थियों, अभिभावकों और मेंटरों के लिए बनाया गया।",
  "footer.verification":
    "मेंटर प्रोफ़ाइल, प्रशंसापत्र और विद्यार्थी कहानियाँ सत्यापन और सहमति के बाद ही प्रकाशित होती हैं।",
  "home.audience.eyebrow": "यहाँ से शुरू करें",
  "home.audience.title": "आप DishaYaaN किसके लिए देख रहे हैं?",
  "home.audience.lead":
    "इससे तय होता है कि हम पहले क्या दिखाएँ — विद्यार्थी को संभावनाएँ चाहिए, अभिभावक को पारदर्शिता।",
  "home.tracks.eyebrow": "भविष्य की खोज",
  "home.tracks.title1": "अपना भविष्य इतनी जल्दी मत चुनो।",
  "home.tracks.title2": "पहले उसे खोजो।",
  "home.tracks.lead":
    "दस इकोसिस्टम, हर एक में असली कौशल, असली प्रोजेक्ट और उसी क्षेत्र का मेंटर। किसी एक को चुनकर देखें कि उसमें असल में क्या है।",
  "home.catalog.eyebrow": "कोर्स और परीक्षा सूची",
  "home.catalog.title": "तीन परतें। एक साफ़ रास्ता।",
  "home.catalog.lead":
    "ज़्यादातर विद्यार्थियों को कोर्सों की बेतरतीब सूची दी जाती है। DishaYaaN ऐसे बना है कि आपको हमेशा पता रहे कि आप किस परत पर खड़े हैं।",
  "home.mentors.eyebrow": "मेंटरशिप",
  "home.mentors.title": "उन लोगों से सीखें जो यह रास्ता चल चुके हैं।",
  "home.mentors.lead":
    "मेंटर क्षेत्र, भाषा और समय के हिसाब से मिलाए जाते हैं। नीचे हर सीट पर साफ़ लिखा है कि उसमें क्या शामिल है — और मेंटर सत्यापन पूरा होते ही 2 मिनट का परिचय प्रकाशित होता है।",
  "home.projects.eyebrow": "प्रोजेक्ट-आधारित शिक्षा",
  "home.projects.title": "सिर्फ़ पढ़ो मत। बनाओ।",
  "home.projects.lead":
    "हर ट्रैक किसी ऐसी चीज़ पर खत्म होता है जो मौजूद होती है। DishaYaaN प्रोजेक्ट का ढाँचा यह है: एक समस्या, एक निर्माण, एक मेंटर, और एक सबक जो आपके पास रहता है।",
  "home.journey.eyebrow": "DishaYaaN कैसे काम करता है",
  "home.journey.title": "छह चरण, हर बार इसी क्रम में।",
  "home.journey.lead": "किसी विद्यार्थी को सीधे कंटेंट में नहीं छोड़ा जाता। यही क्रम ही उत्पाद है।",
  "home.parents.eyebrow": "अभिभावकों का अनुभव",
  "home.parents.title": "अभिभावकों को अंदाज़ा नहीं लगाना पड़े कि बच्चा क्या सीख रहा है।",
  "home.parents.lead":
    "आपको वही तस्वीर दिखती है जो आपके बच्चे को: क्या अटेंड हुआ, क्या बन रहा है, मेंटर ने क्या देखा और आगे क्या है।",
  "home.partners.eyebrow": "संस्थानों के साथ साझेदारी",
  "home.partners.title": "स्कूल, कॉलेज और कोचिंग सेंटर — जो परत आपके पास नहीं है, वह मिलकर बनाएँ।",
  "home.partners.lead":
    "DishaYaaN आपके संस्थान के साथ चलता है: मेंटर, लैब और भविष्य-तैयारी के रास्ते हम लाते हैं, अकादमिक मज़बूती आपकी रहती है।",
  "home.voices.eyebrow": "भरोसे की बात",
  "home.voices.title": "नकली सबूत दिखाने से बेहतर है कुछ न दिखाना।",
  "home.voices.lead":
    "DishaYaaN का पहला बैच चल रहा है। असली और सहमति वाली आवाज़ें मिलते ही ये जगहें भर जाएँगी।",
  "home.faq.eyebrow": "सवाल",
  "home.faq.title": "सीधे जवाब।",
  "home.faq.lead": "अगर आपका सवाल यहाँ नहीं है, तो DishaYaaN AI या सीधे किसी मेंटर से पूछें।",
  "home.final.eyebrow": "आपका अगला कदम",
  "home.final.title": "आपका अगला कदम यहीं से शुरू हो सकता है।",
  "home.final.lead":
    "दो मिनट में बताएँ कि आपको क्या चाहिए। या फ़ॉर्म छोड़कर उस मेंटर से निःशुल्क बात करें जो आपके रुचि के क्षेत्र में काम करता है।",
  "home.final.connect": "मेंटर से जुड़ें",
  "home.final.compare": "प्लान की तुलना करें",
  "home.final.pathfinder": "पाथ फाइंडर चलाएँ",
  "home.final.aside": "संपर्क करने के बाद क्या होता है",
  "home.final.step1": "आपका भेजा हुआ हम पढ़ते हैं — एक इंसान, ऑटो-रिप्लाई नहीं।",
  "home.final.step2": "आपके क्षेत्र का मेंटर एक दिन के भीतर WhatsApp पर संपर्क करता है।",
  "home.final.step3": "किसी भी भुगतान से पहले 20 मिनट की निःशुल्क बातचीत मिलती है।",
  "home.final.step4": "अगर DishaYaaN आपके लिए सही नहीं है, तो हम साफ़ कह देंगे।",
  "home.demand.eyebrow": "बताइए आपको क्या चाहिए",
  "home.demand.title":
    "हम DishaYaaN को विद्यार्थियों और अभिभावकों के इर्द-गिर्द बना रहे हैं — अनुमानों के इर्द-गिर्द नहीं।",
  "home.demand.lead":
    "यहाँ का हर जवाब तय करता है कि आगे क्या बनेगा: कौन-से कार्यक्रम हों, भरोसा किससे बनता है, और अभिभावक असल में क्या देखना चाहते हैं।",
  "home.ai.eyebrow": "DishaYaaN AI",
  "home.ai.title": "आगे क्या है, इसके लिए आपका पहला गाइड।",
  "home.ai.lead":
    "दस मुफ़्त सवाल, जिनसे आप क्षेत्र, प्लान और रास्ते समझ सकते हैं। DishaYaaN AI आपकी कक्षा और रुचियों के बारे में पूछता है ताकि जवाब काम के हों — और हर बातचीत के आखिर में किसी इंसान से बात करने का विकल्प मिलता है।",
};

const BN: TranslationTable = {
  "nav.home": "হোম",
  "nav.catalog": "কোর্স তালিকা",
  "nav.mentors": "মেন্টর",
  "nav.community": "কমিউনিটি",
  "nav.plans": "প্ল্যান",
  "nav.pathfinder": "পাথ ফাইন্ডার",
  "nav.about": "আমাদের সম্পর্কে",
  "nav.partners": "স্কুল ও প্রতিষ্ঠান",
  "nav.bookSession": "এক-এক করে সেশন বুক করুন",
  "nav.askAi": "DishaYaaN AI-কে জিজ্ঞাসা করুন",
  "nav.askAiShort": "AI-কে জিজ্ঞাসা করুন",
  "nav.talkToMentor": "মেন্টরের সঙ্গে কথা বলুন",
  "nav.connectMentor": "মেন্টরের সঙ্গে যুক্ত হোন",
  "nav.login": "লগ ইন",
  "nav.dashboard": "আমার ড্যাশবোর্ড",
  "nav.account": "অ্যাকাউন্ট",
  "nav.more": "আরও",
  "nav.openMenu": "মেনু খুলুন",
  "nav.closeMenu": "মেনু বন্ধ করুন",
  "lang.label": "ভাষা",
  "hero.eyebrow": "মেন্টরশিপ × প্রযুক্তি × ক্যারিয়ার × পরীক্ষা",
  "hero.titleTop": "তোমার ভবিষ্যৎ",
  "hero.titleHighlight": "সিলেবাসের চেয়ে বড়",
  "hero.titleBottom": "।",
  "hero.lead":
    "DishaYaaN ষষ্ঠ থেকে দ্বাদশ শ্রেণির শিক্ষার্থীদের জন্য একটি মেন্টরশিপ কর্মসূচি: এক-এক করে কাউন্সেলিং, উদীয়মান প্রযুক্তি, বাস্তব প্রকল্প এবং পথটা নিজে হেঁটে আসা মেন্টরদের সৎ দিশা।",
  "hero.ctaDiscover": "নিজের পথ খুঁজে নাও",
  "hero.ctaMentors": "আমাদের মেন্টরদের সঙ্গে পরিচিত হও",
  "hero.trustStudents": "শিক্ষার্থীদের জন্য দিশা",
  "hero.trustParents": "অভিভাবকদের জন্য স্বচ্ছতা",
  "hero.trustMentors": "মেন্টরদের দৃষ্টিভঙ্গি",
  "hero.bookOneToOne": "এক-এক করে সেশন বুক করুন →",
  "hero.exploring": "দেখছেন:",
  "hero.exploringHint": "— পাশের নেটওয়ার্কে বিস্তারিত পড়ুন।",
  "hero.networkLabel": "ভবিষ্যতের পথ-নেটওয়ার্ক — যেকোনো নোডে হোভার করুন",
  "hero.pathsSuffix": "পথ",
  "hero.networkNote":
    "প্রতিটি নোড DishaYaaN-এর সত্যিকারের ট্র্যাক। ভিতরের দক্ষতা ও প্রকল্প দেখতে হোভার করুন। ফোন ও কম ক্ষমতার ডিভাইসে এটি হালকা 2D ম্যাপ হিসেবে দেখায়, তাই পেজ দ্রুত থাকে।",
  "hero.loading3d": "3D নেটওয়ার্ক লোড হচ্ছে…",
  "footer.intro":
    "তোমার ভবিষ্যৎ তোমার সিলেবাসের চেয়ে বড়। DishaYaaN ষষ্ঠ থেকে দ্বাদশ শ্রেণির শিক্ষার্থীদের উদীয়মান প্রযুক্তি চিনতে, সত্যিকারের লক্ষ্যের জন্য তৈরি হতে এবং পথ হেঁটে আসা মেন্টরদের কাছ থেকে শিখতে সাহায্য করে।",
  "footer.colExplore": "দেখুন",
  "footer.colStudents": "শিক্ষার্থী",
  "footer.colParents": "অভিভাবক",
  "footer.colInstitutions": "প্রতিষ্ঠান",
  "footer.colCompany": "কোম্পানি",
  "footer.colLegal": "আইনি",
  "footer.linkProgrammes": "কর্মসূচি",
  "footer.linkMentors": "মেন্টর",
  "footer.linkPlans": "প্ল্যান ও ফি",
  "footer.linkAbout": "আমাদের সম্পর্কে",
  "footer.linkPathFinder": "পাথ ফাইন্ডার",
  "footer.linkCatalog": "কোর্স ও পরীক্ষার তালিকা",
  "footer.linkAskMentor": "মেন্টরকে জিজ্ঞাসার উপায়",
  "footer.linkDashboard": "আমার ড্যাশবোর্ড",
  "footer.linkParentGuide": "অভিভাবক গাইড",
  "footer.linkProgress": "অগ্রগতির স্বচ্ছতা",
  "footer.linkTalkMentor": "মেন্টরের সঙ্গে কথা বলুন",
  "footer.linkFees": "ফি ও পেমেন্ট",
  "footer.linkSchools": "স্কুল",
  "footer.linkColleges": "কলেজ",
  "footer.linkCoaching": "কোচিং সেন্টার",
  "footer.linkPartner": "আমাদের সঙ্গে পার্টনার হোন",
  "footer.linkAboutBrand": "DishaYaaN সম্পর্কে",
  "footer.linkRequirement": "প্রয়োজন ফর্ম",
  "footer.linkContact": "যোগাযোগ",
  "footer.linkCareers": "ক্যারিয়ার",
  "footer.linkPrivacy": "গোপনীয়তা",
  "footer.linkTerms": "শর্তাবলি",
  "footer.linkRefund": "রিফান্ড নীতি",
  "footer.bookFree": "বিনামূল্যে সেশন বুক করুন",
  "footer.rights": "© {year} DishaYaaN। শিক্ষার্থী, অভিভাবক ও মেন্টরদের জন্য তৈরি।",
  "footer.verification":
    "মেন্টর প্রোফাইল, প্রশংসাপত্র ও শিক্ষার্থীর গল্প যাচাই ও সম্মতির পরেই প্রকাশিত হয়।",
  "home.audience.eyebrow": "এখান থেকে শুরু",
  "home.audience.title": "DishaYaaN তুমি কার জন্য দেখছ?",
  "home.audience.lead":
    "উত্তরই ঠিক করে আমরা আগে কী দেখাব — শিক্ষার্থীর দরকার সম্ভাবনা, অভিভাবকের দরকার স্বচ্ছতা।",
  "home.tracks.eyebrow": "ভবিষ্যৎ অন্বেষণ",
  "home.tracks.title1": "ভবিষ্যৎ এত তাড়াতাড়ি বেছে নিও না।",
  "home.tracks.title2": "আগে সেটা ঘুরে দেখো।",
  "home.tracks.lead":
    "দশটি ইকোসিস্টেম, প্রতিটিতে বাস্তব দক্ষতা, বাস্তব প্রকল্প আর সেই ক্ষেত্রের একজন মেন্টর। একটি বেছে নিয়ে দেখো ভিতরে আসলে কী আছে।",
  "home.catalog.eyebrow": "কোর্স ও পরীক্ষার তালিকা",
  "home.catalog.title": "তিনটি স্তর। একটাই স্পষ্ট পথ।",
  "home.catalog.lead":
    "বেশিরভাগ শিক্ষার্থী এলোমেলো কোর্সের তালিকা পায়। DishaYaaN এমনভাবে সাজানো যে তুমি সবসময় জানো তুমি কোন স্তরে দাঁড়িয়ে আছ।",
  "home.mentors.eyebrow": "মেন্টরশিপ",
  "home.mentors.title": "যাঁরা পথটা হেঁটে এসেছেন, তাঁদের কাছ থেকে শেখো।",
  "home.mentors.lead":
    "মেন্টরদের মেলানো হয় বিষয়, ভাষা ও সময় অনুযায়ী। নিচের প্রতিটি সিটে লেখা আছে সেটিতে কী কী আছে — এবং মেন্টর যাচাই শেষ করলেই দুই মিনিটের পরিচিতি প্রকাশিত হয়।",
  "home.projects.eyebrow": "প্রকল্পভিত্তিক শিক্ষা",
  "home.projects.title": "শুধু শেখো না। বানাও।",
  "home.projects.lead":
    "প্রতিটি ট্র্যাক শেষ হয় এমন কিছুতে যা সত্যিই আছে। DishaYaaN প্রকল্পের ছাঁচ: একটি সমস্যা, একটি নির্মাণ, একজন মেন্টর আর একটি শিক্ষা যা তুমি ধরে রাখো।",
  "home.journey.eyebrow": "DishaYaaN কীভাবে কাজ করে",
  "home.journey.title": "ছয়টি ধাপ, প্রতি বার এই ক্রমেই।",
  "home.journey.lead": "কোনো শিক্ষার্থীকে সোজা কনটেন্টে ছাড়া হয় না। এই ক্রমটাই মূল পণ্য।",
  "home.parents.eyebrow": "অভিভাবকদের অভিজ্ঞতা",
  "home.parents.title": "সন্তান কী শিখছে, তা আন্দাজ করতে অভিভাবকদের না হয়।",
  "home.parents.lead":
    "আপনার সন্তানের মতো একই ছবি আপনি দেখেন: কী উপস্থিত হয়েছে, কী তৈরি হচ্ছে, মেন্টর কী লক্ষ্য করেছেন এবং এরপর কী।",
  "home.partners.eyebrow": "প্রতিষ্ঠানের সঙ্গে সহযোগিতা",
  "home.partners.title":
    "স্কুল, কলেজ ও কোচিং সেন্টার — যেই স্তরটি আপনার নেই, সেটি একসঙ্গে গড়ি।",
  "home.partners.lead":
    "DishaYaaN আপনার প্রতিষ্ঠানের সঙ্গে চলে: মেন্টর, ল্যাব ও ভবিষ্যৎ-প্রস্তুতির পথ আমরা আনি, শিক্ষার শক্তি আপনারই থাকে।",
  "home.voices.eyebrow": "ভরসার প্রমাণ",
  "home.voices.title": "নকল প্রমাণ দেখানোর চেয়ে কিছু না দেখানো ভালো।",
  "home.voices.lead":
    "DishaYaaN-এর প্রথম ব্যাচ চলছে। সত্যিকারের ও সম্মতিসম্মত কণ্ঠ পাওয়া মাত্রই এই জায়গাগুলো ভরে যাবে।",
  "home.faq.eyebrow": "প্রশ্ন",
  "home.faq.title": "সোজা উত্তর।",
  "home.faq.lead": "আপনার প্রশ্ন এখানে না থাকলে DishaYaaN AI-কে বা সরাসরি একজন মেন্টরকে জিজ্ঞাসা করুন।",
  "home.final.eyebrow": "আপনার পরের ধাপ",
  "home.final.title": "আপনার পরের ধাপ এখান থেকেই শুরু হতে পারে।",
  "home.final.lead":
    "দুই মিনিটে বলুন আপনার কী দরকার। অথবা ফর্ম ছেড়ে যে মেন্টর আপনার আগ্রহের ক্ষেত্রে কাজ করেন, তাঁর সঙ্গে বিনামূল্যে কথা বলুন।",
  "home.final.connect": "মেন্টরের সঙ্গে যুক্ত হোন",
  "home.final.compare": "প্ল্যান তুলনা করুন",
  "home.final.pathfinder": "পাথ ফাইন্ডার চালান",
  "home.final.aside": "যোগাযোগের পরে কী হয়",
  "home.final.step1": "আপনি যা পাঠিয়েছেন আমরা পড়ি — একজন মানুষ, কোনো অটো-রিপ্লাই নয়।",
  "home.final.step2": "আপনার ক্ষেত্রের একজন মেন্টর এক দিনের মধ্যে WhatsApp-এ যোগাযোগ করেন।",
  "home.final.step3": "কোনো পেমেন্টের আগেই ২০ মিনিটের বিনামূল্যে আলাপ হয়।",
  "home.final.step4": "DishaYaaN আপনার জন্য উপযুক্ত না হলে আমরা সেটা স্পষ্ট বলব।",
  "home.demand.eyebrow": "আপনার প্রয়োজন জানান",
  "home.demand.title":
    "আমরা DishaYaaN গড়ছি শিক্ষার্থী ও অভিভাবকদের ঘিরে — অনুমানের ঘিরে নয়।",
  "home.demand.lead":
    "এখানকার প্রতিটি উত্তরই ঠিক করে পরের ধাপ: কোন কর্মসূচি থাকবে, কী ভরসা তৈরি করে এবং অভিভাবকরা আসলে কী দেখতে চান।",
  "home.ai.eyebrow": "DishaYaaN AI",
  "home.ai.title": "এরপর কী, তার প্রথম গাইড।",
  "home.ai.lead":
    "ক্ষেত্র, প্ল্যান ও পথ ঘুরে দেখার জন্য দশটি বিনামূল্যের প্রশ্ন। DishaYaaN AI আপনার শ্রেণি ও আগ্রহ জানতে চায় যাতে উত্তর কাজে লাগে — আর প্রতিটি আলাপ শেষে একজন মানুষের সঙ্গে কথা বলার সুযোগ থাকে।",
};

const OR: TranslationTable = {
  "nav.home": "ହୋମ",
  "nav.catalog": "ପାଠ୍ୟକ୍ରମ ତାଲିକା",
  "nav.mentors": "ମେଣ୍ଟର",
  "nav.community": "ସମ୍ପ୍ରଦାୟ",
  "nav.plans": "ଯୋଜନା",
  "nav.pathfinder": "ପାଥ୍ ଫାଇଣ୍ଡର",
  "nav.about": "ଆମ ବିଷୟରେ",
  "nav.partners": "ବିଦ୍ୟାଳୟ ଓ ସଂସ୍ଥାନ",
  "nav.bookSession": "ଏକ-ରୁ-ଏକ ସେସନ୍ ବୁକ୍ କରନ୍ତୁ",
  "nav.askAi": "DishaYaaN AI କୁ ପଚାରନ୍ତୁ",
  "nav.askAiShort": "AI କୁ ପଚାରନ୍ତୁ",
  "nav.talkToMentor": "ମେଣ୍ଟରଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ",
  "nav.connectMentor": "ମେଣ୍ଟରଙ୍କ ସହ ଯୋଡ଼ି ହୁଅନ୍ତୁ",
  "nav.login": "ଲଗ୍ ଇନ୍",
  "nav.dashboard": "ମୋ ଡ୍ୟାସବୋର୍ଡ",
  "nav.account": "ଖାତା",
  "nav.more": "ଅଧିକ",
  "nav.openMenu": "ମେନୁ ଖୋଲନ୍ତୁ",
  "nav.closeMenu": "ମେନୁ ବନ୍ଦ କରନ୍ତୁ",
  "lang.label": "ଭାଷା",
  "hero.eyebrow": "ମାର୍ଗଦର୍ଶନ × ଟେକ୍ନୋଲୋଜି × କ୍ୟାରିଅର୍ × ପରୀକ୍ଷା",
  "hero.titleTop": "ତୁମର ଭବିଷ୍ୟତ",
  "hero.titleHighlight": "ସିଲେବସ୍‌ଠାରୁ ବଡ଼",
  "hero.titleBottom": "।",
  "hero.lead":
    "DishaYaaN ଷଷ୍ଠରୁ ଦ୍ୱାଦଶ ଶ୍ରେଣୀର ଛାତ୍ରଛାତ୍ରୀଙ୍କ ପାଇଁ ଏକ ମେଣ୍ଟରସିପ୍ କାର୍ଯ୍ୟକ୍ରମ: ଏକ-ରୁ-ଏକ ପରାମର୍ଶ, ଉଦୀୟମାନ ଟେକ୍ନୋଲୋଜି, ପ୍ରକୃତ ପ୍ରୋଜେକ୍ଟ ଏବଂ ପଥ ଚାଲି ଆସିଥିବା ମେଣ୍ଟରଙ୍କ ସଚ୍ଚୋଟ ମାର୍ଗଦର୍ଶନ।",
  "hero.ctaDiscover": "ନିଜ ପଥ ଖୋଜନ୍ତୁ",
  "hero.ctaMentors": "ଆମ ମେଣ୍ଟରଙ୍କୁ ଭେଟନ୍ତୁ",
  "hero.trustStudents": "ଛାତ୍ରଛାତ୍ରୀଙ୍କ ପାଇଁ ମାର୍ଗଦର୍ଶନ",
  "hero.trustParents": "ଅଭିଭାବକଙ୍କ ପାଇଁ ସ୍ୱଚ୍ଛତା",
  "hero.trustMentors": "ମେଣ୍ଟରଙ୍କ ଦୃଷ୍ଟିକୋଣ",
  "hero.bookOneToOne": "ଏକ-ରୁ-ଏକ ସେସନ୍ ବୁକ୍ କରନ୍ତୁ →",
  "hero.exploring": "ଦେଖୁଛନ୍ତି:",
  "hero.exploringHint": "— ପାଖ ନେଟୱାର୍କରେ ବିବରଣୀ ପଢ଼ନ୍ତୁ।",
  "hero.networkLabel": "ଭବିଷ୍ୟତ ପଥ ନେଟୱାର୍କ — କୌଣସି ନୋଡ୍ ଉପରେ ହୋଭର କରନ୍ତୁ",
  "hero.pathsSuffix": "ପଥ",
  "hero.networkNote":
    "ପ୍ରତ୍ୟେକ ନୋଡ୍ DishaYaaNର ପ୍ରକୃତ ଟ୍ରାକ୍। ଭିତରର ଦକ୍ଷତା ଓ ପ୍ରୋଜେକ୍ଟ ଦେଖିବାକୁ ହୋଭର କରନ୍ତୁ। ଫୋନ୍ ଓ କମ୍ ଶକ୍ତିର ଡିଭାଇସରେ ଏହା ହାଲୁକା 2D ମ୍ୟାପ୍ ଭାବେ ଦେଖାଯାଏ, ତେଣୁ ପୃଷ୍ଠା ଶୀଘ୍ର ରହେ।",
  "hero.loading3d": "3D ନେଟୱାର୍କ ଲୋଡ୍ ହେଉଛି…",
  "footer.intro":
    "ତୁମର ଭବିଷ୍ୟତ ତୁମ ସିଲେବସ୍‌ଠାରୁ ବଡ଼। DishaYaaN ଷଷ୍ଠରୁ ଦ୍ୱାଦଶ ଶ୍ରେଣୀର ଛାତ୍ରଛାତ୍ରୀଙ୍କୁ ଉଦୀୟମାନ ଟେକ୍ନୋଲୋଜି ଚିହ୍ନିବାରେ, ପ୍ରକୃତ ଲକ୍ଷ୍ୟ ପାଇଁ ପ୍ରସ୍ତୁତ ହେବାରେ ଏବଂ ପଥ ଚାଲି ଆସିଥିବା ମେଣ୍ଟରଙ୍କଠାରୁ ଶିଖିବାରେ ସାହାଯ୍ୟ କରେ।",
  "footer.colExplore": "ଦେଖନ୍ତୁ",
  "footer.colStudents": "ଛାତ୍ରଛାତ୍ରୀ",
  "footer.colParents": "ଅଭିଭାବକ",
  "footer.colInstitutions": "ସଂସ୍ଥାନ",
  "footer.colCompany": "କମ୍ପାନୀ",
  "footer.colLegal": "ଆଇନଗତ",
  "footer.linkProgrammes": "କାର୍ଯ୍ୟକ୍ରମ",
  "footer.linkMentors": "ମେଣ୍ଟର",
  "footer.linkPlans": "ଯୋଜନା ଓ ଶୁଳ୍କ",
  "footer.linkAbout": "ଆମ ବିଷୟରେ",
  "footer.linkPathFinder": "ପାଥ୍ ଫାଇଣ୍ଡର",
  "footer.linkCatalog": "ପାଠ୍ୟକ୍ରମ ଓ ପରୀକ୍ଷା ତାଲିକା",
  "footer.linkAskMentor": "ମେଣ୍ଟରଙ୍କୁ ପଚାରିବାର ଉପାୟ",
  "footer.linkDashboard": "ମୋ ଡ୍ୟାସବୋର୍ଡ",
  "footer.linkParentGuide": "ଅଭିଭାବକ ଗାଇଡ୍",
  "footer.linkProgress": "ଅଗ୍ରଗତିର ସ୍ୱଚ୍ଛତା",
  "footer.linkTalkMentor": "ମେଣ୍ଟରଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ",
  "footer.linkFees": "ଶୁଳ୍କ ଓ ଦେୟ",
  "footer.linkSchools": "ବିଦ୍ୟାଳୟ",
  "footer.linkColleges": "କଲେଜ",
  "footer.linkCoaching": "କୋଚିଂ ସେଣ୍ଟର",
  "footer.linkPartner": "ଆମ ସହ ଭାଗୀଦାରୀ",
  "footer.linkAboutBrand": "DishaYaaN ବିଷୟରେ",
  "footer.linkRequirement": "ଆବଶ୍ୟକତା ଫର୍ମ",
  "footer.linkContact": "ଯୋଗାଯୋଗ",
  "footer.linkCareers": "କ୍ୟାରିଅର୍",
  "footer.linkPrivacy": "ଗୋପନୀୟତା",
  "footer.linkTerms": "ସର୍ତ୍ତାବଳୀ",
  "footer.linkRefund": "ରିଫଣ୍ଡ ନୀତି",
  "footer.bookFree": "ମାଗଣା ସେସନ୍ ବୁକ୍ କରନ୍ତୁ",
  "footer.rights": "© {year} DishaYaaN। ଛାତ୍ରଛାତ୍ରୀ, ଅଭିଭାବକ ଓ ମେଣ୍ଟରଙ୍କ ପାଇଁ ନିର୍ମିତ।",
  "footer.verification":
    "ମେଣ୍ଟର ପ୍ରୋଫାଇଲ, ପ୍ରଶଂସାପତ୍ର ଓ ଛାତ୍ର କାହାଣୀ ଯାଞ୍ଚ ଓ ସମ୍ମତି ପରେ ହିଁ ପ୍ରକାଶିତ ହୁଏ।",
  "home.audience.eyebrow": "ଏଠାରୁ ଆରମ୍ଭ କରନ୍ତୁ",
  "home.audience.title": "DishaYaaN କାହା ପାଇଁ ଦେଖୁଛନ୍ତି?",
  "home.audience.lead":
    "ଉତ୍ତର ହିଁ ନିର୍ଣ୍ଣୟ କରେ ଆମେ ପ୍ରଥମେ କଣ ଦେଖାଇବୁ — ଛାତ୍ରଛାତ୍ରୀଙ୍କୁ ସମ୍ଭାବନା ଦରକାର, ଅଭିଭାବକଙ୍କୁ ସ୍ୱଚ୍ଛତା।",
  "home.tracks.eyebrow": "ଭବିଷ୍ୟତ ଅନ୍ୱେଷଣ",
  "home.tracks.title1": "ଭବିଷ୍ୟତ ଏତେ ଶୀଘ୍ର ବାଛ ନାହିଁ।",
  "home.tracks.title2": "ପ୍ରଥମେ ତାକୁ ଦେଖ।",
  "home.tracks.lead":
    "ଦଶଟି ଇକୋସିଷ୍ଟମ୍, ପ୍ରତ୍ୟେକରେ ପ୍ରକୃତ ଦକ୍ଷତା, ପ୍ରକୃତ ପ୍ରୋଜେକ୍ଟ ଏବଂ ସେହି କ୍ଷେତ୍ରର ଜଣେ ମେଣ୍ଟର। ଗୋଟିଏ ବାଛି ଦେଖନ୍ତୁ ଭିତରେ ପ୍ରକୃତରେ କଣ ଅଛି।",
  "home.catalog.eyebrow": "ପାଠ୍ୟକ୍ରମ ଓ ପରୀକ୍ଷା ତାଲିକା",
  "home.catalog.title": "ତିନୋଟି ସ୍ତର। ଏକ ସ୍ପଷ୍ଟ ପଥ।",
  "home.catalog.lead":
    "ଅଧିକାଂଶ ଛାତ୍ରଛାତ୍ରୀ ଏକ ଅନିୟମିତ ପାଠ୍ୟକ୍ରମ ତାଲିକା ପାଆନ୍ତି। DishaYaaN ଏମିତି ସଜାଡ଼ା ଯେ ତୁମେ ସର୍ବଦା ଜାଣିଥାଅ ତୁମେ କେଉଁ ସ୍ତରରେ ଛିଡ଼ା ଅଛ।",
  "home.mentors.eyebrow": "ମେଣ୍ଟରସିପ୍",
  "home.mentors.title": "ଯେଉଁମାନେ ପଥ ଚାଲି ଆସିଛନ୍ତି, ସେମାନଙ୍କଠାରୁ ଶିଖ।",
  "home.mentors.lead":
    "ମେଣ୍ଟରମାନଙ୍କୁ କ୍ଷେତ୍ର, ଭାଷା ଓ ସମୟ ଅନୁସାରେ ମିଳାଯାଏ। ତଳେ ପ୍ରତ୍ୟେକ ସିଟରେ ସ୍ପଷ୍ଟ ଲେଖା ଅଛି ସେଥିରେ କଣ ଅଛି — ଏବଂ ମେଣ୍ଟର ଯାଞ୍ଚ ସମ୍ପୂର୍ଣ୍ଣ କଲେ ୨ ମିନିଟର ପରିଚୟ ପ୍ରକାଶିତ ହୁଏ।",
  "home.projects.eyebrow": "ପ୍ରୋଜେକ୍ଟ-ଆଧାରିତ ଶିକ୍ଷା",
  "home.projects.title": "କେବଳ ଶିଖ ନାହିଁ। ତିଆରି କର।",
  "home.projects.lead":
    "ପ୍ରତ୍ୟେକ ଟ୍ରାକ୍ ସେମିତି କିଛିରେ ଶେଷ ହୁଏ ଯାହା ପ୍ରକୃତରେ ଅଛି। DishaYaaN ପ୍ରୋଜେକ୍ଟର ଢାଞ୍ଚା: ଏକ ସମସ୍ୟା, ଏକ ନିର୍ମାଣ, ଜଣେ ମେଣ୍ଟର ଏବଂ ଏକ ଶିକ୍ଷା ଯାହା ତୁମ ସହ ରହେ।",
  "home.journey.eyebrow": "DishaYaaN କିପରି କାମ କରେ",
  "home.journey.title": "ଛଅଟି ପର୍ଯ୍ୟାୟ, ପ୍ରତିଥର ଏହି କ୍ରମରେ।",
  "home.journey.lead":
    "କୌଣସି ଛାତ୍ରଛାତ୍ରୀଙ୍କୁ ସିଧା ବିଷୟବସ୍ତୁକୁ ଛଡ଼ା ଯାଏ ନାହିଁ। ଏହି କ୍ରମ ହିଁ ଉତ୍ପାଦ।",
  "home.parents.eyebrow": "ଅଭିଭାବକଙ୍କ ଅନୁଭୂତି",
  "home.parents.title": "ପିଲା କଣ ଶିଖୁଛି ତାହା ଅଭିଭାବକମାନେ ଅନୁମାନ କରିବାକୁ ପଡ଼ିବ ନାହିଁ।",
  "home.parents.lead":
    "ଆପଣଙ୍କ ସନ୍ତାନ ଯେଉଁ ଚିତ୍ର ଦେଖେ, ସେହି ଚିତ୍ର ଆପଣ ମଧ୍ୟ ଦେଖନ୍ତି: କଣ ଉପସ୍ଥିତ ହେଲା, କଣ ତିଆରି ହେଉଛି, ମେଣ୍ଟର କଣ ଦେଖିଲେ ଏବଂ ଆଗକୁ କଣ ଅଛି।",
  "home.partners.eyebrow": "ସଂସ୍ଥାନଙ୍କ ସହ ସହଯୋଗ",
  "home.partners.title":
    "ବିଦ୍ୟାଳୟ, କଲେଜ ଓ କୋଚିଂ ସେଣ୍ଟର — ଯେଉଁ ସ୍ତର ନାହିଁ, ତାହା ମିଶି ତିଆରି କରିବା।",
  "home.partners.lead":
    "DishaYaaN ଆପଣଙ୍କ ସଂସ୍ଥାନ ସହ ଚାଲେ: ମେଣ୍ଟର, ଲ୍ୟାବ୍ ଓ ଭବିଷ୍ୟତ-ପ୍ରସ୍ତୁତି ପଥ ଆମେ ଆଣୁ, ଶୈକ୍ଷିକ ଶକ୍ତି ଆପଣଙ୍କ ପାଖରେ ରହେ।",
  "home.voices.eyebrow": "ବିଶ୍ୱାସର ପ୍ରମାଣ",
  "home.voices.title": "ନକଲି ପ୍ରମାଣ ଦେଖାଇବା ଅପେକ୍ଷା କିଛି ନ ଦେଖାଇବା ଭଲ।",
  "home.voices.lead":
    "DishaYaaNର ପ୍ରଥମ ବ୍ୟାଚ୍ ଚାଲିଛି। ପ୍ରକୃତ ଓ ସମ୍ମତିପ୍ରାପ୍ତ ସ୍ୱର ମିଳିଲେ ଏହି ସ୍ଥାନ ଭରିଯିବ।",
  "home.faq.eyebrow": "ପ୍ରଶ୍ନ",
  "home.faq.title": "ସିଧା ଉତ୍ତର।",
  "home.faq.lead": "ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଏଠାରେ ନ ଥିଲେ DishaYaaN AI କୁ କିମ୍ବା ସିଧା ଜଣେ ମେଣ୍ଟରଙ୍କୁ ପଚାରନ୍ତୁ।",
  "home.final.eyebrow": "ଆପଣଙ୍କ ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ",
  "home.final.title": "ଆପଣଙ୍କ ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ ଏଠାରୁ ଆରମ୍ଭ ହୋଇପାରେ।",
  "home.final.lead":
    "ଦୁଇ ମିନିଟରେ କୁହନ୍ତୁ ଆପଣଙ୍କୁ କଣ ଦରକାର। କିମ୍ବା ଫର୍ମ ଛାଡ଼ି ଆପଣଙ୍କ ଆଗ୍ରହର କ୍ଷେତ୍ରରେ କାମ କରୁଥିବା ମେଣ୍ଟରଙ୍କ ସହ ମାଗଣା କଥା ହୁଅନ୍ତୁ।",
  "home.final.connect": "ମେଣ୍ଟରଙ୍କ ସହ ଯୋଡ଼ି ହୁଅନ୍ତୁ",
  "home.final.compare": "ଯୋଜନା ତୁଳନା କରନ୍ତୁ",
  "home.final.pathfinder": "ପାଥ୍ ଫାଇଣ୍ଡର ଚଲାନ୍ତୁ",
  "home.final.aside": "ଯୋଗାଯୋଗ ପରେ କଣ ହୁଏ",
  "home.final.step1": "ଆପଣ ପଠାଇଥିବା ଆମେ ପଢ଼ୁ — ଜଣେ ମଣିଷ, ଅଟୋ-ରିପ୍ଲାଏ ନୁହେଁ।",
  "home.final.step2": "ଆପଣଙ୍କ କ୍ଷେତ୍ରର ଜଣେ ମେଣ୍ଟର ଏକ ଦିନ ଭିତରେ WhatsApp ରେ ଯୋଗାଯୋଗ କରନ୍ତି।",
  "home.final.step3": "କୌଣସି ଦେୟ ପୂର୍ବରୁ ୨୦ ମିନିଟର ମାଗଣା କଥାବାର୍ତ୍ତା ମିଳେ।",
  "home.final.step4": "DishaYaaN ଆପଣଙ୍କ ପାଇଁ ଉପଯୁକ୍ତ ନ ହେଲେ ଆମେ ସ୍ପଷ୍ଟ କହିବୁ।",
  "home.demand.eyebrow": "ଆପଣଙ୍କ ଆବଶ୍ୟକତା କୁହନ୍ତୁ",
  "home.demand.title":
    "ଆମେ DishaYaaN ଛାତ୍ରଛାତ୍ରୀ ଓ ଅଭିଭାବକଙ୍କ ଚାରିପାଖରେ ତିଆରି କରୁଛୁ — ଅନୁମାନର ଚାରିପାଖରେ ନୁହେଁ।",
  "home.demand.lead":
    "ଏଠାର ପ୍ରତ୍ୟେକ ଉତ୍ତର ପରବର୍ତ୍ତୀ ପରିକଳ୍ପନା ନିର୍ଣ୍ଣୟ କରେ: କେଉଁ କାର୍ଯ୍ୟକ୍ରମ ରହିବ, କଣ ବିଶ୍ୱାସ ଗଢ଼େ ଏବଂ ଅଭିଭାବକମାନେ ପ୍ରକୃତରେ କଣ ଦେଖିବାକୁ ଚାହାନ୍ତି।",
  "home.ai.eyebrow": "DishaYaaN AI",
  "home.ai.title": "ଆଗକୁ କଣ, ତାହାର ଆପଣଙ୍କ ପ୍ରଥମ ଗାଇଡ୍।",
  "home.ai.lead":
    "କ୍ଷେତ୍ର, ଯୋଜନା ଓ ପଥ ଖୋଜିବା ପାଇଁ ଦଶଟି ମାଗଣା ପ୍ରଶ୍ନ। DishaYaaN AI ଆପଣଙ୍କ ଶ୍ରେଣୀ ଓ ଆଗ୍ରହ ବିଷୟରେ ପଚାରେ ଯାହା ଫଳରେ ଉତ୍ତର ଉପଯୋଗୀ ହୁଏ — ଏବଂ ପ୍ରତ୍ୟେକ କଥାବାର୍ତ୍ତା ଶେଷରେ ଜଣେ ମଣିଷ ସହ କଥା ହେବାର ବିକଳ୍ପ ମିଳେ।",
};

const GU: TranslationTable = {
  "nav.home": "હોમ",
  "nav.catalog": "કોર્સ યાદી",
  "nav.mentors": "મેન્ટર",
  "nav.community": "સમુદાય",
  "nav.plans": "પ્લાન",
  "nav.pathfinder": "પાથ ફાઇન્ડર",
  "nav.about": "અમારા વિશે",
  "nav.partners": "શાળાઓ અને સંસ્થાઓ",
  "nav.bookSession": "વન-ટુ-વન સેશન બુક કરો",
  "nav.askAi": "DishaYaaN AI ને પૂછો",
  "nav.askAiShort": "AI ને પૂછો",
  "nav.talkToMentor": "મેન્ટર સાથે વાત કરો",
  "nav.connectMentor": "મેન્ટર સાથે જોડાઓ",
  "nav.login": "લોગ ઇન",
  "nav.dashboard": "મારું ડેશબોર્ડ",
  "nav.account": "ખાતું",
  "nav.more": "વધુ",
  "nav.openMenu": "મેનૂ ખોલો",
  "nav.closeMenu": "મેનૂ બંધ કરો",
  "lang.label": "ભાષા",
  "hero.eyebrow": "માર્ગદર્શન × ટેકનોલોજી × કારકિર્દી × પરીક્ષાઓ",
  "hero.titleTop": "તમારું ભવિષ્ય",
  "hero.titleHighlight": "તમારા સિલેબસથી મોટું",
  "hero.titleBottom": "છે.",
  "hero.lead":
    "DishaYaaN ધોરણ 6–12 ના વિદ્યાર્થીઓ માટે એક મેન્ટરશિપ કાર્યક્રમ છે: વન-ટુ-વન કાઉન્સેલિંગ, ઉભરતી ટેકનોલોજી, સાચા પ્રોજેક્ટ અને જે મેન્ટરોએ આ માર્ગ પોતે ચાલ્યો છે તેમનું પ્રામાણિક માર્ગદર્શન.",
  "hero.ctaDiscover": "તમારો માર્ગ શોધો",
  "hero.ctaMentors": "અમારા મેન્ટરને મળો",
  "hero.trustStudents": "વિદ્યાર્થીઓ માટે માર્ગદર્શન",
  "hero.trustParents": "વાલીઓ માટે પારદર્શિતા",
  "hero.trustMentors": "મેન્ટરોનો દૃષ્ટિકોણ",
  "hero.bookOneToOne": "વન-ટુ-વન સેશન બુક કરો →",
  "hero.exploring": "જોઈ રહ્યા છો:",
  "hero.exploringHint": "— બાજુના નેટવર્કમાં વિગતો વાંચો.",
  "hero.networkLabel": "ભવિષ્યનું પાથ નેટવર્ક — કોઈ નોડ પર હોવર કરો",
  "hero.pathsSuffix": "માર્ગો",
  "hero.networkNote":
    "દરેક નોડ DishaYaaNનું સાચું ટ્રેક છે. તેમાંના કૌશલ્યો અને પ્રોજેક્ટ જોવા હોવર કરો. ફોન અને ઓછી શક્તિવાળા ઉપકરણો પર તે હલકું 2D નકશા તરીકે દેખાય છે, જેથી પૃષ્ઠ ઝડપી રહે.",
  "hero.loading3d": "3D નેટવર્ક લોડ થઈ રહ્યું છે…",
  "footer.intro":
    "તમારું ભવિષ્ય તમારા સિલેબસથી મોટું છે. DishaYaaN ધોરણ 6–12 ના વિદ્યાર્થીઓને ઉભરતી ટેકનોલોજી સમજવામાં, સાચા લક્ષ્યોની તૈયારી કરવામાં અને માર્ગ ચાલી આવેલા મેન્ટરો પાસેથી શીખવામાં મદદ કરે છે.",
  "footer.colExplore": "જુઓ",
  "footer.colStudents": "વિદ્યાર્થીઓ",
  "footer.colParents": "વાલીઓ",
  "footer.colInstitutions": "સંસ્થાઓ",
  "footer.colCompany": "કંપની",
  "footer.colLegal": "કાનૂની",
  "footer.linkProgrammes": "કાર્યક્રમો",
  "footer.linkMentors": "મેન્ટર",
  "footer.linkPlans": "પ્લાન અને ફી",
  "footer.linkAbout": "અમારા વિશે",
  "footer.linkPathFinder": "પાથ ફાઇન્ડર",
  "footer.linkCatalog": "કોર્સ અને પરીક્ષા યાદી",
  "footer.linkAskMentor": "મેન્ટરને પૂછવાની રીતો",
  "footer.linkDashboard": "મારું ડેશબોર્ડ",
  "footer.linkParentGuide": "વાલી ગાઇડ",
  "footer.linkProgress": "પ્રગતિની પારદર્શિતા",
  "footer.linkTalkMentor": "મેન્ટર સાથે વાત કરો",
  "footer.linkFees": "ફી અને ચુકવણી",
  "footer.linkSchools": "શાળાઓ",
  "footer.linkColleges": "કોલેજો",
  "footer.linkCoaching": "કોચિંગ સેન્ટરો",
  "footer.linkPartner": "અમારી સાથે ભાગીદારી",
  "footer.linkAboutBrand": "DishaYaaN વિશે",
  "footer.linkRequirement": "જરૂરિયાત ફોર્મ",
  "footer.linkContact": "સંપર્ક",
  "footer.linkCareers": "કારકિર્દી",
  "footer.linkPrivacy": "ગોપનીયતા",
  "footer.linkTerms": "શરતો",
  "footer.linkRefund": "રિફંડ નીતિ",
  "footer.bookFree": "મફત સેશન બુક કરો",
  "footer.rights": "© {year} DishaYaaN. વિદ્યાર્થીઓ, વાલીઓ અને મેન્ટરો માટે બનાવેલું.",
  "footer.verification":
    "મેન્ટર પ્રોફાઇલ, પ્રશંસાપત્રો અને વિદ્યાર્થી વાર્તાઓ ચકાસણી અને સંમતિ પછી જ પ્રકાશિત થાય છે.",
  "home.audience.eyebrow": "અહીંથી શરૂ કરો",
  "home.audience.title": "તમે DishaYaaN કોના માટે જોઈ રહ્યા છો?",
  "home.audience.lead":
    "જવાબ જ નક્કી કરે છે કે અમે પહેલા શું બતાવીશું — વિદ્યાર્થીને શક્યતાઓ જોઈએ, વાલીને પારદર્શિતા.",
  "home.tracks.eyebrow": "ભવિષ્યની શોધ",
  "home.tracks.title1": "ભવિષ્ય આટલું વહેલું ન પસંદ કરો.",
  "home.tracks.title2": "પહેલા એને શોધો.",
  "home.tracks.lead":
    "દસ ઇકોસિસ્ટમ, દરેકમાં સાચી કૌશલ્યો, સાચા પ્રોજેક્ટ અને તે ક્ષેત્રનો મેન્ટર. એક પસંદ કરો અને જુઓ કે તેમાં ખરેખર શું છે.",
  "home.catalog.eyebrow": "કોર્સ અને પરીક્ષા યાદી",
  "home.catalog.title": "ત્રણ સ્તર. એક સ્પષ્ટ માર્ગ.",
  "home.catalog.lead":
    "મોટા ભાગના વિદ્યાર્થીઓને કોર્સોની અસ્તવ્યસ્ત યાદી મળે છે. DishaYaaN એવી રીતે ગોઠવાયેલું છે કે તમને હંમેશા ખબર રહે કે તમે કયા સ્તર પર છો.",
  "home.mentors.eyebrow": "મેન્ટરશિપ",
  "home.mentors.title": "જેઓ માર્ગ ચાલી આવ્યા છે તેમનાથી શીખો.",
  "home.mentors.lead":
    "મેન્ટરોને ક્ષેત્ર, ભાષા અને સમય પ્રમાણે મેળવવામાં આવે છે. નીચેની દરેક સીટ પર સ્પષ્ટ લખેલું છે કે તેમાં શું છે — અને મેન્ટર ચકાસણી પૂરી થતાં જ 2 મિનિટનો પરિચય પ્રકાશિત થાય છે.",
  "home.projects.eyebrow": "પ્રોજેક્ટ-આધારિત શિક્ષણ",
  "home.projects.title": "ફક્ત શીખો નહીં. બનાવો.",
  "home.projects.lead":
    "દરેક ટ્રેક એવી વસ્તુ પર પૂરો થાય છે જે અસ્તિત્વમાં હોય. DishaYaaN પ્રોજેક્ટનો આકાર આ છે: એક સમસ્યા, એક નિર્માણ, એક મેન્ટર અને એક પાઠ જે તમારી પાસે રહે.",
  "home.journey.eyebrow": "DishaYaaN કેવી રીતે કામ કરે છે",
  "home.journey.title": "છ પગલાં, દરેક વખતે આ જ ક્રમમાં.",
  "home.journey.lead": "કોઈ વિદ્યાર્થીને સીધો સામગ્રીમાં મૂકવામાં નથી આવતો. આ ક્રમ જ ઉત્પાદન છે.",
  "home.parents.eyebrow": "વાલીઓનો અનુભવ",
  "home.parents.title": "વાલીઓને અંદાજો ન લગાવવો પડે કે બાળક શું શીખી રહ્યું છે.",
  "home.parents.lead":
    "તમારા બાળક જે ચિત્ર જુએ છે તે જ તમે જુઓ છો: શું હાજર રહ્યું, શું બની રહ્યું છે, મેન્ટરે શું જોયું અને આગળ શું છે.",
  "home.partners.eyebrow": "સંસ્થાઓ સાથે સહયોગ",
  "home.partners.title": "શાળાઓ, કોલેજો અને કોચિંગ સેન્ટરો — જે સ્તર તમારી પાસે નથી, તે મળીને બનાવીએ.",
  "home.partners.lead":
    "DishaYaaN તમારી સંસ્થા સાથે ચાલે છે: મેન્ટર, લેબ અને ભવિષ્ય-તૈયારીના માર્ગો અમે લાવીએ છીએ, શૈક્ષણિક મજબૂતી તમારી રહે છે.",
  "home.voices.eyebrow": "વિશ્વાસનું પુરાવું",
  "home.voices.title": "નકલી પુરાવા દેખાડવા કરતાં કંઈ ન દેખાડવું સારું.",
  "home.voices.lead":
    "DishaYaaNનો પ્રથમ બેચ ચાલી રહ્યો છે. સાચા અને સંમતિવાળા અવાજો મળતાં જ આ જગ્યાઓ ભરાઈ જશે.",
  "home.faq.eyebrow": "પ્રશ્નો",
  "home.faq.title": "સીધા જવાબ.",
  "home.faq.lead": "તમારો પ્રશ્ન અહીં ન હોય તો DishaYaaN AI ને અથવા સીધા કોઈ મેન્ટરને પૂછો.",
  "home.final.eyebrow": "તમારું આગલું પગલું",
  "home.final.title": "તમારું આગલું પગલું અહીંથી શરૂ થઈ શકે છે.",
  "home.final.lead":
    "બે મિનિટમાં જણાવો કે તમને શું જોઈએ. અથવા ફોર્મ છોડીને તમારા રસના ક્ષેત્રમાં કામ કરતા મેન્ટર સાથે મફત વાત કરો.",
  "home.final.connect": "મેન્ટર સાથે જોડાઓ",
  "home.final.compare": "પ્લાન સરખાવો",
  "home.final.pathfinder": "પાથ ફાઇન્ડર ચલાવો",
  "home.final.aside": "સંપર્ક કર્યા પછી શું થાય છે",
  "home.final.step1": "તમે મોકલ્યું છે તે અમે વાંચીએ છીએ — માણસ, ઓટો-રિપ્લાઈ નહીં.",
  "home.final.step2": "તમારા ક્ષેત્રના મેન્ટર એક દિવસમાં WhatsApp પર સંપર્ક કરે છે.",
  "home.final.step3": "કોઈપણ ચુકવણી પહેલાં 20 મિનિટની મફત વાત થાય છે.",
  "home.final.step4": "DishaYaaN તમારા માટે યોગ્ય ન હોય તો અમે સ્પષ્ટ કહીશું.",
  "home.demand.eyebrow": "તમને શું જોઈએ તે જણાવો",
  "home.demand.title":
    "અમે DishaYaaN વિદ્યાર્થીઓ અને વાલીઓની આસપાસ બનાવી રહ્યા છીએ — અનુમાનોની આસપાસ નહીં.",
  "home.demand.lead":
    "અહીંનો દરેક જવાબ નક્કી કરે છે કે આગળ શું બનશે: કયા કાર્યક્રમો હશે, વિશ્વાસ કઈ રીતે બને છે અને વાલીઓ ખરેખર શું જોવા માંગે છે.",
  "home.ai.eyebrow": "DishaYaaN AI",
  "home.ai.title": "આગળ શું છે તેની તમારી પહેલી માર્ગદર્શિકા.",
  "home.ai.lead":
    "ક્ષેત્રો, પ્લાન અને માર્ગો શોધવા માટે દસ મફત પ્રશ્નો. DishaYaaN AI તમારા ધોરણ અને રસ વિશે પૂછે છે જેથી જવાબો ઉપયોગી બને — અને દરેક વાતચીત અંતે માણસ સાથે વાત કરવાનો વિકલ્પ આપે છે.",
};

const TRANSLATIONS: Record<LanguageCode, TranslationTable> = {
  en: EN,
  hi: HI,
  bn: BN,
  or: OR,
  gu: GU,
};

const STORAGE_KEY = "dishayaan:lang";

function readInitialLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (isLanguageCode(fromUrl)) return fromUrl;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguageCode(stored)) return stored;
  } catch {
    // Private mode / blocked storage: stay on the English default.
  }
  return "en";
}

interface I18nContextValue {
  lang: LanguageCode;
  setLang: (code: LanguageCode) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(readInitialLanguage);

  useEffect(() => {
    // Assistive tech and search engines need the document language to follow
    // the reader's choice.
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Storage unavailable — the in-memory choice still works.
    }
  }, [lang]);

  const setLang = useCallback((code: LanguageCode) => {
    setLangState(code);
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      const value = TRANSLATIONS[lang][key] ?? EN[key] ?? key;
      if (!vars) return value;
      return value.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in vars ? String(vars[name]) : match,
      );
    },
    [lang],
  );

  const contextValue = useMemo<I18nContextValue>(
    () => ({ lang, setLang, t }),
    [lang, setLang, t],
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside <I18nProvider>");
  }
  return context;
}
