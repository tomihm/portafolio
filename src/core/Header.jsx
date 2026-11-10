import { secciones } from '../data/proyectos.js';

function Header({ alElegir }) {
    return (
        <header className="pointer-events-none absolute inset-x-0 top-0 z-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-[clamp(20px,4vw,48px)] py-6 text-[13px]">
            <span className="font-medium text-texto">tomas.hernandez</span>
            <nav className="pointer-events-auto flex flex-wrap gap-5">
                {secciones.map((s) => (
                    <button key={s.clave} type="button" className="cursor-pointer text-acento hover:text-acento-claro" onClick={() => alElegir(s.clave)}>
                        {s.menu}
                    </button>
                ))}
            </nav>
        </header>
    );
}

export default Header
