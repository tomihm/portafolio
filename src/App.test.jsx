import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

// jsdom no tiene WebGL: la escena 3D se reemplaza por un control vacio
vi.mock('./escena/crearEscena.js', () => ({
    crearEscena: () => ({ setHover() {}, setActivo() {}, destruir() {} }),
}));

// cerrado el panel queda aria-hidden, asi que se busca por etiqueta y no por rol
const panel = () => document.querySelector('aside');

describe('App', () => {
    it('el panel parte cerrado', () => {
        render(<App />);

        expect(panel()).toHaveAttribute('aria-hidden', 'true');
        expect(screen.getByText(/web, móvil y backend/).parentElement.parentElement).toHaveClass('opacity-100');
    });

    it('el menu abre el proyecto en el panel', async () => {
        render(<App />);
        await userEvent.click(screen.getByRole('button', { name: 'mygos' }));

        const aside = panel();
        expect(aside).toHaveAttribute('aria-hidden', 'false');
        expect(within(aside).getByRole('heading', { name: 'Mygos' })).toBeInTheDocument();
        expect(within(aside).getByText('tomas@portafolio:~$ cd mygos/')).toBeInTheDocument();
        expect(within(aside).getByText('Jetpack Compose')).toBeInTheDocument();
        // mygos no tiene demo publicada: solo el link al repo
        expect(within(aside).queryByRole('link', { name: 'ver demo ↗' })).not.toBeInTheDocument();
        expect(within(aside).getByRole('link', { name: 'código ↗' })).toHaveAttribute('href', 'https://github.com/tomihm/Mygos');
    });

    it('la etiqueta del objeto tambien abre el proyecto', async () => {
        render(<App />);
        await userEvent.click(screen.getByRole('button', { name: 'bibliotecas/' }));

        expect(within(panel()).getByRole('heading', { name: 'Gestión de bibliotecas' })).toBeInTheDocument();
        expect(within(panel()).getByText(/^Arquitectura e infraestructura/)).toBeInTheDocument();
        expect(within(panel()).getAllByRole('listitem')).toHaveLength(3);
    });

    it('contacto muestra el correo', async () => {
        render(<App />);
        await userEvent.click(screen.getByRole('button', { name: 'contacto' }));

        expect(within(panel()).getByRole('link', { name: 'tomas.hernandez.milla@gmail.com' })).toHaveAttribute('href', 'mailto:tomas.hernandez.milla@gmail.com');
        expect(within(panel()).getByRole('link', { name: 'linkedin ↗' })).toHaveAttribute('href', expect.stringContaining('linkedin.com/in/'));
    });

    it('esc y el boton cerrar cierran el panel', async () => {
        render(<App />);
        await userEvent.click(screen.getByRole('button', { name: 'ferretería' }));
        await userEvent.keyboard('{Escape}');
        expect(panel()).toHaveAttribute('aria-hidden', 'true');

        await userEvent.click(screen.getByRole('button', { name: 'ferretería' }));
        await userEvent.click(within(panel()).getByRole('button', { name: 'cerrar · esc' }));
        expect(panel()).toHaveAttribute('aria-hidden', 'true');
    });
});
