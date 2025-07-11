# Decor And More

## نظرة عامة
Decor And More هو تطبيق ويب يربط بين المهندسين المعماريين والعملاء، حيث يمكن للمهندسين عرض مشاريعهم وباقاتهم، ويمكن للعملاء حجز الخدمات والتواصل مع المهندسين.

## المميزات الرئيسية
- نظام تسجيل وتسجيل دخول للمستخدمين بأدوار مختلفة (مستخدم عادي، مهندس، مدير)
- لوحة تحكم للمدير لإدارة المهندسين والحجوزات
- صفحات شخصية للمهندسين لعرض مشاريعهم وباقاتهم
- نظام حجز وتأكيد للخدمات
- نظام دفع متكامل مع Stripe
- نظام مراسلة بين المستخدمين والمهندسين
- نظام تقييم للمهندسين

## متطلبات النظام
- Node.js (v14 أو أحدث)
- MongoDB
- حساب Stripe للمدفوعات
- حساب بريد إلكتروني لإرسال الإشعارات

## إعداد المشروع

### المتطلبات الأساسية
1. تأكد من تثبيت Node.js وNPM على جهازك
2. قم بإنشاء قاعدة بيانات MongoDB (يمكن استخدام MongoDB Atlas)
3. قم بإنشاء حساب Stripe للمدفوعات

### خطوات الإعداد
1. قم بنسخ المشروع إلى جهازك
   ```
   git clone <رابط المستودع>
   cd Decor-And-More
   ```

2. قم بتثبيت التبعيات
   ```
   npm install
   ```

3. قم بإنشاء ملف `.env` في المجلد الرئيسي للمشروع وأضف المتغيرات البيئية التالية:
   ```
   # Email Configuration
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password

   # Stripe Configuration
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

   # Domain Configuration
   DOMAIN=https://your-domain.com

   # Session Configuration
   SESSION_SECRET=your-session-secret

   # Environment Configuration
   NODE_ENV=production

   # Database Configuration
   MONGO_URI=your-mongodb-connection-string

   # Base URL Configuration
   BASE_URL=https://your-domain.com
   ```

4. قم بتشغيل التطبيق
   ```
   npm start
   ```

## النشر على Railway

1. قم بإنشاء حساب على [Railway](https://railway.app/)
2. قم بربط مستودع GitHub الخاص بالمشروع
3. قم بإضافة المتغيرات البيئية في إعدادات المشروع على Railway
4. تأكد من تعيين `NODE_ENV=production`
5. تأكد من تعيين `BASE_URL` و `DOMAIN` إلى عنوان URL الخاص بتطبيقك على Railway

## ملاحظات هامة للنشر

### إعدادات الكوكيز
في بيئة الإنتاج، يجب تكوين الكوكيز بشكل صحيح للعمل مع HTTPS:
- تأكد من تعيين `secure: true` للكوكيز
- تأكد من تعيين `sameSite: "None"` للسماح بطلبات cross-site
- تأكد من إرسال `credentials: 'include'` مع جميع طلبات fetch من الواجهة الأمامية

### إعدادات CORS
تأكد من تكوين CORS بشكل صحيح للسماح بالطلبات من النطاق الخاص بك:
- أضف نطاق التطبيق إلى قائمة `allowedOrigins`
- تأكد من تعيين `credentials: true` في إعدادات CORS

## استكشاف الأخطاء وإصلاحها

### مشاكل المسارات على Railway
إذا واجهت مشاكل في المسارات بعد النشر على Railway:
1. تأكد من تعيين `BASE_URL` بشكل صحيح في متغيرات البيئة على Railway (مثال: `https://your-app-name.up.railway.app`)
2. تحقق من ملف `app.js` وتأكد من أن جميع الروابط تستخدم `process.env.BASE_URL` بدلاً من عناوين URL المحلية الثابتة
3. تأكد من أن إعدادات CORS تتضمن النطاق الصحيح:
   ```javascript
   const allowedOrigins = [
     process.env.NODE_ENV === "development" ? "http://localhost:3000" : null,
     "https://decore-and-more-production.up.railway.app",
     process.env.BASE_URL,
     ".up.railway.app"
   ].filter(Boolean);
   ```
4. تأكد من أن إعدادات الكوكيز تستخدم النطاق الصحيح:
   ```javascript
   domain: process.env.NODE_ENV === "production" ? 
     (new URL(process.env.BASE_URL || "https://decore-and-more-production.up.railway.app")).hostname : undefined,
   ```
5. تحقق من إعدادات Content Security Policy (CSP) وتأكد من أنها تسمح بالوصول من المصادر الصحيحة

### خطأ 403 Forbidden
إذا واجهت خطأ 403 عند محاولة الوصول إلى `/AdminDashboard` أو أي مسار محمي آخر:
1. تحقق من إعدادات الكوكيز في ملف `app.js`
2. تأكد من إرسال `credentials: 'include'` مع جميع طلبات fetch
3. تحقق من إعدادات CORS وتأكد من إضافة نطاق التطبيق إلى قائمة `allowedOrigins`
4. تحقق من سجلات الخطأ في Railway للحصول على مزيد من المعلومات

### مشاكل تسجيل الدخول
إذا كان المستخدمون يواجهون مشاكل في تسجيل الدخول:
1. تأكد من أن `SESSION_SECRET` مضبوط بشكل صحيح
2. تحقق من اتصال قاعدة البيانات MongoDB
3. تأكد من أن إعدادات الجلسة والكوكيز مكونة بشكل صحيح

### مشاكل في إرسال رسائل البريد الإلكتروني
إذا كانت رسائل البريد الإلكتروني لا تصل:
1. تحقق من إعدادات البريد الإلكتروني في ملف `.env`
2. تأكد من أن `EMAIL` و `PASS` مضبوطان بشكل صحيح
3. تأكد من أن روابط التحقق في رسائل البريد الإلكتروني تستخدم `process.env.BASE_URL`

## المساهمة
نرحب بالمساهمات! يرجى اتباع هذه الخطوات:
1. قم بعمل fork للمستودع
2. قم بإنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. قم بعمل commit للتغييرات (`git commit -m 'Add some amazing feature'`)
4. قم بدفع الفرع (`git push origin feature/amazing-feature`)
5. قم بفتح طلب سحب

## الترخيص
هذا المشروع مرخص بموجب [ترخيص MIT](LICENSE).