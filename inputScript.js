// Input-Page Script

// "Visualize" Button to open a new tab with clsutermap chart for selected file
document.getElementById("visual-btn").addEventListener("click", function () {
  window.open("visualization.html", "_blank");
});

document
  .getElementById("file-input")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const content = e.target.result;
        try {
          const json = JSON.parse(content);
          document.getElementById("file-content").textContent = JSON.stringify(
            json,
            null,
            2
          );
          localStorage.setItem("uploadedJson", JSON.stringify(json));
        } catch (err) {
          document.getElementById("file-content").textContent =
            "Invalid JSON file";
        }
      };
      reader.readAsText(file);
    }
  });
