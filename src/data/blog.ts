import { slot, type ImageSlot } from "./assets";

export const blogCategories = [
  "Kalari",
  "Heritage",
  "Marma",
  "Training",
  "Wellness",
  "Culture",
] as const;

export type BlogCategory = (typeof blogCategories)[number];

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "image"; image: ImageSlot; caption?: string }
  | { type: "cta"; heading: string; label: string; message: string };

export type BlogPost = {
  slug: string;
  category: BlogCategory;
  title: string;
  excerpt: string;
  /** Editorial byline. No credentials are claimed for any author. */
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  image: ImageSlot;
  featured?: boolean;
  /**
   * These articles are general cultural writing prepared as editorial
   * scaffolding. They have not been reviewed or approved by the academy, so
   * they are served `noindex` and carry a visible editorial note. Set
   * `isDraft: false` once the academy has signed the text off.
   */
  isDraft: boolean;
  body: ArticleBlock[];
};

const whatsAppCta = (heading: string, message: string): ArticleBlock => ({
  type: "cta",
  heading,
  label: "WhatsApp the academy",
  message,
});

export const posts: BlogPost[] = [
  {
    slug: "what-happens-inside-a-kalari",
    category: "Kalari",
    title: "What Actually Happens Inside a Kalari",
    excerpt:
      "The training hall is not a backdrop. Its floor, its orientation and its order of ceremony shape the way the art is learned.",
    author: "The Choorakkodi Journal",
    publishedAt: "2026-08-14",
    updatedAt: "2026-09-02",
    readingMinutes: 7,
    featured: true,
    isDraft: true,
    image: slot("KALARI IMAGE", "Two students cross swords in a deep lunge on the earth floor of the Choorakkodi kalari, beneath the founder's portrait", { src: "/images/training/crossed-swords.webp", width: 1536, height: 1024 }),
    body: [
      { type: "p", text: "Most people meet Kalarippayattu as an image: a leap frozen mid-air, a flexible sword uncoiling, oil-lit skin against a dark floor. What the image cannot show is the room. And the room, in this tradition, is not incidental. The art is named after it. Kalari is the space; payattu is the practice carried out inside it. Learning the art means learning the building." },
      { type: "h2", text: "A room dug into the ground" },
      { type: "p", text: "The classical training hall is described as a sunken structure — a pit dug below ground level, entered by steps, roofed and walled so that light arrives sparingly. The descriptions that survive give it proportions and an orientation, with the entrance conventionally set to the east and the floor of packed earth rather than stone or timber. Different regions and lineages record the measurements differently, and any serious account of the architecture should be read as a family of traditions rather than a single blueprint." },
      { type: "p", text: "The practical consequences are immediate. Earth underfoot is forgiving in a way that a hard floor is not, which matters when a syllabus opens with months of low stances, jumps and falls. Sunk below grade, the room holds a steady temperature and a steady humidity through a Kerala summer and a Kerala monsoon alike. The low light removes the mirror-and-spotlight relationship a modern student might have with their own training. There is nothing to watch except the person teaching you." },
      { type: "image", image: slot("KALARI IMAGE", "A sword lying on the packed-earth floor of the Choorakkodi kalari", { src: "/images/training/sword-on-floor.webp", width: 1536, height: 1024 }), caption: "Packed earth: the floor every stage of the syllabus is trained on." },
      { type: "h2", text: "Entering" },
      { type: "p", text: "Entry is not casual. Across lineages, a student touches the ground and their own forehead on stepping in, salutes the presiding deity or the lamp at the corner, and greets the teacher before beginning. These gestures are sometimes read from outside as decoration. Inside, they do something structural: they mark a boundary in time. On one side of the threshold you are a person with a day behind you. On the other you are a body under instruction." },
      { type: "quote", text: "The floor is swept before every session. Not because it is dirty, but because sweeping it is the first instruction.", },
      { type: "h2", text: "The order of learning" },
      { type: "p", text: "The syllabus is conventionally described in four stages, taken in sequence and not in parallel." },
      { type: "list", ordered: true, items: [
        "Meythari — body work. Stances, sequences, kicks, jumps and rolls, trained until the body itself is the instrument. Nothing is held in the hands.",
        "Kolthari — wooden weapons. The long staff, the short stick and the curved wooden otta, which is generally taught last of the three and is closely tied to knowledge of the vital points.",
        "Ankathari — edged weapons. Sword and shield, spear and dagger, and at the far end of the syllabus the urumi, the flexible blade that is dangerous chiefly to the person holding it.",
        "Verumkai — the bare hand. Locks, throws, strikes and the application of the vital points, taught last because it is the most consequential.",
      ] },
      { type: "p", text: "The ordering is the argument. A student is not armed until the body can be trusted, and is not taught to apply the vital points until years of supervision have established that they will not. A school that reverses the order is teaching something else." },
      { type: "h2", text: "Oil, and the second half of the tradition" },
      { type: "p", text: "Kalarippayattu has always carried a therapeutic counterpart. The same map of the body that tells a practitioner where damage can be done tells a therapist where a body can be worked on, and the teacher of one is frequently the practitioner of the other. Oil application and massage form part of conditioning as well as treatment, and in Kerala the monsoon month of Karkidakam is traditionally associated with this restorative work." },
      { type: "p", text: "This is worth stating plainly for a reader arriving from outside the tradition: the martial and the medical are not two subjects that happen to share a building. They are one body of knowledge read in two directions." },
      whatsAppCta(
        "Want to see the floor for yourself?",
        "Hello — I read the Choorakkodi Journal and I would like to visit the kalari.",
      ),
      { type: "h2", text: "What a first month looks like" },
      { type: "p", text: "Less than most beginners expect, and harder. The opening weeks are conditioning: holding positions longer than is comfortable, learning to fall without bracing, repeating a short sequence until it stops being a sequence and becomes a way of standing up. Progress in this period is not measured in technique acquired. It is measured in how long the body holds its shape when it is tired." },
      { type: "p", text: "That is the part of the art no photograph captures, and it is the part that decides who is still training in a year." },
      { type: "quote", text: "Editorial note: this article describes the Kalarippayattu tradition in general terms. Details specific to the Choorakkodi kalari and its syllabus will be confirmed by the academy before publication.", },
    ],
  },
  {
    slug: "the-four-stages-of-training",
    category: "Training",
    title: "The Four Stages, and Why the Order Never Changes",
    excerpt:
      "Meythari, kolthari, ankathari, verumkai. The sequence looks like a curriculum. It is closer to a safeguard.",
    author: "The Choorakkodi Journal",
    publishedAt: "2026-07-30",
    readingMinutes: 6,
    featured: true,
    isDraft: true,
    image: slot("TRAINING IMAGE", "A Choorakkodi sub-junior holds a split between two trainers on the kalari rings", { src: "/images/training/rings-split.webp", width: 1170, height: 871 }),
    body: [
      { type: "p", text: "Ask why a traditional syllabus takes years to arrive at the bare hand, when the bare hand is the thing every student already has, and the answer is not mystical. It is a decision about risk, made a long time ago and kept." },
      { type: "h2", text: "Meythari: building the instrument" },
      { type: "p", text: "The first stage puts nothing in the hands. Its material is stances, kicks, jumps, rolls and linked sequences trained to the point of thoughtlessness. The Malayalam word meyy means body; the stage is body-work in the most literal sense, and its purpose is to produce the range, balance and tolerance that everything after it assumes." },
      { type: "p", text: "It is also the filter. Conditioning is repetitive, uncomfortable and visibly unglamorous. Students who came for the urumi tend to discover this in week three." },
      { type: "h3", text: "What is actually being built" },
      { type: "list", items: [
        "Hip and spine range sufficient for the low positions the later stages demand.",
        "Landing mechanics — the ability to fall, roll and recover without bracing against the ground.",
        "Sustained attention, which is trained the same way as anything else: by being required.",
      ] },
      { type: "h2", text: "Kolthari: wood before steel" },
      { type: "p", text: "The second stage introduces weapons that hurt without killing. The long staff teaches distance and the management of a weapon longer than the body. The short stick brings the range in. The curved wooden otta, generally the last of the three, is the bridge into the knowledge of the vital points — its shape exists to reach them." },
      { type: "quote", text: "Wood is the honest teacher. It records every error on the body, at a cost the student can afford to pay." },
      { type: "h2", text: "Ankathari: the edged stage" },
      { type: "p", text: "Sword and shield, spear, dagger, and in the deepest reaches of the syllabus the urumi — the flexible blade that returns along its own path and punishes imprecision instantly. Nothing here is attempted before the wooden stage is secure, because the margin for error has collapsed." },
      { type: "h2", text: "Verumkai: last, not first" },
      { type: "p", text: "The empty hand comes at the end. Locks, throws, strikes and the application of the vital points are taught when a student's control, judgement and temperament have been under observation for years. Placing this material first — as a short self-defence course inevitably must — changes what it is. Placing it last is the tradition's way of deciding who receives it." },
      whatsAppCta(
        "Starting from the beginning?",
        "Hello — I would like to ask about beginning training at Choorakkodi.",
      ),
      { type: "p", text: "There is no shortcut through this order, and a school that offers one is selling the vocabulary of the art rather than the art." },
      { type: "quote", text: "Editorial note: general description of the traditional syllabus. The Choorakkodi academy will confirm its own progression and grading before publication." },
    ],
  },
  {
    slug: "marma-in-the-classical-texts",
    category: "Marma",
    title: "Marma: What the Classical Texts Describe",
    excerpt:
      "A map of the body that predates the martial art built on top of it — and what can and cannot responsibly be said about it.",
    author: "The Choorakkodi Journal",
    publishedAt: "2026-07-11",
    readingMinutes: 7,
    isDraft: true,
    image: slot("MARMA IMAGE", "Kalari uzhichil at Choorakkodi: two practitioners massage a patient by foot on the kalari floor", { src: "/images/training/kalari-uzhichil.webp", width: 1600, height: 1067 }),
    body: [
      { type: "p", text: "Marma are the vital points: locations where, in the classical account, flesh, vessel, sinew, bone and joint meet, and where the body is therefore held to be most sensitive to injury. The concept reaches Kalarippayattu from the older medical literature rather than the other way round." },
      { type: "h2", text: "Where the idea comes from" },
      { type: "p", text: "The enumeration of marma appears in the classical Ayurvedic surgical literature, where the points are catalogued and grouped by region of the body and by the consequence of injuring them. The figure most often cited is one hundred and seven. The context is explicitly surgical and protective: a practitioner is being told where not to cut." },
      { type: "p", text: "Kalarippayattu inherits the map and reads it in both directions. The same knowledge that identifies where a body is vulnerable identifies where it can be worked on, and in the kalari tradition the teacher of the martial syllabus is frequently the practitioner of the therapeutic one." },
      { type: "image", image: slot("MARMA IMAGE", "The Vaidyasala doors at Shafi Dawa Khana, garlanded with flowers, marked GMP certified", { src: "/images/academy/vaidyasala.webp", width: 1170, height: 2059 }), caption: "The Vaidyasala at Shafi Dawa Khana, on the same Chelavoor campus as the kalari." },
      { type: "h2", text: "What the therapeutic practice involves" },
      { type: "p", text: "In practice the healing side of the tradition centres on hands-on manipulation, medicated oils and prescribed sequences of application, often alongside advice on rest and routine. In Kerala this work is culturally associated with the monsoon month of Karkidakam, when the restorative regimens are traditionally undertaken." },
      { type: "h2", text: "What should not be claimed" },
      { type: "p", text: "This deserves its own heading, because the internet is full of the opposite. Marma therapy is a traditional practice with deep cultural roots. It is not a substitute for medical diagnosis or treatment, and a responsible practitioner does not present it as one." },
      { type: "list", items: [
        "No claim of diagnosis, cure or treatment of disease belongs in a description of this work.",
        "Anyone with an injury, a medical condition or a pregnancy should speak to a qualified clinician before booking hands-on therapy.",
        "A consultation should begin with a conversation about what is appropriate, and should decline what is not.",
      ] },
      { type: "quote", text: "The tradition is old enough not to need exaggerating." },
      whatsAppCta(
        "Considering a consultation?",
        "Hello — I would like to ask about a marma consultation at Choorakkodi.",
      ),
      { type: "p", text: "Read that way, marma is neither folklore nor medicine-in-disguise. It is a detailed, regionally transmitted account of where the body is most concentrated, kept alive by people who use it carefully." },
      { type: "quote", text: "Editorial note: general cultural description. Choorakkodi will confirm which consultations it offers, and by whom, before publication." },
    ],
  },
  {
    slug: "kalarippayattu-and-the-northern-ballads",
    category: "Culture",
    title: "The Art and the Ballads It Lives Inside",
    excerpt:
      "Malabar's Vadakkan Pattukal gave Kalarippayattu its heroes. Reading them well means knowing where the song ends and the record begins.",
    author: "The Choorakkodi Journal",
    publishedAt: "2026-06-19",
    readingMinutes: 6,
    isDraft: true,
    image: slot("HISTORICAL IMAGE", "From the Choorakkodi album: two practitioners face each other with short weapons in the old kalari", { src: "/images/heritage/archive-short-weapons.webp", width: 1170, height: 825 }),
    body: [
      { type: "p", text: "You cannot read about Kalarippayattu in the Malabar region for long before meeting the Vadakkan Pattukal — the Northern Ballads, a body of Malayalam folk song built around duels, feuds and the fighters who carried them out." },
      { type: "h2", text: "Songs, not chronicles" },
      { type: "p", text: "The ballads are oral literature. They were sung, transmitted, embellished and eventually written down, and their heroes have long since passed into popular culture through film and retelling. They are a genuine record of how the art was regarded — what it meant for a community to produce a fighter, what honour and obligation looked like — and they are not a source for dates, lineages or events." },
      { type: "quote", text: "A ballad tells you what people valued. It does not tell you what happened on a Tuesday." },
      { type: "h2", text: "Why the distinction matters to an academy" },
      { type: "p", text: "Because the temptation runs the other way. It is easy for a school to attach itself to a legendary name and let the association do the work. The more defensible position — and the more interesting one — is to treat the ballads as cultural context and to keep the academy's own history to what can actually be documented: who taught whom, where, and when." },
      { type: "h2", text: "The interruption" },
      { type: "p", text: "The art's modern history includes a long suppression. Colonial-era restrictions on arms and on martial training in the region drove the practice into decline through the nineteenth century, and the revival that followed in the early twentieth was a deliberate act of recovery by practitioners who had kept teaching quietly. Much of what is trained today reaches the present through that narrow channel." },
      { type: "p", text: "Which is a reason to be careful with the word unbroken. Traditions survive; they rarely survive untouched." },
      whatsAppCta(
        "Curious about the tradition?",
        "Hello — I would like to learn more about Kalarippayattu at Choorakkodi.",
      ),
      { type: "quote", text: "Editorial note: general historical and cultural background, not a statement about any particular lineage. Academy history will be supplied separately." },
    ],
  },
  {
    slug: "training-through-the-monsoon",
    category: "Wellness",
    title: "Training Through the Monsoon",
    excerpt:
      "Karkidakam has a reputation in Kerala: the month the body is put back together. What that means for people who train.",
    author: "The Choorakkodi Journal",
    publishedAt: "2026-06-02",
    readingMinutes: 5,
    isDraft: true,
    image: slot("TRAINING IMAGE", "Daylight falls across the Choorakkodi kalari as a student leaps with sword and shield", { src: "/images/training/kalari-academy-leap.webp", width: 1600, height: 1318 }),
    body: [
      { type: "p", text: "The Malayalam month of Karkidakam falls in the heart of the monsoon, and in Kerala it carries a long association with restorative regimens — oil treatments, adjusted diet, rest, and a reduction in hard physical work." },
      { type: "h2", text: "Why the calendar sits where it does" },
      { type: "p", text: "The traditional reasoning is climatic and agricultural. The heavy rains suspend outdoor labour; humidity is high and sunlight scarce; the preceding months have been physically demanding. The period is therefore given over to recovery rather than accumulation." },
      { type: "p", text: "For a kalari this is not a pause in the syllabus so much as a change of emphasis. Conditioning load comes down. Oil application and hands-on work come up. Attention shifts from adding technique to repairing the body that carries it." },
      { type: "h3", text: "A sensible reading for a modern student" },
      { type: "list", items: [
        "Deload periods are not a concession. Every serious physical practice has them; this one is simply scheduled by the weather.",
        "Recovery work is trainable. Sleep, food and unhurried mobility are part of the syllabus, not an alternative to it.",
        "Traditional regimens are cultural practice, not clinical care. Anything medical belongs with a clinician.",
      ] },
      { type: "quote", text: "The floor is still swept in Karkidakam. The work is just quieter." },
      whatsAppCta(
        "Ask about the seasonal schedule",
        "Hello — I would like to ask about training schedules at Choorakkodi.",
      ),
      { type: "quote", text: "Editorial note: general cultural description. The academy will confirm its own seasonal schedule before publication." },
    ],
  },
  {
    slug: "reading-an-archive-photograph",
    category: "Heritage",
    title: "How to Read an Archive Photograph",
    excerpt:
      "An undated print from a kalari can carry more information than a caption — provided nobody invents the caption.",
    author: "The Choorakkodi Journal",
    publishedAt: "2026-05-21",
    readingMinutes: 5,
    isDraft: true,
    image: slot("HISTORICAL IMAGE", "An undated black-and-white print from the Choorakkodi archive: three men seated in conversation", { src: "/images/heritage/archive-elders.webp", width: 1093, height: 792 }),
    body: [
      { type: "p", text: "Every academy with a long history has a box of photographs, and most of them are undated, unlabelled and half-remembered. The instinct is to caption them confidently. The better discipline is to caption them honestly and let the image do the rest." },
      { type: "h2", text: "What a photograph can tell you" },
      { type: "p", text: "Stance and grip date a photograph more reliably than memory does. So do the weapons on the wall, the construction of the roof, the clothing, the printing process and the wear on the print itself. A careful look establishes a range — a decade, sometimes a narrower window — without anyone having to guess a year." },
      { type: "h2", text: "What it cannot" },
      { type: "p", text: "It cannot tell you who is standing in the third row, unless someone alive can say so. It cannot tell you that a session was the first of its kind, or that a teacher in frame founded anything. Those are claims, and claims need a source." },
      { type: "quote", text: "An honest caption reading 'undated, circa 1970s' is worth more than a confident one that is wrong." },
      { type: "h3", text: "A working method" },
      { type: "list", ordered: true, items: [
        "Scan at high resolution before handling the print further.",
        "Record what is visible, separately from what is remembered.",
        "Attribute every remembered detail to the person who remembered it.",
        "Publish uncertainty as uncertainty. 'Photographer unknown' is a legitimate credit.",
      ] },
      { type: "p", text: "This site's Heritage section is built on that principle. Where a date or a name has not been confirmed, the archive says so rather than filling the gap." },
      whatsAppCta(
        "Have photographs of the academy?",
        "Hello — I have photographs connected to the Choorakkodi kalari that may be of interest to the archive.",
      ),
      { type: "quote", text: "Editorial note: methodological piece. Individual archive entries will be captioned by the academy." },
    ],
  },
];

/* Helpers take the list as an argument: the live list comes from the CMS. */

export function featuredPost(posts: BlogPost[]): BlogPost | undefined {
  return posts.find((p) => p.featured) ?? posts[0];
}

export function getPost(posts: BlogPost[], slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function relatedPosts(posts: BlogPost[], slug: string, limit = 3): BlogPost[] {
  const current = getPost(posts, slug);
  if (!current) return posts.slice(0, limit);
  const sameCategory = posts.filter((p) => p.slug !== slug && p.category === current.category);
  const rest = posts.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
