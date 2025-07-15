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
        item = [],
        currentlyFocused = 0,
        player = $bindable(),
        oncopy = () => {},
        ondelete = () => {},
        expanded = $bindable(false),
    } = $props();
    let edit_mode = $state(false);
</script>

<div
    class="playerCard"
    style="--height:{`${100 * (expanded ? 2 : 1)}%`}; --width:{`${100 * (expanded ? 2 : 1)}%`}"
>
    <!-- Handle Elements -->
    <div
        class="handle"
        style="--height:{`${20 * (expanded ? 1 : 2)}%`}"
        aria-label="drag-handle for {player.text}"
    >
        <!-- Player Name -->
        <div class="flex items-center gap-2 w-1/2">
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
        <div class="justify-end flex gap-2 w-full">
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
    <div class="content" style="--height:{`${60 * (expanded ? 2 : 1)}%`}">
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
        width: var(--width);
        height: var(--height);
        font-size: 12px;
        border-radius: 0.5em;
        overflow: hidden;
    }
    .playerCard .handle {
        height: var(--height);
        background-color: var(--color-primary-800);
        display: flex;
        text-align: center;
        justify-content: space-between;
        gap: 0.25rem;
        padding: 0 2% 0 3%;
    }

    .playerCard .content {
        height: var(--height);
        /* border: 1px solid blue; */
        margin: 0 0em;
        overflow: auto;
        background-color: var(--color-primary-900);
    }
</style>
