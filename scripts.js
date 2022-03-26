var currentPainting = 0

const DISPLAY_CONFIG = '/full/!250,250/0/default.jpg'
// img.src = imageConfig + "/" + paintingData.data[selection].image_id  + '/full/!250,250/0/default.jpg'

async function getPaintings(term) { 
  paintings = [] //declared globally
  const response = await fetch(`https://api.artic.edu/api/v1/artworks/search?q=${term}=true&limit=10&fields=artist_titles,date_display,title,alt_text,image_id`, {mode: 'cors'});
  const paintingData = await response.json();

  for (let i = 0; i < paintingData.data.length; i++) {
    paintings.push(paintingData.data[i])
    paintings[i].image = paintingData.config.iiif_url + "/" + paintingData.data[i].image_id  + '/full/!500,500/0/default.jpg'
  }
  
  console.log(paintings)
  displayCurrent(0)
}

function displayCurrent(current) {
  currentPainting = current
  //fade out current image
  const img = document.getElementById('main-img')
  img.src = paintings[currentPainting].image
}

// function displayDots() {}

function displayMove(newSlide) {
  if (newSlide >= paintings.length) return displayCurrent(0)
  if (newSlide < 0) return displayCurrent(paintings.length - 1)
  return displayCurrent(newSlide)
}

getPaintings(document.getElementById('term').value)