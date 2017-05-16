/**
 * Entry point for actual application javascript
 */

import { each } from 'script/util';

import { createGallery } from 'script/Gallery';

const portfolioGalleries = document.querySelectorAll('.portfolio-images');
each(portfolioGalleries, createGallery);
