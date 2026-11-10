import { secciones } from '../data/proyectos.js';

// version sin 3D (celular o sin WebGL): los proyectos como lista de terminal
function ListaSecciones({ activo, alElegir }) {
    return (
        <nav aria-label="Proyectos">
            <p className="m-0 mb-4 text-xs text-tenue">tomas@portafolio:~$ ls</p>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {secciones.map((s) => (
                    <li key={s.clave}>
                        <button
                            type="button"
                            onClick={() => alElegir(s.clave)}
                            className={`flex w-full cursor-pointer items-baseline justify-between gap-4 rounded-md border px-4 py-3.5 text-left transition-colors ${s.clave === activo ? 'border-acento bg-acento/10' : 'border-borde-chip bg-superficie hover:border-acento'}`}
                        >
                            <span className="text-[15px] text-texto">{s.etiqueta}</span>
                            <span className="text-right text-xs text-tenue">{s.titulo}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default ListaSecciones
