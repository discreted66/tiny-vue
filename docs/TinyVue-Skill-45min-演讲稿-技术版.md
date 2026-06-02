# TinyVue 智能组件库：Skill × 无障碍 × 知识库 × MCP 技术实践

**演讲时长：45 分钟 | 技术深度版**

---

## 一、开场与背景（约 3 分钟）

大家好，我是 XXX。今天这场分享的主题是：**TinyVue 智能组件库在 AI 时代的技术实践**，重点讲 Skill、无障碍、知识库和 MCP 四个方向如何结合，让组件库从「给人用」走向「AI 原生、人人可用」。

先简单介绍一下 TinyVue。TinyVue 是 OpenTiny 开源的企业级 Vue 组件库，目前有 **104+ 组件**，支持 **Vue 2 / Vue 3**，同时覆盖 **PC 和移动端**。架构上采用 **Renderless 无渲染架构**：逻辑在 `renderless` 包，视图在 `vue` 包，样式在 `theme` / `theme-saas` 包，三者分离，便于扩展和主题定制。

在 AI 时代，组件库面临一个新命题：**不仅要让人好用，还要让 AI 也能正确理解和使用**。这就是我们今天要展开的四个技术方向。

---

## 二、TinyVue Skill 技术详解（约 12 分钟）

### 2.1 什么是 Agent Skill？

**Agent Skill** 是一套面向 AI 编码助手的「能力包」。`tiny-vue-skill` 是 OpenTiny 官方提供的 Skill，包含 TinyVue 各组件的文档、示例和用法规范。安装后，Cursor、Claude Code、GitHub Copilot、Windsurf、Gemini CLI 等 AI 助手可以：

- 精准理解各组件的 API、props、events、slots
- 生成符合 TinyVue 规范的代码
- 根据业务需求推荐合适的组件
- 快速搭建基于 TinyVue 的页面和功能

### 2.2 Skill 的技术结构

Skill 遵循 **Claude Code Plugin Marketplace** 规范，目录结构大致如下：

```
skills/
├── tiny-vue-skill/
│   ├── .claude-plugin/
│   │   └── plugin.json          # 插件元数据
│   └── SKILL.md                 # 技能定义文件（核心）
```

**SKILL.md** 采用 YAML frontmatter + Markdown 格式：

```yaml
---
name: tiny-vue-skill
description: TinyVue 组件库的完整文档与使用规范
license: MIT
metadata:
  author: OpenTiny
  version: '1.0.0'
---

# 技能说明
这里是技能的详细使用说明...
```

**plugin.json** 定义插件元数据，供市场发现和安装：

```json
{
  "name": "tiny-vue-skill",
  "description": "技能的简短描述",
  "version": "1.0.0",
  "author": { "name": "OpenTiny" },
  "license": "MIT"
}
```

### 2.3 三种安装方式

**方式一：Claude Code 插件市场（Claude Code 用户推荐）**

```bash
/plugin marketplace add https://github.com/opentiny/opentiny-agent-skills
/plugin install tiny-vue-skill@opentiny-skills
```

支持 `claude plugin update` 一键更新。

**方式二：`skills` 工具（推荐，跨工具通用）**

`skills` 是 Vercel Labs 提供的 npm 工具，支持多种 AI IDE：

```bash
# 列出所有可用技能
npx skills add opentiny/agent-skills --list

# 全局安装（Cursor）
npx skills add opentiny/agent-skills -g --skill tiny-vue-skill --agent cursor

# 项目级安装
npx skills add opentiny/agent-skills --skill tiny-vue-skill --agent cursor
```

支持的 `--agent` 参数包括：`cursor`、`claude-code`、`github-copilot`、`windsurf`、`gemini-cli` 等。

**方式三：手动克隆复制**

```bash
git clone https://github.com/opentiny/agent-skills.git
# 将 skills/tiny-vue-skill 复制到对应工具的 Skills 目录
# Cursor: .cursor/skills/ 或 ~/.cursor/skills/
# Claude Code: .claude/skills/ 或 ~/.claude/skills/
```

### 2.4 在 Cursor 中启用

按 `Ctrl + ,` 打开设置，搜索 `useagentskills`，勾选 **Use Agent Skills** 实验性功能即可。

### 2.5 实际效果演示（可口头描述或现场演示）

安装后，可以直接用自然语言描述需求，例如：

> 「新建一个 Vue 工程，使用 TinyVue 的 Grid 组件开发一个中国省级信息查询表格，包含序号、省名、人口、面积、GDP 等列，支持排序，省名列冻结在最左边，表格顶部有按省名过滤的功能。」

AI 会基于 Skill 中的文档，生成符合 TinyVue 规范的代码，而不是随意拼凑的示例。

---

## 三、Skill × 无障碍：技术实现细节（约 10 分钟）

### 3.1 为什么无障碍很重要？

无障碍（Accessibility / a11y）不仅是「锦上添花」，在大型企业和国际项目中，往往涉及合规要求。屏幕阅读器用户、键盘用户、色弱用户等，都需要组件提供正确的语义和交互支持。

