import { useState } from 'react';
import MediaCard from './MediaCard.jsx';
import ProjectLightbox from './ProjectLightbox.jsx';

const PortfolioGrid = ({ items, variant = 'video', columns = 'lg:grid-cols-3' }) => {
  const [activeItem, setActiveItem] = useState(null);

  return (
    <>
      <div className={`grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 ${columns}`}>
        {items.map((item, index) => (
          <MediaCard key={item._id || item.id} item={item} variant={variant} index={index} onOpen={setActiveItem} />
        ))}
      </div>
      <ProjectLightbox item={activeItem} onClose={() => setActiveItem(null)} />
    </>
  );
};

export default PortfolioGrid;
