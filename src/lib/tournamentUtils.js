export function matchItemsGenerator (depth) {
    return Array.from({ length: depth }, (_, level) =>
      Array.from({ length: 2 ** (depth - 1 - level) }, (_, i) => []),
    );
}

function matchPosition(depth, level, i, matchWidth, playerHeight) {
  const totalMatches = 2**(depth-1-level);
  const isOnLeft = i < totalMatches/2 ? -1 : 1;
  const x = isOnLeft*(depth-level-1)*300;
  const y = level < depth - 1 ? (
    (i -(isOnLeft+1)/2*totalMatches/2) // recenter when you go to the matches on the right
     - (2**(depth-2-level)-1)/2) * 2**(level+1) * playerHeight*1.6 // recenter and rescale according to the level
     :0;
   return { x, y }
}

export function nodesGenerator (depth, players, match_items) {
  let nodes = [];
  for (let level = 0; level < depth; level++) {
    const playerHeight = 50;
    const matchWidth = 300

    for (let i = 0; i < 2 ** (depth - 1 - level); i++) {
      const position = matchPosition(depth, level, i, matchWidth, playerHeight)
      let newMatch = {
        id: `${i + 2 ** (depth - 1 - level) - 1}`,
        type: "matchNode",
        position,
        dragHandle: 'no-drag',
        data: { players, items: match_items[level][i], id: `${i + 2 ** (depth - 1 - level) - 1}` },
      };
      nodes = [newMatch, ...nodes];
    }
  }
  return nodes;
}

export function edgesGenerator (depth) {
  let edges = [];
  for (let level = 0; level < depth-1; level++) {
    const totalMatchesLevel = 2**(depth-1-level);
    for (let i = 0; i < totalMatchesLevel; i++) {
      
      const isOnLeft = i < totalMatchesLevel/2;
      let left_edge = `${i + 2 ** (depth - 1 - level)- 1}`;
      let right_edge = `${Math.round((i-1)/2) + 2 ** (depth - 1 - level - 1)- 1}`;
      if (!isOnLeft) {
        [left_edge, right_edge] = [right_edge, left_edge];
      }
      let newEdge = {
        id: `e${i + 2 ** (depth - 1 - level)- 1}`,
        source: left_edge,
        target: right_edge,
        type:'step'
      }
      edges = [...edges, newEdge]
  }
}
  return edges
}