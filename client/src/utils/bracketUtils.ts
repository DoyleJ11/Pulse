function getMatchups(round: number) {
    const start = 2**(5 - round) - 1;
    const count = 2**(4 - round) // Number of pairs
    const pairArr = []
    for (let i = 0; i < count; i++) {
        let numPair = [start + i * 2, start + i * 2 + 1];
        pairArr.push(numPair);
    }

    return pairArr
}

function getParent(index: number) {
    return Math.floor((index - 1) / 2);
}

function getChildren(parentIndex: number) {
    return [2 * parentIndex + 1, 2 * parentIndex + 2];
}

export { getMatchups, getParent, getChildren }