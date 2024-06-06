function processImage() {
    var subscriptionKey = "1c8a0938df024623a98b21251f299565";
    var uriBase = "https://feelfinderai.cognitiveservices.azure.com/face/v1.0/detect";

    var params = {
        "detectionModel": "detection_03",
        "returnFaceId": "true"
    };

    var sourceImageUrl = document.getElementById("inputImage").value;
    document.querySelector("#sourceImage").src = sourceImageUrl;

    $.ajax({
        url: uriBase + "?" + $.param(params),
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },
        type: "POST",
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })
    .done(function (data) {
        $("#responseTextArea").val(JSON.stringify(data, null, 2));

        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        var img = document.getElementById('sourceImage');
        canvas.width = img.width*2;
        canvas.height = img.height*2;
        context.drawImage(img, 0, 0);
        context.strokeStyle = 'red';
        context.lineWidth = 2;
        data.forEach(function (face) {
            var faceRectangle = face.faceRectangle;
            context.beginPath();
            context.rect(faceRectangle.left, faceRectangle.top, faceRectangle.width, faceRectangle.height);
            context.stroke();
        });

        // Llamada para guardar en Cosmos DB
        create(sourceImageUrl);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
        alert(errorString);
    });
}

function sendDataToCosmosDB(imageUrl) {
    const data = {
        id: new Date().getTime().toString(),
        url: imageUrl
    };

    const gql = `
    mutation create($item: CreateImageInput!) {
        createImage(item: $item) {
            id
            url
        }
    }`;

    const query = {
        query: gql,
        variables: {
            item: data
        }
    };

    const endpoint = "/data-api/graphql";
    fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query)
    })
    .then(response => response.json())
    .then(result => {
        console.log("Image saved to Cosmos DB:", result.data.createImage);
    })
    .catch(error => console.error("Error saving image to Cosmos DB:", error));
}

async function list() {
    const query = `
        {
            images {
                items {
                    id
                    url
                }
            }
        }`;
        
    const endpoint = "/data-api/graphql";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query })
    });
    const result = await response.json();

    const imageList = result.data.images.items;
    const listContainer = document.getElementById("imageList");

    // Limpiar la lista antes de agregar nuevos elementos
    listContainer.innerHTML = "";

    imageList.forEach(image => {
        const listItem = document.createElement("li");
        listItem.textContent = `ID: ${image.id}, URL: ${image.url}`;
        listContainer.appendChild(listItem);
    });

    console.table(imageList); // Mostrar en consola también
}

async function listImages() {
    const query = `
        {
        people {
            items {
            id
            Name
            }
        }
        }`;
        
    const endpoint = "/data-api/graphql";
    try {
        const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query })
    });
    const result = await response.json();
    if (result.data && result.data.people && result.data.people.items) {
        const people = result.data.people.items;

       
        let html = "<ul>";
        people.forEach(person => {
            html += `<li>${person.Name}</li>`;
        });
        html += "</ul>";

        
        const peopleListElement = document.getElementById("imageList");
        if (peopleListElement) {
            peopleListElement.innerHTML = html;
        } else {
            console.error("Element with id 'peopleList' not found.");
        }
    } else {
        console.error("No data found in response.");
    }

    } catch (error) {
        console.error("Error listing images:", error);
    }
}


//////

async function list() {
    const query = `
        {
        people {
            items {
            id
            Name
            }
        }
        }`;
        
    const endpoint = "/data-api/graphql";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query })
    });
    const result = await response.json();
    console.table(result.data.people.items);
}

async function get() {

const id = '1';

const gql = `
query getById($id: ID!) {
person_by_pk(id: $id) {
  id
  Name
}
}`;

const query = {
    query: gql,
    variables: {
        id: id,
    },
    };

    const endpoint = "/data-api/graphql";
    const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
    });
    const result = await response.json();
    console.table(result.data.person_by_pk);
}

async function create(url) {

    const data = {
    id: url,
    Name: url
    };

    const gql = `
    mutation create($item: CreatePersonInput!) {
        createPerson(item: $item) {
        id
        Name
        }
    }`;

    const query = {
    query: gql,
    variables: {
        item: data
    } 
    };

    const endpoint = "/data-api/graphql";
    const result = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query)
    });

    const response = await result.json();
    console.table(response.data.createPerson);
}