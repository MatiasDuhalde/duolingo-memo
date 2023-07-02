import React from 'react';
import { createRoot } from 'react-dom/client';

export const Options: React.FC = () => {
  return (
    <React.StrictMode>
      <div>Options</div>
    </React.StrictMode>
  );
};

console.log('Create root');

createRoot(document.getElementById('root')!).render(<Options />);
