// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
// AI-assisted translation; see ../../README.md for review and maintenance.

import type { Dictionary } from "../../catalog";

const messages: Dictionary = {
  "### Users\n\nA SILO user consists of a unique access key (username) and corresponding secret key (password). Clients must authenticate their identity by specifying both a valid access key (username) and the corresponding secret key (password) of an existing SILO user.\n\nGroups provide a simplified method for managing shared permissions among users with common access patterns and workloads.\n\nUsers inherit access permissions to data and resources through the groups they belong to.\n\nSILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.\n\nEach user can access only those resources and operations which are explicitly granted by the built-in role. SILO denies access to any other resource or action by default.":
    "### Kullanıcılar\n\nBir SILO kullanıcısı, benzersiz bir erişim anahtarından (kullanıcı adı) ve buna karşılık gelen gizli anahtardan (şifre) oluşur. İstemciler, mevcut bir SILO kullanıcısının hem geçerli bir erişim anahtarını (kullanıcı adı) hem de karşılık gelen gizli anahtarını (şifre) belirterek kimliklerini doğrulamalıdır.\n\nGruplar, ortak erişim kalıplarına ve iş yüklerine sahip kullanıcılar arasında paylaşılan izinleri yönetmek için basitleştirilmiş bir yöntem sağlar.\n\nKullanıcılar, ait oldukları gruplar aracılığıyla verilere ve kaynaklara erişim izinlerini devralır.\n\nSILO, kimliği doğrulanmış bir kullanıcının erişim sahibi olduğu yetkili eylemleri ve kaynakları tanımlamak için Politika Tabanlı Erişim Denetimi'ni (PBAC) kullanır. Her politika, bir kullanıcının veya kullanıcı grubunun izinlerinin ana hatlarını çizen bir veya daha fazla eylemi ve koşulu açıklar.\n\nHer kullanıcı yalnızca yerleşik rol tarafından açıkça verilen kaynaklara ve işlemlere erişebilir. SILO varsayılan olarak başka herhangi bir kaynağa veya eyleme erişimi reddeder.",
  "### IAM policies\n\nSILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.\n\nSILO PBAC is built for compatibility with AWS IAM policy syntax, structure, and behavior. The SILO documentation makes a best-effort to cover IAM-specific behavior and functionality. Consider deferring to the IAM documentation for more complete documentation on AWS IAM-specific topics.":
    "### IAM politikalar\n\nSILO, kimliği doğrulanmış bir kullanıcının erişim sahibi olduğu yetkili eylemleri ve kaynakları tanımlamak için Politika Tabanlı Erişim Denetimi'ni (PBAC) kullanır. Her politika, bir kullanıcının veya kullanıcı grubunun izinlerinin ana hatlarını çizen bir veya daha fazla eylemi ve koşulu açıklar.\n\nSILO PBAC, AWS IAM politika sözdizimi, yapısı ve davranışıyla uyumluluk için oluşturulmuştur. SILO belgeleri, IAM-'e özgü davranış ve işlevleri kapsamak için elinden gelen çabayı göstermektedir. AWS IAM-belirli konulara ilişkin daha kapsamlı belgeler için IAM belgelerine bakmayı düşünün.",
  "### Access keys\n\nSILO access keys are child identities of an authenticated SILO user, including externally managed identities. Each access key inherits its privileges based on the policies attached to it’s parent user or those groups in which the parent user has membership. Access Keys also support an optional inline policy which further restricts access to a subset of actions and resources available to the parent user.":
    "### Erişim tuşları\n\nSILO erişim anahtarları, kimliği doğrulanmış bir SILO kullanıcının, harici olarak yönetilen kimlikler de dahil olmak üzere alt kimlikleridir. Her erişim anahtarı, ana kullanıcısına veya ana kullanıcının üye olduğu gruplara eklenen ilkelere göre ayrıcalıklarını devralır. Erişim Anahtarları ayrıca, ana kullanıcının kullanabileceği bir dizi eylem ve kaynağa erişimi daha da kısıtlayan isteğe bağlı bir satır içi politikayı da destekler.",
  "### Event destinations\n\nSILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events. SILO supports bucket and object-level S3 events similar to the Amazon S3 Event Notifications.":
    "### Etkinlik hedefleri\n\nSILO kova bildirimleri, yöneticilerin belirli nesne veya kova olaylarında desteklenen harici hizmetlere bildirim göndermesine olanak tanır. SILO, Amazon S3 Etkinlik Bildirimlerine benzer şekilde kova ve nesne düzeyinde S3 olaylarını destekler.",
  "### Inspect examples\n\nDownload object metadata or constituent parts from the drives as a ZIP archive. Enable **Encrypt** to protect the downloaded archive; save the decryption key when it is shown.\n\n- **Object metadata:** Volume/Bucket `test-bucket`, Path `test*/xl.meta`.\n- **Object parts:** Volume/Bucket `test-bucket`, Path `test*/*/part.*`.\n- **Recursive prefix:** Volume/Bucket `test-bucket`, Path `test/**`.\n\n**Caution:** Recursive inspection can be expensive. Limit the bucket and path before starting; use recursive patterns only when necessary.":
    "### Örnekleri inceleyin\n\nNesne meta verilerini veya bileşen parçalarını sürücülerden ZIP arşivi olarak indirin. İndirilen arşivi korumak için **Şifreleme**'yi etkinleştirin; gösterildiğinde şifre çözme anahtarını kaydedin.\n\n- **Nesne meta verileri:** Birim/Kova `test-bucket`, Yol `test*/xl.meta`.\n- **Nesne parçaları:** Birim/Kova `test-bucket`, Yol `test*/*/part.*`.\n- **Özyinelemeli önek:** Birim/Kova `test-bucket`, Yol `test/**`.\n\n**Dikkat:** Yinelemeli inceleme pahalı olabilir. Başlamadan önce kovayı ve yolu sınırlayın; Özyinelemeli kalıpları yalnızca gerektiğinde kullanın.",
  Troubleshooting: "Sorun giderme",
  "Need more help?  Check out additional Troubleshooting options":
    "Daha fazla yardıma mı ihtiyacınız var?  Ek Sorun Giderme seçeneklerine göz atın",
  "Identity and Access Management": "Kimlik ve Erişim Yönetimi",
  "SILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access.":
    "SILO, kimliği doğrulanmış bir kullanıcının erişim sahibi olduğu yetkili eylemleri ve kaynakları tanımlamak için İlke Tabanlı Erişim Denetimi'ni (PBAC) kullanır.",
  "Policy based access control": "Politika tabanlı erişim kontrolü",
  "Learn how Policy-Based Access Control (PBAC)  is used to define the authorized actions and resources  to which an authenticated user has access":
    "Kimliği doğrulanmış bir kullanıcının erişim sahibi olduğu yetkili eylemleri ve kaynakları tanımlamak için İlke Tabanlı Erişim Denetiminin (PBAC) nasıl kullanıldığını öğrenin",
  "OpenID Connect Access Management": "OpenID Bağlantı Erişim Yönetimi",
  "Learn more about connecting SILO to OpenID for access management.":
    "Erişim yönetimi için SILO'yi OpenID'ye bağlama hakkında daha fazla bilgi edinin.",
  "MinIO Identity and Access Management: Part 1 - Overview And Modification of Built In Policies":
    "MinIO Kimlik ve Erişim Yönetimi: Bölüm 1 - Yerleşik Politikalara Genel Bakış ve Değişiklik",
  "This video introduces MinIO IAM policies, including an overview of the built-in policies, and how to create and remove a policy.":
    "Bu video, yerleşik politikalara genel bir bakış ve bir politikanın nasıl oluşturulup kaldırılacağı da dahil olmak üzere MinIO IAM politikalarını tanıtmaktadır.",
  "MinIO Identity and Access Management: Part 4 - Lab - Setting Up Users, Groups, and Policies":
    "MinIO Kimlik ve Erişim Yönetimi: Bölüm 4 - Laboratuvar - Kullanıcıları, Grupları ve Politikaları Ayarlama",
  "This Lab video demonstrates setting up identity and access management based Users, Groups and Policies. ":
    "Bu Laboratuvar videosu, Kimlik ve erişim yönetimi tabanlı Kullanıcılar, Gruplar ve Politikaların kurulumunu göstermektedir.",
  "MinIO Identity and Access Management: Part 5 - Lab - Creating A Custom Policy":
    "MinIO Kimlik ve Erişim Yönetimi: Bölüm 5 - Laboratuvar - Özel Politika Oluşturma",
  "This Lab video demonstrates creating custom IAM policies.":
    "Bu Laboratuvar videosu özel IAM politikalarının oluşturulmasını göstermektedir.",
  "MinIO Identity and Access Management: Part 6 - Lab - Interfacing With OpenID and LDAP":
    "MinIO Kimlik ve Erişim Yönetimi: Bölüm 6 - Laboratuvar - OpenID ve LDAP ile Arayüz Oluşturma",
  "This Lab video demonstrates interfacing with OpenID and LDAP. ":
    "Bu Laboratuvar videosu OpenID ve LDAP ile arayüz oluşturmayı göstermektedir.",
  "# Bucket \n A bucket is similar to a folder or directory in a filesystem, where each bucket can hold an arbitrary number of objects.":
    "# Kova \n Bir kova, her bir kovanın isteğe bağlı sayıda nesneyi tutabildiği bir dosya sistemindeki bir klasöre veya dizine benzer.",
  "Bucket Versioning": "Kova Sürümü Oluşturma",
  "SILO supports keeping multiple “versions” of an object in a single bucket. SILO versioning protects from unintended overwrites and deletions while providing support for “undoing” a write operation.":
    'SILO bir nesnenin birden fazla "versiyonunu" tek bir grupta tutmayı destekler. SILO sürüm oluşturma, bir yazma işleminin "geri alınmasına" destek sağlarken, istenmeyen üzerine yazma ve silme işlemlerine karşı koruma sağlar.',
  Buckets: "Kovalar",
  "Learn about using Console to create and manage Buckets with SILO":
    "SILO ile Kovalar oluşturmak ve yönetmek için Konsolu kullanma hakkında bilgi edinin",
  "Creating Buckets and Users through the MinIO Console":
    "MinIO Konsolu Aracılığıyla Kovalar ve Kullanıcılar Oluşturma",
  "Learn how to manage your storage buckets and objects with a hands-on introduction to the MinIO Console and SDKs.":
    "MinIO Konsol ve SDK'lara uygulamalı giriş yaparak depolama kovalarınizi ve nesnelerinizi nasıl yöneteceğinizi öğrenin.",
  "Console Introduction - Add a Bucket and a User":
    "Konsola Giriş - Bir Kova ve Kullanıcı Ekleme",
  "This session shows how to create AWS S3 buckets and users with MinIO Console.":
    "Bu oturumda MinIO Konsolu ile AWS S3 kovaların ve kullanıcıların nasıl oluşturulacağı gösterilmektedir.",
  "Object Locking and Retention": "Nesne Kilitleme ve Saklama",
  "In this video we talk about object retention, WORM (Write Once Read Many), as well as duration based and legal holds.":
    "Bu videoda nesne saklama, WORM (Bir Kez Yaz Çok Oku) ve ayrıca süre bazlı ve yasal bekletmelerden bahsediyoruz.",
  "Object Locking and Retention Lab": "Nesne Kilitleme ve Saklama Laboratuvarı",
  "This lab demonstrates creation and removal of both bucket and object specific retention, compliance, and legal holds. ":
    "Bu laboratuvar, hem kovaya hem de nesneye özel saklama, uyumluluk ve yasal muhafazaların oluşturulmasını ve kaldırılmasını gösterir.",
  "Versioning and Lifecycle Management":
    "Sürüm Oluşturma ve Yaşam Döngüsü Yönetimi",
  "In this video, we will focus on versioning and lifecycle management.":
    "Bu videoda versiyonlama ve yaşam döngüsü yönetimine odaklanacağız.",
  Versioning: "Sürüm Oluşturma",
  "Learn how Versioning gives access to the full history of an object from its creation through each update.":
    "Sürüm oluşturmanın, bir nesnenin oluşturulmasından her güncellemeye kadar olan tüm geçmişine nasıl erişim sağladığını öğrenin.",
  "Learn how versioning protects your data from unintended overwrites and deletions":
    "Sürüm oluşturmanın verilerinizi istenmeyen üzerine yazma ve silme işlemlerine karşı nasıl koruduğunu öğrenin",
  "Learn how to create and manage Buckets":
    "Kovaları nasıl oluşturacağınızı ve yöneteceğinizi öğrenin",
  "In this video, we will focus on versioning  and lifecycle management.":
    "Bu videoda versiyonlama ve yaşam döngüsü yönetimine odaklanacağız.",
  "Policy Document Structure": "Politika Belgesi Yapısı",
  "SILO policy documents use the same schema as AWS IAM Policy documents. See policy templates and allowed S3 Policy actions and condition keys in our docs.":
    "SILO politika belgeleri, AWS IAM politika belgeleriyle aynı şemayı kullanır. Belgelerimizdeki politika şablonlarına ve izin verilen S3 Politika eylemlerine ve koşul anahtarlarına bakın.",
  "Access Keys": "Erişim Anahtarları",
  "Access Keys support providing applications authentication credentials which inherit permissions from the “parent” user.":
    'Erişim Anahtarları, izinleri "ana" kullanıcıdan devralan uygulama kimlik doğrulama bilgilerinin sağlanmasını destekler.',
  "Policy Variables": "Politika Değişkenleri",
  "SILO supports using policy variables for automatically substituting context from the authenticated user and/or the operation into the user’s assigned policy or policies.":
    "SILO, kimliği doğrulanmış kullanıcıdaki bağlamın ve/veya işlemin kullanıcıya atanan politika veya politikalara otomatik olarak aktarılması için politika değişkenlerinin kullanılmasını destekler.",
  "Admin Policy Action Keys": "Yönetici Politikası Eylem Tuşları",
  "See actions supported in defining policies for SILO admin operations. These actions are only valid for SILO deployments and are not intended for use with other S3-compatible services.":
    "SILO yönetici işlemlerine yönelik politikaların tanımlanmasında desteklenen eylemlere bakın. Bu eylemler yalnızca SILO dağıtımlar için geçerlidir ve diğer S3 uyumlu hizmetlerle kullanılması amaçlanmamıştır.",
  "Admin Policy Condition Keys": "Yönetici Politikası Durum Anahtarları",
  "See which conditions SILO supports for use with defining policies for admin actions.":
    "Yönetici eylemlerine yönelik politikaları tanımlarken SILO'nin hangi koşulları desteklediğini görün.",
  "Supported S3 Policy Condition Keys":
    "Desteklenen S3 Politika Durumu Anahtarları",
  "SILO policy documents support IAM conditional statements.":
    "SILO politika belgeleri IAM koşullu ifadeleri destekler.",
  "Supported S3 Policy Actions": "Desteklenen S3 Politika Eylemleri",
  "SILO policy documents support a subset of IAM S3 Action keys.":
    "SILO politika belgeleri, IAM S3 Eylem tuşlarının bir alt kümesini destekler.",
  "MinIO Identity and Access Management: Part 2 - Using IDP to Manage Users And Groups":
    "MinIO Kimlik ve Erişim Yönetimi: Bölüm 2 - Kullanıcıları ve Grupları Yönetmek için IDP Kullanımı",
  "This video discusses Users and Groups, and how policies can be applied to them to enable specific permissions.":
    "Bu videoda Kullanıcılar ve Gruplar ve belirli izinleri etkinleştirmek için politikaların bunlara nasıl uygulanabileceği anlatılmaktadır.",
  "SILO versioning protects from unintended overwrites and deletions while providing support for “undoing” a write operation.":
    'SILO sürüm oluşturma, bir yazma işleminin "geri alınmasına" destek sağlarken, istenmeyen üzerine yazma ve silme işlemlerine karşı koruma sağlar.',
  "Lifecycle Management II - Versioning and Lifecycle Management":
    "Yaşam Döngüsü Yönetimi II - Sürüm Oluşturma ve Yaşam Döngüsü Yönetimi",
  "Creating a New Bucket in a Specific Region":
    "Belirli Bir Bölgede Yeni Kova Oluşturma",
  "A Bucket can be created in a specified region":
    "Belirli bir bölgede Kova oluşturulabilir",
  "What are Settings and Configurations?":
    "Ayarlar ve Yapılandırmalar Nelerdir?",
  "These configuration settings define runtime  behavior of the SILO server process,  comparable to the mc admin config command":
    "Bu ayarlar, mc admin config komutuna benzer biçimde SILO sunucu işleminin çalışma sırasındaki davranışını belirler.",
  "MinIO Feature Overview: Active-Active Replication":
    "MinIO Özelliklere Genel Bakış: Aktif-Aktif Çoğaltma",
  "Learn about MinIO's object replication capabilities and how MinIO provides resilience to common storage disruption scenarios.":
    "MinIO'nın nesne çoğaltma yetenekleri ve MinIO'nin yaygın depolama kesintisi senaryolarına karşı nasıl dayanıklılık sağladığı hakkında bilgi edinin.",
  "How is failed replication handled?": "Başarısız çoğaltma nasıl ele alınır?",
  "SILO queues failed replication operations and retries those operations until replication succeeds.":
    "SILO başarısız çoğaltma işlemlerini sıraya koyar ve çoğaltma başarılı olana kadar bu işlemleri yeniden dener.",
  "What are Replication Workers?": "Çoğaltma Çalışanları Nedir?",
  "SILO uses a replication queuing system with multiple concurrent replication workers operating on that queue.":
    "SILO, bu kuyrukta birden fazla eşzamanlı çoğaltma çalışanının çalıştığı bir çoğaltma kuyruk sistemi kullanır.",
  "These configuration settings define runtime behavior of the SILO server process,  comparable to the mc admin config command":
    "Bu ayarlar, mc admin config komutuna benzer biçimde SILO sunucu işleminin çalışma sırasındaki davranışını belirler.",
  "Where can I see current Heal status?":
    "Mevcut İyileşme durumunu nerede görebilirim?",
  "Check under Monitoring/Drives on the left hand  menu to see Drive and Bucket Healing status":
    "Drive ve Kova İyileştirme durumunu görmek için soldaki menüdeki İzleme/Sürücüler altından kontrol edin",
  "How is Erasure Coding used to Protect Data?":
    "Verileri Korumak İçin Silme Kodlaması nasıl kullanılır?",
  "SILO erasure coding is a data redundancy and  availability feature that allows SILO deployments to  automatically reconstruct objects on-the-fly despite  the loss of multiple drives or nodes in the cluster.":
    "SILO silme kodlaması, SILO dağıtımların kümedeki birden fazla sürücü veya düğüm kaybına rağmen nesneleri anında otomatik olarak yeniden yapılandırmasına olanak tanıyan bir veri yedekliliği ve kullanılabilirliği özelliğidir.",
  "Recover After Hardware failure": "Donanım arızasından sonra kurtarma",
  "Depending on the deployment topology and  selected erasure code parity, SILO can tolerate loss  of up to half the drives or nodes in the deployment  while maintaining read access to objects.":
    "Dağıtım topolojisine ve seçilen silme kodu eşliğine bağlı olarak, SILO, nesnelere okuma erişimini korurken dağıtımdaki sürücülerin veya düğümlerin yarısına kadar kaybını tolere edebilir.",
  "Site Failure Recovery": "Site Arızası Kurtarma",
  "SILO can make the loss of an entire site, while  significant, a relatively minor incident. Site recovery depends on the replication option you use for the site.":
    "SILO tüm bir sitenin kaybına neden olabilir, ancak önemli olsa da nispeten küçük bir olaydır. Site kurtarma, site için kullandığınız çoğaltma seçeneğine bağlıdır.",
  "Node Failure Recovery": "Düğüm Arızası Kurtarma",
  "If a SILO node suffers complete hardware failure, the node begins healing operations once it rejoins the  deployment.":
    "Bir SILO düğümünde tam donanım arızası yaşanırsa düğüm, dağıtıma yeniden katıldığında iyileştirme işlemlerine başlar.",
  "What is SILO Healing?": "SILO Şifa Nedir?",
  "Healing is SILO’s ability to restore data after some event causes data loss. Data loss can come from bit rot, drive loss, or node loss.":
    "İyileşme, SILO'nin veri kaybına neden olan bir olaydan sonra verileri geri yükleme yeteneğidir. Veri kaybı; bit çürümesinden, sürücü kaybından veya düğüm kaybından kaynaklanabilir.",
  "Understand SILO Healing Using mc": "Anlamak SILO Kullanarak Şifa Vermek mc",
  "The mc admin heal command scans for objects that are damaged or corrupted and heals those objects.":
    "mc admin heal komutu hasar görmüş veya bozulmuş nesneleri bulur ve onarır.",
  "What is Bit Rot?": "Bit Çürüklüğü Nedir?",
  "Bit rot is data corruption that occurs without the user’s knowledge. SILO combats bit rot with hashing and erasure coding.":
    "Bit çürümesi, kullanıcının bilgisi dışında meydana gelen veri bozulmasıdır. SILO karma ve silme kodlaması ile bit çürümesiyle mücadele eder.",
  "These configuration settings define runtime behavior of the SILO server process, comparable to the mc admin config command":
    "Bu ayarlar, mc admin config komutuna benzer biçimde SILO sunucu işleminin çalışma sırasındaki davranışını belirler.",
  "Overview of MinIO Erasure Coding": "MinIO Silme Kodlamasına Genel Bakış",
  "Through this MinIO video you will learn about MinIO erasure coding, including erasure sets, erasure parity, and stripe size. You will also learn about how the Reed-Solomon algorithm can be optimized for storage efficiency (yielding cost savings) or data lost protection (number of servers and drives that can fail). The video also walks through the MinIO Erasure Code calculator, considerations for cluster design and the command line syntax needed to establish an erasure code deployment. ":
    "Bu MinIO video aracılığıyla, silme kümeleri, silme eşlik ve şerit boyutu dahil olmak üzere MinIO silme kodlaması hakkında bilgi edineceksiniz. Ayrıca Reed-Solomon algoritmasının depolama verimliliği (maliyet tasarrufu sağlayan) veya veri kaybı koruması (arızalanabilecek sunucu ve sürücü sayısı) için nasıl optimize edilebileceğini de öğreneceksiniz. Videoda ayrıca MinIO Silme Kodu hesaplayıcısı, küme tasarımına ilişkin hususlar ve bir silme kodu dağıtımı oluşturmak için gereken komut satırı sözdizimi anlatılmaktadır.",
  "Object Scanner": "Nesne Tarayıcı",
  "Learn more about how the scanner checks Objects for transition and expiry based on lifecycle rules":
    "Tarayıcının, yaşam döngüsü kurallarına dayalı olarak Nesneleri geçiş ve sona erme açısından nasıl kontrol ettiği hakkında daha fazla bilgi edinin",
  "What is the Scanner?": "Tarayıcı Nedir?",
  "One of several low-priority processes SILO runs to check lifecycle management rules, bucket or site replication status, as well as object bit rot and healing":
    "Birkaç düşük öncelikli süreçten biri SILO yaşam döngüsü yönetimi kurallarını, kova veya site çoğaltma durumunu ve ayrıca nesne bit çürümesini ve iyileştirmeyi kontrol etmek için çalışır",
  "Lifecycle Management Object Scanner Considerations":
    "Yaşam Döngüsü Yönetimi Nesne Tarayıcısında Dikkat Edilecek Hususlar",
  "SILO uses a scanner process to check objects against all configured lifecycle management rules. High IO workloads or limited system resources may delay application of lifecycle management rules":
    "SILO nesneleri tüm yapılandırılmış yaşam döngüsü yönetimi kurallarına göre kontrol etmek için bir tarayıcı işlemi kullanır. Yüksek IO iş yükleri veya sınırlı sistem kaynakları, yaşam döngüsü yönetimi kurallarının uygulanmasını geciktirebilir",
  "Lifecycle Management Lab": "Yaşam Döngüsü Yönetimi Laboratuvarı",
  "Use the MinIO client to demonstrate expiration rules, the scanner, and transitioning objects to remote tiers.":
    "Süre sonu kurallarını, tarayıcıyı ve nesnelerin uzak katmanlara geçişini göstermek için MinIO istemcisini kullanın.",
  "What is etcd?": "etcd nedir?",
  "etcd is a strongly consistent, distributed key-value  store that provides a reliable way to store data that  needs to be accessed by a distributed system or  cluster of machines.":
    "etcd, dağıtılmış bir sistem veya makine kümesi tarafından erişilmesi gereken verileri depolamak için güvenilir bir yol sağlayan, son derece tutarlı, dağıtılmış bir anahtar/değer deposudur.",
  "What is the logger_webhook Environment Variable?":
    "logger_webhook Ortam Değişkeni Nedir?",
  "The top-level configuration key for defining an  HTTP webhook target for publishing SILO logs.":
    "SILO günlükleri yayınlamak için HTTP webhook hedefi tanımlamak için üst düzey yapılandırma anahtarı.",
  "Publish Server Logs to HTTP Webhook":
    "Sunucu Günlüklerini HTTP Webhook'ye Yayınlayın",
  "You can configure a new HTTP webhook endpoint  to which SILO publishes SILO server logs using  either environment variables or by setting  runtime configuration settings.":
    "Ortam değişkenlerini kullanarak veya çalışma zamanı yapılandırma ayarlarını ayarlayarak SILO'nin SILO sunucu günlüklerini yayınlayacağı yeni bir HTTP webhook uç noktası yapılandırabilirsiniz.",
  "Monitoring Logs": "Günlükleri İzleme",
  "SILO supports publishing server logs  and audit logs to an HTTP webhook.":
    "SILO, sunucu günlüklerinin ve denetim günlüklerinin HTTP web kancasına yayınlanmasını destekler.",
  "Monitoring with Prometheus": "Prometheus ile İzleme",
  "Learn about the monitoring features available  in your MinIO Console and how to export to  Prometheus and get information back so you can  view it in detail.":
    "MinIO Konsolunuzda bulunan izleme özellikleri ve Prometheus'ye nasıl aktarılacağı hakkında bilgi edinin ve ayrıntılı olarak görüntüleyebilmek için bilgileri geri alın.",
  "Prometheus Monitoring Lab": "Prometheus İzleme Laboratuvarı",
  "Learn how to set up Prometheus and connect it  back to your MinIO cluster so that you can get  detailed history of what's going on in your MinIO  cluster at any given time.":
    "Herhangi bir zamanda MinIO kümenizde olup bitenlerin ayrıntılı geçmişini alabilmeniz için Prometheus'yi nasıl kuracağınızı ve MinIO kümenize nasıl geri bağlayacağınızı öğrenin.",
  "Publish Audit Logs to an HTTP webhook":
    "Denetim Günlüklerini HTTP web kancasında yayınlayın",
  "You can configure a new HTTP webhook endpoint  to which SILO publishes audit logs using either  environment variables or by setting runtime  configuration settings":
    "Ortam değişkenlerini kullanarak veya çalışma zamanı yapılandırma ayarlarını ayarlayarak SILO'nin denetim günlüklerini yayınlayacağı yeni bir HTTP webhook uç noktası yapılandırabilirsiniz.",
  "Publish Audit Logs to an External Service":
    "Denetim Günlüklerini Harici Bir Hizmette Yayınlayın",
  "Audit logs are granular descriptions of each operation  on the SILO deployment supporting security  standards and regulations which require  detailed tracking of operations.":
    "Denetim günlükleri, operasyonların ayrıntılı takibini gerektiren güvenlik standartlarını ve düzenlemelerini destekleyen SILO dağıtımındaki her işlemin ayrıntılı açıklamalarıdır.",
  "Publish Events to Kafka": "Etkinlikleri Kafka'de yayınlayın",
  "SILO supports publishing bucket notification events to a Kafka service endpoint.":
    "SILO, kova bildirim olaylarının Kafka hizmet uç noktasına yayınlanmasını destekler.",
  "Kafka Service for Bucket Notifications": "Kafka Kova Bildirimleri Hizmeti",
  "Learn about environment variables for configuring a Kafka service as a target for Bucket Nofitications.":
    "Bir Kafka hizmetini Bucket Nofitications için hedef olarak yapılandırmaya yönelik ortam değişkenleri hakkında bilgi edinin.",
  "Kafka Service Configuration Settings": "Kafka Hizmet Yapılandırma Ayarları",
  "Supported Bucket Notification Targets":
    "Desteklenen Kova Bildirim Hedefleri",
  "Learn which notification targets are supported by SILO.":
    "SILO tarafından hangi bildirim hedeflerinin desteklendiğini öğrenin.",
  "Bucket Notifications": "Kova Bildirimleri",
  "SILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events.":
    "SILO kova bildirimleri, yöneticilerin belirli nesne veya kova olaylarında desteklenen harici hizmetlere bildirim göndermesine olanak tanır.",
  "Need more help? Check out additional Troubleshooting options":
    "Daha fazla yardıma mı ihtiyacınız var? Ek Sorun Giderme seçeneklerine göz atın",
  "Site Replication Prerequisite": "Site Çoğaltma Önkoşulu",
  "Check that your setup meets the requirements to deploy Site Replication":
    "Kurulumunuzun Site Çoğaltma dağıtımı gereksinimlerini karşılayıp karşılamadığını kontrol edin",
  "Site replication configures multiple independent SILO deployments as a cluster of replicas called peer sites.":
    "Site çoğaltma, birden fazla bağımsız SILO dağıtımı eş siteler adı verilen bir kopya kümesi olarak yapılandırır.",
  "Site Replication Overview": "Site Çoğaltmaya Genel Bakış",
  "See what changes are and are NOT replicated between peer sites":
    "Eş siteler arasında hangi değişikliklerin çoğaltıldığını ve hangilerinin çoğaltılmadığını öğrenin",
  "Site Replication Tutorial": "Site Çoğaltma Eğitimi",
  "Learn how to set up site replication using Console and the SILO client (mc)":
    "Konsolu ve SILO istemcisini (mc) kullanarak site çoğaltmayı nasıl ayarlayacağınızı öğrenin",
  "Transition from SILO to Azure": "SILO'den Azure'a geçiş",
  "See the procedure to create a new object lifecycle management rule that transition objects from a SILO bucket to a remote storage tier on the Azure storage backend.":
    "Nesneleri Azure depolama arka ucundaki SILO kovaten uzak depolama katmanına geçiren yeni bir nesne yaşam döngüsü yönetimi kuralı oluşturma prosedürüne bakın.",
  "Transition from SILO to GCS": "SILO'den GCS'ye geçiş",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Google Cloud Storage backend.":
    "Nesneleri SILO grubundan Google Cloud Storage arka ucundaki uzak depolama katmanına geçiren yeni bir nesne yaşam döngüsü yönetimi kuralı oluşturma prosedürüne bakın.",
  "Transition from SILO to S3": "SILO'den S3'ye geçiş",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Amazon Web Services S3 storage backend or an S3-compatible service.":
    "Nesneleri bir SILO kovaten Amazon Web Services S3 depolama arka ucundaki veya S3 uyumlu bir hizmetteki uzak depolama katmanına geçiren yeni bir nesne yaşam döngüsü yönetimi kuralı oluşturma prosedürüne bakın.",
  "Transition to Remote SILO Deployment": "Uzaktan SILO Dağıtıma Geçiş",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a bucket on a primary SILO deployment to a bucket on a remote SILO deployment. ":
    "Nesneleri birincil SILO dağıtımdaki bir gruptan uzak SILO dağıtımdaki bir kovaya geçiren yeni bir nesne yaşam döngüsü yönetimi kuralı oluşturma prosedürüne bakın.",
  "Object Lifecycle Management": "Nesne Yaşam Döngüsü Yönetimi",
  "Use SILO Object Lifecycle Management to create rules for time or date based automatic transition or expiry of objects.":
    "Nesnelerin zamana veya tarihe dayalı otomatik geçişi veya sona ermesine ilişkin kurallar oluşturmak için SILO Nesne Yaşam Döngüsü Yönetimi'ni kullanın.",
  "MinIO Feature Overview: Object Lifecycle Management":
    "MinIO Özelliklere Genel Bakış: Nesne Yaşam Döngüsü Yönetimi",
  "Learn about MinIO's object lifecycle management capabilities.":
    "MinIO'nin nesne yaşam döngüsü yönetimi yetenekleri hakkında bilgi edinin.",
  "Lifecycle Management I - Tiers": "Yaşam Döngüsü Yönetimi I - Katmanlar",
  "In this video we will cover expiration and transition of objects to an alternate tier of storage.":
    "Bu videoda nesnelerin süresinin dolmasını ve nesnelerin alternatif bir depolama katmanına geçişini ele alacağız.",
  Tiers: "Katmanlar",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Azure storage backend.":
    "Nesneleri bir SILO demetinden Azure depolama arka ucundaki uzak depolama katmanına geçiren yeni bir nesne yaşam döngüsü yönetimi kuralı oluşturma prosedürüne bakın.",
  "Console Metrics Dashboard": "Konsol Metrikleri Kontrol Paneli",
  "The SILO Console provides a point-in-time metrics dashboard by default, and also supports displaying time-series and historical data by querying a Prometheus service configured to scrape data from the SILO deployment.":
    "SILO Konsolu, varsayılan olarak bir anlık ölçüm kontrol paneli sağlar ve ayrıca SILO dağıtımından veri çıkarmak üzere yapılandırılmış bir Prometheus hizmetini sorgulayarak zaman serisi ve geçmiş verileri görüntülemeyi destekler.",
  "Available Metrics": "Mevcut Metrikler",
  "Learn about the different Prometheus metrics published by SILO server":
    "SILO sunucusu tarafından yayınlanan farklı Prometheus ölçümleri hakkında bilgi edinin",
  "Metrics and Alerts": "Metrikler ve Uyarılar",
  "For historical metrics and analytics, SILO publishes cluster and node metrics using the Prometheus Data Model.":
    "Geçmiş metrikler ve analizler için SILO, Prometheus Veri Modelini kullanarak küme ve düğüm metriklerini yayınlar.",
  "Learn about the monitoring features available  in your MinIO Console.":
    "MinIO Konsolunuzda bulunan izleme özellikleri hakkında bilgi edinin.",
  "User Management": "Kullanıcı Yönetimi",
  "Each user can have one or more assigned policies that explicitly list the actions and resources to which that user has access. Users can also inherit policies from the groups in which they have membership.":
    "Her kullanıcı, o kullanıcının erişim sahibi olduğu eylemleri ve kaynakları açıkça listeleyen bir veya daha fazla atanmış politikaya sahip olabilir. Kullanıcılar ayrıca üye oldukları gruplardan politikaları devralabilirler.",
  "Group Management": "Grup Yönetimi",
  "A group is a collection of users. Each group can have one or more assigned policies that explicitly list the actions and resources to which group members are allowed or denied access.":
    "Grup, kullanıcılardan oluşan bir koleksiyondur. Her grup, grup üyelerinin erişimine izin verilen veya erişimin reddedildiği eylemleri ve kaynakları açıkça listeleyen bir veya daha fazla atanmış politikaya sahip olabilir.",
  "MinIO Identity and Access Management: Part 3 - Interfacing with OpenID and LDAP":
    "MinIO Kimlik ve Erişim Yönetimi: Bölüm 3 - OpenID ve LDAP ile Arayüz Oluşturma",
  "This video is focused on interfacing with OpenID and LDAP to manage access to MinIO.":
    "Bu video, MinIO erişimini yönetmek için OpenID ve LDAP ile arayüz oluşturmaya odaklanmıştır.",
  "MinIO Authentication and Authorization Using OpenID and Keycloak":
    "MinIO OpenID ve Keycloak Kullanarak Kimlik Doğrulama ve Yetkilendirme",
  "In this video you will learn how to set up an OpenID service, Keycloak, to provide authentication and authorization as part of a MinIO deployment.":
    "Bu videoda, MinIO dağıtımının bir parçası olarak kimlik doğrulama ve yetkilendirme sağlamak için bir OpenID hizmetinin (Keycloak) nasıl kurulacağını öğreneceksiniz.",
  "Drive Healing": "İyileşmeyi Sağlayın",
  "The Drives section displays the healing status for a bucket.":
    "Sürücüler bölümü bir kovanın iyileştirme durumunu görüntüler.",
  "Erasure Coding": "Silme Kodlaması",
  "SILO Erasure Coding is a data redundancy and availability feature that allows SILO deployments to automatically reconstruct objects on-the-fly despite the loss of multiple drives or nodes in the cluster.":
    "SILO Silme Kodlaması, SILO dağıtımların, kümedeki birden fazla sürücü veya düğüm kaybına rağmen nesneleri anında otomatik olarak yeniden yapılandırmasına olanak tanıyan bir veri yedekliliği ve kullanılabilirliği özelliğidir.",
  "Site Healing": "Site İyileştirme",
  "Any SILO deployment in the site replication configuration can resynchronize damaged replica-eligible data from the peer with the most updated (“latest”) version of that data.":
    'Site çoğaltma yapılandırmasındaki herhangi bir SILO dağıtımı, eşten gelen hasarlı kopyaya uygun verileri, söz konusu verilerin en güncel ("en son") sürümüyle yeniden senkronize edebilir.',
  Healing: "Şifa",
  "SILO Automatically Heals Corrupt or Missing Data On-the-fly":
    "SILO Bozuk veya Eksik Verileri Anında Otomatik Olarak İyileştirir",
  "In this video, we will provide an overview of site-wide replication.":
    "Bu videoda site genelinde replikasyona genel bir bakış sunacağız.",
  Health: "Sistem Sağlığı",
  "The health section provides an interface for running a health diagnostic for the SILO Deployment. The report is generated on the deployment and downloaded directly to your browser.":
    "Sistem durumu bölümü, SILO Dağıtımı için sistem durumu teşhisini çalıştırmak için bir arayüz sağlar. Rapor dağıtım sırasında oluşturulur ve doğrudan tarayıcınıza indirilir.",
  "IDP Docs": "IDP Dokümanlar",
  "SILO supports multiple external identity managers through OpenID Connect-Compatible Active Directory / LDAP":
    "SILO, OpenID Connect Uyumlu Active Directory / LDAP aracılığıyla birden fazla harici kimlik yöneticisini destekler",
  "Built-in SILO IDP": "Dahili SILO IDP",
  "SILO includes a built-in IDentity Provider (IDP) that provides core identity management functionality.":
    "SILO, temel kimlik yönetimi işlevselliği sağlayan yerleşik bir Kimlik Sağlayıcı (IDP) içerir.",
  "Active Directory / LDAP Access Management":
    "Active Directory / LDAP Erişim Yönetimi",
  "For identities managed by the external AD/LDAP provider, SILO uses the user’s Distinguished Name and attempts to map it against an existing policy.":
    "Harici AD/LDAP sağlayıcı tarafından yönetilen kimlikler için, SILO kullanıcının Ayırt Edici Adını kullanır ve onu mevcut bir politikayla eşleştirmeye çalışır.",
  "Keycloak configuration": "Keycloak yapılandırma",
  "You can configure SILO to use Keycloak as an external IDentity Provider (IDP) for authentication of users via the OpenID Connect (OIDC) protocol.":
    "SILO'yi, OpenID Connect (OIDC) protokolü aracılığıyla kullanıcıların kimlik doğrulaması için Keycloak'yi harici Kimlik Sağlayıcı (IDP) olarak kullanacak şekilde yapılandırabilirsiniz.",
  "LDAP Configuration": "LDAP Yapılandırma",
  "SILO supports configuring a single Active Directory / LDAP Connect for external management of user identities.":
    "SILO, kullanıcı kimliklerinin harici yönetimi için tek bir Active Directory / LDAP Connect'in yapılandırılmasını destekler.",
  "OIDC Configuration": "OIDC Yapılandırma",
  "SILO supports using an OpenID Connect (OIDC) compatible IDentity Provider (IDP) such as Okta, KeyCloak, Dex, Google, or Facebook for external management of user identities.":
    "SILO, kullanıcı kimliklerinin harici yönetimi için Okta, KeyCloak, Dex, Google veya Facebook gibi OpenID Connect (OIDC) uyumlu bir Kimlik Sağlayıcı (IDP) kullanılmasını destekler.",
  "KMS overview": "KMS genel bakış",
  "MinIO's cryptographic expert shares why MinIO built KES, what it is used for and how it fits into the MinIO architecture.":
    "MinIO'in kriptografi uzmanı, MinIO'nin neden KES inşa ettiğini, ne için kullanıldığını ve MinIO mimarisine nasıl uyduğunu paylaşıyor.",
  "Learn about key management using KMS.":
    "KMS kullanarak anahtar yönetimi hakkında bilgi edinin.",
  "Text snippet that will be relevant to the user will  go here  made to look nice in the helpitem size  on two-three lines":
    "Kullanıcıyla alakalı olacak metin pasajı, yardım öğesi boyutunda iki-üç satırda güzel görünecek şekilde buraya gelecek",
  "Error logs can be filtered by node and log type, as well as search for specific text in the logs.":
    "Hata günlükleri, düğüm ve günlük türüne göre filtrelenebildiği gibi günlüklerde belirli metinler de aranabilir.",
  "Audit Logs": "Denetim Günlükleri",
  "You can configure an HTTP webhook endpoint to which SILO publishes audit logs using either environment variables or by setting runtime configuration settings.":
    "Ortam değişkenlerini kullanarak veya çalışma zamanı yapılandırma ayarlarını ayarlayarak SILO'nin denetim günlüklerini yayınlayacağı bir HTTP webhook uç noktası yapılandırabilirsiniz.",
  "Object Lambda": "Nesne Lambdası",
  "SILO’s Object Lambda enables developers to programmatically transform objects on demand.":
    "SILO'nin Object Lambda'sı, geliştiricilerin isteğe bağlı olarak nesneleri programlı olarak dönüştürmesine olanak tanır.",
  "MinIO Event Notifications - Overview":
    "MinIO Etkinlik Bildirimleri - Genel Bakış",
  "Use the Event framework to see what's going on in the system using Bucket, Object, Replication and ILM events.":
    "Bucket, Object, Replication ve ILM olaylarını kullanarak sistemde neler olup bittiğini görmek için Etkinlik çerçevesini kullanın.",
  "Managing Event Notifications Using MinIO MC Commands":
    "MinIO MC Komutlarını Kullanarak Etkinlik Bildirimlerini Yönetme",
  "This video provides an overview of the types of event notifications and how to set them up using MinIO's mc commands.":
    "Bu video, etkinlik bildirimi türlerine ve bunların MinIO'nin mc komutlarını kullanarak nasıl kurulacağına ilişkin genel bir bakış sağlar.",
  "MinIO Events Notifications - Setting Up Webhooks Using Python":
    "MinIO Etkinlik Bildirimleri - Python Kullanarak Web Kancalarını Ayarlama",
  "This video provides an overview of how to use Python and Flask to set up a Webhook on MinIO. ":
    "Bu video, MinIO üzerinde Webhook ayarlamak için Python ve Flask'ın nasıl kullanılacağına dair genel bir bakış sunar.",
  "MinIO Event Notifications - Using The MinIO Python SDK to Write Custom Webhooks":
    "MinIO Etkinlik Bildirimleri - Özel Web Kancaları Yazmak için MinIO Python SDK Kullanımı",
  "This video dives deeper into using the MinIO Python SDK to setup and manage notifications.":
    "Bu video, bildirimleri ayarlamak ve yönetmek için MinIO Python SDK kullanımını daha ayrıntılı olarak ele alıyor.",
  "Object Management": "Nesne Yönetimi",
  "Learn about Objects and how  SILO allows you to manage them":
    "Nesneler ve SILO'nin bunları yönetmenize nasıl olanak sağladığı hakkında bilgi edinin",
  "Managing Objects with the Object Browser":
    "Nesneleri Nesne Tarayıcısıyla Yönetme",
  "Learn how to use the Console Object Browser  to manage your Objects":
    "Nesnelerinizi yönetmek için Konsol Nesne Tarayıcısını nasıl kullanacağınızı öğrenin",
  "Manipulating Objects": "Nesneleri Değiştirme",
  "A demo of Prefixes & Objects with examples of copying and deleting an object, as well as CopySource Object.":
    "CopySource Nesnesinin yanı sıra bir nesneyi kopyalama ve silme örneklerini içeren Önekler ve Nesneler demosu.",
  "Example Policy - Bucket Resource Access":
    "Örnek Politika - Kova Kaynağı Erişimi",
  "An example policy demonstrating authorization  limited to a named bucket":
    "Yetkilendirmenin adlandırılmış bir grupla sınırlı olduğunu gösteren örnek bir politika",
  Performance: "Performans",
  "The performance section provides an interface for running a performance test of the deployment.":
    "Performans bölümü, dağıtımın performans testini çalıştırmak için bir arayüz sağlar.",
  Profile: "Profil",
  "The profile section provides an interface for running system profiling of the deployment. The results can provide insight into the SILO server process running on a given node.":
    "Profil bölümü, dağıtımın sistem profilini çalıştırmak için bir arayüz sağlar. Sonuçlar, belirli bir düğümde çalışan SILO sunucu sürecine ilişkin bilgi sağlayabilir.",
  Inspect: "İncele",
  "The inspect section provides an interface for capturing the erasure-coded metadata associated to an object or objects.":
    "İnceleme bölümü, bir nesne veya nesnelerle ilişkili silme kodlu meta verileri yakalamak için bir arayüz sağlar.",
  "Encrypt Inspect Output": "İnceleme Çıkışını Şifrele",
  "You can encrypt the output of the mc support inspect command for enhanced security when transferring the files off the deployment.":
    "Dosyaları dağıtım dışına aktarırken güvenliği artırmak için mc support inspect çıktısını şifreleyebilirsiniz.",
  "What is Trace?": "İz Nedir?",
  "The trace section provides HTTP trace functionality for a bucket or buckets on the deployment.":
    "İzleme bölümü, dağıtımdaki bir kova veya kovalar için HTTP izleme işlevselliği sağlar.",
  Users: "Kullanıcılar",
  "What is Watch?": "Saat Nedir?",
  "The Watch section displays S3 events as they occur on the selected bucket.":
    "İzleme bölümü, seçilen grupta meydana gelen S3 olayları görüntüler.",
  "Access Managemnt": "Erişim Yönetimi",
  "Object Locking": "Nesne Kilitleme",
  "SILO Object Locking (“Object Retention”) enforces Write-Once Read-Many (WORM) immutability to protect versioned objects from deletion.":
    "SILO Nesne Kilitleme (“Nesne Tutma”), sürümü oluşturulmuş nesneleri silinmeye karşı korumak için Bir Kez Yaz Çok Sayıda Oku (WORM) değişmezliğini uygular.",
  Encryption: "Şifreleme",
  "SILO Server-Side Encryption (SSE) protects objects as part of write operations, allowing clients to take advantage of server processing power to secure objects at the storage layer (encryption-at-rest).":
    "SILO Sunucu Tarafı Şifreleme (SSE), yazma işlemlerinin bir parçası olarak nesneleri korur ve istemcilerin, depolama katmanındaki nesnelerin güvenliğini sağlamak için sunucu işlem gücünden yararlanmasına olanak tanır (beklemede şifreleme).",
  "Learn how to use Console to manage Buckets":
    "Kovaları yönetmek için Konsolu nasıl kullanacağınızı öğrenin",
  "Bucket Replication": "Kova Çoğaltma",
  "SILO server-side bucket replication is an automatic bucket-level configuration that synchronizes objects between a source and destination bucket.":
    "SILO sunucu tarafı kova çoğaltması, bir kaynak ve hedef kova arasındaki nesneleri senkronize eden otomatik kova düzeyinde bir yapılandırmadır.",
  "This video gives an overview of how to set up and use object versioning as part of a data lifecycle management strategy.":
    "Bu video, veri yaşam döngüsü yönetimi stratejisinin bir parçası olarak nesne sürümü oluşturmanın nasıl kurulacağı ve kullanılacağı hakkında genel bir bakış sunar.",
  "Versioning Lab": "Sürüm Oluşturma Laboratuvarı",
  "This demo will take you through the steps to manage versioned objects using the MinIO command line tools.":
    "Bu demo, MinIO komut satırı araçlarını kullanarak sürümü oluşturulmuş nesneleri yönetme adımlarında size yol gösterecektir.",
  "Bucket Replication Requirements": "Kova Çoğaltma Gereksinimleri",
  "Check here to ensure you meet the prerequisites before setting up any replication configurations.":
    "Herhangi bir çoğaltma yapılandırmasını ayarlamadan önce ön koşulları karşıladığınızdan emin olmak için burayı kontrol edin.",
  "Bucket Replication Overview": "Kova Çoğaltma Genel Bakış",
  "In this video, we will cover bucket level replication, both active-passive and active-active.":
    "Bu videoda hem aktif-pasif hem de aktif-aktif olarak kova seviyesinde replikasyonu ele alacağız.",
  "Replication Lab I": "Çoğaltma Laboratuvarı I",
  "Demonstrates bucket replication concepts using MinIO Client, including active-passive and active-active replication.":
    "Aktif-pasif ve aktif-aktif çoğaltma dahil olmak üzere MinIO İstemciyi kullanarak kova çoğaltma kavramlarını gösterir.",
  "Replication Lab II": "Çoğaltma Laboratuvarı II",
  "Demonstrates site replication concepts using MinIO Client, including active-passive and active-active replication.":
    "Aktif-pasif ve aktif-aktif çoğaltma dahil olmak üzere MinIO İstemci kullanılarak site çoğaltma kavramlarını gösterir.",
  "Access Management": "Erişim Yönetimi",
  "Logging in": "Oturum açma",
  "Sign in with the root credentials, an IAM user access key, or temporary STS credentials via Other Authentication Methods.":
    "Kök kimlik bilgileriyle, IAM kullanıcı erişim anahtarıyla veya Diğer Kimlik Doğrulama Yöntemleri aracılığıyla geçici STS kimlik bilgileriyle oturum açın.",
  "Console configuration": "Konsol yapılandırması",
  "Configure identity providers, TLS, and session settings for the console on the server side.":
    "Sunucu tarafında konsol için kimlik sağlayıcıları, TLS ve oturum ayarlarını yapılandırın.",
  "Replication Internals": "Çoğaltma Dahili Öğeleri",
  "Learn details of the SILO replication process.":
    "SILO çoğaltma işleminin ayrıntılarını öğrenin.",
  "One-way Bucket Replication": "Tek Yönlü Kova Çoğaltma",
  "Guidance on configuring one-way Bucket replication using SILO Console.":
    "SILO Konsolu kullanarak tek yönlü Kova çoğaltmasını yapılandırma konusunda rehberlik.",
  "Two-way Bucket Replication": "İki Yönlü Kova Çoğaltma",
  "Guidance on configuring two-way (active-active) Bucket replication using SILO Console.":
    "SILO Konsolu kullanarak iki yönlü (aktif-aktif) Kova çoğaltmayı yapılandırma konusunda rehberlik.",
};

export default messages;
