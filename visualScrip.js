// Script of the clustermap chart ( div #plot)
const chart = ClusterMap.ClusterMap().config({
  cluster: {
    alignLabels: false,
  },
  gene: {
    label: {
      show: false,
      onClick: null,
    },
  },
  link: {
    threshold: 0.3,
    bestOnly: true,
  },
});
// SVG saver button Script
function serialise(svg) {
  /* Saves the figure to SVG in its current state.
   * Clones the provided SVG and sets the width/height of the clone to the
   * bounding box of the original SVG. Thus, downloaded figures will be sized
   * correctly.
   * This function returns a new Blob, which can then be downloaded.
   */
  let node = svg.node();
  const xmlns = "http://www.w3.org/2000/xmlns/";
  const xlinkns = "http://www.w3.org/1999/xlink";
  const svgns = "http://www.w3.org/2000/svg";
  const bbox = svg.select("g").node().getBBox();

  node = node.cloneNode(true);
  node.setAttribute("width", bbox.width);
  node.setAttribute("height", bbox.height);
  node.setAttributeNS(xmlns, "xmlns", svgns);
  node.setAttributeNS(xmlns, "xmlns:xlink", xlinkns);

  // Adjust x/y of <g> to account for axis/title position.
  // Replaces the transform attribute, so drag/zoom is ignored.
  d3.select(node)
    .select("g")
    .attr("transform", `translate(${Math.abs(bbox.x)}, ${Math.abs(bbox.y)})`);

  const serializer = new window.XMLSerializer();
  const string = serializer.serializeToString(node);
  return new Blob([string], { type: "image/svg+xml" });
}

