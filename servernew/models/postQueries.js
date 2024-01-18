export const listAll = "SELECT * FROM posts ORDER BY id DESC LIMIT $1 OFFSET $2";
export const countQuery = "SELECT COUNT(*) FROM posts";
export const searchAll = `SELECT * FROM posts`;
export const searchByCreator = `SELECT * FROM posts WHERE creatorId = $1`;
export const postById = `SELECT * FROM posts WHERE id = $1`;
export const insertPostQuery = `
    INSERT INTO posts (title, message, tags, timeTaken, creatorId, name, createdAt)
    VALUES ($1, $2, $3, $4, $5, (SELECT name FROM users WHERE id = $5), NOW())
    RETURNING *;
    `;
export const increaseUserQuery = `
    UPDATE users
    SET postCreated = postCreated + 1
    WHERE id = $1
    RETURNING *;
    `;
export const decreaseUserQuery = `
    UPDATE users
    SET postCreated = postCreated - 1
    WHERE id = $1
    RETURNING *;
    `;
export const updatePostQuery = `
    UPDATE posts
    SET title = $1, message = $2, tags = $3, timeTaken = $4
    WHERE id = $5
    RETURNING *;
    `;
export const deletePostQuery = `
    DELETE FROM posts
    WHERE id = $1
    RETURNING *;
    `;
export const likePostQuery = `
    UPDATE posts
    SET likes = $1
    WHERE id = $2
    RETURNING *;
    `;
export const dislikePostQuery = `
    UPDATE posts
    SET dislikes = $1
    WHERE id = $2
    RETURNING *;
    `;
export const commentPostQuery = `
    UPDATE posts
    SET comments = $1
    WHERE id = $2
    RETURNING *;
    `;
export const updateCommentQuery = `
    UPDATE posts
    SET comments = comments || $1::jsonb
    WHERE id = $2
    RETURNING *;
    `;

export const titleQuery = (sortValue) => {
    let searchTitle;
    if (sortValue === 'new') {
        searchTitle = `SELECT *
        FROM posts
        WHERE title ILIKE $1
        ORDER BY createdAt DESC;`;
    } else if (sortValue === 'old') {
        searchTitle = `SELECT *
        FROM posts
        WHERE title ILIKE $1
        ORDER BY createdAt ASC;`;
    } else if (sortValue === 'mostliked') {
        searchTitle = `SELECT *
        FROM posts
        WHERE title ILIKE $1
        ORDER BY array_length(likes, 1) DESC;`;
    } else if (sortValue === 'leastliked') {
        searchTitle = `SELECT *
        FROM posts
        WHERE title ILIKE $1
        ORDER BY array_length(likes, 1) ASC;`;
    } else if (sortValue === 'mostdisliked') {
        searchTitle = `SELECT *
        FROM posts
        WHERE title ILIKE $1
        ORDER BY array_length(dislikes, 1) DESC;`;
    } else if (sortValue === 'leastdisliked') {
        searchTitle = `SELECT *
        FROM posts
        WHERE title ILIKE $1
        ORDER BY array_length(dislikes, 1) ASC;`;
    } else if (sortValue === 'highestrating') {
        searchTitle = `SELECT *
        FROM posts
        WHERE title ILIKE $1
        ORDER BY averageRating DESC;`;
    } else if (sortValue === 'lowestrating') {
        searchTitle = `SELECT *
        FROM posts
        WHERE title ILIKE $1
        ORDER BY averageRating ASC;`;
    } else if (sortValue === 'mosttimetaken') {
        searchTitle = `SELECT *
        FROM posts
        WHERE title ILIKE $1
        ORDER BY timeTaken DESC;`;
    } else if (sortValue === 'leasttimetaken') {
        searchTitle = `SELECT *
        FROM posts
        WHERE title ILIKE $1
        ORDER BY timeTaken ASC;`;
    } else {
        searchTitle = `SELECT *
        FROM posts
        WHERE title ILIKE $1
        ORDER BY createdAt;`;
    }
    return searchTitle;
}

