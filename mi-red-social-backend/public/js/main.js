/**
 * ARCHIVO PRINCIPAL: main.js
 * Controla toda la lógica del Frontend (SPA, Feed, Perfil, Interacciones).
 */

const ID_USUARIO_LOGUEADO = 1; 
let ID_POST_ACTUAL_EN_MODAL = null;

// ==========================================
// 1. INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    cargarPerfilUsuarioLateral(); // Carga la mini info del panel derecho
    cargarPublicacionesInicio();  // Carga el feed principal
    configurarDropdown();         // Menú desplegable de ajustes
    configurarNavegacion();       // Control de botones Inicio/Perfil
    inicializarContador();        // Contador de caracteres del post
    configurarModalComentarios(); // Eventos del modal
});

// ==========================================
// 2. NAVEGACIÓN (SPA - Single Page Application) 🧭
// ==========================================

function configurarNavegacion() {
    // 1. Botón "Inicio" del menú lateral
    const btnInicio = document.querySelector('.item_menu:nth-child(1)');
    if(btnInicio) {
        btnInicio.addEventListener('click', (e) => {
            e.preventDefault();
            // Recargamos la página para "resetear" la vista al estado inicial limpio
            window.location.reload(); 
        });
    }

    // 2. Clic en la tarjeta de perfil del panel derecho
    const perfilDerecha = document.getElementById('info-usuario-logueado');
    if(perfilDerecha) {
        perfilDerecha.style.cursor = 'pointer';
        perfilDerecha.addEventListener('click', () => irAlPerfil(ID_USUARIO_LOGUEADO));
    }
}

/**
 * Carga y renderiza la vista de Perfil en la columna central.
 * @param {number} idUsuario - ID del usuario a visualizar.
 */
async function irAlPerfil(idUsuario) {
    const columnaCentral = document.querySelector('.columna_central');
    columnaCentral.innerHTML = '<p style="text-align:center; margin-top:50px;">Cargando perfil...</p>';

    try {
        const res = await fetch(`/api/profile/${idUsuario}`);
        if(!res.ok) throw new Error("Error al cargar perfil");
        const datos = await res.json();

        // Lógica visual: Badge de Carrera (Solo si existe)
        let htmlCarrera = '';
        if (datos.carrera) {
            htmlCarrera = `<span class="badge naranja">${datos.carrera}</span>`;
        }

        // Construcción del HTML del Perfil
        const htmlPerfil = `
            <div class="perfil_container">
                <div class="perfil_banner"></div> <div class="perfil_info_seccion">
                    <div class="contenedor_avatar_perfil">
                        <img src="img/avatar_placeholder.png" class="avatar_perfil_grande">
                        ${idUsuario === ID_USUARIO_LOGUEADO ? '<div class="icono_editar_foto"><i class="fa-solid fa-pencil"></i></div>' : ''}
                    </div>

                    <div class="fila_nombre_stats">
                        <div class="nombres_perfil">
                            <h2>${datos.nombre}</h2>
                            <span class="handle_perfil">@${datos.handle}</span>
                        </div>
                        
                        <div class="stats_perfil">
                            <div class="stat_item">
                                <span class="stat_numero">${datos.stats.seguidores}</span>
                                <span class="stat_label">Seguidores</span>
                            </div>
                            <div class="stat_item">
                                <span class="stat_numero">${datos.stats.seguidos}</span>
                                <span class="stat_label">Seguidos</span>
                            </div>
                        </div>

                        <div class="badges_perfil">
                            <span class="badge amarillo">${datos.tipo}</span>
                            ${htmlCarrera}
                        </div>
                    </div>

                    <div class="tabs_perfil">
                        <button id="tab-posts" class="tab_btn activo" onclick="cambiarTabPerfil('posts')">Publicaciones</button>
                        <button id="tab-seguidos" class="tab_btn" onclick="cambiarTabPerfil('seguidos')">Seguidos</button>
                    </div>
                </div>
            </div>

            <div id="lista-publicaciones-perfil" class="feed_publicaciones">
                </div>

            <div id="lista-seguidos-perfil" class="contenedor_seguidos oculto">
                </div>
        `;

        columnaCentral.innerHTML = htmlPerfil;

        // --- RENDERIZADO DE CONTENIDO ---

        // 1. Cargar Posts del Perfil
        const contenedorPosts = document.getElementById('lista-publicaciones-perfil');
        if(datos.posts.length === 0) {
            contenedorPosts.innerHTML = '<p style="text-align:center; color:#777; padding:20px">No hay publicaciones.</p>';
        } else {
            for (const post of datos.posts) {
                // Pasamos 'datos' como autorPredefinido para optimizar y no hacer fetch extra
                const htmlPost = await crearHTMLTarjetaPost(post, datos);
                contenedorPosts.innerHTML += htmlPost;
            }
        }

        // 2. Cargar Lista de Seguidos
        const contenedorSeguidos = document.getElementById('lista-seguidos-perfil');
        if(datos.listaSeguidos && datos.listaSeguidos.length > 0) {
            datos.listaSeguidos.forEach(persona => {
                const htmlSeguido = `
                    <div class="item_seguido">
                        <div class="info_seguido_izq" onclick="irAlPerfil(${persona.id})">
                            <img src="img/avatar_placeholder.png" class="avatar_seguido">
                            <div class="textos_seguido">
                                <span class="nombre_seguido">${persona.nombre}</span>
                                <span class="handle_seguido">@${persona.handle}</span>
                            </div>
                        </div>
                        <button class="btn_ver_perfil" onclick="irAlPerfil(${persona.id})">Ver Perfil</button>
                    </div>
                `;
                contenedorSeguidos.innerHTML += htmlSeguido;
            });
        } else {
            contenedorSeguidos.innerHTML = '<p style="text-align:center; color:#777; padding:20px">No sigue a nadie aún.</p>';
        }

    } catch (error) {
        console.error(error);
        columnaCentral.innerHTML = '<p style="text-align:center; color:red;">Error al cargar el perfil.</p>';
    }
}

