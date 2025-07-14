<!-- /src/routes/Player.svelte -->
<script lang="ts">
    // Flowbite components
    import { Badge, Button, Input } from "flowbite-svelte";
    import {
        EditOutline,
        CheckOutline,
        CloseOutline,
        ExpandOutline,
        MinimizeOutline,
        FileCopyOutline,
    } from "flowbite-svelte-icons";

    /** @type {{ id?: number, name?: string, info?: any, level?: number, score?: number }} */
    let {
        player = $bindable(),
        oncopy = () => {},
        ondelete = () => {},
        expanded = $bindable(false),
    } = $props();
    let edit_mode = $state(false);
</script>

<div class="playerCard">
    <!-- Handle Elements -->
    <div
        class="handle flex items-center gap-2"
        aria-label="drag-handle for {player.text}"
    >
        <!-- Player Info -->
        <div class="flex items-center gap-2">
            <Badge>{player.id}</Badge>
            {#if !edit_mode}
                <p
                    class="truncate font-semibold dark:text-white bg-transparent outline-none"
                >
                    {player.name}
                </p>
            {:else}
                <Input
                    class="truncate font-semibold dark:text-white bg-transparent outline-none"
                    bind:value={player.name}
                    autofocus
                    onkeydown={(e) => {
                        if (e.key === "Enter") edit_mode = false;
                    }}
                />
            {/if}
        </div>

        <!-- Buttons -->
        <div class="ml-auto flex gap-2">
            {#if edit_mode}
                <Button class="p-2!" onclick={() => oncopy?.(player)}>
                    <FileCopyOutline class="h-4 w-4" />
                </Button>
            {/if}
            {#if !edit_mode}
                <Button
                    class="p-2!"
                    onclick={() => {
                        expanded = !expanded;
                        console.log(player);
                    }}
                >
                    {#if !expanded}
                        <ExpandOutline class="h-4 w-4" />
                    {:else}
                        <MinimizeOutline class="h-4 w-4" />
                    {/if}
                </Button>
            {:else}
                <Button class="p-2!" onclick={() => ondelete?.(player)}>
                    <CloseOutline class="h-4 w-4" />
                </Button>
            {/if}

            <Button
                class="p-2!"
                onclick={() => {
                    edit_mode = !edit_mode;
                    expanded = edit_mode;
                }}
            >
                {#if !edit_mode}
                    <EditOutline class="h-4 w-4" />
                {:else}
                    <CheckOutline class="h-4 w-4" />
                {/if}
            </Button>
        </div>
    </div>
    <div class="content">
        {#each Object.entries(player.info) as [key, val]}
            <div class="flex items-center gap-2 my-2">
                <span class="font-medium dark:text-white">{key}:</span>
                {#if edit_mode}
                <Input
                    clearable
                    bind:value={player.info[key]}
                    class="flex-1"
                />
                {:else}
                <span class="dark:text-white flex-1 truncate">{val}</span>
                {/if}
            </div>
            {/each}
    </div>
</div>

<style>
    .playerCard {
        width: 100%;
        height: 100%;
    }
    .playerCard .handle {
        height: 40%;
        background-color: var(--color-primary-800);
        display: flex;
        text-align: center;
        justify-content: space-between;
        gap: 0.25rem;
        padding-right: 5%;
    }

    .playerCard .content {
        height: 60%;
        /* border: 1px solid blue; */
        margin: 0 0em;
        overflow: auto;
        background-color: var(--color-primary-900);
    }
</style>
