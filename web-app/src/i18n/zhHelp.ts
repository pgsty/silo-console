// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Chinese translations for helpTopics.json entries (titles, bodies, markdown headers).
// Keys are the EXACT English source strings — do not edit or re-wrap them.
export const zhHelp: Record<string, string> = {
  Troubleshooting: "故障排查",
  "Need more help?  Check out additional Troubleshooting options":
    "需要更多帮助？查看更多故障排查方案",
  "Identity and Access Management": "身份与访问管理",
  "SILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access.":
    "SILO 使用基于策略的访问控制（PBAC）来定义已认证用户可以访问的操作与资源。",
  "Policy based access control": "基于策略的访问控制",
  "Learn how Policy-Based Access Control (PBAC)  is used to define the authorized actions and resources  to which an authenticated user has access":
    "了解如何用基于策略的访问控制（PBAC）定义已认证用户可以访问的操作与资源",
  "OpenID Connect Access Management": "OpenID Connect 访问管理",
  "Learn more about connecting SILO to OpenID for access management.":
    "了解如何将 SILO 接入 OpenID 以实现访问管理。",
  "MinIO Identity and Access Management: Part 1 - Overview And Modification of Built In Policies":
    "MinIO 身份与访问管理：第 1 部分 - 内置策略概览与修改",
  "This video introduces MinIO IAM policies, including an overview of the built-in policies, and how to create and remove a policy.":
    "本视频介绍 MinIO 的 IAM 策略，包括内置策略概览，以及如何创建和删除策略。",
  "MinIO Identity and Access Management: Part 4 - Lab - Setting Up Users, Groups, and Policies":
    "MinIO 身份与访问管理：第 4 部分 - 实验 - 配置用户、用户组与策略",
  "This Lab video demonstrates setting up identity and access management based Users, Groups and Policies. ":
    "本实验视频演示如何基于身份与访问管理配置用户、用户组与策略。",
  "MinIO Identity and Access Management: Part 5 - Lab - Creating A Custom Policy":
    "MinIO 身份与访问管理：第 5 部分 - 实验 - 创建自定义策略",
  "This Lab video demonstrates creating custom IAM policies.":
    "本实验视频演示如何创建自定义 IAM 策略。",
  "MinIO Identity and Access Management: Part 6 - Lab - Interfacing With OpenID and LDAP":
    "MinIO 身份与访问管理：第 6 部分 - 实验 - 对接 OpenID 与 LDAP",
  "This Lab video demonstrates interfacing with OpenID and LDAP. ":
    "本实验视频演示如何对接 OpenID 与 LDAP。",
  "# Bucket \n A bucket is similar to a folder or directory in a filesystem, where each bucket can hold an arbitrary number of objects.":
    "# 存储桶 \n 存储桶类似于文件系统中的文件夹或目录，每个存储桶可以存放任意数量的对象。",
  "Bucket Versioning": "存储桶版本控制",
  "SILO supports keeping multiple “versions” of an object in a single bucket. SILO versioning protects from unintended overwrites and deletions while providing support for “undoing” a write operation.":
    "SILO 支持在同一个存储桶中保留一个对象的多个“版本”。SILO 版本控制可防止意外覆盖和删除，同时支持“撤销”写入操作。",
  Buckets: "存储桶",
  "Learn about using Console to create and manage Buckets with SILO":
    "了解如何使用控制台在 SILO 中创建和管理存储桶",
  "Creating Buckets and Users through the MinIO Console":
    "通过 MinIO 控制台创建存储桶与用户",
  "Learn how to manage your storage buckets and objects with a hands-on introduction to the MinIO Console and SDKs.":
    "通过 MinIO 控制台与 SDK 的实操入门，了解如何管理存储桶和对象。",
  "Console Introduction - Add a Bucket and a User":
    "控制台入门 - 添加存储桶与用户",
  "This session shows how to create AWS S3 buckets and users with MinIO Console.":
    "本节演示如何使用 MinIO 控制台创建 AWS S3 存储桶与用户。",
  "Object Locking and Retention": "对象锁定与保留",
  "In this video we talk about object retention, WORM (Write Once Read Many), as well as duration based and legal holds.":
    "本视频介绍对象保留、WORM（一次写入多次读取），以及基于时长的保留和依法保留。",
  "Object Locking and Retention Lab": "对象锁定与保留实验",
  "This lab demonstrates creation and removal of both bucket and object specific retention, compliance, and legal holds. ":
    "本实验演示如何为存储桶和特定对象创建与移除保留、合规模式以及依法保留。",
  "Versioning and Lifecycle Management": "版本控制与生命周期管理",
  "In this video, we will focus on versioning and lifecycle management.":
    "本视频重点介绍版本控制与生命周期管理。",
  Versioning: "版本控制",
  "Learn how Versioning gives access to the full history of an object from its creation through each update.":
    "了解版本控制如何提供对象从创建到每次更新的完整历史。",
  "Learn how versioning protects your data from unintended overwrites and deletions":
    "了解版本控制如何保护数据免遭意外覆盖和删除",
  "Learn how to create and manage Buckets": "了解如何创建和管理存储桶",
  "In this video, we will focus on versioning  and lifecycle management.":
    "本视频重点介绍版本控制与生命周期管理。",
  "Policy Document Structure": "策略文档结构",
  "SILO policy documents use the same schema as AWS IAM Policy documents. See policy templates and allowed S3 Policy actions and condition keys in our docs.":
    "SILO 策略文档采用与 AWS IAM 策略文档相同的模式。策略模板以及支持的 S3 策略操作和条件键请参阅文档。",
  "Access Keys": "访问密钥",
  "Access Keys support providing applications authentication credentials which inherit permissions from the “parent” user.":
    "访问密钥可以为应用程序提供认证凭据，这些凭据继承“父”用户的权限。",
  "Policy Variables": "策略变量",
  "SILO supports using policy variables for automatically substituting context from the authenticated user and/or the operation into the user’s assigned policy or policies.":
    "SILO 支持使用策略变量，把已认证用户和/或操作的上下文自动代入用户所分配的策略中。",
  "Admin Policy Action Keys": "管理策略操作键",
  "See actions supported in defining policies for SILO admin operations. These actions are only valid for SILO deployments and are not intended for use with other S3-compatible services.":
    "查看定义 SILO 管理操作策略时支持的操作。这些操作仅对 SILO 部署有效，不适用于其他 S3 兼容服务。",
  "Admin Policy Condition Keys": "管理策略条件键",
  "See which conditions SILO supports for use with defining policies for admin actions.":
    "查看 SILO 在定义管理操作策略时支持哪些条件。",
  "Supported S3 Policy Condition Keys": "支持的 S3 策略条件键",
  "SILO policy documents support IAM conditional statements.":
    "SILO 策略文档支持 IAM 条件语句。",
  "Supported S3 Policy Actions": "支持的 S3 策略操作",
  "SILO policy documents support a subset of IAM S3 Action keys.":
    "SILO 策略文档支持 IAM S3 操作键的一个子集。",
  "MinIO Identity and Access Management: Part 2 - Using IDP to Manage Users And Groups":
    "MinIO 身份与访问管理：第 2 部分 - 使用 IDP 管理用户与用户组",
  "This video discusses Users and Groups, and how policies can be applied to them to enable specific permissions.":
    "本视频讨论用户与用户组，以及如何为它们应用策略以授予特定权限。",
  "SILO versioning protects from unintended overwrites and deletions while providing support for “undoing” a write operation.":
    "SILO 版本控制可防止意外覆盖和删除，同时支持“撤销”写入操作。",
  "Lifecycle Management II - Versioning and Lifecycle Management":
    "生命周期管理 II - 版本控制与生命周期管理",
  "Creating a New Bucket in a Specific Region": "在指定区域中创建新存储桶",
  "A Bucket can be created in a specified region":
    "存储桶可以创建在指定的区域中",
  "What are Settings and Configurations?": "什么是设置与配置？",
  "These configuration settings define runtime  behavior of the SILO server process,  comparable to the mc admin config command":
    "这些配置项定义 SILO 服务进程的运行时行为，等同于 mc admin config 命令",
  "MinIO Feature Overview: Active-Active Replication":
    "MinIO 功能概览：双活复制",
  "Learn about MinIO's object replication capabilities and how MinIO provides resilience to common storage disruption scenarios.":
    "了解 MinIO 的对象复制能力，以及 MinIO 如何应对常见的存储中断场景。",
  "How is failed replication handled?": "复制失败后如何处理？",
  "SILO queues failed replication operations and retries those operations until replication succeeds.":
    "SILO 会将失败的复制操作放入队列并持续重试，直到复制成功。",
  "What are Replication Workers?": "什么是复制工作线程？",
  "SILO uses a replication queuing system with multiple concurrent replication workers operating on that queue.":
    "SILO 采用复制队列机制，由多个并发的复制工作线程处理该队列。",
  "These configuration settings define runtime behavior of the SILO server process,  comparable to the mc admin config command":
    "这些配置项定义 SILO 服务进程的运行时行为，等同于 mc admin config 命令",
  "Where can I see current Heal status?": "在哪里查看当前的修复状态？",
  "Check under Monitoring/Drives on the left hand  menu to see Drive and Bucket Healing status":
    "在左侧菜单的 监控/磁盘 中查看磁盘与存储桶的修复状态",
  "How is Erasure Coding used to Protect Data?": "纠删码如何保护数据？",
  "SILO erasure coding is a data redundancy and  availability feature that allows SILO deployments to  automatically reconstruct objects on-the-fly despite  the loss of multiple drives or nodes in the cluster.":
    "纠删码是一项数据冗余与可用性特性，即使集群中多块磁盘或多个节点失效，SILO 部署也能实时自动重建对象。",
  "Recover After Hardware failure": "硬件故障后的恢复",
  "Depending on the deployment topology and  selected erasure code parity, SILO can tolerate loss  of up to half the drives or nodes in the deployment  while maintaining read access to objects.":
    "根据部署拓扑和所选的纠删码校验级别，SILO 最多可以容忍部署中一半的磁盘或节点失效，同时保持对象的读取访问。",
  "Site Failure Recovery": "站点故障恢复",
  "SILO can make the loss of an entire site, while  significant, a relatively minor incident. Site recovery depends on the replication option you use for the site.":
    "整个站点丢失虽然影响重大，但在 SILO 上可以只是一次相对轻微的事件。站点恢复方式取决于该站点采用的复制方案。",
  "Node Failure Recovery": "节点故障恢复",
  "If a SILO node suffers complete hardware failure, the node begins healing operations once it rejoins the  deployment.":
    "如果某个 SILO 节点发生彻底的硬件故障，该节点重新加入部署后就会开始修复操作。",
  "What is SILO Healing?": "什么是 SILO 修复？",
  "Healing is SILO’s ability to restore data after some event causes data loss. Data loss can come from bit rot, drive loss, or node loss.":
    "修复是 SILO 在发生数据丢失后恢复数据的能力。数据丢失可能源于位衰减、磁盘丢失或节点丢失。",
  "Understand SILO Healing Using mc": "使用 mc 理解 SILO 修复",
  "The mc admin heal command scans for objects that are damaged or corrupted and heals those objects.":
    "mc admin heal 命令会扫描受损或损坏的对象，并修复这些对象。",
  "What is Bit Rot?": "什么是位衰减？",
  "Bit rot is data corruption that occurs without the user’s knowledge. SILO combats bit rot with hashing and erasure coding.":
    "位衰减是指在用户毫不知情的情况下发生的数据损坏。SILO 通过哈希校验与纠删码来对抗位衰减。",
  "These configuration settings define runtime behavior of the SILO server process, comparable to the mc admin config command":
    "这些配置项定义 SILO 服务进程的运行时行为，等同于 mc admin config 命令",
  "Overview of MinIO Erasure Coding": "MinIO 纠删码概览",
  "Through this MinIO video you will learn about MinIO erasure coding, including erasure sets, erasure parity, and stripe size. You will also learn about how the Reed-Solomon algorithm can be optimized for storage efficiency (yielding cost savings) or data lost protection (number of servers and drives that can fail). The video also walks through the MinIO Erasure Code calculator, considerations for cluster design and the command line syntax needed to establish an erasure code deployment. ":
    "本 MinIO 视频将介绍 MinIO 纠删码，包括纠删集、纠删校验与条带大小。你还将了解如何针对存储效率（节省成本）或数据丢失保护（可容忍故障的服务器与磁盘数量）来优化 Reed-Solomon 算法。视频还会演示 MinIO 纠删码计算器、集群设计的注意事项，以及建立纠删码部署所需的命令行语法。",
  "Object Scanner": "对象扫描器",
  "Learn more about how the scanner checks Objects for transition and expiry based on lifecycle rules":
    "了解扫描器如何依据生命周期规则检查对象的转换与过期",
  "What is the Scanner?": "什么是扫描器？",
  "One of several low-priority processes SILO runs to check lifecycle management rules, bucket or site replication status, as well as object bit rot and healing":
    "SILO 运行的若干低优先级进程之一，用于检查生命周期管理规则、存储桶或站点复制状态，以及对象的位衰减与修复情况",
  "Lifecycle Management Object Scanner Considerations":
    "生命周期管理的对象扫描器注意事项",
  "SILO uses a scanner process to check objects against all configured lifecycle management rules. High IO workloads or limited system resources may delay application of lifecycle management rules":
    "SILO 通过扫描器进程，按照所有已配置的生命周期管理规则检查对象。高 IO 负载或系统资源不足可能导致生命周期管理规则延迟生效",
  "Lifecycle Management Lab": "生命周期管理实验",
  "Use the MinIO client to demonstrate expiration rules, the scanner, and transitioning objects to remote tiers.":
    "使用 MinIO 客户端演示过期规则、扫描器，以及将对象转换到远端存储层。",
  "What is etcd?": "什么是 etcd？",
  "etcd is a strongly consistent, distributed key-value  store that provides a reliable way to store data that  needs to be accessed by a distributed system or  cluster of machines.":
    "etcd 是一个强一致的分布式键值存储，为分布式系统或机器集群需要访问的数据提供可靠的存储方式。",
  "What is the logger_webhook Environment Variable?":
    "logger_webhook 环境变量是什么？",
  "The top-level configuration key for defining an  HTTP webhook target for publishing SILO logs.":
    "用于定义 HTTP webhook 目标以发布 SILO 日志的顶层配置键。",
  "Publish Server Logs to HTTP Webhook": "将服务日志发布到 HTTP Webhook",
  "You can configure a new HTTP webhook endpoint  to which SILO publishes SILO server logs using  either environment variables or by setting  runtime configuration settings.":
    "你可以通过环境变量或运行时配置项，新增一个 HTTP webhook 端点，让 SILO 把服务日志发布到该端点。",
  "Monitoring Logs": "日志监控",
  "SILO supports publishing server logs  and audit logs to an HTTP webhook.":
    "SILO 支持将服务日志和审计日志发布到 HTTP webhook。",
  "Monitoring with Prometheus": "使用 Prometheus 监控",
  "Learn about the monitoring features available  in your MinIO Console and how to export to  Prometheus and get information back so you can  view it in detail.":
    "了解 MinIO 控制台提供的监控功能，以及如何导出到 Prometheus 并取回数据以便详细查看。",
  "Prometheus Monitoring Lab": "Prometheus 监控实验",
  "Learn how to set up Prometheus and connect it  back to your MinIO cluster so that you can get  detailed history of what's going on in your MinIO  cluster at any given time.":
    "了解如何搭建 Prometheus 并将其接入 MinIO 集群，从而随时获取集群运行状况的详细历史数据。",
  "Publish Audit Logs to an HTTP webhook": "将审计日志发布到 HTTP webhook",
  "You can configure a new HTTP webhook endpoint  to which SILO publishes audit logs using either  environment variables or by setting runtime  configuration settings":
    "你可以通过环境变量或运行时配置项，新增一个 HTTP webhook 端点，让 SILO 把审计日志发布到该端点",
  "Publish Audit Logs to an External Service": "将审计日志发布到外部服务",
  "Audit logs are granular descriptions of each operation  on the SILO deployment supporting security  standards and regulations which require  detailed tracking of operations.":
    "审计日志详细记录 SILO 部署上的每一次操作，可满足那些要求细粒度追踪操作的安全标准与法规。",
  "Publish Events to Kafka": "将事件发布到 Kafka",
  "SILO supports publishing bucket notification events to a Kafka service endpoint.":
    "SILO 支持将存储桶通知事件发布到 Kafka 服务端点。",
  "Kafka Service for Bucket Notifications": "用于存储桶通知的 Kafka 服务",
  "Learn about environment variables for configuring a Kafka service as a target for Bucket Nofitications.":
    "了解将 Kafka 服务配置为存储桶通知目标所需的环境变量。",
  "Kafka Service Configuration Settings": "Kafka 服务配置项",
  "Supported Bucket Notification Targets": "支持的存储桶通知目标",
  "Learn which notification targets are supported by SILO.":
    "了解 SILO 支持哪些通知目标。",
  "Bucket Notifications": "存储桶通知",
  "SILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events.":
    "存储桶通知允许管理员在特定的对象或存储桶事件发生时，向支持的外部服务发送通知。",
  "Need more help? Check out additional Troubleshooting options":
    "需要更多帮助？查看更多故障排查方案",
  "Site Replication Prerequisite": "站点复制前置条件",
  "Check that your setup meets the requirements to deploy Site Replication":
    "确认你的环境满足部署站点复制的要求",
  "Site replication configures multiple independent SILO deployments as a cluster of replicas called peer sites.":
    "站点复制将多个独立的 SILO 部署配置成一组互为副本的集群，这些部署称为对等站点。",
  "Site Replication Overview": "站点复制概览",
  "See what changes are and are NOT replicated between peer sites":
    "了解哪些变更会在对等站点之间复制，哪些不会",
  "Site Replication Tutorial": "站点复制教程",
  "Learn how to set up site replication using Console and the SILO client (mc)":
    "了解如何使用控制台和 SILO 客户端（mc）配置站点复制",
  "Transition from SILO to Azure": "从 SILO 转换到 Azure",
  "See the procedure to create a new object lifecycle management rule that transition objects from a SILO bucket to a remote storage tier on the Azure storage backend.":
    "了解如何创建对象生命周期管理规则，将对象从 SILO 存储桶转换到 Azure 存储后端上的远端存储层。",
  "Transition from SILO to GCS": "从 SILO 转换到 GCS",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Google Cloud Storage backend.":
    "了解如何创建对象生命周期管理规则，将对象从 SILO 存储桶转换到 Google Cloud Storage 后端上的远端存储层。",
  "Transition from SILO to S3": "从 SILO 转换到 S3",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Amazon Web Services S3 storage backend or an S3-compatible service.":
    "了解如何创建对象生命周期管理规则，将对象从 SILO 存储桶转换到 Amazon Web Services S3 存储后端或 S3 兼容服务上的远端存储层。",
  "Transition to Remote SILO Deployment": "转换到远端 SILO 部署",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a bucket on a primary SILO deployment to a bucket on a remote SILO deployment. ":
    "了解如何创建对象生命周期管理规则，将对象从主 SILO 部署的存储桶转换到远端 SILO 部署的存储桶。",
  "Object Lifecycle Management": "对象生命周期管理",
  "Use SILO Object Lifecycle Management to create rules for time or date based automatic transition or expiry of objects.":
    "使用 SILO 对象生命周期管理创建规则，按时间或日期自动转换或过期对象。",
  "MinIO Feature Overview: Object Lifecycle Management":
    "MinIO 功能概览：对象生命周期管理",
  "Learn about MinIO's object lifecycle management capabilities.":
    "了解 MinIO 的对象生命周期管理能力。",
  "Lifecycle Management I - Tiers": "生命周期管理 I - 存储层",
  "In this video we will cover expiration and transition of objects to an alternate tier of storage.":
    "本视频介绍对象的过期，以及将对象转换到另一个存储层。",
  Tiers: "存储层",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Azure storage backend.":
    "了解如何创建对象生命周期管理规则，将对象从 SILO 存储桶转换到 Azure 存储后端上的远端存储层。",
  "Console Metrics Dashboard": "控制台指标仪表盘",
  "The SILO Console provides a point-in-time metrics dashboard by default, and also supports displaying time-series and historical data by querying a Prometheus service configured to scrape data from the SILO deployment.":
    "SILO 控制台默认提供实时指标仪表盘，也支持查询已配置为抓取 SILO 部署数据的 Prometheus 服务，展示时序与历史数据。",
  "Available Metrics": "可用指标",
  "Learn about the different Prometheus metrics published by SILO server":
    "了解 SILO 服务发布的各类 Prometheus 指标",
  "Metrics and Alerts": "指标与告警",
  "For historical metrics and analytics, SILO publishes cluster and node metrics using the Prometheus Data Model.":
    "SILO 按照 Prometheus 数据模型发布集群与节点指标，用于历史指标与分析。",
  "Learn about the monitoring features available  in your MinIO Console.":
    "了解 MinIO 控制台提供的监控功能。",
  "User Management": "用户管理",
  "Each user can have one or more assigned policies that explicitly list the actions and resources to which that user has access. Users can also inherit policies from the groups in which they have membership.":
    "每个用户可以分配一条或多条策略，明确列出该用户可以访问的操作与资源。用户也可以从所属的用户组继承策略。",
  "Group Management": "用户组管理",
  "A group is a collection of users. Each group can have one or more assigned policies that explicitly list the actions and resources to which group members are allowed or denied access.":
    "用户组是一组用户的集合。每个用户组可以分配一条或多条策略，明确列出组内成员被允许或拒绝访问的操作与资源。",
  "MinIO Identity and Access Management: Part 3 - Interfacing with OpenID and LDAP":
    "MinIO 身份与访问管理：第 3 部分 - 对接 OpenID 与 LDAP",
  "This video is focused on interfacing with OpenID and LDAP to manage access to MinIO.":
    "本视频重点介绍如何对接 OpenID 与 LDAP 来管理 MinIO 的访问权限。",
  "MinIO Authentication and Authorization Using OpenID and Keycloak":
    "使用 OpenID 与 Keycloak 实现 MinIO 认证与授权",
  "In this video you will learn how to set up an OpenID service, Keycloak, to provide authentication and authorization as part of a MinIO deployment.":
    "本视频介绍如何搭建 OpenID 服务 Keycloak，为 MinIO 部署提供认证与授权。",
  "Drive Healing": "磁盘修复",
  "The Drives section displays the healing status for a bucket.":
    "磁盘板块展示存储桶的修复状态。",
  "Erasure Coding": "纠删码",
  "SILO Erasure Coding is a data redundancy and availability feature that allows SILO deployments to automatically reconstruct objects on-the-fly despite the loss of multiple drives or nodes in the cluster.":
    "SILO 纠删码是一项数据冗余与可用性特性，即使集群中多块磁盘或多个节点失效，SILO 部署也能实时自动重建对象。",
  "Site Healing": "站点修复",
  "Any SILO deployment in the site replication configuration can resynchronize damaged replica-eligible data from the peer with the most updated (“latest”) version of that data.":
    "站点复制配置中的任一 SILO 部署，都可以从持有最新（“latest”）版本数据的对等站点，重新同步受损的可复制数据。",
  Healing: "修复",
  "SILO Automatically Heals Corrupt or Missing Data On-the-fly":
    "SILO 实时自动修复损坏或缺失的数据",
  "In this video, we will provide an overview of site-wide replication.":
    "本视频概览站点级复制。",
  Health: "健康",
  "The health section provides an interface for running a health diagnostic for the SILO Deployment. For clusters connected to the Internet, the report uploads automatically to SUBNET.":
    "健康板块提供为 SILO 部署运行健康诊断的界面。对于已连接互联网的集群，诊断报告会自动上传到 SUBNET。",
  "IDP Docs": "IDP 文档",
  "SILO supports multiple external identity managers through OpenID Connect-Compatible Active Directory / LDAP":
    "SILO 通过 OpenID Connect 兼容的 Active Directory / LDAP 支持多种外部身份管理系统",
  "Built-in SILO IDP": "SILO 内置 IDP",
  "SILO includes a built-in IDentity Provider (IDP) that provides core identity management functionality.":
    "SILO 内置身份提供方（IDP），提供核心的身份管理功能。",
  "Active Directory / LDAP Access Management":
    "Active Directory / LDAP 访问管理",
  "For identities managed by the external AD/LDAP provider, SILO uses the user’s Distinguished Name and attempts to map it against an existing policy.":
    "对于由外部 AD/LDAP 提供方管理的身份，SILO 会使用该用户的可分辨名称（DN）尝试匹配已有的策略。",
  "Keycloak configuration": "Keycloak 配置",
  "You can configure SILO to use Keycloak as an external IDentity Provider (IDP) for authentication of users via the OpenID Connect (OIDC) protocol.":
    "你可以将 SILO 配置为使用 Keycloak 作为外部身份提供方（IDP），通过 OpenID Connect（OIDC）协议认证用户。",
  "LDAP Configuration": "LDAP 配置",
  "SILO supports configuring a single Active Directory / LDAP Connect for external management of user identities.":
    "SILO 支持配置单个 Active Directory / LDAP 连接，用于外部管理用户身份。",
  "OIDC Configuration": "OIDC 配置",
  "SILO supports using an OpenID Connect (OIDC) compatible IDentity Provider (IDP) such as Okta, KeyCloak, Dex, Google, or Facebook for external management of user identities.":
    "SILO 支持使用 Okta、KeyCloak、Dex、Google 或 Facebook 等 OpenID Connect（OIDC）兼容的身份提供方（IDP）来外部管理用户身份。",
  "KMS overview": "KMS 概览",
  "MinIO's cryptographic expert shares why MinIO built KES, what it is used for and how it fits into the MinIO architecture.":
    "MinIO 的密码学专家分享 MinIO 为何构建 KES、KES 的用途，以及它在 MinIO 架构中的位置。",
  "Learn about key management using KMS.": "了解如何使用 KMS 进行密钥管理。",
  "Text snippet that will be relevant to the user will  go here  made to look nice in the helpitem size  on two-three lines":
    "此处放置与用户相关的文字片段，排版为帮助条目大小的两到三行",
  "Error logs can be filtered by node and log type, as well as search for specific text in the logs.":
    "错误日志可以按节点和日志类型筛选，也可以在日志中搜索特定文本。",
  "Audit Logs": "审计日志",
  "You can configure an HTTP webhook endpoint to which SILO publishes audit logs using either environment variables or by setting runtime configuration settings.":
    "你可以通过环境变量或运行时配置项，配置一个 HTTP webhook 端点，让 SILO 把审计日志发布到该端点。",
  "Object Lambda": "Object Lambda",
  "SILO’s Object Lambda enables developers to programmatically transform objects on demand.":
    "SILO 的 Object Lambda 让开发者可以按需以编程方式转换对象。",
  "MinIO Event Notifications - Overview": "MinIO 事件通知 - 概览",
  "Use the Event framework to see what's going on in the system using Bucket, Object, Replication and ILM events.":
    "使用事件框架，通过存储桶、对象、复制和 ILM 事件了解系统中正在发生什么。",
  "Managing Event Notifications Using MinIO MC Commands":
    "使用 MinIO MC 命令管理事件通知",
  "This video provides an overview of the types of event notifications and how to set them up using MinIO's mc commands.":
    "本视频概览事件通知的类型，以及如何使用 MinIO 的 mc 命令进行设置。",
  "MinIO Events Notifications - Setting Up Webhooks Using Python":
    "MinIO 事件通知 - 使用 Python 设置 Webhook",
  "This video provides an overview of how to use Python and Flask to set up a Webhook on MinIO. ":
    "本视频概览如何使用 Python 和 Flask 在 MinIO 上设置 Webhook。",
  "MinIO Event Notifications - Using The MinIO Python SDK to Write Custom Webhooks":
    "MinIO 事件通知 - 使用 MinIO Python SDK 编写自定义 Webhook",
  "This video dives deeper into using the MinIO Python SDK to setup and manage notifications.":
    "本视频深入介绍如何使用 MinIO Python SDK 设置和管理通知。",
  "Object Management": "对象管理",
  "Learn about Objects and how  SILO allows you to manage them":
    "了解对象以及 SILO 提供的对象管理方式",
  "Managing Objects with the Object Browser": "使用对象浏览器管理对象",
  "Learn how to use the Console Object Browser  to manage your Objects":
    "了解如何使用控制台的对象浏览器管理对象",
  "Manipulating Objects": "操作对象",
  "A demo of Prefixes & Objects with examples of copying and deleting an object, as well as CopySource Object.":
    "前缀与对象的演示，包含复制、删除对象以及 CopySource 对象的示例。",
  "Example Policy - Bucket Resource Access": "策略示例 - 存储桶资源访问",
  "An example policy demonstrating authorization  limited to a named bucket":
    "一个示例策略，演示如何把授权限定到指定的存储桶",
  Performance: "性能",
  "The performance section provides an interface for running a performance test of the deployment.":
    "性能板块提供为部署运行性能测试的界面。",
  Profile: "性能剖析",
  "The profile section provides an interface for running system profiling of the deployment. The results can provide insight into the SILO server process running on a given node.":
    "性能剖析板块提供对部署执行系统剖析的界面。剖析结果有助于洞察指定节点上运行的 SILO 服务进程。",
  Inspect: "检查",
  "The inspect section provides an interface for capturing the erasure-coded metadata associated to an object or objects.":
    "检查板块提供采集对象所关联的纠删码元数据的界面。",
  "Encrypt Inspect Output": "加密检查输出",
  "You can encrypt the output of the mc support inspect command for enhanced security when transmitting the files to SILO SUBNET.":
    "你可以加密 mc support inspect 命令的输出，在把文件传输到 SILO SUBNET 时提升安全性。",
  "What is Trace?": "什么是跟踪？",
  "The trace section provides HTTP trace functionality for a bucket or buckets on the deployment.":
    "跟踪板块为部署中的一个或多个存储桶提供 HTTP 跟踪功能。",
  Users: "用户",
  "What is Watch?": "什么是监视？",
  "The Watch section displays S3 events as they occur on the selected bucket.":
    "监视板块实时展示所选存储桶上发生的 S3 事件。",
  "Access Managemnt": "访问管理",
  "Object Locking": "对象锁定",
  "SILO Object Locking (“Object Retention”) enforces Write-Once Read-Many (WORM) immutability to protect versioned objects from deletion.":
    "SILO 对象锁定（又称“对象保留”）强制施加 WORM（一次写入多次读取）不可变性，保护受版本控制的对象不被删除。",
  Encryption: "加密",
  "SILO Server-Side Encryption (SSE) protects objects as part of write operations, allowing clients to take advantage of server processing power to secure objects at the storage layer (encryption-at-rest).":
    "SILO 服务端加密（SSE）在写入操作过程中保护对象，让客户端可以借助服务端算力在存储层保护对象（静态加密）。",
  "Learn how to use Console to manage Buckets": "了解如何使用控制台管理存储桶",
  "Bucket Replication": "存储桶复制",
  "SILO server-side bucket replication is an automatic bucket-level configuration that synchronizes objects between a source and destination bucket.":
    "SILO 服务端存储桶复制是一种存储桶级别的自动配置，用于在源存储桶与目标存储桶之间同步对象。",
  "This video gives an overview of how to set up and use object versioning as part of a data lifecycle management strategy.":
    "本视频概览如何在数据生命周期管理策略中设置和使用对象版本控制。",
  "Versioning Lab": "版本控制实验",
  "This demo will take you through the steps to manage versioned objects using the MinIO command line tools.":
    "本演示将带你了解如何使用 MinIO 命令行工具管理受版本控制的对象。",
  "Bucket Replication Requirements": "存储桶复制要求",
  "Check here to ensure you meet the prerequisites before setting up any replication configurations.":
    "在配置任何复制之前，请在此确认你已满足前置条件。",
  "Bucket Replication Overview": "存储桶复制概览",
  "In this video, we will cover bucket level replication, both active-passive and active-active.":
    "本视频介绍存储桶级别的复制，包括主备模式和双活模式。",
  "Replication Lab I": "复制实验 I",
  "Demonstrates bucket replication concepts using MinIO Client, including active-passive and active-active replication.":
    "使用 MinIO 客户端演示存储桶复制的概念，包括主备复制与双活复制。",
  "Replication Lab II": "复制实验 II",
  "Demonstrates site replication concepts using MinIO Client, including active-passive and active-active replication.":
    "使用 MinIO 客户端演示站点复制的概念，包括主备复制与双活复制。",
  "Access Management": "访问管理",
  "Logging in": "登录",
  "Sign in with the root credentials, an IAM user access key, or temporary STS credentials via Other Authentication Methods.":
    "使用 root 凭据、IAM 用户访问密钥登录，或通过“其他认证方式”使用临时 STS 凭据登录。",
  "Console configuration": "控制台配置",
  "Configure identity providers, TLS, and session settings for the console on the server side.":
    "在服务端为控制台配置身份提供方、TLS 与会话设置。",
  "Replication Internals": "复制内部机制",
  "Learn details of the SILO replication process.":
    "了解 SILO 复制过程的细节。",
  "One-way Bucket Replication": "单向存储桶复制",
  "Guidance on configuring one-way Bucket replication using SILO Console.":
    "使用 SILO 控制台配置单向存储桶复制的指引。",
  "Two-way Bucket Replication": "双向存储桶复制",
  "Guidance on configuring two-way (active-active) Bucket replication using SILO Console.":
    "使用 SILO 控制台配置双向（双活）存储桶复制的指引。",
};

export default zhHelp;
