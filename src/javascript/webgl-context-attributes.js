class WebGLContextAttributes {
  constructor (
    alpha,
    depth,
    stencil,
    antialias,
    premultipliedAlpha,
    preserveDrawingBuffer,
    preferLowPowerToHighPerformance,
    failIfMajorPerformanceCaveat,
    createWebGL2Context,
    useSwiftShader) {
    this.alpha = alpha
    this.depth = depth
    this.stencil = stencil
    this.antialias = antialias
    this.premultipliedAlpha = premultipliedAlpha
    this.preserveDrawingBuffer = preserveDrawingBuffer
    this.preferLowPowerToHighPerformance = preferLowPowerToHighPerformance
    this.failIfMajorPerformanceCaveat = failIfMajorPerformanceCaveat
    this.createWebGL2Context = createWebGL2Context
    this.useSwiftShader = useSwiftShader
  }
}

module.exports = { WebGLContextAttributes }
