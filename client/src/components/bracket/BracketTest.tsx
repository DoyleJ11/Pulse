import { MatchupCard } from "./MatchupCard";
import { type BracketSlot } from "./BracketView";
import { Matchup } from "./Matchup";
import { EndGameBtn } from "./EndGameBtn";

const playerASongs: BracketSlot[] = [
  {
    songId: "1",
    deezerId: "534628",
    title: "If You Want Me to Stay",
    artist: "Sly & The Family Stone",
    albumArt:
      "https://cdn-images.dzcdn.net/images/cover/14ac2ca897a8d6f6c1eb1823bf1aea39/250x250-000000-80-0-0.jpg",
    previewUrl:
      "https://cdnt-preview.dzcdn.net/api/1/1/d/e/f/0/defb877e7aad561a6ce6364c0deadce0.mp3",
    seed: 1,
    submittedBy: "player-a-id",
    role: "player_a",
  },
  {
    songId: "2",
    deezerId: "80295840",
    title: "Mary Jane",
    artist: "Rick James",
    albumArt:
      "https://cdn-images.dzcdn.net/images/artist/58e2cf52e20e9b9c0379d2f99257f5ba/250x250-000000-80-0-0.jpg",
    previewUrl:
      "https://cdnt-preview.dzcdn.net/api/1/1/4/1/2/0/41279544e72907ce46b214461fef53ab.mp3",
    seed: 2,
    submittedBy: "player-a-id",
    role: "player_a",
  },
  {
    songId: "3",
    deezerId: "898573792",
    title: "STOLE YA FLOW",
    artist: "A$AP Rocky",
    albumArt:
      "https://cdn-images.dzcdn.net/images/cover/1b12a3693578183b0ece3544133f41ad/250x250-000000-80-0-0.jpg",
    previewUrl:
      "https://cdnt-preview.dzcdn.net/api/1/1/7/d/f/0/7df86f8cae835e0f14b689b27a79aa6b.mp3",
    seed: 3,
    submittedBy: "player-a-id",
    role: "player_a",
  },
  {
    songId: "4",
    deezerId: "534629",
    title: "Open My Door",
    artist: "Alice Phoebe Lou",
    albumArt:
      "https://cdn-images.dzcdn.net/images/cover/1b108e12da4f6ae310c508e9e3615473/250x250-000000-80-0-0.jpg",
    previewUrl:
      "https://cdnt-preview.dzcdn.net/api/1/1/6/f/a/0/6fae910a234fc54a40daebba6627fb3d.mp3",
    seed: 4,
    submittedBy: "player-a-id",
    role: "player_a",
  },
];

const playerBSongs: BracketSlot[] = [
  {
    songId: "5",
    deezerId: "2682537042",
    title: "Sadness As A Gift",
    artist: "Adrianne Lenker",
    albumArt:
      "https://cdn-images.dzcdn.net/images/cover/c00ec051239c4f852b1ec5e3d66f832e/250x250-000000-80-0-0.jpg",
    previewUrl:
      "https://cdnt-preview.dzcdn.net/api/1/1/9/1/c/0/91c5794ed7b47159e392c42368e053fc.mp3",
    seed: 5,
    submittedBy: "player-b-id",
    role: "player_b",
  },
  {
    songId: "6",
    deezerId: "538709322",
    title: "Sir Duke",
    artist: "Stevie Wonder",
    albumArt:
      "https://cdn-images.dzcdn.net/images/cover/36aaf615fe6f66a6778bad4b501be11f/250x250-000000-80-0-0.jpg",
    previewUrl:
      "https://cdnt-preview.dzcdn.net/api/1/1/f/6/6/0/f66d4304e104f552b4bb48aa22f0e9a7.mp3",
    seed: 6,
    submittedBy: "player-b-id",
    role: "player_b",
  },
  {
    songId: "7",
    deezerId: "70018665",
    title: "Hive",
    artist: "Earl Sweatshirt",
    albumArt:
      "https://cdn-images.dzcdn.net/images/cover/cdb4b70aedc8e36df31a54127f5b528d/250x250-000000-80-0-0.jpg",
    previewUrl:
      "https://cdnt-preview.dzcdn.net/api/1/1/a/c/9/0/ac9316ed8035668659c1367995588afd.mp3",
    seed: 7,
    submittedBy: "player-b-id",
    role: "player_b",
  },
  {
    songId: "8",
    deezerId: "885737",
    title: "Strasbourg / St. Denis",
    artist: "Roy Hargrove",
    albumArt:
      "https://cdn-images.dzcdn.net/images/cover/caf88c2b58c42c6730e53cd51acf6ddf/250x250-000000-80-0-0.jpg",
    previewUrl:
      "https://cdnt-preview.dzcdn.net/api/1/1/8/c/b/0/8cbfbbad8e818f9405c09913a4bd8e42.mp3",
    seed: 8,
    submittedBy: "player-b-id",
    role: "player_b",
  },
];

