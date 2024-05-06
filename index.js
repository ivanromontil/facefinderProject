
import 'regenerator-runtime/runtime';
const { BlobServiceClient } = require("@azure/storage-blob");

const blobSasUrl = "https://facefinderstorageproject.blob.core.windows.net/?sv=2022-11-02&ss=b&srt=co&sp=wciytf&se=2024-05-06T22:15:37Z&st=2024-05-06T14:15:37Z&spr=https&sig=byAFNRrisAnSqXwys%2BHwajkbIUgbbLfknGXZgyp9gpE%3D"
const BlobServiceClient = new BlobServiceClient(blobSasUrl);

const containerName = 'facestorage';
const containerClient = BlobServiceClient.getContainerClient(contaierName);
const selectButton = document.getElementById("select-button")

const fileInput = document.getElementById('imageInput');
const file = fileInput.files[0];
const blobName = file.name;
const blobServiceUrl = `https://facefinderstorageproject.blob.core.windows.net`;

const blobUrl = `${blobServiceUrl}/${containerName}/${blobName}`;

try {

    // aaa
    const promises = []
    for(const file of fileInput.files){
        const blockBlobClient = containerClinet.getBlockBlobClient(file.name);
        promises.push(blockBlobClient.uploadBrowserData(file));
    }

    await Promise.all(promises);
    alert('Done.')

    
} catch (error) {
    console.error(error);
    alert('Error al cargar la imagen');
}

selectButton.addEventListener("click",() =>fileInput.click());
fileInput.addEventListener("change", uploadFiles);
