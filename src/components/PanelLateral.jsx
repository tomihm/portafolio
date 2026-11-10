import { useEffect, useRef } from 'react';

// panel que entra desde la derecha con el detalle de la seccion elegida
function PanelLateral({ abierto, titulo, comando, alCerrar, children }) {
    const panelRef = useRef(null);
    const anteriorRef = useRef(null);

    // al abrir, el foco del teclado entra al panel; al cerrar vuelve a donde estaba
    useEffect(() => {
        if (abierto) {
            anteriorRef.current ??= document.activeElement;
            panelRef.current.focus({ preventScroll: true });
        } else if (anteriorRef.current) {
            anteriorRef.current.focus?.({ preventScroll: true });
            anteriorRef.current = null;
        }
    }, [abierto]);

    return (
        <aside
            ref={panelRef}
            tabIndex={-1}
            aria-label={titulo}
            inert={!abierto}
            aria-hidden={!abierto}
            className={`fixed top-0 right-0 bottom-0 z-6 box-border flex w-[min(480px,100%)] flex-col border-l border-borde bg-superficie/94 backdrop-blur-md transition-transform duration-550 ease-[cubic-bezier(.2,.8,.2,1)] focus:outline-none ${abierto ? 'translate-x-0' : 'translate-x-[105%]'}`}
        >
            <div className="flex items-center justify-between gap-4 border-b border-borde-suave px-[clamp(20px,5vw,28px)] py-5 text-xs">
                <span className="text-tenue">tomas@portafolio:~$ {comando}</span>
                <button type="button" className="shrink-0 cursor-pointer rounded border border-borde-chip px-2.5 py-1.5 text-texto hover:border-acento hover:text-acento" onClick={alCerrar}>
                    cerrar · esc
                </button>
            </div>
            <div className="flex-1 overflow-y-auto px-[clamp(20px,5vw,28px)] pt-8 pb-10">{children}</div>
        </aside>
    );
}

export default PanelLateral
