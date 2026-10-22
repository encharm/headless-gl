// Run the suite on SwiftShader so pixel results don't depend on the host GPU
// driver. An explicit USE_SWIFTSHADER in the environment wins.
process.env.USE_SWIFTSHADER ??= '1'
