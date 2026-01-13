/**
 * ARCHIVO PRINCIPAL: main.js
 * Controla toda la lógica del Frontend.
 * Versión: Incluye Perfil, Amistad, Comentarios y SUBIDA DE IMÁGENES.
 */

const ID_USUARIO_LOGUEADO = 45; 
let ID_POST_ACTUAL_EN_MODAL = null;
let archivoPostSeleccionado = null; // Variable global para la imagen del post

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
    configurarInputImagenPost();  //  Eventos para la camarita
    configurarBuscador();              //Eventos para el buscador global
});

// ==========================================
// 2. NAVEGACIÓN (SPA) 🧭
// ==========================================

function configurarNavegacion() {
    // 1. Botón Inicio
    const btnInicio = document.querySelector('.item_menu:nth-child(1)');
    if(btnInicio) {
        btnInicio.addEventListener('click', (e) => {
            window.location.href = 'index.html'; 
        });
    }

    // 2. Perfil en la barra derecha
    const perfilDerecha = document.getElementById('info-usuario-logueado');
    if(perfilDerecha) {
        perfilDerecha.style.cursor = 'pointer';
        perfilDerecha.addEventListener('click', () => irAlPerfil(ID_USUARIO_LOGUEADO));
    }
}

async function irAlPerfil(idUsuario) {
    const columnaCentral = document.querySelector('.columna_central');
    columnaCentral.innerHTML = '<p style="text-align:center; margin-top:50px;">Cargando perfil...</p>';

    try {
        const idPerfil = parseInt(idUsuario);
        const idLogueado = parseInt(ID_USUARIO_LOGUEADO);

        // 1. OBTENER DATOS
        const res = await fetch(`/api/profile/${idPerfil}`);
        if(!res.ok) throw new Error("Error al cargar perfil");
        const datos = await res.json();

        // 2. LÓGICA BOTÓN SEGUIR / AMIGOS
        let htmlBotonAccion = '';
        if (idPerfil !== idLogueado) {
            try {
                const resStatus = await fetch(`/api/relationship/status?id_origen=${idLogueado}&id_destino=${idPerfil}`);
                const dataStatus = await resStatus.json();
                
                let textoBtn = "Seguir";
                let claseBtn = "btn_seguir";
                let iconoBtn = '<i class="fa-solid fa-user-plus"></i>';

                if (dataStatus.estado === 'SIGUE') {
                    textoBtn = "Siguiendo";
                    claseBtn = "btn_siguiendo";
                    iconoBtn = '<i class="fa-solid fa-check"></i>';
                } else if (dataStatus.estado === 'AMIGO') {
                    textoBtn = "Amigos";
                    claseBtn = "btn_amigo";
                    iconoBtn = '<i class="fa-solid fa-user-group"></i>';
                }

                htmlBotonAccion = `
                    <button id="btn-relacion-perfil" class="btn_accion_perfil ${claseBtn}" onclick="toggleSeguir(${idPerfil})">
                        ${iconoBtn} <span>${textoBtn}</span>
                    </button>`;
            } catch(e) { console.error(e); }
        }

        // 3. BADGE CARRERA
        let htmlCarrera = datos.carrera ? `<span class="badge naranja">${datos.carrera}</span>` : '';

        // ============================================================
        // 4. AVATAR (CORREGIDO: Usamos datos.foto_perfil)
        // ============================================================
        // Antes decía datos.foto, pero la base de datos manda datos.foto_perfil
        const avatarUrl = datos.foto_perfil ? datos.foto_perfil : 'img/avatar_placeholder.png';
        
        // 5. HTML COMPLETO
        const htmlPerfil = `
            <div class="perfil_container">
                <div class="perfil_banner"></div> 
                <div class="perfil_info_seccion">
                    <div class="contenedor_avatar_perfil">
                        <img src="${avatarUrl}" class="avatar_perfil_grande" id="img-avatar-perfil-visual">
                        
                        ${idPerfil === idLogueado ? `
                            <div class="icono_editar_foto" onclick="document.getElementById('input-foto-perfil').click()">
                                <i class="fa-solid fa-pencil"></i>
                            </div>
                            <input type="file" id="input-foto-perfil" accept="image/*" style="display: none;" onchange="subirFotoPerfil(this)">
                        ` : ''}
                    </div>

                    <div style="position: absolute; top: 15px; right: 20px;">
                        ${htmlBotonAccion}
                    </div>

                    <div class="fila_nombre_stats">
                        <div class="nombres_perfil">
                            <h2>${datos.nombre}</h2>
                            <span class="handle_perfil">@${datos.handle}</span>
                        </div>
                        
                        <div class="stats_perfil">
                            <div class="stat_item">
                                <span class="stat_numero" id="num-seguidores">${datos.stats.seguidores}</span>
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

            <div id="lista-publicaciones-perfil" class="feed_publicaciones"></div>
            <div id="lista-seguidos-perfil" class="contenedor_seguidos oculto"></div>
        `;

        columnaCentral.innerHTML = htmlPerfil;

        // Cargar Posts
        const contenedorPosts = document.getElementById('lista-publicaciones-perfil');
        if(datos.posts.length === 0) {
            contenedorPosts.innerHTML = '<p style="text-align:center; color:#777; padding:20px">No hay publicaciones.</p>';
        } else {
            for (const post of datos.posts) {
                const htmlPost = await crearHTMLTarjetaPost(post, datos, true); 
                contenedorPosts.innerHTML += htmlPost;
            }
        }

        // Cargar Seguidos
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
                    </div>`;
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
// 3. IMÁGENES Y PUBLICACIÓN 📸
// ==========================================

// Configura el input file oculto para posts
function configurarInputImagenPost() {
    const btnCamara = document.getElementById('btn-select-imagen-post');
    const input = document.getElementById('input-imagen-post');
    const previewDiv = document.getElementById('preview-imagen-post');
    const previewImg = previewDiv ? previewDiv.querySelector('img') : null;
    const btnBorrar = document.getElementById('btn-borrar-preview');

    if(btnCamara && input) {
        btnCamara.addEventListener('click', () => input.click());

        input.addEventListener('change', (e) => {
            if(e.target.files && e.target.files[0]) {
                archivoPostSeleccionado = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImg.src = e.target.result;
                    previewDiv.style.display = 'flex';
                }
                reader.readAsDataURL(archivoPostSeleccionado);
            }
        });

        if(btnBorrar) {
            btnBorrar.addEventListener('click', () => {
                input.value = '';
                archivoPostSeleccionado = null;
                previewDiv.style.display = 'none';
            });
        }
    }
}

// Subir Foto de Perfil (Llamada desde el HTML generado en irAlPerfil)
async function subirFotoPerfil(inputElement) {
    if(inputElement.files && inputElement.files[0]) {
        const archivo = inputElement.files[0];
        const imgVisual = document.getElementById('img-avatar-perfil-visual');
        const iconoEditar = document.querySelector('.icono_editar_foto');

        imgVisual.style.opacity = '0.5';
        if(iconoEditar) iconoEditar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

        try {
            const formData = new FormData();
formData.append('tipo_subida', 'avatar'); 
formData.append('foto', archivo);

            const res = await fetch(`/api/miembro/${ID_USUARIO_LOGUEADO}/foto`, {
                method: 'POST',
                body: formData
            });

            if(res.ok) {
                const data = await res.json();
                // Timestamp para evitar caché
                imgVisual.src = `${data.ruta}?t=${new Date().getTime()}`;
                cargarPerfilUsuarioLateral(); 
            } else { alert("Error al subir la foto"); }
        } catch (error) { console.error(error); } 
        finally {
            imgVisual.style.opacity = '1';
            if(iconoEditar) iconoEditar.innerHTML = '<i class="fa-solid fa-pencil"></i>';
            inputElement.value = '';
        }
    }
}

// Botón Publicar (Actualizado para FormData)
function configurarBotonPublicar() {
    const btnPublicar = document.querySelector('.caja_crear_publicacion .boton_publicar');
    const txtInput = document.getElementById('txt-publicacion');
    const contador = document.getElementById('contador-caracteres');
    const previewDiv = document.getElementById('preview-imagen-post');
    const inputImagen = document.getElementById('input-imagen-post');
    
    if (btnPublicar && txtInput) {
        const nuevoBtn = btnPublicar.cloneNode(true);
        btnPublicar.parentNode.replaceChild(nuevoBtn, btnPublicar);
        
        nuevoBtn.addEventListener('click', async () => {
            const contenido = txtInput.value.trim();
            if (!contenido && !archivoPostSeleccionado) {
                alert("Escribe algo o sube una imagen");
                return;
            }
            
            nuevoBtn.textContent = 'Subiendo...'; 
            nuevoBtn.disabled = true;
            
            try {
                const formData = new FormData();
                formData.append('id_usuario', ID_USUARIO_LOGUEADO);
                formData.append('contenido', contenido);
                formData.append('tipo_subida', 'post');

                if (archivoPostSeleccionado) {
                    formData.append('imagen_post', archivoPostSeleccionado);
                }

                const res = await fetch('/api/publicar', {
                    method: 'POST',
                    body: formData 
                });
                
                if (res.ok) { 
                    txtInput.value = ''; 
                    if(inputImagen) inputImagen.value = '';
                    archivoPostSeleccionado = null;
                    if(previewDiv) previewDiv.style.display = 'none';
                    if(contador) contador.textContent = '200'; 
                    await cargarPublicacionesInicio(); 
                } else { alert('Error al publicar'); }
            } catch (error) { alert('Error de conexión'); } 
            finally { 
                nuevoBtn.textContent = 'Publicar'; 
                nuevoBtn.disabled = false; 
            }
        });
    }
}

// ==========================================
// 4. GENERACIÓN DE TARJETAS 🃏
// ==========================================

async function crearHTMLTarjetaPost(post, autorPredefinido = null, esVistaPerfil = false) {
    let datosAutor = autorPredefinido;
    
    if (!datosAutor || !datosAutor.handle) { 
        datosAutor = await obtenerDatosAutor(post.id_usuario);
    }
    
    const nombre = datosAutor.nombre || "Usuario";
    const handle = datosAutor.handle || "@usuario";
    const urlFoto = datosAutor.foto || datosAutor.foto_perfil;
    const avatarAutor = urlFoto ? urlFoto : 'img/avatar_placeholder.png';
    const tiempoTexto = formatearTiempo(post.tiempo_post);
    
    // Likes y Comentarios
    let likes = 0; let claseCorazon = "fa-regular"; let colorLike = "";
    try {
        const rL = await fetch(`/api/likes/${post.id_post}?id_usuario_actual=${ID_USUARIO_LOGUEADO}`);
        const dL = await rL.json();
        likes = dL.cantidad;
        if(dL.dio_like) { claseCorazon = "fa-solid"; colorLike = "color:#e0245e"; }
    } catch(e){}

    let comentarios = 0;
    try { const rC = await fetch(`/api/comments/count/${post.id_post}`); const dC = await rC.json(); comentarios = dC.cantidad; } catch(e){}

    // Imagen
    let htmlImagenPost = '';
    if (post.contenido_multimedia_post) {
        htmlImagenPost = `
            <div class="contenedor_multimedia_post">
                <img src="${post.contenido_multimedia_post}" class="imagen_post_feed">
            </div>`;
    }

    // ============================================================
    // LÓGICA DEL BOTÓN ELIMINAR (MODIFICADA)
    // ============================================================
    let htmlBotonEliminar = '';
    if (post.id_usuario == ID_USUARIO_LOGUEADO && esVistaPerfil === true) {
        htmlBotonEliminar = `
            <div class="accion_social boton_eliminar" onclick="eliminarPost(${post.id_post})" title="Eliminar">
                <i class="fa-solid fa-trash"></i>
            </div>
        `;
    }
    // ============================================================

    return `
        <div class="tarjeta_publicacion" id="post-${post.id_post}">
            <div class="encabezado_post">
                <div class="autor_info">
                    <img src="${avatarAutor}" class="avatar_post">
                    <div class="nombres_post">
                        <span class="nombre_real" onclick="irAlPerfil(${post.id_usuario})" style="cursor:pointer">${nombre}</span>
                        <span class="usuario" onclick="irAlPerfil(${post.id_usuario})" style="cursor:pointer">${handle}</span>
                    </div>
                </div>
                <span class="tiempo">${tiempoTexto}</span>
            </div>
            
            <div class="contenido_post">${post.contenido_textual_post}</div>
            ${htmlImagenPost}

            <div class="footer_post">
                <div style="display:flex; gap:20px;">
                    <div class="accion_social" onclick="darLike(${post.id_post}, this)">
                        <span class="numero-likes">${likes}</span> <i class="${claseCorazon} fa-heart" style="${colorLike}"></i> 
                    </div>
                    <div class="accion_social" onclick="abrirModalComentarios(${post.id_post})">
                        <span>${comentarios}</span> <i class="fa-regular fa-comment"></i>
                    </div>
                </div>
                
                ${htmlBotonEliminar}
            </div>
        </div>
    `;
}

async function cargarPublicacionesInicio() {
    const contenedor = document.getElementById('lista-publicaciones');
    if(!contenedor) return; 
    
    contenedor.innerHTML = '<p style="text-align:center; padding:20px">Cargando...</p>';
    try {
        // Antes de cargar, configurar el botón de publicar por si se recargó el DOM
        configurarBotonPublicar();

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
// 5. HELPERS Y UTILS 🛠️
// ==========================================

function formatearTiempo(fechaISO) {
    const ahora = new Date();
    const fecha = new Date(fechaISO);
    const dif = Math.floor((ahora - fecha) / 1000); 

    if(dif < 60) return "Hace un momento";
    const min = Math.floor(dif/60); if(min < 60) return `Hace ${min} min`;
    const horas = Math.floor(min/60); if(horas <= 5) return `Hace ${horas} h`;
    return fecha.toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

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
        
        // Devolvemos también la foto (si la API de miembro la trae, aseguramos que el controller la incluya)
        return { nombre, handle, foto: dataM.foto_perfil };
    } catch(e) { 
        return { nombre: "Usuario "+id, handle: "@usuario"+id, foto: null }; 
    }
}

async function cargarPerfilUsuarioLateral() {
    try {
        const d = await obtenerDatosAutor(ID_USUARIO_LOGUEADO);
        document.querySelector('.nombre_top').textContent = d.nombre;
        document.querySelector('.usuario_top').textContent = d.handle;
        if(d.foto) {
            // Actualizar avatar lateral con timestamp para refrescar caché
            document.querySelector('.avatar_top').src = `${d.foto}?t=${new Date().getTime()}`;
        }
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
// 6. INTERACCIONES 💬
// ==========================================

async function toggleSeguir(idDestino) {
    const btn = document.getElementById('btn-relacion-perfil');
    const spanSeguidores = document.getElementById('num-seguidores');
    if(!btn) return;
    btn.disabled = true; 
    
    try {
        const res = await fetch('/api/relationship/follow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_solicitador: ID_USUARIO_LOGUEADO, id_receptor: idDestino })
        });
        const data = await res.json();
        let cantActual = parseInt(spanSeguidores.textContent) || 0;

        if (data.nuevo_estado === 'NO_SIGUE') {
            btn.className = "btn_accion_perfil btn_seguir";
            btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> <span>Seguir</span>';
            spanSeguidores.textContent = Math.max(0, cantActual - 1);
        } else if (data.nuevo_estado === 'SIGUE') {
            btn.className = "btn_accion_perfil btn_siguiendo";
            btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Siguiendo</span>';
            spanSeguidores.textContent = cantActual + 1;
        } else if (data.nuevo_estado === 'AMIGO') {
            btn.className = "btn_accion_perfil btn_amigo";
            btn.innerHTML = '<i class="fa-solid fa-user-group"></i> <span>Amigos</span>';
            spanSeguidores.textContent = cantActual + 1;
            alert("¡Ahora están conectados como amigos!");
        }
    } catch (error) { console.error(error); alert("Error de conexión"); } 
    finally { btn.disabled = false; }
}

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
    inicializarContadorComentarios(); 

    try {
        const res = await fetch(`/api/comments/${idPost}`); 
        const comentarios = await res.json();
        lista.innerHTML = '';
        if (comentarios.length === 0) lista.innerHTML = '<p style="text-align:center;color:#999;margin-top:20px">Sé el primero en comentar.</p>';

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
            abrirModalComentarios(ID_POST_ACTUAL_EN_MODAL); 
            cargarPublicacionesInicio(); 
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
    nuevoInput.addEventListener('keypress', (e)=>{ if(e.key==='Enter') enviarComentario(); });
}

// ==========================================
// LÓGICA DEL BUSCADOR 🔍
// ==========================================
function configurarBuscador() {
    const input = document.getElementById('input-busqueda-global');
    const lista = document.getElementById('lista-resultados-busqueda');

    if (!input || !lista) return;

    // Evento al escribir
    input.addEventListener('input', async (e) => {
        const texto = e.target.value.trim();

        if (texto.length === 0) {
            lista.classList.add('oculto');
            lista.innerHTML = '';
            return;
        }

        try {
            const res = await fetch(`/api/search?q=${texto}`);
            const resultados = await res.json();

            lista.innerHTML = ''; // Limpiar anteriores

            if (resultados.length > 0) {
                lista.classList.remove('oculto');
                
                resultados.forEach(item => {
                    // Avatar fallback
                    const avatar = item.foto ? item.foto : 'img/avatar_placeholder.png';
                    
                    const div = document.createElement('div');
                    div.className = 'item_resultado';
                    div.innerHTML = `
                        <img src="${avatar}" class="avatar_resultado">
                        <div class="info_resultado">
                            <span class="nombre_resultado">${item.nombre}</span>
                            <span class="usuario_resultado">@${item.usuario} • ${item.tipo}</span>
                        </div>
                    `;
                    
                    // Al hacer clic, ir al perfil y limpiar buscador
                    div.addEventListener('click', () => {
                        irAlPerfil(item.id);
                        lista.classList.add('oculto');
                        input.value = '';
                    });

                    lista.appendChild(div);
                });
            } else {
                lista.classList.remove('oculto');
                lista.innerHTML = '<div style="padding:10px; color:#777; text-align:center;">No hay resultados</div>';
            }

        } catch (error) {
            console.error("Error buscando:", error);
        }
    });

    // Cerrar buscador si hago clic fuera
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !lista.contains(e.target)) {
            lista.classList.add('oculto');
        }
    });
}

// FUNCIÓN PARA ELIMINAR EL POST
async function eliminarPost(idPost) {
    // 1. Preguntamos confirmación
    if (!confirm("¿Seguro que quieres borrar esto?")) return;

    try {
        // 2. Llamamos al backend
        const res = await fetch(`/api/post/${idPost}?id_usuario_actual=${ID_USUARIO_LOGUEADO}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            // 3. Si funcionó, quitamos el post de la pantalla
            const tarjeta = document.getElementById(`post-${idPost}`);
            if (tarjeta) {
                tarjeta.style.opacity = '0'; // Efecto visual
                setTimeout(() => tarjeta.remove(), 500); // Lo borramos
            }
        } else {
            alert("No se pudo eliminar.");
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
}