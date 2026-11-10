// panel que entra desde la derecha con el detalle de la seccion elegida
function PanelLateral({ abierto, comando, alCerrar, children }) {
    return (
        <aside
            inert={!abierto}
            aria-hidden={!abierto}
            className={`absolute top-0 right-0 bottom-0 z-6 box-border flex w-[min(480px,100%)] flex-col border-l border-borde bg-superficie/94 backdrop-blur-md transition-transform duration-550 ease-[cubic-bezier(.2,.8,.2,1)] ${abierto ? 'translate-x-0' : 'translate-x-[105%]'}`}
        >
            <div className="flex items-center justify-between border-b border-borde-suave px-7 py-5 text-xs">
                <span className="text-tenue">tomas@portafolio:~$ {comando}</span>
                <button type="button" className="cursor-pointer rounded border border-borde-chip px-2.5 py-1.5 text-texto hover:border-acento hover:text-acento" onClick={alCerrar}>
                    cerrar · esc
                </button>
            </div>
            <div className="flex-1 overflow-y-auto px-7 pt-8 pb-10">{children}</div>
        </aside>
    );
}

export default PanelLateral
