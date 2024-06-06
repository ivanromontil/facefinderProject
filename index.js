// Importa la biblioteca de Azure Blob Storage
const { BlobServiceClient } = require("@azure/storage-blob");

// Variables de configuración
const blobServiceClient = BlobServiceClient.fromConnectionString("TuCadenaDeConexión");
const containerName = "nombreDeTuContenedor";

// Función para cargar la imagen seleccionada
async function uploadImage() {
    try {
        // Obtiene el archivo de entrada
        const fileInput = document.getElementById('imageInput');
        const file = fileInput.files[0];

        // Obtiene una referencia al contenedor de Blob
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Crea un nombre de blob único
        const blobName = `${Date.now()}-${file.name}`;

        // Crea un BlobClient
        const blobClient = containerClient.getBlobClient(blobName);

        // Carga el archivo seleccionado al blob
        const response = await blobClient.uploadBrowserData(file);

        console.log("Imagen cargada exitosamente:", response.requestId);
    } catch (error) {
        console.error("Error al cargar la imagen:", error.message);
    }
}
