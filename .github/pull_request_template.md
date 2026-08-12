## خلاصه تغییرات

- 
- 
- 

## چک‌لیست قبل از Pull Request

- [ ] تغییرات روی یک branch جدا از `main`/`master` انجام شده است.
- [ ] تست‌ها اجرا شده‌اند: `node test/popup.test.js`
- [ ] بررسی whitespace انجام شده است: `git diff --check`
- [ ] افزونه به‌صورت دستی با `Load unpacked` در Chrome/Edge تست شده است.
- [ ] اگر UI تغییر کرده، توضیح یا اسکرین‌شات اضافه شده است.

## تست‌ها

```bash
node test/popup.test.js
git diff --check
```

## نکته امنیتی

- رمزها نباید در description یا screenshot واقعی PR قرار بگیرند.
- اگر تاریخچه یا storage تست شده، فقط از رمزهای نمونه/ساختگی استفاده شود.