**关键点**：当 AI 基于 TinyVue 生成代码时，如果组件本身已内置无障碍能力，那么 AI 生成的页面天然具备可访问性，无需开发者额外处理。

### 3.2 TinyVue 无障碍实现架构

TinyVue 在 **Renderless 层和 Vue 组件层** 都做了无障碍支持，主要依赖：

- **ARIA 属性**：`role`、`aria-*` 等，为辅助技术提供语义
- **唯一 ID 关联**：`aria-controls`、`aria-labelledby`、`aria-describedby` 等建立元素关联
- **键盘导航**：`tabindex`、方向键、Enter、Esc 等
- **焦点管理**：焦点顺序、焦点陷阱（如弹窗内）

### 3.3 具体实现案例

**（1）Tabs 组件**

在 `tab-nav-item.vue` 中，每个 tab 项会设置：

```javascript
attrs: {
  role: 'tab',                           // 标识为标签
  'aria-selected': selected ? 'true' : 'false',  // 选中状态
  'aria-controls': `pane-${navItem.name}`,      // 关联对应 tabpanel
  id: `tab-${navItem.name}`,                     // 唯一 ID
  tabindex: selected ? 0 : -1                    // 焦点管理：仅选中项可聚焦
}
```

对应的 `tab-panel.vue`：

```javascript
attrs: {
  role: 'tabpanel',
  id: `pane-${item.name}`,
  'aria-labelledby': `tab-${item.name}`,
  'aria-hidden': !item.selected ? 'true' : 'false'
}
```

键盘支持：`keydown` 中监听 `Enter` 键激活 tab。

**（2）FormItem 组件**

在 `renderless/src/form-item/vue.ts` 中，使用 **nanoid** 生成唯一 ID，避免页面内冲突：

```javascript
const uniqueId = nanoid.api.nanoid(8)
const errorId = `tiny-form-item-error-${uniqueId}`
const labelId = `tiny-form-item-label-${uniqueId}`
```

在 `form-item/src/pc.vue` 中，将 ARIA 属性注入到表单项：

```javascript
const ariaAttrs = {}
if (state.isRequired || required) {
  ariaAttrs['aria-required'] = 'true'
}
if (isShowError && state.errorId) {
  ariaAttrs['aria-describedby'] = state.errorId  // 错误信息关联
  ariaAttrs['aria-invalid'] = 'true'
} else {
  ariaAttrs['aria-invalid'] = 'false'
}
Object.assign(item.attrs, ariaAttrs)
```

这样屏幕阅读器可以正确朗读「必填」「无效」「错误提示内容」。

**（3）Select / Autocomplete 组件**

Select 输入框：

```html
role="combobox"
aria-haspopup="listbox"
aria-autocomplete="list"
:aria-owns="state.ariaListId"
:aria-controls="state.ariaListId"
```

Autocomplete 在 `mounted` 中补充：

```javascript
$input.setAttribute('role', 'textbox')
$input.setAttribute('aria-autocomplete', 'list')
$input.setAttribute('aria-controls', state.id)
$input.setAttribute('aria-owns', state.id)
$input.setAttribute('aria-activedescendant', `${state.id}-item-${state.highlightedIndex}`)
if (props.label || props.placeholder) {
  $input.setAttribute('aria-label', String(props.label || props.placeholder))
}
```

注释中写明：**「补充无障碍信息，便于辅助/AI读取」**——说明无障碍不仅服务人，也服务 AI 对界面的理解。

**（4）Tree、NavMenu 等**

- Tree：`role="tree"`、`tabindex="0"`
- NavMenu：`role="menubar"`、`aria-label`、`role="menuitem"`、`aria-haspopup`、`aria-expanded`

### 3.4 Skill × 无障碍的协同

当 AI 通过 Skill 生成 TinyVue 代码时，这些无障碍能力是「自带」的。开发者无需在 prompt 中额外强调「请遵守 WCAG」，只要使用 TinyVue 组件，就能获得基础的语义和键盘支持。这是 **Skill 与无障碍在工程上的协同价值**。

---

## 四、Skill × 知识库：架构与实践（约 8 分钟）

### 4.1 知识库的定位

组件库文档往往很长，开发者更习惯「问」而不是「翻」。知识库的作用是：**把文档变成可被 AI 对话式消费的结构化知识**。

### 4.2 TinyVue 与 DeepWiki

TinyVue 在 README 中集成了 **DeepWiki** 入口：

```markdown
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/opentiny/tiny-vue)
```

DeepWiki 是基于项目文档构建的智能问答能力，用户可以直接「问」TinyVue 相关问题，获得基于文档的准确回答。

### 4.3 Skill 与知识库的分工

- **Skill**：提供「怎么写」——组件的 API、示例、最佳实践，供 AI 生成代码时参考
- **知识库**：提供「为什么这么写」「有哪些注意事项」「如何迁移」等更深层的说明

两者结合后，AI 既能生成正确代码，也能在用户追问时给出解释和上下文。例如：

