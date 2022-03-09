import { writeFile } from "fs";

const dbQueue = (path: string, content: any, cb?: Function) => {
  var queue: any = queues[path];
  if (queue == null) queue = queues[path] = new Queue();

  queue.add(path, content, (err: any) => {
    cb && cb(err);
    queue.next();
  });
};
var queues: any = {};

class Queue {
  queue: any;

  constructor() {
    this.queue = [];
  }
  next() {
    if (this.queue.length === 0) return;

    var [path, content, cb] = this.queue[0];
    writeFile(path, JSON.stringify(content), "utf8", (err: any) => {
      this.queue.shift();
      cb && cb(err);
    });
  }
  add(...args: any[]) {
    this.queue.push(args);
    if (this.queue.length === 1) {
      this.next();
    }
  }
}

export default dbQueue;
