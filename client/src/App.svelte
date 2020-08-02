<script>
	import moment from 'moment';

	import Logging from './Logging.svelte';
	//import { loggedIn } from './resources/auth.js';

	const dateFormat = 'ddd, MMM D, YYYY - HH:mm:ss';
	let date;
	function clockTick() {
		date = moment().format(dateFormat);
	}
	clockTick();
	setInterval(clockTick, 1000);
</script>

<div class="wrapper">
	<header><small class="appname">pipolog</small><small class="clock">{date}</small><div></div></header>
	<main>
		<Logging />
	</main>
</div>

<style>
	:global(body) {
		--header-background-color: rgb(40, 40, 80);
		--main-background-color: rgb(30, 30, 40);
		--main-text-color: #eee;
		--main-text-color-low-emph: rgb(160, 160, 160);
		--pre-text-color: #ccc;
		--hline-color: rgb(120, 120, 220);
		--error: rgb(220, 120, 120);

		margin: 0;
		background-color: var(--main-background-color);
		color: var(--main-text-color);
		font-family: sans-serif;
	}
	.wrapper {
		display: flex;
		flex-flow: column;
	}
	header {
		background-color: var(--header-background-color);
		display: flex;
		justify-content: space-between;
		border-bottom: 2px solid var(--hline-color);
		/*height: 20px;*/
	}
	main {
		padding-left: 10px;
		padding-right: 10px;
	}
	.appname {
		margin: 3px 0 3px 10px;
		font-weight: bold;
	}
	.clock {
		margin: 3px 20px 3px 0;
	}
</style>
