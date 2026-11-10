import { useEffect, useState } from 'react';
import Header from './core/Header.jsx';
import Presentacion from './core/Presentacion.jsx';
import Escena from './components/Escena.jsx';
import PanelLateral from './components/PanelLateral.jsx';
import DetalleProyecto from './components/DetalleProyecto.jsx';
import DetalleContacto from './components/DetalleContacto.jsx';
import { buscarSeccion, contacto } from './data/proyectos.js';

function App() {
    const [activo, setActivo] = useState(null);
    const seccion = buscarSeccion(activo);

    // esc cierra el panel
    useEffect(() => {
        const alTeclear = (e) => { if (e.key === 'Escape') setActivo(null); };
        window.addEventListener('keydown', alTeclear);
        return () => window.removeEventListener('keydown', alTeclear);
    }, []);

    return (
        <div className="relative h-screen overflow-hidden bg-fondo font-mono">
            <Header alElegir={setActivo} />
            <Escena activo={activo} alElegir={setActivo} />
            <Presentacion visible={!activo} />
            <PanelLateral abierto={Boolean(seccion)} comando={seccion?.comando ?? ''} alCerrar={() => setActivo(null)}>
                {seccion && (seccion.clave === contacto.clave
                    ? <DetalleContacto contacto={seccion} />
                    : <DetalleProyecto key={seccion.clave} proyecto={seccion} />)}
            </PanelLateral>
        </div>
    );
}

export default App
