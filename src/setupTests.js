import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom no trae matchMedia: se simula una pantalla de escritorio sin preferencias
window.matchMedia ??= (query) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
});

afterEach(() => {
    cleanup();
});
