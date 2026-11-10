import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { crearEscena } from '../escena/crearEscena.js';
import Escena from './Escena.jsx';

const control = { setHover: vi.fn(), setActivo: vi.fn(), destruir: vi.fn() };
vi.mock('../escena/crearEscena.js', () => ({ crearEscena: vi.fn(() => control) }));

describe('Escena', () => {
    beforeEach(() => vi.clearAllMocks());

    it('crea la escena con una etiqueta por seccion y la destruye al salir', () => {
        const { unmount } = render(<Escena activo={null} alElegir={() => {}} />);

        const { etiquetas } = crearEscena.mock.calls[0][1];
        expect(Object.keys(etiquetas)).toEqual(['ferreteria', 'mygos', 'bibliotecas', 'contacto']);
        unmount();
        expect(control.destruir).toHaveBeenCalled();
    });

    it('el hover sobre la etiqueta la enciende y avisa a la escena', async () => {
        render(<Escena activo={null} alElegir={() => {}} />);
        const etiqueta = screen.getByRole('button', { name: 'mygos/' });

        await userEvent.hover(etiqueta);
        expect(etiqueta.firstChild).toHaveClass('bg-acento');
        expect(control.setHover).toHaveBeenLastCalledWith('mygos');

        await userEvent.unhover(etiqueta);
        expect(etiqueta.firstChild).toHaveClass('bg-superficie');
    });

    it('la seccion activa queda encendida y se avisa a la escena', () => {
        render(<Escena activo="contacto" alElegir={() => {}} />);

        expect(screen.getByRole('button', { name: 'contacto.txt' }).firstChild).toHaveClass('bg-acento');
        expect(control.setActivo).toHaveBeenLastCalledWith('contacto');
    });

    it('al dibujar el primer cuadro se desvanece la pantalla de carga', () => {
        document.body.insertAdjacentHTML('beforeend', '<div id="cargando"></div>');
        render(<Escena activo={null} alElegir={() => {}} />);

        crearEscena.mock.calls[0][1].alPrimerCuadro();

        const carga = document.getElementById('cargando');
        expect(carga.style.opacity).toBe('0');
        expect(carga.style.pointerEvents).toBe('none');
        carga.remove();
    });

    it('el clic en la etiqueta elige la seccion', async () => {
        const alElegir = vi.fn();
        render(<Escena activo={null} alElegir={alElegir} />);
        await userEvent.click(screen.getByRole('button', { name: 'ferretería/' }));

        expect(alElegir).toHaveBeenCalledWith('ferreteria');
    });
});
