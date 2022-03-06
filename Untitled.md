# BE Northcoders NC News Portfolio Check List

This is great work! Your code is well structured and easy to follow. You have been really through in building and testing your endpoints and your logic is easy to understand. 

There are a few little bits to tidy up on, which are detailed in the comments below. Don't worry, there is some stuff here that caught me out too and it shouldn't take you too long to refactor.

All in all, an excellent piece of work and you should be proud of what you've achieved this week.

## Readme - Remove the one that was provided and write your own

- [ ] Link to hosted version
- [✅] Write a summary of what the project is
- [ ] Provide clear instructions of how to clone, install dependencies, seed local database, and run tests
- [ ] Include information about how to create `.env.test` and `.env.development` files
- [✅] Specify minimum versions of `Node.js` and `Postgres` needed to run the project
  - to be completed

## General

- [✅] Remove any unnecessary `console.logs` and comments
- [✅] Remove all unnecessary files (e.g. old `README.md`, `error-handling.md`, `hosting.md`, `./db/utils/README.md` etc.)
- [✅] Functions and variables have descriptive names

## Creating tables

- [✅] Use `NOT NULL` on required fields
- [✅] Default `created_at` in articles and comments tables to the current date:`TIMESTAMP DEFAULT NOW()`

## Inserting data

- [✅] Drop tables and create tables in seed function in correct order
- [✅] Make use of pg-format to insert data in the correct order

## Tests

- [✅] Seeding before each test
- [✅] Descriptive `it`/`test` block descriptions
- [✅ If asserting inside a `forEach`, also has an assertion to check length is at least > 0
  - be careful here as these tests will pass if an empty array is sent back from the server. You've done this in some tests but not all.
- [✅] Evidence of building up complex query endpoints using TDD
- [✅] Ensure all tests are passing
- [✅] Cover all endpoints and errors

- `GET /api/topics`

  - [✅] Status 200, array of topic objects

- `GET /api/articles/:article_id`

  - [✅] Status 200, single article object (including `comment_count`)
  - [✅] Status 400, invalid ID, e.g. string of "not-an-id"
  - [✅] Status 404, non existent ID, e.g. 0 or 9999

- `PATCH /api/articles/:article_id`

  - [✅] Status 200, updated single article object
  - [✅] Status 400, invalid ID, e.g. string of "not-an-id"
  - [✅] Status 400, invalid inc_votes type, e.g. property is not a number
  - [✅] Status 404, non existent ID, e.g. 0 or 9999
  - [✅] Status 200, missing `inc_votes` key. No effect to article.
    - You've treated this as a bad request but if the request body doesn't have an inc_votes key this request can be dealt with as if inc_votes = 0 and return the unchanged article.

- `GET /api/articles`

  - [✅] Status 200, array of article objects (including `comment_count`, excluding `body`)
  - [✅] Status 200, default sort & order: `created_at`, `desc`
  - [✅] Status 200, accepts `sort_by` query, e.g. `?sort_by=votes`
  - [✅] Status 200, accepts `order` query, e.g. `?order=desc`
  - [✅] Status 200, accepts `topic` query, e.g. `?topic=coding`
  - [✅] Status 400. invalid `sort_by` query, e.g. `?sort_by=bananas`
  - [✅] Status 400. invalid `order` query, e.g. `?order=bananas`
  - [✅] Status 404. non-existent `topic` query, e.g. `?topic=bananas`
    - it does but make sure this behavior works when you refactor to take account of the next comment!
  - [✅] Status 200. valid `topic` query, but has no articles responds with an empty array of articles, e.g. `?topic=paper`
    - you will need to check if the topic exists before sending a 404. If it does but there are no articles on that topic, I'd expect a 200 and an empty array.

- `GET /api/articles/:article_id/comments`

  - [✅] Status 200, array of comment objects for the specified article
  - [✅] Status 400, invalid ID, e.g. string of "not-an-id"
  - [✅] Status 404, non existent ID, e.g. 0 or 9999
  - [✅] Status 200, valid ID, but has no comments responds with an empty array of comments

- `POST /api/articles/:article_id/comments`

  - [✅] Status 201, created comment object
  - [✅] Status 400, invalid ID, e.g. string of "not-an-id"
  - [✅] Status 404, non existent ID, e.g. 0 or 9999
  - [✅] Status 400, missing required field(s), e.g. no username or body properties
  - [✅] Status 404, username does not exist
    - check your last three tests for this endpoint, you have used the path '/api/articles/invalid_id/comments' for all of these but that's not what you're testing. Consequently this test passes (with your assertion of 400) but it shouldn't. Refactor your tests here to use a valid path and for this test in particular, expect a 404.
  - [✅] Status 201, ignores unnecessary properties
    - you haven't tested for this although your db does have this behavior. Take a win and add a test in!

- `DELETE /api/comments/:comment_id`

  - [✅] Status 204, deletes comment from database
  - [✅] Status 404, non existent ID, e.g 999
  - [✅] Status 400, invalid ID, e.g "not-an-id"

- `GET /api`

  - [✅] Status 200, JSON describing all the available endpoints

## Controllers

- [✅] Name functions and variables well
- [✅] Add catch blocks to all model invocations (and don't mix use of`.catch(next);` and `.catch(err => next(err))`)
 

## Models

- Protected from SQL injection
- [✅] Using parameterized queries for values in `db.query` e.g `$1` and array of variables
- [✅] Sanitizing any data for tables/columns, e.g. greenlisting when using template literals or pg-format's `%s`
- [✅] Consistently use either single object argument _**or**_ multiple arguments in model functions
- [✅] Use `LEFT JOIN` for comment counts
     - you could have seperated the contollers and models into seperate files, eg articles.contollers.js for all articles endpoints. It's not necessary but helpful as servers get bigger

## Errors

- [✅] Use error handling middleware functions in app and extracted to separate directory/file
- [✅] Consistently use `Promise.reject` in either models _**OR**_ controllers

## Extra Tasks - To be completed after hosting

- `GET /api/users`

  - [ ] Status 200, responds with array of user objects

- `GET /api/users/:username`

  - [ ] Status 200, responds with single user object
  - [ ] Status 404, non existent ID, e.g 999
  - [ ] Status 400, invalid ID, e.g "not-an-id"

- `PATCH /api/comments/:comment_id`

  - [ ] Status 200, updated single comment object
  - [ ] Status 400, invalid ID, e.g. string of "not-an-id"
  - [ ] Status 400, invalid inc_votes type, e.g. property is not a number
  - [ ] Status 404, non existent ID, e.g. 0 or 9999
  - [ ] Status 200, missing `inc_votes` key. No effect to comment.