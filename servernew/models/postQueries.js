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