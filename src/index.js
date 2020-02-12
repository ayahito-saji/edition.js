module.exports = function () {
  jsdiff = require("diff")

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

      var patch = jsdiff.createPatch("", lastBody, body)
      let parsedPatch = jsdiff.parsePatch(patch)[0].hunks;

      patches.push({
        id: id,
        header: header,
        patch: parsedPatch
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
        body = jsdiff.applyPatch(body, [ {
          oldFileName: '',
          oldHeader: '',
          newFileName: '',
          newHeader: '',
          hunks: patch.patch
        } ])

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
