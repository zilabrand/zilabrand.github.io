import { each } from './util'

interface Slideshow {
  start: () => void
  stop: () => void
}

export function initSlideshow(el: HTMLElement, {
  start,
  duration,
  transitionCallback
}: {
    start?: number,
    duration?: number,
    transitionCallback?: (to: number) => void
  } = {
    start: 0,
    duration: 1000,
    transitionCallback: to => undefined
  }
): Slideshow {
  let slides = el.querySelectorAll('.slide')

  let current = start

  let transition = function (to: number) {
    each(slides, (slide, i) => {
      if (i !== to) {
        slide.classList.remove('active')
      }
    })
    slides[to].classList.add('active')
    transitionCallback(to)
    current = to
  }

  let next = function () {
    let to = (current + 1) % slides.length
    transition(to)
  }

  let prev = function () {
    let to = (current - 1) % slides.length
    transition(to)
  }

  // Add controls!
  const nextButton = document.createElement('div')
  nextButton.className = 'slide-next'
  const prevButton = document.createElement('div')
  prevButton.className = 'slide-next'

  nextButton.addEventListener('click', next)
  prevButton.addEventListener('click', prev)

  el.appendChild(nextButton)
  el.appendChild(prevButton)

  each(slides, (slide) => slide.addEventListener('click', next))

  // Initialize
  transition(current)

  let interval: number;

  return {
    start: function () {
      if (!interval) {
        interval = setInterval(next, duration)
      }
    },
    stop: function () {
      if (interval) {
        clearInterval(interval)
      }
    }
  }
}
