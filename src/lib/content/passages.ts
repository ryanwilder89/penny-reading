export interface Passage {
  id: string;
  title: string;
  text: string;
  wordCount: number;
  maxPatternId: string;
  patternsUsed: string[];
}

export const PASSAGES: Record<string, Passage> = {
  "passage-1": {
    id: "passage-1",
    title: "The Sled",
    text: "Sam and Pam got a red sled. The sled went fast. Sam is glad. Pam is glad. The red sled is fun.",
    wordCount: 22,
    maxPatternId: "2.1",
    patternsUsed: ["2.1", "1.1"]
  },
  "passage-2": {
    id: "passage-2",
    title: "The Frog",
    text: "A big green frog sits on a log. The frog can jump. The frog can swim. The frog is glad on the log.",
    wordCount: 23,
    maxPatternId: "2.2",
    patternsUsed: ["2.2", "1.1"]
  },
  "passage-3": {
    id: "passage-3",
    title: "The Band",
    text: "The band had a drum. A man hit the drum. It went bam, bam! The kids hid from the bad sound. The band did not stop.",
    wordCount: 26,
    maxPatternId: "2.4",
    patternsUsed: ["2.4", "2.2", "1.1"]
  },
  "passage-4": {
    id: "passage-4",
    title: "The Cape",
    text: "Pete had a red cape. Pete made a game. Pete will take the cape and run. Pete is safe at home.",
    wordCount: 21,
    maxPatternId: "2.7",
    patternsUsed: ["2.7", "2.9", "1.1"]
  },
  "passage-5": {
    id: "passage-5",
    title: "A Ride on a Bike",
    text: "Mike got a nice bike. Mike went for a ride. Mike went five miles. Mike came home on the bike. Mike had a nice time.",
    wordCount: 25,
    maxPatternId: "2.8",
    patternsUsed: ["2.8", "2.7", "2.9", "1.1"]
  }
};
