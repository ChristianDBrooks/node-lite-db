# node-lite-db

Github: https://github.com/ChristianDBrooks/node-lite-db

## Getting Started

Install package to your project.

```
npm install node-lite-db
```

We recommended creating a dedicated file for initializing your database, for example a file named `database.ts`. This folder can be anywhere withing your project, however we like to create the file in the root directory.

Import `node-db-lite` into your new file `database.ts`.

```typescript
import { DatabaseNode, DocumentNode } from "node-db-lite";
```

and create new DatabaseNode and DocumentNode like below

```typescript
const db = new DatabaseNode("data");
```

When the server starts this will create your database file structure in `./data`.

There are 2 ways to create a new document on a database. They both accomplish the same thing, with the same return of a new DocumentNode instance with the options provided.

```typescript
// Option 1 - call document method on the db instance to create new document instance
const doc_1 = db.document("doc_1", []);
// Option 2 - pass the db instance as a parameter to a new document instance.
const doc_2 = new DocumentNode("doc_2", [], db);
```

Next if we want to add something to our `doc_1` document we can call the `.save()` method on the document instance, and pass the data object we'd like to save as a new record.

```typescript
doc_1.save({ text: "lorem ipsum", numbers: [1, 2, 3, 4, 5] });
```

Congratulations you have successfully saved your first record to your database using `node-lite-db`! Be sure to checkout the documentation below for important configuration and what other cool stuff you can do with your database.

## Required Configuration

### Nodemon

If you are using nodemon, you need to tell nodemon to ignore your database paths, otherwise the watcher will restart every time you make an update to the database. These paths will be whatever you pass to any DatabaseNode instance. They can be ignored by adding a `nodemon.json` file to the root directory of your project with the paths listed inside the `ignore` property, if we want nodemon to ignore our database for the getting started example we need to add the following:

##### nodemon.json

```json
{
  "ignore": ["data"]
}
```

### Database Configuration

You can pass a `DatabaseOptions` object when creating a new `DatabaseNode` instance to set its configuration for all child `DocumentNodes`. The default options are below.

##### DatabaseOptions Example

```typescript
const db_options = {
  /* Label used for logs generated from the database instance and its children DocumentNode instances*/
  messageLabel: "lite-db",
  /* Extension used for database files */
  fileExtension: ".db",
};

const db = new DatabaseNode("data", db_options);
```

You can pass a `DocumentOptions` object when creating a new `DocumentNode` instance.

##### DocumentOptions

```typescript
const doc_options = {
  /* Whether or not the document should auto generate ids for saved records */
  generateId: true,
};

const doc = new DocumentNode("document", [], doc_options);
```

## DatabaseNode

DatabaseNode is used to create new database's in node-lite-db allowing you to have multiple databases if you so choose.

## DocumentNode

DocumentNode is the main class used to interact with `node-lite-db`.
