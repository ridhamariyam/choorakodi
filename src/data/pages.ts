import { slot, type ImageSlot } from "./assets";

/**
 * Page-level editorial copy, kept out of components so a CMS can take over.
 *
 * Rule applied throughout: descriptive writing about Kalarippayattu and the
 * kalari tradition in general is real copy. Anything specific to Choorakkodi's
 * own history, people, schedule or claims is a `pending` slot.
 */

/* ------------------------------------------------------------------ home */

export const homeIntro = {
  eyebrow: "Kalari · Heritage · Kozhikode",
  heading: ["Six decades", "of discipline."],
  body: [
    "CMM Gurukkal's Choorakkodi Martial Arts Academy has taught Kalarippayattu in Chelavoor, Kozhikode since 1960. Its founder, Usthad C.M.M. Gurukkal, learned the art under around fifty Gurus across Kerala and brought the Thekkan, Vadakkan, Thulunadan and Kadathanadan styles into one kalari, with the Northern style at its heart.",
    "It began at home, as kalari lessons and kalari treatment under the name Shafi Dawa Khana Ayurveda Chikitsalayam, and grew into Choorakkodi Kalari Sangam. In 66 years it has trained thousands of students; nearly 50 of them now run academies of their own.",
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
  pending: "",
  image: slot("FOUNDER IMAGE", "Portrait of Usthad C.M.M. Gurukkal", {
    brief: "public/images/founder — formal portrait, ideally in the kalari",
  }),
  facts: [
    { label: "Role", value: "Founder · Gurukkal" },
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
    "The kalari Usthad C.M.M. Gurukkal founded in 1960: one academy in Chelavoor, Kozhikode, 66 years under the name Choorakkodi Kalari Sangam, and thousands of students.",
  sections: [
    {
      title: "The Choorakkodi lineage",
      body: "Usthad Gurukkal learned under around fifty Gurus and studied Thekkan, Vadakkan, Thulunadan and Kadathanadan Mura. The academy teaches what he gathered, with the Northern style at its centre, alongside the kalari chikitsa he learned from Hakeem Abu Ahammed Ponnani, K.T. Mahavan Vadiyar and Raghavan Thirumulpad. Its trainers are brought up within the academy in the Gurukul system, and teach the founder's traditional syllabus together with a technically updated one.",
      pending: "",
    },
    {
      title: "Current leadership",
      body: "The founder's son, Dr. Saheer Ali (BAMS, BSc (Botany), DYN), carries the legacy forward. He is Managing Director and Chief Physician of Shafi Dawa Khana, recognised as one of the leading experts in marma chikitsa, and skilled in yoga, naturopathy and chiropractic. His awards include the Dhanwantari award 2022 for best alumni doctor, for 22 years of excellence, and a best doctor's award from the Ayurveda Medicine Association of India (AMAI), Kunnamangalam area. Under his mentorship the academy's students have won prizes at National and State Kalari Championships and competed at the SAF Games. Classes are taken by certified trainers brought up within the academy.",
      pending: "Name the current trainers.",
    },
    {
      title: "Authenticity",
      body: "CMM Gurukkal's Choorakkodi Martial Arts Academy in Chelavoor, Kozhikode, is the kalari Usthad C.M.M. Gurukkal founded in 1960, and the only one he founded. It has run for 66 years under the name Choorakkodi Kalari Sangam, and it has no branches. Nearly fifty of its former students now run academies of their own; those are independent, not branches of this academy.",
      pending: "",
    },
  ],
  portrait: slot("FOUNDER IMAGE", "Portrait of the gurukkal"),
  archival: slot("HISTORICAL IMAGE", "An early photograph of the academy"),
  wide: slot("KALARI IMAGE", "Two students cross swords in a deep lunge beneath the founder's portrait in the kalari", {
    src: "/images/training/crossed-swords.webp",
  }),
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
    ],
  },
  style: {
    title: "The Choorakkodi style",
    body: "Usthad C.M.M. Gurukkal learned the Thekkan, Vadakkan, Thulunadan and Kadathanadan styles under around fifty Gurus. The Choorakkodi syllabus draws on all four, with the Northern (Vadakkan) style at its heart, and is taught alongside the kalari marma chikitsa he learned at the same time. The founder's traditional syllabus is taught together with a technically updated one, with personal care from trainers brought up within the academy.",
    pending: "",
  },
  stages: [
    {
      index: "01",
      name: "Meythari",
      translation: "Body work",
      body: "Stances, kicks, jumps, rolls and linked sequences. Nothing is held in the hands. The stage builds the range, balance and tolerance every later stage assumes.",
    },
    {
      index: "02",
      name: "Kolthari",
      translation: "Wooden weapons",
      body: "The long staff, the short stick and the curved otta. Weapons that record an error on the body at a cost the student can afford.",
    },
    {
      index: "03",
      name: "Ankathari",
      translation: "Edged weapons",
      body: "Sword and shield, spear, dagger, and at the far end the urumi — the flexible blade that punishes imprecision immediately.",
    },
    {
      index: "04",
      name: "Verumkai",
      translation: "The bare hand",
      body: "Locks, throws, strikes and the application of the vital points. Taught last, when control has been observed over years.",
    },
  ],
  learn: {
    title: "What students learn",
    items: [
      "Conditioning — range, balance, landing mechanics and sustained attention",
      "Sequences trained to the point where they stop being sequences",
      "Wooden weapons: staff, short stick, otta",
      "Edged weapons, at the appropriate stage",
      "Unarmed application: locks, throws, strikes",
      "The conduct expected inside a kalari",
    ],
  },
  who: {
    title: "Who can join",
    body: "Students of all genders, from 7 years of age. Classes run at beginner, intermediate and advanced levels, and the conditioning stage assumes no prior experience. Trial classes are available, and certification is offered.",
    pending: "",
  },
  schedule: {
    title: "Schedules",
    items: [
      "Monday – Saturday",
      "Sub-juniors · 4.30 – 6 pm",
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
      "At Choorakkodi the treatment came first. From 1960 Usthad C.M.M. Gurukkal offered kalari treatment from his home, as Shafi Dawa Khana Ayurveda Chikitsalayam and later Choorakkodi Kalari Chikitsalayam. He had learned kalari chikitsa and Ayurveda from Hakeem Abu Ahammed Ponnani, K.T. Mahavan Vadiyar and Raghavan Thirumulpad. Kalari marma chikitsa is still offered at the academy as part of treatment.",
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
    body: "Students of all genders, from 7 years of age, at beginner, intermediate and advanced levels. Conditioning is scaled to the body in front of the teacher.",
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
  scheduleTitle: "Training schedule",
  scheduleItems: [
    "Monday – Saturday",
    "Sub-juniors · 4.30 – 6 pm",
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
      year: "1960s",
      title: "Foundation",
      caption: "Kalari lessons and kalari treatment begin at Usthad C.M.M. Gurukkal's home, as Shafi Dawa Khana Ayurveda Chikitsalayam.",
      pending: "Supply the founding photograph and its confirmed caption, photographer and date.",
      image: slot("HISTORICAL IMAGE", "Archive 01 — the earliest photograph of the academy"),
    },
    {
      id: "a-02",
      index: "Archive 02",
      year: "1970s",
      title: "The lineage",
      caption: "Transmission from hand to hand.",
      pending: "Supply the photograph and the confirmed names of those pictured, with permission.",
      image: slot("HISTORICAL IMAGE", "Archive 02 — portrait from the academy's second decade"),
    },
    {
      id: "a-03",
      index: "Archive 03",
      year: "1990s",
      title: "Continuation",
      caption: "The syllabus holds its shape.",
      pending: "Supply the photograph and its confirmed date range.",
      image: slot("HISTORICAL IMAGE", "Archive 03 — training at the kalari in the 1990s"),
    },
    {
      id: "a-04",
      index: "Archive 04",
      year: "Today",
      title: "The floor now",
      caption: "66 years on, in Chelavoor. Thousands trained; nearly 50 now run academies of their own.",
      image: slot("KALARI IMAGE", "Archive 04 — the kalari today, with the founder's portrait above the floor", {
        src: "/images/training/crossed-swords.webp",
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
};

/* ------------------------------------------------------------------- 404 */

export const notFound = {
  heading: ["Lost your", "way?"],
  sub: "Return to the kalari.",
  body: "The page you asked for is not here. It may have moved, or it may never have existed.",
};
