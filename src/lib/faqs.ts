export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: "How do I find biomes in a Minecraft seed?",
    answer:
      "Paste the seed into ChunkLoader and open the map. The biome finder renders the world layout in your browser so you can scan biome colors, read coordinates, and move around the map before loading the seed in Minecraft.",
  },
  {
    question: "Does this Minecraft seed map work for Java and Bedrock?",
    answer:
      "Yes. ChunkLoader supports both Java Edition and Bedrock Edition. Choose the edition you play so the biome map, structures, and world rules stay aligned with that version.",
  },
  {
    question: "Do I need to download anything to use ChunkLoader?",
    answer:
      "No. ChunkLoader is entirely browser-based, so there is no account, no download, and no installation step. Open the site, enter a seed, and the map is ready in seconds.",
  },
  {
    question: "Can I share a Minecraft seed map with friends?",
    answer:
      "Yes. ChunkLoader generates shareable URLs that encode your exact seed, edition, version, dimension, overlay settings, and map position. Copy the link from your browser and anyone you send it to will see the exact same map state.",
  },
  {
    question: "What dimensions does ChunkLoader support?",
    answer:
      "ChunkLoader supports all three Minecraft dimensions: the Overworld, the Nether, and The End. Switch between them using the dimension selector. Each one renders its own biome and structure layout derived from the same seed.",
  },
  {
    question: "Does ChunkLoader support the latest Minecraft version?",
    answer:
      "ChunkLoader is updated to track the latest stable releases for both Java and Bedrock editions. You can also select older versions from the version picker if you're playing on an older release or testing seed behavior across updates.",
  },
];
