import {
  div,
  map,
} from './util'
import { initSlideshow } from './Slideshow'

let close = function () {
  galContainer.remove()
  galContent.innerHTML = ''
}

const galContent = div({ attrs: { className: 'gal-content slideshow' } })

const closeButton = div({
  attrs: { className: 'gal-close' },
  listeners: { click: close },
})

const galContainer = div(
  {
    attrs: { className: 'gal-container' },
    listeners: {
      click: event => {
        if (event.target === galContainer) close()
      }
    }
  },
  galContent,
  closeButton,
)


interface GalItem {
  el: Element
  src: string
}

export function createGallery(el: HTMLElement): void {
  let show = function (index: number) {
    let slides = map(galItems, () => {
      let slide = div()
      slide.className = 'slide'
      galContent.appendChild(slide)
      return slide
    })

    initSlideshow(galContent, {
      startAt: index,
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
