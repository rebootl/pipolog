<script>
	import moment from 'moment';
	import { createEventDispatcher } from 'svelte';
	import Nav from './Nav.svelte';
	import DateSelector from './DateSelector.svelte';
	import LogEntries from './LogEntries.svelte';
	import { apiGetRequest } from './resources/requests.js';
	import { logout } from './resources/auth.js';
	import { logdataURL } from './resources/urls.js';

	const dispatch = createEventDispatcher();

	const dateFormat = 'ddd, MMM D, YYYY - HH:mm:ss';

	let entries = [];
	let hosts = [];
	let streams = [];

	let finterval;		// function
	let updated;			// date
	let updating = false;
	let compactView = false;

	let filterHost = '';
	let filterStream = '';
	let dateObject = { type: 'any', limit: 20 };
	let reverse = true;
	let batchSize = 20;

	function calcOffsetDate(offset) {
		return moment().subtract(offset, 'hour').toISOString();
	}

	// get data

	async function getEntries(skip) {
		updating = true;
		let p = {
			host: filterHost,
			stream: filterStream,
			reverse: reverse,
			limit: batchSize
		};
		if (skip) p.skip = skip;
	 	if (dateObject.type === 'rel')
			p.from = calcOffsetDate(dateObject.offset);
		else if (dateObject.type === 'abs')
			p = { ...p, from: dateObject.from, to: dateObject.to }
		// debug
		//console.log(p)
		const r = await apiGetRequest(logdataURL, p);
		if (!r.success) {
			console.error(r)
		 	entries = [];
			if (r.error.status === 401) {
				// set interface to logged out
				localStorage.removeItem('username');
				setUpdate(0);
				dispatch('loggedout');
			}
			return;
		}
		if (skip) entries = [ ...entries, ...r.result ];
		else entries = r.result;
		updated = moment().format(dateFormat);
		updating = false;
	}
	getEntries(0);

	async function getHosts() {
		const r = await apiGetRequest(logdataURL + '/hosts', {});
		if (!r.success) {
			console.error(r)
		 	hosts = [];
		}
		hosts = r.result;
	}
	getHosts();

	async function getStreams() {
		const r = await apiGetRequest(logdataURL + '/streams', {});
		if (!r.success) {
			console.error(r)
		 	streams = [];
		}
		streams = r.result;
	}
	getStreams();

	// "setters"

	function setUpdate(t) {
		if (finterval) clearInterval(finterval);
		if (t === 0) return;
		finterval = setInterval(getEntries, t * 1000);
	}
	setUpdate(15)

	function setDateObject(v) {
		dateObject = v;
		getEntries();
	}

	function setReverse(v) {
		reverse = v;
		getEntries();
	}

	function setFilterHost(v) {
		filterHost = v;
		getEntries();
	}

	function setFilterStream(v) {
		filterStream = v;
		getEntries();
	}

	function setBatchSize(v) {
		batchSize = v;
		getEntries();
	}

</script>

<div class="updatedBox">
	<small>Updated: {updated} {#if updating}refreshing...{/if}</small>
</div>
<h3>Logging</h3>
<div class="selectBox">
	Update Interval:
	<select on:change={ (e) => setUpdate(parseInt(e.target.value)) }>
		<option value="1">1s</option>
		<option value="5">5s</option>
		<option value="15" selected>15s</option>
		<option value="30">30s</option>
		<option value="60">1min</option>
		<option value="300">5min</option>
		<option value="0">Never</option>
	</select>
	<button on:click={ () => getEntries() }>Update Now</button>
</div>
<div class="selectBox">
	Batch Size:
	<select on:change={ (e) => setBatchSize(parseInt(e.target.value)) }>
		<option value="20">20</option>
		<option value="50" selected>50</option>
		<option value="100">100</option>
		<option value="200">200</option>
		<option value="500">500</option>
	</select>
</div>
<div class="selectBox">
	<DateSelector on:change={ (e) => setDateObject(e.detail) } />
</div>
<div class="selectBox">
	Reverse:
	<input type="checkbox" checked
				 on:change={ (e) => setReverse(e.target.checked) }>
</div>
<div class="selectBox">
	Host:
	<select on:change={ (e) => setFilterHost(e.target.value) }>
		<option value="">any</option>
		{#each hosts as h}
		<option value="{h}">{h}</option>
		{/each}
	</select>
</div>
<div class="selectBox">
	Stream:
	<select on:change={ (e) => setFilterStream(e.target.value) }>
		<option value="">any</option>
		{#each streams as h}
		<option value="{h}">{h}</option>
		{/each}
	</select>
</div>
<div class="selectBox">
	Compact View:
	<input type="checkbox" on:change={ (e) => compactView = e.target.checked }>
</div>

<LogEntries on:fetch={ () => getEntries(entries.length) }
						{entries} {compactView} />

<style>
	.updatedBox {
		display: flex;
		justify-content: center;
		margin-top: 5px;
		color: var(--main-text-color-low-emph);
	}
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
