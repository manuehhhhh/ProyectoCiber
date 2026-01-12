const ID_USUARIO_LOGUEADO = 1; 
let ID_POST_ACTUAL_EN_MODAL = null; // Variable para saber qué post comentamos

document.addEventListener('DOMContentLoaded', () => {
    cargarPerfilUsuario();
    cargarPublicaciones();
    configurarDropdown();
    inicializarContador();
    configurarModalComentarios(); // <--- IMPORTANTE: Iniciar el modal
});

// ==========================================
// 1. LÓGICA DEL MODAL (COMENTARIOS)
// ==========================================

function configurarModalComentarios() {
    const modal = document.getElementById('modal-comentarios');
    const btnCerrar = document.getElementById('btn-cerrar-modal');
    const btnEnviar = document.getElementById('btn-enviar-comentario');

    if(modal && btnCerrar) {
        // Cerrar con la X
        btnCerrar.addEventListener('click', () => modal.classList.add('oculto'));
        
        // Cerrar clicando fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('oculto');
        });

        // Botón enviar
        if(btnEnviar) btnEnviar.addEventListener('click', enviarComentario);
    }
}

// --- ABRIR MODAL ---
async function abrirModalComentarios(idPost) {
    ID_POST_ACTUAL_EN_MODAL = idPost;
    const modal = document.getElementById('modal-comentarios');
    const lista = document.getElementById('lista-comentarios-modal');
    const input = document.getElementById('input-nuevo-comentario');
    const contador = document.getElementById('contador-comentario');

    if(!modal) return;

    modal.classList.remove('oculto');
    lista.innerHTML = '<p class="cargando-texto" style="text-align:center; padding:20px;">Cargando comentarios...</p>';
    
    // Reiniciar input y contador
    input.value = ''; 
    if(contador) contador.textContent = '200';

    try {
        const res = await fetch(`/api/comments/${idPost}`);
        const comentarios = await res.json();
        
        lista.innerHTML = ''; 

        if (comentarios.length === 0) {
            lista.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">Sé el primero en comentar.</p>';
        } else {
            for (const com of comentarios) {
                const autor = await obtenerDatosAutor(com.id_miembro);
                
                const fechaObj = new Date(com.tiempo_comentario);
                const fecha = fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // NUEVA ESTRUCTURA HTML
                const html = `
                    <div class="bloque_comentario">
                        <img src="img/avatar_placeholder.png" class="avatar_comentario">
                        
                        <div class="contenedor_burbuja">
                            <div class="burbuja_comentario">
                                <div class="header_comentario">
                                    <span class="autor_comentario">${autor.nombre}</span>
                                    <span class="usuario_comentario_modal">${autor.handle}</span>
                                </div>
                                <p class="texto_comentario">${com.contenido_textual_comentario}</p>
                            </div>
                            <span class="fecha_comentario">${fecha}</span>
                        </div>
                    </div>
                `;
                lista.innerHTML += html;
            }
            // Bajar scroll
            lista.scrollTop = lista.scrollHeight;
        }

        // INICIAR CONTADOR DEL MODAL (Llamamos a la función aquí para asegurar que el input existe visible)
        inicializarContadorComentarios();

    } catch (error) {
        console.error(error);
        lista.innerHTML = '<p>Error al cargar comentarios.</p>';
    }
}

// --- NUEVA LÓGICA: CONTADOR COMENTARIOS ---
function inicializarContadorComentarios() {
    const input = document.getElementById('input-nuevo-comentario');
    const contador = document.getElementById('contador-comentario');
    const MAX = 200;

    // Removemos listener previo para evitar duplicados si se cierra y abre
    const nuevoInput = input.cloneNode(true);
    input.parentNode.replaceChild(nuevoInput, input);
    
    // Volvemos a capturar el elemento nuevo
    const inputLimpio = document.getElementById('input-nuevo-comentario');

    inputLimpio.addEventListener('input', (e) => {
        let len = e.target.value.length;
        let rest = MAX - len;

        if(rest < 0) {
            e.target.value = e.target.value.substring(0, MAX);
            rest = 0;
        }

        contador.textContent = rest;
        contador.style.color = rest === 0 ? 'red' : '#4fc1e9';
    });

    // Re-conectar el enter para enviar (porque clonamos el nodo)
    inputLimpio.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('btn-enviar-comentario').click();
        }
    });
}

// --- ENVIAR COMENTARIO ---
async function enviarComentario() {
    const input = document.getElementById('input-nuevo-comentario');
    const texto = input.value.trim();
    if (!texto) return;

    try {
        const res = await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_post: ID_POST_ACTUAL_EN_MODAL,
                id_miembro: ID_USUARIO_LOGUEADO,
                contenido: texto
            })
        });

        if (res.ok) {
            input.value = ''; 
            // Recargar el modal para ver mi comentario nuevo
            abrirModalComentarios(ID_POST_ACTUAL_EN_MODAL);
            // Actualizar el numerito en el feed de fondo
            cargarPublicaciones(); 
        }

    } catch (error) {
        console.error("Error al comentar", error);
    }
}


// ==========================================
// 2. CARGA DE DATOS (FEED Y PERFIL)
// ==========================================

