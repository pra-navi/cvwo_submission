export const getUserQuery = `
    SELECT * FROM users
    WHERE verificationToken = $1
    `;
export const updateVerificationTokenQuery = `
    UPDATE users
    SET verificationToken = NULL, isEmailVerified = true
    WHERE id = $1;
    `;
export const getUserFromEmailQuery = `
    SELECT * FROM users
    WHERE email = $1
    `;
export const getUserFromNameQuery = `
    SELECT * FROM users
    WHERE name = $1
    `;
export const createNewUserQuery = `
    INSERT INTO users (email, password, name)
    VALUES ($1, $2, $3)
    RETURNING *;
    `;
export const getUserFromIdQuery = `
    SELECT * FROM users
    WHERE id = $1
    `;
export const updateUserPrivacyQuery = `
    UPDATE users
    SET listsArePrivate = $1
    WHERE id = $2
    `;
export const getUserIdAuthQuery = `
    SELECT 
    CASE 
        WHEN LENGTH($1) < 500 THEN (jwt_verify($1, 'test')).id::INTEGER
        ELSE (jwt_decode($1)).sub::INTEGER
    END AS user_id;
    `;