import { db } from "$lib/firebaseConfig.js";
import { collection, setDoc, doc, getDocs, getDoc } from "firebase/firestore";
import { writable } from "svelte/store";
import { Player } from "$lib/types/Player";
import { Match } from "$lib/types/Match";

export const players = writable<Player[]>([]);
export const matches = writable<Match[]>([]);
export const depth = writable(5);

const playersRef = collection(db, "players");
const matchesRef = collection(db, "matches");
const metaRef = doc(db, "meta", "config");

export async function loadGame() {
	let snap = await getDocs(playersRef);
	const loadedPlayers = snap.docs
		.map((doc) => {
			const data = doc.data();
			return new Player(data.id, data.name, data.info);
		})
		.sort((a, b) => a.id - b.id);

	snap = await getDocs(matchesRef);
	const loadedMatches = snap.docs.map((doc) => {
		const data = doc.data();
		return new Match(data.id, data.items ?? [], data.winner);
	});

	const metaSnap = await getDoc(metaRef);
	const loadedDepth = metaSnap.exists() ? metaSnap.data().depth : 5;

	players.set(loadedPlayers);
	matches.set(loadedMatches);
	depth.set(loadedDepth);
}

import { get } from 'svelte/store';

export async function pushGame() {
	const currentPlayers = get(players);
	const currentMatches = get(matches);
	const currentDepth = get(depth);

	await Promise.all([
		...currentPlayers.map((player) =>
			setDoc(doc(playersRef, `${player.id}`), {
				id: player.id,
				name: player.name,
				info: player.info,
			})
		),
		...currentMatches.map((match) =>
			setDoc(doc(matchesRef, `${match.id}`), {
				id: match.id,
				items: match.items.map(item => ({ ...item })),
				winner: match.winner,
			})
		),
		setDoc(metaRef, { depth: currentDepth }),
	]);
}