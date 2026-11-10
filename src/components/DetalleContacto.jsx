import TituloSeccion from './TituloSeccion.jsx';

function DetalleContacto({ contacto }) {
    return (
        <div className="flex flex-col gap-5">
            <TituloSeccion ruta={contacto.ruta} titulo={contacto.titulo} />
            <div className="flex flex-col gap-3 text-sm">
                <a href={`mailto:${contacto.correo}`}>{contacto.correo}</a>
                {contacto.enlaces.map((e) => <a key={e.texto} href={e.url} target="_blank" rel="noreferrer">{e.texto}</a>)}
            </div>
        </div>
    );
}

export default DetalleContacto
