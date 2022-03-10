import { existsSync, mkdir, readFileSync } from "fs";
import { randomUUID } from "crypto";
let fs = { existsSync, mkdir, readFileSync };
let crypto = { randomUUID };
import dbQueue from "./queue";

export class DatabaseNode {
  private path: string;
  private messageLabel: string;
  private fileExtension: string;

  constructor(path: string, options?: DatabaseOptions) {
    this.path = path;
    this.messageLabel = options?.messageLabel || "[lite-db]";
    this.fileExtension = options?.fileExtension || ".db";

    /** Initialize database folder, where files will be stored. */
    if (!fs.existsSync(path)) {
      fs.mkdir(path, (err) => console.log(err));
    }
  }

  getPath() {
    return this.path;
  }

  getMessageLabel() {
    return this.messageLabel;
  }

  getFileExtension() {
    return this.fileExtension;
  }

  /** Create a new document in the database. */
  document = (
    documentName: string,
    initialData: any[],
    options?: DocumentOptions
  ) => {
    return new DocumentNode(documentName, initialData, this, options);
  };
}

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
    // TODO: prevent construction of multiple of the same document
    this.documentName = documentName;
    this.database = database;
    this.data = this.restoreData(documentName, initialData);
    this.generateId = options?.generateId || false;
  }

  /** Log content using the database message label */
  log = (content: any) => {
    return console.log(this.database.getMessageLabel(), content);
  };

  /** Builds absolute url for document read/write location. */
  buildDocumentUrl = (documentName: string) => {
    return (
      this.database.getPath() +
      documentName +
      this.database.getFileExtension() +
      ".json"
    );
  };

  /** Restores data if document files already exist */
  restoreData = (documentName: string, data: any[]): any[] => {
    let url = this.buildDocumentUrl(documentName);
    if (!fs.existsSync(url)) {
      this.log(`${documentName} could not be found. Seeding data.`);
      this.setDocument(data);
      return data;
    }
    let rawData = fs.readFileSync(url, "utf8");
    data = JSON.parse(rawData);
    this.log(`${documentName} data restored.`);
    return data;
  };

  /** Retrieve first record that matches the given id */
  getOneById = (id: number | string) => {
    return this.data.find((record: any) => {
      record.id == id;
    });
  };

  /** Retrieve the first record in the document that passes the given test */
  getFirstMatch = (condition: any) => {
    return this.data.find(condition);
  };

  /** Retrieve all records in the document that pass the given test */
  getAllMatches = (condition: any) => {
    return this.data.filter(condition);
  };

  /** Retrieve all records in the document */
  getAll = () => {
    return this.data;
  };

  /** Add one new record to the document */
  save = (record: any, cb?: Function): string => {
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

  /** Add one record from the document by id */
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

  /** Hard deletes all information within document.
   * All data will be lost forever.
   * Pass the name of the document as first parameter.
   * This redudancy is a safety measure. */
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
