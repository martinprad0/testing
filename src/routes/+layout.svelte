<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		const html = document.documentElement;
		html.classList.add('dark'); // or toggle('dark') if you want switching
	});
</script>

{@render children()}