export const tagsQuery = (sortValue) => {
    let searchTags;
    if (sortValue === 'new') {
        searchTags = `SELECT *
        FROM posts
        WHERE tags @> $1::varchar[]
        ORDER BY createdAt DESC;`;
    } else if (sortValue === 'old') {
        searchTags = `SELECT *
        FROM posts
        WHERE tags @> $1::varchar[]
        ORDER BY createdAt ASC;`;
    } else if (sortValue === 'mostliked') {
        searchTags = `SELECT *
        FROM posts
        WHERE tags @> $1::varchar[]
        ORDER BY array_length(likes, 1) DESC;`;
    } else if (sortValue === 'leastliked') {
        searchTags = `SELECT *
        FROM posts
        WHERE tags @> $1::varchar[]
        ORDER BY array_length(likes, 1) ASC;`;
    } else if (sortValue === 'mostdisliked') {
        searchTags = `SELECT *
        FROM posts
        WHERE tags @> $1::varchar[]
        ORDER BY array_length(dislikes, 1) DESC;`;
    } else if (sortValue === 'leastdisliked') {
        searchTags = `SELECT *
        FROM posts
        WHERE tags @> $1::varchar[]
        ORDER BY array_length(dislikes, 1) ASC;`;
    } else if (sortValue === 'highestrating') {
        searchTags = `SELECT *
        FROM posts
        WHERE tags @> $1::varchar[]
        ORDER BY averageRating DESC;`;
    } else if (sortValue === 'lowestrating') {
        searchTags = `SELECT *
        FROM posts
        WHERE tags @> $1::varchar[]
        ORDER BY averageRating ASC;`;
    } else if (sortValue === 'mosttimetaken') {
        searchTags = `SELECT *
        FROM posts
        WHERE tags @> $1::varchar[]
        ORDER BY timeTaken DESC;`;
    } else if (sortValue === 'leasttimetaken') {
        searchTags = `SELECT *
        FROM posts
        WHERE tags @> $1::varchar[]
        ORDER BY timeTaken ASC;`;
    } else {
        searchTags = `SELECT *
        FROM posts
        WHERE tags @> $1::varchar[]
        ORDER BY createdAt;`;
    }
    return searchTags;
}

export const titleAndTagsQuery = (sortValue) => {
    let searchTitleAndTags;
    if (sortValue === 'new') {
        searchTitleAndTags = `SELECT *
        FROM posts
        WHERE (title ILIKE $1)
        AND (tags @> $2::varchar[])
        ORDER BY createdAt DESC;`;
    } else if (sortValue === 'old') {
        searchTitleAndTags = `SELECT *
        FROM posts
        WHERE (title ILIKE $1)
        AND (tags @> $2::varchar[])
        ORDER BY createdAt ASC;`;
    } else if (sortValue === 'mostliked') {
        searchTitleAndTags = `SELECT *
        FROM posts
        WHERE (title ILIKE $1)
        AND (tags @> $2::varchar[])
        ORDER BY array_length(likes, 1) DESC;`;
    } else if (sortValue === 'leastliked') {
        searchTitleAndTags = `SELECT *
        FROM posts
        WHERE (title ILIKE $1)
        AND (tags @> $2::varchar[])
        ORDER BY array_length(likes, 1) ASC;`;
    } else if (sortValue === 'mostdisliked') {
        searchTitleAndTags = `SELECT *
        FROM posts
        WHERE (title ILIKE $1)
        AND (tags @> $2::varchar[])
        ORDER BY array_length(dislikes, 1) DESC;`;
    } else if (sortValue === 'leastdisliked') {
        searchTitleAndTags = `SELECT *
        FROM posts
        WHERE (title ILIKE $1)
        AND (tags @> $2::varchar[])
        ORDER BY array_length(dislikes, 1) ASC;`;
    } else if (sortValue === 'highestrating') {
        searchTitleAndTags = `SELECT *
        FROM posts
        WHERE (title ILIKE $1)
        AND (tags @> $2::varchar[])
        ORDER BY averageRating DESC;`;
    } else if (sortValue === 'lowestrating') {
        searchTitleAndTags = `SELECT *
        FROM posts
        WHERE (title ILIKE $1)
        AND (tags @> $2::varchar[])
        ORDER BY averageRating ASC;`;
    } else if (sortValue === 'mosttimetaken') {
        searchTitleAndTags = `SELECT *
        FROM posts
        WHERE (title ILIKE $1)
        AND (tags @> $2::varchar[])
        ORDER BY timeTaken DESC;`;
    } else if (sortValue === 'leasttimetaken') {
        searchTitleAndTags = `SELECT *
        FROM posts
        WHERE (title ILIKE $1)
        AND (tags @> $2::varchar[])
        ORDER BY timeTaken ASC;`;
    } else {
        searchTitleAndTags = `SELECT *
        FROM posts
        WHERE (title ILIKE $1)
        AND (tags @> $2::varchar[])
        ORDER BY createdAt;`;
    }
    return searchTitleAndTags;
}