/**
 * Minecraft version data for Java and Bedrock editions.
 */

export type Edition = "java" | "bedrock";

export interface MinecraftVersion {
  id: string;
  label: string;
  edition: Edition;
}

export const JAVA_VERSIONS: MinecraftVersion[] = [
  { id: "1.21", label: "1.21 (Tricky Trials)", edition: "java" },
  { id: "1.20", label: "1.20 (Trails & Tales)", edition: "java" },
  { id: "1.19", label: "1.19 (The Wild Update)", edition: "java" },
  { id: "1.18", label: "1.18 (Caves & Cliffs II)", edition: "java" },
  { id: "1.17", label: "1.17 (Caves & Cliffs I)", edition: "java" },
  { id: "1.16", label: "1.16 (Nether Update)", edition: "java" },
  { id: "1.15", label: "1.15 (Buzzy Bees)", edition: "java" },
  { id: "1.14", label: "1.14 (Village & Pillage)", edition: "java" },
  { id: "1.13", label: "1.13 (Update Aquatic)", edition: "java" },
  { id: "1.12", label: "1.12 (World of Color)", edition: "java" },
];

export const BEDROCK_VERSIONS: MinecraftVersion[] = [
  { id: "1.21", label: "1.21 (Tricky Trials)", edition: "bedrock" },
  { id: "1.20", label: "1.20 (Trails & Tales)", edition: "bedrock" },
  { id: "1.19", label: "1.19 (The Wild Update)", edition: "bedrock" },
  { id: "1.18", label: "1.18 (Caves & Cliffs II)", edition: "bedrock" },
];

export interface SeedConfig {
  seed: string;
  version: MinecraftVersion;
  edition: Edition;
}

export function getVersionsForEdition(edition: Edition): MinecraftVersion[] {
  return edition === "java" ? JAVA_VERSIONS : BEDROCK_VERSIONS;
}
