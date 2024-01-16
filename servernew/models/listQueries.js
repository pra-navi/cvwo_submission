export const insertListQuery = `
    INSERT INTO lists (listName, ownerId, ownerName) 
    VALUES ($1, $2, (SELECT name FROM users WHERE id = $2)) RETURNING *`;

export const updateUserQuery = `
    UPDATE users
    SET myLists = myLists || $1::jsonb
    WHERE id = $2
    RETURNING *;
    `;
export const updateListQuery = `
    UPDATE lists
    SET listName = $1
    WHERE listId = $2
    RETURNING *;
    `;
export const updateListNameUserQuery = `
    UPDATE users
    SET myLists = array(
        SELECT jsonb_set(elm, '{listName}', $1)
        FROM jsonb_array_elements(myLists) AS elm
        WHERE elm->>'listId' = $2
    )
    WHERE id = $3
    RETURNING *;
    `;
export const deleteListQuery = `
    DELETE FROM lists
    WHERE listId = $1
    RETURNING *;
    `;
export const deleteListUserQuery = `
    UPDATE users
    SET myLists = array_remove(myLists, (
        SELECT jsonb_agg(elm) 
        FROM jsonb_array_elements(myLists) AS elm 
        WHERE elm->>'listId' = $1)::jsonb
    )
    WHERE id = $2
    RETURNING *;
    `;
export const getListQuery = `
    SELECT * FROM lists
    WHERE listId = $1
    `;
export const getPostQuery = `
    SELECT * FROM posts
    WHERE id = $1
    `;
export const updateLearningListQuery = `
    UPDATE lists
    SET learningList = $1
    WHERE listId = $2
    RETURNING *;
    `;
export const updateListOfPostQuery = `
    UPDATE posts
    SET listIds = $1
    WHERE id = $2
    RETURNING *;
    `;
export const updateDoneListQuery = `
    UPDATE lists
    SET doneList = $1, totalTime = $2
    WHERE listId = $3
    RETURNING *;
    `;
export const updateBothListsQuery = `
    UPDATE lists
    SET learningList = $1, doneList = $2, totalTime = $3
    WHERE listId = $4
    RETURNING *;
    `;
export const getPostTitleQuery = `
    SELECT title FROM posts
    WHERE id = $1
    `;
export const getUserQuery = `
    SELECT * FROM users
    WHERE id = $1
    `;
export const getTimeQuery = `
    SELECT totalTime FROM lists
    WHERE listId = $1
    `;
export const getPostCreatedQuery = `
    SELECT postCreated FROM users
    WHERE id = $1
    `;
