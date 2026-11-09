// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
// AI-assisted translation; see ../../README.md for review and maintenance.

import type { Dictionary } from "../../catalog";

const messages: Dictionary = {
  "Users inherit policies from their groups. Access is denied unless explicitly granted.":
    "ユーザーはグループからポリシーを継承します。明示的に許可されない限り、アクセスは拒否されます。",
  "Policies define allowed actions and resources for users and groups.":
    "ポリシーは、ユーザーとグループに許可されるアクションとリソースを定義します。",
  "IAM policies": "IAM ポリシー",
  "Access keys inherit their parent user’s permissions. An inline policy can only restrict them further.":
    "アクセス キーは、親ユーザーの権限を継承します。インライン ポリシーは、それらをさらに制限することしかできません。",
  "Access keys": "アクセスキー",
  "Configure a destination, then add bucket notification rules to send S3 events to it.":
    "宛先を設定し、S3 イベントを送信するバケット通知ルールを追加します。",
  "Event destinations": "イベントの目的地",
  "SILO version": "SILO バージョン",
  "Raw JSON": "生 JSON",
  "Recursive inspections can be expensive. Limit the bucket and path before starting.":
    "再帰検査には費用がかかる場合があります。開始する前にバケットとパスを制限します。",
  "Open Help for examples, or read the": "ヘルプを開いて例を確認するか、",
  Tasks: "タスク",
  "Tasks: {count} running": "タスク: {count} 実行中",
  "Close Tasks": "タスクを閉じる",
  "Object operations": "オブジェクト操作",
  Running: "ランニング",
  Finished: "完成しました",
  Queued: "キューに登録されました",
  Completed: "完成しました",
  "No running tasks": "実行中のタスクはありません",
  "No finished tasks": "完了したタスクはありません",
  "Clear finished": "クリア済み",
  "ZIP download": "ZIP ダウンロード",
  "Browser handoff": "ブラウザハンドオフ",
  "Task progress": "タスクの進捗状況",
  "Waiting for data": "データを待っています",
  "Remove task": "タスクを削除",
  "Cancel task": "タスクをキャンセル",
  "Retry failed": "再試行に失敗しました",
  "Open bucket/prefix": "バケット/プレフィックスを開く",
  "{done}/{total} completed · {failed} failed · {cancelled} cancelled":
    "{done}/{total}完了 · {failed}失敗 · {cancelled}キャンセル",
  "{bytes} bytes received": "{bytes} バイトを受信しました",
  "Handoff is complete; final download progress is unavailable here.":
    "ハンドオフが完了しました。最終的なダウンロードの進行状況はここでは確認できません。",
  "Counts represent selected targets. Progress within a folder or version cleanup is unavailable.":
    "カウントは選択されたターゲットを表します。フォルダー内の進行状況またはバージョンのクリーンアップは利用できません。",
  "Completed changes remain in place. In-flight requests may have reached the server; inspect before repeating them.":
    "完了した変更はそのまま残ります。処理中のリクエストがサーバーに到達した可能性があります。繰り返す前に調べてください。",
  "Review {count} results": "{count} の結果をレビューします",
  "Server outcome is unconfirmed. Inspect this object before another operation.":
    "サーバーの結果は未確認です。別の操作の前にこのオブジェクトを検査してください。",
  "Task failed: {name}": "タスクが失敗しました: {name}",
  "Task completed: {name}": "タスク完了: {name}",
  "Open Tasks to inspect the results.":
    "結果を確認するには「タスク」を開いてください。",
  "The request failed. Inspect the object before trying again.":
    "リクエストに失敗しました。再試行する前にオブジェクトを確認してください。",
  "Tasks are still running": "タスクはまだ実行中です",
  "Stay here": "このページに留まる",
  "Cancel tasks and leave": "タスクをキャンセルして終了",
  "Leave page": "ページを離れる",
  "Leaving this session cancels queued and running tasks. Changes already completed on the server remain in place.":
    "このセッションを終了すると、待機中および実行中のタスクがキャンセルされます。サーバーですでに完了した変更は保持されます。",
  "Tasks will continue in this session. You can check their progress in Tasks on another page.":
    "タスクはこのセッションで続行されます。別のページの「タスク」から進行状況を確認できます。",
  "Delete Versions": "バージョンを削除",
  "Cluster health": "クラスターの稼働状態",
  "servers online": "サーバーがオンライン",
  "{count} drives online": "{count} 台のドライブがオンライン",
  "{count} server(s) offline": "{count} 台のサーバーがオフライン",
  "{count} drive(s) offline": "{count} 台のドライブがオフライン",
  "{count} drive(s) healing": "{count} 台のドライブを修復中",
  "Drive {drive} is at least 95% full. The server may reject writes.":
    "ドライブ {drive} の使用率が 95% 以上です。サーバーが書き込みを拒否する可能性があります。",
  "Drive {drive} is at least 85% full.":
    "ドライブ {drive} の使用率が 85% 以上です。",
  "Configuration changes are waiting for a server restart.":
    "設定の変更はサーバーの再起動後に反映されます。",
  "Some server or drive health information is unavailable.":
    "一部のサーバーまたはドライブの稼働状態を取得できません。",
  "Capacity is incomplete. Only reported drive measurements are shown.":
    "容量の情報が不完全です。取得できたドライブの測定値のみを表示しています。",
  "Generate health report": "ヘルスレポートを生成",
  "No servers reported": "サーバー情報がありません",
  Server: "サーバー",
  "Just started": "開始直後",
  "Hide drives for {server}": "{server} のドライブを非表示",
  "Show drives for {server}": "{server} のドライブを表示",
  "No drive information available": "ドライブ情報がありません",
  "Drives on {server}": "{server} のドライブ",
  "{used} / {total} used": "{total} 中 {used} 使用中",
  "Drive usage: {drive}": "ドライブ使用量：{drive}",
  "Refresh failed. The last received data is still shown.":
    "更新に失敗しました。最後に取得したデータを表示しています。",
  "Could not load deployment information. Try refreshing.":
    "デプロイメント情報を読み込めませんでした。更新してください。",
  "Deployment statistics": "デプロイメントの統計",
  "of {total} raw capacity": "物理容量 {total} のうち",
  "{available} available": "{available} 利用可能",
  Data: "データ",
  objects: "オブジェクト",
  Alerts: "アラート",
  "Health information unavailable": "稼働状態を取得できません",
  "All systems normal": "すべて正常",
  "Quick actions": "クイック操作",
  "No quick actions available for your permissions.":
    "現在の権限で利用できるクイック操作はありません。",
  "Read & write": "読み取りと書き込み",
  "Delete bucket": "バケットを削除",
  "Actions for {bucket}": "{bucket} の操作",
  "Select {bucket}": "{bucket} を選択",
  "Object lock": "オブジェクトロック",
  Created: "作成日時",
  "Select all visible buckets": "表示中のすべてのバケットを選択",
  "Bucket rows": "バケットの行",
  "The bucket list could not be loaded.":
    "バケットリストをロードできませんでした。",
  "Select one or more buckets first.":
    "最初に 1 つ以上のバケットを選択します。",
  "configure the selected buckets": "選択したバケットを構成します",
  "Search buckets": "バケットを検索",
  "Bucket view": "バケットビュー",
  Cards: "カード",
  "{count} buckets selected": {
    other: "{count} 個のバケットを選択中",
  },
  "{count} bucket selected": "{count} バケットが選択されました",
  "No buckets match “{q}”": "「{q}」に一致するバケットはありません",
  "Clear filter": "フィルターをクリア",
  "Built-in · Modified": "内蔵・改造",
  "Actions for {name}": "{name} のアクション",
  "Reset to default": "デフォルトにリセット",
  "Could not load policies": "ポリシーをロードできませんでした",
  "Refresh to try again.": "更新して再試行してください。",
  "Create a policy to define permissions for users and groups.":
    "ユーザーとグループの権限を定義するポリシーを作成します。",
  "Could not update policy": "ポリシーを更新できませんでした",
  "Reset policy {name} to its default definition?":
    "ポリシー {name} をデフォルトの定義にリセットしますか?",
  "The built-in policy will be restored to the SILO default definition.":
    "組み込みポリシーは、SILO のデフォルト定義に復元されます。",
  "Loading attachment information…": "添付ファイル情報を読み込み中…",
  "This policy has changed or is no longer available. Refresh the list.":
    "このポリシーは変更されたか、利用できなくなりました。リストを更新します。",
  "Attachment information is unavailable.":
    "添付ファイル情報が利用できません。",
  "This policy is attached to {users} users and {groups} groups.":
    "このポリシーは、{users} ユーザーと {groups} グループに適用されます。",
  "Their permissions will follow the default definition.":
    "彼らの権限はデフォルトの定義に従います。",
  "They will lose the permissions it grants.":
    "付与されている権限が失われます。",
  "Could not load policy. Refresh to try again.":
    "ポリシーをロードできませんでした。更新して再試行してください。",
  "Could not load policy": "ポリシーをロードできませんでした",
  "Could not load users for this policy":
    "このポリシーのユーザーをロードできませんでした",
  "Could not load groups for this policy":
    "このポリシーのグループをロードできませんでした",
  "Built-in policies can be overridden by saving a modified version; you can reset it later.":
    "組み込みポリシーは、変更したバージョンを保存することで上書きできます。後でリセットできます。",
  "Override policy": "上書きポリシー",
  "Cancel editing": "編集をキャンセル",
  "Direct policies": "直接ポリシー",
  "Policies inherited through groups": "グループを通じて継承されるポリシー",
  "Access-key count is unavailable.": "アクセスキー数が利用できません。",
  "Group policy information is unavailable.":
    "グループ ポリシー情報が利用できません。",
  "Also assigned directly": "直接割り当ても",
  "From groups:": "グループから:",
  "Group policies could not be loaded.":
    "グループポリシーをロードできませんでした。",
  "Group is disabled; its policies are not inherited.":
    "グループは無効になっています。そのポリシーは継承されません。",
  "Group status is unavailable; inherited permissions are unknown.":
    "グループのステータスが利用できません。継承された権限は不明です。",
  "No inherited group policies": "継承されたグループ ポリシーがありません",
  "Some group policies are unavailable. Refresh to try again.":
    "一部のグループ ポリシーは利用できません。更新して再試行してください。",
  "Could not load user": "ユーザーをロードできませんでした",
  "Could not update user status": "ユーザーステータスを更新できませんでした",
  "Edit replication": "レプリケーションの編集",
  "Page not found": "ページが見つかりません",
  "Go to Buckets": "バケットへ",
  "Go back": "戻る",
  "Read the documentation": "ドキュメントを読む",
  "You do not have permission to view this page":
    "このページを閲覧する権限がありません",
  "Ask your administrator for access. This page checks the following IAM actions:":
    "管理者にアクセス権を依頼してください。このページでは、次の IAM アクションをチェックします。",
  "Required IAM actions": "必須の IAM アクション",
  "Encryption is not configured": "暗号化が設定されていません",
  "Configure KES or KMS on the SILO server to manage encryption keys in Console.":
    "コンソールで暗号化キーを管理するには、SILO サーバー上で KES または KMS を構成します。",
  "Local identity management is unavailable":
    "ローカル ID 管理は利用できません",
  "LDAP is enabled. Manage users and groups in your LDAP directory; connection settings are available on the LDAP configuration page.":
    "LDAP が有効になります。 LDAP ディレクトリ内のユーザーとグループを管理します。接続設定は、LDAP設定ページで利用できます。",
  "Tier creation is unavailable": "階層の作成は利用できません",
  "This Console requires a distributed server setup to add a remote storage tier.":
    "このコンソールでは、リモート ストレージ層を追加するために分散サーバーのセットアップが必要です。",
  "This page is unavailable in object browser mode":
    "このページはオブジェクト ブラウザ モードでは利用できません",
  "This Console is configured for object browsing only. Ask your administrator to enable the full Console to use this page.":
    "このコンソールはオブジェクトの閲覧専用に設定されています。完全なコンソールでこのページを使用できるようにするよう管理者に依頼してください。",
  "Prometheus is configured but unreachable":
    "Prometheus は構成されていますが、到達できません",
  "Check the Prometheus address, network access and authentication, then retry.":
    "Prometheus アドレス、ネットワーク アクセス、認証を確認して、再試行してください。",
  "Advanced metrics need Prometheus": "高度なメトリクスが必要です Prometheus",
  "Configure Prometheus to collect SILO metrics, then set the URL for your deployment and restart the corresponding service.":
    "SILO メトリクスを収集するように Prometheus を構成し、展開に URL を設定して、対応するサービスを再起動します。",
  "Standalone Console": "スタンドアロン コンソール",
  "Console embedded in SILO": "SILOに埋め込まれたコンソール",
  "Optional standalone settings": "オプションのスタンドアロン設定",
  "Bearer token: ": "無記名トークン:",
  "Or basic authentication: ": "または基本認証:",
  "Embedded settings: ": "埋め込み設定:",
  Icons: "アイコン",
  "Create bucket": "バケットを作成",
  "Edit {label}": "編集 {label}",
  "Calculating…": "計算中…",
  "The server has not finished computing usage yet.":
    "サーバーはまだコンピューティングの使用を終了していません。",
  "Calculated {time}": "計算済み {time}",
  "Updated {time}": "{time}更新しました",
  "Permission required": "許可が必要です",
  "Ask your administrator to grant the following IAM actions.":
    "次の IAM アクションを許可するよう管理者に依頼してください。",
  "More actions": "その他のアクション",
  "Equivalent mcli command": "同等の mcli コマンド",
  Copied: "コピーしました",
  "Copy failed. Select and copy the command.":
    "コピーに失敗しました。コマンドを選択してコピーします。",
  "Copy commands": "コマンドのコピー",
  "Replace ALIAS with your configured mcli alias (for example, {alias}).":
    "ALIAS を構成済みの mcli エイリアス (例: {alias}) に置き換えます。",
  "Replace ALIAS with your configured mcli alias.":
    "ALIAS を構成済みの mcli エイリアスに置き換えます。",
  "Loading…": "読み込み中…",
  "SILO primitives": "SILO プリミティブ",
  "Shared building blocks for storage, identity and monitoring.":
    "ストレージ、ID、監視のための共有構成要素。",
  "Healthy capacity": "健全な能力",
  "Capacity warning": "容量警告",
  "Above the 85% warning threshold": "85% 警告しきい値を超えています",
  "Capacity critical": "容量が重要です",
  "Above the 95% critical threshold": "95% の臨界しきい値を超えています",
  "Usage is calculated by the server.":
    "使用量はサーバーによって計算されます。",
  "View buckets": "バケットを表示",
  "Status and values": "ステータスと値",
  "Built-in": "内蔵",
  "Freshness and actions": "新鮮さと行動",
  "Select an object to inspect its details.":
    "オブジェクトを選択して、その詳細を確認します。",
  "Object details": "オブジェクトの詳細",
  "Demo action completed.": "デモアクションが完了しました。",
  "Select an object to download.": "ダウンロードするオブジェクトを選択します。",
  "Empty and unavailable states": "空の状態と利用できない状態",
  "No buckets yet": "バケットはまだありません",
  "Create a bucket to start storing objects.":
    "バケットを作成してオブジェクトの保存を開始します。",
  "No matching objects": "一致するオブジェクトがありません",
  "Try a different name or clear the search filter.":
    "別の名前を試すか、検索フィルターをクリアしてください。",
  "Metrics are unavailable": "指標が利用できません",
  "Connect a Prometheus endpoint to view monitoring metrics.":
    "Prometheus エンドポイントに接続して、監視メトリクスを表示します。",
  "Loading rows": "行をロードしています",
  "Command preview": "コマンドプレビュー",
  "Showing the first 1 MiB. Download the object to see the full file.":
    "最初の 1 MiB を表示しています。オブジェクトをダウンロードして完全なファイルを表示します。",
  "Showing first 500 rows": "最初の 500 行を表示しています",
  "Showing the first 100 columns. View Source or download the object to see all columns.":
    "最初の 100 列を表示しています。すべての列を表示するには、ソースを表示するか、オブジェクトをダウンロードします。",
  Rendered: "レンダリングされました",
  "Wrap lines": "折り返しライン",
  Row: "行",
  "CSV preview content": "CSV プレビューコンテンツ",
  "Markdown preview content": "マークダウン プレビュー コンテンツ",
  "Markdown rendering is unavailable for this content. Showing the source instead.":
    "このコンテンツではマークダウン レンダリングを使用できません。代わりにソースを表示します。",
  "Image: {alt}": "画像: {alt}",
  Image: "画像",
  Actions: "アクション",
  "Select version": "バージョンを選択してください",
  "This version is a delete marker.": "このバージョンは削除マーカーです。",
  "You need s3:GetObject permission.": "s3:GetObject の許可が必要です。",
  "You need s3:GetObjectVersion permission.":
    "s3:GetObjectVersion の許可が必要です。",
  "Preview is not available for this file type.":
    "このファイル タイプではプレビューを利用できません。",
  "Object Lock is not enabled on this bucket.":
    "このバケットではオブジェクトロックが有効になっていません。",
  "You need s3:PutObjectLegalHold permission.":
    "s3:PutObjectLegalHold の許可が必要です。",
  "You need s3:PutObjectRetention permission.":
    "s3:PutObjectRetention の許可が必要です。",
  "Tags can only be changed on the current version.":
    "タグは現在のバージョンでのみ変更できます。",
  "Versioning is not enabled on this bucket.":
    "このバケットではバージョニングが有効になっていません。",
  "Select one or more objects first.":
    "まず 1 つ以上のオブジェクトを選択します。",
  "Select a single object first.": "最初に単一のオブジェクトを選択します。",
  "Select a file instead of a folder.":
    "フォルダーの代わりにファイルを選択してください。",
  "Select a folder to change anonymous access.":
    "匿名アクセスを変更するフォルダーを選択してください。",
  "Open the current object to use this action.":
    "このアクションを使用するには、現在のオブジェクトを開いてください。",
  "This action requires a distributed server.":
    "このアクションには分散サーバーが必要です。",
  "You need s3:PutObjectTagging permission.":
    "s3:PutObjectTagging の許可が必要です。",
  "You need admin:InspectData permission.":
    "admin:InspectData 権限が必要です。",
  "You need permission to view object versions.":
    "オブジェクトのバージョンを表示するには権限が必要です。",
  "You need s3:DeleteObject permission.": "s3:DeleteObject の許可が必要です。",
  "You need permission to change the bucket policy.":
    "バケットポリシーを変更するには権限が必要です。",
  "You need permission to read objects and bucket versioning.":
    "オブジェクトとバケットのバージョン管理を読み取る権限が必要です。",
  "You need s3:ListBucket permission.": "s3:ListBucket の許可が必要です。",
  "You need permission to restore this version.":
    "このバージョンを復元するには許可が必要です。",
  "You need permission to select this version.":
    "このバージョンを選択するには許可が必要です。",
  "You need permission to delete object versions.":
    "オブジェクトのバージョンを削除する権限が必要です。",
  "Exit rewind mode to refresh the object list.":
    "巻き戻しモードを終了してオブジェクトリストを更新します。",
  "There are no non-current versions to delete.":
    "削除できる現行以外のバージョンはありません。",
  "Invalid Endpoint": "無効なエンドポイント",
  Broker: "ブローカー",
  QOS: "QOS",
  "Client ID": "クライアント ID",
  "Client Secret": "クライアントシークレット",
  "Redirect URI": "リダイレクト URI",
  "Lookup Bind DN": "ルックアップバインド DN",
  "Lookup Bind Password": "バインドパスワードの検索",
  "User DN Search Base": "ユーザー DN 検索ベース",
  "User DN Search Filter": "ユーザー DN 検索フィルター",
  "Group Search Base DN": "グループ検索ベース DN",
  "Group Search Filter": "グループ検索フィルター",
  "Sign Out": "ログアウト",
  "Remove transfer": "転送を削除",
  "Cancel transfer": "転送をキャンセル",
  "This download has already started. Dismiss its transfer entry to start it again.":
    "このダウンロードはすでに開始されています。転送エントリを破棄して、再度開始します。",
  "Track or cancel this download in your browser's download manager.":
    "ブラウザのダウンロード マネージャーでこのダウンロードを追跡またはキャンセルしてください。",
  "For selections above 5 GiB or of unknown size, MCLI is recommended. This ZIP will stream without buffering in memory.":
    "5 GiB を超える選択、またはサイズが不明な場合は、MCLI が推奨されます。この ZIP はメモリにバッファリングせずにストリーミングします。",
  "Set lifecycle": "ライフサイクルを設定する",
  "Set replication": "レプリケーションの設定",
  "Refresh buckets": "バケットを更新",
  "Close details": "詳細を閉じる",
  "Copy share URL": "コピーシェア URL",
  "Select multiple versions": "複数のバージョンを選択してください",
  "Delete selected versions": "選択したバージョンを削除",
  "Delete non-current versions": "現行以外のバージョンを削除",
  "Copy code": "コードをコピー",
  "Delete group": "グループを削除",
  "Refresh list": "リストを更新",
  "Copy path": "パスをコピー",
  "Delete user": "ユーザーを削除",
  "Change password": "パスワードを変更する",
  "Copy {label}": "コピー {label}",
  "Add site": "サイトを追加",
  "Remove site": "サイトを削除",
  "Delete selected users": "選択したユーザーを削除します",
  "View All": "すべて見る",
  "Deployment ID:": "導入 ID:",
  "Request ID:": "リクエストID:",
  "Remote host:": "リモートホスト:",
  "User agent:": "ユーザーエージェント:",
  "Backtrace:": "バックトレース:",
  "Time:": "時間:",
  "API:": "API:",
  "Not available": "利用できません",
  " and ": "と",
  "'namespace' reflects current bucket/object list and 'access' reflects a journal of object operations, defaults to 'namespace'":
    "「namespace」は現在のバケット/オブジェクトのリストを反映し、「access」はオブジェクト操作のジャーナルを反映します。デフォルトは「namespace」です。",
  "{compliance} lock protects Objects from write operations by all users, including the SILO root user.":
    "{compliance} ロックは、SILO の root ユーザーを含むすべてのユーザーによる書き込み操作からオブジェクトを保護します。",
  "{count} days": {
    other: "{count} 日",
  },
  "{count} Entities Found": "{count} エンティティが見つかりました",
  "{count} Entity Found": "{count} エンティティが見つかりました",
  "{count} Version": "{count} バージョン",
  "{count} version, {size}": "{count} バージョン、{size}",
  "{count} versions": {
    other: "{count} バージョン",
  },
  "{count} Versions": {
    other: "{count} バージョン",
  },
  "{count} versions, {size}": "{count} バージョン、{size}",
  "{custom} policy can be written to define which accounts are authorized to access this Bucket":
    "{custom} ポリシーを作成して、このバケットへのアクセスを許可されるアカウントを定義できます",
  "{entity} not available": "{entity} 利用できません",
  "{entity} will be available until:":
    "{entity} は次の期間まで利用可能です:\nこのオプションが有効になっている場合、",
  "{excludeFolders} options will not be available if this option is enabled.":
    "{excludeFolders} オプションは使用できません。",
  "{file} - Versions": "{file} - バージョン",
  "{governance} lock protects Objects from write operations by non-privileged users.":
    "{governance} ロックは、権限のないユーザーによる書き込み操作からオブジェクトを保護します。",
  "{label} copied to clipboard": "{label} クリップボードにコピーされました",
  "{minio} is a registered trademark of MinIO, Inc. {silo} is not a MinIO, Inc. product, and is not affiliated with, sponsored by, or endorsed by MinIO, Inc.":
    "{minio} は、MinIO, Inc. の登録商標です。 {silo} は、MinIO, Inc. の製品ではなく、MinIO, Inc. と提携、スポンサー、または承認されていません。",
  "{object} Versions": "{object} バージョン",
  "{objectLocking} prevents objects from being deleted. Required to support retention and legal hold. Can only be enabled at bucket creation.":
    "{objectLocking} はオブジェクトの削除を防ぎます。保持期間とリーガルホールドに必要です。バケット作成時にのみ有効にできます。",
  "{private} policy limits access to credentialled accounts with appropriate permissions":
    "{private} ポリシーは、適切な権限を持つ認証済みアカウントへのアクセスを制限します",
  "{provider} - Add Tier Configuration": "{provider} - 階層構成の追加",
  "{public} policy anyone will be able to upload, download and delete files from this Bucket once logged in":
    "{public} ポリシーでは、ログインした誰もがこのバケットのファイルをアップロード、ダウンロード、削除できます",
  "{quota} limits the amount of data in the bucket.":
    "{quota} はバケット内のデータ量を制限します。",
  "{retention} imposes rules to prevent object deletion for a period of time. Versioning must be enabled in order to set bucket retention policies.":
    "{retention} は一定期間オブジェクトの削除を防ぐルールを設定します。バケットの保持ポリシーを設定するにはバージョニングを有効にする必要があります。",
  "{service} which is {status}": "{service} つまり {status}",
  "{silo} is an independently maintained continuation of the {minio} object storage project, carried forward by the {pigsty} community since 2026. Its {code} {incorporates} {upstream}, and the complete work remains licensed under the {agpl}.":
    "{silo} は、{minio} オブジェクト ストレージ プロジェクトの継続として独立して維持されており、2026 年から {pigsty} コミュニティによって進められています。その {code} {incorporates} {upstream} であり、完全な作業は引き続き {agpl} に基づいてライセンスされています。",
  "{target} Event Destination": "{target} イベントの目的地",
  "{time} ago": "{time} 前",
  "{type}: {name} not found.": "{type}: {name} が見つかりません。",
  "{versioning} allows to keep multiple versions of the same object under the same key.":
    "{versioning} を使用すると、同じオブジェクトの複数のバージョンを同じキーの下に保持できます。",
  "* Warning: With Public access anyone will be able to upload, download and delete files from this Bucket *":
    "* 警告：公開アクセスでは、誰でもこのバケットのファイルをアップロード、ダウンロード、削除できます *",
  "# Associated Access Keys": "# 関連付けられたアクセスキー",
  "© 2026 Ruohang Feng / PGSTY and the SILO contributors.":
    "© 2026 Ruohang Feng / PGSTY および SILO の寄稿者。",
  "<Day>": "<Day>",
  "<Month>": "<Month>",
  "<Year>": "<Year>",
  "A bucket can only be deleted if it's empty.":
    "空のバケットのみ削除できます。",
  "A group can have one attached IAM policy, where all users with membership in that group inherit that policy. Groups support more simplified management of user permissions on the SILO Tenant.":
    "グループには 1 つの IAM ポリシーをアタッチできます。そのグループのメンバーシップを持つすべてのユーザーがそのポリシーを継承します。グループは、SILO テナントのユーザー権限のより簡素化された管理をサポートします。",
  "A network error occurred.": "ネットワークエラーが発生しました。",
  "A new {entity} has been created with the following details:":
    "次の詳細を含む新しい {entity} が作成されました:",
  "A SILO user consists of a unique access key (username) and corresponding secret key (password). Clients must authenticate their identity by specifying both a valid access key (username) and the corresponding secret key (password) of an existing SILO user.":
    "SILO ユーザーは、一意のアクセス キー (ユーザー名) と、対応する秘密キー (パスワード) で構成されます。クライアントは、既存の SILO ユーザーの有効なアクセス キー (ユーザー名) と対応する秘密キー (パスワード) の両方を指定して、アイデンティティを認証する必要があります。",
  "A user can be a member of multiple groups.":
    "ユーザーは複数のグループのメンバーになることができます。",
  "About Site Replication": "サイトレプリケーションについて",
  Access: "アクセス",
  "Access Audit": "アクセス監査",
  "Access Key": "アクセスキー",
  "Access Key and Secret Key should be same on the new site/endpoint.":
    "アクセス キーと秘密キーは、新しいサイト/エンドポイントで同じである必要があります。",
  "Access Key Policy": "アクセスキーポリシー",
  "Access Key details - {name}": "アクセスキーの詳細 - {name}",
  "Access keys deleted successfully.": "アクセスキーは正常に削除されました。",
  "Access Keys deleted successfully.": "アクセス キーが正常に削除されました。",
  "Access Keys inherit the policies explicitly attached to the parent user, and the policies attached to each group in which the parent user has membership.":
    "アクセス キーは、親ユーザーに明示的にアタッチされたポリシー、および親ユーザーがメンバーシップを持つ各グループにアタッチされたポリシーを継承します。",
  "Access Keys support programmatic access by applications. You cannot use a Access Key to log into the SILO Console.":
    "アクセス キーは、アプリケーションによるプログラムによるアクセスをサポートします。アクセス キーを使用して SILO コンソールにログインすることはできません。",
  "Access Policy": "アクセスポリシー",
  "Access Policy:": "アクセスポリシー:",
  "Access Rule added successfully": "アクセス ルールが正常に追加されました",
  "Access Rules": "アクセスルール",
  "AccessKey is required": "AccessKeyは必須です",
  "Account Key": "アカウントキー",
  "Account Name": "アカウント名",
  Active: "アクティブ",
  "Active for": "活動期間",
  'AD/LDAP server address e.g. "myldapserver.com:636"':
    "AD/LDAP サーバーアドレス 例: 「myldapserver.com:636」",
  "Add a Row": "行を追加",
  "Add Access Rule": "アクセス ルールを追加",
  "Add Anonymous Access Rule": "匿名アクセス ルールを追加",
  "Add Bucket Replication Rule - {bucket}":
    "バケットレプリケーションルールの追加 - {bucket}",
  "Add Event Destination": "イベントの目的地を追加",
  "Add key": "キーを追加",
  "Add Lifecycle Rule": "ライフサイクル ルールを追加",
  "Add Members": "メンバーを追加",
  "Add New Tag": "新しいタグを追加",
  "Add New Tag ": "新しいタグを追加",
  "Add new Webhook": "新規追加 Webhook",
  "Add Replication Rule": "レプリケーションルールの追加",
  "Add Replication Site": "レプリケーションサイトを追加",
  "Add Replication Sites": "レプリケーションサイトを追加",
  "Add Sites": "サイトを追加",
  "Add Sites for Replication": "レプリケーション用のサイトを追加",
  "Add tag": "タグを追加",
  "Add Tier": "階層を追加",
  "Add to Group": "グループに追加",
  "Add to Groups": "グループに追加",
  "Add Users to Group": "ユーザーをグループに追加",
  "add users to groups": "ユーザーをグループに追加",
  "Adding groups lets you assign IAM policies to multiple users at once.":
    "グループを追加すると、IAM ポリシーを複数のユーザーに一度に割り当てることができます。",
  Address: "住所",
  After: "後",
  All: "すべて",
  "All Log Types": "すべてのログタイプ",
  "All Nodes": "すべてのノード",
  "All sites must be using the same external IDP(s) if any.":
    "すべてのサイトは、同じ外部 IDP (ある場合) を使用する必要があります。",
  "All sites must have the same deployment credentials (i.e. MINIO_ROOT_USER, MINIO_ROOT_PASSWORD).":
    "すべてのサイトは同じ展開資格情報 (つまり、MINIO_ROOT_USER、MINIO_ROOT_PASSWORD) を持っている必要があります。",
  "All User Agents": "すべてのユーザーエージェント",
  "Amazon Resource Name": "Amazon リソースネーム",
  "AMQP exchange type": "AMQP交換タイプ",
  "AMQP server endpoint e.g. `amqp://myuser:mypassword@localhost:5672`":
    "AMQP サーバーエンドポイント 例: `amqp://myuser:mypassword@localhost:5672`",
  "An error occurred": "エラーが発生しました",
  "An error occurred while getting the Health Report file.":
    "ヘルスレポートファイルの取得中にエラーが発生しました。",
  "An error occurred while uploading the file.":
    "ファイルのアップロード中にエラーが発生しました。",
  "An error occurred while uploading the files.":
    "ファイルのアップロード中にエラーが発生しました。",
  "An unknown error occurred. Please refer to Console logs to get more information.":
    "不明なエラーが発生しました。詳細については、コンソール ログを参照してください。",
  Anonymous: "匿名",
  "Anonymous Access": "匿名アクセス",
  "API Name": "API 名前",
  "API Requests": "API リクエスト",
  Application: "アプリケーション",
  "apply policies to Groups": "グループにポリシーを適用する",
  April: "4月",
  "Are you sure you want to continue?": "続行してもよろしいですか?",
  "Are you sure you want to delete Access Key {name}?":
    "アクセスキー {name} を削除してもよろしいですか？",
  "Are you sure you want to delete all the non-current versions for: {object}?":
    "{object} の現行以外のすべてのバージョンを削除してもよろしいですか？",
  "Are you sure you want to delete bucket {bucket}?":
    "バケット {bucket} を削除してもよろしいですか？",
  "Are you sure you want to delete IDP {name} configuration?":
    "ID プロバイダー {name} の設定を削除してもよろしいですか？",
  "Are you sure you want to delete policy {name}?":
    "ポリシー {name} を削除してもよろしいですか？",
  "Are you sure you want to delete replication rule {rule}?":
    "レプリケーションルール {rule} を削除してもよろしいですか？",
  "Are you sure you want to delete the {rule} rule?":
    "ルール {rule} を削除してもよろしいですか？",
  "Are you sure you want to delete the Configured Endpoint {name}?":
    "設定済みエンドポイント {name} を削除してもよろしいですか？",
  "Are you sure you want to delete the event destination ?":
    "イベント宛先を削除してもよろしいですか?",
  "Are you sure you want to delete the following {count} groups?":
    "次の {count} 個のグループを削除してもよろしいですか？",
  "Are you sure you want to delete the following {count} users?":
    "次の {count} 人のユーザーを削除してもよろしいですか？",
  "Are you sure you want to delete the following group?":
    "次のグループを削除してもよろしいですか？",
  "Are you sure you want to delete the following user?":
    "次のユーザーを削除してもよろしいですか？",
  "Are you sure you want to delete the selected {count} Access Keys?":
    "選択した {count} 個のアクセスキーを削除してもよろしいですか？",
  "Are you sure you want to delete the selected {count} objects?":
    "選択した {count} 個のオブジェクトを削除してもよろしいですか？",
  "Are you sure you want to delete the selected {count} versions for {object}?":
    "{object} の選択した {count} 個のバージョンを削除してもよろしいですか？",
  "Are you sure you want to delete the tag {tag} ?":
    "タグ {tag} を削除してもよろしいですか?",
  "Are you sure you want to delete the tag {tag}?":
    "タグ {tag} を削除してもよろしいですか？",
  "Are you sure you want to delete the tier {name}?":
    "ストレージ階層 {name} を削除してもよろしいですか？",
  "Are you sure you want to delete this access rule?":
    "このアクセスルールを削除してもよろしいですか？",
  "Are you sure you want to delete this event?":
    "このイベントを削除してもよろしいですか?",
  "Are you sure you want to delete:": "削除してもよろしいですか:",
  "Are you sure you want to remove all the replication sites?.":
    "すべてのレプリケーション サイトを削除してもよろしいですか?",
  "Are you sure you want to remove the replication site: {name}?":
    "レプリケーション サイト {name} を削除してもよろしいですか?",
  "Are you sure you want to remove the selected replication rules for bucket {bucket}?":
    "バケット {bucket} に対して選択したレプリケーション ルールを削除してもよろしいですか?",
  "Are you sure you want to reset the Default {name}?":
    "デフォルト {name} にリセットしてもよろしいですか?",
  "Are you sure you want to restore {object} with Version ID: {version}?":
    "バージョン ID: {version} で {object} を復元してもよろしいですか?",
  "Are you sure you want to restore these configurations to default values?":
    "これらの設定をデフォルト値に戻してもよろしいですか?",
  "Assign Access Policies": "アクセスポリシーの割り当て",
  "Assign Custom Credentials": "カスタム認証情報の割り当て",
  "Assign Custom IAM Policies for Group":
    "グループにカスタム IAM ポリシーを割り当てる",
  "Assign groups": "グループを割り当てる",
  "Assign Groups": "グループの割り当て",
  "assign policies": "ポリシーを割り当てる",
  "assign Policies": "ポリシーを割り当てる",
  "Assign Policies": "ポリシーの割り当て",
  "Assign Policy": "ポリシーの割り当て",
  "Assign Users": "ユーザーの割り当て",
  Asynchronous: "非同期",
  "Audit Kafka": "監査 Kafka",
  "Audit Webhook": "監査 Webhook",
  August: "8月",
  "Auth Token": "認証トークン",
  "Auto delete queue when set to 'on', when there are no consumers":
    "「オン」に設定すると、コンシューマーがいないときにキューを自動削除します",
  "Auto Deleted": "自動削除されました",
  "Available Capacity": "利用可能な容量",
  Back: "戻る",
  Backend: "バックエンド",
  Bandwidth: "帯域幅",
  "Enter a non-negative bandwidth below 8 PiB/s, with at most two decimals (0 means unlimited).":
    "8 PiB/s 未満の負でない帯域幅を小数点以下 2 桁以内で入力します (0 は無制限を意味します)。",
  "Bitrot Scan": "ビットロットスキャン",
  Brokers: "ブローカー",
  "Browse Bucket": "バケットを参照",
  Bucket: "バケット",
  "Bucket Assignments": "バケットの割り当て",
  "Bucket Encryption configuration": "バケット暗号化構成",
  "Bucket lifecycle (ILM) configuration": "バケットのライフサイクル (ILM) 構成",
  "Bucket Name": "バケット名",
  "Bucket names can consist only of lowercase letters, numbers, dots (.), and hyphens (-).":
    "バケット名には、小文字、数字、ドット (.)、およびハイフン (-) のみを使用できます。",
  "Bucket names must be between 3 (min) and 63 (max) characters long.":
    "バケット名の長さは 3 (最小) ～ 63 (最大) 文字にする必要があります。",
  "Bucket names must be unique within a partition.":
    "バケット名はパーティション内で一意である必要があります。",
  "Bucket names must not be formatted as an IP address (for example, 192.168.5.4).":
    "バケット名は、IP アドレス (たとえば、192.168.5.4) としてフォーマットされてはなりません。",
  "Bucket names must not contain two adjacent periods, or a period adjacent to a hyphen.":
    "バケット名には、隣接する 2 つのピリオドや、ハイフンに隣接するピリオドを含めることはできません。",
  "Bucket names must not end with the suffix -s3alias. This suffix is reserved for access point alias names.":
    "バケット名はサフィックス -s3alias で終わってはなりません。このサフィックスは、アクセス ポイントのエイリアス名用に予約されています。",
  "Bucket names must not start with the prefix xn--.":
    "バケット名は接頭辞 xn-- で始まってはなりません。",
  "Bucket notification configuration": "バケット通知設定",
  "bucket notifications": "バケット通知",
  "Bucket Object-Lock configurations": "バケット Object-Lock 構成",
  "Bucket Policies": "バケットポリシー",
  "Bucket Replication Configuration": "バケットレプリケーション構成",
  "Bucket Tags": "バケットタグ",
  "bucket-default": "バケットのデフォルト",
  "Buckets Results": "バケットの結果",
  "Buckets:": "バケット:",
  "Bypass Governance Mode": "ガバナンスモードを回避",
  Bytes: "バイト",
  "Calls to Trace": "追跡のための電話",
  Cancelled: "キャンセルされました",
  "Cannot delete currently logged in user":
    "現在ログインしているユーザーを削除できません",
  "Cannot delete currently logged in user {user}":
    "ログイン中のユーザー {user} は削除できません",
  "Cert Authority": "認証局",
  "Change Access Policy": "アクセスポリシーの変更",
  "Change Legal Hold rules for this File":
    "このファイルのリーガルホールドを変更",
  "Change Password": "パスワードを変更する",
  "Change Password for {user}": "{user}のパスワードを変更",
  "Change password for: {user}": "パスワードを変更: {user}",
  "Change Retention rules for this File": "このファイルの保持ルールを変更",
  "Change Tags for this File": "このファイルのタグを変更します",
  "Change User Password": "ユーザーパスワードの変更",
  "Changes to Bucket features such as": "以下のようなバケット機能の変更",
  "Choose or create a new path": "新しいパスを選択または作成します",
  "Claim from which SILO will read the policy or role to use":
    "SILO が使用するポリシーまたはロールを読み取るクレーム",
  "Claim Name": "請求名",
  "Claim Prefix": "クレームプレフィックス",
  "Claim User Info": "ユーザー情報を要求する",
  Clear: "クリア",
  "Click on a user to view the full listing of associated Access Keys. All Access Keys associated with a user will be deleted along with the user.":
    "ユーザーをクリックすると、関連付けられたアクセス キーの完全なリストが表示されます。ユーザーに関連付けられているすべてのアクセス キーは、ユーザーとともに削除されます。",
  client: "クライアント",
  "Client Auth determines the Kafka server's policy for TLS client authorization":
    "クライアント認証は、TLS クライアント認証に対する Kafka サーバーのポリシーを決定します",
  "Client Cert": "クライアント証明書",
  "Client cert for mTLS authentication": "mTLS 認証用のクライアント証明書",
  "Client cert for NATS mTLS auth": "NATS mTLS 認証のクライアント証明書",
  "Client Cert Key": "クライアント証明書キー",
  "Client cert key for mTLS authentication":
    "mTLS 認証用のクライアント証明書キー",
  "Client cert key for NATS mTLS authorization":
    "NATS mTLS 認証用のクライアント証明書キー",
  "Client ID is required": "クライアント ID は必須です",
  "Client Key": "クライアントキー",
  "Client ping commands interval in s,m,h,d. Disabled by default":
    "クライアントの ping コマンドの間隔 (s、m、h、d)。デフォルトでは無効になっています",
  "Client Secret is required": "クライアント シークレットが必要です",
  "Client Secret must be re-entered to change OpenID configurations":
    "OpenID 構成を変更するには、クライアント シークレットを再入力する必要があります",
  "client TLS cert": "クライアント TLS 証明書",
  "client TLS key": "クライアント TLS キー",
  "ClientAuth determines the Kafka server's policy for TLS client authorization":
    "ClientAuth は、TLS クライアント認証に対する Kafka サーバーのポリシーを決定します",
  "Cluster Health Report will be generated, you will be able to download the JSON File.":
    "クラスター健全性レポートが生成され、JSON ファイルをダウンロードできるようになります。",
  code: "コード",
  "Comma separated list of Kafka broker addresses":
    "Kafka ブローカーアドレスのカンマ区切りリスト",
  Comment: "コメント",
  Comments: "コメント",
  Compliance: "コンプライアンス",
  Compression: "圧縮",
  "Concurrent:": "同時:",
  Config: "構成",
  "Config Name is required": "構成名は必須です",
  "Config URL": "構成 URL",
  "Config URL for identity provider configuration":
    "ID プロバイダー構成の構成 URL",
  "Config URL is required": "構成 URL が必要です",
  "Configuration cannot be disabled / enabled in this module as LDAP environment variables are set for this SILO instance.":
    "この SILO インスタンスには LDAP 環境変数が設定されているため、このモジュールで構成を無効または有効にすることはできません。",
  "Configuration cannot be disabled / enabled in this module as OpenID environment variables are set for this SILO instance.":
    "この SILO インスタンスには OpenID 環境変数が設定されているため、このモジュールで構成を無効または有効にすることはできません。",
  "Configuration cannot be edited in this module as LDAP environment variables are set for this SILO instance.":
    "LDAP 環境変数がこの SILO インスタンスに設定されているため、このモジュールでは構成を編集できません。",
  "Configuration cannot be edited in this module as OpenID environment variables are set for this SILO instance.":
    "OpenID 環境変数がこの SILO インスタンスに設定されているため、このモジュールでは構成を編集できません。",
  "Configuration saved successfully": "構成は正常に保存されました",
  "Configure a {remoteTier} to receive transitioned Objects":
    "遷移されたオブジェクトを受信するように {remoteTier} を構成します",
  "Configure Bucket": "バケットの構成",
  "Configuring an external IDP enables Single-Sign On workflows, where applications authenticate against the external IDP before accessing SILO.":
    "外部 IDP を構成すると、アプリケーションが SILO にアクセスする前に外部 IDP に対して認証されるシングル サインオン ワークフローが有効になります。",
  "Confirm Dialogs": "確認ダイアログ",
  "connected server": "接続サーバー",
  "Connection String": "接続文字列",
  "Console Credentials": "コンソールの認証情報",
  "Console LICENSE": "コンソール LICENSE",
  "Console portions © Georg Mangold and contributors.":
    "コンソール部分 © Georg Mangold および寄稿者。",
  "Console predecessor": "コンソールの前身",
  "Copy to Clipboard": "クリップボードにコピー",
  Copyright: "著作権",
  "Coredns Path": "コレドンス・パス",
  "Cors Allow Origin": "Cors は原点を許可します",
  "Could not process drag and drop.":
    "ドラッグ アンド ドロップを処理できませんでした。",
  "CPU Info": "CPU 情報",
  "Create {idpType} configuration": "{idpType} 構成を作成します",
  "create a bucket": "バケットを作成する",
  "Create a new cryptographic key in the Key Management Service server connected to SILO.":
    "SILOに接続されている鍵管理サービスサーバーに新しい暗号鍵を作成します。",
  "create a new path": "新しいパスを作成します",
  "create a Policy": "ポリシーを作成する",
  "Create access key": "アクセスキーの作成",
  "Create Access Key": "アクセスキーの作成",
  "Create Access Key for {user}": "{user}のアクセスキーを作成",
  "Create Access Keys": "アクセスキーを作成する",
  "Create Configuration": "構成の作成",
  "Create Configurations": "構成の作成",
  "Create Group": "グループの作成",
  "Create Key": "キーの作成",
  "Create new path": "新しいパスを作成",
  "Create OpenID Configuration": "OpenID 構成の作成",
  "Create Policies": "ポリシーの作成",
  "Create Policy": "ポリシーの作成",
  "Create Rules": "ルールを作成する",
  "Create Tier": "階層の作成",
  "Create User": "ユーザーの作成",
  "create users": "ユーザーを作成する",
  "Create Users": "ユーザーの作成",
  "Created At": "作成日",
  "Created By": "作成者:",
  "Creation and deletion of all IAM users, groups, policies and their mappings to users or groups":
    "すべての IAM ユーザー、グループ、ポリシー、およびそれらのユーザーまたはグループへのマッピングの作成と削除",
  "Creation and deletion of buckets and objects":
    "バケットとオブジェクトの作成と削除",
  "Creation and deletion of service accounts (except those owned by the root user)":
    "サービスアカウントの作成と削除 (root ユーザーが所有するものを除く)",
  "Creation of STS credentials": "STS 認証情報の作成",
  Credentials: "認証情報",
  current: "現在",
  Current: "現在",
  "Current Endpoint:": "現在のエンドポイント:",
  "Current Password": "現在のパスワード",
  "Current Path:": "現在のパス:",
  "Current Policy": "現在のポリシー",
  "Current Status": "現在の状況",
  "Current Status:": "現在のステータス:",
  "Current Tags:": "現在のタグ:",
  "Current User Policy - edit the JSON to remove permissions for this Access Key":
    "現在のユーザー ポリシー - JSON を編集して、このアクセス キーの権限を削除します",
  "Current Version": "現在のバージョン",
  "CURRENT VERSION": "CURRENT VERSION",
  "Currently Configured Endpoints": "現在構成されているエンドポイント",
  custom: "カスタム",
  Custom: "カスタム",
  Cycle: "サイクル",
  Database: "データベース",
  Date: "日付",
  day: "日",
  days: {
    other: "日",
  },
  Days: "日",
  "DB table name to store/update events, table is auto-created":
    "DB イベントを保存/更新するテーブル名、テーブルは自動作成されます",
  December: "12月",
  Default: "デフォルト",
  "Default Key ID:": "デフォルトキー ID:",
  "Define which actions are permitted on a specified resource.":
    "指定したリソースに対してどのアクションを許可するかを定義します。",
  "Delay Multiplier": "遅延乗数",
  "DELETE - Object Deleted": "DELETE - オブジェクトが削除されました",
  "Delete {name}": "{name}を削除",
  "Delete Access Key": "アクセスキーを削除",
  "Delete Access Keys": "アクセスキーを削除する",
  "Delete All": "すべて削除",
  "Delete All Versions": "すべてのバージョンを削除",
  "Delete Anonymous Access Rule": "匿名アクセス ルールを削除",
  "Delete Bucket": "バケットを削除",
  "Delete Configuration": "構成の削除",
  "Delete Endpoint": "エンドポイントの削除",
  "Delete Event": "イベントを削除",
  "Delete Group": "グループを削除",
  "delete Groups": "グループを削除",
  "Delete Groups": "グループの削除",
  "Delete Lifecycle Rule": "ライフサイクル ルールの削除",
  "Delete Marker": "削除マーカー",
  "Delete Non-Current versions": "非現行バージョンを削除",
  "Delete Object": "オブジェクトの削除",
  "Delete Objects": "オブジェクトの削除",
  "delete Policies": "ポリシーを削除",
  "Delete Policy": "ポリシーの削除",
  "Delete Replication Rule": "レプリケーション ルールの削除",
  "Delete Replication Site": "レプリケーションサイトを削除",
  "Delete Selected": "選択したものを削除",
  "Delete Selected Files": "選択したファイルを削除",
  "Delete Selected Replication Rules":
    "選択したレプリケーション ルールを削除します",
  "Delete Selected Versions": "選択したバージョンを削除",
  "Delete Site": "サイトを削除",
  "Delete Tag": "タグを削除",
  "Delete Tier": "階層を削除",
  "delete user": "ユーザーを削除",
  "Delete User": "ユーザーを削除",
  "delete users": "ユーザーを削除",
  "Delete Users": "ユーザーの削除",
  "Delete version": "バージョンを削除",
  "Delete Webhook": "Webhookを削除",
  Deleted: "削除されました",
  DELETED: "DELETED",
  Deletes: "削除",
  "Delivery Mode": "配信モード",
  Description: "説明",
  Destination: "目的地",
  "Detailed Results:": "詳細な結果:",
  Disable: "無効化",
  "Disable LDAP": "LDAPを無効にする",
  "Disable SSL certificate verification ": "SSL 証明書検証を無効にする",
  "disable users": "ユーザーを無効にする",
  Disabled: "無効",
  "Display Name": "表示名",
  "Display Object Versions": "オブジェクトのバージョンを表示",
  "Display only Errors": "エラーのみを表示",
  "Display Versions for this file": "このファイルのバージョンを表示します",
  "No object versions are available":
    "利用可能なオブジェクトのバージョンはありません",
  "Distributed Mode": "分散モード",
  "DN (Distinguished Name) for LDAP read-only service account used to perform DN and group lookups":
    "DN およびグループ検索の実行に使用される LDAP 読み取り専用サービス アカウントの DN (識別名)",
  documentation: "ドキュメント",
  Done: "完了",
  "Download all access credentials":
    "すべてのアクセス認証情報をダウンロードする",
  "Download all access credentials to a JSON file. NOTE: This file is not formatted for import using mc alias import. If you plan to import this alias from the file, please use the Download for Import button. ":
    "すべてのアクセス認証情報を JSON ファイルとしてダウンロードします。注意：このファイルは mc alias import 用の形式ではありません。エイリアスをファイルからインポートする場合は「インポート用にダウンロード」を使用してください。",
  "Download as CSV": "CSV としてダウンロード",
  "Download as PNG": "PNG としてダウンロード",
  "Download credentials in a JSON file formatted for import using mc alias import. This will only include the default login credentials.":
    "mc alias import で読み込める JSON ファイルとして認証情報をダウンロードします。デフォルトのログイン認証情報のみが含まれます。",
  "Download File": "ファイルをダウンロード",
  "Download for import": "インポート用にダウンロード",
  "Download JSON": "ダウンロード JSON",
  "Download of multiple files failed.":
    "複数のファイルのダウンロードに失敗しました。",
  "Download Results": "ダウンロード結果",
  "Download Selected": "ダウンロードが選択されました",
  "Download selected objects as Zip. Any Deleted objects in the selection would be skipped from download.":
    "選択したオブジェクトを Zip としてダウンロードします。選択範囲内の削除されたオブジェクトはダウンロードからスキップされます。",
  "Download this Object": "このオブジェクトをダウンロード",
  "Download this version": "このバージョンをダウンロード",
  "Download widget data": "ウィジェットデータをダウンロード",
  "Downloads / Uploads": "ダウンロード / アップロード",
  "Drives Partitions Info": "ドライブのパーティション情報",
  "Drives:": "ドライブ:",
  "DSN String": "DSN 文字列",
  Durable: "耐久性",
  Duration: "期間",
  "During the speed test all your production traffic will be temporarily suspended.":
    "速度テスト中は、すべての実稼働トラフィックが一時的に停止されます。",
  "e.g. 503": "例: 503",
  "e.g. FunctionName2055": "例:関数名2055",
  "e.g. Method 2056": "例:メソッド 2056",
  "e.g. my-bucket/my-prefix/*": "例:私のバケット/私のプレフィックス/*",
  "e.g. us-west-rack-2": "例: us-west-rack-2",
  "Each user can access only those resources and operations which are explicitly granted by the built-in role. SILO denies access to any other resource or action by default.":
    "各ユーザーは、組み込みロールによって明示的に付与されたリソースと操作のみにアクセスできます。 SILO は、デフォルトで他のリソースまたはアクションへのアクセスを拒否します。",
  Edit: "編集",
  "edit a Policy": "ポリシーを編集する",
  "Edit Anonymous Access Rule for {target}":
    "{target} の匿名アクセス ルールを編集",
  "Edit Audit Webhook": "監査の編集 Webhook",
  "Edit Bucket Replication": "バケットのレプリケーションの編集",
  "Edit Configuration": "構成の編集",
  "Edit details of - {name}": "の詳細を編集 - {name}",
  "Edit Endpoint": "エンドポイントの編集",
  "edit Group membership": "グループメンバーシップを編集",
  "Edit Lifecycle Configuration": "ライフサイクル構成の編集",
  "Edit Logger Webhook": "ロガー編集 Webhook",
  "Edit Members": "メンバーを編集",
  "Edit Replication Endpoint": "レプリケーションエンドポイントの編集",
  "Edit Tags": "タグを編集",
  "Edit the Default Audit Webhook": "デフォルトの監査を編集します Webhook",
  "Edit the Default Logger Webhook": "デフォルトのロガーを編集します Webhook",
  "Edit Webhook": "編集 Webhook",
  "Effect:": "効果:",
  "Elasticsearch index to store/update events, index is auto-created":
    "Elasticsearch イベントを保存/更新するためのインデックス、インデックスは自動作成されます",
  "Elasticsearch server's address, with optional authentication info":
    "Elasticsearch サーバーのアドレス、オプションの認証情報付き",
  Enable: "有効化",
  "Enable audit_kafka target": "Audit_kafka ターゲットを有効にする",
  "Enable Bucket Encryption": "バケット暗号化を有効にする",
  "Enable Bucket Quota": "バケットクォータを有効にする",
  "Enable LDAP": "LDAPを有効にする",
  "enable or disable Groups": "グループを有効または無効にします",
  "enable or disable users": "ユーザーを有効または無効にする",
  "Enable SASL (Simple Authentication and Security Layer) authentication":
    "SASL (簡易認証とセキュリティ層) 認証を有効にする",
  "Enable TLS (Transport Layer Security)":
    "TLS (トランスポート層セキュリティ) を有効にする",
  "enable users": "ユーザーを有効にする",
  "Enable your preferred options to get filtered records.":
    "フィルタリングされたレコードを取得するには、好みのオプションを有効にします。",
  Enabled: "有効",
  Encrypt: "暗号化",
  "Encryption Key": "暗号化キー",
  "Encryption Type": "暗号化タイプ",
  "Encryption:": "暗号化:",
  "End Time:": "終了時刻:",
  Endpoint: "エンドポイント",
  endpoints: "エンドポイント",
  Endpoints: "エンドポイント",
  "Enter '/' to apply the rule to all prefixes and objects at the bucket root. Do not include the wildcard asterisk '*' as part of the prefix *unless* it is an explicit part of the prefix name. The Console automatically appends an asterisk to the appropriate sections of the resulting IAM policy.":
    "バケット ルートにあるすべてのプレフィックスとオブジェクトにルールを適用するには、「/」を入力します。 *接頭辞名の明示的な部分でない限り*、接頭辞の一部としてワイルドカード アスタリスク「*」を含めないでください。コンソールは、生成された IAM ポリシーの適切なセクションにアスタリスクを自動的に追加します。",
  "Enter a comment": "コメントを入力してください",
  "Enter a description": "説明を入力してください",
  "Enter a Mime Type": "MIME タイプを入力してください",
  "Enter a name": "名前を入力してください",
  "Enter Access Key": "アクセスキーを入力してください",
  "Enter Account Key": "アカウントキーを入力してください",
  "Enter Account Name": "アカウント名を入力してください",
  "Enter Address": "住所を入力してください",
  "Enter allowed origin e.g. https://example.com":
    "許可されたオリジンを入力します。例: https://example.com",
  "Enter an Extension": "内線番号を入力してください",
  "Enter Auth Token": "認証トークンを入力してください",
  "Enter auth_token": "auth_token を入力してください",
  "Enter Brokers": "ブローカーに参入",
  "Enter Bucket": "バケットに入る",
  "Enter Cert Authority": "認証局を入力してください",
  "Enter Claim Name": "請求名を入力してください",
  "Enter Claim Prefix": "クレームプレフィックスを入力してください",
  "Enter Client Cert": "クライアント証明書を入力してください",
  "Enter Client Cert Key": "クライアント証明書キーを入力してください",
  "Enter Client ID": "クライアントを入力してください ID",
  "Enter Client Key": "クライアントキーを入力してください",
  "Enter Client Secret": "クライアント シークレットを入力してください",
  "Enter Coredns Path": "Coredns パスに入る",
  "Enter custom notes if any": "カスタムメモがある場合は入力します",
  "Enter Cycle": "サイクルに入る",
  "Enter DB Name": "DB 名前を入力してください",
  "Enter Delay": "遅延を入力してください",
  "Enter Delivery Mode": "配信モードに入る",
  "Enter Destination Identifier": "宛先識別子を入力してください",
  "Enter Display Name": "表示名を入力してください",
  "Enter DSN String": "DSN 文字列を入力してください",
  "Enter Endpoint": "エンドポイントを入力してください",
  "Enter Exchange": "取引所に入る",
  "Enter Exchange Type": "交換タイプを入力してください",
  "Enter Format": "形式を入力してください",
  "Enter Host": "ホストを入力してください",
  "Enter Index": "インデックスを入力してください",
  "Enter Kafka Broker": "Kafka ブローカーを入力してください",
  "Enter Kafka Topic": "Kafka トピックを入力してください",
  "Enter Kafka Version": "Kafka バージョンを入力してください",
  "Enter Keep Alive Interval": "キープアライブ間隔を入力してください",
  "Enter Key": "Enterキー",
  "Enter Max IO": "最大値を入力してください IO",
  "Enter Max Sleep Duration": "最大睡眠時間を入力してください",
  "Enter Max Wait": "最大待機時間を入力してください",
  "Enter Name (Eg. REMOTE-TIER)": "名前を入力してください (例: REMOTE-TIER)",
  "Enter NATS password": "NATS パスワードを入力してください",
  "Enter NATS Subject": "NATS 件名を入力してください",
  "Enter NATS token": "NATS トークンを入力してください",
  "Enter NATS Username": "NATS ユーザー名を入力してください",
  "Enter New Tag Key": "新しいタグキーを入力してください",
  "Enter New Tag Label": "新しいタグラベルを入力してください",
  "Enter nsqd_address": "nsqd_address を入力してください",
  "Enter Password": "パスワードを入力してください",
  "Enter Path Prefix": "パスのプレフィックスを入力してください",
  "Enter Ping Interval": "Ping 間隔を入力してください",
  "Enter Port": "港に入る",
  "Enter Prefix": "プレフィックスを入力してください",
  "Enter QOS": "QOSと入力してください",
  "Enter Queue Dir": "キューディレクトリを入力してください",
  "Enter Queue Directory": "キューディレクトリに入る",
  "Enter Queue Limit": "キュー制限を入力してください",
  "Enter Reconnect Interval": "再接続間隔を入力してください",
  "Enter Replication Failed Workers":
    "レプリケーションに失敗したワーカーを入力してください",
  "Enter Replication Workers": "レプリケーションワーカーを入力してください",
  "Enter Requests Max": "最大リクエスト数を入力してください",
  "Enter Routing Key": "ルーティングキーを入力してください",
  "Enter SASL Mechanism": "SASL メカニズムを入力してください",
  "Enter SASL Password": "SASL パスワードを入力してください",
  "Enter SASL Username": "SASL ユーザー名を入力してください",
  "Enter Secret Key": "秘密キーを入力してください",
  "Enter SSL Mode": "SSL モードに入る",
  "Enter Storage Class": "ストレージクラスに入る",
  "Enter Streaming Cluster ID": "ストリーミング クラスターに入る ID",
  "Enter Streaming in flight value":
    "飛行中のストリーミングの値を入力してください",
  "Enter Table Name": "テーブル名を入力してください",
  "Enter Tag Key": "タグキーを入力してください",
  "Enter Tag Label": "タグラベルを入力してください",
  "Enter the new Folder Path": "新しいフォルダーのパスを入力してください",
  "Enter TLS Client Auth": "TLS クライアント認証を入力します",
  "Enter TLS Client Cert": "TLS クライアント証明書を入力してください",
  "Enter TLS Client Key": "TLS クライアントキーを入力してください",
  "Enter Topic": "トピックを入力してください",
  "Enter URL": "URLと入力してください",
  "Enter User": "ユーザーを入力してください",
  "Enter Username": "ユーザー名を入力してください",
  Entities: "エンティティ",
  "Erasure Health": "イレイジャーコーディングの状態",
  Error: "エラー",
  "Error - File size too large": "エラー - ファイルサイズが大きすぎます",
  "Error retrieving access keys": "アクセスキーの取得中にエラーが発生しました",
  "Error:": "エラー:",
  Errors: "エラー",
  Erros: "エラー",
  "ETAG:": "ETAG:",
  Event: "イベント",
  "Event Notifications": "イベント通知",
  Exchange: "交換",
  "Exchange Type": "交換タイプ",
  "Exclude Folders": "フォルダーを除外する",
  "exclude folders and prefixes": "フォルダーとプレフィックスを除外します",
  "Exclude folders and prefixes": "フォルダーとプレフィックスを除外する",
  "Excluded Prefixes": "除外されるプレフィックス",
  "Excluded Prefixes :": "除外されるプレフィックス :",
  "Existing Objects": "既存のオブジェクト",
  "Expand graph": "グラフを拡大",
  "Expire All Versions": "すべてのバージョンを期限切れにする",
  "Expire Delete Marker": "期限切れ削除マーカー",
  "Expired All Versions": "すべてのバージョンが期限切れになりました",
  "Expired Object Delete Marker": "期限切れのオブジェクト削除マーカー",
  Expiry: "有効期限切れ",
  "Expiry Days": "有効期限日",
  Export: "エクスポート",
  Extensions: "拡張機能",
  'Extensions to compress e.g. ".txt", ".log" or ".csv" -  you can write one per field':
    "圧縮する拡張子 例: 「.txt」、「.log」、または「.csv」 - フィールドごとに 1 つずつ書き込めます",
  Failed: "失敗しました",
  Failures: "失敗",
  False: "偽",
  Features: "特徴",
  February: "2月",
  "File Configuration": "ファイル構成",
  "File couldn't be loaded. Please try Download instead":
    "ファイルをロードできませんでした。代わりにダウンロードをお試しください",
  "File couldn't be previewed using file extension or mime type. Please try Download instead":
    "ファイル拡張子または MIME タイプを使用してファイルをプレビューできませんでした。代わりにダウンロードをお試しください",
  "File download will be handled directly by the browser.":
    "ファイルのダウンロードはブラウザによって直接処理されます。",
  "Files larger than 5 GiB use a single, non-resumable browser request. Use mcli for multipart uploads.":
    "5 GiB を超えるファイルは、単一の再開不可能なブラウザー リクエストを使用します。マルチパートアップロードには mcli を使用します。",
  "File or Path to inspect": "検査するファイルまたはパス",
  "File Preview": "ファイルのプレビュー",
  "File preview couldn't be displayed, Please try Download instead.":
    "ファイルのプレビューを表示できませんでした。代わりにダウンロードをお試しください。",
  "Filename should be less than 200 characters long.":
    "ファイル名の長さは 200 文字未満である必要があります。",
  Filter: "フィルター",
  "Filter Users": "ユーザーのフィルター",
  "Filter:": "フィルター:",
  Filters: "フィルター",
  "Folder cannot have the same name as an existing file":
    "フォルダーに既存のファイルと同じ名前を付けることはできません",
  "For each write operation to the bucket, SILO checks all configured replication rules for the bucket and applies the matching rule with highest configured priority.":
    "バケットへの書き込み操作ごとに、SILO はバケットに設定されているすべてのレプリケーション ルールをチェックし、設定された優先順位が最も高い一致ルールを適用します。",
  'For each write operation to this "source" bucket, SILO checks all configured replication rules and applies the matching rule with highest configured priority.':
    "この「ソース」バケットへの書き込み操作ごとに、SILO は設定されているすべてのレプリケーション ルールをチェックし、最も高い設定優先度を持つ一致ルールを適用します。",
  "For per-object retention settings, defer to the documentation for the PUT operation used by your preferred SDK.":
    "オブジェクトごとの保持設定については、優先する SDK で使用される PUT 操作のドキュメントを参照してください。",
  "For SSE-S3 or SSE-KMS encryption via KMS, all sites must have access to a central KMS deployment server.":
    "KMS による SSE-S3 または SSE-KMS 暗号化の場合、すべてのサイトが中央の KMS 導入サーバーにアクセスできる必要があります。",
  Format: "フォーマット",
  "full attribution stack": "完全なアトリビューションスタック",
  "Full Log Information": "完全なログ情報",
  "Function Name": "関数名",
  Functions: "機能",
  "GET - Object accessed": "GET - オブジェクトにアクセスしました",
  "Get Information": "情報を入手",
  "GNU Affero General Public License, version 3":
    "GNU アフェロ一般公衆利用許諾書、バージョン 3",
  "GNU AGPL v3 full text": "GNU AGPL v3 全文",
  Governance: "ガバナンス",
  Group: "グループ",
  "Group Mappings": "グループマッピング",
  "Group Name": "グループ名",
  "Group Status:": "グループステータス:",
  "Groups provide a simplified method for managing shared permissions among users with common access patterns and workloads. Client’s cannot authenticate to a SILO deployment using a group as an identity.":
    "グループは、共通のアクセス パターンとワークロードを持つユーザー間の共有権限を管理するための簡素化された方法を提供します。クライアントは、グループを ID として使用して SILO デプロイメントに対して認証できません。",
  "Groups with this Policy associated":
    "このポリシーが関連付けられているグループ",
  "Guide to access policy structure": "アクセスポリシー構造のガイド",
  hard: "難しい",
  Heal: "ヒール",
  "Health Check Duration": "ヘルスチェック期間",
  "Health Info (Preview)": "健康情報 (プレビュー)",
  "Health Report": "健康レポート",
  "Health Report complete": "健康レポートが完了しました",
  "Health Report file is ready to be downloaded.":
    "ヘルスレポートファイルをダウンロードする準備ができました。",
  "Health report generated successfully!":
    "ヘルスレポートが正常に生成されました。",
  "Health Report in progress...": "健康レポートが進行中です...",
  "Health Report started. Please do not refresh page during diagnosis.":
    "健康レポートが開始されました。診断中はページを更新しないでください。",
  Healthy: "正常",
  "Hide advanced Filters": "詳細フィルターを非表示にする",
  "Hide Bucket Naming Rules": "バケットの命名ルールを非表示にする",
  "Hide Object Versions": "オブジェクトのバージョンを非表示にする",
  hour: "時",
  hours: {
    other: "時間",
  },
  Hours: "時間",
  "IAM conditional statements": "IAM 条件文",
  "IAM Policy": "IAM ポリシー",
  Id: "ID",
  Identifier: "識別子",
  "Identity provider Client ID": "ID プロバイダー クライアント ID",
  "Identity provider Client Secret":
    "ID プロバイダーのクライアント シークレット",
  "If the Health report cannot be generated at this time, please wait a moment and try again.":
    "現時点でヘルスレポートを生成できない場合は、少し待ってから再試行してください。",
  "If you are looking to change MINIO_ROOT_USER credentials,":
    "MINIO_ROOT_USER 認証情報を変更したい場合は、",
  "ILM - Object Transitioned": "ILM - オブジェクトが遷移しました",
  "ILM Rule": "ILM ルール",
  Import: "輸入",
  "incorporates and modifies": "の組み込みと変更",
  Index: "インデックス",
  "Initially, only one of the sites added for replication may have data. After site-replication is successfully configured, this data is replicated to the other (initially empty) sites. Subsequently, objects may be written to any of the sites, and they will be replicated to all other sites.":
    "最初は、レプリケーション用に追加されたサイトのうち 1 つだけがデータを持つことができます。サイト レプリケーションが正常に構成された後、このデータは他の (最初は空の) サイトにレプリケートされます。その後、オブジェクトはいずれかのサイトに書き込まれる可能性があり、それらは他のすべてのサイトに複製されます。",
  "Inspect Decryption Key": "復号化キーを検査する",
  "Inspect Object": "オブジェクトの検査",
  "Inspect this file": "このファイルを検査してください",
  Internal: "内部",
  "Invalid bucket name": "バケット名が無効です",
  "Invalid Endpoint set": "無効なエンドポイントセットです",
  "Invalid Name": "名前が無効です",
  January: "1月",
  "JSON Results:": "JSON 結果:",
  July: "7月",
  June: "6月",
  "Just now": "たった今",
  "Kafka topic used for bucket notifications":
    "Kafka バケット通知に使用されるトピック",
  "Keep Alive Interval": "キープアライブ間隔",
  "Keep-alive interval for MQTT connections in s,m,h,d":
    "s、m、h、d の MQTT 接続のキープアライブ間隔",
  Key: "キー",
  "Key Management Service Endpoints:": "キー管理サービスのエンドポイント:",
  "Key Name": "キー名",
  "Key name cannot contain spaces":
    "キー名にはスペースを含めることはできません",
  Keys: "キー",
  "KMS Key ID": "KMS キー ID",
  "Last Modified": "最終更新日",
  "Last modified:": "最終更新日:",
  "Last Modified:": "最終更新日:",
  "Latency Histogram": "レイテンシのヒストグラム",
  "LDAP Enabled": "LDAP 有効",
  "Learn more about {link}.": "{link} について詳しくご覧ください。",
  "Learn more about Access Keys": "アクセスキーについて詳しく見る",
  "Learn more about Groups": "グループについて詳しく見る",
  "Learn more about LDAP Configurations": "LDAP 構成について詳しく見る",
  "Learn more about OpenID Connect Configurations": "OpenID 接続構成の詳細",
  "Learn more about Policies": "ポリシーについて詳しく見る",
  "Learn more about the Users feature": "ユーザー機能について詳しくはこちら",
  "Learn more about TIERS": "TIERS について詳しく見る",
  "Legal Hold": "リーガルホールド",
  "Legal Hold Status": "リーガルホールドの状態",
  "Legal Hold:": "リーガルホールド:",
  "licensing in full": "完全ライセンス",
  Lifecycle: "ライフサイクル",
  "Lifecycle Configuration": "ライフサイクル構成",
  "Lifecycle Rules": "ライフサイクル ルール",
  Link: "リンク",
  'List of etcd endpoints e.g. "http://localhost:2379" - you can write one per field':
    'etcd エンドポイントのリスト。 「http://localhost:2379" - フィールドごとに 1 つ書き込めます」',
  "List of origins allowed for CORS requests":
    "CORS リクエストに許可されるオリジンのリスト",
  "List of Replicated Sites": "複製サイトのリスト",
  "Load more": "もっと読み込む",
  "Load more Versions": "さらにバージョンをロードする",
  "Load Time": "ロード時間",
  "Loading nodes": "ノードをロード中",
  "Local Buckets to replicate": "複製するローカルバケット",
  Location: "所在地",
  Locking: "ロック",
  "Log Details": "ログの詳細",
  "Logger Webhook": "ロガー Webhook",
  "Lookup Bind DN is required": "ルックアップバインド DN が必要です",
  "Lookup Bind Password is required": "バインドパスワードの検索が必要です",
  "Lookup Bind Password must be re-entered to change LDAP configurations":
    "LDAP 構成を変更するには、ルックアップ バインド パスワードを再入力する必要があります",
  "Manage Groups": "グループの管理",
  Mandatory: "必須",
  "Manually Configure String": "文字列を手動で構成する",
  March: "3月",
  "Max IO": "最大 IO",
  "Max Sleep": "最大睡眠時間",
  "Max Wait": "最大待ち時間",
  "Maximum IO requests allowed between objects to slow down heal operation, e.g. 3":
    "修復操作を遅くするためにオブジェクト間で許可されるリクエストは最大 IO です。 3",
  "Maximum limit for undelivered messages, defaults to '10000'":
    "未配信メッセージの最大制限、デフォルトは「10000」",
  "Maximum number of concurrent requests, e.g. '1600'":
    "同時リクエストの最大数。 「1600」",
  "Maximum sleep duration between objects to slow down heal operation, e.g. 2s":
    "回復操作を遅くするためのオブジェクト間の最大スリープ期間。例: 2秒",
  "Maximum wait time between operations, defaults to '15s'":
    "操作間の最大待機時間、デフォルトは「15秒」",
  May: "5月",
  "May try again or download Health report JSON File.":
    "再試行するか、ヘルスレポート JSON ファイルをダウンロードしてください。",
  Members: "メンバー",
  "Memory Info": "メモリ情報",
  Metadata: "メタデータ",
  "Metadata Sync": "メタデータの同期",
  Method: "メソッド",
  "Mime Types": "MIME タイプ",
  'Mime types e.g. "text/*", "application/json" or "application/xml" - you can write one per field':
    "MIME タイプ 例: 「text/*」、「application/json」、または「application/xml」 - フィールドごとに 1 つずつ記述できます",
  minute: "分",
  minutes: {
    other: "分",
  },
  Minutes: "分",
  Mode: "モード",
  "Mode:": "モード:",
  month: "月",
  months: {
    other: "か月",
  },
  "More filter options": "その他のフィルターオプション",
  "MQTT password": "MQTT パスワード",
  "MQTT server endpoint e.g. `tcp://localhost:1883`":
    "MQTT サーバーエンドポイント 例: `tcp://localhost:1883`",
  "MQTT username": "MQTT ユーザー名",
  "Multi Bucket lifecycle Assignments Results":
    "マルチバケットのライフサイクル割り当ての結果",
  Name: "名前",
  "Name for identity provider configuration": "ID プロバイダー構成の名前",
  "Name of the AMQP exchange": "AMQP 取引所の名前",
  'Name of the location of the server e.g. "us-west-rack2"':
    "サーバーの場所の名前。例: 「us-west-rack2」",
  "Name of the MQTT topic to publish": "公開する MQTT トピックの名前",
  "Name:": "名前:",
  'Namespace prefix to isolate tenants e.g. "customer1/"':
    "テナントを分離するための名前空間プレフィックス。 「顧客1/」",
  "NATS password": "NATS パスワード",
  "NATS server address e.g. '0.0.0.0:4222'":
    "NATS サーバーアドレス 例: 「0.0.0.0:4222」",
  "NATS subscription subject": "NATS 購読件名",
  "NATS token": "NATS トークン",
  "NATS username": "NATS ユーザー名",
  "Network Info": "ネットワーク情報",
  "New {entity} Created": "新規 {entity} 作成されました",
  "New Audit Webhook": "新しい監査 Webhook",
  "New Endpoint": "新しいエンドポイント",
  "New Endpoint:": "新しいエンドポイント:",
  "New Folder Path": "新しいフォルダーのパス",
  "New Logger Webhook": "新しいロガー Webhook",
  "New Password": "新しいパスワード",
  "New passwords don't match": "新しいパスワードが一致しません",
  "New Tag Key": "新しいタグキー",
  "New Tag Label": "新しいタグラベル",
  Next: "次へ",
  No: "いいえ",
  "No changes applied": "変更は適用されませんでした",
  "No Changes at this time": "現時点では変更はありません",
  "No data available": "利用可能なデータがありません",
  "No Groups Available": "利用可能なグループがありません",
  "No Policies Available": "利用可能なポリシーはありません",
  "No query results yet": "クエリ結果はまだありません",
  "No Results Available": "利用可能な結果はありません",
  "No Users to display": "表示するユーザーがありません",
  "No Wait": "お待ちください",
  "no-expiry": "有効期限なし",
  "Nodes:": "ノード:",
  "Non-blocking message delivery when set to 'on', default is 'off'":
    "「オン」に設定されている場合のノンブロッキングメッセージ配信、デフォルトは「オフ」です",
  "Non-Current": "非現行",
  "Non-current Expiration Days": "現在以外の有効期限日",
  "Non-current Transition Days": "現在以外の移行日",
  "Non-Current Version": "非現行バージョン",
  "Non-current Version Transition Storage Class":
    "非現行バージョンの移行ストレージ クラス",
  None: "なし",
  "Not what you expected?": "期待していたものと違いましたか?",
  "Note:": "注:",
  "Note: AccessKey and SecretKey values for every site is required while adding or editing peer sites":
    "注意：ピアサイトを追加または編集する際は、各サイトの AccessKey と SecretKey が必要です。",
  November: "11月",
  "NSQ server address e.g. '127.0.0.1:4150'":
    "NSQ サーバーアドレス 例: 「127.0.0.1:4150」",
  "NSQ topic": "NSQ トピック",
  "NSQD Address": "NSQD 住所",
  "NULL VERSION": "NULL VERSION",
  "Number of {unit} must be less than or equal to 2147483647":
    "{unit} の数は 2147483647 以下である必要があります",
  "Number of {unit} to retain must be greater than zero":
    "保持する {unit} の数はゼロより大きくなければなりません",
  "Number of messages to publish without waiting for ACKs":
    "ACK を待たずに公開するメッセージの数",
  "Number of replication workers for recently failed replicas, defaults to 4":
    "最近失敗したレプリカのレプリケーション ワーカーの数、デフォルトは 4",
  "Number of replication workers, defaults to 100":
    "レプリケーション ワーカーの数、デフォルトは 100",
  Object: "オブジェクト",
  "Object Date": "オブジェクトの日付",
  "Object Filters": "オブジェクトフィルター",
  "Object Info": "オブジェクト情報",
  "Object Locking:": "オブジェクトのロック:",
  "Object Size": "オブジェクトサイズ",
  "Object Version": "オブジェクトのバージョン",
  "Objects deleted successfully.": "オブジェクトは正常に削除されました。",
  "Objects in excluded prefixes do not replicate to any peer site or remote site.":
    "除外されたプレフィックス内のオブジェクトは、ピア サイトまたはリモート サイトに複製されません。",
  "Objects List unavailable. Please review your WebSockets configuration and try again":
    "オブジェクトリストは利用できません。 WebSocket の設定を確認して、再試行してください。",
  "Objects:": "オブジェクト:",
  "Objs/S": "オブジェクト/S",
  October: "10月",
  of: "の",
  "Only empty tiers can be deleted. If the tier has had objects transitioned into it, it cannot be removed.":
    "空のストレージ階層のみ削除できます。オブジェクトが移行されたことのある階層は削除できません。",
  "Opaque string or JWT authorization token":
    "不透明な文字列または JWT 認証トークン",
  "Open Dialog": "ダイアログを開く",
  "OpenID Configurations": "OpenID 構成",
  "OS Info": "OS 情報",
  other: "その他",
  "Password for LDAP read-only service account used to perform DN and group lookups":
    "DN およびグループ検索の実行に使用される LDAP 読み取り専用サービス アカウントのパスワード",
  "Password for SASL/PLAIN or SASL/SCRAM authentication":
    "SASL/PLAIN または SASL/SCRAM 認証用のパスワード",
  "Passwords must be at least 8 characters long":
    "パスワードは 8 文字以上である必要があります",
  Path: "パス",
  "Path cannot start with /": "パスを / で始めることはできません",
  "Path copied to clipboard": "パスがクリップボードにコピーされました",
  "Path Prefix": "パスのプレフィックス",
  "Path to certificate chain of the target NATS server":
    "ターゲット NATS サーバーの証明書チェーンへのパス",
  "Path to client certificate for mTLS authorization":
    "mTLS 認証用のクライアント証明書へのパス",
  "Path to client key for mTLS authorization":
    "mTLS 認証用のクライアントキーへのパス",
  "Peer Sites": "ピアサイト",
  "Perform bitrot scan on disks when checking objects during scanner":
    "スキャナー中にオブジェクトをチェックするときにディスク上で bitrot スキャンを実行します",
  "Performance test": "性能試験",
  "Persist queue across broker restarts when set to 'on', default is 'off'":
    "「オン」に設定すると、ブローカーの再起動後もキューを保持します。デフォルトは「オフ」です。",
  "Ping Interval": "Ping 間隔",
  "Please avoid the use of root credentials for this feature":
    "この機能には root 認証情報の使用を避けてください",
  "Please configure {entity} first to use this feature.":
    "この機能を使用するには、まず {entity} を設定してください。",
  "Please deploy a server in {distributedMode} to use these features.":
    "これらの機能を使用するには、{distributedMode} にサーバーを展開してください。",
  "Please deploy a server in {mode} to use this feature.":
    "この機能を使用するには、{mode} にサーバーを展開してください。",
  "N/A": "該当なし",
  "Enter a positive quota below 8 PiB, with up to two decimal places. Use mcli for larger quotas.":
    "8 PiB 未満の正のクォータを小数点以下 2 桁まで入力します。より大きなクォータを指定するには、mcli を使用します。",
  "The current quota is 8 PiB or larger, which the browser cannot edit exactly. Change it with mcli, enter a smaller quota, or disable it here.":
    "現在のクォータは 8 PiB 以上であり、ブラウザでは正確に編集できません。 mcli で変更するか、より小さいクォータを入力するか、ここで無効にします。",
  "Please Login via the configured external identity provider.":
    "構成された外部 ID プロバイダー経由でログインしてください。",
  "Please note": "ご注意ください",
  "Please note that this may cause your system to not be accessible":
    "これにより、システムにアクセスできなくなる可能性があることに注意してください",
  "Please refer to {link} credentials.":
    "{link} の資格情報を参照してください。",
  "Please select / type the desired remote bucket were you want the local data to be replicated.":
    "ローカル データをレプリケートする場合は、目的のリモート バケットを選択/入力してください。",
  "Please select a valid duration.": "有効な期間を選択してください。",
  "Please select Groups on which you want to apply Policies":
    "ポリシーを適用するグループを選択してください",
  "Please verify that string is uppercase only and contains valid characters (numbers, dashes & underscores).":
    "文字列が大文字のみであり、有効な文字 (数字、ダッシュ、アンダースコア) が含まれていることを確認してください。",
  Policy: "ポリシー",
  "Policy has no statements": "ポリシーに記述がありません",
  "Policy mapping": "ポリシーマッピング",
  "Policy Mappings": "ポリシーのマッピング",
  "Policy Name": "ポリシー名",
  "Policy name cannot be empty": "ポリシー名を空にすることはできません",
  "Policy successfully updated": "ポリシーが正常に更新されました",
  "Policy Summary": "ポリシーの概要",
  "Portions © 2015–2026 MinIO, Inc.": "一部 © 2015–2026 MinIO, Inc.",
  prefix: "接頭辞",
  Prefix: "プレフィックス",
  "Preliminar Results:": "暫定結果:",
  preview: "プレビュー",
  Preview: "プレビュー",
  "Preview - {object}": "プレビュー - {object}",
  "Preview Selected File": "選択したファイルをプレビュー",
  "Preview this File": "このファイルをプレビューする",
  "Preview unavailable": "プレビューは利用できません",
  Priority: "優先順位",
  private: "プライベート",
  Private: "プライベート",
  "Process Info": "プロセス情報",
  public: "公開",
  Public: "公開",
  "PUT - Object Uploaded": "PUT - オブジェクトがアップロードされました",
  "Query Filters": "クエリフィルター",
  "Query Results": "クエリ結果",
  Queue: "キュー",
  "Queue Dir": "キューディレクトリ",
  "Queue Directory": "キューディレクトリ",
  "Queue Limit": "キュー制限",
  "Quietly ignore undelivered messages when set to 'off', default is 'on'":
    "「オフ」に設定されている場合、未配信メッセージを静かに無視します。デフォルトは「オン」です。",
  quota: "割り当て",
  Quota: "クォータ",
  "Quota:": "割り当て:",
  "Randomized access credentials are recommended, and provided by default. You may use your own custom Access Key and Secret Key by replacing the default values. After creation of any Access Key, you will be given the opportunity to view and download the account credentials.":
    "ランダム化されたアクセス資格情報が推奨され、デフォルトで提供されます。デフォルト値を置き換えることにより、独自のカスタム アクセス キーと秘密キーを使用できます。アクセス キーを作成した後、アカウントの資格情報を表示およびダウンロードする機会が与えられます。",
  "Raw Policy": "生のポリシー",
  readonly: "読み取り専用",
  readwrite: "読み取り書き込み",
  "Reconnect Interval": "再接続間隔",
  "Reconnect interval for MQTT connections in s,m,h,d":
    "MQTT 接続の再接続間隔 (s、m、h、d)",
  "Redirect URI Dynamic": "リダイレクト URI 動的",
  "Redis key to store/update events, key is auto-created":
    "Redis イベントを保存/更新するキー、キーは自動作成されます",
  "Redis server password": "Redis サーバーパスワード",
  "Redis server's address e.g. `localhost:6379`":
    "Redis サーバーのアドレス 例: `ローカルホスト:6379`",
  Refresh: "更新",
  "Refresh List": "リストを更新",
  Region: "地域",
  "Remote Bucket Assignments": "リモートバケットの割り当て",
  "Remote Configuration": "リモート構成",
  "Remote Endpoint Configuration": "リモートエンドポイント構成",
  "Remote Host": "リモートホスト",
  "remote tier": "リモート層",
  "Remove Row": "行を削除",
  "Remove Selected Replication Rules":
    "選択したレプリケーション ルールを削除します",
  "Remove Selected Rules": "選択したルールを削除",
  "Remove the reference to the object if no versions are left":
    "バージョンが残っていない場合は、オブジェクトへの参照を削除します",
  "Removes all the versions of the object already expired":
    "すでに有効期限が切れたオブジェクトのすべてのバージョンを削除します",
  "Rename Download": "ダウンロードの名前を変更",
  "REPLICA - Object Replicated": "REPLICA - オブジェクトが複製されました",
  "Replicate existing objects": "既存のオブジェクトを複製する",
  "Replicate soft deletes": "論理削除をレプリケート",
  "Replicate versioned deletes": "バージョン削除をレプリケート",
  Replication: "レプリケーション",
  "Replication Failed Workers": "レプリケーションに失敗したワーカー",
  "Replication Mode": "レプリケーションモード",
  "Replication Options": "レプリケーション オプション",
  "Replication Rules": "レプリケーションルール",
  "Replication Status": "レプリケーションステータス",
  "Replication status for {type}: {name}.":
    "{type} のレプリケーション ステータス: {name}。",
  "Replication status from all Sites": "すべてのサイトからの複製ステータス",
  "Replication Workers": "レプリケーション ワーカー",
  "Replication:": "レプリケーション:",
  "Reported Usage:": "報告された使用状況:",
  "Request Content Length": "リクエストコンテンツの長さ",
  "Request ID": "リクエストID",
  "Requests Max": "リクエスト最大数",
  "Requests that took T ms or less": "T ms 以下にかかったリクエスト",
  Reset: "リセット",
  "Reset Configuration": "設定をリセット",
  "Reset Default Webhook": "デフォルトにリセット Webhook",
  "Resources:": "リソース:",
  "Response Content Length": "応答コンテンツの長さ",
  "Response Status": "対応状況",
  "Response Status Code": "応答ステータスコード",
  "Response Threshold": "応答しきい値",
  Restart: "再起動",
  "Restore Defaults": "デフォルトに戻す",
  "Restore File Version": "ファイルのバージョンを復元",
  "Restore this version": "このバージョンを復元",
  "Restrict beyond user policy": "ユーザーポリシーを超えた制限",
  Results: "結果",
  Retention: "保持",
  "Retention Mode": "保持モード",
  "Retention Policy:": "保持ポリシー:",
  "Retention Unit": "保持期間の単位",
  "Retention Validity": "保持期間",
  "Retention:": "保持期間:",
  Retest: "再テスト",
  "Retry Health Report": "ヘルスレポートを再試行します",
  Rewind: "巻き戻し",
  "Rewind - {bucket}": "巻き戻し - {bucket}",
  "Rewind Bucket": "リワインドバケット",
  "Rewind to": "巻き戻し",
  "Role Policy": "役割ポリシー",
  rotating: "回転中",
  "Routing Key": "ルーティングキー",
  "Routing key for publishing": "公開用のルーティングキー",
  "Rule State": "ルールの状態",
  "Rule Type": "ルールの種類",
  "Running {mcDu} without the {flag} flag or {df} will provide different values corresponding to the size of all {current} versions and the physical disk space occupied respectively.":
    "{flag} フラグまたは {df} を指定せずに {mcDu} を実行すると、すべての {current} バージョンのサイズと占有されている物理ディスク領域にそれぞれ対応する異なる値が提供されます。",
  "S3 lifecycle": "S3 ライフサイクル",
  "SASL authentication mechanism": "SASL 認証メカニズム",
  "SASL authentication mechanism, default 'PLAIN'":
    "SASL 認証メカニズム、デフォルトは 'PLAIN'",
  "SASL Mechanism": "SASL メカニズム",
  "SASL Password": "SASL パスワード",
  "SASL Username": "SASL ユーザー名",
  "Save Event Destination": "イベントの保存先",
  "Save Tier Configuration": "階層構成の保存",
  Scanner: "スキャナー",
  "SCANNER - Object has too many versions / Prefixes has too many sub-folders":
    "SCANNER - オブジェクトのバージョンが多すぎます/プレフィックスのサブフォルダーが多すぎます",
  "Scanner delay multiplier, defaults to '10.0'":
    "スキャナー遅延乗数、デフォルトは「10.0」です。",
  Scopes: "スコープ",
  Search: "検索",
  "Search Access Keys": "アクセスキーの検索",
  "Search Groups": "グループを検索",
  "Search Keys with pattern": "パターン付きの検索キー",
  "Search members": "メンバーを検索",
  "Search Policies": "検索ポリシー",
  "Search target": "検索対象",
  "Search Users": "ユーザーを検索",
  second: "秒",
  seconds: {
    other: "秒",
  },
  "Secret Key": "シークレットキー",
  "SecretKey is required": "SecretKeyは必須です",
  "Select {expiry} to delete Objects per this rule. Select {transition} to move Objects to a remote storage {tier} per this rule.":
    "このルールに従ってオブジェクトを削除するには、{expiry} を選択します。このルールに従ってオブジェクトをリモート ストレージ {tier} に移動するには、{transition} を選択します。",
  "Select Bucket": "バケットを選択してください",
  "Select from the list of displayed users to assign users to the new group at creation. These users inherit the policies assigned to the group.":
    "表示されたユーザーのリストから選択して、作成時に新しいグループにユーザーを割り当てます。これらのユーザーは、グループに割り当てられたポリシーを継承します。",
  "Select Groups to delete": "削除するグループを選択してください",
  "Select Multiple Versions": "複数のバージョンを選択",
  "Select Policy": "ポリシーを選択",
  "Select the desired level of access available to unauthenticated Users":
    "認証されていないユーザーが利用できるアクセスの希望レベルを選択します",
  "Select Tier Type": "階層タイプの選択",
  "Select to set expiry by days or newer noncurrent versions":
    "有効期限を日数または新しい非現行バージョンで設定する場合に選択します",
  "Select Users to delete": "削除するユーザーを選択してください",
  "Select Users to group": "グループ化するユーザーを選択",
  "Select whether to apply the rule to current or non-current Object {versions}":
    "ルールを現在のオブジェクトに適用するか、現在のオブジェクト以外に適用するかを選択します {versions}",
  "Selected Group": "選択されたグループ",
  "Selected Groups": "選択されたグループ",
  "Selected Object": "選択されたオブジェクト",
  "Selected Objects:": "選択したオブジェクト:",
  "Selected User": "選択されたユーザー",
  "Selected Users": "選択されたユーザー",
  September: "9月",
  Series: "シリーズ",
  server: "サーバー",
  "Server Address": "サーバーアドレス",
  "Server Address is required": "サーバーアドレスは必須です",
  "Server Config": "サーバー構成",
  "Server Health Info": "サーバーの健全性情報",
  "Server Insecure": "サーバーが安全ではありません",
  "Server Location": "サーバーの場所",
  "server-side bucket replication": "サーバー側バケットのレプリケーション",
  "Server, client and Console are all AGPLv3. SILO's documentation is CC BY 4.0 — {licensing}.":
    "サーバー、クライアント、コンソールはすべて AGPLv3 です。 SILO のドキュメントは CC BY 4.0 — {licensing} です。",
  Service: "サービス",
  "Service Accounts": "サービスアカウント",
  Services: "サービス",
  Set: "セット",
  "Set Anonymous Access to this Folder":
    "このフォルダーへの匿名アクセスを設定します",
  "Set Bucket Replication": "バケットのレプリケーションを設定する",
  "Set Groups": "グループを設定する",
  "Set Legal Hold": "リーガルホールドを設定",
  "Set Lifecycle to multiple buckets":
    "ライフサイクルを複数のバケットに設定する",
  "Set Multiple Bucket Replication":
    "複数のバケットのレプリケーションを設定する",
  "Set Non-current Version Transition Storage Class":
    "非現行バージョン移行ストレージ クラスの設定",
  "Set Policies": "ポリシーを設定する",
  "Set Retention Configuration": "保持設定を変更",
  "Set Retention Policy": "保持ポリシーを設定",
  "Set the quality of service priority, defaults to '0'":
    "サービス品質の優先順位を設定します。デフォルトは「0」です。",
  "Set to '1' for non-persistent or '2' for persistent queue":
    "非永続キューの場合は「1」に設定し、永続キューの場合は「2」に設定します",
  "Set to 'on' for exchange to be not used directly by publishers, but only when bound to other exchanges":
    "Exchange を「on」に設定すると、パブリッシャーによって直接使用されなくなりますが、他の Exchange にバインドされている場合にのみ使用されます。",
  "Set to 'on' to enable asynchronous publish":
    "非同期公開を有効にするには「on」に設定します",
  "Set to 'on' to enable SASL authentication":
    "SASL認証を有効にするには「オン」に設定します",
  "Set to 'on' to enable TLS": "TLSを有効にするには「オン」に設定します",
  "Set to 'on' to use streaming NATS server":
    "ストリーミング NATS サーバーを使用するには、「オン」に設定します",
  "Setting a {quota} assigns a hard limit to a bucket beyond which SILO does not allow writes.":
    "{quota} を設定すると、バケットにハード制限が割り当てられ、SILO を超えると書き込みが許可されなくなります。",
  "Setting an {anonymous} policy allows clients to access the Bucket or prefix contents and perform actions consistent with the specified policy without authentication.":
    "{anonymous} ポリシーを設定すると、クライアントは認証なしでバケットまたはプレフィックスの内容にアクセスし、指定されたポリシーと一致するアクションを実行できます。",
  Share: "共有",
  "Share File": "ファイルを共有",
  "Share Selected File": "選択したファイルを共有",
  "Share this File": "このファイルを共有する",
  "Share this version": "このバージョンを共有する",
  "Share URL Copied to clipboard":
    "シェア URL クリップボードにコピーされました",
  'Shared bucket DNS records, default is "/skydns"':
    "共有バケット DNS レコード、デフォルトは「/skydns」です",
  "Show advanced Filters": "詳細フィルターを表示",
  "Show Current Data": "現在のデータを表示",
  "Show deleted objects": "削除済みオブジェクトを表示",
  "Show Rewind Data": "巻き戻しデータを表示",
  "Show/Hide": "表示/非表示",
  "SILO {bucketNotifications} allow administrators to send notifications to supported external services on certain object or bucket events.":
    "SILO {bucketNotifications} を使用すると、管理者は特定のオブジェクトまたはバケットのイベントに関してサポートされている外部サービスに通知を送信できます。",
  "SILO {objectLocking} enforces Write-Once Read-Many (WORM) immutability to protect versioned objects from deletion.":
    "SILO {objectLocking} は、バージョン管理されたオブジェクトを削除から保護するために、Write-Once Read-Many (WORM) の不変性を強制します。",
  "SILO {serverSideReplication} is an automatic bucket-level configuration that synchronizes objects between a source and destination bucket.":
    "SILO {serverSideReplication} は、ソースバケットと宛先バケット間でオブジェクトを同期するバケットレベルの自動構成です。",
  "SILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events. SILO supports bucket and object-level S3 events similar to the Amazon S3 Event Notifications.":
    "SILO バケット通知を使用すると、管理者は特定のオブジェクトまたはバケット イベントに関してサポートされている外部サービスに通知を送信できます。 SILO は、Amazon S3 イベント通知と同様のバケットおよびオブジェクトレベルの S3 イベントをサポートします。",
  "SILO derives its behavior and syntax from {s3Lifecycle} for compatibility in migrating workloads and lifecycle rules from S3 to SILO.":
    "SILO は、ワークロードとライフサイクル ルールを S3 から SILO に移行する際の互換性を確保するために、その動作と構文を {s3Lifecycle} から派生します。",
  "SILO does not enable existing object replication by default. Objects created before replication was configured or while replication is disabled are not synchronized to the target deployment unless replication of existing objects is enabled.":
    "SILO は、デフォルトでは既存のオブジェクトのレプリケーションを有効にしません。レプリケーションが構成される前、またはレプリケーションが無効になっている間に作成されたオブジェクトは、既存のオブジェクトのレプリケーションが有効になっていない限り、ターゲット展開に同期されません。",
  "SILO Health Info": "SILO 健康情報",
  "SILO Object Lifecycle Management allows creating rules for time or date based automatic transition or expiry of objects. For object transition, SILO automatically moves the object to a configured remote storage tier.":
    "SILO オブジェクト ライフサイクル管理を使用すると、時間または日付に基づいたオブジェクトの自動移行または有効期限のルールを作成できます。オブジェクトの移行の場合、SILO はオブジェクトを構成済みのリモート ストレージ層に自動的に移動します。",
  "SILO or other S3-compatible storage":
    "SILO またはその他の S3 互換ストレージ",
  "SILO PBAC is built for compatibility with AWS IAM policy syntax, structure, and behavior.":
    "SILO PBAC は、AWS IAM ポリシーの構文、構造、動作との互換性を考慮して構築されています。",
  "SILO queries the configured Active Directory / LDAP server to verify the credentials specified by the application and optionally return a list of groups in which the user has membership. SILO supports two modes (Lookup-Bind Mode and Username-Bind Mode) for performing these queries":
    "SILO は、設定された Active Directory / LDAP サーバーにクエリを実行して、アプリケーションによって指定された資格情報を確認し、オプションでユーザーがメンバーシップを持っているグループのリストを返します。 SILO は、これらのクエリを実行するための 2 つのモード (ルックアップ バインド モードとユーザー名バインド モード) をサポートしています。",
  "SILO recommends using Lookup-Bind mode as the preferred method for verifying AD/LDAP credentials. Username-Bind mode is a legacy method retained for backwards compatibility only.":
    "SILO は、AD/LDAP 資格情報を検証するための優先方法として Lookup-Bind モードを使用することを推奨します。 Username-Bind モードは、下位互換性のためのみに残されている従来のメソッドです。",
  "SILO requires versioning to support replication.":
    "SILO では、レプリケーションをサポートするためにバージョン管理が必要です。",
  "SILO supports automatically replicating existing objects in a bucket; this setting is enabled by default. Please note that objects created before replication was configured or while replication is disabled are not synchronized to the target deployment in case this setting is not enabled.":
    "SILO は、バケット内の既存オブジェクトの自動複製をサポートします。この設定はデフォルトで有効になっています。この設定が有効になっていない場合、レプリケーションが構成される前、またはレプリケーションが無効になっている間に作成されたオブジェクトはターゲット展開に同期されないことに注意してください。",
  "SILO supports creating object transition lifecycle management rules, where SILO can automatically move an object to a remote storage “tier”.":
    "SILO は、オブジェクト移行ライフサイクル管理ルールの作成をサポートしており、SILO はオブジェクトをリモート ストレージ「層」に自動的に移動できます。",
  "SILO supports enabling automatic {sseKms} and {sseS3} encryption of all objects written to a bucket using a specific External Key (EK) stored on the external KMS.":
    "SILO は、外部 KMS に保存されている特定の外部キー (EK) を使用して、バケットに書き込まれるすべてのオブジェクトの自動 {sseKms} および {sseS3} 暗号化の有効化をサポートします。",
  "SILO supports enabling replication of existing objects in a bucket.":
    "SILO は、バケット内の既存オブジェクトのレプリケーションの有効化をサポートします。",
  "SILO supports keeping multiple {versions} of an object in a single bucket.":
    "SILO は、オブジェクトの複数の {versions} を 1 つのバケットに保持することをサポートします。",
  "SILO supports replicating delete operations, where SILO synchronizes deleting specific object versions and new delete markers. Delete operation replication uses the same replication process as all other replication operations.":
    "SILO は削除操作のレプリケートをサポートしており、SILO は特定のオブジェクト バージョンと新しい削除マーカーの削除を同期します。削除操作のレプリケーションでは、他のすべてのレプリケーション操作と同じレプリケーション プロセスが使用されます。",
  "SILO supports server-side and client-side replication of objects between source and destination buckets.":
    "SILO は、ソース バケットと宛先バケット間のオブジェクトのサーバー側とクライアント側のレプリケーションをサポートします。",
  "SILO supports setting both {bucketDefault} and per-object retention rules.":
    "SILO は、{bucketDefault} とオブジェクトごとの保持ルールの両方の設定をサポートします。",
  "SILO supports the following Tier types:":
    "SILO は、次の階層タイプをサポートします。",
  "SILO supports using an Active Directory or LDAP (AD/LDAP) service for external management of user identities. Configuring an external IDentity Provider (IDP) enables Single-Sign On (SSO) workflows, where applications authenticate against the external IDP before accessing SILO.":
    "SILO は、ユーザー ID の外部管理のための Active Directory または LDAP (AD/LDAP) サービスの使用をサポートします。外部 ID プロバイダー (IDP) を構成すると、アプリケーションが SILO にアクセスする前に外部 IDP に対して認証されるシングル サインオン (SSO) ワークフローが有効になります。",
  "SILO uses buckets to organize objects. A bucket is similar to a folder or directory in a filesystem, where each bucket can hold an arbitrary number of objects.":
    "SILO はバケットを使用してオブジェクトを整理します。バケットはファイルシステム内のフォルダーまたはディレクトリに似ており、各バケットには任意の数のオブジェクトを保持できます。",
  "SILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.":
    "SILO は、ポリシーベースのアクセス制御 (PBAC) を使用して、認証されたユーザーがアクセスできる承認されたアクションとリソースを定義します。各ポリシーには、ユーザーまたはユーザーのグループの権限の概要を示す 1 つ以上のアクションと条件が記述されています。",
  "SILO VERSION": "SILO VERSION",
  "Site Name": "サイト名",
  "Site:": "サイト:",
  Size: "サイズ",
  "Size:": "サイズ:",
  "Skip TLS Verification": "スキップ TLS 検証",
  "something went wrong": "何か問題が発生しました",
  "Something went wrong.": "何か問題が発生しました。",
  "Sort by": "並べ替え順",
  "Specify the version of the Kafka cluster":
    "Kafka クラスターのバージョンを指定します",
  "Specify the version of the Kafka cluster e.g '2.2.0'":
    "Kafka クラスターのバージョンを指定します (例: '2.2.0')",
  "Speed Test results:": "速度テストの結果:",
  Speedtest: "スピードテスト",
  "Speedtest in progress...": "スピードテスト中...",
  "Staging directory for undelivered messages e.g. '/home/events'":
    "未配信メッセージのステージング ディレクトリ (例: '/ホーム/イベント'",
  "STANDARD_IA,REDUCED_REDUNDANCY etc": "STANDARD_IA、REDUCED_REDUNDANCY など",
  Start: "スタート",
  "Start Health Report": "健康レポートを開始",
  "Start Logs": "ログを開始",
  "Start Profiling": "プロファイリングを開始",
  "Start Time:": "開始時間:",
  "Start typing to filter objects in the bucket":
    "バケット内のオブジェクトをフィルタリングするために入力を開始します",
  "Start typing to filter versions of {file}":
    "{file} のバージョンをフィルタリングするために入力を開始します",
  "Start typing to search for a Policy": "入力を開始してポリシーを検索します",
  "Start typing to search for Groups": "入力を開始してグループを検索します",
  Statements: "声明",
  Status: "状態",
  "Status Code": "ステータスコード",
  Stop: "停止",
  "Stop Logs": "ログを停止します",
  "Stop Profiling": "プロファイリングを停止",
  Storage: "ストレージ",
  "Storage Class": "ストレージクラス",
  Streaming: "ストリーミング",
  "Streaming async": "非同期ストリーミング",
  "Streaming Cluster ID": "ストリーミング クラスター ID",
  "Streaming max publish ACKS in flight": "ストリーミング最大公開 ACKS 飛行中",
  Subject: "件名",
  "Subscribe To Bucket Events": "バケットイベントを購読する",
  "Subscribe to Event": "イベントを購読する",
  Success: "成功",
  "Successfully deleted.": "正常に削除されました。",
  "Successfully updated the password for the user {user}.":
    "ユーザー {user} のパスワードが正常に更新されました。",
  "Successfully updated the password.": "パスワードが正常に更新されました。",
  Suffix: "サフィックス",
  Summary: "概要",
  "Supported API endpoints": "サポートされるAPI エンドポイント",
  Suspended: "停学",
  Synced: "同期しました",
  Synchronous: "同期",
  "System Health Info": "システムの健全性情報",
  Table: "テーブル",
  "Tag for: {object}": "タグ: {object}",
  "Tag Key": "タグキー",
  "Tag Label": "タグラベル",
  "Tag Value": "タグの値",
  Tags: "タグ",
  "Tags for: {object}": "のタグ: {object}",
  "Tags:": "タグ:",
  "Target Bucket": "ターゲットバケット",
  "Target URL": "ターゲットURL",
  "The bucket selected in this deployment acts as the “source” while the configured remote deployment acts as the “target”.":
    "この展開で選択されたバケットは「ソース」として機能し、構成されたリモート展開は「ターゲット」として機能します。",
  "The file must be valid and  should have valid config values":
    "ファイルは有効であり、有効な設定値が含まれている必要があります",
  "The file you are trying to download has a long name.":
    "ダウンロードしようとしているファイルの名前は長いです。",
  "The following Bucket features will NOT be replicated":
    "次のバケット機能は複製されません",
  "The following changes are replicated to all other sites":
    "次の変更は他のすべてのサイトに複製されます",
  "The following URL lets you share this object without requiring a login.":
    "次の URL を使用すると、ログインを必要とせずにこのオブジェクトを共有できます。",
  "The current version of this object is a delete marker and cannot be shared.":
    "このオブジェクトの現行バージョンは削除マーカーのため、共有できません。",
  "The selected object version could not be found. Refresh the object list and try again.":
    "選択したオブジェクトのバージョンが見つかりませんでした。オブジェクトリストを更新して、再試行してください。",
  "This server does not expose object versions; only the current object can be shared.":
    "このサーバーはオブジェクトのバージョンを公開しません。現在のオブジェクトのみを共有できます。",
  "The instance needs to be restarted for configuration changes to take effect.":
    "構成の変更を有効にするには、インスタンスを再起動する必要があります。",
  "The MinIO name is used here solely to identify the origin of the source code and to describe compatibility — {notice}.":
    "MinIO という名前は、ソース コードの起源を特定し、互換性を説明するためにのみ使用されます ({notice})。",
  "The selected users were added to the following groups.":
    "選択したユーザーが次のグループに追加されました。",
  "The server is restarting.": "サーバーが再起動中です。",
  "The URL expires automatically at the earlier of your configured time ({time}) or the expiration of your current web session.":
    "URL は、設定した時刻 ({time}) または現在の Web セッションの有効期限のいずれか早い方に自動的に期限切れになります。",
  "There are no Configurations yet.": "設定はまだありません。",
  "There are no endpoints yet.": "エンドポイントはまだありません。",
  "There are no Groups with this Policy associated yet.":
    "このポリシーが関連付けられているグループはまだありません。",
  "There are no Groups yet.": "まだグループはありません。",
  "There are no Policies yet.": "まだポリシーはありません。",
  "There are no tags for this object": "このオブジェクトにはタグがありません",
  "There are no User Access Keys yet.":
    "ユーザー アクセス キーはまだありません。",
  "There are no Users with this Policy associated yet.":
    "このポリシーが関連付けられているユーザーはまだいません。",
  "There are no Users yet.": "ユーザーはまだいません。",
  "There is no information with this criteria":
    "この基準に関する情報はありません",
  "There was an error": "エラーがありました",
  "There was an error creating a Policy ":
    "ポリシーの作成中にエラーが発生しました",
  "There was an error creating a Policy: {details}. Please check Policy syntax.":
    "ポリシーの作成中にエラーが発生しました: {details}。ポリシーの構文を確認してください。",
  "There was an error deleting the tier": "層の削除中にエラーが発生しました",
  "There was an error retrieving tier information":
    "階層情報の取得中にエラーが発生しました",
  "There was an error updating the Policy ":
    "ポリシーの更新中にエラーが発生しました",
  "There was an error updating the Policy: {details}. Please check Policy syntax.":
    "ポリシーの更新中にエラーが発生しました: {details}。ポリシーの構文を確認してください。",
  "These features are unavailable in a single-disk setup.":
    "これらの機能は、単一ディスクのセットアップでは使用できません。",
  "This action is irreversible.": "この操作は元に戻せません。",
  "This can cause issues on Windows Systems by trimming the file name after download.":
    "ダウンロード後にファイル名がトリミングされるため、Windows システムで問題が発生する可能性があります。",
  "This configuration cannot be deleted using this module as this was set using OpenID environment variables.":
    "この設定は OpenID 環境変数を使用して設定されているため、このモジュールを使用して削除できません。",
  "this Console": "このコンソール",
  "This feature allows multiple independent SILO sites (or clusters) that are using the same external IDentity Provider (IDP) to be configured as replicas. In this situation the set of replica sites are referred to as peer sites or just sites.":
    "この機能により、同じ外部 ID プロバイダー (IDP) を使用する複数の独立した SILO サイト (またはクラスター) をレプリカとして構成できます。この状況では、レプリカ サイトのセットはピア サイトまたは単にサイトと呼ばれます。",
  "This feature is not available for a single-disk setup.":
    "この機能は、単一ディスクのセットアップでは使用できません。",
  "This feature is not available.": "この機能は使用できません。",
  "This field is required": "このフィールドは必須です",
  "This is a File Preview for the first {count} pages of the document, if you wish to work with the full document please download instead.":
    "これはドキュメントの最初の {count} ページのファイル プレビューです。ドキュメント全体を操作したい場合は、代わりにダウンロードしてください。",
  "This location is empty": "この場所は空いています",
  "This location is empty, please try uploading a new file":
    "この場所は空です。新しいファイルをアップロードしてください。",
  "This Site": "このサイト",
  "This site/cluster": "このサイト/クラスター",
  "This Usage value is comparable to {command} which represents the size of all object versions that exist in the buckets.":
    "この使用量の値は、バケット内に存在するすべてのオブジェクト バージョンのサイズを表す {command} に相当します。",
  "This value is set from the {env} environment variable":
    "この値は {env} 環境変数から設定されます",
  "This value is set from the {name} environment variable":
    "この値は {name} 環境変数から設定されます",
  "This will be displayed only once. It cannot be recovered.":
    "この情報は一度だけ表示されます。復元することはできません。",
  "This will change your Console password. Please note your new password down, as it will be required to log into Console after this session.":
    "これにより、コンソールのパスワードが変更されます。このセッション後にコンソールにログインするために新しいパスワードが必要になるため、書き留めておいてください。",
  "This will remove the object as well as all of its versions,":
    "これにより、オブジェクトとそのすべてのバージョンが削除されます。",
  "This will remove the objects as well as all of their versions,":
    "これにより、オブジェクトとそのすべてのバージョンが削除されます。",
  Tier: "ストレージ階層",
  "Tier Name": "層名",
  "Tier Types": "階層タイプ",
  "Tiers are used by the SILO Object Lifecycle Management which allows creating rules for time or date based automatic transition or expiry of objects. For object transition, SILO automatically moves the object to a configured remote storage tier.":
    "層は、SILO オブジェクト ライフサイクル管理によって使用され、時間または日付に基づいたオブジェクトの自動移行または有効期限のルールを作成できます。オブジェクトの移行の場合、SILO はオブジェクトを構成済みのリモート ストレージ層に自動的に移動します。",
  "Time duration between scanner cycles, defaults to '1m'":
    "スキャナサイクル間の時間、デフォルトは「1m」",
  "Time to Response NS": "対応までの時間 NS",
  Timestamp: "タイムスタンプ",
  "TLS Client Auth": "TLS クライアント認証",
  "TLS skip verify": "TLS 検証をスキップ",
  "TLS Skip Verify": "TLS 確認をスキップ",
  "To allow Bucket access without credentials, use the {anonymous} setting":
    "資格情報なしでバケットへのアクセスを許可するには、{anonymous} 設定を使用します",
  "To continue please type {phrase} in the box.":
    "続行するには、ボックスに「{phrase}」と入力してください。",
  "To enable this feature you need to enable versioning on the bucket before creation":
    "この機能を有効にするには、作成前にバケットのバージョニングを有効にする必要があります",
  "To Tier": "ティアへ",
  "Today, {time}": "今日、{time}",
  "Toggle Share URL between Console and object server URL. Change default with CONSOLE_SHARE_MINIO_URL environment variable":
    "コンソールとオブジェクトサーバー URL の間で共有 URL を切り替えます。 CONSOLE_SHARE_MINIO_URL 環境変数でデフォルトを変更する",
  Token: "トークン",
  "Toogle JSON": "トゥーグル JSON",
  "Toogle Share URL": "トゥーグルシェア URL",
  Topic: "トピック",
  "Trace Results": "トレース結果",
  "trademark notice": "商標に関する通知",
  Transition: "移行",
  "Transition Days": "移行日",
  True: "本当",
  "Trust server TLS without verification":
    "検証なしでサーバー TLS を信頼します",
  'Trust server TLS without verification, defaults to "on" (verify)':
    "サーバー TLS を信頼し、検証なし、デフォルトは「オン」 (検証)",
  Type: "種類",
  "Type New Password Again": "新しいパスワードをもう一度入力してください",
  "Type of Lifecycle": "ライフサイクルの種類",
  "Types to profile:": "プロファイルするタイプ:",
  "Unable to download widget data":
    "ウィジェット データをダウンロードできません",
  "Unable to download widget data - data not available":
    "ウィジェット データをダウンロードできません - データが利用できません",
  "Under section 13 of the AGPL, the corresponding source for this running version is offered to every user who interacts with it over a network, at no charge.":
    "AGPL のセクション 13 に基づいて、この実行中のバージョンに対応するソースが、ネットワーク経由で対話するすべてのユーザーに無料で提供されます。",
  "Understand which {policies} and {users} are authorized to access this Bucket.":
    "どの {policies} と {users} がこのバケットへのアクセスを許可されているかを理解します。",
  "Unexpected response, download incomplete.":
    "予期しない応答、ダウンロードが不完全です。",
  Unhealthy: "異常",
  "Unique descriptive string for this destination":
    "この宛先の一意の説明文字列",
  "Unique ID for NATS streaming cluster":
    "NATS ストリーミング クラスターの一意の ID",
  "Update Credentials - {type} / {name}": "資格情報の更新 - {type} / {name}",
  "Upload File": "ファイルをアップロード",
  "Upload Files": "ファイルをアップロードする",
  "upload files to this bucket": "ファイルをこのバケットにアップロードします",
  "Upload Folder": "アップロードフォルダー",
  "Upload is restricted.": "アップロードが制限されています。",
  "Upload not allowed": "アップロードは許可されていません",
  "upload objects to this location":
    "オブジェクトをこの場所にアップロードします",
  "Upstream copyright, authorship and license notices are retained in the repository's {credits} and {notice}. See the {attribution}.":
    "アップストリームの著作権、著作者、およびライセンス通知は、リポジトリの {credits} および {notice} に保持されます。 {attribution}を参照してください。",
  "upstream MinIO code": "上流 MinIO コード",
  "Usage Data Age": "使用量データの経過時間",
  "Usage:": "使用法:",
  "Use Original Name": "元の名前を使用",
  "Use SASL": "SASLを使用",
  "Use secure medium to share this key.":
    "この鍵を共有するには安全な媒体を使用してください。",
  "Use TLS": "TLSを使用",
  "Used to confirm a non-idempotent action.":
    "冪等でないアクションを確認するために使用されます。",
  "User Access Keys": "ユーザーアクセスキー",
  "User Agent": "ユーザーエージェント",
  "User Details - {user}": "ユーザーの詳細 - {user}",
  "User DN Search Base DN is required": "ユーザー DN 検索ベース DN が必要です",
  "User DN Search Filter is required": "ユーザー DN 検索フィルターが必要です",
  "User Mappings": "ユーザーマッピング",
  "User Name": "ユーザー名",
  "Username for SASL/PLAIN or SASL/SCRAM authentication":
    "SASL/PLAIN または SASL/SCRAM 認証用のユーザー名",
  "Users inherit access permissions to data and resources through the groups they belong to.":
    "ユーザーは、所属するグループを通じてデータとリソースへのアクセス権限を継承します。",
  "Users with this Policy associated":
    "このポリシーが関連付けられているユーザー",
  Validity: "有効期間",
  "Validity:": "有効期間:",
  Version: "バージョン",
  "Version ID:": "バージョン ID:",
  "Versioning is required to enable {objectLocking} and {retention}.":
    "{objectLocking} と {retention} を有効にするにはバージョニングが必要です。",
  "Versioning on Bucket": "バケットでのバージョニング",
  "Versioning setting cannot be changed as cluster replication is enabled for this site.":
    "このサイトではクラスターのレプリケーションが有効になっているため、バージョン管理設定を変更できません。",
  "Versioning Status": "バージョン管理ステータス",
  versions: {
    other: "バージョン",
  },
  Versions: {
    other: "バージョン",
  },
  "Versions:": "バージョン:",
  View: "見る",
  "View across sites": "サイト全体を表示",
  "View Bucket Naming Rules": "バケットの命名ルールを表示",
  "View env variable Webhook": "環境変数を表示 Webhook",
  "view Objects in this bucket": "このバケット内のオブジェクトを表示",
  "view Policy details": "ポリシーの詳細を表示",
  "View Replication Status for a:":
    "次のレプリケーション ステータスを表示します:",
  "view User details": "ユーザーの詳細を表示",
  "Visit the SILO website": "SILO ウェブサイトにアクセスしてください",
  "Volume or Bucket Name": "ボリュームまたはバケット名",
  "Volume/Bucket name cannot start with /":
    "ボリューム/バケット名は / で始めることはできません",
  Warning: "警告",
  "Warning: One or more users selected has associated Access Keys.":
    "警告: 選択された 1 人以上のユーザーには、関連付けられたアクセス キーがあります。",
  "Warning! The resulting file will contain server configuration information in plain text":
    "警告!結果のファイルには、サーバー構成情報がプレーンテキストで含まれます。",
  "We recommend to rename the file download":
    "ダウンロードファイルの名前を変更することをお勧めします",
  "Webhook server endpoint e.g. http://localhost:8080/silo/events":
    "Webhook サーバーエンドポイント 例: http://localhost:8080/silo/events",
  week: "週",
  weeks: {
    other: "週間",
  },
  "What are Event Destinations?": "イベントの目的地とは何ですか?",
  "Would you like to encrypt {object}?": "{object} を暗号化しますか?",
  "Write Policy": "書き込みポリシー",
  "Write these down, as this is the only time the secret will be displayed.":
    "シークレットが表示されるのはこの時だけなので、これらを書き留めてください。",
  writeonly: "書き込み専用",
  year: "年",
  years: {
    other: "年",
  },
  Years: "年",
  Yes: "はい",
  "Yes, I am sure": "はい、確かに",
  "You can add a comment to this setting": "この設定にコメントを追加できます",
  "You can add policies to the group by selecting it from the Groups view after creation. The Policy view lets you manage the assigned policies for the group.":
    "作成後にグループ ビューからグループを選択することで、グループにポリシーを追加できます。 [ポリシー] ビューでは、グループに割り当てられたポリシーを管理できます。",
  "You can choose to {excludePrefixes} from versioning if Object Locking is not enabled.":
    "オブジェクトのロックが有効になっていない場合は、バージョン管理から {excludePrefixes} を選択できます。",
  "You can download the the Health report JSON File.":
    "ヘルスレポート JSON ファイルをダウンロードできます。",
  "You can increase the maximum configuration time by setting the MINIO_STS_DURATION environment variable on all your nodes.":
    "すべてのノードで MINIO_STS_DURATION 環境変数を設定することで、最大構成時間を増やすことができます。",
  "You can learn more at the {documentation}.":
    "詳細は {documentation} でご覧いただけます。",
  "You can learn more at the {link}.": "詳細は {link} でご覧いただけます。",
  "You can only enable {objectLocking} when first creating a bucket.":
    "{objectLocking} は、最初にバケットを作成するときにのみ有効にできます。",
  "You can reset your session by logging out and logging back in to the web UI.":
    "ウェブ UI からログアウトして再度ログインすると、セッションをリセットできます。",
  "You can specify an optional JSON-formatted IAM policy to further restrict Access Key access to a subset of the actions and resources explicitly allowed for the parent user. Additional access beyond that of the parent user cannot be implemented through these policies.":
    "オプションの JSON- 形式の IAM ポリシーを指定して、親ユーザーに明示的に許可されているアクションおよびリソースのサブセットへのアクセス キー アクセスをさらに制限できます。これらのポリシーを通じて、親ユーザーのアクセスを超える追加のアクセスを実装することはできません。",
  "You can use '*' to match any character, '.' to signify a single character or '\\' to scape an special character (E.g. mybucket-*)":
    "「*」を使用して任意の文字「.」と一致させることができます。単一文字を表す場合は「\\」、特殊文字をスケープする場合は「\\」 (例: mybucket-*)",
  "You can use {mcShare} as an alternative to this UI, where the session length does not limit the URL validity.":
    "この UI の代わりに {mcShare} を使用できます。この場合、セッションの長さは URL の有効性を制限しません。",
  "You cannot delete the currently logged in User":
    "現在ログイン中のユーザーは削除できません",
  "You cannot enable or disable the currently logged in User":
    "現在ログインしているユーザーを有効または無効にすることはできません",
  "You cannot modify the optional Access Key IAM policy after saving.":
    "保存後にオプションのアクセス キー IAM ポリシーを変更することはできません。",
  "You may only have write access on a limited set of subpaths within this path. Please carefully review your User permissions to understand the paths to which you may write.":
    "このパス内の限られたサブパスのセットに対してのみ書き込みアクセス権を持つことができます。ユーザー権限を注意深く確認して、書き込み先のパスを理解してください。",
  "You must apply a valid name to the bucket":
    "バケットに有効な名前を適用する必要があります",
  "You must disable Object Locking before Versioning can be disabled":
    "バージョニングを無効にする前に、オブジェクトのロックを無効にする必要があります",
  "You must disable Retention before Object Locking can be disabled":
    "オブジェクトのロックを無効にする前に、保持を無効にする必要があります",
  "You need to select at least one group to assign":
    "割り当てるグループを少なくとも 1 つ選択する必要があります",
  "You require additional permissions in order to {name}. Please ask your SILO administrator to grant you {scopes} permission in order to {name}.":
    "{name} を行うには追加の権限が必要です。 {name}を行うには、SILO管理者に{scopes}の権限を付与するように依頼してください。",
  "You require additional permissions in order to {name}. Please ask your SILO administrator to grant you {scopes} permissions in order to {name}.":
    "{name} を行うには追加の権限が必要です。 {name}を行うには、SILO管理者に{scopes}の権限を付与するよう依頼してください。",
  "You require additional permissions in order to create a new Tier. Please ask your SILO administrator to grant you {permission} permission in order to create a Tier.":
    "新しい階層を作成するには、追加の権限が必要です。階層を作成するには、SILO 管理者に {permission} 権限を付与するよう依頼してください。",
  "File is empty": "ファイルが空です",
  "Invalid UTF-8 or binary content": "無効な UTF-8 またはバイナリ コンテンツ",
  "Loading text preview…": "テキスト プレビューを読み込んでいます…",
  "Object not found or changed": "オブジェクトが見つからないか変更されました",
  "Text preview content": "テキストプレビューコンテンツ",
  "Text preview failed": "テキストのプレビューに失敗しました",
  "Text preview forbidden": "テキストプレビューは禁止されています",
  "The object could not be found or changed while the preview was loading.":
    "プレビューの読み込み中にオブジェクトが見つからないか、変更できませんでした。",
  "The text preview could not be loaded because of a network or server error.":
    "ネットワークまたはサーバーのエラーのため、テキスト プレビューをロードできませんでした。",
  "This object is not valid UTF-8 text or contains binary data. Download it to inspect the original bytes.":
    "このオブジェクトは有効な UTF-8 テキストではないか、バイナリ データが含まれています。これをダウンロードして、元のバイトを検査します。",
  "You do not have permission to preview this object.":
    "このオブジェクトをプレビューする権限がありません。",
  Trademark: "商標",
  License: "ライセンス",
  "Corresponding source for this build": "このビルドの対応するソース",
  "The exact corresponding source is not available for this build: {reason}. See the NOTICE for how to obtain it.":
    "このビルドでは正確に対応するソースがありません: {reason}。入手方法はNOTICEをご覧ください。",
  "Source: not available for this build":
    "ソース: このビルドでは利用できません",
  "Items per page": "ページごとのアイテム数",
  "First page": "最初のページ",
  "Previous page": "前のページ",
  "Next page": "次のページ\n合計",
  "{count} items in total": "{count} アイテム",
  "Page {page} · {count} on this page": "このページの {page} · {count} ページ",
  "Sorting, filtering and select all apply to this page only.":
    "並べ替え、フィルタリング、およびすべての選択は、このページにのみ適用されます。",
  "No objects match the filter": "フィルターに一致するオブジェクトはありません",
  "No objects on this page match the filter":
    "このページにはフィルターに一致するオブジェクトはありません",
  "Showing the first {count} entries; the listing stopped at the row or time limit.":
    "最初の {count} エントリを表示しています。リストは列または時間制限で停止しました。",
  "Start typing to filter objects on this page":
    "このページのオブジェクトをフィルタリングするには入力を開始してください",
  "Lists and tabs": "リストとタブ",
  "Move through rows with the pointer or keyboard. Arrow keys focus tabs; Enter or Space opens them.":
    "ポインターまたはキーボードを使用して行間を移動します。矢印キーはタブにフォーカスします。 Enter または Space を押すと開きます。",
  "Browse and select stored objects.":
    "保存されているオブジェクトを参照して選択します。",
  "Review stored object versions.":
    "保存されているオブジェクトのバージョンを確認します。",
  "Manage bucket settings.": "バケット設定を管理します。",
  "Compact section tabs": "コンパクトセクションタブ",
  "Storage and object usage": "ストレージとオブジェクトの使用法",
  "Recent storage activity": "最近のストレージアクティビティ",
  "Example buckets": "バケットの例",
  "Select all objects": "すべてのオブジェクトを選択",
  Select: "選択",
  Settings: "設定",
  Overview: "概要",
  Activity: "アクティビティ",
  "No matching results": "一致する結果はありません",
  "Try a different search or clear the filters to see all items.":
    "別の検索を試すか、フィルターをクリアしてすべてのアイテムを表示してください。",
  "Clear filters": "フィルターをクリア",
  "No users yet": "ユーザーはまだいません",
  "Users authenticate with an access key and secret key, and receive permissions through policies and groups.":
    "ユーザーはアクセス キーと秘密キーで認証し、ポリシーとグループを通じて権限を受け取ります。",
  "Create user": "ユーザーの作成",
  "No access keys yet": "アクセスキーがまだありません",
  "Access keys let applications connect with the permissions of your account.":
    "アクセス キーを使用すると、アプリケーションがアカウントの権限に接続できるようになります。",
  "Access keys let applications connect with the permissions assigned to this user.":
    "アクセス キーを使用すると、アプリケーションがこのユーザーに割り当てられた権限に接続できるようになります。",
  "No groups assigned": "グループが割り当てられていません",
  "Add this user to a group to share its access policies.":
    "このユーザーをグループに追加して、アクセス ポリシーを共有します。",
  "No policies assigned": "ポリシーが割り当てられていません",
  "Policies define which actions and resources this user can access.":
    "ポリシーは、このユーザーがアクセスできるアクションとリソースを定義します。",
  "No members yet": "メンバーはまだいません",
  "Add users to this group so they inherit its policies.":
    "ユーザーをこのグループに追加して、そのポリシーを継承します。",
  "Policies attached to this group apply to all its members.":
    "このグループに付加されたポリシーは、そのすべてのメンバーに適用されます。",
  "No encryption keys yet": "暗号化キーがまだありません",
  "Create a key to encrypt objects with the configured key management service.":
    "構成されたキー管理サービスを使用してオブジェクトを暗号化するためのキーを作成します。",
  "No groups yet": "まだグループがありません",
  "Groups let users share the same access policies.":
    "グループを使用すると、ユーザーは同じアクセス ポリシーを共有できます。",
  "No event destinations yet": "イベントの目的地はまだありません",
  "Connect an external service to receive bucket and object notifications.":
    "外部サービスに接続してバケットとオブジェクトの通知を受信します。",
  "No storage tiers yet": "ストレージ階層はまだありません",
  "Connect remote storage to transition objects using lifecycle rules.":
    "ライフサイクル ルールを使用して、リモート ストレージを移行オブジェクトに接続します。",
  "No event subscriptions yet": "イベントのサブスクリプションはまだありません",
  "Subscribe this bucket to send object events to an event destination.":
    "オブジェクト イベントをイベント宛先に送信するには、このバケットをサブスクライブします。",
  "No replication rules yet": "レプリケーション ルールはまだありません",
  "Replicate objects from this bucket to a destination bucket.":
    "このバケットから宛先バケットにオブジェクトを複製します。",
  "No lifecycle rules yet": "ライフサイクル ルールはまだありません",
  "Create rules to expire objects or transition them to remote storage.":
    "オブジェクトを期限切れにするか、オブジェクトをリモート ストレージに移行するためのルールを作成します。",
  "No anonymous access rules": "匿名アクセス ルールなし",
  "This bucket has no prefix rules for access without credentials.":
    "このバケットには、認証情報なしでアクセスするためのプレフィックス ルールがありません。",
  "No policies grant access": "アクセスを許可するポリシーはありません",
  "No listed policy currently grants access to this bucket.":
    "現在、このバケットへのアクセスを許可するポリシーはリストされていません。",
  "No users have access": "アクセス権のあるユーザーはいません",
  "No listed user currently has a policy granting access to this bucket.":
    "現在、このバケットへのアクセスを許可するポリシーを持っているユーザーはリストにありません。",
  "View Policies": "ポリシーを見る",
  "View Users": "ユーザーを表示",
  "Unable to load replication sites":
    "レプリケーション サイトをロードできません",
  "No replication sites yet": "レプリケーション サイトはまだありません",
  "Refresh to try loading the configured sites again.":
    "更新して、構成されたサイトを再度ロードしてみてください。",
  "Connect independent SILO sites to replicate their data and identity configuration.":
    "独立した SILO サイトを接続して、データと ID 構成を複製します。",
  "Waiting for logs": "ログを待っています",
  "Logs are not running": "ログが実行されていません",
  "New log entries will appear here as the server emits them.":
    "サーバーが発行すると、新しいログ エントリがここに表示されます。",
  "Choose the nodes and log types, then start logs to see server activity.":
    "ノードとログの種類を選択し、ログを開始してサーバーのアクティビティを確認します。",
  "Waiting for trace events": "トレースイベントを待機しています",
  "Trace is not running": "トレースが実行されていません",
  "Requests matching the selected calls and filters will appear here.":
    "選択した通話とフィルターに一致するリクエストがここに表示されます。",
  "Choose the calls and filters, then start tracing to inspect live requests.":
    "呼び出しとフィルターを選択し、トレースを開始してライブリクエストを検査します。",
  "{count} node": "{count} ノード",
  "{count} nodes": {
    other: "{count} ノード",
  },
  "{count} drive": "{count} ドライブ",
  "{count} drives": {
    other: "{count} ドライブ",
  },
  "Quota: {quota}": "割り当て: {quota}",
  "Open bucket {name}": "オープンバケット {name}",
  "Recent buckets": "最近のバケット",
  "Read and write": "読み書き",
  "Read only": "読み取り専用",
  "Write only": "書き込みのみ",
  "Created {date}": "作成日 {date}",
  "{count} objects": "{count} オブジェクト",
  "Bucket actions": "バケットアクション",
  "Open menu": "メニューを開く",
  "Page actions": "ページの操作",
  "Selected actions": "選択されたアクション",
  "Parent paths": "親パス",
  "create Groups": "グループを作成する",
  "view Group details": "グループの詳細を表示",
  "configure event destinations": "イベントの宛先を構成する",
  "update Tier credentials": "階層認証情報を更新します",
  "delete Tiers": "階層を削除",
  "manage Access Keys": "アクセスキーを管理する",
};

export default messages;
