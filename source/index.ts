import { existsSync, mkdir, readFileSync } from "fs";
import { randomUUID } from "crypto";
let fs = { existsSync, mkdir, readFileSync };
let crypto = { randomUUID };
import dbQueue from "./queue";

const setupConfig = () => {
  const messageLabel = "[lite-db]";
  const rootDirectory = process.cwd();
  try {
    console.log(`${messageLabel} Attempting to load default config...`);
    const config = require(rootDirectory + "/" + "config.db.json");

    console.log(`${messageLabel} Config found in default location.`);
    config.fileExtension = config.fileExtension || ".db";
    config.databasePath = config.databasePath || rootDirectory + "/data/";
    config.messageLabel = config.messageLabel || "[json-db]";
    return config;
  } catch (e: any) {
    if (e.message.includes("Could not load module")) {
      console.log(
        `${messageLabel} Did not find config file in root directory, initialing json-db with defaults.`
      );
    } else {
      console.log(e);
    }
    return {
      fileExtension: ".db",
      databasePath: rootDirectory + "/data/",
      messageLabel,
    };
  }
};
let config = setupConfig();

/** Initialize database folder, where files will be stored. */
if (!fs.existsSync(config.databasePath)) {
  fs.mkdir(config.databasePath, (err) => console.log(err));
}

/** Prints message with custom formatting to console. */
const log = (content: any) => {
  return console.log(`${config.messageLabel}`, content);
};

/** Builds absolute url for document read/write location. */
const buildDocumentUrl = (documentName: string) => {
  return config.databasePath + documentName + config.fileExtension + ".json";
};

/** Parses documentName from the absolute path of the document. */
const parseDocumentUrl = (documentPath: string) => {
  const documentFile = documentPath.replace(config.databasePath, "");
  const documentName = documentPath.replace(config.fileExtension + ".json", "");
  return documentName;
};

interface Options {
  generateId?: boolean;
}

export class DocumentNode {
  /** Name of the document */
  documentName: string;
  /** The local representation of the stored document */
  private data: any[];
  /** Whether or not to automatically generateId */
  private generateId: boolean = false;

  constructor(documentName: string, initialData: any[], options?: Options) {
    // TODO: prevent construction of multiple of the same document
    this.documentName = documentName;
    this.data = this.restoreData(documentName, initialData);
    this.generateId = options?.generateId || false;
  }

  restoreData = (documentName: string, data: any[]): any[] => {
    let url = buildDocumentUrl(documentName);
    if (!fs.existsSync(url)) {
      log(`${documentName} could not be found. Seeding data.`);
      this.setDocument(data);
      return data;
    }
    let rawData = fs.readFileSync(url, "utf8");
    data = JSON.parse(rawData);
    log(`${documentName} data restored.`);
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
        log("Record saved:");
        log(record);
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
        log("Record deleted:");
        log(record);
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
        log("Cleared data:");
        log([]);
      };
    }
    if (this.documentName == documentName) {
      this.data = [];
      this.setDocument(this.data, cb);
    }
  };

  private setDocument = (data: any[], cb?: Function) => {
    let path = buildDocumentUrl(this.documentName);
    dbQueue(path, data, cb);
  };
}
