import { slot, type ImageSlot } from "./assets";

/** A paragraph told down the middle of a page, its photos on either side. */
export type StoryParagraph = {
  text: string;
  /** The first is shown on the left, the second on the right. */
  images: { src: string; alt: string; width: number; height: number }[];
};

/**
 * Page-level editorial copy, kept out of components so a CMS can take over.
 *
 * Academy facts come from the supplied onboarding documents, docs/CHOORAKKODI.pdf
 * and docs/Choorakodi_Martial_Arts_Academy_Profile.docx, whose spellings of the
 * training terms (Meythari, Kolthari, Angathari, Verumkai) the site follows.
 * Details still awaiting the academy's input use `pending`.
 */

/* ------------------------------------------------------------------ home */

export const homeIntro = {
  eyebrow: "Kalari · Heritage · Kozhikode",
  heading: ["Six decades", "of discipline."],
  body: [
    "CMM Gurukkal's Choorakkodi Martial Arts Academy has taught Kalarippayattu in Chelavoor, Kozhikode since 1960. Its founder, Usthad C.M.M. Gurukkal, learned the art under around fifty Gurus across Kerala and brought the Thekkan, Vadakkan, Thulunadan and Kadathanadan styles into one kalari, with the Northern style at its heart.",
    "It began at home, as kalari lessons and kalari treatment under the name Shafi Dawa Khana Ayurveda Chikitsalayam, and grew into Choorakkodi Kalari Sangam. In 66 years it has trained thousands of students; nearly 50 of them now run academies of their own.",
    "The academy continues Kerala's traditional martial arts heritage through Kalarippayattu, self-defence and character development. Structured practice encourages body control, awareness, discipline, concentration, confidence and mental resilience.",
  ],
  pending: "",
  image: slot("KALARI IMAGE", "Two Choorakkodi students leap with sword and shield inside the kalari", {
    src: "/images/training/shield-leap.webp",
    brief: "public/images/hero — the defining image of the academy",
  }),
  secondaryImage: slot("TRAINING IMAGE", "A student leaps over a partner holding a low sword-and-shield guard", {
    src: "/images/training/leap-over-guard.webp",
    brief: "public/images/training — vertical, motion visible",
  }),
};

export const founder = {
  eyebrow: "Founder · Gurukkal",
  name: "Usthad C.M.M. Gurukkal",
  heading: ["The hand", "that taught", "the hands."],
  intro: [
    "Usthad C.M.M. Gurukkal (Chottanikkara Mamu Moulavi Gurukkal) admired Kalari from childhood. He travelled across Kerala to learn its different methods: Thekkan, Vadakkan, Thulunadan and Kadathanadan Mura.",
    "He studied under around fifty Gurus, among them E.P. Abdulrahiman Gurukkal, Floor Abdullakutty Gurukkal, Chirakkal T. Sreedharan Nair Gurukkal, Hydros Gurukkal and Francis Eelam. He learned kalari chikitsa and Ayurveda from Hakeem Abu Ahammed Ponnani, K.T. Mahavan Vadiyar and Raghavan Thirumulpad.",
    "In 1960 he began teaching kalari and offering kalari treatment from his home, first as Shafi Dawa Khana Ayurveda Chikitsalayam and later as Choorakkodi Kalari Chikitsalayam. He then established Choorakkodi Kalari Sangam as a martial arts centre alongside the treatment centre, and it drew enthusiasts from all over the world. He is also the visionary behind SDK Health Complex, where Shafi Dawa Khana is now an Ayurveda hospital run by his son, Dr. Saheer Ali.",
  ].join("\n\n"),
  /** Phrases set bold in the story above, as the homepage captions do. */
  highlights: [
    "Usthad C.M.M. Gurukkal",
    "Thekkan, Vadakkan, Thulunadan and Kadathanadan Mura",
    "around fifty Gurus",
    "kalari chikitsa and Ayurveda",
    "In 1960",
    "Shafi Dawa Khana Ayurveda Chikitsalayam",
    "Choorakkodi Kalari Chikitsalayam",
    "Choorakkodi Kalari Sangam",
    "enthusiasts from all over the world",
    "SDK Health Complex",
    "Dr. Saheer Ali",
  ],
  pending: "",
  image: slot("FOUNDER IMAGE", "Framed portrait of Usthad C.M.M. Gurukkal above the kalari weapons", {
    src: "/images/heritage/founder-portrait-framed.webp",
    width: 1170,
    height: 1695,
  }),
  facts: [
    { label: "Role", value: "Founder · Former president · Gurukkal" },
    { label: "Founded", value: "1960" },
    { label: "Teachers", value: "Around fifty Gurus" },
    { label: "Base", value: "Chelavoor, Kozhikode" },
  ],
};

