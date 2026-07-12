document.addEventListener('DOMContentLoaded', async () => {
    const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
    const ID_USUARIO_LOGUEADO = usuarioActual ? usuarioActual.id_miembro : null;

    // --- ELEMENTOS DEL DOM ---
    const carrerasContainer = document.getElementById('carreras-checkbox-container');
    const idiomasContainer = document.getElementById('idiomas-checkbox-container');
    const fileDropZone = document.getElementById('file-drop-zone');
    const fileInput = document.getElementById('file-upload-input');
    const fileNameDisplay = document.getElementById('file-name-display');
    const resourceNameInput = document.getElementById('resource-name');
    const resourceDescriptionInput = document.getElementById('resource-description'); // Added
    const publishButton = document.querySelector('.boton_publicar');

    // --- LÓGICA DE CARGA DINÁMICA ---

    // 1. Cargar datos desde la API
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error al cargar datos de ${url}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    // 2. Cargar y renderizar checkboxes
    function renderCheckboxes(container, items, name, valueKey, labelKey) {
        if (!container || !items || items.length === 0) {
            container.innerHTML = `<p>No se encontraron ${name}.</p>`;
            return;
        }
        container.innerHTML = items.map(item => `
            <label class="checkbox-label">
                <input type="checkbox" name="${name}" value="${item[valueKey]}">
                <span>${item[labelKey]}</span>
            </label>
        `).join('');
    }

    // Carga inicial de datos
    const [carreras, idiomas] = await Promise.all([
        fetchData('http://localhost:3000/api/carrera'),
        fetchData('http://localhost:3000/api/idioma')
    ]);

    renderCheckboxes(carrerasContainer, carreras, 'carrera', 'id_carrera', 'nombre_carrera');
    renderCheckboxes(idiomasContainer, idiomas, 'idioma', 'id_idioma', 'nombre_idioma');


    // 3. Lógica de Drag and Drop y selección de archivo
    if (fileDropZone && fileInput && fileNameDisplay) {
        fileDropZone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                fileNameDisplay.textContent = `Archivo seleccionado: ${fileInput.files[0].name}`;
            }
        });
        
        fileDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileDropZone.classList.add('dragover');
        });

        fileDropZone.addEventListener('dragleave', () => fileDropZone.classList.remove('dragover'));

        fileDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            fileDropZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                fileNameDisplay.textContent = `Archivo seleccionado: ${files[0].name}`;
            }
        });
    }

    // 4. Lógica de publicación
    if (publishButton) {
        publishButton.addEventListener('click', async () => {
            const nombreRecurso = resourceNameInput.value.trim();
            const descripcionRecurso = resourceDescriptionInput.value.trim();
            const archivo = fileInput.files[0];

            if (!nombreRecurso) {
                alert('Por favor, dale un nombre al recurso.');
                return;
            }
            if (!archivo) {
                alert('Por favor, selecciona un archivo para subir.');
                return;
            }

            // Deshabilitar botón para evitar envíos múltiples
            publishButton.disabled = true;
            publishButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publicando...';

            const formData = new FormData();
            formData.append('nombre_recurso', nombreRecurso);
            formData.append('descripcion_recurso', descripcionRecurso);
            formData.append('id_usuario_comparte', ID_USUARIO_LOGUEADO);
            formData.append('tipo_subida', 'recurso');
            formData.append('recurso_archivo', archivo);

            try {
                // Paso 1: Subir el Recurso (archivo y datos)
                const recursoResponse = await fetch('http://localhost:3000/api/recurso', {
                    method: 'POST',
                    body: formData
                    // No se establece Content-Type, el navegador lo hace por nosotros con FormData
                });

                if (!recursoResponse.ok) {
                    if (recursoResponse.status === 409) {
                        const errorData = await recursoResponse.json();
                        throw new Error(errorData.error);
                    }
                    throw new Error('Error al crear el recurso: ' + recursoResponse.statusText);
                }
                
                const nuevoRecurso = await recursoResponse.json();
                const idRecurso = nuevoRecurso.id_recurso;

                // Paso 2: Asociar Carreras (UtilizadoPor)
                const carrerasSeleccionadas = Array.from(carrerasContainer.querySelectorAll('input[name="carrera"]:checked'))
                    .map(cb => parseInt(cb.value));

                if (carrerasSeleccionadas.length > 0) {
                    const utilizadoPorPromises = carrerasSeleccionadas.map(idCarrera =>
                        fetch('http://localhost:3000/api/utilizadopor', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                id_carrera: idCarrera,
                                id_recurso: idRecurso
                            })
                        })
                    );
                    await Promise.all(utilizadoPorPromises);
                }

                // Paso 3: Asociar Idiomas (EstaEn)
                const idiomasSeleccionados = Array.from(idiomasContainer.querySelectorAll('input[name="idioma"]:checked'))
                    .map(cb => parseInt(cb.value));

                if (idiomasSeleccionados.length > 0) {
                    const estaEnPromises = idiomasSeleccionados.map(idIdioma =>
                        fetch('http://localhost:3000/api/estaen', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                id_recurso: idRecurso,
                                id_idioma: idIdioma
                            })
                        })
                    );
                    await Promise.all(estaEnPromises);
                }
                
                alert('¡Recurso publicado con éxito!');
                window.location.href = 'index.html'; // Redirigir o limpiar el formulario

            } catch (error) {
                console.error('Error en el proceso de publicación:', error);
                alert(error.message);
            } finally {
                // Rehabilitar botón
                publishButton.disabled = false;
                publishButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Publicar Recurso';
            }
        });
    }
});

