/**
 * Entry point for actual application javascript
 */

import { each } from 'script/util';

import { Gallery } from 'script/Gallery';

each(document.querySelectorAll('.portfolio-images'), g => new Gallery(g.querySelectorAll('.gal-item')));
