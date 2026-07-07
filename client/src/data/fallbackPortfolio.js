const poster = '/cinematic-editor-hero.png';

const fallbackPortfolio = [
  {
    _id: 'sample-reel-1',
    title: 'Neon Launch Reel',
    description: 'A kinetic short edit with speed ramps, captions, impact cuts, and bass-driven transitions.',
    type: 'reel',
    category: 'Instagram Reel',
    tools: ['Premiere Pro', 'After Effects', 'Photoshop'],
    mediaUrl: '',
    thumbnailUrl: poster,
    featured: true
  },
  {
    _id: 'sample-reel-2',
    title: 'Founder Story Short',
    description: 'Vertical storytelling reel shaped for retention, hooks, and clean brand pacing.',
    type: 'reel',
    category: 'Brand Reel',
    tools: ['DaVinci Resolve', 'After Effects'],
    mediaUrl: '',
    thumbnailUrl: poster,
    featured: true
  },
  {
    _id: 'sample-video-1',
    title: 'Cinematic YouTube Edit',
    description: 'Long-form pacing, chapter rhythm, b-roll texture, sound polish, and color grade.',
    type: 'video',
    category: 'YouTube Edit',
    tools: ['Premiere Pro', 'DaVinci Resolve', 'Audition'],
    mediaUrl: '',
    thumbnailUrl: poster,
    featured: true
  },
  {
    _id: 'sample-video-2',
    title: 'Product Advertisement',
    description: 'A polished ad edit with crisp cuts, motion accents, and luxury product pacing.',
    type: 'video',
    category: 'Advertisement',
    tools: ['After Effects', 'Premiere Pro'],
    mediaUrl: '',
    thumbnailUrl: poster,
    featured: true
  },
  {
    _id: 'sample-design-1',
    title: 'High Contrast Thumbnail System',
    description: 'Scroll-stopping thumbnail composition with depth, typography, and clean focal hierarchy.',
    type: 'photoshop',
    category: 'Thumbnails',
    tools: ['Photoshop', 'Lightroom'],
    mediaUrl: poster,
    thumbnailUrl: poster,
    featured: true
  },
  {
    _id: 'sample-design-2',
    title: 'Poster Identity Series',
    description: 'Poster direction combining cinematic contrast, strong silhouettes, and precise type lockups.',
    type: 'illustrator',
    category: 'Posters',
    tools: ['Illustrator', 'Photoshop'],
    mediaUrl: poster,
    thumbnailUrl: poster,
    featured: false
  }
];

const videoCategories = [
  'YouTube Edit',
  'Cinematic Edit',
  'Podcast Edit',
  'Gaming Edit',
  'Advertisement',
  'Color Grading'
];

const designCategories = ['Photoshop', 'Illustrator', 'Thumbnails', 'Posters', 'Logos', 'Social Media Designs'];

export { fallbackPortfolio, videoCategories, designCategories };
