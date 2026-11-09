// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
// AI-assisted translation; see ../../README.md for review and maintenance.

import type { Dictionary } from "../../catalog";

const messages: Dictionary = {
  "### Users\n\nA SILO user consists of a unique access key (username) and corresponding secret key (password). Clients must authenticate their identity by specifying both a valid access key (username) and the corresponding secret key (password) of an existing SILO user.\n\nGroups provide a simplified method for managing shared permissions among users with common access patterns and workloads.\n\nUsers inherit access permissions to data and resources through the groups they belong to.\n\nSILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.\n\nEach user can access only those resources and operations which are explicitly granted by the built-in role. SILO denies access to any other resource or action by default.":
    "### المستخدمين\n\nيتكون مستخدم SILO من مفتاح وصول فريد (اسم المستخدم) ومفتاح سري مطابق (كلمة المرور). يجب على العملاء التحقق من هويتهم عن طريق تحديد مفتاح وصول صالح (اسم المستخدم) والمفتاح السري المقابل (كلمة المرور) لمستخدم SILO موجود.\n\nتوفر المجموعات طريقة مبسطة لإدارة الأذونات المشتركة بين المستخدمين الذين لديهم أنماط وصول وأحمال عمل مشتركة.\n\nيرث المستخدمون أذونات الوصول إلى البيانات والموارد من خلال المجموعات التي ينتمون إليها.\n\nSILO يستخدم التحكم في الوصول المستند إلى السياسة (PBAC) لتحديد الإجراءات والموارد المصرح بها التي يمكن للمستخدم المصادق عليه الوصول إليها. تصف كل سياسة واحدًا أو أكثر من الإجراءات والشروط التي تحدد أذونات المستخدم أو مجموعة المستخدمين.\n\nيمكن لكل مستخدم الوصول فقط إلى تلك الموارد والعمليات التي يمنحها الدور المدمج بشكل صريح. SILO يرفض الوصول إلى أي مورد أو إجراء آخر بشكل افتراضي.",
  "### IAM policies\n\nSILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.\n\nSILO PBAC is built for compatibility with AWS IAM policy syntax, structure, and behavior. The SILO documentation makes a best-effort to cover IAM-specific behavior and functionality. Consider deferring to the IAM documentation for more complete documentation on AWS IAM-specific topics.":
    "### IAM السياسات\n\nSILO يستخدم التحكم في الوصول المستند إلى السياسة (PBAC) لتحديد الإجراءات والموارد المصرح بها التي يمكن للمستخدم المصادق عليه الوصول إليها. تصف كل سياسة واحدًا أو أكثر من الإجراءات والشروط التي تحدد أذونات المستخدم أو مجموعة المستخدمين.\n\nتم تصميم SILO PBAC للتوافق مع AWS IAM بناء جملة السياسة وبنيتها وسلوكها. تبذل وثائق SILO قصارى جهدها لتغطية سلوك ووظائف IAM- محددة. فكر في الرجوع إلى وثائق IAM للحصول على وثائق أكثر اكتمالاً حول AWS IAM- موضوعات محددة.",
  "### Access keys\n\nSILO access keys are child identities of an authenticated SILO user, including externally managed identities. Each access key inherits its privileges based on the policies attached to it’s parent user or those groups in which the parent user has membership. Access Keys also support an optional inline policy which further restricts access to a subset of actions and resources available to the parent user.":
    "### مفاتيح الوصول\n\nمفاتيح الوصول في SILO هي هويات فرعية لمستخدم SILO تمت مصادقته، بما في ذلك الهويات المُدارة خارجيًا. يرث كل مفتاح وصول صلاحياته من السياسات المرتبطة بالمستخدم الأصلي أو بالمجموعات التي ينتمي إليها. وتدعم مفاتيح الوصول أيضًا سياسة مضمنة اختيارية تقيّد الوصول إلى مجموعة فرعية من الإجراءات والموارد المتاحة للمستخدم الأصلي.",
  "### Event destinations\n\nSILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events. SILO supports bucket and object-level S3 events similar to the Amazon S3 Event Notifications.":
    "### وجهات الأحداث\n\nتتيح إشعارات الحاويات في SILO للمسؤولين إرسال إشعارات إلى خدمات خارجية مدعومة عند وقوع أحداث معينة تخص الكائنات أو الحاويات. يدعم SILO أحداث S3 على مستوى الحاويات والكائنات، على غرار إشعارات الأحداث في Amazon S3.",
  "### Inspect examples\n\nDownload object metadata or constituent parts from the drives as a ZIP archive. Enable **Encrypt** to protect the downloaded archive; save the decryption key when it is shown.\n\n- **Object metadata:** Volume/Bucket `test-bucket`, Path `test*/xl.meta`.\n- **Object parts:** Volume/Bucket `test-bucket`, Path `test*/*/part.*`.\n- **Recursive prefix:** Volume/Bucket `test-bucket`, Path `test/**`.\n\n**Caution:** Recursive inspection can be expensive. Limit the bucket and path before starting; use recursive patterns only when necessary.":
    "### أمثلة الفحص\n\nنزّل بيانات الكائنات الوصفية أو الأجزاء المكوّنة لها من الأقراص في أرشيف ZIP. فعّل **التشفير** لحماية الأرشيف المُنزّل، واحفظ مفتاح فك التشفير عند عرضه.\n\n- **البيانات الوصفية للكائن:** وحدة التخزين/الحاوية `test-bucket`، المسار `test*/xl.meta`.\n- **أجزاء الكائن:** وحدة التخزين/الحاوية `test-bucket`، المسار `test*/*/part.*`.\n- **البادئة المتكررة:** وحدة التخزين/الحاوية `test-bucket`، المسار `test/**`.\n\n**تنبيه:** قد يكون الفحص المتكرر مكلفًا. حدّد الحاوية والمسار قبل البدء، ولا تستخدم الأنماط المتكررة إلا عند الحاجة.",
  Troubleshooting: "استكشاف الأخطاء وإصلاحها",
  "Need more help?  Check out additional Troubleshooting options":
    "هل تحتاج إلى مزيد من المساعدة؟  تحقق من خيارات استكشاف الأخطاء وإصلاحها الإضافية",
  "Identity and Access Management": "إدارة الهوية والوصول",
  "SILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access.":
    "يستخدم SILO التحكم في الوصول المستند إلى السياسات (PBAC) لتحديد الإجراءات والموارد المسموح للمستخدم الذي تمت مصادقته بالوصول إليها.",
  "Policy based access control": "التحكم في الوصول على أساس السياسة",
  "Learn how Policy-Based Access Control (PBAC)  is used to define the authorized actions and resources  to which an authenticated user has access":
    "تعرّف على كيفية استخدام التحكم في الوصول المستند إلى السياسات (PBAC) لتحديد الإجراءات والموارد المتاحة للمستخدم الذي تمت مصادقته.",
  "OpenID Connect Access Management": "إدارة الوصول باستخدام OpenID Connect",
  "Learn more about connecting SILO to OpenID for access management.":
    "تعرّف على ربط SILO بخدمة OpenID لإدارة الوصول.",
  "MinIO Identity and Access Management: Part 1 - Overview And Modification of Built In Policies":
    "إدارة الهوية والوصول في MinIO: الجزء 1 — نظرة عامة على السياسات المضمنة وتعديلها",
  "This video introduces MinIO IAM policies, including an overview of the built-in policies, and how to create and remove a policy.":
    "يقدّم هذا الفيديو سياسات IAM في MinIO، بما في ذلك نظرة عامة على السياسات المضمنة وكيفية إنشاء سياسة وإزالتها.",
  "MinIO Identity and Access Management: Part 4 - Lab - Setting Up Users, Groups, and Policies":
    "إدارة الهوية والوصول في MinIO: الجزء 4 — تدريب عملي على إعداد المستخدمين والمجموعات والسياسات",
  "This Lab video demonstrates setting up identity and access management based Users, Groups and Policies. ":
    "يوضّح هذا التدريب العملي إعداد إدارة الهوية والوصول باستخدام المستخدمين والمجموعات والسياسات. ",
  "MinIO Identity and Access Management: Part 5 - Lab - Creating A Custom Policy":
    "إدارة الهوية والوصول في MinIO: الجزء 5 — تدريب عملي على إنشاء سياسة مخصصة",
  "This Lab video demonstrates creating custom IAM policies.":
    "يوضح مقطع الفيديو هذا إنشاء سياسات IAM مخصصة.",
  "MinIO Identity and Access Management: Part 6 - Lab - Interfacing With OpenID and LDAP":
    "إدارة الهوية والوصول في MinIO: الجزء 6 — تدريب عملي على الربط مع OpenID وLDAP",
  "This Lab video demonstrates interfacing with OpenID and LDAP. ":
    "يوضّح هذا التدريب العملي الربط مع OpenID وLDAP. ",
  "# Bucket \n A bucket is similar to a folder or directory in a filesystem, where each bucket can hold an arbitrary number of objects.":
    "# الحاوية\nتشبه الحاوية مجلدًا أو دليلًا في نظام الملفات، ويمكن لكل حاوية الاحتفاظ بعدد غير محدد من الكائنات.",
  "Bucket Versioning": "إصدار الجرافة",
  "SILO supports keeping multiple “versions” of an object in a single bucket. SILO versioning protects from unintended overwrites and deletions while providing support for “undoing” a write operation.":
    "يدعم SILO الاحتفاظ بإصدارات متعددة من الكائن داخل حاوية واحدة. وتحمي إدارة الإصدارات من الاستبدال والحذف غير المقصودين، وتتيح التراجع عن عمليات الكتابة.",
  Buckets: "الحاويات",
  "Learn about using Console to create and manage Buckets with SILO":
    "تعرف على استخدام وحدة التحكم لإنشاء وإدارة المستودعات باستخدام SILO",
  "Creating Buckets and Users through the MinIO Console":
    "إنشاء الحاويات والمستخدمين من خلال لوحة تحكم MinIO",
  "Learn how to manage your storage buckets and objects with a hands-on introduction to the MinIO Console and SDKs.":
    "تعرّف عمليًا على إدارة حاويات التخزين والكائنات باستخدام لوحة تحكم MinIO وحزم SDK.",
  "Console Introduction - Add a Bucket and a User":
    "مقدمة إلى لوحة التحكم — إضافة حاوية ومستخدم",
  "This session shows how to create AWS S3 buckets and users with MinIO Console.":
    "توضح هذه الجلسة كيفية إنشاء حاويات AWS S3 والمستخدمين باستخدام لوحة تحكم MinIO.",
  "Object Locking and Retention": "قفل الكائنات والاحتفاظ بها",
  "In this video we talk about object retention, WORM (Write Once Read Many), as well as duration based and legal holds.":
    "يناقش هذا الفيديو الاحتفاظ بالكائنات، والكتابة مرة واحدة والقراءة مرات متعددة (WORM)، والاحتفاظ المحدد بمدة والاحتفاظ القانوني.",
  "Object Locking and Retention Lab":
    "تدريب عملي على قفل الكائنات والاحتفاظ بها",
  "This lab demonstrates creation and removal of both bucket and object specific retention, compliance, and legal holds. ":
    "يوضّح هذا التدريب إنشاء إعدادات الاحتفاظ والامتثال والاحتفاظ القانوني وإزالتها على مستوى الحاويات والكائنات. ",
  "Versioning and Lifecycle Management": "إدارة الإصدارات ودورة الحياة",
  "In this video, we will focus on versioning and lifecycle management.":
    "في هذا الفيديو سنركز على الإصدار وإدارة دورة الحياة.",
  Versioning: "إدارة الإصدارات",
  "Learn how Versioning gives access to the full history of an object from its creation through each update.":
    "تعرّف على كيفية الوصول إلى السجل الكامل للكائن، منذ إنشائه وخلال كل تحديث، باستخدام إدارة الإصدارات.",
  "Learn how versioning protects your data from unintended overwrites and deletions":
    "تعرف على كيفية حماية الإصدار لبياناتك من عمليات الكتابة والحذف غير المقصودة",
  "Learn how to create and manage Buckets": "تعرّف على إنشاء الحاويات وإدارتها",
  "In this video, we will focus on versioning  and lifecycle management.":
    "في هذا الفيديو، سنركز على الإصدار وإدارة دورة الحياة.",
  "Policy Document Structure": "هيكل وثيقة السياسة",
  "SILO policy documents use the same schema as AWS IAM Policy documents. See policy templates and allowed S3 Policy actions and condition keys in our docs.":
    "SILO تستخدم مستندات السياسة نفس المخطط مثل AWS IAM مستندات السياسة. راجع قوالب السياسة المسموح بها S3 إجراءات السياسة ومفاتيح الشروط في مستنداتنا.",
  "Access Keys": "مفاتيح الوصول",
  "Access Keys support providing applications authentication credentials which inherit permissions from the “parent” user.":
    'تدعم مفاتيح الوصول توفير بيانات اعتماد مصادقة التطبيقات التي ترث الأذونات من المستخدم "الأصل".',
  "Policy Variables": "متغيرات السياسات",
  "SILO supports using policy variables for automatically substituting context from the authenticated user and/or the operation into the user’s assigned policy or policies.":
    "يدعم SILO متغيرات السياسات لاستبدال سياق المستخدم الذي تمت مصادقته أو العملية تلقائيًا داخل السياسة أو السياسات المعيّنة للمستخدم.",
  "Admin Policy Action Keys": "مفاتيح إجراءات سياسات الإدارة",
  "See actions supported in defining policies for SILO admin operations. These actions are only valid for SILO deployments and are not intended for use with other S3-compatible services.":
    "اطّلع على الإجراءات المدعومة عند تعريف سياسات عمليات إدارة SILO. هذه الإجراءات مخصصة لنشرات SILO ولا يُقصد استخدامها مع خدمات أخرى متوافقة مع S3.",
  "Admin Policy Condition Keys": "مفاتيح شروط سياسات الإدارة",
  "See which conditions SILO supports for use with defining policies for admin actions.":
    "اطّلع على الشروط التي يدعمها SILO عند تعريف سياسات إجراءات الإدارة.",
  "Supported S3 Policy Condition Keys": "مفاتيح شروط سياسات S3 المدعومة",
  "SILO policy documents support IAM conditional statements.":
    "SILO دعم وثائق السياسة IAM البيانات الشرطية.",
  "Supported S3 Policy Actions": "إجراءات سياسات S3 المدعومة",
  "SILO policy documents support a subset of IAM S3 Action keys.":
    "SILO تدعم وثائق السياسة مجموعة فرعية من IAM S3 مفاتيح الإجراءات.",
  "MinIO Identity and Access Management: Part 2 - Using IDP to Manage Users And Groups":
    "إدارة الهوية والوصول في MinIO: الجزء 2 — استخدام موفّر الهوية لإدارة المستخدمين والمجموعات",
  "This video discusses Users and Groups, and how policies can be applied to them to enable specific permissions.":
    "يناقش هذا الفيديو المستخدمين والمجموعات، وكيفية تطبيق السياسات عليها لمنح صلاحيات محددة.",
  "SILO versioning protects from unintended overwrites and deletions while providing support for “undoing” a write operation.":
    "تحمي إدارة الإصدارات في SILO من الاستبدال والحذف غير المقصودين، وتتيح التراجع عن عمليات الكتابة.",
  "Lifecycle Management II - Versioning and Lifecycle Management":
    "إدارة دورة الحياة 2 — إدارة الإصدارات ودورة الحياة",
  "Creating a New Bucket in a Specific Region":
    "إنشاء حاوية جديدة في منطقة محددة",
  "A Bucket can be created in a specified region":
    "يمكن إنشاء الحاوية في منطقة محددة",
  "What are Settings and Configurations?": "ما هي الإعدادات والإعدادات؟",
  "These configuration settings define runtime  behavior of the SILO server process,  comparable to the mc admin config command":
    "تحدد هذه الإعدادات سلوك عملية خادم SILO أثناء التشغيل، على غرار الأمر mc admin config.",
  "MinIO Feature Overview: Active-Active Replication":
    "نظرة عامة على ميزات MinIO: النسخ المتماثل النشط-النشط",
  "Learn about MinIO's object replication capabilities and how MinIO provides resilience to common storage disruption scenarios.":
    "تعرف على إمكانيات النسخ المتماثل للكائنات MinIO وكيف يوفر MinIO المرونة في مواجهة سيناريوهات انقطاع التخزين الشائعة.",
  "How is failed replication handled?": "كيف يتم التعامل مع فشل النسخ؟",
  "SILO queues failed replication operations and retries those operations until replication succeeds.":
    "يضع SILO عمليات النسخ المتماثل الفاشلة في قائمة انتظار، ويعيد محاولتها حتى تنجح.",
  "What are Replication Workers?": "ما هي عمال النسخ؟",
  "SILO uses a replication queuing system with multiple concurrent replication workers operating on that queue.":
    "يستخدم SILO قائمة انتظار للنسخ المتماثل، تعمل عليها عدة عمليات نسخ بالتزامن.",
  "These configuration settings define runtime behavior of the SILO server process,  comparable to the mc admin config command":
    "تحدد هذه الإعدادات سلوك عملية خادم SILO أثناء التشغيل، على غرار الأمر mc admin config.",
  "Where can I see current Heal status?":
    "أين يمكنني رؤية حالة الشفاء الحالية؟",
  "Check under Monitoring/Drives on the left hand  menu to see Drive and Bucket Healing status":
    "تحقق من المراقبة/محركات الأقراص في القائمة اليسرى لمعرفة حالة معالجة المحرك والحاوية",
  "How is Erasure Coding used to Protect Data?":
    "كيف يتم استخدام تشفير المحو لحماية البيانات؟",
  "SILO erasure coding is a data redundancy and  availability feature that allows SILO deployments to  automatically reconstruct objects on-the-fly despite  the loss of multiple drives or nodes in the cluster.":
    "ترميز المحو في SILO هو ميزة للتكرار والتوافر تتيح إعادة بناء الكائنات تلقائيًا أثناء التشغيل، حتى عند فقد عدة أقراص أو عقد في العنقود.",
  "Recover After Hardware failure": "الاسترداد بعد فشل الأجهزة",
  "Depending on the deployment topology and  selected erasure code parity, SILO can tolerate loss  of up to half the drives or nodes in the deployment  while maintaining read access to objects.":
    "اعتمادًا على طبولوجيا النشر وتكافؤ كود المسح المحدد، يمكن أن يتحمل SILO فقدان ما يصل إلى نصف محركات الأقراص أو العقد في النشر مع الحفاظ على الوصول للقراءة إلى الكائنات.",
  "Site Failure Recovery": "استعادة فشل الموقع",
  "SILO can make the loss of an entire site, while  significant, a relatively minor incident. Site recovery depends on the replication option you use for the site.":
    "يمكن لـ SILO الحد من أثر فقدان موقع كامل، رغم خطورة ذلك. وتعتمد استعادة الموقع على خيار النسخ المتماثل المستخدم له.",
  "Node Failure Recovery": "استعادة فشل العقدة",
  "If a SILO node suffers complete hardware failure, the node begins healing operations once it rejoins the  deployment.":
    "إذا كانت العقدة SILO تعاني من فشل كامل في الأجهزة، فستبدأ العقدة في عمليات الإصلاح بمجرد انضمامها مرة أخرى إلى النشر.",
  "What is SILO Healing?": "ما هو SILO الشفاء؟",
  "Healing is SILO’s ability to restore data after some event causes data loss. Data loss can come from bit rot, drive loss, or node loss.":
    "الشفاء هو قدرة SILO على استعادة البيانات بعد أن تسبب حدث ما في فقدان البيانات. يمكن أن يأتي فقدان البيانات من تعفن البتات أو فقدان محرك الأقراص أو فقدان العقدة.",
  "Understand SILO Healing Using mc": "فهم SILO العلاج باستخدام mc",
  "The mc admin heal command scans for objects that are damaged or corrupted and heals those objects.":
    "يفحص الأمر mc admin heal الكائنات التالفة ويصلحها.",
  "What is Bit Rot?": "ما هو البيت روت؟",
  "Bit rot is data corruption that occurs without the user’s knowledge. SILO combats bit rot with hashing and erasure coding.":
    "تعفن البت هو تلف البيانات الذي يحدث دون علم المستخدم. SILO يكافح تعفن البتات باستخدام تشفير التجزئة والمحو.",
  "These configuration settings define runtime behavior of the SILO server process, comparable to the mc admin config command":
    "تحدد هذه الإعدادات سلوك عملية خادم SILO أثناء التشغيل، على غرار الأمر mc admin config.",
  "Overview of MinIO Erasure Coding": "نظرة عامة على ترميز المحو في MinIO",
  "Through this MinIO video you will learn about MinIO erasure coding, including erasure sets, erasure parity, and stripe size. You will also learn about how the Reed-Solomon algorithm can be optimized for storage efficiency (yielding cost savings) or data lost protection (number of servers and drives that can fail). The video also walks through the MinIO Erasure Code calculator, considerations for cluster design and the command line syntax needed to establish an erasure code deployment. ":
    "من خلال هذا الفيديو MinIO ستتعرف على ترميز المحو MinIO، بما في ذلك مجموعات المحو وتكافؤ المحو وحجم الشريط. ستتعرف أيضًا على كيفية تحسين خوارزمية Reed-Solomon لتحقيق كفاءة التخزين (مما يؤدي إلى توفير التكاليف) أو حماية البيانات المفقودة (عدد الخوادم ومحركات الأقراص التي يمكن أن تفشل). يستعرض الفيديو أيضًا حاسبة MinIO رمز المحو، والاعتبارات المتعلقة بتصميم المجموعة وبناء جملة سطر الأوامر اللازم لإنشاء نشر رمز المحو.",
  "Object Scanner": "ماسح الكائنات",
  "Learn more about how the scanner checks Objects for transition and expiry based on lifecycle rules":
    "تعرّف على كيفية فحص الكائنات لتحديد النقل وانتهاء الصلاحية استنادًا إلى قواعد دورة الحياة.",
  "What is the Scanner?": "ما هو الماسح الضوئي؟",
  "One of several low-priority processes SILO runs to check lifecycle management rules, bucket or site replication status, as well as object bit rot and healing":
    "إحدى العمليات منخفضة الأولوية التي يشغّلها SILO للتحقق من قواعد إدارة دورة الحياة وحالة النسخ المتماثل للحاويات أو المواقع، وكذلك تلف بيانات الكائنات وإصلاحها.",
  "Lifecycle Management Object Scanner Considerations":
    "اعتبارات ماسح الكائنات لإدارة دورة الحياة",
  "SILO uses a scanner process to check objects against all configured lifecycle management rules. High IO workloads or limited system resources may delay application of lifecycle management rules":
    "يستخدم SILO عملية مسح لفحص الكائنات وفق جميع قواعد إدارة دورة الحياة المعيّنة. وقد تؤخر أعباء الإدخال والإخراج المرتفعة أو محدودية موارد النظام تطبيق هذه القواعد.",
  "Lifecycle Management Lab": "تدريب عملي على إدارة دورة الحياة",
  "Use the MinIO client to demonstrate expiration rules, the scanner, and transitioning objects to remote tiers.":
    "استخدم عميل MinIO لعرض قواعد انتهاء الصلاحية والماسح ونقل الكائنات إلى طبقات التخزين البعيدة.",
  "What is etcd?": "ما هو etcd؟",
  "etcd is a strongly consistent, distributed key-value  store that provides a reliable way to store data that  needs to be accessed by a distributed system or  cluster of machines.":
    "etcd هو مخزن ذو قيمة رئيسية متسق وموزع يوفر طريقة موثوقة لتخزين البيانات التي يجب الوصول إليها بواسطة نظام موزع أو مجموعة من الأجهزة.",
  "What is the logger_webhook Environment Variable?":
    "ما هو logger_webhook متغير البيئة؟",
  "The top-level configuration key for defining an  HTTP webhook target for publishing SILO logs.":
    "مفتاح الإعدادات الأعلى مستوى لتعريف وجهة HTTP webhook لنشر سجلات SILO.",
  "Publish Server Logs to HTTP Webhook": "نشر سجلات الخادم إلى HTTP Webhook",
  "You can configure a new HTTP webhook endpoint  to which SILO publishes SILO server logs using  either environment variables or by setting  runtime configuration settings.":
    "يمكنك تكوين نقطة نهاية HTTP webhook جديدة والتي ينشر SILO عليها سجلات الخادم SILO باستخدام إما متغيرات البيئة أو عن طريق ضبط إعدادات تكوين وقت التشغيل.",
  "Monitoring Logs": "مراقبة السجلات",
  "SILO supports publishing server logs  and audit logs to an HTTP webhook.":
    "SILO يدعم نشر سجلات الخادم وسجلات التدقيق إلى خطاف الويب HTTP.",
  "Monitoring with Prometheus": "المراقبة بـ Prometheus",
  "Learn about the monitoring features available  in your MinIO Console and how to export to  Prometheus and get information back so you can  view it in detail.":
    "تعرّف على ميزات المراقبة المتاحة في لوحة تحكم MinIO، وكيفية تصدير البيانات إلى Prometheus واسترجاعها لعرضها بالتفصيل.",
  "Prometheus Monitoring Lab": "تدريب عملي على المراقبة باستخدام Prometheus",
  "Learn how to set up Prometheus and connect it  back to your MinIO cluster so that you can get  detailed history of what's going on in your MinIO  cluster at any given time.":
    "تعرّف على إعداد Prometheus وربطه بعنقود MinIO للحصول على سجل تفصيلي لما يحدث في العنقود في أي وقت.",
  "Publish Audit Logs to an HTTP webhook": "نشر سجلات التدقيق إلى HTTP webhook",
  "You can configure a new HTTP webhook endpoint  to which SILO publishes audit logs using either  environment variables or by setting runtime  configuration settings":
    "يمكنك تكوين نقطة نهاية HTTP webhook جديدة والتي SILO ينشر عليها سجلات التدقيق باستخدام إما متغيرات البيئة أو عن طريق تعيين إعدادات تكوين وقت التشغيل",
  "Publish Audit Logs to an External Service":
    "نشر سجلات التدقيق إلى خدمة خارجية",
  "Audit logs are granular descriptions of each operation  on the SILO deployment supporting security  standards and regulations which require  detailed tracking of operations.":
    "سجلات التدقيق عبارة عن أوصاف تفصيلية لكل عملية في نشر SILO الذي يدعم المعايير واللوائح الأمنية التي تتطلب تتبعًا تفصيليًا للعمليات.",
  "Publish Events to Kafka": "نشر الأحداث على Kafka",
  "SILO supports publishing bucket notification events to a Kafka service endpoint.":
    "يدعم SILO نشر أحداث إشعارات الحاويات إلى نقطة نهاية خدمة Kafka.",
  "Kafka Service for Bucket Notifications": "خدمة Kafka لإشعارات الحاويات",
  "Learn about environment variables for configuring a Kafka service as a target for Bucket Nofitications.":
    "تعرّف على متغيرات البيئة لإعداد خدمة Kafka كوجهة لإشعارات الحاويات.",
  "Kafka Service Configuration Settings": "إعدادات خدمة Kafka",
  "Supported Bucket Notification Targets": "أهداف إشعارات الجرافة المدعومة",
  "Learn which notification targets are supported by SILO.":
    "تعرّف على وجهات الإشعارات التي يدعمها SILO.",
  "Bucket Notifications": "حاوية الإشعارات",
  "SILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events.":
    "تتيح إشعارات الحاويات في SILO للمسؤولين إرسال إشعارات إلى خدمات خارجية مدعومة عند وقوع أحداث معينة تخص الكائنات أو الحاويات.",
  "Need more help? Check out additional Troubleshooting options":
    "هل تحتاج إلى مزيد من المساعدة؟ تحقق من خيارات استكشاف الأخطاء وإصلاحها الإضافية",
  "Site Replication Prerequisite": "متطلبات النسخ المتماثل للمواقع",
  "Check that your setup meets the requirements to deploy Site Replication":
    "تأكد من أن الإعداد الخاص بك يلبي متطلبات نشر النسخ المتماثل للموقع",
  "Site replication configures multiple independent SILO deployments as a cluster of replicas called peer sites.":
    "يُعدّ النسخ المتماثل للمواقع عدة نشرات مستقلة من SILO كعنقود من النسخ يسمى المواقع النظيرة.",
  "Site Replication Overview": "نظرة عامة على النسخ المتماثل للمواقع",
  "See what changes are and are NOT replicated between peer sites":
    "اطّلع على التغييرات التي تُنسخ بين المواقع النظيرة وتلك التي لا تُنسخ",
  "Site Replication Tutorial": "دليل النسخ المتماثل للمواقع",
  "Learn how to set up site replication using Console and the SILO client (mc)":
    "تعرّف على إعداد النسخ المتماثل للمواقع باستخدام لوحة التحكم وعميل SILO ‏(mc).",
  "Transition from SILO to Azure": "الانتقال من SILO إلى Azure",
  "See the procedure to create a new object lifecycle management rule that transition objects from a SILO bucket to a remote storage tier on the Azure storage backend.":
    "اطّلع على خطوات إنشاء قاعدة جديدة لدورة حياة الكائنات تنقلها من حاوية SILO إلى طبقة تخزين بعيدة على Azure.",
  "Transition from SILO to GCS": "الانتقال من SILO إلى GCS",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Google Cloud Storage backend.":
    "اطّلع على خطوات إنشاء قاعدة جديدة لدورة حياة الكائنات تنقلها من حاوية SILO إلى طبقة تخزين بعيدة على Google Cloud Storage.",
  "Transition from SILO to S3": "الانتقال من SILO إلى S3",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Amazon Web Services S3 storage backend or an S3-compatible service.":
    "اطّلع على خطوات إنشاء قاعدة جديدة لدورة حياة الكائنات تنقلها من حاوية SILO إلى طبقة تخزين بعيدة على Amazon Web Services S3 أو خدمة متوافقة مع S3.",
  "Transition to Remote SILO Deployment": "الانتقال إلى البعيد SILO النشر",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a bucket on a primary SILO deployment to a bucket on a remote SILO deployment. ":
    "اطّلع على خطوات إنشاء قاعدة جديدة لدورة حياة الكائنات تنقلها من حاوية في نشرة SILO أساسية إلى حاوية في نشرة SILO بعيدة. ",
  "Object Lifecycle Management": "إدارة دورة حياة الكائن",
  "Use SILO Object Lifecycle Management to create rules for time or date based automatic transition or expiry of objects.":
    "استخدم إدارة دورة حياة الكائنات في SILO لإنشاء قواعد تنقل الكائنات أو تنهي صلاحيتها تلقائيًا استنادًا إلى المدة أو التاريخ.",
  "MinIO Feature Overview: Object Lifecycle Management":
    "نظرة عامة على ميزات MinIO: إدارة دورة حياة الكائنات",
  "Learn about MinIO's object lifecycle management capabilities.":
    "تعرف على إمكانيات إدارة دورة حياة الكائن MinIO.",
  "Lifecycle Management I - Tiers": "إدارة دورة الحياة 1 — طبقات التخزين",
  "In this video we will cover expiration and transition of objects to an alternate tier of storage.":
    "سنغطي في هذا الفيديو انتهاء صلاحية الكائنات وانتقالها إلى مستوى تخزين بديل.",
  Tiers: "طبقات التخزين",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Azure storage backend.":
    "اطّلع على خطوات إنشاء قاعدة جديدة لدورة حياة الكائنات تنقلها من حاوية SILO إلى طبقة تخزين بعيدة على Azure.",
  "Console Metrics Dashboard": "لوحة مؤشرات التحكم",
  "The SILO Console provides a point-in-time metrics dashboard by default, and also supports displaying time-series and historical data by querying a Prometheus service configured to scrape data from the SILO deployment.":
    "توفّر لوحة تحكم SILO افتراضيًا مؤشرات للحظة الحالية، كما تدعم عرض السلاسل الزمنية والبيانات التاريخية بالاستعلام من خدمة Prometheus المضبوطة لجمع البيانات من نشرة SILO.",
  "Available Metrics": "المقاييس المتوفرة",
  "Learn about the different Prometheus metrics published by SILO server":
    "تعرف على مقاييس Prometheus المختلفة التي ينشرها خادم SILO",
  "Metrics and Alerts": "القياسات والتنبيهات",
  "For historical metrics and analytics, SILO publishes cluster and node metrics using the Prometheus Data Model.":
    "بالنسبة للمقاييس والتحليلات التاريخية، SILO ينشر مقاييس الكتلة والعقدة باستخدام نموذج البيانات Prometheus.",
  "Learn about the monitoring features available  in your MinIO Console.":
    "تعرف على ميزات المراقبة المتوفرة في وحدة التحكم MinIO الخاصة بك.",
  "User Management": "إدارة المستخدمين",
  "Each user can have one or more assigned policies that explicitly list the actions and resources to which that user has access. Users can also inherit policies from the groups in which they have membership.":
    "يمكن أن يكون لكل مستخدم سياسة معينة واحدة أو أكثر تسرد بوضوح الإجراءات والموارد التي يمكن لهذا المستخدم الوصول إليها. يمكن للمستخدمين أيضًا وراثة السياسات من المجموعات التي لديهم عضوية فيها.",
  "Group Management": "إدارة المجموعة",
  "A group is a collection of users. Each group can have one or more assigned policies that explicitly list the actions and resources to which group members are allowed or denied access.":
    "المجموعة هي مجموعة من المستخدمين. يمكن أن يكون لكل مجموعة سياسة معينة واحدة أو أكثر تسرد بوضوح الإجراءات والموارد التي يُسمح لأعضاء المجموعة بالوصول إليها أو يُمنعون من الوصول إليها.",
  "MinIO Identity and Access Management: Part 3 - Interfacing with OpenID and LDAP":
    "إدارة الهوية والوصول في MinIO: الجزء 3 — الربط مع OpenID وLDAP",
  "This video is focused on interfacing with OpenID and LDAP to manage access to MinIO.":
    "يركز هذا الفيديو على الربط مع OpenID وLDAP لإدارة الوصول إلى MinIO.",
  "MinIO Authentication and Authorization Using OpenID and Keycloak":
    "المصادقة والتفويض في MinIO باستخدام OpenID وKeycloak",
  "In this video you will learn how to set up an OpenID service, Keycloak, to provide authentication and authorization as part of a MinIO deployment.":
    "ستتعلم في هذا الفيديو كيفية إعداد خدمة OpenID، Keycloak، لتوفير المصادقة والترخيص كجزء من نشر MinIO.",
  "Drive Healing": "إصلاح الأقراص",
  "The Drives section displays the healing status for a bucket.":
    "يعرض قسم الأقراص حالة إصلاح الحاوية.",
  "Erasure Coding": "تشفير المحو",
  "SILO Erasure Coding is a data redundancy and availability feature that allows SILO deployments to automatically reconstruct objects on-the-fly despite the loss of multiple drives or nodes in the cluster.":
    "ترميز المحو في SILO هو ميزة للتكرار والتوافر تتيح إعادة بناء الكائنات تلقائيًا أثناء التشغيل، حتى عند فقد عدة أقراص أو عقد في العنقود.",
  "Site Healing": "إصلاح الموقع",
  "Any SILO deployment in the site replication configuration can resynchronize damaged replica-eligible data from the peer with the most updated (“latest”) version of that data.":
    'يمكن لأي نشر SILO في تكوين النسخ المتماثل للموقع إعادة مزامنة البيانات التالفة المؤهلة للنسخ المتماثل من النظير باستخدام الإصدار الأحدث ("الأحدث") من تلك البيانات.',
  Healing: "شفاء",
  "SILO Automatically Heals Corrupt or Missing Data On-the-fly":
    "يصلح SILO البيانات التالفة أو المفقودة تلقائيًا أثناء التشغيل",
  "In this video, we will provide an overview of site-wide replication.":
    "سنقدم في هذا الفيديو نظرة عامة على النسخ المتماثل على مستوى الموقع.",
  Health: "حالة النظام",
  "The health section provides an interface for running a health diagnostic for the SILO Deployment. The report is generated on the deployment and downloaded directly to your browser.":
    "يوفر قسم الصحة واجهة لتشغيل التشخيص الصحي للنشر SILO. يتم إنشاء التقرير عند النشر وتنزيله مباشرة على متصفحك.",
  "IDP Docs": "وثائق موفّر الهوية",
  "SILO supports multiple external identity managers through OpenID Connect-Compatible Active Directory / LDAP":
    "يدعم SILO عدة أنظمة خارجية لإدارة الهوية عبر OpenID Connect وActive Directory / LDAP المتوافقين.",
  "Built-in SILO IDP": "موفّر الهوية المضمن في SILO",
  "SILO includes a built-in IDentity Provider (IDP) that provides core identity management functionality.":
    "يتضمن SILO موفّر هوية (IDP) مدمجًا يوفر الوظائف الأساسية لإدارة الهوية.",
  "Active Directory / LDAP Access Management":
    "Active Directory / LDAP إدارة الوصول",
  "For identities managed by the external AD/LDAP provider, SILO uses the user’s Distinguished Name and attempts to map it against an existing policy.":
    "بالنسبة للهويات التي يديرها الموفر الخارجي AD/LDAP، يستخدم SILO الاسم المميز للمستخدم ويحاول تعيينه مقابل سياسة موجودة.",
  "Keycloak configuration": "Keycloak التكوين",
  "You can configure SILO to use Keycloak as an external IDentity Provider (IDP) for authentication of users via the OpenID Connect (OIDC) protocol.":
    "يمكن إعداد SILO لاستخدام Keycloak كموفّر هوية خارجي لمصادقة المستخدمين عبر بروتوكول OpenID Connect ‏(OIDC).",
  "LDAP Configuration": "إعدادات LDAP",
  "SILO supports configuring a single Active Directory / LDAP Connect for external management of user identities.":
    "يدعم SILO إعداد اتصال واحد بخدمة Active Directory / LDAP لإدارة هويات المستخدمين خارجيًا.",
  "OIDC Configuration": "إعدادات OIDC",
  "SILO supports using an OpenID Connect (OIDC) compatible IDentity Provider (IDP) such as Okta, KeyCloak, Dex, Google, or Facebook for external management of user identities.":
    "يدعم SILO موفّري هوية متوافقين مع OpenID Connect ‏(OIDC)، مثل Okta وKeycloak وDex وGoogle وFacebook، لإدارة هويات المستخدمين خارجيًا.",
  "KMS overview": "KMS نظرة عامة\nيشارك خبير التشفير",
  "MinIO's cryptographic expert shares why MinIO built KES, what it is used for and how it fits into the MinIO architecture.":
    "MinIO سبب بناء MinIO KES، وما يتم استخدامه من أجله وكيف يتناسب مع بنية MinIO.",
  "Learn about key management using KMS.":
    "تعرف على إدارة المفاتيح باستخدام KMS.",
  "Text snippet that will be relevant to the user will  go here  made to look nice in the helpitem size  on two-three lines":
    "سيتم وضع المقتطف النصي الذي سيكون ذا صلة بالمستخدم هنا ليبدو جميلًا في حجم عنصر المساعدة في سطرين أو ثلاثة أسطر",
  "Error logs can be filtered by node and log type, as well as search for specific text in the logs.":
    "يمكن تصفية سجلات الأخطاء حسب العقدة ونوع السجل، بالإضافة إلى البحث عن نص محدد في السجلات.",
  "Audit Logs": "سجلات التدقيق",
  "You can configure an HTTP webhook endpoint to which SILO publishes audit logs using either environment variables or by setting runtime configuration settings.":
    "يمكنك تكوين نقطة نهاية خطاف الويب HTTP التي ينشر SILO عليها سجلات التدقيق باستخدام إما متغيرات البيئة أو عن طريق تعيين إعدادات تكوين وقت التشغيل.",
  "Object Lambda": "دوال Lambda للكائنات",
  "SILO’s Object Lambda enables developers to programmatically transform objects on demand.":
    "تتيح دوال Lambda للكائنات في SILO للمطورين تحويل الكائنات برمجيًا عند الطلب.",
  "MinIO Event Notifications - Overview": "إشعارات أحداث MinIO — نظرة عامة",
  "Use the Event framework to see what's going on in the system using Bucket, Object, Replication and ILM events.":
    "استخدم إطار عمل الأحداث لمعرفة ما يحدث في النظام من خلال أحداث الحاويات والكائنات والنسخ المتماثل وإدارة دورة الحياة.",
  "Managing Event Notifications Using MinIO MC Commands":
    "إدارة إشعارات الأحداث باستخدام أوامر MinIO MC",
  "This video provides an overview of the types of event notifications and how to set them up using MinIO's mc commands.":
    "يقدم هذا الفيديو نظرة عامة على أنواع إشعارات الأحداث وكيفية إعدادها باستخدام أوامر MinIO mc.",
  "MinIO Events Notifications - Setting Up Webhooks Using Python":
    "إشعارات أحداث MinIO — إعداد Webhooks باستخدام Python",
  "This video provides an overview of how to use Python and Flask to set up a Webhook on MinIO. ":
    "يقدم هذا الفيديو نظرة عامة حول كيفية استخدام Python وFlask لإعداد Webhook على MinIO.",
  "MinIO Event Notifications - Using The MinIO Python SDK to Write Custom Webhooks":
    "إشعارات أحداث MinIO — استخدام حزمة MinIO Python SDK لكتابة Webhooks مخصصة",
  "This video dives deeper into using the MinIO Python SDK to setup and manage notifications.":
    "يتناول هذا الفيديو بتفصيل أكبر إعداد الإشعارات وإدارتها باستخدام حزمة MinIO Python SDK.",
  "Object Management": "إدارة الكائنات",
  "Learn about Objects and how  SILO allows you to manage them":
    "تعرف على الكائنات وكيف يسمح لك SILO بإدارتها",
  "Managing Objects with the Object Browser":
    "إدارة الكائنات باستخدام متصفح الكائنات",
  "Learn how to use the Console Object Browser  to manage your Objects":
    "تعرّف على استخدام متصفح الكائنات في لوحة التحكم لإدارة كائناتك.",
  "Manipulating Objects": "التعامل مع الكائنات",
  "A demo of Prefixes & Objects with examples of copying and deleting an object, as well as CopySource Object.":
    "عرض توضيحي للبادئات والكائنات، يتضمن أمثلة لنسخ الكائنات وحذفها، وكذلك كائن CopySource.",
  "Example Policy - Bucket Resource Access":
    "مثال سياسة — الوصول إلى موارد الحاوية",
  "An example policy demonstrating authorization  limited to a named bucket":
    "مثال سياسة يوضح تقييد التفويض بحاوية ذات اسم محدد.",
  Performance: "الأداء",
  "The performance section provides an interface for running a performance test of the deployment.":
    "قسم الأداء يوفر واجهة لتشغيل اختبار أداء النشر.",
  Profile: "الملف التعريفي",
  "The profile section provides an interface for running system profiling of the deployment. The results can provide insight into the SILO server process running on a given node.":
    "يوفر قسم الملف الشخصي واجهة لتشغيل ملف تعريف النظام الخاص بالنشر. يمكن أن توفر النتائج نظرة ثاقبة لعملية الخادم SILO التي تعمل على عقدة معينة.",
  Inspect: "فحص",
  "The inspect section provides an interface for capturing the erasure-coded metadata associated to an object or objects.":
    "يوفر قسم الفحص واجهة لالتقاط البيانات الوصفية المرمّزة بترميز المحو والمرتبطة بكائن واحد أو عدة كائنات.",
  "Encrypt Inspect Output": "تشفير نتائج الفحص",
  "You can encrypt the output of the mc support inspect command for enhanced security when transferring the files off the deployment.":
    "يمكنك تشفير مخرجات الأمر mc support inspect لتعزيز الأمان عند نقل الملفات خارج النشر.",
  "What is Trace?": "ما هو التتبع؟",
  "The trace section provides HTTP trace functionality for a bucket or buckets on the deployment.":
    "يوفر قسم التتبع HTTP وظيفة التتبع لحاوية أو حاويات عند النشر.",
  Users: "المستخدمون",
  "What is Watch?": "ما هي الساعة؟",
  "The Watch section displays S3 events as they occur on the selected bucket.":
    "يعرض قسم المراقبة أحداث S3 عند وقوعها في الحاوية المحددة.",
  "Access Managemnt": "إدارة الوصول",
  "Object Locking": "قفل الكائنات",
  "SILO Object Locking (“Object Retention”) enforces Write-Once Read-Many (WORM) immutability to protect versioned objects from deletion.":
    'SILO قفل الكائنات ("الاحتفاظ بالكائن") يفرض ثبات الكتابة مرة واحدة للقراءة المتعددة (WORM) لحماية الكائنات التي تم إصدارها من الحذف.',
  Encryption: "التشفير",
  "SILO Server-Side Encryption (SSE) protects objects as part of write operations, allowing clients to take advantage of server processing power to secure objects at the storage layer (encryption-at-rest).":
    "يحمي التشفير من جانب الخادم (SSE) في SILO الكائنات أثناء الكتابة، ليستفيد العملاء من قدرة معالجة الخادم على تأمين الكائنات في طبقة التخزين، أي تشفير البيانات أثناء السكون.",
  "Learn how to use Console to manage Buckets":
    "تعرف على كيفية استخدام وحدة التحكم لإدارة الجرافات",
  "Bucket Replication": "نسخ الحاوية",
  "SILO server-side bucket replication is an automatic bucket-level configuration that synchronizes objects between a source and destination bucket.":
    "النسخ المتماثل للحاويات من جانب الخادم في SILO إعداد تلقائي على مستوى الحاوية يزامن الكائنات بين حاوية مصدر وحاوية وجهة.",
  "This video gives an overview of how to set up and use object versioning as part of a data lifecycle management strategy.":
    "يقدم هذا الفيديو نظرة عامة على إعداد إدارة إصدارات الكائنات واستخدامها ضمن استراتيجية إدارة دورة حياة البيانات.",
  "Versioning Lab": "تدريب عملي على إدارة الإصدارات",
  "This demo will take you through the steps to manage versioned objects using the MinIO command line tools.":
    "سيأخذك هذا العرض التوضيحي عبر خطوات إدارة الكائنات التي تم إصدارها باستخدام أدوات سطر الأوامر MinIO.",
  "Bucket Replication Requirements": "متطلبات نسخ الجرافة",
  "Check here to ensure you meet the prerequisites before setting up any replication configurations.":
    "ضع علامة هنا للتأكد من استيفاء المتطلبات الأساسية قبل إعداد أي تكوينات للنسخ المتماثل.",
  "Bucket Replication Overview": "نظرة عامة على النسخ المتماثل للجرافة",
  "In this video, we will cover bucket level replication, both active-passive and active-active.":
    "في هذا الفيديو، سنغطي النسخ المتماثل على مستوى الجرافة، سواء النشط أو السلبي أو النشط.",
  "Replication Lab I": "تدريب عملي على النسخ المتماثل 1",
  "Demonstrates bucket replication concepts using MinIO Client, including active-passive and active-active replication.":
    "يوضّح مفاهيم النسخ المتماثل للحاويات باستخدام عميل MinIO، بما فيها النسخ النشط-السلبي والنشط-النشط.",
  "Replication Lab II": "تدريب عملي على النسخ المتماثل 2",
  "Demonstrates site replication concepts using MinIO Client, including active-passive and active-active replication.":
    "يوضّح مفاهيم النسخ المتماثل للمواقع باستخدام عميل MinIO، بما فيها النسخ النشط-السلبي والنشط-النشط.",
  "Access Management": "إدارة الوصول",
  "Logging in": "تسجيل الدخول",
  "Sign in with the root credentials, an IAM user access key, or temporary STS credentials via Other Authentication Methods.":
    "قم بتسجيل الدخول باستخدام بيانات اعتماد الجذر، أو مفتاح وصول المستخدم IAM، أو بيانات اعتماد STS المؤقتة عبر طرق المصادقة الأخرى.",
  "Console configuration": "إعدادات لوحة التحكم",
  "Configure identity providers, TLS, and session settings for the console on the server side.":
    "اضبط موفّري الهوية وTLS وإعدادات جلسات لوحة التحكم على جانب الخادم.",
  "Replication Internals": "تفاصيل عمل النسخ المتماثل",
  "Learn details of the SILO replication process.":
    "تعرّف على تفاصيل عملية النسخ المتماثل في SILO.",
  "One-way Bucket Replication": "النسخ المتماثل للحاويات باتجاه واحد",
  "Guidance on configuring one-way Bucket replication using SILO Console.":
    "إرشادات إعداد النسخ المتماثل للحاويات باتجاه واحد باستخدام لوحة تحكم SILO.",
  "Two-way Bucket Replication": "النسخ المتماثل للحاويات باتجاهين",
  "Guidance on configuring two-way (active-active) Bucket replication using SILO Console.":
    "إرشادات إعداد النسخ المتماثل للحاويات باتجاهين، بنمط نشط-نشط، باستخدام لوحة تحكم SILO.",
};

export default messages;
