document.addEventListener('DOMContentLoaded', () => {
    cargarContenidoPost();
});

async function obtenerDatosAutor(id) {
    try {
        const resM = await fetch(`/api/miembro/${id}`);
        if(!resM.ok) throw new Error();
        const dataM = await resM.json();
        
        const handle = `@${dataM.nombre_usuario}`;
        let nombre = handle;

        try {
             if (dataM.tipo_miembro === 'P') {
                const r = await fetch(`/api/persona/${id}`); const p = await r.json(); 
                nombre = p.nombres + ' ' + p.apellidos;
             } else if (dataM.tipo_miembro === 'D') {
                const r = await fetch(`/api/dependenciauniversitaria/${id}`); const d = await r.json(); 
                nombre = d.nombre_dependencia;
             } else if (dataM.tipo_miembro === 'O') {
                 const r = await fetch(`/api/organizacionasociada/${id}`); const o = await r.json(); 
                 nombre = o.nombre_organizacion;
             }
        } catch(e){}
        
        return { nombre, handle, foto: dataM.foto_perfil };
    } catch(e) { 
        return { nombre: "Usuario "+id, handle: "@usuario"+id, foto: null }; 
    }
}

async function cargarContenidoPost() {
    const contenedor = document.getElementById('columna-central-post');
    if (!contenedor) return;

    // Obtener el ID y el tipo del post desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const postType = urlParams.get('type');

    if (!postId || !postType) {
        contenedor.innerHTML = '<p>Error: No se ha especificado el post a cargar.</p>';
        return;
    }

    try {
        // 1. Cargar los datos del post
        const postRes = await fetch(`/api/post/${postId}`);
        if (!postRes.ok) throw new Error('No se pudo cargar la publicación.');
        const postData = await postRes.json();

        // 2. Cargar los datos del autor del post
        const autorData = await obtenerDatosAutor(postData.id_usuario);
        
        const autor = {
            nombre: autorData.nombre,
            usuario: autorData.handle.startsWith('@') ? autorData.handle.substring(1) : autorData.handle,
            avatar: autorData.foto ? autorData.foto : 'img/avatar_placeholder.png'
        };

        let likesCount = 0;
        let comments = [];

        // 3. Si es una publicación, cargar likes y comentarios
        if (postType === 'publicacion') {
            // Cargar cantidad de likes
            const likesRes = await fetch(`/api/likes/${postId}`);
            if (likesRes.ok) {
                const likesData = await likesRes.json();
                likesCount = likesData.cantidad || 0;
            }

            // Cargar comentarios
            const commentsRes = await fetch(`/api/comments/${postId}`);
            if (commentsRes.ok) {
                comments = await commentsRes.json();
            }
        }
        
        // 4. Renderizar el HTML
        let mediaHTML = '';
        if (postData.contenido_multimedia_post) {
            mediaHTML = `<img src="${postData.contenido_multimedia_post}" alt="Contenido multimedia del post" class="post-imagen-detallada">`;
        }

        // Formatear la fecha
        const tiempoTranscurrido = postData.tiempo_post ? new Date(postData.tiempo_post).toLocaleString() : 'Fecha desconocida';

        const htmlComentarios = await generarHtmlComentarios(comments);

        const postHTML = `
            <div class="vista-post-detallado">
                <div class="post-autor">
                    <img src="${autor.avatar}" alt="Avatar del autor" class="avatar_post">
                    <div class="nombres_post">
                        <span class="nombre_real">${autor.nombre}</span>
                        <span class="username">${autorData.handle}</span>
                    </div>
                </div>

                <div class="post-contenido-detallado">
                    <p class="post-texto">${postData.contenido_textual_post}</p>
                    ${mediaHTML}
                </div>
                
                <span class="post-fecha-detallada">${tiempoTranscurrido}</span>

                ${postType === 'publicacion' ? `
                    <div class="post-acciones">
                        <div class="accion_social">
                            <span>${likesCount}</span> <i class="fa-regular fa-heart"></i>
                        </div>
                        <div class="accion_social">
                            <span>${comments.length}</span> <i class="fa-regular fa-comment"></i>
                        </div>
                    </div>

                    <div class="seccion-comentarios">
                        <h3 class="titulo-comentarios">Comentarios</h3>
                        <div class="lista-comentarios">
                            ${htmlComentarios}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        contenedor.innerHTML = postHTML;

    } catch (error) {
        console.error('Error al cargar el post:', error);
        contenedor.innerHTML = `<p style="color: red; text-align: center;">Error al cargar el post: ${error.message}</p>`;
    }
}

async function generarHtmlComentarios(comentarios) {
    if (!comentarios || comentarios.length === 0) {
        return '<p class="no-comentarios">Aún no hay comentarios. ¡Sé el primero en comentar!</p>';
    }

    let html = '';
    for(const comentario of comentarios) {
        const autor = await obtenerDatosAutor(comentario.id_miembro);
        const nombreAutor = autor.nombre;
        const avatarAutor = autor.foto ? autor.foto : 'img/avatar_placeholder.png';
        const tiempoComentario = new Date(comentario.tiempo_comentario).toLocaleString();

        html += `
            <div class="comentario" id="comentario-${comentario.id_comentario}">
                <img src="${avatarAutor}" alt="Avatar de ${nombreAutor}" class="avatar-comentario">
                <div class="comentario-cuerpo">
                    <div class="comentario-burbuja">
                        <span class="comentario-autor">${nombreAutor}</span>
                        <p class="comentario-texto">${comentario.contenido_textual_comentario}</p>
                    </div>
                    <span class="comentario-fecha">${tiempoComentario}</span>
                </div>
            </div>
        `;
    }
    return html;
}