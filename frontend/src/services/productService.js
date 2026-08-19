import { api } from "./api";

const API = "/products";

export function getProducts() {

    return api(API);

}

export function createProduct(product) {

    return api(API, {

        method: "POST",

        body: product

    });

}

export function updateProduct(id, product) {

    return api(`${API}/${id}`, {

        method: "PUT",

        body: product

    });

}

export function deleteProduct(id) {

    return api(`${API}/${id}`, {

        method: "DELETE"

    });

}