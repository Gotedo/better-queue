import fs from "fs-extra";
import { v4 as uuid } from "uuid";
import SqliteAdapter from "../../lib/stores/SqliteAdapter.js";

function MockSqliteAdapter(opts) {
  opts.verbose = false;
  opts.path = opts.path || uuid() + ".sqlite";
  SqliteAdapter.call(this, opts);
}

MockSqliteAdapter.prototype = Object.create(SqliteAdapter.prototype);

MockSqliteAdapter.prototype.close = function (cb) {
  var after = function () {
    SqliteAdapter.prototype.close.call(this, cb);
  };
  if (this.path === ":memory:") return after();
  fs.unlink(this.path, function (err) {
    after();
  });
};

export default MockSqliteAdapter;