function download(blob, filename) {
  /* Downloads a given blob to filename.
   * This function appends a new anchor to the document, which points to the
   * supplied blob. The anchor.click() method is called to trigger the download,
   * then the anchor is removed.
   */
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const div = d3.select("#plot");
let svg = div.select("svg");
d3.select("#btn-save-svg").on("click", () => {
  const blob = serialise(svg);
  download(blob, "clinker.svg");
});

// Checks for the uploaded JSON in localStorage
// If input-json is found, visualizes the chart (and can download svg)
const uploadedJson = localStorage.getItem("uploadedJson");
if (uploadedJson) {
  var data = JSON.parse(uploadedJson);
  div.selectAll("div").data([data]).join("div").call(chart);

  //d3.json("testing.json").then((data) => {
  //div.selectAll("div").data([data]).join("div").call(chart);

  let svg = div.select("svg");
  d3.select("#btn-save-svg").on("click", () => {
    const blob = serialise(svg);
    download(blob, "clinker.svg");
  });
}

// Small infobox with label onhover
document.querySelectorAll(".gene").forEach(function (geneBox) {
  geneBox.addEventListener("mouseenter", function () {
    var geneBoxID = geneBox.id;
    var geneLabelBox = document
      .getElementById(geneBoxID)
      .querySelector(".geneLabel");
    geneLabelBox.style.display = "flex";
  });
  geneBox.addEventListener("mouseleave", function () {
    var geneBoxID = geneBox.id;
    var geneLabelBox = document
      .getElementById(geneBoxID)
      .querySelector(".geneLabel");
    geneLabelBox.style.display = "none";
  });
});

//Toolbox Script
document.querySelectorAll(".toolbox-min-btns").forEach(function (button) {
  button.addEventListener("click", function () {
    var body = this.parentNode.nextElementSibling;
    if (body.style.display === "none") {
      body.style.display = "flex";
      this.textContent = "—";
    } else {
      body.style.display = "none";
      this.textContent = "+";
    }
  });
});

// Show/Hide all labels button
const geneLabelsAll = document.querySelectorAll(".geneLabel");
var geneLabelIsHidden = true;
for (const geneLabel of geneLabelsAll) {
  if (geneLabel.style.display === "none") {
    geneLabelIsHidden = true;
  } else {
    geneLabelIsHidden = false;
  }
}

// clinker script
var plot = d3.select("#plot")
		.data([data])
    .call(chart)

function update(opts) {
  chart.config(opts) 
  plot.call(chart)
}
let labelTypes = new Set()
// data.clusters.forEach(cluster => {
//   cluster.loci.forEach(locus => {
//     locus.genes.forEach(gene => Object.keys(gene.names).forEach(type => labelTypes.add(type)))
//   })
// })
const changeLabel = event => {
  const type = event.target.value
  d3.selectAll("text.geneLabel")
    .each(d => d.label = d.names[type] ? d.names[type] : d.label)
  update({})
}
let select = d3.select("#select-label-type")
  .on("change", changeLabel)
select.selectAll("option")
  .data(labelTypes)
  .join("option")
  .attr("value", d => d)
  .text(d => d)

// Figure layout
d3.select("#input-scale-factor")
  .on("change", function() {update({plot: {scaleFactor: +this.value}})})
d3.select("#input-cluster-spacing")
  .on("change", function() {update({cluster: {spacing: +this.value}})})
d3.select("#input-scale-genes")
  .on("change", function() {update({plot: {scaleGenes: d3.select(this).property("checked")}})})

// Cluster
d3.select("#input-cluster-align-labels")
  .on("change", function() {update({cluster: {alignLabels: d3.select(this).property("checked")}})})
d3.select("#input-cluster-hide-coords")
  .on("change", function() {update({cluster: {hideLocusCoordinates: d3.select(this).property("checked")}})})
d3.select("#input-cluster-name-size")
  .on("change", function() {update({cluster: {nameFontSize: +this.value}})})
d3.select("#input-locus-name-size")
  .on("change", function() {update({cluster: {lociFontSize: +this.value}})})
d3.select("#input-locus-spacing")
  .on("change", function() {update({locus: {spacing: +this.value}})})

// Gene polygon shape
d3.select("#input-body-height")
  .on("change", function() {update({gene: {shape: {bodyHeight: +this.value}}})})
d3.select("#input-tip-height")
  .on("change", function() {update({gene: {shape: {tipHeight: +this.value}}})})
d3.select("#input-tip-length")
  .on("change", function() {update({gene: {shape: {tipLength: +this.value}}})})
d3.select("#input-gene-stroke-colour")
  .on("change", function() {update({gene: {shape: {stroke: this.value}}})})
d3.select("#input-gene-stroke-width")
  .on("change", function() {update({gene: {shape: {strokeWidth: +this.value}}})})

// Gene labels
d3.select("#input-gene-labels")
  .on("change", function() {update({gene: {label: {show: d3.select(this).property("checked")}}})})
d3.select("#input-label-rotation")
  .on("change", function() {update({gene: {label: {rotation: +this.value}}})})
d3.select("#input-label-start")
  .on("change", function() {update({gene: {label: {start: +this.value}}})})
d3.select("#select-label-anchor")
  .on("change", function() {update({gene: {label: {anchor: this.value}}})})
d3.select("#input-label-size")
  .on("change", function() {update({gene: {label: {fontSize: +this.value}}})})
d3.select("#input-label-spacing")
  .on("change", function() {update({gene: {label: {spacing: +this.value}}})})
d3.select("#select-label-position")
  .on("change", function() {update({gene: {label: {position: this.value}}})})

// Scale bar
d3.select("#input-scalebar-fontsize")
  .on("change", function() {update({scaleBar: {fontSize: +this.value}})})
d3.select("#input-scalebar-height")
  .on("change", function() {update({scaleBar: {height: +this.value}})})
d3.select("#input-scalebar-basepair")
  .on("change", function() {update({scaleBar: {basePair: +this.value}})})
d3.select("#input-scalebar-margin-top")
  .on("change", function() {update({scaleBar: {marginTop: +this.value}})})

// Colour bar
d3.select("#input-colourbar-fontsize")
  .on("change", function() {update({colourBar: {fontSize: +this.value}})})
d3.select("#input-colourbar-height")
  .on("change", function() {update({colourBar: {height: +this.value}})})
d3.select("#input-colourbar-margin-top")
  .on("change", function() {update({colourBar: {marginTop: +this.value}})})

// Legend
d3.select("#input-legend-fontsize")
  .on("change", function() {update({legend: {fontSize: +this.value}})})
d3.select("#input-legend-entryheight")
  .on("change", function() {update({legend: {entryHeight: +this.value}})})
d3.select("#input-legend-margin-left")
  .on("change", function() {update({legend: {marginLeft: +this.value}})})

// Links
d3.select("#input-link-show")
  .on("change", function() {update({link: {show: d3.select(this).property("checked")}})})
d3.select("#input-link-best-only")
  .on("change", function() {update({link: {bestOnly: d3.select(this).property("checked")}})})
d3.select("#input-link-as-line")
  .on("change", function() {update({link: {asLine: d3.select(this).property("checked")}})})
d3.select("#input-link-straight")
  .on("change", function() {update({link: {straight: d3.select(this).property("checked")}})})
d3.select("#input-link-group-colour")
  .on("change", function() {update({link: {groupColour: d3.select(this).property("checked")}})})
d3.select("#input-link-stroke-width")
  .on("change", function() {update({link: {strokeWidth: +this.value}})})
d3.select("#input-link-threshold")
  .on("change", function() {update({link: {threshold: +this.value}})})
d3.select("#input-link-fontsize")
  .on("change", function() {update({link: {label: {fontSize: +this.value}}})})
d3.select("#input-link-label-pos")
  .on("change", function() {update({link: {label: {position: +this.value}}})})
d3.select("#input-link-label-show")
  .on("change", function() {update({link: {label: {show: d3.select(this).property("checked")}}})})
d3.select("#input-link-labelbg-show")
  .on("change", function() {update({link: {label: {background: d3.select(this).property("checked")}}})})
