// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
// AI-assisted translation; see ../../README.md for review and maintenance.

import type { Dictionary } from "../../catalog";

const messages: Dictionary = {
  "### Users\n\nA SILO user consists of a unique access key (username) and corresponding secret key (password). Clients must authenticate their identity by specifying both a valid access key (username) and the corresponding secret key (password) of an existing SILO user.\n\nGroups provide a simplified method for managing shared permissions among users with common access patterns and workloads.\n\nUsers inherit access permissions to data and resources through the groups they belong to.\n\nSILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.\n\nEach user can access only those resources and operations which are explicitly granted by the built-in role. SILO denies access to any other resource or action by default.":
    "### ユーザー\n\nSILO ユーザーは、一意のアクセス キー (ユーザー名) と、対応する秘密キー (パスワード) で構成されます。クライアントは、既存の SILO ユーザーの有効なアクセス キー (ユーザー名) と対応する秘密キー (パスワード) の両方を指定して、アイデンティティを認証する必要があります。\n\nグループは、共通のアクセス パターンとワークロードを持つユーザー間の共有アクセス許可を管理するための簡略化された方法を提供します。\n\nユーザーは、所属するグループを通じてデータとリソースへのアクセス権限を継承します。\n\nSILO は、ポリシーベースのアクセス制御 (PBAC) を使用して、認証されたユーザーがアクセスできる許可されたアクションとリソースを定義します。各ポリシーには、ユーザーまたはユーザーのグループの権限の概要を示す 1 つ以上のアクションと条件が記述されています。\n\n各ユーザーは、組み込みロールによって明示的に付与されたリソースと操作のみにアクセスできます。 SILO は、デフォルトで他のリソースまたはアクションへのアクセスを拒否します。",
  "### IAM policies\n\nSILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.\n\nSILO PBAC is built for compatibility with AWS IAM policy syntax, structure, and behavior. The SILO documentation makes a best-effort to cover IAM-specific behavior and functionality. Consider deferring to the IAM documentation for more complete documentation on AWS IAM-specific topics.":
    "### IAM ポリシー\n\nSILO は、ポリシーベースのアクセス制御 (PBAC) を使用して、認証されたユーザーがアクセスできる許可されたアクションとリソースを定義します。各ポリシーには、ユーザーまたはユーザーのグループの権限の概要を示す 1 つ以上のアクションと条件が記述されています。\n\nSILO PBAC は、AWS IAM ポリシーの構文、構造、動作との互換性を考慮して構築されています。SILO ドキュメントでは、IAM 固有の動作と機能を可能な限りカバーしています。AWS IAM 固有のトピックに関するより完全なドキュメントについては、AWS IAM の公式ドキュメントをご参照ください。",
  "### Access keys\n\nSILO access keys are child identities of an authenticated SILO user, including externally managed identities. Each access key inherits its privileges based on the policies attached to it’s parent user or those groups in which the parent user has membership. Access Keys also support an optional inline policy which further restricts access to a subset of actions and resources available to the parent user.":
    "### アクセスキー\n\nSILO アクセス キーは、認証された SILO ユーザーの子 ID であり、外部で管理されている ID も含まれます。各アクセス キーは、その親ユーザー、または親ユーザーがメンバーシップを持っているグループにアタッチされているポリシーに基づいて権限を継承します。アクセス キーは、親ユーザーが利用できるアクションとリソースのサブセットへのアクセスをさらに制限するオプションのインライン ポリシーもサポートしています。",
  "### Event destinations\n\nSILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events. SILO supports bucket and object-level S3 events similar to the Amazon S3 Event Notifications.":
    "### イベント送信先\n\nSILO バケット通知を使用すると、管理者は特定のオブジェクトまたはバケットイベントに関して、サポートされている外部サービスに通知を送信できます。SILO は、Amazon S3 イベント通知と同様のバケットおよびオブジェクトレベルの S3 イベントをサポートします。",
  "### Inspect examples\n\nDownload object metadata or constituent parts from the drives as a ZIP archive. Enable **Encrypt** to protect the downloaded archive; save the decryption key when it is shown.\n\n- **Object metadata:** Volume/Bucket `test-bucket`, Path `test*/xl.meta`.\n- **Object parts:** Volume/Bucket `test-bucket`, Path `test*/*/part.*`.\n- **Recursive prefix:** Volume/Bucket `test-bucket`, Path `test/**`.\n\n**Caution:** Recursive inspection can be expensive. Limit the bucket and path before starting; use recursive patterns only when necessary.":
    "### 検査の例\n\nオブジェクトのメタデータまたは構成パーツをドライブから ZIP アーカイブとしてダウンロードします。ダウンロードしたアーカイブを保護するには、**暗号化** を有効にします。復号キーが表示されたら保存してください。\n\n- **オブジェクトメタデータ:** ボリューム/バケット `test-bucket`、パス `test*/xl.meta`。\n- **オブジェクトパーツ:** ボリューム/バケット `test-bucket`、パス `test*/*/part.*`。\n- **再帰プレフィックス:** ボリューム/バケット `test-bucket`、パス `test/**`。\n\n**注意:** 再帰的な検査は高負荷になる場合があります。開始前にバケットとパスを制限し、再帰パターンは必要な場合にのみ使用してください。",
  Troubleshooting: "トラブルシューティング",
  "Need more help?  Check out additional Troubleshooting options":
    "さらにサポートが必要ですか?  追加のトラブルシューティング オプションを確認してください",
  "Identity and Access Management": "ID とアクセス管理",
  "SILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access.":
    "SILO は、ポリシーベースのアクセス制御 (PBAC) を使用して、認証されたユーザーがアクセスできる許可されたアクションとリソースを定義します。",
  "Policy based access control": "ポリシーベースのアクセス制御",
  "Learn how Policy-Based Access Control (PBAC)  is used to define the authorized actions and resources  to which an authenticated user has access":
    "ポリシーベースのアクセス制御 (PBAC) を使用して、認証されたユーザーがアクセスできる許可されたアクションとリソースを定義する方法を学習します。",
  "OpenID Connect Access Management": "OpenID Connect アクセス管理",
  "Learn more about connecting SILO to OpenID for access management.":
    "アクセス管理のために SILO を OpenID に接続する方法について詳しく説明します。",
  "MinIO Identity and Access Management: Part 1 - Overview And Modification of Built In Policies":
    "MinIO ID とアクセス管理: パート 1 - 組み込みポリシーの概要と変更",
  "This video introduces MinIO IAM policies, including an overview of the built-in policies, and how to create and remove a policy.":
    "このビデオでは、組み込みポリシーの概要とポリシーの作成および削除方法を含む、MinIO IAM ポリシーを紹介します。",
  "MinIO Identity and Access Management: Part 4 - Lab - Setting Up Users, Groups, and Policies":
    "MinIO ID とアクセス管理: パート 4 - ラボ - ユーザー、グループ、およびポリシーのセットアップ",
  "This Lab video demonstrates setting up identity and access management based Users, Groups and Policies. ":
    "このラボ ビデオでは、ユーザー、グループ、ポリシーに基づいた ID およびアクセス管理の設定を説明します。",
  "MinIO Identity and Access Management: Part 5 - Lab - Creating A Custom Policy":
    "MinIO ID とアクセス管理: パート 5 - ラボ - カスタム ポリシーの作成",
  "This Lab video demonstrates creating custom IAM policies.":
    "このラボ ビデオでは、カスタム IAM ポリシーの作成について説明します。",
  "MinIO Identity and Access Management: Part 6 - Lab - Interfacing With OpenID and LDAP":
    "MinIO ID とアクセス管理: パート 6 - ラボ - OpenID および LDAP とのインターフェース",
  "This Lab video demonstrates interfacing with OpenID and LDAP. ":
    "このラボ ビデオでは、OpenID および LDAP とのインターフェイスを示します。",
  "# Bucket \n A bucket is similar to a folder or directory in a filesystem, where each bucket can hold an arbitrary number of objects.":
    "# バケット \n バケットはファイルシステム内のフォルダーまたはディレクトリに似ており、各バケットには任意の数のオブジェクトを保持できます。",
  "Bucket Versioning": "バケットのバージョン管理",
  "SILO supports keeping multiple “versions” of an object in a single bucket. SILO versioning protects from unintended overwrites and deletions while providing support for “undoing” a write operation.":
    "SILO は、オブジェクトの複数の「バージョン」を単一のバケットに保持することをサポートします。 SILO バージョン管理は、書き込み操作の「元に戻す」サポートを提供しながら、意図しない上書きや削除から保護します。",
  Buckets: "バケット",
  "Learn about using Console to create and manage Buckets with SILO":
    "SILO でコンソールを使用してバケットを作成および管理する方法について学びます",
  "Creating Buckets and Users through the MinIO Console":
    "MinIO コンソールを使用したバケットとユーザーの作成",
  "Learn how to manage your storage buckets and objects with a hands-on introduction to the MinIO Console and SDKs.":
    "MinIO コンソールと SDK の実践的な紹介を通じて、ストレージ バケットとオブジェクトを管理する方法を学びます。",
  "Console Introduction - Add a Bucket and a User":
    "コンソールの紹介 - バケットとユーザーの追加",
  "This session shows how to create AWS S3 buckets and users with MinIO Console.":
    "このセッションでは、MinIO コンソールを使用して AWS S3 バケットとユーザーを作成する方法を説明します。",
  "Object Locking and Retention": "オブジェクトのロックと保持",
  "In this video we talk about object retention, WORM (Write Once Read Many), as well as duration based and legal holds.":
    "このビデオでは、オブジェクトの保持、WORM (Write Once Read Many)、および期間ベースの保持とリーガルホールドについて説明します。",
  "Object Locking and Retention Lab": "オブジェクトのロックと保持のラボ",
  "This lab demonstrates creation and removal of both bucket and object specific retention, compliance, and legal holds. ":
    "このラボでは、バケットおよびオブジェクト固有の保持、コンプライアンス、リーガルホールドの作成と削除を説明します。",
  "Versioning and Lifecycle Management": "バージョン管理とライフサイクル管理",
  "In this video, we will focus on versioning and lifecycle management.":
    "このビデオでは、バージョン管理とライフサイクル管理に焦点を当てます。",
  Versioning: "バージョニング",
  "Learn how Versioning gives access to the full history of an object from its creation through each update.":
    "バージョニングによって、オブジェクトの作成から各更新までの完全な履歴にどのようにアクセスできるかを学びましょう。",
  "Learn how versioning protects your data from unintended overwrites and deletions":
    "バージョニングによってデータが意図しない上書きや削除からどのように保護されるかを学びます",
  "Learn how to create and manage Buckets":
    "バケットの作成および管理方法を学ぶ",
  "In this video, we will focus on versioning  and lifecycle management.":
    "このビデオでは、バージョン管理とライフサイクル管理に焦点を当てます。",
  "Policy Document Structure": "ポリシー文書の構造",
  "SILO policy documents use the same schema as AWS IAM Policy documents. See policy templates and allowed S3 Policy actions and condition keys in our docs.":
    "SILO ポリシー文書は、AWS IAM ポリシー文書と同じスキーマを使用します。ポリシー テンプレートと、許可されている S3 ポリシー アクションと条件キーについては、ドキュメントを参照してください。",
  "Access Keys": "アクセスキー",
  "Access Keys support providing applications authentication credentials which inherit permissions from the “parent” user.":
    "アクセス キーは、「親」ユーザーから権限を継承するアプリケーション認証資格情報の提供をサポートします。",
  "Policy Variables": "ポリシー変数",
  "SILO supports using policy variables for automatically substituting context from the authenticated user and/or the operation into the user’s assigned policy or policies.":
    "SILO は、認証されたユーザーおよび/または操作からのコンテキストを、ユーザーに割り当てられたポリシーに自動的に置き換えるためのポリシー変数の使用をサポートします。",
  "Admin Policy Action Keys": "管理ポリシーのアクション キー",
  "See actions supported in defining policies for SILO admin operations. These actions are only valid for SILO deployments and are not intended for use with other S3-compatible services.":
    "SILO 管理操作のポリシーの定義でサポートされているアクションを参照してください。これらのアクションは、SILO 展開でのみ有効であり、他の S3 互換サービスでの使用を目的としていません。",
  "Admin Policy Condition Keys": "管理ポリシーの条件キー",
  "See which conditions SILO supports for use with defining policies for admin actions.":
    "管理アクションのポリシーを定義する際に、SILO がサポートする条件を確認してください。",
  "Supported S3 Policy Condition Keys": "サポートされるS3 ポリシー条件キー",
  "SILO policy documents support IAM conditional statements.":
    "SILO ポリシー文書は IAM 条件ステートメントをサポートします。",
  "Supported S3 Policy Actions": "サポートされている S3 ポリシー アクション",
  "SILO policy documents support a subset of IAM S3 Action keys.":
    "SILO ポリシー文書は、IAM S3 アクション キーのサブセットをサポートします。",
  "MinIO Identity and Access Management: Part 2 - Using IDP to Manage Users And Groups":
    "MinIO ID とアクセス管理: パート 2 - IDP を使用してユーザーとグループを管理する",
  "This video discusses Users and Groups, and how policies can be applied to them to enable specific permissions.":
    "このビデオでは、ユーザーとグループ、およびそれらにポリシーを適用して特定の権限を有効にする方法について説明します。",
  "SILO versioning protects from unintended overwrites and deletions while providing support for “undoing” a write operation.":
    "SILO バージョニングは、書き込み操作の「取り消し」をサポートしながら、意図しない上書きや削除から保護します。",
  "Lifecycle Management II - Versioning and Lifecycle Management":
    "ライフサイクル管理 II - バージョン管理とライフサイクル管理",
  "Creating a New Bucket in a Specific Region":
    "特定のリージョンに新しいバケットを作成する",
  "A Bucket can be created in a specified region":
    "指定したリージョンにバケットを作成できます",
  "What are Settings and Configurations?": "設定と構成とは何ですか?",
  "These configuration settings define runtime  behavior of the SILO server process,  comparable to the mc admin config command":
    "これらの設定は、mc admin config コマンドと同様に、SILO サーバープロセスの実行時の動作を定義します。",
  "MinIO Feature Overview: Active-Active Replication":
    "MinIO 機能の概要: アクティブ/アクティブ レプリケーション",
  "Learn about MinIO's object replication capabilities and how MinIO provides resilience to common storage disruption scenarios.":
    "MinIO のオブジェクト レプリケーション機能と、一般的なストレージ中断シナリオに対して MinIO がどのように回復力を提供するかについて学びます。",
  "How is failed replication handled?":
    "失敗したレプリケーションはどのように処理されますか?",
  "SILO queues failed replication operations and retries those operations until replication succeeds.":
    "SILO は、失敗したレプリケーション操作をキューに入れ、レプリケーションが成功するまでそれらの操作を再試行します。",
  "What are Replication Workers?": "レプリケーション ワーカーとは何ですか?",
  "SILO uses a replication queuing system with multiple concurrent replication workers operating on that queue.":
    "SILO は、複数の同時レプリケーション ワーカーがキュー上で動作するレプリケーション キュー システムを使用します。",
  "These configuration settings define runtime behavior of the SILO server process,  comparable to the mc admin config command":
    "これらの設定は、mc admin config コマンドと同様に、SILO サーバープロセスの実行時の動作を定義します。",
  "Where can I see current Heal status?":
    "現在の修復ステータスはどこで確認できますか？",
  "Check under Monitoring/Drives on the left hand  menu to see Drive and Bucket Healing status":
    "左側のメニューの [監視/ドライブ] をチェックして、ドライブとバケットの修復ステータスを確認します。",
  "How is Erasure Coding used to Protect Data?":
    "イレイジャーコーディングはデータを保護するためにどのように使用されますか?",
  "SILO erasure coding is a data redundancy and  availability feature that allows SILO deployments to  automatically reconstruct objects on-the-fly despite  the loss of multiple drives or nodes in the cluster.":
    "SILO イレージャーコーディングは、クラスター内の複数のドライブまたはノードが失われた場合でも、SILO 導入環境でオブジェクトをオンザフライで自動的に再構築できるようにするデータ冗長性および可用性機能です。",
  "Recover After Hardware failure": "ハードウェア障害後の回復",
  "Depending on the deployment topology and  selected erasure code parity, SILO can tolerate loss  of up to half the drives or nodes in the deployment  while maintaining read access to objects.":
    "展開トポロジと選択した消去コード パリティに応じて、SILO は、オブジェクトへの読み取りアクセスを維持しながら、展開内の最大半分のドライブまたはノードの損失を許容できます。",
  "Site Failure Recovery": "サイト障害の回復",
  "SILO can make the loss of an entire site, while  significant, a relatively minor incident. Site recovery depends on the replication option you use for the site.":
    "サイト全体の喪失は重大な事象ですが、SILO では影響を最小限に抑えることができます。サイトの復旧方法は、使用しているレプリケーション構成によって異なります。",
  "Node Failure Recovery": "ノード障害の回復",
  "If a SILO node suffers complete hardware failure, the node begins healing operations once it rejoins the  deployment.":
    "SILO ノードに完全なハードウェア障害が発生した場合、ノードはデプロイメントに再参加すると修復操作を開始します。",
  "What is SILO Healing?": "SILO の修復（ヒーリング）とは？",
  "Healing is SILO’s ability to restore data after some event causes data loss. Data loss can come from bit rot, drive loss, or node loss.":
    "ヒーリングとは、何らかのイベントによりデータ損失が発生した後にデータを復元する SILO の機能です。データ損失は、ビットの破損、ドライブの損失、またはノードの損失によって発生する可能性があります。",
  "Understand SILO Healing Using mc": "mc を使用した SILO の修復を理解する",
  "The mc admin heal command scans for objects that are damaged or corrupted and heals those objects.":
    "mc admin heal コマンドは、破損したオブジェクトをスキャンして修復します。",
  "What is Bit Rot?": "ビットロットとは何ですか?",
  "Bit rot is data corruption that occurs without the user’s knowledge. SILO combats bit rot with hashing and erasure coding.":
    "ビットロット（データ劣化）とは、ユーザーが気づかないうちに発生するデータ破損です。SILO はハッシュとイレイジャーコーディングでビットロットに対処します。",
  "These configuration settings define runtime behavior of the SILO server process, comparable to the mc admin config command":
    "これらの設定は、mc admin config コマンドと同様に、SILO サーバープロセスの実行時の動作を定義します。",
  "Overview of MinIO Erasure Coding": "MinIO イレイジャーコーディングの概要",
  "Through this MinIO video you will learn about MinIO erasure coding, including erasure sets, erasure parity, and stripe size. You will also learn about how the Reed-Solomon algorithm can be optimized for storage efficiency (yielding cost savings) or data lost protection (number of servers and drives that can fail). The video also walks through the MinIO Erasure Code calculator, considerations for cluster design and the command line syntax needed to establish an erasure code deployment. ":
    "この MinIO ビデオを通じて、消去セット、消去パリティ、ストライプ サイズなど、MinIO 消去コーディングについて学びます。また、ストレージ効率 (コスト削減の実現) やデータ損失保護 (障害が発生する可能性のあるサーバーとドライブの数) を実現するためにリードソロモン アルゴリズムを最適化する方法についても学びます。このビデオでは、MinIO イレイジャー コード計算ツール、クラスター設計の考慮事項、イレイジャー コードの展開を確立するために必要なコマンド ライン構文についても説明します。",
  "Object Scanner": "オブジェクトスキャナー",
  "Learn more about how the scanner checks Objects for transition and expiry based on lifecycle rules":
    "スキャナーがライフサイクル ルールに基づいてオブジェクトの移行と有効期限をチェックする方法の詳細をご覧ください",
  "What is the Scanner?": "スキャナーとは何ですか?",
  "One of several low-priority processes SILO runs to check lifecycle management rules, bucket or site replication status, as well as object bit rot and healing":
    "ライフサイクル管理ルール、バケットやサイトのレプリケーション状態、およびオブジェクトのビットロットと修復をチェックするために SILO が実行する低優先度プロセスの 1 つです。",
  "Lifecycle Management Object Scanner Considerations":
    "ライフサイクル管理オブジェクト スキャナーの考慮事項",
  "SILO uses a scanner process to check objects against all configured lifecycle management rules. High IO workloads or limited system resources may delay application of lifecycle management rules":
    "SILO は、スキャナ プロセスを使用して、設定されているすべてのライフサイクル管理ルールに対してオブジェクトをチェックします。高い IO ワークロードまたは限られたシステム リソースにより、ライフサイクル管理ルールの適用が遅れる可能性があります",
  "Lifecycle Management Lab": "ライフサイクル管理ラボ",
  "Use the MinIO client to demonstrate expiration rules, the scanner, and transitioning objects to remote tiers.":
    "MinIO クライアントを使用して、有効期限ルール、スキャナー、およびリモート層へのオブジェクトの移行を示します。",
  "What is etcd?": "etcdとは何ですか？",
  "etcd is a strongly consistent, distributed key-value  store that provides a reliable way to store data that  needs to be accessed by a distributed system or  cluster of machines.":
    "etcd は、分散システムまたはマシンのクラスターからアクセスする必要があるデータを保存するための信頼できる方法を提供する、強力な一貫性のある分散キーバリュー ストアです。",
  "What is the logger_webhook Environment Variable?":
    "logger_webhook 環境変数とは何ですか?",
  "The top-level configuration key for defining an  HTTP webhook target for publishing SILO logs.":
    "SILO ログを公開するための HTTP Webhook ターゲットを定義するための最上位の構成キー。",
  "Publish Server Logs to HTTP Webhook": "サーバーログを HTTP Webhook に公開",
  "You can configure a new HTTP webhook endpoint  to which SILO publishes SILO server logs using  either environment variables or by setting  runtime configuration settings.":
    "環境変数またはランタイム構成設定を使用して、SILO が SILO サーバー ログを公開する新しい HTTP Webhook エンドポイントを構成できます。",
  "Monitoring Logs": "監視ログ",
  "SILO supports publishing server logs  and audit logs to an HTTP webhook.":
    "SILO は、HTTP Webhook へのサーバー ログと監査ログの公開をサポートします。",
  "Monitoring with Prometheus": "Prometheusによるモニタリング",
  "Learn about the monitoring features available  in your MinIO Console and how to export to  Prometheus and get information back so you can  view it in detail.":
    "MinIO コンソールで利用できる監視機能と、Prometheus にエクスポートして情報を取得して詳細を表示する方法について学びます。",
  "Prometheus Monitoring Lab": "Prometheus モニタリングラボ",
  "Learn how to set up Prometheus and connect it  back to your MinIO cluster so that you can get  detailed history of what's going on in your MinIO  cluster at any given time.":
    "Prometheus をセットアップし、MinIO クラスターに接続し直す方法を学び、MinIO クラスター内で何が起こっているかの詳細な履歴をいつでも取得できるようにします。",
  "Publish Audit Logs to an HTTP webhook": "監査ログを HTTP Webhook に公開する",
  "You can configure a new HTTP webhook endpoint  to which SILO publishes audit logs using either  environment variables or by setting runtime  configuration settings":
    "環境変数またはランタイム構成設定を使用して、SILO が監査ログを公開する新しい HTTP Webhook エンドポイントを構成できます",
  "Publish Audit Logs to an External Service":
    "監査ログを外部サービスに公開する",
  "Audit logs are granular descriptions of each operation  on the SILO deployment supporting security  standards and regulations which require  detailed tracking of operations.":
    "監査ログは、操作の詳細な追跡を必要とするセキュリティ標準と規制をサポートする、SILO 導入環境での各操作の詳細な説明です。",
  "Publish Events to Kafka": "Kafka にイベントを公開",
  "SILO supports publishing bucket notification events to a Kafka service endpoint.":
    "SILO は、Kafka サービス エンドポイントへのバケット通知イベントの発行をサポートします。",
  "Kafka Service for Bucket Notifications": "Kafka バケット通知サービス",
  "Learn about environment variables for configuring a Kafka service as a target for Bucket Nofitications.":
    "Kafka サービスをバケット通知のターゲットとして構成するための環境変数について学習します。",
  "Kafka Service Configuration Settings": "Kafka サービス構成設定",
  "Supported Bucket Notification Targets":
    "サポートされるバケット通知ターゲット",
  "Learn which notification targets are supported by SILO.":
    "SILO でサポートされている通知ターゲットを確認します。",
  "Bucket Notifications": "バケット通知",
  "SILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events.":
    "SILO バケット通知を使用すると、管理者は特定のオブジェクトまたはバケット イベントに関してサポートされている外部サービスに通知を送信できます。",
  "Need more help? Check out additional Troubleshooting options":
    "さらにサポートが必要ですか?追加のトラブルシューティング オプションを確認してください",
  "Site Replication Prerequisite": "サイトレプリケーションの前提条件",
  "Check that your setup meets the requirements to deploy Site Replication":
    "セットアップがサイト レプリケーションを展開するための要件を満たしていることを確認してください",
  "Site replication configures multiple independent SILO deployments as a cluster of replicas called peer sites.":
    "サイト レプリケーションは、複数の独立した SILO 展開をピア サイトと呼ばれるレプリカのクラスターとして構成します。",
  "Site Replication Overview": "サイト複製の概要",
  "See what changes are and are NOT replicated between peer sites":
    "ピアサイト間で複製される変更と複製されない変更を確認します",
  "Site Replication Tutorial": "サイト複製のチュートリアル",
  "Learn how to set up site replication using Console and the SILO client (mc)":
    "コンソールと SILO クライアント (mc) を使用してサイトのレプリケーションを設定する方法を学習します。",
  "Transition from SILO to Azure": "SILO から Azure への移行",
  "See the procedure to create a new object lifecycle management rule that transition objects from a SILO bucket to a remote storage tier on the Azure storage backend.":
    "オブジェクトを SILO バケットから Azure ストレージ バックエンドのリモート ストレージ層に移行する新しいオブジェクト ライフサイクル管理ルールを作成する手順を参照してください。",
  "Transition from SILO to GCS": "SILO から GCS への移行",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Google Cloud Storage backend.":
    "オブジェクトを SILO バケットから Google Cloud Storage バックエンドのリモート ストレージ層に移行する新しいオブジェクト ライフサイクル管理ルールを作成する手順を参照してください。",
  "Transition from SILO to S3": "SILO から S3 への移行",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Amazon Web Services S3 storage backend or an S3-compatible service.":
    "オブジェクトを SILO バケットからアマゾン ウェブ サービス S3 ストレージ バックエンドまたは S3 互換サービス上のリモート ストレージ層に移行する新しいオブジェクト ライフサイクル管理ルールを作成する手順を参照してください。",
  "Transition to Remote SILO Deployment": "リモート SILO 導入への移行",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a bucket on a primary SILO deployment to a bucket on a remote SILO deployment. ":
    "プライマリ SILO デプロイメント上のバケットからリモート SILO デプロイメント上のバケットにオブジェクトを移行する、新しいオブジェクト ライフサイクル管理ルールを作成する手順を参照してください。",
  "Object Lifecycle Management": "オブジェクトのライフサイクル管理",
  "Use SILO Object Lifecycle Management to create rules for time or date based automatic transition or expiry of objects.":
    "SILO オブジェクト ライフサイクル管理を使用して、時間または日付に基づいたオブジェクトの自動移行または有効期限のルールを作成します。",
  "MinIO Feature Overview: Object Lifecycle Management":
    "MinIO 機能の概要: オブジェクトのライフサイクル管理",
  "Learn about MinIO's object lifecycle management capabilities.":
    "MinIO のオブジェクト ライフサイクル管理機能について学びます。",
  "Lifecycle Management I - Tiers": "ライフサイクル管理 I - 階層",
  "In this video we will cover expiration and transition of objects to an alternate tier of storage.":
    "このビデオでは、オブジェクトの有効期限切れとストレージの代替層への移行について説明します。",
  Tiers: "ストレージ階層",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Azure storage backend.":
    "オブジェクトを SILO バケットから Azure ストレージ バックエンドのリモート ストレージ層に移行する新しいオブジェクト ライフサイクル管理ルールを作成する手順を参照してください。",
  "Console Metrics Dashboard": "コンソールメトリクスダッシュボード",
  "The SILO Console provides a point-in-time metrics dashboard by default, and also supports displaying time-series and historical data by querying a Prometheus service configured to scrape data from the SILO deployment.":
    "SILO コンソールは、デフォルトでポイントインタイムメトリクスダッシュボードを提供し、SILO デプロイメントからデータを収集するように構成された Prometheus サービスにクエリを実行することにより、時系列データと履歴データの表示もサポートします。",
  "Available Metrics": "利用可能な指標",
  "Learn about the different Prometheus metrics published by SILO server":
    "SILO サーバーによって公開されるさまざまな Prometheus メトリクスについて学びます",
  "Metrics and Alerts": "メトリクスとアラート",
  "For historical metrics and analytics, SILO publishes cluster and node metrics using the Prometheus Data Model.":
    "履歴メトリクスと分析については、SILO が Prometheus データ モデルを使用してクラスターとノードのメトリクスを公開します。",
  "Learn about the monitoring features available  in your MinIO Console.":
    "MinIO コンソールで利用できる監視機能について説明します。",
  "User Management": "ユーザー管理",
  "Each user can have one or more assigned policies that explicitly list the actions and resources to which that user has access. Users can also inherit policies from the groups in which they have membership.":
    "各ユーザーは、そのユーザーがアクセスできるアクションとリソースを明示的にリストするポリシーを 1 つ以上割り当てることができます。ユーザーは、メンバーシップを持っているグループからポリシーを継承することもできます。",
  "Group Management": "グループ管理",
  "A group is a collection of users. Each group can have one or more assigned policies that explicitly list the actions and resources to which group members are allowed or denied access.":
    "グループはユーザーの集合です。各グループには、グループ メンバーにアクセスを許可または拒否するアクションとリソースを明示的にリストする 1 つ以上のポリシーを割り当てることができます。",
  "MinIO Identity and Access Management: Part 3 - Interfacing with OpenID and LDAP":
    "MinIO ID とアクセス管理: パート 3 - OpenID および LDAP とのインターフェース",
  "This video is focused on interfacing with OpenID and LDAP to manage access to MinIO.":
    "このビデオは、MinIO へのアクセスを管理するための OpenID および LDAP とのインターフェースに焦点を当てています。",
  "MinIO Authentication and Authorization Using OpenID and Keycloak":
    "MinIO OpenID と Keycloak を使用した認証と認可",
  "In this video you will learn how to set up an OpenID service, Keycloak, to provide authentication and authorization as part of a MinIO deployment.":
    "このビデオでは、OpenID サービス Keycloak をセットアップして、MinIO 導入の一部として認証と認可を提供する方法を学びます。",
  "Drive Healing": "ドライブの修復",
  "The Drives section displays the healing status for a bucket.":
    "「ドライブ」セクションには、バケットの修復ステータスが表示されます。",
  "Erasure Coding": "イレイジャーコーディング",
  "SILO Erasure Coding is a data redundancy and availability feature that allows SILO deployments to automatically reconstruct objects on-the-fly despite the loss of multiple drives or nodes in the cluster.":
    "SILO イレイジャー コーディングは、クラスター内の複数のドライブまたはノードが失われた場合でも、SILO 導入環境でオブジェクトをオンザフライで自動的に再構築できるようにするデータの冗長性および可用性機能です。",
  "Site Healing": "サイトの修復",
  "Any SILO deployment in the site replication configuration can resynchronize damaged replica-eligible data from the peer with the most updated (“latest”) version of that data.":
    "サイトレプリケーション構成内の任意の SILO デプロイメントは、破損したレプリケーション対象データを、最新バージョンを保持するピアから再同期できます。",
  Healing: "修復",
  "SILO Automatically Heals Corrupt or Missing Data On-the-fly":
    "SILO は破損または欠落したデータをオンザフライで自動修復します",
  "In this video, we will provide an overview of site-wide replication.":
    "このビデオでは、サイト全体のレプリケーションの概要を説明します。",
  Health: "稼働状態",
  "The health section provides an interface for running a health diagnostic for the SILO Deployment. The report is generated on the deployment and downloaded directly to your browser.":
    "正常性セクションでは、SILO デプロイメントの正常性診断を実行するためのインターフェイスが提供されます。レポートは展開上で生成され、ブラウザに直接ダウンロードされます。",
  "IDP Docs": "IDP ドキュメント",
  "SILO supports multiple external identity managers through OpenID Connect-Compatible Active Directory / LDAP":
    "SILO は、OpenID Connect 互換の Active Directory / LDAP を通じて複数の外部 ID マネージャーをサポートします",
  "Built-in SILO IDP": "内蔵 SILO IDP",
  "SILO includes a built-in IDentity Provider (IDP) that provides core identity management functionality.":
    "SILO には、コア ID 管理機能を提供する組み込み IDentity Provider (IDP) が含まれています。",
  "Active Directory / LDAP Access Management":
    "Active Directory / LDAP アクセス管理",
  "For identities managed by the external AD/LDAP provider, SILO uses the user’s Distinguished Name and attempts to map it against an existing policy.":
    "外部の AD/LDAP プロバイダーによって管理される ID の場合、SILO はユーザーの識別名を使用し、それを既存のポリシーに対してマッピングしようとします。",
  "Keycloak configuration": "Keycloak 構成",
  "You can configure SILO to use Keycloak as an external IDentity Provider (IDP) for authentication of users via the OpenID Connect (OIDC) protocol.":
    "OpenID Connect (OIDC) プロトコル経由でユーザーを認証するための外部 ID プロバイダー (IDP) として Keycloak を使用するように SILO を構成できます。",
  "LDAP Configuration": "LDAP 構成",
  "SILO supports configuring a single Active Directory / LDAP Connect for external management of user identities.":
    "SILO は、ユーザー ID を外部管理するために単一の Active Directory / LDAP 接続の構成をサポートします。",
  "OIDC Configuration": "OIDC 構成",
  "SILO supports using an OpenID Connect (OIDC) compatible IDentity Provider (IDP) such as Okta, KeyCloak, Dex, Google, or Facebook for external management of user identities.":
    "SILO は、ユーザー ID の外部管理のために、Okta、KeyCloak、Dex、Google、Facebook などの OpenID Connect (OIDC) 互換 ID プロバイダー (IDP) の使用をサポートします。",
  "KMS overview": "KMS 概要",
  "MinIO's cryptographic expert shares why MinIO built KES, what it is used for and how it fits into the MinIO architecture.":
    "MinIO の暗号専門家が、MinIO がなぜ KES を構築したのか、何に使用されるのか、MinIO アーキテクチャにどのように適合するのかを共有します。",
  "Learn about key management using KMS.":
    "KMS を使用したキー管理について学びます。",
  "Text snippet that will be relevant to the user will  go here  made to look nice in the helpitem size  on two-three lines":
    "ユーザーに関連するテキスト スニペットがここに表示されます。ヘルプ項目のサイズが 2 ～ 3 行で見栄えがするように作成されています。",
  "Error logs can be filtered by node and log type, as well as search for specific text in the logs.":
    "エラー ログはノードとログ タイプでフィルタリングしたり、ログ内の特定のテキストを検索したりできます。",
  "Audit Logs": "監査ログ",
  "You can configure an HTTP webhook endpoint to which SILO publishes audit logs using either environment variables or by setting runtime configuration settings.":
    "環境変数またはランタイム構成設定を使用して、SILO が監査ログを発行する HTTP Webhook エンドポイントを構成できます。",
  "Object Lambda": "Object Lambda",
  "SILO’s Object Lambda enables developers to programmatically transform objects on demand.":
    "SILO の Object Lambda を使用すると、開発者はオンデマンドでオブジェクトをプログラムで変換できます。",
  "MinIO Event Notifications - Overview": "MinIO イベント通知 - 概要",
  "Use the Event framework to see what's going on in the system using Bucket, Object, Replication and ILM events.":
    "イベント フレームワークを使用して、バケット、オブジェクト、レプリケーション、および ILM イベントを使用してシステム内で何が起こっているかを確認します。",
  "Managing Event Notifications Using MinIO MC Commands":
    "MinIO MC コマンドを使用したイベント通知の管理",
  "This video provides an overview of the types of event notifications and how to set them up using MinIO's mc commands.":
    "このビデオでは、イベント通知の種類の概要と、MinIO の mc コマンドを使用してイベント通知を設定する方法を説明します。",
  "MinIO Events Notifications - Setting Up Webhooks Using Python":
    "MinIO イベント通知 - Python を使用した Webhook のセットアップ",
  "This video provides an overview of how to use Python and Flask to set up a Webhook on MinIO. ":
    "このビデオでは、Python と Flask を使用して MinIO に Webhook を設定する方法の概要を説明します。",
  "MinIO Event Notifications - Using The MinIO Python SDK to Write Custom Webhooks":
    "MinIO イベント通知 - MinIO Python SDK を使用してカスタム Webhook を作成する",
  "This video dives deeper into using the MinIO Python SDK to setup and manage notifications.":
    "このビデオでは、MinIO Python SDK を使用して通知を設定および管理する方法について詳しく説明します。",
  "Object Management": "オブジェクト管理",
  "Learn about Objects and how  SILO allows you to manage them":
    "オブジェクトと、SILO でオブジェクトを管理する方法について学びます",
  "Managing Objects with the Object Browser":
    "オブジェクト ブラウザを使用したオブジェクトの管理",
  "Learn how to use the Console Object Browser  to manage your Objects":
    "コンソール オブジェクト ブラウザを使用してオブジェクトを管理する方法を学びます",
  "Manipulating Objects": "オブジェクトの操作",
  "A demo of Prefixes & Objects with examples of copying and deleting an object, as well as CopySource Object.":
    "オブジェクトのコピーと削除、および CopySource オブジェクトの例を含むプレフィックスとオブジェクトのデモ。",
  "Example Policy - Bucket Resource Access":
    "ポリシーの例 - バケット リソース アクセス",
  "An example policy demonstrating authorization  limited to a named bucket":
    "名前付きバケットに限定された認可を示すポリシーの例",
  Performance: "パフォーマンス",
  "The performance section provides an interface for running a performance test of the deployment.":
    "パフォーマンス セクションでは、展開のパフォーマンス テストを実行するためのインターフェイスが提供されます。",
  Profile: "プロファイル",
  "The profile section provides an interface for running system profiling of the deployment. The results can provide insight into the SILO server process running on a given node.":
    "プロファイル セクションは、展開のシステム プロファイリングを実行するためのインターフェイスを提供します。結果から、特定のノードで実行されている SILO サーバー プロセスについての洞察が得られます。",
  Inspect: "検査",
  "The inspect section provides an interface for capturing the erasure-coded metadata associated to an object or objects.":
    "検査セクションは、オブジェクトに関連付けられた消去符号化メタデータをキャプチャするためのインターフェイスを提供します。",
  "Encrypt Inspect Output": "検査結果を暗号化",
  "You can encrypt the output of the mc support inspect command for enhanced security when transferring the files off the deployment.":
    "デプロイメント外へファイルを転送する際のセキュリティを強化するため、mc support inspect コマンドの出力を暗号化できます。",
  "What is Trace?": "トレースとは何ですか?",
  "The trace section provides HTTP trace functionality for a bucket or buckets on the deployment.":
    "トレース セクションは、展開上の 1 つまたは複数のバケットに対する HTTP トレース機能を提供します。",
  Users: "ユーザー",
  "What is Watch?": "イベント監視（Watch）とは？",
  "The Watch section displays S3 events as they occur on the selected bucket.":
    "[監視] セクションには、選択したバケットで発生した S3 イベントが表示されます。",
  "Access Managemnt": "アクセス管理",
  "Object Locking": "オブジェクトロック",
  "SILO Object Locking (“Object Retention”) enforces Write-Once Read-Many (WORM) immutability to protect versioned objects from deletion.":
    "SILO オブジェクト ロック (「オブジェクト保持」) は、バージョン管理されたオブジェクトを削除から保護するために、Write-Once Read-Many (WORM) の不変性を強制します。",
  Encryption: "暗号化",
  "SILO Server-Side Encryption (SSE) protects objects as part of write operations, allowing clients to take advantage of server processing power to secure objects at the storage layer (encryption-at-rest).":
    "SILO サーバー側暗号化 (SSE) は、書き込み操作の一部としてオブジェクトを保護し、クライアントがサーバーの処理能力を利用してストレージ層でオブジェクトを保護できるようにします (保存時の暗号化)。",
  "Learn how to use Console to manage Buckets":
    "コンソールを使用してバケットを管理する方法を学びます",
  "Bucket Replication": "バケットのレプリケーション",
  "SILO server-side bucket replication is an automatic bucket-level configuration that synchronizes objects between a source and destination bucket.":
    "SILO サーバー側バケット レプリケーションは、ソース バケットと宛先バケット間でオブジェクトを同期するバケット レベルの自動構成です。",
  "This video gives an overview of how to set up and use object versioning as part of a data lifecycle management strategy.":
    "このビデオでは、データ ライフサイクル管理戦略の一環としてオブジェクトのバージョン管理を設定および使用する方法の概要を説明します。",
  "Versioning Lab": "バージョニングラボ",
  "This demo will take you through the steps to manage versioned objects using the MinIO command line tools.":
    "このデモでは、MinIO コマンド ライン ツールを使用してバージョン管理されたオブジェクトを管理する手順を説明します。",
  "Bucket Replication Requirements": "バケットのレプリケーション要件",
  "Check here to ensure you meet the prerequisites before setting up any replication configurations.":
    "レプリケーション構成をセットアップする前に、ここをチェックして前提条件を満たしていることを確認してください。",
  "Bucket Replication Overview": "バケットレプリケーションの概要",
  "In this video, we will cover bucket level replication, both active-passive and active-active.":
    "このビデオでは、アクティブ/パッシブとアクティブ/アクティブの両方のバケット レベルのレプリケーションについて説明します。",
  "Replication Lab I": "レプリケーションラボ I",
  "Demonstrates bucket replication concepts using MinIO Client, including active-passive and active-active replication.":
    "アクティブ/パッシブ レプリケーションやアクティブ/アクティブ レプリケーションなど、MinIO クライアントを使用したバケット レプリケーションの概念を示します。",
  "Replication Lab II": "レプリケーションラボ II",
  "Demonstrates site replication concepts using MinIO Client, including active-passive and active-active replication.":
    "アクティブ/パッシブ レプリケーションやアクティブ/アクティブ レプリケーションなど、MinIO クライアントを使用したサイト レプリケーションの概念を示します。",
  "Access Management": "アクセス管理",
  "Logging in": "ログイン中",
  "Sign in with the root credentials, an IAM user access key, or temporary STS credentials via Other Authentication Methods.":
    "root 資格情報、IAM ユーザー アクセス キー、または他の認証方法による一時的な STS 資格情報を使用してサインインします。",
  "Console configuration": "コンソール構成",
  "Configure identity providers, TLS, and session settings for the console on the server side.":
    "サーバー側のコンソールの ID プロバイダー、TLS、およびセッション設定を構成します。",
  "Replication Internals": "レプリケーションの内部構造",
  "Learn details of the SILO replication process.":
    "SILO レプリケーション プロセスの詳細をご覧ください。",
  "One-way Bucket Replication": "一方向バケットレプリケーション",
  "Guidance on configuring one-way Bucket replication using SILO Console.":
    "SILO コンソールを使用した一方向バケット レプリケーションの構成に関するガイダンス。",
  "Two-way Bucket Replication": "双方向バケットレプリケーション",
  "Guidance on configuring two-way (active-active) Bucket replication using SILO Console.":
    "SILO コンソールを使用した双方向 (アクティブ/アクティブ) バケット レプリケーションの構成に関するガイダンス。",
};

export default messages;
