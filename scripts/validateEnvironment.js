#!/usr/bin/env node

/**
 * سكريبت للتحقق من صحة متغيرات البيئة المطلوبة
 * يمكن تشغيله محلياً أو على Railway للتأكد من الإعداد الصحيح
 */

require('dotenv').config();

const requiredVars = [
  'MONGO_URI',
  'SESSION_SECRET',
  'EMAIL',
  'PASS'
];

const optionalVars = [
  'BASE_URL',
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NODE_ENV',
  'PORT'
];

console.log('🔍 فحص متغيرات البيئة...\n');

// فحص المتغيرات المطلوبة
console.log('📋 المتغيرات المطلوبة:');
let missingRequired = [];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: موجود`);
    
    // فحص إضافي لبعض المتغيرات
    if (varName === 'SESSION_SECRET' && value.length < 32) {
      console.log(`⚠️  ${varName}: قصير جداً (يُنصح بـ 32 حرف على الأقل)`);
    }
    
    if (varName === 'MONGO_URI' && !value.startsWith('mongodb')) {
      console.log(`⚠️  ${varName}: تنسيق غير صحيح`);
    }
  } else {
    console.log(`❌ ${varName}: مفقود`);
    missingRequired.push(varName);
  }
});

console.log('\n📋 المتغيرات الاختيارية:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: موجود`);
  } else {
    console.log(`⚪ ${varName}: غير موجود (اختياري)`);
  }
});

// فحص الاتصال بقاعدة البيانات
console.log('\n🔗 فحص الاتصال بقاعدة البيانات...');
if (process.env.MONGO_URI) {
  const mongoose = require('mongoose');
  
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ الاتصال بقاعدة البيانات نجح');
      mongoose.disconnect();
    })
    .catch(err => {
      console.log('❌ فشل الاتصال بقاعدة البيانات:', err.message);
    });
} else {
  console.log('❌ MONGO_URI غير موجود، لا يمكن فحص الاتصال');
}

// فحص إعدادات البريد الإلكتروني
console.log('\n📧 فحص إعدادات البريد الإلكتروني...');
if (process.env.EMAIL && process.env.PASS) {
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    }
  });
  
  transporter.verify((error, success) => {
    if (error) {
      console.log('❌ فشل التحقق من إعدادات البريد الإلكتروني:', error.message);
    } else {
      console.log('✅ إعدادات البريد الإلكتروني صحيحة');
    }
  });
} else {
  console.log('❌ EMAIL أو PASS غير موجود، لا يمكن فحص البريد الإلكتروني');
}

// ملخص النتائج
console.log('\n📊 ملخص النتائج:');
if (missingRequired.length === 0) {
  console.log('✅ جميع المتغيرات المطلوبة موجودة');
} else {
  console.log(`❌ ${missingRequired.length} متغير مطلوب مفقود:`);
  missingRequired.forEach(varName => {
    console.log(`   - ${varName}`);
  });
}

// نصائح للإعداد
console.log('\n💡 نصائح:');
console.log('1. تأكد من إضافة جميع المتغيرات المطلوبة في Railway');
console.log('2. استخدم App Password لـ Gmail وليس كلمة المرور العادية');
console.log('3. تأكد من أن عنوان IP الخاص بـ Railway مسموح في MongoDB Atlas');
console.log('4. استخدم BASE_URL الصحيح للتطبيق على Railway');

// معلومات البيئة الحالية
console.log('\n🌍 معلومات البيئة:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'غير محدد'}`);
console.log(`PORT: ${process.env.PORT || '3000 (افتراضي)'}`);
console.log(`BASE_URL: ${process.env.BASE_URL || 'غير محدد'}`);

if (missingRequired.length > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 الإعداد يبدو صحيحاً!');
  process.exit(0);
}