// Full 8 songs per player for bracket round testing
const allPlayerA: BracketSlot[] = [
  ...playerASongs,
  {
    songId: "a5",
    deezerId: "100001",
    title: "Cosmic Funk",
    artist: "Galaxy Band",
    albumArt: playerASongs[0].albumArt,
    previewUrl: null,
    seed: 5,
    submittedBy: "player-a-id",
    role: "player_a",
  },
  {
    songId: "a6",
    deezerId: "100002",
    title: "Midnight Drive",
    artist: "Night Owl",
    albumArt: playerASongs[1].albumArt,
    previewUrl: null,
    seed: 6,
    submittedBy: "player-a-id",
    role: "player_a",
  },
  {
    songId: "a7",
    deezerId: "100003",
    title: "Golden Hour",
    artist: "Sunset Crew",
    albumArt: playerASongs[2].albumArt,
    previewUrl: null,
    seed: 7,
    submittedBy: "player-a-id",
    role: "player_a",
  },
  {
    songId: "a8",
    deezerId: "100004",
    title: "Deep Blue",
    artist: "Ocean Floor",
    albumArt: playerASongs[3].albumArt,
    previewUrl: null,
    seed: 8,
    submittedBy: "player-a-id",
    role: "player_a",
  },
];

const allPlayerB: BracketSlot[] = [
  ...playerBSongs,
  {
    songId: "b5",
    deezerId: "200001",
    title: "Velvet Night",
    artist: "Smooth Jazz",
    albumArt: playerBSongs[0].albumArt,
    previewUrl: null,
    seed: 5,
    submittedBy: "player-b-id",
    role: "player_b",
  },
  {
    songId: "b6",
    deezerId: "200002",
    title: "Thunder Road",
    artist: "Electric Storm",
    albumArt: playerBSongs[1].albumArt,
    previewUrl: null,
    seed: 6,
    submittedBy: "player-b-id",
    role: "player_b",
  },
  {
    songId: "b7",
    deezerId: "200003",
    title: "Paper Planes",
    artist: "Sky High",
    albumArt: playerBSongs[2].albumArt,
    previewUrl: null,
    seed: 7,
    submittedBy: "player-b-id",
    role: "player_b",
  },
  {
    songId: "b8",
    deezerId: "200004",
    title: "Quiet Storm",
    artist: "Rain Maker",
    albumArt: playerBSongs[3].albumArt,
    previewUrl: null,
    seed: 8,
    submittedBy: "player-b-id",
    role: "player_b",
  },
];

// Build a mock 31-slot bracket: nulls for slots 0-14, songs in slots 15-30
// Matchups: A1 vs B8, A2 vs B7, A3 vs B6, A4 vs B5, A5 vs B4, A6 vs B3, A7 vs B2, A8 vs B1
const mockBracket: (BracketSlot | null)[] = Array(31).fill(null);
// Player A at odd indices (15, 17, 19, 21, 23, 25, 27, 29) in seed order
allPlayerA.forEach((song, i) => {
  mockBracket[15 + i * 2] = song;
});
// Player B at even indices (16, 18, 20, 22, 24, 26, 28, 30) in reverse seed order
allPlayerB.forEach((song, i) => {
  mockBracket[16 + (allPlayerB.length - 1 - i) * 2] = song;
});

const seedColors = [
  "#2DD4BF",
  "#FF7B6B",
  "#C4B5FD",
  "#FFD952",
  "#6EE7B7",
  "#2DD4BF",
  "#FF7B6B",
  "#C4B5FD",
];

