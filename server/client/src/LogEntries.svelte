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
		const triggerEl = document.querySelector('.triggerelement');
		if (triggerEl) {
			triggerEl.classList.remove('triggerelement');
			bottomObserver.unobserve(triggerEl);
		}
		const el = document.querySelector('.entrieslist');
		if (!el) return;
		const newTriggerEl = el.children[el.children.length - 10];
		if (!newTriggerEl) return;
		newTriggerEl.classList.add('triggerelement')
		bottomObserver.observe(newTriggerEl);
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