/**
 * Cambia la visibilidad entre la lista de posts y la lista de seguidos.
 */
function cambiarTabPerfil(tab) {
    const btnPosts = document.getElementById('tab-posts');
    const btnSeguidos = document.getElementById('tab-seguidos');
    const divPosts = document.getElementById('lista-publicaciones-perfil');
    const divSeguidos = document.getElementById('lista-seguidos-perfil');

    if(tab === 'posts') {
        btnPosts.classList.add('activo');
        btnSeguidos.classList.remove('activo');
        divPosts.classList.remove('oculto');
        divSeguidos.classList.add('oculto');
    } else {
        btnPosts.classList.remove('activo');
        btnSeguidos.classList.add('activo');
        divPosts.classList.add('oculto');
        divSeguidos.classList.remove('oculto');
    }
}

// ==========================================
// 3. GENERACIÓN DE TARJETAS (Feed y Perfil) 🃏
// ==========================================

async function crearHTMLTarjetaPost(post, autorPredefinido = null) {
    // Si ya tenemos los datos del autor (ej. estamos en su perfil), los usamos.
    // Si no, los buscamos por ID.
    let datosAutor = autorPredefinido;
    if (!datosAutor || !datosAutor.handle) { // Validación extra
        datosAutor = await obtenerDatosAutor(post.id_usuario);
    }
    
    // Fallbacks de seguridad para nombres
    const nombre = datosAutor.nombre || "Usuario";
    const handle = datosAutor.handle || "@usuario";

    const tiempoTexto = formatearTiempo(post.tiempo_post);
    
    // Obtener Likes
    let likes = 0; let colorLike = ""; let claseCorazon = "fa-regular";
    try {
        const rL = await fetch(`/api/likes/${post.id_post}?id_usuario_actual=${ID_USUARIO_LOGUEADO}`);
        const dL = await rL.json();
        likes = dL.cantidad;
        if(dL.dio_like) { claseCorazon = "fa-solid"; colorLike = "color:#e0245e"; }
    } catch(e){}

    // Obtener Conteo Comentarios
    let comentarios = 0;
    try {
        const rC = await fetch(`/api/comments/count/${post.id_post}`);
        const dC = await rC.json();
        comentarios = dC.cantidad;
    } catch(e){}

    return `
        <div class="tarjeta_publicacion">
            <div class="encabezado_post">
                <div class="autor_info">
                    <img src="img/avatar_placeholder.png" class="avatar_post">
                    <div class="nombres_post">
                        <span class="nombre_real" style="cursor:pointer" onclick="irAlPerfil(${post.id_usuario})">${nombre}</span>
                        <span class="usuario" style="cursor:pointer" onclick="irAlPerfil(${post.id_usuario})">${handle}</span>
                    </div>
                </div>
                <span class="tiempo">${tiempoTexto}</span>
            </div>
            <div class="contenido_post">${post.contenido_textual_post}</div>
            <div class="footer_post">
                <div class="accion_social" onclick="darLike(${post.id_post}, this)">
                    <span class="numero-likes">${likes}</span> <i class="${claseCorazon} fa-heart" style="${colorLike}"></i> 
                </div>
                <div class="accion_social" onclick="abrirModalComentarios(${post.id_post})">
                    <span>${comentarios}</span> <i class="fa-regular fa-comment"></i>
                </div>
            </div>
        </div>
    `;
}

