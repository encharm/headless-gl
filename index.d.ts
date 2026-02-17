declare namespace createContext {
  interface STACKGL_destroy_context {
      destroy(): void;
  }

  interface STACKGL_resize_drawingbuffer {
      resize(width: GLint, height: GLint): void;
  }

  interface StackGLExtension {
      getExtension(extensionName: "STACKGL_destroy_context"): STACKGL_destroy_context | null;
      getExtension(extensionName: "STACKGL_resize_drawingbuffer"): STACKGL_resize_drawingbuffer | null;
  }
}

declare function createContext(
  width: number,
  height: number,
  options?: WebGLContextAttributes & { createWebGL2Context?: false; useSwiftShader?: boolean },
): WebGLRenderingContext & createContext.StackGLExtension;

declare function createContext(
  width: number,
  height: number,
  options: WebGLContextAttributes & { createWebGL2Context: true; useSwiftShader?: boolean }
): WebGL2RenderingContext & createContext.StackGLExtension;

declare function createContext(
  width: number,
  height: number,
  options?: WebGLContextAttributes & { createWebGL2Context?: boolean; useSwiftShader?: boolean }
): (WebGLRenderingContext | WebGL2RenderingContext) & createContext.StackGLExtension;

export = createContext;
