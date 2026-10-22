// Run the suite on SwiftShader so pixel results don't depend on the host GPU
// driver. linux-arm64 ships without SwiftShader binaries, so it keeps the
// default backend. An explicit USE_SWIFTSHADER in the environment wins.
if (!(process.platform === 'linux' && process.arch === 'arm64')) {
  process.env.USE_SWIFTSHADER ??= '1'
}
