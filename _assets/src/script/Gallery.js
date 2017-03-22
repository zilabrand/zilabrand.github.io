import { each, map } from 'lodash'
import { initSlideshow } from './Slideshow'

const galContainer = document.createElement('div')
galContainer.className = 'gal-container'

const galContent = document.createElement('div')
galContent.className = 'gal-content'

export function createGallery(el) {
  let show = function(index) {
    let slides = map(galItems, () => {
      let slide = document.createElement('div')
      slide.classname = 'slide'
      galContent.appendChild(div)
      return slide
    })

    initSlideshow(galContent, index, 500, (to) => {
      let slide = slides[to]
      if(!slide.getElementsByTagName('img')){
        let img = new Image();
        img.src = galItems[to].src
        slide.appendChild(img)
      }
    })

    document.documentElement.appendChild(galContainer)
  }

  let close = function() {
    galContainer.remove()
    galContent.innerHTML = ''
  }

  let galItems = map(el.querySelectorAll('.gal-item'), itemEl, index => {
    itemEl.addEventListener('click', () => show(index))

    return {
      el: itemEl,
      src = itemEl.getAttribute('data-src'),
    }
  })

}
