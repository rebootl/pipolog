<script>
  export let title = "Data";
  export let yrange = 20;
  let data = [ 10, 5, 7, 8, 3, 6 ];

  function calcPoints() {
    const xInterval = 400 / (data.length - 1);
    let s = 0 - xInterval;
    const points = [];
    for (const py of data) {
      s += xInterval;
      const _py = 200 - (200 / yrange * py);
      points.push({ x: s, y: _py });
    }
    console.log(points);
    return points;
  }
  const points = calcPoints();

  function genGridData() {
    const interval = 200 / 5;
    let s = 0;
    for (const x of [1,2,3,4,5]) {
      s += interval
      lineHeights.push(s);
    }
  }
  let lineHeights = [];
  genGridData();

  function genPath(points) {
    let path = "";
    for (const p of points) {
      path += p.x + "," + p.y + " ";
    }
    console.log(path)
    return path;
  }
  let path = genPath(points);

</script>

<div class="box">
  <strong>{ title }</strong>
  <svg viewbox="0 0 400 200" width="400px">
    {#each lineHeights as h}
      <line x1="0" y1="{h}" x2="400" y2="{h}" stroke="#333"
            stroke-width="1" stroke-dasharray="5" />
    {/each}
    <polyline points="{path}"
          style="stroke:#ff77bb;fill:none;stroke-width:2px;" />
  </svg>
</div>

<style>
  .box {
    height: 200px;
    width: 400px;
  }
  svg {
    border: 1px solid #333;
  }
</style>
