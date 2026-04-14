export interface WordChain {
  id: string;
  patternId: string;
  words: string[];
  changePositions: number[];
}

export const WORD_CHAINS: Record<string, WordChain> = {
  "chain-2.1": {
    id: "chain-2.1",
    patternId: "2.1",
    words: ["flat", "flap", "flip", "clip", "slip", "slop", "stop"],
    changePositions: [3, 2, 0, 0, 2, 0] // the position that changed from previous
  },
  "chain-2.7": {
    id: "chain-2.7",
    patternId: "2.7",
    words: ["cap", "cape", "tape", "tap", "tip", "time", "lime"],
    changePositions: [3, 0, 3, 2, 2, 0] // e.g., cap -> cape (add e at pos 3)
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
  "chain-3.5": {
    id: "chain-3.5",
    patternId: "3.5",
    words: ["cat", "cart", "part", "park", "pork", "fork"],
    changePositions: [2, 0, 3, 2, 0]
  }
};
