export type FaqItem = {
  question: string;
  answer: string;
  /** True when the honest answer depends on information the academy must supply. */
  pending?: boolean;
};

export type FaqSet = {
  id: string;
  items: FaqItem[];
};

export const kalarippayattuFaq: FaqItem[] = [
  {
    question: "Do I need any previous martial arts experience?",
    answer:
      "No. The syllabus opens with body conditioning, which assumes nothing and is where every student begins regardless of background.",
  },
  {
    question: "How long before I train with a weapon?",
    answer:
      "Weapons follow the conditioning stage, not the other way round. The wooden weapons come first, and only once the body work is secure.",
    pending: true,
  },
  {
    question: "Is Kalarippayattu safe?",
    answer:
      "Training is supervised and progressive, which is the point of the four-stage order: nothing consequential is introduced before the control to handle it exists. As with any physical discipline, tell your teacher about injuries and existing conditions before you start.",
  },
  {
    question: "What should I wear to a first session?",
    answer:
      "Comfortable clothing you can move freely in. Training is barefoot. The academy will advise on traditional training dress as you progress.",
    pending: true,
  },
  {
    question: "What are the class timings and fees?",
    answer:
      "Classes run Monday to Saturday: sub-juniors 4.30 – 6 pm, juniors and seniors 6.30 – 8.30 pm, with two classes a week for each batch. Fees are confirmed by the academy on enquiry.",
    pending: true,
  },
  {
    question: "Can children train?",
    answer:
      "Yes. Most students are children, and the academy takes students of all genders from 7 years of age. Sub-juniors train from 4.30 to 6 pm.",
  },
  {
    question: "Do you offer certification?",
    answer:
      "Yes. Training runs at beginner, intermediate and advanced levels, and certification is offered. Weekly classes, a one-month summer camp and intensive courses are all available.",
  },
  {
    question: "Are other Choorakkodi kalaris branches of this academy?",
    answer:
      "No. CMM Gurukkal's Choorakkodi Martial Arts Academy has one location, in Chelavoor, Kozhikode, and no branches. Nearly fifty former students now run academies of their own; those are independent.",
  },
  {
    question: "Does the academy perform at events?",
    answer:
      "Yes. The academy has appeared at the National Games 2015, the SAF Games, on a Russian tour, and at national seminars and programmes across Kerala.",
  },
];

export const admissionsFaq: FaqItem[] = [
  {
    question: "How do I book a trial class?",
    answer:
      "Message the academy on WhatsApp. A trial is arranged around the batch that fits your schedule, and you are told what to bring before you arrive.",
  },
  {
    question: "Is there a joining fee or a minimum term?",
    answer: "Fees and terms are confirmed by the academy on enquiry.",
    pending: true,
  },
  {
    question: "Can I watch a session before joining?",
    answer:
      "Visitors are usually welcome to observe, subject to the batch. Ask when you message so a suitable session can be suggested.",
    pending: true,
  },
  {
    question: "What age can students join?",
    answer: "From 7 years of age, of all genders. Beginners start at the conditioning stage.",
  },
  {
    question: "Do you accept adult beginners?",
    answer:
      "Yes. Conditioning is scaled to the body in front of the teacher, and adults start at the same stage everyone starts at.",
  },
  {
    question: "Where is the academy?",
    answer:
      "State Highway 29, Chelavoor, Kozhikode, Kerala 673571, at the Shafi Dawa Khana Ayurvedic Wellness Center, near Hotel Gopika.",
  },
];

export const marmaFaq: FaqItem[] = [
  {
    question: "Is marma therapy medical treatment?",
    answer:
      "No. It is a traditional hands-on practice. It is not a diagnosis, and it is not a substitute for care from a qualified clinician. Anyone with an injury, a medical condition or a pregnancy should speak to a doctor first.",
  },
  {
    question: "What happens in a consultation?",
    answer: "The format, duration and scope of consultations are confirmed by the academy.",
    pending: true,
  },
  {
    question: "Do I need to be a student of the academy?",
    answer:
      "No. Kalari marma chikitsa is offered to patients at Shafi Dawa Khana Ayurveda Hospital, on the academy's campus in Chelavoor. Call +91 96057 30952 to book.",
  },
];
