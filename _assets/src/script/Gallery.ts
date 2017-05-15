import { map } from './util'
import { initSlideshow } from './Slideshow'

const galContainer = document.createElement('div')
galContainer.className = 'gal-container'

const galContent = document.createElement('div')
galContent.className = 'gal-content slideshow'

galContainer.appendChild(galContent)

const closeButton = document.createElement('div')
closeButton.className = 'gal-close'

galContainer.appendChild(closeButton)

let close = function () {
  galContainer.remove()
  galContent.innerHTML = ''
}

closeButton.addEventListener('click', close)
galContainer.addEventListener('click', (event) => {
  if (event.target === galContainer) {
    close()
  }
})

interface GalItem {
  el: Element
  src: string
}

export function createGallery(el: HTMLElement): void {
  let show = function (index: number) {
    let slides = map(galItems, () => {
      let slide = document.createElement('div')
      slide.className = 'slide'
      galContent.appendChild(slide)
      return slide
    })

    initSlideshow(galContent, {
      start: index,
      duration: 500,
      transitionCallback(to) {
        let slide = slides[to]
        if (!slide.getElementsByTagName('img').length) {
          let img = new Image()
          img.src = galItems[to].src
          slide.appendChild(img)
        }
      }
    })

    document.documentElement.appendChild(galContainer)
  }

  let galItems = map(el.querySelectorAll('.gal-item'), (itemEl, index): GalItem => {
    itemEl.addEventListener('click', () => show(index))

    return {
      el: itemEl,
      src: itemEl.getAttribute('data-src'),
    }
  })

}
