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
  const data = JSON.parse(uploadedJson);
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
document.querySelector("#btn-showName").addEventListener("click", function () {
  if (geneLabelIsHidden) {
    geneLabelsAll.forEach((geneLabel) => {
      geneLabel.style.display = "flex";
    });
    geneLabelIsHidden = false;
    this.textContent = "Hide all labels";
  } else {
    geneLabelsAll.forEach((geneLabel) => {
      geneLabel.style.display = "none";
    });
    geneLabelIsHidden = true;
    this.textContent = "Show all labels";
  }
});
