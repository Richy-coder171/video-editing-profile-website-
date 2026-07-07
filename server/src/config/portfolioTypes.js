const PORTFOLIO_TYPE_CONFIG = {
  reel: {
    folder: 'portfolio/reels',
    resourceType: 'video',
    label: 'Reel'
  },
  video: {
    folder: 'portfolio/videos',
    resourceType: 'video',
    label: 'Video'
  },
  photoshop: {
    folder: 'portfolio/photoshop',
    resourceType: 'image',
    label: 'Photoshop'
  },
  illustrator: {
    folder: 'portfolio/illustrator',
    resourceType: 'image',
    label: 'Illustrator'
  },
  thumbnail: {
    folder: 'portfolio/thumbnails',
    resourceType: 'image',
    label: 'Thumbnail'
  },
  poster: {
    folder: 'portfolio/posters',
    resourceType: 'image',
    label: 'Poster'
  },
  logo: {
    folder: 'portfolio/logos',
    resourceType: 'image',
    label: 'Logo'
  },
  social: {
    folder: 'portfolio/social',
    resourceType: 'image',
    label: 'Social'
  }
};

const PORTFOLIO_TYPES = Object.keys(PORTFOLIO_TYPE_CONFIG);

const getTypeConfig = (type) => PORTFOLIO_TYPE_CONFIG[type];

export { PORTFOLIO_TYPE_CONFIG, PORTFOLIO_TYPES, getTypeConfig };
