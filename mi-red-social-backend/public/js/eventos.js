// Variable global para guardar los eventos
let EVENTOS_GLOBALES = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarEventos();
    verificarPermisosCrear();
    gestionarInterfaz();
    configurarBuscadorEventos();
});

// --- GESTIÓN DE INTERFAZ Y BUSCADOR (Igual que antes) ---
function gestionarInterfaz() {
    const params = new URLSearchParams(window.location.search);
    const esModoSuscritos = params.get('filtro') === 'suscritos';
    const linkSuscritos = document.getElementById('sidebar-eventos-suscritos');
    const barraBusqueda = document.getElementById('barra-busqueda-eventos');
    const barraPestanas = document.getElementById('barra-pestanas-eventos');
    const headerTitulo = document.getElementById('header-titulo-suscritos');

    if (esModoSuscritos) {
        if(linkSuscritos) linkSuscritos.classList.add('activo');
        if(barraBusqueda) barraBusqueda.style.display = 'none';
        if(barraPestanas) barraPestanas.style.display = 'none';
        if(headerTitulo) headerTitulo.style.display = 'block';
    } else {
        if(linkSuscritos) linkSuscritos.classList.remove('activo');
        if(barraBusqueda) barraBusqueda.style.display = 'flex';
        if(barraPestanas) barraPestanas.style.display = 'flex';
        if(headerTitulo) headerTitulo.style.display = 'none';
    }
}

function configurarBuscadorEventos() {
    const contenedor = document.getElementById('barra-busqueda-eventos');
    if (!contenedor) return;
    const input = contenedor.querySelector('input');
    
    input.addEventListener('input', (e) => {
        const texto = e.target.value.toLowerCase().trim();
        const eventosFiltrados = EVENTOS_GLOBALES.filter(ev => {
            return ev.nombre_evento.toLowerCase().includes(texto) || 
                   ev.lugar.toLowerCase().includes(texto) ||
                   ev.categoria.toLowerCase().includes(texto);
        });
        renderizarListaEventos(eventosFiltrados);
    });
}

// --- CARGA DE EVENTOS ---
async function cargarEventos() {
    const params = new URLSearchParams(window.location.search);
    const soloSuscritos = params.get('filtro') === 'suscritos';

    try {
        const res = await fetch(`/api/eventos?id_usuario_actual=${ID_USUARIO_LOGUEADO}`);
        let eventos = await res.json();

        if (soloSuscritos) eventos = eventos.filter(ev => ev.asisto === true);

        EVENTOS_GLOBALES = eventos;
        renderizarListaEventos(EVENTOS_GLOBALES);
    } catch (error) {
        console.error(error);
        document.getElementById('lista-eventos').innerHTML = '<p>Error al cargar.</p>';
    }
}

