document.getElementById('captureBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage({action: "captureScreenshot"}, response => {
        const img = document.getElementById('capturedImage');
        img.src = response.imageDataUrl;
        document.getElementById('editor').style.display = 'block';
    });
});

document.getElementById('bgType').addEventListener('change', toggleBackgroundControls);
document.getElementById('bgColor').addEventListener('input', updateImage);
document.getElementById('gradientType').addEventListener('change', updateImage);
document.getElementById('padding').addEventListener('input', updateImage);

function toggleBackgroundControls() {
  const bgType = document.getElementById('bgType').value;
  document.getElementById('solidColorControl').style.display = bgType === 'solid' ? 'block' : 'none';
  document.getElementById('gradientControl').style.display = bgType === 'gradient' ? 'block' : 'none';
  updateImage();
}

function updateImage() {
  const img = document.getElementById('capturedImage');
  const bgType = document.getElementById('bgType').value;
  const padding = document.getElementById('padding').value + 'px';
  
  if (bgType === 'solid') {
    const bgColor = document.getElementById('bgColor').value;
    img.style.background = bgColor;
  } else {
    const gradientType = document.getElementById('gradientType').value;
    img.style.background = gradientType;
  }
  
  img.style.padding = padding;
  document.getElementById('paddingValue').textContent = padding;
}

document.getElementById('saveBtn').addEventListener('click', () => {
    const img = document.getElementById('capturedImage');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match the image size including padding
    const computedStyle = window.getComputedStyle(img);
    const padding = parseInt(computedStyle.padding);
    canvas.width = img.naturalWidth + (padding * 2);
    canvas.height = img.naturalHeight + (padding * 2);
    
    // Draw background
    if (img.style.background.includes('gradient')) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        // This is a simplified gradient. You might need to parse the actual gradient string for more complex gradients.
        gradient.addColorStop(0, img.style.background.match(/rgb\(.*?\)/g)[0]);
        gradient.addColorStop(1, img.style.background.match(/rgb\(.*?\)/g)[1]);
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = img.style.background;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(img, padding, padding, img.naturalWidth, img.naturalHeight);
    
    // Save image
    const link = document.createElement('a');
    link.download = 'screenshot.png';
    link.href = canvas.toDataURL();
    link.click();
});