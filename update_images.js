const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'app/data/product-detail.json');
const publicDir = path.join(__dirname, 'public');

// Read existing JSON
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Helper to list files in a directory
function getImagesForProduct(folderName) {
  const dirPath = path.join(publicDir, 'Products-fbs', folderName);
  if (!fs.existsSync(dirPath)) return [];
  
  const files = fs.readdirSync(dirPath);
  // Filter for actual images and map to relative path
  const imageFiles = files
    .filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f))
    // We filter out hardware images for the main gallery since they usually go to baseHardwareSpecifications
    .filter(f => !f.toLowerCase().includes('hardware'))
    .sort();
    
  return imageFiles.map(f => `/Products-fbs/${folderName}/${f}`);
}

// Map each product to its folder
const folderMap = {
  'advertising-flags': 'Advertising Flags',
  'banner-stands': 'Banner Stand',
  'banner': 'Banner',
  'vehicle-wraps': 'Vehicle Wrap',
  'window-lettering': 'window-lettering',
  'vehicle-graphics': 'vehical-graphics',
  'yard-signs': 'yard sign',
  'custom-canopy-tents': 'Custom Canopy Awning', // or Custom Event Tent?
  'custom-canopy-awning': 'Custom Canopy Awning',
  'custom-event-tent': 'Custom Event Tent',
  'signicade-a-frame': 'Signicade A-Frame Sign',
  'trade-show-products': 'Trade Show products',
  'led-channel-letters': 'LED Channel Letters',
  'led-light-box': 'LED Light Box',
  'led-message-board': 'LED Message Board  Digital Sign',
  'custom-neon': 'Custom Neon LED',
  'monument-sign': 'Monument Sign',
  'pylon-sign': 'Pylon Sign'
};

data.forEach(product => {
  let folderName = folderMap[product.slug];
  
  // If we couldn't map by slug, try by name
  if (!folderName) {
     const possibleFolder = Object.values(folderMap).find(f => f.toLowerCase() === product.name.toLowerCase());
     if (possibleFolder) folderName = possibleFolder;
  }
  
  // Try direct match if still not found
  if (!folderName && fs.existsSync(path.join(publicDir, 'Products-fbs', product.name))) {
      folderName = product.name;
  }

  if (folderName) {
    const allImages = getImagesForProduct(folderName);
    
    if (allImages.length > 0) {
      if (!product.images) product.images = {};
      
      // Attempt to pick Product-1.jpg or similar as main image, others as subImages
      const mainImage = allImages.find(img => img.toLowerCase().includes('product-1')) || allImages[0];
      const subImages = allImages.filter(img => img !== mainImage);
      
      product.images.mainImage = mainImage;
      product.images.subImages = subImages;
      console.log(`Updated ${product.slug} with ${allImages.length} images from ${folderName}`);
    } else {
      console.log(`No images found for ${product.slug} in ${folderName}`);
    }
  } else {
    console.log(`Could not find a folder mapping for ${product.slug} / ${product.name}`);
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Update complete!');
