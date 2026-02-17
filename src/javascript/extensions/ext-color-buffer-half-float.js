class EXTColorBufferHalfFloat {}

function getEXTColorBufferHalfFloat (context) {
  let result = null
  const exts = context.getSupportedExtensions()

  if (exts && exts.indexOf('EXT_color_buffer_half_float') >= 0) {
    result = new EXTColorBufferHalfFloat()
  }

  return result
}

module.exports = { getEXTColorBufferHalfFloat, EXTColorBufferHalfFloat }
