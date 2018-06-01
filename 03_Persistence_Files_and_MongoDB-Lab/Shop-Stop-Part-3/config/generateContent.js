function generateProducts(products) {
    let content = '';
    for (let product of products) {
        content +=
            `<div class="product-card">
                    <img class="product-img" src="${product.image}">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                </div>`;
    }

    return content;
}

function generateCategories(categories) {
    let content = '';
    for (let category of categories) {
        content += `<option value="${category._id}">${category.name}</option>`;
    }
    return content;
}

module.exports = {
    generateProducts,
    generateCategories
};