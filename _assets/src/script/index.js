import { each } from 'lodash'

import { createGallery } from './Gallery'

let portfolioGalleries = document.querySelectorAll('.portfolio-images')
each(portfolioGalleries, createGallery)
