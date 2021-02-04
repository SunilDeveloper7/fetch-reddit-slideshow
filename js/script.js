/* App state */
const TIMER_SPEED = 5000
// variable to store setInterval
let slideShowInterval = null
// holds image urls from reddit
let images = []
// index of the current image slide
let imageIndex = 0

/* DOM SELECTORS  */
const SEARCH_FORM = document.querySelector('#search-form')
const SEARCH_INPUT = document.querySelector('#search-input')
const SUBMIT_BUTTON = document.querySelector('#submit-button')
const STOP_BUTTON = document.querySelector('#stop-button')
const SLIDESHOW_CONTAINER = document.querySelector('#slideshow-container')

SEARCH_FORM.addEventListener('submit', fetchReddit)
STOP_BUTTON.addEventListener('click', stopSlideShow)
STOP_BUTTON.style.display = 'none'

/* functions */
// fetch user query from reddit
async function fetchReddit(e) {
  e.preventDefault()

  console.log('searching for ' + SEARCH_INPUT.value)
  try {
    // fetch user search from reddit
    const redditData = await fetch(`http://www.reddit.com/search.json?q=${SEARCH_INPUT.value}+nsfw:no`)
    const redditJson = await redditData.json()
    images = redditJson.data.children.map(function(child) {
      return {
        url: child.data.url,
        title: child.data.title,
      }
    })
    
    images = images.filter(function(image){
      const fileExtension = image.url.slice(-4)
      if(fileExtension === '.jpg' || fileExtension === '.png') return true
      return false
    })
    // start the slideshow!
    slideShowInterval = setInterval(changeSlide, TIMER_SPEED)
    changeSlide()
    STOP_BUTTON.style.display = 'inline'
    SEARCH_FORM.style.display =  'none'
    
  } catch(error) {
    console.log(error)
  }
  
}

// empties out the conainer div
function clearSlideShow() {
  while(SLIDESHOW_CONTAINER.firstChild) {
    SLIDESHOW_CONTAINER.removeChild(SLIDESHOW_CONTAINER.firstChild)
  }
}

// callback for slidwshow setInterval
function changeSlide(){
  clearSlideShow()
  if(imageIndex >= images.length) imageIndex = 0
  const imageEl = document.createElement('img')
  imageEl.src = images[imageIndex].url 
  imageEl.alt = images[imageIndex].title 

  SLIDESHOW_CONTAINER.appendChild(imageEl)
  // console.log(images[imageIndex])
  imageIndex++
}

// stops the slideshow and waits for a new user input
function stopSlideShow() {
  // hide UI elements
  SEARCH_FORM.style.display =  'block'
  STOP_BUTTON.style.display = 'none'
  // reset state
  images = []
  imageIndex = 0
  // stop slideshow
  clearInterval(slideShowInterval)
  clearSlideShow()
}