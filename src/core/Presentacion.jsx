// nombre grande; se esconde cuando hay un panel abierto
function Presentacion({ visible }) {
    return (
        <div className={`pointer-events-none transition-opacity duration-400 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="m-0 font-serif text-[clamp(36px,5vw,64px)] leading-[0.98] font-normal tracking-[-0.01em]">
                Tomás Hernández<br /><em className="text-acento">web, móvil y backend</em>
            </h1>
        </div>
    );
}

export default Presentacion
