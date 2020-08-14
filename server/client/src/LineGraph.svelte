<script>
  export let title = "Graph";
  export let data = [ 10, 5, 7, 8, -2, 6 ];
  export let gridIntervalY = 1;
  export let ymax = 12;
  export let ymin = -3;
  export let oversizeFraction = 0;
  export let xLabels = [ 'A', 'B', 'C' ];

  export let graphColor = "#ff77bb";
  export let gridColor = "#446";
  export let labelColor = "#ddd";

  export const height = 200;
  export const width = 400;

  const xOffset = 40;
  const yOffset = 25;
  const xOffsetEnd = 30;
  const yOffsetTop = 20;

  let yrange;
  let scalefactor;

  let path;
  let gridLineHeights = [];
  let xAxisHeight;
  let xAxisOffset;
  let labelsX = [];

  $: update(data);

  function calcLayout() {
    if (oversizeFraction) {
      ymax = Math.max(...data) * oversizeFraction;
      let min = Math.min(...data);
      if (min < 0) ymin = min * oversizeFraction;
      else {
        // prevent warning output
        if (min !== Infinity)
          ymin = min * (1 / oversizeFraction);
      }
    }

    yrange = ymax - ymin;
    scalefactor = (height - yOffset - yOffsetTop) / yrange;
  }

  function getDrawHeight(s) {
    return height - (s * scalefactor) - xAxisOffset - yOffset;
  }

  function updateGrid() {
    xAxisOffset = -1 * ymin * scalefactor;
    xAxisHeight = height - xAxisOffset - yOffset;

    const n = ymin + (gridIntervalY - Math.abs(ymin) % gridIntervalY) //- gridIntervalY;
    let c = 0;
    if (ymin < 0 && ymax > 0) {
      c = n / gridIntervalY;
    }
    const g = [];
    for (let s = n; s < ymax; s += gridIntervalY) {
      g.push({ y: getDrawHeight(s), value: s, count: c });
      c++;
    }
    gridLineHeights = g;
  }

  function calcPoints() {
    const xInterval = (width - xOffset - xOffsetEnd)  / (data.length - 1);
    let s = 0 - xInterval;
    const points = [];
    for (const py of data) {
      s += xInterval;
      const _py = height - (scalefactor * py);
      points.push({ x: s + xOffset, y: _py - xAxisOffset - yOffset });
    }
    return points;
  }

  function updatePath(points) {
    let path = "";
    for (const p of points) {
      path += p.x + "," + p.y + " ";
    }
    return path;
  }

  function updateLabelsX() {
    const labels = [];
    const xInterval = (width - xOffset - xOffsetEnd) / (xLabels.length - 1);
    let s = xOffset;
    for (const l of xLabels) {
      labels.push({
        x: s,
        value: l
      });
      s += xInterval;
    }
    labelsX = labels;
  }

  function update() {
    calcLayout();
    updateGrid();
    const points = calcPoints();
    path = updatePath(points);
    updateLabelsX();
  }
</script>

<div class="box">
  <strong>{ title }</strong>
  <svg viewbox="0 0 { width } { height }">
    {#each gridLineHeights as h}
      <line x1={ xOffset } y1={ h.y }
            x2={ width - xOffsetEnd } y2={ h.y } stroke={ gridColor }
            stroke-width="1" stroke-dasharray="2" />
    {/each}
    <!-- y-axis -->
    <line x1={ xOffset } y1={ height - yOffset }
          x2={ xOffset } y2={ 0 + yOffsetTop } stroke={ gridColor } />
    <!-- x-axis -->
    <line x1={ xOffset } y1={ xAxisHeight }
          x2={ width - xOffsetEnd } y2={ xAxisHeight } stroke={ gridColor } />
    <!-- bottom line -->
    <line x1={ xOffset } y1={ height - yOffset }
          x2={ width - xOffsetEnd } y2={ height - yOffset } stroke={ gridColor } />
    <!-- end line -->
    <line x1={ width - xOffsetEnd } y1={ height - yOffset }
          x2={ width - xOffsetEnd } y2={ 0 + yOffsetTop } stroke={ gridColor } />
    <!-- top line -->
    <line x1={ xOffset } y1={ yOffsetTop }
          x2={ width - xOffsetEnd } y2={ yOffsetTop } stroke={ gridColor } />
    <!-- graph -->
    <polyline points={ path }
              style="stroke:{ graphColor };fill:none;stroke-width:2px;" />
    {#each gridLineHeights as l}
      {#if !(l.count % 2)}
        <text class="axislabel" text-anchor="end"
              style="fill:{ labelColor }"
              x={ xOffset - 5 } y={ l.y }>{ l.value }</text>
      {/if}
    {/each}
    {#each labelsX as l}
      <text class="axislabel" text-anchor="middle"
            style="fill:{ labelColor }"
            x={ l.x } y={ height - yOffset + 12 }>{ l.value }</text>
    {/each}
  </svg>
</div>

<style>
  .axislabel {
    font-size: 8px;
    font-family: sans-serif;
    font-weight: normal;
  }
</style>
