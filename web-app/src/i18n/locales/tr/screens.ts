// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
// AI-assisted translation; see ../../README.md for review and maintenance.

import type { Dictionary } from "../../catalog";

const messages: Dictionary = {
  "Users inherit policies from their groups. Access is denied unless explicitly granted.":
    "Kullanıcılar politikaları gruplarından devralır. Açıkça izin verilmediği sürece erişim reddedilir.",
  "Policies define allowed actions and resources for users and groups.":
    "Politikalar, kullanıcılar ve gruplar için izin verilen eylemleri ve kaynakları tanımlar.",
  "IAM policies": "IAM politikaları",
  "Access keys inherit their parent user’s permissions. An inline policy can only restrict them further.":
    "Erişim anahtarları, üst kullanıcılarının izinlerini devralır. Satır içi bir politika bunları yalnızca daha da kısıtlayabilir.",
  "Access keys": "Erişim anahtarları",
  "Configure a destination, then add bucket notification rules to send S3 events to it.":
    "Bir hedef yapılandırın, ardından bu hedefe S3 etkinlikleri göndermek için kova bildirim kuralları ekleyin.",
  "Event destinations": "Etkinlik hedefleri",
  "SILO version": "SILO sürümü",
  "Raw JSON": "Ham JSON",
  "Recursive inspections can be expensive. Limit the bucket and path before starting.":
    "Özyinelemeli incelemeler yüksek kaynak tüketebilir. Başlamadan önce kovayı ve yolu sınırlayın.",
  "Open Help for examples, or read the":
    "Örnekler için Yardım'ı açın veya şunu okuyun:",
  Tasks: "Görevler",
  "Tasks: {count} running": "Görevler: {count} çalışıyor",
  "Close Tasks": "Görevleri Kapat",
  "Object operations": "Nesne işlemleri",
  Running: "Çalışıyor",
  Finished: "Bitti",
  Queued: "Sıraya alındı",
  Completed: "Tamamlandı",
  "No running tasks": "Çalışan görev yok",
  "No finished tasks": "Tamamlanmış görev yok",
  "Clear finished": "Tamamlananları temizle",
  "ZIP download": "ZIP indir",
  "Browser handoff": "Tarayıcı geçişi",
  "Task progress": "Görev ilerlemesi",
  "Waiting for data": "Veri bekleniyor",
  "Remove task": "Görevi kaldır",
  "Cancel task": "Görevi iptal et",
  "Retry failed": "Başarısızları yeniden dene",
  "Open bucket/prefix": "Kovayı/ön eki aç",
  "{done}/{total} completed · {failed} failed · {cancelled} cancelled":
    "{done}/{total} tamamlandı · {failed} başarısız oldu · {cancelled} iptal edildi",
  "{bytes} bytes received": "{bytes} bayt alındı",
  "Handoff is complete; final download progress is unavailable here.":
    "Aktarma tamamlandı; Son indirme ilerlemesi burada mevcut değil.",
  "Counts represent selected targets. Progress within a folder or version cleanup is unavailable.":
    "Sayımlar seçilen hedefleri temsil eder. Bir klasör veya sürüm temizleme işleminde ilerleme sağlanamıyor.",
  "Completed changes remain in place. In-flight requests may have reached the server; inspect before repeating them.":
    "Tamamlanan değişiklikler korunur. Devam eden istekler sunucuya ulaşmış olabilir; tekrarlamadan önce inceleyin.",
  "Review {count} results": "{count} sonucu inceleyin",
  "Server outcome is unconfirmed. Inspect this object before another operation.":
    "Sunucu sonucu doğrulanmadı. Başka bir işlemden önce bu nesneyi inceleyin.",
  "Task failed: {name}": "Görev başarısız oldu: {name}",
  "Task completed: {name}": "Görev tamamlandı: {name}",
  "Open Tasks to inspect the results.":
    "Sonuçları incelemek için Görevler'i açın.",
  "The request failed. Inspect the object before trying again.":
    "İstek başarısız oldu. Tekrar denemeden önce nesneyi inceleyin.",
  "Tasks are still running": "Görevler hala çalışıyor",
  "Stay here": "Burada kal",
  "Cancel tasks and leave": "Görevleri iptal et ve ayrıl",
  "Leave page": "Sayfadan ayrıl",
  "Leaving this session cancels queued and running tasks. Changes already completed on the server remain in place.":
    "Bu oturumdan ayrılmak sıraya alınmış ve çalışan görevleri iptal eder. Sunucuda halihazırda tamamlanmış olan değişiklikler yerinde kalır.",
  "Tasks will continue in this session. You can check their progress in Tasks on another page.":
    "Bu oturumda görevler devam edecek. İlerleme durumlarını başka bir sayfadaki Görevler bölümünden kontrol edebilirsiniz.",
  "Delete Versions": "Sürümleri Sil",
  "Cluster health": "Küme sağlığı",
  "servers online": "sunucu çevrimiçi",
  "{count} drives online": "{count} sürücü çevrimiçi",
  "{count} server(s) offline": "{count} sunucu çevrimdışı",
  "{count} drive(s) offline": "{count} sürücü çevrimdışı",
  "{count} drive(s) healing": "{count} sürücü onarılıyor",
  "Drive {drive} is at least 95% full. The server may reject writes.":
    "Sürücü {drive} en az %95 dolu. Sunucu yazma işlemlerini reddedebilir.",
  "Drive {drive} is at least 85% full.": "Sürücü {drive} en az %85 dolu.",
  "Configuration changes are waiting for a server restart.":
    "Yapılandırma değişiklikleri sunucunun yeniden başlatılmasını bekliyor.",
  "Some server or drive health information is unavailable.":
    "Bazı sunucu veya sürücü sağlık bilgileri mevcut değil.",
  "Capacity is incomplete. Only reported drive measurements are shown.":
    "Kapasite eksik. Yalnızca bildirilen sürücü ölçümleri gösterilir.",
  "Generate health report": "Sağlık raporu oluştur",
  "No servers reported": "Sunucu bildirilmedi",
  Server: "Sunucu",
  "Just started": "Yeni başladı",
  "Hide drives for {server}": "{server} için sürücüleri gizle",
  "Show drives for {server}": "{server} için sürücüleri göster",
  "No drive information available": "Sürücü bilgisi mevcut değil",
  "Drives on {server}": "{server} üzerindeki sürücüler",
  "{used} / {total} used": "{used} / {total} kullanılmış",
  "Drive usage: {drive}": "Sürücü kullanımı: {drive}",
  "Refresh failed. The last received data is still shown.":
    "Yenileme başarısız oldu. En son alınan veriler hâlâ gösterilmektedir.",
  "Could not load deployment information. Try refreshing.":
    "Dağıtım bilgileri yüklenemedi. Yenilemeyi deneyin.",
  "Deployment statistics": "Dağıtım istatistikleri",
  "of {total} raw capacity": "/ {total} ham kapasite",
  "{available} available": "{available} mevcut",
  Data: "Veri",
  objects: "nesneler",
  Alerts: "Uyarılar",
  "Health information unavailable": "Sağlık bilgisi mevcut değil",
  "All systems normal": "Tüm sistemler normal",
  "Quick actions": "Hızlı eylemler",
  "No quick actions available for your permissions.":
    "İzinleriniz için hızlı işlem yok.",
  "Read & write": "Okuma ve yazma",
  "Delete bucket": "Kovayı sil",
  "Actions for {bucket}": "{bucket} için eylemler",
  "Select {bucket}": "{bucket} kovasını seçin",
  "Object lock": "Nesne kilidi",
  Created: "Oluşturuldu",
  "Select all visible buckets": "Görünen tüm kovaları seç",
  "Bucket rows": "Kova satırları",
  "The bucket list could not be loaded.": "Kova listesi yüklenemedi.",
  "Select one or more buckets first.": "Önce bir veya daha fazla kova seçin.",
  "configure the selected buckets": "seçilen kovaları yapılandır",
  "Search buckets": "Kova ara",
  "Bucket view": "Kova görünümü",
  Cards: "Kartlar",
  "{count} buckets selected": {
    one: "{count} kova seçildi",
    other: "{count} kova seçildi",
  },
  "{count} bucket selected": "{count} kova seçildi",
  "No buckets match “{q}”": "“{q}” ile eşleşen kova yok",
  "Clear filter": "Filtreyi temizle",
  "Built-in · Modified": "Dahili · Değiştirildi",
  "Actions for {name}": "{name} için eylemler",
  "Reset to default": "Varsayılana sıfırla",
  "Could not load policies": "Politikalar yüklenemedi",
  "Refresh to try again.": "Tekrar denemek için yenileyin.",
  "Create a policy to define permissions for users and groups.":
    "Kullanıcılar ve gruplar için izinleri tanımlamak üzere bir politika oluşturun.",
  "Could not update policy": "Politika güncellenemedi",
  "Reset policy {name} to its default definition?":
    "{name} politikası varsayılan tanımına sıfırlansın mı?",
  "The built-in policy will be restored to the SILO default definition.":
    "Yerleşik politika, SILO varsayılan tanımına geri yüklenecektir.",
  "Loading attachment information…": "Atama bilgileri yükleniyor…",
  "This policy has changed or is no longer available. Refresh the list.":
    "Bu politika değişti veya artık mevcut değil. Listeyi yenileyin.",
  "Attachment information is unavailable.": "Atama bilgisi mevcut değil.",
  "This policy is attached to {users} users and {groups} groups.":
    "Bu politika {users} kullanıcı ve {groups} grup için geçerlidir.",
  "Their permissions will follow the default definition.":
    "İzinleri varsayılan tanıma uygun olacaktır.",
  "They will lose the permissions it grants.":
    "Verdiği izinleri kaybedecekler.",
  "Could not load policy. Refresh to try again.":
    "Politika yüklenemedi. Tekrar denemek için yenileyin.",
  "Could not load policy": "Politika yüklenemedi",
  "Could not load users for this policy":
    "Bu politika için kullanıcılar yüklenemedi",
  "Could not load groups for this policy":
    "Bu politika için gruplar yüklenemedi",
  "Built-in policies can be overridden by saving a modified version; you can reset it later.":
    "Yerleşik politikalar, değiştirilmiş bir sürüm kaydedilerek geçersiz kılınabilir; daha sonra sıfırlayabilirsiniz.",
  "Override policy": "Politikayı geçersiz kıl",
  "Cancel editing": "Düzenlemeyi iptal et",
  "Direct policies": "Doğrudan politikalar",
  "Policies inherited through groups":
    "Gruplar aracılığıyla devralınan politikalar",
  "Access-key count is unavailable.": "Erişim anahtarı sayısı mevcut değil.",
  "Group policy information is unavailable.":
    "Grup politikası bilgisi mevcut değil.",
  "Also assigned directly": "Ayrıca doğrudan atanır",
  "From groups:": "Gruplardan:",
  "Group policies could not be loaded.": "Grup politikaları yüklenemedi.",
  "Group is disabled; its policies are not inherited.":
    "Grup devre dışı; politikaları miras alınmaz.",
  "Group status is unavailable; inherited permissions are unknown.":
    "Grup durumu mevcut değil; devralınan izinler bilinmiyor.",
  "No inherited group policies": "Devralınan grup politikası yok",
  "Some group policies are unavailable. Refresh to try again.":
    "Bazı grup politikaları kullanılamıyor. Tekrar denemek için yenileyin.",
  "Could not load user": "Kullanıcı yüklenemedi",
  "Could not update user status": "Kullanıcı durumu güncellenemedi",
  "Edit replication": "Çoğaltmayı düzenle",
  "Page not found": "Sayfa bulunamadı",
  "Go to Buckets": "Kovalara Git",
  "Go back": "Geri dön",
  "Read the documentation": "Belgeleri okuyun",
  "You do not have permission to view this page":
    "Bu sayfayı görüntüleme izniniz yok",
  "Ask your administrator for access. This page checks the following IAM actions:":
    "Yöneticinizden erişim isteyin. Bu sayfa aşağıdaki IAM eylemlerini kontrol eder:",
  "Required IAM actions": "Gerekli IAM eylemleri",
  "Encryption is not configured": "Şifreleme yapılandırılmamış",
  "Configure KES or KMS on the SILO server to manage encryption keys in Console.":
    "Konsolda şifreleme anahtarlarını yönetmek için SILO sunucusunda KES veya KMS'yi yapılandırın.",
  "Local identity management is unavailable":
    "Yerel kimlik yönetimi kullanılamıyor",
  "LDAP is enabled. Manage users and groups in your LDAP directory; connection settings are available on the LDAP configuration page.":
    "LDAP etkinleştirildi. LDAP dizininizdeki kullanıcıları ve grupları yönetin; bağlantı ayarları LDAP yapılandırma sayfasında mevcuttur.",
  "Tier creation is unavailable": "Katman oluşturma kullanılamıyor",
  "This Console requires a distributed server setup to add a remote storage tier.":
    "Bu Konsol, uzak depolama katmanı eklemek için dağıtılmış bir sunucu kurulumu gerektirir.",
  "This page is unavailable in object browser mode":
    "Bu sayfa nesne tarayıcı modunda kullanılamaz",
  "This Console is configured for object browsing only. Ask your administrator to enable the full Console to use this page.":
    "Bu Konsol yalnızca nesne taraması için yapılandırılmıştır. Yöneticinizden bu sayfayı kullanmak için Konsolun tamamını etkinleştirmesini isteyin.",
  "Prometheus is configured but unreachable":
    "Prometheus yapılandırılmış ancak ulaşılamıyor",
  "Check the Prometheus address, network access and authentication, then retry.":
    "Prometheus adresini, ağ erişimini ve kimlik doğrulamasını kontrol edip yeniden deneyin.",
  "Advanced metrics need Prometheus":
    "Gelişmiş metrikler için Prometheus gerekir",
  "Configure Prometheus to collect SILO metrics, then set the URL for your deployment and restart the corresponding service.":
    "SILO metriklerini toplamak için Prometheus'u yapılandırın, ardından dağıtımınız için URL'yi ayarlayın ve ilgili hizmeti yeniden başlatın.",
  "Standalone Console": "Bağımsız Konsol",
  "Console embedded in SILO": "SILO'ya yerleşik Konsol",
  "Optional standalone settings": "İsteğe bağlı bağımsız ayarlar",
  "Bearer token: ": "Hamiline ait jeton:",
  "Or basic authentication: ": "Veya temel kimlik doğrulama:",
  "Embedded settings: ": "Gömülü ayarlar:",
  Icons: "Simgeler",
  "Create bucket": "Kova oluştur",
  "Edit {label}": "{label} düzenle",
  "Calculating…": "Hesaplanıyor…",
  "The server has not finished computing usage yet.":
    "Sunucu henüz kullanım hesaplamasını tamamlamadı.",
  "Calculated {time}": "Hesaplandı {time}",
  "Updated {time}": "Güncellendi {time}",
  "Permission required": "İzin gerekli",
  "Ask your administrator to grant the following IAM actions.":
    "Yöneticinizden aşağıdaki IAM izinlerini vermesini isteyin.",
  "More actions": "Daha fazla eylem",
  "Equivalent mcli command": "Eşdeğer mcli komutu",
  Copied: "Kopyalandı",
  "Copy failed. Select and copy the command.":
    "Kopyalama başarısız oldu. Komutu seçip kopyalayın.",
  "Copy commands": "Komutları kopyala",
  "Replace ALIAS with your configured mcli alias (for example, {alias}).":
    "ALIAS'ı yapılandırılmış mcli takma adınızla değiştirin (örneğin, {alias}).",
  "Replace ALIAS with your configured mcli alias.":
    "ALIAS'ı yapılandırılmış mcli takma adınızla değiştirin.",
  "Loading…": "Yükleniyor…",
  "SILO primitives": "SILO temel bileşenleri",
  "Shared building blocks for storage, identity and monitoring.":
    "Depolama, kimlik ve izleme için paylaşılan yapı taşları.",
  "Healthy capacity": "Sağlıklı kapasite",
  "Capacity warning": "Kapasite uyarısı",
  "Above the 85% warning threshold": "%85 uyarı eşiğinin üzerinde",
  "Capacity critical": "Kapasite kritik",
  "Above the 95% critical threshold": "%95 kritik eşiğin üzerinde",
  "Usage is calculated by the server.":
    "Kullanım sunucu tarafından hesaplanır.",
  "View buckets": "Kovaları görüntüle",
  "Status and values": "Durum ve değerler",
  "Built-in": "Dahili",
  "Freshness and actions": "Veri güncelliği ve işlemler",
  "Select an object to inspect its details.":
    "Ayrıntılarını incelemek için bir nesne seçin.",
  "Object details": "Nesne ayrıntıları",
  "Demo action completed.": "Demo işlemi tamamlandı.",
  "Select an object to download.": "İndirilecek bir nesne seçin.",
  "Empty and unavailable states": "Boş ve kullanılamayan durumlar",
  "No buckets yet": "Henüz kova yok",
  "Create a bucket to start storing objects.":
    "Nesneleri depolamaya başlamak için bir kova oluşturun.",
  "No matching objects": "Eşleşen nesne yok",
  "Try a different name or clear the search filter.":
    "Farklı bir ad deneyin veya arama filtresini temizleyin.",
  "Metrics are unavailable": "Metrikler mevcut değil",
  "Connect a Prometheus endpoint to view monitoring metrics.":
    "İzleme ölçümlerini görüntülemek için bir Prometheus uç noktası bağlayın.",
  "Loading rows": "Satır yükleniyor",
  "Command preview": "Komut önizlemesi",
  "Showing the first 1 MiB. Download the object to see the full file.":
    "İlk 1 MiB gösteriliyor. Dosyanın tamamını görmek için nesneyi indirin.",
  "Showing first 500 rows": "İlk 500 satır gösteriliyor",
  "Showing the first 100 columns. View Source or download the object to see all columns.":
    "İlk 100 sütun gösteriliyor. Tüm sütunları görmek için Kaynağı Görüntüleyin veya nesneyi indirin.",
  Rendered: "Görsel Görünüm",
  "Wrap lines": "Satırları kaydır",
  Row: "Satır",
  "CSV preview content": "CSV içeriğin önizlemesi",
  "Markdown preview content": "Markdown önizleme içeriği",
  "Markdown rendering is unavailable for this content. Showing the source instead.":
    "Markdown oluşturma bu içerik için mevcut değil. Bunun yerine kaynak gösteriliyor.",
  "Image: {alt}": "Resim: {alt}",
  Image: "Resim",
  Actions: "Eylemler",
  "Select version": "Sürümü seçin",
  "This version is a delete marker.": "Bu sürüm bir silme işaretçisidir.",
  "You need s3:GetObject permission.": "s3:GetObject iznine ihtiyacınız var.",
  "You need s3:GetObjectVersion permission.":
    "s3:GetObjectVersion iznine ihtiyacınız var.",
  "Preview is not available for this file type.":
    "Bu dosya türü için önizleme mevcut değil.",
  "Object Lock is not enabled on this bucket.":
    "Bu kovada Nesne Kilidi etkin değil.",
  "You need s3:PutObjectLegalHold permission.":
    "s3:PutObjectLegalHold iznine ihtiyacınız var.",
  "You need s3:PutObjectRetention permission.":
    "s3:PutObjectRetention iznine ihtiyacınız var.",
  "Tags can only be changed on the current version.":
    "Etiketler yalnızca güncel sürümde değiştirilebilir.",
  "Versioning is not enabled on this bucket.":
    "Bu kovada sürüm oluşturma etkin değil.",
  "Select one or more objects first.":
    "Önce bir veya daha fazla nesneyi seçin.",
  "Select a single object first.": "Önce tek bir nesne seçin.",
  "Select a file instead of a folder.": "Klasör yerine dosya seçin.",
  "Select a folder to change anonymous access.":
    "Anonim erişimi değiştirmek için bir klasör seçin.",
  "Open the current object to use this action.":
    "Bu eylemi kullanmak için geçerli nesneyi açın.",
  "This action requires a distributed server.":
    "Bu eylem dağıtılmış bir sunucu gerektirir.",
  "You need s3:PutObjectTagging permission.":
    "s3:PutObjectTagging iznine ihtiyacınız var.",
  "You need admin:InspectData permission.":
    "admin:InspectData iznine ihtiyacınız var.",
  "You need permission to view object versions.":
    "Nesne sürümlerini görüntülemek için izne ihtiyacınız var.",
  "You need s3:DeleteObject permission.":
    "s3:DeleteObject iznine ihtiyacınız var.",
  "You need permission to change the bucket policy.":
    "Kova politikasını değiştirmek için izne ihtiyacınız var.",
  "You need permission to read objects and bucket versioning.":
    "Nesneleri ve kova sürümlerini okumak için izne ihtiyacınız var.",
  "You need s3:ListBucket permission.": "s3:ListBucket iznine ihtiyacınız var.",
  "You need permission to restore this version.":
    "Bu sürümü geri yüklemek için izne ihtiyacınız var.",
  "You need permission to select this version.":
    "Bu sürümü seçmek için izne ihtiyacınız var.",
  "You need permission to delete object versions.":
    "Nesne sürümlerini silmek için izne ihtiyacınız var.",
  "Exit rewind mode to refresh the object list.":
    "Nesne listesini yenilemek için geri sarma modundan çıkın.",
  "There are no non-current versions to delete.":
    "Silinecek güncel olmayan sürüm yok.",
  "Invalid Endpoint": "Geçersiz Uç Nokta",
  Broker: "Broker",
  QOS: "QOS",
  "Client ID": "İstemci ID",
  "Client Secret": "İstemci Gizli Anahtarı",
  "Redirect URI": "Yönlendirme URI'si",
  "Lookup Bind DN": "Arama Bağlantısı DN",
  "Lookup Bind Password": "Arama Bağlama Şifresi",
  "User DN Search Base": "Kullanıcı DN Arama Tabanı",
  "User DN Search Filter": "Kullanıcı DN Arama Filtresi",
  "Group Search Base DN": "Grup Arama Tabanı DN",
  "Group Search Filter": "Grup Arama Filtresi",
  "Sign Out": "Çıkış yap",
  "Remove transfer": "Aktarımı kaldır",
  "Cancel transfer": "Aktarımı iptal et",
  "This download has already started. Dismiss its transfer entry to start it again.":
    "Bu indirme işlemi zaten başladı. Yeniden başlatmak için aktarım kaydını kaldırın.",
  "Track or cancel this download in your browser's download manager.":
    "Bu indirme işlemini tarayıcınızın indirme yöneticisinden takip edin veya iptal edin.",
  "For selections above 5 GiB or of unknown size, MCLI is recommended. This ZIP will stream without buffering in memory.":
    "5 GiB'in üzerindeki veya boyutu bilinmeyen seçimler için MCLI önerilir. Bu ZIP bellekte arabelleğe alınmadan yayın yapacaktır.",
  "Set lifecycle": "Yaşam döngüsünü ayarla",
  "Set replication": "Çoğaltmayı ayarla",
  "Refresh buckets": "Kovaları yenile",
  "Close details": "Ayrıntıları kapat",
  "Copy share URL": "Paylaşım URL'sini kopyala",
  "Select multiple versions": "Birden fazla sürüm seçin",
  "Delete selected versions": "Seçilen sürümleri sil",
  "Delete non-current versions": "Güncel olmayan sürümleri silin",
  "Copy code": "Kodu kopyala",
  "Delete group": "Grubu sil",
  "Refresh list": "Listeyi yenile",
  "Copy path": "Yolu kopyala",
  "Delete user": "Kullanıcıyı sil",
  "Change password": "Şifreyi değiştir",
  "Copy {label}": "{label} kopyala",
  "Add site": "Site ekle",
  "Remove site": "Siteyi kaldır",
  "Delete selected users": "Seçilen kullanıcıları sil",
  "View All": "Tümünü Görüntüle",
  "Deployment ID:": "Dağıtım ID:",
  "Request ID:": "Talep ID:",
  "Remote host:": "Uzak ana bilgisayar:",
  "User agent:": "Kullanıcı aracısı:",
  "Backtrace:": "Geri izleme:",
  "Time:": "Zaman:",
  "API:": "API:",
  "Not available": "Mevcut değil",
  " and ": " ve ",
  "'namespace' reflects current bucket/object list and 'access' reflects a journal of object operations, defaults to 'namespace'":
    "'namespace' mevcut kova/nesne listesini, 'access' ise nesne işlemlerinin günlüğünü yansıtır; varsayılan değer 'namespace'dir",
  "{compliance} lock protects Objects from write operations by all users, including the SILO root user.":
    "{compliance} kilidi, nesneleri SILO kök kullanıcısı dahil tüm kullanıcıların yazma işlemlerinden korur.",
  "{count} days": {
    one: "{count} gün",
    other: "{count} gün",
  },
  "{count} Entities Found": "{count} Varlık Bulundu",
  "{count} Entity Found": "{count} Varlık Bulundu",
  "{count} Version": "{count} Sürüm",
  "{count} version, {size}": "{count} sürüm, {size}",
  "{count} versions": {
    one: "{count} sürüm",
    other: "{count} sürüm",
  },
  "{count} Versions": {
    one: "{count} sürüm",
    other: "{count} sürüm",
  },
  "{count} versions, {size}": "{count} sürüm, {size}",
  "{custom} policy can be written to define which accounts are authorized to access this Bucket":
    "Bu Kovaya hangi hesapların erişim yetkisine sahip olduğunu tanımlamak için {custom} politika yazılabilir",
  "{entity} not available": "{entity} mevcut değil",
  "{entity} will be available until:":
    "{entity} şu tarihe kadar mevcut olacak:",
  "{excludeFolders} options will not be available if this option is enabled.":
    "{excludeFolders} Bu seçenek etkinleştirildiğinde seçenekler kullanılamayacaktır.",
  "{file} - Versions": "{file} - Sürümler",
  "{governance} lock protects Objects from write operations by non-privileged users.":
    "{governance} kilidi, nesneleri ayrıcalıklı olmayan kullanıcıların yazma işlemlerinden korur.",
  "{label} copied to clipboard": "{label} panoya kopyalandı",
  "{minio} is a registered trademark of MinIO, Inc. {silo} is not a MinIO, Inc. product, and is not affiliated with, sponsored by, or endorsed by MinIO, Inc.":
    "{minio}, MinIO, Inc. şirketinin tescilli ticari markasıdır. {silo}, MinIO, Inc. ürünü değildir ve MinIO, Inc.'e bağlı değildir, sponsorluğunda değildir veya desteklenmemektedir.",
  "{object} Versions": "{object} Sürümleri",
  "{objectLocking} prevents objects from being deleted. Required to support retention and legal hold. Can only be enabled at bucket creation.":
    "{objectLocking}, nesnelerin silinmesini önler. Saklama ve yasal saklama için gereklidir. Yalnızca kova oluşturulurken etkinleştirilebilir.",
  "{private} policy limits access to credentialled accounts with appropriate permissions":
    "{private} politika, uygun izinlere sahip kimlik bilgilerine sahip hesaplara erişimi sınırlandırır",
  "{provider} - Add Tier Configuration":
    "{provider} - Katman Yapılandırması Ekle",
  "{public} policy anyone will be able to upload, download and delete files from this Bucket once logged in":
    "{public} politikasıyla, giriş yapan herkes bu Kovaya dosya yükleyebilir, indirebilir ve silebilir",
  "{quota} limits the amount of data in the bucket.":
    "{quota} kovadaki veri miktarını sınırlar.",
  "{retention} imposes rules to prevent object deletion for a period of time. Versioning must be enabled in order to set bucket retention policies.":
    "{retention}, nesnelerin belirli bir süre silinmesini önleyen kurallar uygular. Kova saklama politikalarını ayarlamak için sürüm oluşturma etkin olmalıdır.",
  "{service} which is {status}": "{status} durumundaki {service}",
  "{silo} is an independently maintained continuation of the {minio} object storage project, carried forward by the {pigsty} community since 2026. Its {code} {incorporates} {upstream}, and the complete work remains licensed under the {agpl}.":
    "{silo}, 2026'dan bu yana {pigsty} topluluğu tarafından yürütülen {minio} nesne depolama projesinin bağımsız olarak sürdürülen bir devamıdır. Kaynak {code}, {upstream} {incorporates} ve çalışmanın tamamı {agpl} kapsamında lisanslıdır.",
  "{target} Event Destination": "{target} Etkinlik Hedefi",
  "{time} ago": "{time} önce",
  "{type}: {name} not found.": "{type}: {name} bulunamadı.",
  "{versioning} allows to keep multiple versions of the same object under the same key.":
    "{versioning}, aynı nesnenin birden fazla sürümünü aynı anahtar altında tutmaya olanak sağlar.",
  "* Warning: With Public access anyone will be able to upload, download and delete files from this Bucket *":
    "* Uyarı: Herkese açık erişim sayesinde herkes bu Kovadaki dosyaları yükleyebilecek, indirebilecek ve silebilecek *",
  "# Associated Access Keys": "# İlişkili Erişim Anahtarları",
  "© 2026 Ruohang Feng / PGSTY and the SILO contributors.":
    "© 2026 Ruohang Feng / PGSTY ve SILO katkıda bulunanlar.",
  "<Day>": "<Gün>",
  "<Month>": "<Ay>",
  "<Year>": "<Yıl>",
  "A bucket can only be deleted if it's empty.":
    "Bir kova yalnızca boşsa silinebilir.",
  "A group can have one attached IAM policy, where all users with membership in that group inherit that policy. Groups support more simplified management of user permissions on the SILO Tenant.":
    "Bir gruba, o gruba üye olan tüm kullanıcıların bu politikayı devraldığı bir IAM politikası eklenebilir. Gruplar, SILO Kiracıdaki kullanıcı izinlerinin daha basitleştirilmiş yönetimini destekler.",
  "A network error occurred.": "Bir ağ hatası oluştu.",
  "A new {entity} has been created with the following details:":
    "Aşağıdaki ayrıntılarla yeni bir {entity} oluşturuldu:",
  "A SILO user consists of a unique access key (username) and corresponding secret key (password). Clients must authenticate their identity by specifying both a valid access key (username) and the corresponding secret key (password) of an existing SILO user.":
    "Bir SILO kullanıcısı, benzersiz bir erişim anahtarından (kullanıcı adı) ve buna karşılık gelen gizli anahtardan (şifre) oluşur. İstemciler, mevcut bir SILO kullanıcısının hem geçerli bir erişim anahtarını (kullanıcı adı) hem de karşılık gelen gizli anahtarını (şifre) belirterek kimliklerini doğrulamalıdır.",
  "A user can be a member of multiple groups.":
    "Bir kullanıcı birden fazla gruba üye olabilir.",
  "About Site Replication": "Site Çoğaltma Hakkında",
  Access: "Erişim",
  "Access Audit": "Erişim Denetimi",
  "Access Key": "Erişim Anahtarı",
  "Access Key and Secret Key should be same on the new site/endpoint.":
    "Yeni sitede/uç noktada Erişim Anahtarı ve Gizli Anahtar aynı olmalıdır.",
  "Access Key Policy": "Erişim Anahtarı Politikası",
  "Access Key details - {name}": "Erişim Anahtarı ayrıntıları - {name}",
  "Access keys deleted successfully.": "Erişim anahtarları başarıyla silindi.",
  "Access Keys deleted successfully.": "Erişim Anahtarları başarıyla silindi.",
  "Access Keys inherit the policies explicitly attached to the parent user, and the policies attached to each group in which the parent user has membership.":
    "Erişim Anahtarları, ana kullanıcıya açıkça eklenen politikaları ve ana kullanıcının üyeliğinin olduğu her gruba eklenen politikaları devralır.",
  "Access Keys support programmatic access by applications. You cannot use a Access Key to log into the SILO Console.":
    "Erişim anahtarları, uygulamaların program aracılığıyla erişmesini sağlar. SILO Konsolunda oturum açmak için bu erişim anahtarları kullanılamaz.",
  "Access Policy": "Erişim Politikası",
  "Access Policy:": "Erişim Politikası:",
  "Access Rule added successfully": "Erişim Kuralı başarıyla eklendi",
  "Access Rules": "Erişim Kuralları",
  "AccessKey is required": "AccessKey gereklidir",
  "Account Key": "Hesap Anahtarı",
  "Account Name": "Hesap Adı",
  Active: "Aktif",
  "Active for": "Aktif kalma süresi",
  'AD/LDAP server address e.g. "myldapserver.com:636"':
    'AD/LDAP sunucu adresi ör. "myldapserver.com:636"',
  "Add a Row": "Satır Ekle",
  "Add Access Rule": "Erişim Kuralı Ekle",
  "Add Anonymous Access Rule": "Anonim Erişim Kuralı Ekle",
  "Add Bucket Replication Rule - {bucket}":
    "Kova Çoğaltma Kuralı Ekle - {bucket}",
  "Add Event Destination": "Etkinlik Hedefi Ekle",
  "Add key": "Anahtar ekle",
  "Add Lifecycle Rule": "Yaşam Döngüsü Kuralı Ekle",
  "Add Members": "Üye Ekle",
  "Add New Tag": "Yeni Etiket Ekle",
  "Add New Tag ": "Yeni Etiket Ekle",
  "Add new Webhook": "Yeni Webhook ekle",
  "Add Replication Rule": "Çoğaltma Kuralı Ekle",
  "Add Replication Site": "Çoğaltma Sitesi Ekle",
  "Add Replication Sites": "Çoğaltma Siteleri Ekle",
  "Add Sites": "Site Ekle",
  "Add Sites for Replication": "Çoğaltma için Site Ekle",
  "Add tag": "Etiket ekle",
  "Add Tier": "Katman Ekle",
  "Add to Group": "Gruba Ekle",
  "Add to Groups": "Gruplara Ekle",
  "Add Users to Group": "Kullanıcıları Gruba Ekle",
  "add users to groups": "kullanıcıları gruplara ekleyin",
  "Adding groups lets you assign IAM policies to multiple users at once.":
    "Grup eklemek, aynı anda birden fazla kullanıcıya IAM politikası atamanıza olanak tanır.",
  Address: "Adres",
  After: "Sonra",
  All: "Hepsi",
  "All Log Types": "Tüm Günlük Türleri",
  "All Nodes": "Tüm Düğümler",
  "All sites must be using the same external IDP(s) if any.":
    "Tüm siteler, varsa aynı harici IDP(leri) kullanıyor olmalıdır.",
  "All sites must have the same deployment credentials (i.e. MINIO_ROOT_USER, MINIO_ROOT_PASSWORD).":
    "Tüm siteler aynı dağıtım kimlik bilgilerine sahip olmalıdır (ör. MINIO_ROOT_USER, MINIO_ROOT_PASSWORD).",
  "All User Agents": "Tüm Kullanıcı Aracıları",
  "Amazon Resource Name": "Amazon Kaynak Adı",
  "AMQP exchange type": "AMQP değişim türü",
  "AMQP server endpoint e.g. `amqp://myuser:mypassword@localhost:5672`":
    "AMQP sunucu uç noktası ör. `amqp://myuser:mypassword@localhost:5672`",
  "An error occurred": "Bir hata oluştu",
  "An error occurred while getting the Health Report file.":
    "Sağlık Raporu dosyası alınırken hata oluştu.",
  "An error occurred while uploading the file.":
    "Dosya yüklenirken bir hata oluştu.",
  "An error occurred while uploading the files.":
    "Dosyalar yüklenirken bir hata oluştu.",
  "An unknown error occurred. Please refer to Console logs to get more information.":
    "Bilinmeyen bir hata oluştu. Daha fazla bilgi almak için lütfen Konsol günlüklerine bakın.",
  Anonymous: "Anonim",
  "Anonymous Access": "Anonim Erişim",
  "API Name": "API Adı",
  "API Requests": "API İstekleri",
  Application: "Uygulama",
  "apply policies to Groups": "Gruplara politika uygulama",
  April: "Nisan",
  "Are you sure you want to continue?":
    "Devam etmek istediğinizden emin misiniz?",
  "Are you sure you want to delete Access Key {name}?":
    "{name} Erişim Anahtarını silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete all the non-current versions for: {object}?":
    "Şunun güncel olmayan tüm sürümlerini silmek istediğinizden emin misiniz: {object}?",
  "Are you sure you want to delete bucket {bucket}?":
    "{bucket} numaralı kovayı silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete IDP {name} configuration?":
    "IDP {name} yapılandırmasını silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete policy {name}?":
    "Politikayı {name} silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete replication rule {rule}?":
    "Çoğaltma kuralını {rule} silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete the {rule} rule?":
    "{rule} kuralını silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete the Configured Endpoint {name}?":
    "Yapılandırılmış Uç Noktayı {name} silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete the event destination ?":
    "Etkinlik hedefini silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete the following {count} groups?":
    "Aşağıdaki {count} grubu silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete the following {count} users?":
    "Aşağıdaki {count} kullanıcıyı silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete the following group?":
    "Aşağıdaki grubu silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete the following user?":
    "Aşağıdaki kullanıcıyı silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete the selected {count} Access Keys?":
    "Seçilen {count} Erişim Anahtarını silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete the selected {count} objects?":
    "Seçilen {count} nesneyi silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete the selected {count} versions for {object}?":
    "{object} için seçilen {count} sürümü silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete the tag {tag} ?":
    "{tag} etiketini silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete the tag {tag}?":
    "{tag} etiketini silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete the tier {name}?":
    "{name} katmanını silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete this access rule?":
    "Bu erişim kuralını silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete this event?":
    "Bu etkinliği silmek istediğinizden emin misiniz?",
  "Are you sure you want to delete:": "Silmek istediğinizden emin misiniz:",
  "Are you sure you want to remove all the replication sites?.":
    "Tüm çoğaltma sitelerini kaldırmak istediğinizden emin misiniz?",
  "Are you sure you want to remove the replication site: {name}?":
    "Çoğaltma sitesini kaldırmak istediğinizden emin misiniz: {name}?",
  "Are you sure you want to remove the selected replication rules for bucket {bucket}?":
    "{bucket} numaralı kova için seçilen çoğaltma kurallarını kaldırmak istediğinizden emin misiniz?",
  "Are you sure you want to reset the Default {name}?":
    "Varsayılan {name} öğesini sıfırlamak istediğinizden emin misiniz?",
  "Are you sure you want to restore {object} with Version ID: {version}?":
    "{object} nesnesini {version} Sürüm ID'si ile geri yüklemek istediğinizden emin misiniz?",
  "Are you sure you want to restore these configurations to default values?":
    "Bu yapılandırmaları varsayılan değerlere geri yüklemek istediğinizden emin misiniz?",
  "Assign Access Policies": "Erişim Politikalarını Atayın",
  "Assign Custom Credentials": "Özel Kimlik Bilgilerini Ata",
  "Assign Custom IAM Policies for Group":
    "Grup için Özel IAM Politikaları Atayın",
  "Assign groups": "Grupları ata",
  "Assign Groups": "Grupları Ata",
  "assign policies": "politikaları atama",
  "assign Policies": "Politikaları atama",
  "Assign Policies": "Politikaları Ata",
  "Assign Policy": "Politika Ata",
  "Assign Users": "Kullanıcıları Ata",
  Asynchronous: "Asenkron",
  "Audit Kafka": "Denetim Kafka",
  "Audit Webhook": "Denetim Webhook",
  August: "Ağustos",
  "Auth Token": "Kimlik Doğrulama Jetonu",
  "Auto delete queue when set to 'on', when there are no consumers":
    "Tüketici olmadığında 'on' olarak ayarlanırsa kuyruğu otomatik sil",
  "Auto Deleted": "Otomatik Silindi",
  "Available Capacity": "Mevcut Kapasite",
  Back: "Geri",
  Backend: "Arka uç",
  Bandwidth: "Bant Genişliği",
  "Enter a non-negative bandwidth below 8 PiB/s, with at most two decimals (0 means unlimited).":
    "En fazla iki ondalık rakamla (0, sınırsız anlamına gelir) 8 PiB/s'nin altında negatif olmayan bir bant genişliği girin.",
  "Bitrot Scan": "Bitrot Taraması",
  Brokers: "Broker'lar",
  "Browse Bucket": "Kovaya Göz At",
  Bucket: "Kova",
  "Bucket Assignments": "Kova Atamaları",
  "Bucket Encryption configuration": "Kova şifreleme yapılandırması",
  "Bucket lifecycle (ILM) configuration":
    "Kova yaşam döngüsü (ILM) yapılandırması",
  "Bucket Name": "Kova Adı",
  "Bucket names can consist only of lowercase letters, numbers, dots (.), and hyphens (-).":
    "Kova adları yalnızca küçük harflerden, rakamlardan, noktalardan (.) ve kısa çizgilerden (-) oluşabilir.",
  "Bucket names must be between 3 (min) and 63 (max) characters long.":
    "Kova adları 3 (min) ile 63 (maks) karakter uzunluğunda olmalıdır.",
  "Bucket names must be unique within a partition.":
    "Bir bölüm içindeki kova adları benzersiz olmalıdır.",
  "Bucket names must not be formatted as an IP address (for example, 192.168.5.4).":
    "Kova adları IP adresi olarak biçimlendirilmemelidir (örneğin 192.168.5.4).",
  "Bucket names must not contain two adjacent periods, or a period adjacent to a hyphen.":
    "Kova adları iki bitişik nokta veya kısa çizginin yanında nokta içermemelidir.",
  "Bucket names must not end with the suffix -s3alias. This suffix is reserved for access point alias names.":
    "Kova adları -s3alias sonekiyle bitmemelidir. Bu sonek, erişim noktası takma adları için ayrılmıştır.",
  "Bucket names must not start with the prefix xn--.":
    "Kova adları xn-- önekiyle başlamamalıdır.",
  "Bucket notification configuration": "Kova bildirimi yapılandırması",
  "bucket notifications": "kova bildirimleri",
  "Bucket Object-Lock configurations": "Kova nesne kilidi yapılandırması",
  "Bucket Policies": "Kova İlkeleri",
  "Bucket Replication Configuration": "Kova Çoğaltma Yapılandırması",
  "Bucket Tags": "Kova Etiketleri",
  "bucket-default": "kova varsayılanı",
  "Buckets Results": "Kova Sonuçları",
  "Buckets:": "Kovalar:",
  "Bypass Governance Mode": "Yönetişim Modunu Atla",
  Bytes: "Bayt",
  "Calls to Trace": "İzlemeye Çağrılar",
  Cancelled: "İptal edildi",
  "Cannot delete currently logged in user": "Oturum açmış kullanıcı silinemez",
  "Cannot delete currently logged in user {user}":
    "Oturum açmış kullanıcı {user} silinemez",
  "Cert Authority": "Sertifika Yetkilisi",
  "Change Access Policy": "Erişim Politikasını Değiştir",
  "Change Legal Hold rules for this File":
    "Bu dosyanın yasal saklama kurallarını değiştir",
  "Change Password": "Şifreyi Değiştir",
  "Change Password for {user}": "{user} Şifresini Değiştir",
  "Change password for: {user}": "Şunun için şifreyi değiştir: {user}",
  "Change Retention rules for this File":
    "Bu Dosya için Saklama kurallarını değiştirin",
  "Change Tags for this File": "Bu Dosyanın Etiketlerini Değiştir",
  "Change User Password": "Kullanıcı Şifresini Değiştir",
  "Changes to Bucket features such as":
    "Şu kova özelliklerindeki değişiklikler",
  "Choose or create a new path": "Yeni bir yol seçin veya oluşturun",
  "Claim from which SILO will read the policy or role to use":
    "SILO'nun kullanılacak politikayı veya rolü okuyacağı talep (claim)",
  "Claim Name": "Talep Adı",
  "Claim Prefix": "Talep Öneki",
  "Claim User Info": "Kullanıcı Bilgisi Claim'i",
  Clear: "Temizle",
  "Click on a user to view the full listing of associated Access Keys. All Access Keys associated with a user will be deleted along with the user.":
    "İlgili Erişim Anahtarlarının tam listesini görüntülemek için bir kullanıcıya tıklayın. Bir kullanıcıyla ilişkili tüm Erişim Anahtarları kullanıcıyla birlikte silinecektir.",
  client: "istemci",
  "Client Auth determines the Kafka server's policy for TLS client authorization":
    "İstemci Kimlik Doğrulaması, Kafka sunucunun TLS istemci yetkilendirme politikasını belirler",
  "Client Cert": "İstemci Sertifikası",
  "Client cert for mTLS authentication":
    "mTLS kimlik doğrulaması için istemci sertifikası",
  "Client cert for NATS mTLS auth":
    "NATS mTLS kimlik doğrulaması için istemci sertifikası",
  "Client Cert Key": "İstemci Sertifika Anahtarı",
  "Client cert key for mTLS authentication":
    "mTLS kimlik doğrulaması için istemci sertifikası anahtarı",
  "Client cert key for NATS mTLS authorization":
    "NATS mTLS yetkilendirmesi için istemci sertifikası anahtarı",
  "Client ID is required": "İstemci ID gereklidir",
  "Client Key": "İstemci Anahtarı",
  "Client ping commands interval in s,m,h,d. Disabled by default":
    "İstemci ping komutlarının aralığı s,m,h,d cinsindendir. Varsayılan olarak devre dışı",
  "Client Secret is required": "İstemci Gizli Anahtarı gereklidir",
  "Client Secret must be re-entered to change OpenID configurations":
    "OpenID yapılandırmalarını değiştirmek için İstemci Gizli Anahtarı yeniden girilmelidir",
  "client TLS cert": "istemci TLS sertifikası",
  "client TLS key": "istemci TLS anahtarı",
  "ClientAuth determines the Kafka server's policy for TLS client authorization":
    "ClientAuth, Kafka sunucunun TLS istemci yetkilendirme politikasını belirler",
  "Cluster Health Report will be generated, you will be able to download the JSON File.":
    "Küme Sağlık Raporu oluşturulacak, JSON Dosyasını indirebileceksiniz.",
  code: "kodu",
  "Comma separated list of Kafka broker addresses":
    "Kafka komisyoncu adreslerinin virgülle ayrılmış listesi",
  Comment: "Yorum",
  Comments: "Yorumlar",
  Compliance: "Uyumluluk",
  Compression: "Sıkıştırma",
  "Concurrent:": "Eşzamanlı:",
  Config: "Yapılandırma",
  "Config Name is required": "Yapılandırma Adı gerekli",
  "Config URL": "Yapılandırma URL",
  "Config URL for identity provider configuration":
    "Kimlik sağlayıcı yapılandırması için yapılandırma URL",
  "Config URL is required": "Yapılandırma URL gerekli",
  "Configuration cannot be disabled / enabled in this module as LDAP environment variables are set for this SILO instance.":
    "Bu SILO örneği için LDAP ortam değişkenleri ayarlandığından, bu modülde yapılandırma devre dışı bırakılamaz / etkinleştirilemez.",
  "Configuration cannot be disabled / enabled in this module as OpenID environment variables are set for this SILO instance.":
    "Bu SILO örneği için OpenID ortam değişkenleri ayarlandığından, yapılandırma bu modülde devre dışı bırakılamaz / etkinleştirilemez.",
  "Configuration cannot be edited in this module as LDAP environment variables are set for this SILO instance.":
    "Bu SILO örneği için LDAP ortam değişkenleri ayarlandığından konfigürasyon bu modülde düzenlenemez.",
  "Configuration cannot be edited in this module as OpenID environment variables are set for this SILO instance.":
    "Bu SILO örneği için OpenID ortam değişkenleri ayarlandığından konfigürasyon bu modülde düzenlenemez.",
  "Configuration saved successfully": "Yapılandırma başarıyla kaydedildi",
  "Configure a {remoteTier} to receive transitioned Objects":
    "Geçişi yapılan Nesneleri almak için bir {remoteTier} yapılandırın",
  "Configure Bucket": "Kovayı Yapılandır",
  "Configuring an external IDP enables Single-Sign On workflows, where applications authenticate against the external IDP before accessing SILO.":
    "Harici bir IDP yapılandırmak, uygulamaların SILO'ya erişmeden önce harici IDP'ye göre kimlik doğrulaması yaptığı Tek Oturum Açma iş akışlarını etkinleştirir.",
  "Confirm Dialogs": "İletişim Kutularını Onayla",
  "connected server": "bağlı sunucu",
  "Connection String": "Bağlantı Dizesi",
  "Console Credentials": "Konsol Kimlik Bilgileri",
  "Console LICENSE": "Konsol LICENSE",
  "Console portions © Georg Mangold and contributors.":
    "Konsol bölümleri © Georg Mangold ve katkıda bulunanlar.",
  "Console predecessor": "Konsol öncülü",
  "Copy to Clipboard": "Panoya Kopyala",
  Copyright: "Telif Hakkı",
  "Coredns Path": "Coredns Yolu",
  "Cors Allow Origin": "Cors Menşee İzin Ver",
  "Could not process drag and drop.":
    "Sürükle ve bırak işlemi gerçekleştirilemedi.",
  "CPU Info": "CPU Bilgi",
  "Create {idpType} configuration": "{idpType} yapılandırması oluşturun",
  "create a bucket": "bir kova oluştur",
  "Create a new cryptographic key in the Key Management Service server connected to SILO.":
    "SILO'ya bağlı Anahtar Yönetim Hizmeti sunucusunda yeni bir şifreleme anahtarı oluşturun.",
  "create a new path": "yeni bir yol oluştur",
  "create a Policy": "Politika oluştur",
  "Create access key": "Erişim anahtarı oluştur",
  "Create Access Key": "Erişim Anahtarı Oluştur",
  "Create Access Key for {user}": "{user} için Erişim Anahtarı Oluşturun",
  "Create Access Keys": "Erişim Anahtarları Oluşturun",
  "Create Configuration": "Yapılandırma Oluştur",
  "Create Configurations": "Konfigürasyonlar Oluşturun",
  "Create Group": "Grup Oluştur",
  "Create Key": "Anahtar Oluştur",
  "Create new path": "Yeni yol oluştur",
  "Create OpenID Configuration": "OpenID Yapılandırması Oluştur",
  "Create Policies": "Politika Oluşturma",
  "Create Policy": "Politika Oluştur",
  "Create Rules": "Kural Oluştur",
  "Create Tier": "Katman Oluştur",
  "Create User": "Kullanıcı Oluştur",
  "create users": "kullanıcı oluştur",
  "Create Users": "Kullanıcı Oluştur",
  "Created At": "Oluşturulma Tarihi",
  "Created By": "Oluşturan",
  "Creation and deletion of all IAM users, groups, policies and their mappings to users or groups":
    "Tüm IAM kullanıcılarının, gruplarının ve ilkelerinin oluşturulması ve silinmesi; ilkelerin kullanıcılara veya gruplara atanması",
  "Creation and deletion of buckets and objects":
    "Kovaların ve nesnelerin oluşturulması ve silinmesi",
  "Creation and deletion of service accounts (except those owned by the root user)":
    "Hizmet hesaplarının oluşturulması ve silinmesi (root kullanıcıya ait olanlar hariç)",
  "Creation of STS credentials": "STS kimlik bilgilerinin oluşturulması",
  Credentials: "Kimlik Bilgileri",
  current: "güncel",
  Current: "Güncel",
  "Current Endpoint:": "Mevcut Bitiş Noktası:",
  "Current Password": "Mevcut Şifre",
  "Current Path:": "Mevcut Yol:",
  "Current Policy": "Mevcut Politika",
  "Current Status": "Mevcut Durum",
  "Current Status:": "Mevcut Durum:",
  "Current Tags:": "Güncel Etiketler:",
  "Current User Policy - edit the JSON to remove permissions for this Access Key":
    "Mevcut Kullanıcı Politikası - bu Erişim Anahtarının izinlerini kaldırmak için JSON öğesini düzenleyin",
  "Current Version": "Güncel Sürüm",
  "CURRENT VERSION": "GÜNCEL SÜRÜM",
  "Currently Configured Endpoints": "Halihazırda Yapılandırılmış Uç Noktalar",
  custom: "özel",
  Custom: "Özel",
  Cycle: "Döngü",
  Database: "Veritabanı",
  Date: "Tarih",
  day: "gün",
  days: {
    one: "gün",
    other: "gün",
  },
  Days: "Günler",
  "DB table name to store/update events, table is auto-created":
    "DB olayları saklamak/güncellemek için tablo adı, tablo otomatik olarak oluşturulur",
  December: "Aralık",
  Default: "Varsayılan",
  "Default Key ID:": "Varsayılan Anahtar ID:",
  "Define which actions are permitted on a specified resource.":
    "Belirli bir kaynakta hangi eylemlere izin verildiğini tanımlayın.",
  "Delay Multiplier": "Gecikme Çarpanı",
  "DELETE - Object Deleted": "DELETE - Nesne Silindi",
  "Delete {name}": "{name} öğesini sil",
  "Delete Access Key": "Erişim Anahtarını Sil",
  "Delete Access Keys": "Erişim Anahtarlarını Sil",
  "Delete All": "Tümünü Sil",
  "Delete All Versions": "Tüm Sürümleri Sil",
  "Delete Anonymous Access Rule": "Anonim Erişim Kuralını Sil",
  "Delete Bucket": "Kovayı Sil",
  "Delete Configuration": "Yapılandırmayı Sil",
  "Delete Endpoint": "Bitiş Noktasını Sil",
  "Delete Event": "Etkinliği Sil",
  "Delete Group": "Grubu Sil",
  "delete Groups": "Grupları sil",
  "Delete Groups": "Grupları Sil",
  "Delete Lifecycle Rule": "Yaşam Döngüsü Kuralını Sil",
  "Delete Marker": "Silme İşaretçisi",
  "Delete Non-Current versions": "Güncel Olmayan Sürümleri Sil",
  "Delete Object": "Nesneyi Sil",
  "Delete Objects": "Nesneleri Sil",
  "delete Policies": "Politikaları sil",
  "Delete Policy": "Politikayı Sil",
  "Delete Replication Rule": "Çoğaltma Kuralını Sil",
  "Delete Replication Site": "Çoğaltma Sitesini Sil",
  "Delete Selected": "Seçileni Sil",
  "Delete Selected Files": "Seçilen Dosyaları Sil",
  "Delete Selected Replication Rules": "Seçilen Çoğaltma Kurallarını Sil",
  "Delete Selected Versions": "Seçilen Sürümleri Sil",
  "Delete Site": "Siteyi Sil",
  "Delete Tag": "Etiketi Sil",
  "Delete Tier": "Katmanı Sil",
  "delete user": "kullanıcıyı sil",
  "Delete User": "Kullanıcıyı Sil",
  "delete users": "kullanıcıları sil",
  "Delete Users": "Kullanıcıları Sil",
  "Delete version": "Sürümü sil",
  "Delete Webhook": "Webhook'u Sil",
  Deleted: "Silindi",
  DELETED: "SİLİNDİ",
  Deletes: "Silmeler",
  "Delivery Mode": "Teslimat Modu",
  Description: "Açıklama",
  Destination: "Hedef",
  "Detailed Results:": "Ayrıntılı Sonuçlar:",
  Disable: "Devre Dışı Bırak",
  "Disable LDAP": "LDAP'ı Devre Dışı Bırak",
  "Disable SSL certificate verification ":
    "SSL sertifika doğrulamasını devre dışı bırakın",
  "disable users": "kullanıcıları devre dışı bırak",
  Disabled: "Devre Dışı",
  "Display Name": "Görünen Ad",
  "Display Object Versions": "Nesne Sürümlerini Görüntüle",
  "Display only Errors": "Yalnızca Hataları Göster",
  "Display Versions for this file": "Bu dosyanın Sürümlerini Görüntüle",
  "No object versions are available": "Hiçbir nesne sürümü mevcut değil",
  "Distributed Mode": "Dağıtılmış Mod",
  "DN (Distinguished Name) for LDAP read-only service account used to perform DN and group lookups":
    "DN (Ayırt Edici Ad), DN ve grup aramalarını gerçekleştirmek için kullanılan LDAP salt okunur hizmet hesabı için",
  documentation: "belgeler",
  Done: "Bitti",
  "Download all access credentials": "Tüm erişim bilgilerini indirin",
  "Download all access credentials to a JSON file. NOTE: This file is not formatted for import using mc alias import. If you plan to import this alias from the file, please use the Download for Import button. ":
    "Tüm erişim kimlik bilgilerini bir JSON dosyasına indirin. NOT: Bu dosya, mc alias import kullanılarak içe aktarma için biçimlendirilmemiştir. Bu takma adı dosyadan içe aktarmayı planlıyorsanız lütfen İçe Aktarma İçin İndir düğmesini kullanın.",
  "Download as CSV": "CSV olarak indir",
  "Download as PNG": "PNG olarak indir",
  "Download credentials in a JSON file formatted for import using mc alias import. This will only include the default login credentials.":
    "Kimlik bilgilerini, mc alias import komutuyla içe aktarma için biçimlendirilmiş bir JSON dosyasında indirin. Bu yalnızca varsayılan oturum açma kimlik bilgilerini içerecektir.",
  "Download File": "Dosyayı İndir",
  "Download for import": "İçe aktarmak için indirin",
  "Download JSON": "JSON İndir",
  "Download of multiple files failed.":
    "Birden fazla dosyanın indirilmesi başarısız oldu.",
  "Download Results": "Sonuçları İndir",
  "Download Selected": "Seçileni İndir",
  "Download selected objects as Zip. Any Deleted objects in the selection would be skipped from download.":
    "Seçilen nesneleri Zip olarak indirin. Seçimdeki tüm Silinen nesneler indirme işleminden atlanır.",
  "Download this Object": "Bu Nesneyi İndir",
  "Download this version": "Bu sürümü indirin",
  "Download widget data": "Widget verilerini indirin",
  "Downloads / Uploads": "İndirilenler / Yüklenenler",
  "Drives Partitions Info": "Sürücü Bölümleri Bilgisi",
  "Drives:": "Sürücüler:",
  "DSN String": "DSN Dize",
  Durable: "Dayanıklı",
  Duration: "Süre",
  "During the speed test all your production traffic will be temporarily suspended.":
    "Hız testi sırasında tüm üretim trafiğiniz geçici olarak durdurulacaktır.",
  "e.g. 503": "ör. 503",
  "e.g. FunctionName2055": "ör. İşlevAdı2055",
  "e.g. Method 2056": "ör. Yöntem 2056",
  "e.g. my-bucket/my-prefix/*": "ör. my-bucket/my-prefix/*",
  "e.g. us-west-rack-2": "ör. us-west-rack-2",
  "Each user can access only those resources and operations which are explicitly granted by the built-in role. SILO denies access to any other resource or action by default.":
    "Her kullanıcı yalnızca yerleşik rol tarafından açıkça verilen kaynaklara ve işlemlere erişebilir. SILO varsayılan olarak başka herhangi bir kaynağa veya eyleme erişimi reddeder.",
  Edit: "Düzenle",
  "edit a Policy": "Politikayı düzenleme",
  "Edit Anonymous Access Rule for {target}":
    "{target} için Anonim Erişim Kuralını Düzenle",
  "Edit Audit Webhook": "Denetim Webhook'unu Düzenle",
  "Edit Bucket Replication": "Kova Çoğaltmasını Düzenle",
  "Edit Configuration": "Yapılandırmayı Düzenle",
  "Edit details of - {name}": "Ayrıntıları düzenle - {name}",
  "Edit Endpoint": "Bitiş Noktasını Düzenle",
  "edit Group membership": "Grup üyeliğini düzenle",
  "Edit Lifecycle Configuration": "Yaşam Döngüsü Yapılandırmasını Düzenle",
  "Edit Logger Webhook": "Günlük Webhook'unu Düzenle",
  "Edit Members": "Üyeleri Düzenle",
  "Edit Replication Endpoint": "Çoğaltma Uç Noktasını Düzenle",
  "Edit Tags": "Etiketleri Düzenle",
  "Edit the Default Audit Webhook": "Varsayılan Denetim Webhook'unu Düzenle",
  "Edit the Default Logger Webhook": "Varsayılan Günlük Webhook'unu Düzenle",
  "Edit Webhook": "Webhook'u Düzenle",
  "Effect:": "Etkisi:",
  "Elasticsearch index to store/update events, index is auto-created":
    "Elasticsearch olayları saklamak/güncellemek için dizin, dizin otomatik olarak oluşturulur",
  "Elasticsearch server's address, with optional authentication info":
    "Elasticsearch sunucunun adresi, isteğe bağlı kimlik doğrulama bilgileriyle birlikte",
  Enable: "Etkinleştir",
  "Enable audit_kafka target": "Audit_kafka hedefini etkinleştir",
  "Enable Bucket Encryption": "Kova Şifrelemesini Etkinleştir",
  "Enable Bucket Quota": "Kova Kotasını Etkinleştir",
  "Enable LDAP": "LDAP'ı Etkinleştir",
  "enable or disable Groups": "Grupları etkinleştirin veya devre dışı bırakın",
  "enable or disable users":
    "kullanıcıları etkinleştirin veya devre dışı bırakın",
  "Enable SASL (Simple Authentication and Security Layer) authentication":
    "SASL (Basit Kimlik Doğrulama ve Güvenlik Katmanı) kimlik doğrulamasını etkinleştirin",
  "Enable TLS (Transport Layer Security)":
    "TLS'yi etkinleştir (Aktarım Katmanı Güvenliği)",
  "enable users": "kullanıcıları etkinleştir",
  "Enable your preferred options to get filtered records.":
    "Filtrelenmiş kayıtları almak için tercih ettiğiniz seçenekleri etkinleştirin.",
  Enabled: "Etkin",
  Encrypt: "Şifrele",
  "Encryption Key": "Şifreleme Anahtarı",
  "Encryption Type": "Şifreleme Türü",
  "Encryption:": "Şifreleme:",
  "End Time:": "Bitiş Zamanı:",
  Endpoint: "Uç Nokta",
  endpoints: "uç noktalar",
  Endpoints: "Uç noktalar",
  "Enter '/' to apply the rule to all prefixes and objects at the bucket root. Do not include the wildcard asterisk '*' as part of the prefix *unless* it is an explicit part of the prefix name. The Console automatically appends an asterisk to the appropriate sections of the resulting IAM policy.":
    "Kuralı kova kökündeki tüm öneklere ve nesnelere uygulamak için '/' girin. *Önek adının açık bir parçası olmadığı sürece* önekin bir parçası olarak '*' joker yıldız karakterini eklemeyin. Konsol, ortaya çıkan IAM politikasının uygun bölümlerine otomatik olarak bir yıldız işareti ekler.",
  "Enter a comment": "Yorum girin",
  "Enter a description": "Açıklama girin",
  "Enter a Mime Type": "MIME türü girin",
  "Enter a name": "Ad girin",
  "Enter Access Key": "Erişim anahtarı girin",
  "Enter Account Key": "Hesap anahtarı girin",
  "Enter Account Name": "Hesap adı girin",
  "Enter Address": "Adres girin",
  "Enter allowed origin e.g. https://example.com":
    "İzin verilen menşei girin ör. https://example.com",
  "Enter an Extension": "Uzantı girin",
  "Enter Auth Token": "Yetki jetonu girin",
  "Enter auth_token": "auth_token girin",
  "Enter Brokers": "Aracıları girin",
  "Enter Bucket": "Kova girin",
  "Enter Cert Authority": "Sertifika yetkilisi girin",
  "Enter Claim Name": "Talep adı girin",
  "Enter Claim Prefix": "Talep öneki girin",
  "Enter Client Cert": "İstemci sertifikası girin",
  "Enter Client Cert Key": "İstemci sertifika anahtarı girin",
  "Enter Client ID": "İstemci ID girin",
  "Enter Client Key": "İstemci anahtarı girin",
  "Enter Client Secret": "İstemci gizli anahtarı girin",
  "Enter Coredns Path": "CoreDNS yolu girin",
  "Enter custom notes if any": "Varsa özel notları girin",
  "Enter Cycle": "Döngü girin",
  "Enter DB Name": "DB adı girin",
  "Enter Delay": "Gecikme girin",
  "Enter Delivery Mode": "Teslimat modu girin",
  "Enter Destination Identifier": "Hedef tanımlayıcı girin",
  "Enter Display Name": "Görünen ad girin",
  "Enter DSN String": "DSN dizesi girin",
  "Enter Endpoint": "Uç nokta girin",
  "Enter Exchange": "Exchange girin",
  "Enter Exchange Type": "Exchange türü girin",
  "Enter Format": "Biçim girin",
  "Enter Host": "Ana bilgisayar girin",
  "Enter Index": "Dizin girin",
  "Enter Kafka Broker": "Kafka aracısı girin",
  "Enter Kafka Topic": "Kafka konusu girin",
  "Enter Kafka Version": "Kafka sürümü girin",
  "Enter Keep Alive Interval": "Canlı tutma aralığı girin",
  "Enter Key": "Anahtar girin",
  "Enter Max IO": "Maks. IO girin",
  "Enter Max Sleep Duration": "Maks. bekleme süresi girin",
  "Enter Max Wait": "Maks. bekleme girin",
  "Enter Name (Eg. REMOTE-TIER)": "Ad girin (Örn. REMOTE-TIER)",
  "Enter NATS password": "NATS şifresi girin",
  "Enter NATS Subject": "NATS konusu girin",
  "Enter NATS token": "NATS jetonu girin",
  "Enter NATS Username": "NATS kullanıcı adı girin",
  "Enter New Tag Key": "Yeni etiket anahtarı girin",
  "Enter New Tag Label": "Yeni etiket değeri girin",
  "Enter nsqd_address": "nsqd_address girin",
  "Enter Password": "Şifre girin",
  "Enter Path Prefix": "Yol öneki girin",
  "Enter Ping Interval": "Ping aralığı girin",
  "Enter Port": "Port girin",
  "Enter Prefix": "Önek girin",
  "Enter QOS": "QOS girin",
  "Enter Queue Dir": "Kuyruk dizini girin",
  "Enter Queue Directory": "Kuyruk dizini girin",
  "Enter Queue Limit": "Kuyruk sınırı girin",
  "Enter Reconnect Interval": "Yeniden bağlanma aralığı girin",
  "Enter Replication Failed Workers": "Başarısız çoğaltma çalışanı girin",
  "Enter Replication Workers": "Çoğaltma çalışanı girin",
  "Enter Requests Max": "Maks. istek girin",
  "Enter Routing Key": "Yönlendirme anahtarı girin",
  "Enter SASL Mechanism": "SASL mekanizması girin",
  "Enter SASL Password": "SASL şifresi girin",
  "Enter SASL Username": "SASL kullanıcı adı girin",
  "Enter Secret Key": "Gizli anahtar girin",
  "Enter SSL Mode": "SSL modu girin",
  "Enter Storage Class": "Depolama sınıfı girin",
  "Enter Streaming Cluster ID": "Yayın kümesi ID girin",
  "Enter Streaming in flight value": "Devam eden akış değeri girin",
  "Enter Table Name": "Tablo adı girin",
  "Enter Tag Key": "Etiket anahtarı girin",
  "Enter Tag Label": "Etiket değeri girin",
  "Enter the new Folder Path": "Yeni klasör yolu girin",
  "Enter TLS Client Auth": "TLS istemci doğrulaması girin",
  "Enter TLS Client Cert": "TLS istemci sertifikası girin",
  "Enter TLS Client Key": "TLS istemci anahtarı girin",
  "Enter Topic": "Konu girin",
  "Enter URL": "URL girin",
  "Enter User": "Kullanıcı girin",
  "Enter Username": "Kullanıcı adı girin",
  Entities: "Varlıklar",
  "Erasure Health": "Silme Kodlaması Sağlığı",
  Error: "Hata",
  "Error - File size too large": "Hata - Dosya boyutu çok büyük",
  "Error retrieving access keys": "Erişim anahtarları alınırken hata oluştu",
  "Error:": "Hata:",
  Errors: "Hatalar",
  Erros: "Hatalar",
  "ETAG:": "ETAG:",
  Event: "Olay",
  "Event Notifications": "Etkinlik Bildirimleri",
  Exchange: "Takas",
  "Exchange Type": "Değişim Türü",
  "Exclude Folders": "Klasörleri Hariç Tut",
  "exclude folders and prefixes": "klasörleri ve önekleri hariç tutun",
  "Exclude folders and prefixes": "Klasörleri ve önekleri hariç tut",
  "Excluded Prefixes": "Hariç Tutulan Önekler",
  "Excluded Prefixes :": "Hariç Tutulan Önekler :",
  "Existing Objects": "Mevcut Nesneler",
  "Expand graph": "Grafiği genişlet",
  "Expire All Versions": "Tüm Sürümlerin Süresini Doldur",
  "Expire Delete Marker": "Süre Sonu Silme İşareti",
  "Expired All Versions": "Tüm Sürümlerin Süresi Dolmuş",
  "Expired Object Delete Marker": "Süresi Dolmuş Nesne Silme İşaretleyicisi",
  Expiry: "Süre Sonu",
  "Expiry Days": "Süre Sonu Günü",
  Export: "Dışa Aktar",
  Extensions: "Uzantılar",
  'Extensions to compress e.g. ".txt", ".log" or ".csv" -  you can write one per field':
    'Sıkıştırılacak uzantılar ör. ".txt", ".log" veya ".csv" - her alana bir tane yazabilirsiniz',
  Failed: "Başarısız",
  Failures: "Arızalar",
  False: "Yanlış",
  Features: "Özellikler",
  February: "Şubat",
  "File Configuration": "Dosya Yapılandırması",
  "File couldn't be loaded. Please try Download instead":
    "Dosya yüklenemedi. Lütfen bunun yerine İndirmeyi deneyin",
  "File couldn't be previewed using file extension or mime type. Please try Download instead":
    "Dosya, dosya uzantısı veya mime türü kullanılarak önizlenemedi. Lütfen bunun yerine İndirmeyi deneyin",
  "File download will be handled directly by the browser.":
    "Dosya indirme doğrudan tarayıcı tarafından gerçekleştirilecektir.",
  "Files larger than 5 GiB use a single, non-resumable browser request. Use mcli for multipart uploads.":
    "5 GiB’den büyük dosyalar, kesildiğinde sürdürülemeyen tek bir tarayıcı isteğiyle yüklenir. Çok parçalı yüklemeler için mcli kullanın.",
  "File or Path to inspect": "İncelenecek Dosya veya Yol",
  "File Preview": "Dosya Önizlemesi",
  "File preview couldn't be displayed, Please try Download instead.":
    "Dosya önizlemesi görüntülenemiyor, Lütfen bunun yerine İndirmeyi deneyin.",
  "Filename should be less than 200 characters long.":
    "Dosya adı 200 karakterden kısa olmalıdır.",
  Filter: "Filtre",
  "Filter Users": "Kullanıcıları Filtrele",
  "Filter:": "Filtre:",
  Filters: "Filtreler",
  "Folder cannot have the same name as an existing file":
    "Klasör mevcut bir dosyayla aynı ada sahip olamaz",
  "For each write operation to the bucket, SILO checks all configured replication rules for the bucket and applies the matching rule with highest configured priority.":
    "Kovaya her yazma işlemi için, SILO kova için yapılandırılmış tüm çoğaltma kurallarını kontrol eder ve en yüksek yapılandırılmış önceliğe sahip eşleştirme kuralını uygular.",
  'For each write operation to this "source" bucket, SILO checks all configured replication rules and applies the matching rule with highest configured priority.':
    'Bu "kaynak" kovaya yapılan her yazma işlemi için, SILO tüm yapılandırılmış çoğaltma kurallarını kontrol eder ve yapılandırılmış en yüksek önceliğe sahip eşleştirme kuralını uygular.',
  "For per-object retention settings, defer to the documentation for the PUT operation used by your preferred SDK.":
    "Nesne başına saklama ayarları için, tercih ettiğiniz SDK tarafından kullanılan PUT işlemine ilişkin belgelere başvurun.",
  "For SSE-S3 or SSE-KMS encryption via KMS, all sites must have access to a central KMS deployment server.":
    "KMS üzerinden SSE-S3 veya SSE-KMS şifreleme için tüm sitelerin merkezi bir KMS dağıtım sunucusuna erişimi olmalıdır.",
  Format: "Biçim",
  "full attribution stack": "tam ilişkilendirme yığını",
  "Full Log Information": "Tam Günlük Bilgisi",
  "Function Name": "İşlev Adı",
  Functions: "İşlevler",
  "GET - Object accessed": "GET - Nesneye erişildi",
  "Get Information": "Bilgi Al",
  "GNU Affero General Public License, version 3":
    "GNU Affero Genel Kamu Lisansı, sürüm 3",
  "GNU AGPL v3 full text": "GNU AGPL v3 tam metin",
  Governance: "Yönetişim",
  Group: "Grup",
  "Group Mappings": "Grup Eşlemeleri",
  "Group Name": "Grup Adı",
  "Group Status:": "Grup Durumu:",
  "Groups provide a simplified method for managing shared permissions among users with common access patterns and workloads. Client’s cannot authenticate to a SILO deployment using a group as an identity.":
    "Gruplar, ortak erişim kalıplarına ve iş yüklerine sahip kullanıcılar arasında paylaşılan izinleri yönetmek için basitleştirilmiş bir yöntem sağlar. Müşteri, kimlik olarak bir grubu kullanarak SILO dağıtımında kimlik doğrulaması yapamaz.",
  "Groups with this Policy associated": "Bu Politikayla ilişkili gruplar",
  "Guide to access policy structure": "Politika yapısına erişim kılavuzu",
  hard: "kesin",
  Heal: "Onarım",
  "Health Check Duration": "Sağlık Kontrolü Süresi",
  "Health Info (Preview)": "Sağlık Bilgisi (Önizleme)",
  "Health Report": "Sağlık Raporu",
  "Health Report complete": "Sağlık Raporu tamamlandı",
  "Health Report file is ready to be downloaded.":
    "Sağlık Raporu dosyası indirilmeye hazır.",
  "Health report generated successfully!":
    "Sağlık raporu başarıyla oluşturuldu!",
  "Health Report in progress...": "Sağlık Raporu hazırlanıyor...",
  "Health Report started. Please do not refresh page during diagnosis.":
    "Sağlık Raporu başladı. Lütfen teşhis sırasında sayfayı yenilemeyin.",
  Healthy: "Sağlıklı",
  "Hide advanced Filters": "Gelişmiş Filtreleri Gizle",
  "Hide Bucket Naming Rules": "Kova Adlandırma Kurallarını Gizle",
  "Hide Object Versions": "Nesne Sürümlerini Gizle",
  hour: "saat",
  hours: {
    one: "saat",
    other: "saat",
  },
  Hours: "Saat",
  "IAM conditional statements": "IAM koşullu ifadeler",
  "IAM Policy": "IAM Politikası",
  Id: "ID",
  Identifier: "Tanımlayıcı",
  "Identity provider Client ID": "Kimlik sağlayıcı İstemci ID",
  "Identity provider Client Secret": "Kimlik sağlayıcı İstemci Gizli Anahtarı",
  "If the Health report cannot be generated at this time, please wait a moment and try again.":
    "Sağlık raporu şu anda oluşturulamıyorsa lütfen biraz bekleyip tekrar deneyin.",
  "If you are looking to change MINIO_ROOT_USER credentials,":
    "MINIO_ROOT_USER kimlik bilgilerini değiştirmek istiyorsanız,",
  "ILM - Object Transitioned": "ILM - Nesne Geçişi Yapıldı",
  "ILM Rule": "ILM Kuralı",
  Import: "İçe Aktar",
  "incorporates and modifies": "içerir ve değiştirir",
  Index: "Dizin",
  "Initially, only one of the sites added for replication may have data. After site-replication is successfully configured, this data is replicated to the other (initially empty) sites. Subsequently, objects may be written to any of the sites, and they will be replicated to all other sites.":
    "Başlangıçta çoğaltma için eklenen sitelerden yalnızca birinde veri bulunabilir. Site çoğaltma başarıyla yapılandırıldıktan sonra bu veriler diğer (başlangıçta boş) sitelere çoğaltılır. Daha sonra nesneler herhangi bir siteye yazılabilir ve diğer tüm sitelere kopyalanır.",
  "Inspect Decryption Key": "Şifre Çözme Anahtarını İnceleyin",
  "Inspect Object": "Nesneyi İncele",
  "Inspect this file": "Bu dosyayı inceleyin",
  Internal: "Dahili",
  "Invalid bucket name": "Geçersiz kova adı",
  "Invalid Endpoint set": "Geçersiz Uç Nokta ayarı",
  "Invalid Name": "Geçersiz Ad",
  January: "Ocak",
  "JSON Results:": "JSON Sonuçlar:",
  July: "Temmuz",
  June: "Haziran",
  "Just now": "Az önce",
  "Kafka topic used for bucket notifications":
    "Kafka kova bildirimleri için kullanılan konu",
  "Keep Alive Interval": "Canlı Tutma Aralığı",
  "Keep-alive interval for MQTT connections in s,m,h,d":
    "MQTT bağlantılar için s,m,h,d cinsinden canlı tutma aralığı",
  Key: "Anahtar",
  "Key Management Service Endpoints:": "Anahtar Yönetim Hizmeti Uç Noktaları:",
  "Key Name": "Anahtar Adı",
  "Key name cannot contain spaces": "Anahtar adı boşluk içeremez",
  Keys: "Anahtarlar",
  "KMS Key ID": "KMS Anahtar ID",
  "Last Modified": "Son Değiştirilme",
  "Last modified:": "Son değişiklik:",
  "Last Modified:": "Son Değişiklik:",
  "Latency Histogram": "Gecikme Histogramı",
  "LDAP Enabled": "LDAP Etkin",
  "Learn more about {link}.": "{link} hakkında daha fazla bilgi edinin.",
  "Learn more about Access Keys":
    "Erişim Anahtarları hakkında daha fazla bilgi edinin",
  "Learn more about Groups": "Gruplar hakkında daha fazla bilgi edinin",
  "Learn more about LDAP Configurations":
    "LDAP Yapılandırmaları hakkında daha fazla bilgi edinin",
  "Learn more about OpenID Connect Configurations":
    "OpenID Bağlantı Yapılandırmaları hakkında daha fazla bilgi edinin",
  "Learn more about Policies": "Politikalar hakkında daha fazla bilgi edinin",
  "Learn more about the Users feature":
    "Kullanıcılar özelliği hakkında daha fazla bilgi edinin",
  "Learn more about TIERS": "Katmanlar hakkında daha fazla bilgi edinin",
  "Legal Hold": "Yasal Saklama",
  "Legal Hold Status": "Yasal Saklama Durumu",
  "Legal Hold:": "Yasal Saklama:",
  "licensing in full": "tam lisanslama",
  Lifecycle: "Yaşam Döngüsü",
  "Lifecycle Configuration": "Yaşam Döngüsü Yapılandırması",
  "Lifecycle Rules": "Yaşam Döngüsü Kuralları",
  Link: "Bağlantı",
  'List of etcd endpoints e.g. "http://localhost:2379" - you can write one per field':
    'etcd uç noktalarının listesi ör. "http://localhost:2379" - her alana bir tane yazabilirsiniz',
  "List of origins allowed for CORS requests":
    "CORS istek için izin verilen kaynak listesi",
  "List of Replicated Sites": "Çoğaltılmış Sitelerin Listesi",
  "Load more": "Daha fazlasını yükle",
  "Load more Versions": "Daha fazla Sürüm Yükle",
  "Load Time": "Yükleme Süresi",
  "Loading nodes": "Düğümler yükleniyor",
  "Local Buckets to replicate": "Çoğaltılacak Yerel Kovalar",
  Location: "Konum",
  Locking: "Kilitleme",
  "Log Details": "Günlük Ayrıntıları",
  "Logger Webhook": "Kaydedici Webhook",
  "Lookup Bind DN is required": "Arama Bağlantısı DN gereklidir",
  "Lookup Bind Password is required": "Arama Bağlama Şifresi gerekli",
  "Lookup Bind Password must be re-entered to change LDAP configurations":
    "LDAP yapılandırmalarını değiştirmek için Arama Bağlama Şifresi yeniden girilmelidir",
  "Manage Groups": "Grupları Yönet",
  Mandatory: "Zorunlu",
  "Manually Configure String": "Dizeyi Manuel Olarak Yapılandır",
  March: "Mart",
  "Max IO": "Maksimum IO",
  "Max Sleep": "Maksimum Uyku",
  "Max Wait": "Maksimum Bekleme",
  "Maximum IO requests allowed between objects to slow down heal operation, e.g. 3":
    "Onarım işlemini yavaşlatmak için nesneler arasında izin verilen maksimum IO isteği, ör. 3",
  "Maximum limit for undelivered messages, defaults to '10000'":
    "Teslim edilmeyen mesajlar için maksimum sınır, varsayılan olarak '10000'dir",
  "Maximum number of concurrent requests, e.g. '1600'":
    "Maksimum eşzamanlı istek sayısı, ör. '1600'",
  "Maximum sleep duration between objects to slow down heal operation, e.g. 2s":
    "Onarım işlemini yavaşlatmak için nesneler arasındaki maksimum bekleme süresi, ör. 2s",
  "Maximum wait time between operations, defaults to '15s'":
    "İşlemler arasındaki maksimum bekleme süresi, varsayılan olarak '15s'dir",
  May: "Mayıs",
  "May try again or download Health report JSON File.":
    "Tekrar deneyebilir veya Sağlık raporu JSON Dosyasını indirebilirsiniz.",
  Members: "Üyeler",
  "Memory Info": "Hafıza Bilgisi",
  Metadata: "Meta Veriler",
  "Metadata Sync": "Meta Veri Senkronizasyonu",
  Method: "Yöntem",
  "Mime Types": "Mime Çeşitleri",
  'Mime types e.g. "text/*", "application/json" or "application/xml" - you can write one per field':
    'Mime türleri ör. "text/*", "application/json" veya "application/xml" - her alana bir tane yazabilirsiniz',
  minute: "dakika",
  minutes: {
    one: "dakika",
    other: "dakika",
  },
  Minutes: "Dakika",
  Mode: "Modu",
  "Mode:": "Mod:",
  month: "ay",
  months: {
    one: "ay",
    other: "ay",
  },
  "More filter options": "Daha fazla filtre seçeneği",
  "MQTT password": "MQTT şifre",
  "MQTT server endpoint e.g. `tcp://localhost:1883`":
    "MQTT sunucu uç noktası ör. 'tcp://localhost:1883'",
  "MQTT username": "MQTT kullanıcı adı",
  "Multi Bucket lifecycle Assignments Results":
    "Çoklu Kova yaşam döngüsü Atamaları Sonuçları",
  Name: "İsim",
  "Name for identity provider configuration":
    "Kimlik sağlayıcı yapılandırmasının adı",
  "Name of the AMQP exchange": "AMQP exchange adı",
  'Name of the location of the server e.g. "us-west-rack2"':
    'Sunucu konumunun adı ör. "us-west-rack2"',
  "Name of the MQTT topic to publish": "Yayınlanacak MQTT konunun adı",
  "Name:": "İsim:",
  'Namespace prefix to isolate tenants e.g. "customer1/"':
    'Kiracıları izole etmek için ad alanı öneki ör. "customer1/"',
  "NATS password": "NATS şifre",
  "NATS server address e.g. '0.0.0.0:4222'":
    "NATS sunucu adresi ör. '0.0.0.0:4222'",
  "NATS subscription subject": "NATS abonelik konusu",
  "NATS token": "NATS jeton",
  "NATS username": "NATS kullanıcı adı",
  "Network Info": "Ağ Bilgisi",
  "New {entity} Created": "Yeni {entity} Oluşturuldu",
  "New Audit Webhook": "Yeni Denetim Webhook",
  "New Endpoint": "Yeni Uç Nokta",
  "New Endpoint:": "Yeni Uç Nokta:",
  "New Folder Path": "Yeni Klasör Yolu",
  "New Logger Webhook": "Yeni Kaydedici Webhook",
  "New Password": "Yeni Şifre",
  "New passwords don't match": "Yeni şifreler eşleşmiyor",
  "New Tag Key": "Yeni Etiket Anahtarı",
  "New Tag Label": "Yeni Etiket Etiketi",
  Next: "Sonraki",
  No: "Hayır",
  "No changes applied": "Hiçbir değişiklik uygulanmadı",
  "No Changes at this time": "Şu anda Değişiklik Yok",
  "No data available": "Veri yok",
  "No Groups Available": "Grup Mevcut Değil",
  "No Policies Available": "Hiçbir Politika Mevcut Değil",
  "No query results yet": "Henüz sorgu sonucu yok",
  "No Results Available": "Sonuç Yok",
  "No Users to display": "Görüntülenecek Kullanıcı yok",
  "No Wait": "Bekleme Yok",
  "no-expiry": "süresiz",
  "Nodes:": "Düğümler:",
  "Non-blocking message delivery when set to 'on', default is 'off'":
    "'on' olarak ayarlandığında engellenmeyen mesaj iletimi, varsayılan 'off'tur",
  "Non-Current": "Güncel Değil",
  "Non-current Expiration Days": "Eski sürümlerin bitişi (gün)",
  "Non-current Transition Days": "Güncel Olmayan Geçiş Günleri",
  "Non-Current Version": "Güncel Olmayan Sürüm",
  "Non-current Version Transition Storage Class":
    "Güncel Olmayan Sürüm Geçiş Depolama Sınıfı",
  None: "Hiçbiri",
  "Not what you expected?": "Beklediğiniz gibi değil mi?",
  "Note:": "Not:",
  "Note: AccessKey and SecretKey values for every site is required while adding or editing peer sites":
    "Not: Eş siteler eklenirken veya düzenlenirken her site için AccessKey ve SecretKey değerleri gereklidir",
  November: "Kasım",
  "NSQ server address e.g. '127.0.0.1:4150'":
    "NSQ sunucu adresi ör. '127.0.0.1:4150'",
  "NSQ topic": "NSQ konu",
  "NSQD Address": "NSQD Adres",
  "NULL VERSION": "BOŞ (NULL) SÜRÜM",
  "Number of {unit} must be less than or equal to 2147483647":
    "{unit} sayısı 2147483647'den küçük veya ona eşit olmalıdır",
  "Number of {unit} to retain must be greater than zero":
    "Tutulacak {unit} sayısı sıfırdan büyük olmalıdır",
  "Number of messages to publish without waiting for ACKs":
    "ACK beklemeden yayınlanacak mesaj sayısı",
  "Number of replication workers for recently failed replicas, defaults to 4":
    "Yakın zamanda başarısız olan replikalar için replikasyon çalışanlarının sayısı, varsayılan olarak 4'tür",
  "Number of replication workers, defaults to 100":
    "Çoğaltma çalışanlarının sayısı, varsayılan olarak 100'dür",
  Object: "Nesne",
  "Object Date": "Nesne Tarihi",
  "Object Filters": "Nesne Filtreleri",
  "Object Info": "Nesne Bilgisi",
  "Object Locking:": "Nesne Kilitleme:",
  "Object Size": "Nesne Boyutu",
  "Object Version": "Nesne Sürümü",
  "Objects deleted successfully.": "Nesneler başarıyla silindi.",
  "Objects in excluded prefixes do not replicate to any peer site or remote site.":
    "Hariç tutulan öneklerdeki nesneler herhangi bir eş siteye veya uzak siteye kopyalanmaz.",
  "Objects List unavailable. Please review your WebSockets configuration and try again":
    "Nesne Listesi kullanılamıyor. Lütfen WebSockets yapılandırmanızı gözden geçirip tekrar deneyin",
  "Objects:": "Nesneler:",
  "Objs/S": "Nesne/sn",
  October: "Ekim",
  of: "/",
  "Only empty tiers can be deleted. If the tier has had objects transitioned into it, it cannot be removed.":
    "Yalnızca boş katmanlar silinebilir. Katmanın içine aktarılan nesneler varsa kaldırılamaz.",
  "Opaque string or JWT authorization token":
    "Opak dize veya JWT yetkilendirme jetonu",
  "Open Dialog": "İletişim Kutusunu Aç",
  "OpenID Configurations": "OpenID Yapılandırmaları",
  "OS Info": "OS Bilgi",
  other: "diğer",
  "Password for LDAP read-only service account used to perform DN and group lookups":
    "DN ve grup aramalarını gerçekleştirmek için kullanılan LDAP salt okunur hizmet hesabının şifresi",
  "Password for SASL/PLAIN or SASL/SCRAM authentication":
    "SASL/PLAIN veya SASL/SCRAM kimlik doğrulama şifresi",
  "Passwords must be at least 8 characters long":
    "Şifreler en az 8 karakter uzunluğunda olmalıdır",
  Path: "Yol",
  "Path cannot start with /": "Yol / ile başlayamaz",
  "Path copied to clipboard": "Yol panoya kopyalandı",
  "Path Prefix": "Yol Öneki",
  "Path to certificate chain of the target NATS server":
    "Hedef NATS sunucusunun sertifika zincirinin yolu",
  "Path to client certificate for mTLS authorization":
    "mTLS yetkilendirmesi için istemci sertifikasının yolu",
  "Path to client key for mTLS authorization":
    "mTLS yetkilendirmesi için istemci anahtarının yolu",
  "Peer Sites": "Eş Siteler",
  "Perform bitrot scan on disks when checking objects during scanner":
    "Tarayıcı sırasında nesneleri kontrol ederken disklerde bitrot taraması yapın",
  "Performance test": "Performans testi",
  "Persist queue across broker restarts when set to 'on', default is 'off'":
    "'on' olarak ayarlandığında aracı yeniden başlatmalarında kuyruğu koru, varsayılan 'off'tur",
  "Ping Interval": "Ping Aralığı",
  "Please avoid the use of root credentials for this feature":
    "Lütfen bu özellik için kök kimlik bilgilerinin kullanılmasından kaçının",
  "Please configure {entity} first to use this feature.":
    "Bu özelliği kullanmak için lütfen önce {entity} yapılandırın.",
  "Please deploy a server in {distributedMode} to use these features.":
    "Bu özellikleri kullanmak için lütfen {distributedMode}'da bir sunucu konuşlandırın.",
  "Please deploy a server in {mode} to use this feature.":
    "Bu özelliği kullanmak için lütfen {mode}'da bir sunucu konuşlandırın.",
  "N/A": "Yok",
  "Enter a positive quota below 8 PiB, with up to two decimal places. Use mcli for larger quotas.":
    "8 PiB'in altında, iki ondalık basamağa kadar pozitif bir kota girin. Daha büyük kotalar için mcli kullanın.",
  "The current quota is 8 PiB or larger, which the browser cannot edit exactly. Change it with mcli, enter a smaller quota, or disable it here.":
    "Mevcut kota 8 PiB veya daha fazladır ve tarayıcı bunu tam olarak düzenleyemez. mcli ile değiştirin, daha küçük bir kota girin veya buradan devre dışı bırakın.",
  "Please Login via the configured external identity provider.":
    "Lütfen yapılandırılmış harici kimlik sağlayıcı üzerinden giriş yapın.",
  "Please note": "Lütfen dikkat edin",
  "Please note that this may cause your system to not be accessible":
    "Lütfen bunun sisteminizin erişilememesine neden olabileceğini unutmayın.",
  "Please refer to {link} credentials.":
    "Lütfen {link} kimlik bilgilerine bakın.",
  "Please select / type the desired remote bucket were you want the local data to be replicated.":
    "Lütfen yerel verilerin çoğaltılmasını istediğiniz uzak kovayı seçin / yazın.",
  "Please select a valid duration.": "Lütfen geçerli bir süre seçin.",
  "Please select Groups on which you want to apply Policies":
    "Lütfen Politikaları uygulamak istediğiniz Grupları seçin",
  "Please verify that string is uppercase only and contains valid characters (numbers, dashes & underscores).":
    "Lütfen dizenin yalnızca büyük harf olduğunu ve geçerli karakterler (sayılar, tireler ve alt çizgiler) içerdiğini doğrulayın.",
  Policy: "Politika",
  "Policy has no statements": "Politikada beyan yok",
  "Policy mapping": "Politika eşleme",
  "Policy Mappings": "Politika Eşlemeleri",
  "Policy Name": "Politika Adı",
  "Policy name cannot be empty": "Politika adı boş olamaz",
  "Policy successfully updated": "Politika başarıyla güncellendi",
  "Policy Summary": "Politika Özeti",
  "Portions © 2015–2026 MinIO, Inc.": "Kısımlar © 2015–2026 MinIO, Inc.",
  prefix: "öneki",
  Prefix: "Önek",
  "Preliminar Results:": "Ön Sonuçlar:",
  preview: "önizleme",
  Preview: "Önizleme",
  "Preview - {object}": "Önizleme - {object}",
  "Preview Selected File": "Seçilen Dosyayı Önizle",
  "Preview this File": "Bu Dosyayı Önizle",
  "Preview unavailable": "Önizleme kullanılamıyor",
  Priority: "Öncelik",
  private: "özel",
  Private: "Özel",
  "Process Info": "İşlem Bilgisi",
  public: "halka açık",
  Public: "Herkese açık",
  "PUT - Object Uploaded": "PUT - Nesne Yüklendi",
  "Query Filters": "Sorgu Filtreleri",
  "Query Results": "Sorgu Sonuçları",
  Queue: "Sıra",
  "Queue Dir": "Kuyruk Dizini",
  "Queue Directory": "Kuyruk Dizini",
  "Queue Limit": "Sıra Limiti",
  "Quietly ignore undelivered messages when set to 'off', default is 'on'":
    "'off' olarak ayarlandığında teslim edilmeyen mesajları sessizce yoksay, varsayılan 'on'dur",
  quota: "kota",
  Quota: "Kota",
  "Quota:": "Kota:",
  "Randomized access credentials are recommended, and provided by default. You may use your own custom Access Key and Secret Key by replacing the default values. After creation of any Access Key, you will be given the opportunity to view and download the account credentials.":
    "Rastgele erişim kimlik bilgileri önerilir ve varsayılan olarak sağlanır. Varsayılan değerleri değiştirerek kendi özel Erişim Anahtarınızı ve Gizli Anahtarınızı kullanabilirsiniz. Herhangi bir Erişim Anahtarını oluşturduktan sonra size hesap kimlik bilgilerini görüntüleme ve indirme fırsatı verilecektir.",
  "Raw Policy": "Ham Politika",
  readonly: "salt okunur",
  readwrite: "okuma yazma",
  "Reconnect Interval": "Yeniden Bağlanma Aralığı",
  "Reconnect interval for MQTT connections in s,m,h,d":
    "MQTT bağlantılar için s,m,h,d cinsinden yeniden bağlanma aralığı",
  "Redirect URI Dynamic": "Yönlendirme URI Dinamik",
  "Redis key to store/update events, key is auto-created":
    "Olayları saklamak/güncellemek için Redis anahtarı, anahtar otomatik olarak oluşturulur",
  "Redis server password": "Redis sunucu şifresi",
  "Redis server's address e.g. `localhost:6379`":
    "Redis sunucusunun adresi ör. `localhost:6379`",
  Refresh: "Yenile",
  "Refresh List": "Listeyi Yenile",
  Region: "Bölge",
  "Remote Bucket Assignments": "Uzaktan Kova Atamaları",
  "Remote Configuration": "Uzaktan Yapılandırma",
  "Remote Endpoint Configuration": "Uzak Uç Nokta Yapılandırması",
  "Remote Host": "Uzak Ana Bilgisayar",
  "remote tier": "uzak katman",
  "Remove Row": "Satırı Kaldır",
  "Remove Selected Replication Rules": "Seçilen Çoğaltma Kurallarını Kaldır",
  "Remove Selected Rules": "Seçilen Kuralları Kaldır",
  "Remove the reference to the object if no versions are left":
    "Hiçbir sürüm kalmamışsa nesneye yapılan referansı kaldırın",
  "Removes all the versions of the object already expired":
    "Nesnenin süresi dolmuş tüm sürümlerini kaldırır",
  "Rename Download": "İndirmeyi Yeniden Adlandır",
  "REPLICA - Object Replicated": "REPLICA - Nesne Çoğaltıldı",
  "Replicate existing objects": "Mevcut nesneleri çoğaltın",
  "Replicate soft deletes": "Yumuşak silme işlemlerini çoğaltın",
  "Replicate versioned deletes": "Sürümlendirilmiş silme işlemlerini çoğaltın",
  Replication: "Çoğaltma",
  "Replication Failed Workers": "Başarısız Çoğaltma Çalışanları",
  "Replication Mode": "Çoğaltma Modu",
  "Replication Options": "Çoğaltma Seçenekleri",
  "Replication Rules": "Çoğaltma Kuralları",
  "Replication Status": "Çoğaltma Durumu",
  "Replication status for {type}: {name}.":
    "{type} için çoğaltma durumu: {name}.",
  "Replication status from all Sites": "Tüm Sitelerden çoğaltma durumu",
  "Replication Workers": "Çoğaltma Çalışanları",
  "Replication:": "Çoğaltma:",
  "Reported Usage:": "Bildirilen Kullanım:",
  "Request Content Length": "İstek İçeriği Uzunluğu",
  "Request ID": "Talep ID",
  "Requests Max": "Maksimum İstekler",
  "Requests that took T ms or less": "T ms veya daha az süren istekler",
  Reset: "Sıfırla",
  "Reset Configuration": "Yapılandırmayı Sıfırla",
  "Reset Default Webhook": "Varsayılan Webhook'u Sıfırla",
  "Resources:": "Kaynaklar:",
  "Response Content Length": "Yanıt İçerik Uzunluğu",
  "Response Status": "Yanıt Durumu",
  "Response Status Code": "Yanıt Durum Kodu",
  "Response Threshold": "Yanıt Eşiği",
  Restart: "Yeniden Başlat",
  "Restore Defaults": "Varsayılanları Geri Yükle",
  "Restore File Version": "Dosya Sürümünü Geri Yükle",
  "Restore this version": "Bu sürümü geri yükle",
  "Restrict beyond user policy": "Kullanıcı politikasının ötesinde kısıtla",
  Results: "Sonuçlar",
  Retention: "Saklama",
  "Retention Mode": "Saklama Modu",
  "Retention Policy:": "Saklama Politikası:",
  "Retention Unit": "Saklama Birimi",
  "Retention Validity": "Saklama Geçerliliği",
  "Retention:": "Saklama:",
  Retest: "Tekrar Test Et",
  "Retry Health Report": "Sağlık Raporunu Yeniden Deneyin",
  Rewind: "Geri sarma",
  "Rewind - {bucket}": "Geri Sar - {bucket}",
  "Rewind Bucket": "Kovayı Geri Sar",
  "Rewind to": "Geri sar",
  "Role Policy": "Rol Politikası",
  rotating: "dönen",
  "Routing Key": "Yönlendirme Anahtarı",
  "Routing key for publishing": "Yayınlama için yönlendirme anahtarı",
  "Rule State": "Kural Durumu",
  "Rule Type": "Kural Türü",
  "Running {mcDu} without the {flag} flag or {df} will provide different values corresponding to the size of all {current} versions and the physical disk space occupied respectively.":
    "{mcDu}'yi {flag} bayrağı veya {df} olmadan çalıştırmak, sırasıyla tüm {current} sürümlerin boyutuna ve işgal edilen fiziksel disk alanına karşılık gelen farklı değerler sağlayacaktır.",
  "S3 lifecycle": "S3 yaşam döngüsü",
  "SASL authentication mechanism": "SASL kimlik doğrulama mekanizması",
  "SASL authentication mechanism, default 'PLAIN'":
    "SASL kimlik doğrulama mekanizması, varsayılan 'PLAIN'",
  "SASL Mechanism": "SASL Mekanizma",
  "SASL Password": "SASL Şifre",
  "SASL Username": "SASL Kullanıcı adı",
  "Save Event Destination": "Etkinlik Hedefini Kaydet",
  "Save Tier Configuration": "Katman Yapılandırmasını Kaydet",
  Scanner: "Tarayıcı",
  "SCANNER - Object has too many versions / Prefixes has too many sub-folders":
    "SCANNER - Nesnenin çok fazla sürümü var / Öneklerin çok fazla alt klasörü var",
  "Scanner delay multiplier, defaults to '10.0'":
    "Tarayıcı gecikme çarpanı, varsayılan olarak '10.0'dır",
  Scopes: "Kapsamlar",
  Search: "Ara",
  "Search Access Keys": "Erişim Anahtarı Ara",
  "Search Groups": "Grupları Ara",
  "Search Keys with pattern": "Desenle Anahtar Ara",
  "Search members": "Üyeleri ara",
  "Search Policies": "Politika Ara",
  "Search target": "Arama hedefi",
  "Search Users": "Kullanıcıları Ara",
  second: "saniye",
  seconds: {
    one: "saniye",
    other: "saniye",
  },
  "Secret Key": "Gizli Anahtar",
  "SecretKey is required": "SecretKey gereklidir",
  "Select {expiry} to delete Objects per this rule. Select {transition} to move Objects to a remote storage {tier} per this rule.":
    "Nesneleri bu kurala göre silmek için {expiry} seçeneğini seçin. Bu kurala göre Nesneleri uzak bir {tier} hedefine taşımak için {transition} öğesini seçin.",
  "Select Bucket": "Kova Seçin",
  "Select from the list of displayed users to assign users to the new group at creation. These users inherit the policies assigned to the group.":
    "Oluşturma sırasında kullanıcıları yeni gruba atamak için görüntülenen kullanıcılar listesinden seçim yapın. Bu kullanıcılar gruba atanan politikaları devralır.",
  "Select Groups to delete": "Silinecek Grupları seçin",
  "Select Multiple Versions": "Birden Çok Sürüm Seçin",
  "Select Policy": "Politika Seçin",
  "Select the desired level of access available to unauthenticated Users":
    "Kimliği doğrulanmamış Kullanıcılara sunulan istenen erişim düzeyini seçin",
  "Select Tier Type": "Katman Türünü Seçin",
  "Select to set expiry by days or newer noncurrent versions":
    "Son kullanma tarihini günlere veya güncel olmayan daha yeni sürümlere göre ayarlamak için seçin",
  "Select Users to delete": "Silinecek Kullanıcıları seçin",
  "Select Users to group": "Gruplanacak Kullanıcıları seçin",
  "Select whether to apply the rule to current or non-current Object {versions}":
    "Kuralın güncel veya güncel olmayan Nesne {versions} için uygulanacağını seçin",
  "Selected Group": "Seçilen Grup",
  "Selected Groups": "Seçilen Gruplar",
  "Selected Object": "Seçilen Nesne",
  "Selected Objects:": "Seçilen Nesneler:",
  "Selected User": "Seçilen Kullanıcı",
  "Selected Users": "Seçilmiş Kullanıcılar",
  September: "Eylül",
  Series: "Serisi",
  server: "sunucu",
  "Server Address": "Sunucu Adresi",
  "Server Address is required": "Sunucu Adresi gerekli",
  "Server Config": "Sunucu Yapılandırması",
  "Server Health Info": "Sunucu Sağlık Bilgisi",
  "Server Insecure": "Sunucu Güvenli Değil",
  "Server Location": "Sunucu Konumu",
  "server-side bucket replication": "sunucu tarafı kova çoğaltması",
  "Server, client and Console are all AGPLv3. SILO's documentation is CC BY 4.0 — {licensing}.":
    "Sunucu, istemci ve Konsolun tümü AGPLv3'tür. SILO'nun belgeleri CC BY 4.0 — {licensing}'dir.",
  Service: "Servis",
  "Service Accounts": "Hizmet Hesapları",
  Services: "Hizmetler",
  Set: "Ayarla",
  "Set Anonymous Access to this Folder": "Bu Klasöre Anonim Erişimi Ayarlayın",
  "Set Bucket Replication": "Kova Çoğaltmasını Ayarla",
  "Set Groups": "Grupları Ayarla",
  "Set Legal Hold": "Yasal Saklamayı Ayarla",
  "Set Lifecycle to multiple buckets":
    "Birden fazla kovaya Yaşam Döngüsü ayarlayın",
  "Set Multiple Bucket Replication": "Çoklu Kova Çoğaltma Ayarla",
  "Set Non-current Version Transition Storage Class":
    "Güncel Olmayan Sürüm Geçişi Depolama Sınıfını Ayarlayın",
  "Set Policies": "Politikaları Ayarla",
  "Set Retention Configuration": "Saklama Yapılandırmasını Ayarla",
  "Set Retention Policy": "Saklama Politikasını Ayarlayın",
  "Set the quality of service priority, defaults to '0'":
    "Hizmet kalitesi önceliğini ayarlayın, varsayılanlar '0'dır",
  "Set to '1' for non-persistent or '2' for persistent queue":
    "Kalıcı olmayan kuyruk için '1'e veya kalıcı kuyruk için '2'ye ayarlayın",
  "Set to 'on' for exchange to be not used directly by publishers, but only when bound to other exchanges":
    "Exchange'in doğrudan yayıncılar tarafından değil, yalnızca diğer exchange'lere bağlandığında kullanılması için 'on' olarak ayarlayın",
  "Set to 'on' to enable asynchronous publish":
    "Eşzamansız yayınlamayı etkinleştirmek için 'on' olarak ayarlayın",
  "Set to 'on' to enable SASL authentication":
    "SASL kimlik doğrulamayı etkinleştirmek için 'on' olarak ayarlayın",
  "Set to 'on' to enable TLS":
    "TLS'yi etkinleştirmek için 'on' olarak ayarlayın",
  "Set to 'on' to use streaming NATS server":
    "NATS akış sunucusunu kullanmak için 'on' olarak ayarlayın",
  "Setting a {quota} assigns a hard limit to a bucket beyond which SILO does not allow writes.":
    "Bir {quota} ayarlamak, bir kovaya kesin bir sınır atar ve bunun ötesinde SILO yazmalara izin vermez.",
  "Setting an {anonymous} policy allows clients to access the Bucket or prefix contents and perform actions consistent with the specified policy without authentication.":
    "Bir {anonymous} politikasının ayarlanması, istemcilerin Kova veya önek içeriklerine erişmesine ve kimlik doğrulaması olmadan belirtilen politikayla tutarlı eylemler gerçekleştirmesine olanak tanır.",
  Share: "Paylaş",
  "Share File": "Dosyayı Paylaş",
  "Share Selected File": "Seçilen Dosyayı Paylaş",
  "Share this File": "Bu Dosyayı Paylaş",
  "Share this version": "Bu sürümü paylaş",
  "Share URL Copied to clipboard": "Paylaşım URL'si panoya kopyalandı",
  'Shared bucket DNS records, default is "/skydns"':
    'Paylaşılan kova DNS kayıtları, varsayılan "/skydns"dir',
  "Show advanced Filters": "Gelişmiş Filtreleri Göster",
  "Show Current Data": "Güncel Verileri Göster",
  "Show deleted objects": "Silinen nesneleri göster",
  "Show Rewind Data": "Geri Sarma Verilerini Göster",
  "Show/Hide": "Göster/Gizle",
  "SILO {bucketNotifications} allow administrators to send notifications to supported external services on certain object or bucket events.":
    "SILO {bucketNotifications} yöneticilerin belirli nesne veya kova olaylarında desteklenen harici hizmetlere bildirim göndermesine olanak tanır.",
  "SILO {objectLocking} enforces Write-Once Read-Many (WORM) immutability to protect versioned objects from deletion.":
    "SILO {objectLocking}, sürümlendirilmiş nesneleri silinmeye karşı korumak için Bir Kez Yaz Çok Sayıda Oku (WORM) değişmezliğini uygular.",
  "SILO {serverSideReplication} is an automatic bucket-level configuration that synchronizes objects between a source and destination bucket.":
    "SILO {serverSideReplication}, kaynak ve hedef kova arasındaki nesneleri senkronize eden otomatik kova düzeyinde bir yapılandırmadır.",
  "SILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events. SILO supports bucket and object-level S3 events similar to the Amazon S3 Event Notifications.":
    "SILO kova bildirimleri, yöneticilerin belirli nesne veya kova olaylarında desteklenen harici hizmetlere bildirim göndermesine olanak tanır. SILO, Amazon S3 Etkinlik Bildirimlerine benzer şekilde kova ve nesne düzeyinde S3 olaylarını destekler.",
  "SILO derives its behavior and syntax from {s3Lifecycle} for compatibility in migrating workloads and lifecycle rules from S3 to SILO.":
    "SILO, iş yüklerinin ve yaşam döngüsü kurallarının S3'ten SILO'ya taşınmasında uyumluluk için davranışını ve sözdizimini {s3Lifecycle}'den alır.",
  "SILO does not enable existing object replication by default. Objects created before replication was configured or while replication is disabled are not synchronized to the target deployment unless replication of existing objects is enabled.":
    "SILO varsayılan olarak mevcut nesne çoğaltmayı etkinleştirmez. Çoğaltma yapılandırılmadan önce veya çoğaltma devre dışı bırakıldığında oluşturulan nesneler, mevcut nesnelerin çoğaltılması etkinleştirilmediği sürece hedef dağıtımla eşitlenmez.",
  "SILO Health Info": "SILO Sağlık Bilgileri",
  "SILO Object Lifecycle Management allows creating rules for time or date based automatic transition or expiry of objects. For object transition, SILO automatically moves the object to a configured remote storage tier.":
    "SILO Nesne Yaşam Döngüsü Yönetimi, nesnelerin zaman veya tarih bazlı otomatik geçişi veya sona ermesi için kurallar oluşturulmasına olanak sağlar. Nesne geçişi için SILO nesneyi otomatik olarak yapılandırılmış bir uzak depolama katmanına taşır.",
  "SILO or other S3-compatible storage": "SILO veya diğer S3 uyumlu depolama",
  "SILO PBAC is built for compatibility with AWS IAM policy syntax, structure, and behavior.":
    "SILO PBAC, AWS IAM politika sözdizimi, yapısı ve davranışıyla uyumluluk için oluşturulmuştur.",
  "SILO queries the configured Active Directory / LDAP server to verify the credentials specified by the application and optionally return a list of groups in which the user has membership. SILO supports two modes (Lookup-Bind Mode and Username-Bind Mode) for performing these queries":
    "SILO, uygulama tarafından belirtilen kimlik bilgilerini doğrulamak için yapılandırılmış Active Directory / LDAP sunucusunu sorgular ve isteğe bağlı olarak kullanıcının üyeliğinin olduğu grupların bir listesini döndürür. SILO bu sorguları gerçekleştirmek için iki modu (Arama-Bağlama Modu ve Kullanıcı Adı-Bağlama Modu) destekler",
  "SILO recommends using Lookup-Bind mode as the preferred method for verifying AD/LDAP credentials. Username-Bind mode is a legacy method retained for backwards compatibility only.":
    "SILO, AD/LDAP kimlik bilgilerini doğrulamak için tercih edilen yöntem olarak Arama-Bind modunun kullanılmasını önerir. Kullanıcı Adı Bağlama modu yalnızca geriye dönük uyumluluk için tutulan eski bir yöntemdir.",
  "SILO requires versioning to support replication.":
    "SILO çoğaltmayı desteklemek için sürüm oluşturmayı gerektirir.",
  "SILO supports automatically replicating existing objects in a bucket; this setting is enabled by default. Please note that objects created before replication was configured or while replication is disabled are not synchronized to the target deployment in case this setting is not enabled.":
    "SILO bir kovadaki mevcut nesnelerin otomatik olarak çoğaltılmasını destekler; bu ayar varsayılan olarak etkindir. Çoğaltma yapılandırılmadan önce veya çoğaltma devre dışı bırakıldığında oluşturulan nesnelerin, bu ayarın etkinleştirilmemesi durumunda hedef dağıtımla senkronize edilmeyeceğini lütfen unutmayın.",
  "SILO supports creating object transition lifecycle management rules, where SILO can automatically move an object to a remote storage “tier”.":
    'SILO, nesne geçişi yaşam döngüsü yönetimi kurallarının oluşturulmasını destekler; burada SILO bir nesneyi otomatik olarak uzak bir depolama "katmanına" taşıyabilir.',
  "SILO supports enabling automatic {sseKms} and {sseS3} encryption of all objects written to a bucket using a specific External Key (EK) stored on the external KMS.":
    "SILO, harici KMS üzerinde depolanan belirli bir Harici Anahtar (EK) kullanılarak bir kovaya yazılan tüm nesnelerin otomatik {sseKms} ve {sseS3} şifrelemesinin etkinleştirilmesini destekler.",
  "SILO supports enabling replication of existing objects in a bucket.":
    "SILO bir kovadaki mevcut nesnelerin çoğaltılmasını etkinleştirmeyi destekler.",
  "SILO supports keeping multiple {versions} of an object in a single bucket.":
    "SILO bir nesnenin birden fazla {versions} kopyasını tek bir kovada tutmayı destekler.",
  "SILO supports replicating delete operations, where SILO synchronizes deleting specific object versions and new delete markers. Delete operation replication uses the same replication process as all other replication operations.":
    "SILO silme işlemlerini kopyalamayı destekler; burada SILO belirli nesne sürümlerinin ve yeni silme işaretlerinin silinmesini senkronize eder. Silme işlemi çoğaltması, diğer tüm çoğaltma işlemleriyle aynı çoğaltma işlemini kullanır.",
  "SILO supports server-side and client-side replication of objects between source and destination buckets.":
    "SILO kaynak ve hedef kovalar arasındaki nesnelerin sunucu tarafında ve istemci tarafında çoğaltılmasını destekler.",
  "SILO supports setting both {bucketDefault} and per-object retention rules.":
    "SILO, hem {bucketDefault} hem de nesne başına saklama kurallarının ayarlanmasını destekler.",
  "SILO supports the following Tier types:":
    "SILO aşağıdaki Katman türlerini destekler:",
  "SILO supports using an Active Directory or LDAP (AD/LDAP) service for external management of user identities. Configuring an external IDentity Provider (IDP) enables Single-Sign On (SSO) workflows, where applications authenticate against the external IDP before accessing SILO.":
    "SILO, kullanıcı kimliklerinin harici yönetimi için bir Active Directory veya LDAP (AD/LDAP) hizmetinin kullanılmasını destekler. Harici bir Kimlik Sağlayıcıyı (IDP) yapılandırmak, uygulamaların SILO'ya erişmeden önce harici IDP'ye göre kimlik doğrulaması yaptığı Tek Oturum Açma (SSO) iş akışlarını etkinleştirir.",
  "SILO uses buckets to organize objects. A bucket is similar to a folder or directory in a filesystem, where each bucket can hold an arbitrary number of objects.":
    "SILO nesneleri düzenlemek için kovaları kullanır. Bir kova, her bir kovanın isteğe bağlı sayıda nesneyi tutabildiği bir dosya sistemindeki bir klasöre veya dizine benzer.",
  "SILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.":
    "SILO, kimliği doğrulanmış bir kullanıcının erişim sahibi olduğu yetkili eylemleri ve kaynakları tanımlamak için Politika Tabanlı Erişim Kontrolünü (PBAC) kullanır. Her politika, bir kullanıcının veya kullanıcı grubunun izinlerinin ana hatlarını çizen bir veya daha fazla eylemi ve koşulu açıklar.",
  "SILO VERSION": "SILO SÜRÜMÜ",
  "Site Name": "Site Adı",
  "Site:": "Sitesi:",
  Size: "Boyut",
  "Size:": "Boyut:",
  "Skip TLS Verification": "TLS Doğrulamayı Atla",
  "something went wrong": "bir şeyler ters gitti",
  "Something went wrong.": "Bir şeyler ters gitti.",
  "Sort by": "Sıralama ölçütü",
  "Specify the version of the Kafka cluster":
    "Kafka kümesinin sürümünü belirtin",
  "Specify the version of the Kafka cluster e.g '2.2.0'":
    "Kafka kümesinin sürümünü belirtin, örneğin '2.2.0'",
  "Speed Test results:": "Hız Testi sonuçları:",
  Speedtest: "Hız testi",
  "Speedtest in progress...": "Hız testi devam ediyor...",
  "Staging directory for undelivered messages e.g. '/home/events'":
    "Teslim edilmeyen mesajlar için hazırlama dizini, ör. '/home/events'",
  "STANDARD_IA,REDUCED_REDUNDANCY etc": "STANDARD_IA,REDUCED_REDUNDANCY vb.",
  Start: "Başlat",
  "Start Health Report": "Sağlık Raporunu Başlat",
  "Start Logs": "Günlükleri Başlat",
  "Start Profiling": "Profil Oluşturmaya Başlayın",
  "Start Time:": "Başlangıç Zamanı:",
  "Start typing to filter objects in the bucket":
    "Kovadaki nesneleri filtrelemek için yazmaya başlayın",
  "Start typing to filter versions of {file}":
    "{file} sürümlerini filtrelemek için yazmaya başlayın",
  "Start typing to search for a Policy":
    "Politika aramak için yazmaya başlayın",
  "Start typing to search for Groups": "Grupları aramak için yazmaya başlayın",
  Statements: "İfadeler",
  Status: "Durum",
  "Status Code": "Durum Kodu",
  Stop: "Durdur",
  "Stop Logs": "Günlükleri Durdur",
  "Stop Profiling": "Profil Oluşturmayı Durdur",
  Storage: "Depolama",
  "Storage Class": "Depolama Sınıfı",
  Streaming: "Yayın",
  "Streaming async": "Eşzamansız akış",
  "Streaming Cluster ID": "Yayın Kümesi ID",
  "Streaming max publish ACKS in flight":
    "Devam eden maksimum yayın ACK sayısı",
  Subject: "Konu",
  "Subscribe To Bucket Events": "Kova Etkinliklerine Abone Olun",
  "Subscribe to Event": "Etkinliğe Abone Ol",
  Success: "Başarı",
  "Successfully deleted.": "Başarıyla silindi.",
  "Successfully updated the password for the user {user}.":
    "{user} kullanıcısının şifresi başarıyla güncellendi.",
  "Successfully updated the password.": "Şifre başarıyla güncellendi.",
  Suffix: "Sonek",
  Summary: "Özet",
  "Supported API endpoints": "Desteklenen API uç noktaları",
  Suspended: "Askıya alındı",
  Synced: "Eşitlendi",
  Synchronous: "Senkron",
  "System Health Info": "Sistem Sağlık Bilgisi",
  Table: "Tablo",
  "Tag for: {object}": "Etiket: {object}",
  "Tag Key": "Etiket Anahtarı",
  "Tag Label": "Etiket Değeri",
  "Tag Value": "Etiket Değeri",
  Tags: "Etiketler",
  "Tags for: {object}": "Etiketler: {object}",
  "Tags:": "Etiketler:",
  "Target Bucket": "Hedef Kova",
  "Target URL": "Hedef URL",
  "The bucket selected in this deployment acts as the “source” while the configured remote deployment acts as the “target”.":
    'Bu dağıtımda seçilen kova "kaynak" görevi görürken yapılandırılmış uzaktan dağıtım "hedef" görevi görür.',
  "The file must be valid and  should have valid config values":
    "Dosya geçerli olmalı ve geçerli yapılandırma değerlerine sahip olmalıdır",
  "The file you are trying to download has a long name.":
    "İndirmeye çalıştığınız dosyanın adı uzun.",
  "The following Bucket features will NOT be replicated":
    "Aşağıdaki Kova özellikleri KOPYALANMAYACAKTIR",
  "The following changes are replicated to all other sites":
    "Aşağıdaki değişiklikler diğer tüm sitelere çoğaltılır",
  "The following URL lets you share this object without requiring a login.":
    "Aşağıdaki URL, bu nesneyi giriş yapmanıza gerek kalmadan paylaşmanıza olanak tanır.",
  "The current version of this object is a delete marker and cannot be shared.":
    "Bu nesnenin mevcut sürümü bir silme işaretidir ve paylaşılamaz.",
  "The selected object version could not be found. Refresh the object list and try again.":
    "Seçilen nesne sürümü bulunamadı. Nesne listesini yenileyin ve tekrar deneyin.",
  "This server does not expose object versions; only the current object can be shared.":
    "Bu sunucu nesne sürümlerini açığa çıkarmaz; yalnızca geçerli nesne paylaşılabilir.",
  "The instance needs to be restarted for configuration changes to take effect.":
    "Yapılandırma değişikliklerinin geçerli olması için sunucu örneğinin yeniden başlatılması gerekiyor.",
  "The MinIO name is used here solely to identify the origin of the source code and to describe compatibility — {notice}.":
    "MinIO adı burada yalnızca kaynak kodunun kaynağını tanımlamak ve uyumluluğu açıklamak için kullanılmıştır — {notice}.",
  "The selected users were added to the following groups.":
    "Seçilen kullanıcılar aşağıdaki gruplara eklendi.",
  "The server is restarting.": "Sunucu yeniden başlatılıyor.",
  "The URL expires automatically at the earlier of your configured time ({time}) or the expiration of your current web session.":
    "URL, yapılandırdığınız süreden ({time}) daha erken olduğunda veya mevcut web oturumunuzun sona ermesinden önce otomatik olarak sona erer.",
  "There are no Configurations yet.": "Henüz Konfigürasyon yok.",
  "There are no endpoints yet.": "Henüz bitiş noktası yok.",
  "There are no Groups with this Policy associated yet.":
    "Henüz bu Politikayla ilişkilendirilmiş Grup yok.",
  "There are no Groups yet.": "Henüz Grup yok.",
  "There are no Policies yet.": "Henüz Politika bulunmamaktadır.",
  "There are no tags for this object": "Bu nesne için etiket yok",
  "There are no User Access Keys yet.": "Henüz Kullanıcı Erişim Anahtarı yok.",
  "There are no Users with this Policy associated yet.":
    "Henüz bu Politikayla ilişkilendirilmiş Kullanıcı yok.",
  "There are no Users yet.": "Henüz Kullanıcı yok.",
  "There is no information with this criteria":
    "Bu kritere uygun bilgi bulunmamaktadır",
  "There was an error": "Bir hata oluştu",
  "There was an error creating a Policy ":
    "Politika oluşturulurken bir hata oluştu",
  "There was an error creating a Policy: {details}. Please check Policy syntax.":
    "Politika oluşturulurken bir hata oluştu: {details}. Lütfen Politika sözdizimini kontrol edin.",
  "There was an error deleting the tier": "Katman silinirken bir hata oluştu",
  "There was an error retrieving tier information":
    "Katman bilgileri alınırken bir hata oluştu",
  "There was an error updating the Policy ":
    "Politika güncellenirken bir hata oluştu",
  "There was an error updating the Policy: {details}. Please check Policy syntax.":
    "Politika güncellenirken bir hata oluştu: {details}. Lütfen Politika sözdizimini kontrol edin.",
  "These features are unavailable in a single-disk setup.":
    "Bu özellikler tek diskli kurulumda mevcut değildir.",
  "This action is irreversible.": "Bu eylemin geri dönüşü yoktur.",
  "This can cause issues on Windows Systems by trimming the file name after download.":
    "Bu, indirme sonrasında dosya adının kısaltılması nedeniyle Windows Sistemlerinde sorunlara neden olabilir.",
  "This configuration cannot be deleted using this module as this was set using OpenID environment variables.":
    "Bu yapılandırma, OpenID ortam değişkenleri kullanılarak ayarlandığından bu modül kullanılarak silinemez.",
  "this Console": "bu Konsol",
  "This feature allows multiple independent SILO sites (or clusters) that are using the same external IDentity Provider (IDP) to be configured as replicas. In this situation the set of replica sites are referred to as peer sites or just sites.":
    "Bu özellik, aynı harici Kimlik Sağlayıcıyı (IDP) kullanan birden fazla bağımsız SILO sitenin (veya kümenin) kopya olarak yapılandırılmasına olanak tanır. Bu durumda, kopya siteler kümesine eş siteler veya yalnızca siteler adı verilir.",
  "This feature is not available for a single-disk setup.":
    "Bu özellik tek diskli kurulumda mevcut değildir.",
  "This feature is not available.": "Bu özellik mevcut değil.",
  "This field is required": "Bu alan zorunludur",
  "This is a File Preview for the first {count} pages of the document, if you wish to work with the full document please download instead.":
    "Bu, belgenin ilk {count} sayfası için bir Dosya Önizlemesidir; belgenin tamamıyla çalışmak istiyorsanız lütfen bunun yerine indirin.",
  "This location is empty": "Bu konum boş",
  "This location is empty, please try uploading a new file":
    "Bu konum boş, lütfen yeni bir dosya yüklemeyi deneyin",
  "This Site": "Bu Site",
  "This site/cluster": "Bu site/küme",
  "This Usage value is comparable to {command} which represents the size of all object versions that exist in the buckets.":
    "Bu Kullanım değeri, kovalarda bulunan tüm nesne sürümlerinin boyutunu temsil eden {command} ile karşılaştırılabilir.",
  "This value is set from the {env} environment variable":
    "Bu değer {env} ortam değişkeninden ayarlanır",
  "This value is set from the {name} environment variable":
    "Bu değer {name} ortam değişkeninden ayarlanır",
  "This will be displayed only once. It cannot be recovered.":
    "Yalnızca bir kez gösterilir. Daha sonra kurtarılamaz.",
  "This will change your Console password. Please note your new password down, as it will be required to log into Console after this session.":
    "Bu Konsol şifrenizi değiştirecektir. Bu oturumdan sonra Konsol'da oturum açmanız gerekeceğinden lütfen yeni şifrenizi bir kenara not edin.",
  "This will remove the object as well as all of its versions,":
    "Bu işlem, nesneyi ve tüm sürümlerini kaldıracaktır,",
  "This will remove the objects as well as all of their versions,":
    "Bu işlem, nesneleri ve tüm sürümlerini kaldıracaktır,",
  Tier: "Katman",
  "Tier Name": "Katman Adı",
  "Tier Types": "Katman Türleri",
  "Tiers are used by the SILO Object Lifecycle Management which allows creating rules for time or date based automatic transition or expiry of objects. For object transition, SILO automatically moves the object to a configured remote storage tier.":
    "Katmanlar, nesnelerin zaman veya tarih bazlı otomatik geçişi veya sona ermesi için kurallar oluşturmaya izin veren SILO Nesne Yaşam Döngüsü Yönetimi tarafından kullanılır. Nesne geçişi için SILO nesneyi otomatik olarak yapılandırılmış bir uzak depolama katmanına taşır.",
  "Time duration between scanner cycles, defaults to '1m'":
    "Tarayıcı döngüleri arasındaki süre, varsayılan olarak '1m'dir",
  "Time to Response NS": "Yanıt Zamanı NS",
  Timestamp: "Zaman Damgası",
  "TLS Client Auth": "TLS İstemci Kimlik Doğrulaması",
  "TLS skip verify": "TLS doğrulamayı atla",
  "TLS Skip Verify": "TLS Doğrulamayı Atla",
  "To allow Bucket access without credentials, use the {anonymous} setting":
    "Kimlik bilgileri olmadan Kova erişimine izin vermek için {anonymous} ayarını kullanın",
  "To continue please type {phrase} in the box.":
    "Devam etmek için lütfen kutuya {phrase} yazın.",
  "To enable this feature you need to enable versioning on the bucket before creation":
    "Bu özelliği etkinleştirmek için oluşturmadan önce kovada sürüm oluşturmayı etkinleştirmeniz gerekir",
  "To Tier": "Hedef Katman",
  "Today, {time}": "Bugün, {time}",
  "Toggle Share URL between Console and object server URL. Change default with CONSOLE_SHARE_MINIO_URL environment variable":
    "Paylaşım URL'sini Konsol ve nesne sunucusu URL'si arasında değiştirin. CONSOLE_SHARE_MINIO_URL ortam değişkeniyle varsayılanı değiştirin",
  Token: "Jeton",
  "Toogle JSON": "JSON Görünümünü Değiştir",
  "Toogle Share URL": "Paylaşım URL'sini Değiştir",
  Topic: "Konu",
  "Trace Results": "İzleme Sonuçları",
  "trademark notice": "ticari marka bildirimi",
  Transition: "Geçiş",
  "Transition Days": "Geçiş Günleri",
  True: "Doğru",
  "Trust server TLS without verification":
    "Doğrulama olmadan sunucu TLS sertifikasına güven",
  'Trust server TLS without verification, defaults to "on" (verify)':
    'Doğrulama olmadan sunucu TLS sertifikasına güven, varsayılan olarak "on"dur (doğrula)',
  Type: "Tür",
  "Type New Password Again": "Yeni Şifrenizi Tekrar Yazın",
  "Type of Lifecycle": "Yaşam Döngüsü Türü",
  "Types to profile:": "Profil türleri:",
  "Unable to download widget data": "Widget verileri indirilemiyor",
  "Unable to download widget data - data not available":
    "Widget verileri indirilemiyor - veriler mevcut değil",
  "Under section 13 of the AGPL, the corresponding source for this running version is offered to every user who interacts with it over a network, at no charge.":
    "AGPL'nin 13. bölümü uyarınca, bu çalışan sürüme karşılık gelen kaynak kodu, bir ağ üzerinden onunla etkileşime giren her kullanıcıya ücretsiz olarak sunulmaktadır.",
  "Understand which {policies} and {users} are authorized to access this Bucket.":
    "Hangi {policies} ve {users} öğelerinin bu Kovaya erişim yetkisine sahip olduğunu anlayın.",
  "Unexpected response, download incomplete.":
    "Beklenmeyen yanıt, indirme işlemi tamamlanmadı.",
  Unhealthy: "Sağlıksız",
  "Unique descriptive string for this destination":
    "Bu hedef için benzersiz açıklayıcı dize",
  "Unique ID for NATS streaming cluster": "NATS akış kümesi için benzersiz ID",
  "Update Credentials - {type} / {name}":
    "Kimlik Bilgilerini Güncelle - {type} / {name}",
  "Upload File": "Dosya Yükle",
  "Upload Files": "Dosya Yükle",
  "upload files to this bucket": "dosyaları bu kovaya yükle",
  "Upload Folder": "Klasör Yükle",
  "Upload is restricted.": "Yükleme sınırlıdır.",
  "Upload not allowed": "Yüklemeye izin verilmiyor",
  "upload objects to this location": "nesneleri bu konuma yükleyin",
  "Upstream copyright, authorship and license notices are retained in the repository's {credits} and {notice}. See the {attribution}.":
    "Yukarı akış telif hakkı, yazarlık ve lisans bildirimleri veri deposunun {credits} ve {notice} dosyalarında tutulur. Bkz. {attribution}.",
  "upstream MinIO code": "yukarı akış MinIO kodu",
  "Usage Data Age": "Kullanım Verileri Yaşı",
  "Usage:": "Kullanımı:",
  "Use Original Name": "Orijinal Adını Kullan",
  "Use SASL": "SASL Kullan",
  "Use secure medium to share this key.":
    "Bu anahtarı paylaşmak için güvenli ortamı kullanın.",
  "Use TLS": "TLS Kullan",
  "Used to confirm a non-idempotent action.":
    "İdempotent olmayan bir eylemi onaylamak için kullanılır.",
  "User Access Keys": "Kullanıcı Erişim Anahtarları",
  "User Agent": "Kullanıcı Aracısı",
  "User Details - {user}": "Kullanıcı Detayları - {user}",
  "User DN Search Base DN is required":
    "Kullanıcı DN Arama Tabanı DN gereklidir",
  "User DN Search Filter is required": "Kullanıcı DN Arama Filtresi gerekli",
  "User Mappings": "Kullanıcı Eşlemeleri",
  "User Name": "Kullanıcı Adı",
  "Username for SASL/PLAIN or SASL/SCRAM authentication":
    "SASL/PLAIN veya SASL/SCRAM kimlik doğrulaması için kullanıcı adı",
  "Users inherit access permissions to data and resources through the groups they belong to.":
    "Kullanıcılar, ait oldukları gruplar aracılığıyla verilere ve kaynaklara erişim izinlerini devralır.",
  "Users with this Policy associated": "Bu Politikayla ilişkili kullanıcılar",
  Validity: "Geçerlilik",
  "Validity:": "Geçerlilik:",
  Version: "Sürüm",
  "Version ID:": "Sürüm ID:",
  "Versioning is required to enable {objectLocking} and {retention}.":
    "{objectLocking} ve {retention}'yi etkinleştirmek için sürüm oluşturma gereklidir.",
  "Versioning on Bucket": "Kovada Sürüm Oluşturma",
  "Versioning setting cannot be changed as cluster replication is enabled for this site.":
    "Bu site için küme çoğaltma etkinleştirildiğinden sürüm oluşturma ayarı değiştirilemez.",
  "Versioning Status": "Sürüm Oluşturma Durumu",
  versions: {
    one: "sürüm",
    other: "sürüm",
  },
  Versions: {
    one: "sürüm",
    other: "sürüm",
  },
  "Versions:": "Sürümler:",
  View: "Görüntüle",
  "View across sites": "Siteler arasında görüntüle",
  "View Bucket Naming Rules": "Kova Adlandırma Kurallarını Görüntüle",
  "View env variable Webhook": "Ortam değişkeni Webhook'unu görüntüle",
  "view Objects in this bucket": "bu kovadaki Nesneleri görüntüleme",
  "view Policy details": "Politika ayrıntılarını görüntüle",
  "View Replication Status for a:":
    "Aşağıdakiler için Çoğaltma Durumunu Görüntüle:",
  "view User details": "Kullanıcı ayrıntılarını görüntüle",
  "Visit the SILO website": "SILO web sitesini ziyaret edin",
  "Volume or Bucket Name": "Birim veya Kova Adı",
  "Volume/Bucket name cannot start with /": "Birim/kova adı / ile başlayamaz",
  Warning: "Uyarı",
  "Warning: One or more users selected has associated Access Keys.":
    "Uyarı: Seçilen bir veya daha fazla kullanıcının ilişkili Erişim Anahtarları var.",
  "Warning! The resulting file will contain server configuration information in plain text":
    "Uyarı! Ortaya çıkan dosya, sunucu yapılandırma bilgilerini düz metin olarak içerecektir",
  "We recommend to rename the file download":
    "İndirilen dosyanın adını değiştirmenizi öneririz",
  "Webhook server endpoint e.g. http://localhost:8080/silo/events":
    "Webhook sunucu uç noktası ör. http://localhost:8080/silo/events",
  week: "hafta",
  weeks: {
    one: "hafta",
    other: "hafta",
  },
  "What are Event Destinations?": "Etkinlik Hedefleri Nelerdir?",
  "Would you like to encrypt {object}?":
    "{object} nesnesini şifrelemek ister misiniz?",
  "Write Policy": "Yazma Politikası",
  "Write these down, as this is the only time the secret will be displayed.":
    "Bunları bir yere yazın çünkü bu, sırrın görüntüleneceği tek zamandır.",
  writeonly: "salt yazılabilir",
  year: "yıl",
  years: {
    one: "yıl",
    other: "yıl",
  },
  Years: "Yıllar",
  Yes: "Evet",
  "Yes, I am sure": "Evet eminim",
  "You can add a comment to this setting": "Bu ayara yorum ekleyebilirsiniz",
  "You can add policies to the group by selecting it from the Groups view after creation. The Policy view lets you manage the assigned policies for the group.":
    "Gruba, oluşturulduktan sonra Gruplar görünümünden seçerek politikalar ekleyebilirsiniz. Politika görünümü, gruba atanmış politikaları yönetmenizi sağlar.",
  "You can choose to {excludePrefixes} from versioning if Object Locking is not enabled.":
    "Nesne Kilitleme etkin değilse sürüm oluşturmadan {excludePrefixes} seçeneğini seçebilirsiniz.",
  "You can download the the Health report JSON File.":
    "Sağlık raporu JSON Dosyasını indirebilirsiniz.",
  "You can increase the maximum configuration time by setting the MINIO_STS_DURATION environment variable on all your nodes.":
    "Tüm düğümlerinizde MINIO_STS_DURATION ortam değişkenini ayarlayarak maksimum yapılandırma süresini artırabilirsiniz.",
  "You can learn more at the {documentation}.":
    "Daha fazlasını {documentation} adresinden öğrenebilirsiniz.",
  "You can learn more at the {link}.":
    "Daha fazlasını {link} adresinden öğrenebilirsiniz.",
  "You can only enable {objectLocking} when first creating a bucket.":
    "{objectLocking}'yi yalnızca ilk kez bir kova oluştururken etkinleştirebilirsiniz.",
  "You can reset your session by logging out and logging back in to the web UI.":
    "Web arayüzünden (UI) çıkış yapıp tekrar giriş yaparak oturumunuzu sıfırlayabilirsiniz.",
  "You can specify an optional JSON-formatted IAM policy to further restrict Access Key access to a subset of the actions and resources explicitly allowed for the parent user. Additional access beyond that of the parent user cannot be implemented through these policies.":
    "Erişim Anahtarı erişimini üst kullanıcı için açıkça izin verilen eylemlerin ve kaynakların bir alt kümesiyle daha da kısıtlamak için isteğe bağlı bir JSON-biçimli IAM politika belirleyebilirsiniz. Bu politikalar aracılığıyla ana kullanıcının erişiminin ötesinde ek erişim uygulanamaz.",
  "You can use '*' to match any character, '.' to signify a single character or '\\' to scape an special character (E.g. mybucket-*)":
    "Herhangi bir karakterle eşleştirmek için '*', tek bir karakteri belirtmek için '.' veya özel bir karakteri kaçırmak için '\\' kullanabilirsiniz (Örn. mybucket-*)",
  "You can use {mcShare} as an alternative to this UI, where the session length does not limit the URL validity.":
    "Oturum uzunluğunun URL geçerliliğini sınırlamadığı bu UI'ye alternatif olarak {mcShare} kullanabilirsiniz.",
  "You cannot delete the currently logged in User":
    "Oturum açmış kullanıcıyı silemezsiniz",
  "You cannot enable or disable the currently logged in User":
    "Şu anda oturum açmış olan Kullanıcıyı etkinleştiremez veya devre dışı bırakamazsınız",
  "You cannot modify the optional Access Key IAM policy after saving.":
    "İsteğe bağlı Erişim Anahtarı IAM politikasını kaydettikten sonra değiştiremezsiniz.",
  "You may only have write access on a limited set of subpaths within this path. Please carefully review your User permissions to understand the paths to which you may write.":
    "Bu yol içindeki yalnızca sınırlı sayıda alt yola yazma erişiminiz olabilir. Yazabileceğiniz yolları anlamak için lütfen Kullanıcı izinlerinizi dikkatlice inceleyin.",
  "You must apply a valid name to the bucket":
    "Kovaya geçerli bir ad uygulamanız gerekir",
  "You must disable Object Locking before Versioning can be disabled":
    "Sürüm Oluşturmanın devre dışı bırakılabilmesi için Nesne Kilitlemeyi devre dışı bırakmalısınız",
  "You must disable Retention before Object Locking can be disabled":
    "Nesne Kilitlemenin devre dışı bırakılabilmesi için Saklama özelliğini devre dışı bırakmalısınız",
  "You need to select at least one group to assign":
    "Atamak için en az bir grup seçmelisiniz",
  "You require additional permissions in order to {name}. Please ask your SILO administrator to grant you {scopes} permission in order to {name}.":
    "{name} için ek izinlere ihtiyacınız var. Lütfen SILO yöneticinizden {name} için size {scopes} izni vermesini isteyin.",
  "You require additional permissions in order to {name}. Please ask your SILO administrator to grant you {scopes} permissions in order to {name}.":
    "{name} için ek izinlere ihtiyacınız var. Lütfen SILO yöneticinizden {name} için size {scopes} izinleri vermesini isteyin.",
  "You require additional permissions in order to create a new Tier. Please ask your SILO administrator to grant you {permission} permission in order to create a Tier.":
    "Yeni bir Katman oluşturmak için ek izinlere ihtiyacınız var. Lütfen SILO yöneticinizden bir Katman oluşturmak için size {permission} izni vermesini isteyin.",
  "File is empty": "Dosya boş",
  "Invalid UTF-8 or binary content": "Geçersiz UTF-8 veya ikili içerik",
  "Loading text preview…": "Metin önizlemesi yükleniyor…",
  "Object not found or changed": "Nesne bulunamadı veya değişti",
  "Text preview content": "Metin önizleme içeriği",
  "Text preview failed": "Metin önizlemesi başarısız oldu",
  "Text preview forbidden": "Metin önizlemesi yasaktır",
  "The object could not be found or changed while the preview was loading.":
    "Önizleme yüklenirken nesne bulunamadı veya bu sırada değişti.",
  "The text preview could not be loaded because of a network or server error.":
    "Bir ağ veya sunucu hatası nedeniyle metin önizlemesi yüklenemedi.",
  "This object is not valid UTF-8 text or contains binary data. Download it to inspect the original bytes.":
    "Bu nesne geçerli UTF-8 metin değil veya ikili veri içeriyor. Orijinal baytları incelemek için indirin.",
  "You do not have permission to preview this object.":
    "Bu nesneyi önizleme izniniz yok.",
  Trademark: "Ticari Marka",
  License: "Lisans",
  "Corresponding source for this build": "Bu yapı için ilgili kaynak",
  "The exact corresponding source is not available for this build: {reason}. See the NOTICE for how to obtain it.":
    "Bu yapı için tam karşılık gelen kaynak mevcut değil: {reason}. Nasıl elde edileceğini öğrenmek için NOTICE'ye bakın.",
  "Source: not available for this build": "Kaynak: bu yapı için mevcut değil",
  "Items per page": "Sayfa başına öğe",
  "First page": "İlk sayfa",
  "Previous page": "Önceki sayfa",
  "Next page": "Sonraki sayfa",
  "{count} items in total": "Toplam {count} öğe",
  "Page {page} · {count} on this page": "Sayfa {page} · {count} bu sayfada",
  "Sorting, filtering and select all apply to this page only.":
    "Sıralama, filtreleme ve tümünü seçme yalnızca bu sayfa için geçerlidir.",
  "No objects match the filter": "Filtreyle eşleşen nesne yok",
  "No objects on this page match the filter":
    "Bu sayfada filtreyle eşleşen nesne yok",
  "Showing the first {count} entries; the listing stopped at the row or time limit.":
    "İlk {count} giriş gösteriliyor; listeleme satır veya süre sınırında durduruldu.",
  "Start typing to filter objects on this page":
    "Bu sayfadaki nesneleri filtrelemek için yazmaya başlayın",
  "Lists and tabs": "Listeler ve sekmeler",
  "Move through rows with the pointer or keyboard. Arrow keys focus tabs; Enter or Space opens them.":
    "İşaretçiyi veya klavyeyi kullanarak satırlar arasında hareket edin. Ok tuşları sekmelere odaklanır; Enter veya Space bunları açar.",
  "Browse and select stored objects.": "Saklanan nesnelere göz atın ve seçin.",
  "Review stored object versions.": "Saklanan nesne sürümlerini inceleyin.",
  "Manage bucket settings.": "Kova ayarlarını yönetin.",
  "Compact section tabs": "Kompakt bölüm sekmeleri",
  "Storage and object usage": "Depolama ve nesne kullanımı",
  "Recent storage activity": "Son depolama etkinliği",
  "Example buckets": "Örnek kovalar",
  "Select all objects": "Tüm nesneleri seç",
  Select: "Seç",
  Settings: "Ayarlar",
  Overview: "Genel Bakış",
  Activity: "Etkinlik",
  "No matching results": "Eşleşen sonuç yok",
  "Try a different search or clear the filters to see all items.":
    "Farklı bir arama yapmayı deneyin veya tüm öğeleri görmek için filtreleri temizleyin.",
  "Clear filters": "Filtreleri temizle",
  "No users yet": "Henüz kullanıcı yok",
  "Users authenticate with an access key and secret key, and receive permissions through policies and groups.":
    "Kullanıcılar bir erişim anahtarı ve gizli anahtarla kimliklerini doğrular ve politikalar ve gruplar aracılığıyla izinler alırlar.",
  "Create user": "Kullanıcı oluştur",
  "No access keys yet": "Henüz erişim anahtarı yok",
  "Access keys let applications connect with the permissions of your account.":
    "Erişim anahtarları, uygulamaların hesabınızın izinleriyle bağlanmasını sağlar.",
  "Access keys let applications connect with the permissions assigned to this user.":
    "Erişim anahtarları, uygulamaların bu kullanıcıya atanan izinlerle bağlanmasına olanak tanır.",
  "No groups assigned": "Hiçbir grup atanmadı",
  "Add this user to a group to share its access policies.":
    "Erişim politikalarını paylaşmak için bu kullanıcıyı bir gruba ekleyin.",
  "No policies assigned": "Hiçbir politika atanmadı",
  "Policies define which actions and resources this user can access.":
    "Politikalar bu kullanıcının hangi işlemlere ve kaynaklara erişebileceğini tanımlar.",
  "No members yet": "Henüz üye yok",
  "Add users to this group so they inherit its policies.":
    "Kullanıcıları bu gruba ekleyerek politikalarını devralmalarını sağlayın.",
  "Policies attached to this group apply to all its members.":
    "Bu gruba eklenen politikalar tüm üyeler için geçerlidir.",
  "No encryption keys yet": "Henüz şifreleme anahtarı yok",
  "Create a key to encrypt objects with the configured key management service.":
    "Yapılandırılmış anahtar yönetimi hizmetiyle nesneleri şifrelemek için bir anahtar oluşturun.",
  "No groups yet": "Henüz grup yok",
  "Groups let users share the same access policies.":
    "Gruplar, kullanıcıların aynı erişim politikalarını paylaşmasına olanak tanır.",
  "No event destinations yet": "Henüz etkinlik hedefi yok",
  "Connect an external service to receive bucket and object notifications.":
    "Kova ve nesne bildirimlerini almak için harici bir hizmete bağlanın.",
  "No storage tiers yet": "Henüz depolama katmanı yok",
  "Connect remote storage to transition objects using lifecycle rules.":
    "Yaşam döngüsü kurallarını kullanarak nesneleri taşımak için uzak depolama bağlayın.",
  "No event subscriptions yet": "Henüz etkinlik aboneliği yok",
  "Subscribe this bucket to send object events to an event destination.":
    "Nesne olaylarını bir olay hedefine göndermek için bu kovaya abone olun.",
  "No replication rules yet": "Henüz çoğaltma kuralı yok",
  "Replicate objects from this bucket to a destination bucket.":
    "Nesneleri bu kovadan hedef kovaya çoğaltın.",
  "No lifecycle rules yet": "Henüz yaşam döngüsü kuralı yok",
  "Create rules to expire objects or transition them to remote storage.":
    "Nesnelerin süresinin dolması veya uzak depolamaya aktarılması için kurallar oluşturun.",
  "No anonymous access rules": "Anonim erişim kuralı yok",
  "This bucket has no prefix rules for access without credentials.":
    "Bu kovanın, kimlik bilgileri olmadan erişim için önek kuralları yoktur.",
  "No policies grant access": "Hiçbir politika erişim izni vermiyor",
  "No listed policy currently grants access to this bucket.":
    "Listelenen hiçbir politika şu anda bu kovaya erişim izni vermiyor.",
  "No users have access": "Hiçbir kullanıcının erişimi yok",
  "No listed user currently has a policy granting access to this bucket.":
    "Listelenen hiçbir kullanıcının şu anda bu kovaya erişim izni veren bir politikası yok.",
  "View Policies": "Politikaları Görüntüle",
  "View Users": "Kullanıcıları Görüntüle",
  "Unable to load replication sites": "Çoğaltma siteleri yüklenemiyor",
  "No replication sites yet": "Henüz çoğaltma sitesi yok",
  "Refresh to try loading the configured sites again.":
    "Yapılandırılmış siteleri tekrar yüklemeyi denemek için yenileyin.",
  "Connect independent SILO sites to replicate their data and identity configuration.":
    "Verilerini ve kimlik yapılandırmalarını kopyalamak için bağımsız SILO siteleri bağlayın.",
  "Waiting for logs": "Günlükler bekleniyor",
  "Logs are not running": "Günlükler çalışmıyor",
  "New log entries will appear here as the server emits them.":
    "Sunucu bunları yayınladıkça yeni günlük girişleri burada görünecektir.",
  "Choose the nodes and log types, then start logs to see server activity.":
    "Düğümleri ve günlük türlerini seçin, ardından sunucu etkinliğini görmek için günlükleri başlatın.",
  "Waiting for trace events": "İzleme olayları bekleniyor",
  "Trace is not running": "İzleme çalışmıyor",
  "Requests matching the selected calls and filters will appear here.":
    "Seçilen çağrı ve filtrelerle eşleşen istekler burada görünecektir.",
  "Choose the calls and filters, then start tracing to inspect live requests.":
    "Çağrıları ve filtreleri seçin, ardından canlı istekleri incelemek için izlemeye başlayın.",
  "{count} node": "{count} düğüm",
  "{count} nodes": {
    one: "{count} düğüm",
    other: "{count} düğüm",
  },
  "{count} drive": "{count} sürücü",
  "{count} drives": {
    one: "{count} sürücü",
    other: "{count} sürücü",
  },
  "Quota: {quota}": "Kota: {quota}",
  "Open bucket {name}": "{name} kovasını aç",
  "Recent buckets": "Son kovalar",
  "Read and write": "Okuma ve yazma",
  "Read only": "Salt okunur",
  "Write only": "Yalnızca yaz",
  "Created {date}": "Oluşturuldu {date}",
  "{count} objects": "{count} nesne",
  "Bucket actions": "Kova eylemleri",
  "Open menu": "Menüyü aç",
  "Page actions": "Sayfa işlemleri",
  "Selected actions": "Seçilen eylemler",
  "Parent paths": "Ana yollar",
  "create Groups": "Gruplar oluştur",
  "view Group details": "Grup ayrıntılarını görüntüle",
  "configure event destinations": "etkinlik hedeflerini yapılandırma",
  "update Tier credentials": "Katman kimlik bilgilerini güncelleme",
  "delete Tiers": "Katmanları sil",
  "manage Access Keys": "Erişim Anahtarlarını yönet",
};

export default messages;
