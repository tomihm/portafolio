// desvanece la pantalla de carga de index.html cuando la pagina lleva abierta al menos `minimo` ms
// devuelve una funcion para cancelar la espera
export function ocultarCarga(minimo, alTerminar) {
    const espera = setTimeout(() => {
        const el = document.getElementById('cargando');
        if (el) {
            el.style.pointerEvents = 'none';
            el.style.opacity = '0';
            el.addEventListener('transitionend', () => el.remove(), { once: true });
        }
        alTerminar?.();
    }, Math.max(0, minimo - performance.now()));
    return () => clearTimeout(espera);
}
