$(document).ready(function () {
  const selectedFiles = [];

  $("#fileInput").on("change", function () {
    const files = Array.from(this.files);
    selectedFiles.length = 0;
    selectedFiles.push(...files);

    renderFileList();
  });

  function renderFileList() {
    const container = $("#filePreviewContainer");
    container.empty();

    if (selectedFiles.length === 0) {
      container.hide();
      return;
    }

    container.show();
    selectedFiles.forEach((file, index) => {
      const fileItem = $(`
      <div class="d-flex justify-content-between align-items-center mb-1 bg-light px-2 py-1 rounded">
        <span class="text-truncate small" style="max-width: 85%;">${file.name}</span>
        <button type="button" class="btn-close btn-sm ms-2" aria-label="Remove" data-index="${index}"></button>
      </div>
    `);
      container.append(fileItem);
    });
  }

  $("#filePreviewContainer").on("click", ".btn-close", function () {
    const index = $(this).data("index");
    selectedFiles.splice(index, 1);
    renderFileList();
  });
});
