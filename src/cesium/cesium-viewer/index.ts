import { SceneMode, Viewer } from "cesium";

export type CesiumViewerOptions = Viewer.ConstructorOptions;

export class CesiumViewer {
  private static readonly DEFAULT_VIEWER_OPTIONS = {
    animation: false,
    baseLayer: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    navigationHelpButton: false,
    projectionPicker: false,
    scene3DOnly: true,
    sceneMode: SceneMode.SCENE3D,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    vrButton: false,
  } satisfies CesiumViewerOptions;

  private static readonly DESTROYED_ERROR_MESSAGE =
    "CesiumViewer has been destroyed. Create a new CesiumViewer instance.";

  private readonly _viewer: Viewer;

  constructor(
    container: ConstructorParameters<typeof Viewer>[0],
    options: CesiumViewerOptions = {},
  ) {
    const viewerOptions: CesiumViewerOptions = {
      ...CesiumViewer.DEFAULT_VIEWER_OPTIONS,
      ...options,
    };

    if (options.baseLayerPicker === true && options.baseLayer === undefined) {
      delete viewerOptions.baseLayer;
    }

    this._viewer = new Viewer(container, viewerOptions);
  }

  get viewer(): Viewer {
    if (this.isDestroyed()) {
      throw new Error(CesiumViewer.DESTROYED_ERROR_MESSAGE);
    }

    return this._viewer;
  }

  isDestroyed(): boolean {
    return this._viewer.isDestroyed();
  }

  destroy(): void {
    if (!this.isDestroyed()) {
      this._viewer.destroy();
    }
  }
}
