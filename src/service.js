const fromStringToJson = (res) => res.json();

const api = 'https://posts-server-production.up.railway.app';

const throwError = (res) => {
    if (!res.errors) {
        return res;
    }
    throw new Error(res.message);
};

export const loadPosts = (params) => {
    const fetchString = `${api}/post-list${params?.searchString ? '/' + params.searchString : ''}${params?.searchType ? '/' + params.searchType : ''}`;
    return fetch(fetchString)
        .then(throwError)
        .then(fromStringToJson)
}

export const addPost = (params) => {
    return fetch(`${api}/add-post`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: params.title,
            content:  params.content,
            categories:  params.categories
        })
    })
        .then(fromStringToJson)
        .then(throwError);
}

export const updatePost = (record) => {
    return fetch(`${api}/update-post`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(record)
    })
        .then(fromStringToJson)
        .then(throwError);
}

export const deletePost = (id) => {
    return fetch(`${api}/post-delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })
        .then(fromStringToJson)
        .then(throwError);
}

export const readPost = (id) => {
    return fetch(`${api}/read-post/${id}`)
        .then(fromStringToJson)
        .then(throwError);
}