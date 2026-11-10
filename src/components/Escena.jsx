import { useEffect, useRef, useState } from 'react';
import { crearEscena } from '../escena/crearEscena.js';
import { secciones } from '../data/proyectos.js';
import EtiquetaObjeto from './EtiquetaObjeto.jsx';

function Escena({ activo, alElegir }) {
    const hostRef = useRef(null);
    const capaRef = useRef(null);
    const etiquetasRef = useRef({});
    const controlRef = useRef(null);
    const [hover, setHover] = useState(null);

    // three.js vive fuera de React: se crea al montar y se destruye al desmontar
    useEffect(() => {
        const control = crearEscena(hostRef.current, {
            capaEtiquetas: capaRef.current,
            etiquetas: etiquetasRef.current,
            alHover: setHover,
            alElegir,
        });
        controlRef.current = control;
        return () => control.destruir();
    }, [alElegir]);

    useEffect(() => { controlRef.current?.setHover(hover); }, [hover]);
    useEffect(() => { controlRef.current?.setActivo(activo); }, [activo]);

    return (
        <div ref={hostRef} className="absolute inset-0 overflow-hidden bg-fondo">
            <div className="pointer-events-none absolute top-[68px] left-[clamp(20px,4vw,48px)] z-3 text-xs tracking-[0.02em] text-tenue">
                [ haz clic en un objeto para abrir el proyecto ]
            </div>
            <div ref={capaRef} className="pointer-events-none absolute inset-0 z-2 opacity-0 transition-opacity duration-400">
                {secciones.map((s) => (
                    <EtiquetaObjeto
                        key={s.clave}
                        ref={(el) => { etiquetasRef.current[s.clave] = el; }}
                        texto={s.etiqueta}
                        encendida={s.clave === hover || s.clave === activo}
                        onClick={() => alElegir(s.clave)}
                        onPointerEnter={() => setHover(s.clave)}
                        onPointerLeave={() => setHover(null)}
                    />
                ))}
            </div>
            {/* viñeta para oscurecer los bordes */}
            <div className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(ellipse_at_50%_45%,rgba(15,17,22,0)_55%,rgba(15,17,22,0.6)_100%)]" />
            <div className="pointer-events-none absolute inset-0 z-4 flex animate-[desvanecer_.6s_ease_forwards] items-center justify-center bg-fondo text-xs text-tenue">
                tomas@portafolio:~$ cargando escena…
            </div>
        </div>
    );
}

export default Escena
