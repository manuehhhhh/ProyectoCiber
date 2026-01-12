const ID_USUARIO_LOGUEADO = 1; 

document.addEventListener('DOMContentLoaded', () => {
    cargarPerfilUsuario();
    cargarPublicaciones();
    configurarDropdown();
    inicializarContador(); // <--- Nueva función para el contador
});

// --- Contador de Caracteres (200 a 0) ---
function inicializarContador() {
    const txtInput = document.getElementById('txt-publicacion');
    const spanContador = document.getElementById('contador-caracteres');
    const MAX_CHARS = 200;

    if(txtInput && spanContador) {
        txtInput.addEventListener('input', (e) => {
            const largoActual = e.target.value.length;
            let restantes = MAX_CHARS - largoActual;

            // Si se pasa de 200, cortamos el texto y dejamos contador en 0
            if (restantes < 0) {
                e.target.value = e.target.value.substring(0, MAX_CHARS);
                restantes = 0;
            }

            spanContador.textContent = restantes;

            // Opcional: Poner rojo si llega a 0
            if(restantes === 0) {
                spanContador.style.color = 'red';
            } else {
                spanContador.style.color = ''; // Volver al color original
            }
        });
    }
}

// --- Lógica del Dropdown ---
function configurarDropdown() {
    const btn = document.getElementById('btn-dropdown');
    const menu = document.getElementById('menu-dropdown');
    
    if(btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('oculto');
        });
        document.addEventListener('click', (e) => {
            if (!btn.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.add('oculto');
            }
        });
    }
}

// --- Cargar Perfil ---
async function cargarPerfilUsuario() {
    try {
        const res = await fetch(`/api/persona/${ID_USUARIO_LOGUEADO}`);
        const usuario = await res.json();

        document.querySelector('.nombre_top').textContent = usuario.nombres + ' ' + usuario.apellidos;
        document.querySelector('.usuario_top').textContent = '@' + usuario.correo_universitario.split('@')[0];
        
    } catch (error) {
        console.error("Error perfil", error);
    }
}

// --- Cargar Feed con simulación ---
async function cargarPublicaciones() {
    const contenedor = document.getElementById('lista-publicaciones');
    
    try {
        const res = await fetch('/api/post');
        const posts = await res.json();
        contenedor.innerHTML = '';

        if (posts.length === 0) {
            contenedor.innerHTML = '<p style="text-align:center; padding:20px">No hay posts.</p>';
            return;
        }

        for (const post of posts) {
            let nombreAutor = "Usuario " + post.id_usuario;
            let handleAutor = "@usuario" + post.id_usuario;
            
            try {
                const resAutor = await fetch(`/api/persona/${post.id_usuario}`);
                if(resAutor.ok) {
                    const autor = await resAutor.json();
                    nombreAutor = autor.nombres + ' ' + autor.apellidos;
                    handleAutor = '@' + autor.correo_universitario.split('@')[0];
                }
            } catch(e) {}

            const likes = Math.floor(Math.random() * 50); 
            const comentarios = Math.floor(Math.random() * 10);
            
            const html = `
                <div class="tarjeta_publicacion">
                    <div class="encabezado_post">
                        <div class="autor_info">
                            <img src="img/avatar_placeholder.png" class="avatar_post">
                            <div class="nombres_post">
                                <span class="nombre_real">${nombreAutor}</span>
                                <span class="username">${handleAutor}</span>
                            </div>
                        </div>
                        <span class="tiempo">Hace 2 horas</span>
                    </div>
                    
                    <div class="contenido_post">
                        ${post.contenido_textual_post}
                    </div>

                    <div class="footer_post">
                        <div class="accion_social">
                            <span>${likes}</span> <i class="fa-regular fa-heart"></i> 
                        </div>
                        <div class="accion_social">
                            <span>${comentarios}</span> <i class="fa-regular fa-comment"></i>
                        </div>
                    </div>
                </div>
            `;
            contenedor.innerHTML += html;
        }

    } catch (error) {
        console.error("Error posts", error);
        contenedor.innerHTML = '<p>Error al cargar.</p>';
    }
}