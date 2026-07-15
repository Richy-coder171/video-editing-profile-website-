import { lazy, Suspense } from 'react';

const Page3DAccent = lazy(() => import('./Page3DAccent.jsx'));

const LazyPage3DAccent = (props) => (
  <Suspense fallback={null}>
    <Page3DAccent {...props} />
  </Suspense>
);

export default LazyPage3DAccent;