export function BracketTest() {
  return (
    <div className="min-h-screen bg-bg-cream p-8">
      <h1 className="text-4xl font-black mb-8">BRACKET COMPONENT TEST</h1>
      <EndGameBtn />

      {/* Card States */}
      <section className="mb-12">
        <h2 className="text-2xl font-black mb-4 uppercase">Card States</h2>
        <div className="flex flex-wrap gap-6 items-start">
          <div>
            <p className="font-bold text-text-muted mb-2 text-sm">EMPTY</p>
            <MatchupCard song={null} state="empty" />
          </div>
          <div>
            <p className="font-bold text-text-muted mb-2 text-sm">
              NORMAL — PLAYER A
            </p>
            <MatchupCard
              song={playerASongs[0]}
              state="normal"
              seedColor={seedColors[0]}
            />
          </div>
          <div>
            <p className="font-bold text-text-muted mb-2 text-sm">
              NORMAL — PLAYER B
            </p>
            <MatchupCard
              song={playerBSongs[0]}
              state="normal"
              seedColor={seedColors[4]}
            />
          </div>
        </div>
      </section>

      {/* Active State */}
      <section className="mb-12">
        <h2 className="text-2xl font-black mb-4 uppercase">
          Active State (Judge View)
        </h2>
        <div className="flex flex-wrap gap-6 items-start">
          <div>
            <p className="font-bold text-text-muted mb-2 text-sm">
              ACTIVE — PLAYER A
            </p>
            <MatchupCard
              song={playerASongs[1]}
              state="active"
              seedColor={seedColors[1]}
              onPick={() => console.log("Picked Player A song")}
              onPlay={() => console.log("Playing Player A preview")}
            />
          </div>
          <div>
            <p className="font-bold text-text-muted mb-2 text-sm">
              ACTIVE — PLAYER B
            </p>
            <MatchupCard
              song={playerBSongs[1]}
              state="active"
              seedColor={seedColors[5]}
              onPick={() => console.log("Picked Player B song")}
              onPlay={() => console.log("Playing Player B preview")}
            />
          </div>
        </div>
      </section>

      {/* Decided States */}
      <section className="mb-12">
        <h2 className="text-2xl font-black mb-4 uppercase">Decided States</h2>
        <div className="flex flex-wrap gap-6 items-start">
          <div>
            <p className="font-bold text-text-muted mb-2 text-sm">WINNER</p>
            <MatchupCard
              song={playerASongs[2]}
              state="decided-winner"
              seedColor={seedColors[2]}
            />
          </div>
          <div>
            <p className="font-bold text-text-muted mb-2 text-sm">LOSER</p>
            <MatchupCard
              song={playerBSongs[2]}
              state="decided-loser"
              seedColor={seedColors[6]}
            />
          </div>
        </div>
      </section>

      {/* Size Variants */}
      <section className="mb-12">
        <h2 className="text-2xl font-black mb-4 uppercase">Size Variants</h2>
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-bold text-text-muted mb-2 text-sm">
              BASE (Round 1)
            </p>
            <MatchupCard
              song={playerASongs[0]}
              state="normal"
              seedColor={seedColors[0]}
              size="base"
            />
          </div>
          <div>
            <p className="font-bold text-text-muted mb-2 text-sm">QUARTER</p>
            <MatchupCard
              song={playerASongs[1]}
              state="normal"
              seedColor={seedColors[1]}
              size="quarter"
            />
          </div>
          <div>
            <p className="font-bold text-text-muted mb-2 text-sm">SEMI</p>
            <MatchupCard
              song={playerBSongs[0]}
              state="normal"
              seedColor={seedColors[4]}
              size="semi"
            />
          </div>
          <div>
            <p className="font-bold text-text-muted mb-2 text-sm">FINAL</p>
            <MatchupCard
              song={playerBSongs[1]}
              state="normal"
              seedColor={seedColors[5]}
              size="final"
            />
          </div>
        </div>
      </section>

      {/* ===== MATCHUP COMPONENT TESTS ===== */}
      <h1 className="text-4xl font-black mb-8 mt-16 pt-8 border-t-[3px] border-black">
        MATCHUP COMPONENT TEST
      </h1>

      {/* Matchup: Active (parentIndex === currentMatchup) */}
      <section className="mb-12">
        <h2 className="text-2xl font-black mb-2 uppercase">Active Matchup</h2>
        <p className="text-sm font-bold text-text-muted mb-4">
          parentIndex=7, currentMatchup=7 — Both cards should be ACTIVE with
          pick buttons
        </p>
        <Matchup
          bracketSlots={[playerASongs[0], playerBSongs[3]]}
          winnerSlot={null}
          parentIndex={7}
          currentMatchup={7}
          onPick={() => console.log("Pick clicked")}
          onPlay={() => console.log("Play clicked")}
          size="base"
        />
      </section>

      {/* Matchup: Decided — Player A won */}
      <section className="mb-12">
        <h2 className="text-2xl font-black mb-2 uppercase">
          Decided Matchup (Player A Won)
        </h2>
        <p className="text-sm font-bold text-text-muted mb-4">
          parentIndex=7, currentMatchup=8 — A should be WINNER, B should be
          LOSER with X badge
        </p>
        <Matchup
          bracketSlots={[playerASongs[0], playerBSongs[3]]}
          winnerSlot={playerASongs[0]}
          parentIndex={7}
          currentMatchup={8}
          onPick={() => {}}
          onPlay={() => {}}
          size="base"
        />
      </section>

      {/* Matchup: Decided — Player B won */}
      <section className="mb-12">
        <h2 className="text-2xl font-black mb-2 uppercase">
          Decided Matchup (Player B Won)
        </h2>
        <p className="text-sm font-bold text-text-muted mb-4">
          parentIndex=7, currentMatchup=9 — B should be WINNER, A should be
          LOSER with X badge
        </p>
        <Matchup
          bracketSlots={[playerASongs[1], playerBSongs[2]]}
          winnerSlot={playerBSongs[2]}
          parentIndex={7}
          currentMatchup={9}
          onPick={() => {}}
          onPlay={() => {}}
          size="base"
        />
      </section>

      {/* Matchup: Normal (waiting, not yet reached) */}
      <section className="mb-12">
        <h2 className="text-2xl font-black mb-2 uppercase">
          Normal Matchup (Waiting)
        </h2>
        <p className="text-sm font-bold text-text-muted mb-4">
          parentIndex=9, currentMatchup=7 — Both cards should be NORMAL, no
          buttons
        </p>
        <Matchup
          bracketSlots={[playerASongs[2], playerBSongs[1]]}
          winnerSlot={null}
          parentIndex={9}
          currentMatchup={7}
          onPick={() => {}}
          onPlay={() => {}}
          size="base"
        />
      </section>

      {/* Matchup: Empty (future round, no songs yet) */}
      <section className="mb-12">
        <h2 className="text-2xl font-black mb-2 uppercase">
          Empty Matchup (Future Round)
        </h2>
        <p className="text-sm font-bold text-text-muted mb-4">
          Both slots null — Both cards should be TBD placeholders
        </p>
        <Matchup
          bracketSlots={[null, null]}
          winnerSlot={null}
          parentIndex={3}
          currentMatchup={7}
          onPick={() => {}}
          onPlay={() => {}}
          size="quarter"
        />
      </section>

      {/* Matchup: Half-filled (one song advanced, waiting for other) */}
      <section className="mb-12">
        <h2 className="text-2xl font-black mb-2 uppercase">
          Half-Filled Matchup
        </h2>
        <p className="text-sm font-bold text-text-muted mb-4">
          One slot filled, one null — One song card + one TBD
        </p>
        <Matchup
          bracketSlots={[playerASongs[0], null]}
          winnerSlot={null}
          parentIndex={3}
          currentMatchup={7}
          onPick={() => {}}
          onPlay={() => {}}
          size="quarter"
        />
      </section>

      {/* Matchup: Size variants side by side */}
      <section className="mb-12">
        <h2 className="text-2xl font-black mb-2 uppercase">
          Matchup Size Variants
        </h2>
        <p className="text-sm font-bold text-text-muted mb-4">
          Same matchup at different round sizes
        </p>
        <div className="flex flex-wrap gap-8 items-start">
          <div>
            <p className="font-bold text-text-muted mb-2 text-sm">BASE</p>
            <Matchup
              bracketSlots={[playerASongs[0], playerBSongs[3]]}
              winnerSlot={null}
              parentIndex={7}
              currentMatchup={7}
              onPick={() => {}}
              onPlay={() => {}}
              size="base"
            />
          </div>
          <div>
            <p className="font-bold text-text-muted mb-2 text-sm">QUARTER</p>
            <Matchup
              bracketSlots={[playerASongs[0], playerBSongs[3]]}
              winnerSlot={null}
              parentIndex={3}
              currentMatchup={3}
              onPick={() => {}}
              onPlay={() => {}}
              size="quarter"
            />
          </div>
          <div>
            <p className="font-bold text-text-muted mb-2 text-sm">SEMI</p>
            <Matchup
              bracketSlots={[playerASongs[0], playerBSongs[3]]}
              winnerSlot={null}
              parentIndex={1}
              currentMatchup={1}
              onPick={() => {}}
              onPlay={() => {}}
              size="semi"
            />
          </div>
          <div>
            <p className="font-bold text-text-muted mb-2 text-sm">FINAL</p>
            <Matchup
              bracketSlots={[playerASongs[0], playerBSongs[3]]}
              winnerSlot={null}
              parentIndex={0}
              currentMatchup={0}
              onPick={() => {}}
              onPlay={() => {}}
              size="final"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
