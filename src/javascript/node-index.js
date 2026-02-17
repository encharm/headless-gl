const { NativeWebGLRenderingContext } = require('./native-gl')

function flag (options, name, dflt) {
  if (!options || !(typeof options === 'object') || !(name in options)) {
    return dflt
  }
  return !!options[name]
}

function createContext (width, height, options) {
  width = width | 0
  height = height | 0
  if (!(width > 0 && height > 0)) {
    return null
  }

  const alpha = flag(options, 'alpha', true)
  const depth = flag(options, 'depth', true)
  const stencil = flag(options, 'stencil', false)
  const antialias = false
  const premultipliedAlpha = flag(options, 'premultipliedAlpha', true) && alpha
  const preserveDrawingBuffer = flag(options, 'preserveDrawingBuffer', false)
  const preferLowPower = flag(options, 'preferLowPowerToHighPerformance', false)
  const failIfMajorPerf = flag(options, 'failIfMajorPerformanceCaveat', false)
  const createWebGL2 = flag(options, 'createWebGL2Context', false)
  const useSwiftShader = flag(options, 'useSwiftShader', false)

  let ctx
  try {
    ctx = new NativeWebGLRenderingContext(
      width, height,
      alpha, depth, stencil, antialias,
      premultipliedAlpha, preserveDrawingBuffer,
      preferLowPower, failIfMajorPerf,
      createWebGL2, useSwiftShader)
  } catch (e) {
    return null
  }

  ctx.drawingBufferWidth = width
  ctx.drawingBufferHeight = height

  // --- Patches for methods the native binding doesn't provide ---

  // getSupportedExtensions: native returns space-separated string, WebGL expects array
  const nativeGetSupportedExtensions = ctx.getSupportedExtensions.bind(ctx)
  ctx.getSupportedExtensions = function () {
    const result = nativeGetSupportedExtensions()
    return typeof result === 'string' ? result.split(' ').filter(Boolean) : result
  }

  // getExtension: native activates but returns undefined; WebGL expects truthy object
  const nativeGetExtension = ctx.getExtension.bind(ctx)
  const extensionCache = {}
  ctx.getExtension = function (name) {
    if (name in extensionCache) return extensionCache[name]
    const supported = ctx.getSupportedExtensions()
    if (supported.indexOf(name) >= 0) {
      nativeGetExtension(name)
      if (name === 'STACKGL_destroy_context') {
        extensionCache[name] = { destroy: ctx.destroy.bind(ctx) }
      } else if (name === 'STACKGL_resize_drawingbuffer') {
        extensionCache[name] = { resize: ctx.resize.bind(ctx) }
      } else {
        extensionCache[name] = {}
      }
      return extensionCache[name]
    }
    extensionCache[name] = null
    return null
  }

  // resize: update drawing buffer dimensions
  ctx.resize = function (w, h) {
    ctx.drawingBufferWidth = w
    ctx.drawingBufferHeight = h
    ctx.viewport(0, 0, w, h)
  }

  ctx.isContextLost = function () { return false }
  ctx.getContextAttributes = function () {
    return { alpha, depth, stencil, antialias, premultipliedAlpha, preserveDrawingBuffer }
  }

  // uniform*fv / vertexAttrib*fv: native binding only has scalar versions
  ctx.uniform1fv = function (loc, v) { for (let i = 0; i < v.length; i++) ctx.uniform1f(loc + i, v[i]) }
  ctx.uniform2fv = function (loc, v) { for (let i = 0; i < v.length / 2; i++) ctx.uniform2f(loc + i, v[2*i], v[2*i+1]) }
  ctx.uniform3fv = function (loc, v) { for (let i = 0; i < v.length / 3; i++) ctx.uniform3f(loc + i, v[3*i], v[3*i+1], v[3*i+2]) }
  ctx.uniform4fv = function (loc, v) { for (let i = 0; i < v.length / 4; i++) ctx.uniform4f(loc + i, v[4*i], v[4*i+1], v[4*i+2], v[4*i+3]) }
  ctx.uniform1iv = function (loc, v) { for (let i = 0; i < v.length; i++) ctx.uniform1i(loc + i, v[i]) }
  ctx.uniform2iv = function (loc, v) { for (let i = 0; i < v.length / 2; i++) ctx.uniform2i(loc + i, v[2*i], v[2*i+1]) }
  ctx.uniform3iv = function (loc, v) { for (let i = 0; i < v.length / 3; i++) ctx.uniform3i(loc + i, v[3*i], v[3*i+1], v[3*i+2]) }
  ctx.uniform4iv = function (loc, v) { for (let i = 0; i < v.length / 4; i++) ctx.uniform4i(loc + i, v[4*i], v[4*i+1], v[4*i+2], v[4*i+3]) }
  ctx.vertexAttrib1fv = function (idx, v) { ctx.vertexAttrib1f(idx, v[0]) }
  ctx.vertexAttrib2fv = function (idx, v) { ctx.vertexAttrib2f(idx, v[0], v[1]) }
  ctx.vertexAttrib3fv = function (idx, v) { ctx.vertexAttrib3f(idx, v[0], v[1], v[2]) }
  ctx.vertexAttrib4fv = function (idx, v) { ctx.vertexAttrib4f(idx, v[0], v[1], v[2], v[3]) }

  return ctx
}

module.exports = createContext
