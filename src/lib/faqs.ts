export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: "What is a Minecraft seed?",
    answer:
      "A Minecraft seed is a string of text or a number used by the game's world generation algorithm to create a unique world layout. Every world in Minecraft is generated from a seed — you can share it with others to recreate the exact same world, or explore it in ChunkLoader before you load in.",
  },
  {
    question: "Does ChunkLoader work with Bedrock Edition?",
    answer:
      "Yes. ChunkLoader supports both Java Edition and Bedrock Edition. When exploring a seed, simply switch the edition selector to match the one you play on. Biome layouts differ between editions, so the edition toggle keeps your map accurate.",
  },
  {
    question: "Do I need to install anything to use ChunkLoader?",
    answer:
      "No installation required. ChunkLoader is entirely browser-based. Just open the site, enter your seed, and start exploring. There's no account, no download, and no setup — the map renders immediately.",
  },
  {
    question: "Can I share my map view with friends?",
    answer:
      "Yes. ChunkLoader generates shareable URLs that encode your exact seed, edition, version, dimension, overlay settings, and map position. Copy the link from your browser and anyone you send it to will see the exact same map state.",
  },
  {
    question: "What dimensions does ChunkLoader support?",
    answer:
      "ChunkLoader supports all three Minecraft dimensions: the Overworld, the Nether, and The End. Switch between them using the dimension selector — each one renders its own biome and structure layout derived from the same seed.",
  },
  {
    question: "Does ChunkLoader support the latest Minecraft version?",
    answer:
      "ChunkLoader is updated to track the latest stable releases for both Java and Bedrock editions. You can also select older versions from the version picker if you're playing on an older release or testing seed behavior across updates.",
  },
];
