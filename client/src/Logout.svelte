<script>
  import { createEventDispatcher } from 'svelte';
  import { logout } from './resources/auth.js';

  const dispatch = createEventDispatcher();

  async function _logout() {
    if (!confirm("Logout?"));
      return;
    const r = await logout();
    if (r.success) dispatch('logout');
  }
</script>

<button title="Logout"
        on:click={ () => _logout() }>
  <svg viewbox="0 0 100 100">
    <path d="M 55,15 L 10,15 L 10,85 L 55,85"
          style="stroke:currentColor;fill:none;stroke-width:12px;" />
    <line x1="30" y1="50" x2="70" y2="50" stroke="currentColor" stroke-width="12" />
    <polygon points="95,50 65,30 65,70" fill="currentColor" />
  </svg>
</button>

<style>
  button {
    z-index: 100;
    padding: 0;
    padding-top: 4px;
    border: 0;
    box-sizing: border-box;
    border: 2px solid var(--hline-color);
    /*font-size: 100%;
    font-family: inherit;*/
    margin-top: 5px;
    width: 40px;
    height: 40px;
    background-color: inherit;
    color: inherit;
  }
  button:hover {
    background-color: var(--focus);
  }
  svg {
    width: 20px;
  }
</style>
