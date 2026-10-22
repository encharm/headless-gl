# headless-gl

## Tests run on SwiftShader

Run tests on SwiftShader (`USE_SWIFTSHADER=1`), not the host GPU driver, so pixel results are predictable across machines. Metal, Mesa, and D3D round differently (e.g. a clear of 0.9 reads back as 229 on one and 230 on another).

- `npm test` preloads `test/setup.js`, which sets `USE_SWIFTSHADER=1` unless it's already set.
- CI also sets it in the job env. On Windows, the native `getenv` may not see a `process.env` value set at runtime.
- SwiftShader binaries ship for every platform in `deps/`. The linux-arm64 ones (`libvk_swiftshader.so`, `libvulkan.so.1`, ICD json) come from Playwright Chromium 140 build r1187 (`chromium-linux-arm64.zip`), stripped.
- When running a single test file by hand, use `npx tape -r ./test/setup.js test/<file>.js`.
- If a pixel test passes on SwiftShader but fails on a driver, that comes from driver rounding, not a bug. Don't loosen expectations to match a GPU.