export const pillars = {
  eyebrow: "Why Choorakkodi",
  heading: ["What the", "floor asks", "of you."],
  items: [
    {
      index: "01",
      title: "Discipline",
      body: "The syllabus is not negotiable and the order is not optional. Progress is measured in what holds when you are tired, not in what you can do when you are fresh.",
    },
    {
      index: "02",
      title: "Lineage",
      body: "The art is transmitted body to body. What is taught here was received, and it is taught in the form in which it was received.",
    },
    {
      index: "03",
      title: "Tradition",
      body: "The kalari, the order of entry, the sequence of stages. These are not atmosphere. They are the method the art uses to keep itself intact.",
    },
    {
      index: "04",
      title: "Training",
      body: "Conditioning first, for months. Wooden weapons before edged ones. The empty hand last, when control has been demonstrated rather than assumed.",
    },
    {
      index: "05",
      title: "Healing",
      body: "The marma tradition sits inside the same body of knowledge as the martial syllabus — the same map, read the other way.",
    },
  ],
};

/* ----------------------------------------------------------------- about */

export const about = {
  eyebrow: "Our Legacy",
  heading: ["The lineage", "lives on."],
  standfirst:
    "The kalari Usthad C.M.M. Gurukkal founded in 1960: one academy in Chelavoor, Kozhikode, 66 years under the name Choorakkodi Kalari Sangam, and six generations of students.",
  sections: [
    {
      title: "The Choorakkodi lineage",
      body: "The academy teaches what Usthad Gurukkal gathered, with the Northern style at its centre. Its trainers are brought up within the academy in the Gurukul system, and teach the founder's traditional syllabus together with a technically updated one.",
      pending: "",
    },
    {
      title: "Current leadership",
      body: "Choorakkodi Kalari is led by President Dr. Saheer Ali, the founder's son, with A. Moosa Haji serving as General Secretary and overseeing the academy's activities. Usthad C.M.M. Gurukkal is recognised as the former president.\n\nDr. Saheer Ali (BAMS, BSc (Botany), DYN) is Managing Director and Chief Physician of Shafi Dawa Khana, recognised as one of the leading experts in marma chikitsa, and skilled in yoga, naturopathy and chiropractic. His awards include the Dhanwantari award 2022 for best alumni doctor, for 22 years of excellence, and a best doctor's award from the Ayurveda Medicine Association of India (AMAI), Kunnamangalam area.",
      pending: "Name the current trainers.",
    },
    {
      title: "Authenticity",
      body: "This is the kalari Usthad C.M.M. Gurukkal founded, and the only one he founded; it has no branches. The academies his former students run are their own, independent of this one.",
      pending: "",
    },
  ],
  /** Phrases set bold where these sections are told on the homepage. */
  highlights: [
    "Northern style",
    "Gurukul system",
    "traditional syllabus",
    "technically updated one",
    "Dr. Saheer Ali",
    "A. Moosa Haji",
    "Usthad C.M.M. Gurukkal",
    "marma chikitsa",
    "Dhanwantari award 2022",
    "it has no branches",
  ],
  portrait: slot("FOUNDER IMAGE", "Portrait photograph of Usthad C.M.M. Gurukkal", {
    src: "/images/founder/cmm-gurukkal-photograph.webp",
    width: 378,
    height: 496,
  }),
  archival: slot("HISTORICAL IMAGE", "Three men seated in conversation, a black-and-white print from the academy archive", {
    src: "/images/heritage/archive-elders.webp",
    width: 1093,
    height: 792,
  }),
  team: slot("ACADEMY IMAGE", "Choorakkodi trainers and students gathered with senior members of the academy in the kalari", {
    src: "/images/academy/team-with-leadership.webp",
    width: 1170,
    height: 909,
  }),
  wide: slot("KALARI IMAGE", "Two students cross swords in a deep lunge beneath the founder's portrait in the kalari", {
    src: "/images/training/crossed-swords.webp",
  }),
  /**
   * What happened after the founding (which the founder's story tells),
   * as prose down the middle of the About page; no new dates. Text only.
   */
  history: [
    {
      text: "Under the mentorship of Dr. Saheer Ali, students went on to win prizes at National and State Kalari Championships and to compete at the SAF Games. A.M. Shamsuddeen, a student of Usthad Gurukkal, was selected by the Director of SIGARO in France as one of eight performers chosen from nearly 60 camps, and the troupe performed in Russia and the Gulf countries. In 2015 the academy appeared at the National Games.",
      images: [],
    },
    {
      text: "In 2020, fewer students during Covid led to a temporary closure. Today the floor is open again: a new sub-junior batch begins with Meythari, and morning classes are planned next.",
      images: [],
    },
  ] satisfies StoryParagraph[],
  recognition: {
    title: "Recognition & affiliations",
    items: [
      "Affiliated to the District Sports Council",
      "Affiliated to the Kerala Kalarippayattu Association",
      "Affiliated to the Taekwondo Association of Kerala",
      "Affiliated to the Yoga Association of Kerala",
      "Prizes at National and State Kalari Championships",
      "SAF Games",
      "National Games 2015",
      "A.M. Shamsuddeen, a student of Usthad C.M.M. Gurukkal, selected by the Director of SIGARO, France, as one of eight performers chosen from nearly 60 camps",
      "Performances by the Choorakkodi Kalari troupe in Russia and the Gulf countries",
      "Host of the Calicut District course under the central government's Project Massage Training Centres, run with the Parambarya Vaidya Foundation",
      "National seminars and programmes across Kerala",
    ],
    pending: "No press coverage has been supplied yet.",
  },
};

