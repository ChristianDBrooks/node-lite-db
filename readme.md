# node-lite-db

A lightweight node database, implemented with json files, which can handle concurrent calls to the database, and only requires 2 lines of code to configure. This package was designed to be a simple solution that can help projects quickly get off the ground using persistant state. This is not a robust solution, but can be quite powerful.

[Github](https://github.com/ChristianDBrooks/node-lite-db)

[Documentation](#api-documentation)

## Getting Started

Install package to your project.

```
npm install node-lite-db
```

We recommended creating a dedicated file for initializing your database, for example a file named `database.ts`. This folder can be anywhere within your project, however we like to create the file in the root directory.

Import `node-lite-db` into your new file `database.ts`.

```typescript
import { DatabaseNode, DocumentNode } from "node-lite-db";
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

# API Documentation

## Classes

<dl>
<dt><a href="#DatabaseNode">DatabaseNode</a></dt>
<dd><p>Represents a database connection.</p>
</dd>
<dt><a href="#DocumentNode">DocumentNode</a></dt>
<dd><p>Represents a document file.</p>
</dd>
</dl>

<a name="DatabaseNode"></a>

## DatabaseNode

Represents a database connection.

**Kind**: global class

- [DatabaseNode](#DatabaseNode)
  - [new DatabaseNode(path, options)](#new_DatabaseNode_new)
  - _instance_
    - [.log(content)](#DatabaseNode+log)
    - [.document(documentName, initialData, options)](#DatabaseNode+document) ⇒ [<code>DatabaseNode</code>](#DatabaseNode)
    - [.getPath()](#DatabaseNode+getPath) ⇒ <code>string</code>
    - [.getMessageLabel()](#DatabaseNode+getMessageLabel) ⇒ <code>string</code>
    - [.getFileExtension()](#DatabaseNode+getFileExtension) ⇒ <code>string</code>
  - _static_
    - [.databases](#DatabaseNode.databases)

<a name="new_DatabaseNode_new"></a>

### new DatabaseNode(path, options)

Creates a database node.

**Returns**: [<code>DatabaseNode</code>](#DatabaseNode) - A new instance of
DatabaseNode. If you attempt to create a database
with a path that already exists, the existing
instance with that path will be return instead.

| Param   | Type                                                   | Description                                                                                                                   |
| ------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| path    | <code>string</code>                                    | A unique absolute path where the database documents will be written to. Root directory is identified with Node process.cwd(). |
| options | <code>DatabaseOptions</code> \| <code>undefined</code> | Optional configuration object that overides some default database settings.                                                   |

<a name="DatabaseNode+log"></a>

### databaseNode.log(content)

Logs content to the console using the databases messageLabel.

**Kind**: instance method of [<code>DatabaseNode</code>](#DatabaseNode)

| Param   | Type             | Description         |
| ------- | ---------------- | ------------------- |
| content | <code>any</code> | The content to log. |

<a name="DatabaseNode+document"></a>

### databaseNode.document(documentName, initialData, options) ⇒ [<code>DatabaseNode</code>](#DatabaseNode)

Create a new document in the database.

**Kind**: instance method of [<code>DatabaseNode</code>](#DatabaseNode)  
**Returns**: [<code>DatabaseNode</code>](#DatabaseNode) - A new document instance that can be used to interact with the database document.

| Param        | Type                                                   | Description                                                                                                                            |
| ------------ | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| documentName | <code>string</code>                                    | The name of the document you want to create.                                                                                           |
| initialData  | <code>Array.&lt;any&gt;</code>                         | An array of data that should initially be in the document. Note: This only applies to newly created documents, not restored documents. |
| options      | <code>DocumentOptions</code> \| <code>undefined</code> | Optional configurations for the newly created DocumentNode.                                                                            |

<a name="DatabaseNode+getPath"></a>

### databaseNode.getPath() ⇒ <code>string</code>

Getter method for the path property.

**Kind**: instance method of [<code>DatabaseNode</code>](#DatabaseNode)  
**Returns**: <code>string</code> - - The database path.  
<a name="DatabaseNode+getMessageLabel"></a>

### databaseNode.getMessageLabel() ⇒ <code>string</code>

Getter method for the messageLable property.

**Kind**: instance method of [<code>DatabaseNode</code>](#DatabaseNode)  
**Returns**: <code>string</code> - - The messageLabel to be used for database logs.  
<a name="DatabaseNode+getFileExtension"></a>

### databaseNode.getFileExtension() ⇒ <code>string</code>

Getter method for the fileExtension property.

**Kind**: instance method of [<code>DatabaseNode</code>](#DatabaseNode)  
**Returns**: <code>string</code> - - The fileExtension to be used for writing new documents.  
<a name="DatabaseNode.databases"></a>

### DatabaseNode.databases

**Kind**: static property of [<code>DatabaseNode</code>](#DatabaseNode)  
**Properties**

| Name      | Description                               |
| --------- | ----------------------------------------- |
| databases | store of the existing database instances. |

<a name="DocumentNode"></a>

## DocumentNode

Represents a document file.

**Kind**: global class

- [DocumentNode](#DocumentNode)
  - [new DocumentNode(documentName, initialData, database, options)](#new_DocumentNode_new)
  - [.log(content)](#DocumentNode+log)
  - [.buildDocumentUrl(documentName)](#DocumentNode+buildDocumentUrl) ⇒ <code>string</code>
  - [.restoreData(documentName, data)](#DocumentNode+restoreData) ⇒ <code>Array.&lt;any&gt;</code>
  - [.getOneById(id)](#DocumentNode+getOneById) ⇒ <code>object</code> \| <code>undefined</code>
  - [.getFirstMatch(condition)](#DocumentNode+getFirstMatch) ⇒ <code>object</code> \| <code>undefined</code>
  - [.getAllMatches(condition)](#DocumentNode+getAllMatches) ⇒ <code>Array.&lt;object&gt;</code>
  - [.getAll()](#DocumentNode+getAll) ⇒ <code>Array.&lt;object&gt;</code>
  - [.save(record, cb)](#DocumentNode+save) ⇒ <code>string</code> \| <code>number</code> \| <code>undefined</code>
  - [.delete(id, cb)](#DocumentNode+delete)
  - [.clear(documentName)](#DocumentNode+clear)

<a name="new_DocumentNode_new"></a>

### new DocumentNode(documentName, initialData, database, options)

Create a new document in the database.

**Returns**: [<code>DocumentNode</code>](#DocumentNode) - A new document instance that can be used to interact with the database document.

| Param        | Type                                       | Description                                                                                                                            |
| ------------ | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| documentName | <code>string</code>                        | The name of the document you want to create.                                                                                           |
| initialData  | <code>Array.&lt;any&gt;</code>             | An array of data that should initially be in the document. Note: This only applies to newly created documents, not restored documents. |
| database     | [<code>DatabaseNode</code>](#DatabaseNode) | The database instance of DatabaseNode you would like to create the document in.                                                        |
| options      | <code>DocumentOptions</code>               | Optional configurations for the newly created DocumentNode.                                                                            |

<a name="DocumentNode+log"></a>

### documentNode.log(content)

Logs content to the console using the databases messageLabel.

**Kind**: instance method of [<code>DocumentNode</code>](#DocumentNode)

| Param   | Type             | Description |
| ------- | ---------------- | ----------- |
| content | <code>any</code> | Content     |

<a name="DocumentNode+buildDocumentUrl"></a>

### documentNode.buildDocumentUrl(documentName) ⇒ <code>string</code>

Builds absolute url for document read/write location.

**Kind**: instance method of [<code>DocumentNode</code>](#DocumentNode)  
**Returns**: <code>string</code> - - The url to the document.

| Param        | Type                | Description                             |
| ------------ | ------------------- | --------------------------------------- |
| documentName | <code>string</code> | The document name to build the url for. |

<a name="DocumentNode+restoreData"></a>

### documentNode.restoreData(documentName, data) ⇒ <code>Array.&lt;any&gt;</code>

Attempts to restore data if document file already exists.

**Kind**: instance method of [<code>DocumentNode</code>](#DocumentNode)  
**Returns**: <code>Array.&lt;any&gt;</code> - - An array of data contained in the document file.

| Param        | Type                           | Description                                             |
| ------------ | ------------------------------ | ------------------------------------------------------- |
| documentName | <code>string</code>            | The documentName.                                       |
| data         | <code>Array.&lt;any&gt;</code> | The initial data for the file if it cannot be restored. |

<a name="DocumentNode+getOneById"></a>

### documentNode.getOneById(id) ⇒ <code>object</code> \| <code>undefined</code>

Retrieve first record that matches the given id

**Kind**: instance method of [<code>DocumentNode</code>](#DocumentNode)  
**Returns**: <code>object</code> \| <code>undefined</code> - - The found record or undefined if the record could not be found.

| Param | Type                                       | Description           |
| ----- | ------------------------------------------ | --------------------- |
| id    | <code>number</code> \| <code>string</code> | The id to search for. |

<a name="DocumentNode+getFirstMatch"></a>

### documentNode.getFirstMatch(condition) ⇒ <code>object</code> \| <code>undefined</code>

Retrieve the first record in the document that passes the given test

**Kind**: instance method of [<code>DocumentNode</code>](#DocumentNode)  
**Returns**: <code>object</code> \| <code>undefined</code> - - Returns the first record to pass the test

| Param     | Type                  | Description                           |
| --------- | --------------------- | ------------------------------------- |
| condition | <code>function</code> | A test to check the reecords against. |

<a name="DocumentNode+getAllMatches"></a>

### documentNode.getAllMatches(condition) ⇒ <code>Array.&lt;object&gt;</code>

Retrieve all records in the document that pass the given test

**Kind**: instance method of [<code>DocumentNode</code>](#DocumentNode)  
**Returns**: <code>Array.&lt;object&gt;</code> - - The matching data.

| Param     | Type                  | Description                                     |
| --------- | --------------------- | ----------------------------------------------- |
| condition | <code>function</code> | A test that returns true when condition is met. |

<a name="DocumentNode+getAll"></a>

### documentNode.getAll() ⇒ <code>Array.&lt;object&gt;</code>

Retrieve all records in the document

**Kind**: instance method of [<code>DocumentNode</code>](#DocumentNode)  
**Returns**: <code>Array.&lt;object&gt;</code> - - All records in the document.  
<a name="DocumentNode+save"></a>

### documentNode.save(record, cb) ⇒ <code>string</code> \| <code>number</code> \| <code>undefined</code>

Add one new record to the document

**Kind**: instance method of [<code>DocumentNode</code>](#DocumentNode)  
**Returns**: <code>string</code> \| <code>number</code> \| <code>undefined</code> - - The id of the saved record, if id property exists on record.

| Param  | Type                  | Description                                          |
| ------ | --------------------- | ---------------------------------------------------- |
| record | <code>object</code>   | Record to save.                                      |
| cb     | <code>function</code> | Callback function to run when the process completes. |

<a name="DocumentNode+delete"></a>

### documentNode.delete(id, cb)

Add one record from the document by id

**Kind**: instance method of [<code>DocumentNode</code>](#DocumentNode)

| Param | Type                                       | Description                                          |
| ----- | ------------------------------------------ | ---------------------------------------------------- |
| id    | <code>string</code> \| <code>number</code> | Id of the record to delete.                          |
| cb    | <code>function</code>                      | Callback function to run when the process completes. |

<a name="DocumentNode+clear"></a>

### documentNode.clear(documentName)

Hard deletes all information within document. All data will be lost forever.

**Kind**: instance method of [<code>DocumentNode</code>](#DocumentNode)

| Param        | Type                | Description                                                                               |
| ------------ | ------------------- | ----------------------------------------------------------------------------------------- |
| documentName | <code>string</code> | The name of the document you are attempting to clear. This redudancy is a safety measure. |
