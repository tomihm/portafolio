// pildora con linea que cuelga sobre un objeto 3D; la escena mueve su posicion
function EtiquetaObjeto({ ref, texto, encendida, onClick, onPointerEnter, onPointerLeave }) {
    return (
        <button
            ref={ref}
            type="button"
            className="pointer-events-auto absolute top-0 left-0 flex cursor-pointer flex-col items-center will-change-transform"
            onClick={onClick}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
        >
            <span className={`rounded-full border border-acento px-3.5 py-[5px] text-xs whitespace-nowrap transition-colors duration-200 ${encendida ? 'bg-acento text-superficie' : 'bg-superficie text-texto'}`}>
                {texto}
            </span>
            <span className="h-[22px] w-px bg-acento" />
        </button>
    );
}

export default EtiquetaObjeto