/* --------------------------------------------------------- kalarippayattu */

export const kalarippayattu = {
  eyebrow: "The art",
  heading: ["Kalari", "ppayattu."],
  standfirst:
    "Kerala's classical martial art. Trained barefoot on earth, in a room built for it, in an order that has not changed.",
  what: {
    title: "What is Kalarippayattu?",
    body: [
      "Kalari is the training hall; payattu is the practice carried out in it. The art belongs to Kerala and is trained inside a hall traditionally sunk below ground level, entered by steps, with a floor of packed earth.",
      "It is usually described as combining conditioning, weapons work, unarmed technique and a detailed knowledge of the body's vital points — the last of which it shares with the region's medical tradition rather than having invented.",
      "The Four Anghanghal in Choorakkodi's training repertoire are Meypayattu, Vadipayattu, Angappayattu and Marmmakai. Meypayattu is sequence-based body movement — coordinated steps, kicks, jumps and postures; Vadipayattu is stick-fighting practice; Marmmakai is associated with hand techniques and knowledge of the marma, the body's sensitive points.",
    ],
  },
  style: {
    title: "The Choorakkodi style",
    body: "Usthad C.M.M. Gurukkal learned the Thekkan, Vadakkan, Thulunadan and Kadathanadan styles under around fifty Gurus. The Choorakkodi syllabus draws on all four, with the Northern (Vadakkan) style at its heart, and is taught alongside the kalari marma chikitsa he learned at the same time. The founder's traditional syllabus is taught together with a technically updated one, with personal care from trainers brought up within the academy.",
    pending: "",
  },
  /**
   * The Four Anghanghal, set as the homepage's kinetic rows: each practice
   * split where it is said, its second half in the accent.
   */
  anghanghal: {
    bg: "#e6d9c6",
    counter: "",
    rows: [
      { words: ["MEY", "PAYATTU"], direction: 1 },
      { words: ["VADI", "PAYATTU"], direction: -1 },
      { words: ["ANGAP", "PAYATTU"], direction: 1 },
      { words: ["MARMMA", "KAI"], direction: -1 },
    ] as { words: [string, string]; direction: 1 | -1 }[],
    caption: [
      [{ text: "The " }, { text: "Four Anghanghal", bold: true }, { text: " —" }],
      [{ text: "the practices in Choorakkodi's own repertoire." }],
    ],
  },
  stages: [
    {
      index: "01",
      name: "Meythari",
      translation: "മെയ്ത്താരി · Body conditioning",
      body: "Postures, steps, jumps and kicks build flexibility, strength, balance, agility and coordination. Every student begins here, because the body is built before it is armed.",
    },
    {
      index: "02",
      name: "Kolthari",
      translation: "കോൽത്താരി · Wooden weapons",
      body: "Training with wooden weapons such as the staff teaches control, timing and distance, in defensive and offensive movement, on the foundations of body training.",
    },
    {
      index: "03",
      name: "Angathari",
      translation: "അങ്കത്താരി · Metal weapons",
      body: "Traditional metal weapons, such as sword and shield and the spear, are introduced under the careful supervision of an experienced instructor, at each learner's level.",
    },
    {
      index: "04",
      name: "Verumkai",
      translation: "വെറുംകൈ · The empty hand",
      body: "Unarmed practice: defensive movement and body techniques, including strikes, releases, holds and controlled responses. It comes last because it is the most consequential.",
    },
  ],
  philosophy: {
    title: "What training builds",
    intro:
      "Martial arts support physical development and personal growth together. Through consistent, guided practice, students work towards six things.",
    items: [
      { title: "Flexibility", body: "Range of motion and body control." },
      { title: "Courage & confidence", body: "Approaching challenges with greater confidence." },
      { title: "Strength & agility", body: "Physical strength, speed and coordinated movement." },
      { title: "Discipline & focus", body: "Consistency, attention and respect for training." },
      { title: "Self-defence", body: "Appropriate defensive skills under qualified supervision." },
      { title: "Mental resilience", body: "Patience and perseverance through continued practice." },
    ],
    image: slot("TRAINING IMAGE", "A sub-junior holds a split between two trainers on the kalari rings", {
      src: "/images/training/rings-split.webp",
      width: 1170,
      height: 871,
    }),
  },
  learn: {
    title: "Training facilities & activities",
    items: [
      "Self-defence techniques, body control and awareness",
      "Physical fitness, flexibility, balance and coordination",
      "Discipline, concentration, confidence and mental resilience",
      "Training with certified and experienced trainers",
      "Annual belt grading",
      "District and state championship coaching",
      "Participation in Kalari Payattu and yoga",
    ],
  },
  who: {
    title: "Who can join",
    body: "Students of all genders are welcome at beginner, intermediate and advanced levels. The sub-junior programme is designed for children aged 6–14, with training introduced according to each learner's level and the instructor's guidance. No previous experience is needed. Trial classes are available, and certification is offered.",
    pending: "",
  },
  schedule: {
    title: "Schedules",
    items: [
      "Monday – Saturday",
      "Sub-juniors · ages 6–14 · 4.30 – 6 pm",
      "Juniors & seniors · 6.30 – 8.30 pm",
      "Two classes a week for each batch",
      "One-month summer camp and intensive courses",
      "Morning classes (6 – 7 am) planned",
    ],
    pending: "",
  },
  fees: {
    title: "Fees",
    pending: "Supply the current fee structure, or confirm that fees are quoted on enquiry only.",
  },
  images: {
    hero: slot("TRAINING IMAGE", "A student leaps over a partner holding a low sword-and-shield guard", {
      src: "/images/training/leap-over-guard.webp",
    }),
    stage: slot("TRAINING IMAGE", "A spear thrust met by a leaping sword-and-shield strike inside the kalari", {
      src: "/images/training/spear-and-sword.webp",
    }),
    wide: slot("TRAINING IMAGE", "CKS Chelavoor students in a sword-and-shield demonstration before an audience", {
      src: "/images/training/cks-demonstration.webp",
    }),
    detail: slot("WEAPONS IMAGE", "Spears, staffs and maces racked against the kalari wall", {
      src: "/images/training/weapons-rack.webp",
    }),
  },
};

