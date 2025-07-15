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
    import { UserAddOutline, TrashBinOutline } from "flowbite-svelte-icons";

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
            { id: crypto.randomUUID(), player_id: target_player.id },
            ...items,
        ];
    }

    function deleteItemPlayer(target_player) {
        items = items.filter((item) => item.player_id !== target_player.id);
    }

    function expandItem(item) {}

    function addNewPlayer() {
        let newPlayer = {};
        newPlayer.id = players.length + 1;
        newPlayer.name = "Nuevo";
        newPlayer.info = {};

        for (const key of Object.keys(players[0].info)) {
            newPlayer.info[key] = "";
        }

        players = [...players, newPlayer];
        items = [
            { id: crypto.randomUUID(), player_id: newPlayer.id },
            ...items,
        ];
    }

    // Constants
    const containerWidth = "100vw";
    const containerHeight = "300px";
    const itemWidth = "180px";
    const itemHeight = "80px";
    const flipDurationMs = 300;

    // Focus Management
    let zindex = 1;
    let currentlyFocused = $state(0);

    // Event handler
    function sortItems() {
        items = [...items].sort((a, b) => {
            const nameA =
                players
                    .find((p) => p.id === a.player_id)
                    ?.name?.toLowerCase() ?? "";
            const nameB =
                players
                    .find((p) => p.id === b.player_id)
                    ?.name?.toLowerCase() ?? "";
            const query = searchQuery.toLowerCase();

            const matchA = nameA.includes(query)
                ? nameA.indexOf(query)
                : Infinity;
            const matchB = nameB.includes(query)
                ? nameB.indexOf(query)
                : Infinity;

            return matchA - matchB;
        });
    }
</script>

<div>
    <div class="flex items-center justify-between mb-4 gap-4">
        <Button class="p-2!" onclick={addNewPlayer}
            ><UserAddOutline class="h-4 w-4" /></Button
        >
        <Search
            placeholder="Search..."
            bind:value={searchQuery}
            oninput={(e) => sortItems()}
        />
        <div class="relative w-1/4 h-12 flex justify-center items-center">
            <!-- your dnd zone covers the full container but centers its items -->
            <section
                class="absolute inset-0 flex justify-center items-center"
                style="height: 50px;"
                use:dndzone={{ items, flipDurationMs, morphDisabled: true }}
            ></section>

            <!-- the trash icon sits in the very center -->
            <TrashBinOutline class="h-5 w-5 text-white" />
        </div>
    </div>
    <section
        class="scroll-grid"
        style="--item-width: {itemWidth}; --item-height: {itemHeight}; --container-width: {containerWidth}; --container-height: {containerHeight}"
        use:dndzone={{ items, flipDurationMs, morphDisabled: true }}
        onconsider={handleDndConsider}
        onfinalize={handleDndFinalize}
    >
        {#each items as item (item.id)}
            <div
                class="playerCard"
                style="width: {itemWidth}; height: {itemHeight}; position: relative; z-index: 1"
                animate:flip={{ duration: flipDurationMs }}
                role="button"
                tabindex="0"
                onclick={(e) => {
                    e.currentTarget.style.zIndex = `${++zindex}`;
                    currentlyFocused = item.id;
                }}
                onkeydown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    e.currentTarget.click()}
            >
                <PlayerCard
                    bind:player={players[playerIndices(item.player_id)]}
                    {currentlyFocused}
                    {item}
                    oncopy={copyItem}
                    ondelete={deleteItemPlayer}
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
        grid-auto-rows: var(--item-height);
        width: var(--container-width);
        height: var(--container-height);
        gap: 0.5em;
        padding: 0.3em;
        border: 1px solid greenyellow;
        overflow-x: auto;
    }
    .playerCard {
        border-radius: 0.5em;
    }
</style>
