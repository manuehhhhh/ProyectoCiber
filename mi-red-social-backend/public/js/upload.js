document.addEventListener('DOMContentLoaded', () => {
    // --- DATOS ---
    const carreras = [
        "Ingeniería Informática",
        "Ingeniería Civil",
        "Ingeniería Industrial",
        "Administración de Empresas",
        "Contaduría Pública",
        "Derecho",
        "Economía",
        "Comunicación Social",
        "Educación",
        "Psicología",
        "Sociología",
        "Filosofía",
        "Letras",
    ];

    const idiomas = [
        "Español",
        "Inglés",
        "Portugués",
        "Francés"
    ];

    // --- ELEMENTOS DEL DOM ---
    const carrerasContainer = document.getElementById('carreras-checkbox-container');
    const idiomasContainer = document.getElementById('idiomas-checkbox-container');
    const fileDropZone = document.getElementById('file-drop-zone');
    const fileInput = document.getElementById('file-upload-input');
    const fileNameDisplay = document.getElementById('file-name-display');

    // --- LÓGICA ---

    // 1. Cargar Checkboxes
    function cargarCheckboxes(contenedor, datos, name) {
        if (!contenedor) return;
        contenedor.innerHTML = datos.map(item => `
            <label class="checkbox-label">
                <input type="checkbox" name="${name}" value="${item}">
                <span>${item}</span>
            </label>
        `).join('');
    }

    cargarCheckboxes(carrerasContainer, carreras, 'carrera');
    cargarCheckboxes(idiomasContainer, idiomas, 'idioma');

    // 2. Lógica de Drag and Drop y selección de archivo
    if (fileDropZone && fileInput && fileNameDisplay) {
        // Abrir selector de archivo al hacer clic en la zona
        fileDropZone.addEventListener('click', () => {
            fileInput.click();
        });

        // Actualizar nombre de archivo cuando se selecciona
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                fileNameDisplay.textContent = `Archivo seleccionado: ${fileInput.files[0].name}`;
            }
        });

        // Efecto visual al arrastrar sobre la zona
        fileDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileDropZone.classList.add('dragover');
        });

        // Quitar efecto visual
        fileDropZone.addEventListener('dragleave', () => {
            fileDropZone.classList.remove('dragover');
        });

        // Manejar archivo soltado
        fileDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            fileDropZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files; // Asignar al input de tipo file
                fileNameDisplay.textContent = `Archivo seleccionado: ${files[0].name}`;
            }
        });
    }
});
