import { each, map } from 'lodash'
import { initSlideshow } from './Slideshow'

const galContainer = document.createElement('div')
galContainer.className = 'gal-container'

const galContent = document.createElement('div')
galContent.className = 'gal-content'

galContainer.appendChild(galContent)

const closeButton = document.createElement('div')
closeButton.className = 'gal-close'

galContainer.appendChild(closeButton)

let close = function(){
  galContainer.remove()
  galContent.innerHTML = ''
}

closeButton.addEventListener('click', close)
galContainer.addEventListener('click', (event) => {
  if(event.target === galContainer){
    close()
  }
})

export function createGallery(el) {
  let show = function(index){
    let slides = map(galItems, () => {
      let slide = document.createElement('div')
      slide.className = 'slide'
      galContent.appendChild(slide)
      return slide
    })

    initSlideshow({
      el: galContent,
      start: index,
      duration: 500,
      transitionCallback(to) {
        let slide = slides[to]
        if(!slide.getElementsByTagName('img').length){
          let img = new Image()
          img.src = galItems[to].src
          slide.appendChild(img)
        }
      }
    })

    document.documentElement.appendChild(galContainer)
  }

  let galItems = map(el.querySelectorAll('.gal-item'), (itemEl, index) => {
    itemEl.addEventListener('click', () => show(index))

    return {
      el: itemEl,
      src: itemEl.getAttribute('data-src'),
    }
  })

}
