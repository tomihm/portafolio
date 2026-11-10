import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Galeria from './Galeria.jsx';

const imagenes = [
    { src: 'a.webp', alt: 'Inicio' },
    { src: 'b.webp', alt: 'Catálogo' },
];

describe('Galeria', () => {
    it('parte con la primera captura y la miniatura cambia la grande', async () => {
        render(<Galeria imagenes={imagenes} />);
        expect(screen.getByRole('img', { name: 'Inicio' })).toHaveAttribute('src', 'a.webp');
        expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', 'a.webp');

        await userEvent.click(screen.getByRole('button', { name: 'Ver captura: Catálogo' }));

        expect(screen.getByRole('img', { name: 'Catálogo' })).toHaveAttribute('src', 'b.webp');
        expect(screen.getByRole('button', { name: 'Ver captura: Catálogo' })).toHaveAttribute('aria-pressed', 'true');
    });

    it('con una sola captura no muestra miniaturas', () => {
        render(<Galeria imagenes={[imagenes[0]]} />);

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});
