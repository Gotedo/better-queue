import assert from "assert";
import { destroyQueues } from "./lib/helper.js";
import Queue from "../lib/queue.js";

describe("Stats", function () {
  afterEach(destroyQueues);

  it("should get stat", function (done) {
    var completed = 0;
    var elapsedTotals = 0;
    var q = new Queue(function (wait, cb) {
      setTimeout(function () {
        cb();
      }, wait);
    });
    q.on("task_finish", function (id, result, stat) {
      completed++;
      elapsedTotals += stat.elapsed;
    });
    q.on("drain", function () {
      var stats = q.getStats();
      assert.ok(stats.peak);
      assert.equal(3, stats.total);
      assert.equal(
        Math.round((elapsedTotals / 3) * 1000) / 1000,
        Math.round(stats.average * 1000) / 1000
      );
      done();
    });
    q.push(1);
    q.push(1);
    q.push(1);
    this.q = q;
  });

  it("should reset stat", function (done) {
    var queued = 0;
    var elapsedTotal = 0;
    var q = new Queue(
      function (wait, cb) {
        setTimeout(function () {
          cb();
        }, wait);
      },
      {
        id: function (n, cb) {
          cb(null, n);
        },
      }
    );
    q.push(1, function () {
      q.push(1, function () {
        q.resetStats();
        q.on("task_finish", function (id, result, stat) {
          if (id !== "2") return;
          assert.ok(stat.elapsed > 0);
          var stats = q.getStats();
          assert.equal(1, stats.peak);
          assert.equal(1, stats.total);
          assert.equal(stats.average, stat.elapsed);
          done();
        });
        q.push(2);
      });
    });
    this.q = q;
  });
});
