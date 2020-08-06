<script>
	import moment from 'moment';
	import Login from './Login.svelte';
	import Logout from './Logout.svelte';
	import Logging from './Logging.svelte';
	import { loggedIn } from './resources/auth.js';

	let _loggedIn = loggedIn();

	const dateFormat = 'ddd, MMM D, YYYY - HH:mm:ss';
	let date;
	function clockTick() {
		date = moment().format(dateFormat);
	}
	clockTick();
	setInterval(clockTick, 1000);
</script>

<div class="wrapper">
	<header>
		<small class="appname">pipolog</small><small class="clock">{date}</small>
		{#if _loggedIn}
			<Logout on:logout={ () => _loggedIn = loggedIn() } />
		{:else}
			<div class="spacer"></div>
		{/if}
	</header>
	<main>
		{#if !_loggedIn}
			<Login on:login={ () => _loggedIn = loggedIn() } />
		{:else}
			<div class="content-wrapper">
				<Logging on:loggedout={ () => _loggedIn = loggedIn() } />
			</div>
		{/if}
	</main>
</div>

<style>
	:global(body) {
		--header-background-color: rgb(40, 40, 80);
		--login-background-color: rgb(40, 40, 80);
		--main-background-color: rgb(30, 30, 40);
		--main-text-color: #eee;
		--main-text-color-low-emph: rgb(160, 160, 160);
		--pre-text-color: #ccc;
		--hline-color: rgb(120, 120, 220);
		--focus: rgb(120, 120, 220);
		--error: rgb(240, 110, 100);

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
		height: 25px;
		background-color: var(--header-background-color);
		display: flex;
		justify-content: space-between;
		border-bottom: 2px solid var(--hline-color);
	}
	.content-wrapper {
		padding-left: 10px;
		padding-right: 10px;
	}
	.appname {
		margin: 3px 0 3px 10px;
		font-weight: bold;
	}
	.clock {
		margin: 3px 0 3px 0;
	}
	.spacer {
		width: 60px;
	}
</style>
