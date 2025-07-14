export function matchItemsGenerator (depth) {
    return Array.from({ length: depth }, (_, level) =>
      Array.from({ length: 2 ** (depth - 1 - level) }, (_, i) => []),
    );
}

function position(depth, level, i) {
  
}

export function nodesGenerator (depth, players, match_items) {
  let nodes = [];
  for (let level = 0; level < depth; level++) {
    for (let i = 0; i < 2 ** (depth - 1 - level); i++) {
      console.log(`${[level,i]}`)
      let newMatch = {
        id: `${[level,i]}`,//`${i + 2 ** (depth - 1 - level)}`,
        type: "matchNode",
        position: { x: level*300, y: i*200, },
        data: { players: players, items: match_items[level][i] },
      };
      nodes = [newMatch, ...nodes];
    }
  }
  return nodes;
}