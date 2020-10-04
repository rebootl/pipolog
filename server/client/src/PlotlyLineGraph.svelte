<script>
	//import Plotly from 'plotly.js-dist';
  // leads to TypeError: this is undefined
  // importing via cdn work
  import { onMount } from 'svelte';

  export let name = "default-graph-unique-name"
  export let data = [{
    x: [ 1, 2, 3, 4, 5 ],
    y: [ 1, 2, 3, 4, 5 ]
  }];
  export let title = "This is my graph.";

  const graphLayout = {
		plot_bgcolor: 'rgba(0, 0, 0, 0)',
		paper_bgcolor: 'rgba(0, 0, 0, 0)',
		font: {
			color: '#eee',
		 },
		yaxis: {
			title: '',
			gridcolor: '#333',
			linecolor: '#555',
			tickfont: {
				color: '#bbb'
			}
		},
		xaxis: {
			title: '',
			gridcolor: '#333',
			linecolor: '#555',
			tickfont: {
				color: '#bbb'
			}
		},
		margin: {
	 		l: 50,
	 		r: 50,
	 		b: 50,
	 		t: 50,
	 	}
 	};

  $: update(data);

  function update() {
    //console.log(data)
    const t = document.querySelector('#' + name);
    //console.log(t)
    if (!t) return;
	  Plotly.newPlot(t, data, { ...graphLayout, title }, {staticPlot: true});
  }

  onMount(() => {
    //update();
  });
</script>

<div id={ name } style="width:400px;height:250px;"></div>

<style>

</style>
