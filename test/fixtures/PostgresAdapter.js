import PostgresAdapter from "../../lib/stores/PostgresAdapter.js";

function MockPostgresAdapter(opts) {
  opts.verbose = false;
  opts.username = "diamond";
  opts.dbname = "diamond";
  PostgresAdapter.call(this, opts);
}

MockPostgresAdapter.prototype = Object.create(PostgresAdapter.prototype);

export default MockPostgresAdapter;
