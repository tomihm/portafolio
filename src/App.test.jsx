import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

// jsdom no tiene WebGL: la escena 3D se reemplaza por un control vacio
vi.mock('./escena/crearEscena.js', () => ({
    crearEscena: () => ({ setHover() {}, setActivo() {}, empezar() {}, destruir() {} }),
}));

// cada test elige si se ve la escena 3D o la lista (celular / sin WebGL)
let simple = false;
vi.mock('./utils/vista.js', () => ({
    useVistaSimple: () => simple,
    prefiereMenosMovimiento: () => false,
}));

// cerrado el panel queda aria-hidden, asi que se busca por etiqueta y no por rol
const panel = () => document.querySelector('aside');
const abierto = () => waitFor(() => expect(panel()).toHaveAttribute('aria-hidden', 'false'));
const cerrado = () => waitFor(() => expect(panel()).toHaveAttribute('aria-hidden', 'true'));

describe('App', () => {
    beforeEach(() => {
        simple = false;
        history.replaceState(null, '', '/');
    });

    it('el panel parte cerrado', () => {
        render(<App />);

        expect(panel()).toHaveAttribute('aria-hidden', 'true');
        expect(screen.getByText(/web, móvil y backend/).closest('.transition-opacity')).toHaveClass('opacity-100');
    });

    it('el menu abre el proyecto en el panel y lo deja en la url', async () => {
        render(<App />);
        await userEvent.click(screen.getByRole('button', { name: 'mygos' }));
        await abierto();

        const aside = panel();
        expect(window.location.hash).toBe('#mygos');
        expect(aside).toHaveAccessibleName('Mygos');
        expect(aside).toHaveFocus();
        expect(within(aside).getByText('tomas@portafolio:~$ cd mygos/')).toBeInTheDocument();
        expect(within(aside).getByText('Jetpack Compose')).toBeInTheDocument();
        // mygos no tiene demo publicada: solo el link al repo
        expect(within(aside).queryByRole('link', { name: 'ver demo ↗' })).not.toBeInTheDocument();
        expect(within(aside).getByRole('link', { name: 'código ↗' })).toHaveAttribute('href', 'https://github.com/tomihm/Mygos');
    });

    it('un link con #seccion abre ese proyecto al entrar', () => {
        history.replaceState(null, '', '/#ferreteria');
        render(<App />);

        expect(panel()).toHaveAttribute('aria-hidden', 'false');
        expect(within(panel()).getByRole('heading', { name: 'Ferretería Los Maestros' })).toBeInTheDocument();
    });

    it('la etiqueta del objeto tambien abre el proyecto', async () => {
        render(<App />);
        await userEvent.click(await screen.findByRole('button', { name: 'bibliotecas/' }));
        await abierto();

        expect(within(panel()).getByRole('heading', { name: 'Gestión de bibliotecas' })).toBeInTheDocument();
        expect(within(panel()).getByText(/^Arquitectura e infraestructura/)).toBeInTheDocument();
        expect(within(panel()).getAllByRole('listitem')).toHaveLength(3);
    });

    it('contacto muestra el correo y linkedin', async () => {
        render(<App />);
        await userEvent.click(screen.getByRole('button', { name: 'contacto' }));
        await abierto();

        expect(within(panel()).getByRole('link', { name: 'tomas.hernandez.milla@gmail.com' })).toHaveAttribute('href', 'mailto:tomas.hernandez.milla@gmail.com');
        expect(within(panel()).getByRole('link', { name: 'linkedin ↗' })).toHaveAttribute('href', expect.stringContaining('linkedin.com/in/'));
    });

    it('esc y el boton cerrar cierran el panel, limpian la url y devuelven el foco', async () => {
        render(<App />);
        const menu = screen.getByRole('button', { name: 'ferretería' });
        await userEvent.click(menu);
        await abierto();
        await userEvent.keyboard('{Escape}');
        await cerrado();
        expect(window.location.hash).toBe('');
        expect(menu).toHaveFocus();

        await userEvent.click(menu);
        await abierto();
        await userEvent.click(within(panel()).getByRole('button', { name: 'cerrar · esc' }));
        await cerrado();
    });

    it('en el celular o sin WebGL muestra la lista en vez de la escena', async () => {
        simple = true;
        render(<App />);

        const lista = screen.getByRole('navigation', { name: 'Proyectos' });
        expect(within(lista).getAllByRole('button')).toHaveLength(4);
        expect(screen.queryByRole('button', { name: 'mygos' })).not.toBeInTheDocument();

        await userEvent.click(within(lista).getByRole('button', { name: /bibliotecas\// }));
        await abierto();
        expect(within(panel()).getByRole('heading', { name: 'Gestión de bibliotecas' })).toBeInTheDocument();
    });
});
