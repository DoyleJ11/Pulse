import { prisma } from "../utils/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";
import { RoomError } from "../utils/customErrors.js";
import type { Player, Song } from "../../generated/prisma/client.js";

// Round 1:      indicies 15-30
// Round 2:      indicies 7-14
// Semifinals 3: indicies 3-6
// Finals:       indicies 1-2
// Champion:     index 0

interface BracketSlot {
    songId: string,
    deezerId: string,
    title: string,
    artist: string,
    albumArt: string,
    previewUrl: string | null,
    duration: number,
    submittedBy: string,
    role: string,
    seed: number,
}

async function seedSongs(code: string) {
    const room = await prisma.room.findUnique({
        where: {code: code},
    });

    if (!room) {
        throw new RoomError(`Cannot find room`, code, "battling");
    }

    const playerA = await prisma.player.findFirst({
        where: {
            AND: { roomId: room.id, role: "player_a" }
        },
        include: {
            songs: true,
        }
    });
    if (!playerA) {
        throw new Error(`Could not find playerA`)
    }

    const playerB = await prisma.player.findFirst({
        where: {
            AND: { roomId: room.id, role: "player_b" }
        },
        include: {
            songs: true,
        }
    });
    if (!playerB) {
        throw new Error(`Could not find playerB`)
    }

    const playerASongs = playerA.songs;
    playerASongs.sort((a, b) => b.deezerRank - a.deezerRank)
    playerASongs.forEach((song, index) => {
        song.seed = index + 1;
    })

    
    const playerBSongs = playerB.songs;
    playerBSongs.sort((a, b) => b.deezerRank - a.deezerRank)
    playerBSongs.forEach((song, index) => {
        song.seed = index + 1;
    })

    // Pass the two song arrays with seeds attached to generateBracket and let it update the song records & create the bracket record.
    return await generateBracket(playerASongs, playerBSongs, playerA, playerB, room.id);
}

async function generateBracket(playerASongs: Song[], playerBSongs: Song[], playerA: Player, playerB: Player, roomId: string) {
    // Get both player's songs from DB (now with seeded values)
    // Create 31 slot array filled with null values
    // Insert player_a's songs alternating 15, 17, 19, 21, 23, 25, 27, 29
    // Insert player_b's songs alternating 16, 18, 20, 22, 24, 26, 28, 30 
    // Items inserted in order of seed: A1-B8, A2-B7, A3-B6, A4-B5, A5-B4, A6-B3, A7-B2, A8-B1
    // Once all songs inserted, create bracket record in DB and store array as JSON on the state property of the bracket record.

    const result = await prisma.$transaction(async (tx) => {
        const bracket: (null | BracketSlot)[] = Array(31).fill(null);
        playerASongs.forEach((song, index) => {
            let oddIndex = 15 + (index * 2);
            if (!song.seed) {
                song.seed = 0;
            }

            const bracketItem: BracketSlot = {
                songId: song.id,
                deezerId: song.deezerId,
                title: song.title,
                artist: song.artist,
                albumArt: song.albumArt,
                previewUrl: song.previewUrl,
                duration: song.duration,
                submittedBy: song.playerId,
                role: playerA.role,
                seed: song.seed,
            }
            bracket[oddIndex] = bracketItem;
        });

        playerBSongs.forEach((song, index) => {
            const size = playerBSongs.length - 1;
            let reverseIndex = size - index;
            let evenIndex = 16 + (reverseIndex * 2);
            if (!song.seed) {
                song.seed = 0;
            }

            const bracketItem: BracketSlot = {
                songId: song.id,
                deezerId: song.deezerId,
                title: song.title,
                artist: song.artist,
                albumArt: song.albumArt,
                previewUrl: song.previewUrl,
                duration: song.duration,
                submittedBy: song.playerId,
                role: song.playerId === playerA.id ? playerA.role : playerB.role,
                seed: song.seed,
            }
            bracket[evenIndex] = bracketItem;
        });

        const playerAPromises = playerASongs.map(song => 
            tx.song.update({
                where: { id: song.id },
                data: { seed: song.seed },
            })
        );

        const playerBPromises = playerBSongs.map(song => 
            tx.song.update({
                where: { id: song.id },
                data: { seed: song.seed },
            })
        );
        await Promise.all([...playerAPromises, ...playerBPromises]);

        return await tx.bracket.create({
            data: {
                roomId: roomId,
                state: bracket as Prisma.InputJsonValue,
                currentMatchup: 7,
            }
        });        
    });

    return result;
}

