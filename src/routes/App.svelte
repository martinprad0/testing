<!-- /src/routes/App.svelte -->
<script>
	import PlayerCard from "./PlayerCard.svelte";
	import PlayerCardList from "./PlayerCardList.svelte";

	import { playersData } from '$lib/playersDemo1.js';

  // make it reactive with $state
  let players = $state(playersData);

  function addExistingPlayers(player_ids) {
        let player_items = []
        for (const player_id of player_ids) {
            player_items = [...player_items, { id: crypto.randomUUID(), player_id }];
        }
        return player_items
    }

	const player_ids = [1,2,3,8,7,10,11,23,32]

	let items1 = $state(addExistingPlayers(player_ids));
	let items2 = $state([
		{ id: 4, player_id: 1 },
		{ id: 5, player_id: 3 },
		{ id: 6, player_id: 4 },
		{ id: 7, player_id: 5 },
	]);

	import Test from "./Test.svelte";
	const n = 8;
	const letters = Array.from({ length: n }, (_, i) =>
		String.fromCharCode(65 + i),
	);
</script>

<br /><br /><br />

<div style="height: 150px; min-width: 20%; display: inline-block;">
	<PlayerCard player={players[0]}></PlayerCard>
</div>
<PlayerCardList bind:players bind:items={items1}></PlayerCardList>
<PlayerCardList bind:players bind:items={items2}></PlayerCardList>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>
