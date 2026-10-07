<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

# unified-toolkit SDK 开发规范

## 项目定位与事实来源

- 本项目是单包 TypeScript SDK，面向可复用的工具能力和地图引擎适配能力；不要按 Web 应用或 monorepo 约定新增 `apps/`、页面、路由和框架专属目录。
- 根规则覆盖本仓库的 `src/`、`tests/` 和包级配置。新增更近的 `AGENTS.md` 时，只补充局部事实，不重复或改写根规则。
- `package.json`、`vite.config.ts` 和 `tsconfig.json` 是脚本、打包、类型和编译选项的事实来源；规则文件只记录配置无法表达的工程约定。
- 结论必须以仓库源码、配置、类型、测试或已读取的官方文档为依据；无法确认时明确说明，不凭记忆补全 SDK 行为。

## 执行流程与变更边界

### 修改前

- 直接阅读相关代码、测试、配置和调用关系，验证需求前提；不得仅依据搜索结果、文件名、代码片段或推测修改。
- 检查 `git status`，保留用户已有的 staged、unstaged 和未跟踪改动。查看代码、测试、配置、Git diff/status、引用、日志和调用关系等只读调查可直接进行。
- 多步骤改动简述目标、范围和验证方式；简单修改直接执行。

### 实现中

- 始终采用最小充分改动：优先最直接的实现路径、最小 diff 和最少文件；只有任务存在真正独立的多个部分时才拆分实现。
- 优先复用已有函数、Helper、组件、类型、配置、测试工具和编码模式，不为单一调用方或未来设想新增抽象、架构、脚手架或配置。
- Bug 应修复根因，不堆叠条件、workaround、重复实现或绕开根因的补丁。保持范围外行为不变；新实现替代旧实现时删除旧代码，除非明确要求兼容，否则不保留两套相同行为路径。
- 未经用户明确授权，不得修改无关文件、扩大任务范围、增加第三方依赖、框架、服务或测试基础设施，也不得修改公共 API、公开接口协议、数据库 Schema、持久化格式或 wire format。
- 未经用户明确授权，不得删除或覆盖用户数据、丢弃未提交代码、重写 Git 历史、删除或 drop 数据，也不得擅自升级依赖、重命名、删除、提交、推送或操作外部系统。
- 出现范围持续扩大、无关重构清理、无关命名格式修改、反复增加 workaround 或为未要求行为补测试时，停止并缩小方案。若正确实现必须扩大范围，先说明原因和新的最小必要范围并获得确认。

## Git 提交规范

