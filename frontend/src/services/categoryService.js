import { api } from "./api";

const API = "/categories";

export function getCategories() {

    return api(API);

}

export function getCategory(id) {

    return api(`${API}/${id}`);

}

export function createCategory(category) {

    return api(API, {

        method: "POST",

        body: category

    });

}

export function updateCategory(id, category) {

    return api(`${API}/${id}`, {

        method: "PUT",

        body: category

    });

}

export function deleteCategory(id) {

    return api(`${API}/${id}`, {

        method: "DELETE"

    });

}
