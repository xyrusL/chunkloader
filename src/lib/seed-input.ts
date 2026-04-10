const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/g;

export const MAX_SEED_LENGTH = 128;

export function normalizeSeedValue(value: string | null | undefined): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(CONTROL_CHARACTERS, "").trim().slice(0, MAX_SEED_LENGTH);
}
