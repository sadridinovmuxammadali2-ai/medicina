# SmartLab LIMS

SmartLab LIMS — laboratoriya ishlarini boshqarish uchun React + TypeScript + Vite loyihasi.

## Ishga tushirish

1. Kompyuteringizda Node.js LTS o‘rnatilgan bo‘lsin.
2. Terminalni `medic` papkasida oching.
3. Quyidagi buyruqlarni bajaring:

```bash
npm install
npm run dev
```

Terminalda chiqqan `http://localhost:5173` manzilini brauzerda oching.

## Dizayn va animatsiyalar

- AOS kutubxonasi `aos` dependency sifatida o‘rnatilgan.
- `src/main.tsx` ichida AOS ishga tushiriladi, `src/App.tsx` sahifa/tab almashganda animatsiyalarni yangilaydi.
- Asosiy dizayn va mobil moslashuv `src/index.css` faylida.
- Tailwind CSS utility klasslari `index.html` ichidagi CDN orqali yuklanadi; CDN uchun internet kerak.
- Bemorlar, shifokorlar va buyurtmalar brauzerning `localStorage` xotirasida saqlanadi.

## Build

```bash
npm run build
```
