# متغيرات البيئة المطلوبة لـ Railway

هذا الملف يحتوي على قائمة شاملة بجميع متغيرات البيئة المطلوبة لتشغيل تطبيق Decor And More على Railway.

## المتغيرات الأساسية (مطلوبة)

### 1. إعدادات قاعدة البيانات
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
```

### 2. إعدادات الجلسة
```
SESSION_SECRET=your-very-strong-random-secret-key-at-least-32-characters
NODE_ENV=production
```

### 3. إعدادات البريد الإلكتروني
```
EMAIL=your-email@gmail.com
PASS=your-google-app-password
```

### 4. إعدادات URL الأساسي
```
BASE_URL=https://your-app-name.up.railway.app
```

## المتغيرات الاختيارية (للميزات المتقدمة)

### 5. إعدادات Stripe (للدفع)
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 6. إعدادات المنفذ (اختياري)
```
PORT=3000
```

## تعليمات الإعداد

### 1. إعداد MongoDB
1. إنشاء حساب على [MongoDB Atlas](https://www.mongodb.com/atlas)
2. إنشاء cluster جديد
3. إضافة عنوان IP الخاص بـ Railway إلى القائمة البيضاء (أو استخدم 0.0.0.0/0 للسماح لجميع العناوين)
4. إنشاء مستخدم قاعدة بيانات
5. الحصول على connection string

### 2. إعداد البريد الإلكتروني
1. تفعيل 2-Factor Authentication على حساب Gmail
2. إنشاء App Password من إعدادات الأمان
3. استخدام App Password في متغير PASS

### 3. إعداد Stripe (اختياري)
1. إنشاء حساب على [Stripe](https://stripe.com)
2. الحصول على API keys من لوحة التحكم
3. إعداد webhook endpoint

### 4. إعداد BASE_URL
1. بعد نشر التطبيق على Railway، ستحصل على URL
2. استخدم هذا URL في متغير BASE_URL
3. مثال: `https://decore-and-more-production.up.railway.app`

## نصائح مهمة

### أمان المتغيرات
- لا تشارك متغيرات البيئة مع أحد
- استخدم مفاتيح قوية وعشوائية
- غيّر المفاتيح بانتظام

### استكشاف الأخطاء
- تحقق من سجلات Railway للأخطاء
- تأكد من أن جميع المتغيرات مضبوطة بشكل صحيح
- استخدم Railway CLI للتحقق من المتغيرات

### التحقق من الإعداد
بعد إضافة المتغيرات، تحقق من سجلات التطبيق للتأكد من:
- الاتصال بقاعدة البيانات نجح
- إعدادات البريد الإلكتروني تعمل
- الجلسات تُحفظ بشكل صحيح

## أوامر Railway المفيدة

```bash
# تسجيل الدخول
railway login

# ربط المشروع
railway link

# عرض المتغيرات
railway variables

# إضافة متغير
railway variables set VARIABLE_NAME=value

# عرض السجلات
railway logs
```
