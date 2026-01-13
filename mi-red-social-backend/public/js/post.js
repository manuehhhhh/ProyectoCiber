document.addEventListener('DOMContentLoaded', () => {
    cargarContenidoPost();
});

// --- DATOS DE EJEMPLO ---
const postData = {
    id_post: 101,
    autor: {
        nombre: "Ana Martínez",
        usuario: "anamartinez",
        avatar: "img/avatar_placeholder.png" 
    },
    tiempo: "Hace 2 horas",
    contenido: "¡Explorando nuevos horizontes en el desarrollo web! 🚀\n\nCada día hay algo nuevo que aprender. Hoy estuve trabajando con Web Components y me parece una tecnología fascinante para crear interfaces reutilizables.",
    media: "img/banner_ucab.jpg", // URL de una imagen opcional
    stats: {
        likes: 42,
        comentarios: 5
    },
    comentarios: [
        {
            id: 201,
            autor: {
                nombre: "Carlos Ruiz",
                usuario: "carlosruiz",
                avatar: "img/avatar_placeholder.png"
            },
            tiempo: "Hace 1 hora",
            texto: "¡Totalmente de acuerdo, Ana! Los Web Components son el futuro. ¿Has probado a integrarlos con algún framework como React o Vue?",
            respuestas: [
                {
                    id: 203,
                    autor: {
                        nombre: "Ana Martínez",
                        usuario: "anamartinez",
                        avatar: "img/avatar_placeholder.png"
                    },
                    tiempo: "Hace 45 minutos",
                    texto: "¡Hola Carlos! Aún no, pero es mi siguiente paso. Tengo curiosidad por ver qué tan fluida es la integración.",
                    respuestas: []
                },
                {
                    id: 204,
                    autor: {
                        nombre: "Laura Gómez",
                        usuario: "lauragomez",
                        avatar: "img/avatar_placeholder.png"
                    },
                    tiempo: "Hace 30 minutos",
                    texto: "Yo lo he hecho con Vue y la verdad es que funciona de maravilla. El data binding es muy sencillo de manejar.",
                    respuestas: []
                }
            ]
        },
        {
            id: 202,
            autor: {
                nombre: "Pedro Pérez",
                usuario: "pedroperez",
                avatar: "img/avatar_placeholder.png"
            },
            tiempo: "Hace 25 minutos",
            texto: "Excelente post. ¿Algún recurso o tutorial que recomiendes para empezar con Web Components?",
            respuestas: []
        }
    ]
};


function cargarContenidoPost() {
    const contenedor = document.getElementById('columna-central-post');
    if (!contenedor) return;

    let mediaHTML = '';
    if (postData.media) {
        mediaHTML = `<img src="${postData.media}" alt="Contenido multimedia del post" class="post-imagen-detallada">`;
    }

    const postHTML = `
        <div class="vista-post-detallado">
            <div class="post-autor">
                <img src="${postData.autor.avatar}" alt="Avatar del autor" class="avatar_post">
                <div class="nombres_post">
                    <span class="nombre_real">${postData.autor.nombre}</span>
                    <span class="username">@${postData.autor.usuario}</span>
                </div>
            </div>

            <div class="post-contenido-detallado">
                <p class="post-texto">${postData.contenido}</p>
                ${mediaHTML}
            </div>

            <div class="post-acciones">
                <div class="accion_social">
                    <span>${postData.stats.likes}</span> <i class="fa-regular fa-heart"></i>
                </div>
                <div class="accion_social">
                    <span>${postData.stats.comentarios}</span> <i class="fa-regular fa-comment"></i>
                </div>
            </div>

            <div class="seccion-comentarios">
                <h3 class="titulo-comentarios">Comentarios</h3>
                <div class="lista-comentarios">
                    ${generarHtmlComentarios(postData.comentarios)}
                </div>
            </div>
        </div>
    `;

    contenedor.innerHTML = postHTML;
}

function generarHtmlComentarios(comentarios) {
    if (!comentarios || comentarios.length === 0) {
        return '';
    }

    return comentarios.map(comentario => {
        
        let respuestasHtml = '';
        if (comentario.respuestas && comentario.respuestas.length > 0) {
            // Se envuelve en un div para aplicar el margen de anidación
            respuestasHtml = `
                <div class="comentario-respuesta">
                    ${generarHtmlComentarios(comentario.respuestas)}
                </div>
            `;
        }

        return `
            <div class="comentario" id="comentario-${comentario.id}">
                <img src="${comentario.autor.avatar}" alt="Avatar de ${comentario.autor.nombre}" class="avatar-comentario">
                <div class="comentario-cuerpo">
                    <div class="comentario-burbuja">
                        <span class="comentario-autor">${comentario.autor.nombre}</span>
                        <p class="comentario-texto">${comentario.texto}</p>
                    </div>
                    <span class="comentario-fecha">${comentario.tiempo}</span>
                    ${respuestasHtml}
                </div>
            </div>
        `;
    }).join('');
}
