import {
  div,
  each,
} from './util'

interface Slideshow {
  start: () => void
  stop: () => void
}

export function initSlideshow(el: HTMLElement, {
  startAt,
  duration,
  transitionCallback
}: {
    startAt?: number,
    duration?: number,
    transitionCallback?: (to: number) => void
  } = {
    startAt: 0,
    duration: 1000,
    transitionCallback: to => undefined
  }
): Slideshow {
  let slides = el.querySelectorAll('.slide')

  let current = startAt

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

  let interval: number;

  el.classList.add('paused');

  let start = function (): void {
    if (!interval) {
      interval = setInterval(next, duration)
      el.classList.remove('paused')
      el.classList.add('playing')
    }
  }

  let stop = function (): void {
    if (interval) {
      clearInterval(interval)
      el.classList.remove('playing')
      el.classList.add('paused')
    }
  }

  // Add controls!
  el.appendChild(div(
    { attrs: { className: 'controls' } },
    div({
      attrs: { className: 'prev' },
      listeners: { click: prev },
    }),
    div({
      attrs: { className: 'pause-play' },
      listeners: { click: () => (interval ? stop : start)() },
    }),
    div({
      attrs: { className: 'next' },
      listeners: { click: next },
    })
  ))

  each(slides, slide => slide.addEventListener('click', next))

  // Initialize
  transition(current)

  return {
    start: start,
    stop: stop,
  }
}
