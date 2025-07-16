<!-- /src/routes/App.svelte -->
<script>
	import PlayerCard from "./PlayerCard.svelte";
	import PlayerCardList from "./PlayerCardList.svelte";
	import TournamentBracket from "./TournamentBracket.svelte";

	import { playersData } from "$lib/playersDemo1.js";
	import MatchNode from "./MatchNode.svelte";

	// make it reactive with $state
	import {players} from '$lib/global';
	$players = playersData;

	function addExistingPlayers(player_ids) {
		let player_items = [];
		for (const player_id of player_ids) {
			player_items = [
				...player_items,
				{ id: crypto.randomUUID(), player_id },
			];
		}
		return player_items;
	}

	const player_ids = Array.from({ length: 32 }, (_, i) => i + 1);

	let items1 = $state(addExistingPlayers(player_ids));
	let items2 = $state(addExistingPlayers([1]));
</script>

<br /><br /><br />

<TournamentBracket></TournamentBracket>

<PlayerCardList bind:items={items1}></PlayerCardList>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>