async function cargarPublicaciones() {
    const contenedor = document.getElementById('lista-publicaciones');
    
    // Guardamos scroll para que no salte feo al recargar
    const scrollActual = contenedor ? contenedor.scrollTop : 0;

    try {
        const res = await fetch('/api/post');
        const posts = await res.json();
        if(contenedor) contenedor.innerHTML = '';

        if (posts.length === 0) {
            contenedor.innerHTML = '<p style="text-align:center; padding:20px">No hay posts.</p>';
            return;
        }

        for (const post of posts) {
            const datosAutor = await obtenerDatosAutor(post.id_usuario);

            // Likes
            let cantidadLikes = 0;
            let claseCorazon = "fa-regular"; 
            let colorLike = ""; 
            try {
                const resLikes = await fetch(`/api/likes/${post.id_post}?id_usuario_actual=${ID_USUARIO_LOGUEADO}`);
                const dataLikes = await resLikes.json();
                cantidadLikes = dataLikes.cantidad;
                if (dataLikes.dio_like) { claseCorazon = "fa-solid"; colorLike = "color: #e0245e;"; }
            } catch (e) {}

            // Comentarios (Contador)
            let cantidadComentarios = 0;
            try {
                const resComm = await fetch(`/api/comments/count/${post.id_post}`);
                const dataComm = await resComm.json();
                cantidadComentarios = dataComm.cantidad;
            } catch(e) {}

            const html = `
                <div class="tarjeta_publicacion">
                    <div class="encabezado_post">
                        <div class="autor_info">
                            <img src="img/avatar_placeholder.png" class="avatar_post">
                            <div class="nombres_post">
                                <span class="nombre_real">${datosAutor.nombre}</span>
                                <span class="usuario">${datosAutor.handle}</span>
                            </div>
                        </div>
                        <span class="tiempo">Hace 2 horas</span>
                    </div>
                    
                    <div class="contenido_post">
                        ${post.contenido_textual_post}
                    </div>

                    <div class="footer_post">
                        <div class="accion_social" onclick="darLike(${post.id_post}, this)">
                            <span class="numero-likes">${cantidadLikes}</span> 
                            <i class="${claseCorazon} fa-heart" style="${colorLike}"></i> 
                        </div>
                        <div class="accion_social" onclick="abrirModalComentarios(${post.id_post})">
                            <span>${cantidadComentarios}</span> <i class="fa-regular fa-comment"></i>
                        </div>
                    </div>
                </div>
            `;
            contenedor.innerHTML += html;
        }
        
        // if(contenedor) contenedor.scrollTop = scrollActual;

    } catch (error) {
        console.error("Error posts", error);
    }
}

// --- Helpers ---

async function obtenerDatosAutor(id) {
    // Busca en Persona, Dependencia u Organización
    try {
        const res = await fetch(`/api/persona/${id}`);
        if (res.ok) {
            const data = await res.json();
            return { nombre: `${data.nombres} ${data.apellidos}`, handle: `@usuario${id}` };
        }
    } catch(e) {}
    try {
        const res = await fetch(`/api/dependenciauniversitaria/${id}`);
        if (res.ok) {
            const data = await res.json();
            return { nombre: data.nombre_dependencia, handle: `@dependencia` };
        }
    } catch(e) {}
    try {
        const res = await fetch(`/api/organizacionasociada/${id}`);
        if (res.ok) {
            const data = await res.json();
            return { nombre: data.nombre_organizacion, handle: `@organizacion` };
        }
    } catch(e) {}
    return { nombre: "Usuario " + id, handle: "@desconocido" };
}

async function darLike(idPost, elementoDiv) {
    try {
        const respuesta = await fetch('/api/likes/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_post: idPost, id_miembro: ID_USUARIO_LOGUEADO })
        });
        const datos = await respuesta.json();

        if (respuesta.ok) {
            const icono = elementoDiv.querySelector('i');
            const spanNumero = elementoDiv.querySelector('.numero-likes');
            let numeroActual = parseInt(spanNumero.textContent);

            if (datos.estado === 'con_like') {
                icono.classList.remove('fa-regular'); icono.classList.add('fa-solid'); icono.style.color = '#e0245e';
                spanNumero.textContent = numeroActual + 1;
            } else {
                icono.classList.remove('fa-solid'); icono.classList.add('fa-regular'); icono.style.color = '';
                spanNumero.textContent = numeroActual - 1;
            }
        }
    } catch (error) {}
}

async function cargarPerfilUsuario() {
    try {
        const res = await fetch(`/api/persona/${ID_USUARIO_LOGUEADO}`);
        const usuario = await res.json();
        document.querySelector('.nombre_top').textContent = usuario.nombres + ' ' + usuario.apellidos;
        document.querySelector('.usuario_top').textContent = usuario.correo_universitario;
    } catch (error) {}
}

function inicializarContador() {
    const txtInput = document.getElementById('txt-publicacion');
    const spanContador = document.getElementById('contador-caracteres');
    if(txtInput && spanContador) {
        txtInput.addEventListener('input', (e) => {
            const MAX = 200;
            let len = e.target.value.length;
            let rest = MAX - len;
            if(rest < 0) { e.target.value = e.target.value.substring(0, MAX); rest = 0; }
            spanContador.textContent = rest;
        });
    }
}

function configurarDropdown() {
    const btn = document.getElementById('btn-dropdown');
    const menu = document.getElementById('menu-dropdown');
    if(btn && menu) {
        btn.addEventListener('click', () => menu.classList.toggle('oculto'));
        document.addEventListener('click', (e) => {
            if (!btn.contains(e.target) && !menu.contains(e.target)) menu.classList.add('oculto');
        });
    }
}