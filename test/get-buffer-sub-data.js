'use strict'

const tape = require('tape')
const createContext = require('../index')

// getBufferSubData reads a buffer back through a mapped range. Element
// offsets count the destination view's element type, a view into a larger
// ArrayBuffer is filled at the view, and a pixel pack buffer filled by
// readPixels reads back the pixels.
tape('getBufferSubData', function (t) {
  const gl = createContext(16, 16, { createWebGL2Context: true })

  const source = new Uint16Array(64)
  for (let i = 0; i < 64; i++) source[i] = 1000 + i
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, source, gl.STATIC_READ)

  const whole = new Uint16Array(64)
  gl.getBufferSubData(gl.ARRAY_BUFFER, 0, whole)
  t.deepEqual(Array.from(whole), Array.from(source), 'whole buffer')

  const part = new Uint16Array(16)
  gl.getBufferSubData(gl.ARRAY_BUFFER, 20, part, 4, 8)
  t.deepEqual(Array.from(part), [0, 0, 0, 0, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 0, 0, 0, 0], 'dstOffset and length in elements')

  const backing = new ArrayBuffer(64)
  const view = new Uint8Array(backing, 32, 16)
  gl.getBufferSubData(gl.ARRAY_BUFFER, 0, view)
  t.ok(new Uint8Array(backing, 0, 32).every(v => v === 0), 'bytes before the view untouched')
  t.equal(view[0] | (view[1] << 8), 1000, 'copy lands at the view')

  gl.getBufferSubData(gl.ARRAY_BUFFER, 0, part, 20, 4)
  t.equal(gl.getError(), gl.NO_ERROR, 'out-of-range request is ignored')

  gl.clearColor(0.2, 0.6, 0.9, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  const pack = gl.createBuffer()
  gl.bindBuffer(gl.PIXEL_PACK_BUFFER, pack)
  gl.bufferData(gl.PIXEL_PACK_BUFFER, 16 * 16 * 4, gl.STATIC_READ)
  gl.readPixels(0, 0, 16, 16, gl.RGBA, gl.UNSIGNED_BYTE, 0)
  const pixels = new Uint8Array(16 * 16 * 4)
  gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, pixels)
  t.deepEqual(Array.from(pixels.slice(0, 4)), [51, 153, 229, 255], 'pixel pack buffer reads back')
  t.equal(gl.getError(), gl.NO_ERROR, 'no error')

  gl.destroy()
  t.end()
})
