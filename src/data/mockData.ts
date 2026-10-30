import type { Patient, Doctor, TestCatalogItem, TestOrder, Reagent, HealthTrendPoint, TestResultItem } from '../types/lab';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'DOC-001',
    doctorNumber: 1,
    fullName: 'Dr. Karimov Sobir Baxtiyorovich',
    specialty: 'Kardiolog',
    workplace: 'Kardiologiya Bo\'limi',
    phone: '+998 90 111 22 33',
    commissionRate: 10,
    totalReferrals: 42,
    isActive: true,
    consultationFee: 120000,
    roomNumber: '204-xona (Bino A)',
    categoryModule: 'priem'
  },
  {
    id: 'DOC-002',
    doctorNumber: 2,
    fullName: 'Dr. Yusupova Nargiza Anvarovna',
    specialty: 'Endokrinolog',
    workplace: 'Endokrinologiya Markazi',
    phone: '+998 93 444 55 66',
    commissionRate: 10,
    totalReferrals: 28,
    isActive: true,
    consultationFee: 110000,
    roomNumber: '305-xona (Bino A)',
    categoryModule: 'priem'
  },
  {
    id: 'DOC-003',
    doctorNumber: 3,
    fullName: 'Dr. Axmedov Murod Qodirovich',
    specialty: 'Terapevt',
    workplace: 'Umumiy Terapiya Bo\'limi',
    phone: '+998 97 777 88 99',
    commissionRate: 10,
    totalReferrals: 15,
    isActive: true,
    consultationFee: 90000,
    roomNumber: '102-xona (Bino A)',
    categoryModule: 'priem'
  },
  {
    id: 'DOC-004',
    doctorNumber: 4,
    fullName: 'Dr. Umarova Nigora Salimovna',
    specialty: 'Nevropatolog',
    workplace: 'Nevrologiya Klinikasi',
    phone: '+998 90 987 65 43',
    commissionRate: 12,
    totalReferrals: 34,
    isActive: true,
    consultationFee: 110000,
    roomNumber: '108-xona (Bino A)',
    categoryModule: 'priem'
  },
  {
    id: 'DOC-005',
    doctorNumber: 5,
    fullName: 'Dr. Rasulov Alisher Boburovich',
    specialty: 'Gastroenterolog',
    workplace: 'Gastroenterologiya Bo\'limi',
    phone: '+998 94 321 00 11',
    commissionRate: 10,
    totalReferrals: 22,
    isActive: true,
    consultationFee: 115000,
    roomNumber: '302-xona (Bino B)',
    categoryModule: 'priem'
  },
  {
    id: 'DOC-006',
    doctorNumber: 6,
    fullName: 'Dr. Abdullayeva Shahnoza Ergashovna',
    specialty: 'Ginekolog-Akusher',
    workplace: 'Ayollar Konsultatsiyasi',
    phone: '+998 91 234 56 78',
    commissionRate: 15,
    totalReferrals: 56,
    isActive: true,
    consultationFee: 130000,
    roomNumber: '215-xona (Bino B)',
    categoryModule: 'priem'
  },
  {
    id: 'DOC-007',
    doctorNumber: 7,
    fullName: 'Dr. Karimov Sardor Temurovich',
    specialty: 'Urolog-Androlog',
    workplace: 'Urologiya Markazi',
    phone: '+998 93 112 23 34',
    commissionRate: 10,
    totalReferrals: 19,
    isActive: true,
    consultationFee: 125000,
    roomNumber: '210-xona (Bino A)',
    categoryModule: 'priem'
  },
  {
    id: 'DOC-008',
    doctorNumber: 8,
    fullName: 'Dr. Yusupov Jamshid Otabekovich',
    specialty: 'Oftalmolog',
    workplace: 'Ko\'z Kasalliklari Bo\'limi',
    phone: '+998 95 666 77 88',
    commissionRate: 10,
    totalReferrals: 12,
    isActive: true,
    consultationFee: 95000,
    roomNumber: '104-xona (Bino B)',
    categoryModule: 'priem'
  },
  {
    id: 'DOC-009',
    doctorNumber: 9,
    fullName: 'Dr. Mirzayeva Malika Ulug\'bekovna',
    specialty: 'LOR (Otorinolaringolog)',
    workplace: 'LOR Klinikasi',
    phone: '+998 90 444 33 22',
    commissionRate: 10,
    totalReferrals: 25,
    isActive: true,
    consultationFee: 95000,
    roomNumber: '106-xona (Bino B)',
    categoryModule: 'priem'
  },
  {
    id: 'DOC-010',
    doctorNumber: 10,
    fullName: 'Dr. Tursunov Botir Shavkatovich',
    specialty: 'Xirurg-Travmatolog',
    workplace: 'Jarrohlik Bo\'limi',
    phone: '+998 99 888 99 00',
    commissionRate: 15,
    totalReferrals: 38,
    isActive: true,
    consultationFee: 140000,
    roomNumber: '101-xona (Bino A)',
    categoryModule: 'priem'
  },
  {
    id: 'DOC-011',
    doctorNumber: 11,
    fullName: 'Dr. Sobirov Xurshid Azimovich',
    specialty: 'UZI Shifokor-Diagnost',
    workplace: 'Ultratovush Diagnostikasi',
    phone: '+998 90 555 44 33',
    commissionRate: 10,
    totalReferrals: 67,
    isActive: true,
    consultationFee: 100000,
    roomNumber: '112-xona (UZI Xonasi)',
    categoryModule: 'uzd'
  },
  {
    id: 'DOC-012',
    doctorNumber: 12,
    fullName: 'Dr. Axmedova Gulnora Ravshanovna',
    specialty: 'Rentgenolog-Radiolog',
    workplace: 'Rentgen Diagnostika',
    phone: '+998 93 777 66 55',
    commissionRate: 10,
    totalReferrals: 49,
    isActive: true,
    consultationFee: 110000,
    roomNumber: '101-xona (Rentgen Binosi C)',
    categoryModule: 'rentgen'
  },
  {
    id: 'DOC-013',
    doctorNumber: 13,
    fullName: 'Dr. Xolmatov Sanjar Bekzodovich',
    specialty: 'MRT & MSKT Vrach-Radiolog',
    workplace: 'Tomografiya Markazi',
    phone: '+998 91 999 00 11',
    commissionRate: 15,
    totalReferrals: 73,
    isActive: true,
    consultationFee: 150000,
    roomNumber: '105-xona (MRT Binosi C)',
    categoryModule: 'mrt'
  },
  {
    id: 'DOC-014',
    doctorNumber: 14,
    fullName: 'Dr. Saidova Dilnoza Farxodovna',
    specialty: 'Pediatr',
    workplace: 'Bolalar Klinikasi',
    phone: '+998 90 222 33 44',
    commissionRate: 10,
    totalReferrals: 31,
    isActive: true,
    consultationFee: 90000,
    roomNumber: '105-xona (Bino A)',
    categoryModule: 'priem'
  },
  {
    id: 'DOC-015',
    doctorNumber: 15,
    fullName: 'Dr. Nazarova Rayhona Ulug\'bekovna',
    specialty: 'Dermatovenerolog',
    workplace: 'Dermatologiya Bo\'limi',
    phone: '+998 94 888 11 22',
    commissionRate: 10,
    totalReferrals: 18,
    isActive: false, // Inactive demo doctor
    consultationFee: 100000,
    roomNumber: '208-xona (Bino B)',
    categoryModule: 'priem'
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'PAT-0001',
    patientNumber: 1,
    passportOrId: 'AD4928172',
    fullName: 'Alimov Jamshid Baxtiyorovich',
    birthDate: '1988-04-12',
    gender: 'erkak',
    phone: '+998 90 123 45 67',
    address: 'Toshkent sh., Yunusobod t., 14-mavze 12-uy',
    registeredAt: '2026-08-16 09:15',
    referredByDoctor: '[DOC-001] Dr. Karimov S. (Kardiolog)',
    totalVisits: 3
  },
  {
    id: 'PAT-0002',
    patientNumber: 2,
    passportOrId: 'AC3819201',
    fullName: 'Qosimova Malika Otabekovna',
    birthDate: '1995-11-28',
    gender: 'ayol',
    phone: '+998 93 987 65 43',
    address: 'Toshkent sh., Chilonzor t., 5-mavze',
    registeredAt: '2026-08-16 10:30',
    referredByDoctor: '[DOC-002] Dr. Yusupova N. (Endokrinolog)',
    totalVisits: 1
  },
  {
    id: 'PAT-0003',
    patientNumber: 3,
    passportOrId: 'FA8291039',
    fullName: 'Шарипова Хадича Рахимжон кизи',
    birthDate: '1992-06-15',
    gender: 'ayol',
    phone: '+998 90 555 12 34',
    address: 'Toshkent sh., Mirzo Ulug\'bek t.',
    registeredAt: '2026-08-16 11:00',
    referredByDoctor: '[DOC-003] Dr. Axmedov M. (Kardiolog)',
    totalVisits: 2
  }
];

