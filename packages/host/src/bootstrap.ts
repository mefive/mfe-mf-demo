import { createElement, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './tailwind.css';
import Portal from './Portal';

// Use createRoot instead of render
const portal = document.createElement('div');
document.body.appendChild(portal);

createRoot(portal).render(createElement(Portal));
