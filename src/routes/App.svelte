<!-- /src/routes/App.svelte -->
<script>
	// Import UI components
	import PlayerCardList from "./components/PlayerCardList.svelte";
	import TournamentBracket from "./components/TournamentBracket.svelte";

	// Players List variable initialization
	import { playersData } from "$lib/playersDemo1.js";
	import { players } from "$lib/global";
	$players = playersData;

	// Matches List variable initialization
    import { Item } from "$lib/types/Item";
    import Counter from "./Counter.svelte";

	function displayAllPlayers(player_ids) {
		let player_items = [];
		for (const player_id of player_ids) {
			player_items.push(new Item(crypto.randomUUID(), player_id ));
		}
		return player_items;
	}
</script>

<Counter></Counter>

<TournamentBracket></TournamentBracket>

<PlayerCardList></PlayerCardList>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>
