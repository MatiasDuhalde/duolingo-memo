import React from 'react';
import { createRoot } from 'react-dom/client';

export const Popup: React.FC = () => {
  return (
    <React.StrictMode>
      <div>Popup</div>
      <div>Popup</div>
      <div>Popup</div>
      <div>Popup</div>
      <div>Popup</div>
      <div>Popup</div>
      <div>Popup</div>
      <div>Popup</div>
      <div>Popup</div>
      <div>Popup</div>
      <div>Popup</div>
      <div>Popup</div>
      <div>Popup</div>
    </React.StrictMode>
  );
};

console.log('Create root');

createRoot(document.getElementById('root')!).render(<Popup />);
