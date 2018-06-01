$(function () {
    let headers = {
        StatusHeader: 'products'
    };
    request('GET', '/products', headers).then(res => {
        let products = $('.cards');
        let contentType = 'image/jpeg';

        for (let product of res) {
            let b64Data = product.image;
            let blob = b64toBlob(b64Data, contentType, 512);
            let blobUrl = URL.createObjectURL(blob);
            products.append(`<div class="product-card">
            <img class="product-img" src="${blobUrl}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
        </div>`);
        }
    });
});

function request(method, endpoint, headers) {
    return $.ajax({
        method: method,
        url: endpoint,
        headers: headers,
        contentType: 'application/json'
    });
}

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        let byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
}