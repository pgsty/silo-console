// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
// AI-assisted translation; see ../../README.md for review and maintenance.

import type { Dictionary } from "../../catalog";

const messages: Dictionary = {
  "Users inherit policies from their groups. Access is denied unless explicitly granted.":
    "يرث المستخدمون السياسات من مجموعاتهم. تم رفض الوصول ما لم يتم منحه صراحة.",
  "Policies define allowed actions and resources for users and groups.":
    "السياسات تحدد الإجراءات والموارد المسموح بها للمستخدمين والمجموعات.",
  "IAM policies": "سياسات IAM",
  "Access keys inherit their parent user’s permissions. An inline policy can only restrict them further.":
    "ترث مفاتيح الوصول صلاحيات المستخدم الأصلي. ولا يمكن للسياسة المضمنة إلا تقييد هذه الصلاحيات أكثر.",
  "Access keys": "مفاتيح الوصول",
  "Configure a destination, then add bucket notification rules to send S3 events to it.":
    "اضبط وجهة، ثم أضف قواعد إشعارات الحاويات لإرسال أحداث S3 إليها.",
  "Event destinations": "وجهات الأحداث",
  "SILO version": "إصدار SILO",
  "Raw JSON": "JSON الخام",
  "Recursive inspections can be expensive. Limit the bucket and path before starting.":
    "قد يستهلك الفحص المتكرر موارد كبيرة. حدّد الحاوية والمسار قبل البدء.",
  "Open Help for examples, or read the":
    "افتح المساعدة للحصول على أمثلة، أو اقرأ",
  Tasks: "المهام",
  "Tasks: {count} running": "المهام: {count} قيد التشغيل",
  "Close Tasks": "إغلاق المهام",
  "Object operations": "عمليات الكائن",
  Running: "قيد التشغيل",
  Finished: "انتهى",
  Queued: "في قائمة الانتظار",
  Completed: "اكتملت",
  "No running tasks": "لا يوجد مهام قيد التشغيل",
  "No finished tasks": "لم يتم الانتهاء من المهام",
  "Clear finished": "مسح المكتملة",
  "ZIP download": "تنزيل ZIP",
  "Browser handoff": "تسليم المتصفح",
  "Task progress": "تقدم المهمة",
  "Waiting for data": "في انتظار البيانات",
  "Remove task": "إزالة المهمة",
  "Cancel task": "إلغاء المهمة",
  "Retry failed": "إعادة محاولة الفاشلة",
  "Open bucket/prefix": "فتح الحاوية/البادئة",
  "{done}/{total} completed · {failed} failed · {cancelled} cancelled":
    "{done}/{total} مكتمل · {failed} فاشل · {cancelled} تم الإلغاء",
  "{bytes} bytes received": "تم استلام {bytes} بايت",
  "Handoff is complete; final download progress is unavailable here.":
    "اكتملت عملية التسليم؛ تقدم التنزيل النهائي غير متاح هنا.",
  "Counts represent selected targets. Progress within a folder or version cleanup is unavailable.":
    "الأعداد تمثل الأهداف المختارة. التقدم داخل مجلد أو تنظيف الإصدار غير متوفر.",
  "Completed changes remain in place. In-flight requests may have reached the server; inspect before repeating them.":
    "التغييرات المكتملة باقية. قد تكون الطلبات الجارية قد وصلت إلى الخادم؛ افحصها قبل تكرارها.",
  "Review {count} results": "مراجعة {count} نتائج",
  "Server outcome is unconfirmed. Inspect this object before another operation.":
    "نتيجة السيرفر غير مؤكدة. فحص هذا الكائن قبل عملية أخرى.",
  "Task failed: {name}": "فشلت المهمة: {name}",
  "Task completed: {name}": "انتهت المهمة: {name}",
  "Open Tasks to inspect the results.": "فتح المهام لمعاينة النتائج.",
  "The request failed. Inspect the object before trying again.":
    "فشل الطلب. افحص الكائن قبل المحاولة مرة أخرى.",
  "Tasks are still running": "المهام مازالت جارية",
  "Stay here": "البقاء في هذه الصفحة",
  "Cancel tasks and leave": "إلغاء المهام والمغادرة",
  "Leave page": "اترك الصفحة",
  "Leaving this session cancels queued and running tasks. Changes already completed on the server remain in place.":
    "يؤدي ترك هذه الجلسة إلى إلغاء المهام الموجودة في قائمة الانتظار والمهام قيد التشغيل. تظل التغييرات المكتملة بالفعل على الخادم سارية.",
  "Tasks will continue in this session. You can check their progress in Tasks on another page.":
    "ستستمر المهام في هذه الجلسة. يمكنك التحقق من تقدمهم في المهام على صفحة أخرى.",
  "Delete Versions": "حذف الإصدارات",
  "Cluster health": "حالة العنقود",
  "servers online": "خوادم متصلة",
  "{count} drives online": "{count} أقراص متصلة",
  "{count} server(s) offline": "عدد الخوادم غير المتصلة: {count}",
  "{count} drive(s) offline": "عدد الأقراص غير المتصلة: {count}",
  "{count} drive(s) healing": "عدد الأقراص الجاري إصلاحها: {count}",
  "Drive {drive} is at least 95% full. The server may reject writes.":
    "القرص {drive} ممتلئ بنسبة 95% على الأقل. قد يرفض الخادم عمليات الكتابة.",
  "Drive {drive} is at least 85% full.":
    "القرص {drive} ممتلئ بنسبة 85% على الأقل.",
  "Configuration changes are waiting for a server restart.":
    "تغييرات التكوين في انتظار إعادة تشغيل الخادم.",
  "Some server or drive health information is unavailable.":
    "بعض معلومات حالة الخوادم أو الأقراص غير متاحة.",
  "Capacity is incomplete. Only reported drive measurements are shown.":
    "السعة غير مكتملة. يتم عرض قياسات محرك الأقراص المبلغ عنها فقط.",
  "Generate health report": "إنشاء تقرير حالة النظام",
  "No servers reported": "لم يتم الإبلاغ عن أي خوادم",
  Server: "خادم",
  "Just started": "بدأ للتو",
  "Hide drives for {server}": "إخفاء أقراص {server}",
  "Show drives for {server}": "عرض أقراص {server}",
  "No drive information available": "لا تتوفر معلومات عن الأقراص",
  "Drives on {server}": "الأقراص في {server}",
  "{used} / {total} used": "{used} / {total} مستخدم",
  "Drive usage: {drive}": "استخدام القرص: {drive}",
  "Refresh failed. The last received data is still shown.":
    "فشل التحديث. لا يزال يتم عرض آخر البيانات المستلمة.",
  "Could not load deployment information. Try refreshing.":
    "تعذر تحميل معلومات النشر. حاول التحديث.",
  "Deployment statistics": "إحصائيات النشر",
  "of {total} raw capacity": "من إجمالي السعة الخام البالغة {total}",
  "{available} available": "{available} متاح",
  Data: "بيانات",
  objects: "كائنات",
  Alerts: "التنبيهات",
  "Health information unavailable": "المعلومات الصحية غير متوفرة",
  "All systems normal": "جميع الأنظمة عادية",
  "Quick actions": "إجراءات سريعة",
  "No quick actions available for your permissions.":
    "لا توجد إجراءات سريعة متاحة لأذوناتك.",
  "Read & write": "قراءة وكتابة",
  "Delete bucket": "حذف الحاوية",
  "Actions for {bucket}": "إجراءات لـ {bucket}",
  "Select {bucket}": "تحديد {bucket}",
  "Object lock": "قفل الكائن",
  Created: "أنشئ",
  "Select all visible buckets": "تحديد جميع الحاويات الظاهرة",
  "Bucket rows": "صفوف الحاويات",
  "The bucket list could not be loaded.": "تعذّر تحميل قائمة الحاويات.",
  "Select one or more buckets first.": "اختر حاوية واحدة أو أكثر أولًا.",
  "configure the selected buckets": "إعداد الحاويات المحددة",
  "Search buckets": "بحث في الحاويات",
  "Bucket view": "عرض حاوية",
  Cards: "بطاقات",
  "{count} buckets selected": {
    zero: "الحاويات المحددة: {count}",
    one: "حاوية واحدة محددة ({count})",
    two: "حاويتان محددتان ({count})",
    few: "{count} حاويات محددة",
    many: "{count} حاوية محددة",
    other: "{count} حاوية محددة",
  },
  "{count} bucket selected": "{count} حاوية محددة",
  "No buckets match “{q}”": "لا توجد حاويات تطابق «{q}»",
  "Clear filter": "مسح التصفية",
  "Built-in · Modified": "مدمج · تم التعديل",
  "Actions for {name}": "إجراءات لـ {name}",
  "Reset to default": "استعادة الافتراضي",
  "Could not load policies": "تعذر تحميل السياسات",
  "Refresh to try again.": "قم بالتحديث للمحاولة مرة أخرى.",
  "Create a policy to define permissions for users and groups.":
    "أنشئ سياسة لتحديد صلاحيات المستخدمين والمجموعات.",
  "Could not update policy": "تعذر تحديث السياسة",
  "Reset policy {name} to its default definition?":
    "هل تريد إعادة السياسة {name} إلى تعريفها الافتراضي؟",
  "The built-in policy will be restored to the SILO default definition.":
    "ستُستعاد السياسة المضمنة إلى تعريف SILO الافتراضي.",
  "Loading attachment information…": "جارٍ تحميل معلومات الارتباط…",
  "This policy has changed or is no longer available. Refresh the list.":
    "تغيّرت هذه السياسة أو لم تعد متاحة. حدّث القائمة.",
  "Attachment information is unavailable.": "معلومات الارتباط غير متاحة.",
  "This policy is attached to {users} users and {groups} groups.":
    "ترتبط هذه السياسة بعدد {users} من المستخدمين و{groups} من المجموعات.",
  "Their permissions will follow the default definition.":
    "ستتبع أذوناتهم التعريف الافتراضي.",
  "They will lose the permissions it grants.": "سيفقدون الأذونات التي يمنحها.",
  "Could not load policy. Refresh to try again.":
    "تعذر تحميل السياسة. قم بالتحديث للمحاولة مرة أخرى.",
  "Could not load policy": "تعذر تحميل السياسة",
  "Could not load users for this policy": "تعذر تحميل المستخدمين لهذه السياسة",
  "Could not load groups for this policy": "تعذر تحميل المجموعات لهذه السياسة",
  "Built-in policies can be overridden by saving a modified version; you can reset it later.":
    "يمكن تجاوز السياسات المضمنة عن طريق حفظ نسخة معدلة؛ يمكنك إعادة تعيينه لاحقًا.",
  "Override policy": "تجاوز السياسة",
  "Cancel editing": "إلغاء التعديل",
  "Direct policies": "السياسات المباشرة",
  "Policies inherited through groups": "السياسات الموروثة من المجموعات",
  "Access-key count is unavailable.": "عدد مفاتيح الوصول غير متاح.",
  "Group policy information is unavailable.":
    "معلومات سياسة المجموعة غير متوفرة.",
  "Also assigned directly": "تم تعيينه مباشرة أيضًا",
  "From groups:": "من المجموعات:",
  "Group policies could not be loaded.": "لا يمكن تحميل سياسات المجموعة.",
  "Group is disabled; its policies are not inherited.":
    "المجموعة معطلة؛ فسياساتها ليست موروثة.",
  "Group status is unavailable; inherited permissions are unknown.":
    "حالة المجموعة غير متاحة؛ الأذونات الموروثة غير معروفة.",
  "No inherited group policies": "لا توجد سياسات موروثة من المجموعات",
  "Some group policies are unavailable. Refresh to try again.":
    "بعض سياسات المجموعات غير متاحة. حدّث الصفحة لإعادة المحاولة.",
  "Could not load user": "تعذر تحميل المستخدم",
  "Could not update user status": "لا يمكن تحديث حالة المستخدم",
  "Edit replication": "تعديل النسخ المتماثل",
  "Page not found": "الصفحة غير موجودة",
  "Go to Buckets": "اذهب إلى الحاويات",
  "Go back": "ارجع",
  "Read the documentation": "إقرأ التوثيق",
  "You do not have permission to view this page":
    "ليس لديك صلاحية مشاهدة هذه الصفحة",
  "Ask your administrator for access. This page checks the following IAM actions:":
    "اطلب صلاحية الوصول من المسؤول. تتحقق هذه الصفحة من إجراءات IAM التالية:",
  "Required IAM actions": "إجراءات IAM المطلوبة",
  "Encryption is not configured": "لم يتم تكوين التشفير",
  "Configure KES or KMS on the SILO server to manage encryption keys in Console.":
    "اضبط KES أو KMS على خادم SILO لإدارة مفاتيح التشفير في لوحة التحكم.",
  "Local identity management is unavailable": "إدارة الهوية المحلية غير متوفرة",
  "LDAP is enabled. Manage users and groups in your LDAP directory; connection settings are available on the LDAP configuration page.":
    "خدمة LDAP مفعّلة. أدِر المستخدمين والمجموعات في دليل LDAP؛ وتتوفر إعدادات الاتصال في صفحة إعداد LDAP.",
  "Tier creation is unavailable": "إنشاء الطبقة غير متاح",
  "This Console requires a distributed server setup to add a remote storage tier.":
    "تتطلب وحدة التحكم هذه إعداد خادم موزع لإضافة طبقة تخزين عن بعد.",
  "This page is unavailable in object browser mode":
    "هذه الصفحة غير متاحة في وضع متصفح الكائنات",
  "This Console is configured for object browsing only. Ask your administrator to enable the full Console to use this page.":
    "تم تكوين وحدة التحكم هذه لتصفح الكائنات فقط. اطلب من المسؤول تمكين وحدة التحكم الكاملة لاستخدام هذه الصفحة.",
  "Prometheus is configured but unreachable":
    "Prometheus تم تكوينه ولكن لا يمكن الوصول إليه",
  "Check the Prometheus address, network access and authentication, then retry.":
    "تحقق من عنوان Prometheus والوصول إلى الشبكة والمصادقة، ثم أعد المحاولة.",
  "Advanced metrics need Prometheus": "المقاييس المتقدمة تحتاج إلى Prometheus",
  "Configure Prometheus to collect SILO metrics, then set the URL for your deployment and restart the corresponding service.":
    "قم بتكوين Prometheus لجمع SILO المقاييس، ثم قم بتعيين URL للنشر الخاص بك وأعد تشغيل الخدمة المقابلة.",
  "Standalone Console": "لوحة تحكم مستقلة",
  "Console embedded in SILO": "لوحة التحكم المضمنة في SILO",
  "Optional standalone settings": "الإعدادات الاختيارية المستقلة",
  "Bearer token: ": "رمز Bearer: ",
  "Or basic authentication: ": "أو المصادقة الأساسية:",
  "Embedded settings: ": "الإعدادات المضمنة:",
  Icons: "الأيقونات",
  "Create bucket": "إنشاء حاوية",
  "Edit {label}": "تعديل {label}",
  "Calculating…": "جاري الحساب…",
  "The server has not finished computing usage yet.":
    "لم ينتهِ الخادم من حساب الاستخدام بعد.",
  "Calculated {time}": "تم الحساب {time}",
  "Updated {time}": "تم التحديث {time}",
  "Permission required": "مطلوب إذن",
  "Ask your administrator to grant the following IAM actions.":
    "اطلب من المسؤول منح إجراءات IAM التالية.",
  "More actions": "المزيد من الإجراءات",
  "Equivalent mcli command": "أمر mcli المكافئ",
  Copied: "تم النسخ",
  "Copy failed. Select and copy the command.": "فشل النسخ. حدد ونسخ الأمر.",
  "Copy commands": "نسخ الأوامر",
  "Replace ALIAS with your configured mcli alias (for example, {alias}).":
    "استبدل ALIAS بالاسم المستعار mcli الذي تم تكوينه (على سبيل المثال، {alias}).",
  "Replace ALIAS with your configured mcli alias.":
    "استبدل ALIAS بالاسم المستعار mcli الذي تم تكوينه.",
  "Loading…": "جاري التحميل…",
  "SILO primitives": "مكوّنات SILO الأساسية",
  "Shared building blocks for storage, identity and monitoring.":
    "وحدات بناء مشتركة للتخزين والهوية والمراقبة.",
  "Healthy capacity": "سعة سليمة",
  "Capacity warning": "تحذير السعة",
  "Above the 85% warning threshold": "فوق عتبة التحذير 85%",
  "Capacity critical": "سعة حرجة",
  "Above the 95% critical threshold": "فوق العتبة الحرجة 95%",
  "Usage is calculated by the server.": "يتم احتساب الاستخدام من قبل السيرفر.",
  "View buckets": "عرض الحاويات",
  "Status and values": "الحالة والقيم",
  "Built-in": "مدمج",
  "Freshness and actions": "حداثة البيانات والإجراءات",
  "Select an object to inspect its details.": "حدد كائنًا لتفحص تفاصيله.",
  "Object details": "تفاصيل الكائن",
  "Demo action completed.": "اكتمل الإجراء التجريبي.",
  "Select an object to download.": "حدد كائنًا لتنزيله.",
  "Empty and unavailable states": "حالات الفراغ وعدم التوفر",
  "No buckets yet": "لا توجد حاويات بعد",
  "Create a bucket to start storing objects.":
    "أنشئ حاوية لبدء تخزين الكائنات.",
  "No matching objects": "لا توجد كائنات مطابقة",
  "Try a different name or clear the search filter.":
    "جرب اسمًا مختلفًا أو امسح فلتر البحث.",
  "Metrics are unavailable": "المقاييس غير متوفرة",
  "Connect a Prometheus endpoint to view monitoring metrics.":
    "اربط نقطة نهاية Prometheus لعرض مؤشرات المراقبة.",
  "Loading rows": "تحميل الصفوف",
  "Command preview": "معاينة الأمر",
  "Showing the first 1 MiB. Download the object to see the full file.":
    "عرض أول 1 ميجابايت. قم بتنزيل الكائن لرؤية الملف الكامل.",
  "Showing first 500 rows": "عرض أول 500 صف",
  "Showing the first 100 columns. View Source or download the object to see all columns.":
    "إظهار أول 100 عمود. قم بعرض المصدر أو تنزيل الكائن لرؤية كافة الأعمدة.",
  Rendered: "معروض",
  "Wrap lines": "التفاف الأسطر",
  Row: "صف",
  "CSV preview content": "محتوى معاينة CSV",
  "Markdown preview content": "محتوى معاينة Markdown",
  "Markdown rendering is unavailable for this content. Showing the source instead.":
    "تعذّر عرض تنسيق Markdown لهذا المحتوى. يُعرض النص المصدري بدلًا من ذلك.",
  "Image: {alt}": "صورة: {alt}",
  Image: "صورة",
  Actions: "الإجراءات",
  "Select version": "إختر النسخة",
  "This version is a delete marker.": "هذا الإصدار هو علامة حذف.",
  "You need s3:GetObject permission.": "أنت بحاجة إلى إذن s3:GetObject.",
  "You need s3:GetObjectVersion permission.":
    "تحتاج إلى صلاحية s3:GetObjectVersion.",
  "Preview is not available for this file type.":
    "المعاينة غير متاحة لهذا النوع من الملفات.",
  "Object Lock is not enabled on this bucket.":
    "قفل العناصر غير مفعّل في هذه الحاوية.",
  "You need s3:PutObjectLegalHold permission.":
    "أنت بحاجة إلى إذن s3:PutObjectLegalHold.",
  "You need s3:PutObjectRetention permission.":
    "أنت بحاجة إلى إذن s3:PutObjectRetention.",
  "Tags can only be changed on the current version.":
    "لا يمكن تغيير العلامات إلا في الإصدار الحالي.",
  "Versioning is not enabled on this bucket.":
    "إدارة الإصدارات غير مفعّلة في هذه الحاوية.",
  "Select one or more objects first.": "حدد كائنًا واحدًا أو أكثر أولاً.",
  "Select a single object first.": "حدد كائنًا واحدًا أولاً.",
  "Select a file instead of a folder.": "حدد ملفًا بدلاً من المجلد.",
  "Select a folder to change anonymous access.":
    "حدد مجلدًا لتغيير الوصول المجهول.",
  "Open the current object to use this action.":
    "افتح الكائن الحالي لاستخدام هذا الإجراء.",
  "This action requires a distributed server.":
    "يتطلب هذا الإجراء خادمًا موزعًا.",
  "You need s3:PutObjectTagging permission.":
    "أنت بحاجة إلى إذن s3:PutObjectTagging.",
  "You need admin:InspectData permission.": "تحتاج إلى إذن admin:InspectData.",
  "You need permission to view object versions.":
    "أنت بحاجة إلى إذن لعرض إصدارات الكائن.",
  "You need s3:DeleteObject permission.": "أنت بحاجة إلى إذن s3:DeleteObject.",
  "You need permission to change the bucket policy.":
    "تحتاج إلى إذن لتغيير سياسة الحاوية.",
  "You need permission to read objects and bucket versioning.":
    "تحتاج إلى إذن لقراءة الكائنات وإدارة إصدارات الحاوية.",
  "You need s3:ListBucket permission.": "تحتاج إلى إذن s3:ListBucket.",
  "You need permission to restore this version.":
    "تحتاج إلى إذن لاستعادة هذا الإصدار.",
  "You need permission to select this version.":
    "تحتاج إلى إذن لتحديد هذا الإصدار.",
  "You need permission to delete object versions.":
    "تحتاج إلى إذن لحذف إصدارات العناصر.",
  "Exit rewind mode to refresh the object list.":
    "اخرج من وضع الاسترجاع الزمني لتحديث قائمة الكائنات.",
  "There are no non-current versions to delete.":
    "لا توجد إصدارات غير حالية لحذفها.",
  "Invalid Endpoint": "نقطة نهاية غير صالحة",
  Broker: "وسيط",
  QOS: "QOS",
  "Client ID": "معرّف العميل",
  "Client Secret": "سر العميل",
  "Redirect URI": "عنوان URI لإعادة التوجيه",
  "Lookup Bind DN": "DN الربط للبحث",
  "Lookup Bind Password": "كلمة مرور ربط البحث",
  "User DN Search Base": "قاعدة البحث عن DN للمستخدم",
  "User DN Search Filter": "مرشّح البحث عن DN للمستخدم",
  "Group Search Base DN": "قاعدة بحث المجموعة DN",
  "Group Search Filter": "فلتر بحث المجموعة",
  "Sign Out": "تسجيل الخروج",
  "Remove transfer": "إزالة النقل",
  "Cancel transfer": "إلغاء التحويل",
  "This download has already started. Dismiss its transfer entry to start it again.":
    "بدأ هذا التنزيل بالفعل. أزِل سجل النقل الخاص به لبدئه من جديد.",
  "Track or cancel this download in your browser's download manager.":
    "قم بتتبع هذا التنزيل أو إلغائه في مدير التنزيلات بمتصفحك.",
  "For selections above 5 GiB or of unknown size, MCLI is recommended. This ZIP will stream without buffering in memory.":
    "للتحديدات التي يزيد حجمها عن 5 جيجا بايت أو ذات حجم غير معروف، يوصى بـ MCLI. سيتم بث ZIP بدون تخزين مؤقت في الذاكرة.",
  "Set lifecycle": "تعيين دورة الحياة",
  "Set replication": "تعيين النسخ المتماثل",
  "Refresh buckets": "تحديث الحاويات",
  "Close details": "إغلاق التفاصيل",
  "Copy share URL": "نسخ رابط المشاركة",
  "Select multiple versions": "حدد إصدارات متعددة",
  "Delete selected versions": "حذف الإصدارات المحددة",
  "Delete non-current versions": "حذف الإصدارات غير الحالية",
  "Copy code": "انسخ الكود",
  "Delete group": "حذف المجموعة",
  "Refresh list": "تحديث القائمة",
  "Copy path": "نسخ المسار",
  "Delete user": "حذف المستخدم",
  "Change password": "تغيير كلمة المرور",
  "Copy {label}": "نسخ {label}",
  "Add site": "اضافة موقع",
  "Remove site": "إزالة الموقع",
  "Delete selected users": "حذف المستخدمين المحددين",
  "View All": "عرض الكل",
  "Deployment ID:": "معرّف النشر:",
  "Request ID:": "معرّف الطلب:",
  "Remote host:": "المضيف البعيد:",
  "User agent:": "وكيل المستخدم:",
  "Backtrace:": "التتبع الخلفي:",
  "Time:": "الوقت:",
  "API:": "API:",
  "Not available": "غير متوفر",
  " and ": " و ",
  "'namespace' reflects current bucket/object list and 'access' reflects a journal of object operations, defaults to 'namespace'":
    "تعكس القيمة 'namespace' قائمة الحاويات والكائنات الحالية، وتعكس القيمة 'access' سجل عمليات الكائنات، والقيمة الافتراضية هي 'namespace'",
  "{compliance} lock protects Objects from write operations by all users, including the SILO root user.":
    "يحمي قفل {compliance} العناصر من عمليات الكتابة التي يجريها جميع المستخدمين، بما في ذلك المستخدم الجذر في SILO.",
  "{count} days": {
    zero: "{count} أيام",
    one: "{count} يوم",
    two: "يومان ({count})",
    few: "{count} أيام",
    many: "{count} يومًا",
    other: "{count} يوم",
  },
  "{count} Entities Found": "عدد الكيانات التي تم العثور عليها: {count}",
  "{count} Entity Found": "تم العثور على كيان واحد ({count})",
  "{count} Version": "إصدار واحد ({count})",
  "{count} version, {size}": "إصدار واحد ({count})، {size}",
  "{count} versions": {
    zero: "{count} إصدارات",
    one: "{count} إصدار",
    two: "إصداران ({count})",
    few: "{count} إصدارات",
    many: "{count} إصدارًا",
    other: "{count} إصدار",
  },
  "{count} Versions": {
    zero: "{count} إصدارات",
    one: "{count} إصدار",
    two: "إصداران ({count})",
    few: "{count} إصدارات",
    many: "{count} إصدارًا",
    other: "{count} إصدار",
  },
  "{count} versions, {size}": "{count} إصدارات، {size}",
  "{custom} policy can be written to define which accounts are authorized to access this Bucket":
    "يمكن كتابة سياسة {custom} لتحديد الحسابات المسموح لها بالوصول إلى هذه الحاوية",
  "{entity} not available": "{entity} غير متوفر",
  "{entity} will be available until:": "سيظل {entity} متاحًا حتى:",
  "{excludeFolders} options will not be available if this option is enabled.":
    "{excludeFolders} لن تكون الخيارات متاحة إذا تم تمكين هذا الخيار.",
  "{file} - Versions": "{file} — الإصدارات",
  "{governance} lock protects Objects from write operations by non-privileged users.":
    "يحمي قفل {governance} العناصر من عمليات الكتابة التي يجريها المستخدمون غير المميّزين.",
  "{label} copied to clipboard": "{label} منسوخ إلى الحافظة",
  "{minio} is a registered trademark of MinIO, Inc. {silo} is not a MinIO, Inc. product, and is not affiliated with, sponsored by, or endorsed by MinIO, Inc.":
    "{minio} علامة تجارية مسجلة لشركة MinIO, Inc. وليس {silo} منتجًا لشركة MinIO, Inc. ولا يرتبط بها أو يحظى برعايتها أو تأييدها.",
  "{object} Versions": "إصدارات {object}",
  "{objectLocking} prevents objects from being deleted. Required to support retention and legal hold. Can only be enabled at bucket creation.":
    "يمنع {objectLocking} حذف العناصر. وهو مطلوب للاحتفاظ والاحتفاظ القانوني، ولا يمكن تفعيله إلا عند إنشاء الحاوية.",
  "{private} policy limits access to credentialled accounts with appropriate permissions":
    "تقيّد سياسة {private} الوصول بالحسابات التي لديها بيانات اعتماد وصلاحيات مناسبة",
  "{provider} - Add Tier Configuration":
    "{provider} — إضافة إعدادات طبقة التخزين",
  "{public} policy anyone will be able to upload, download and delete files from this Bucket once logged in":
    "تتيح سياسة {public} لأي شخص بعد تسجيل الدخول رفع الملفات وتنزيلها وحذفها من هذه الحاوية",
  "{quota} limits the amount of data in the bucket.":
    "تحدّ {quota} من كمية البيانات في الحاوية.",
  "{retention} imposes rules to prevent object deletion for a period of time. Versioning must be enabled in order to set bucket retention policies.":
    "يفرض {retention} قواعد تمنع حذف العناصر لفترة زمنية محددة. يجب تفعيل إدارة الإصدارات لتعيين سياسات الاحتفاظ للحاوية.",
  "{service} which is {status}": "{service} وهو {status}",
  "{silo} is an independently maintained continuation of the {minio} object storage project, carried forward by the {pigsty} community since 2026. Its {code} {incorporates} {upstream}, and the complete work remains licensed under the {agpl}.":
    "{silo} امتداد مستقل الصيانة لمشروع تخزين الكائنات {minio}، يواصل مجتمع {pigsty} تطويره منذ عام 2026. إنّ {code} الخاص به {incorporates} {upstream}، ويظل العمل الكامل مرخصًا بموجب {agpl}.",
  "{target} Event Destination": "وجهة أحداث {target}",
  "{time} ago": "منذ {time}",
  "{type}: {name} not found.": "لم يُعثر على {type}: {name}.",
  "{versioning} allows to keep multiple versions of the same object under the same key.":
    "تتيح {versioning} الاحتفاظ بعدة إصدارات من الكائن نفسه تحت المفتاح نفسه.",
  "* Warning: With Public access anyone will be able to upload, download and delete files from this Bucket *":
    "* تحذير: يتيح الوصول العام لأي شخص رفع الملفات وتنزيلها وحذفها من هذه الحاوية *",
  "# Associated Access Keys": "# مفاتيح الوصول المرتبطة",
  "© 2026 Ruohang Feng / PGSTY and the SILO contributors.":
    "© 2026 Ruohang Feng / PGSTY والمساهمون في SILO.",
  "<Day>": "<اليوم>",
  "<Month>": "<الشهر>",
  "<Year>": "<السنة>",
  "A bucket can only be deleted if it's empty.":
    "لا يمكن حذف الحاوية إلا إذا كانت فارغة.",
  "A group can have one attached IAM policy, where all users with membership in that group inherit that policy. Groups support more simplified management of user permissions on the SILO Tenant.":
    "يمكن ربط المجموعة بسياسة IAM واحدة، ويرث جميع أعضائها تلك السياسة. تتيح المجموعات إدارة صلاحيات المستخدمين في مستأجر SILO بصورة أبسط.",
  "A network error occurred.": "حدث خطأ في الشبكة.",
  "A new {entity} has been created with the following details:":
    "تم إنشاء {entity} جديد بالتفاصيل التالية:",
  "A SILO user consists of a unique access key (username) and corresponding secret key (password). Clients must authenticate their identity by specifying both a valid access key (username) and the corresponding secret key (password) of an existing SILO user.":
    "يتكون مستخدم SILO من مفتاح وصول فريد، وهو اسم المستخدم، ومفتاح سري مقابل، وهو كلمة المرور. يجب على العملاء إثبات هويتهم بتقديم مفتاح وصول صالح والمفتاح السري المقابل لمستخدم SILO موجود.",
  "A user can be a member of multiple groups.":
    "يمكن للمستخدم أن يكون عضوا في مجموعات متعددة.",
  "About Site Replication": "حول النسخ المتماثل للمواقع",
  Access: "الوصول",
  "Access Audit": "تدقيق الوصول",
  "Access Key": "مفتاح الوصول",
  "Access Key and Secret Key should be same on the new site/endpoint.":
    "يجب أن يكون مفتاح الوصول والمفتاح السري متطابقين في الموقع أو نقطة النهاية الجديدة.",
  "Access Key Policy": "سياسة مفتاح الوصول",
  "Access Key details - {name}": "تفاصيل مفتاح الوصول — {name}",
  "Access keys deleted successfully.": "تم حذف مفاتيح الوصول بنجاح.",
  "Access Keys deleted successfully.": "تم حذف مفاتيح الوصول بنجاح.",
  "Access Keys inherit the policies explicitly attached to the parent user, and the policies attached to each group in which the parent user has membership.":
    "ترث مفاتيح الوصول السياسات المرتبطة صراحةً بالمستخدم الأصلي، والسياسات المرتبطة بكل مجموعة ينتمي إليها.",
  "Access Keys support programmatic access by applications. You cannot use a Access Key to log into the SILO Console.":
    "تدعم مفاتيح الوصول الوصول البرمجي عن طريق التطبيقات. لا يمكنك استخدام مفتاح الوصول لتسجيل الدخول إلى وحدة التحكم SILO.",
  "Access Policy": "سياسة الوصول",
  "Access Policy:": "سياسة الوصول:",
  "Access Rule added successfully": "تمت إضافة قاعدة الوصول بنجاح",
  "Access Rules": "قواعد الوصول",
  "AccessKey is required": "AccessKey مطلوب",
  "Account Key": "مفتاح الحساب",
  "Account Name": "اسم الحساب",
  Active: "نشيط",
  "Active for": "نشط لمدة",
  'AD/LDAP server address e.g. "myldapserver.com:636"':
    'AD/LDAP عنوان الخادم على سبيل المثال. "myldapserver.com:636"',
  "Add a Row": "إضافة صف",
  "Add Access Rule": "إضافة قاعدة الوصول",
  "Add Anonymous Access Rule": "إضافة قاعدة وصول مجهولة",
  "Add Bucket Replication Rule - {bucket}":
    "إضافة قاعدة نسخ متماثل للحاوية — {bucket}",
  "Add Event Destination": "إضافة وجهة الحدث",
  "Add key": "إضافة مفتاح",
  "Add Lifecycle Rule": "إضافة قاعدة دورة الحياة",
  "Add Members": "إضافة أعضاء",
  "Add New Tag": "إضافة علامة جديدة",
  "Add New Tag ": "إضافة علامة جديدة",
  "Add new Webhook": "إضافة Webhook جديد",
  "Add Replication Rule": "إضافة قاعدة النسخ",
  "Add Replication Site": "إضافة موقع للنسخ المتماثل",
  "Add Replication Sites": "إضافة مواقع للنسخ المتماثل",
  "Add Sites": "اضافة مواقع",
  "Add Sites for Replication": "إضافة مواقع للنسخ المتماثل",
  "Add tag": "إضافة وسم",
  "Add Tier": "إضافة طبقة تخزين",
  "Add to Group": "أضف إلى المجموعة",
  "Add to Groups": "أضف إلى المجموعات",
  "Add Users to Group": "إضافة مستخدمين إلى المجموعة",
  "add users to groups": "إضافة المستخدمين إلى المجموعات",
  "Adding groups lets you assign IAM policies to multiple users at once.":
    "تتيح لك إضافة المجموعات تعيين سياسات IAM لعدة مستخدمين في وقت واحد.",
  Address: "العنوان",
  After: "بعد",
  All: "الكل",
  "All Log Types": "جميع أنواع السجلات",
  "All Nodes": "جميع العقد",
  "All sites must be using the same external IDP(s) if any.":
    "يجب أن تستخدم جميع المواقع موفّري الهوية الخارجيين أنفسهم، إن وُجدوا.",
  "All sites must have the same deployment credentials (i.e. MINIO_ROOT_USER, MINIO_ROOT_PASSWORD).":
    "يجب أن تستخدم جميع المواقع بيانات اعتماد النشر نفسها، أي MINIO_ROOT_USER وMINIO_ROOT_PASSWORD.",
  "All User Agents": "جميع وكلاء المستخدم",
  "Amazon Resource Name": "اسم مورد Amazon",
  "AMQP exchange type": "نوع مُبدّل AMQP",
  "AMQP server endpoint e.g. `amqp://myuser:mypassword@localhost:5672`":
    "نقطة نهاية خادم AMQP، مثل `amqp://myuser:mypassword@localhost:5672`",
  "An error occurred": "حدث خطأ",
  "An error occurred while getting the Health Report file.":
    "حدث خطأ أثناء الحصول على ملف التقرير الصحي.",
  "An error occurred while uploading the file.": "حدث خطأ أثناء رفع الملف.",
  "An error occurred while uploading the files.": "حدث خطأ أثناء رفع الملفات.",
  "An unknown error occurred. Please refer to Console logs to get more information.":
    "حدث خطأ غير معروف. يرجى الرجوع إلى سجلات وحدة التحكم للحصول على مزيد من المعلومات.",
  Anonymous: "مجهول الهوية",
  "Anonymous Access": "الوصول المجهول",
  "API Name": "اسم API",
  "API Requests": "API طلبات",
  Application: "التطبيق",
  "apply policies to Groups": "تطبيق السياسات على المجموعات",
  April: "ابريل",
  "Are you sure you want to continue?": "هل أنت متأكد أنك تريد الاستمرار؟",
  "Are you sure you want to delete Access Key {name}?":
    "هل تريد بالتأكيد حذف مفتاح الوصول {name}؟",
  "Are you sure you want to delete all the non-current versions for: {object}?":
    "هل تريد بالتأكيد حذف جميع الإصدارات غير الحالية للعنصر {object}؟",
  "Are you sure you want to delete bucket {bucket}?":
    "هل تريد بالتأكيد حذف الحاوية {bucket}؟",
  "Are you sure you want to delete IDP {name} configuration?":
    "هل تريد بالتأكيد حذف إعدادات موفّر الهوية {name}؟",
  "Are you sure you want to delete policy {name}?":
    "هل تريد بالتأكيد حذف السياسة {name}؟",
  "Are you sure you want to delete replication rule {rule}?":
    "هل تريد بالتأكيد حذف قاعدة النسخ المتماثل {rule}؟",
  "Are you sure you want to delete the {rule} rule?":
    "هل تريد بالتأكيد حذف القاعدة {rule}؟",
  "Are you sure you want to delete the Configured Endpoint {name}?":
    "هل تريد بالتأكيد حذف نقطة النهاية المُعدّة {name}؟",
  "Are you sure you want to delete the event destination ?":
    "هل أنت متأكد من رغبتك في حذف وجهة الحدث؟",
  "Are you sure you want to delete the following {count} groups?":
    "هل تريد بالتأكيد حذف المجموعات التالية وعددها {count}؟",
  "Are you sure you want to delete the following {count} users?":
    "هل تريد بالتأكيد حذف المستخدمين التاليين وعددهم {count}؟",
  "Are you sure you want to delete the following group?":
    "هل تريد بالتأكيد حذف المجموعة التالية؟",
  "Are you sure you want to delete the following user?":
    "هل تريد بالتأكيد حذف المستخدم التالي؟",
  "Are you sure you want to delete the selected {count} Access Keys?":
    "هل تريد بالتأكيد حذف مفاتيح الوصول المحددة وعددها {count}؟",
  "Are you sure you want to delete the selected {count} objects?":
    "هل تريد بالتأكيد حذف العناصر المحددة وعددها {count}؟",
  "Are you sure you want to delete the selected {count} versions for {object}?":
    "هل تريد بالتأكيد حذف الإصدارات المحددة وعددها {count} للعنصر {object}؟",
  "Are you sure you want to delete the tag {tag} ?":
    "هل أنت متأكد من حذف الوسم {tag} ؟",
  "Are you sure you want to delete the tag {tag}?":
    "هل تريد بالتأكيد حذف الوسم {tag}؟",
  "Are you sure you want to delete the tier {name}?":
    "هل تريد بالتأكيد حذف طبقة التخزين {name}؟",
  "Are you sure you want to delete this access rule?":
    "هل تريد بالتأكيد حذف قاعدة الوصول هذه؟",
  "Are you sure you want to delete this event?":
    "هل أنت متأكد أنك تريد حذف هذا الحدث؟",
  "Are you sure you want to delete:": "هل أنت متأكد من رغبتك في حذف:",
  "Are you sure you want to remove all the replication sites?.":
    "هل أنت متأكد من رغبتك في إزالة كافة مواقع النسخ؟.",
  "Are you sure you want to remove the replication site: {name}?":
    "هل أنت متأكد من رغبتك في إزالة موقع النسخ: {name}؟",
  "Are you sure you want to remove the selected replication rules for bucket {bucket}?":
    "هل أنت متأكد أنك تريد إزالة قواعد النسخ المحددة للحاوية {bucket}؟",
  "Are you sure you want to reset the Default {name}?":
    "هل أنت متأكد أنك تريد إعادة ضبط الإفتراضي {name}؟",
  "Are you sure you want to restore {object} with Version ID: {version}?":
    "هل تريد بالتأكيد استعادة {object} بمعرّف الإصدار {version}؟",
  "Are you sure you want to restore these configurations to default values?":
    "هل أنت متأكد من رغبتك في إعادة هذه التكوينات إلى القيم الافتراضية؟",
  "Assign Access Policies": "تعيين سياسات الوصول",
  "Assign Custom Credentials": "تعيين بيانات الاعتماد المخصصة",
  "Assign Custom IAM Policies for Group": "تعيين سياسات IAM مخصصة للمجموعة",
  "Assign groups": "تخصيص المجموعات",
  "Assign Groups": "تخصيص المجموعات",
  "assign policies": "تعيين السياسات",
  "assign Policies": "تعيين السياسات",
  "Assign Policies": "تعيين السياسات",
  "Assign Policy": "تعيين سياسة",
  "Assign Users": "تعيين المستخدمين",
  Asynchronous: "غير متزامن",
  "Audit Kafka": "تدقيق Kafka",
  "Audit Webhook": "Webhook التدقيق",
  August: "أغسطس",
  "Auth Token": "رمز المصادقة",
  "Auto delete queue when set to 'on', when there are no consumers":
    "حذف قائمة الانتظار تلقائيًا عند الضبط على 'on' في حال عدم وجود مستهلكين",
  "Auto Deleted": "الحذف التلقائي",
  "Available Capacity": "السعة المتوفرة",
  Back: "رجوع",
  Backend: "الخلفية",
  Bandwidth: "عرض النطاق الترددي",
  "Enter a non-negative bandwidth below 8 PiB/s, with at most two decimals (0 means unlimited).":
    "أدخل نطاق ترددي غير سلبي أقل من 8 PiB/s، مع رقمين عشريين على الأكثر (0 يعني غير محدود).",
  "Bitrot Scan": "فحص تلف البيانات",
  Brokers: "وسطاء",
  "Browse Bucket": "تصفح الحاوية",
  Bucket: "حاوية",
  "Bucket Assignments": "تعيينات الحاويات",
  "Bucket Encryption configuration": "إعدادات تشفير الحاوية",
  "Bucket lifecycle (ILM) configuration": "إعدادات دورة حياة الحاوية (ILM)",
  "Bucket Name": "اسم الحاوية",
  "Bucket names can consist only of lowercase letters, numbers, dots (.), and hyphens (-).":
    "لا يمكن أن تتكون أسماء الحاويات إلا من أحرف صغيرة وأرقام ونقاط (.) وشرطات (-).",
  "Bucket names must be between 3 (min) and 63 (max) characters long.":
    "يجب أن يتراوح طول اسم الحاوية بين 3 و63 حرفًا.",
  "Bucket names must be unique within a partition.":
    "يجب أن تكون أسماء الحاويات فريدة داخل القسم.",
  "Bucket names must not be formatted as an IP address (for example, 192.168.5.4).":
    "يجب ألا يكون اسم الحاوية بصيغة عنوان IP، مثل 192.168.5.4.",
  "Bucket names must not contain two adjacent periods, or a period adjacent to a hyphen.":
    "يجب ألا تحتوي أسماء الحاويات على نقطتين متجاورتين، أو نقطة مجاورة لشرطة.",
  "Bucket names must not end with the suffix -s3alias. This suffix is reserved for access point alias names.":
    "يجب ألا تنتهي أسماء الحاويات باللاحقة -s3alias. فهذه اللاحقة محجوزة للأسماء المستعارة لنقاط الوصول.",
  "Bucket names must not start with the prefix xn--.":
    "يجب ألا تبدأ أسماء الحاويات بالبادئة xn--.",
  "Bucket notification configuration": "إعدادات إشعارات الحاوية",
  "bucket notifications": "إشعارات الحاوية",
  "Bucket Object-Lock configurations": "إعدادات قفل كائنات الحاوية",
  "Bucket Policies": "سياسات الحاوية",
  "Bucket Replication Configuration": "إعدادات النسخ المتماثل للحاوية",
  "Bucket Tags": "وسوم الحاوية",
  "bucket-default": "الإعداد الافتراضي للحاوية",
  "Buckets Results": "نتائج الحاويات",
  "Buckets:": "الحاويات:",
  "Bypass Governance Mode": "تجاوز وضع الحوكمة",
  Bytes: "بايت",
  "Calls to Trace": "الاستدعاءات المراد تتبعها",
  Cancelled: "ملغى",
  "Cannot delete currently logged in user":
    "لا يمكن حذف المستخدم الذي قام بتسجيل الدخول حاليًا",
  "Cannot delete currently logged in user {user}":
    "لا يمكن حذف المستخدم المسجّل دخوله حاليًا {user}",
  "Cert Authority": "سلطة الشهادة",
  "Change Access Policy": "تغيير سياسة الوصول",
  "Change Legal Hold rules for this File":
    "تغيير قواعد الاحتفاظ القانوني لهذا الملف",
  "Change Password": "تغيير كلمة المرور",
  "Change Password for {user}": "تغيير كلمة مرور {user}",
  "Change password for: {user}": "تغيير كلمة المرور لـ: {user}",
  "Change Retention rules for this File": "تغيير قواعد الاحتفاظ لهذا الملف",
  "Change Tags for this File": "تغيير العلامات لهذا الملف",
  "Change User Password": "تغيير كلمة المرور للمستخدم",
  "Changes to Bucket features such as": "تغييرات ميزات الحاوية، مثل",
  "Choose or create a new path": "اختر أو أنشئ مسارًا جديدًا",
  "Claim from which SILO will read the policy or role to use":
    "المطالبة التي يقرأ منها SILO السياسة أو الدور المطلوب استخدامه",
  "Claim Name": "اسم المطالبة",
  "Claim Prefix": "بادئة المطالبة",
  "Claim User Info": "المطالبة بمعلومات المستخدم",
  Clear: "مسح",
  "Click on a user to view the full listing of associated Access Keys. All Access Keys associated with a user will be deleted along with the user.":
    "انقر على المستخدم لعرض القائمة الكاملة لمفاتيح الوصول المرتبطة به. سيتم حذف جميع مفاتيح الوصول المرتبطة بالمستخدم مع المستخدم.",
  client: "العميل",
  "Client Auth determines the Kafka server's policy for TLS client authorization":
    "يحدد إعداد مصادقة العميل سياسة خادم Kafka لتفويض عملاء TLS",
  "Client Cert": "شهادة العميل",
  "Client cert for mTLS authentication": "شهادة العميل لمصادقة mTLS",
  "Client cert for NATS mTLS auth": "شهادة العميل لمصادقة NATS mTLS",
  "Client Cert Key": "مفتاح شهادة العميل",
  "Client cert key for mTLS authentication": "مفتاح شهادة العميل لمصادقة mTLS",
  "Client cert key for NATS mTLS authorization":
    "مفتاح شهادة العميل للحصول على تفويض NATS mTLS",
  "Client ID is required": "معرّف العميل مطلوب",
  "Client Key": "مفتاح العميل",
  "Client ping commands interval in s,m,h,d. Disabled by default":
    "الفاصل الزمني لأوامر ping للعميل في s,m,h,d. معطل افتراضيا",
  "Client Secret is required": "مطلوب سر العميل",
  "Client Secret must be re-entered to change OpenID configurations":
    "يجب إعادة إدخال سر العميل لتغيير إعدادات OpenID",
  "client TLS cert": "شهادة TLS للعميل",
  "client TLS key": "مفتاح TLS للعميل",
  "ClientAuth determines the Kafka server's policy for TLS client authorization":
    "يحدد ClientAuth سياسة خادم Kafka لتفويض عملاء TLS",
  "Cluster Health Report will be generated, you will be able to download the JSON File.":
    "سيتم إنشاء تقرير صحة المجموعة، ستتمكن من تنزيل الملف JSON.",
  code: "الكود",
  "Comma separated list of Kafka broker addresses":
    "قائمة مفصولة بفواصل Kafka عناوين الوسيط",
  Comment: "تعليق",
  Comments: "التعليقات",
  Compliance: "الامتثال",
  Compression: "ضغط",
  "Concurrent:": "المتزامن:",
  Config: "الإعدادات",
  "Config Name is required": "اسم التكوين مطلوب",
  "Config URL": "عنوان URL للإعدادات",
  "Config URL for identity provider configuration":
    "عنوان URL لإعدادات موفّر الهوية",
  "Config URL is required": "عنوان URL للإعدادات مطلوب",
  "Configuration cannot be disabled / enabled in this module as LDAP environment variables are set for this SILO instance.":
    "لا يمكن تعطيل / تمكين التكوين في هذه الوحدة حيث تم تعيين LDAP متغيرات البيئة لهذا المثيل SILO.",
  "Configuration cannot be disabled / enabled in this module as OpenID environment variables are set for this SILO instance.":
    "لا يمكن تعطيل / تمكين التكوين في هذه الوحدة حيث تم تعيين OpenID متغيرات البيئة لهذا المثيل SILO.",
  "Configuration cannot be edited in this module as LDAP environment variables are set for this SILO instance.":
    "لا يمكن تحرير التكوين في هذه الوحدة حيث تم تعيين متغيرات البيئة LDAP لهذا المثيل SILO.",
  "Configuration cannot be edited in this module as OpenID environment variables are set for this SILO instance.":
    "لا يمكن تحرير التكوين في هذه الوحدة حيث تم تعيين OpenID متغيرات البيئة لهذا المثيل SILO.",
  "Configuration saved successfully": "تم حفظ التهيئة بنجاح",
  "Configure a {remoteTier} to receive transitioned Objects":
    "اضبط {remoteTier} لاستقبال الكائنات المنقولة",
  "Configure Bucket": "إعداد الحاوية",
  "Configuring an external IDP enables Single-Sign On workflows, where applications authenticate against the external IDP before accessing SILO.":
    "يتيح إعداد موفّر هوية خارجي تسجيل الدخول الموحد؛ إذ تصادق التطبيقات لدى موفّر الهوية قبل الوصول إلى SILO.",
  "Confirm Dialogs": "مربعات حوار التأكيد",
  "connected server": "خادم متصل",
  "Connection String": "سلسلة الاتصال",
  "Console Credentials": "بيانات اعتماد وحدة التحكم",
  "Console LICENSE": "ترخيص Console",
  "Console portions © Georg Mangold and contributors.":
    "أجزاء وحدة التحكم © Georg Mangold والمساهمين.",
  "Console predecessor": "سلف الكونسول",
  "Copy to Clipboard": "نسخ إلى الحافظة",
  Copyright: "حقوق النشر",
  "Coredns Path": "مسار CoreDNS",
  "Cors Allow Origin": "المصدر المسموح به في CORS",
  "Could not process drag and drop.": "لا يمكن معالجة السحب والإسقاط.",
  "CPU Info": "معلومات المعالج",
  "Create {idpType} configuration": "إنشاء إعدادات {idpType}",
  "create a bucket": "إنشاء حاوية",
  "Create a new cryptographic key in the Key Management Service server connected to SILO.":
    "أنشئ مفتاح تشفير جديدًا في خادم خدمة إدارة المفاتيح المتصل بـ SILO.",
  "create a new path": "إنشاء مسار جديد",
  "create a Policy": "إنشاء سياسة",
  "Create access key": "إنشاء مفتاح وصول",
  "Create Access Key": "إنشاء مفتاح وصول",
  "Create Access Key for {user}": "إنشاء مفتاح وصول للمستخدم {user}",
  "Create Access Keys": "إنشاء مفاتيح وصول",
  "Create Configuration": "إنشاء التكوين",
  "Create Configurations": "إنشاء التكوينات",
  "Create Group": "إنشاء مجموعة",
  "Create Key": "إنشاء مفتاح",
  "Create new path": "إنشاء مسار جديد",
  "Create OpenID Configuration": "إنشاء إعدادات OpenID",
  "Create Policies": "إنشاء سياسات",
  "Create Policy": "إنشاء سياسة",
  "Create Rules": "إنشاء القواعد",
  "Create Tier": "إنشاء طبقة تخزين",
  "Create User": "إنشاء مستخدم",
  "create users": "إنشاء مستخدمين",
  "Create Users": "إنشاء مستخدمين",
  "Created At": "وقت الإنشاء",
  "Created By": "تم الإنشاء بواسطة",
  "Creation and deletion of all IAM users, groups, policies and their mappings to users or groups":
    "إنشاء وحذف جميع المستخدمين والمجموعات والسياسات IAM وتعييناتها للمستخدمين أو المجموعات",
  "Creation and deletion of buckets and objects":
    "إنشاء الحاويات والكائنات وحذفها",
  "Creation and deletion of service accounts (except those owned by the root user)":
    "إنشاء وحذف حسابات الخدمة (ما عدا تلك المملوكة للمستخدم الجذر)",
  "Creation of STS credentials": "إنشاء بيانات اعتماد STS",
  Credentials: "بيانات الاعتماد",
  current: "الحالي",
  Current: "الحالي",
  "Current Endpoint:": "نقطة النهاية الحالية:",
  "Current Password": "كلمة المرور الحالية",
  "Current Path:": "المسار الحالي:",
  "Current Policy": "السياسة الحالية",
  "Current Status": "الوضع الحالي",
  "Current Status:": "الوضع الحالي:",
  "Current Tags:": "العلامات الحالية:",
  "Current User Policy - edit the JSON to remove permissions for this Access Key":
    "سياسة المستخدم الحالي — عدّل JSON لإزالة صلاحيات مفتاح الوصول هذا",
  "Current Version": "الإصدار الحالي",
  "CURRENT VERSION": "الإصدار الحالي",
  "Currently Configured Endpoints": "نقاط النهاية التي تم تكوينها حاليًا",
  custom: "مخصص",
  Custom: "مخصص",
  Cycle: "دورة",
  Database: "قاعدة البيانات",
  Date: "التاريخ",
  day: "يوم",
  days: {
    zero: "أيام",
    one: "يوم",
    two: "يومان",
    few: "أيام",
    many: "يومًا",
    other: "يوم",
  },
  Days: "أيام",
  "DB table name to store/update events, table is auto-created":
    "اسم جدول قاعدة البيانات لتخزين الأحداث وتحديثها، ويُنشأ تلقائيًا",
  December: "ديسمبر",
  Default: "افتراضي",
  "Default Key ID:": "معرّف المفتاح الافتراضي:",
  "Define which actions are permitted on a specified resource.":
    "تحديد الإجراءات المسموح بها على مورد محدد.",
  "Delay Multiplier": "مضاعف التأخير",
  "DELETE - Object Deleted": "DELETE — تم حذف الكائن",
  "Delete {name}": "حذف {name}",
  "Delete Access Key": "حذف مفتاح الوصول",
  "Delete Access Keys": "حذف مفاتيح الوصول",
  "Delete All": "حذف الكل",
  "Delete All Versions": "حذف جميع الإصدارات",
  "Delete Anonymous Access Rule": "حذف قاعدة الوصول المجهول",
  "Delete Bucket": "حذف الحاوية",
  "Delete Configuration": "حذف التكوين",
  "Delete Endpoint": "حذف نقطة النهاية",
  "Delete Event": "حذف الحدث",
  "Delete Group": "حذف المجموعة",
  "delete Groups": "حذف المجموعات",
  "Delete Groups": "حذف المجموعات",
  "Delete Lifecycle Rule": "حذف قاعدة دورة الحياة",
  "Delete Marker": "علامة حذف",
  "Delete Non-Current versions": "حذف الإصدارات غير الحالية",
  "Delete Object": "حذف الكائن",
  "Delete Objects": "حذف الكائنات",
  "delete Policies": "حذف السياسات",
  "Delete Policy": "حذف السياسة",
  "Delete Replication Rule": "حذف قاعدة النسخ المتماثل",
  "Delete Replication Site": "حذف موقع النسخ المتماثل",
  "Delete Selected": "حذف المحدد",
  "Delete Selected Files": "حذف الملفات المحددة",
  "Delete Selected Replication Rules": "حذف قواعد النسخ المتماثل المحددة",
  "Delete Selected Versions": "حذف الإصدارات المختارة",
  "Delete Site": "حذف الموقع",
  "Delete Tag": "حذف الإشارة",
  "Delete Tier": "حذف طبقة التخزين",
  "delete user": "حذف المستخدم",
  "Delete User": "حذف المستخدم",
  "delete users": "حذف المستخدمين",
  "Delete Users": "حذف المستخدمين",
  "Delete version": "حذف النسخة",
  "Delete Webhook": "حذف Webhook",
  Deleted: "محذوف",
  DELETED: "محذوف",
  Deletes: "عمليات الحذف",
  "Delivery Mode": "طريقة التوصيل",
  Description: "الوصف",
  Destination: "الوجهة",
  "Detailed Results:": "النتائج التفصيلية:",
  Disable: "تعطيل",
  "Disable LDAP": "تعطيل LDAP",
  "Disable SSL certificate verification ": "تعطيل التحقق من شهادة SSL",
  "disable users": "تعطيل المستخدمين",
  Disabled: "معطّل",
  "Display Name": "اسم العرض",
  "Display Object Versions": "عرض إصدارات الكائن",
  "Display only Errors": "عرض الأخطاء فقط",
  "Display Versions for this file": "عرض الإصدارات لهذا الملف",
  "No object versions are available": "لا توجد إصدارات متاحة للكائن",
  "Distributed Mode": "الوضع الموزّع",
  "DN (Distinguished Name) for LDAP read-only service account used to perform DN and group lookups":
    "الاسم المميّز (DN) لحساب خدمة LDAP للقراءة فقط، المستخدم للبحث عن الأسماء المميّزة والمجموعات",
  documentation: "التوثيق",
  Done: "تم",
  "Download all access credentials": "قم بتنزيل كافة بيانات اعتماد الوصول",
  "Download all access credentials to a JSON file. NOTE: This file is not formatted for import using mc alias import. If you plan to import this alias from the file, please use the Download for Import button. ":
    "نزّل جميع بيانات اعتماد الوصول في ملف JSON. ملاحظة: هذا الملف غير منسّق للاستيراد باستخدام الأمر mc alias import. إذا كنت تخطط لاستيراد هذا الاسم المستعار من الملف، فاستخدم زر «التنزيل للاستيراد».",
  "Download as CSV": "تحميل كـ CSV",
  "Download as PNG": "تحميل كـ PNG",
  "Download credentials in a JSON file formatted for import using mc alias import. This will only include the default login credentials.":
    "نزّل بيانات الاعتماد في ملف JSON منسّق للاستيراد باستخدام الأمر mc alias import. سيتضمن هذا بيانات اعتماد تسجيل الدخول الافتراضية فقط.",
  "Download File": "تنزيل الملف",
  "Download for import": "تحميل للاستيراد",
  "Download JSON": "تحميل JSON",
  "Download of multiple files failed.": "فشل تنزيل ملفات متعددة.",
  "Download Results": "تنزيل النتائج",
  "Download Selected": "تحميل المحدد",
  "Download selected objects as Zip. Any Deleted objects in the selection would be skipped from download.":
    "نزّل الكائنات المحددة كأرشيف ZIP. ستُستثنى الكائنات المحذوفة من التنزيل.",
  "Download this Object": "قم بتنزيل هذا الكائن",
  "Download this version": "قم بتنزيل هذا الإصدار",
  "Download widget data": "تنزيل بيانات القطعة",
  "Downloads / Uploads": "التنزيلات / عمليات الرفع",
  "Drives Partitions Info": "معلومات أقسام الأقراص",
  "Drives:": "محركات الأقراص:",
  "DSN String": "سلسلة DSN",
  Durable: "متين",
  Duration: "المدة",
  "During the speed test all your production traffic will be temporarily suspended.":
    "أثناء اختبار السرعة، سيتم تعليق جميع حركة الإنتاج الخاصة بك مؤقتًا.",
  "e.g. 503": "مثلاً 503",
  "e.g. FunctionName2055": "مثال: FunctionName2055",
  "e.g. Method 2056": "مثال: Method 2056",
  "e.g. my-bucket/my-prefix/*": "مثال: my-bucket/my-prefix/*",
  "e.g. us-west-rack-2": "مثال: us-west-rack-2",
  "Each user can access only those resources and operations which are explicitly granted by the built-in role. SILO denies access to any other resource or action by default.":
    "يمكن لكل مستخدم الوصول فقط إلى تلك الموارد والعمليات التي يمنحها الدور المدمج بشكل صريح. SILO يرفض الوصول إلى أي مورد أو إجراء آخر بشكل افتراضي.",
  Edit: "تعديل",
  "edit a Policy": "تعديل سياسة",
  "Edit Anonymous Access Rule for {target}":
    "تعديل قاعدة الوصول المجهول للهدف {target}",
  "Edit Audit Webhook": "تعديل Webhook التدقيق",
  "Edit Bucket Replication": "تعديل النسخ المتماثل للحاوية",
  "Edit Configuration": "تعديل الإعدادات",
  "Edit details of - {name}": "تعديل تفاصيل - {name}",
  "Edit Endpoint": "تعديل نقطة النهاية",
  "edit Group membership": "تعديل عضوية المجموعة",
  "Edit Lifecycle Configuration": "تعديل إعدادات دورة الحياة",
  "Edit Logger Webhook": "تعديل Webhook السجلات",
  "Edit Members": "تعديل الأعضاء",
  "Edit Replication Endpoint": "تعديل نقطة نهاية النسخ المتماثل",
  "Edit Tags": "تعديل الوسوم",
  "Edit the Default Audit Webhook": "تعديل Webhook التدقيق الافتراضي",
  "Edit the Default Logger Webhook": "تعديل Webhook السجلات الافتراضي",
  "Edit Webhook": "تعديل Webhook",
  "Effect:": "التأثير:",
  "Elasticsearch index to store/update events, index is auto-created":
    "فهرس Elasticsearch لتخزين الأحداث وتحديثها، ويُنشأ تلقائيًا",
  "Elasticsearch server's address, with optional authentication info":
    "عنوان خادم Elasticsearch، مع معلومات مصادقة اختيارية",
  Enable: "تفعيل",
  "Enable audit_kafka target": "تفعيل هدف Audit_kafka",
  "Enable Bucket Encryption": "تفعيل تشفير الحاوية",
  "Enable Bucket Quota": "تفعيل حصة الحاوية",
  "Enable LDAP": "تفعيل LDAP",
  "enable or disable Groups": "تفعيل أو تعطيل المجموعات",
  "enable or disable users": "تمكين أو تعطيل المستخدمين",
  "Enable SASL (Simple Authentication and Security Layer) authentication":
    "تفعيل مصادقة SASL، أي طبقة المصادقة والأمان البسيطة",
  "Enable TLS (Transport Layer Security)": "تفعيل TLS، أي أمان طبقة النقل",
  "enable users": "تمكين المستخدمين",
  "Enable your preferred options to get filtered records.":
    "قم بتمكين خياراتك المفضلة للحصول على السجلات التي تمت تصفيتها.",
  Enabled: "مفعّل",
  Encrypt: "تشفير",
  "Encryption Key": "مفتاح التشفير",
  "Encryption Type": "نوع التشفير",
  "Encryption:": "التشفير:",
  "End Time:": "وقت الانتهاء:",
  Endpoint: "نقطة النهاية",
  endpoints: "نقاط النهاية",
  Endpoints: "نقاط النهاية",
  "Enter '/' to apply the rule to all prefixes and objects at the bucket root. Do not include the wildcard asterisk '*' as part of the prefix *unless* it is an explicit part of the prefix name. The Console automatically appends an asterisk to the appropriate sections of the resulting IAM policy.":
    "أدخل '/' لتطبيق القاعدة على جميع البادئات والكائنات في جذر الحاوية. لا تُدرج رمز النجمة '*' ضمن البادئة *إلا* إذا كان جزءًا صريحًا من اسم البادئة. تُلحق لوحة التحكم علامة النجمة تلقائيًا بالأقسام المناسبة من سياسة IAM الناتجة.",
  "Enter a comment": "أدخل تعليق",
  "Enter a description": "أدخل الوصف",
  "Enter a Mime Type": "أدخل نوع MIME",
  "Enter a name": "أدخل اسمًا",
  "Enter Access Key": "أدخل مفتاح الوصول",
  "Enter Account Key": "أدخل مفتاح الحساب",
  "Enter Account Name": "أدخل اسم الحساب",
  "Enter Address": "أدخل العنوان",
  "Enter allowed origin e.g. https://example.com":
    "أدخل المصدر المسموح به، مثل https://example.com",
  "Enter an Extension": "أدخل الامتداد",
  "Enter Auth Token": "أدخل رمز المصادقة",
  "Enter auth_token": "أدخل auth_token",
  "Enter Brokers": "أدخل الوسطاء",
  "Enter Bucket": "أدخل الحاوية",
  "Enter Cert Authority": "أدخل سلطة الشهادة",
  "Enter Claim Name": "أدخل اسم المطالبة",
  "Enter Claim Prefix": "أدخل بادئة المطالبة",
  "Enter Client Cert": "أدخل شهادة العميل",
  "Enter Client Cert Key": "أدخل مفتاح شهادة العميل",
  "Enter Client ID": "أدخل معرّف العميل",
  "Enter Client Key": "أدخل مفتاح العميل",
  "Enter Client Secret": "أدخل سر العميل",
  "Enter Coredns Path": "أدخل مسار CoreDNS",
  "Enter custom notes if any": "أدخل الملاحظات المخصصة إن وجدت",
  "Enter Cycle": "أدخل الدورة",
  "Enter DB Name": "أدخل اسم قاعدة البيانات",
  "Enter Delay": "أدخل مدة التأخير",
  "Enter Delivery Mode": "أدخل وضع التوصيل",
  "Enter Destination Identifier": "أدخل معرف الوجهة",
  "Enter Display Name": "أدخل اسم العرض",
  "Enter DSN String": "أدخل سلسلة DSN",
  "Enter Endpoint": "أدخل نقطة النهاية",
  "Enter Exchange": "أدخل المُبدّل",
  "Enter Exchange Type": "أدخل نوع المُبدّل",
  "Enter Format": "أدخل التنسيق",
  "Enter Host": "أدخل المضيف",
  "Enter Index": "أدخل الفهرس",
  "Enter Kafka Broker": "أدخل وسيط Kafka",
  "Enter Kafka Topic": "أدخل موضوع Kafka",
  "Enter Kafka Version": "أدخل إصدار Kafka",
  "Enter Keep Alive Interval": "أدخل فترة إبقاء الاتصال حيًا",
  "Enter Key": "أدخل المفتاح",
  "Enter Max IO": "أدخل أقصى IO",
  "Enter Max Sleep Duration": "أدخل أقصى مدة للسكون",
  "Enter Max Wait": "أدخل أقصى انتظار",
  "Enter Name (Eg. REMOTE-TIER)": "أدخل الاسم (مثال: REMOTE-TIER)",
  "Enter NATS password": "أدخل كلمة مرور NATS",
  "Enter NATS Subject": "أدخل موضوع NATS",
  "Enter NATS token": "أدخل رمز NATS",
  "Enter NATS Username": "أدخل اسم مستخدم NATS",
  "Enter New Tag Key": "أدخل مفتاح الوسم الجديد",
  "Enter New Tag Label": "أدخل تسمية الوسم الجديد",
  "Enter nsqd_address": "أدخل nsqd_address",
  "Enter Password": "أدخل كلمة المرور",
  "Enter Path Prefix": "أدخل بادئة المسار",
  "Enter Ping Interval": "أدخل فترة اختبار الاتصال",
  "Enter Port": "أدخل المنفذ",
  "Enter Prefix": "أدخل البادئة",
  "Enter QOS": "أدخل QoS",
  "Enter Queue Dir": "أدخل دليل قائمة الانتظار",
  "Enter Queue Directory": "أدخل دليل قائمة الانتظار",
  "Enter Queue Limit": "أدخل حد قائمة الانتظار",
  "Enter Reconnect Interval": "أدخل الفاصل الزمني لإعادة الاتصال",
  "Enter Replication Failed Workers": "أدخل عمّال النسخ الفاشل",
  "Enter Replication Workers": "أدخل عدد عمّال النسخ المتماثل",
  "Enter Requests Max": "أدخل أقصى عدد للطلبات",
  "Enter Routing Key": "أدخل مفتاح التوجيه",
  "Enter SASL Mechanism": "أدخل آلية SASL",
  "Enter SASL Password": "أدخل كلمة مرور SASL",
  "Enter SASL Username": "أدخل اسم مستخدم SASL",
  "Enter Secret Key": "أدخل المفتاح السري",
  "Enter SSL Mode": "أدخل وضع SSL",
  "Enter Storage Class": "أدخل فئة التخزين",
  "Enter Streaming Cluster ID": "أدخل معرّف عنقود البث",
  "Enter Streaming in flight value": "أدخل قيمة الرسائل الجارية للبث",
  "Enter Table Name": "أدخل اسم الجدول",
  "Enter Tag Key": "أدخل مفتاح الوسم",
  "Enter Tag Label": "أدخل تسمية الوسم",
  "Enter the new Folder Path": "أدخل مسار المجلد الجديد",
  "Enter TLS Client Auth": "أدخل إعداد مصادقة عميل TLS",
  "Enter TLS Client Cert": "أدخل شهادة عميل TLS",
  "Enter TLS Client Key": "أدخل مفتاح عميل TLS",
  "Enter Topic": "أدخل الموضوع",
  "Enter URL": "أدخل عنوان URL",
  "Enter User": "أدخل المستخدم",
  "Enter Username": "أدخل اسم المستخدم",
  Entities: "الكيانات",
  "Erasure Health": "حالة ترميز المحو",
  Error: "خطأ",
  "Error - File size too large": "خطأ - حجم الملف كبير جدًا",
  "Error retrieving access keys": "خطأ في استرجاع مفاتيح الوصول",
  "Error:": "الخطأ:",
  Errors: "أخطاء",
  Erros: "الأخطاء",
  "ETAG:": "ETAG:",
  Event: "الحدث",
  "Event Notifications": "إشعارات الأحداث",
  Exchange: "المُبدّل",
  "Exchange Type": "نوع المُبدّل",
  "Exclude Folders": "استبعاد المجلدات",
  "exclude folders and prefixes": "استبعاد المجلدات والبادئات",
  "Exclude folders and prefixes": "استبعاد المجلدات والبادئات",
  "Excluded Prefixes": "البادئات المستبعدة",
  "Excluded Prefixes :": "البادئات المستبعدة:",
  "Existing Objects": "الكائنات الموجودة",
  "Expand graph": "توسيع الرسم البياني",
  "Expire All Versions": "إنهاء صلاحية جميع الإصدارات",
  "Expire Delete Marker": "إنهاء صلاحية علامة الحذف",
  "Expired All Versions": "جميع الإصدارات منتهية الصلاحية",
  "Expired Object Delete Marker": "علامة حذف كائن منتهية الصلاحية",
  Expiry: "انتهاء الصلاحية",
  "Expiry Days": "أيام انتهاء الصلاحية",
  Export: "تصدير",
  Extensions: "ملحقات",
  'Extensions to compress e.g. ".txt", ".log" or ".csv" -  you can write one per field':
    'ملحقات للضغط مثلا. ".txt" أو ".log" أو ".csv" - يمكنك كتابة واحد في كل حقل',
  Failed: "فشل",
  Failures: "الإخفاقات",
  False: "خطأ",
  Features: "المميزات",
  February: "فبراير",
  "File Configuration": "إعدادات الملف",
  "File couldn't be loaded. Please try Download instead":
    "لا يمكن تحميل الملف. يرجى محاولة التنزيل بدلاً من ذلك",
  "File couldn't be previewed using file extension or mime type. Please try Download instead":
    "لا يمكن معاينة الملف باستخدام امتداد الملف أو نوع mime. يرجى محاولة التنزيل بدلاً من ذلك",
  "File download will be handled directly by the browser.":
    "سيتم التعامل مع تنزيل الملف مباشرة من خلال المتصفح.",
  "Files larger than 5 GiB use a single, non-resumable browser request. Use mcli for multipart uploads.":
    "تستخدم الملفات التي يزيد حجمها عن 5 جيجا بايت طلب متصفح واحد غير قابل للاستئناف. استخدم mcli للتحميلات متعددة الأجزاء.",
  "File or Path to inspect": "الملف أو المسار المراد فحصه",
  "File Preview": "معاينة الملف",
  "File preview couldn't be displayed, Please try Download instead.":
    "لا يمكن عرض معاينة الملف، يرجى تجربة التنزيل بدلاً من ذلك.",
  "Filename should be less than 200 characters long.":
    "اسم الملف يجب أن يكون أقل من 200 حرف.",
  Filter: "تصفية",
  "Filter Users": "تصفية المستخدمين",
  "Filter:": "تصفية:",
  Filters: "الفلاتر",
  "Folder cannot have the same name as an existing file":
    "لا يمكن أن يحمل المجلد نفس اسم الملف الموجود",
  "For each write operation to the bucket, SILO checks all configured replication rules for the bucket and applies the matching rule with highest configured priority.":
    "عند كل عملية كتابة في الحاوية، يتحقق SILO من جميع قواعد النسخ المتماثل المُعدّة للحاوية ويطبق القاعدة المطابقة ذات الأولوية الأعلى.",
  'For each write operation to this "source" bucket, SILO checks all configured replication rules and applies the matching rule with highest configured priority.':
    "عند كل عملية كتابة في حاوية «المصدر» هذه، يتحقق SILO من جميع قواعد النسخ المتماثل المُعدّة ويطبق القاعدة المطابقة ذات الأولوية الأعلى.",
  "For per-object retention settings, defer to the documentation for the PUT operation used by your preferred SDK.":
    "لبعض إعدادات الاحتفاظ على مستوى الكائن، راجع وثائق عملية PUT الخاصة بحزمة SDK المفضلة لديك.",
  "For SSE-S3 or SSE-KMS encryption via KMS, all sites must have access to a central KMS deployment server.":
    "للتشفير باستخدام SSE-S3 أو SSE-KMS عبر KMS، يجب أن تتمكن جميع المواقع من الوصول إلى خادم KMS مركزي.",
  Format: "التنسيق",
  "full attribution stack": "مكدس الإسناد الكامل",
  "Full Log Information": "معلومات السجل الكاملة",
  "Function Name": "اسم الوظيفة",
  Functions: "الوظائف",
  "GET - Object accessed": "GET — تم الوصول إلى الكائن",
  "Get Information": "احصل على المعلومات",
  "GNU Affero General Public License, version 3":
    "رخصة GNU Affero العامة، الإصدار 3",
  "GNU AGPL v3 full text": "النص الكامل لرخصة GNU AGPL v3",
  Governance: "الحوكمة",
  Group: "مجموعة",
  "Group Mappings": "تعيينات المجموعة",
  "Group Name": "اسم المجموعة",
  "Group Status:": "حالة المجموعة:",
  "Groups provide a simplified method for managing shared permissions among users with common access patterns and workloads. Client’s cannot authenticate to a SILO deployment using a group as an identity.":
    "توفر المجموعات طريقة مبسطة لإدارة الأذونات المشتركة بين المستخدمين الذين لديهم أنماط وصول وأعباء عمل مشتركة. لا يمكن للعميل المصادقة على نشر SILO باستخدام مجموعة كهوية.",
  "Groups with this Policy associated": "المجموعات المرتبطة بهذه السياسة",
  "Guide to access policy structure": "دليل بنية سياسة الوصول",
  hard: "صارم",
  Heal: "إصلاح",
  "Health Check Duration": "مدة الفحص الصحي",
  "Health Info (Preview)": "معلومات صحية (معاينة)",
  "Health Report": "التقرير الصحي",
  "Health Report complete": "التقرير الصحي كاملاً",
  "Health Report file is ready to be downloaded.":
    "ملف التقرير الصحي جاهز للتحميل.",
  "Health report generated successfully!": "تم إنشاء التقرير الصحي بنجاح!",
  "Health Report in progress...": "التقرير الصحي قيد التنفيذ...",
  "Health Report started. Please do not refresh page during diagnosis.":
    "بدأ التقرير الصحي. يرجى عدم تحديث الصفحة أثناء التشخيص.",
  Healthy: "سليم",
  "Hide advanced Filters": "إخفاء المرشحات المتقدمة",
  "Hide Bucket Naming Rules": "إخفاء قواعد تسمية الحاويات",
  "Hide Object Versions": "إخفاء إصدارات الكائن",
  hour: "ساعة",
  hours: {
    zero: "ساعات",
    one: "ساعة",
    two: "ساعتان",
    few: "ساعات",
    many: "ساعة",
    other: "ساعة",
  },
  Hours: "الساعات",
  "IAM conditional statements": "العبارات الشرطية لـ IAM",
  "IAM Policy": "سياسة IAM",
  Id: "ID",
  Identifier: "المعرّف",
  "Identity provider Client ID": "معرّف عميل موفّر الهوية",
  "Identity provider Client Secret": "سرّ العميل لموفّر الهوية",
  "If the Health report cannot be generated at this time, please wait a moment and try again.":
    "إذا تعذر إنشاء تقرير الصحة في هذا الوقت، يرجى الانتظار لحظة والمحاولة مرة أخرى.",
  "If you are looking to change MINIO_ROOT_USER credentials,":
    "إذا كنت تتطلع إلى تغيير بيانات اعتماد MINIO_ROOT_USER،",
  "ILM - Object Transitioned": "ILM — تم نقل الكائن",
  "ILM Rule": "قاعدة إدارة دورة الحياة",
  Import: "استيراد",
  "incorporates and modifies": "يدمج ويعدل",
  Index: "الفهرس",
  "Initially, only one of the sites added for replication may have data. After site-replication is successfully configured, this data is replicated to the other (initially empty) sites. Subsequently, objects may be written to any of the sites, and they will be replicated to all other sites.":
    "في البداية، قد يحتوي موقع واحد فقط من المواقع المضافة للنسخ المتماثل على بيانات. بعد تكوين النسخ المتماثل للموقع بنجاح، يتم نسخ هذه البيانات إلى المواقع الأخرى (الفارغة في البداية). وبعد ذلك، قد تتم كتابة الكائنات إلى أي من المواقع، وسيتم نسخها إلى كافة المواقع الأخرى.",
  "Inspect Decryption Key": "فحص مفتاح فك التشفير",
  "Inspect Object": "فحص الكائن",
  "Inspect this file": "قم بفحص هذا الملف",
  Internal: "داخلي",
  "Invalid bucket name": "اسم الحاوية غير صالح",
  "Invalid Endpoint set": "نقطة النهاية المحددة غير صالحة",
  "Invalid Name": "اسم غير صالح",
  January: "يناير",
  "JSON Results:": "نتائج JSON:",
  July: "يوليو",
  June: "يونيو",
  "Just now": "الآن",
  "Kafka topic used for bucket notifications":
    "موضوع Kafka المستخدم لإشعارات الحاويات",
  "Keep Alive Interval": "فاصل إبقاء الاتصال نشطًا",
  "Keep-alive interval for MQTT connections in s,m,h,d":
    "فاصل إبقاء اتصالات MQTT نشطة بوحدات s,m,h,d",
  Key: "المفتاح",
  "Key Management Service Endpoints:": "نقاط نهاية خدمة إدارة المفاتيح:",
  "Key Name": "اسم المفتاح",
  "Key name cannot contain spaces": "لا يمكن أن يحتوي اسم المفتاح على مسافات",
  Keys: "مفاتيح",
  "KMS Key ID": "معرّف مفتاح KMS",
  "Last Modified": "آخر تعديل",
  "Last modified:": "آخر تعديل:",
  "Last Modified:": "آخر تعديل:",
  "Latency Histogram": "مدرج تكراري لزمن الاستجابة",
  "LDAP Enabled": "LDAP مفعّل",
  "Learn more about {link}.": "اعرف المزيد عن {link}.",
  "Learn more about Access Keys": "تعرّف على مفاتيح الوصول",
  "Learn more about Groups": "اعرف المزيد عن المجموعات",
  "Learn more about LDAP Configurations": "تعرّف على إعدادات LDAP",
  "Learn more about OpenID Connect Configurations":
    "تعرّف على إعدادات OpenID Connect",
  "Learn more about Policies": "تعرّف على السياسات",
  "Learn more about the Users feature": "تعرف على المزيد حول ميزة المستخدمين",
  "Learn more about TIERS": "تعرّف على طبقات التخزين",
  "Legal Hold": "الاحتفاظ القانوني",
  "Legal Hold Status": "حالة الاحتفاظ القانوني",
  "Legal Hold:": "احتفاظ قانوني:",
  "licensing in full": "الترخيص كاملا",
  Lifecycle: "دورة الحياة",
  "Lifecycle Configuration": "إعدادات دورة الحياة",
  "Lifecycle Rules": "قواعد دورة الحياة",
  Link: "رابط",
  'List of etcd endpoints e.g. "http://localhost:2379" - you can write one per field':
    'قائمة etcd نقاط النهاية على سبيل المثال. "http://localhost:2379" - يمكنك كتابة واحدة في كل حقل',
  "List of origins allowed for CORS requests":
    "قائمة المصادر المسموح بها لطلبات CORS",
  "List of Replicated Sites": "قائمة المواقع المنسوخة",
  "Load more": "تحميل المزيد",
  "Load more Versions": "تحميل المزيد من الإصدارات",
  "Load Time": "وقت التحميل",
  "Loading nodes": "تحميل العقد",
  "Local Buckets to replicate": "الحاويات المحلية المطلوب نسخها",
  Location: "الموقع",
  Locking: "القفل",
  "Log Details": "تفاصيل السجل",
  "Logger Webhook": "Webhook السجلات",
  "Lookup Bind DN is required": "رابط البحث DN مطلوب",
  "Lookup Bind Password is required": "مطلوب كلمة مرور ربط البحث",
  "Lookup Bind Password must be re-entered to change LDAP configurations":
    "يجب إعادة إدخال كلمة مرور ربط البحث لتغيير تكوينات LDAP",
  "Manage Groups": "إدارة المجموعات",
  Mandatory: "إلزامية",
  "Manually Configure String": "تكوين السلسلة يدويًا",
  March: "مارس",
  "Max IO": "الحد الأقصى IO",
  "Max Sleep": "أقصى مدة سكون",
  "Max Wait": "أقصى مدة انتظار",
  "Maximum IO requests allowed between objects to slow down heal operation, e.g. 3":
    "الحد الأقصى لطلبات IO المسموح بها بين الكائنات لإبطاء عملية الإصلاح، مثل: 3",
  "Maximum limit for undelivered messages, defaults to '10000'":
    'الحد الأقصى للرسائل التي لم يتم تسليمها، الافتراضي هو "10000"',
  "Maximum number of concurrent requests, e.g. '1600'":
    'الحد الأقصى لعدد الطلبات المتزامنة، على سبيل المثال. "1600"',
  "Maximum sleep duration between objects to slow down heal operation, e.g. 2s":
    "أقصى مدة سكون بين الكائنات لإبطاء عملية الإصلاح، مثل: 2s",
  "Maximum wait time between operations, defaults to '15s'":
    "أقصى وقت انتظار بين العمليات، القيمة الافتراضية هي '15s'",
  May: "مايو",
  "May try again or download Health report JSON File.":
    "يمكنك إعادة المحاولة أو تنزيل تقرير حالة النظام بصيغة JSON.",
  Members: "الأعضاء",
  "Memory Info": "معلومات الذاكرة",
  Metadata: "البيانات الوصفية",
  "Metadata Sync": "مزامنة البيانات الوصفية",
  Method: "الطريقة",
  "Mime Types": "أنواع MIME",
  'Mime types e.g. "text/*", "application/json" or "application/xml" - you can write one per field':
    'أنواع MIME مثل "text/*" أو "application/json" أو "application/xml" — يمكنك كتابة نوع واحد في كل حقل',
  minute: "دقيقة",
  minutes: {
    zero: "دقائق",
    one: "دقيقة",
    two: "دقيقتان",
    few: "دقائق",
    many: "دقيقة",
    other: "دقيقة",
  },
  Minutes: "دقيقة",
  Mode: "الوضع",
  "Mode:": "الوضع:",
  month: "شهر",
  months: {
    zero: "أشهر",
    one: "شهر",
    two: "شهران",
    few: "أشهر",
    many: "شهرًا",
    other: "شهر",
  },
  "More filter options": "المزيد من خيارات التصفية",
  "MQTT password": "كلمة مرور MQTT",
  "MQTT server endpoint e.g. `tcp://localhost:1883`":
    "نقطة نهاية خادم MQTT، مثل `tcp://localhost:1883`",
  "MQTT username": "اسم مستخدم MQTT",
  "Multi Bucket lifecycle Assignments Results":
    "نتائج تعيين دورة الحياة لعدة حاويات",
  Name: "الاسم",
  "Name for identity provider configuration": "اسم تكوين موفر الهوية",
  "Name of the AMQP exchange": "اسم مُبدّل AMQP",
  'Name of the location of the server e.g. "us-west-rack2"':
    'اسم موقع الخادم، مثل: "us-west-rack2"',
  "Name of the MQTT topic to publish": "إسم الموضوع MQTT المراد نشره",
  "Name:": "الاسم:",
  'Namespace prefix to isolate tenants e.g. "customer1/"':
    'بادئة مساحة الاسم لعزل المستأجرين، مثل: "customer1/"',
  "NATS password": "كلمة مرور NATS",
  "NATS server address e.g. '0.0.0.0:4222'":
    "عنوان خادم NATS، مثل: '0.0.0.0:4222'",
  "NATS subscription subject": "موضوع اشتراك NATS",
  "NATS token": "رمز NATS",
  "NATS username": "اسم مستخدم NATS",
  "Network Info": "معلومات الشبكة",
  "New {entity} Created": "تم إنشاء {entity} جديد",
  "New Audit Webhook": "Webhook تدقيق جديد",
  "New Endpoint": "نقطة نهاية جديدة",
  "New Endpoint:": "نقطة النهاية الجديدة:",
  "New Folder Path": "مسار المجلد الجديد",
  "New Logger Webhook": "Webhook سجلات جديد",
  "New Password": "كلمة المرور الجديدة",
  "New passwords don't match": "كلمات المرور الجديدة غير متطابقة",
  "New Tag Key": "مفتاح وسم جديد",
  "New Tag Label": "تسمية وسم جديدة",
  Next: "التالي",
  No: "لا",
  "No changes applied": "لم يتم تطبيق أي تغييرات",
  "No Changes at this time": "لا توجد تغييرات في هذا الوقت",
  "No data available": "لا توجد بيانات متاحة",
  "No Groups Available": "لا توجد مجموعات متاحة",
  "No Policies Available": "لا توجد سياسات متاحة",
  "No query results yet": "لا توجد نتائج استعلام بعد",
  "No Results Available": "لا توجد نتائج متاحة",
  "No Users to display": "لا يوجد مستخدمين لعرضهم",
  "No Wait": "دون انتظار",
  "no-expiry": "بلا انتهاء",
  "Nodes:": "العقد:",
  "Non-blocking message delivery when set to 'on', default is 'off'":
    "تسليم الرسائل دون حظر عند الضبط على 'on'، والقيمة الافتراضية هي 'off'",
  "Non-Current": "غير جارية",
  "Non-current Expiration Days": "انتهاء الإصدارات السابقة (أيام)",
  "Non-current Transition Days": "الأيام الانتقالية غير الحالية",
  "Non-Current Version": "الإصدار غير الحالي",
  "Non-current Version Transition Storage Class":
    "فئة التخزين الانتقالية للإصدار غير الحالي",
  None: "لا يوجد",
  "Not what you expected?": "ليس كما توقعت؟",
  "Note:": "ملاحظة:",
  "Note: AccessKey and SecretKey values for every site is required while adding or editing peer sites":
    "ملاحظة: يلزم إدخال AccessKey وSecretKey لكل موقع عند إضافة المواقع النظيرة أو تعديلها.",
  November: "نوفمبر",
  "NSQ server address e.g. '127.0.0.1:4150'":
    "NSQ عنوان الخادم على سبيل المثال. '127.0.0.1:4150'",
  "NSQ topic": "موضوع NSQ",
  "NSQD Address": "عنوان NSQD",
  "NULL VERSION": "إصدار NULL",
  "Number of {unit} must be less than or equal to 2147483647":
    "يجب ألا يتجاوز عدد {unit} القيمة 2147483647",
  "Number of {unit} to retain must be greater than zero":
    "يجب أن يكون عدد {unit} المراد الاحتفاظ به أكبر من الصفر",
  "Number of messages to publish without waiting for ACKs":
    "عدد الرسائل المراد نشرها دون انتظار ACK",
  "Number of replication workers for recently failed replicas, defaults to 4":
    "عدد عمال النسخ المتماثل للنسخ المتماثلة الفاشلة مؤخرًا، القيمة الافتراضية هي 4",
  "Number of replication workers, defaults to 100":
    "عدد عمال النسخ، الافتراضي هو 100",
  Object: "كائن",
  "Object Date": "تاريخ الكائن",
  "Object Filters": "مرشّحات الكائنات",
  "Object Info": "معلومات الكائن",
  "Object Locking:": "قفل الكائن:",
  "Object Size": "حجم الكائن",
  "Object Version": "إصدار الكائن",
  "Objects deleted successfully.": "تم حذف الكائنات بنجاح.",
  "Objects in excluded prefixes do not replicate to any peer site or remote site.":
    "لا تُنسخ الكائنات الموجودة ضمن البادئات المستبعدة إلى أي موقع نظير أو بعيد.",
  "Objects List unavailable. Please review your WebSockets configuration and try again":
    "قائمة الكائنات غير متاحة. راجع إعدادات WebSockets وأعد المحاولة",
  "Objects:": "الكائنات:",
  "Objs/S": "كائن/ث",
  October: "أكتوبر",
  of: "من",
  "Only empty tiers can be deleted. If the tier has had objects transitioned into it, it cannot be removed.":
    "لا يمكن حذف سوى طبقات التخزين الفارغة. إذا نُقلت عناصر إلى الطبقة من قبل، فلا يمكن إزالتها.",
  "Opaque string or JWT authorization token":
    "سلسلة نصية مبهمة أو رمز تفويض JWT",
  "Open Dialog": "فتح مربع الحوار",
  "OpenID Configurations": "إعدادات OpenID",
  "OS Info": "معلومات نظام التشغيل",
  other: "أخرى",
  "Password for LDAP read-only service account used to perform DN and group lookups":
    "كلمة المرور لحساب خدمة القراءة LDAP المستخدمة لإجراء DN وعمليات البحث الجماعية",
  "Password for SASL/PLAIN or SASL/SCRAM authentication":
    "كلمة المرور للمصادقة SASL/PLAIN أو SASL/SCRAM",
  "Passwords must be at least 8 characters long":
    "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
  Path: "المسار",
  "Path cannot start with /": "لا يمكن أن يبدأ المسار بـ /",
  "Path copied to clipboard": "تم نسخ المسار إلى الحافظة",
  "Path Prefix": "بادئة المسار",
  "Path to certificate chain of the target NATS server":
    "المسار إلى سلسلة الشهادات للخادم NATS الهدف",
  "Path to client certificate for mTLS authorization":
    "المسار إلى شهادة العميل للحصول على ترخيص mTLS",
  "Path to client key for mTLS authorization":
    "المسار إلى مفتاح العميل للحصول على ترخيص mTLS",
  "Peer Sites": "المواقع النظيرة",
  "Perform bitrot scan on disks when checking objects during scanner":
    "إجراء فحص bitrot على الأقراص عند فحص الكائنات أثناء الماسح الضوئي",
  "Performance test": "اختبار الأداء",
  "Persist queue across broker restarts when set to 'on', default is 'off'":
    "الحفاظ على قائمة الانتظار عند إعادة تشغيل الوسيط عند الضبط على 'on'، والقيمة الافتراضية هي 'off'",
  "Ping Interval": "فترة Ping",
  "Please avoid the use of root credentials for this feature":
    "يرجى تجنب استخدام بيانات اعتماد الجذر لهذه الميزة",
  "Please configure {entity} first to use this feature.":
    "يرجى تكوين {entity} أولاً لاستخدام هذه الميزة.",
  "Please deploy a server in {distributedMode} to use these features.":
    "يرجى نشر خادم في {distributedMode} لاستخدام هذه الميزات.",
  "Please deploy a server in {mode} to use this feature.":
    "يرجى نشر خادم في {mode} لاستخدام هذه الميزة.",
  "N/A": "لا يوجد",
  "Enter a positive quota below 8 PiB, with up to two decimal places. Use mcli for larger quotas.":
    "أدخل حصة موجبة أقل من 8 PiB، بدقة تصل إلى منزلتين عشريتين. استخدم mcli للحصص الأكبر.",
  "The current quota is 8 PiB or larger, which the browser cannot edit exactly. Change it with mcli, enter a smaller quota, or disable it here.":
    "الحصة الحالية هي 8 PiB أو أكبر، والتي لا يستطيع المتصفح تعديلها بالضبط. قم بتغييره باستخدام mcli، أو أدخل حصة أصغر، أو قم بتعطيلها هنا.",
  "Please Login via the configured external identity provider.":
    "يرجى تسجيل الدخول عبر موفر الهوية الخارجية الذي تم تكوينه.",
  "Please note": "يرجى ملاحظة",
  "Please note that this may cause your system to not be accessible":
    "يرجى ملاحظة أن هذا قد يتسبب في عدم إمكانية الوصول إلى نظامك",
  "Please refer to {link} credentials.":
    "يرجى الرجوع إلى {link} بيانات الاعتماد.",
  "Please select / type the desired remote bucket were you want the local data to be replicated.":
    "يرجى اختيار أو كتابة الحاوية البعيدة المطلوب نسخ البيانات المحلية إليها.",
  "Please select a valid duration.": "الرجاء تحديد مدة صالحة.",
  "Please select Groups on which you want to apply Policies":
    "الرجاء تحديد المجموعات التي تريد تطبيق السياسات عليها",
  "Please verify that string is uppercase only and contains valid characters (numbers, dashes & underscores).":
    "يرجى التحقق من أن السلسلة مكتوبة بأحرف كبيرة فقط وتحتوي على أحرف صالحة (أرقام وشرطات وشرطات سفلية).",
  Policy: "سياسة",
  "Policy has no statements": "لا تحتوي السياسة على أي عبارات",
  "Policy mapping": "تعيين السياسة",
  "Policy Mappings": "تعيينات السياسات",
  "Policy Name": "اسم السياسة",
  "Policy name cannot be empty": "لا يمكن أن يكون اسم السياسة فارغًا",
  "Policy successfully updated": "تم تحديث السياسة بنجاح",
  "Policy Summary": "ملخص السياسة",
  "Portions © 2015–2026 MinIO, Inc.": "أجزاء من العمل © 2015–2026 MinIO, Inc.",
  prefix: "البادئة",
  Prefix: "البادئة",
  "Preliminar Results:": "النتائج الأولية:",
  preview: "معاينة",
  Preview: "معاينة",
  "Preview - {object}": "معاينة — {object}",
  "Preview Selected File": "معاينة الملف المحدد",
  "Preview this File": "قم بمعاينة هذا الملف",
  "Preview unavailable": "المعاينة غير متاحة",
  Priority: "الأولوية",
  private: "خاص",
  Private: "خاص",
  "Process Info": "معلومات العملية",
  public: "عام",
  Public: "عام",
  "PUT - Object Uploaded": "PUT - تم تحميل الكائن",
  "Query Filters": "مرشّحات الاستعلام",
  "Query Results": "نتائج الاستعلام",
  Queue: "قائمة الانتظار",
  "Queue Dir": "دليل قائمة الانتظار",
  "Queue Directory": "دليل قائمة الانتظار",
  "Queue Limit": "حد قائمة الانتظار",
  "Quietly ignore undelivered messages when set to 'off', default is 'on'":
    "تجاهل الرسائل غير المسلّمة بصمت عند الضبط على 'off'، والقيمة الافتراضية هي 'on'",
  quota: "حصة",
  Quota: "الحصة",
  "Quota:": "الحصة:",
  "Randomized access credentials are recommended, and provided by default. You may use your own custom Access Key and Secret Key by replacing the default values. After creation of any Access Key, you will be given the opportunity to view and download the account credentials.":
    "يوصى باستخدام بيانات اعتماد الوصول العشوائي، ويتم توفيرها افتراضيًا. يمكنك استخدام مفتاح الوصول والمفتاح السري المخصصين لك عن طريق استبدال القيم الافتراضية. بعد إنشاء أي مفتاح وصول، ستُتاح لك الفرصة لعرض بيانات اعتماد الحساب وتنزيلها.",
  "Raw Policy": "نص السياسة الخام",
  readonly: "للقراءة فقط",
  readwrite: "قراءة وكتابة",
  "Reconnect Interval": "فترة إعادة الاتصال",
  "Reconnect interval for MQTT connections in s,m,h,d":
    "فترة إعادة اتصالات MQTT بوحدات s أو m أو h أو d",
  "Redirect URI Dynamic": "عنوان URI ديناميكي لإعادة التوجيه",
  "Redis key to store/update events, key is auto-created":
    "مفتاح Redis لتخزين الأحداث وتحديثها، ويُنشأ تلقائيًا",
  "Redis server password": "كلمة مرور خادم Redis",
  "Redis server's address e.g. `localhost:6379`":
    "عنوان خادم Redis، مثل: `localhost:6379`",
  Refresh: "تحديث",
  "Refresh List": "تحديث القائمة",
  Region: "المنطقة",
  "Remote Bucket Assignments": "تعيينات الحاويات البعيدة",
  "Remote Configuration": "الإعدادات البعيدة",
  "Remote Endpoint Configuration": "إعدادات نقطة النهاية البعيدة",
  "Remote Host": "المضيف البعيد",
  "remote tier": "طبقة تخزين بعيدة",
  "Remove Row": "إزالة الصف",
  "Remove Selected Replication Rules": "إزالة قواعد النسخ المتماثل المحددة",
  "Remove Selected Rules": "إزالة القواعد المحددة",
  "Remove the reference to the object if no versions are left":
    "إزالة مرجع الكائن إذا لم تبقَ أي إصدارات",
  "Removes all the versions of the object already expired":
    "إزالة جميع إصدارات الكائن المنتهية صلاحيتها",
  "Rename Download": "تغيير اسم التنزيل",
  "REPLICA - Object Replicated": "REPLICA — تم نسخ الكائن",
  "Replicate existing objects": "نسخ الكائنات الموجودة",
  "Replicate soft deletes": "نسخ عمليات الحذف المنطقي",
  "Replicate versioned deletes": "نسخ عمليات حذف الإصدارات",
  Replication: "النسخ المتماثل",
  "Replication Failed Workers": "عمّال النسخ المتماثل الفاشل",
  "Replication Mode": "وضع النسخ المتماثل",
  "Replication Options": "خيارات النسخ المتماثل",
  "Replication Rules": "قواعد النسخ المتماثل",
  "Replication Status": "حالة النسخ المتماثل",
  "Replication status for {type}: {name}.":
    "حالة النسخ المتماثل لـ {type}: {name}.",
  "Replication status from all Sites": "حالة النسخ المتماثل من جميع المواقع",
  "Replication Workers": "عمّال النسخ المتماثل",
  "Replication:": "النسخ :",
  "Reported Usage:": "الاستخدام المبلغ عنه:",
  "Request Content Length": "طول محتوى الطلب",
  "Request ID": "معرّف الطلب",
  "Requests Max": "الحد الأقصى للطلبات",
  "Requests that took T ms or less": "الطلبات التي استغرقت T مللي ثانية أو أقل",
  Reset: "إعادة الضبط",
  "Reset Configuration": "إعادة ضبط التكوين",
  "Reset Default Webhook": "إعادة ضبط Webhook الافتراضي",
  "Resources:": "الموارد:",
  "Response Content Length": "طول محتوى الرد",
  "Response Status": "حالة الاستجابة",
  "Response Status Code": "رمز حالة الاستجابة",
  "Response Threshold": "حد الاستجابة",
  Restart: "إعادة التشغيل",
  "Restore Defaults": "استعادة الإعدادات الافتراضية",
  "Restore File Version": "استعادة إصدار الملف",
  "Restore this version": "استعادة هذا الإصدار",
  "Restrict beyond user policy": "تقييد إضافي فوق سياسة المستخدم",
  Results: "النتائج",
  Retention: "الاحتفاظ",
  "Retention Mode": "وضع الاحتفاظ",
  "Retention Policy:": "سياسة الاحتفاظ:",
  "Retention Unit": "وحدة مدة الاحتفاظ",
  "Retention Validity": "مدة الاحتفاظ",
  "Retention:": "الاحتفاظ:",
  Retest: "إعادة الاختبار",
  "Retry Health Report": "إعادة محاولة التقرير الصحي",
  Rewind: "الاسترجاع الزمني",
  "Rewind - {bucket}": "الاسترجاع الزمني — {bucket}",
  "Rewind Bucket": "الاسترجاع الزمني للحاوية",
  "Rewind to": "الاسترجاع الزمني إلى",
  "Role Policy": "سياسة الدور",
  rotating: "الدورية",
  "Routing Key": "مفتاح التوجيه",
  "Routing key for publishing": "مفتاح التوجيه للنشر",
  "Rule State": "حالة القاعدة",
  "Rule Type": "نوع القاعدة",
  "Running {mcDu} without the {flag} flag or {df} will provide different values corresponding to the size of all {current} versions and the physical disk space occupied respectively.":
    "تشغيل {mcDu} بدون العلم {flag} أو {df} سيوفر قيمًا مختلفة تتوافق مع حجم جميع إصدارات {current} ومساحة القرص الفعلية المشغولة على التوالي.",
  "S3 lifecycle": "دورة حياة S3",
  "SASL authentication mechanism": "آلية مصادقة SASL",
  "SASL authentication mechanism, default 'PLAIN'":
    "آلية مصادقة SASL، القيمة الافتراضية 'PLAIN'",
  "SASL Mechanism": "آلية SASL",
  "SASL Password": "كلمة مرور SASL",
  "SASL Username": "اسم مستخدم SASL",
  "Save Event Destination": "حفظ وجهة الحدث",
  "Save Tier Configuration": "حفظ إعدادات طبقة التخزين",
  Scanner: "الماسح",
  "SCANNER - Object has too many versions / Prefixes has too many sub-folders":
    "SCANNER — للكائن إصدارات كثيرة جدًا، أو للبادئات مجلدات فرعية كثيرة جدًا",
  "Scanner delay multiplier, defaults to '10.0'":
    "مضاعف تأخير الماسح، القيمة الافتراضية هي '10.0'",
  Scopes: "النطاقات",
  Search: "بحث",
  "Search Access Keys": "بحث في مفاتيح الوصول",
  "Search Groups": "بحث في المجموعات",
  "Search Keys with pattern": "بحث في المفاتيح بنمط",
  "Search members": "البحث عن الأعضاء",
  "Search Policies": "بحث في السياسات",
  "Search target": "هدف البحث",
  "Search Users": "بحث في المستخدمين",
  second: "ثانية",
  seconds: {
    zero: "ثوانٍ",
    one: "ثانية",
    two: "ثانيتان",
    few: "ثوانٍ",
    many: "ثانية",
    other: "ثانية",
  },
  "Secret Key": "المفتاح السري",
  "SecretKey is required": "SecretKey مطلوب",
  "Select {expiry} to delete Objects per this rule. Select {transition} to move Objects to a remote storage {tier} per this rule.":
    "اختر {expiry} لحذف الكائنات وفق هذه القاعدة. اختر {transition} لنقل الكائنات إلى {tier} بعيدة وفق هذه القاعدة.",
  "Select Bucket": "اختر الحاوية",
  "Select from the list of displayed users to assign users to the new group at creation. These users inherit the policies assigned to the group.":
    "اختر من قائمة المستخدمين الظاهرة لإضافتهم إلى المجموعة الجديدة عند إنشائها. سيرث هؤلاء المستخدمون السياسات المعيّنة للمجموعة.",
  "Select Groups to delete": "حدد المجموعات المراد حذفها",
  "Select Multiple Versions": "حدد إصدارات متعددة",
  "Select Policy": "اختر السياسة",
  "Select the desired level of access available to unauthenticated Users":
    "حدد مستوى الوصول المطلوب المتاح للمستخدمين غير المصادقين",
  "Select Tier Type": "اختر نوع الطبقة",
  "Select to set expiry by days or newer noncurrent versions":
    "حدد لتعيين انتهاء الصلاحية بالأيام أو الإصدارات الأحدث غير الحالية",
  "Select Users to delete": "حدد المستخدمين المراد حذفهم",
  "Select Users to group": "حدد المستخدمين للتجميع",
  "Select whether to apply the rule to current or non-current Object {versions}":
    "حدد ما إذا كنت تريد تطبيق القاعدة على {versions} الكائن الحالية أو غير الحالية",
  "Selected Group": "المجموعة المختارة",
  "Selected Groups": "المجموعات المختارة",
  "Selected Object": "الكائن المحدد",
  "Selected Objects:": "الكائنات المحددة:",
  "Selected User": "المستخدم المحدد",
  "Selected Users": "المستخدمون المختارون",
  September: "سبتمبر",
  Series: "سلسلة",
  server: "الخادم",
  "Server Address": "عنوان الخادم",
  "Server Address is required": "عنوان الخادم مطلوب",
  "Server Config": "إعدادات الخادم",
  "Server Health Info": "معلومات صحة الخادم",
  "Server Insecure": "الخادم غير آمن",
  "Server Location": "موقع الخادم",
  "server-side bucket replication": "النسخ المتماثل للحاوية من جانب الخادم",
  "Server, client and Console are all AGPLv3. SILO's documentation is CC BY 4.0 — {licensing}.":
    "الخادم والعميل ووحدة التحكم كلها AGPLv3. وثائق SILO هي CC BY 4.0 — {licensing}.",
  Service: "الخدمة",
  "Service Accounts": "حسابات الخدمة",
  Services: "الخدمات",
  Set: "تعيين",
  "Set Anonymous Access to this Folder":
    "قم بتعيين الوصول المجهول إلى هذا المجلد",
  "Set Bucket Replication": "تعيين النسخ المتماثل للحاوية",
  "Set Groups": "ضبط المجموعات",
  "Set Legal Hold": "تعيين الاحتفاظ القانوني",
  "Set Lifecycle to multiple buckets": "تعيين دورة الحياة لعدة حاويات",
  "Set Multiple Bucket Replication": "تعيين النسخ المتماثل لعدة حاويات",
  "Set Non-current Version Transition Storage Class":
    "تعيين فئة التخزين الانتقالية للإصدار غير الحالي",
  "Set Policies": "تعيين السياسات",
  "Set Retention Configuration": "إعداد الاحتفاظ",
  "Set Retention Policy": "تعيين سياسة الاحتفاظ",
  "Set the quality of service priority, defaults to '0'":
    "ضبط أولوية جودة الخدمة، القيمة الافتراضية هي '0'",
  "Set to '1' for non-persistent or '2' for persistent queue":
    "اضبط على '1' لقائمة الانتظار غير المستمرة أو '2' لقائمة الانتظار المستمرة",
  "Set to 'on' for exchange to be not used directly by publishers, but only when bound to other exchanges":
    "اضبط على 'on' لعدم استخدام المُبدّل مباشرة من قِبل الناشرين، بل عند ربطه بمُبدّلات أخرى فقط",
  "Set to 'on' to enable asynchronous publish":
    "اضبط على 'on' لتفعيل النشر غير المتزامن",
  "Set to 'on' to enable SASL authentication":
    "اضبط على 'on' لتفعيل مصادقة SASL",
  "Set to 'on' to enable TLS": "اضبط على 'on' لتفعيل TLS",
  "Set to 'on' to use streaming NATS server":
    "اضبط على 'on' لاستخدام خادم بث NATS",
  "Setting a {quota} assigns a hard limit to a bucket beyond which SILO does not allow writes.":
    "يؤدي تعيين {quota} إلى فرض حد صارم على الحاوية لا يسمح SILO بالكتابة بعد تجاوزه.",
  "Setting an {anonymous} policy allows clients to access the Bucket or prefix contents and perform actions consistent with the specified policy without authentication.":
    "يتيح تعيين سياسة {anonymous} للعملاء الوصول إلى محتويات الحاوية أو البادئة وتنفيذ إجراءات تتوافق مع السياسة المحددة دون مصادقة.",
  Share: "مشاركة",
  "Share File": "مشاركة الملف",
  "Share Selected File": "مشاركة الملف المحدد",
  "Share this File": "شارك هذا الملف",
  "Share this version": "مشاركة هذا الإصدار",
  "Share URL Copied to clipboard": "نُسخ رابط المشاركة إلى الحافظة",
  'Shared bucket DNS records, default is "/skydns"':
    'سجلات الحاوية المشتركة DNS، الافتراضي هو "/skydns"',
  "Show advanced Filters": "عرض المرشحات المتقدمة",
  "Show Current Data": "عرض البيانات الحالية",
  "Show deleted objects": "عرض العناصر المحذوفة",
  "Show Rewind Data": "عرض بيانات الاسترجاع الزمني",
  "Show/Hide": "إظهار/إخفاء",
  "SILO {bucketNotifications} allow administrators to send notifications to supported external services on certain object or bucket events.":
    "تتيح {bucketNotifications} في SILO للمسؤولين إرسال إشعارات إلى خدمات خارجية مدعومة عند وقوع أحداث معينة تخص الكائنات أو الحاويات.",
  "SILO {objectLocking} enforces Write-Once Read-Many (WORM) immutability to protect versioned objects from deletion.":
    "تفرض {objectLocking} في SILO عدم القابلية للتغيير وفق نموذج الكتابة مرة واحدة والقراءة مرات متعددة (WORM)، لحماية الكائنات ذات الإصدارات من الحذف.",
  "SILO {serverSideReplication} is an automatic bucket-level configuration that synchronizes objects between a source and destination bucket.":
    "تُعدّ {serverSideReplication} في SILO إعدادًا تلقائيًا على مستوى الحاوية يزامن الكائنات بين حاوية المصدر وحاوية الوجهة.",
  "SILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events. SILO supports bucket and object-level S3 events similar to the Amazon S3 Event Notifications.":
    "تتيح إشعارات الحاويات في SILO للمسؤولين إرسال إشعارات إلى خدمات خارجية مدعومة عند وقوع أحداث معينة تخص الكائنات أو الحاويات. يدعم SILO أحداث S3 على مستوى الحاويات والكائنات، على غرار إشعارات Amazon S3.",
  "SILO derives its behavior and syntax from {s3Lifecycle} for compatibility in migrating workloads and lifecycle rules from S3 to SILO.":
    "يستمد SILO السلوك والصياغة من {s3Lifecycle} لتسهيل ترحيل أعباء العمل وقواعد دورة الحياة من S3 إلى SILO.",
  "SILO does not enable existing object replication by default. Objects created before replication was configured or while replication is disabled are not synchronized to the target deployment unless replication of existing objects is enabled.":
    "لا يفعّل SILO نسخ الكائنات الموجودة افتراضيًا. فالكائنات المنشأة قبل إعداد النسخ المتماثل أو أثناء تعطيله لا تُزامن إلى النشرة المستهدفة إلا إذا فُعّل نسخ الكائنات الموجودة.",
  "SILO Health Info": "معلومات حالة SILO",
  "SILO Object Lifecycle Management allows creating rules for time or date based automatic transition or expiry of objects. For object transition, SILO automatically moves the object to a configured remote storage tier.":
    "تتيح إدارة دورة حياة الكائنات في SILO إنشاء قواعد لنقل الكائنات أو إنهاء صلاحيتها تلقائيًا استنادًا إلى المدة أو التاريخ. وعند النقل، ينقل SILO الكائن تلقائيًا إلى طبقة تخزين بعيدة مُعدّة مسبقًا.",
  "SILO or other S3-compatible storage": "SILO أو تخزين آخر متوافق مع S3",
  "SILO PBAC is built for compatibility with AWS IAM policy syntax, structure, and behavior.":
    "صُمم التحكم في الوصول المستند إلى السياسات في SILO للتوافق مع صياغة سياسات AWS IAM وبنيتها وسلوكها.",
  "SILO queries the configured Active Directory / LDAP server to verify the credentials specified by the application and optionally return a list of groups in which the user has membership. SILO supports two modes (Lookup-Bind Mode and Username-Bind Mode) for performing these queries":
    "يستعلم SILO من خادم Active Directory / LDAP المُعدّ للتحقق من بيانات الاعتماد التي يقدمها التطبيق، ويمكنه إرجاع قائمة المجموعات التي ينتمي إليها المستخدم. ويدعم وضع الربط بعد البحث ووضع الربط باسم المستخدم لتنفيذ هذه الاستعلامات.",
  "SILO recommends using Lookup-Bind mode as the preferred method for verifying AD/LDAP credentials. Username-Bind mode is a legacy method retained for backwards compatibility only.":
    "يوصي SILO بوضع الربط بعد البحث للتحقق من بيانات اعتماد AD/LDAP. أما وضع الربط باسم المستخدم فهو أسلوب قديم أبقي عليه للتوافق مع الإصدارات السابقة فقط.",
  "SILO requires versioning to support replication.":
    "يتطلب SILO تفعيل إدارة الإصدارات لدعم النسخ المتماثل.",
  "SILO supports automatically replicating existing objects in a bucket; this setting is enabled by default. Please note that objects created before replication was configured or while replication is disabled are not synchronized to the target deployment in case this setting is not enabled.":
    "يدعم SILO النسخ التلقائي للكائنات الموجودة في الحاوية، ويكون هذا الإعداد مفعّلًا افتراضيًا. إذا لم يُفعّل، فلن تُزامن إلى النشرة المستهدفة الكائنات المنشأة قبل إعداد النسخ المتماثل أو أثناء تعطيله.",
  "SILO supports creating object transition lifecycle management rules, where SILO can automatically move an object to a remote storage “tier”.":
    "يدعم SILO إنشاء قواعد لنقل الكائنات ضمن إدارة دورة الحياة، بحيث يمكنه نقل الكائن تلقائيًا إلى طبقة تخزين بعيدة.",
  "SILO supports enabling automatic {sseKms} and {sseS3} encryption of all objects written to a bucket using a specific External Key (EK) stored on the external KMS.":
    "يدعم SILO التشفير التلقائي باستخدام {sseKms} و{sseS3} لجميع الكائنات المكتوبة في الحاوية، باستخدام مفتاح خارجي (EK) محدد ومخزّن في خدمة KMS الخارجية.",
  "SILO supports enabling replication of existing objects in a bucket.":
    "يدعم SILO تفعيل نسخ الكائنات الموجودة في الحاوية.",
  "SILO supports keeping multiple {versions} of an object in a single bucket.":
    "يدعم SILO الاحتفاظ بعدة {versions} للكائن داخل حاوية واحدة.",
  "SILO supports replicating delete operations, where SILO synchronizes deleting specific object versions and new delete markers. Delete operation replication uses the same replication process as all other replication operations.":
    "يدعم SILO نسخ عمليات الحذف، بمزامنة حذف إصدارات كائنات محددة وإنشاء علامات حذف جديدة. ويستخدم ذلك آلية النسخ المتماثل نفسها المستخدمة للعمليات الأخرى.",
  "SILO supports server-side and client-side replication of objects between source and destination buckets.":
    "يدعم SILO النسخ المتماثل للكائنات من جانب الخادم ومن جانب العميل بين حاويات المصدر والوجهة.",
  "SILO supports setting both {bucketDefault} and per-object retention rules.":
    "يدعم SILO تعيين قواعد احتفاظ من نوع {bucketDefault} وقواعد خاصة بكل كائن.",
  "SILO supports the following Tier types:":
    "يدعم SILO أنواع طبقات التخزين التالية:",
  "SILO supports using an Active Directory or LDAP (AD/LDAP) service for external management of user identities. Configuring an external IDentity Provider (IDP) enables Single-Sign On (SSO) workflows, where applications authenticate against the external IDP before accessing SILO.":
    "SILO يدعم استخدام خدمة Active Directory أو LDAP (AD/LDAP) للإدارة الخارجية لهويات المستخدمين. يؤدي تكوين موفر هوية خارجي (IDP) إلى تمكين سير عمل تسجيل الدخول الموحد (SSO)، حيث تتم مصادقة التطبيقات مقابل IDP الخارجي قبل الوصول إلى SILO.",
  "SILO uses buckets to organize objects. A bucket is similar to a folder or directory in a filesystem, where each bucket can hold an arbitrary number of objects.":
    "يستخدم SILO الحاويات لتنظيم الكائنات. تشبه الحاوية مجلدًا أو دليلًا في نظام الملفات، ويمكن لكل حاوية الاحتفاظ بعدد غير محدد من الكائنات.",
  "SILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.":
    "يستخدم SILO التحكم في الوصول المستند إلى السياسات (PBAC) لتحديد الإجراءات والموارد المتاحة للمستخدم الذي تمت مصادقته. تصف كل سياسة إجراءً واحدًا أو أكثر وشروطًا تحدد صلاحيات مستخدم أو مجموعة مستخدمين.",
  "SILO VERSION": "إصدار SILO",
  "Site Name": "اسم الموقع",
  "Site:": "الموقع:",
  Size: "الحجم",
  "Size:": "الحجم:",
  "Skip TLS Verification": "تجاوز التحقق من TLS",
  "something went wrong": "حدث خطأ ما",
  "Something went wrong.": "حدث خطأ ما.",
  "Sort by": "فرز حسب",
  "Specify the version of the Kafka cluster": "حدّد إصدار عنقود Kafka",
  "Specify the version of the Kafka cluster e.g '2.2.0'":
    "حدّد إصدار عنقود Kafka، مثل: '2.2.0'",
  "Speed Test results:": "نتائج اختبار السرعة:",
  Speedtest: "اختبار السرعة",
  "Speedtest in progress...": "جاري اختبار السرعة...",
  "Staging directory for undelivered messages e.g. '/home/events'":
    "دليل التجهيز المؤقت للرسائل غير المسلّمة، مثل: '/home/events'",
  "STANDARD_IA,REDUCED_REDUNDANCY etc":
    "STANDARD_IA وREDUCED_REDUNDANCY وغيرها",
  Start: "البداية",
  "Start Health Report": "بدء التقرير الصحي",
  "Start Logs": "بدء السجلات",
  "Start Profiling": "بدء التوصيف",
  "Start Time:": "وقت البدء:",
  "Start typing to filter objects in the bucket":
    "ابدأ الكتابة لتصفية الكائنات في الحاوية",
  "Start typing to filter versions of {file}":
    "ابدأ الكتابة لتصفية إصدارات {file}",
  "Start typing to search for a Policy": "ابدأ الكتابة للبحث عن سياسة",
  "Start typing to search for Groups": "ابدأ الكتابة للبحث عن المجموعات",
  Statements: "العبارات",
  Status: "الحالة",
  "Status Code": "رمز الحالة",
  Stop: "توقف",
  "Stop Logs": "إيقاف السجلات",
  "Stop Profiling": "إيقاف التوصيف",
  Storage: "التخزين",
  "Storage Class": "فئة التخزين",
  Streaming: "البث المتدفق",
  "Streaming async": "بث غير متزامن",
  "Streaming Cluster ID": "معرّف عنقود البث",
  "Streaming max publish ACKS in flight":
    "أقصى عدد لإشعارات ACK الجارية أثناء البث",
  Subject: "الموضوع",
  "Subscribe To Bucket Events": "الاشتراك في أحداث الحاوية",
  "Subscribe to Event": "الاشتراك في الحدث",
  Success: "النجاح",
  "Successfully deleted.": "تم الحذف بنجاح.",
  "Successfully updated the password for the user {user}.":
    "تم تحديث كلمة المرور للمستخدم {user} بنجاح.",
  "Successfully updated the password.": "تم تحديث كلمة المرور بنجاح.",
  Suffix: "اللاحقة",
  Summary: "ملخص",
  "Supported API endpoints": "نقاط نهاية API المدعومة",
  Suspended: "معلق",
  Synced: "متزامنة",
  Synchronous: "متزامن",
  "System Health Info": "معلومات صحة النظام",
  Table: "جدول",
  "Tag for: {object}": "وسم الكائن: {object}",
  "Tag Key": "مفتاح الوسم",
  "Tag Label": "تسمية الوسم",
  "Tag Value": "قيمة الوسم",
  Tags: "الوسوم",
  "Tags for: {object}": "وسوم الكائن: {object}",
  "Tags:": "العلامات:",
  "Target Bucket": "حاوية الهدف",
  "Target URL": "عنوان URL الهدف",
  "The bucket selected in this deployment acts as the “source” while the configured remote deployment acts as the “target”.":
    "تعمل الحاوية المحددة في هذه النشرة كمصدر، بينما تعمل النشرة البعيدة المُعدّة كوجهة.",
  "The file must be valid and  should have valid config values":
    "يجب أن يكون الملف صالحًا ويجب أن يحتوي على قيم تكوين صالحة",
  "The file you are trying to download has a long name.":
    "الملف الذي تحاول تنزيله له اسم طويل.",
  "The following Bucket features will NOT be replicated":
    "لن تُنسخ ميزات الحاوية التالية",
  "The following changes are replicated to all other sites":
    "تُنسخ التغييرات التالية إلى جميع المواقع الأخرى",
  "The following URL lets you share this object without requiring a login.":
    "يتيح لك الرابط التالي مشاركة هذا الكائن دون الحاجة إلى تسجيل الدخول.",
  "The current version of this object is a delete marker and cannot be shared.":
    "الإصدار الحالي لهذا العنصر هو علامة حذف ولا يمكن مشاركته.",
  "The selected object version could not be found. Refresh the object list and try again.":
    "تعذّر العثور على إصدار الكائن المحدد. حدّث قائمة الكائنات وأعد المحاولة.",
  "This server does not expose object versions; only the current object can be shared.":
    "هذا الخادم لا يكشف عن إصدارات الكائنات؛ يمكن مشاركة الكائن الحالي فقط.",
  "The instance needs to be restarted for configuration changes to take effect.":
    "يجب إعادة تشغيل المثيل حتى تدخل تغييرات التكوين حيز التنفيذ.",
  "The MinIO name is used here solely to identify the origin of the source code and to describe compatibility — {notice}.":
    "يُستخدم اسم MinIO هنا فقط لتحديد أصل الشفرة المصدرية ووصف التوافق — {notice}.",
  "The selected users were added to the following groups.":
    "تمت إضافة المستخدمين المحددين إلى المجموعات التالية.",
  "The server is restarting.": "تتم إعادة تشغيل الخادم.",
  "The URL expires automatically at the earlier of your configured time ({time}) or the expiration of your current web session.":
    "تنتهي صلاحية الرابط تلقائيًا عند أقرب الموعدين: الوقت المحدد ({time}) أو انتهاء جلسة الويب الحالية.",
  "There are no Configurations yet.": "لا توجد تكوينات حتى الآن.",
  "There are no endpoints yet.": "لا توجد نقاط نهاية بعد.",
  "There are no Groups with this Policy associated yet.":
    "لا توجد مجموعات مرتبطة بهذه السياسة حتى الآن.",
  "There are no Groups yet.": "لا توجد مجموعات حتى الآن.",
  "There are no Policies yet.": "لا توجد سياسات بعد.",
  "There are no tags for this object": "لا توجد علامات لهذا الكائن",
  "There are no User Access Keys yet.":
    "لا توجد مفاتيح وصول للمستخدم حتى الآن.",
  "There are no Users with this Policy associated yet.":
    "لا يوجد مستخدمون مرتبطون بهذه السياسة حتى الآن.",
  "There are no Users yet.": "لا يوجد مستخدمون بعد.",
  "There is no information with this criteria": "لا توجد معلومات بهذا المعيار",
  "There was an error": "حدث خطأ",
  "There was an error creating a Policy ": "حدث خطأ أثناء إنشاء السياسة",
  "There was an error creating a Policy: {details}. Please check Policy syntax.":
    "حدث خطأ أثناء إنشاء السياسة: {details}. تحقّق من صياغة السياسة.",
  "There was an error deleting the tier": "حدث خطأ أثناء حذف الطبقة",
  "There was an error retrieving tier information":
    "حدث خطأ في استرجاع معلومات الطبقة",
  "There was an error updating the Policy ": "حدث خطأ أثناء تحديث السياسة",
  "There was an error updating the Policy: {details}. Please check Policy syntax.":
    "حدث خطأ أثناء تحديث السياسة: {details}. تحقّق من صياغة السياسة.",
  "These features are unavailable in a single-disk setup.":
    "هذه الميزات غير متوفرة في إعداد قرص واحد.",
  "This action is irreversible.": "لا يمكن التراجع عن هذا الإجراء.",
  "This can cause issues on Windows Systems by trimming the file name after download.":
    "يمكن أن يسبب هذا مشاكل على أنظمة Windows عن طريق قص اسم الملف بعد التنزيل.",
  "This configuration cannot be deleted using this module as this was set using OpenID environment variables.":
    "لا يمكن حذف هذا التكوين باستخدام هذه الوحدة حيث تم تعيينه باستخدام متغيرات البيئة OpenID.",
  "this Console": "هذه الكونسول",
  "This feature allows multiple independent SILO sites (or clusters) that are using the same external IDentity Provider (IDP) to be configured as replicas. In this situation the set of replica sites are referred to as peer sites or just sites.":
    "تتيح هذه الميزة إعداد عدة مواقع (أو عناقيد) مستقلة من SILO تستخدم موفّر الهوية الخارجي (IDP) نفسه كنسخ متماثلة. وفي هذه الحالة يُشار إلى مجموعة مواقع النسخ المتماثلة بالمواقع النظيرة أو المواقع.",
  "This feature is not available for a single-disk setup.":
    "هذه الميزة غير متوفرة لإعداد قرص واحد.",
  "This feature is not available.": "هذه الميزة غير متوفرة.",
  "This field is required": "هذا الحقل مطلوب",
  "This is a File Preview for the first {count} pages of the document, if you wish to work with the full document please download instead.":
    "هذه معاينة ملف للصفحات {count} الأولى من المستند، إذا كنت ترغب في العمل مع المستند الكامل، فيرجى التنزيل بدلاً من ذلك.",
  "This location is empty": "هذا الموقع فارغ",
  "This location is empty, please try uploading a new file":
    "هذا الموقع فارغ، يرجى محاولة تحميل ملف جديد",
  "This Site": "هذا الموقع",
  "This site/cluster": "هذا الموقع/العنقود",
  "This Usage value is comparable to {command} which represents the size of all object versions that exist in the buckets.":
    "تعادل قيمة الاستخدام هذه أمر {command} الذي يمثل حجم جميع إصدارات الكائنات الموجودة في الحاويات.",
  "This value is set from the {env} environment variable":
    "يتم تعيين هذه القيمة من متغير البيئة {env}",
  "This value is set from the {name} environment variable":
    "يتم تعيين هذه القيمة من متغير البيئة {name}",
  "This will be displayed only once. It cannot be recovered.":
    "ستُعرض هذه المعلومات مرة واحدة فقط، ولا يمكن استعادتها.",
  "This will change your Console password. Please note your new password down, as it will be required to log into Console after this session.":
    "سيؤدي هذا إلى تغيير كلمة مرور وحدة التحكم الخاصة بك. يرجى تدوين كلمة المرور الجديدة الخاصة بك، حيث سيُطلب منك تسجيل الدخول إلى وحدة التحكم بعد هذه الجلسة.",
  "This will remove the object as well as all of its versions,":
    "سيؤدي هذا إلى إزالة الكائن بالإضافة إلى جميع إصداراته،",
  "This will remove the objects as well as all of their versions,":
    "سيؤدي هذا إلى إزالة الكائنات بالإضافة إلى كافة إصداراتها،",
  Tier: "طبقة تخزين",
  "Tier Name": "اسم طبقة التخزين",
  "Tier Types": "أنواع طبقات التخزين",
  "Tiers are used by the SILO Object Lifecycle Management which allows creating rules for time or date based automatic transition or expiry of objects. For object transition, SILO automatically moves the object to a configured remote storage tier.":
    "تُستخدم طبقات التخزين في إدارة دورة حياة الكائنات في SILO، التي تتيح إنشاء قواعد للنقل أو انتهاء الصلاحية تلقائيًا استنادًا إلى المدة أو التاريخ. وعند النقل، ينقل SILO الكائن إلى طبقة تخزين بعيدة مُعدّة مسبقًا.",
  "Time duration between scanner cycles, defaults to '1m'":
    "المدة الزمنية بين دورات الماسح، القيمة الافتراضية هي '1m'",
  "Time to Response NS": "وقت الرد NS",
  Timestamp: "الطابع الزمني",
  "TLS Client Auth": "مصادقة عميل TLS",
  "TLS skip verify": "TLS تخطي التحقق",
  "TLS Skip Verify": "تجاوز التحقق من TLS",
  "To allow Bucket access without credentials, use the {anonymous} setting":
    "للسماح بالوصول إلى الحاوية دون بيانات اعتماد، استخدم إعداد {anonymous}",
  "To continue please type {phrase} in the box.":
    "للمتابعة يرجى كتابة {phrase} في المربع.",
  "To enable this feature you need to enable versioning on the bucket before creation":
    "لتفعيل هذه الميزة، يجب تفعيل إدارة الإصدارات على الحاوية قبل الإنشاء",
  "To Tier": "إلى المستوى",
  "Today, {time}": "اليوم، {time}",
  "Toggle Share URL between Console and object server URL. Change default with CONSOLE_SHARE_MINIO_URL environment variable":
    "بدّل رابط المشاركة بين لوحة التحكم وخادم الكائنات. يمكن تغيير الخيار الافتراضي بمتغير البيئة CONSOLE_SHARE_MINIO_URL",
  Token: "الرمز",
  "Toogle JSON": "تبديل عرض JSON",
  "Toogle Share URL": "تبديل رابط المشاركة",
  Topic: "الموضوع",
  "Trace Results": "نتائج التتبع",
  "trademark notice": "إشعار العلامة التجارية",
  Transition: "انتقال",
  "Transition Days": "الأيام الانتقالية",
  True: "صحيح",
  "Trust server TLS without verification": "الوثوق بشهادة TLS للخادم دون تحقق",
  'Trust server TLS without verification, defaults to "on" (verify)':
    'الوثوق بشهادة TLS للخادم دون تحقق، القيمة الافتراضية هي "on" (التحقق)',
  Type: "النوع",
  "Type New Password Again": "اكتب كلمة المرور الجديدة مرة أخرى",
  "Type of Lifecycle": "نوع دورة الحياة",
  "Types to profile:": "أنواع التوصيف:",
  "Unable to download widget data": "غير قادر على تنزيل بيانات القطعة",
  "Unable to download widget data - data not available":
    "غير قادر على تنزيل بيانات القطعة - البيانات غير متوفرة",
  "Under section 13 of the AGPL, the corresponding source for this running version is offered to every user who interacts with it over a network, at no charge.":
    "بموجب القسم 13 من رخصة AGPL، تتاح الشفرة المصدرية المقابلة لهذا الإصدار الجاري تشغيله مجانًا لكل مستخدم يتفاعل معه عبر الشبكة.",
  "Understand which {policies} and {users} are authorized to access this Bucket.":
    "تعرّف على {policies} و{users} المسموح لهم بالوصول إلى هذه الحاوية.",
  "Unexpected response, download incomplete.":
    "استجابة غير متوقعة، التنزيل غير مكتمل.",
  Unhealthy: "غير سليم",
  "Unique descriptive string for this destination":
    "سلسلة وصفية فريدة لهذه الوجهة",
  "Unique ID for NATS streaming cluster": "معرّف فريد لعنقود بث NATS",
  "Update Credentials - {type} / {name}":
    "تحديث بيانات الاعتماد - {type} / {name}",
  "Upload File": "تحميل الملف",
  "Upload Files": "رفع الملفات",
  "upload files to this bucket": "رفع الملفات إلى هذه الحاوية",
  "Upload Folder": "رفع مجلد",
  "Upload is restricted.": "التحميل مقيد.",
  "Upload not allowed": "التحميل غير مسموح",
  "upload objects to this location": "تحميل الكائنات إلى هذا الموقع",
  "Upstream copyright, authorship and license notices are retained in the repository's {credits} and {notice}. See the {attribution}.":
    "يتم الاحتفاظ بإشعارات حقوق النشر والتأليف والترخيص في المستودع {credits} و{notice}. شاهد {attribution}.",
  "upstream MinIO code": "كود المنبع MinIO",
  "Usage Data Age": "عمر بيانات الاستخدام",
  "Usage:": "الاستعمال:",
  "Use Original Name": "استخدم الاسم الأصلي",
  "Use SASL": "استخدام SASL",
  "Use secure medium to share this key.":
    "استخدم وسيلة آمنة لمشاركة هذا المفتاح.",
  "Use TLS": "استخدام TLS",
  "Used to confirm a non-idempotent action.":
    "يُستخدم لتأكيد إجراء غير متكرر الأثر (non-idempotent).",
  "User Access Keys": "مفاتيح وصول المستخدم",
  "User Agent": "وكيل المستخدم",
  "User Details - {user}": "تفاصيل المستخدم - {user}",
  "User DN Search Base DN is required": "قاعدة البحث عن DN للمستخدم مطلوبة",
  "User DN Search Filter is required": "مرشّح البحث عن DN للمستخدم مطلوب",
  "User Mappings": "تعيينات المستخدم",
  "User Name": "اسم المستخدم",
  "Username for SASL/PLAIN or SASL/SCRAM authentication":
    "اسم المستخدم لمصادقة SASL/PLAIN أو SASL/SCRAM",
  "Users inherit access permissions to data and resources through the groups they belong to.":
    "يرث المستخدمون أذونات الوصول إلى البيانات والموارد من خلال المجموعات التي ينتمون إليها.",
  "Users with this Policy associated": "المستخدمون المرتبطون بهذه السياسة",
  Validity: "الصلاحية",
  "Validity:": "الصلاحية:",
  Version: "إصدار",
  "Version ID:": "معرّف الإصدار:",
  "Versioning is required to enable {objectLocking} and {retention}.":
    "يلزم تفعيل إدارة الإصدارات لتمكين {objectLocking} و{retention}.",
  "Versioning on Bucket": "الإصدار على الحاوية",
  "Versioning setting cannot be changed as cluster replication is enabled for this site.":
    "لا يمكن تغيير إعداد إدارة الإصدارات لأن النسخ المتماثل للعناقيد مفعّل لهذا الموقع.",
  "Versioning Status": "حالة إدارة الإصدارات",
  versions: {
    zero: "إصدارات",
    one: "إصدار",
    two: "إصداران",
    few: "إصدارات",
    many: "إصدارًا",
    other: "إصدار",
  },
  Versions: {
    zero: "إصدارات",
    one: "إصدار",
    two: "إصداران",
    few: "إصدارات",
    many: "إصدارًا",
    other: "إصدار",
  },
  "Versions:": "الإصدارات:",
  View: "عرض",
  "View across sites": "عرض عبر المواقع",
  "View Bucket Naming Rules": "عرض قواعد تسمية الحاويات",
  "View env variable Webhook": "عرض Webhook المُعدّ بمتغير بيئة",
  "view Objects in this bucket": "عرض الكائنات في هذه الحاوية",
  "view Policy details": "عرض تفاصيل السياسة",
  "View Replication Status for a:": "عرض حالة النسخ المتماثل لـ:",
  "view User details": "عرض تفاصيل المستخدم",
  "Visit the SILO website": "قم بزيارة موقع SILO",
  "Volume or Bucket Name": "اسم وحدة التخزين أو الحاوية",
  "Volume/Bucket name cannot start with /":
    "لا يمكن أن يبدأ اسم وحدة التخزين أو الحاوية بالرمز /",
  Warning: "تحذير",
  "Warning: One or more users selected has associated Access Keys.":
    "تحذير: واحد أو أكثر من المستخدمين المحددين لديهم مفاتيح وصول مرتبطة.",
  "Warning! The resulting file will contain server configuration information in plain text":
    "تحذير! سيحتوي الملف الناتج على معلومات تكوين الخادم بنص عادي",
  "We recommend to rename the file download": "نوصي بإعادة تسمية تنزيل الملف",
  "Webhook server endpoint e.g. http://localhost:8080/silo/events":
    "نقطة نهاية خادم Webhook، مثل http://localhost:8080/silo/events",
  week: "اسبوع",
  weeks: {
    zero: "أسابيع",
    one: "أسبوع",
    two: "أسبوعان",
    few: "أسابيع",
    many: "أسبوعًا",
    other: "أسبوع",
  },
  "What are Event Destinations?": "ما هي وجهات الأحداث؟",
  "Would you like to encrypt {object}?": "هل ترغب بتشفير {object}؟",
  "Write Policy": "كتابة سياسة",
  "Write these down, as this is the only time the secret will be displayed.":
    "أكتب هذه، فهذه هي المرة الوحيدة التي سيتم فيها عرض السر.",
  writeonly: "للكتابة فقط",
  year: "سنة",
  years: {
    zero: "سنوات",
    one: "سنة",
    two: "سنتان",
    few: "سنوات",
    many: "سنة",
    other: "سنة",
  },
  Years: "سنوات",
  Yes: "نعم",
  "Yes, I am sure": "نعم أنا متأكد",
  "You can add a comment to this setting": "يمكنك إضافة تعليق على هذا الإعداد",
  "You can add policies to the group by selecting it from the Groups view after creation. The Policy view lets you manage the assigned policies for the group.":
    "يمكنك إضافة السياسات إلى المجموعة عن طريق تحديدها من عرض المجموعات بعد الإنشاء. يتيح لك عرض السياسة إدارة السياسات المعينة للمجموعة.",
  "You can choose to {excludePrefixes} from versioning if Object Locking is not enabled.":
    "يمكنك اختيار {excludePrefixes} من الإصدار إذا لم يتم تمكين قفل الكائنات.",
  "You can download the the Health report JSON File.":
    "يمكنك تنزيل تقرير حالة النظام بصيغة JSON.",
  "You can increase the maximum configuration time by setting the MINIO_STS_DURATION environment variable on all your nodes.":
    "يمكنك زيادة الحد الأقصى لوقت التكوين عن طريق تعيين متغير البيئة MINIO_STS_DURATION على جميع العقد الخاصة بك.",
  "You can learn more at the {documentation}.":
    "يمكنك معرفة المزيد على {documentation}.",
  "You can learn more at the {link}.": "يمكنك معرفة المزيد على {link}.",
  "You can only enable {objectLocking} when first creating a bucket.":
    "لا يمكن تفعيل {objectLocking} إلا عند إنشاء الحاوية لأول مرة.",
  "You can reset your session by logging out and logging back in to the web UI.":
    "يمكنك إعادة تعيين جلستك عن طريق تسجيل الخروج وتسجيل الدخول مرة أخرى إلى الويب UI.",
  "You can specify an optional JSON-formatted IAM policy to further restrict Access Key access to a subset of the actions and resources explicitly allowed for the parent user. Additional access beyond that of the parent user cannot be implemented through these policies.":
    "يمكنك تحديد سياسة IAM اختيارية بصيغة JSON لتقييد مفتاح الوصول بمجموعة فرعية من الإجراءات والموارد المسموح بها صراحةً للمستخدم الأصلي. ولا يمكن منح صلاحيات تتجاوز صلاحيات المستخدم الأصلي بهذه السياسات.",
  "You can use '*' to match any character, '.' to signify a single character or '\\' to scape an special character (E.g. mybucket-*)":
    'يمكنك استخدام "*" لمطابقة أي حرف، "." للدلالة على حرف واحد أو \'\\\' لحذف حرف خاص (على سبيل المثال، mybucket-*)',
  "You can use {mcShare} as an alternative to this UI, where the session length does not limit the URL validity.":
    "يمكنك استخدام {mcShare} كبديل لهذا UI، حيث لا يحد طول الجلسة من صلاحية URL.",
  "You cannot delete the currently logged in User":
    "لا يمكنك حذف المستخدم المسجّل دخوله حاليًا",
  "You cannot enable or disable the currently logged in User":
    "لا يمكنك تمكين أو تعطيل المستخدم الذي قام بتسجيل الدخول حاليًا",
  "You cannot modify the optional Access Key IAM policy after saving.":
    "لا يمكنك تعديل سياسة مفتاح الوصول الاختياري IAM بعد الحفظ.",
  "You may only have write access on a limited set of subpaths within this path. Please carefully review your User permissions to understand the paths to which you may write.":
    "قد يكون لديك حق الوصول للكتابة فقط على مجموعة محدودة من المسارات الفرعية ضمن هذا المسار. يرجى مراجعة أذونات المستخدم الخاصة بك بعناية لفهم المسارات التي قد تكتب إليها.",
  "You must apply a valid name to the bucket":
    "يجب عليك تطبيق اسم صالح على الحاوية",
  "You must disable Object Locking before Versioning can be disabled":
    'يجب عليك تعطيل "قفل الكائنات" قبل تعطيل الإصدار',
  "You must disable Retention before Object Locking can be disabled":
    "يجب عليك تعطيل الاحتفاظ قبل تعطيل قفل الكائنات",
  "You need to select at least one group to assign":
    "تحتاج إلى تحديد مجموعة واحدة على الأقل لتعيينها",
  "You require additional permissions in order to {name}. Please ask your SILO administrator to grant you {scopes} permission in order to {name}.":
    "أنت بحاجة إلى أذونات إضافية من أجل {name}. من فضلك اطلب من المسؤول SILO أن يمنحك الإذن {scopes} حتى تتمكن من {name}.",
  "You require additional permissions in order to {name}. Please ask your SILO administrator to grant you {scopes} permissions in order to {name}.":
    "أنت بحاجة إلى أذونات إضافية من أجل {name}. من فضلك اطلب من المسؤول SILO أن يمنحك أذونات {scopes} حتى تتمكن من {name}.",
  "You require additional permissions in order to create a new Tier. Please ask your SILO administrator to grant you {permission} permission in order to create a Tier.":
    "أنت بحاجة إلى أذونات إضافية لإنشاء طبقة جديدة. من فضلك اطلب من المسؤول SILO أن يمنحك الإذن {permission} لإنشاء طبقة.",
  "File is empty": "الملف فارغ",
  "Invalid UTF-8 or binary content": "محتوى UTF-8 غير صالح أو محتوى ثنائي",
  "Loading text preview…": "جارٍ تحميل معاينة النص...",
  "Object not found or changed": "الكائن غير موجود أو تغيّر",
  "Text preview content": "محتوى معاينة النص",
  "Text preview failed": "فشلت معاينة النص",
  "Text preview forbidden": "معاينة النص ممنوعة",
  "The object could not be found or changed while the preview was loading.":
    "تعذّر العثور على الكائن أو تغيّر أثناء تحميل المعاينة.",
  "The text preview could not be loaded because of a network or server error.":
    "تعذّر تحميل معاينة النص بسبب خطأ في الشبكة أو الخادم.",
  "This object is not valid UTF-8 text or contains binary data. Download it to inspect the original bytes.":
    "هذا الكائن ليس نص UTF-8 صالحًا أو يحتوي على بيانات ثنائية. نزّله لفحص البايتات الأصلية.",
  "You do not have permission to preview this object.":
    "ليس لديك إذن لمعاينة هذا الكائن.",
  Trademark: "علامة تجارية",
  License: "الترخيص",
  "Corresponding source for this build": "المصدر المقابل لهذا البناء",
  "The exact corresponding source is not available for this build: {reason}. See the NOTICE for how to obtain it.":
    "الشفرة المصدرية المطابقة بدقة غير متاحة لهذا البناء: {reason}. راجع NOTICE لمعرفة كيفية الحصول عليها.",
  "Source: not available for this build": "المصدر: غير متوفر لهذا البناء",
  "Items per page": "عنصر لكل صفحة",
  "First page": "الصفحة الأولى",
  "Previous page": "الصفحة السابقة",
  "Next page": "الصفحة التالية",
  "{count} items in total": "{count} مجموع العناصر",
  "Page {page} · {count} on this page": "الصفحة {page} · {count} في هذه الصفحة",
  "Sorting, filtering and select all apply to this page only.":
    "الفرز والتصفية والاختيار الكل ينطبق على هذه الصفحة فقط.",
  "No objects match the filter": "لا توجد كائنات تطابق المرشّح",
  "No objects on this page match the filter":
    "لا توجد كائنات في هذه الصفحة تطابق المرشّح",
  "Showing the first {count} entries; the listing stopped at the row or time limit.":
    "إظهار الإدخالات {count} الأولى؛ توقفت القائمة عند الصف أو الحد الزمني.",
  "Start typing to filter objects on this page":
    "ابدأ الكتابة لتصفية الكائنات في هذه الصفحة",
  "Lists and tabs": "القوائم وعلامات التبويب",
  "Move through rows with the pointer or keyboard. Arrow keys focus tabs; Enter or Space opens them.":
    "تنقّل بين الصفوف باستخدام المؤشر أو لوحة المفاتيح. تنقل مفاتيح الأسهم التركيز بين علامات التبويب، ويفتحها مفتاح Enter أو المسافة (Space).",
  "Browse and select stored objects.": "تصفّح الكائنات المخزّنة وحددها.",
  "Review stored object versions.": "مراجعة إصدارات الكائنات المخزنة.",
  "Manage bucket settings.": "إدارة إعدادات الحاوية.",
  "Compact section tabs": "علامات تبويب الأقسام المدمجة",
  "Storage and object usage": "التخزين واستخدام الكائنات",
  "Recent storage activity": "نشاط التخزين الأخير",
  "Example buckets": "حاويات نموذجية",
  "Select all objects": "تحديد جميع الكائنات",
  Select: "اختيار",
  Settings: "الإعدادات",
  Overview: "نظرة عامة",
  Activity: "النشاط",
  "No matching results": "لا توجد نتائج مطابقة",
  "Try a different search or clear the filters to see all items.":
    "جرب بحثًا مختلفًا أو امسح عوامل التصفية لرؤية جميع العناصر.",
  "Clear filters": "مسح المرشحات",
  "No users yet": "لا يوجد مستخدمين بعد",
  "Users authenticate with an access key and secret key, and receive permissions through policies and groups.":
    "يقوم المستخدمون بالمصادقة باستخدام مفتاح الوصول والمفتاح السري، ويحصلون على الأذونات من خلال السياسات والمجموعات.",
  "Create user": "إنشاء مستخدم",
  "No access keys yet": "لا توجد مفاتيح وصول بعد",
  "Access keys let applications connect with the permissions of your account.":
    "تتيح مفاتيح الوصول للتطبيقات الاتصال بأذونات حسابك.",
  "Access keys let applications connect with the permissions assigned to this user.":
    "تتيح مفاتيح الوصول للتطبيقات الاتصال بالصلاحيات المعيّنة لهذا المستخدم.",
  "No groups assigned": "لم تُعيّن مجموعات",
  "Add this user to a group to share its access policies.":
    "أضف هذا المستخدم إلى مجموعة لمشاركة سياسات الوصول الخاصة به.",
  "No policies assigned": "لم تُعيّن سياسات",
  "Policies define which actions and resources this user can access.":
    "تحدد السياسات الإجراءات والموارد التي يمكن لهذا المستخدم الوصول إليها.",
  "No members yet": "لا يوجد أعضاء بعد",
  "Add users to this group so they inherit its policies.":
    "أضف مستخدمين إلى هذه المجموعة حتى يرثوا سياساتها.",
  "Policies attached to this group apply to all its members.":
    "السياسات المرفقة بهذه المجموعة تنطبق على جميع أعضائها.",
  "No encryption keys yet": "لا توجد مفاتيح تشفير بعد",
  "Create a key to encrypt objects with the configured key management service.":
    "أنشئ مفتاحًا لتشفير الكائنات باستخدام خدمة إدارة المفاتيح المُعدّة.",
  "No groups yet": "لا توجد مجموعات بعد",
  "Groups let users share the same access policies.":
    "تتيح المجموعات للمستخدمين مشاركة نفس سياسات الوصول.",
  "No event destinations yet": "لا توجد وجهات أحداث بعد",
  "Connect an external service to receive bucket and object notifications.":
    "اربط خدمة خارجية لاستقبال إشعارات الحاويات والكائنات.",
  "No storage tiers yet": "لا توجد طبقات تخزين بعد",
  "Connect remote storage to transition objects using lifecycle rules.":
    "اربط تخزينًا بعيدًا لنقل الكائنات باستخدام قواعد دورة الحياة.",
  "No event subscriptions yet": "لا توجد اشتراكات أحداث بعد",
  "Subscribe this bucket to send object events to an event destination.":
    "اشترك بهذه الحاوية لإرسال أحداث الكائنات إلى وجهة أحداث.",
  "No replication rules yet": "لا توجد قواعد نسخ متماثل بعد",
  "Replicate objects from this bucket to a destination bucket.":
    "انسخ الكائنات من هذه الحاوية إلى حاوية وجهة.",
  "No lifecycle rules yet": "لا توجد قواعد دورة حياة بعد",
  "Create rules to expire objects or transition them to remote storage.":
    "أنشئ قواعد لإنهاء صلاحية الكائنات أو نقلها إلى تخزين بعيد.",
  "No anonymous access rules": "لا توجد قواعد وصول مجهولة",
  "This bucket has no prefix rules for access without credentials.":
    "لا تحتوي هذه الحاوية على قواعد بادئات للوصول دون بيانات اعتماد.",
  "No policies grant access": "لا توجد سياسات تمنح الوصول",
  "No listed policy currently grants access to this bucket.":
    "لا توجد سياسة مدرجة تمنح حاليًا الوصول إلى هذه الحاوية.",
  "No users have access": "لا يملك أي مستخدم حق الوصول",
  "No listed user currently has a policy granting access to this bucket.":
    "لا يملك أي مستخدم مدرج حاليًا سياسة تمنح الوصول إلى هذه الحاوية.",
  "View Policies": "عرض السياسات",
  "View Users": "عرض المستخدمين",
  "Unable to load replication sites": "تعذّر تحميل مواقع النسخ المتماثل",
  "No replication sites yet": "لا توجد مواقع نسخ متماثل بعد",
  "Refresh to try loading the configured sites again.":
    "قم بالتحديث لمحاولة تحميل المواقع التي تم تكوينها مرة أخرى.",
  "Connect independent SILO sites to replicate their data and identity configuration.":
    "اربط مواقع SILO المستقلة لنسخ بياناتها وإعدادات هويتها.",
  "Waiting for logs": "في انتظار السجلات",
  "Logs are not running": "السجلات لا تعمل",
  "New log entries will appear here as the server emits them.":
    "ستظهر هنا إدخالات السجل الجديدة عندما يقوم الخادم بإصدارها.",
  "Choose the nodes and log types, then start logs to see server activity.":
    "اختر العقد وأنواع السجل، ثم ابدأ بالسجلات لرؤية نشاط الخادم.",
  "Waiting for trace events": "في انتظار أحداث التتبع",
  "Trace is not running": "التتبع لا يعمل",
  "Requests matching the selected calls and filters will appear here.":
    "ستظهر هنا الطلبات المطابقة للاستدعاءات والمرشحات المحددة.",
  "Choose the calls and filters, then start tracing to inspect live requests.":
    "اختر الاستدعاءات والمرشحات، ثم ابدأ التتبع لفحص الطلبات المباشرة.",
  "{count} node": "عقدة واحدة ({count})",
  "{count} nodes": {
    zero: "{count} عقد",
    one: "{count} عقدة",
    two: "عقدتان ({count})",
    few: "{count} عقد",
    many: "{count} عقدة",
    other: "{count} عقدة",
  },
  "{count} drive": "قرص واحد ({count})",
  "{count} drives": {
    zero: "{count} أقراص",
    one: "{count} قرص",
    two: "قرصان ({count})",
    few: "{count} أقراص",
    many: "{count} قرصًا",
    other: "{count} قرص",
  },
  "Quota: {quota}": "الحصة: {quota}",
  "Open bucket {name}": "فتح الحاوية {name}",
  "Recent buckets": "الحاويات الأخيرة",
  "Read and write": "قراءة وكتابة",
  "Read only": "للقراءة فقط",
  "Write only": "للكتابة فقط",
  "Created {date}": "أُنشئ {date}",
  "{count} objects": "{count} كائنات",
  "Bucket actions": "إجراءات الحاوية",
  "Open menu": "فتح القائمة",
  "Page actions": "إجراءات الصفحة",
  "Selected actions": "الإجراءات المحددة",
  "Parent paths": "المسارات الأب",
  "create Groups": "إنشاء المجموعات",
  "view Group details": "عرض تفاصيل المجموعة",
  "configure event destinations": "تكوين وجهات الأحداث",
  "update Tier credentials": "تحديث بيانات اعتماد الطبقة",
  "delete Tiers": "حذف طبقات التخزين",
  "manage Access Keys": "إدارة مفاتيح الوصول",
};

export default messages;
