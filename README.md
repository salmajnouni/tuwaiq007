# Tuwaiq 007 - مولد الملصقات بالذكاء الاصطناعي

مولد ملصقات ذكي لليوم الوطني السعودي باستخدام الذكاء الاصطناعي. يتيح للمستخدمين إنشاء ملصقات مخصصة بتهاني اليوم الوطني بألوان العلم السعودي.

## المميزات

- 🤖 **ذكاء اصطناعي**: توليد تهاني تلقائية أو مخصصة
- 🎨 **تصميم سعودي**: ألوان العلم السعودي وأنماط هندسية تراثية
- 📱 **واجهة سهلة**: تصميم بسيط وسهل الاستخدام
- 🔒 **حماية بكلمة مرور**: وصول محدود للنسخة التجريبية
- 📤 **مشاركة سهلة**: مشاركة مباشرة على واتساب، إنستغرام، وسناب شات
- 💾 **تحميل فوري**: تحميل الملصقات بجودة عالية

## هيكل المشروع

```
tuwaiq007/
├── backend/
│   ├── api.py              # Flask API الرئيسي
│   ├── greetings.json      # ملف التهاني العربية
│   └── requirements.txt    # متطلبات Python
├── frontend/
│   ├── src/
│   │   ├── App.js         # مكون React الرئيسي
│   │   └── App.css        # ملف التنسيق
│   └── package.json       # متطلبات Node.js
└── README.md              # هذا الملف
```

## التثبيت والإعداد

### متطلبات النظام

- Python 3.8 أو أحدث
- Node.js 16 أو أحدث
- npm أو yarn

### إعداد الواجهة الخلفية (Backend)

1. **الانتقال إلى مجلد الواجهة الخلفية:**
   ```bash
   cd backend
   ```

2. **إنشاء بيئة افتراضية (اختياري ولكن موصى به):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # على Linux/Mac
   # أو
   venv\\Scripts\\activate   # على Windows
   ```

3. **تثبيت المتطلبات:**
   ```bash
   pip install -r requirements.txt
   ```

4. **إعداد متغيرات البيئة لـ S3 (اختياري):**
   ```bash
   export AWS_ACCESS_KEY_ID="your_access_key"
   export AWS_SECRET_ACCESS_KEY="your_secret_key"
   export AWS_DEFAULT_REGION="your_region"
   export S3_BUCKET_NAME="your_bucket_name"
   ```

5. **تشغيل الخادم:**
   ```bash
   python api.py
   ```

   الخادم سيعمل على: `http://localhost:5000`

### إعداد الواجهة الأمامية (Frontend)

1. **الانتقال إلى مجلد الواجهة الأمامية:**
   ```bash
   cd frontend
   ```

2. **تثبيت المتطلبات:**
   ```bash
   npm install
   ```

3. **إعداد متغير البيئة للـ API (اختياري):**
   ```bash
   echo "REACT_APP_API_URL=http://localhost:5000" > .env
   ```

4. **تشغيل التطبيق:**
   ```bash
   npm start
   ```

   التطبيق سيعمل على: `http://localhost:3000`

## الاستخدام

### تسجيل الدخول

- كلمة المرور: `Tuwaiq007Beta`

### إنشاء ملصق

1. **تهنئة عشوائية:**
   ```
   أعمل بوستر لليوم الوطني
   ```

2. **تهنئة مخصصة:**
   ```
   أعمل بوستر بتهنئة: كل عام ووطني بخير
   ```

### المشاركة والتحميل

- **تحميل**: انقر على "تحميل الملصق" لحفظ الصورة
- **واتساب**: مشاركة مباشرة مع النص والصورة
- **إنستغرام/سناب شات**: نسخ النص للصق في التطبيق

## API Documentation

### Endpoints

#### `POST /api/generate-greeting`

إنشاء تهنئة بناءً على النص المدخل.

**Request Body:**
```json
{
  "prompt": "أعمل بوستر لليوم الوطني"
}
```

**Response:**
```json
{
  "success": true,
  "greeting": "كل عام ووطني بخير",
  "type": "random"
}
```

#### `POST /api/generate-poster`

إنشاء ملصق بالتهنئة المحددة.

**Request Body:**
```json
{
  "greeting": "كل عام ووطني بخير",
  "background_color": "#2e7d32"
}
```

**Response:**
```json
{
  "success": true,
  "poster_url": "https://bucket.s3.region.amazonaws.com/poster_1234.png",
  "filename": "poster_1234.png"
}
```

#### `GET /api/health`

فحص حالة الخادم.

**Response:**
```json
{
  "status": "healthy",
  "service": "Tuwaiq 007 API"
}
```

## التخصيص

### إضافة تهاني جديدة

عدّل ملف `backend/greetings.json`:

```json
[
  "كل عام ووطني بخير",
  "اليوم الوطني السعودي ٩٥",
  "دام عزك يا وطن",
  "وطني الحبيب كل عام وأنت بخير",
  "فخر وعز في يوم وطني",
  "تهنئتك الجديدة هنا"
]
```

### تغيير الألوان

عدّل متغيرات CSS في `frontend/src/App.css`:

```css
:root {
  --saudi-green: #2e7d32;
  --saudi-dark-green: #1b5e20;
  --saudi-white: #ffffff;
}
```

### إعداد S3

لتفعيل رفع الصور إلى Amazon S3، عدّل المتغيرات في `backend/api.py`:

```python
S3_ACCESS_KEY = "your_actual_access_key"
S3_SECRET_KEY = "your_actual_secret_key"
S3_REGION = "your_actual_region"
S3_BUCKET_NAME = "your_actual_bucket_name"
```

## النشر

### نشر الواجهة الخلفية

1. **على خادم Linux:**
   ```bash
   # تثبيت gunicorn
   pip install gunicorn
   
   # تشغيل الخادم
   gunicorn -w 4 -b 0.0.0.0:5000 api:app
   ```

2. **باستخدام Docker:**
   ```dockerfile
   FROM python:3.9
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   EXPOSE 5000
   CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "api:app"]
   ```

### نشر الواجهة الأمامية

1. **بناء التطبيق:**
   ```bash
   npm run build
   ```

2. **نشر الملفات:**
   ```bash
   # نسخ محتويات مجلد build إلى خادم الويب
   cp -r build/* /var/www/html/
   ```

## استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ CORS:**
   - تأكد من تثبيت `flask-cors`
   - تحقق من إعدادات CORS في `api.py`

2. **خطأ في الخط العربي:**
   - تأكد من وجود خط عربي في النظام
   - ثبّت `fonts-noto` على Ubuntu: `sudo apt install fonts-noto`

3. **فشل رفع S3:**
   - تحقق من صحة بيانات AWS
   - تأكد من صلاحيات الـ bucket

### سجلات الأخطاء

- **الواجهة الخلفية:** تحقق من terminal حيث يعمل Flask
- **الواجهة الأمامية:** افتح Developer Tools في المتصفح

## المساهمة

نرحب بمساهماتكم! يرجى:

1. عمل Fork للمشروع
2. إنشاء فرع للميزة الجديدة
3. إضافة التحسينات
4. إرسال Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف LICENSE للتفاصيل.

## الدعم

للدعم والاستفسارات:
- إنشاء Issue في GitHub
- التواصل مع فريق طويق 007

---

**تم التطوير بواسطة فريق طويق 007**  
**للاحتفال باليوم الوطني السعودي ٩٥**

