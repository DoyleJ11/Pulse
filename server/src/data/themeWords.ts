export const THEME_WORDS: readonly string[] = [
  "Heartbreak",
  "Summer Drive",
  "Late Night",
  "Rainy Day",
  "Workout",
  "80s Nostalgia",
  "Road Trip",
  "First Dance",
  "Karaoke",
  "Sunrise",
  "Sunset",
  "Storm",
  "Snowy Morning",
  "Beach Party",
  "Underdog",
  "Villain Era",
  "Glow Up",
  "Breakup",
  "New Beginnings",
  "Power Hour",
  "Slow Burn",
  "Coming of Age",
  "Underground",
  "Cosmic",
  "Cinematic",
  "Bittersweet",
  "Defiant",
  "Hometown",
  "Neon Lights",
  "Confessional",
  "Forbidden Love",
  "Final Boss",
  "Daydream",
  "Crime Scene",
  "Reunion",
  "Liminal",
  "Childhood",
  "Apocalypse",
  "Pre-Game",
  "Comeback",
];

export function pickRandomTheme(exclude?: string): string {
  const source = exclude
    ? THEME_WORDS.filter((w) => w !== exclude)
    : THEME_WORDS;
  const chosenWord = source[Math.floor(Math.random() * source.length)];
  if (!chosenWord) throw new Error("Theme word list empty");
  return chosenWord;
}
