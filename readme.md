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

You can create a `config.db.json` that node-lite-db will look for in the root directory of the project.

Available config options are shown below.

Generating a config file is optional and defaults will be used in place of any properties not included in a config that is found in the root directory..

```json
{
  /* Directory to create database files. */
  "databasePath": "./data/",
  /* Label used for logs generated from the database */
  "messageLabel": "lite-db",
  /* Extension used for database files */
  "fileExtension": ".db"
}
```

## DocumentNode

DocumentNode is the main class used to interact with `node-lite-db`.

The following properties exist on the DocumentNode class

```typescript
    /** Name of the document */
    documentName: string;
    /** The local representation of the
     * stored document data, cannot be
     * accessed directly. Use getData() on
     * this class instead. */
    private data;
    /** Whether or not to automatically
     * generateId */
    private generateId;
    constructor(documentName: string, initialData: any[], options?: Options);
    restoreData: (documentName: string, data: any[]) => any[];
    /** Retrieve first record that matches
     * the given id */
    getOneById: (id: number | string) => any;
    /** Retrieve the first record in the
     * document that passes the given test */
    getFirstMatch: (condition: any) => any;
    /** Retrieve all records in the document
     * that pass the given test */
    getAllMatches: (condition: any) => any[];
    /** Retrieve all records in the document */
    getAll: () => any[];
    /** Add one new record to the document */
    save: (record: any, cb?: Function | undefined) => string;
    delete: (id: string | number, cb?: Function | undefined) => void;
    /** Hard deletes all information within
     * document.
     * All data will be lost forever.
     * Pass the name of the document as first parameter.
     * This redudancy is a safety measure. */
    clear: (documentName: string, cb?: Function | undefined) => void;
```
