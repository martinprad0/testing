<script>
    import { onMount } from "svelte";
    import { db } from "$lib/firebaseConfig.js";
    import { collection, setDoc, doc, getDocs } from "firebase/firestore";
    import { players } from "$lib/global";
    import { Player } from "$lib/types/Player";
    import { Button } from "flowbite-svelte";

    const playersRef = collection(db, "players");

    async function loadItems() {
        const snap = await getDocs(playersRef);
        $players = [];
        $players = snap.docs
            .map((doc) => {
                const data = doc.data();
                return new Player(data.id, data.name, data.info);
            })
            .sort((a, b) => a.id - b.id);
    }

    async function pushItems() {
        await Promise.all(
            $players.map((player) =>
                setDoc(doc(playersRef, crypto.randomUUID()), {
                    id: player.id,
                    name: player.name,
                    info: player.info,
                }),
            ),
        );
    }
</script>

<Button onclick={pushItems}>Push to Firestore</Button>
<Button onclick={loadItems}>Load from Firestore</Button>

<ul>
    {#each $players as player}
        <li>{player.name}, {player.info.country}</li>
    {/each}
</ul>
