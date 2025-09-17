export type DetectedLanguage = 'ko' | 'en' | 'unknown';

interface LanguageScore {
  korean: number;
  english: number;
  other: number;
  total: number;
}

function analyzeLanguageComposition(text: string): LanguageScore {
  let korean = 0;
  let english = 0;
  let other = 0;

  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7af) {
      korean++;
    } else if ((code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a)) {
      english++;
    } else if (
      ch === ' ' ||
      ch === '\n' ||
      ch === '\t' ||
      (code >= 0x21 && code <= 0x2f) ||
      (code >= 0x3a && code <= 0x40) ||
      (code >= 0x5b && code <= 0x60) ||
      (code >= 0x7b && code <= 0x7e) ||
      (code >= 0x30 && code <= 0x39)
    ) {
      // ignore
    } else {
      other++;
    }
  }

  return { korean, english, other, total: korean + english + other };
}

export function detectLanguage(text: string): DetectedLanguage {
  const trimmed = text.trim();
  if (!trimmed) return 'unknown';

  const scores = analyzeLanguageComposition(trimmed);
  if (scores.total < 3) return 'unknown';

  const koreanRatio = scores.korean / scores.total;
  const englishRatio = scores.english / scores.total;
  const otherRatio = scores.other / scores.total;

  if (otherRatio >= 0.5) return 'unknown';
  if (koreanRatio >= 0.3 && koreanRatio > englishRatio) return 'ko';
  if (englishRatio >= 0.3 && englishRatio > koreanRatio) return 'en';
  return 'unknown';
}

export function getTargetLanguage(source: DetectedLanguage): 'ko' | 'en' | null {
  switch (source) {
    case 'ko':
      return 'en';
    case 'en':
      return 'ko';
    default:
      return null;
  }
}