- 提交信息采用 Conventional Commits：`type(scope)!: 描述`。`scope` 和 `!` 可选；描述必须非空，默认使用中文，清楚说明行为或目的，不强制检测描述语言。
- `type` 只允许 `feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`build`、`ci`、`chore`、`revert`。`scope` 使用小写 kebab-case，例如 `cesium`、`mapbox`、`commit-hooks`。
- 示例：`fix(cesium): 修复 Viewer 销毁后的访问检查`、`chore(commit-hooks): 增加提交信息校验`；破坏性变更使用 `!`，可在正文后添加 `BREAKING CHANGE:` footer 说明影响与迁移方式。
- 每次提交围绕单一目的，只暂存本次授权范围；保留已有 staged、unstaged 和未跟踪改动，不使用全量暂存覆盖用户选择。
- 提交前检查 Git 状态、暂存差异和 `git diff --cached --check`，执行与变更相关的验证。提交、推送必须获得用户明确授权；说明提交范围、信息、验证结果，以及推送时的目标分支。
- 沿用 Vite+ 钩子：`pre-commit` 执行暂存文件质量检查，`commit-msg` 通过 `vp exec commitlint --edit` 校验提交信息。`commitlint.config.js` 继承 `@commitlint/config-conventional`，只调整 scope 为 kebab-case，并关闭描述大小写限制以支持中文及 API 名称。
- 提交信息遵循预设的长度、标点、正文和 footer 规则；首行不超过 100 个字符，不以英文句点结尾，正文和 footer 前留空行。合并、回滚等信息采用 commitlint 默认忽略规则。校验失败时修正信息，不通过关闭钩子绕过。

## 工具链、验证与交付

- 依赖安装使用 `vp install`，并安装到项目 `node_modules`；禁止创建、配置或使用任何 `.pnpm-store` 目录。
- 执行命令前检查 `package.json` 和 `vite.config.ts`，区分 Vite+ 内置命令与项目脚本。当前包使用 `vp pack` 构建、`vp test --run` 运行一次性测试、`vp check` 做质量检查；验证 `build` 脚本转发时使用 `vp run build`。
- 只在依赖确实缺失或公共行为需要时调整依赖；依赖或锁文件变化后运行 `vp install`，并检查 optional peer dependency 的安装与加载边界。
- 优先运行覆盖本次修改的最小测试集并修改现有测试；仅当用户可观察行为变化且现有测试未覆盖、存在明确回归风险或用户明确要求时新增测试。每个新增测试必须对应验收条件或回归场景，不得顺便补覆盖率、引入测试框架或创建无必要的测试基础设施。
- 引擎测试使用隔离的 mock，覆盖与改动相关的未初始化、重复调用、外部移除、实例重建、异步加载、失败重试或销毁清理；不依赖真实网络或真实 token。
- `vp check --fix` 会改写文件，仅用于本次已授权范围，避免改写无关文件。普通文档变更至少运行 `git diff --check`，不盲目运行全量构建。
- 交付前复查 `git diff`、`git status` 和 `git diff --check`，确认没有本次任务引入的无关修改、调试代码、临时或备份文件、废弃代码路径或无意义兼容层。质量检查失败时区分本次变更、既有基线和工具链问题，不通过修改 vendored 文件或删除测试规避失败。
- 只有请求行为和验收条件满足、最相关检查已执行并明确报告实际命令与结果时，任务才算完成；同时说明未验证的运行时行为、假设和限制。

## 公共 API 与运行兼容性

- `src/index.ts` 是包级公共入口；新增或修改公共导出时，同时检查模块入口、声明文件、调用方、测试和使用文档。
- 导出的函数、类、选项和类型必须有稳定名称和显式类型；优先使用类型守卫、泛型和工具类型，避免无必要的类型断言与 `any`。
- 模块私有类型就近定义；跨模块复用类型放入已有共享位置，不通过深层内部路径形成未声明的公共 API。
- 公共 API 的默认值、覆盖优先级、返回值、错误条件和副作用必须可观察、可测试；不得静默修改调用方传入的选项对象。配置 Day.js 插件、语言环境或其他全局行为时，在导出说明和测试中明确副作用。
- Cesium 和 `mapbox-gl` 是可选 peer dependency。未安装地图引擎时工具能力应保持可用；引擎专属导入、初始化和运行时访问必须隔离在对应模块，并测试无引擎场景。
- 修改已有公共接口时优先保持向后兼容；确需破坏兼容性时，先更新类型、测试和文档，并在交付说明中列出影响。
- 当前仓库未声明目标浏览器版本。新增 Web API、DOM/Event API 或依赖浏览器行为的语法前，先确认消费者目标范围；不得自行假定兼容性，必要时提供降级或替代实现。
- 引擎适配层与工具层分离，不把浏览器全局、DOM 容器或地图实例泄漏到无关工具 API。使用第三方 API 前检查当前依赖版本并优先依据对应官方文档，不因名称相似假定不同版本行为一致。

## 模块与文件布局

- 各能力按 `src/<module>/` 隔离；`src/<module>/index.ts` 是模块入口，具体能力放在 `src/<module>/<module>-<feature>/`，例如 `src/cesium/cesium-viewer/` 或 `src/mapbox/map-layer/`。
- 每个能力目录使用 `index.ts` 作为入口，私有实现、类型和辅助文件放在同一目录。父级入口只负责公共导出和模块聚合，不新增同级散落实现。
- 新增目录使用小写 kebab-case；功能目录统一使用 `<module>-<feature>`。文件名和导出名遵循所在模块约定；新增 Cesium 功能使用 `src/cesium/cesium-<feature>/`。
- 声明文件放在所属模块或功能目录，不散落在 `src/` 根目录；模块共享声明放在 `src/<module>/`，功能专属声明放在能力目录。声明文件使用小写 kebab-case，例如 `src/cesium/styles.d.ts` 或 `src/cesium/cesium-viewer/types.d.ts`。
- 新增或移动声明文件时检查 TypeScript 包含范围、入口导出、类型生成和相关测试。测试专属声明仅放在对应镜像测试目录，不跨模块共享隐式声明。
- 测试目录镜像源码目录，例如 `src/cesium/cesium-viewer/` 对应 `tests/cesium/cesium-viewer/`。移动公共能力时同步检查入口、声明、测试和文档。
- 跨模块代码通过模块或能力入口访问稳定 API，不依赖深层内部文件。
- 保持模块高内聚、低耦合；文件超过约 300 行时评估职责拆分，超过 500 行时按职责拆分，生成文件、锁文件和 vendored 第三方内容除外。不得为满足行数机械拆分、增加无意义转发或删除必要注释。

## Cesium 与 Mapbox 专项规则

- 涉及 Cesium 时，先读取 `.agents/skills/using-cesiumjs-skills/SKILL.md`，再读取匹配的领域技能；跨领域问题依据 `.agents/skills/using-cesiumjs-skills/docs/DOMAINS.md` 判断归属。
- 涉及 Mapbox GL JS、样式、图层、数据源、搜索、导航、性能或 token 时，从 `.agents/skills/` 选择对应技能，只读取本次改动涉及的领域；涉及生命周期、性能或 token 时再核对对应指导。
- `.agents/skills/` 中的上游 vendored 内容和许可证保持原样；项目专属规则只写在根 `AGENTS.md` 或其他项目自有文档中。
- Viewer、Map、图层、数据源和事件监听器必须显式创建和释放；模块加载、导入或构造配置对象时不得创建引擎实例或启动网络请求。
- 初始化、复用、销毁和外部销毁必须行为明确；销毁幂等，外部移除或重建后的旧引用不得写入失效实例。依赖引擎实例的操作在未初始化时应尽早失败，并提示正确初始化步骤。
- 资源绑定当前 Viewer 或 Map；实例重建、资源被外部移除或失效后，重新添加时创建新绑定，不产生重复资源或遗留监听器。
- 异步资源加载复用同一进行中的 Promise；删除等待必要加载完成，失败后清理缓存状态，使调用方可以显式重试。
- Cesium 的相机、实体、图层、数据源和渲染资源遵循对应领域技能；Mapbox source/layer 操作等待地图完成 `load`，状态更新优先作用于现有实例，销毁时同步移除地图资源和事件监听器。
- 地图 token 使用环境配置或调用方注入值；不得提交、硬编码、打印或回传 secret token，并遵循最小权限和可用范围限制。
- WMS/WFS 等协议的具体参数、版本字段和请求拼接规则以源码、类型和测试为唯一事实来源。
