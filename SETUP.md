# 🛠️ מדריך הקמה מהירה

## שלב 1: המרת אייקונים ל-PNG

האייקון נמצא ב-`assets/icon.svg`. המר אותו ל-PNG באחת הדרכים הבאות:

### אופציה 1: ImageMagick (Linux/Mac)
```bash
cd assets
convert -background none icon.svg -resize 192x192 icon-192.png
convert -background none icon.svg -resize 512x512 icon-512.png
```

### אופציה 2: כלי אונליין
1. גש ל-https://cloudconvert.com/svg-to-png
2. העלה את `assets/icon.svg`
3. המר ל-192x192 וגם ל-512x512
4. שמור בתיקיית `assets/`

### אופציה 3: דפדפן (Chrome/Edge)
1. פתח את `assets/icon.svg` בדפדפן
2. לחץ F12 → Console
3. הדבק:
```javascript
const canvas = document.createElement('canvas');
canvas.width = 192;
canvas.height = 192;
const ctx = canvas.getContext('2d');
const img = new Image();
img.onload = () => {
  ctx.drawImage(img, 0, 0, 192, 192);
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'icon-192.png';
    a.click();
  });
};
img.src = 'icon.svg';
```

## שלב 2: בדיקת המשחק

### הפעלה מקומית
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

פתח: http://localhost:8000

### בדיקת PWA
1. פתח ב-Chrome
2. לחץ F12 → Application → Manifest
3. ודא שה-manifest נטען כראוי
4. לחץ על "Add to homescreen" לבדיקה

## שלב 3: פריסה (Deployment)

### GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main

# Enable GitHub Pages in repo settings
```

### Netlify
1. גש ל-https://app.netlify.com/drop
2. גרור את התיקייה `odd-one-out-game`
3. המשחק יהיה זמין באופן מיידי

### Vercel
```bash
npm i -g vercel
cd odd-one-out-game
vercel
```

## בדיקת תקינות

✅ כל הקבצים נוצרו
✅ 30 חידות נטענות
✅ כל ה-SVG icons נטענים
✅ Service Worker רשום
✅ המשחק עובד offline
✅ רספונסיבי במובייל

## פתרון בעיות נפוצות

### האייקונים לא נטענים
- ודא שה-path ב-`svg-map.json` נכון
- בדוק שכל ה-SVG קיימים בתיקייה

### PWA לא עובד
- ודא ש-HTTPS מופעל (או localhost)
- בדוק שה-Service Worker נרשם
- נקה cache ונסה שוב

### המשחק לא עובד offline
- ודא שה-Service Worker רשום בהצלחה
- בדוק את ה-cache ב-DevTools → Application

### הטקסט לא מוצג בעברית
- ודא שיש `<html lang="he" dir="rtl">`
- בדוק את ה-encoding (UTF-8)

---

**צריך עזרה?** פתח issue בגיטהאב!
