# دليل نشر التطبيق على Railway

هذا الدليل يشرح كيفية تكوين تطبيق Decor And More للنشر على منصة Railway بشكل صحيح.

## المتغيرات البيئية المطلوبة

يجب تكوين المتغيرات البيئية التالية في لوحة تحكم Railway:

### إعدادات البريد الإلكتروني
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL=your-email@gmail.com
PASS=your-app-password
```

### إعدادات Stripe
```
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

### إعدادات الجلسة والبيئة
```
SESSION_SECRET=your-session-secret
NODE_ENV=production
```

### إعدادات قاعدة البيانات
```
MONGO_URI=your-mongodb-connection-string
```

### إعدادات URL الأساسي (مهم جداً)
```
BASE_URL=https://your-app-name.up.railway.app
```

> **ملاحظة مهمة**: يجب تعيين `BASE_URL` إلى عنوان URL الكامل لتطبيقك على Railway. على سبيل المثال: `https://decore-and-more-production.up.railway.app`

## حل مشاكل المسارات

إذا واجهت مشاكل في المسارات بعد النشر على Railway، تأكد من:

1. تعيين `BASE_URL` بشكل صحيح في متغيرات البيئة على Railway.
2. تأكد من أن جميع الروابط في التطبيق تستخدم `process.env.BASE_URL` بدلاً من عناوين URL المحلية الثابتة.
3. تأكد من أن إعدادات الكوكيز تستخدم النطاق الصحيح.

## إعدادات الكوكيز

تم تكوين إعدادات الكوكيز في `app.js` لتعمل بشكل صحيح مع Railway. تأكد من أن الإعدادات التالية موجودة:

```javascript
cookie: {
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
  httpOnly: true,
  domain: process.env.NODE_ENV === "production" ? 
    (new URL(process.env.BASE_URL || "https://decore-and-more-production.up.railway.app")).hostname : undefined,
}
```

## إعدادات CORS

تم تكوين إعدادات CORS في `app.js` للسماح بالوصول من النطاقات الصحيحة. تأكد من أن الإعدادات التالية موجودة:

```javascript
const allowedOrigins = [
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : null,
  "https://decore-and-more-production.up.railway.app",
  process.env.BASE_URL,
  ".up.railway.app"
].filter(Boolean);
```

## إعدادات Content Security Policy (CSP)

تم تكوين إعدادات CSP في `app.js` للسماح بالوصول من المصادر الصحيحة. تأكد من أن الإعدادات التالية موجودة:

```javascript
connectSrc: [
  "'self'",
  "https://cdn.jsdelivr.net",
  "https://cdnjs.cloudflare.com",
  "https://cdn.datatables.net",
  "https://cdn.jsdelivr.net/npm/sweetalert2@11",
  "https://*.up.railway.app",
  process.env.BASE_URL,
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:35729"] : []),
],
```

## التحقق من النشر

بعد النشر، تحقق من:

1. تسجيل الدخول والتسجيل يعملان بشكل صحيح.
2. إرسال رسائل البريد الإلكتروني للتحقق وإعادة تعيين كلمة المرور يعمل بشكل صحيح.
3. جميع الروابط في التطبيق تعمل بشكل صحيح.
4. الجلسات تعمل بشكل صحيح ولا يتم تسجيل الخروج من المستخدمين بشكل غير متوقع.

## مشاكل شائعة وحلولها

### مشكلة: المستخدمون يتم تسجيل خروجهم بشكل متكرر
**الحل**: تحقق من إعدادات الكوكيز ونطاق الكوكيز.

### مشكلة: روابط التحقق في رسائل البريد الإلكتروني لا تعمل
**الحل**: تأكد من أن `BASE_URL` مضبوط بشكل صحيح وأن جميع الروابط في رسائل البريد الإلكتروني تستخدم `process.env.BASE_URL`.

### مشكلة: أخطاء CORS
**الحل**: تأكد من أن إعدادات CORS تتضمن جميع النطاقات المطلوبة.

### مشكلة: مشاكل في تحميل الموارد (CSS، JavaScript، الصور)
**الحل**: تحقق من إعدادات Content Security Policy (CSP) وتأكد من أنها تسمح بالوصول إلى جميع المصادر المطلوبة.