> 用户：「TinyVue Form 的 display-only 模式怎么用？和 readonly 有什么区别？」

AI 可以结合 Skill 中的 API 说明和知识库中的设计说明，给出完整回答。

### 4.4 知识库的同步

agent-skills 仓库中有「同步 TinyVue 仓库」的 GitHub Action，用于将 TinyVue 主仓库的最新文档同步到 Skill 资源中，避免 Skill 落后于主仓库。

---

## 五、Skill × MCP：技术架构（约 10 分钟）

### 5.1 什么是 MCP？

**MCP（Model Context Protocol）** 是 Anthropic 在 2024 年底推出的开放协议，用于标准化 AI 应用与外部工具、数据源、系统的连接。可以类比为「AI 的 USB-C 接口」，解决不同 AI 与不同工具之间的 M×N 集成问题。

**核心架构**：

- **MCP Host**：AI 应用（如 Claude Desktop、VS Code、Cursor）
- **MCP Client**：Host 中负责连接 MCP 服务器的组件
- **MCP Server**：独立的轻量程序，提供上下文、工具或提示

**通信**：基于 JSON-RPC 2.0，支持 HTTP+SSE 和 stdio 两种传输方式。

**MCP Server 提供的四类能力**：

1. **Resources**：被动数据（文件、Schema、API 响应等）
2. **Prompts**：可复用的消息模板
3. **Tools**：可调用的函数，执行实际操作
4. **Sampling**：服务端 Agent 行为（高级特性）

### 5.2 TinyVue 中的 MCP 集成

TinyVue 在 `vue-common` 包中提供了 MCP 相关的扩展点，核心代码在 `packages/vue-common/src/index.ts`。

**（1）全局配置注册**

```javascript
const globalMcpConfig = {
  mcpConfig: null,
  createMcpTools: null
}

export const registerMcpConfig = (mcpConfig, defineTool) => {
  globalMcpConfig.mcpConfig = mcpConfig
  globalMcpConfig.createMcpTools = defineTool
}
```

- `mcpConfig`：描述各组件支持哪些 MCP 能力
- `createMcpTools`：根据组件实例和配置，动态创建 MCP 工具

**（2）组件级 MCP 配置**

组件通过 `tiny_mcp_config` prop 接收 MCP 配置。在 `setup` 中会检查：

```javascript
const getComponentMcpConfig = () => {
  const mcpConfig = globalMcpConfig.mcpConfig
  const componentName = getComponentName().replace($prefix, '')
  return mcpConfig?.components?.[componentName]
}

// 在 setup 末尾
const componentMcpConfig = getComponentMcpConfig()
if (componentMcpConfig && props.tiny_mcp_config && globalMcpConfig.createMcpTools) {
  globalMcpConfig.createMcpTools(attrs.vm, props.tiny_mcp_config, componentMcpConfig)
}
```

即：当组件有 MCP 配置、且传入了 `tiny_mcp_config`、且已注册 `createMcpTools` 时，会为该组件实例创建对应的 MCP 工具。

**（3）设计意图**

- **组件即工具**：Grid、Form、Select 等组件可以暴露为 MCP Tools，AI 不仅能生成代码，还能直接「操作」组件（如设置数据、触发方法）
- **低代码 / 搭建场景**：在可视化搭建平台中，AI 通过 MCP 工具可以增删组件、配置属性、绑定数据，实现「说需求即搭建」

### 5.3 Skill × MCP 的协同

- **Skill**：告诉 AI 组件有哪些 API、怎么用
- **MCP**：让 AI 能够实际调用组件的能力

两者结合，AI 从「只会写代码」升级为「能写代码 + 能操作运行时的组件」，在低代码、智能搭建等场景下有更大发挥空间。

---

## 六、总结与展望（约 2 分钟）

今天我们讲了 TinyVue 在 AI 时代的四个技术方向：

1. **Skill**：让 AI 深度理解组件 API 和最佳实践，生成符合规范的代码
2. **无障碍**：组件内置 ARIA、键盘、焦点管理，AI 生成的页面天然可访问
3. **知识库**：文档可被对话式消费，配合 Skill 回答「怎么写」和「为什么」
4. **MCP**：组件可接入 MCP 工具，AI 能直接操作组件，支撑智能搭建

这四个方向共同构成 TinyVue 的 **AI 原生、人人可用** 能力闭环。欢迎大家试用 tiny-vue-skill，在 Cursor、Copilot 等工具中体验「当 AI 真正懂你的组件库」的开发体验。

谢谢大家！

---

## 附录：时间分配参考

| 章节 | 内容 | 时长 |
|------|------|------|
| 一 | 开场与背景 | 3 min |
| 二 | TinyVue Skill 技术详解 | 12 min |
| 三 | Skill × 无障碍 | 10 min |
| 四 | Skill × 知识库 | 8 min |
| 五 | Skill × MCP | 10 min |
| 六 | 总结与展望 | 2 min |
| **合计** | | **45 min** |

可根据现场互动情况微调各章节时长。
