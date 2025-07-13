<script>
    // Reactive Variables
    let { players = $bindable([]), items = $bindable([]) } = $props();
    let searchQuery = $state("");

    function playerIndices(player_id) {
        return players.findIndex((player) => player.id === player_id);
    }

    //// Imports
    // Animation
    import { flip } from "svelte/animate";

    // Flowbite Components
    import { Button, Search } from "flowbite-svelte";
    import { UserAddOutline } from "flowbite-svelte-icons";

    // Drag and Drop Components
    import { dndzone } from "svelte-dnd-action";
    function handleDndConsider(e) {
        items = e.detail.items;
    }
    function handleDndFinalize(e) {
        items = e.detail.items;
    }

    // PlayerCard component
    import PlayerCard from "./PlayerCard.svelte";

    // Button logic
    function copyItem(target_player) {
        items = [
            ...items,
            { id: crypto.randomUUID(), player_id: target_player.id },
        ];
    }

    function deleteItem(target_player) {
        items = items.filter((item) => item.player_id !== target_player.id);
    }

    function addNewPlayer() {
        let newPlayer = {};
        newPlayer.id = players.length + 1;
        newPlayer.name = "Nuevo";
        newPlayer.info = {};

        players = [...players, newPlayer];
        items = [
            { id: crypto.randomUUID(), player_id: newPlayer.id },
            ...items,
        ];
    }

    // Constants
    const containerWidth = "100%";
    const itemWidth = "270px";
    const flipDurationMs = 100;

    // Event handler
    function sortItems() {
    items = [...items].sort((a, b) => {
        const nameA = players.find(p => p.id === a.player_id)?.name?.toLowerCase() ?? "";
        const nameB = players.find(p => p.id === b.player_id)?.name?.toLowerCase() ?? "";
        const query = searchQuery.toLowerCase();

        const matchA = nameA.includes(query) ? nameA.indexOf(query) : Infinity;
        const matchB = nameB.includes(query) ? nameB.indexOf(query) : Infinity;

        return matchA - matchB;
    });
    }

</script>

<div>
    <div class="flex items-center justify-between mb-4 gap-4">
        <Button class="p-2!" onclick={addNewPlayer}
            ><UserAddOutline class="h-4 w-4" /></Button
        >
        <Search placeholder="Search..." bind:value={searchQuery} oninput={(e) => sortItems()}  />
    </div>
    <section
        style="--item-width: {itemWidth}; --container-width: {containerWidth};"
        class="scroll-grid"
        use:dndzone={{ items, flipDurationMs }}
        onconsider={handleDndConsider}
        onfinalize={handleDndFinalize}
    >
        {#each items as item (item.id)}
            <div
                style="width: {itemWidth}; height: 120px; position: relative; z-index: 1"
                animate:flip={{ duration: flipDurationMs }}
            >
                <PlayerCard
                    bind:player={players[playerIndices(item.player_id)]}
                    oncopy={copyItem}
                    ondelete={deleteItem}
                />
            </div>
        {/each}
    </section>
</div>

<style>
    .scroll-grid {
        display: grid;
        grid-template-columns: repeat(
            auto-fill,
            minmax(var(--item-width), 0.5em)
        );
        grid-auto-rows: 120px;
        width: var(--container-width);
        height: 350px;
        gap: 0.5em;
        padding: 0.3em;
        border: 1px solid greenyellow;
        overflow-x: auto;
    }
    div {
        border: 1px solid red;
    }
</style>
