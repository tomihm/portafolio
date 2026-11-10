import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSeccionActiva, abrirSeccion, cerrarSeccion } from './seccionUrl.js';

describe('seccionUrl', () => {
    beforeEach(() => history.replaceState(null, '', '/'));

    it('lee la seccion desde la url e ignora claves que no existen', () => {
        history.replaceState(null, '', '/#mygos');
        expect(renderHook(() => useSeccionActiva()).result.current).toBe('mygos');

        history.replaceState(null, '', '/#no-existe');
        expect(renderHook(() => useSeccionActiva()).result.current).toBeNull();
    });

    it('abrir y cerrar cambian la url y la seccion activa', async () => {
        const { result } = renderHook(() => useSeccionActiva());

        act(() => abrirSeccion('bibliotecas'));
        await waitFor(() => expect(result.current).toBe('bibliotecas'));
        expect(window.location.hash).toBe('#bibliotecas');

        act(() => cerrarSeccion());
        expect(result.current).toBeNull();
        expect(window.location.hash).toBe('');
    });
});
