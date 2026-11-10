import { useSyncExternalStore } from 'react';

let webgl;
// se revisa una sola vez: la escena 3D necesita WebGL
export function soportaWebGL() {
    if (webgl === undefined) {
        try {
            const canvas = document.createElement('canvas');
            webgl = Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
        } catch {
            webgl = false;
        }
    }
    return webgl;
}

function useMedia(consulta) {
    return useSyncExternalStore(
        (avisar) => {
            const media = window.matchMedia(consulta);
            media.addEventListener('change', avisar);
            return () => media.removeEventListener('change', avisar);
        },
        () => window.matchMedia(consulta).matches,
    );
}

// en el celular o sin WebGL se muestra la lista de proyectos en vez de la escena 3D
export function useVistaSimple() {
    const angosta = useMedia('(max-width: 767px)');
    return angosta || !soportaWebGL();
}

export const prefiereMenosMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
