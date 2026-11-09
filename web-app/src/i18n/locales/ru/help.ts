// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
// AI-assisted translation; see ../../README.md for review and maintenance.

import type { Dictionary } from "../../catalog";

const messages: Dictionary = {
  "### Users\n\nA SILO user consists of a unique access key (username) and corresponding secret key (password). Clients must authenticate their identity by specifying both a valid access key (username) and the corresponding secret key (password) of an existing SILO user.\n\nGroups provide a simplified method for managing shared permissions among users with common access patterns and workloads.\n\nUsers inherit access permissions to data and resources through the groups they belong to.\n\nSILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.\n\nEach user can access only those resources and operations which are explicitly granted by the built-in role. SILO denies access to any other resource or action by default.":
    "### Пользователи\n\nПользователь SILO состоит из уникального ключа доступа (имени пользователя) и соответствующего секретного ключа (пароля). Клиенты должны аутентифицировать свою личность, указав действительный ключ доступа (имя пользователя) и соответствующий секретный ключ (пароль) существующего пользователя SILO.\n\nГруппы предоставляют упрощенный метод управления общими разрешениями среди пользователей с общими шаблонами доступа и рабочими нагрузками.\n\nПользователи наследуют права доступа к данным и ресурсам через группы, к которым они принадлежат.\n\nSILO использует контроль доступа на основе политик (PBAC) для определения авторизованных действий и ресурсов, к которым имеет доступ аутентифицированный пользователь. Каждая политика описывает одно или несколько действий и условий, определяющих разрешения пользователя или группы пользователей.\n\nКаждый пользователь может получить доступ только к тем ресурсам и операциям, которые явно разрешены встроенной ролью. SILO по умолчанию запрещает доступ к любому другому ресурсу или действию.",
  "### IAM policies\n\nSILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.\n\nSILO PBAC is built for compatibility with AWS IAM policy syntax, structure, and behavior. The SILO documentation makes a best-effort to cover IAM-specific behavior and functionality. Consider deferring to the IAM documentation for more complete documentation on AWS IAM-specific topics.":
    "### Политики IAM\n\nSILO использует контроль доступа на основе политик (PBAC) для определения авторизованных действий и ресурсов, к которым имеет доступ аутентифицированный пользователь. Каждая политика описывает одно или несколько действий и условий, определяющих разрешения пользователя или группы пользователей.\n\nSILO PBAC создан для совместимости с синтаксисом, структурой и поведением политик AWS IAM. В документации SILO описаны основные особенности работы IAM. Более полные сведения по специфическим темам AWS IAM см. в документации AWS IAM.",
  "### Access keys\n\nSILO access keys are child identities of an authenticated SILO user, including externally managed identities. Each access key inherits its privileges based on the policies attached to it’s parent user or those groups in which the parent user has membership. Access Keys also support an optional inline policy which further restricts access to a subset of actions and resources available to the parent user.":
    "### Ключи доступа\n\nКлючи доступа SILO — это дочерние учётные данные аутентифицированного пользователя SILO, включая внешне управляемые учётные записи. Каждый ключ доступа наследует привилегии на основе политик, привязанных к родительскому пользователю или его группам. Ключи доступа также поддерживают необязательную встроенную политику, дополнительно ограничивающую доступ к подмножеству действий и ресурсов родительского пользователя.",
  "### Event destinations\n\nSILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events. SILO supports bucket and object-level S3 events similar to the Amazon S3 Event Notifications.":
    "### Получатели событий\n\nУведомления бакетов SILO позволяют администраторам отправлять уведомления во внешние службы при определённых событиях объектов или бакетов. SILO поддерживает события S3 на уровне бакетов и объектов аналогично уведомлениям о событиях Amazon S3.",
  "### Inspect examples\n\nDownload object metadata or constituent parts from the drives as a ZIP archive. Enable **Encrypt** to protect the downloaded archive; save the decryption key when it is shown.\n\n- **Object metadata:** Volume/Bucket `test-bucket`, Path `test*/xl.meta`.\n- **Object parts:** Volume/Bucket `test-bucket`, Path `test*/*/part.*`.\n- **Recursive prefix:** Volume/Bucket `test-bucket`, Path `test/**`.\n\n**Caution:** Recursive inspection can be expensive. Limit the bucket and path before starting; use recursive patterns only when necessary.":
    "### Примеры проверки\n\nСкачайте метаданные объекта или его составные части с дисков в виде ZIP-архива. Включите **Шифрование**, чтобы защитить загружаемый архив; сохраните ключ расшифровки, когда он будет показан.\n\n- **Метаданные объекта:** Том/бакет `test-bucket`, путь `test*/xl.meta`.\n- **Части объекта:** Том/бакет `test-bucket`, путь `test*/*/part.*`.\n- **Рекурсивный префикс:** Том/бакет `test-bucket`, путь `test/**`.\n\n**Внимание:** Рекурсивная проверка может быть ресурсоёмкой. Ограничьте бакет и путь перед запуском и используйте рекурсивные шаблоны только при необходимости.",
  Troubleshooting: "Устранение неполадок",
  "Need more help?  Check out additional Troubleshooting options":
    "Нужна дополнительная помощь?  Ознакомьтесь с дополнительными вариантами устранения неполадок",
  "Identity and Access Management": "Управление идентификацией и доступом",
  "SILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access.":
    "SILO использует контроль доступа на основе политик (PBAC) для определения авторизованных действий и ресурсов, к которым имеет доступ аутентифицированный пользователь.",
  "Policy based access control": "Контроль доступа на основе политик",
  "Learn how Policy-Based Access Control (PBAC)  is used to define the authorized actions and resources  to which an authenticated user has access":
    "Узнайте, как контроль доступа на основе политик (PBAC) используется для определения авторизованных действий и ресурсов, к которым имеет доступ аутентифицированный пользователь.",
  "OpenID Connect Access Management":
    "Управление доступом через OpenID Connect",
  "Learn more about connecting SILO to OpenID for access management.":
    "Узнайте больше о подключении SILO к OpenID для управления доступом.",
  "MinIO Identity and Access Management: Part 1 - Overview And Modification of Built In Policies":
    "Управление идентификацией и доступом в MinIO: Часть 1 — Обзор и изменение встроенных политик",
  "This video introduces MinIO IAM policies, including an overview of the built-in policies, and how to create and remove a policy.":
    "В этом видео представлены политики MinIO IAM, включая обзор встроенных политик, а также способы создания и удаления политик.",
  "MinIO Identity and Access Management: Part 4 - Lab - Setting Up Users, Groups, and Policies":
    "Управление идентификацией и доступом в MinIO: Часть 4 — Практикум — Настройка пользователей, групп и политик",
  "This Lab video demonstrates setting up identity and access management based Users, Groups and Policies. ":
    "В этом лабораторном видеоролике демонстрируется настройка управления идентификацией и доступом на основе пользователей, групп и политик.",
  "MinIO Identity and Access Management: Part 5 - Lab - Creating A Custom Policy":
    "Управление идентификацией и доступом в MinIO: Часть 5 — Практикум — Создание пользовательской политики",
  "This Lab video demonstrates creating custom IAM policies.":
    "В этом лабораторном видеоролике показано создание пользовательских политик IAM.",
  "MinIO Identity and Access Management: Part 6 - Lab - Interfacing With OpenID and LDAP":
    "Управление идентификацией и доступом в MinIO: Часть 6 — Практикум — Взаимодействие с OpenID и LDAP",
  "This Lab video demonstrates interfacing with OpenID and LDAP. ":
    "Это лабораторное видео демонстрирует взаимодействие с OpenID и LDAP.",
  "# Bucket \n A bucket is similar to a folder or directory in a filesystem, where each bucket can hold an arbitrary number of objects.":
    "# Бакет \n Бакет похож на папку или каталог в файловой системе, где каждый бакет может содержать произвольное количество объектов.",
  "Bucket Versioning": "Версионирование бакета",
  "SILO supports keeping multiple “versions” of an object in a single bucket. SILO versioning protects from unintended overwrites and deletions while providing support for “undoing” a write operation.":
    "SILO поддерживает хранение нескольких «версий» объекта в одном бакете. Версионирование SILO защищает от непреднамеренной перезаписи и удаления, обеспечивая поддержку «отмены» операций записи.",
  Buckets: "Бакеты",
  "Learn about using Console to create and manage Buckets with SILO":
    "Узнайте об использовании консоли для создания бакетов и управления ими в SILO",
  "Creating Buckets and Users through the MinIO Console":
    "Создание бакетов и пользователей в консоли MinIO",
  "Learn how to manage your storage buckets and objects with a hands-on introduction to the MinIO Console and SDKs.":
    "Узнайте, как управлять бакетами хранилища и объектами, с помощью практического введения в консоль MinIO и SDK.",
  "Console Introduction - Add a Bucket and a User":
    "Введение в консоль — добавление бакета и пользователя",
  "This session shows how to create AWS S3 buckets and users with MinIO Console.":
    "В этом видео показано, как создавать бакеты AWS S3 и пользователей с помощью консоли MinIO.",
  "Object Locking and Retention": "Блокировка и удержание объектов",
  "In this video we talk about object retention, WORM (Write Once Read Many), as well as duration based and legal holds.":
    "В этом видео рассматриваются хранение объектов, WORM (однократная запись — многократное чтение), а также удержание на заданный срок и юридическое удержание.",
  "Object Locking and Retention Lab":
    "Практикум по блокировке и хранению объектов",
  "This lab demonstrates creation and removal of both bucket and object specific retention, compliance, and legal holds. ":
    "В этой практической работе показаны создание и удаление правил хранения, соответствия требованиям и юридического удержания на уровне бакетов и объектов.",
  "Versioning and Lifecycle Management":
    "Управление версиями и жизненным циклом",
  "In this video, we will focus on versioning and lifecycle management.":
    "В этом видео мы сосредоточимся на управлении версиями и жизненным циклом.",
  Versioning: "Версионирование",
  "Learn how Versioning gives access to the full history of an object from its creation through each update.":
    "Узнайте, как управление версиями обеспечивает доступ к полной истории объекта от его создания до каждого обновления.",
  "Learn how versioning protects your data from unintended overwrites and deletions":
    "Узнайте, как управление версиями защищает ваши данные от непреднамеренной перезаписи и удаления.",
  "Learn how to create and manage Buckets":
    "Узнайте, как создавать бакеты и управлять ими",
  "In this video, we will focus on versioning  and lifecycle management.":
    "В этом видео мы сосредоточимся на управлении версиями и жизненным циклом.",
  "Policy Document Structure": "Структура документа политики",
  "SILO policy documents use the same schema as AWS IAM Policy documents. See policy templates and allowed S3 Policy actions and condition keys in our docs.":
    "Документы политик SILO используют ту же схему, что и документы политик AWS IAM. Шаблоны политик, разрешённые действия политик S3 и ключи условий приведены в нашей документации.",
  "Access Keys": "Ключи доступа",
  "Access Keys support providing applications authentication credentials which inherit permissions from the “parent” user.":
    "Ключи доступа поддерживают предоставление учетных данных для аутентификации приложений, которые наследуют разрешения от «родительского» пользователя.",
  "Policy Variables": "Переменные политики",
  "SILO supports using policy variables for automatically substituting context from the authenticated user and/or the operation into the user’s assigned policy or policies.":
    "SILO поддерживает использование переменных политики для автоматической замены контекста аутентифицированного пользователя и/или операции в назначенную политику или политики пользователя.",
  "Admin Policy Action Keys": "Ключи действий политики администратора",
  "See actions supported in defining policies for SILO admin operations. These actions are only valid for SILO deployments and are not intended for use with other S3-compatible services.":
    "Ознакомьтесь с действиями, поддерживаемыми при определении политик для административных операций SILO. Эти действия применимы только к развёртываниям SILO и не предназначены для других S3-совместимых служб.",
  "Admin Policy Condition Keys": "Ключи условий политики администратора",
  "See which conditions SILO supports for use with defining policies for admin actions.":
    "Узнайте, какие условия поддерживает SILO при определении политик для действий администратора.",
  "Supported S3 Policy Condition Keys":
    "Поддерживаемые ключи условий политик S3",
  "SILO policy documents support IAM conditional statements.":
    "Документы политик SILO поддерживают условные выражения IAM.",
  "Supported S3 Policy Actions": "Поддерживаемые действия политик S3",
  "SILO policy documents support a subset of IAM S3 Action keys.":
    "Документы политик SILO поддерживают подмножество ключей действий IAM S3.",
  "MinIO Identity and Access Management: Part 2 - Using IDP to Manage Users And Groups":
    "Управление идентификацией и доступом в MinIO: Часть 2 — Использование IDP для управления пользователями и группами",
  "This video discusses Users and Groups, and how policies can be applied to them to enable specific permissions.":
    "В этом видео обсуждаются пользователи и группы, а также применение к ним политик для предоставления определённых разрешений.",
  "SILO versioning protects from unintended overwrites and deletions while providing support for “undoing” a write operation.":
    "Версионирование SILO защищает от непреднамеренной перезаписи и удаления, обеспечивая поддержку «отмены» операций записи.",
  "Lifecycle Management II - Versioning and Lifecycle Management":
    "Управление жизненным циклом II — Управление версиями и жизненным циклом",
  "Creating a New Bucket in a Specific Region":
    "Создание нового бакета в определённом регионе",
  "A Bucket can be created in a specified region":
    "Бакет можно создать в указанном регионе.",
  "What are Settings and Configurations?":
    "Что такое настройки и конфигурации?",
  "These configuration settings define runtime  behavior of the SILO server process,  comparable to the mc admin config command":
    "Эти параметры конфигурации определяют поведение серверного процесса SILO во время выполнения, аналогично команде mc admin config.",
  "MinIO Feature Overview: Active-Active Replication":
    "Обзор функций MinIO: репликация «активный-активный»",
  "Learn about MinIO's object replication capabilities and how MinIO provides resilience to common storage disruption scenarios.":
    "Узнайте о возможностях репликации объектов MinIO и о том, как MinIO обеспечивает устойчивость к распространенным сценариям сбоев в работе хранилища.",
  "How is failed replication handled?":
    "Как обрабатывается неудачная репликация?",
  "SILO queues failed replication operations and retries those operations until replication succeeds.":
    "SILO ставит в очередь неудачные операции репликации и повторяет эти операции до тех пор, пока репликация не завершится успешно.",
  "What are Replication Workers?": "Что такое воркеры репликации?",
  "SILO uses a replication queuing system with multiple concurrent replication workers operating on that queue.":
    "SILO использует систему очередей репликации с несколькими параллельными рабочими процессами репликации, работающими в этой очереди.",
  "These configuration settings define runtime behavior of the SILO server process,  comparable to the mc admin config command":
    "Эти параметры конфигурации определяют поведение серверного процесса SILO во время выполнения, аналогично команде mc admin config.",
  "Where can I see current Heal status?":
    "Где посмотреть текущий статус восстановления (Heal)?",
  "Check under Monitoring/Drives on the left hand  menu to see Drive and Bucket Healing status":
    "Проверьте раздел «Мониторинг/Диски» в левом меню, чтобы увидеть статус восстановления дисков и бакетов.",
  "How is Erasure Coding used to Protect Data?":
    "Как стирающее кодирование используется для защиты данных?",
  "SILO erasure coding is a data redundancy and  availability feature that allows SILO deployments to  automatically reconstruct objects on-the-fly despite  the loss of multiple drives or nodes in the cluster.":
    "Стирающее кодирование SILO — это функция избыточности и доступности данных, которая позволяет развёртываниям SILO автоматически реконструировать объекты «на лету» даже при потере нескольких дисков или узлов кластера.",
  "Recover After Hardware failure": "Восстановление после аппаратного сбоя",
  "Depending on the deployment topology and  selected erasure code parity, SILO can tolerate loss  of up to half the drives or nodes in the deployment  while maintaining read access to objects.":
    "В зависимости от топологии развертывания и выбранной четности кода стирания, SILO может допускать потерю до половины дисков или узлов в развертывании, сохраняя при этом доступ для чтения к объектам.",
  "Site Failure Recovery": "Восстановление после сбоя площадки",
  "SILO can make the loss of an entire site, while  significant, a relatively minor incident. Site recovery depends on the replication option you use for the site.":
    "Благодаря SILO потеря целой площадки, хоть и серьёзна, остаётся преодолимым инцидентом. Восстановление площадки зависит от используемого режима репликации.",
  "Node Failure Recovery": "Восстановление узла при сбое",
  "If a SILO node suffers complete hardware failure, the node begins healing operations once it rejoins the  deployment.":
    "Если на узле SILO происходит полный аппаратный сбой, узел начинает операции восстановления после повторного присоединения к развертыванию.",
  "What is SILO Healing?": "Что такое самовосстановление (Healing) в SILO?",
  "Healing is SILO’s ability to restore data after some event causes data loss. Data loss can come from bit rot, drive loss, or node loss.":
    "Самовосстановление (Healing) — это способность SILO восстанавливать данные после сбоев: битовой порчи (bit rot), отказа диска или потери узла.",
  "Understand SILO Healing Using mc":
    "Восстановление данных в SILO с помощью mc",
  "The mc admin heal command scans for objects that are damaged or corrupted and heals those objects.":
    "Команда mc admin heal сканирует повреждённые объекты и восстанавливает их.",
  "What is Bit Rot?": "Что такое Bit Rot?",
  "Bit rot is data corruption that occurs without the user’s knowledge. SILO combats bit rot with hashing and erasure coding.":
    "Битовая порча — это повреждение данных, которое происходит без ведома пользователя. SILO борется с разрушением битов с помощью хеширования и стирающего кодирования.",
  "These configuration settings define runtime behavior of the SILO server process, comparable to the mc admin config command":
    "Эти параметры конфигурации определяют поведение серверного процесса SILO во время выполнения, аналогично команде mc admin config.",
  "Overview of MinIO Erasure Coding": "Обзор стирающего кодирования MinIO",
  "Through this MinIO video you will learn about MinIO erasure coding, including erasure sets, erasure parity, and stripe size. You will also learn about how the Reed-Solomon algorithm can be optimized for storage efficiency (yielding cost savings) or data lost protection (number of servers and drives that can fail). The video also walks through the MinIO Erasure Code calculator, considerations for cluster design and the command line syntax needed to establish an erasure code deployment. ":
    "Из этого видео MinIO вы узнаете о стирающем кодировании MinIO, включая наборы стирания, чётность и размер страйпа. Вы также узнаете, как оптимизировать алгоритм Рида — Соломона для эффективности хранения или защиты от потери данных. Кроме того, рассматриваются калькулятор стирающего кодирования MinIO, проектирование кластера и синтаксис командной строки.",
  "Object Scanner": "Сканер объектов",
  "Learn more about how the scanner checks Objects for transition and expiry based on lifecycle rules":
    "Узнайте больше о том, как сканер проверяет объекты на предмет перехода и истечения срока действия на основе правил жизненного цикла.",
  "What is the Scanner?": "Что такое сканер?",
  "One of several low-priority processes SILO runs to check lifecycle management rules, bucket or site replication status, as well as object bit rot and healing":
    "Один из фоновых процессов с низким приоритетом в SILO для проверки правил жизненного цикла, статуса репликации бакетов или площадок, а также обнаружения битовой порчи и восстановления объектов.",
  "Lifecycle Management Object Scanner Considerations":
    "Рекомендации по сканеру объектов управления жизненным циклом",
  "SILO uses a scanner process to check objects against all configured lifecycle management rules. High IO workloads or limited system resources may delay application of lifecycle management rules":
    "SILO использует процесс сканера для проверки объектов по всем настроенным правилам жизненного цикла. Высокая нагрузка ввода-вывода или нехватка системных ресурсов могут задержать применение этих правил.",
  "Lifecycle Management Lab": "Практикум по управлению жизненным циклом",
  "Use the MinIO client to demonstrate expiration rules, the scanner, and transitioning objects to remote tiers.":
    "Используйте клиент MinIO для демонстрации правил истечения срока действия, сканера и перехода объектов на удаленные уровни.",
  "What is etcd?": "Что такое etcd?",
  "etcd is a strongly consistent, distributed key-value  store that provides a reliable way to store data that  needs to be accessed by a distributed system or  cluster of machines.":
    "etcd — это строго согласованное, распределенное хранилище «ключ-значение», обеспечивающее надежный способ хранения данных, к которым должен иметь доступ распределенная система или кластер компьютеров.",
  "What is the logger_webhook Environment Variable?":
    "Что такое переменная среды logger_webhook?",
  "The top-level configuration key for defining an  HTTP webhook target for publishing SILO logs.":
    "Конфигурационный ключ верхнего уровня для определения цели веб-перехватчика HTTP для публикации журналов SILO.",
  "Publish Server Logs to HTTP Webhook":
    "Публикация журналов сервера на HTTP Webhook",
  "You can configure a new HTTP webhook endpoint  to which SILO publishes SILO server logs using  either environment variables or by setting  runtime configuration settings.":
    "Вы можете настроить новую конечную точку веб-перехватчика HTTP, на которой SILO публикует журналы сервера SILO, используя либо переменные среды, либо задав параметры конфигурации среды выполнения.",
  "Monitoring Logs": "Журналы мониторинга",
  "SILO supports publishing server logs  and audit logs to an HTTP webhook.":
    "SILO поддерживает публикацию журналов сервера и журналов аудита в веб-перехватчике HTTP.",
  "Monitoring with Prometheus": "Мониторинг с помощью Prometheus",
  "Learn about the monitoring features available  in your MinIO Console and how to export to  Prometheus and get information back so you can  view it in detail.":
    "Узнайте о функциях мониторинга, доступных в вашей консоли MinIO, а также о том, как экспортировать в Prometheus и получить информацию обратно, чтобы вы могли просмотреть ее в деталях.",
  "Prometheus Monitoring Lab": "Практикум по мониторингу с Prometheus",
  "Learn how to set up Prometheus and connect it  back to your MinIO cluster so that you can get  detailed history of what's going on in your MinIO  cluster at any given time.":
    "Узнайте, как настроить Prometheus и подключить его обратно к кластеру MinIO, чтобы вы могли получать подробную историю того, что происходит в вашем кластере MinIO в любой момент времени.",
  "Publish Audit Logs to an HTTP webhook":
    "Публикация журналов аудита в веб-перехватчике HTTP.",
  "You can configure a new HTTP webhook endpoint  to which SILO publishes audit logs using either  environment variables or by setting runtime  configuration settings":
    "Вы можете настроить новую конечную точку веб-перехватчика HTTP, на которую SILO публикует журналы аудита, используя переменные среды или задав параметры конфигурации среды выполнения.",
  "Publish Audit Logs to an External Service":
    "Публикация журналов аудита на внешней службе",
  "Audit logs are granular descriptions of each operation  on the SILO deployment supporting security  standards and regulations which require  detailed tracking of operations.":
    "Журналы аудита представляют собой подробные описания каждой операции в развертывании SILO, поддерживающие стандарты и правила безопасности, которые требуют подробного отслеживания операций.",
  "Publish Events to Kafka": "Опубликовать события в Kafka",
  "SILO supports publishing bucket notification events to a Kafka service endpoint.":
    "SILO поддерживает отправку уведомлений о событиях бакета в конечную точку службы Kafka.",
  "Kafka Service for Bucket Notifications":
    "Служба Kafka для уведомлений бакетов",
  "Learn about environment variables for configuring a Kafka service as a target for Bucket Nofitications.":
    "Узнайте о переменных окружения для настройки службы Kafka в качестве получателя уведомлений бакета.",
  "Kafka Service Configuration Settings": "Параметры конфигурации службы Kafka",
  "Supported Bucket Notification Targets":
    "Поддерживаемые получатели уведомлений бакета",
  "Learn which notification targets are supported by SILO.":
    "Узнайте, какие цели уведомлений поддерживаются SILO.",
  "Bucket Notifications": "Уведомления бакета",
  "SILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events.":
    "Уведомления бакетов SILO позволяют администраторам отправлять уведомления во внешние службы при определённых событиях объектов или бакетов.",
  "Need more help? Check out additional Troubleshooting options":
    "Нужна дополнительная помощь? Ознакомьтесь с дополнительными вариантами устранения неполадок",
  "Site Replication Prerequisite": "Предварительное условие репликации сайта",
  "Check that your setup meets the requirements to deploy Site Replication":
    "Убедитесь, что ваша установка соответствует требованиям для развертывания репликации сайта.",
  "Site replication configures multiple independent SILO deployments as a cluster of replicas called peer sites.":
    "Репликация сайта настраивает несколько независимых развертываний SILO в виде кластера реплик, называемых одноранговыми сайтами.",
  "Site Replication Overview": "Обзор репликации сайта",
  "See what changes are and are NOT replicated between peer sites":
    "Узнайте, какие изменения реплицируются между одноранговыми площадками, а какие НЕТ",
  "Site Replication Tutorial": "Учебное пособие по репликации сайта",
  "Learn how to set up site replication using Console and the SILO client (mc)":
    "Узнайте, как настроить репликацию сайта с помощью консоли и клиента SILO (mc).",
  "Transition from SILO to Azure": "Переход с SILO на Azure",
  "See the procedure to create a new object lifecycle management rule that transition objects from a SILO bucket to a remote storage tier on the Azure storage backend.":
    "Ознакомьтесь с процедурой создания правила управления жизненным циклом, которое переносит объекты из бакета SILO на удалённый уровень хранения в Azure.",
  "Transition from SILO to GCS": "Переход от SILO к GCS",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Google Cloud Storage backend.":
    "Ознакомьтесь с процедурой создания правила управления жизненным циклом, которое переносит объекты из бакета SILO на удалённый уровень хранения в Google Cloud Storage.",
  "Transition from SILO to S3": "Переход от SILO к S3",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Amazon Web Services S3 storage backend or an S3-compatible service.":
    "Ознакомьтесь с процедурой создания правила управления жизненным циклом, которое переносит объекты из бакета SILO на удалённый уровень хранения в Amazon S3 или S3-совместимой службе.",
  "Transition to Remote SILO Deployment":
    "Перенос в удалённое развёртывание SILO",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a bucket on a primary SILO deployment to a bucket on a remote SILO deployment. ":
    "Ознакомьтесь с процедурой создания правила управления жизненным циклом, которое переносит объекты из бакета основного развёртывания SILO в бакет удалённого развёртывания SILO.",
  "Object Lifecycle Management": "Управление жизненным циклом объекта",
  "Use SILO Object Lifecycle Management to create rules for time or date based automatic transition or expiry of objects.":
    "Используйте управление жизненным циклом объектов SILO для создания правил автоматического переноса или истечения срока действия объектов по времени или дате.",
  "MinIO Feature Overview: Object Lifecycle Management":
    "Обзор функций MinIO: Управление жизненным циклом объектов",
  "Learn about MinIO's object lifecycle management capabilities.":
    "Узнайте о возможностях MinIO по управлению жизненным циклом объектов.",
  "Lifecycle Management I - Tiers": "Управление жизненным циклом I – уровни",
  "In this video we will cover expiration and transition of objects to an alternate tier of storage.":
    "В этом видео мы рассмотрим истечение срока действия и переход объектов на альтернативный уровень хранения.",
  Tiers: "Уровни",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Azure storage backend.":
    "Ознакомьтесь с процедурой создания правила управления жизненным циклом, которое переносит объекты из бакета SILO на удалённый уровень хранения в Azure.",
  "Console Metrics Dashboard": "Панель показателей консоли",
  "The SILO Console provides a point-in-time metrics dashboard by default, and also supports displaying time-series and historical data by querying a Prometheus service configured to scrape data from the SILO deployment.":
    "Консоль SILO по умолчанию предоставляет панель мониторинга метрик на определенный момент времени, а также поддерживает отображение временных рядов и исторических данных путем запроса службы Prometheus, настроенной для сбора данных из развертывания SILO.",
  "Available Metrics": "Доступные показатели",
  "Learn about the different Prometheus metrics published by SILO server":
    "Узнайте о различных показателях Prometheus, опубликованных сервером SILO.",
  "Metrics and Alerts": "Показатели и оповещения",
  "For historical metrics and analytics, SILO publishes cluster and node metrics using the Prometheus Data Model.":
    "Для исторических показателей и аналитики SILO публикует метрики кластера и узла с использованием модели данных Prometheus.",
  "Learn about the monitoring features available  in your MinIO Console.":
    "Узнайте о функциях мониторинга, доступных в вашей консоли MinIO.",
  "User Management": "Управление пользователями",
  "Each user can have one or more assigned policies that explicitly list the actions and resources to which that user has access. Users can also inherit policies from the groups in which they have membership.":
    "Каждому пользователю может быть назначена одна или несколько политик, в которых явно перечислены действия и ресурсы, к которым этот пользователь имеет доступ. Пользователи также могут наследовать политики групп, в которых они состоят.",
  "Group Management": "Управление группой",
  "A group is a collection of users. Each group can have one or more assigned policies that explicitly list the actions and resources to which group members are allowed or denied access.":
    "Группа — это совокупность пользователей. Каждая группа может иметь одну или несколько назначенных политик, в которых явно перечислены действия и ресурсы, к которым членам группы разрешен или запрещен доступ.",
  "MinIO Identity and Access Management: Part 3 - Interfacing with OpenID and LDAP":
    "Управление идентификацией и доступом в MinIO: Часть 3 — Взаимодействие с OpenID и LDAP",
  "This video is focused on interfacing with OpenID and LDAP to manage access to MinIO.":
    "Это видео посвящено взаимодействию с OpenID и LDAP для управления доступом к MinIO.",
  "MinIO Authentication and Authorization Using OpenID and Keycloak":
    "Аутентификация и авторизация в MinIO с использованием OpenID и Keycloak",
  "In this video you will learn how to set up an OpenID service, Keycloak, to provide authentication and authorization as part of a MinIO deployment.":
    "В этом видео вы узнаете, как настроить службу OpenID, Keycloak для обеспечения аутентификации и авторизации в рамках развертывания MinIO.",
  "Drive Healing": "Восстановление дисков",
  "The Drives section displays the healing status for a bucket.":
    "В разделе «Диски» отображается статус восстановления бакета.",
  "Erasure Coding": "Стирающее кодирование",
  "SILO Erasure Coding is a data redundancy and availability feature that allows SILO deployments to automatically reconstruct objects on-the-fly despite the loss of multiple drives or nodes in the cluster.":
    "SILO Erasure Coding — это функция избыточности и доступности данных, которая позволяет развертываниям SILO автоматически восстанавливать объекты «на лету», несмотря на потерю нескольких дисков или узлов в кластере.",
  "Site Healing": "Восстановление площадки",
  "Any SILO deployment in the site replication configuration can resynchronize damaged replica-eligible data from the peer with the most updated (“latest”) version of that data.":
    "Любое развертывание SILO в конфигурации репликации сайта может повторно синхронизировать поврежденные данные, подходящие для репликации, от однорангового узла с самой обновленной («последней») версией этих данных.",
  Healing: "Восстановление",
  "SILO Automatically Heals Corrupt or Missing Data On-the-fly":
    "SILO автоматически восстанавливает повреждённые или отсутствующие данные на лету",
  "In this video, we will provide an overview of site-wide replication.":
    "В этом видео мы предоставим обзор репликации на уровне всего сайта.",
  Health: "Состояние",
  "The health section provides an interface for running a health diagnostic for the SILO Deployment. The report is generated on the deployment and downloaded directly to your browser.":
    "Раздел работоспособности предоставляет интерфейс для запуска диагностики работоспособности развертывания SILO. Отчет создается при развертывании и загружается непосредственно в ваш браузер.",
  "IDP Docs": "Документация по IDP",
  "SILO supports multiple external identity managers through OpenID Connect-Compatible Active Directory / LDAP":
    "SILO поддерживает несколько внешних менеджеров идентификации через OpenID Connect-совместимый Active Directory / LDAP",
  "Built-in SILO IDP": "Встроенный SILO IDP",
  "SILO includes a built-in IDentity Provider (IDP) that provides core identity management functionality.":
    "SILO включает встроенный поставщик удостоверений (IDP), который обеспечивает основные функции управления идентификацией.",
  "Active Directory / LDAP Access Management":
    "Управление доступом через Active Directory / LDAP",
  "For identities managed by the external AD/LDAP provider, SILO uses the user’s Distinguished Name and attempts to map it against an existing policy.":
    "Для удостоверений, управляемых внешним поставщиком AD/LDAP, SILO использует отличительное имя пользователя и пытается сопоставить его с существующей политикой.",
  "Keycloak configuration": "Конфигурация Keycloak",
  "You can configure SILO to use Keycloak as an external IDentity Provider (IDP) for authentication of users via the OpenID Connect (OIDC) protocol.":
    "Вы можете настроить SILO для использования Keycloak в качестве внешнего поставщика удостоверений (IDP) для аутентификации пользователей через протокол OpenID Connect (OIDC).",
  "LDAP Configuration": "Конфигурация LDAP",
  "SILO supports configuring a single Active Directory / LDAP Connect for external management of user identities.":
    "SILO поддерживает настройку подключения к Active Directory / LDAP для внешнего управления учётными записями пользователей.",
  "OIDC Configuration": "Конфигурация OIDC",
  "SILO supports using an OpenID Connect (OIDC) compatible IDentity Provider (IDP) such as Okta, KeyCloak, Dex, Google, or Facebook for external management of user identities.":
    "SILO поддерживает использование OpenID Connect (OIDC), совместимого поставщика удостоверений (IDP), такого как Okta, KeyCloak, Dex, Google или Facebook, для внешнего управления идентификационными данными пользователей.",
  "KMS overview": "Обзор KMS",
  "MinIO's cryptographic expert shares why MinIO built KES, what it is used for and how it fits into the MinIO architecture.":
    "Эксперт по криптографии MinIO рассказывает, почему в MinIO создали KES, для чего он нужен и как он вписывается в архитектуру MinIO.",
  "Learn about key management using KMS.":
    "Узнайте об управлении ключами с помощью KMS.",
  "Text snippet that will be relevant to the user will  go here  made to look nice in the helpitem size  on two-three lines":
    "Здесь будет размещен фрагмент текста, который будет интересен пользователю и будет красиво выглядеть в размере элемента справки в две-три строки.",
  "Error logs can be filtered by node and log type, as well as search for specific text in the logs.":
    "Журналы ошибок можно фильтровать по узлу и типу журнала, а также выполнять поиск по конкретному тексту в журналах.",
  "Audit Logs": "Журналы аудита",
  "You can configure an HTTP webhook endpoint to which SILO publishes audit logs using either environment variables or by setting runtime configuration settings.":
    "Вы можете настроить конечную точку веб-перехватчика HTTP, на которую SILO публикует журналы аудита, используя переменные среды или задав параметры конфигурации среды выполнения.",
  "Object Lambda": "Object Lambda",
  "SILO’s Object Lambda enables developers to programmatically transform objects on demand.":
    "Object Lambda в SILO позволяет разработчикам программно преобразовывать объекты по требованию.",
  "MinIO Event Notifications - Overview":
    "Уведомления о событиях MinIO — Обзор",
  "Use the Event framework to see what's going on in the system using Bucket, Object, Replication and ILM events.":
    "Используйте платформу событий, чтобы увидеть, что происходит в системе, используя события Bucket, Object, Replication и ILM.",
  "Managing Event Notifications Using MinIO MC Commands":
    "Управление уведомлениями о событиях с помощью команд MinIO MC",
  "This video provides an overview of the types of event notifications and how to set them up using MinIO's mc commands.":
    "В этом видео представлен обзор типов уведомлений о событиях и способы их настройки с помощью команд MinIO mc.",
  "MinIO Events Notifications - Setting Up Webhooks Using Python":
    "Уведомления о событиях MinIO — Настройка вебхуков с помощью Python",
  "This video provides an overview of how to use Python and Flask to set up a Webhook on MinIO. ":
    "В этом видео представлен обзор того, как использовать Python и Flask для настройки Webhook на MinIO.",
  "MinIO Event Notifications - Using The MinIO Python SDK to Write Custom Webhooks":
    "Уведомления о событиях MinIO — Написание пользовательских вебхуков с MinIO Python SDK",
  "This video dives deeper into using the MinIO Python SDK to setup and manage notifications.":
    "В этом видео более подробно рассматривается использование MinIO Python SDK для настройки и управления уведомлениями.",
  "Object Management": "Управление объектами",
  "Learn about Objects and how  SILO allows you to manage them":
    "Узнайте об объектах и о том, как SILO позволяет ими управлять.",
  "Managing Objects with the Object Browser":
    "Управление объектами с помощью Обозревателя объектов",
  "Learn how to use the Console Object Browser  to manage your Objects":
    "Узнайте, как использовать консольный браузер объектов для управления объектами.",
  "Manipulating Objects": "Манипулирование объектами",
  "A demo of Prefixes & Objects with examples of copying and deleting an object, as well as CopySource Object.":
    "Демо-версия Prefixes & Objects с примерами копирования и удаления объекта, а также CopySource Object.",
  "Example Policy - Bucket Resource Access":
    "Пример политики — доступ к ресурсам бакета",
  "An example policy demonstrating authorization  limited to a named bucket":
    "Пример политики с авторизацией, ограниченной указанным бакетом",
  Performance: "Производительность",
  "The performance section provides an interface for running a performance test of the deployment.":
    "Раздел производительности предоставляет интерфейс для запуска теста производительности развертывания.",
  Profile: "Профиль",
  "The profile section provides an interface for running system profiling of the deployment. The results can provide insight into the SILO server process running on a given node.":
    "Раздел профиля предоставляет интерфейс для запуска профилирования системы развертывания. Результаты могут дать представление о серверном процессе SILO, работающем на данном узле.",
  Inspect: "Исследовать",
  "The inspect section provides an interface for capturing the erasure-coded metadata associated to an object or objects.":
    "Раздел проверки предоставляет интерфейс для сбора метаданных со стирающим кодом, связанных с объектом или объектами.",
  "Encrypt Inspect Output": "Зашифровать результаты проверки",
  "You can encrypt the output of the mc support inspect command for enhanced security when transferring the files off the deployment.":
    "Вы можете зашифровать выходные данные команды mc support inspect для безопасной передачи файлов из развёртывания.",
  "What is Trace?": "Что такое трассировка?",
  "The trace section provides HTTP trace functionality for a bucket or buckets on the deployment.":
    "Раздел трассировки позволяет отслеживать HTTP-запросы для одного или нескольких бакетов в развёртывании.",
  Users: "Пользователи",
  "What is Watch?": "Что такое монитор событий (Watch)?",
  "The Watch section displays S3 events as they occur on the selected bucket.":
    "В разделе «Монитор событий» отображаются события S3 по мере их возникновения в выбранном бакете.",
  "Access Managemnt": "Управление доступом",
  "Object Locking": "Блокировка объектов",
  "SILO Object Locking (“Object Retention”) enforces Write-Once Read-Many (WORM) immutability to protect versioned objects from deletion.":
    "Блокировка объектов SILO («Удержание объектов») обеспечивает неизменяемость по принципу однократной записи и многократного чтения (WORM) для защиты версионированных объектов от удаления.",
  Encryption: "Шифрование",
  "SILO Server-Side Encryption (SSE) protects objects as part of write operations, allowing clients to take advantage of server processing power to secure objects at the storage layer (encryption-at-rest).":
    "Шифрование на стороне сервера (SSE) в SILO защищает объекты при операциях записи, позволяя шифровать данные на уровне хранения (encryption-at-rest).",
  "Learn how to use Console to manage Buckets":
    "Узнайте, как использовать консоль для управления бакетами",
  "Bucket Replication": "Репликация бакета",
  "SILO server-side bucket replication is an automatic bucket-level configuration that synchronizes objects between a source and destination bucket.":
    "Репликация бакетов на стороне сервера в SILO — это автоматическая конфигурация на уровне бакета, синхронизирующая объекты между исходным и целевым бакетами.",
  "This video gives an overview of how to set up and use object versioning as part of a data lifecycle management strategy.":
    "В этом видеоролике представлен обзор того, как настроить и использовать управление версиями объектов как часть стратегии управления жизненным циклом данных.",
  "Versioning Lab": "Практикум по версионированию",
  "This demo will take you through the steps to manage versioned objects using the MinIO command line tools.":
    "В этой демонстрации вы узнаете, как управлять версиями объектов с помощью инструментов командной строки MinIO.",
  "Bucket Replication Requirements": "Требования к репликации бакетов",
  "Check here to ensure you meet the prerequisites before setting up any replication configurations.":
    "Проверьте здесь, чтобы убедиться, что вы соответствуете предварительным требованиям, прежде чем настраивать любые конфигурации репликации.",
  "Bucket Replication Overview": "Обзор репликации бакетов",
  "In this video, we will cover bucket level replication, both active-passive and active-active.":
    "В этом видео мы рассмотрим репликацию на уровне бакета: как активно-пассивную, так и активно-активную.",
  "Replication Lab I": "Практикум по репликации I",
  "Demonstrates bucket replication concepts using MinIO Client, including active-passive and active-active replication.":
    "Демонстрирует концепции репликации бакетов с использованием клиента MinIO, включая активно-пассивную и активно-активную репликацию.",
  "Replication Lab II": "Практикум по репликации II",
  "Demonstrates site replication concepts using MinIO Client, including active-passive and active-active replication.":
    "Демонстрирует концепции репликации сайта с использованием клиента MinIO, включая репликацию «активно-пассивно» и «активно-активно».",
  "Access Management": "Управление доступом",
  "Logging in": "Вход в систему",
  "Sign in with the root credentials, an IAM user access key, or temporary STS credentials via Other Authentication Methods.":
    "Войдите в систему, используя учетные данные root, ключ доступа пользователя IAM или временные учетные данные STS с помощью других методов аутентификации.",
  "Console configuration": "Конфигурация консоли",
  "Configure identity providers, TLS, and session settings for the console on the server side.":
    "Настройте поставщиков удостоверений, TLS и параметры сеанса для консоли на стороне сервера.",
  "Replication Internals": "Внутреннее устройство репликации",
  "Learn details of the SILO replication process.":
    "Узнайте подробности процесса репликации SILO.",
  "One-way Bucket Replication": "Односторонняя репликация бакетов",
  "Guidance on configuring one-way Bucket replication using SILO Console.":
    "Руководство по настройке односторонней репликации бакетов в консоли SILO.",
  "Two-way Bucket Replication": "Двусторонняя репликация бакетов",
  "Guidance on configuring two-way (active-active) Bucket replication using SILO Console.":
    "Руководство по настройке двусторонней (активно-активной) репликации бакетов в консоли SILO.",
};

export default messages;
