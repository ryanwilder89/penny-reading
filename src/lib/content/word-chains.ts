export interface WordChain {
  id: string;
  patternId: string;
  words: string[];
  changePositions: number[];
}

export const WORD_CHAINS: Record<string, WordChain> = {
  "chain-1.1": {
    id: "chain-1.1",
    patternId: "1.1",
    words: ["cat", "bat", "mat", "map", "cap", "tap"],
    changePositions: [0, 0, 2, 0, 0]
  },
  "chain-1.2": {
    id: "chain-1.2",
    patternId: "1.2",
    words: ["sit", "hit", "bit", "bin", "fin", "fig"],
    changePositions: [0, 0, 2, 0, 2]
  },
  "chain-1.3": {
    id: "chain-1.3",
    patternId: "1.3",
    words: ["pot", "hot", "hop", "mop", "top"],
    changePositions: [0, 2, 0, 0]
  },
  "chain-2.1": {
    id: "chain-2.1",
    patternId: "2.1",
    words: ["flat", "flap", "flip", "clip", "slip", "slop", "stop"],
    changePositions: [3, 2, 0, 0, 2, 0]
  },
  "chain-2.2": {
    id: "chain-2.2",
    patternId: "2.2",
    words: ["grab", "crab", "crib", "drip", "drop", "crop", "prop"],
    changePositions: [0, 2, 3, 2, 0, 0]
  },
  "chain-2.3": {
    id: "chain-2.3",
    patternId: "2.3",
    words: ["skip", "slip", "slap", "snap", "snip", "snug", "slug"],
    changePositions: [1, 2, 1, 2, 3, 1]
  },
  "chain-2.4": {
    id: "chain-2.4",
    patternId: "2.4",
    words: ["hand", "band", "bend", "mend", "melt", "belt", "felt"],
    changePositions: [0, 1, 0, 3, 0, 0]
  },
  "chain-2.5": {
    id: "chain-2.5",
    patternId: "2.5",
    words: ["trust", "crust", "crest", "creep", "steep", "sweep"],
    changePositions: [0, 2, 3, 0, 0]
  },
  "chain-2.6": {
    id: "chain-2.6",
    patternId: "2.6",
    words: ["strap", "scrap", "scrip", "strip", "strut"],
    changePositions: [1, 3, 1, 4]
  },
  "chain-2.7": {
    id: "chain-2.7",
    patternId: "2.7",
    words: ["cap", "cape", "tape", "tap", "tip", "time", "lime"],
    changePositions: [3, 0, 3, 2, 2, 0]
  },
  "chain-2.8": {
    id: "chain-2.8",
    patternId: "2.8",
    words: ["hid", "hide", "ride", "rid", "rip", "ripe", "pipe"],
    changePositions: [3, 0, 3, 2, 3, 0]
  },
  "chain-2.9": {
    id: "chain-2.9",
    patternId: "2.9",
    words: ["hop", "hope", "rope", "robe", "rob", "tub", "tube"],
    changePositions: [3, 0, 2, 3, 1, 3]
  },
  "chain-3.1": {
    id: "chain-3.1",
    patternId: "3.1",
    words: ["ran", "rain", "pain", "pan", "pat", "pay", "say"],
    changePositions: [2, 0, 2, 2, 2, 0]
  },
  "chain-3.2": {
    id: "chain-3.2",
    patternId: "3.2",
    words: ["red", "read", "bead", "bed", "bee", "see", "seed"],
    changePositions: [2, 0, 2, 2, 0, 3]
  },
  "chain-3.3": {
    id: "chain-3.3",
    patternId: "3.3",
    words: ["got", "goat", "boat", "bat", "bow", "row", "grow"],
    changePositions: [2, 0, 2, 2, 0, 0]
  },
  "chain-3.4": {
    id: "chain-3.4",
    patternId: "3.4",
    words: ["flew", "blew", "blue", "clue", "glue", "true"],
    changePositions: [0, 2, 0, 0, 0]
  },
  "chain-3.5": {
    id: "chain-3.5",
    patternId: "3.5",
    words: ["cat", "cart", "part", "park", "pork", "fork"],
    changePositions: [2, 0, 3, 2, 0]
  },
  "chain-3.6": {
    id: "chain-3.6",
    patternId: "3.6",
    words: ["pot", "port", "sort", "short", "shirt", "dirt"],
    changePositions: [2, 0, 0, 2, 0]
  },
  "chain-3.7": {
    id: "chain-3.7",
    patternId: "3.7",
    words: ["hut", "hurt", "dirt", "dart", "part", "port"],
    changePositions: [2, 0, 2, 0, 1]
  }
};
