<script lang="ts">
    import { Position, useSvelteFlow, type NodeProps } from "@xyflow/svelte";

    // Reactive Variables
    interface Item {
        id: string;
        player_id: string;
    }

    let { data }: NodeProps = $props();
    let players: any[] = (data as any).players ?? [];
    let items = $state(((data as any).items ?? []) as Item[]);

    function playerIndices(player_id) {
        return players.findIndex((player) => player.id === player_id);
    }
    let { updateNodeData } = useSvelteFlow();

    // Animation
    import { flip } from "svelte/animate";

    // Drag and Drop Components
    import { dndzone } from "svelte-dnd-action";

    function handleDndConsider(e) {
        items = e.detail.items;
    }
    function handleDndFinalize(e) {
        items = e.detail.items;
    }

    // Constants
    const matchWidth = "200px";
    const playerHeight = "50px";
    const flipDurationMs = 100;
</script>

<section
    class="match"
    style="--player-height: {playerHeight}; --container-width: {matchWidth};"
    use:dndzone={{ items, flipDurationMs, morphDisabled: true }}
    onconsider={handleDndConsider}
    onfinalize={handleDndFinalize}
>
    {#each items as item (item.id)}
        {@const player = players[playerIndices(item.player_id)]}
        <div
            class="player"
            style="--player-height: {playerHeight};"
            animate:flip={{ duration: flipDurationMs }}
        >
            {player.name}
        </div>
    {/each}
</section>

<style>
    .match {
        min-height: var(--player-height);
        width: var(--container-width);
        gap: 0em;
        padding: 0 0 calc(var(--player-height)*0.8) 0;
        border: 1px solid blue;
    }
    .player {
        position: relative;
        z-index: 1;
        border: 1px solid red;
        width: 100%;
        height: var(--player-height);
        background-color: var(--color-primary-800);
    }
</style>
