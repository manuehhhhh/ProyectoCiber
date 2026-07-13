document.addEventListener('DOMContentLoaded', () => {
    const postFormTitle = document.getElementById('post-form-title');
    const postContent = document.getElementById('post-content');
    const postImageInput = document.getElementById('post-image-input');
    const imagePreview = document.getElementById('image-preview');
    const imageUploadArea = document.getElementById('image-upload-area');
    const postTypeToggle = document.getElementById('post-type-toggle');
    const publishPostBtn = document.getElementById('publish-post-btn');

    // --- Lógica para determinar el modo (crear o editar) ---
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode'); // 'create' o 'edit'
    const postId = urlParams.get('id'); // ID del post si estamos editando


    if (mode === 'edit' && postId) {
        postFormTitle.textContent = 'Editar Post';
        publishPostBtn.innerHTML = '<i class="fa-solid fa-save"></i> Guardar Cambios';
        // Deshabilitar el switch al editar un post
        postTypeToggle.disabled = true;



        // Aquí iría la lógica para cargar el contenido y la imagen del post desde la API
        // Ejemplo de datos de un post a editar (simulado):
        const existingPost = {
            content: "Este es el contenido de un post de ejemplo que estoy editando.",
            imageUrl: "https://via.placeholder.com/400x200?text=Imagen+Existente",
            type: "social" // O 'networking'
        };

        postContent.value = existingPost.content;
        if (existingPost.imageUrl) {
            imagePreview.src = existingPost.imageUrl;
            imagePreview.classList.remove('hidden');
            imageUploadArea.querySelector('i').style.display = 'none';
            imageUploadArea.querySelector('p').style.display = 'none';
        }



    } else {
        // Modo 'create'
        postFormTitle.textContent = 'Crear Nuevo Post';
        publishPostBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Publicar Post';
        postTypeToggle.disabled = false; // Habilitar el switch
    }

    // --- Lógica para previsualización de imagen ---
    imageUploadArea.addEventListener('click', () => {
        postImageInput.click();
    });

    postImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('hidden');
                imageUploadArea.querySelector('i').style.display = 'none';
                imageUploadArea.querySelector('p').style.display = 'none';
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.src = '#';
            imagePreview.classList.add('hidden');
            imageUploadArea.querySelector('i').style.display = 'block';
            imageUploadArea.querySelector('p').style.display = 'block';
        }
    });

    // --- Manejo del botón de Publicar/Guardar ---
    publishPostBtn.addEventListener('click', () => {
        const content = postContent.value;
        const imageFile = postImageInput.files[0];


        console.log("Contenido:", content);

        if (imageFile) {
            console.log("Imagen:", imageFile.name);
        }

        if (mode === 'edit' && postId) {
            alert(`Guardando cambios para el post ${postId}...`);
            // Aquí iría la lógica para enviar los datos a la API de edición
        } else {
            alert("Publicando nuevo post...");
            // Aquí iría la lógica para enviar los datos a la API de creación
        }
        // Simplemente un alert, en un caso real se haría un fetch a la API
    });
});
