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
	let rtimeData = [];
	let rperfData = [];
	let wperfData = [];

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

	function getLegendArray(data, keyname) {
		const a = []
		for (let o of data) {
			if (o[keyname]) a.push(o.timestamp);
		}
		return a;
	}

	function getDataArray(data, keyname) {
		const a = [];
		for (let o of collectedStats) {
			if (o[keyname]) a.push(o[keyname]);
		}
		return a;
	}

	function getPerformanceArray(data, keyname) {
		const a = [];
		for (let o of collectedStats) {
			if (o.perf)
				a.push(o.perf[keyname]);
		}
		return a;
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

		// read time measurement data
		// backwards compatible legends
		const rtimeLegend = getLegendArray(collectedStats, 'rtime');
		const rtd = getDataArray(collectedStats, 'rtime');
		rtimeData = [{
			y: rtd,
			x: rtimeLegend,
			line: {
				color: '#88aaff'
			},
		}];

		const perfLegend = getLegendArray(collectedStats, 'perf')
		const rb1 = getPerformanceArray(
			collectedStats,
			'operation read latency histogram (bucket 1) - 100-249us'
		);
		const rb2 = getPerformanceArray(
			collectedStats,
			'operation read latency histogram (bucket 2) - 250-499us'
		);
		const rb3 = getPerformanceArray(
			collectedStats,
			'operation read latency histogram (bucket 3) - 500-999us'
		);
		const rb4 = getPerformanceArray(
			collectedStats,
			'operation read latency histogram (bucket 4) - 1000-9999us'
		);
		const rb5 = getPerformanceArray(
			collectedStats,
			'operation read latency histogram (bucket 5) - 10000us+'
		);
		rperfData = [
			{
				name: '100-249us',
				y: rb1,
				x: perfLegend,
				line: {
					color: '#33bb55'
				}
			},
			{
				name: '250-499us',
				y: rb2,
				x: perfLegend,
				line: {
					color: '#dddd33'
				}
			},
			{
				name: '500-999us',
				y: rb3,
				x: perfLegend,
				line: {
					color: '#dd9922'
				}
			},
			{
				name: '1000-9999us',
				y: rb4,
				x: perfLegend,
				line: {
					color: '#ff3322'
				}
			},
			{
				name: '10000us+',
				y: rb5,
				x: perfLegend,
				line: {
					color: '#dd33ee'
				}
			},
		]

		const wb1 = getPerformanceArray(
			collectedStats,
			'operation write latency histogram (bucket 1) - 100-249us'
		);
		const wb2 = getPerformanceArray(
			collectedStats,
			'operation write latency histogram (bucket 2) - 250-499us'
		);
		const wb3 = getPerformanceArray(
			collectedStats,
			'operation write latency histogram (bucket 3) - 500-999us'
		);
		const wb4 = getPerformanceArray(
			collectedStats,
			'operation write latency histogram (bucket 4) - 1000-9999us'
		);
		const wb5 = getPerformanceArray(
			collectedStats,
			'operation write latency histogram (bucket 5) - 10000us+'
		);
		wperfData = [
			{
				name: '100-249us',
				y: wb1,
				x: perfLegend,
				line: {
					color: '#33bb55'
				}
			},
			{
				name: '250-499us',
				y: wb2,
				x: perfLegend,
				line: {
					color: '#dddd33'
				}
			},
			{
				name: '500-999us',
				y: wb3,
				x: perfLegend,
				line: {
					color: '#dd9922'
				}
			},
			{
				name: '1000-9999us',
				y: wb4,
				x: perfLegend,
				line: {
					color: '#ff3322'
				}
			},
			{
				name: '10000us+',
				y: wb5,
				x: perfLegend,
				line: {
					color: '#dd33ee'
				}
			},
		]
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

	<PlotlyLineGraph name="rtime-graph"
									 data={ rtimeData }
									 title={"<b>Read Time Measurement (ms)</b>"} />

  <PlotlyLineGraph name="rperf-graph"
 									 data={ rperfData }
 									 title={"<b>OP read latency buckets</b>"} />

	<PlotlyLineGraph name="wperf-graph"
									 data={ wperfData }
									 title={"<b>OP write latency buckets</b>"} />
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
