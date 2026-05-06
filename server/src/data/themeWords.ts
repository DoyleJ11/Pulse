export const THEME_WORDS: readonly string[] = [
  "Test",
  "Happy",
  "Sad",
  "Driving",
];

export function pickRandomTheme(exclude?: string): string {
  const source = exclude
    ? THEME_WORDS.filter((w) => w !== exclude)
    : THEME_WORDS;
  const chosenWord = source[Math.floor(Math.random() * source.length)];
  if (!chosenWord) throw new Error("Theme word list empty");
  return chosenWord;
}
