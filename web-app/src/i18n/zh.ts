// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Chinese dictionary for console chrome. Keys are the exact English source
// strings — including any odd whitespace. In particular "Logs " (menu entry in
// valid-routes.tsx) carries a trailing space; never trim keys here.
// Untranslated strings simply fall back to English at runtime.

export const zh: Record<string, string> = {
  // ---- Login page: brand panel -------------------------------------------
  "Open-Source S3/MinIO-Compatible Object Storage":
    "开源的 S3/MinIO 兼容对象存储",
  "Keep the {s3}": "保留 {s3}",
  "S3 Interface": "S3 接口",
  "Own the {store}": "掌控 {store}",
  "Object Store": "对象存储",
  "Community maintained {minio}, forked by {pigsty} · {agpl}":
    "社区维护的 {minio}，由 {pigsty} 分叉维护 · {agpl}",
  "A high-performance object store that runs on any infrastructure — public cloud, private cloud, or bare metal. It powers data lakes, AI/ML, and fast backup & recovery, with erasure coding, encryption, and replication built in.":
    "一个可以运行在任何基础设施上的高性能对象存储——公有云、私有云或裸金属均可。内建纠删码、加密与复制能力，为数据湖、AI/ML 以及快速备份恢复提供支撑。",
  "MinIO® is a registered trademark of {minioInc}; SILO incorporates {minioSource}.":
    "MinIO® 是 {minioInc} 的注册商标；SILO 包含 {minioSource}。",
  "MinIO source code": "MinIO 源代码",
  "SILO is maintained by {pigsty}, without MinIO affiliation, endorsement, or sponsorship.":
    "SILO 由 {pigsty} 维护，与 MinIO 无隶属、背书或赞助关系。",
  "SILO website": "SILO 官网",
  "Object Storage Console": "对象存储控制台",

  // ---- Login page: form, footer, errors ----------------------------------
  "Use Credentials": "使用凭证",
  "Use STS": "使用 STS",
  "Login with SSO": "使用 SSO 登录",
  "LDAP Authentication": "LDAP 认证",
  "STS Username": "STS 用户名",
  Username: "用户名",
  "STS Secret": "STS 密钥",
  Password: "密码",
  "STS Token": "STS 令牌",
  Login: "登录",
  "Other Authentication Methods": "其他认证方式",
  "An error has occurred": "发生错误",
  "The backend cannot be reached.": "无法连接到后端服务。",
  Retry: "重试",
  Documentation: "文档",
  Download: "下载",
  "Error from IDP": "IDP 返回错误",
  "Back to Login": "返回登录",

  // ---- Navigation menu ----------------------------------------------------
  Administrator: "管理",
  User: "用户",
  Buckets: "存储桶",
  Policies: "策略",
  Identity: "身份",
  Users: "用户",
  Groups: "用户组",
  Monitoring: "监控",
  Metrics: "指标",
  "Logs ": "日志",
  Logs: "日志",
  Audit: "审计",
  Trace: "跟踪",
  Watch: "监视",
  Encryption: "加密",
  Events: "事件",
  Tiering: "分层",
  "Site Replication": "站点复制",
  Configuration: "配置",
  Tools: "工具",
  Health: "健康报告",
  Performance: "吞吐测试",
  Profile: "性能剖析",
  Inspect: "对象检查",
  "Create Bucket": "创建存储桶",
  "Object Browser": "对象浏览器",
  "Access Keys": "访问密钥",
  "Collapse menu": "折叠菜单",
  "Expand menu": "展开菜单",
  License: "许可证",

  // ---- Command palette (kbar) ---------------------------------------------
  Navigation: "导航",
  "List of Buckets": "存储桶列表",

  // ---- Help menu chrome ---------------------------------------------------
  Video: "视频",
  Blog: "博客",
  "SILO Blog": "SILO 博客",
  "Read SILO release notes, security advisories, and project updates.":
    "阅读 SILO 的版本发布说明、安全公告与项目动态。",
  "Read this update on the SILO Blog.": "在 SILO 博客阅读这篇更新。",
  "SILO does not yet maintain a native video catalog. These links open upstream MinIO compatibility material.":
    "SILO 尚未维护自有的视频目录，以下链接指向上游 MinIO 的兼容性资料。",
  "Visit SILO Documentation": "访问 SILO 文档",
  "Visit MinIO Videos (upstream)": "访问 MinIO 视频（上游）",
  "Visit SILO Blog": "访问 SILO 博客",
  "Learn more": "了解更多",
  "Open help": "打开帮助",
  "Close help": "关闭帮助",

  // ---- Page titles (via PageHeaderWrapper) --------------------------------
  Components: "组件",
  "Audit Logs": "审计日志",
  "Event Destinations": "事件目标",
  "IAM Policies": "IAM 策略",
  "Key Management Service": "密钥管理服务",
  "Key Management Service Keys": "密钥管理服务密钥",
  Tiers: "存储层",
  "OPENID Configurations": "OPENID 配置",
  "LDAP Configurations": "LDAP 配置",

  // ---- Dashboard: tabs and chrome -----------------------------------------
  Info: "信息",
  Usage: "用量",
  Traffic: "流量",
  Resources: "资源",
  "Server Information": "服务器信息",
  Sync: "同步",
  Advanced: "高级",
  "We can’t retrieve advanced metrics at this time.": "目前无法获取高级指标。",
  "It looks like Prometheus is not available or reachable at the moment.":
    "Prometheus 目前似乎不可用或无法访问。",
  "Console Dashboard will display basic metrics as we couldn’t connect to Prometheus successfully. Please try again in a few minutes. If the problem persists, you can review your configuration and confirm that Prometheus server is up and running.":
    "由于未能成功连接 Prometheus，控制台仪表盘将只显示基础指标。请过几分钟再试；若问题持续，请检查相关配置并确认 Prometheus 服务正常运行。",
  "Read more about Prometheus on the Docs site.":
    "在文档站阅读更多关于 Prometheus 的内容。",

  // ---- Dashboard: Info tab cards ------------------------------------------
  Objects: "对象",
  Browse: "浏览",
  Servers: "服务器",
  Drives: "磁盘",
  Online: "在线",
  Offline: "离线",
  "Reported Usage": "报告用量",
  "Erasure Health": "纠删码健康",
  "Usage Data Age": "距上次用量更新",
  Healthy: "健康",
  Unhealthy: "异常",
  Uptime: "运行时间",
  "Up time": "运行时间",
  "Backend type": "后端类型",
  "Standard storage class parity": "标准存储类奇偶校验",
  "Reduced redundancy storage class parity": "低冗余存储类奇偶校验",
  "Online Drive": "在线磁盘",
  "Offline Drive": "离线磁盘",
  Unknown: "未知",
  "Drive Name": "磁盘名称",
  "Drive Status": "磁盘状态",
  "Version:": "版本：",
  "Used Capacity": "已用容量",
  Capacity: "容量",
  "Used:": "已用：",
  "Of:": "共：",
  Free: "空闲",
  Network: "网络",

  // ---- Dashboard: Prometheus panel titles ---------------------------------
  "Data Usage Growth": "数据用量增长",
  "Object size distribution": "对象大小分布",
  "API Data Received Rate": "API 数据接收速率",
  "API Data Sent Rate": "API 数据发送速率",
  "API Request Rate": "API 请求速率",
  "API Request Error Rate": "API 请求错误率",
  "Node CPU Usage": "节点 CPU 使用率",
  "Node Memory Usage": "节点内存使用",
  "Node IO": "节点 IO",
  "Node Syscalls": "节点系统调用",
  "Node File Descriptors": "节点文件描述符",
  "Internode Data Transfer": "节点间数据传输",
  "Drive Used Capacity": "磁盘已用容量",
  "Drives Free Inodes": "磁盘空闲 Inode",
  Upload: "上传",

  // ---- Common buttons and dialogs -----------------------------------------
  Cancel: "取消",
  Confirm: "确认",
  Delete: "删除",
  Save: "保存",
  Close: "关闭",
  Create: "创建",
  Update: "更新",
  Restore: "恢复",
  "Yes, Reset Configuration": "是的，重置配置",

  // ---- Aria labels ---------------------------------------------------------
  "Switch to light mode": "切换到亮色模式",
  "Switch to dark mode": "切换到暗色模式",
};

export default zh;