/* ----------------------------------------------------------------- marma */

export const marma = {
  eyebrow: "Kalari Marma Healing",
  heading: ["Marma", "healing."],
  standfirst:
    "The healing half of the tradition: a map of the body inherited from the classical medical literature and kept alive inside the kalari.",
  what: {
    title: "What is marma?",
    body: [
      "Marma are described in the classical texts as the points at which flesh, vessel, sinew, bone and joint meet — the locations where the body is held to be most concentrated and most vulnerable.",
      "The martial syllabus and the therapeutic practice read the same map. One asks where a body can be reached; the other asks where it can be worked on.",
    ],
  },
  tradition: {
    title: "The tradition",
    body: [
      "The enumeration of marma comes from the classical Ayurvedic surgical literature, where the points are catalogued by region and by the consequence of injury. Its original context is protective: a practitioner is being told where not to cut.",
      "In Kerala the restorative regimens associated with this knowledge are traditionally undertaken during the monsoon month of Karkidakam.",
      "At Choorakkodi the treatment is as old as the training, and kalari marma chikitsa is still offered at the academy as part of treatment.",
    ],
  },
  points: {
    title: "The 107 vital points",
    body: "One hundred and seven is the figure most often cited in the classical enumeration. The points are grouped by region of the body, and the grouping — rather than any single point — is what a practitioner works from.",
    note: "The regions below reflect the classical grouping. The interactive body map is a placeholder and will accept commissioned artwork.",
    regions: [
      { id: "head", label: "Head & neck", blurb: "The most guarded region of the classical map." },
      { id: "torso", label: "Thorax & abdomen", blurb: "Points associated with the trunk and its organs." },
      { id: "back", label: "Back", blurb: "Points along the spine and the shoulder girdle." },
      { id: "arms", label: "Upper limbs", blurb: "Points of the shoulder, arm, wrist and hand." },
      { id: "legs", label: "Lower limbs", blurb: "Points of the hip, knee, ankle and foot." },
    ],
  },
  healing: {
    title: "Healing",
    body: [
      "The therapeutic side of the tradition centres on hands-on manipulation, medicated oils and prescribed sequences of application, often alongside advice on rest and routine.",
      "Uzhichil, the kalari body massage, is one of its best-known forms: oil worked into the body by hand, and in some forms by foot, to support circulation and recovery. When the central government's Project Massage Training Centres ran in Calicut District, with the Parambarya Vaidya Foundation, the course was held at Choorakkodi Kalari (SDK Health Complex).",
      "It is a traditional cultural practice. It is not a diagnosis and it is not a substitute for medical care.",
    ],
  },
  consultation: {
    title: "Consultation",
    body: "Kalari marma chikitsa is offered at Shafi Dawa Khana Ayurveda Hospital, on the same Chelavoor campus (SDK Health Complex), under Dr. Saheer Ali as Chief Physician. The hospital has 50 beds and a GMP-certified medicine manufacturing unit, and its treatments also include a bone and joint clinic and fracture and dislocation management. Consultations begin with a conversation about what is appropriate, and with declining what is not. Book on +91 96057 30952 or at shafidawakhana.in.",
    pending: "Supply the consultation format and duration.",
  },
  disclaimer:
    "Kalari marma therapy is a traditional practice offered here as cultural and wellbeing care. It does not diagnose, treat or cure any medical condition. If you have an injury, a medical condition, or are pregnant, consult a qualified medical practitioner before booking.",
  image: slot("MARMA IMAGE", "Kalari uzhichil: two practitioners massage a patient by foot on the kalari floor", {
    src: "/images/training/kalari-uzhichil.webp",
  }),
  campus: slot("ACADEMY IMAGE", "The Vaidyasala doors at Shafi Dawa Khana, garlanded with flowers, marked GMP certified", {
    src: "/images/academy/vaidyasala.webp",
    width: 1170,
    height: 2059,
  }),
};

