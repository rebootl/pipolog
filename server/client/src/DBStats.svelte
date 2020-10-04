<script>
	import moment from 'moment';
	import PlotlyLineGraph from './PlotlyLineGraph.svelte';
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
		// legend
		const legendData = collectedStats.map((o) => o.timestamp);

		// number of objects data
    const od = collectedStats.map((o) => o.objects);
		objectsData = [{
			y: od,
			x: legendData,
			line: {
    		color: '#ff77bb'
			},
		}];

		// data size data
    const dsd = collectedStats.map((o) => o.dataSize);
		dataSizeData = [{
			y: dsd,
			x: legendData,
			line: {
				color: '#ff77bb'
			},
		}];

		// storage size data
		const ssd = collectedStats.map((o) => o.storageSize);
    storageSizeData = [{
			y: ssd,
			x: legendData,
			line: {
				color: '#ff77bb'
			},
		}];
  }

  onMount(async () => {
    await getCollectedStats();
    genData();
  });
  //init();
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
	<PlotlyLineGraph name="nobjects-graph"
									 data={ objectsData }
									 title={"<b>No. of Entries</b>"} />

 	<PlotlyLineGraph name="datasize-graph"
									 data={ dataSizeData }
									 title={"<b>Data Size (MB)</b>"} />

  <PlotlyLineGraph name="storagesize-graph"
									 data={ storageSizeData }
									 title={"<b>Storage Size (MB)</b>"} />
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
