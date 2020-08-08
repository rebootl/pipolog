<script>
	import moment from 'moment';

	export let entry = {};
	export let compactView = true;

	const dateFormat = 'ddd, MMM D, YYYY - HH:mm:ss';
	function getDate(date) {
		return moment(new Date(entry.agent_timestamp)).format(dateFormat);
	}
</script>

{#if compactView}
	<pre class="compact">{entry.text}</pre>
{:else}
<div class="entry">
	<small class="date header">{getDate(entry.agent_timestamp)}</small>
	<small class="hostname header">{entry.host}</small>
	<small class="name">{entry.name}</small>
	<pre>{entry.text}</pre>
</div>
{/if}

<style>
	.entry {
		border-bottom: 1px solid rgb(120, 120, 200);
		margin-bottom: 10px;
		padding-right: 10px;
	}
	.header {
		font-size: 0.8em;
		color: var(--main-text-color-low-emph);
	}
	.hostname {
		float: right;
	}
	.name {
		font-size: 0.8em;
	}
	pre {
		color: var(--pre-text-color);
		margin-left: 10px;
		white-space: pre-wrap;
	}
	pre.compact {
		margin: 0;
		white-space: pre;
	}
</style>