function renderizarListaEventos(listaDeEventos) {
    const contenedor = document.getElementById('lista-eventos');
    const params = new URLSearchParams(window.location.search);
    const soloSuscritos = params.get('filtro') === 'suscritos';
    
    contenedor.innerHTML = '';

    if (listaDeEventos.length === 0) {
        const esBusqueda = document.querySelector('#barra-busqueda-eventos input').value.trim().length > 0;
        let mensaje = soloSuscritos ? 'No estás suscrito a ningún evento.' : 'No hay eventos próximos.';
        if (esBusqueda) mensaje = 'No se encontraron eventos con ese nombre.';

        contenedor.innerHTML = `
            <div style="text-align:center; padding:40px; color:#777;">
                <i class="fa-solid fa-calendar-xmark" style="font-size: 30px; margin-bottom:10px;"></i>
                <p>${mensaje}</p>
                ${(soloSuscritos && !esBusqueda) ? '<button onclick="window.location.href=\'eventos.html\'" class="boton_publicar" style="margin-top:10px;">Ver todos los eventos</button>' : ''}
            </div>`;
        return;
    }

    listaDeEventos.forEach(ev => {
        const fecha = new Date(ev.fecha_inicio).toLocaleDateString();
        const horaSimple = ev.hora_inicio ? ev.hora_inicio.substring(0, 5) : '00:00';
        const iconoBook = ev.asisto ? 'fa-solid' : 'fa-regular';
        const claseActiva = ev.asisto ? 'suscrito_activo' : '';
        const tooltip = ev.asisto ? 'Cancelar inscripción' : 'Inscribirse';

        let iconoCat = "fa-calendar-day";
        if (ev.categoria === 'Taller') iconoCat = "fa-laptop-code";
        if (ev.categoria === 'Conferencia') iconoCat = "fa-microphone";
        if (ev.categoria === 'Competencia') iconoCat = "fa-trophy";

        const html = `
            <div class="tarjeta_publicacion">
                <div class="encabezado_post">
                    <div class="autor_info">
                        <div class="icono_evento" style="background:#e8f5fd; color:var(--azul-principal); width:40px; height:40px; display:flex; justify-content:center; align-items:center; border-radius:50%; margin-right:10px;">
                            <i class="fa-solid ${iconoCat}"></i>
                        </div>
                        <div class="nombres_post">
                            <span class="nombre_real">${ev.nombre_evento}</span>
                            <span class="usuario">${ev.nombre_organizador}</span>
                        </div>
                    </div>
                    <span class="tiempo">📅 ${fecha} • ${horaSimple}</span>
                </div>

                <div class="contenido_post">
                    <p>${ev.descripcion_evento || 'Sin descripción.'}</p>
                    <span class="link_ver_mas" onclick='verDetalleCompleto(${JSON.stringify(ev)})'>ver más información del evento</span>
                </div>

                <div class="footer_post" style="justify-content: space-between;">
                    <div style="display:flex; gap:15px; align-items:center;">
                        <div class="accion_social" onclick="toggleSuscripcion(${ev.id_evento})" title="${tooltip}">
                            <i class="${iconoBook} fa-bookmark ${claseActiva} icono_suscripcion"></i>
                        </div>
                    </div>
                    <div style="font-size: 0.85rem; color:#777;">
                        ${ev.total_asistentes} asistentes
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += html;
    });
}

// --- ACCIONES (Suscripción y Detalles) ---
async function toggleSuscripcion(idEvento) {
    try {
        const res = await fetch('/api/eventos/suscribirse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_evento: idEvento, id_usuario: ID_USUARIO_LOGUEADO })
        });
        
        if (res.ok) {
            cargarEventos(); 
            document.getElementById('modal-detalle-evento').classList.add('oculto');
        }
    } catch (e) { console.error(e); }
}

function verDetalleCompleto(ev) {
    const modal = document.getElementById('modal-detalle-evento');
    const titulo = document.getElementById('det-titulo');
    const body = document.getElementById('det-body');
    const footer = document.getElementById('det-footer');

    titulo.innerText = ev.nombre_evento;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fInicio = new Date(ev.fecha_inicio);
    const fFin = new Date(ev.fecha_fin);
    const hInicio = ev.hora_inicio ? ev.hora_inicio.substring(0, 5) : '??:??';
    const hFin = ev.hora_fin ? ev.hora_fin.substring(0, 5) : '??:??';

    let htmlFecha = '';
    // Corregimos comparación de fechas usando timestamps de día (sin horas)
    const inicioDia = new Date(fInicio.toDateString());
    const finDia = new Date(fFin.toDateString());

    if (inicioDia.getTime() === finDia.getTime()) {
        htmlFecha = `
            <div class="detalle_dato">
                <i class="fa-solid fa-calendar-day icono_detalle"></i>
                <div>
                    <strong>Fecha:</strong> ${fInicio.toLocaleDateString("es-ES", options)} <br>
                    <span style="color:#666; font-size:0.9rem;">De ${hInicio} a ${hFin}</span>
                </div>
            </div>`;
    } else {
        htmlFecha = `
            <div class="detalle_dato">
                <i class="fa-solid fa-calendar-week icono_detalle"></i>
                <div>
                    <strong>Inicio:</strong> ${fInicio.toLocaleDateString("es-ES", options)} (${hInicio}) <br>
                    <strong>Fin:</strong> ${fFin.toLocaleDateString("es-ES", options)} (${hFin})
                </div>
            </div>`;
    }

    const textoBtn = ev.asisto ? "Cancelar Inscripción" : "Inscribirse";
    const claseBtn = ev.asisto ? "boton_gris" : "boton_publicar"; 
    
    body.innerHTML = `
        <div class="detalle_cabecera_color">
            <span class="badge_modal">${ev.categoria}</span>
            <span class="organizador_modal">Organizado por: ${ev.nombre_organizador}</span>
        </div>

        <div class="contenedor_info_evento">
            ${htmlFecha}
            <div class="detalle_dato">
                <i class="fa-solid fa-location-dot icono_detalle"></i>
                <div>
                    <strong>Lugar:</strong> ${ev.lugar}
                </div>
            </div>
        </div>

        <div class="separador_modal"></div>
        <h3 style="color:var(--azul-principal); margin-bottom:10px;">Descripción</h3>
        <p style="line-height:1.6; color:#444;">
            ${ev.descripcion_evento || "No hay descripción disponible."}
        </p>
    `;

    footer.innerHTML = `
        <div style="color:#666; font-size:0.9rem;">
            <i class="fa-solid fa-users"></i> ${ev.total_asistentes} personas asistirán
        </div>
        <button class="${claseBtn}" onclick="toggleSuscripcionDesdeModal(${ev.id_evento})">
            ${textoBtn}
        </button>
    `;

    modal.classList.remove('oculto');
}

async function toggleSuscripcionDesdeModal(id) { await toggleSuscripcion(id); }

// --- CREACIÓN DE EVENTOS (VALIDACIONES Y LIMPIEZA) ---

function limpiarFormularioCrear() {
    document.getElementById('ev-nombre').value = '';
    document.getElementById('ev-desc').value = '';
    document.getElementById('ev-lugar').value = '';
    document.getElementById('ev-categoria').selectedIndex = 0;
    
    document.getElementById('ev-fecha-inicio').value = '';
    document.getElementById('ev-hora-inicio').value = '';
    document.getElementById('ev-fecha-fin').value = '';
    document.getElementById('ev-hora-fin').value = '';
}

function abrirModalCrearEvento() {
    limpiarFormularioCrear(); // <--- LIMPIAR SIEMPRE AL ABRIR
    document.getElementById('modal-crear-evento').classList.remove('oculto');
}

function cerrarModal(id) { document.getElementById(id).classList.add('oculto'); }

async function verificarPermisosCrear() {
    try {
        const res = await fetch(`/api/profile/${ID_USUARIO_LOGUEADO}`);
        const datos = await res.json();
        const btnCrear = document.getElementById('btn-crear-evento-container');
        // Solo mostrar si NO es Estudiante/Profesor (es decir, Dependencia u Org)
        if (datos.tipo === 'Estudiante' || datos.tipo === 'Profesor/Egresado') {
            if(btnCrear) btnCrear.style.display = 'none';
        } else {
            if(btnCrear) btnCrear.style.display = 'block';
        }
    } catch (e) {}
}

async function guardarEvento() {
    const nombre = document.getElementById('ev-nombre').value;
    const desc = document.getElementById('ev-desc').value;
    const lugar = document.getElementById('ev-lugar').value;
    const cat = document.getElementById('ev-categoria').value;
    
    const fechaInicio = document.getElementById('ev-fecha-inicio').value;
    const horaInicio = document.getElementById('ev-hora-inicio').value;
    const fechaFin = document.getElementById('ev-fecha-fin').value;
    const horaFin = document.getElementById('ev-hora-fin').value;

    // 1. VALIDACIÓN: CAMPOS VACÍOS
    if(!nombre || !fechaInicio || !horaInicio || !fechaFin || !horaFin) {
        return mostrarToast("Por favor completa todos los campos de fecha y hora.", "error");
    }

    // 2. VALIDACIÓN LÓGICA DE FECHAS
    const now = new Date();
    // Creamos objetos Date combinando fecha y hora para comparar con precisión
    const startDateTime = new Date(`${fechaInicio}T${horaInicio}`);
    const endDateTime = new Date(`${fechaFin}T${horaFin}`);

    // A. ¿Fecha de inicio en el pasado?
    if (startDateTime < now) {
        return mostrarToast("Error: No puedes crear un evento en el pasado.", "error");
    }

    // B. ¿Fecha fin antes que fecha inicio?
    if (endDateTime <= startDateTime) {
        return mostrarToast("Error: La fecha/hora de fin debe ser posterior a la de inicio.", "error");
    }

    try {
        const res = await fetch('/api/eventos/crear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_organizador: ID_USUARIO_LOGUEADO,
                nombre, descripcion: desc, lugar, categoria: cat,
                fecha_inicio: fechaInicio, hora_inicio: horaInicio,
                fecha_fin: fechaFin, hora_fin: horaFin
            })
        });

        if (res.ok) {
            mostrarToast("¡Evento creado!", "exito");
            cerrarModal('modal-crear-evento');
            limpiarFormularioCrear(); // Limpiar también al terminar
            cargarEventos();
        } else {
            const data = await res.json();
            mostrarToast("Error al crear: " + (data.error || "Desconocido"), "error");
        }
    } catch (e) { console.error(e); }
}