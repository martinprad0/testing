<!-- src/routes/components/PlayerCardList.svelte -->
<script>
    // Constants
    const containerWidth = "100vw";
    const containerHeight = "300px";
    const itemWidth = "180px";
    const itemHeight = "80px";
    const flipDurationMs = 300;

    // Focus Management
    let zindex = 1;
    let currentlyFocused = $state(0);

    // Reactive Variables
    import { players, matches, depth } from "$lib/global";
    let items = $state([]);
    function resetItems() {
        items = $players.map((player) => ({
            id: crypto.randomUUID(),
            player_id: player.id,
        }));
    }
    resetItems();

    let searchQuery = $state("");

    //// Imports
    // Animation
    import { flip } from "svelte/animate";

    // Flowbite Components
    import { Button, Search, Input } from "flowbite-svelte";
    import {
        UserAddOutline,
        TrashBinOutline,
        SortOutline,
        RefreshOutline,
        UploadOutline,
        DownloadOutline,
    } from "flowbite-svelte-icons";

    // Drag and Drop Components and Handle Functions
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
        for (let i = 0; i < $matches.length; i++) {
            $matches[i].items = $matches[i].items.filter(
                (item) => item.player_id != target_player.id,
            );
        }
        $players = $players.filter((player) => player.id != target_player.id);
    }

    function addNewPlayer() {
        let newPlayer = {};
        newPlayer.id = Math.min(
            ...Array.from(
                { length: $players.length + 1 },
                (_, i) => i + 1,
            ).filter((i) => !$players.some((p) => p.id === i)),
        );
        newPlayer.name = "Nuevo";
        newPlayer.info = {};

        for (const key of Object.keys($players[0].info)) {
            newPlayer.info[key] = "";
        }

        $players = [...$players, newPlayer];
        items = [
            { id: crypto.randomUUID(), player_id: newPlayer.id },
            ...items,
        ];
    }

    function sortItemsBySearch() {
        items = [...items].sort((a, b) => {
            const nameA =
                $players
                    .find((p) => p.id === a.player_id)
                    ?.name?.toLowerCase() ?? "";
            const nameB =
                $players
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

    function sortItemsByScore() {
        items = [...items].sort((a, b) => {
            const ageA =
                $players.find((p) => p.id === a.player_id)?.info.score ?? 0;
            const ageB =
                $players.find((p) => p.id === b.player_id)?.info.score ?? 0;
            return ageB - ageA;
        });
    }

    // Firebase Functions
    import { loadGame, pushGame } from "$lib/global";

    let collectionId = $state("openstyle");

    async function handleLoadGame(collectionId) {
        await loadGame(collectionId); // Wait for the game to load
        resetItems(); // Then reset items with the loaded players
        console.log($players);
        console.log($matches);
    }

    // Handler for pushGame with user feedback and validation
    async function handlePushGame(collectionId) {
        // Input validation
        if (!collectionId?.trim()) {
            console.error("Collection ID is required");
            alert("Please provide a valid collection ID");
            return;
        }

        // Check if we have data to save
        const currentPlayers = $players;
        const currentMatches = $matches;

        if (currentPlayers.length === 0) {
            console.warn("No players to save");
            alert("Cannot save game: No players found");
            return;
        }

        try {
            // Show loading state (you can replace with your UI loading indicator)
            console.log("Saving game...");

            // Call the main pushGame function
            await pushGame(collectionId);

            // Success feedback
            console.log("Game saved successfully!");
        } catch (error) {
            // Error handling with user feedback
            console.error("Failed to save game:", error);

            // Show user-friendly error message
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred";
            alert(`Failed to save game: ${errorMessage}`);
        }
    }

    import { onMount } from "svelte";
    import { collection } from "firebase/firestore";
    onMount(async () => {
        resetItems();
    });
</script>

<div style="background-color: rgba(25,25,112,0.6);;">
    <!-- Control Panel -->
    <div class="flex items-center justify-between mb-4 gap-4">
        <!-- Add new player -->
        <Button class="p-2!" onclick={addNewPlayer}
            ><UserAddOutline class="h-4 w-4" /></Button
        >
        <Button class="p-2!" onclick={sortItemsByScore}
            ><SortOutline class="h-4 w-4" /></Button
        >
        <Button class="p-2!" onclick={resetItems}
            ><RefreshOutline class="h-4 w-4" /></Button
        >

        <!-- Search -->
        <Search
            class="!text-sm !w-48 !pl-8 !py-1 !px-2"
            placeholder="Search..."
            bind:value={searchQuery}
            oninput={sortItemsBySearch}
        />

        <Input
            class="!text-sm !w-48 !pl-8 !py-1 !px-2"
            bind:value={collectionId}
            placeholder="Enter game ID..."
        />

        <Button
            class="p-2!"
            onclick={async () => {
                await handleLoadGame(collectionId);
            }}><DownloadOutline class="h-4 w-4" /></Button
        >
        <Button
            class="p-2!"
            onclick={async () => {
                await handlePushGame(collectionId);
            }}><UploadOutline class="h-4 w-4" /></Button
        >
        <!-- Trash -->
        <div class="relative w-1/2 h-12 flex justify-center items-center">
            <!-- Trash DnD zone-->
            <section
                class="absolute inset-0 flex justify-center items-center"
                style="height: 50px;"
                use:dndzone={{ items, flipDurationMs, morphDisabled: true }}
            ></section>

            <!-- Trash Icon -->
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
                    player_id={item.player_id}
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
        /* border: 1px solid greenyellow; */
        overflow-x: auto;
    }
    .playerCard {
        border-radius: 0.5em;
    }
</style>
