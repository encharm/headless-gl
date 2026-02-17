const HALF_FLOAT_OES = 0x8D61

class OESTextureHalfFloat {
  get HALF_FLOAT_OES () {
    return HALF_FLOAT_OES
  }
}

function getOESTextureHalfFloat (context) {
  let result = null
  const exts = context.getSupportedExtensions()

  if (exts && exts.indexOf('OES_texture_half_float') >= 0) {
    result = new OESTextureHalfFloat()
  }

  return result
}

module.exports = { getOESTextureHalfFloat, OESTextureHalfFloat }
