import { useState } from 'react';

// captura grande + miniaturas para cambiarla
function Galeria({ imagenes }) {
    const [actual, setActual] = useState(0);
    const imagen = imagenes[actual];

    return (
        <div className="flex flex-col gap-2">
            {/* en el panel la imagen queda chica: un clic la abre en grande */}
            <a href={imagen.src} target="_blank" rel="noreferrer" className="block" title="Abrir en grande">
                <img src={imagen.src} alt={imagen.alt} width="1280" height="800" className="aspect-[16/10] w-full rounded-md border border-borde-suave object-cover object-top transition-colors hover:border-acento" />
            </a>
            {imagenes.length > 1 && (
                <div className="flex gap-2">
                    {imagenes.map((img, i) => (
                        <button
                            key={img.src}
                            type="button"
                            aria-label={`Ver captura: ${img.alt}`}
                            aria-pressed={i === actual}
                            onClick={() => setActual(i)}
                            className={`flex-1 cursor-pointer overflow-hidden rounded border transition-opacity ${i === actual ? 'border-acento' : 'border-borde-chip opacity-60 hover:opacity-100'}`}
                        >
                            <img src={img.src} alt="" width="1280" height="800" loading="lazy" className="block aspect-[16/10] w-full object-cover object-top" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Galeria