/* ------------------------------------------------------------ admissions */

export const admissions = {
  eyebrow: "Admissions",
  heading: ["Ready", "to begin?"],
  standfirst:
    "There is no application process. There is a message, a trial, and a floor to stand on.",
  steps: [
    {
      index: "01",
      title: "WhatsApp us",
      body: "Send a message saying who is joining and roughly when you can train. You will get current timings back.",
    },
    {
      index: "02",
      title: "Book your trial",
      body: "A trial session is arranged in the batch that fits. You are told what to bring before you arrive.",
    },
    {
      index: "03",
      title: "Visit the kalari",
      body: "Come and see the floor. Training is barefoot; wear something you can move in.",
    },
    {
      index: "04",
      title: "Begin training",
      body: "Start at the conditioning stage, where everyone starts, and keep coming back.",
    },
  ],
  who: {
    title: "Who can join",
    body: "Students of all genders can join at beginner, intermediate and advanced levels. The sub-junior programme welcomes children aged 6–14. Junior, senior and adult beginners are welcome too, and everyone starts with Meythari, the body conditioning. Training is introduced according to each learner's level and the instructor's guidance.",
    pending: "",
  },
  bring: {
    title: "What to bring",
    items: [
      "Clothing you can move freely in",
      "Water",
      "Nothing on your feet — training is barefoot",
      "Any medical information your teacher should know",
    ],
  },
  journey: {
    title: "A new student's journey",
    intro:
      "New students aged 6–14 enter the Sub-Junior category. Each session begins with about 15–20 minutes of stretching and warm-up, adjusted to the student's age, ability and readiness. Early training may include:",
    items: [
      { name: "Meythari", detail: "Foundational body conditioning and movement" },
      { name: "Poothara Vanakkam", detail: "The traditional salutation of the kalari" },
      { name: "Kalari Vandanam", detail: "Salutation and respectful practice, as the instructor teaches it" },
      { name: "Meypayattu", detail: "Basic movement sequences" },
      { name: "Kalugal & Chuvadukal", detail: "Kicks and steps" },
    ],
    note: "Over about two years, consistent, age-appropriate practice may help a student improve flexibility, coordination, movement control and confidence. Progress depends on attendance, individual development and the instructor's assessment; results differ from student to student.",
    image: slot("ACADEMY IMAGE", "Choorakkodi sub-juniors line up barefoot in the kalari", {
      src: "/images/academy/sub-juniors.webp",
      width: 1170,
      height: 986,
    }),
  },
  recovery: {
    title: "Food and recovery",
    body: [
      "A balanced diet, enough water and enough sleep support a growing child's training. Foods the academy suggests considering include bananas, mosambi (sweet lime), ragi and milk, where suitable. These are examples, not a diet plan.",
      "For allergies, lactose intolerance or other dietary needs, please consult a qualified healthcare professional or registered dietitian. Nutrition should complement safe training, rest and recovery.",
    ],
  },
  scheduleTitle: "Training schedule",
  scheduleItems: [
    "Monday – Saturday",
    "Sub-juniors · ages 6–14 · 4.30 – 6 pm",
    "Juniors & seniors · 6.30 – 8.30 pm",
    "Two classes a week for each batch",
    "Morning classes (6 – 7 am) planned",
  ],
  schedulePending: "",
  feesTitle: "Fees",
  feesPending: "Supply the fee structure, or confirm that fees are quoted on enquiry only.",
};

