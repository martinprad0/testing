<script lang="ts">
    import { Handle, Position, type NodeProps } from "@xyflow/svelte";

    // Variable props
    import { players, matches } from "$lib/global";
    import { Item } from "$lib/types/Item";
    import { Match } from "$lib/types/Match";
    let { data }: NodeProps = $props();
    let dlevel = data.dlevel;
    let j = data.j;
    // @ts-ignore:
    let id = `${j + 2 ** dlevel - 1}`;
    // Match logic function
    function matchIndex(id) {
        let idx = $matches.findIndex((match) => match.id === id);
        if (idx === -1) {
            // no existing match → append a new one
            const items: Item[] = [];
            $matches = [...$matches, new Match(id, items, 0)];
            idx = $matches.length - 1;
        }
        return idx;
    }
    function playerIndex(player_id) {
        return $players.findIndex((player) => player.id === player_id);
    }

    // Constants
    const matchWidth = "200px";
    const playerHeight = "50px";
    const flipDurationMs = 100;
    let i = matchIndex(id);

    function addWinner(player_id) {
        const index_next_round = matchIndex(
            // @ts-ignore:
            `${Math.round((j - 1) / 2) + 2 ** (dlevel - 1) - 1}`,
        );
        $matches[index_next_round].items = $matches[
            index_next_round
        ].items.filter((item) => item.player_id !== player_id);
        if (player_id != $matches[i].winner) {
            if (id != "0") {
                $matches[index_next_round].items.push(
                    new Item(crypto.randomUUID(), player_id),
                );
            }
            $matches[i].winner = player_id;
        } else {
            $matches[i].winner = 0;
        }
    }

    // Animation
    import { fade } from "svelte/transition";
    import { flip } from "svelte/animate";

    // Drag and Drop Components
    import { dndzone } from "svelte-dnd-action";

    function handleDndConsider(e) {
        $matches[i].items = e.detail.items;
    }
    function handleDndFinalize(e) {
        $matches[i].items = e.detail.items;
    }

    // Flowbite UI Components
    import { Button } from "flowbite-svelte";
    import { StarOutline } from "flowbite-svelte-icons";

    //
    let emptyStyle = $derived(
        $matches[i].items.length > 0
            ? ""
            : "box-sizing: border-box; border: 1px dashed gray; background-color: lightgray",
    );

    $effect(() => {
        if ($matches[i].id != id) {
            i = matchIndex(id);
        }

    });
</script>

<p>{id}</p>
<Handle type="target" position={Position.Left}  />
<Handle type="source" position={Position.Right} />
<section
    class="match"
    style="--player-height: {playerHeight}; --container-width: {matchWidth}; {emptyStyle}"
    use:dndzone={{
        items: $matches[i].items,
        flipDurationMs,
        morphDisabled: false,
    }}
    onconsider={handleDndConsider}
    onfinalize={handleDndFinalize}
>
    {#each $matches[i].items as item (item.id)}
        {@const k = playerIndex(item.player_id)}
        <div
            class="player flex justify-between items-center w-full px-4 py-2 {item.player_id ==
            $matches[i].winner
                ? 'winner'
                : ''}"
            style="--player-height: {playerHeight};"
            animate:flip={{ duration: flipDurationMs }}
            in:fade={{ duration: 1000 }}
        >
            <p
                class="flex-1 text-center truncate font-semibold dark:text-white bg-transparent outline-none"
            >
                {$players[k].name}
            </p>
            <Button class="p-2!" onclick={() => addWinner(item.player_id)}>
                <StarOutline class="h-4 w-4" />
            </Button>
        </div>
    {/each}
</section>

<style>
    .match {
        min-height: var(--player-height);
        width: var(--container-width);
        gap: 0em;
        padding: calc(var(--player-height) * 0.5) 0
            calc(var(--player-height) * 0.5) 0;
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
    .winner {
        background-color: var(--color-primary-500);
    }
</style>
