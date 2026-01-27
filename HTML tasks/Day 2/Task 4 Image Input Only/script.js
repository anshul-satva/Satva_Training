function uploadFile(inputId, messageId) {
  const fileInput = document.getElementById(inputId);
  const messageDiv = document.getElementById(messageId);
  const file = fileInput.files[0];

  if (!file) {
    messageDiv.innerHTML =
      '<span class="error">Please select a file first!</span>';
    return;
  }

  // Check if file is an image
  if (file.type.startsWith("image/")) {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    messageDiv.innerHTML = `<span class="success">File is Image<br>File type = ${fileExtension}</span>`;
  } else {
    messageDiv.innerHTML = `<span class="error">File is Not Image</span>`;
  } 
}
