<script lang="ts">
  import * as utils from "$lib/tournamentUtils.js";
  import { SvelteFlow, Controls, Panel } from "@xyflow/svelte";
  import { Input, Button, range } from "flowbite-svelte";
  import MatchNode from "./MatchNode.svelte";
  import "@xyflow/svelte/dist/style.css";
  import { Item } from "$lib/types/Item";
  import { players, matches, depth } from "$lib/global";

  const nodeTypes = { matchNode: MatchNode };

  let nodes = $derived(utils.nodesGenerator($depth));

  let edges = $derived(utils.edgesGenerator($depth));

  function seedPlayers() {
    const n = 2 ** $depth;
    if (n > $players.length) {
      console.log(n, $players.length);
      return;
    }
    const topPlayers = $players
      .slice()
      .sort((a, b) => b.info.score - a.info.score)
      .slice(0, n)
      .map((p) => p.id);

    // Snake seeding: [1, 16, 8, 9, 5, 12, 4, 13, 3, 14, 6, 11, 7, 10, 2, 15]
    const seedIndices = utils.seedingGenerator($depth + 1);
    const seedList = seedIndices.map((i) => topPlayers[i]);

    const dlevel = $depth - 1;
    for (let j = 0; j < n / 2; j++) {
      const id = `${j + 2 ** dlevel - 1}`;
      // @ts-ignore:
      const matchIndex = $matches.findIndex((match) => match.id == id);
      $matches[matchIndex].items = [
        new Item(crypto.randomUUID(), seedList[2 * j]),
        new Item(crypto.randomUUID(), seedList[2 * j + 1]),
      ];
      const old_depth = $depth;
      $depth = 1;
      $depth = old_depth;
    }
  }
</script>

<div style="width: 100vw; height: 80vh">
  <SvelteFlow
    bind:nodes
    bind:edges
    {nodeTypes}
    proOptions={{ hideAttribution: true }}
    fitView
  >
    <Controls />
    <Panel>
      <Input type="number" bind:value={$depth} min={1} max={6} />
      <Button
        onclick={() => {
          for (const match of $matches) {
            match.items = [];
          }
          $matches = [...$matches]; // ensure reactivity
        }}
      >
        Borrar
      </Button>
      <Button onclick={seedPlayers}>Organizar</Button>
    </Panel>
  </SvelteFlow>
</div>

<style>
    :global(.svelte-flow) {
        background: transparent !important;
    }
</style>
