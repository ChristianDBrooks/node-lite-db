import { existsSync, mkdir, readFileSync } from "fs";
import { randomUUID } from "crypto";
let fs = { existsSync, mkdir, readFileSync };
let crypto = { randomUUID };
import dbQueue from "./queue";

/**
 * A module for node-lite-db API.
 * @module node-lite-db
 */

/**
 * @class Represents a database connection.
 * @exports
 */
export class DatabaseNode {
  /** The path to the database.
   * @property
   */
  private path: string;
  /** The messageLabel to be used when logging.
   * @property
   */
  private messageLabel: string;
  /** The fileExtension to be used when creating document files.
   * @property
   */
  private fileExtension: string;
  /** A store of the existing database instances.
   * @property
   */
  static databases: any = {};

  /**
   * Represents a database connection
   * @constructor
   * @param path
   * @param options
   * @returns
   */
  constructor(path: string, options?: DatabaseOptions) {
    this.path = path;
    this.messageLabel = options?.messageLabel || "[lite-db]";
    this.fileExtension = options?.fileExtension || ".db";

    /** If instance has already been created for database path, return existing instance instead of creating a new one. */
    if (path in DatabaseNode.databases) {
      this.log(
        "A database instance at this path already exists. Returning existing instance..."
      );
      return DatabaseNode.databases[path];
    }

    /** Push current Database instance to databases object. */
    DatabaseNode.databases[path] = this;

    /** Initialize database folder, where files will be stored. */
    if (!fs.existsSync(path)) {
      fs.mkdir(path, (err) => console.log(err));
    }
  }

  /** Logs content to the console using the databases messageLabel.
   * @function
   * @param {any} - Content
   */
  log = (content: any) => {
    return console.log(this.getMessageLabel(), content);
  };

  /** Getter method for the path property.
   *  @returns {string} - The database path.
   */
  getPath() {
    return this.path;
  }

  /** Getter method for the messageLable property.
   *  @returns {string} - The messageLabel to be used for database logs.
   */
  getMessageLabel() {
    return this.messageLabel;
  }

  /** Getter method for the fileExtension property.
   *  @returns {string} - The fileExtension to be used for writing new documents.
   */
  getFileExtension() {
    return this.fileExtension;
  }

  /** Create a new document in the database.
   * @param {string} - The name of the document you want to create.
   * @param {any[]} - An array of data that should initially be in the document. Note: This only applies to newly created documents, not restored documents.
   * @param {DocumentOptions} - Optional configurations for the newly created DocumentNode.
   * @returns {DatabaseNode} - A new document instance that can be used to interact with the database document.
   */
  document = (
    documentName: string,
    initialData: any[],
    options?: DocumentOptions
  ) => {
    return new DocumentNode(documentName, initialData, this, options);
  };
}
/**
 * @class Represents a document file.
 * @exports
 */
export class DocumentNode {
  /** Name of the document */
  documentName: string;
  /** Name of the database the document belongs to */
  database: DatabaseNode;
  /** The local representation of the stored document */
  private data: any[];
  /** Whether or not to automatically generateId */
  private generateId: boolean = false;

  constructor(
    documentName: string,
    initialData: any[],
    database: DatabaseNode,
    options?: DocumentOptions
  ) {
    // TODO: prevent construction of multiple of the same document instance
    this.documentName = documentName;
    this.database = database;
    this.data = this.restoreData(documentName, initialData);
    this.generateId = options?.generateId || true;
  }

  /** Logs content to the console using the databases messageLabel.
   * @param {any} - Content
   */
  log = (content: any) => {
    return console.log(this.database.getMessageLabel(), content);
  };

  /** Builds absolute url for document read/write location.
   * @param {string} - The document name you to build the url for.
   * @returns {string} - The url to the document.
   */
  buildDocumentUrl = (documentName: string) => {
    return `${this.database.getPath()}/${documentName}${this.database.getFileExtension()}.json`;
  };

  /** Attempts to restore data if document file already exists.
   * @param {string} - The documentName.
   * @param {any[]} - The initial data for the file if it cannot be restored.
   * @returns {any[]} - An array of data contained in the document file.
   */
  restoreData = (documentName: string, data: any[]): any[] => {
    let url = this.buildDocumentUrl(documentName);
    if (!fs.existsSync(url)) {
      this.log(
        `${documentName} could not be found in /${this.database.getPath()}. Writing new file with initial data: ${JSON.stringify(
          data
        )}.`
      );
      this.setDocument(data);
      return data;
    }
    let rawData = fs.readFileSync(url, "utf8");
    data = JSON.parse(rawData);
    this.log(`${documentName} data restored.`);
    return data;
  };

  /** Retrieve first record that matches the given id
   * @param {number|string} - The id to search for.
   * @returns {object | undefined} - The found record or undefined if the record could not be found.
   */
  getOneById = (id: number | string) => {
    return this.data.find((record: any) => {
      record.id == id;
    });
  };

  /** Retrieve the first record in the document that passes the given test
   * @param {function} - A test to check the reecords against.
   * @returns {object | undefined} - Returns the first record to pass the test
   */
  getFirstMatch = (condition: any) => {
    return this.data.find(condition);
  };

  /** Retrieve all records in the document that pass the given test
   * @param {function} - A test that returns true when condition is met.
   * @returns {object[]} - The matching data.
   */
  getAllMatches = (condition: any) => {
    return this.data.filter(condition);
  };

  /** Retrieve all records in the document
   * @returns {object[]} - All records in the document.
   */
  getAll = () => {
    return this.data;
  };

  /** Add one new record to the document
   * @param {object} - Record to save.
   * @param {function} - Callback function to run when the process completes.
   * @returns {string|number|undefined} - The id of the saved record, if id property exists on record.
   */
  save = (
    record: { id?: string | number },
    cb?: Function
  ): string | number | undefined => {
    if (!cb) {
      cb = () => {
        this.log("Record saved:");
        this.log(record);
      };
    }
    if (this.generateId && !record.id) record.id = crypto.randomUUID();
    this.data.push(record);
    this.setDocument(this.data, cb);
    return record.id;
  };

  /** Add one record from the document by id
   * @param {string|number} - Id of the record to delete.
   * @param {function} - Callback function to run when the process completes.
   */
  delete = (id: string | number, cb?: Function) => {
    const recordIndex = this.data.findIndex((record: any) => record.id == id);
    if (!cb) {
      let record = this.data[recordIndex];
      cb = () => {
        this.log("Record deleted:");
        this.log(record);
      };
    }
    this.data.splice(recordIndex);
    this.setDocument(this.data, cb);
  };

  /** Hard deletes all information within document. All data will be lost forever.
   * @param {string} - The name of the document to delete. This redudancy is a safety measure.
   */
  clear = (documentName: string, cb?: Function) => {
    if (!cb) {
      cb = () => {
        this.log("Cleared data:");
        this.log([]);
      };
    }
    if (this.documentName == documentName) {
      this.data = [];
      this.setDocument(this.data, cb);
    }
  };

  /** @ignore */
  private setDocument = (data: any[], cb?: Function) => {
    let path = this.buildDocumentUrl(this.documentName);
    dbQueue(path, data, cb);
  };
}

interface DatabaseOptions {
  messageLabel?: string;
  fileExtension?: string;
}

interface DocumentOptions {
  generateId?: boolean;
}
