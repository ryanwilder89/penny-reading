export interface Passage {
  id: string;
  title: string;
  text?: string;
  content?: string;
  wordCount: number;
  maxPatternId: string;
  patternsUsed: string[];
}

export const PASSAGES: Record<string, Passage> = {
  "passage-1.1": {
    id: "passage-1.1",
    title: "The Cat on the Map",
    text: "The cat sat on the map. The map is by the bat.",
    wordCount: 12,
    maxPatternId: "1.1",
    patternsUsed: ["1.1"]
  },
  "passage-1.3": {
    id: "passage-1.3",
    title: "The Pig in the Pot",
    text: "A pig sat in a pot. The dog ran to the log.",
    wordCount: 12,
    maxPatternId: "1.3",
    patternsUsed: ["1.1", "1.2", "1.3"]
  },
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
  },
  "passage-6": {
    id: "passage-6",
    title: "The Cats",
    text: "The cats had boxes. The cats sit on the boxes. A dog wishes to play. The cats hiss at the dogs.",
    wordCount: 21,
    maxPatternId: "2.11",
    patternsUsed: ["2.11", "1.1"]
  },
  "passage-7": {
    id: "passage-7",
    title: "Jumping the Log",
    text: "Sam is running to the log. Sam is jumping over the log. It is fun playing at the park. Sam is resting now.",
    wordCount: 23,
    maxPatternId: "2.12",
    patternsUsed: ["2.12", "1.1"]
  },
  "passage-8": {
    id: "passage-8",
    title: "The Rain",
    text: "The rain plays a game. The rain falls in the main drain. The stain will wash away in the rain. We can not play, we must wait.",
    wordCount: 27,
    maxPatternId: "3.1",
    patternsUsed: ["3.1", "1.1"]
  },
  "passage-9": {
    id: "passage-9",
    title: "The Green Tree",
    text: "I see a green tree. A bee sleeps on the green leaf. I will sit on the beach and read. The sea is deep.",
    wordCount: 24,
    maxPatternId: "3.2",
    patternsUsed: ["3.2", "1.1"]
  },
  "passage-10": {
    id: "passage-10",
    title: "A Boat in the Snow",
    text: "The toad is by the road. The toad sees a boat. The snow comes down on the boat. The toad will grow cold in the snow.",
    wordCount: 26,
    maxPatternId: "3.3",
    patternsUsed: ["3.3", "1.1"]
  },
  "passage-11": {
    id: "passage-11",
    title: "New Glue",
    text: "Sue has new glue. The wind blew the glue off the desk. Sue drew a blue bird. It is true, she likes to chew food.",
    wordCount: 26,
    maxPatternId: "3.4",
    patternsUsed: ["3.4", "1.1"]
  },
  "passage-12": {
    id: "passage-12",
    title: "The Park",
    text: "We went to the park in the dark. A shark was in the pond. He had a sharp tooth. We went far away to the farm.",
    wordCount: 26,
    maxPatternId: "3.5",
    patternsUsed: ["3.5", "1.1"]
  },
  "passage-13": {
    id: "passage-13",
    title: "The Storm",
    text: "The horn makes a short sound. A storm comes to the shore. Do not forget your fork for the pork. The sport is fun.",
    wordCount: 24,
    maxPatternId: "3.6",
    patternsUsed: ["3.6", "1.1"]
  },
  "passage-14": {
    id: "passage-14",
    title: "The Girl",
    text: "The girl is in a swirl. Her bird can chirp and turn. A fern is a plant. The girl gave the bird a worm. It makes a blur.",
    wordCount: 28,
    maxPatternId: "3.7",
    patternsUsed: ["3.7", "1.1"]
  },
  "passage-15": {
    id: "passage-15",
    title: "A Trip to the Beach",
    text: "We went to the beach to play. The sand is soft and warm. We see a boat on the deep sea. I read a book under the tree. The trip was fun.",
    wordCount: 32,
    maxPatternId: "3.7",
    patternsUsed: ["3.7", "3.6", "3.5", "3.2", "3.1"]
  }
};
