<script>
  import { onMount } from 'svelte';
  import LineGraph from './LineGraph.svelte';
	import { apiGetRequest } from './resources/requests.js';
	import { dbstatsURL } from './resources/urls.js';

  let stats = {};
  let statsData = [];
  let collectedStats = [];

  let objectsData = [];

  async function getBasicStats() {
    const r = await apiGetRequest(dbstatsURL, {});
    if (!r.success) {
      console.error(r)
      stats = [];
    }
    stats = r.result;
  }
  getBasicStats();

  async function getCollectedStats() {
    const r = await apiGetRequest(dbstatsURL + '/collected');
    if (!r.success) {
      console.error(r)
      collectedStats = [];
    }
    collectedStats = r.result;
  }
  getCollectedStats();

  async function genObjectData() {
    objectsData = collectedStats.map((o) => o.objects);
    console.log(objectsData)
  }
  genObjectData();

</script>

<h3>Database Stats</h3>

<small>
  <table>
    <tr>
      <th>No. of Entries:</th>
      <td>{ stats.objects }</td>
      <td></td>
    </tr>
    <tr>
      <th>Data Size:</th>
      <td>{ Math.round(stats.dataSize * 10) / 10 }</td>
      <td>MB</td>
    </tr>
    <tr>
      <th>Storage Size:</th>
      <td>{ Math.round(stats.storageSize * 10) / 10 }</td>
      <td>MB</td>
    </tr>
    <tr>
      <th>Server Free Space:</th>
      <td>{ Math.round(stats.fsTotalSize - stats.fsUsedSize) / 1000 }</td>
      <td>GB</td>
    </tr>
  </table>
</small>

<LineGraph title={"No. of Objects"} yrange={12} data={objectsData} />

<style>
  .label {
    color: var(--main-text-color-low-emph);
  }
  table {
    /*border: 1px solid var(--hline-color);*/
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  table th, td {
    padding: 5px;
    border: 1px solid #555;
  }
</style>
