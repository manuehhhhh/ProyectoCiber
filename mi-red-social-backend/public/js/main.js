const ID_USUARIO_LOGUEADO = 1; 
let ID_POST_ACTUAL_EN_MODAL = null;

document.addEventListener('DOMContentLoaded', () => {
    cargarPerfilUsuario();
    cargarPublicaciones();
    configurarDropdown();
    configurarBotonPublicar();
    inicializarContador();
    configurarModalComentarios();
});

// ==========================================
// 1. FORMATO DE TIEMPO EXACTO (REGLA 5 HORAS) ⏰
// ==========================================
function formatearTiempo(fechaISO) {
    const ahora = new Date();
    const fecha = new Date(fechaISO);
    // Diferencia en segundos
    const difSegundos = Math.floor((ahora - fecha) / 1000);

    // CASO 1: Segundos (Menos de 60 seg)
    if (difSegundos < 60) {
        return difSegundos <= 1 ? "Hace 1 segundo" : `Hace ${difSegundos} segundos`;
    }

    const minutos = Math.floor(difSegundos / 60);
    
    // CASO 2: Minutos (Menos de 60 min)
    if (minutos < 60) {
        return minutos === 1 ? "Hace 1 minuto" : `Hace ${minutos} minutos`;
    }

    const horas = Math.floor(minutos / 60);

    // CASO 3: Horas (Hasta 5 horas)
    if (horas <= 5) {
        return horas === 1 ? "Hace 1 hora" : `Hace ${horas} horas`;
    }

    // CASO 4: Más de 5 horas -> Mostrar solo FECHA (DD/MM/AAAA)
    return fecha.toLocaleDateString('es-VE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
}

// ==========================================
// 2. OBTENER DATOS DE AUTOR (LÓGICA MEJORADA) 🧠
// ==========================================
async function obtenerDatosAutor(id) {
    try {
        // PASO 1: Consultar la tabla MIEMBRO para sacar el usuario y el tipo
        const resMiembro = await fetch(`/api/miembro/${id}`);
        
        if (!resMiembro.ok) {
            throw new Error("Miembro no encontrado");
        }

        const dataMiembro = await resMiembro.json();
        const handle = `@${dataMiembro.nombre_usuario}`; // El usuario real de la BD
        let nombreReal = handle; // Por defecto usamos el usuario si falla lo demás

        // PASO 2: Consultar la tabla específica según el TIPO DE MIEMBRO
        // 'P' = Persona, 'D' = Dependencia, 'O' = Organización
        try {
            if (dataMiembro.tipo_miembro === 'P') {
                const resP = await fetch(`/api/persona/${id}`);
                if (resP.ok) {
                    const p = await resP.json();
                    nombreReal = `${p.nombres} ${p.apellidos}`;
                }
            } 
            else if (dataMiembro.tipo_miembro === 'D') {
                // Nota: Asegúrate que la ruta coincida con tu modelo (todo minúsculas)
                const resD = await fetch(`/api/dependenciauniversitaria/${id}`);
                if (resD.ok) {
                    const d = await resD.json();
                    nombreReal = d.nombre_dependencia;
                }
            } 
            else if (dataMiembro.tipo_miembro === 'O') {
                const resO = await fetch(`/api/organizacionasociada/${id}`);
                if (resO.ok) {
                    const o = await resO.json();
                    nombreReal = o.nombre_organizacion;
                }
            }
        } catch (innerError) {
            console.warn("No se pudo obtener el detalle del nombre real", innerError);
        }

        return { nombre: nombreReal, handle: handle };

    } catch (error) {
        // Si falla todo (ej: usuario borrado), mostramos fallback
        return { nombre: "Usuario " + id, handle: "@desconocido" };
    }
}

// ==========================================
// 3. CARGAR PUBLICACIONES (FEED)
// ==========================================
async function cargarPublicaciones() {
    const contenedor = document.getElementById('lista-publicaciones');
    
    try {
        const res = await fetch('/api/post'); // Ya viene ordenado por el backend
        const posts = await res.json();
        
        if(contenedor) contenedor.innerHTML = '';

        if (posts.length === 0) {
            contenedor.innerHTML = '<p style="text-align:center; padding:20px">No hay posts.</p>';
            return;
        }

        for (const post of posts) {
            const datosAutor = await obtenerDatosAutor(post.id_usuario);
            const tiempoTexto = formatearTiempo(post.tiempo_post);

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

            // Comentarios (Conteo)
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
                        <span class="tiempo">${tiempoTexto}</span>
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

    } catch (error) {
        console.error("Error posts", error);
    }
}

// ==========================================
// 4. FUNCIONES DE INTERACCIÓN (Publicar, Likes, Modales)
// ==========================================

function configurarBotonPublicar() {
    const btnPublicar = document.querySelector('.caja_crear_publicacion .boton_publicar');
    const txtInput = document.getElementById('txt-publicacion');
    const contador = document.getElementById('contador-caracteres');

    if (btnPublicar && txtInput) {
        btnPublicar.addEventListener('click', async () => {
            const contenido = txtInput.value.trim();
            if (!contenido) return;

            const textoOriginal = btnPublicar.textContent;
            btnPublicar.textContent = '...';
            btnPublicar.disabled = true;

            try {
                const res = await fetch('/api/publicar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_usuario: ID_USUARIO_LOGUEADO, contenido: contenido })
                });

                if (res.ok) {
                    txtInput.value = '';
                    if (contador) contador.textContent = '200';
                    await cargarPublicaciones();
                } else { alert('Error al publicar.'); }
            } catch (error) { console.error(error); } finally {
                btnPublicar.textContent = textoOriginal;
                btnPublicar.disabled = false;
            }
        });
    }
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

async function cargarPerfilUsuario() {
    try {
        // Obtenemos datos del usuario logueado usando la misma lógica inteligente
        const datos = await obtenerDatosAutor(ID_USUARIO_LOGUEADO);
        document.querySelector('.nombre_top').textContent = datos.nombre;
        document.querySelector('.usuario_top').textContent = datos.handle;
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

// --- MODAL DE COMENTARIOS ---
async function abrirModalComentarios(idPost) {
    ID_POST_ACTUAL_EN_MODAL = idPost;
    const modal = document.getElementById('modal-comentarios');
    const lista = document.getElementById('lista-comentarios-modal');
    const input = document.getElementById('input-nuevo-comentario');
    const contador = document.getElementById('contador-comentario');

    if(!modal) return;
    modal.classList.remove('oculto');
    lista.innerHTML = '<p class="cargando-texto" style="text-align:center;">Cargando...</p>';
    input.value = '';
    if(contador) contador.textContent = '200';

    try {
        const res = await fetch(`/api/comments/${idPost}`);
        const comentarios = await res.json();
        lista.innerHTML = ''; 
        if (comentarios.length === 0) { lista.innerHTML = '<p style="text-align:center; color:#999;">Sé el primero en comentar.</p>'; }
        else {
            for (const com of comentarios) {
                const autor = await obtenerDatosAutor(com.id_miembro);
                const tiempoTexto = formatearTiempo(com.tiempo_comentario); // Usamos la misma función de tiempo

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
                            <span class="fecha_comentario">${tiempoTexto}</span>
                        </div>
                    </div>`;
                lista.innerHTML += html;
            }
            lista.scrollTop = lista.scrollHeight;
        }
        if (typeof inicializarContadorComentarios === "function") inicializarContadorComentarios();
    } catch (e) { console.error(e); }
}

async function enviarComentario() {
    const input = document.getElementById('input-nuevo-comentario');
    const texto = input.value.trim();
    if (!texto) return;
    try {
        const res = await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_post: ID_POST_ACTUAL_EN_MODAL, id_miembro: ID_USUARIO_LOGUEADO, contenido: texto })
        });
        if (res.ok) {
            input.value = ''; 
            abrirModalComentarios(ID_POST_ACTUAL_EN_MODAL);
            cargarPublicaciones(); 
        }
    } catch (error) {}
}

function configurarModalComentarios() {
    const modal = document.getElementById('modal-comentarios');
    const btnCerrar = document.getElementById('btn-cerrar-modal');
    const btnEnviar = document.getElementById('btn-enviar-comentario');
    if(modal && btnCerrar) {
        btnCerrar.addEventListener('click', () => modal.classList.add('oculto'));
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('oculto'); });
        if(btnEnviar) btnEnviar.addEventListener('click', enviarComentario);
    }
}

function inicializarContadorComentarios() {
    const input = document.getElementById('input-nuevo-comentario');
    const contador = document.getElementById('contador-comentario');
    const MAX = 200;
    if(!input || !contador) return;
    const nuevoInput = input.cloneNode(true);
    input.parentNode.replaceChild(nuevoInput, input);
    const inputLimpio = document.getElementById('input-nuevo-comentario');
    inputLimpio.addEventListener('input', (e) => {
        let len = e.target.value.length;
        let rest = MAX - len;
        if(rest < 0) { e.target.value = e.target.value.substring(0, MAX); rest = 0; }
        contador.textContent = rest;
        contador.style.color = rest === 0 ? 'red' : '#4fc1e9';
    });
    inputLimpio.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') document.getElementById('btn-enviar-comentario').click();
    });
}