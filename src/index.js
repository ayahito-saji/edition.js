module.exports = function () {
  var jsdiff = require("diff")
  // create patch with jsdiff
  var createPatch = function (origin, other) {
    return diff = jsdiff.diffLines(origin, other).map(function (part) {
      return part.added === true ? [1, part.value] :
             part.removed === true ? [2, part.count] :[0, part.count]
    })
  }
  // パッチ適用関数
  var applyPatch = function (origin, patch) {
    var tmp = origin.split("\n")
    tmp = tmp.map(function (line, i) { return i < tmp.length - 1 ? line + '\n' : line })
    var count = 0
    patch.forEach(function(part) {
      switch (part[0]) {
        case 0:
          count += part[1]
          break
        case 1:
          tmp.splice(count, 0, part[1])
          count ++
          break
        case 2:
          tmp.splice(count, part[1])
      }
    })
    tmp = tmp.join('')
    return tmp
  }

  var patches = []
  var lastBody = ""

  this.dump = function () {
    return JSON.stringify({
      "patches": patches,
      "lastBody": lastBody
    })
  }

  this.parse = function (dumped) {
    parsed = JSON.parse(dumped)
    patches = parsed.patches
    lastBody = parsed.lastBody
    return this
  }

  this.update = function ({id, body, header}) {
    if (typeof id !== undefined) {

      var patch = createPatch(lastBody, body)

      patches.push({
        id: id,
        header: header,
        patch: patch
      })

      lastBody = body

    }
    return this
  }
  this.get = function (id) {
    if (patches.length === 0) throw new ReferenceError("No editions is exist.")
    if (typeof id === undefined) {
      var lastPatch = patches[patches.length - 1]
      return {
        id: lastPatch.id,
        header: lastPatch.header,
        body: lastBody
      }
    } else {
      var body = ""

      var i = 0;
      for (i=0;i<patches.length;i++){
        var patch = patches[i]
        body = applyPatch(body, patch.patch)
        if (patch.id === id || i === patches.length - 1) break
      }
      return {
        id: patch.id,
        header: patch.header,
        body: body
      }
    }
  }
  this.__defineGetter__("length", function() {
    return patches.length;
  });

  this.__defineGetter__("patches", function() {
    return patches;
  });
}
