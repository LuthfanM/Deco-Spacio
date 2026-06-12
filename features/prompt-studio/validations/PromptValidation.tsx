export type PromptValidationCode = "TOO_SHORT" | "UNSUPPORTED" | "BLOCKED";

export type PromptValidationResult =
  | { valid: true }
  | {
      valid: false;
      code: PromptValidationCode;
      message: string;
    };

export const MIN_PROMPT_LENGTH = 3;

export const UNSUPPORTED_PROMPTS = [
  "asdfghjkl",
  "qwertyuiop",
  "!!!!!!!",
  "123456789",
  "😂😂😂😂😂",
];

export const BLOCKED_PROMPT_PHRASES = [
  "explicit sexual",
  "nude",
  "gore",
  "blood everywhere",
  "hate symbol",
  "terrorist",
  "hateful content",
  "violent crime",
  "crime scene",
];

const TOO_SHORT_MESSAGE = "Please type a room description with at least 3 characters.";
const UNSUPPORTED_MESSAGE = "Please describe a room concept using clear words.";
export const BLOCKED_PROMPT_MESSAGE =
  "This prompt is not allowed. Please try a different room description.";

function normalizePrompt(prompt: string): string {
  return prompt.trim().replace(/\s+/g, " ");
}

function isUnsupportedPrompt(prompt: string): boolean {
  const normalized = normalizePrompt(prompt);
  const lower = normalized.toLowerCase();

  if (UNSUPPORTED_PROMPTS.includes(lower)) {
    return true;
  }

  const hasLetter = /\p{L}/u.test(normalized);
  const hasNumber = /\p{N}/u.test(normalized);

  if (!hasLetter && !hasNumber) {
    return true;
  }

  if (/^\p{N}+$/u.test(normalized)) {
    return true;
  }

  return false;
}

export function validateImagePrompt(prompt: string): PromptValidationResult {
  const normalized = normalizePrompt(prompt);

  if (normalized.length < MIN_PROMPT_LENGTH) {
    return {
      valid: false,
      code: "TOO_SHORT",
      message: TOO_SHORT_MESSAGE,
    };
  }

  if (isUnsupportedPrompt(normalized)) {
    return {
      valid: false,
      code: "UNSUPPORTED",
      message: UNSUPPORTED_MESSAGE,
    };
  }

  const lower = normalized.toLowerCase();
  const blocked = BLOCKED_PROMPT_PHRASES.some((phrase) =>
    lower.includes(phrase),
  );

  if (blocked) {
    return {
      valid: false,
      code: "BLOCKED",
      message: BLOCKED_PROMPT_MESSAGE,
    };
  }

  return { valid: true };
}
