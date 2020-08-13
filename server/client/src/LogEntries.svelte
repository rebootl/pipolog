<script>
	import moment from 'moment';
  import { onMount } from "svelte";
	import { createEventDispatcher } from 'svelte';
	import LogEntry from './LogEntry.svelte';

	const dispatch = createEventDispatcher();

	export let entries = [];
	export let compactView = false;

	// lazy load

	function lazyLoad(e) {
		if (e[e.length - 1].intersectionRatio <= 0) return;
		dispatch('fetch');
	}

	const bottomObserver = new IntersectionObserver(
		(e) => { lazyLoad(e) }, { threshold: 0.5 }
	);

	const ulMutationObserver = new MutationObserver(
		(m, o) => updateObserver(m, o)
	);

	function updateObserver(m, o) {
		const lastli = document.querySelector('.lastelement');
		if (lastli) {
			lastli.classList.remove('lastelement');
			bottomObserver.unobserve(lastli);
		}
		const ul = document.querySelector('.entrieslist');
		if (!ul) return;
		const newLastli = ul.lastElementChild;
		newLastli.classList.add('lastelement')
		bottomObserver.observe(newLastli);
	}

	onMount(() => {
		const ul = document.querySelector('.entrieslist');
		ulMutationObserver.observe(ul, { childList: true });
	});
</script>

<div class="entrieslist">
	{#each entries as entry}
		<LogEntry {entry} {compactView} />
	{:else}
		<pre>loading...</pre>
	{/each}
</div>

<style>
	.entrieslist {
		margin-top: 10px;
		margin-bottom: 20px;
		border-top: 2px solid var(--hline-color);
		padding-top: 10px;
		height: calc(100vh - 75px);
		overflow-y: auto;
		overflow-x: auto;
	}
</style>
