const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = 'public/uploads/otros'; // Carpeta por defecto

        // Decidir carpeta destino según el tipo de subida
        // El frontend nos avisará si es 'avatar' o 'post'
        if (req.body.tipo_subida === 'avatar') {
            uploadPath = 'public/uploads/perfiles';
        } else if (req.body.tipo_subida === 'post') {
            uploadPath = 'public/uploads/posts';
        }

        // Asegurar que la carpeta exista
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generamos un nombre único: timestamp + extensión original
        // Ej: 16788899999-foto.jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('No es una imagen!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB
});

module.exports = upload;