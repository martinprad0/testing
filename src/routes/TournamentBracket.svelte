<script lang="ts">

  import * as utils from '$lib/tournamentUtils.js';

  import { SvelteFlow } from "@xyflow/svelte";
  import MatchNode from "./MatchNode.svelte";
  import "@xyflow/svelte/dist/style.css";

  const depth = 3;
  const nodeTypes = { matchNode: MatchNode };

  let { players = $bindable([]) } = $props();
  let match_items = $state(
    utils.matchItemsGenerator(depth)
  );

  let nodes = $state.raw(utils.nodesGenerator(depth, players, match_items));

  console.log(nodes);

  let edges = $state.raw([]);
</script>

<div style="width: 100vw; height: 70vh">
  <SvelteFlow bind:nodes bind:edges {nodeTypes}></SvelteFlow>
</div>
