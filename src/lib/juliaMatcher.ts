import { juliaKnowledge, JuliaKnowledgeItem } from "../data/juliaKnowledge";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(" ")
    .filter((word) => word.length > 2);
}

const genericWords = new Set([
  "help",
  "need",
  "want",
  "can",
  "please",
  "tell",
  "know",
  "information",
  "what",
  "how",
  "does",
  "you",
  "your",
  "the",
  "about",
]);

const contextGroups = [
  {
    category: "DELIVERY",
    phrases: [
      "deliver a package",
      "deliver package",
      "delivery package",
      "send a package",
      "send package",
      "deliver parcel",
      "send parcel",
    ],
    words: [
      "deliver",
      "delivery",
      "package",
      "parcel",
    ],
  },
  {
    category: "PROPERTY_MANAGEMENT",
    phrases: [
      "manage my property",
      "manage property",
      "help managing my property",
      "help manage my property",
      "property management",
      "manage my building",
      "manage building",
      "rental management",
      "manage rental",
    ],
    words: [
      "management",
      "manage",
      "tenant",
      "rental",
      "maintenance",
    ],
  },
  {
    category: "PROPERTY_INVESTMENT",
    phrases: [
      "invest in property",
      "property investment",
      "invest in real estate",
      "real estate investment",
      "investment property",
    ],
    words: [
      "invest",
      "investment",
      "investor",
    ],
  },
  {
    category: "HAULAGE",
    phrases: [
      "move heavy goods",
      "transport heavy goods",
      "heavy goods",
      "hire a truck",
      "hire truck",
      "hire a lorry",
      "hire lorry",
      "truck to move",
      "lorry to move",
    ],
    words: [
      "truck",
      "lorry",
      "haulage",
      "cargo",
      "heavy",
      "load",
    ],
  },
  {
    category: "LOGISTICS",
    phrases: [
      "move goods",
      "transport goods",
      "goods transportation",
      "logistics service",
      "logistics support",
    ],
    words: [
      "logistics",
      "transport",
      "goods",
    ],
  },
  {
    category: "CONTACT",
    phrases: [
      "speak to someone",
      "speak to a person",
      "talk to someone",
      "talk to a person",
      "speak with someone",
      "contact someone",
      "speak to staff",
      "talk to staff",
      "human agent",
      "customer service",
    ],
    words: [
      "contact",
      "phone",
      "email",
      "whatsapp",
      "staff",
      "representative",
    ],
  },
];

function scoreItem(
  input: string,
  item: JuliaKnowledgeItem
): number {
  const normalizedInput = normalize(input);
  const inputWords = tokenize(input);

  let score = 0;

  // Exact question
  if (normalizedInput === normalize(item.question)) {
    score += 100;
  }

  // Knowledge-base keywords
  for (const keyword of item.keywords) {
    const normalizedKeyword = normalize(keyword);

    if (
      normalizedKeyword.length > 3 &&
      normalizedInput.includes(normalizedKeyword)
    ) {
      if (normalizedKeyword.includes(" ")) {
        score += 30;
      } else if (!genericWords.has(normalizedKeyword)) {
        score += 10;
      }
    }

    const keywordWords = tokenize(keyword);

    for (const word of keywordWords) {
      if (
        word.length > 3 &&
        inputWords.includes(word) &&
        !genericWords.has(word)
      ) {
        score += 3;
      }
    }
  }

  // Question similarity, excluding generic words
  for (const word of tokenize(item.question)) {
    if (
      inputWords.includes(word) &&
      !genericWords.has(word)
    ) {
      score += 2;
    }
  }

  // Strong contextual matching
  for (const group of contextGroups) {
    if (group.category !== item.category) {
      continue;
    }

    for (const phrase of group.phrases) {
      if (normalizedInput.includes(phrase)) {
        score += 60;
      }
    }

    for (const word of group.words) {
      if (inputWords.includes(word)) {
        score += 12;
      }
    }
  }

  return score;
}

export function findJuliaAnswer(
  userMessage: string
): JuliaKnowledgeItem | null {
  const input = normalize(userMessage);

  if (!input) {
    return null;
  }

  let bestMatch: JuliaKnowledgeItem | null = null;
  let bestScore = 0;

  for (const item of juliaKnowledge) {
    const score = scoreItem(userMessage, item);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  // Anything below this threshold is treated as unknown.
  if (bestScore < 10) {
    return null;
  }

  return bestMatch;
}
