var test = require('ava');
var Edition = require('../src/index');

var edition = new Edition();

test('Edition#test 01', function(t) {
  t.is(new Edition().dump(), JSON.stringify({ patches: [], lastBody: "" }));
});

test('Edition#test 02', function(t) {
  edition = new Edition().update({ id: "v1", body: "aaa", header: null })
    t.deepEqual(edition.get("v1"), { id: "v1", body: "aaa", header: null });
});

test('Edition#test 03', function(t) {
  edition = new Edition().update({ id: "v1", body: "aaa", header: null }).update({ id: "v2", body: "aaa\nbbb", header: null })
    t.deepEqual(edition.get("v1"), { id: "v1", body: "aaa", header: null });
});

test('Edition#test 04', function(t) {
  edition = new Edition()
  edition.update({ id: "v1", body: "aaa", header: null })
  edition.update({ id: "v2", body: "aaa\nbbb", header: null })
    t.deepEqual(edition.get("v1"), { id: "v1", body: "aaa", header: null });
});

test('Edition#test 05', function(t) {
  edition = new Edition()
  edition.update({ id: "v1", body: "aaa", header: null })
  edition.update({ id: "v2", body: "aaa\nbbb", header: null })
  t.deepEqual(edition.get("v2"), { id: "v2", body: "aaa\nbbb", header: null });
});

test('Edition#test 06', function(t) {
  edition = new Edition()
  edition.update({ id: "v1", body: "aaa", header: null })
  edition.update({ id: "v2", body: "aaa\nbbb", header: null })
  edition.update({ id: "v3", body: "aaa\nxxx\nccc", header: null })
  t.deepEqual(edition.get("v3"), { id: "v3", body: "aaa\nxxx\nccc", header: null });
});

test('Edition#test 07', function(t) {
  edition = new Edition()
  edition.update({ id: "v1", body: "aaa", header: null })
  edition.update({ id: "v2", body: "aaa\nbbb", header: null })
  edition.update({ id: "v3", body: "aaa\nccc", header: null })
  t.deepEqual(edition.get("v2"), { id: "v2", body: "aaa\nbbb", header: null });
});

test('Edition#test 08', function(t) {
  edition = new Edition()
  edition.update({ id: "v1", body: "aaa", header: null })
  edition.update({ id: "v2", body: "aaa\nbbb", header: null })
  edition.update({ id: "v3", body: "aaa\nxxx\nccc", header: null })
  t.deepEqual(edition.get("v100"), { id: "v3", body: "aaa\nxxx\nccc", header: null });
});

test('Edition#test 09', function(t) {
  edition = new Edition()
  edition.update({ id: "v1", body: "aaa", header: null })
  edition.update({ id: "v2", body: "aaa\nbbb", header: null })
  edition.update({ id: "v3", body: "aaa\nxxx\nccc", header: null })
  t.deepEqual(edition.get(), { id: "v3", body: "aaa\nxxx\nccc", header: null });
});

test('Edition#test 10', function(t) {
  edition = new Edition()
  t.throws(() => edition.get());
});

test('Edition#test 11', function(t) {
  edition = new Edition()
  t.is(edition.length, 0)

  edition.update({ id: "v1", body: "aaa", header: null })
  edition.update({ id: "v2", body: "aaa\nbbb", header: null })
  edition.update({ id: "v3", body: "aaa\nxxx\nccc", header: null })
  t.is(edition.length, 3)

});

test('Edition#test 12', function(t) {
  edition = new Edition()
  edition.update({ id: "v1", body: "aaa", header: null })
  edition.update({ id: "v2", body: "aaa\nbbb", header: null })
  edition.update({ id: "v3", body: "aaa\nxxx\nccc", header: null })

  dumpStr = edition.dump()

  edition2 = new Edition()
  edition2.parse(dumpStr)

  t.deepEqual(edition2.get("v1"), { id: "v1", body: "aaa", header: null });
  t.deepEqual(edition2.get("v2"), { id: "v2", body: "aaa\nbbb", header: null });
  t.deepEqual(edition2.get(), { id: "v3", body: "aaa\nxxx\nccc", header: null });
});

test('Edition#test 13', function(t) {
  edition = new Edition()
  t.is(edition.length, 0)

  edition.update({ id: "v1", body: "", header: null })
  edition.update({ id: "v2", body: "", header: null })
  edition.update({ id: "v3", body: "aaa", header: null })
  edition.update({ id: "v4", body: "aaa\n", header: null })
  edition.update({ id: "v5", body: "aaa\nbbb", header: null })
  edition.update({ id: "v6", body: "aaa\nccc", header: null })
  edition.update({ id: "v7", body: "ccc\n", header: null })
  edition.update({ id: "v8", body: "", header: null })

  t.is(edition.length, 8)
  t.deepEqual(edition.get("v1"), { id: "v1", body: "", header: null });
  t.deepEqual(edition.get("v2"), { id: "v2", body: "", header: null });
  t.deepEqual(edition.get("v3"), { id: "v3", body: "aaa", header: null });
  t.deepEqual(edition.get("v4"), { id: "v4", body: "aaa\n", header: null });
  t.deepEqual(edition.get("v5"), { id: "v5", body: "aaa\nbbb", header: null });
  t.deepEqual(edition.get("v6"), { id: "v6", body: "aaa\nccc", header: null });
  t.deepEqual(edition.get("v7"), { id: "v7", body: "ccc\n", header: null });
  t.deepEqual(edition.get("v8"), { id: "v8", body: "", header: null });

  dumpStr = edition.dump()

  edition2 = new Edition()
  edition2.parse(dumpStr)

  t.is(edition2.length, 8)
  t.deepEqual(edition2.get("v1"), { id: "v1", body: "", header: null });
  t.deepEqual(edition2.get("v2"), { id: "v2", body: "", header: null });
  t.deepEqual(edition2.get("v3"), { id: "v3", body: "aaa", header: null });
  t.deepEqual(edition2.get("v4"), { id: "v4", body: "aaa\n", header: null });
  t.deepEqual(edition2.get("v5"), { id: "v5", body: "aaa\nbbb", header: null });
  t.deepEqual(edition2.get("v6"), { id: "v6", body: "aaa\nccc", header: null });
  t.deepEqual(edition2.get("v7"), { id: "v7", body: "ccc\n", header: null });
  t.deepEqual(edition2.get("v8"), { id: "v8", body: "", header: null });

});