async function fetchBracket(code: string) {

    const room = await prisma.room.findUnique({
        where: {code: code },
    });
    if (!room) {
        throw new RoomError(`Cannot find room`, code, "battling");
    }

    const bracket = await prisma.bracket.findUnique({
        where: { roomId: room.id },
    });
    return bracket;
}

async function isValidPick(code: string, matchupIndex: number, winnerSongId: string): Promise<void> {
    const room = await prisma.room.findUnique({
        where: { code: code },
        include: { bracket: true }
    });
    if (!room) {
        throw new RoomError(`Cannot find room`, code, "battling")
    }
    if (!room.bracket) throw new RoomError(`Cannot find bracket`, code, "battling")
    if (!room.bracket.state) throw new RoomError(`Cannot find bracket state`, code, "battling")
    if (room.status !== "battling") throw new RoomError(`Incorrect room status`, code, "battling")

    if (matchupIndex !== room.bracket.currentMatchup) {
        throw new Error("Current matchup does not match provided matchup")
    }

    const children = getChildren(matchupIndex);
    const bracket = room.bracket.state as (BracketSlot | null)[]
    const left = bracket[children[0]];
    const right = bracket[children[1]];

    if (!left || !right) throw new Error("Children cannot be null")

    if (left && right && winnerSongId !== left.songId && winnerSongId !== right.songId) {
        throw new Error("Winner does not match either matchup children")
    }
}

async function updateBracket(code: string, matchupIndex: number, winnerSongId: string): Promise<{ state: (BracketSlot | null)[]; currentMatchup: number | null }> {
    const room = await prisma.room.findUnique({
        where: { code: code },
        include: { bracket: true }
    });
    if (!room) {
        throw new RoomError(`Cannot find room`, code, "battling")
    }
    if (!room.bracket) {
        throw new RoomError(`Cannot find bracket`, code, "battling")
    }
    if (!room.bracket.state) {
        throw new RoomError(`Cannot find bracket state`, code, "battling")
    }

    const bracket = room.bracket.state as (BracketSlot | null)[]
    let nextMatchup: number | null = null;

    const updatedBracket = applyWinner(bracket, matchupIndex, winnerSongId);
    nextMatchup = findNextMatchup(updatedBracket);

    await prisma.$transaction(async (tx) => {
        if (nextMatchup === null) {
            await tx.room.update({
                where: { id: room.id },
                data: { status: "complete" }
            })
        }

        await tx.bracket.update({
            where: { roomId: room.id },
            data: { state: updatedBracket as Prisma.InputJsonValue, currentMatchup: nextMatchup ?? room.bracket!.currentMatchup }
        })
    });

    return { state: updatedBracket, currentMatchup: nextMatchup };
}

function findNextMatchup(bracket: (BracketSlot | null)[]): number | null {
    const rounds: [number, number][] = [[7, 14], [3, 6], [1, 2], [0, 0]];

    for(const [start, end] of rounds) {
        for (let k = start; k <= end; k++) {
            const children = getChildren(k);
            if (bracket[k] === null && bracket[children[0]] != null && bracket[children[1]] != null) {
                return k;
            }
        }
    }
    return null;
}

function applyWinner(bracket: (BracketSlot | null)[], matchupIndex: number, winnerSongId: string): (BracketSlot | null)[] {
    const children = getChildren(matchupIndex);
    const left = bracket[children[0]];
    const right = bracket[children[1]];
    let updatedBracket: (BracketSlot | null)[] = [...bracket]

    if (left && winnerSongId === left.songId) {
        updatedBracket = bracket.with(matchupIndex, left)
    } else if (right && winnerSongId === right.songId) {
        updatedBracket = bracket.with(matchupIndex, right)
    } else {
        throw new Error("Invalid bracket state while applying winner.")
    }

    return updatedBracket;
}

// Get the two children of any matchup slot
function getChildren(parentIndex: number): [number, number] {
    return [2 * parentIndex + 1, 2 * parentIndex + 2];
}

// Get where the winner advances to
function getParent(childIndex: number): number {
    // Two nodes are in a matchup if they share a parent.
    // Indices 15 and 16 are both children of index 7 because: 
    // Math.floor((15-1)/2) = 7
    // Math.floor((16-1)/2) = 7
    // The winner of that matchup would be written to index 7, then index 7 & 8 are a matchup, where their winner goes to index 3, etc.
    return Math.floor((childIndex - 1) / 2);
}

// Check if a slot is a leaf (first round)
function isLeaf(index: number, totalSlots: number): boolean {
    return 2 * index + 1 >= totalSlots;
}

export { seedSongs, fetchBracket, isValidPick, updateBracket, findNextMatchup, applyWinner }