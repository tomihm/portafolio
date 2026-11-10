// cada seccion del portafolio: la etiqueta sobre el objeto 3D, el comando del panel y su contenido (demo, imagenes, rol y destacados son opcionales)
import ferreteriaInicio from '../assets/ferreteria/inicio.webp';
import ferreteriaCatalogo from '../assets/ferreteria/catalogo.webp';
import ferreteriaProducto from '../assets/ferreteria/producto.webp';

export const proyectos = [
    {
        clave: 'ferreteria',
        menu: 'ferretería',
        etiqueta: 'ferretería/',
        comando: 'cd ferreteria/',
        ruta: '~/ferreteria · web',
        titulo: 'Ferretería Los Maestros',
        descripcion: 'Tienda en línea con catálogo, stock, carrito, seguimiento de pedidos y panel de administración.',
        imagenes: [
            { src: ferreteriaInicio, alt: 'Página de inicio de la ferretería' },
            { src: ferreteriaCatalogo, alt: 'Catálogo con filtros por categoría' },
            { src: ferreteriaProducto, alt: 'Detalle de producto con stock y carrito' },
        ],
        rol: 'Diseño de la interfaz y la mayor parte de los componentes: header, catálogo con filtros, tarjeta de producto, carrito compartido, login con roles y mapa de despacho.',
        destacados: [
            'Autor de 90 de los 141 commits y de cerca de tres cuartos del código del frontend.',
            'Rediseño completo del sitio: header, inicio, catálogo tipo afiche y carrito con revisión de dirección.',
            '18 archivos de pruebas con Vitest y Testing Library, con reporte de cobertura.',
        ],
        tecnologias: ['React 19', 'React Router', 'Bootstrap', 'Vite', 'Vitest', 'GitHub Actions', 'equipo de 3'],
        demo: 'https://tomihm.github.io/Ferreteria.git.io/',
        codigo: 'https://github.com/tomihm/Ferreteria.git.io',
    },
    {
        clave: 'mygos',
        menu: 'mygos',
        etiqueta: 'mygos/',
        comando: 'cd mygos/',
        ruta: '~/mygos · android',
        titulo: 'Mygos',
        descripcion: 'App para descubrir eventos e ir en grupo con gente afín. Nadie llega solo.',
        tecnologias: ['Kotlin', 'Jetpack Compose', 'Material 3', 'individual'],
        codigo: 'https://github.com/tomihm/Mygos',
    },
    {
        clave: 'bibliotecas',
        menu: 'bibliotecas',
        etiqueta: 'bibliotecas/',
        comando: 'cd bibliotecas/',
        ruta: '~/bibliotecas · backend',
        titulo: 'Gestión de bibliotecas',
        descripcion: 'Diez microservicios para usuarios, libros, préstamos, reservas, multas e inventario.',
        rol: 'Arquitectura e infraestructura: API Gateway, Eureka, Docker y despliegue, además de los servicios de reservas y auditoría.',
        destacados: [
            'Cerca de la mitad del código Java del proyecto.',
            'Seguridad con roles, documentación con Swagger, HATEOAS y migraciones con Flyway.',
            'Comunicación entre servicios con Feign, cobertura con JaCoCo e imágenes Docker publicadas con GitHub Actions.',
        ],
        tecnologias: ['Spring Boot', 'Gateway', 'Eureka', 'MySQL', 'Docker', 'equipo de 4'],
        codigo: 'https://github.com/tomihm/gestionbibliotecas',
    },
];

export const contacto = {
    clave: 'contacto',
    menu: 'contacto',
    etiqueta: 'contacto.txt',
    comando: 'cat contacto.txt',
    ruta: '~/contacto.txt',
    titulo: 'Hablemos',
    correo: 'tomas.hernandez.milla@gmail.com',
    enlaces: [
        { texto: 'github ↗', url: 'https://github.com/tomihm' },
        { texto: 'linkedin ↗', url: 'https://www.linkedin.com/in/tom%C3%A1s-hern%C3%A1ndez-b68b99231/' },
    ],
};

export const secciones = [...proyectos, contacto];

export const buscarSeccion = (clave) => secciones.find((s) => s.clave === clave);
