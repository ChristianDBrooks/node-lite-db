# node-lite-db

Github: https://github.com/ChristianDBrooks/node-lite-db

## Getting Started

Install package to your project.

```
npm install node-lite-db
```

Import node-db-lite and create new DocumentNode anywhere in your project.

```typescript
import { DocumentNode } from "node-db-lite";

// First argument is the name of the document, this will directly reflect the file name in the database.
// Second argument is the seed data to initialize the document with, if any.
// Third argument is an optional "options" object.
export const documentRepo = new DocumentNode("newDocument", [], {
  generateId: true,
});
```

Export the DocumentNode for usage across your project.

Save a new record to the created documentRepo

```typescript
documentRepo.save({ data: "some nice content" });
```

To finish setting up follow the configurations below.

## Configuration

### Nodemon

If you are using nodemon, you need to tell nodemon to ignore your data folder. This folder by default will be created in the root directory and can be ignored by adding a `nodemon.json` file to the root directly of your project with the following configuration inside:

```json
{
  "ignore": ["data"]
}
```

Note: if you change the default database location in `config.d.b.json`, you will need to ignore the folder by changing the directory above.

### Database Configuration

You can pass a DatabaseOptions object when creating a new database to set its configuration for all child document nodes.

```json
{
  /* Directory to create database files. */
  "databasePath": "data",
  /* Label used for logs generated from the database */
  "messageLabel": "lite-db",
  /* Extension used for database files */
  "fileExtension": ".db"
}
```

## DatabaseNode

DatabaseNode is used to create new database's in node-lite-db allowing you to have multiple databases if you so choose.

## DocumentNode

DocumentNode is the main class used to interact with `node-lite-db`.
