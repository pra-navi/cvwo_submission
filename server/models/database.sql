CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    creatorId INTEGER,
    tags VARCHAR(255)[] NOT NULL,
    timeTaken INTEGER DEFAULT 0,
    listIds INTEGER[] DEFAULT '{}',
    likes INTEGER[] DEFAULT '{}',
    dislikes INTEGER[] DEFAULT '{}',
    comments JSONB DEFAULT '[]'::jsonb,
    averageRating INTEGER DEFAULT 0,
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users FOREIGN KEY (creatorId) REFERENCES "users" (id));

CREATE TABLE lists (
    listId SERIAL PRIMARY KEY,
    listName VARCHAR(255) NOT NULL,
    ownerId INTEGER NOT NULL,
    ownerName VARCHAR(255) NOT NULL,
    totalTime INTEGER DEFAULT 0,
    learningList INTEGER[] DEFAULT '{}',
    doneList INTEGER[] DEFAULT '{}',
    isPrivate BOOLEAN DEFAULT false,
    CONSTRAINT fk_users FOREIGN KEY (ownerId) REFERENCES "users" (id));

CREATE TABLE tokens (
    userId INTEGER PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES "users"(id) ON DELETE CASCADE,
    CONSTRAINT check_expiration CHECK (createdAt + INTERVAL '1 hour' > CURRENT_TIMESTAMP));

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    isEmailVerified BOOLEAN DEFAULT false,
    verificationToken VARCHAR(255),
    myLists JSONB DEFAULT '[]'::jsonb,
    listsArePrivate BOOLEAN DEFAULT false,
    postCreated INTEGER DEFAULT 0);
