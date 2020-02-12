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
  console.log(dumpStr)

  edition2 = new Edition()
  edition2.parse(dumpStr)

  t.deepEqual(edition2.get("v1"), { id: "v1", body: "aaa", header: null });
  t.deepEqual(edition2.get("v2"), { id: "v2", body: "aaa\nbbb", header: null });
  t.deepEqual(edition2.get(), { id: "v3", body: "aaa\nxxx\nccc", header: null });
});
