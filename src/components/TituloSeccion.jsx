// ruta tipo terminal + titulo grande, compartido por proyectos y contacto
function TituloSeccion({ ruta, titulo }) {
    return (
        <>
            <div className="text-xs text-acento">{ruta}</div>
            <h2 className="m-0 font-serif text-[clamp(36px,4vw,48px)] leading-none font-normal">{titulo}</h2>
        </>
    );
}

export default TituloSeccion
