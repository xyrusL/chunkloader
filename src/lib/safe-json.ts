const HTML_ESCAPE_LOOKUP: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};

const HTML_ESCAPE_PATTERN = /[<>&\u2028\u2029]/g;

export function stringifyJsonForHtml(value: unknown): string {
  return JSON.stringify(value).replace(HTML_ESCAPE_PATTERN, (character) => HTML_ESCAPE_LOOKUP[character]);
}
