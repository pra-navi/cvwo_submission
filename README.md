# LEARNers

This repository contains the migration of a previous project under the orbital-mern repository, using JavaScript and MongoDB.

## Setup Instructions
### Client Folder
Open the client folder.
Run `npm install` to install the necessary dependencies.
Start the client application using `npm start`.

### Server Folder
Open the server folder.
Run `npm install` to install the required packages.
Start the server using `npx tsx ./index.ts`.

Make sure to follow these steps in both the client and server folders.

## User Manual - Features
### Authentication
- Public users can sign up for an account or log in using their email and password.
- Admin (admin@gmail.com) has special access to edit and delete all posts.

### Search Tool
- Users can search for posts by post name, or difficulty level.
- The "Search by title" and "Search by difficulty level" functions can be used individually or in combination.

### User Interaction
- Members can like and dislike posts.
- Members can add comments and rate posts, contributing to the average rating.
- Users can click on creators' profiles to view all their posts.

### Create Post
- Members can create, edit, and delete their own posts.
- Administrators can edit and delete all posts.

### Saving Lists
- Members can create and edit lists with Learning and Done sublists.
- Posts can be saved to lists, and users can mark them as "done" to move to the Done List.
- Lists can be set to public or private.

### Motivational System
- Members earn points based on the estimated learning time and the number of posts created.

Happy using!
