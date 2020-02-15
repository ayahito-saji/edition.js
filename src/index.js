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
  var base = null

  this.dump = function () {
    return JSON.stringify({
      "patches": patches,
      "base": base
    })
  }

  this.parse = function (dumped) {
    parsed = JSON.parse(dumped)
    patches = parsed.patches
    base = parsed.base
    return this
  }

  this.update = function ({id, body, header}) {
    if (id === undefined) {
      id = new Date().getTime().toString(16) + Math.floor(65536*Math.random()).toString(16) + Math.floor(65536*Math.random()).toString(16)
    }

    if (base != null) {
      patches.push({
        id: base.id,
        header: base.header,
        patch: createPatch(body, base.body)
      })
    }

    base = {
      id: id,
      header: header,
      body: body
    }

    return base
  }
  this.get = function (id) {
    if (this.length === 0) throw new ReferenceError("No editions is exist.")
    if (typeof id === undefined || id === base.id) {
      return base
    }
    else {
      var body = base.body

      var i = 0;
      for (i=patches.length - 1;i>=0;i--){
        var patch = patches[i]
        body = applyPatch(body, patch.patch)
        if (patch.id === id) {
          return {
            id: patch.id,
            header: patch.header,
            body: body
          }
        } else if (i === 0) return base
      }
    }
  }
  this.__defineGetter__("length", function() {
    return patches.length + (base !== null ? 1 : 0);
  });

  this.__defineGetter__("patches", function() {
    return patches;
  });

  this.__defineGetter__("base", function() {
    return base;
  });
}
