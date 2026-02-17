# gl

`gl` lets you create a WebGL 2 context in [Node.js](https://nodejs.org/en/) without making a window or loading a full browser environment.

It is built on [ANGLE](https://chromium.googlesource.com/angle/angle), the same graphics abstraction layer used by Chrome, using the Metal backend on macOS and SwiftShader (software Vulkan) for headless/CI environments.

## Example

```javascript
const createGL = require('gl')

const width = 64
const height = 64

const gl = createGL(width, height, { createWebGL2Context: true })

// Clear screen to red
gl.clearColor(1, 0, 0, 1)
gl.clear(gl.COLOR_BUFFER_BIT)

// Read pixels
const pixels = new Uint8Array(width * height * 4)
gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

// Clean up
gl.getExtension('STACKGL_destroy_context').destroy()
```

## Install

```
npm install gl
```

## API

```javascript
const createGL = require('gl')
const gl = createGL(width, height, contextAttributes)
```

* `width` — width of the drawing buffer
* `height` — height of the drawing buffer
* `contextAttributes` — optional object:
  * `createWebGL2Context` — set to `true` for a WebGL 2 context (default: `false`)
  * `alpha`, `depth`, `stencil`, `premultipliedAlpha`, `preserveDrawingBuffer` — standard WebGL context attributes
  * `useSwiftShader` — force software rendering via SwiftShader (default: `false`, also settable via `USE_SWIFTSHADER=1` env var)

**Returns** a WebGL rendering context backed by ANGLE, or `null` on failure.

### Extensions

All extensions supported by ANGLE are available via `gl.getExtension()`. Additionally, two custom extensions are provided:

#### `STACKGL_destroy_context`

Destroys the context and reclaims all resources immediately.

```javascript
gl.getExtension('STACKGL_destroy_context').destroy()
```

#### `STACKGL_resize_drawingbuffer`

Updates `drawingBufferWidth`/`drawingBufferHeight` and the viewport.

```javascript
gl.getExtension('STACKGL_resize_drawingbuffer').resize(newWidth, newHeight)
```

### Backends

* **macOS**: Metal (via ANGLE)
* **Linux/Windows**: Native GPU or SwiftShader (software Vulkan)
* **SwiftShader**: Force with `useSwiftShader: true` or `USE_SWIFTSHADER=1` env var. Useful for CI/headless environments without a GPU.

## System dependencies

In most cases `npm install gl` should just work using prebuilt binaries.

For building from source:

* **macOS**: Xcode, Python 3
* **Linux**: `build-essential`, Python 3
* **Windows**: Visual Studio, Python 3

## Development

1. Clone: `git clone <repo-url>`
2. Install: `npm install`
3. Build: `npm run rebuild`
4. Test: `npx tape test/*.js`

## License

See LICENSES
