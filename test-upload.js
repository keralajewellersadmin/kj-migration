const fs = require('fs');
async function run() {
  try {
    const formData = new FormData();
    const fileBlob = new Blob([Buffer.alloc(100, "x")], { type: 'image/png' });
    formData.append("file", fileBlob, "test.png");
    formData.append("alt", "Test Image");

    const res = await fetch('http://localhost:4000/api/media', {
      method: 'POST',
      body: formData,
    });
    console.log("Status:", res.status);
    const json = await res.json();
    console.log("Response:", json);
  } catch (e) {
    console.error(e);
  }
}
run();
