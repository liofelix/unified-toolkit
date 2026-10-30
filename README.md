# unified-toolkit

通用工具库与 Cesium、Mapbox 原生 API 的 TypeScript 导出。

Cesium 和 Mapbox 是可选的 peer dependency，支持的版本范围分别为 `cesium@^1.146.0` 和 `mapbox-gl@^3.32.0`。仅使用通用工具时无需安装地图引擎；使用对应原生 API 时，在消费者项目中安装所需引擎，并从专用子路径导入：

```ts
import { cesium } from "unified-toolkit/cesium";
import { mapboxgl } from "unified-toolkit/mapbox";

// 通过命名空间访问原生 API：
// cesium.Resource、cesium.Viewer
// mapboxgl.Map、mapboxgl.Marker
```

专用子路径分别通过 `cesium`、`mapboxgl` 命名空间提供原库 API，但不会在模块加载时创建 Viewer、Map、设置 token 或请求地图服务。Cesium 子路径会自动加载官方 `widgets.css`。

## Cesium Viewer

`CesiumViewer` 构造时会创建一个原生 `Viewer`。默认关闭全部可配置控件、固定为 3D 模式，并且不加载在线底图或 Ion 地形：

```ts
import { CesiumViewer } from "unified-toolkit/cesium";

const cesiumInstance = new CesiumViewer("cesiumContainer");
const viewer = cesiumInstance.viewer;

// 在组件卸载或容器移除前释放 WebGL 和事件资源。
cesiumInstance.destroy();
```

传入的原生 `Viewer` 选项优先于默认值，可显式配置所需的底图、地形或控件：

```ts
import { cesium, CesiumViewer } from "unified-toolkit/cesium";

const baseLayer = new cesium.ImageryLayer(
  new cesium.OpenStreetMapImageryProvider({
    url: "https://tile.openstreetmap.org/",
  }),
);

const cesiumInstance = new CesiumViewer("cesiumContainer", {
  baseLayer,
  homeButton: true,
});
```

`CesiumViewer` 不修改 `cesium.Ion.defaultAccessToken`。需要使用 Cesium Ion 资源时，应从运行时配置读取 token，并在创建实例或 Ion 资源前由调用方显式设置；不要将 secret token 硬编码到源码中。

## Development

- Install dependencies:

```bash
vp install
```

- Run the unit tests:

```bash
vp test
```

- Build the library:

```bash
vp pack
```
