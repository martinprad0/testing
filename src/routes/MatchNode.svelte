<script lang="ts">
    import { fade } from 'svelte/transition';
    import { Handle, Position, useSvelteFlow, type NodeProps } from "@xyflow/svelte";

    // Reactive Variables
    interface Item {
        id: string;
        player_id: string;
    }

    let { data }: NodeProps = $props();
    let players: any[] = (data as any).players ?? [];
    $inspect(players)
    let items = $state(((data as any).items ?? []) as Item[]);
    let position = data.position;
    let level = data.level;
    let id = data.id;

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

    let emptyStyle = $derived(items.length > 0 ? '' : 'box-sizing: border-box; border: 1px dashed gray; background-color: lightgray')
</script>

<Handle type="target" position={Position.Left} />
<Handle type="source" position={Position.Right} />

<section
    class="match"
    style="--player-height: {playerHeight}; --container-width: {matchWidth}; {emptyStyle}"
    use:dndzone={{ items, flipDurationMs, morphDisabled: false }}
    onconsider={handleDndConsider}
    onfinalize={handleDndFinalize}
>
    {#each items as item (item.id)}
        {@const player = players[playerIndices(item.player_id)]}
        <div
            class="player"
            style="--player-height: {playerHeight};"
            animate:flip={{ duration: flipDurationMs }}
            in:fade={{duration: 1000}}
        >
            <p
                    class="truncate font-semibold dark:text-white bg-transparent outline-none"
                >
                    {player.name}
                </p>
        </div>
    {/each}
</section>

<style>
    .match {
        
        min-height: var(--player-height);
        min-width: var(--container-width);
        gap: 0em;
        padding: calc(var(--player-height)*0.5) 0 calc(var(--player-height)*0.5) 0;
        /* border: 1px solid blue; */
    }
    .player {
        border-bottom: 1px solid black;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 1;
        /* border: 1px solid red; */
        width: 100%;
        height: var(--player-height);
        background-color: var(--color-primary-800);
    }
</style>