/* -------------------------------------------------------------- heritage */

export type ArchiveEntry = {
  id: string;
  index: string;
  year: string;
  title: string;
  caption: string;
  pending?: string;
  image: ImageSlot;
};

export const heritage = {
  eyebrow: "The archive",
  heading: ["Heritage."],
  standfirst:
    "An academy's archive is only as good as its honesty. Where a date or a name is not confirmed, this archive says so.",
  method:
    "Entries record what is visible in the photograph, separately from what is remembered, and attribute every remembered detail to the person who remembered it. Undated is a legitimate caption.",
  entries: [
    {
      id: "a-01",
      index: "Archive 01",
      year: "1960",
      title: "Foundation",
      caption: "Kalari lessons and kalari treatment begin at Usthad C.M.M. Gurukkal's home, as Shafi Dawa Khana Ayurveda Chikitsalayam. His portrait hangs in the kalari today, above the weapons.",
      pending: "Supply the date the portrait was taken, and a photograph of the first kalari if one survives.",
      image: slot("HISTORICAL IMAGE", "Framed portrait of Usthad C.M.M. Gurukkal above the kalari weapons", {
        src: "/images/heritage/founder-portrait-framed.webp",
        width: 1170,
        height: 1695,
      }),
    },
    {
      id: "a-02",
      index: "Archive 02",
      year: "Gurus",
      title: "The teachers",
      caption: "Usthad Gurukkal learned under around fifty Gurus across Kerala. Three men in conversation, from the academy's black-and-white prints.",
      pending: "Confirm the names of those pictured, with permission, and the date.",
      image: slot("HISTORICAL IMAGE", "Three men seated in conversation, a black-and-white print from the academy archive", {
        src: "/images/heritage/archive-elders.webp",
        width: 1093,
        height: 792,
      }),
    },
    {
      id: "a-03",
      index: "Archive 03",
      year: "Kolthari",
      title: "The staff",
      caption: "Two practitioners lock a long staff overhead. Wooden weapons come second in the syllabus, after the body is built.",
      pending: "Supply the date and the names of the practitioners.",
      image: slot("HISTORICAL IMAGE", "Two practitioners lock a long staff overhead, a black-and-white print", {
        src: "/images/heritage/archive-staff-lock.webp",
        width: 1170,
        height: 1947,
      }),
    },
    {
      id: "a-04",
      index: "Archive 04",
      year: "Verumkai",
      title: "The empty hand",
      caption: "A knife attack turned into a hold. Unarmed technique comes last, when control has been shown rather than assumed.",
      pending: "Supply the date and the names of the practitioners.",
      image: slot("HISTORICAL IMAGE", "A practitioner bends an attacker backwards and controls the knife hand, from the academy archive", {
        src: "/images/heritage/archive-knife-defence.webp",
        width: 1170,
        height: 1971,
      }),
    },
    {
      id: "a-05",
      index: "Archive 05",
      year: "Guests",
      title: "Visitors",
      caption: "Choorakkodi Kalari Sangam drew enthusiasts from all over the world. A visitor is welcomed at the kalari.",
      pending: "Confirm who is pictured, with permission, and the date of the visit.",
      image: slot("HISTORICAL IMAGE", "A visitor is welcomed with a handshake at Choorakkodi Kalari, from the academy archive", {
        src: "/images/heritage/archive-visitor.webp",
        width: 1112,
        height: 737,
      }),
    },
    {
      id: "a-06",
      index: "Archive 06",
      year: "Sport",
      title: "Recognition",
      caption: "The academy is affiliated to the Kerala Kalarippayattu Association, the District Sports Council and the Taekwondo and Yoga Associations of Kerala.",
      image: slot("HISTORICAL IMAGE", "The Sports Kalaripayattu Association crest, framed at the academy", {
        src: "/images/heritage/association-certificate.webp",
        width: 1170,
        height: 1659,
      }),
    },
    {
      id: "a-07",
      index: "Archive 07",
      year: "Today",
      title: "The floor now",
      caption: "66 years on, in Chelavoor. Six generations of students; nearly 50 now run academies of their own.",
      image: slot("KALARI IMAGE", "Choorakkodi trainers and students gathered with senior members of the academy in the kalari", {
        src: "/images/academy/team-with-leadership.webp",
        width: 1170,
        height: 909,
      }),
    },
  ] satisfies ArchiveEntry[],
};

/* --------------------------------------------------------------- contact */

export const contact = {
  eyebrow: "Visit",
  heading: ["Come", "train", "with us."],
  standfirst:
    "The academy is on State Highway 29, Chelavoor, Kozhikode, at the Shafi Dawa Khana Ayurvedic Wellness Center, near Hotel Gopika. Call or message us to arrange timings, directions and trial sessions.",
  landmark: {
    title: "Look for the sign",
    body: "The kalari shares its campus with Shafi Dawa Khana. From State Highway 29, look for the two boards above the roof: Shafi Dawa Khana, and the Choorakkodi crest beneath it.",
    image: slot("ACADEMY IMAGE", "The Shafi Dawa Khana and Choorakkodi signboards above the campus roof", {
      src: "/images/academy/campus-signboard.webp",
      width: 1170,
      height: 1596,
    }),
  },
};

/* ------------------------------------------------------------------- 404 */

export const notFound = {
  heading: ["Lost your", "way?"],
  sub: "Return to the kalari.",
  body: "The page you asked for is not here. It may have moved, or it may never have existed.",
};
