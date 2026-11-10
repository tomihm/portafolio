import Chip from './Chip.jsx';
import Galeria from './Galeria.jsx';
import TituloSeccion from './TituloSeccion.jsx';

function DetalleProyecto({ proyecto }) {
    return (
        <div className="flex flex-col gap-5">
            <TituloSeccion ruta={proyecto.ruta} titulo={proyecto.titulo} />
            {proyecto.imagenes ? <Galeria imagenes={proyecto.imagenes} /> : (
                <div className="flex aspect-[16/10] items-center justify-center rounded-md border border-dashed border-borde-captura text-[11px] text-apagado">
                    captura del proyecto
                </div>
            )}
            <p className="m-0 text-sm leading-[1.7] text-pretty text-texto-suave">{proyecto.descripcion}</p>
            {proyecto.rol && (
                <div className="flex flex-col gap-2">
                    <div className="text-xs text-acento">mi rol</div>
                    <p className="m-0 text-sm leading-[1.7] text-pretty text-texto-suave">{proyecto.rol}</p>
                </div>
            )}
            {proyecto.destacados && (
                <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[13px] leading-[1.6] text-texto-suave">
                    {proyecto.destacados.map((d) => (
                        <li key={d} className="relative pl-4 before:absolute before:left-0 before:text-acento before:content-['›']">{d}</li>
                    ))}
                </ul>
            )}
            <div className="flex flex-wrap gap-2">
                {proyecto.tecnologias.map((t) => <Chip key={t}>{t}</Chip>)}
            </div>
            <div className="flex gap-6 border-t border-borde-suave pt-2 text-[13px]">
                {proyecto.demo && <a href={proyecto.demo} target="_blank" rel="noreferrer">ver demo ↗</a>}
                <a href={proyecto.codigo} target="_blank" rel="noreferrer">código ↗</a>
            </div>
        </div>
    );
}

export default DetalleProyecto
