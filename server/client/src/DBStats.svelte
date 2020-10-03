<script>
	import moment from 'moment';
  import { onMount } from 'svelte';
  import LineGraph from './LineGraph.svelte';
	import { apiGetRequest } from './resources/requests.js';
	import { dbstatsURL } from './resources/urls.js';

  const dateFormat = 'YYYY-MM-DD HH:mm';

  let stats = {};
  let statsData = [];
  let collectedStats = [];

  let objectsData = [];
  let dataSizeData = [];
  let storageSizeData = [];
  let dateStart = "";
  let dateEnd = "";

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

  async function genData() {
    objectsData = collectedStats.map((o) => o.objects);
    dataSizeData = collectedStats.map((o) => o.dataSize);
    storageSizeData = collectedStats.map((o) => o.storageSize);
    //console.log(objectsData)
    console.log(objectsData[objectsData.length - 1])
    dateStart = moment(collectedStats[collectedStats.length - 1].timestamp)
      .format(dateFormat);
    dateEnd = moment(collectedStats[0].timestamp).format(dateFormat);
  }

  async function init() {
    await getCollectedStats();
    genData();
  }
  init();
</script>

<h3>Database Stats</h3>

<div class="statsbox">
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
</div>

<div class="flexwrap">
  <div class="graphbox">
    <LineGraph title={ "No. of Objects" }
               gridIntervalY={ 10000 }
               data={ objectsData.reverse() }
               xLabels={[ dateStart, dateEnd ]}
               oversizeFraction={ 1.2 } />
  </div>
  <div class="graphbox">
    <LineGraph title={ "Data Size (MB)" }
               gridIntervalY={ 10 }
               data={ dataSizeData.reverse() }
               xLabels={[ dateStart, dateEnd ]}
               ymin={ 0 } ymax={ 200 } />
  </div>
  <div class="graphbox">
    <LineGraph title={ "Storage Size (MB)" }
               gridIntervalY={ 10 }
               data={ storageSizeData.reverse() }
               xLabels={[ dateStart, dateEnd ]}
               ymin={ 0 } ymax={ 150 } />
  </div>
</div>

<style>
  table {
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  table th, td {
    padding: 5px;
    border: 1px solid #555;
  }
  .flexwrap {
    display: flex;
    flex-wrap: wrap;
  }
  .graphbox {
    max-width: 400px;
  }
</style>
