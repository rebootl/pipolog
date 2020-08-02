<script>
	import moment from 'moment';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let dateType = 'any';
	let invalidRange = false;

	let fromDate = '';
	let fromTime = '00:00';
	let toDate = '';
	let toTime = '00:00';

	function updateRange() {
		if (!fromDate || !fromTime || !toDate || !toTime) {
			invalidRange = true;
			return;
		}
		const f = moment(fromDate + ' ' + fromTime).toISOString();
		const t = moment(toDate + ' ' + toTime).toISOString();
		if (f >= t) {
			invalidRange = true;
			return;
		}
		invalidRange = false;
		dispatch('change', { type: 'abs', from: f, to: t });
	}

	function setType(v) {
		dateType = v;
		if (v === 'abs') {
			invalidRange = true;
			return;
		}
		dispatch('change', { type: v, offset: 1 });
	}

	function setOffset(v) {
		dispatch('change', { type: 'rel', offset: v });
	}

	function setFromDate(v) {
		fromDate = v;
		updateRange();
	}

	function setFromTime(v) {
		fromTime = v;
		updateRange();
	}

	function setToDate(v) {
		toDate = v;
		updateRange();
	}

	function setToTime(v) {
		toTime = v;
		updateRange();
	}
</script>

<div class="selectBox">
	Date:
	<select on:change={ (e) => setType(e.target.value) }>
		<option value="any">any</option>
		<option value="rel">from now</option>
		<option value="abs">from - to</option>
	</select>
	{#if dateType == 'rel'}
		<select on:change={ (e) => setOffset(parseInt(e.target.value)) }>
			<option value="1">-1h</option>
			<option value="3">-3h</option>
			<option value="6">-6h</option>
			<option value="12">-12h</option>
			<option value="24">-24h</option>
		</select>
	{:else if dateType == 'abs'}
		<br>
		from:
		<div class="daterange">
			<input type="date" on:input={ (e) => setFromDate(e.target.value) }>
			<input type="time" value={fromTime}
						 on:input={ (e) => setFromTime(e.target.value) }>
			to:
			<input type="date" on:input={ (e) => setToDate(e.target.value) }>
			<input type="time" value={toTime}
						 on:input={ (e) => setToTime(e.target.value) }>
			{#if invalidRange}<br><small class="invalidrange">invalid range</small>{/if}
		</div>
	{/if}
</div>

<style>
	.selectBox {
		margin-bottom: 5px;
	}
	.daterange {
		display: inline-block;
		vertical-align: top;
	}
	.invalidrange {
		color: var(--error);
	}
</style>
