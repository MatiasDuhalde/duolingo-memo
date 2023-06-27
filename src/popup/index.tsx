import React from 'react';
import { createRoot } from 'react-dom/client';

export const Popup = () => {
  return <div>Popup</div>;
};

createRoot(document.getElementById('root')!).render(<Popup />);
