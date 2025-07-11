# دليل الإصلاح السريع - Railway

## 🚨 مشكلة: لا يمكن تسجيل الدخول كأدمن

### الحل السريع:
1. **تحقق من متغيرات البيئة في Railway:**
   ```
   SESSION_SECRET=your-secret-key
   MONGO_URI=mongodb+srv://...
   NODE_ENV=production
   BASE_URL=https://your-app.up.railway.app
   ```

2. **تحقق من MongoDB Atlas:**
   - اذهب إلى Network Access
   - أضف `0.0.0.0/0` للسماح لجميع العناوين

3. **أعد نشر التطبيق:**
   ```bash
   railway up
   ```

## 🚨 مشكلة: المسارات لا تعمل

### الحل السريع:
1. **تأكد من BASE_URL:**
   ```
   BASE_URL=https://your-exact-app-url.up.railway.app
   ```

2. **تحقق من URL التطبيق في Railway Dashboard**

3. **أعد نشر التطبيق**

## 🚨 مشكلة: رسائل البريد الإلكتروني لا تُرسل

### الحل السريع:
1. **استخدم App Password من Google:**
   - اذهب إلى Google Account Settings
   - Security → 2-Step Verification → App passwords
   - أنشئ App password جديد

2. **تحديث متغيرات البيئة:**
   ```
   EMAIL=your-email@gmail.com
   PASS=your-app-password-from-google
   ```

## 🚨 مشكلة: خطأ في قاعدة البيانات

### الحل السريع:
1. **تحقق من MONGO_URI في Railway**
2. **في MongoDB Atlas:**
   - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
   - Database Access → تأكد من صحة اسم المستخدم وكلمة المرور

## 🔧 أوامر مفيدة

### فحص السجلات:
```bash
railway logs --tail
```

### فحص متغيرات البيئة:
```bash
railway variables
```

### إعادة نشر:
```bash
railway up
```

### فحص الإعداد:
```bash
npm run validate-env
```

## 📋 قائمة التحقق السريع

- [ ] جميع متغيرات البيئة موجودة في Railway
- [ ] MONGO_URI صحيح وقاعدة البيانات متاحة
- [ ] SESSION_SECRET موجود (32 حرف على الأقل)
- [ ] BASE_URL يطابق URL التطبيق الفعلي
- [ ] EMAIL و PASS صحيحان (App Password)
- [ ] NODE_ENV=production
- [ ] MongoDB Atlas يسمح بالوصول من Railway

## 🆘 إذا لم تنجح الحلول

1. **احفظ سجلات Railway:**
   ```bash
   railway logs > railway-logs.txt
   ```

2. **تحقق من متغيرات البيئة:**
   ```bash
   railway variables > env-vars.txt
   ```

3. **جرب إعادة تشغيل الخدمة:**
   ```bash
   railway restart
   ```

4. **تواصل مع الدعم مع المعلومات المحفوظة**

## 🎯 نصائح للوقاية

1. **استخدم أسماء متغيرات دقيقة** (حساسة لحالة الأحرف)
2. **لا تضع مسافات في قيم المتغيرات**
3. **احفظ نسخة احتياطية من متغيرات البيئة**
4. **اختبر التطبيق محلياً قبل النشر**
5. **راقب سجلات Railway بانتظام**
