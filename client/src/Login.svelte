<script>
  import { createEventDispatcher } from 'svelte';
  import { login } from './resources/auth.js';

  const dispatch = createEventDispatcher();

  let username = "";
	let password = "";
	let loginFailed = false;
	let failedMessage = "";

  async function _login() {
		if (username === "" || password === "") {
			failedMessage = "u need username and pw...";
			loginFailed = true;
			return;
		}
		const r = await login(username, password);
		if (r.success) {
			dispatch('login');
		}
		else {
			if (r.error.code === "EFETCH")
				failedMessage = "Error fetching resource, check conn pls...";
			else failedMessage = "Oops, login failed :(...";
			loginFailed = true;
		}
	}
</script>

<div class="wrapper">
  <input type="text" placeholder="Login..."
         on:input={ (e) => username = e.target.value }>
  <input type="password" placeholder="Password..."
         on:input={ (e) => password = e.target.value }>
  <button on:click={ (e) => _login() }>Login</button>
  {#if loginFailed}<small class="fail">{failedMessage}</small>{/if}
</div>

<style>
  .wrapper {
    background-color: var(--login-background-color);
    height: calc(100vh - 25px);
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }
  input {
    margin-bottom: 10px;
    max-width: 200px;
  }
  .fail {
    margin-top: 7px;
    color: var(--error);
  }
</style>
