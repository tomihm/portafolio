import { lazy, Suspense, useEffect } from 'react';
import Header from './core/Header.jsx';
import Presentacion from './core/Presentacion.jsx';
import ListaSecciones from './components/ListaSecciones.jsx';
import PanelLateral from './components/PanelLateral.jsx';
import DetalleProyecto from './components/DetalleProyecto.jsx';
import DetalleContacto from './components/DetalleContacto.jsx';
import { buscarSeccion, contacto } from './data/proyectos.js';
import { useSeccionActiva, abrirSeccion, cerrarSeccion } from './utils/seccionUrl.js';
import { useVistaSimple } from './utils/vista.js';
import { ocultarCarga } from './utils/pantallaCarga.js';

// three.js va en un archivo aparte: el celular, que usa la lista, nunca lo descarga
const Escena = lazy(() => import('./components/Escena.jsx'));

// sin escena no hay nada que esperar: la carga solo dura lo que tarda en escribirse el texto
const DURACION_CARGA_SIMPLE = 1800;

const margen = 'px-[clamp(20px,4vw,48px)]';

function App() {
    const activo = useSeccionActiva();
    const seccion = buscarSeccion(activo);
    const simple = useVistaSimple();

    // esc cierra el panel
    useEffect(() => {
        const alTeclear = (e) => { if (e.key === 'Escape') cerrarSeccion(); };
        window.addEventListener('keydown', alTeclear);
        return () => window.removeEventListener('keydown', alTeclear);
    }, []);

    useEffect(() => {
        if (simple) return ocultarCarga(DURACION_CARGA_SIMPLE);
    }, [simple]);

    return (
        <div className={`relative bg-fondo font-mono ${simple ? 'min-h-dvh' : 'h-dvh overflow-hidden'}`}>
            <Header alElegir={abrirSeccion} conMenu={!simple} />
            {simple ? (
                <main className={`flex min-h-dvh flex-col justify-between gap-12 ${margen} pt-24 pb-[clamp(24px,5vh,48px)]`}>
                    <ListaSecciones activo={activo} alElegir={abrirSeccion} />
                    <Presentacion visible={!activo} />
                </main>
            ) : (
                <>
                    <Suspense fallback={null}>
                        <Escena activo={activo} alElegir={abrirSeccion} />
                    </Suspense>
                    <div className="absolute bottom-[clamp(24px,5vh,48px)] left-[clamp(20px,4vw,48px)] z-3">
                        <Presentacion visible={!activo} />
                    </div>
                </>
            )}
            <PanelLateral abierto={Boolean(seccion)} titulo={seccion?.titulo} comando={seccion?.comando ?? ''} alCerrar={cerrarSeccion}>
                {seccion && (seccion.clave === contacto.clave
                    ? <DetalleContacto contacto={seccion} />
                    : <DetalleProyecto key={seccion.clave} proyecto={seccion} />)}
            </PanelLateral>
        </div>
    );
}

export default App
