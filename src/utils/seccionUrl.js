import { useSyncExternalStore } from 'react';
import { buscarSeccion } from '../data/proyectos.js';

// la seccion abierta vive en la url (#mygos): se puede compartir y el boton atras cierra el panel
const leer = () => {
    const clave = decodeURIComponent(window.location.hash.slice(1));
    return buscarSeccion(clave) ? clave : null;
};

const suscribir = (avisar) => {
    window.addEventListener('hashchange', avisar);
    return () => window.removeEventListener('hashchange', avisar);
};

export const useSeccionActiva = () => useSyncExternalStore(suscribir, leer);

export function abrirSeccion(clave) {
    window.location.hash = clave;
}

// cerrar reemplaza la entrada del historial: atras no vuelve a abrir el panel recien cerrado
export function cerrarSeccion() {
    if (!window.location.hash) return;
    history.replaceState(null, '', window.location.pathname + window.location.search);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
}