export const INITIAL_TEST_CATALOG: TestCatalogItem[] = [
  {
    id: 'cat-priem',
    category: 'ПРИЕМ (ШИФОКОРЛАР QABULI)',
    subGroups: [
      {
        id: 'sg-priem-kardio',
        groupTitle: 'КАРДИОЛОГИЯ',
        items: [
          { id: 'doc-item-1', name: 'Dr. Karimov Sobir B. — Kardiolog Qabuli & Konsultatsiyasi', price: 120000, unit: 'Qabul', refMin: 0, refMax: 0 }
        ]
      },
      {
        id: 'sg-priem-endo',
        groupTitle: 'ЭНДОКРИНОЛОГИЯ',
        items: [
          { id: 'doc-item-2', name: 'Dr. Yusupova Nargiza A. — Endokrinolog Qabuli', price: 110000, unit: 'Qabul', refMin: 0, refMax: 0 }
        ]
      },
      {
        id: 'sg-priem-terapiya',
        groupTitle: 'ТЕРАПИЯ',
        items: [
          { id: 'doc-item-3', name: 'Dr. Axmedov Murod Q. — Terapevt Vrach Qabuli', price: 90000, unit: 'Qabul', refMin: 0, refMax: 0 }
        ]
      },
      {
        id: 'sg-priem-nevro',
        groupTitle: 'НЕВРОЛОГИЯ',
        items: [
          { id: 'doc-item-4', name: 'Dr. Umarova Nigora S. — Nevropatolog Qabuli', price: 110000, unit: 'Qabul', refMin: 0, refMax: 0 }
        ]
      },
      {
        id: 'sg-priem-gastro',
        groupTitle: 'ГАСТРОЭНТЕРОЛОГИЯ',
        items: [
          { id: 'doc-item-5', name: 'Dr. Rasulov Alisher B. — Gastroenterolog Qabuli', price: 115000, unit: 'Qabul', refMin: 0, refMax: 0 }
        ]
      },
      {
        id: 'sg-priem-gineko',
        groupTitle: 'ГИНЕКОЛОГИЯ & АКУШЕРЛИК',
        items: [
          { id: 'doc-item-6', name: 'Dr. Abdullayeva Shahnoza E. — Ginekolog Qabuli', price: 130000, unit: 'Qabul', refMin: 0, refMax: 0 }
        ]
      },
      {
        id: 'sg-priem-uro',
        groupTitle: 'УРОЛОГИЯ & АНДРОЛОГИЯ',
        items: [
          { id: 'doc-item-7', name: 'Dr. Karimov Sardor T. — Urolog-Androlog Qabuli', price: 125000, unit: 'Qabul', refMin: 0, refMax: 0 }
        ]
      },
      {
        id: 'sg-priem-oftalmo',
        groupTitle: 'ОФТАЛЬМОЛОГИЯ (КЎЗ КАСАЛЛИКЛАРИ)',
        items: [
          { id: 'doc-item-8', name: 'Dr. Yusupov Jamshid O. — Oftalmolog Qabuli', price: 95000, unit: 'Qabul', refMin: 0, refMax: 0 }
        ]
      },
      {
        id: 'sg-priem-lor',
        groupTitle: 'ОТОРИНОЛАРИНГОЛОГИЯ (ЛОР)',
        items: [
          { id: 'doc-item-9', name: 'Dr. Mirzayeva Malika U. — LOR Vrach Qabuli', price: 95000, unit: 'Qabul', refMin: 0, refMax: 0 }
        ]
      },
      {
        id: 'sg-priem-xirurg',
        groupTitle: 'ЖАРРОҲЛИК & ТРАВМАТОЛОГИЯ',
        items: [
          { id: 'doc-item-10', name: 'Dr. Tursunov Botir Sh. — Xirurg-Travmatolog Qabuli', price: 140000, unit: 'Qabul', refMin: 0, refMax: 0 }
        ]
      },
      {
        id: 'sg-priem-pediatr',
        groupTitle: 'ПЕДИАТРИЯ (БОЛАЛАР ШИФОКОРИ)',
        items: [
          { id: 'doc-item-14', name: 'Dr. Saidova Dilnoza F. — Pediatr Vrach Qabuli', price: 90000, unit: 'Qabul', refMin: 0, refMax: 0 }
        ]
      }
    ]
  },
  {
    id: 'cat-express',
    category: 'ЭКСПРЕСС-ТЕСТ',
    subGroups: [
      {
        id: 'sg-gematologiya',
        groupTitle: 'ГЕМАТОЛОГИЯ',
        items: [
          { id: 'exp-g1', name: 'Группа крови-резус фактор', price: 0, unit: 'Группа/Rh', refMin: 0, refMax: 0 },
          { id: 'exp-g2', name: 'Обследование на резус-антитела (RH)', price: 50000, unit: 'Титр', refMin: 0, refMax: 0 },
          { id: 'exp-g3', name: 'Время свертываемости крови', price: 10000, unit: 'мин', refMin: 2, refMax: 5 }
        ]
      },
      {
        id: 'sg-express-main',
        groupTitle: 'ЭКСПРЕСС-ТЕСТ',
        items: [
          { id: 'exp-1', name: 'Глюкоза', price: 15000, unit: 'ммоль/л', refMin: 3.9, refMax: 6.1 },
          { id: 'exp-2', name: 'Экспресс-HBsAg', price: 35000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'exp-3', name: 'Экспресс-HCV', price: 35000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'exp-4', name: 'Хорионический гонадотропин в моче', price: 35000, unit: 'мМЕ/мл', refMin: 0, refMax: 5 },
          { id: 'exp-5', name: 'Реакция Вассермана (RW)', price: 45000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'exp-6', name: 'Brucella abortus', price: 35000, unit: 'Титр', refMin: 0, refMax: 0 },
          { id: 'exp-7', name: 'ВИЧ (экспресс)', price: 95000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'exp-8', name: 'ВИЧ Экспресс (для нерезидентов РУз )', price: 190000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'exp-9', name: 'Тропонин', price: 70000, unit: 'нг/мл', refMin: 0, refMax: 0.04 }
        ]
      },
      {
        id: 'sg-express-cov',
        groupTitle: 'ЭКСПРЕСС-ТЕСТ',
        items: [
          { id: 'exp-10', name: 'Экспресс SARS-Cov-2 Ig M / Ig G', price: 90000, unit: 'Индекс', refMin: 0, refMax: 0.9 }
        ]
      },
      {
        id: 'sg-glucose-tolerance',
        groupTitle: 'ГЛЮКОЗО-ТОЛЕРАНТНЫЙ ЭКСПРЕСС ТЕСТ',
        items: [
          { id: 'exp-gt1', name: 'Глюкоза натощак', price: 35000, unit: 'ммоль/л', refMin: 3.9, refMax: 6.1 },
          { id: 'exp-gt2', name: 'Глюкоза через 1 час после нагрузки', price: 0, unit: 'ммоль/л', refMin: 3.9, refMax: 8.9 },
          { id: 'exp-gt3', name: 'Глюкоза через 2 часа после нагрузки', price: 0, unit: 'ммоль/л', refMin: 3.9, refMax: 7.8 }
        ]
      },
      {
        id: 'sg-oak',
        groupTitle: 'ОАК',
        items: [
          { id: 'exp-oak1', name: 'Общий анализ крови', price: 20000, unit: 'г/л', refMin: 120, refMax: 160 },
          { id: 'exp-oak2', name: 'Лейко формула', price: 30000, unit: '%', refMin: 45, refMax: 70 }
        ]
      }
    ]
  },
  {
    id: 'cat-hormones',
    category: 'ГОРМОНЫ',
    subGroups: [
      {
        id: 'sg-hormones-main',
        groupTitle: 'ГОРМОНЫ',
        items: [
          { id: 'hm-1', name: 'Кортизол', price: 90000, unit: 'нмоль/л', refMin: 171, refMax: 536 },
          { id: 'hm-2', name: 'Прогестерон', price: 90000, unit: 'нмоль/л', refMin: 0.3, refMax: 56.0 },
          { id: 'hm-3', name: 'Пролактин', price: 90000, unit: 'мМЕ/л', refMin: 109, refMax: 557 },
          { id: 'hm-4', name: 'Лютеинизирующий гормон (LH)', price: 90000, unit: 'мМЕ/мл', refMin: 1.7, refMax: 8.6 },
          { id: 'hm-5', name: 'Фолликулостимулирующий гормон ФСГ (FSH)', price: 90000, unit: 'мМЕ/мл', refMin: 1.5, refMax: 12.4 },
          { id: 'hm-6', name: 'Эстрадиол Е2 (Эстроген)', price: 90000, unit: 'пмоль/л', refMin: 40, refMax: 600 },
          { id: 'hm-7', name: 'Эстриол Е3 (Эстроген)', price: 90000, unit: 'нмоль/л', refMin: 0.2, refMax: 12 },
          { id: 'hm-8', name: 'Соматотропный гормон СТГ (GH)', price: 90000, unit: 'нг/мл', refMin: 0.05, refMax: 3.0 },
          { id: 'hm-9', name: 'Трансферрин', price: 300000, unit: 'г/л', refMin: 2.0, refMax: 3.6 },
          { id: 'hm-10', name: 'Тиреотропный гормон ТТГ', price: 90000, unit: 'мкМЕ/мл', refMin: 0.4, refMax: 4.0 },
          { id: 'hm-11', name: 'Антитела к рецепторам ТТГ (анти-рТТГ)', price: 200000, unit: 'МЕ/л', refMin: 0, refMax: 1.75 },
          { id: 'hm-12', name: 'Трийодтиронин свободный Т3 св', price: 90000, unit: 'пмоль/л', refMin: 3.1, refMax: 6.8 },
          { id: 'hm-13', name: 'Тироксин свободный Т4 св', price: 90000, unit: 'пмоль/л', refMin: 12.0, refMax: 22.0 },
          { id: 'hm-14', name: 'Трийодтиронин общий Т3', price: 90000, unit: 'нмоль/л', refMin: 1.2, refMax: 3.1 },
          { id: 'hm-15', name: 'Тироксин общий Т4', price: 90000, unit: 'нмоль/л', refMin: 66, refMax: 181 },
          { id: 'hm-16', name: 'Тестостерон', price: 90000, unit: 'нмоль/л', refMin: 8.6, refMax: 29.0 },
          { id: 'hm-17', name: 'Свободный тестостерон', price: 90000, unit: 'пг/мл', refMin: 4.5, refMax: 42.0 },
          { id: 'hm-18', name: 'Дегидроэпиандростерона Сульфат [DHEA-S]', price: 90000, unit: 'мкг/дл', refMin: 35, refMax: 430 },
          { id: 'hm-19', name: 'Инсулин', price: 90000, unit: 'мкЕд/мл', refMin: 2.6, refMax: 24.9 },
          { id: 'hm-20', name: 'Инсулиноподобный фактор роста [ИФР]', price: 140000, unit: 'нг/мл', refMin: 115, refMax: 307 },
          { id: 'hm-21', name: 'Хорионический гонадотропин (HCG/B-HCG)', price: 90000, unit: 'мМЕ/мл', refMin: 0, refMax: 5 },
          { id: 'hm-22', name: '17-Оксипрогестерон', price: 130000, unit: 'нмоль/л', refMin: 1.2, refMax: 9.3 },
          { id: 'hm-23', name: 'Антитела к тиреоглобулину (АТ-ТГ)', price: 90000, unit: 'МЕ/мл', refMin: 0, refMax: 115 },
          { id: 'hm-24', name: 'Антитела к ТиреоПероксидазе (АТ-ТПО)', price: 90000, unit: 'МЕ/мл', refMin: 0, refMax: 34 },
          { id: 'hm-25', name: 'Ферритин', price: 90000, unit: 'нг/мл', refMin: 30, refMax: 400 },
          { id: 'hm-26', name: 'С-пептид', price: 90000, unit: 'нг/мл', refMin: 0.9, refMax: 7.1 },
          { id: 'hm-27', name: 'Адренокортикотропный гормон АККТГ (ACTH)', price: 220000, unit: 'пг/мл', refMin: 7.2, refMax: 63.3 },
          { id: 'hm-28', name: 'Мозговой натрийуретический пропептид (NT-proBNP)', price: 150000, unit: 'пг/мл', refMin: 0, refMax: 125 },
          { id: 'hm-29', name: 'Паратиреоидный гормон (PTH)', price: 180000, unit: 'пг/мл', refMin: 15, refMax: 65 },
          { id: 'hm-30', name: 'Тиреоглобулин', price: 90000, unit: 'нг/мл', refMin: 1.4, refMax: 78 },
          { id: 'hm-31', name: 'Кальцитонин', price: 240000, unit: 'пг/мл', refMin: 0, refMax: 10 },
          { id: 'hm-32', name: 'Антимюллеров гормон (АМГ)', price: 390000, unit: 'нг/мл', refMin: 1.0, refMax: 10.6 },
          { id: 'hm-33', name: 'Глобулин связывающий половые гормоны', price: 140000, unit: 'нмоль/л', refMin: 18, refMax: 114 },
          { id: 'hm-34', name: 'Ингибин В', price: 400000, unit: 'пг/мл', refMin: 10, refMax: 341 },
          { id: 'hm-35', name: 'Витамин В12', price: 155000, unit: 'пг/мл', refMin: 197, refMax: 866 },
          { id: 'hm-36', name: 'Фолиевая кислота', price: 95000, unit: 'нг/мл', refMin: 3.1, refMax: 17.5 },
          { id: 'hm-37', name: 'Кортизол в моче', price: 90000, unit: 'мкг/24ч', refMin: 4.3, refMax: 176 },
          { id: 'hm-38', name: 'Норадреналин (кровь)', price: 350000, unit: 'пг/мл', refMin: 70, refMax: 1700 },
          { id: 'hm-39', name: 'Индекс НОМА (инсулин*глюкоза/22,5)', price: 0, unit: 'Индекс', refMin: 0, refMax: 2.7 },
          { id: 'hm-40', name: 'Гомоцистеин', price: 360000, unit: 'мкмоль/л', refMin: 5.0, refMax: 15.0 },
          { id: 'hm-41', name: 'D-димер', price: 105000, unit: 'нг/мл', refMin: 0, refMax: 500 },
          { id: 'hm-42', name: 'Интерлейкин-6', price: 350000, unit: 'пг/мл', refMin: 0, refMax: 7.0 },
          { id: 'hm-43', name: 'Прокальцитонин', price: 350000, unit: 'нг/мл', refMin: 0, refMax: 0.5 },
          { id: 'hm-44', name: 'Адреналин (кровь)', price: 350000, unit: 'пг/мл', refMin: 10, refMax: 85 },
          { id: 'hm-45', name: 'Vitamin D - 25 OH (Витамин Д )', price: 180000, unit: 'нг/мл', refMin: 30, refMax: 100 },
          { id: 'hm-46', name: 'Такралимус', price: 200000, unit: 'нг/мл', refMin: 5.0, refMax: 20.0 },
          { id: 'hm-47', name: 'Anti-GAD (анти-Глутаматдекарбоксилаза)', price: 200000, unit: 'Ед/мл', refMin: 0, refMax: 1.0 },
          { id: 'hm-48', name: 'Anti-IA2 (Антитела к тирозинфосфатаза)', price: 380000, unit: 'Ед/мл', refMin: 0, refMax: 1.0 },
          { id: 'hm-49', name: 'Витамин А (ретинол)', price: 400000, unit: 'мкг/л', refMin: 300, refMax: 800 },
          { id: 'hm-50', name: 'Цистатин С', price: 180000, unit: 'мг/л', refMin: 0.53, refMax: 0.95 },
          { id: 'hm-51', name: 'Альдостерон', price: 400000, unit: 'пг/мл', refMin: 30, refMax: 400 },
          { id: 'hm-52', name: 'Ренин', price: 400000, unit: 'мкМЕ/мл', refMin: 4.4, refMax: 46.1 }
        ]
      },
      {
        id: 'sg-tumor-markers',
        groupTitle: 'ОПУХОЛЕВЫЕ МАРКЕРЫ',
        items: [
          { id: 'tm-1', name: 'АФР Альфа - фетопротеин (АФП)', price: 90000, unit: 'МЕ/мл', refMin: 0, refMax: 7.3 },
          { id: 'tm-2', name: 'СЕА Раково-эмбриональный антиген (РЭА )', price: 90000, unit: 'нг/мл', refMin: 0, refMax: 5.0 },
          { id: 'tm-3', name: 'PSA Простатспецифический антиген общий (ПСА)', price: 90000, unit: 'нг/мл', refMin: 0, refMax: 4.0 },
          { id: 'tm-4', name: 'fPSA Простатспецифический антиген свободный (с ПСА)', price: 90000, unit: 'нг/мл', refMin: 0, refMax: 0.93 },
          { id: 'tm-5', name: 'Углеводный антиген СА 15-3', price: 90000, unit: 'Ед/мл', refMin: 0, refMax: 25 },
          { id: 'tm-6', name: 'Углеводный антиген СА 19-9', price: 90000, unit: 'Ед/мл', refMin: 0, refMax: 37 },
          { id: 'tm-7', name: 'Углеводный антиген СА 125', price: 90000, unit: 'Ед/мл', refMin: 0, refMax: 35 },
          { id: 'tm-8', name: 'Углеводный антиген СА 72-4', price: 130000, unit: 'Ед/мл', refMin: 0, refMax: 6.9 },
          { id: 'tm-9', name: 'Нейронспецифическая энолаза (NSE)', price: 90000, unit: 'нг/мл', refMin: 0, refMax: 16.3 },
          { id: 'tm-10', name: 'S-100 онкомаркер меланомы', price: 350000, unit: 'мкг/л', refMin: 0, refMax: 0.105 },
          { id: 'tm-11', name: 'Онкомаркёр рака яичников HE4', price: 330000, unit: 'пмоль/л', refMin: 0, refMax: 70 },
          { id: 'tm-12', name: 'Антиген плоскоклеточной карциномы (SCC Ag)', price: 360000, unit: 'нг/мл', refMin: 0, refMax: 1.5 },
          { id: 'tm-13', name: 'Индекс Рома (HE4+CA125 )', price: 0, unit: '%', refMin: 0, refMax: 11.4 },
          { id: 'tm-14', name: 'Cyfra 21-1', price: 150000, unit: 'нг/мл', refMin: 0, refMax: 3.3 },
          { id: 'tm-15', name: 'Метанефрин(Metanefrin)', price: 350000, unit: 'мкг/24ч', refMin: 0, refMax: 350 },
          { id: 'tm-16', name: 'S-100 Белок (Protein)', price: 350000, unit: 'мкг/л', refMin: 0, refMax: 0.105 }
        ]
      },
      {
        id: 'sg-immuno',
        groupTitle: 'ИММУНОЛОГИЧЕСКИЕ ИССЛЕДОВАНИЯ',
        items: [
          { id: 'im-1', name: 'Иммуноглобулин Е', price: 80000, unit: 'МЕ/мл', refMin: 0, refMax: 100 },
          { id: 'im-2', name: 'Иммуноглобулин G (IgG)', price: 80000, unit: 'г/л', refMin: 7.0, refMax: 16.0 }
        ]
      },
      {
        id: 'sg-cardio',
        groupTitle: 'КАРДИОСПЕЦИФИЧЕСКИЕ МАРКЕРЫ',
        items: [
          { id: 'card-1', name: 'Troponin I', price: 50000, unit: 'нг/мл', refMin: 0, refMax: 0.04 }
        ]
      }
    ]
  },
  {
    id: 'cat-torch',
    category: 'ТОРЧ И ИНФЕКЦИИ',
    subGroups: [
      {
        id: 'sg-torch-igg-ihla',
        groupTitle: 'ТОРЧ-ИНФЕКЦИИ IgG (ИХЛА)',
        items: [
          { id: 'torch-1', name: 'Toxoplasma Gondii IgG', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-2', name: 'Cytomegalovirus Ig G', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-3', name: 'Rubella IgG', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-4', name: 'Herpes Simplex I Ig G', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-5', name: 'Herpes Simplex II Ig G', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-6', name: 'Herpes Simplex 1/2 Ig G', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-7', name: 'Chlamydia trachomatis IgG', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-8', name: 'Mycoplasma hominis IgG', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-9', name: 'Ureaplasma urealyticum IgG', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 }
        ]
      },
      {
        id: 'sg-torch-igm-ihla',
        groupTitle: 'ТОРЧ-ИНФЕКЦИИ IgM (ИХЛА)',
        items: [
          { id: 'torch-10', name: 'Toxoplasma Gondii IgM', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-11', name: 'Cytomegalovirus Ig M', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-12', name: 'Rubella IgM', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-13', name: 'Herpes Simplex I Ig M', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-14', name: 'Herpes Simplex II Ig M', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-15', name: 'Herpes Simplex 1/2 Ig M', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-16', name: 'Chlamydia trachomatis IgM', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-17', name: 'Mycoplasma hominis IgM', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-18', name: 'Ureaplasma urealyticum IgM', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 }
        ]
      },
      {
        id: 'sg-infections-main',
        groupTitle: 'ИНФЕКЦИИ',
        items: [
          { id: 'torch-19', name: 'Бруцеллез (Brucella abortus)', price: 35000, unit: 'Титр', refMin: 0, refMax: 0 },
          { id: 'torch-20', name: 'Helicobacter pylori (в кале)', price: 70000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-21', name: 'Helicobacter pylori IgM', price: 70000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-22', name: 'Helicobacter pylori IgG', price: 70000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-23', name: 'Gardnerella Vaginalis IgG', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-24', name: 'Gardnerella Vaginalis IgM', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-25', name: 'Candida IgG', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-26', name: 'Candida IgM', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-27', name: 'Trichomonas vaginalis IgG', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-28', name: 'Trichomonas Vaginalis IgM', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-29', name: 'COVID-19 Ig M', price: 100000, unit: 'Индекс', refMin: 0, refMax: 0.9 },
          { id: 'torch-30', name: 'COVID-19 Ig G', price: 100000, unit: 'Индекс', refMin: 0, refMax: 0.9 },
          { id: 'torch-31', name: 'Вирус Эпштейн-Барра IgG', price: 80000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-32', name: 'Вирус Эпштейн-Бара IgM', price: 80000, unit: 'Качество', refMin: 0, refMax: 0.9 }
        ]
      },
      {
        id: 'sg-torch-igg-ifa',
        groupTitle: 'ТОРЧ-ИНФЕКЦИИ IgG (ИФА)',
        items: [
          { id: 'torch-33', name: 'Toxoplasma Gondii IgG', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-34', name: 'Cytomegalovirus IgG', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-35', name: 'Rubella IgG', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-36', name: 'Herpes Simplex I IgG', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-37', name: 'Herpes Simplex II IgG', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-38', name: 'Herpes Simplex 1/2 IgG', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-39', name: 'Chlamydia trachomatis IgG', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-40', name: 'Mycoplasma hominis IgG', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-41', name: 'Ureaplasma urealyticum IgG', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 }
        ]
      },
      {
        id: 'sg-parasites-main',
        groupTitle: 'ПАРАЗИТЫ',
        items: [
          { id: 'torch-42', name: 'Лямблии суммарные', price: 50000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-43', name: 'Лямблии IgG', price: 50000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-44', name: 'Лямблии IgM', price: 50000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-45', name: 'Аскарида IgG', price: 50000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-46', name: 'Эхинококкоз IgG', price: 50000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-47', name: 'Трихинелла IgG', price: 38000, unit: 'Качество', refMin: 0, refMax: 0.9 }
        ]
      },
      {
        id: 'sg-torch-igm-ifa',
        groupTitle: 'ТОРЧ-ИНФЕКЦИИ IgM (ИФА)',
        items: [
          { id: 'torch-48', name: 'Toxoplasma Gondii IgM', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-49', name: 'Cytomegalovirus IgM', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-50', name: 'Rubella IgM', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-51', name: 'Herpes Simplex I IgM', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-52', name: 'Herpes Simplex II IgM', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-53', name: 'Herpes Simplex 1/2 IgM', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-54', name: 'Chlamydia trachomatis IgM', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-55', name: 'Mycoplasma hominis IgM', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-56', name: 'Ureaplasma urealyticum IgM', price: 60000, unit: 'Качество', refMin: 0, refMax: 0.9 }
        ]
      },
      {
        id: 'sg-hepatitis-viral',
        groupTitle: 'ВИРУСНЫЕ ГЕПАТИТЫ',
        items: [
          { id: 'torch-57', name: 'HAV IgM (Гепатит А)', price: 40000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-58', name: 'HAV IgG (Гепатит А)', price: 40000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-59', name: 'HBsAg (Гепатит В)', price: 30000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-60', name: 'HCV Ab (Гепатит С)', price: 30000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-61', name: 'HDV - Ab (Гепатит D)', price: 40000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-62', name: 'HBsAg количественный', price: 100000, unit: 'МЕ/мл', refMin: 0, refMax: 0.05 }
        ]
      },
      {
        id: 'sg-hepatitis-b-panel',
        groupTitle: 'Гепатит В панел',
        items: [
          { id: 'torch-63', name: 'Поверхностный антиген вируса гепатита B (HBs Ag)', price: 20000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-64', name: 'Антитела к поверхностному антигену вируса гепатита B (HBs Ab)', price: 20000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-65', name: 'HBe-антигена вируса гепатита B (HBeAg)', price: 20000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-66', name: 'Антитела к HBe-антигену вируса гепатита B (HBeAb)', price: 20000, unit: 'Качество', refMin: 0, refMax: 0.9 },
          { id: 'torch-67', name: 'Антитела к HB-core антигену вируса гепатита B (HBc Ab)', price: 20000, unit: 'Качество', refMin: 0, refMax: 0.9 }
        ]
      }
    ]
  },
  {
    id: 'cat-biochem',
    category: 'БИОХИМИЯ',
    subGroups: [
      {
        id: 'sg-biochem-main',
        groupTitle: 'БИОХИМИЧЕСКИЕ АНАЛИЗЫ',
        items: [
          { id: 'bc-1', name: 'Общий белок', price: 30000, unit: 'г/л', refMin: 64, refMax: 83 },
          { id: 'bc-2', name: 'Альбумин', price: 30000, unit: 'г/л', refMin: 35, refMax: 52 },
          { id: 'bc-3', name: 'Аланинаминотрансфераза (АЛТ)', price: 30000, unit: 'Ед/л', refMin: 0, refMax: 41 },
          { id: 'bc-4', name: 'Аспартатаминотрансфераза (АСТ)', price: 30000, unit: 'Ед/л', refMin: 0, refMax: 37 },
          { id: 'bc-5', name: 'Глюкоза', price: 15000, unit: 'ммоль/л', refMin: 3.9, refMax: 6.1 },
          { id: 'bc-6', name: 'Мочевина', price: 30000, unit: 'ммоль/л', refMin: 2.5, refMax: 8.3 },
          { id: 'bc-7', name: 'Креатинин', price: 30000, unit: 'мкмоль/л', refMin: 62, refMax: 115 },
          { id: 'bc-8', name: 'Мочевая кислота', price: 30000, unit: 'мкмоль/л', refMin: 210, refMax: 420 },
          { id: 'bc-9', name: 'Альфа-Амилаза (Диастаза)', price: 35000, unit: 'Ед/л', refMin: 28, refMax: 100 },
          { id: 'bc-10', name: 'Щелочная фосфатаза', price: 30000, unit: 'Ед/л', refMin: 40, refMax: 150 },
          { id: 'bc-11', name: 'Тимоловая проба', price: 30000, unit: 'ед S-H', refMin: 0, refMax: 4.0 },
          { id: 'bc-12', name: 'Лактатдегидрогеназа (ЛДГ)', price: 30000, unit: 'Ед/л', refMin: 125, refMax: 220 },
          { id: 'bc-13', name: 'Гамма-глутамилтрансфераза (ГГТ)', price: 30000, unit: 'Ед/л', refMin: 0, refMax: 60 },
          { id: 'bc-14', name: 'Креатинкиназа МВ', price: 30000, unit: 'Ед/л', refMin: 0, refMax: 25 },
          { id: 'bc-15', name: 'Гликозилированный гемоглобин', price: 80000, unit: '%', refMin: 4.0, refMax: 6.0 },
          { id: 'bc-16', name: 'С-реактивный белок', price: 30000, unit: 'мг/л', refMin: 0, refMax: 5.0 },
          { id: 'bc-17', name: 'Антистрептолизин-О', price: 30000, unit: 'МЕ/мл', refMin: 0, refMax: 200 },
          { id: 'bc-18', name: 'Ревматоидный фактор Р Ф', price: 30000, unit: 'МЕ/мл', refMin: 0, refMax: 14.0 },
          { id: 'bc-19', name: 'Аммиак в крови', price: 300000, unit: 'мкмоль/л', refMin: 11, refMax: 35 },
          { id: 'bc-20', name: 'Лактат(LAC)', price: 200000, unit: 'ммоль/л', refMin: 0.5, refMax: 2.2 },
          { id: 'bc-21', name: 'Литий', price: 100000, unit: 'ммоль/л', refMin: 0.6, refMax: 1.2 },
          { id: 'bc-22', name: 'Скорость клубочковой фильтрации', price: 0, unit: 'мл/мин/1.73m2', refMin: 90, refMax: 120 }
        ]
      },
      {
        id: 'sg-lipid-spectrum',
        groupTitle: 'ЛИПИДНЫЙ СПЕКТР',
        items: [
          { id: 'bc-23', name: 'Холестерол общий', price: 30000, unit: 'ммоль/л', refMin: 3.2, refMax: 5.2 },
          { id: 'bc-24', name: 'Холестерол-ЛПВП', price: 35000, unit: 'ммоль/л', refMin: 1.0, refMax: 2.1 },
          { id: 'bc-25', name: 'Холестерол-ЛПНП', price: 35000, unit: 'ммоль/л', refMin: 0, refMax: 3.3 },
          { id: 'bc-26', name: 'Холестерол- ЛПОНП', price: 35000, unit: 'ммоль/л', refMin: 0.26, refMax: 1.04 },
          { id: 'bc-27', name: 'Триглицериды', price: 32000, unit: 'ммоль/л', refMin: 0.4, refMax: 1.7 },
          { id: 'bc-28', name: 'КА (коэффициент атерогенности)', price: 0, unit: 'Индекс', refMin: 2.0, refMax: 3.0 }
        ]
      },
      {
        id: 'sg-total-bilirubin',
        groupTitle: 'ОБЩИЙ БИЛИРУБИН',
        items: [
          { id: 'bc-29', name: 'Общий билирубин', price: 30000, unit: 'мкмоль/л', refMin: 5, refMax: 21 },
          { id: 'bc-30', name: 'Прямой билирубин', price: 0, unit: 'мкмоль/л', refMin: 0, refMax: 5.1 }
        ]
      },
      {
        id: 'sg-glucose-tolerance-2',
        groupTitle: 'ГЛЮКОЗО-ТОЛЕРАНТНЫЙ ТЕСТ 2',
        items: [
          { id: 'bc-31', name: 'Глюкоза натощак', price: 35000, unit: 'ммоль/л', refMin: 3.9, refMax: 6.1 },
          { id: 'bc-32', name: 'Глюкоза через 2 час после приема пищи', price: 0, unit: 'ммоль/л', refMin: 3.9, refMax: 7.8 }
        ]
      },
      {
        id: 'sg-electrolytes-main',
        groupTitle: 'ЭЛЕКТРОЛИТЫ',
        items: [
          { id: 'bc-33', name: 'Железо', price: 30000, unit: 'мкмоль/л', refMin: 11, refMax: 31 },
          { id: 'bc-34', name: 'Веноз крови - рН', price: 25000, unit: 'рН', refMin: 7.31, refMax: 7.41 },
          { id: 'bc-35', name: 'Калий', price: 30000, unit: 'ммоль/л', refMin: 3.5, refMax: 5.1 },
          { id: 'bc-36', name: 'Натрий', price: 30000, unit: 'ммоль/л', refMin: 135, refMax: 148 },
          { id: 'bc-37', name: 'Хлор', price: 30000, unit: 'ммоль/л', refMin: 98, refMax: 107 },
          { id: 'bc-38', name: 'Кальций общий', price: 25000, unit: 'ммоль/л', refMin: 2.15, refMax: 2.55 },
          { id: 'bc-39', name: 'Общая Железосвязывающая Способность', price: 130000, unit: 'мкмоль/л', refMin: 45, refMax: 76 },
          { id: 'bc-40', name: 'Фосфор', price: 25000, unit: 'ммоль/л', refMin: 0.87, refMax: 1.45 },
          { id: 'bc-41', name: 'Магний', price: 25000, unit: 'ммоль/л', refMin: 0.66, refMax: 1.07 },
          { id: 'bc-42', name: 'Цинк', price: 100000, unit: 'мкмоль/л', refMin: 10.4, refMax: 19.1 },
          { id: 'bc-43', name: 'Ионизированный кальций', price: 25000, unit: 'ммоль/л', refMin: 1.03, refMax: 1.23 },
          { id: 'bc-44', name: 'Йод', price: 300000, unit: 'мкг/л', refMin: 100, refMax: 200 },
          { id: 'bc-45', name: 'Медь', price: 150000, unit: 'мкмоль/л', refMin: 12.6, refMax: 24.4 },
          { id: 'bc-46', name: 'Церулоплазмин', price: 300000, unit: 'мг/л', refMin: 200, refMax: 600 }
        ]
      },
      {
        id: 'sg-glucose-tolerance-1',
        groupTitle: 'ГЛЮКОЗО-ТОЛЕРАНТНЫЙ ТЕСТ',
        items: [
          { id: 'bc-47', name: 'Глюкоза натощак', price: 38000, unit: 'ммоль/л', refMin: 3.9, refMax: 6.1 },
          { id: 'bc-48', name: 'Глюкоза через 1 час после приема пищи', price: 0, unit: 'ммоль/л', refMin: 3.9, refMax: 8.9 },
          { id: 'bc-49', name: 'Глюкоза через 2 час после приема пищи', price: 0, unit: 'ммоль/л', refMin: 3.9, refMax: 7.8 }
        ]
      }
    ]
  },
  {
    id: 'cat-microscopy',
    category: 'МИКРОСКОПИЯ',
    subGroups: [
      {
        id: 'sg-micro-analyses',
        groupTitle: 'МИКРОСКОПИЧЕСКИЕ АНАЛИЗЫ',
        items: [
          { id: 'mc-1', name: 'Копрология', price: 45000, unit: 'Описание', refMin: 0, refMax: 0 },
          { id: 'mc-2', name: 'Кал на яйца глист', price: 25000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'mc-3', name: 'Кал на скрытое кровотечение', price: 45000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'mc-4', name: 'Кал на лямблии и другие простейшие', price: 15000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'mc-5', name: 'Исследование выпотных жидкостей', price: 40000, unit: 'Описание', refMin: 0, refMax: 0 }
        ]
      },
      {
        id: 'sg-discharges-analyses',
        groupTitle: 'АНАЛИЗЫ ВЫДЕЛЕНИЙ',
        items: [
          { id: 'mc-6', name: 'Урогенитальный мазок', price: 35000, unit: 'в п/зр', refMin: 0, refMax: 15 },
          { id: 'mc-7', name: 'Цитология выделений молочной железы', price: 25000, unit: 'Описание', refMin: 0, refMax: 0 },
          { id: 'mc-8', name: 'Женский мазок на лептотрихоз', price: 20000, unit: 'в п/зр', refMin: 0, refMax: 0 },
          { id: 'mc-9', name: 'Спермограмма', price: 40000, unit: 'Описание', refMin: 0, refMax: 0 },
          { id: 'mc-10', name: 'Нативный мазок на трихомониаз', price: 25000, unit: 'в п/зр', refMin: 0, refMax: 0 },
          { id: 'mc-11', name: 'Мазок из зева на лептотрихоз', price: 25000, unit: 'в п/зр', refMin: 0, refMax: 0 },
          { id: 'mc-12', name: 'Сок простаты', price: 35000, unit: 'в п/зр', refMin: 0, refMax: 10 },
          { id: 'mc-13', name: 'Риноцитограмма', price: 40000, unit: 'в п/зр', refMin: 0, refMax: 0 }
        ]
      },
      {
        id: 'sg-dermato-research',
        groupTitle: 'ДЕРМАТОЛОГИЧЕСКИЕ ИССЛЕДОВАНИЯ',
        items: [
          { id: 'mc-14', name: 'Анализ на грибок', price: 25000, unit: 'Качество', refMin: 0, refMax: 0 }
        ]
      }
    ]
  },
  {
    id: 'cat-pcr',
    category: 'ПЦР',
    subGroups: [
      {
        id: 'sg-pcr-blood',
        groupTitle: 'ПЦР КРОВЬ',
        items: [
          { id: 'pcr-1', name: 'HBV (гепатит B Качественные) (Кровь)', price: 160000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-2', name: 'HCV (гепатит C Качественные) (Кровь)', price: 160000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-3', name: 'HDV (Гепатит D качественный.)', price: 160000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-4', name: 'HCV (генотип)', price: 180000, unit: 'Генотип', refMin: 0, refMax: 0 },
          { id: 'pcr-5', name: 'HBV (Количественные) (Кровь)', price: 230000, unit: 'МЕ/мл', refMin: 0, refMax: 150 },
          { id: 'pcr-6', name: 'HCV (Количественные) (Кровь)', price: 240000, unit: 'МЕ/мл', refMin: 0, refMax: 150 },
          { id: 'pcr-7', name: 'HDV (Гепатит D количество)', price: 250000, unit: 'МЕ/мл', refMin: 0, refMax: 150 },
          { id: 'pcr-8', name: 'ВПЧ 16\\18 (Кровь)', price: 150000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-9', name: 'Cytomegalovirus (Кровь)', price: 150000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-10', name: 'Cytomegalovirus (Моча)', price: 150000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-11', name: 'Rubella (Кровь)', price: 150000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-12', name: 'Herpis Simplex 1 (Кровь)', price: 150000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-13', name: 'ВПЧ квант 21 кровь', price: 450000, unit: 'Качество', refMin: 0, refMax: 0 }
        ]
      },
      {
        id: 'sg-pcr-swab',
        groupTitle: 'ПЦР МАЗОК',
        items: [
          { id: 'pcr-14', name: 'Cytomegalovirus', price: 150000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-15', name: 'Herpis Simplex 1,2', price: 150000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-16', name: 'Chlamydia trachomatis (Мазок)', price: 150000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-17', name: 'Андрофлор скрининг', price: 450000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-18', name: 'Фемофлор', price: 420000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-19', name: 'ВПЧ КВАНТ 21', price: 450000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-20', name: 'SARS-COV-2 ПЦР', price: 130000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-21', name: 'ВПЧ 16\\18 (Мазок)', price: 170000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-22', name: 'ВПЧ 16 (Мазок)', price: 85000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-23', name: 'ВПЧ 18 (Мазок)', price: 85000, unit: 'Качество', refMin: 0, refMax: 0 }
        ]
      },
      {
        id: 'sg-tb-tuberculosis',
        groupTitle: 'Tuberculosis',
        items: [
          { id: 'pcr-24', name: 'Mycobacterium Tuberculosis', price: 150000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-25', name: 'Mycobacterium Tuberculosis+bovis', price: 150000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-26', name: 'Mycobacterium Tuberculosis в мочи', price: 150000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-27', name: 'Mycobacterium Tuberculosis+bovis в мочи', price: 150000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-28', name: 'Mycobacterium Tuberculosis в крови', price: 150000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'pcr-29', name: 'Mycobacterium Tuberculosis+bovis в крови', price: 150000, unit: 'Качество', refMin: 0, refMax: 0 }
        ]
      }
    ]
  },
  {
    id: 'cat-bakposev',
    category: 'БАК. ПОСЕВ',
    subGroups: [
      {
        id: 'sg-bak-main',
        groupTitle: 'БАК. ПОСЕВ',
        items: [
          { id: 'bak-1', name: 'Бак.исслед. мокроты.', price: 140000, unit: 'КОЕ/мл', refMin: 0, refMax: 1000 },
          { id: 'bak-2', name: 'Бак.исслед. мочи.', price: 140000, unit: 'КОЕ/мл', refMin: 0, refMax: 1000 }
        ]
      }
    ]
  },
  {
    id: 'cat-urine',
    category: 'МОЧА',
    subGroups: [
      {
        id: 'sg-urine-analysis',
        groupTitle: 'АНАЛИЗ МОЧИ',
        items: [
          { id: 'u-1', name: 'Общий анализ мочи', price: 20000, unit: 'ОАМ', refMin: 1.015, refMax: 1.025 },
          { id: 'u-2', name: 'Моча по Нечипоренко', price: 35000, unit: 'в 1 мл', refMin: 0, refMax: 2000 },
          { id: 'u-3', name: 'Исслед. мочи по Зимницкому', price: 100000, unit: 'г/мл', refMin: 1.008, refMax: 1.026 },
          { id: 'u-4', name: 'Моча по Нечипоренко (в 2-х пор.)', price: 70000, unit: 'в 1 мл', refMin: 0, refMax: 2000 },
          { id: 'u-5', name: 'Моча на желчные пигменты', price: 25000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'u-6', name: 'Моча по Аддиса-Каковского', price: 40000, unit: 'в 1 мл', refMin: 0, refMax: 2000 }
        ]
      },
      {
        id: 'sg-urine-biochem',
        groupTitle: 'БИОХИМИЯ МОЧИ',
        items: [
          { id: 'u-7', name: 'Проба Реберга', price: 60000, unit: 'мл/мин', refMin: 80, refMax: 120 },
          { id: 'u-8', name: 'Глюкоза в моче', price: 10000, unit: 'ммоль/л', refMin: 0, refMax: 0.8 },
          { id: 'u-9', name: 'Ацетон в суточной моче', price: 35000, unit: 'ммоль/л', refMin: 0, refMax: 0 },
          { id: 'u-10', name: 'Мочевина в суточной моче', price: 45000, unit: 'ммоль/24ч', refMin: 430, refMax: 710 },
          { id: 'u-11', name: 'Креатинин в суточной моче', price: 35000, unit: 'ммоль/24ч', refMin: 8.8, refMax: 17.6 },
          { id: 'u-12', name: 'Микроальбумин в суточной моче', price: 45000, unit: 'мг/24ч', refMin: 0, refMax: 30 },
          { id: 'u-13', name: 'Суточная протеинурия (Белок в сут. моче)', price: 35000, unit: 'г/сутки', refMin: 0, refMax: 0.14 },
          { id: 'u-14', name: 'Мочевая кислота в суточной моче', price: 45000, unit: 'ммоль/24ч', refMin: 1.48, refMax: 4.43 },
          { id: 'u-15', name: 'Альфа-Амилаза (Диастаза) в суточной моче', price: 35000, unit: 'Ед/л', refMin: 28, refMax: 100 },
          { id: 'u-16', name: 'Мед в суточной моче', price: 150000, unit: 'мкг/24ч', refMin: 15, refMax: 60 },
          { id: 'u-17', name: 'Са(кальций) в суточной моче', price: 35000, unit: 'ммоль/24ч', refMin: 2.5, refMax: 7.5 },
          { id: 'u-18', name: 'Магний в суточной моче', price: 35000, unit: 'ммоль/24ч', refMin: 3.0, refMax: 5.0 },
          { id: 'u-19', name: 'Фосфор в суточной моче', price: 35000, unit: 'ммоль/24ч', refMin: 12.9, refMax: 42.0 },
          { id: 'u-20', name: 'Хлор[Cl] в суточной моче', price: 35000, unit: 'ммоль/24ч', refMin: 110, refMax: 250 }
        ]
      }
    ]
  },
  {
    id: 'cat-coagulogram',
    category: 'КОАГУЛОГРАММА',
    subGroups: [
      {
        id: 'sg-coag-main',
        groupTitle: 'КОАГУЛОГРАММА',
        items: [
          { id: 'c-1', name: 'Протромбиновое время', price: 20000, unit: 'сек', refMin: 11, refMax: 15 },
          { id: 'c-2', name: 'Активное частичное тромбопластиновое время (АЧТВ)', price: 15000, unit: 'сек', refMin: 24, refMax: 35 },
          { id: 'c-3', name: 'Фибриноген', price: 15000, unit: 'г/л', refMin: 2.0, refMax: 4.0 },
          { id: 'c-4', name: 'МНО', price: 15000, unit: 'Индекс', refMin: 0.8, refMax: 1.2 },
          { id: 'c-5', name: 'Тромбиновое время', price: 15000, unit: 'сек', refMin: 14, refMax: 21 },
          { id: 'c-6', name: 'ПТИ', price: 20000, unit: '%', refMin: 80, refMax: 105 }
        ]
      }
    ]
  },
  {
    id: 'cat-autoimmune',
    category: 'АУТОИММУННЫЕ ЗАБОЛЕВАНИЯ',
    subGroups: [
      {
        id: 'sg-auto-main',
        groupTitle: 'АУТОИММУННЫЙ ПРОФИЛЬ',
        items: [
          { id: 'a-1', name: 'Антинуклеарные антитела (ANA)', price: 150000, unit: 'Индекс', refMin: 0, refMax: 1.0 },
          { id: 'a-2', name: 'Ревматоидный фактор (РФ)', price: 35000, unit: 'МЕ/мл', refMin: 0, refMax: 14.0 },
          { id: 'a-3', name: 'Антистрептолизин-О (АСЛО)', price: 35000, unit: 'МЕ/мл', refMin: 0, refMax: 200 },
          { id: 'a-4', name: 'С-реактивный белок (СРБ)', price: 35000, unit: 'мг/л', refMin: 0, refMax: 5.0 },
          { id: 'a-5', name: 'Антитела к АЦЦП (Anti-CCP)', price: 160000, unit: 'Ед/мл', refMin: 0, refMax: 17.0 }
        ]
      }
    ]
  },
  {
    id: 'cat-others',
    category: 'ДРУГИЕ',
    subGroups: [
      {
        id: 'sg-hiv-contract',
        groupTitle: 'ВИЧ/HIV (догв №1)',
        items: [
          { id: 'oth-1', name: 'ВИЧ/HIV (Ифа)', price: 100000, unit: 'Качество', refMin: 0, refMax: 0 },
          { id: 'oth-2', name: 'ВИЧ (для нерезидентов РУз )', price: 180000, unit: 'Качество', refMin: 0, refMax: 0 }
        ]
      },
      {
        id: 'sg-rw-wasserman',
        groupTitle: 'Реакция Вассермана (RW)',
        items: [
          { id: 'oth-3', name: 'Реакция Вассермана (RW)', price: 45000, unit: 'Качество', refMin: 0, refMax: 0 }
        ]
      }
    ]
  },
  {
    id: 'cat-uzd',
    category: 'УЗД',
    subGroups: [
      {
        id: 'sg-uzd-main',
        groupTitle: 'УЛЬТРАЗВУКОВАЯ ДИАГНОСТИКА (УЗИ)',
        items: [
          { id: 'uzd-1', name: 'Qorin bo\'shlig\'i a\'zolari УЗД (Печень, желчный, поджелудочная, селезенка)', price: 120000, unit: 'Процедура', refMin: 0, refMax: 0 },
          { id: 'uzd-2', name: 'Buyrak va siydik qopchasi УЗД (Почки и мочевой пузырь)', price: 90000, unit: 'Процедура', refMin: 0, refMax: 0 },
          { id: 'uzd-3', name: 'Qalqonsimon bez УЗД (Щитовидная железа)', price: 80000, unit: 'Процедура', refMin: 0, refMax: 0 },
          { id: 'uzd-4', name: 'Yurak ЭхоКГ / Допплерография (Эхокардиография)', price: 150000, unit: 'Процедура', refMin: 0, refMax: 0 },
          { id: 'uzd-5', name: 'Kichik chanoq a\'zolari УЗД (Органы малого таза)', price: 110000, unit: 'Процедура', refMin: 0, refMax: 0 },
          { id: 'uzd-6', name: 'Homila УЗД + Допплерометрия (УЗИ беременности)', price: 140000, unit: 'Процедура', refMin: 0, refMax: 0 },
          { id: 'uzd-7', name: 'Sut bezlari УЗД (Молочные железы)', price: 95000, unit: 'Процедура', refMin: 0, refMax: 0 }
        ]
      }
    ]
  },
  {
    id: 'cat-rentgen',
    category: 'РЕНТГЕН',
    subGroups: [
      {
        id: 'sg-rentgen-main',
        groupTitle: 'РЕНТГЕНОГРАФИЯ И ФЛЮОРОГРАФИЯ',
        items: [
          { id: 'rnt-1', name: 'Ko\'krak qafasi rentgenofgrafiyasi (1 проекция - легкие)', price: 80000, unit: 'Снимок', refMin: 0, refMax: 0 },
          { id: 'rnt-2', name: 'Ko\'krak qafasi rentgenofgrafiyasi (2 проекции)', price: 110000, unit: 'Снимок', refMin: 0, refMax: 0 },
          { id: 'rnt-3', name: 'Bosh chanog\'i rentgenografiyasi (Рентген черепа)', price: 85000, unit: 'Снимок', refMin: 0, refMax: 0 },
          { id: 'rnt-4', name: 'Burun yondosh bo\'shliqlari rentgeni (Рентген ППН)', price: 75000, unit: 'Снимок', refMin: 0, refMax: 0 },
          { id: 'rnt-5', name: 'Umurtqa pog\'onasi rentgenografiyasi (Bo\'yin / Ko\'krak / Bel)', price: 95000, unit: 'Снимок', refMin: 0, refMax: 0 },
          { id: 'rnt-6', name: 'Bo\'g\'imlar rentgenografiyasi (Коленный / Тазобедренный сустав)', price: 90000, unit: 'Снимок', refMin: 0, refMax: 0 },
          { id: 'rnt-7', name: 'Qorin bo\'shlig\'i обзорный rentgeni', price: 90000, unit: 'Снимок', refMin: 0, refMax: 0 }
        ]
      }
    ]
  },
  {
    id: 'cat-mrt',
    category: 'МРТ',
    subGroups: [
      {
        id: 'sg-mrt-main',
        groupTitle: 'МАГНИТНО-РЕЗОНАНСНАЯ ТОМОГРАФИЯ',
        items: [
          { id: 'mrt-1', name: 'Bosh miya МРТ (МРТ головного мозга)', price: 350000, unit: 'Исследование', refMin: 0, refMax: 0 },
          { id: 'mrt-2', name: 'Bosh miya tomirlari МР-ангиографияси (МРА)', price: 380000, unit: 'Исследование', refMin: 0, refMax: 0 },
          { id: 'mrt-3', name: 'Umurtqa pog\'onasi МРТ (Bo\'yin / Ko\'krak / Bel-dumg\'aza)', price: 320000, unit: 'Отдел', refMin: 0, refMax: 0 },
          { id: 'mrt-4', name: 'Tiz osti bo\'g\'imi МРТ (МРТ коленного сустава)', price: 340000, unit: 'Сустав', refMin: 0, refMax: 0 },
          { id: 'mrt-5', name: 'Qorin bo\'shlig\'i va retroperitoneal soha МРТ', price: 420000, unit: 'Исследование', refMin: 0, refMax: 0 },
          { id: 'mrt-6', name: 'Kichik chanoq a\'zolari МРТ (МРТ малого таза)', price: 400000, unit: 'Исследование', refMin: 0, refMax: 0 },
          { id: 'mrt-7', name: 'Kontrast modda yuborish bilan МРТ (МРТ с контрастом)', price: 550000, unit: 'Исследование', refMin: 0, refMax: 0 }
        ]
      }
    ]
  },
  {
    id: 'cat-fgds',
    category: 'ФГДС',
    subGroups: [
      {
        id: 'sg-fgds-main',
        groupTitle: 'ФИБРОГАСТРОДУОДЕНОСКОПИЯ И ЭНДОСКОПИЯ',
        items: [
          { id: 'fgds-1', name: 'Video-эзофагогастродуоденоскопия (ФГДС стандарт)', price: 180000, unit: 'Процедура', refMin: 0, refMax: 0 },
          { id: 'fgds-2', name: 'H. Pylori экспресс-тести bilan ФГДС (Хеликобактер)', price: 220000, unit: 'Процедура', refMin: 0, refMax: 0 },
          { id: 'fgds-3', name: 'Shilliq qavat biopsiyasi bilan ФГДС (ФГДС с биопсией)', price: 260000, unit: 'Процедура', refMin: 0, refMax: 0 },
          { id: 'fgds-4', name: 'Medikamentoz sleep (Sedatsiya / Tibbiy uyqu) ostida ФГДС', price: 350000, unit: 'Процедура', refMin: 0, refMax: 0 },
          { id: 'fgds-5', name: 'Videokolonoskopiya (Колоноскопия)', price: 280000, unit: 'Процедура', refMin: 0, refMax: 0 }
        ]
      }
    ]
  },
  {
    id: 'cat-mskt',
    category: 'МСКТ',
    subGroups: [
      {
        id: 'sg-mskt-main',
        groupTitle: 'МУЛЬТИСПИРАЛЬНАЯ КОМПЬЮТЕРНАЯ ТОМОГРАФИЯ',
        items: [
          { id: 'kt-1', name: 'Bosh miya МСКТ (МСКТ головного мозга)', price: 280000, unit: 'Исследование', refMin: 0, refMax: 0 },
          { id: 'kt-2', name: 'O\'pka va ko\'krak qafasi a\'zolari МСКТ (МСКТ легких)', price: 300000, unit: 'Исследование', refMin: 0, refMax: 0 },
          { id: 'kt-3', name: 'Qorin bo\'shlig\'i va kichik chanoq МСКТ', price: 350000, unit: 'Исследование', refMin: 0, refMax: 0 },
          { id: 'kt-4', name: 'Umurtqa pog\'onasi 3D МСКТ (1 bo\'lim)', price: 290000, unit: 'Отдел', refMin: 0, refMax: 0 },
          { id: 'kt-5', name: 'Burun yondosh bo\'shliqlari МСКТ (МСКТ ППН)', price: 250000, unit: 'Исследование', refMin: 0, refMax: 0 },
          { id: 'kt-6', name: 'Kontrastli tomirlar МСКТ-ангиографияси (КТ-ангиография)', price: 580000, unit: 'Исследование', refMin: 0, refMax: 0 }
        ]
      }
    ]
  }
];

export const INITIAL_ORDERS: TestOrder[] = [];

export const INITIAL_REAGENTS: Reagent[] = [
  { id: 'r1', name: 'Mindray BC-5300 Diluent', catalogNumber: 'RE-MIN-001', category: 'ЭКСПРЕСС-ТЕСТ', quantity: 18, unit: 'L', minQuantity: 5, expiryDate: '2027-02-15', status: 'ok' },
  { id: 'r2', name: 'Roche Cobas c311 Glucose HK', catalogNumber: 'RE-ROC-882', category: 'БИОХИМИЯ', quantity: 2, unit: 'quti', minQuantity: 3, expiryDate: '2026-10-30', status: 'low' }
];

export const PATIENT_HEMOGLOBIN_TREND: HealthTrendPoint[] = [
  { date: '2025-09-10', val: 118, refMin: 120, refMax: 160 },
  { date: '2025-12-05', val: 126, refMin: 120, refMax: 160 },
  { date: '2026-03-20', val: 134, refMin: 120, refMax: 160 },
  { date: '2026-08-16', val: 142, refMin: 120, refMax: 160 }
];

// Official Complete OAM (Общий анализ мочи) Panel Definition matching user screenshots
export const OAM_FULL_PANEL_RESULTS: TestResultItem[] = [
  { parameterId: 'oam-1', parameterName: 'Количество', value: '100', unit: 'мл', refMin: 50, refMax: 200, refString: 'мл', status: 'normal' },
  { parameterId: 'oam-2', parameterName: 'Цвет', value: 'соломенно-желтый', unit: 'Качество', refMin: 0, refMax: 0, refString: 'соломенно-желтый', status: 'normal' },
  { parameterId: 'oam-3', parameterName: 'Прозрачность', value: 'прозрачная', unit: 'Качество', refMin: 0, refMax: 0, refString: 'прозрачная', status: 'normal' },
  { parameterId: 'oam-4', parameterName: 'Уробилиноген', value: 'abs', unit: 'mkmol/l', refMin: 0, refMax: 3.3, refString: '< 3.3 mkmol/l', status: 'normal' },
  { parameterId: 'oam-5', parameterName: 'Билирубин', value: 'abs', unit: 'Качество', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },
  { parameterId: 'oam-6', parameterName: 'Кетоновые тела', value: 'abs', unit: 'Качество', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },
  { parameterId: 'oam-7', parameterName: 'Белок', value: 'abs', unit: 'г/л', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },
  { parameterId: 'oam-8', parameterName: 'Нитриты', value: 'abs', unit: 'Качество', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },
  { parameterId: 'oam-9', parameterName: 'Глюкоза', value: 'abs', unit: 'ммоль/сут', refMin: 0, refMax: 2.8, refString: '0,0-2,8 ммоль/сут', status: 'normal' },
  { parameterId: 'oam-10', parameterName: 'Относительная плотность', value: '1020', unit: 'г/мл', refMin: 1012, refMax: 1020, refString: '1012-1020', status: 'normal' },
  { parameterId: 'oam-11', parameterName: 'pH', value: '6,0', unit: 'pH', refMin: 5.0, refMax: 6.5, refString: '5,0-6,5', status: 'normal' },

  // Эпителий
  { parameterId: 'oam-12', parameterName: 'плоский', subGroup: 'Эпителий :', value: '0-1', unit: 'в п/зр', refMin: 0, refMax: 5, refString: '0-5 в п/зр', status: 'normal' },
  { parameterId: 'oam-13', parameterName: 'переходный', subGroup: 'Эпителий :', value: 'abs', unit: 'в п/зр', refMin: 0, refMax: 5, refString: '0-5 в п/зр', status: 'normal' },
  { parameterId: 'oam-14', parameterName: 'почечный', subGroup: 'Эпителий :', value: 'abs', unit: 'в п/зр', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },

  // Лейкоциты
  { parameterId: 'oam-15', parameterName: 'Лейкоциты', subGroup: 'Лейкоциты :', value: '0-1', unit: 'в п/зр', refMin: 0, refMax: 3, refString: '0-3 в п/зр', status: 'normal' },

  // Эритроциты
  { parameterId: 'oam-16', parameterName: 'измененные', subGroup: 'Эритроциты :', value: 'abs', unit: 'в п/зр', refMin: 0, refMax: 1, refString: '0-1 в п/зр', status: 'normal' },
  { parameterId: 'oam-17', parameterName: 'неизмененные', subGroup: 'Эритроциты :', value: 'abs', unit: 'в п/зр', refMin: 0, refMax: 3, refString: '0-3 в п/зр', status: 'normal' },

  // Цилиндры
  { parameterId: 'oam-18', parameterName: 'гиалиновые', subGroup: 'Цилиндры :', value: 'abs', unit: 'в п/зр', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },
  { parameterId: 'oam-19', parameterName: 'зернистые', subGroup: 'Цилиндры :', value: 'abs', unit: 'в п/зр', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },
  { parameterId: 'oam-20', parameterName: 'восковидные', subGroup: 'Цилиндры :', value: 'abs', unit: 'в п/зр', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },
  { parameterId: 'oam-21', parameterName: 'эритроцитарные', subGroup: 'Цилиндры :', value: 'abs', unit: 'в п/зр', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },
  { parameterId: 'oam-22', parameterName: 'жирнозернистые', subGroup: 'Цилиндры :', value: 'abs', unit: 'в п/зр', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },

  // Слизь
  { parameterId: 'oam-23', parameterName: 'Слизь', value: 'abs', unit: 'Качество', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },

  // Соли
  { parameterId: 'oam-24', parameterName: 'ураты', subGroup: 'Соли :', value: 'abs', unit: 'Качество', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },
  { parameterId: 'oam-25', parameterName: 'мочевой кислоты', subGroup: 'Соли :', value: 'abs', unit: 'Качество', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },
  { parameterId: 'oam-26', parameterName: 'оксаллаты', subGroup: 'Соли :', value: 'abs', unit: 'Качество', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },
  { parameterId: 'oam-27', parameterName: 'трипельфосфаты', subGroup: 'Соли :', value: 'abs', unit: 'Качество', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },
  { parameterId: 'oam-28', parameterName: 'мочекислого аммония', subGroup: 'Соли :', value: 'abs', unit: 'Качество', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },
  { parameterId: 'oam-29', parameterName: 'аморфные фосфаты', subGroup: 'Соли :', value: 'abs', unit: 'Качество', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },
  { parameterId: 'oam-30', parameterName: 'кристаллы', subGroup: 'Соли :', value: 'abs', unit: 'Качество', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },
  { parameterId: 'oam-31', parameterName: 'гематоидина', subGroup: 'Соли :', value: 'abs', unit: 'Качество', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },

  // Другие элементы
  { parameterId: 'oam-32', parameterName: 'Элементы спермы и простатического секрета', value: 'abs', unit: 'Качество', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },
  { parameterId: 'oam-33', parameterName: 'Бактерии', value: 'abs', unit: 'Качество', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' },
  { parameterId: 'oam-34', parameterName: 'Споры дрожжевых грибков', value: 'abs', unit: 'Качество', refMin: 0, refMax: 0, refString: 'abs', status: 'normal' }
];
