'use strict'

const tape = require('tape')
const createContext = require('../index')

// A texture upload takes its pixels from an ArrayBufferView, and the binding
// applies the WebGL-only unpack flags (flip, premultiply) itself before the
// driver sees the data. That copy is the one place a source's extent is not
// checked by ANGLE, so the binding refuses what it cannot bound: a source that
// is not a view throws the TypeError a browser throws for an unsupported
// overload, and a view that is empty or shorter than the region records
// INVALID_OPERATION the way a browser does, instead of being read past its end.
tape('upload sources are bounded', function (t) {
  const gl = createContext(4, 4, { createWebGL2Context: true })
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  t.equal(gl.getError(), gl.NO_ERROR, 'storage without data is allocated')

  const element = { width: 2, height: 2, getContext: () => null }
  t.throws(() => gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, element), TypeError, 'element form of texSubImage2D throws')
  t.throws(() => gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, element), TypeError, 'element form of texImage2D throws')
  t.throws(() => gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 2, 2, gl.RGBA, gl.UNSIGNED_BYTE, {}), TypeError, 'a plain object is refused')
  t.equal(gl.getError(), gl.NO_ERROR, 'a thrown call records no GL error')

  gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 2, 2, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(0))
  t.equal(gl.getError(), gl.INVALID_OPERATION, 'an empty view is an operation error')

  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1)
  gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 2, 2, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(2 * 2 * 4 - 1))
  t.equal(gl.getError(), gl.INVALID_OPERATION, 'a view one byte short is an operation error with premultiply on')
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(3))
  t.equal(gl.getError(), gl.INVALID_OPERATION, 'a short view is an operation error for texImage2D too')

  const pixels = new Uint8Array(2 * 2 * 4)
  for (let i = 0; i < 4; i++) pixels.set([200, 100, 50, 128], i * 4)
  gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 2, 2, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
  t.equal(gl.getError(), gl.NO_ERROR, 'a view of the right size uploads with premultiply on')

  const fbo = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
  const back = new Uint8Array(4)
  gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, back)
  t.deepEqual(Array.from(back), [100, 50, 25, 128], 'the upload was premultiplied by the binding')
  t.equal(gl.getError(), gl.NO_ERROR, 'no error')

  gl.destroy()
  t.end()
})
