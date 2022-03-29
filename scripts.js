var currentPainting = 0

const DISPLAY_CONFIG = '/full/!250,250/0/default.jpg'
// img.src = imageConfig + "/" + paintingData.data[selection].image_id  + '/full/!250,250/0/default.jpg'

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

var input = document.getElementById("term");
input.addEventListener("keyup", function(event) {
  if (event.key === 'Enter') {
   event.preventDefault();
   document.getElementById("search").click();
  }
});

async function getPaintings(term) { 
  paintings = [] //declared globally
  const response = await fetch(`https://api.artic.edu/api/v1/artworks/search?q=${term}=true&limit=10&fields=artist_titles,date_display,title,alt_text,image_id`, {mode: 'cors'});
  const paintingData = await response.json();

  console.log(paintingData)

  shuffle(paintingData.data)

  for (let i = 0; i < paintingData.data.length; i++) {
    paintings.push(paintingData.data[i])
    paintings[i].image = paintingData.config.iiif_url + "/" + paintingData.data[i].image_id  + '/full/!500,500/0/default.jpg' //'/full/!500,500/0/default.jpg'
    paintings[i].caption = paintingData.data[i].title + ' by ' + paintingData.data[i].artist_titles[0] + ' (' +  paintingData.data[i].date_display + ')'
  }
  
  console.log(paintings)
  displayCurrent(0)
}

function displayCurrent(current) {
  console.log("current " + current + Number.isInteger(current))
  currentPainting = current
  console.log("current painting" + currentPainting)
  //fade out current image
  const img = document.getElementById('main-img')
  img.src = paintings[currentPainting].image

  document.getElementById('info').textContent = paintings[currentPainting].caption

  displayDots()
}

function displayDots() {
  dotBar = document.getElementById('nav-dots')
  dotBar.innerHTML = ''
  for (let i = 0; i < paintings.length; i++) {
    let dot = document.createElement('div')
    dot.setAttribute('id', i);
    dot.classList.add('dot'); 
    dot.setAttribute('onclick', 'displayMove(parseInt(this.id))')
    dotBar.appendChild(dot);

    if (dot.id == currentPainting) {
      dot.style.opacity = '.75'
    }
  }
  dotBar.style.opacity = 0;
}

function DotsOn() {
  dotBar = document.getElementById('nav-dots')
  dotBar.style.opacity = 1;
}

function DotsOff() {
  dotBar = document.getElementById('nav-dots')
  dotBar.style.opacity = 0;
}

function displayMove(newSlide) {
  if (newSlide >= paintings.length) return displayCurrent(0)
  if (newSlide < 0) return displayCurrent(paintings.length - 1)
  return displayCurrent(newSlide)
}

getPaintings(document.getElementById('term').value)