async function cargarPublicacionesInicio() {
    const contenedor = document.getElementById('lista-publicaciones');
    if(!contenedor) return; 
    
    contenedor.innerHTML = '<p style="text-align:center; padding:20px">Cargando...</p>';
    try {
        const res = await fetch('/api/post');
        const posts = await res.json();
        
        contenedor.innerHTML = '';
        if(posts.length === 0) { 
            contenedor.innerHTML = '<p style="text-align:center; padding:20px">No hay publicaciones.</p>'; 
            return; 
        }

        for(const post of posts) {
            const html = await crearHTMLTarjetaPost(post);
            contenedor.innerHTML += html;
        }
    } catch(e) { 
        console.error(e); 
        contenedor.innerHTML = '<p style="text-align:center; color:red">Error al cargar posts.</p>';
    }
}

// ==========================================
// 4. HELPERS Y UTILIDADES 🛠️
// ==========================================

function formatearTiempo(fechaISO) {
    const ahora = new Date();
    const fecha = new Date(fechaISO);
    const dif = Math.floor((ahora - fecha) / 1000); // Segundos

    if(dif < 60) return "Hace un momento";
    
    const min = Math.floor(dif/60);
    if(min < 60) return `Hace ${min} min`;
    
    const horas = Math.floor(min/60);
    if(horas <= 5) return `Hace ${horas} h`;
    
    return fecha.toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Obtiene nombre y handle real consultando las tablas adecuadas
async function obtenerDatosAutor(id) {
    try {
        // 1. Consultar tabla Miembro
        const resM = await fetch(`/api/miembro/${id}`);
        if(!resM.ok) throw new Error();
        const dataM = await resM.json();
        
        const handle = `@${dataM.nombre_usuario}`;
        let nombre = handle;

        // 2. Consultar tabla específica según tipo
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
        
        return { nombre, handle };
    } catch(e) { 
        return { nombre: "Usuario "+id, handle: "@usuario"+id }; 
    }
}

async function cargarPerfilUsuarioLateral() {
    try {
        const d = await obtenerDatosAutor(ID_USUARIO_LOGUEADO);
        document.querySelector('.nombre_top').textContent = d.nombre;
        document.querySelector('.usuario_top').textContent = d.handle;
    } catch(e){}
}

function inicializarContador() {
    const txtInput = document.getElementById('txt-publicacion');
    const spanContador = document.getElementById('contador-caracteres');
    if(txtInput && spanContador) {
        txtInput.addEventListener('input', (e) => {
            const MAX = 200; 
            let len = e.target.value.length;
            let rest = MAX - len; 
            if(rest < 0) {e.target.value = e.target.value.substring(0, MAX); rest=0;}
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

// ==========================================
// 5. INTERACCIONES (Likes, Publicar, Comentar) 💬
// ==========================================

async function darLike(idPost, elementoDiv) {
    try {
        const respuesta = await fetch('/api/likes/toggle', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
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

function configurarBotonPublicar() {
    const btnPublicar = document.querySelector('.caja_crear_publicacion .boton_publicar');
    const txtInput = document.getElementById('txt-publicacion');
    const contador = document.getElementById('contador-caracteres');
    
    if (btnPublicar && txtInput) {
        const nuevoBtn = btnPublicar.cloneNode(true); // Limpiar eventos anteriores
        btnPublicar.parentNode.replaceChild(nuevoBtn, btnPublicar);
        
        nuevoBtn.addEventListener('click', async () => {
            const contenido = txtInput.value.trim();
            if (!contenido) return;
            
            nuevoBtn.textContent = '...'; 
            nuevoBtn.disabled = true;
            
            try {
                const res = await fetch('/api/publicar', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_usuario: ID_USUARIO_LOGUEADO, contenido: contenido })
                });
                if (res.ok) { 
                    txtInput.value = ''; 
                    if(contador) contador.textContent = '200'; 
                    await cargarPublicacionesInicio(); 
                }
            } catch (error) { alert('Error al publicar'); } 
            finally { 
                nuevoBtn.textContent = 'Publicar'; 
                nuevoBtn.disabled = false; 
            }
        });
    }
}

// --- MODAL DE COMENTARIOS ---

async function abrirModalComentarios(idPost) {
    ID_POST_ACTUAL_EN_MODAL = idPost;
    const modal = document.getElementById('modal-comentarios');
    const lista = document.getElementById('lista-comentarios-modal');
    const input = document.getElementById('input-nuevo-comentario');
    const contador = document.getElementById('contador-comentario');
    
    if(!modal) return;
    
    modal.classList.remove('oculto'); 
    lista.innerHTML = '<p style="text-align:center">Cargando...</p>'; 
    input.value = '';
    if(contador) contador.textContent = '200'; 
    
    inicializarContadorComentarios(); // Reactivar contador del modal

    try {
        const res = await fetch(`/api/comments/${idPost}`); 
        const comentarios = await res.json();
        
        lista.innerHTML = '';
        if (comentarios.length === 0) {
            lista.innerHTML = '<p style="text-align:center;color:#999;margin-top:20px">Sé el primero en comentar.</p>';
        }

        for (const com of comentarios) {
            const autor = await obtenerDatosAutor(com.id_miembro);
            const tiempo = formatearTiempo(com.tiempo_comentario);
            
            lista.innerHTML += `
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
                        <span class="fecha_comentario">${tiempo}</span>
                    </div>
                </div>`;
        }
        lista.scrollTop = lista.scrollHeight;
    } catch(e){}
}

async function enviarComentario() {
    const input = document.getElementById('input-nuevo-comentario'); 
    const texto = input.value.trim();
    if (!texto) return;
    
    try {
        const res = await fetch('/api/comments', {
             method: 'POST', headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({id_post: ID_POST_ACTUAL_EN_MODAL, id_miembro: ID_USUARIO_LOGUEADO, contenido: texto})
        });
        if(res.ok) { 
            input.value=''; 
            abrirModalComentarios(ID_POST_ACTUAL_EN_MODAL); // Recargar comentarios
            cargarPublicacionesInicio(); // Actualizar contador de afuera
        }
    } catch(e) { alert('Error al enviar comentario'); }
}

function configurarModalComentarios() {
    const modal = document.getElementById('modal-comentarios'); 
    const btnCerrar = document.getElementById('btn-cerrar-modal');
    
    if(modal && btnCerrar) { 
        btnCerrar.addEventListener('click', ()=>modal.classList.add('oculto')); 
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('oculto'); });
        
        const btnEnviar = document.getElementById('btn-enviar-comentario'); 
        if(btnEnviar) { 
            const n = btnEnviar.cloneNode(true); 
            btnEnviar.parentNode.replaceChild(n, btnEnviar); 
            n.addEventListener('click', enviarComentario); 
        }
    }
}

function inicializarContadorComentarios() {
    const input = document.getElementById('input-nuevo-comentario'); 
    const contador = document.getElementById('contador-comentario');
    if(!input) return;
    
    // Clonar para limpiar eventos
    const n = input.cloneNode(true); 
    input.parentNode.replaceChild(n, input); 
    
    const nuevoInput = document.getElementById('input-nuevo-comentario');
    nuevoInput.focus();
    
    nuevoInput.addEventListener('input', (e)=>{ 
        let r = 200 - e.target.value.length; 
        if(r<0) {e.target.value=e.target.value.substring(0,200); r=0;} 
        contador.textContent=r; 
        contador.style.color=r===0?'red':'#4fc1e9'; 
    });
    
    nuevoInput.addEventListener('keypress', (e)=>{ 
        if(e.key==='Enter') enviarComentario(); 
    });
}