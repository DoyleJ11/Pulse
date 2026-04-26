import { describe, it, expect } from 'vitest';
import { findNextMatchup } from './bracketService.js';

// Test helper: produce a minimal valid BracketSlot for a given index.
// We only care about the "is this slot filled or null" signal, so the
// content doesn't matter — we just need a non-null object.
function slot(index: number) {
    return {
        songId: `song-${index}`,
        deezerId: String(index),
        title: `Song ${index}`,
        artist: 'Test Artist',
        albumArt: '',
        previewUrl: null,
        duration: 0,
        submittedBy: 'test-player',
        role: 'player_a',
        seed: 1,
    };
}

// Builds a bracket with leaves (indices 15–30) filled and everything else null.
// This is the state immediately after generateBracket runs.
function freshBracket() {
    const bracket: any[] = Array(31).fill(null);
    for (let i = 15; i <= 30; i++) {
        bracket[i] = slot(i);
    }
    return bracket;
}

describe('findNextMatchup', () => {
    it('returns 7 for a fresh bracket (first R1 matchup)', () => {
        const bracket = freshBracket()
        expect(findNextMatchup(bracket)).toBe(7);
    });

    it('advances left-to-right within Round 1', () => {
        const bracket = freshBracket()
        // Simulate matchup 7 being resolved — slot 7 now has the winner
        bracket[7] = slot(7)
        // Next should be matchup 8, not matchup 3 (R2) or matchup 14 (right side of R1)
        expect(findNextMatchup(bracket)).toBe(8);
    })

    it('only enters Round 2 after all Round 1 matchups are resolved', () => {
        const bracket = freshBracket()
        // Fill all R1 parents (indices 7–14)
        for(let i = 7; i <= 14; i++) bracket[i] = slot(i);
        // First R2 matchup is index 3
        expect(findNextMatchup(bracket)).toBe(3);
    })

    it('returns 0 for the final matchup', () => {
        const bracket = freshBracket()
        // Fill R1 (7–14), R2 (3–6), and R3 (1–2)
        for(let i = 1; i <= 14; i++) bracket[i] = slot(i);
        // Only slot 0 (champion) remains unresolved
        expect(findNextMatchup(bracket)).toBe(0);
    })

    it('returns null when the bracket is full resolved', () => {
        const bracket = freshBracket()
        for(let i = 0; i <= 14; i++) bracket[i] = slot(i);
        expect(findNextMatchup(bracket)).toBeNull();
    })

})