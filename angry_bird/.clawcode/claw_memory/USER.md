## 开发工作偏好
- 用户偏好中文注释和文档
- 修复优先级：关卡结构bug > 功能bug > 新功能
- 地面y坐标：640（物理体顶部），猪在地面时中心y=615，方块高度40时中心y=620
§
## UI设计偏好 - Airbnb风格
- **核心颜色**: primary=#ff385c (0xFF385C), background=#ffffff (0xFFFFFF), text=#222222 (0x222222)
- **字体家族**: Airbnb Cereal VF (用Arial Black/Arial近似)
- **圆角设计**: radius=20px, 柔和阴影
- **阴影效果**: 多层轻微阴影，符合rounded_soft风格
- **按钮交互**: 悬停/按下状态变化
- **避免模式**: 避免过度密集的企业仪表板风格
- **基调**: warm, trustworthy, premium, inviting (温暖、可信、优质、邀请)
- **应用范围**: 菜单界面、游戏UI、结果界面、按钮样式
§
## UI设计偏好
- UI风格：Airbnb风格 (style_slug: airbnb)
- 核心特征：photo_first, warm_marketplace, rounded_soft, lifestyle_commerce
- 配色方案：
  - primary=#ff385c (Airbnb标志性粉红色)
  - background=#ffffff (白色背景)
  - text=#222222 (深灰色文字)
- 字体：Airbnb Cereal VF (优先) 或 Arial
- 圆角：radius=20px (rounded_soft)
- 阴影：多层轻微阴影 (0 0 0 1px rgba(0,0,0,0.02), 0 2px 6px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.1))
- 避免模式：ultra_dense_ops_dashboard, terminal_like_devtools
- 语气关键词：warm, trustworthy, premium, inviting
- 组件适配：listing_grid, product_detail, lifestyle_landing
- 域名适配：travel, ecommerce, social, portfolio