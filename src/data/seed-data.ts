export const seedPhonicsPatterns = [
  {
    id: "patt_cvc_a",
    name: "Short a (CVC)",
    phase: 2,
    sequenceOrder: 1.1,
    description: "Words with short a sound like cat, map.",
    parentScript: "Say each sound slowly: /c/ /a/ /t/. Then say it fast: cat."
  },
  {
    id: "patt_cvc_i",
    name: "Short i (CVC)",
    phase: 2,
    sequenceOrder: 1.2,
    description: "Words with short i sound like sit, pig.",
    parentScript: "Say each sound slowly: /s/ /i/ /t/. Then say it fast: sit."
  },
  {
    id: "patt_cvc_o",
    name: "Short o (CVC)",
    phase: 2,
    sequenceOrder: 1.3,
    description: "Words with short o sound like pot, dog.",
    parentScript: "Say each sound slowly: /p/ /o/ /t/. Then say it fast: pot."
  }
];

export const seedWords = [
  { id: "word_1", text: "cat", isNonsense: false, frequencyList: "high" },
  { id: "word_2", text: "map", isNonsense: false, frequencyList: "high" },
  { id: "word_3", text: "bat", isNonsense: false, frequencyList: "high" },
  { id: "word_4", text: "sit", isNonsense: false, frequencyList: "high" },
  { id: "word_5", text: "pig", isNonsense: false, frequencyList: "high" },
  { id: "word_6", text: "rip", isNonsense: false, frequencyList: "high" },
  { id: "word_7", text: "pot", isNonsense: false, frequencyList: "high" },
  { id: "word_8", text: "dog", isNonsense: false, frequencyList: "high" },
  { id: "word_9", text: "log", isNonsense: false, frequencyList: "high" },
  { id: "word_10", text: "zat", isNonsense: true, frequencyList: null },
  { id: "word_11", text: "vip", isNonsense: true, frequencyList: null },
  { id: "word_12", text: "nop", isNonsense: true, frequencyList: null }
];

export const seedDecodablePassages = [
  {
    id: "pass_1",
    title: "The Cat on the Map",
    content: "The cat sat on the map. The map is by the bat.",
    wordCount: 12,
    maxPatternId: "patt_cvc_a",
    patternsUsed: ["patt_cvc_a"]
  },
  {
    id: "pass_2",
    title: "The Pig in the Pot",
    content: "A pig sat in a pot. The dog ran to the log.",
    wordCount: 12,
    maxPatternId: "patt_cvc_o",
    patternsUsed: ["patt_cvc_a", "patt_cvc_i", "patt_cvc_o"]
  }
];
