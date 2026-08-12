# 🔐 Password Generator Pro — سازنده رمز عبور خفن

> یک اکستنشن سبک، سریع و کاملاً لوکال برای ساخت رمزهای قوی، خوانا و قابل سفارشی‌سازی — ساخته شده با ❤️ توسط [AnishtayiN](https://t.me/AnishtayiN)

![Chrome](https://img.shields.io/badge/Chrome-49%2B-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)
![Manifest V2](https://img.shields.io/badge/Manifest-V2-yellow?style=for-the-badge)
![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🚀 چرا خفنه؟

این افزونه فقط یک generator ساده نیست؛ یک داشبورد کوچک امنیت رمز عبور است:

- 🛡️ **پروفایل‌های آماده امنیتی** برای ساخت سریع رمز مناسب سناریوهای مختلف
- 📊 **Security Snapshot** با نمایش آنتروپی و تخمین زمان حدس آفلاین
- 🧪 **چک‌لیست امنیتی زنده** برای دیدن نقاط قوت و ضعف رمز
- ⚡ **تولید زنده** هنگام تغییر طول، گزینه‌ها یا presetها
- 🔐 **Randomness امن** با `crypto.getRandomValues()`
- 🧠 **حالت قابل تلفظ** برای رمزهای خواناتر و به‌یادماندنی‌تر
- 📜 **تاریخچه محلی** با کپی سریع رمزهای اخیر

---

## ✨ امکانات اصلی

| قابلیت | توضیح |
|--------|-------|
| 🛡️ **Vault Max** | پروفایل ۳۲ کاراکتری با ترکیب کامل و حذف الگوهای ترتیبی |
| 🧠 **Readable** | رمز خواناتر با حروف قابل تلفظ و حذف کاراکترهای مبهم |
| 🔢 **PIN Pro** | PIN عددی ۱۲ رقمی بدون تکرار و بدون ترتیب پشت سر هم |
| 📏 **طول قابل تنظیم** | ساخت رمز از ۴ تا ۱۲۸ کاراکتر |
| ⚡ **Preset سریع** | انتخاب فوری طول‌های 16، 24 و 32 |
| 🔤 **Character Sets** | حروف بزرگ، کوچک، اعداد و نمادها |
| 🚫 **No Ambiguous** | حذف کاراکترهای شبیه هم مثل `0OIl1` |
| 🔁 **No Duplicate** | جلوگیری از تکرار کاراکترها |
| 📐 **No Sequential** | جلوگیری از الگوهایی مثل `abc` و `123` |
| ✏️ **Custom Excludes** | حذف کاراکترهای دلخواه توسط کاربر |
| 📋 **One-Click Copy** | کپی سریع رمز اصلی یا آیتم‌های تاریخچه |
| 📜 **Local History** | نگهداری ۲۰ رمز اخیر فقط در مرورگر شما |

---

## 🖼️ تجربه کاربری

- تم تیره cyberpunk با رنگ‌های cyan و green
- کارت‌های امنیتی نئونی با micro-interaction
- رابط راست‌به‌چپ فارسی و متن‌های قابل فهم
- نمایش لحظه‌ای قدرت رمز، آنتروپی، تخمین زمان حدس و checklist
- بدون dependency و بدون build step

---

## 📦 نصب

### روش ۱: نصب دستی در Chrome / Edge / Brave

1. پروژه را دانلود یا clone کنید.
2. وارد صفحه `chrome://extensions` شوید.
3. گزینه **Developer mode** را روشن کنید.
4. روی **Load unpacked** کلیک کنید.
5. پوشه پروژه را انتخاب کنید.
6. افزونه آماده استفاده است 🎉

### روش ۲: از سورس

```bash
git clone https://github.com/AnishtayiN/pwd-ex.git
cd pwd-ex
```

سپس مراحل نصب دستی را انجام دهید.

---

## 🧭 راهنمای استفاده سریع

1. روی آیکون افزونه کلیک کنید.
2. یکی از پروفایل‌های **Vault Max**، **Readable** یا **PIN Pro** را بزنید — یا تنظیمات را دستی تغییر دهید.
3. قدرت رمز را از نوار، آنتروپی و چک‌لیست بررسی کنید.
4. روی 📋 بزنید و رمز را کپی کنید.
5. اگر رمز دیگری می‌خواهید، دکمه 🔄 یا ⚡ را بزنید.

---

## 🔒 مدل امنیتی

- همه چیز **روی دستگاه شما** انجام می‌شود.
- رمزها به هیچ سروری ارسال نمی‌شوند.
- تولید تصادفی از **Web Crypto API** استفاده می‌کند.
- تاریخچه فقط در storage مرورگر ذخیره می‌شود.
- تخمین crack time یک شاخص آموزشی است و جایگزین سیاست امنیتی سازمانی نیست.

---

## 🧪 تست

این پروژه با Node.js و بدون dependency تست می‌شود:

```bash
node test/popup.test.js
```

برای بررسی whitespace و patch:

```bash
git diff --check
```

---

## 📁 ساختار پروژه

```text
pwd-ex/
├── manifest.json          # Chrome extension manifest (V2)
├── popup.html             # UI افزونه
├── popup.js               # منطق تولید رمز، قدرت، پروفایل‌ها و تاریخچه
├── style.css              # استایل cyberpunk و responsive popup
├── test/
│   └── popup.test.js      # تست‌های منطق generator
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

---

## 🧰 Tech Stack

- **HTML5** برای ساختار popup
- **CSS3** برای تم نئونی و micro-interactions
- **Vanilla JavaScript** برای سرعت بالا و سازگاری گسترده
- **Manifest V2** برای پشتیبانی از Chrome 49+
- **Web Crypto API** برای randomness امن

---

## 🤝 مشارکت

1. Fork کنید.
2. branch جدید بسازید: `git checkout -b feature/my-awesome-change`
3. تغییرات را commit کنید.
4. تست‌ها را اجرا کنید.
5. Pull Request باز کنید.


---

## 🧩 ساخت Pull Request بدون خطا

اگر موقع PR زدن در GitHub یا GitHub CLI خطا دیدید، این چک‌لیست را انجام دهید:

### ۱) وضعیت branch و commit را چک کنید

```bash
git status
git branch --show-current
git log --oneline -3
```

اگر تغییرات commit نشده دارید:

```bash
git add .
git commit -m "Describe your change"
```

### ۲) branch را push کنید

```bash
git push -u origin HEAD
```

### ۳) اگر با `gh pr create` خطای authentication گرفتید

GitHub CLI باید login شده باشد یا توکن داشته باشد:

```bash
gh auth login
# یا
export GH_TOKEN="YOUR_GITHUB_TOKEN"
```

بعد دوباره PR بسازید:

```bash
gh pr create --fill
```

### ۴) اگر خطای remote گرفتید

remote را بررسی کنید:

```bash
git remote -v
```

اگر remote ندارید، آدرس repository خودتان را اضافه کنید:

```bash
git remote add origin https://github.com/YOUR_USERNAME/pwd-ex.git
```

> نکته: قالب آماده Pull Request داخل `.github/pull_request_template.md` اضافه شده تا GitHub هنگام باز کردن PR متن استاندارد تست و چک‌لیست را نشان دهد.

---

## 📄 مجوز

این پروژه با مجوز MIT منتشر شده است. جزئیات در فایل [LICENSE](LICENSE) موجود است.

---

## 👨‍💻 سازنده

**AnishtayiN** — [@AnishtayiN](https://t.me/AnishtayiN)

اگر پروژه برات مفید بود، ⭐ دادن به repo یادت نره!

<p align="center">ساخته شده با ❤️ توسط <a href="https://t.me/AnishtayiN">AnishtayiN</a></p>
