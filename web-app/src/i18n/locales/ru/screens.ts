// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
// AI-assisted translation; see ../../README.md for review and maintenance.

import type { Dictionary } from "../../catalog";

const messages: Dictionary = {
  "Users inherit policies from their groups. Access is denied unless explicitly granted.":
    "Пользователи наследуют политики от своих групп. Доступ запрещен, если он явно не предоставлен.",
  "Policies define allowed actions and resources for users and groups.":
    "Политики определяют разрешенные действия и ресурсы для пользователей и групп.",
  "IAM policies": "Политики IAM",
  "Access keys inherit their parent user’s permissions. An inline policy can only restrict them further.":
    "Ключи доступа наследуют разрешения родительского пользователя. Встроенная политика может лишь еще больше ограничить их.",
  "Access keys": "Ключи доступа",
  "Configure a destination, then add bucket notification rules to send S3 events to it.":
    "Настройте получателя, а затем добавьте правила уведомлений бакета для отправки туда событий S3.",
  "Event destinations": "Получатели событий",
  "SILO version": "Версия SILO",
  "Raw JSON": "Исходный JSON",
  "Recursive inspections can be expensive. Limit the bucket and path before starting.":
    "Рекурсивные проверки могут быть ресурсоёмкими. Перед запуском ограничьте бакет и путь.",
  "Open Help for examples, or read the":
    "Откройте справку, чтобы просмотреть примеры, или прочитайте",
  Tasks: "Задачи",
  "Tasks: {count} running": "Задачи: {count} выполняется",
  "Close Tasks": "Закрыть задачи",
  "Object operations": "Операции с объектами",
  Running: "Выполняется",
  Finished: "Готово",
  Queued: "В очереди",
  Completed: "Завершено",
  "No running tasks": "Нет выполняющихся задач",
  "No finished tasks": "Нет завершённых задач",
  "Clear finished": "Очистить завершённые",
  "ZIP download": "Скачивание ZIP",
  "Browser handoff": "Передача в браузер",
  "Task progress": "Ход выполнения задачи",
  "Waiting for data": "Ожидание данных",
  "Remove task": "Удалить задачу",
  "Cancel task": "Отменить задачу",
  "Retry failed": "Повторить сбойные",
  "Open bucket/prefix": "Открыть бакет/префикс",
  "{done}/{total} completed · {failed} failed · {cancelled} cancelled":
    "{done}/{total} выполнено · {failed} не удалось · {cancelled} отменено",
  "{bytes} bytes received": "Получено {bytes} байт",
  "Handoff is complete; final download progress is unavailable here.":
    "Передача завершена; дальнейший ход загрузки здесь недоступен.",
  "Counts represent selected targets. Progress within a folder or version cleanup is unavailable.":
    "Счётчики отражают выбранные цели. Прогресс внутри папки или очистки версий недоступен.",
  "Completed changes remain in place. In-flight requests may have reached the server; inspect before repeating them.":
    "Выполненные изменения остаются в силе. Уже отправленные запросы могли достичь сервера — проверьте результат перед повтором.",
  "Review {count} results": "Просмотреть результаты ({count})",
  "Server outcome is unconfirmed. Inspect this object before another operation.":
    "Результат сервера не подтвержден. Осмотрите этот объект перед следующей операцией.",
  "Task failed: {name}": "Задача не выполнена: {name}",
  "Task completed: {name}": "Задача выполнена: {name}",
  "Open Tasks to inspect the results.":
    "Откройте Задачи, чтобы проверить результаты.",
  "The request failed. Inspect the object before trying again.":
    "Не удалось выполнить запрос. Осмотрите объект, прежде чем повторить попытку.",
  "Tasks are still running": "Задачи всё ещё выполняются",
  "Stay here": "Остаться здесь",
  "Cancel tasks and leave": "Отменить задачи и уйти",
  "Leave page": "Покинуть страницу",
  "Leaving this session cancels queued and running tasks. Changes already completed on the server remain in place.":
    "Выход из этого сеанса отменяет поставленные в очередь и запущенные задачи. Изменения, уже выполненные на сервере, остаются в силе.",
  "Tasks will continue in this session. You can check their progress in Tasks on another page.":
    "Задачи будут продолжены в этом сеансе. Вы можете проверить их прогресс в Задачах на другой странице.",
  "Delete Versions": "Удалить версии",
  "Cluster health": "Состояние кластера",
  "servers online": "серверов в сети",
  "{count} drives online": "Дисков в сети: {count}",
  "{count} server(s) offline": "Серверов не в сети: {count}",
  "{count} drive(s) offline": "Дисков не в сети: {count}",
  "{count} drive(s) healing": "Дисков восстанавливается: {count}",
  "Drive {drive} is at least 95% full. The server may reject writes.":
    "Диск {drive} заполнен как минимум на 95%. Сервер может отклонять запись.",
  "Drive {drive} is at least 85% full.":
    "Диск {drive} заполнен как минимум на 85%.",
  "Configuration changes are waiting for a server restart.":
    "Изменения конфигурации ожидают перезагрузки сервера.",
  "Some server or drive health information is unavailable.":
    "Некоторая информация о состоянии сервера или диска недоступна.",
  "Capacity is incomplete. Only reported drive measurements are shown.":
    "Данные о ёмкости неполные. Показаны только полученные измерения дисков.",
  "Generate health report": "Создать отчет о состоянии",
  "No servers reported": "Серверы не зарегистрированы",
  Server: "Сервер",
  "Just started": "Только началось",
  "Hide drives for {server}": "Скрыть диски для {server}",
  "Show drives for {server}": "Показать диски для {server}",
  "No drive information available": "Информация о дисках недоступна",
  "Drives on {server}": "Диски на {server}",
  "{used} / {total} used": "{used} / {total} использовано",
  "Drive usage: {drive}": "Использование диска: {drive}",
  "Refresh failed. The last received data is still shown.":
    "Не удалось обновить. Последние полученные данные по-прежнему отображаются.",
  "Could not load deployment information. Try refreshing.":
    "Не удалось загрузить информацию о развёртывании. Попробуйте обновить страницу.",
  "Deployment statistics": "Статистика развертывания",
  "of {total} raw capacity": "из {total} общей ёмкости",
  "{available} available": "{available} доступно",
  Data: "Данные",
  objects: "объекты",
  Alerts: "Оповещения",
  "Health information unavailable": "Сведения о состоянии недоступны",
  "All systems normal": "Все системы в норме.",
  "Quick actions": "Быстрые действия",
  "No quick actions available for your permissions.":
    "Для ваших разрешений не доступны быстрые действия.",
  "Read & write": "Читать и писать",
  "Delete bucket": "Удалить бакет",
  "Actions for {bucket}": "Действия для {bucket}",
  "Select {bucket}": "Выберите {bucket}",
  "Object lock": "Блокировка объекта",
  Created: "Создано",
  "Select all visible buckets": "Выбрать все видимые бакеты",
  "Bucket rows": "Строки бакетов",
  "The bucket list could not be loaded.":
    "Не удалось загрузить список бакетов.",
  "Select one or more buckets first.":
    "Сначала выберите один или несколько бакетов.",
  "configure the selected buckets": "настроить выбранные бакеты",
  "Search buckets": "Поиск бакетов",
  "Bucket view": "Вид бакета",
  Cards: "Карточки",
  "{count} buckets selected": {
    one: "Выбран {count} бакет",
    few: "Выбрано {count} бакета",
    many: "Выбрано {count} бакетов",
    other: "Выбрано {count} бакета",
  },
  "{count} bucket selected": "Выбран {count} бакет",
  "No buckets match “{q}”": "Нет бакетов, соответствующих «{q}»",
  "Clear filter": "Очистить фильтр",
  "Built-in · Modified": "Встроенный · Модифицированный",
  "Actions for {name}": "Действия для {name}",
  "Reset to default": "Сбросить по умолчанию",
  "Could not load policies": "Не удалось загрузить политики.",
  "Refresh to try again.": "Обновите страницу, чтобы повторить попытку.",
  "Create a policy to define permissions for users and groups.":
    "Создайте политику для определения разрешений для пользователей и групп.",
  "Could not update policy": "Не удалось обновить политику.",
  "Reset policy {name} to its default definition?":
    "Сбросить политику {name} к определению по умолчанию?",
  "The built-in policy will be restored to the SILO default definition.":
    "Встроенная политика будет восстановлена до определения SILO по умолчанию.",
  "Loading attachment information…": "Загрузка данных о привязке…",
  "This policy has changed or is no longer available. Refresh the list.":
    "Эта политика изменилась или больше не доступна. Обновите список.",
  "Attachment information is unavailable.": "Данные о привязке недоступны.",
  "This policy is attached to {users} users and {groups} groups.":
    "Эта политика привязана к {users} пользователям и {groups} группам.",
  "Their permissions will follow the default definition.":
    "Их разрешения будут соответствовать определению по умолчанию.",
  "They will lose the permissions it grants.":
    "Они потеряют предоставленные им разрешения.",
  "Could not load policy. Refresh to try again.":
    "Не удалось загрузить политику. Обновите, чтобы повторить попытку.",
  "Could not load policy": "Не удалось загрузить политику.",
  "Could not load users for this policy":
    "Не удалось загрузить пользователей для этой политики.",
  "Could not load groups for this policy":
    "Не удалось загрузить группы для этой политики.",
  "Built-in policies can be overridden by saving a modified version; you can reset it later.":
    "Встроенные политики можно переопределить, сохранив изменённую версию; позже её можно сбросить.",
  "Override policy": "Переопределить политику",
  "Cancel editing": "Отменить редактирование",
  "Direct policies": "Прямые политики",
  "Policies inherited through groups": "Политики, унаследованные через группы",
  "Access-key count is unavailable.": "Недоступно количество ключей доступа.",
  "Group policy information is unavailable.":
    "Информация о групповой политике недоступна.",
  "Also assigned directly": "Также назначается напрямую",
  "From groups:": "Из групп:",
  "Group policies could not be loaded.":
    "Не удалось загрузить групповые политики.",
  "Group is disabled; its policies are not inherited.":
    "Группа отключена; её политики не наследуются.",
  "Group status is unavailable; inherited permissions are unknown.":
    "Статус группы недоступен; унаследованные разрешения неизвестны.",
  "No inherited group policies": "Нет унаследованных групповых политик",
  "Some group policies are unavailable. Refresh to try again.":
    "Некоторые групповые политики недоступны. Обновите, чтобы повторить попытку.",
  "Could not load user": "Не удалось загрузить пользователя.",
  "Could not update user status": "Не удалось обновить статус пользователя.",
  "Edit replication": "Редактировать репликацию",
  "Page not found": "Страница не найдена",
  "Go to Buckets": "Перейти в Бакеты",
  "Go back": "Назад",
  "Read the documentation": "Прочтите документацию",
  "You do not have permission to view this page":
    "У вас нет разрешения на просмотр этой страницы.",
  "Ask your administrator for access. This page checks the following IAM actions:":
    "Обратитесь за доступом к своему администратору. На этой странице проверяются следующие действия IAM:",
  "Required IAM actions": "Необходимые действия IAM",
  "Encryption is not configured": "Шифрование не настроено.",
  "Configure KES or KMS on the SILO server to manage encryption keys in Console.":
    "Настройте KES или KMS на сервере SILO для управления ключами шифрования в консоли.",
  "Local identity management is unavailable":
    "Локальное управление идентификацией недоступно.",
  "LDAP is enabled. Manage users and groups in your LDAP directory; connection settings are available on the LDAP configuration page.":
    "LDAP включён. Управляйте пользователями и группами в каталоге LDAP; параметры подключения доступны на странице конфигурации LDAP.",
  "Tier creation is unavailable": "Создание уровня недоступно.",
  "This Console requires a distributed server setup to add a remote storage tier.":
    "Для этой консоли требуется настройка распределенного сервера для добавления удаленного уровня хранения.",
  "This page is unavailable in object browser mode":
    "Эта страница недоступна в режиме браузера объектов.",
  "This Console is configured for object browsing only. Ask your administrator to enable the full Console to use this page.":
    "Эта консоль настроена только для просмотра объектов. Попросите своего администратора включить полную консоль для использования этой страницы.",
  "Prometheus is configured but unreachable":
    "Prometheus настроен, но недоступен",
  "Check the Prometheus address, network access and authentication, then retry.":
    "Проверьте адрес Prometheus, доступ к сети и аутентификацию, затем повторите попытку.",
  "Advanced metrics need Prometheus":
    "Для расширенных метрик требуется Prometheus",
  "Configure Prometheus to collect SILO metrics, then set the URL for your deployment and restart the corresponding service.":
    "Настройте Prometheus для сбора метрик SILO, затем установите URL для вашего развертывания и перезапустите соответствующую службу.",
  "Standalone Console": "Автономная консоль",
  "Console embedded in SILO": "Консоль, встроенная в SILO",
  "Optional standalone settings": "Дополнительные настройки автономного режима",
  "Bearer token: ": "Bearer-токен: ",
  "Or basic authentication: ": "Или базовая аутентификация: ",
  "Embedded settings: ": "Встроенные настройки: ",
  Icons: "Иконки",
  "Create bucket": "Создать бакет",
  "Edit {label}": "Редактировать {label}",
  "Calculating…": "Вычисление…",
  "The server has not finished computing usage yet.":
    "Сервер ещё не завершил расчёт использования.",
  "Calculated {time}": "Рассчитано {time}",
  "Updated {time}": "Обновлено {time}",
  "Permission required": "Требуется разрешение",
  "Ask your administrator to grant the following IAM actions.":
    "Попросите администратора предоставить следующие действия IAM.",
  "More actions": "Еще действия",
  "Equivalent mcli command": "Эквивалент команды mcli",
  Copied: "Скопировано",
  "Copy failed. Select and copy the command.":
    "Не удалось скопировать. Выберите и скопируйте команду.",
  "Copy commands": "Скопировать команды",
  "Replace ALIAS with your configured mcli alias (for example, {alias}).":
    "Замените ALIAS настроенным вами псевдонимом mcli (например, {alias}).",
  "Replace ALIAS with your configured mcli alias.":
    "Замените ALIAS на настроенный вами псевдоним mcli.",
  "Loading…": "Загрузка…",
  "SILO primitives": "Примитивы SILO",
  "Shared building blocks for storage, identity and monitoring.":
    "Общие строительные блоки для хранения, идентификации и мониторинга.",
  "Healthy capacity": "Ёмкость в норме",
  "Capacity warning": "Предупреждение о емкости",
  "Above the 85% warning threshold": "Выше порога предупреждения 85%.",
  "Capacity critical": "Критическая емкость",
  "Above the 95% critical threshold": "Выше критического порога 95%",
  "Usage is calculated by the server.":
    "Использование рассчитывается сервером.",
  "View buckets": "Просмотр бакетов",
  "Status and values": "Статус и значения",
  "Built-in": "Встроенный",
  "Freshness and actions": "Актуальность и действия",
  "Select an object to inspect its details.":
    "Выберите объект, чтобы просмотреть его детали.",
  "Object details": "Подробности об объекте",
  "Demo action completed.": "Демонстрационное действие завершено.",
  "Select an object to download.": "Выберите объект для загрузки.",
  "Empty and unavailable states": "Пустые и недоступные состояния.",
  "No buckets yet": "Бакетов пока нет",
  "Create a bucket to start storing objects.":
    "Создайте бакет, чтобы начать хранить объекты.",
  "No matching objects": "Нет подходящих объектов.",
  "Try a different name or clear the search filter.":
    "Попробуйте другое имя или очистите фильтр поиска.",
  "Metrics are unavailable": "Метрики недоступны.",
  "Connect a Prometheus endpoint to view monitoring metrics.":
    "Подключите конечную точку Prometheus для просмотра показателей мониторинга.",
  "Loading rows": "Загрузка строк",
  "Command preview": "Предпросмотр команды",
  "Showing the first 1 MiB. Download the object to see the full file.":
    "Показаны первые 1 МиБ. Загрузите объект, чтобы увидеть полный файл.",
  "Showing first 500 rows": "Показаны первые 500 строк.",
  "Showing the first 100 columns. View Source or download the object to see all columns.":
    "Показаны первые 100 столбцов. Откройте исходный текст или скачайте объект, чтобы увидеть все столбцы.",
  Rendered: "Разметка",
  "Wrap lines": "Перенос строк",
  Row: "Строка",
  "CSV preview content": "Содержимое предпросмотра CSV",
  "Markdown preview content": "Содержимое предпросмотра Markdown",
  "Markdown rendering is unavailable for this content. Showing the source instead.":
    "Отрисовка Markdown для этого содержимого недоступна. Показан исходный текст.",
  "Image: {alt}": "Изображение: {alt}",
  Image: "Изображение",
  Actions: "Действия",
  "Select version": "Выбрать версию",
  "This version is a delete marker.": "Эта версия является маркером удаления.",
  "You need s3:GetObject permission.": "Вам нужно разрешение s3:GetObject.",
  "You need s3:GetObjectVersion permission.":
    "Вам нужно разрешение s3:GetObjectVersion.",
  "Preview is not available for this file type.":
    "Предпросмотр недоступен для этого типа файлов.",
  "Object Lock is not enabled on this bucket.":
    "Блокировка объектов не включена для этого бакета.",
  "You need s3:PutObjectLegalHold permission.":
    "Вам нужно разрешение s3:PutObjectLegalHold.",
  "You need s3:PutObjectRetention permission.":
    "Вам нужно разрешение s3:PutObjectRetention.",
  "Tags can only be changed on the current version.":
    "Теги можно менять только в текущей версии.",
  "Versioning is not enabled on this bucket.":
    "Для этого бакета не включено версионирование.",
  "Select one or more objects first.":
    "Сначала выберите один или несколько объектов.",
  "Select a single object first.": "Сначала выберите один объект.",
  "Select a file instead of a folder.": "Выберите файл вместо папки.",
  "Select a folder to change anonymous access.":
    "Выберите папку для изменения анонимного доступа.",
  "Open the current object to use this action.":
    "Откройте текущий объект, чтобы использовать это действие.",
  "This action requires a distributed server.":
    "Для этого действия требуется распределенный сервер.",
  "You need s3:PutObjectTagging permission.":
    "Вам нужно разрешение s3:PutObjectTagging.",
  "You need admin:InspectData permission.":
    "Вам необходимо разрешение admin:InspectData.",
  "You need permission to view object versions.":
    "Вам необходимо разрешение на просмотр версий объекта.",
  "You need s3:DeleteObject permission.":
    "Вам нужно разрешение s3:DeleteObject.",
  "You need permission to change the bucket policy.":
    "Требуется разрешение на изменение политики бакета.",
  "You need permission to read objects and bucket versioning.":
    "Требуется разрешение на чтение объектов и настроек версионирования бакета.",
  "You need s3:ListBucket permission.": "Вам нужно разрешение s3:ListBucket.",
  "You need permission to restore this version.":
    "Вам необходимо разрешение на восстановление этой версии.",
  "You need permission to select this version.":
    "Чтобы выбрать эту версию, вам необходимо разрешение.",
  "You need permission to delete object versions.":
    "Требуется разрешение на удаление версий объектов.",
  "Exit rewind mode to refresh the object list.":
    "Выйдите из режима перемотки, чтобы обновить список объектов.",
  "There are no non-current versions to delete.":
    "Нет неактуальных версий для удаления.",
  "Invalid Endpoint": "Недопустимая конечная точка",
  Broker: "Брокер",
  QOS: "QOS",
  "Client ID": "ID клиента",
  "Client Secret": "Секрет клиента",
  "Redirect URI": "URI перенаправления",
  "Lookup Bind DN": "DN привязки поиска",
  "Lookup Bind Password": "Пароль привязки поиска",
  "User DN Search Base": "База поиска DN пользователей",
  "User DN Search Filter": "Фильтр поиска DN пользователей",
  "Group Search Base DN": "Базовый DN поиска групп",
  "Group Search Filter": "Фильтр поиска групп",
  "Sign Out": "Выйти",
  "Remove transfer": "Удалить передачу",
  "Cancel transfer": "Отменить передачу",
  "This download has already started. Dismiss its transfer entry to start it again.":
    "Загрузка уже началась. Отмените запись о передаче, чтобы начать ее заново.",
  "Track or cancel this download in your browser's download manager.":
    "Отслеживайте или отменяйте эту загрузку в диспетчере загрузок вашего браузера.",
  "For selections above 5 GiB or of unknown size, MCLI is recommended. This ZIP will stream without buffering in memory.":
    "Для выделенных фрагментов размером более 5 ГиБ или неизвестного размера рекомендуется использовать MCLI. Этот ZIP будет передаваться без буферизации в памяти.",
  "Set lifecycle": "Установить жизненный цикл",
  "Set replication": "Установить репликацию",
  "Refresh buckets": "Обновить бакеты",
  "Close details": "Закрыть детали",
  "Copy share URL": "Скопировать ссылку для доступа",
  "Select multiple versions": "Выбрать несколько версий",
  "Delete selected versions": "Удалить выбранные версии",
  "Delete non-current versions": "Удалить неактуальные версии",
  "Copy code": "Скопировать код",
  "Delete group": "Удалить группу",
  "Refresh list": "Обновить список",
  "Copy path": "Копировать путь",
  "Delete user": "Удалить пользователя",
  "Change password": "Сменить пароль",
  "Copy {label}": "Копировать {label}",
  "Add site": "Добавить сайт",
  "Remove site": "Удалить сайт",
  "Delete selected users": "Удалить выбранных пользователей",
  "View All": "Посмотреть все",
  "Deployment ID:": "ID развёртывания:",
  "Request ID:": "ID запроса:",
  "Remote host:": "Удаленный хост:",
  "User agent:": "Пользовательский агент:",
  "Backtrace:": "Обратная трассировка:",
  "Time:": "Время:",
  "API:": "API:",
  "Not available": "Недоступно",
  " and ": " и ",
  "'namespace' reflects current bucket/object list and 'access' reflects a journal of object operations, defaults to 'namespace'":
    "'namespace' отражает текущий список бакетов/объектов, а 'access' — журнал операций с объектами (по умолчанию 'namespace')",
  "{compliance} lock protects Objects from write operations by all users, including the SILO root user.":
    "Блокировка {compliance} защищает объекты от операций записи всех пользователей, включая пользователя root SILO.",
  "{count} days": {
    one: "{count} день",
    few: "{count} дня",
    many: "{count} дней",
    other: "{count} дня",
  },
  "{count} Entities Found": "Найдено сущностей: {count}",
  "{count} Entity Found": "Найдена {count} сущность",
  "{count} Version": "{count} Версия",
  "{count} version, {size}": "{count} версия, {size}",
  "{count} versions": {
    one: "{count} версия",
    few: "{count} версии",
    many: "{count} версий",
    other: "{count} версии",
  },
  "{count} Versions": {
    one: "{count} версия",
    few: "{count} версии",
    many: "{count} версий",
    other: "{count} версии",
  },
  "{count} versions, {size}": "{count} версии, {size}",
  "{custom} policy can be written to define which accounts are authorized to access this Bucket":
    "Можно написать политику {custom}, чтобы определить, каким учётным записям разрешён доступ к этому бакету",
  "{entity} not available": "{entity} недоступно",
  "{entity} will be available until:": "{entity} будет доступно до:",
  "{excludeFolders} options will not be available if this option is enabled.":
    "Опции {excludeFolders} будут недоступны, если этот параметр включён.",
  "{file} - Versions": "{file} - Версии",
  "{governance} lock protects Objects from write operations by non-privileged users.":
    "Блокировка {governance} защищает объекты от операций записи непривилегированных пользователей.",
  "{label} copied to clipboard": "{label} скопировано в буфер обмена.",
  "{minio} is a registered trademark of MinIO, Inc. {silo} is not a MinIO, Inc. product, and is not affiliated with, sponsored by, or endorsed by MinIO, Inc.":
    "{minio} является зарегистрированной торговой маркой MinIO, Inc. {silo} не является продуктом MinIO, Inc., не связан, не спонсируется и не одобрен MinIO, Inc.",
  "{object} Versions": "{object} Версии",
  "{objectLocking} prevents objects from being deleted. Required to support retention and legal hold. Can only be enabled at bucket creation.":
    "{objectLocking} предотвращает удаление объектов. Необходима для хранения по сроку и юридического удержания. Включается только при создании бакета.",
  "{private} policy limits access to credentialled accounts with appropriate permissions":
    "{private} ограничивает доступ к зарегистрированным учетным записям с соответствующими разрешениями.",
  "{provider} - Add Tier Configuration":
    "{provider} — Добавить конфигурацию уровня",
  "{public} policy anyone will be able to upload, download and delete files from this Bucket once logged in":
    "При политике {public} любой вошедший пользователь сможет загружать, скачивать и удалять файлы в этом бакете",
  "{quota} limits the amount of data in the bucket.":
    "{quota} ограничивает объём данных в бакете.",
  "{retention} imposes rules to prevent object deletion for a period of time. Versioning must be enabled in order to set bucket retention policies.":
    "{retention} задаёт правила, запрещающие удаление объектов в течение определённого срока. Для политик хранения бакета необходимо включить версионирование.",
  "{service} which is {status}": "{service} в состоянии {status}",
  "{silo} is an independently maintained continuation of the {minio} object storage project, carried forward by the {pigsty} community since 2026. Its {code} {incorporates} {upstream}, and the complete work remains licensed under the {agpl}.":
    "{silo} — независимо поддерживаемое продолжение проекта объектного хранилища {minio}, развиваемое сообществом {pigsty} с 2026 года. Его {code} {incorporates} {upstream}, а всё произведение остаётся под лицензией {agpl}.",
  "{target} Event Destination": "Получатель событий {target}",
  "{time} ago": "{time} назад",
  "{type}: {name} not found.": "{type}: {name} не найдено.",
  "{versioning} allows to keep multiple versions of the same object under the same key.":
    "{versioning} позволяет хранить несколько версий одного и того же объекта под одним ключом.",
  "* Warning: With Public access anyone will be able to upload, download and delete files from this Bucket *":
    "* Предупреждение: при публичном доступе любой сможет загружать, скачивать и удалять файлы в этом бакете *",
  "# Associated Access Keys": "# Связанные ключи доступа",
  "© 2026 Ruohang Feng / PGSTY and the SILO contributors.":
    "© 2026 Руохан Фэн / PGSTY и участники SILO.",
  "<Day>": "<Day>",
  "<Month>": "<Month>",
  "<Year>": "<Year>",
  "A bucket can only be deleted if it's empty.":
    "Удалить можно только пустой бакет.",
  "A group can have one attached IAM policy, where all users with membership in that group inherit that policy. Groups support more simplified management of user permissions on the SILO Tenant.":
    "Группа может иметь одну прикрепленную политику IAM, при этом все пользователи, входящие в эту группу, наследуют эту политику. Группы поддерживают более упрощенное управление разрешениями пользователей в клиенте SILO.",
  "A network error occurred.": "Произошла сетевая ошибка.",
  "A new {entity} has been created with the following details:":
    "Был создан новый {entity} со следующими деталями:",
  "A SILO user consists of a unique access key (username) and corresponding secret key (password). Clients must authenticate their identity by specifying both a valid access key (username) and the corresponding secret key (password) of an existing SILO user.":
    "Пользователь SILO состоит из уникального ключа доступа (имени пользователя) и соответствующего секретного ключа (пароля). Клиенты должны аутентифицировать свою личность, указав действительный ключ доступа (имя пользователя) и соответствующий секретный ключ (пароль) существующего пользователя SILO.",
  "A user can be a member of multiple groups.":
    "Пользователь может быть членом нескольких групп.",
  "About Site Replication": "О репликации сайтов",
  Access: "Доступ",
  "Access Audit": "Аудит доступа",
  "Access Key": "Ключ доступа",
  "Access Key and Secret Key should be same on the new site/endpoint.":
    "Ключ доступа и секретный ключ должны быть одинаковыми на новом сайте/конечной точке.",
  "Access Key Policy": "Политика ключа доступа",
  "Access Key details - {name}": "Детали ключа доступа - {name}",
  "Access keys deleted successfully.": "Ключи доступа успешно удалены.",
  "Access Keys deleted successfully.": "Ключи доступа успешно удалены.",
  "Access Keys inherit the policies explicitly attached to the parent user, and the policies attached to each group in which the parent user has membership.":
    "Ключи доступа наследуют политики, явно назначенные родительскому пользователю, а также политики, прикрепленные к каждой группе, в которой состоит родительский пользователь.",
  "Access Keys support programmatic access by applications. You cannot use a Access Key to log into the SILO Console.":
    "Ключи доступа поддерживают программный доступ приложений. Вы не можете использовать ключ доступа для входа в консоль SILO.",
  "Access Policy": "Политика доступа",
  "Access Policy:": "Политика доступа:",
  "Access Rule added successfully": "Правило доступа успешно добавлено.",
  "Access Rules": "Правила доступа",
  "AccessKey is required": "Требуется AccessKey",
  "Account Key": "Ключ учетной записи",
  "Account Name": "Имя учетной записи",
  Active: "Активен",
  "Active for": "Активен для",
  'AD/LDAP server address e.g. "myldapserver.com:636"':
    'Адрес сервера AD/LDAP, напр., "myldapserver.com:636"',
  "Add a Row": "Добавить строку",
  "Add Access Rule": "Добавить правило доступа",
  "Add Anonymous Access Rule": "Добавить правило анонимного доступа",
  "Add Bucket Replication Rule - {bucket}":
    "Добавить правило репликации бакета — {bucket}",
  "Add Event Destination": "Добавить получателя событий",
  "Add key": "Добавить ключ",
  "Add Lifecycle Rule": "Добавить правило жизненного цикла",
  "Add Members": "Добавить участников",
  "Add New Tag": "Добавить новый тег",
  "Add New Tag ": "Добавить новый тег",
  "Add new Webhook": "Добавить новый Webhook",
  "Add Replication Rule": "Добавить правило репликации",
  "Add Replication Site": "Добавить сайт репликации",
  "Add Replication Sites": "Добавить сайты репликации",
  "Add Sites": "Добавить сайты",
  "Add Sites for Replication": "Добавить сайты для репликации",
  "Add tag": "Добавить тег",
  "Add Tier": "Добавить уровень",
  "Add to Group": "Добавить в группу",
  "Add to Groups": "Добавить в группы",
  "Add Users to Group": "Добавить пользователей в группу",
  "add users to groups": "добавлять пользователей в группы",
  "Adding groups lets you assign IAM policies to multiple users at once.":
    "Добавление групп позволяет назначать политики IAM нескольким пользователям одновременно.",
  Address: "Адрес",
  After: "После",
  All: "Все",
  "All Log Types": "Все типы журналов",
  "All Nodes": "Все узлы",
  "All sites must be using the same external IDP(s) if any.":
    "Все сайты должны использовать одни и те же внешние IDP(ы), если таковые имеются.",
  "All sites must have the same deployment credentials (i.e. MINIO_ROOT_USER, MINIO_ROOT_PASSWORD).":
    "Все сайты должны иметь одинаковые учетные данные для развертывания (т. е. MINIO_ROOT_USER, MINIO_ROOT_PASSWORD).",
  "All User Agents": "Все пользовательские агенты",
  "Amazon Resource Name": "Имя ресурса Amazon",
  "AMQP exchange type": "Тип точки обмена AMQP",
  "AMQP server endpoint e.g. `amqp://myuser:mypassword@localhost:5672`":
    "Конечная точка сервера AMQP, напр., `amqp://myuser:mypassword@localhost:5672`",
  "An error occurred": "Произошла ошибка",
  "An error occurred while getting the Health Report file.":
    "Произошла ошибка при получении файла отчёта о состоянии.",
  "An error occurred while uploading the file.":
    "При загрузке файла произошла ошибка.",
  "An error occurred while uploading the files.":
    "Произошла ошибка при загрузке файлов.",
  "An unknown error occurred. Please refer to Console logs to get more information.":
    "Произошла неизвестная ошибка. Для получения дополнительной информации обратитесь к журналам консоли.",
  Anonymous: "Анонимный",
  "Anonymous Access": "Анонимный доступ",
  "API Name": "Имя API",
  "API Requests": "Запросы API",
  Application: "Приложение",
  "apply policies to Groups": "применять политики к группам",
  April: "апрель",
  "Are you sure you want to continue?": "Вы уверены, что хотите продолжить?",
  "Are you sure you want to delete Access Key {name}?":
    "Вы уверены, что хотите удалить ключ доступа {name}?",
  "Are you sure you want to delete all the non-current versions for: {object}?":
    "Вы уверены, что хотите удалить все неактуальные версии объекта {object}?",
  "Are you sure you want to delete bucket {bucket}?":
    "Вы уверены, что хотите удалить бакет {bucket}?",
  "Are you sure you want to delete IDP {name} configuration?":
    "Вы уверены, что хотите удалить конфигурацию поставщика удостоверений {name}?",
  "Are you sure you want to delete policy {name}?":
    "Вы уверены, что хотите удалить политику {name}?",
  "Are you sure you want to delete replication rule {rule}?":
    "Вы уверены, что хотите удалить правило репликации {rule}?",
  "Are you sure you want to delete the {rule} rule?":
    "Вы уверены, что хотите удалить правило {rule}?",
  "Are you sure you want to delete the Configured Endpoint {name}?":
    "Вы уверены, что хотите удалить настроенную конечную точку {name}?",
  "Are you sure you want to delete the event destination ?":
    "Вы уверены, что хотите удалить этого получателя событий?",
  "Are you sure you want to delete the following {count} groups?":
    "Вы уверены, что хотите удалить следующие группы ({count})?",
  "Are you sure you want to delete the following {count} users?":
    "Вы уверены, что хотите удалить следующих пользователей ({count})?",
  "Are you sure you want to delete the following group?":
    "Вы уверены, что хотите удалить следующую группу?",
  "Are you sure you want to delete the following user?":
    "Вы уверены, что хотите удалить следующего пользователя?",
  "Are you sure you want to delete the selected {count} Access Keys?":
    "Вы уверены, что хотите удалить выбранные ключи доступа ({count})?",
  "Are you sure you want to delete the selected {count} objects?":
    "Вы уверены, что хотите удалить выбранные объекты ({count})?",
  "Are you sure you want to delete the selected {count} versions for {object}?":
    "Вы уверены, что хотите удалить выбранные версии ({count}) объекта {object}?",
  "Are you sure you want to delete the tag {tag} ?":
    "Вы уверены, что хотите удалить тег {tag} ?",
  "Are you sure you want to delete the tag {tag}?":
    "Вы уверены, что хотите удалить тег {tag}?",
  "Are you sure you want to delete the tier {name}?":
    "Вы уверены, что хотите удалить уровень хранения {name}?",
  "Are you sure you want to delete this access rule?":
    "Вы уверены, что хотите удалить это правило доступа?",
  "Are you sure you want to delete this event?":
    "Вы уверены, что хотите удалить это событие?",
  "Are you sure you want to delete:": "Вы уверены, что хотите удалить:",
  "Are you sure you want to remove all the replication sites?.":
    "Вы уверены, что хотите удалить все площадки репликации?",
  "Are you sure you want to remove the replication site: {name}?":
    "Вы уверены, что хотите удалить сайт репликации: {name}?",
  "Are you sure you want to remove the selected replication rules for bucket {bucket}?":
    "Вы уверены, что хотите удалить выбранные правила репликации для бакета {bucket}?",
  "Are you sure you want to reset the Default {name}?":
    "Вы уверены, что хотите сбросить настройки по умолчанию {name}?",
  "Are you sure you want to restore {object} with Version ID: {version}?":
    "Вы уверены, что хотите восстановить {object} с ID версии: {version}?",
  "Are you sure you want to restore these configurations to default values?":
    "Вы уверены, что хотите восстановить эти конфигурации до значений по умолчанию?",
  "Assign Access Policies": "Назначение политик доступа",
  "Assign Custom Credentials": "Назначение пользовательских учетных данных",
  "Assign Custom IAM Policies for Group":
    "Назначить пользовательские политики IAM для группы",
  "Assign groups": "Назначить группы",
  "Assign Groups": "Назначение групп",
  "assign policies": "назначить политики",
  "assign Policies": "назначить политики",
  "Assign Policies": "Назначение политик",
  "Assign Policy": "Назначить политику",
  "Assign Users": "Назначение пользователей",
  Asynchronous: "Асинхронный",
  "Audit Kafka": "Аудит Kafka",
  "Audit Webhook": "Аудит Webhook",
  August: "август",
  "Auth Token": "Токен аутентификации",
  "Auto delete queue when set to 'on', when there are no consumers":
    "Автоматически удалять очередь при отсутствии потребителей, если задано 'on'",
  "Auto Deleted": "Автоматически удалено",
  "Available Capacity": "Доступная емкость",
  Back: "Назад",
  Backend: "Бэкэнд",
  Bandwidth: "Пропускная способность",
  "Enter a non-negative bandwidth below 8 PiB/s, with at most two decimals (0 means unlimited).":
    "Введите неотрицательную полосу пропускания ниже 8 ПиБ/с, не более чем с двумя десятичными знаками (0 означает неограниченную).",
  "Bitrot Scan": "Битрот-сканирование",
  Brokers: "Брокеры",
  "Browse Bucket": "Просмотр бакета",
  Bucket: "Бакет",
  "Bucket Assignments": "Назначения бакетов",
  "Bucket Encryption configuration": "Конфигурация шифрования бакета",
  "Bucket lifecycle (ILM) configuration":
    "Конфигурация жизненного цикла бакета (ILM)",
  "Bucket Name": "Имя бакета",
  "Bucket names can consist only of lowercase letters, numbers, dots (.), and hyphens (-).":
    "Имена бакетов могут состоять только из строчных букв, цифр, точек (.) и дефисов (-).",
  "Bucket names must be between 3 (min) and 63 (max) characters long.":
    "Имена бакетов должны содержать от 3 (мин.) до 63 (макс.) символов.",
  "Bucket names must be unique within a partition.":
    "Имена бакетов должны быть уникальными в пределах раздела.",
  "Bucket names must not be formatted as an IP address (for example, 192.168.5.4).":
    "Имена бакетов не должны иметь формат IP-адреса (например, 192.168.5.4).",
  "Bucket names must not contain two adjacent periods, or a period adjacent to a hyphen.":
    "Имена бакетов не должны содержать две точки подряд или точку рядом с дефисом.",
  "Bucket names must not end with the suffix -s3alias. This suffix is reserved for access point alias names.":
    "Имена бакетов не должны заканчиваться суффиксом -s3alias. Этот суффикс зарезервирован для псевдонимов точек доступа.",
  "Bucket names must not start with the prefix xn--.":
    "Имена бакетов не должны начинаться с префикса xn--.",
  "Bucket notification configuration": "Конфигурация уведомлений бакета",
  "bucket notifications": "уведомления бакета",
  "Bucket Object-Lock configurations":
    "Конфигурации блокировки объектов (Object Lock) бакета",
  "Bucket Policies": "Политики бакетов",
  "Bucket Replication Configuration": "Конфигурация репликации бакета",
  "Bucket Tags": "Метки бакета",
  "bucket-default": "по умолчанию для бакета",
  "Buckets Results": "Результаты по бакетам",
  "Buckets:": "Бакеты:",
  "Bypass Governance Mode": "Обойти режим Governance",
  Bytes: "Байт",
  "Calls to Trace": "Отслеживаемые вызовы",
  Cancelled: "Отменено",
  "Cannot delete currently logged in user":
    "Невозможно удалить вошедшего в систему пользователя.",
  "Cannot delete currently logged in user {user}":
    "Невозможно удалить текущего пользователя {user}",
  "Cert Authority": "Центр сертификации",
  "Change Access Policy": "Изменить политику доступа",
  "Change Legal Hold rules for this File":
    "Изменить юридическое удержание этого файла",
  "Change Password": "Изменить пароль",
  "Change Password for {user}": "Изменить пароль для {user}",
  "Change password for: {user}": "Изменить пароль для: {user}",
  "Change Retention rules for this File":
    "Изменить правила хранения этого файла",
  "Change Tags for this File": "Изменить теги для этого файла",
  "Change User Password": "Изменить пароль пользователя",
  "Changes to Bucket features such as": "Изменения функций бакета, таких как",
  "Choose or create a new path": "Выберите или создайте новый путь.",
  "Claim from which SILO will read the policy or role to use":
    "Утверждение (claim), из которого SILO считывает используемую политику или роль",
  "Claim Name": "Имя claim",
  "Claim Prefix": "Префикс claim",
  "Claim User Info": "Запрашивать данные UserInfo",
  Clear: "Очистить",
  "Click on a user to view the full listing of associated Access Keys. All Access Keys associated with a user will be deleted along with the user.":
    "Нажмите на пользователя, чтобы просмотреть полный список связанных с ним ключей доступа. Все ключи доступа, связанные с пользователем, будут удалены вместе с пользователем.",
  client: "клиент",
  "Client Auth determines the Kafka server's policy for TLS client authorization":
    "Client Auth определяет политику сервера Kafka для авторизации клиента TLS.",
  "Client Cert": "Сертификат клиента",
  "Client cert for mTLS authentication":
    "Сертификат клиента для аутентификации mTLS",
  "Client cert for NATS mTLS auth":
    "Сертификат клиента для аутентификации mTLS в NATS",
  "Client Cert Key": "Ключ сертификата клиента",
  "Client cert key for mTLS authentication":
    "Ключ сертификата клиента для аутентификации mTLS",
  "Client cert key for NATS mTLS authorization":
    "Ключ сертификата клиента для авторизации mTLS в NATS",
  "Client ID is required": "Требуется ID клиента",
  "Client Key": "Ключ клиента",
  "Client ping commands interval in s,m,h,d. Disabled by default":
    "Интервал ping-команд клиента в s,m,h,d. По умолчанию отключено",
  "Client Secret is required": "Требуется секрет клиента",
  "Client Secret must be re-entered to change OpenID configurations":
    "Необходимо повторно ввести секрет клиента, чтобы изменить конфигурации OpenID.",
  "client TLS cert": "TLS-сертификат клиента",
  "client TLS key": "TLS-ключ клиента",
  "ClientAuth determines the Kafka server's policy for TLS client authorization":
    "ClientAuth определяет политику сервера Kafka для авторизации клиента TLS.",
  "Cluster Health Report will be generated, you will be able to download the JSON File.":
    "Будет сформирован отчёт о состоянии кластера, и вы сможете скачать файл JSON.",
  code: "исходный код",
  "Comma separated list of Kafka broker addresses":
    "Список адресов брокеров Kafka, разделённых запятыми",
  Comment: "Комментарий",
  Comments: "Комментарии",
  Compliance: "Compliance",
  Compression: "Сжатие",
  "Concurrent:": "Одновременно:",
  Config: "Конфигурация",
  "Config Name is required": "Требуется имя конфигурации",
  "Config URL": "URL конфигурации",
  "Config URL for identity provider configuration":
    "URL конфигурации поставщика удостоверений",
  "Config URL is required": "Требуется URL конфигурации",
  "Configuration cannot be disabled / enabled in this module as LDAP environment variables are set for this SILO instance.":
    "Конфигурацию невозможно отключить/включить в этом модуле, поскольку для этого экземпляра SILO установлены переменные среды LDAP.",
  "Configuration cannot be disabled / enabled in this module as OpenID environment variables are set for this SILO instance.":
    "Конфигурацию невозможно отключить/включить в этом модуле, поскольку для этого экземпляра SILO установлены переменные среды OpenID.",
  "Configuration cannot be edited in this module as LDAP environment variables are set for this SILO instance.":
    "Конфигурацию нельзя редактировать в этом модуле, поскольку для этого экземпляра SILO установлены переменные среды LDAP.",
  "Configuration cannot be edited in this module as OpenID environment variables are set for this SILO instance.":
    "Конфигурацию нельзя редактировать в этом модуле, поскольку для этого экземпляра SILO установлены переменные среды OpenID.",
  "Configuration saved successfully": "Конфигурация успешно сохранена.",
  "Configure a {remoteTier} to receive transitioned Objects":
    "Настройте {remoteTier} для получения переданных объектов.",
  "Configure Bucket": "Настроить бакет",
  "Configuring an external IDP enables Single-Sign On workflows, where applications authenticate against the external IDP before accessing SILO.":
    "Настройка внешнего IDP позволяет использовать рабочие процессы единого входа, при которых приложения проверяют подлинность на внешнем IDP перед доступом к SILO.",
  "Confirm Dialogs": "Диалоги подтверждения",
  "connected server": "подключенный сервер",
  "Connection String": "Строка подключения",
  "Console Credentials": "Учётные данные консоли",
  "Console LICENSE": "LICENSE консоли",
  "Console portions © Georg Mangold and contributors.":
    "Части кода консоли © Georg Mangold и соавторы.",
  "Console predecessor": "Предшественник консоли",
  "Copy to Clipboard": "Скопировать в буфер обмена",
  Copyright: "Авторские права",
  "Coredns Path": "Путь CoreDNS",
  "Cors Allow Origin": "Cors Allow Origin",
  "Could not process drag and drop.": "Не удалось обработать перетаскивание.",
  "CPU Info": "Сведения о ЦП",
  "Create {idpType} configuration": "Создать конфигурацию {idpType}",
  "create a bucket": "создать бакет",
  "Create a new cryptographic key in the Key Management Service server connected to SILO.":
    "Создайте новый криптографический ключ на сервере службы управления ключами, подключенном к SILO.",
  "create a new path": "создать новый путь",
  "create a Policy": "создать политику",
  "Create access key": "Создать ключ доступа",
  "Create Access Key": "Создать ключ доступа",
  "Create Access Key for {user}": "Создать ключ доступа для {user}",
  "Create Access Keys": "Создание ключей доступа",
  "Create Configuration": "Создать конфигурацию",
  "Create Configurations": "Создание конфигураций",
  "Create Group": "Создать группу",
  "Create Key": "Создать ключ",
  "Create new path": "Создать новый путь",
  "Create OpenID Configuration": "Создать конфигурацию OpenID",
  "Create Policies": "Создание политик",
  "Create Policy": "Создать политику",
  "Create Rules": "Создать правила",
  "Create Tier": "Создать уровень",
  "Create User": "Создать пользователя",
  "create users": "создавать пользователей",
  "Create Users": "Создание пользователей",
  "Created At": "Создано",
  "Created By": "Автор:",
  "Creation and deletion of all IAM users, groups, policies and their mappings to users or groups":
    "Создание и удаление всех пользователей, групп и политик IAM, а также их привязок",
  "Creation and deletion of buckets and objects":
    "Создание и удаление бакетов и объектов",
  "Creation and deletion of service accounts (except those owned by the root user)":
    "Создание и удаление сервисных учетных записей (кроме тех, которые принадлежат пользователю root)",
  "Creation of STS credentials": "Создание учетных данных STS",
  Credentials: "Учётные данные",
  current: "текущих",
  Current: "Текущая",
  "Current Endpoint:": "Текущая конечная точка:",
  "Current Password": "Текущий пароль",
  "Current Path:": "Текущий путь:",
  "Current Policy": "Текущая политика",
  "Current Status": "Текущий статус",
  "Current Status:": "Текущий статус:",
  "Current Tags:": "Текущие теги:",
  "Current User Policy - edit the JSON to remove permissions for this Access Key":
    "Текущая политика пользователя — отредактируйте JSON, чтобы удалить разрешения для этого ключа доступа.",
  "Current Version": "Текущая версия",
  "CURRENT VERSION": "CURRENT VERSION",
  "Currently Configured Endpoints": "Настроенные конечные точки",
  custom: "пользовательская",
  Custom: "Пользовательский",
  Cycle: "Цикл",
  Database: "База данных",
  Date: "Дата",
  day: "день",
  days: {
    one: "день",
    few: "дня",
    many: "дней",
    other: "дня",
  },
  Days: "Дней",
  "DB table name to store/update events, table is auto-created":
    "Имя таблицы БД для хранения/обновления событий (создаётся автоматически)",
  December: "декабрь",
  Default: "По умолчанию",
  "Default Key ID:": "ID ключа по умолчанию:",
  "Define which actions are permitted on a specified resource.":
    "Определите, какие действия разрешены на указанном ресурсе.",
  "Delay Multiplier": "Множитель задержки",
  "DELETE - Object Deleted": "DELETE — Объект удалён",
  "Delete {name}": "Удалить {name}",
  "Delete Access Key": "Удалить ключ доступа",
  "Delete Access Keys": "Удалить ключи доступа",
  "Delete All": "Удалить всё",
  "Delete All Versions": "Удалить все версии",
  "Delete Anonymous Access Rule": "Удалить правило анонимного доступа",
  "Delete Bucket": "Удалить бакет",
  "Delete Configuration": "Удалить конфигурацию",
  "Delete Endpoint": "Удалить конечную точку",
  "Delete Event": "Удалить событие",
  "Delete Group": "Удалить группу",
  "delete Groups": "удалить группы",
  "Delete Groups": "Удалить группы",
  "Delete Lifecycle Rule": "Удалить правило жизненного цикла",
  "Delete Marker": "Маркер удаления",
  "Delete Non-Current versions": "Удалить неактуальные версии",
  "Delete Object": "Удалить объект",
  "Delete Objects": "Удалить объекты",
  "delete Policies": "удалить политики",
  "Delete Policy": "Удалить политику",
  "Delete Replication Rule": "Удалить правило репликации",
  "Delete Replication Site": "Удалить сайт репликации",
  "Delete Selected": "Удалить выбранное",
  "Delete Selected Files": "Удалить выбранные файлы",
  "Delete Selected Replication Rules": "Удалить выбранные правила репликации",
  "Delete Selected Versions": "Удалить выбранные версии",
  "Delete Site": "Удалить сайт",
  "Delete Tag": "Удалить тег",
  "Delete Tier": "Удалить уровень",
  "delete user": "удалить пользователя",
  "Delete User": "Удалить пользователя",
  "delete users": "удалить пользователей",
  "Delete Users": "Удалить пользователей",
  "Delete version": "Удалить версию",
  "Delete Webhook": "Удалить Webhook",
  Deleted: "Удалено",
  DELETED: "DELETED",
  Deletes: "Удаляет",
  "Delivery Mode": "Режим доставки",
  Description: "Описание",
  Destination: "Пункт назначения",
  "Detailed Results:": "Подробные результаты:",
  Disable: "Отключить",
  "Disable LDAP": "Отключить LDAP",
  "Disable SSL certificate verification ": "Отключить проверку SSL-сертификата",
  "disable users": "отключить пользователей",
  Disabled: "Отключено",
  "Display Name": "Отображаемое имя",
  "Display Object Versions": "Отображение версий объекта",
  "Display only Errors": "Отображать только ошибки",
  "Display Versions for this file": "Показать версии этого файла",
  "No object versions are available": "Версии объекта недоступны",
  "Distributed Mode": "Распределенный режим",
  "DN (Distinguished Name) for LDAP read-only service account used to perform DN and group lookups":
    "DN (отличительное имя) учётной записи чтения LDAP для поиска DN и групп",
  documentation: "документация",
  Done: "Готово",
  "Download all access credentials": "Скачать все учётные данные доступа",
  "Download all access credentials to a JSON file. NOTE: This file is not formatted for import using mc alias import. If you plan to import this alias from the file, please use the Download for Import button. ":
    "Скачать все учётные данные доступа в файл JSON. ПРИМЕЧАНИЕ: этот файл не отформатирован для импорта командой mc alias import. Для импорта псевдонима используйте кнопку «Скачать для импорта».",
  "Download as CSV": "Скачать как CSV",
  "Download as PNG": "Скачать как PNG",
  "Download credentials in a JSON file formatted for import using mc alias import. This will only include the default login credentials.":
    "Скачать учётные данные в файле JSON, подготовленном для команды mc alias import. Включает только учётные данные для входа по умолчанию.",
  "Download File": "Скачать файл",
  "Download for import": "Скачать для импорта",
  "Download JSON": "Скачать JSON",
  "Download of multiple files failed.":
    "Не удалось загрузить несколько файлов.",
  "Download Results": "Скачать результаты",
  "Download Selected": "Скачать выбранное",
  "Download selected objects as Zip. Any Deleted objects in the selection would be skipped from download.":
    "Скачать выбранные объекты в виде ZIP-архива. Удалённые объекты в выборке будут пропущены.",
  "Download this Object": "Скачать этот объект",
  "Download this version": "Скачать эту версию",
  "Download widget data": "Загрузить данные виджета",
  "Downloads / Uploads": "Скачивания / Загрузки",
  "Drives Partitions Info": "Информация о разделах дисков",
  "Drives:": "Диски:",
  "DSN String": "Строка DSN",
  Durable: "Постоянная",
  Duration: "Продолжительность",
  "During the speed test all your production traffic will be temporarily suspended.":
    "Во время теста скорости весь ваш производственный трафик будет временно приостановлен.",
  "e.g. 503": "напр., 503",
  "e.g. FunctionName2055": "напр., FunctionName2055",
  "e.g. Method 2056": "напр., Method 2056",
  "e.g. my-bucket/my-prefix/*": "напр., my-bucket/my-prefix/*",
  "e.g. us-west-rack-2": "напр., us-west-rack-2",
  "Each user can access only those resources and operations which are explicitly granted by the built-in role. SILO denies access to any other resource or action by default.":
    "Каждый пользователь может получить доступ только к тем ресурсам и операциям, которые явно разрешены встроенной ролью. SILO по умолчанию запрещает доступ к любому другому ресурсу или действию.",
  Edit: "Изменить",
  "edit a Policy": "изменить политику",
  "Edit Anonymous Access Rule for {target}":
    "Редактировать правило анонимного доступа для {target}",
  "Edit Audit Webhook": "Изменить вебхук аудита",
  "Edit Bucket Replication": "Изменить репликацию бакета",
  "Edit Configuration": "Редактировать конфигурацию",
  "Edit details of - {name}": "Редактировать детали - {name}",
  "Edit Endpoint": "Редактировать конечную точку",
  "edit Group membership": "изменить членство в группе",
  "Edit Lifecycle Configuration": "Изменить конфигурацию жизненного цикла",
  "Edit Logger Webhook": "Изменить вебхук журнала",
  "Edit Members": "Редактировать участников",
  "Edit Replication Endpoint": "Изменить конечную точку репликации",
  "Edit Tags": "Редактировать теги",
  "Edit the Default Audit Webhook": "Изменить вебхук аудита по умолчанию",
  "Edit the Default Logger Webhook": "Изменить вебхук журнала по умолчанию",
  "Edit Webhook": "Редактировать Webhook",
  "Effect:": "Эффект:",
  "Elasticsearch index to store/update events, index is auto-created":
    "Индекс Elasticsearch для хранения/обновления событий (создаётся автоматически)",
  "Elasticsearch server's address, with optional authentication info":
    "Адрес сервера Elasticsearch с необязательными данными аутентификации",
  Enable: "Включить",
  "Enable audit_kafka target": "Включить цель audit_kafka",
  "Enable Bucket Encryption": "Включить шифрование бакета",
  "Enable Bucket Quota": "Включить квоту бакета",
  "Enable LDAP": "Включить LDAP",
  "enable or disable Groups": "включить или отключить группы",
  "enable or disable users": "включить или отключить пользователей",
  "Enable SASL (Simple Authentication and Security Layer) authentication":
    "Включить аутентификацию SASL (Simple Authentication and Security Layer)",
  "Enable TLS (Transport Layer Security)":
    "Включить TLS (Безопасность транспортного уровня)",
  "enable users": "включить пользователей",
  "Enable your preferred options to get filtered records.":
    "Включите предпочтительные параметры для получения отфильтрованных записей.",
  Enabled: "Включено",
  Encrypt: "Шифрование",
  "Encryption Key": "Ключ шифрования",
  "Encryption Type": "Тип шифрования",
  "Encryption:": "Шифрование:",
  "End Time:": "Время окончания:",
  Endpoint: "Конечная точка",
  endpoints: "конечные точки",
  Endpoints: "Конечные точки",
  "Enter '/' to apply the rule to all prefixes and objects at the bucket root. Do not include the wildcard asterisk '*' as part of the prefix *unless* it is an explicit part of the prefix name. The Console automatically appends an asterisk to the appropriate sections of the resulting IAM policy.":
    "Введите «/», чтобы применить правило ко всем префиксам и объектам в корне бакета. Не включайте символ подстановки «*» в префикс, *если только* он не является явной частью имени префикса. Консоль автоматически добавит звёздочку в соответствующие разделы итоговой политики IAM.",
  "Enter a comment": "Введите комментарий",
  "Enter a description": "Введите описание",
  "Enter a Mime Type": "Введите MIME-тип",
  "Enter a name": "Введите имя",
  "Enter Access Key": "Введите ключ доступа",
  "Enter Account Key": "Введите ключ учётной записи",
  "Enter Account Name": "Введите имя учётной записи",
  "Enter Address": "Введите адрес",
  "Enter allowed origin e.g. https://example.com":
    "Введите разрешённый источник, напр., https://example.com",
  "Enter an Extension": "Введите расширение файла",
  "Enter Auth Token": "Введите токен аутентификации",
  "Enter auth_token": "Введите auth_token",
  "Enter Brokers": "Введите брокеры",
  "Enter Bucket": "Введите бакет",
  "Enter Cert Authority": "Введите центр сертификации",
  "Enter Claim Name": "Введите имя claim",
  "Enter Claim Prefix": "Введите префикс claim",
  "Enter Client Cert": "Введите сертификат клиента",
  "Enter Client Cert Key": "Введите ключ сертификата клиента",
  "Enter Client ID": "Введите ID клиента",
  "Enter Client Key": "Введите ключ клиента",
  "Enter Client Secret": "Введите секрет клиента",
  "Enter Coredns Path": "Введите путь CoreDNS",
  "Enter custom notes if any": "Введите примечания (если есть)",
  "Enter Cycle": "Введите цикл",
  "Enter DB Name": "Введите имя БД",
  "Enter Delay": "Введите задержку",
  "Enter Delivery Mode": "Введите режим доставки",
  "Enter Destination Identifier": "Введите идентификатор получателя",
  "Enter Display Name": "Введите отображаемое имя",
  "Enter DSN String": "Введите строку DSN",
  "Enter Endpoint": "Введите конечную точку",
  "Enter Exchange": "Введите точку обмена",
  "Enter Exchange Type": "Введите тип точки обмена",
  "Enter Format": "Введите формат",
  "Enter Host": "Введите хост",
  "Enter Index": "Введите индекс",
  "Enter Kafka Broker": "Введите брокер Kafka",
  "Enter Kafka Topic": "Введите топик Kafka",
  "Enter Kafka Version": "Введите версию Kafka",
  "Enter Keep Alive Interval": "Введите интервал Keep-Alive",
  "Enter Key": "Введите ключ",
  "Enter Max IO": "Введите макс. I/O",
  "Enter Max Sleep Duration": "Введите макс. длительность паузы",
  "Enter Max Wait": "Введите макс. ожидание",
  "Enter Name (Eg. REMOTE-TIER)": "Введите имя (например, REMOTE-TIER)",
  "Enter NATS password": "Введите пароль NATS",
  "Enter NATS Subject": "Введите тему NATS",
  "Enter NATS token": "Введите токен NATS",
  "Enter NATS Username": "Введите имя пользователя NATS",
  "Enter New Tag Key": "Введите новый ключ тега",
  "Enter New Tag Label": "Введите новую метку тега",
  "Enter nsqd_address": "Введите nsqd_address",
  "Enter Password": "Введите пароль",
  "Enter Path Prefix": "Введите префикс пути",
  "Enter Ping Interval": "Введите интервал ping",
  "Enter Port": "Введите порт",
  "Enter Prefix": "Введите префикс",
  "Enter QOS": "Введите QOS",
  "Enter Queue Dir": "Введите каталог очереди",
  "Enter Queue Directory": "Введите каталог очереди",
  "Enter Queue Limit": "Введите лимит очереди",
  "Enter Reconnect Interval": "Введите интервал переподключения",
  "Enter Replication Failed Workers":
    "Введите число воркеров для сбойных репликаций",
  "Enter Replication Workers": "Введите число воркеров репликации",
  "Enter Requests Max": "Введите макс. запросов",
  "Enter Routing Key": "Введите ключ маршрутизации",
  "Enter SASL Mechanism": "Введите механизм SASL",
  "Enter SASL Password": "Введите пароль SASL",
  "Enter SASL Username": "Введите имя пользователя SASL",
  "Enter Secret Key": "Введите секретный ключ",
  "Enter SSL Mode": "Введите режим SSL",
  "Enter Storage Class": "Введите класс хранения",
  "Enter Streaming Cluster ID": "Введите ID кластера потоковой передачи",
  "Enter Streaming in flight value":
    "Введите макс. число неподтверждённых сообщений (in-flight)",
  "Enter Table Name": "Введите имя таблицы",
  "Enter Tag Key": "Введите ключ тега",
  "Enter Tag Label": "Введите метку тега",
  "Enter the new Folder Path": "Введите новый путь к папке",
  "Enter TLS Client Auth": "Введите режим TLS-аутентификации клиента",
  "Enter TLS Client Cert": "Введите TLS-сертификат клиента",
  "Enter TLS Client Key": "Введите TLS-ключ клиента",
  "Enter Topic": "Введите топик",
  "Enter URL": "Введите URL",
  "Enter User": "Введите пользователя",
  "Enter Username": "Введите имя пользователя",
  Entities: "Сущности",
  "Erasure Health": "Состояние EC",
  Error: "Ошибка",
  "Error - File size too large": "Ошибка — слишком большой размер файла",
  "Error retrieving access keys": "Ошибка при получении ключей доступа",
  "Error:": "Ошибка:",
  Errors: "Ошибки",
  Erros: "Ошибки",
  "ETAG:": "ETAG:",
  Event: "Событие",
  "Event Notifications": "Уведомления о событиях",
  Exchange: "Точка обмена",
  "Exchange Type": "Тип точки обмена",
  "Exclude Folders": "Исключить папки",
  "exclude folders and prefixes": "исключить папки и префиксы",
  "Exclude folders and prefixes": "Исключить папки и префиксы",
  "Excluded Prefixes": "Исключенные префиксы",
  "Excluded Prefixes :": "Исключенные префиксы:",
  "Existing Objects": "Существующие объекты",
  "Expand graph": "Развернуть график",
  "Expire All Versions": "Срок действия всех версий истекает",
  "Expire Delete Marker": "Удалять маркеры удаления с истекшим сроком",
  "Expired All Versions": "Срок действия всех версий истек",
  "Expired Object Delete Marker":
    "Маркер удаления объекта с истекшим сроком действия",
  Expiry: "Срок действия",
  "Expiry Days": "Срок действия в днях",
  Export: "Экспорт",
  Extensions: "Расширения",
  'Extensions to compress e.g. ".txt", ".log" or ".csv" -  you can write one per field':
    'Расширения для сжатия, напр., ".txt", ".log" или ".csv" — по одному в поле',
  Failed: "Не удалось",
  Failures: "Неудачи",
  False: "Ложь",
  Features: "Особенности",
  February: "февраль",
  "File Configuration": "Конфигурация файла",
  "File couldn't be loaded. Please try Download instead":
    "Не удалось загрузить файл. Попробуйте скачать его.",
  "File couldn't be previewed using file extension or mime type. Please try Download instead":
    "Не удалось выполнить предпросмотр по расширению файла или MIME-типу. Попробуйте скачать файл.",
  "File download will be handled directly by the browser.":
    "Загрузка файла будет осуществляться непосредственно браузером.",
  "Files larger than 5 GiB use a single, non-resumable browser request. Use mcli for multipart uploads.":
    "Файлы размером более 5 ГиБ используют один невозобновляемый запрос браузера. Используйте mcli для многочастной загрузки.",
  "File or Path to inspect": "Файл или путь для проверки",
  "File Preview": "Предпросмотр файла",
  "File preview couldn't be displayed, Please try Download instead.":
    "Не удалось отобразить предпросмотр файла. Попробуйте скачать его.",
  "Filename should be less than 200 characters long.":
    "Имя файла должно содержать менее 200 символов.",
  Filter: "Фильтр",
  "Filter Users": "Фильтровать пользователей",
  "Filter:": "Фильтр:",
  Filters: "Фильтры",
  "Folder cannot have the same name as an existing file":
    "Имя папки не может совпадать с именем существующего файла.",
  "For each write operation to the bucket, SILO checks all configured replication rules for the bucket and applies the matching rule with highest configured priority.":
    "При каждой операции записи в бакет SILO проверяет все настроенные правила репликации для бакета и применяет подходящее правило с наивысшим приоритетом.",
  'For each write operation to this "source" bucket, SILO checks all configured replication rules and applies the matching rule with highest configured priority.':
    "При каждой операции записи в этот «исходный» бакет SILO проверяет все настроенные правила репликации и применяет подходящее правило с наивысшим приоритетом.",
  "For per-object retention settings, defer to the documentation for the PUT operation used by your preferred SDK.":
    "Для настройки хранения каждого объекта обратитесь к документации по операции PUT, используемой предпочитаемым вами SDK.",
  "For SSE-S3 or SSE-KMS encryption via KMS, all sites must have access to a central KMS deployment server.":
    "Для шифрования SSE-S3 или SSE-KMS через KMS все сайты должны иметь доступ к центральному серверу развертывания KMS.",
  Format: "Формат",
  "full attribution stack": "полный стек атрибуции",
  "Full Log Information": "Полная информация журнала",
  "Function Name": "Имя функции",
  Functions: "Функции",
  "GET - Object accessed": "GET — Доступ к объекту",
  "Get Information": "Получить информацию",
  "GNU Affero General Public License, version 3":
    "Стандартная общественная лицензия GNU Affero, версия 3",
  "GNU AGPL v3 full text": "Полный текст GNU AGPL v3",
  Governance: "Governance",
  Group: "Группа",
  "Group Mappings": "Сопоставление групп",
  "Group Name": "Имя группы",
  "Group Status:": "Статус группы:",
  "Groups provide a simplified method for managing shared permissions among users with common access patterns and workloads. Client’s cannot authenticate to a SILO deployment using a group as an identity.":
    "Группы предоставляют упрощенный метод управления общими разрешениями среди пользователей с общими шаблонами доступа и рабочими нагрузками. Клиенты не могут пройти аутентификацию в развертывании SILO, используя группу в качестве удостоверения.",
  "Groups with this Policy associated":
    "Группы, с которыми связана эта Политика",
  "Guide to access policy structure":
    "Руководство по структуре политики доступа",
  hard: "жёсткая",
  Heal: "Восстановление",
  "Health Check Duration": "Длительность проверки состояния",
  "Health Info (Preview)": "Сведения о состоянии (предпросмотр)",
  "Health Report": "Отчёт о состоянии",
  "Health Report complete": "Отчёт о состоянии готов",
  "Health Report file is ready to be downloaded.":
    "Файл отчёта о состоянии готов к скачиванию.",
  "Health report generated successfully!": "Отчёт о состоянии успешно создан!",
  "Health Report in progress...": "Формирование отчёта о состоянии...",
  "Health Report started. Please do not refresh page during diagnosis.":
    "Формирование отчёта о состоянии запущено. Пожалуйста, не обновляйте страницу во время диагностики.",
  Healthy: "Исправно",
  "Hide advanced Filters": "Скрыть расширенные фильтры",
  "Hide Bucket Naming Rules": "Скрыть правила именования бакетов",
  "Hide Object Versions": "Скрыть версии объекта",
  hour: "час",
  hours: {
    one: "час",
    few: "часа",
    many: "часов",
    other: "часа",
  },
  Hours: "Часов",
  "IAM conditional statements": "Условные выражения IAM",
  "IAM Policy": "Политика IAM",
  Id: "ID",
  Identifier: "Идентификатор",
  "Identity provider Client ID": "ID клиента поставщика удостоверений",
  "Identity provider Client Secret": "Секрет клиента поставщика удостоверений",
  "If the Health report cannot be generated at this time, please wait a moment and try again.":
    "Если отчет о состоянии не может быть создан в данный момент, подождите немного и повторите попытку.",
  "If you are looking to change MINIO_ROOT_USER credentials,":
    "Если вы хотите изменить учетные данные MINIO_ROOT_USER,",
  "ILM - Object Transitioned": "ILM — Объект перемещен",
  "ILM Rule": "Правило ILM",
  Import: "Импорт",
  "incorporates and modifies": "включает и изменяет",
  Index: "Индекс",
  "Initially, only one of the sites added for replication may have data. After site-replication is successfully configured, this data is replicated to the other (initially empty) sites. Subsequently, objects may be written to any of the sites, and they will be replicated to all other sites.":
    "Изначально только один из сайтов, добавленных для репликации, может иметь данные. После успешной настройки репликации сайта эти данные реплицируются на другие (изначально пустые) сайты. В дальнейшем объекты могут быть записаны на любой из сайтов, и они будут реплицированы на все остальные сайты.",
  "Inspect Decryption Key": "Ключ расшифровки архива проверки",
  "Inspect Object": "Осмотреть объект",
  "Inspect this file": "Исследовать файл",
  Internal: "Внутренний",
  "Invalid bucket name": "Недопустимое имя бакета",
  "Invalid Endpoint set": "Недопустимый набор конечных точек",
  "Invalid Name": "Неверное имя",
  January: "Январь",
  "JSON Results:": "Результаты JSON:",
  July: "июль",
  June: "июнь",
  "Just now": "Только что",
  "Kafka topic used for bucket notifications":
    "Топик Kafka для уведомлений бакета",
  "Keep Alive Interval": "Интервал поддержания активности",
  "Keep-alive interval for MQTT connections in s,m,h,d":
    "Интервал Keep-Alive для подключений MQTT в s,m,h,d",
  Key: "Ключ",
  "Key Management Service Endpoints:":
    "Конечные точки службы управления ключами:",
  "Key Name": "Имя ключа",
  "Key name cannot contain spaces": "Имя ключа не должно содержать пробелов",
  Keys: "Ключи",
  "KMS Key ID": "ID ключа KMS",
  "Last Modified": "Последнее изменение",
  "Last modified:": "Последнее изменение:",
  "Last Modified:": "Последнее изменение:",
  "Latency Histogram": "Гистограмма задержки",
  "LDAP Enabled": "LDAP включён",
  "Learn more about {link}.": "Узнайте больше о {link}.",
  "Learn more about Access Keys": "Узнайте больше о ключах доступа.",
  "Learn more about Groups": "Узнайте больше о группах.",
  "Learn more about LDAP Configurations": "Узнайте больше о конфигурациях LDAP",
  "Learn more about OpenID Connect Configurations":
    "Узнайте больше о конфигурациях OpenID Connect.",
  "Learn more about Policies": "Подробнее о политиках",
  "Learn more about the Users feature":
    "Узнайте больше о функции «Пользователи».",
  "Learn more about TIERS": "Подробнее об уровнях хранения",
  "Legal Hold": "Юридическое удержание",
  "Legal Hold Status": "Состояние юридического удержания",
  "Legal Hold:": "Юридическое удержание:",
  "licensing in full": "лицензирование в полном объеме",
  Lifecycle: "Жизненный цикл",
  "Lifecycle Configuration": "Конфигурация жизненного цикла",
  "Lifecycle Rules": "Правила жизненного цикла",
  Link: "Ссылка",
  'List of etcd endpoints e.g. "http://localhost:2379" - you can write one per field':
    'Список конечных точек etcd, напр., "http://localhost:2379" — по одной в поле',
  "List of origins allowed for CORS requests":
    "Список источников (origins), разрешённых для запросов CORS",
  "List of Replicated Sites": "Список реплицируемых площадок",
  "Load more": "Загрузить еще",
  "Load more Versions": "Загрузить больше версий",
  "Load Time": "Время загрузки",
  "Loading nodes": "Загрузка узлов",
  "Local Buckets to replicate": "Локальные бакеты для репликации",
  Location: "Местоположение",
  Locking: "Блокировка",
  "Log Details": "Подробности журнала",
  "Logger Webhook": "Вебхук журнала",
  "Lookup Bind DN is required": "Требуется DN привязки поиска",
  "Lookup Bind Password is required": "Требуется пароль привязки поиска",
  "Lookup Bind Password must be re-entered to change LDAP configurations":
    "Для изменения конфигурации LDAP необходимо повторно ввести пароль привязки поиска.",
  "Manage Groups": "Управление группами",
  Mandatory: "Обязательный",
  "Manually Configure String": "Настроить строку вручную",
  March: "Март",
  "Max IO": "Макс. I/O",
  "Max Sleep": "Макс. пауза",
  "Max Wait": "Макс. ожидание",
  "Maximum IO requests allowed between objects to slow down heal operation, e.g. 3":
    "Макс. число запросов ввода-вывода между объектами для замедления восстановления, напр., 3",
  "Maximum limit for undelivered messages, defaults to '10000'":
    "Максимальный лимит недоставленных сообщений, по умолчанию '10000'",
  "Maximum number of concurrent requests, e.g. '1600'":
    "Максимальное количество одновременных запросов, напр., '1600'",
  "Maximum sleep duration between objects to slow down heal operation, e.g. 2s":
    "Макс. длительность паузы между объектами для замедления восстановления, напр., 2s",
  "Maximum wait time between operations, defaults to '15s'":
    "Максимальное время ожидания между операциями, по умолчанию '15s'",
  May: "Май",
  "May try again or download Health report JSON File.":
    "Попробуйте ещё раз или скачайте JSON-файл отчёта о состоянии.",
  Members: "Участники",
  "Memory Info": "Информация о памяти",
  Metadata: "Метаданные",
  "Metadata Sync": "Синхронизация метаданных",
  Method: "Метод",
  "Mime Types": "MIME-типы",
  'Mime types e.g. "text/*", "application/json" or "application/xml" - you can write one per field':
    'MIME-типы, напр., "text/*", "application/json" или "application/xml" — по одному в поле',
  minute: "минута",
  minutes: {
    one: "минута",
    few: "минуты",
    many: "минут",
    other: "минуты",
  },
  Minutes: "Минуты",
  Mode: "Режим",
  "Mode:": "Режим:",
  month: "месяц",
  months: {
    one: "месяц",
    few: "месяца",
    many: "месяцев",
    other: "месяца",
  },
  "More filter options": "Дополнительные параметры фильтра",
  "MQTT password": "Пароль MQTT",
  "MQTT server endpoint e.g. `tcp://localhost:1883`":
    "Конечная точка сервера MQTT, напр., `tcp://localhost:1883`",
  "MQTT username": "Имя пользователя MQTT",
  "Multi Bucket lifecycle Assignments Results":
    "Результаты назначения жизненного цикла для нескольких бакетов",
  Name: "Имя",
  "Name for identity provider configuration":
    "Имя конфигурации поставщика удостоверений",
  "Name of the AMQP exchange": "Имя точки обмена AMQP",
  'Name of the location of the server e.g. "us-west-rack2"':
    'Название расположения сервера, напр., "us-west-rack2"',
  "Name of the MQTT topic to publish": "Имя публикуемого топика MQTT",
  "Name:": "Имя:",
  'Namespace prefix to isolate tenants e.g. "customer1/"':
    'Префикс пространства имён для изоляции тенантов, напр., "customer1/"',
  "NATS password": "Пароль NATS",
  "NATS server address e.g. '0.0.0.0:4222'":
    "Адрес сервера NATS, напр., '0.0.0.0:4222'",
  "NATS subscription subject": "Тема подписки NATS",
  "NATS token": "Токен NATS",
  "NATS username": "Имя пользователя NATS",
  "Network Info": "Информация о сети",
  "New {entity} Created": "Создано: {entity}",
  "New Audit Webhook": "Новый вебхук аудита",
  "New Endpoint": "Новая конечная точка",
  "New Endpoint:": "Новая конечная точка:",
  "New Folder Path": "Новый путь к папке",
  "New Logger Webhook": "Новый вебхук журнала",
  "New Password": "Новый пароль",
  "New passwords don't match": "Новые пароли не совпадают.",
  "New Tag Key": "Новый ключ тега",
  "New Tag Label": "Новая метка-тег",
  Next: "Далее",
  No: "Нет",
  "No changes applied": "Изменения не применены.",
  "No Changes at this time": "На данный момент изменений нет.",
  "No data available": "Нет данных",
  "No Groups Available": "Нет доступных групп",
  "No Policies Available": "Нет доступных политик",
  "No query results yet": "Пока нет результатов по запросу",
  "No Results Available": "Нет доступных результатов",
  "No Users to display": "Нет пользователей для отображения.",
  "No Wait": "Без ожидания",
  "no-expiry": "бессрочный",
  "Nodes:": "Узлы:",
  "Non-blocking message delivery when set to 'on', default is 'off'":
    "Неблокирующая доставка сообщений при 'on', по умолчанию 'off'",
  "Non-Current": "Неактуальные",
  "Non-current Expiration Days": "Дней до истечения неактуальных версий",
  "Non-current Transition Days": "Дней до переноса неактуальных версий",
  "Non-Current Version": "Устаревшая версия",
  "Non-current Version Transition Storage Class":
    "Класс хранения перехода к устаревшей версии",
  None: "Нет",
  "Not what you expected?": "Не то, что вы ожидали?",
  "Note:": "Примечание:",
  "Note: AccessKey and SecretKey values for every site is required while adding or editing peer sites":
    "Примечание: При добавлении или изменении одноранговых сайтов необходимо указать AccessKey и SecretKey для каждого сайта.",
  November: "ноябрь",
  "NSQ server address e.g. '127.0.0.1:4150'":
    "Адрес сервера NSQ, напр., '127.0.0.1:4150'",
  "NSQ topic": "Топик NSQ",
  "NSQD Address": "Адрес NSQD",
  "NULL VERSION": "NULL VERSION",
  "Number of {unit} must be less than or equal to 2147483647":
    "Число {unit} должно быть меньше или равно 2147483647.",
  "Number of {unit} to retain must be greater than zero":
    "Число {unit} для сохранения должно быть больше нуля.",
  "Number of messages to publish without waiting for ACKs":
    "Количество сообщений для публикации без ожидания ACK.",
  "Number of replication workers for recently failed replicas, defaults to 4":
    "Количество воркеров репликации для недавно сбойных реплик, по умолчанию 4",
  "Number of replication workers, defaults to 100":
    "Количество воркеров репликации, по умолчанию 100",
  Object: "Объект",
  "Object Date": "Дата объекта",
  "Object Filters": "Фильтры объектов",
  "Object Info": "Информация об объекте",
  "Object Locking:": "Блокировка объектов:",
  "Object Size": "Размер объекта",
  "Object Version": "Версия объекта",
  "Objects deleted successfully.": "Объекты успешно удалены.",
  "Objects in excluded prefixes do not replicate to any peer site or remote site.":
    "Объекты в исключенных префиксах не реплицируются ни на одноранговый, ни на удаленный сайт.",
  "Objects List unavailable. Please review your WebSockets configuration and try again":
    "Список объектов недоступен. Проверьте конфигурацию WebSockets и повторите попытку.",
  "Objects:": "Объекты:",
  "Objs/S": "об./с",
  October: "октябрь",
  of: "из",
  "Only empty tiers can be deleted. If the tier has had objects transitioned into it, it cannot be removed.":
    "Удалить можно только пустые уровни хранения. Если на уровень уже перемещались объекты, удалить его нельзя.",
  "Opaque string or JWT authorization token":
    "Непрозрачная строка или токен авторизации JWT",
  "Open Dialog": "Открыть диалог",
  "OpenID Configurations": "Конфигурации OpenID",
  "OS Info": "Сведения об ОС",
  other: "другое",
  "Password for LDAP read-only service account used to perform DN and group lookups":
    "Пароль учётной записи чтения LDAP для поиска DN и групп",
  "Password for SASL/PLAIN or SASL/SCRAM authentication":
    "Пароль для аутентификации SASL/PLAIN или SASL/SCRAM",
  "Passwords must be at least 8 characters long":
    "Пароли должны быть длиной не менее 8 символов.",
  Path: "Путь",
  "Path cannot start with /": "Путь не может начинаться с /",
  "Path copied to clipboard": "Путь скопирован в буфер обмена.",
  "Path Prefix": "Префикс пути",
  "Path to certificate chain of the target NATS server":
    "Путь к цепочке сертификатов целевого сервера NATS",
  "Path to client certificate for mTLS authorization":
    "Путь к сертификату клиента для авторизации mTLS.",
  "Path to client key for mTLS authorization":
    "Путь к клиентскому ключу для авторизации mTLS.",
  "Peer Sites": "Одноранговые сайты",
  "Perform bitrot scan on disks when checking objects during scanner":
    "Выполнять битрот-сканирование дисков при проверке объектов во время сканирования.",
  "Performance test": "Тест производительности",
  "Persist queue across broker restarts when set to 'on', default is 'off'":
    "Сохранять очередь при перезапуске брокера при 'on', по умолчанию 'off'",
  "Ping Interval": "Интервал пинга",
  "Please avoid the use of root credentials for this feature":
    "Пожалуйста, избегайте использования учетных данных root для этой функции.",
  "Please configure {entity} first to use this feature.":
    "Пожалуйста, сначала настройте {entity}, чтобы использовать эту функцию.",
  "Please deploy a server in {distributedMode} to use these features.":
    "Пожалуйста, разверните сервер в {distributedMode}, чтобы использовать эти функции.",
  "Please deploy a server in {mode} to use this feature.":
    "Пожалуйста, разверните сервер в {mode}, чтобы использовать эту функцию.",
  "N/A": "Н/Д",
  "Enter a positive quota below 8 PiB, with up to two decimal places. Use mcli for larger quotas.":
    "Введите положительную квоту ниже 8 ПиБ, с точностью до двух знаков после запятой. Используйте mcli для увеличения квоты.",
  "The current quota is 8 PiB or larger, which the browser cannot edit exactly. Change it with mcli, enter a smaller quota, or disable it here.":
    "Текущая квота составляет 8 ПиБ или больше, и браузер не может точно редактировать ее. Измените его с помощью mcli, введите меньшую квоту или отключите ее здесь.",
  "Please Login via the configured external identity provider.":
    "Пожалуйста, войдите в систему через настроенного внешнего поставщика удостоверений.",
  "Please note": "Обратите внимание",
  "Please note that this may cause your system to not be accessible":
    "Обратите внимание, что это может привести к тому, что ваша система станет недоступной.",
  "Please refer to {link} credentials.":
    "Пожалуйста, обратитесь к учетным данным {link}.",
  "Please select / type the desired remote bucket were you want the local data to be replicated.":
    "Выберите или введите удалённый бакет, в который нужно реплицировать локальные данные.",
  "Please select a valid duration.":
    "Пожалуйста, выберите допустимую продолжительность.",
  "Please select Groups on which you want to apply Policies":
    "Выберите группы, к которым вы хотите применить политику.",
  "Please verify that string is uppercase only and contains valid characters (numbers, dashes & underscores).":
    "Убедитесь, что строка имеет только верхний регистр и содержит допустимые символы (цифры, тире и подчеркивания).",
  Policy: "Политика",
  "Policy has no statements": "В политике нет инструкций",
  "Policy mapping": "Сопоставление политик",
  "Policy Mappings": "Сопоставление политик",
  "Policy Name": "Имя политики",
  "Policy name cannot be empty": "Имя политики не может быть пустым.",
  "Policy successfully updated": "Политика успешно обновлена.",
  "Policy Summary": "Краткое описание политики",
  "Portions © 2015–2026 MinIO, Inc.": "Части кода © 2015–2026 MinIO, Inc.",
  prefix: "префикс",
  Prefix: "Префикс",
  "Preliminar Results:": "Предварительные результаты:",
  preview: "предпросмотр",
  Preview: "Предпросмотр",
  "Preview - {object}": "Предпросмотр — {object}",
  "Preview Selected File": "Предпросмотр выбранного файла",
  "Preview this File": "Предпросмотр файла",
  "Preview unavailable": "Предпросмотр недоступен",
  Priority: "Приоритет",
  private: "приватный",
  Private: "Приватный",
  "Process Info": "Информация о процессе",
  public: "публичный",
  Public: "Публичный",
  "PUT - Object Uploaded": "PUT — Объект загружен",
  "Query Filters": "Фильтры запросов",
  "Query Results": "Результаты запроса",
  Queue: "Очередь",
  "Queue Dir": "Каталог очереди",
  "Queue Directory": "Каталог очереди",
  "Queue Limit": "Лимит очереди",
  "Quietly ignore undelivered messages when set to 'off', default is 'on'":
    "Тихо игнорировать недоставленные сообщения при 'off', по умолчанию 'on'",
  quota: "квота",
  Quota: "Квота",
  "Quota:": "Квота:",
  "Randomized access credentials are recommended, and provided by default. You may use your own custom Access Key and Secret Key by replacing the default values. After creation of any Access Key, you will be given the opportunity to view and download the account credentials.":
    "Рекомендуется использовать учетные данные для произвольного доступа, которые предоставляются по умолчанию. Вы можете использовать свой собственный ключ доступа и секретный ключ, заменив значения по умолчанию. После создания любого ключа доступа вам будет предоставлена возможность просмотреть и загрузить учетные данные учетной записи.",
  "Raw Policy": "Необработанная политика",
  readonly: "только чтение",
  readwrite: "чтение и запись",
  "Reconnect Interval": "Интервал повторного подключения",
  "Reconnect interval for MQTT connections in s,m,h,d":
    "Интервал переподключения для MQTT в s,m,h,d",
  "Redirect URI Dynamic": "Динамический URI перенаправления",
  "Redis key to store/update events, key is auto-created":
    "Ключ Redis для хранения/обновления событий (создаётся автоматически)",
  "Redis server password": "Пароль сервера Redis",
  "Redis server's address e.g. `localhost:6379`":
    "Адрес сервера Redis, напр., `localhost:6379`",
  Refresh: "Обновить",
  "Refresh List": "Обновить список",
  Region: "Регион",
  "Remote Bucket Assignments": "Назначения удалённых бакетов",
  "Remote Configuration": "Удаленная настройка",
  "Remote Endpoint Configuration": "Конфигурация удаленной конечной точки",
  "Remote Host": "Удаленный хост",
  "remote tier": "удаленный уровень",
  "Remove Row": "Удалить строку",
  "Remove Selected Replication Rules": "Удалить выбранные правила репликации",
  "Remove Selected Rules": "Удалить выбранные правила",
  "Remove the reference to the object if no versions are left":
    "Удалить ссылку на объект, если версий не осталось.",
  "Removes all the versions of the object already expired":
    "Удаляет все версии объекта, срок действия которых истек.",
  "Rename Download": "Переименовать скачиваемый файл",
  "REPLICA - Object Replicated": "REPLICA — Реплицированный объект",
  "Replicate existing objects": "Реплицировать существующие объекты",
  "Replicate soft deletes": "Реплицировать логические удаления",
  "Replicate versioned deletes": "Реплицировать удаления версий",
  Replication: "Репликация",
  "Replication Failed Workers": "Воркеры для сбойных репликаций",
  "Replication Mode": "Режим репликации",
  "Replication Options": "Параметры репликации",
  "Replication Rules": "Правила репликации",
  "Replication Status": "Статус репликации",
  "Replication status for {type}: {name}.":
    "Статус репликации для {type}: {name}.",
  "Replication status from all Sites": "Статус репликации со всех площадок",
  "Replication Workers": "Воркеры репликации",
  "Replication:": "Репликация:",
  "Reported Usage:": "Заявленное использование:",
  "Request Content Length": "Длина содержимого запроса",
  "Request ID": "ID запроса",
  "Requests Max": "Макс запросов",
  "Requests that took T ms or less":
    "Запросы, выполнение которых заняло T мс или меньше",
  Reset: "Сброс",
  "Reset Configuration": "Сбросить конфигурацию",
  "Reset Default Webhook": "Сбросить вебхук по умолчанию",
  "Resources:": "Ресурсы:",
  "Response Content Length": "Длина содержимого ответа",
  "Response Status": "Статус ответа",
  "Response Status Code": "Код состояния ответа",
  "Response Threshold": "Порог ответа",
  Restart: "Перезагрузка",
  "Restore Defaults": "Восстановить настройки по умолчанию",
  "Restore File Version": "Восстановить версию файла",
  "Restore this version": "Восстановить эту версию",
  "Restrict beyond user policy":
    "Ограничить за пределами пользовательской политики",
  Results: "Результаты",
  Retention: "Хранение",
  "Retention Mode": "Режим хранения",
  "Retention Policy:": "Политика хранения:",
  "Retention Unit": "Единица срока хранения",
  "Retention Validity": "Срок хранения",
  "Retention:": "Удержание:",
  Retest: "Повторный тест",
  "Retry Health Report": "Повторить отчет о состоянии",
  Rewind: "Перемотка назад",
  "Rewind - {bucket}": "Перемотка назад - {bucket}",
  "Rewind Bucket": "Ретроспектива бакета",
  "Rewind to": "На момент",
  "Role Policy": "Ролевая политика",
  rotating: "вращающийся",
  "Routing Key": "Ключ маршрутизации",
  "Routing key for publishing": "Ключ маршрутизации для публикации.",
  "Rule State": "Состояние правила",
  "Rule Type": "Тип правила",
  "Running {mcDu} without the {flag} flag or {df} will provide different values corresponding to the size of all {current} versions and the physical disk space occupied respectively.":
    "Запуск {mcDu} без флага {flag} или {df} предоставит разные значения, соответствующие размеру всех версий {current} и занятому пространству на физическом диске соответственно.",
  "S3 lifecycle": "жизненный цикл S3",
  "SASL authentication mechanism": "Механизм аутентификации SASL",
  "SASL authentication mechanism, default 'PLAIN'":
    "Механизм аутентификации SASL, по умолчанию 'PLAIN'",
  "SASL Mechanism": "Механизм SASL",
  "SASL Password": "Пароль SASL",
  "SASL Username": "Имя пользователя SASL",
  "Save Event Destination": "Сохранить получателя событий",
  "Save Tier Configuration": "Сохранить конфигурацию уровня",
  Scanner: "Сканер",
  "SCANNER - Object has too many versions / Prefixes has too many sub-folders":
    "SCANNER — у объекта слишком много версий/в префиксах слишком много подпапок.",
  "Scanner delay multiplier, defaults to '10.0'":
    "Множитель задержки сканера, по умолчанию '10.0'",
  Scopes: "Области доступа",
  Search: "Поиск",
  "Search Access Keys": "Поиск ключей доступа",
  "Search Groups": "Поиск групп",
  "Search Keys with pattern": "Поиск ключей по шаблону",
  "Search members": "Поиск участников",
  "Search Policies": "Поиск политик",
  "Search target": "Цель поиска",
  "Search Users": "Поиск пользователей",
  second: "секунда",
  seconds: {
    one: "секунда",
    few: "секунды",
    many: "секунд",
    other: "секунды",
  },
  "Secret Key": "Секретный ключ",
  "SecretKey is required": "Требуется SecretKey",
  "Select {expiry} to delete Objects per this rule. Select {transition} to move Objects to a remote storage {tier} per this rule.":
    "Выберите {expiry}, чтобы удалить объекты согласно этому правилу. Выберите {transition}, чтобы переместить объекты в удаленное хранилище {tier} в соответствии с этим правилом.",
  "Select Bucket": "Выбрать бакет",
  "Select from the list of displayed users to assign users to the new group at creation. These users inherit the policies assigned to the group.":
    "Выберите из списка отображаемых пользователей, чтобы назначить пользователей в новую группу при создании. Эти пользователи наследуют политики, назначенные группе.",
  "Select Groups to delete": "Выберите группы для удаления",
  "Select Multiple Versions": "Выберите несколько версий",
  "Select Policy": "Выберите политику",
  "Select the desired level of access available to unauthenticated Users":
    "Выберите желаемый уровень доступа, доступный для неаутентифицированных пользователей.",
  "Select Tier Type": "Выберите тип уровня",
  "Select to set expiry by days or newer noncurrent versions":
    "Выберите, чтобы установить срок действия в днях или более новые, неактуальные версии.",
  "Select Users to delete": "Выберите пользователей для удаления",
  "Select Users to group": "Выберите пользователей для группы",
  "Select whether to apply the rule to current or non-current Object {versions}":
    "Выберите, применять ли правило к текущим или неактуальным {versions} объектов",
  "Selected Group": "Выбранная группа",
  "Selected Groups": "Выбранные группы",
  "Selected Object": "Выбранный объект",
  "Selected Objects:": "Выбранные объекты:",
  "Selected User": "Выбранный пользователь",
  "Selected Users": "Выбранные пользователи",
  September: "сентябрь",
  Series: "Серия",
  server: "сервер",
  "Server Address": "Адрес сервера",
  "Server Address is required": "Требуется адрес сервера",
  "Server Config": "Конфигурация сервера",
  "Server Health Info": "Информация о состоянии сервера",
  "Server Insecure": "Сервер небезопасен",
  "Server Location": "Местоположение сервера",
  "server-side bucket replication": "репликация бакетов на стороне сервера",
  "Server, client and Console are all AGPLv3. SILO's documentation is CC BY 4.0 — {licensing}.":
    "Сервер, клиент и консоль относятся к AGPLv3. Документация SILO — CC BY 4.0 — {licensing}.",
  Service: "Сервис",
  "Service Accounts": "Сервисные аккаунты",
  Services: "Службы",
  Set: "Задать",
  "Set Anonymous Access to this Folder":
    "Настроить анонимный доступ к этой папке",
  "Set Bucket Replication": "Настроить репликацию бакета",
  "Set Groups": "Установить группы",
  "Set Legal Hold": "Задать юридическое удержание",
  "Set Lifecycle to multiple buckets":
    "Настроить жизненный цикл для нескольких бакетов",
  "Set Multiple Bucket Replication": "Настроить репликацию нескольких бакетов",
  "Set Non-current Version Transition Storage Class":
    "Задать класс хранения для переноса неактуальных версий",
  "Set Policies": "Установить политики",
  "Set Retention Configuration": "Настроить хранение",
  "Set Retention Policy": "Задать политику хранения",
  "Set the quality of service priority, defaults to '0'":
    "Задать приоритет QoS, по умолчанию '0'",
  "Set to '1' for non-persistent or '2' for persistent queue":
    "Установите '1' для непостоянной очереди или '2' для постоянной очереди",
  "Set to 'on' for exchange to be not used directly by publishers, but only when bound to other exchanges":
    "Установите 'on', чтобы точка обмена (exchange) не использовалась напрямую отправителями, а только при привязке к другим точкам обмена",
  "Set to 'on' to enable asynchronous publish":
    "Установите 'on', чтобы включить асинхронную публикацию",
  "Set to 'on' to enable SASL authentication":
    "Установите 'on', чтобы включить аутентификацию SASL",
  "Set to 'on' to enable TLS": "Установите 'on', чтобы включить TLS",
  "Set to 'on' to use streaming NATS server":
    "Установите 'on', чтобы использовать потоковый сервер NATS",
  "Setting a {quota} assigns a hard limit to a bucket beyond which SILO does not allow writes.":
    "Установка {quota} задаёт жёсткий лимит для бакета, сверх которого SILO не разрешает запись.",
  "Setting an {anonymous} policy allows clients to access the Bucket or prefix contents and perform actions consistent with the specified policy without authentication.":
    "Установка политики {anonymous} позволяет клиентам обращаться к содержимому бакета или префикса и выполнять разрешённые политикой действия без аутентификации.",
  Share: "Поделиться",
  "Share File": "Поделиться файлом",
  "Share Selected File": "Поделиться выбранным файлом",
  "Share this File": "Поделиться этим файлом",
  "Share this version": "Поделиться этой версией",
  "Share URL Copied to clipboard":
    "Ссылка для доступа скопирована в буфер обмена",
  'Shared bucket DNS records, default is "/skydns"':
    'DNS-записи общих бакетов, по умолчанию "/skydns"',
  "Show advanced Filters": "Показать расширенные фильтры",
  "Show Current Data": "Показать текущие данные",
  "Show deleted objects": "Показать удалённые объекты",
  "Show Rewind Data": "Показать данные ретроспективы",
  "Show/Hide": "Показать/Скрыть",
  "SILO {bucketNotifications} allow administrators to send notifications to supported external services on certain object or bucket events.":
    "{bucketNotifications} в SILO позволяют администраторам отправлять уведомления во внешние службы при определённых событиях объектов или бакетов.",
  "SILO {objectLocking} enforces Write-Once Read-Many (WORM) immutability to protect versioned objects from deletion.":
    "SILO {objectLocking} обеспечивает неизменяемость однократной записи и многократного чтения (WORM) для защиты объектов с версиями от удаления.",
  "SILO {serverSideReplication} is an automatic bucket-level configuration that synchronizes objects between a source and destination bucket.":
    "{serverSideReplication} в SILO — это автоматическая конфигурация на уровне бакета, синхронизирующая объекты между исходным и целевым бакетами.",
  "SILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events. SILO supports bucket and object-level S3 events similar to the Amazon S3 Event Notifications.":
    "Уведомления бакетов SILO позволяют администраторам отправлять уведомления во внешние службы при определённых событиях объектов или бакетов. SILO поддерживает события S3 на уровне бакетов и объектов аналогично уведомлениям о событиях Amazon S3.",
  "SILO derives its behavior and syntax from {s3Lifecycle} for compatibility in migrating workloads and lifecycle rules from S3 to SILO.":
    "SILO получает свое поведение и синтаксис от {s3Lifecycle} для совместимости при переносе рабочих нагрузок и правил жизненного цикла с S3 на SILO.",
  "SILO does not enable existing object replication by default. Objects created before replication was configured or while replication is disabled are not synchronized to the target deployment unless replication of existing objects is enabled.":
    "SILO по умолчанию не включает репликацию существующих объектов. Объекты, созданные до настройки репликации или пока репликация отключена, не синхронизируются с целевым развертыванием, если не включена репликация существующих объектов.",
  "SILO Health Info": "Состояние системы SILO",
  "SILO Object Lifecycle Management allows creating rules for time or date based automatic transition or expiry of objects. For object transition, SILO automatically moves the object to a configured remote storage tier.":
    "SILO Управление жизненным циклом объектов позволяет создавать правила для автоматического перехода или истечения срока действия объектов на основе времени или даты. Для перехода объекта SILO автоматически перемещает объект на настроенный уровень удаленного хранилища.",
  "SILO or other S3-compatible storage":
    "SILO или другое S3-совместимое хранилище",
  "SILO PBAC is built for compatibility with AWS IAM policy syntax, structure, and behavior.":
    "SILO PBAC создан для совместимости с синтаксисом, структурой и поведением политики AWS IAM.",
  "SILO queries the configured Active Directory / LDAP server to verify the credentials specified by the application and optionally return a list of groups in which the user has membership. SILO supports two modes (Lookup-Bind Mode and Username-Bind Mode) for performing these queries":
    "SILO запрашивает настроенный сервер Active Directory / LDAP для проверки учетных данных, указанных приложением, и, при необходимости, возвращает список групп, в которых состоит пользователь. SILO поддерживает два режима (режим поиска-привязки и режим привязки имени пользователя) для выполнения этих запросов.",
  "SILO recommends using Lookup-Bind mode as the preferred method for verifying AD/LDAP credentials. Username-Bind mode is a legacy method retained for backwards compatibility only.":
    "SILO рекомендует использовать режим Lookup-Bind в качестве предпочтительного метода проверки учетных данных AD/LDAP. Режим Username-Bind — это устаревший метод, сохраненный только для обратной совместимости.",
  "SILO requires versioning to support replication.":
    "SILO требует управления версиями для поддержки репликации.",
  "SILO supports automatically replicating existing objects in a bucket; this setting is enabled by default. Please note that objects created before replication was configured or while replication is disabled are not synchronized to the target deployment in case this setting is not enabled.":
    "SILO поддерживает автоматическую репликацию существующих объектов в бакете; этот параметр включён по умолчанию. Обратите внимание, что объекты, созданные до настройки репликации или пока репликация была отключена, не синхронизируются с целевым развёртыванием, если этот параметр выключен.",
  "SILO supports creating object transition lifecycle management rules, where SILO can automatically move an object to a remote storage “tier”.":
    "SILO поддерживает создание правил управления жизненным циклом перехода объекта, где SILO может автоматически перемещать объект на «уровень» удаленного хранилища.",
  "SILO supports enabling automatic {sseKms} and {sseS3} encryption of all objects written to a bucket using a specific External Key (EK) stored on the external KMS.":
    "SILO поддерживает автоматическое шифрование {sseKms} и {sseS3} для всех объектов, записываемых в бакет, с использованием внешнего ключа (EK) во внешнем KMS.",
  "SILO supports enabling replication of existing objects in a bucket.":
    "SILO поддерживает репликацию существующих объектов в бакете.",
  "SILO supports keeping multiple {versions} of an object in a single bucket.":
    "SILO поддерживает хранение нескольких {versions} объекта в одном бакете.",
  "SILO supports replicating delete operations, where SILO synchronizes deleting specific object versions and new delete markers. Delete operation replication uses the same replication process as all other replication operations.":
    "SILO поддерживает репликацию операций удаления, где SILO синхронизирует удаление определенных версий объекта и новых маркеров удаления. Репликация операции удаления использует тот же процесс репликации, что и все другие операции репликации.",
  "SILO supports server-side and client-side replication of objects between source and destination buckets.":
    "SILO поддерживает репликацию объектов на стороне сервера и клиента между исходным и целевым бакетами.",
  "SILO supports setting both {bucketDefault} and per-object retention rules.":
    "SILO поддерживает установку как {bucketDefault}, так и правил хранения для каждого объекта.",
  "SILO supports the following Tier types:":
    "SILO поддерживает следующие типы уровней:",
  "SILO supports using an Active Directory or LDAP (AD/LDAP) service for external management of user identities. Configuring an external IDentity Provider (IDP) enables Single-Sign On (SSO) workflows, where applications authenticate against the external IDP before accessing SILO.":
    "SILO поддерживает использование службы Active Directory или LDAP (AD/LDAP) для внешнего управления удостоверениями пользователей. Настройка внешнего поставщика удостоверений (IDP) позволяет использовать рабочие процессы единого входа (SSO), в которых приложения аутентифицируются по внешнему IDP перед доступом к SILO.",
  "SILO uses buckets to organize objects. A bucket is similar to a folder or directory in a filesystem, where each bucket can hold an arbitrary number of objects.":
    "SILO использует бакеты для организации объектов. Бакет похож на папку или каталог в файловой системе, где каждый бакет может содержать произвольное количество объектов.",
  "SILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.":
    "SILO использует контроль доступа на основе политик (PBAC) для определения авторизованных действий и ресурсов, к которым имеет доступ аутентифицированный пользователь. Каждая политика описывает одно или несколько действий и условий, определяющих разрешения пользователя или группы пользователей.",
  "SILO VERSION": "SILO VERSION",
  "Site Name": "Имя сайта",
  "Site:": "Сайт:",
  Size: "Размер",
  "Size:": "Размер:",
  "Skip TLS Verification": "Пропустить проверку TLS",
  "something went wrong": "что-то пошло не так",
  "Something went wrong.": "Что-то пошло не так.",
  "Sort by": "Сортировать по",
  "Specify the version of the Kafka cluster": "Укажите версию кластера Kafka",
  "Specify the version of the Kafka cluster e.g '2.2.0'":
    "Укажите версию кластера Kafka, напр., '2.2.0'",
  "Speed Test results:": "Результаты теста скорости:",
  Speedtest: "Тест скорости",
  "Speedtest in progress...": "Идет тест скорости...",
  "Staging directory for undelivered messages e.g. '/home/events'":
    "Промежуточный каталог для недоставленных сообщений, напр., '/home/events'",
  "STANDARD_IA,REDUCED_REDUNDANCY etc":
    "STANDARD_IA,REDUCED_REDUNDANCY и т. д.",
  Start: "Начало",
  "Start Health Report": "Начать отчет о состоянии",
  "Start Logs": "Запустить журнал",
  "Start Profiling": "Начать профилирование",
  "Start Time:": "Время начала:",
  "Start typing to filter objects in the bucket":
    "Начните вводить текст, чтобы отфильтровать объекты в бакете.",
  "Start typing to filter versions of {file}":
    "Начните вводить текст, чтобы отфильтровать версии {file}",
  "Start typing to search for a Policy":
    "Начните вводить текст для поиска политики",
  "Start typing to search for Groups": "Начните вводить текст для поиска групп",
  Statements: "Инструкции",
  Status: "Состояние",
  "Status Code": "Код состояния",
  Stop: "Стоп",
  "Stop Logs": "Остановить журнал",
  "Stop Profiling": "Прекратить профилирование",
  Storage: "Хранилище",
  "Storage Class": "Класс хранения",
  Streaming: "Стриминг",
  "Streaming async": "Асинхронная потоковая передача",
  "Streaming Cluster ID": "ID кластера потоковой передачи",
  "Streaming max publish ACKS in flight":
    "Макс. число неподтверждённых ACK при потоковой публикации",
  Subject: "Тема",
  "Subscribe To Bucket Events": "Подписаться на события бакета",
  "Subscribe to Event": "Подписаться на событие",
  Success: "Успех",
  "Successfully deleted.": "Успешно удалено.",
  "Successfully updated the password for the user {user}.":
    "Пароль для пользователя {user} успешно обновлен.",
  "Successfully updated the password.": "Пароль успешно обновлен.",
  Suffix: "Суффикс",
  Summary: "Сводка",
  "Supported API endpoints": "Поддерживаемые конечные точки API",
  Suspended: "Приостановлено",
  Synced: "Синхронизировано",
  Synchronous: "Синхронный",
  "System Health Info": "Информация о состоянии системы",
  Table: "Таблица",
  "Tag for: {object}": "Тег для: {object}",
  "Tag Key": "Ключ тега",
  "Tag Label": "Метка тега",
  "Tag Value": "Значение тега",
  Tags: "Теги",
  "Tags for: {object}": "Теги для: {object}",
  "Tags:": "Теги:",
  "Target Bucket": "Целевой бакет",
  "Target URL": "Целевой URL",
  "The bucket selected in this deployment acts as the “source” while the configured remote deployment acts as the “target”.":
    "Бакет, выбранный в этом развёртывании, выступает в роли «источника», а настроенное удалённое развёртывание — в роли «цели».",
  "The file must be valid and  should have valid config values":
    "Файл должен быть действительным и иметь действительные значения конфигурации.",
  "The file you are trying to download has a long name.":
    "Файл, который вы пытаетесь загрузить, имеет длинное имя.",
  "The following Bucket features will NOT be replicated":
    "Следующие функции бакета НЕ реплицируются",
  "The following changes are replicated to all other sites":
    "Следующие изменения реплицируются на все остальные сайты",
  "The following URL lets you share this object without requiring a login.":
    "Следующий URL позволяет вам поделиться этим объектом без необходимости входа в систему.",
  "The current version of this object is a delete marker and cannot be shared.":
    "Текущая версия этого объекта является маркером удаления, и ей нельзя поделиться.",
  "The selected object version could not be found. Refresh the object list and try again.":
    "Не удалось найти выбранную версию объекта. Обновите список объектов и повторите попытку.",
  "This server does not expose object versions; only the current object can be shared.":
    "Этот сервер не предоставляет версии объектов; поделиться можно только текущим объектом.",
  "The instance needs to be restarted for configuration changes to take effect.":
    "Чтобы изменения конфигурации вступили в силу, необходимо перезапустить экземпляр.",
  "The MinIO name is used here solely to identify the origin of the source code and to describe compatibility — {notice}.":
    "Имя MinIO используется здесь исключительно для идентификации происхождения исходного кода и описания совместимости — {notice}.",
  "The selected users were added to the following groups.":
    "Выбранные пользователи были добавлены в следующие группы.",
  "The server is restarting.": "Сервер перезагружается.",
  "The URL expires automatically at the earlier of your configured time ({time}) or the expiration of your current web session.":
    "Срок действия URL истекает автоматически в установленное вами время ({time}) или по истечении текущего веб-сеанса.",
  "There are no Configurations yet.": "Конфигураций пока нет.",
  "There are no endpoints yet.": "Конечных точек пока нет.",
  "There are no Groups with this Policy associated yet.":
    "Пока нет групп, связанных с этой политикой.",
  "There are no Groups yet.": "Групп пока нет.",
  "There are no Policies yet.": "Политик пока нет.",
  "There are no tags for this object": "Для этого объекта нет тегов",
  "There are no User Access Keys yet.": "Ключей доступа пользователя пока нет.",
  "There are no Users with this Policy associated yet.":
    "Пока нет пользователей, связанных с этой Политикой.",
  "There are no Users yet.": "Пользователей пока нет.",
  "There is no information with this criteria":
    "По данному критерию информации нет.",
  "There was an error": "Произошла ошибка.",
  "There was an error creating a Policy ":
    "Произошла ошибка при создании политики.",
  "There was an error creating a Policy: {details}. Please check Policy syntax.":
    "Произошла ошибка при создании политики: {details}. Пожалуйста, проверьте синтаксис Политики.",
  "There was an error deleting the tier":
    "Произошла ошибка при удалении уровня.",
  "There was an error retrieving tier information":
    "Произошла ошибка при получении информации об уровне.",
  "There was an error updating the Policy ":
    "Произошла ошибка при обновлении Политики.",
  "There was an error updating the Policy: {details}. Please check Policy syntax.":
    "Произошла ошибка при обновлении Политики: {details}. Пожалуйста, проверьте синтаксис Политики.",
  "These features are unavailable in a single-disk setup.":
    "Эти функции недоступны при установке с одним диском.",
  "This action is irreversible.": "Это действие необратимо.",
  "This can cause issues on Windows Systems by trimming the file name after download.":
    "Это может вызвать проблемы в системах Windows из-за обрезки имени файла после загрузки.",
  "This configuration cannot be deleted using this module as this was set using OpenID environment variables.":
    "Эту конфигурацию нельзя удалить с помощью этого модуля, поскольку она была установлена с использованием переменных среды OpenID.",
  "this Console": "эта консоль",
  "This feature allows multiple independent SILO sites (or clusters) that are using the same external IDentity Provider (IDP) to be configured as replicas. In this situation the set of replica sites are referred to as peer sites or just sites.":
    "Эта функция позволяет настроить несколько независимых площадок (или кластеров) SILO, использующих один и тот же внешний поставщик удостоверений (IDP), в качестве реплик. Такой набор площадок-реплик называется одноранговыми площадками или просто площадками.",
  "This feature is not available for a single-disk setup.":
    "Эта функция недоступна при установке с одним диском.",
  "This feature is not available.": "Эта функция недоступна.",
  "This field is required": "Это поле обязательно для заполнения",
  "This is a File Preview for the first {count} pages of the document, if you wish to work with the full document please download instead.":
    "Это предпросмотр первых {count} страниц документа. Для работы с полным документом скачайте файл.",
  "This location is empty": "Эта локация пуста",
  "This location is empty, please try uploading a new file":
    "Это место пусто, попробуйте загрузить новый файл.",
  "This Site": "Этот сайт",
  "This site/cluster": "Этот сайт/кластер",
  "This Usage value is comparable to {command} which represents the size of all object versions that exist in the buckets.":
    "Это значение использования сопоставимо с {command} и отражает общий размер всех версий объектов в бакетах.",
  "This value is set from the {env} environment variable":
    "Это значение устанавливается из переменной среды {env}.",
  "This value is set from the {name} environment variable":
    "Это значение устанавливается из переменной среды {name}.",
  "This will be displayed only once. It cannot be recovered.":
    "Эти данные будут показаны только один раз. Восстановить их невозможно.",
  "This will change your Console password. Please note your new password down, as it will be required to log into Console after this session.":
    "Это изменит ваш пароль консоли. Запишите свой новый пароль, так как после этого сеанса он потребуется для входа в консоль.",
  "This will remove the object as well as all of its versions,":
    "Это удалит объект, а также все его версии,",
  "This will remove the objects as well as all of their versions,":
    "Это приведет к удалению объектов, а также всех их версий,",
  Tier: "Уровень",
  "Tier Name": "Название уровня",
  "Tier Types": "Типы уровней хранения",
  "Tiers are used by the SILO Object Lifecycle Management which allows creating rules for time or date based automatic transition or expiry of objects. For object transition, SILO automatically moves the object to a configured remote storage tier.":
    "Уровни хранения используются системой управления жизненным циклом объектов SILO, которая позволяет создавать правила для автоматического переноса или истечения срока действия объектов по времени или дате. При переносе объекта SILO автоматически перемещает его на настроенный удалённый уровень хранения.",
  "Time duration between scanner cycles, defaults to '1m'":
    "Интервал между циклами сканирования, по умолчанию '1m'",
  "Time to Response NS": "Время отклика (нс)",
  Timestamp: "Временная метка",
  "TLS Client Auth": "TLS-аутентификация клиента",
  "TLS skip verify": "Пропустить проверку TLS",
  "TLS Skip Verify": "Пропустить проверку TLS",
  "To allow Bucket access without credentials, use the {anonymous} setting":
    "Чтобы разрешить доступ к бакету без учётных данных, используйте настройку {anonymous}",
  "To continue please type {phrase} in the box.":
    "Чтобы продолжить, введите {phrase} в поле.",
  "To enable this feature you need to enable versioning on the bucket before creation":
    "Чтобы включить эту функцию, необходимо включить версионирование при создании бакета",
  "To Tier": "На уровень",
  "Today, {time}": "Сегодня {time}",
  "Toggle Share URL between Console and object server URL. Change default with CONSOLE_SHARE_MINIO_URL environment variable":
    "Переключить ссылку для доступа между консолью и URL объектного сервера. Значение по умолчанию изменяется переменной окружения CONSOLE_SHARE_MINIO_URL",
  Token: "Токен",
  "Toogle JSON": "Переключить JSON",
  "Toogle Share URL": "Переключить ссылку для доступа",
  Topic: "Тема",
  "Trace Results": "Результаты трассировки",
  "trademark notice": "уведомление о товарном знаке",
  Transition: "Переход",
  "Transition Days": "Переходные дни",
  True: "Истина",
  "Trust server TLS without verification": "Доверять TLS сервера без проверки",
  'Trust server TLS without verification, defaults to "on" (verify)':
    'Доверять TLS сервера без проверки, по умолчанию "on" (проверять)',
  Type: "Тип",
  "Type New Password Again": "Введите новый пароль ещё раз",
  "Type of Lifecycle": "Тип жизненного цикла",
  "Types to profile:": "Типы для профилирования:",
  "Unable to download widget data": "Невозможно загрузить данные виджета.",
  "Unable to download widget data - data not available":
    "Невозможно загрузить данные виджета — данные недоступны.",
  "Under section 13 of the AGPL, the corresponding source for this running version is offered to every user who interacts with it over a network, at no charge.":
    "Согласно разделу 13 лицензии AGPL, соответствующий исходный код этой работающей версии бесплатно предоставляется каждому пользователю, взаимодействующему с ней по сети.",
  "Understand which {policies} and {users} are authorized to access this Bucket.":
    "Узнайте, каким {policies} и {users} разрешён доступ к этому бакету.",
  "Unexpected response, download incomplete.":
    "Неожиданный ответ, загрузка не завершена.",
  Unhealthy: "Неисправно",
  "Unique descriptive string for this destination":
    "Уникальная строка описания для этого пункта назначения.",
  "Unique ID for NATS streaming cluster":
    "Уникальный ID для кластера потоковой передачи NATS",
  "Update Credentials - {type} / {name}":
    "Обновить учетные данные — {type} / {name}",
  "Upload File": "Загрузить файл",
  "Upload Files": "Загрузить файлы",
  "upload files to this bucket": "загружать файлы в этот бакет",
  "Upload Folder": "Загрузить папку",
  "Upload is restricted.": "Загрузка ограничена.",
  "Upload not allowed": "Загрузка не разрешена",
  "upload objects to this location": "загрузить объекты в это место",
  "Upstream copyright, authorship and license notices are retained in the repository's {credits} and {notice}. See the {attribution}.":
    "Уведомления об авторских правах, авторстве и лицензии исходной версии сохраняются в {credits} и {notice} репозитория. См. {attribution}.",
  "upstream MinIO code": "исходный код родительского проекта MinIO",
  "Usage Data Age": "Возраст данных",
  "Usage:": "Использование:",
  "Use Original Name": "Использовать оригинальное имя",
  "Use SASL": "Использовать SASL",
  "Use secure medium to share this key.":
    "Используйте защищенный носитель, чтобы поделиться этим ключом.",
  "Use TLS": "Использовать TLS",
  "Used to confirm a non-idempotent action.":
    "Используется для подтверждения неидемпотентного действия.",
  "User Access Keys": "Ключи доступа пользователя",
  "User Agent": "Пользовательский агент",
  "User Details - {user}": "Данные пользователя - {user}",
  "User DN Search Base DN is required":
    "Требуется база поиска DN пользователей",
  "User DN Search Filter is required":
    "Требуется фильтр поиска DN пользователей",
  "User Mappings": "Сопоставления пользователей",
  "User Name": "Имя пользователя",
  "Username for SASL/PLAIN or SASL/SCRAM authentication":
    "Имя пользователя для аутентификации SASL/PLAIN или SASL/SCRAM",
  "Users inherit access permissions to data and resources through the groups they belong to.":
    "Пользователи наследуют права доступа к данным и ресурсам через группы, к которым они принадлежат.",
  "Users with this Policy associated": "Пользователи с этой политикой",
  Validity: "Срок действия",
  "Validity:": "Срок действия:",
  Version: "Версия",
  "Version ID:": "ID версии:",
  "Versioning is required to enable {objectLocking} and {retention}.":
    "Для включения {objectLocking} и {retention} необходимо версионирование.",
  "Versioning on Bucket": "Версионирование бакета",
  "Versioning setting cannot be changed as cluster replication is enabled for this site.":
    "Параметр управления версиями нельзя изменить, поскольку для этого сайта включена репликация кластера.",
  "Versioning Status": "Статус версий",
  versions: {
    one: "версия",
    few: "версии",
    many: "версий",
    other: "версии",
  },
  Versions: {
    one: "версия",
    few: "версии",
    many: "версий",
    other: "версии",
  },
  "Versions:": "Версии:",
  View: "Посмотреть",
  "View across sites": "Просмотр на разных сайтах",
  "View Bucket Naming Rules": "Показать правила именования бакетов",
  "View env variable Webhook": "Показать вебхук из переменной окружения",
  "view Objects in this bucket": "просматривать объекты в этом бакете",
  "view Policy details": "просмотреть детали политики",
  "View Replication Status for a:": "Просмотр состояния репликации для:",
  "view User details": "просмотреть данные пользователя",
  "Visit the SILO website": "Посетите сайт SILO",
  "Volume or Bucket Name": "Имя тома или бакета",
  "Volume/Bucket name cannot start with /":
    "Имя тома/бакета не может начинаться с /",
  Warning: "Предупреждение",
  "Warning: One or more users selected has associated Access Keys.":
    "Предупреждение: у одного или нескольких выбранных пользователей есть связанные ключи доступа.",
  "Warning! The resulting file will contain server configuration information in plain text":
    "Внимание! Результирующий файл будет содержать информацию о конфигурации сервера в виде обычного текста.",
  "We recommend to rename the file download":
    "Рекомендуем переименовать файл загрузки.",
  "Webhook server endpoint e.g. http://localhost:8080/silo/events":
    "Конечная точка вебхук-сервера, напр., http://localhost:8080/silo/events",
  week: "неделя",
  weeks: {
    one: "неделя",
    few: "недели",
    many: "недель",
    other: "недели",
  },
  "What are Event Destinations?": "Что такое получатели событий?",
  "Would you like to encrypt {object}?": "Хотите зашифровать {object}?",
  "Write Policy": "Политика записи",
  "Write these down, as this is the only time the secret will be displayed.":
    "Запишите их, так как это единственный раз, когда секрет будет отображаться.",
  writeonly: "только запись",
  year: "год",
  years: {
    one: "год",
    few: "года",
    many: "лет",
    other: "года",
  },
  Years: "Годы",
  Yes: "Да",
  "Yes, I am sure": "Да, я уверен",
  "You can add a comment to this setting":
    "Вы можете добавить комментарий к этой настройке.",
  "You can add policies to the group by selecting it from the Groups view after creation. The Policy view lets you manage the assigned policies for the group.":
    "Вы можете добавить политики в группу, выбрав ее в представлении «Группы» после создания. Представление «Политика» позволяет управлять назначенными политиками для группы.",
  "You can choose to {excludePrefixes} from versioning if Object Locking is not enabled.":
    "Вы можете выбрать {excludePrefixes} из управления версиями, если блокировка объектов не включена.",
  "You can download the the Health report JSON File.":
    "Вы можете скачать JSON-файл отчёта о состоянии.",
  "You can increase the maximum configuration time by setting the MINIO_STS_DURATION environment variable on all your nodes.":
    "Максимальное время настройки можно увеличить, установив переменную среды MINIO_STS_DURATION на всех ваших узлах.",
  "You can learn more at the {documentation}.":
    "Подробнее см. в {documentation}.",
  "You can learn more at the {link}.": "Подробнее см. по ссылке {link}.",
  "You can only enable {objectLocking} when first creating a bucket.":
    "Включить {objectLocking} можно только при первом создании бакета.",
  "You can reset your session by logging out and logging back in to the web UI.":
    "Вы можете сбросить сеанс, выйдя из веб-интерфейса и войдя снова.",
  "You can specify an optional JSON-formatted IAM policy to further restrict Access Key access to a subset of the actions and resources explicitly allowed for the parent user. Additional access beyond that of the parent user cannot be implemented through these policies.":
    "Вы можете указать необязательную политику IAM в формате JSON, чтобы дополнительно ограничить доступ ключа доступа подмножеством действий и ресурсов, разрешённых родительскому пользователю. Предоставить больше прав, чем у родительского пользователя, с помощью этих политик нельзя.",
  "You can use '*' to match any character, '.' to signify a single character or '\\' to scape an special character (E.g. mybucket-*)":
    "Вы можете использовать '*' для соответствия любому символу '.' для обозначения одного символа или '\\' для обозначения специального символа (например, mybucket-*)",
  "You can use {mcShare} as an alternative to this UI, where the session length does not limit the URL validity.":
    "В качестве альтернативы веб-интерфейсу можно использовать {mcShare}, где длительность сеанса не ограничивает срок действия ссылки.",
  "You cannot delete the currently logged in User":
    "Невозможно удалить пользователя, под которым выполнен вход",
  "You cannot enable or disable the currently logged in User":
    "Вы не можете включить или отключить текущего вошедшего в систему пользователя.",
  "You cannot modify the optional Access Key IAM policy after saving.":
    "Необязательную политику IAM для ключа доступа нельзя изменить после сохранения.",
  "You may only have write access on a limited set of subpaths within this path. Please carefully review your User permissions to understand the paths to which you may write.":
    "У вас может быть доступ на запись только к ограниченному набору подпутей внутри этого пути. Пожалуйста, внимательно просмотрите свои права пользователя, чтобы понять пути, по которым вы можете писать.",
  "You must apply a valid name to the bucket":
    "Необходимо указать допустимое имя бакета",
  "You must disable Object Locking before Versioning can be disabled":
    "Необходимо отключить блокировку объектов, прежде чем можно будет отключить управление версиями.",
  "You must disable Retention before Object Locking can be disabled":
    "Необходимо отключить удержание (Retention) перед отключением блокировки объектов",
  "You need to select at least one group to assign":
    "Вам необходимо выбрать хотя бы одну группу для назначения.",
  "You require additional permissions in order to {name}. Please ask your SILO administrator to grant you {scopes} permission in order to {name}.":
    "Недостаточно прав, чтобы {name}. Попросите администратора SILO предоставить вам разрешение {scopes}, чтобы {name}.",
  "You require additional permissions in order to {name}. Please ask your SILO administrator to grant you {scopes} permissions in order to {name}.":
    "Недостаточно прав, чтобы {name}. Попросите администратора SILO предоставить вам разрешения {scopes}, чтобы {name}.",
  "You require additional permissions in order to create a new Tier. Please ask your SILO administrator to grant you {permission} permission in order to create a Tier.":
    "Для создания нового уровня вам потребуются дополнительные разрешения. Попросите администратора SILO предоставить вам разрешение {permission} для создания уровня.",
  "File is empty": "Файл пуст",
  "Invalid UTF-8 or binary content": "Недопустимый UTF-8 или двоичные данные",
  "Loading text preview…": "Загрузка предпросмотра текста…",
  "Object not found or changed": "Объект не найден или был изменён",
  "Text preview content": "Содержимое предпросмотра текста",
  "Text preview failed": "Ошибка предпросмотра текста",
  "Text preview forbidden": "Предпросмотр текста запрещён",
  "The object could not be found or changed while the preview was loading.":
    "Объект не найден или изменился во время загрузки предпросмотра.",
  "The text preview could not be loaded because of a network or server error.":
    "Не удалось загрузить предпросмотр текста из-за ошибки сети или сервера.",
  "This object is not valid UTF-8 text or contains binary data. Download it to inspect the original bytes.":
    "Этот объект не является допустимым текстом UTF-8 или содержит двоичные данные. Загрузите его, чтобы проверить исходные байты.",
  "You do not have permission to preview this object.":
    "У вас нет разрешения на предпросмотр этого объекта.",
  Trademark: "Товарные знаки",
  License: "Лицензия",
  "Corresponding source for this build":
    "Соответствующий исходный код для этой сборки",
  "The exact corresponding source is not available for this build: {reason}. See the NOTICE for how to obtain it.":
    "Точный исходный код для этой сборки недоступен: {reason}. Инструкции по его получению приведены в NOTICE.",
  "Source: not available for this build":
    "Исходный код: недоступен для этой сборки",
  "Items per page": "Элементов на странице",
  "First page": "Первая страница",
  "Previous page": "Предыдущая страница",
  "Next page": "Следующая страница",
  "{count} items in total": "Всего элементов: {count}",
  "Page {page} · {count} on this page":
    "Страница {page} · {count} на этой странице",
  "Sorting, filtering and select all apply to this page only.":
    "Сортировка, фильтрация и выбор всего применимы только к этой странице.",
  "No objects match the filter": "Нет объектов, соответствующих фильтру.",
  "No objects on this page match the filter":
    "На этой странице нет объектов, соответствующих фильтру.",
  "Showing the first {count} entries; the listing stopped at the row or time limit.":
    "Показаны первые {count} записей; вывод остановлен по лимиту строк или времени.",
  "Start typing to filter objects on this page":
    "Начните вводить текст, чтобы отфильтровать объекты на этой странице.",
  "Lists and tabs": "Списки и вкладки",
  "Move through rows with the pointer or keyboard. Arrow keys focus tabs; Enter or Space opens them.":
    "Перемещайтесь по строкам с помощью мыши или клавиатуры. Клавиши со стрелками переключают вкладки; Enter или Пробел открывают их.",
  "Browse and select stored objects.":
    "Просмотрите и выберите сохраненные объекты.",
  "Review stored object versions.": "Просмотрите версии сохраненных объектов.",
  "Manage bucket settings.": "Управление настройками бакета.",
  "Compact section tabs": "Компактные вкладки разделов",
  "Storage and object usage": "Хранение и использование объектов.",
  "Recent storage activity": "Недавняя активность хранилища",
  "Example buckets": "Примеры бакетов",
  "Select all objects": "Выбрать все объекты",
  Select: "Выбрать",
  Settings: "Настройки",
  Overview: "Обзор",
  Activity: "Активность",
  "No matching results": "Нет подходящих результатов.",
  "Try a different search or clear the filters to see all items.":
    "Попробуйте другой поиск или очистите фильтры, чтобы увидеть все элементы.",
  "Clear filters": "Очистить фильтры",
  "No users yet": "Пользователей пока нет",
  "Users authenticate with an access key and secret key, and receive permissions through policies and groups.":
    "Пользователи проходят аутентификацию с помощью ключа доступа и секретного ключа и получают разрешения через политики и группы.",
  "Create user": "Создать пользователя",
  "No access keys yet": "Ключей доступа пока нет.",
  "Access keys let applications connect with the permissions of your account.":
    "Ключи доступа позволяют приложениям подключаться с разрешениями вашей учетной записи.",
  "Access keys let applications connect with the permissions assigned to this user.":
    "Ключи доступа позволяют приложениям подключаться с разрешениями, назначенными этому пользователю.",
  "No groups assigned": "Группы не назначены",
  "Add this user to a group to share its access policies.":
    "Добавьте этого пользователя в группу, чтобы поделиться его политикой доступа.",
  "No policies assigned": "Политики не назначены",
  "Policies define which actions and resources this user can access.":
    "Политики определяют, к каким действиям и ресурсам может получить доступ этот пользователь.",
  "No members yet": "Пока нет участников",
  "Add users to this group so they inherit its policies.":
    "Добавьте пользователей в эту группу, чтобы они унаследовали ее политики.",
  "Policies attached to this group apply to all its members.":
    "Политики, прикрепленные к этой группе, применяются ко всем ее членам.",
  "No encryption keys yet": "Ключей шифрования пока нет.",
  "Create a key to encrypt objects with the configured key management service.":
    "Создайте ключ для шифрования объектов с помощью настроенной службы управления ключами.",
  "No groups yet": "Пока нет групп",
  "Groups let users share the same access policies.":
    "Группы позволяют пользователям использовать одни и те же политики доступа.",
  "No event destinations yet": "Получателей событий пока нет",
  "Connect an external service to receive bucket and object notifications.":
    "Подключите внешнюю службу для получения уведомлений о событиях бакетов и объектов.",
  "No storage tiers yet": "Уровней хранилища пока нет.",
  "Connect remote storage to transition objects using lifecycle rules.":
    "Подключите удалённое хранилище для переноса объектов по правилам жизненного цикла.",
  "No event subscriptions yet": "Подписок на события пока нет",
  "Subscribe this bucket to send object events to an event destination.":
    "Подпишите этот бакет на отправку событий объектов получателю событий.",
  "No replication rules yet": "Правил репликации пока нет.",
  "Replicate objects from this bucket to a destination bucket.":
    "Реплицируйте объекты из этого бакета в целевой бакет.",
  "No lifecycle rules yet": "Правил жизненного цикла пока нет.",
  "Create rules to expire objects or transition them to remote storage.":
    "Создавайте правила для истечения срока действия объектов или переноса их в удаленное хранилище.",
  "No anonymous access rules": "Нет правил анонимного доступа.",
  "This bucket has no prefix rules for access without credentials.":
    "Для этого бакета нет префиксных правил доступа без учётных данных.",
  "No policies grant access": "Никакие политики не предоставляют доступ.",
  "No listed policy currently grants access to this bucket.":
    "Ни одна из перечисленных политик сейчас не предоставляет доступ к этому бакету.",
  "No users have access": "Ни у кого из пользователей нет доступа.",
  "No listed user currently has a policy granting access to this bucket.":
    "Ни у одного из перечисленных пользователей сейчас нет политики с доступом к этому бакету.",
  "View Policies": "Просмотр политик",
  "View Users": "Просмотр пользователей",
  "Unable to load replication sites": "Невозможно загрузить сайты репликации.",
  "No replication sites yet": "Сайтов репликации пока нет.",
  "Refresh to try loading the configured sites again.":
    "Обновите, чтобы попытаться загрузить настроенные сайты еще раз.",
  "Connect independent SILO sites to replicate their data and identity configuration.":
    "Подключайте независимые сайты SILO для репликации их данных и конфигурации удостоверений.",
  "Waiting for logs": "Ожидание логов",
  "Logs are not running": "Журналы не запускаются.",
  "New log entries will appear here as the server emits them.":
    "Здесь будут появляться новые записи журнала по мере их отправки сервером.",
  "Choose the nodes and log types, then start logs to see server activity.":
    "Выберите узлы и типы журналов, затем запустите журналы, чтобы увидеть активность сервера.",
  "Waiting for trace events": "Ожидание событий трассировки",
  "Trace is not running": "Трассировка не выполняется.",
  "Requests matching the selected calls and filters will appear here.":
    "Здесь появятся запросы, соответствующие выбранным вызовам и фильтрам.",
  "Choose the calls and filters, then start tracing to inspect live requests.":
    "Выберите вызовы и фильтры, затем начните отслеживать запросы в реальном времени.",
  "{count} node": "{count} узел",
  "{count} nodes": {
    one: "{count} узел",
    few: "{count} узла",
    many: "{count} узлов",
    other: "{count} узла",
  },
  "{count} drive": "{count} диск",
  "{count} drives": {
    one: "{count} диск",
    few: "{count} диска",
    many: "{count} дисков",
    other: "{count} диска",
  },
  "Quota: {quota}": "Квота: {quota}",
  "Open bucket {name}": "Открыть бакет {name}",
  "Recent buckets": "Недавние бакеты",
  "Read and write": "Читать и писать",
  "Read only": "Только чтение",
  "Write only": "Только запись",
  "Created {date}": "Создано {date}",
  "{count} objects": "{count} объектов",
  "Bucket actions": "Действия с бакетом",
  "Open menu": "Открыть меню",
  "Page actions": "Действия на странице",
  "Selected actions": "Выбранные действия",
  "Parent paths": "Родительские пути",
  "create Groups": "создавать группы",
  "view Group details": "просмотреть информацию о группе",
  "configure event destinations": "настраивать получателей событий",
  "update Tier credentials": "обновить учетные данные уровня",
  "delete Tiers": "удалять уровни хранения",
  "manage Access Keys": "управлять ключами доступа",
};

export default messages;
