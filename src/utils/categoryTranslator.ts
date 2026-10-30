import type { LanguageCode } from '../context/LanguageContext';

/**
 * Maps raw or legacy category strings (Russian/Uzbek/English/Turkish/Kyrgyz) to translated strings.
 */
export const translateCategoryName = (categoryName: string, lang: LanguageCode): string => {
  if (!categoryName) return '';
  const c = categoryName.trim().toUpperCase();

  // Special Category: Barcha Bo'limlar / Barcha tahlillar
  if (c.includes('BARCHA') || c.includes('ВСЕ') || c.includes('ALL') || c.includes('TÜM') || c.includes('БАРДЫК')) {
    if (lang === 'RUS') return 'Все Отделения';
    if (lang === 'ENG') return 'All Departments';
    if (lang === 'TUR') return 'Tüm Bölümler';
    if (lang === 'KGZ') return 'Бардык Бөлүмдөр';
    return 'Barcha Bo\'limlar';
  }

  // Modules / Top Tabs
  if (c.includes('ПРИЕМ') || c.includes('PRIEM') || c.includes('RECEPTION') || c.includes('KABUL')) {
    if (lang === 'RUS') return 'Прием';
    if (lang === 'ENG') return 'Reception';
    if (lang === 'TUR') return 'Hasta Kabul';
    if (lang === 'KGZ') return 'Кабыл алуу';
    return 'Qabul';
  }
  if (c === 'ЛАБОРАТОРИЯ' || c === 'LABORATORIYA' || c === 'LABORATORY') {
    if (lang === 'RUS') return 'Лаборатория';
    if (lang === 'ENG') return 'Laboratory';
    if (lang === 'TUR') return 'Laboratuvar';
    if (lang === 'KGZ') return 'Лаборатория';
    return 'Laboratoriya';
  }
  if (c === 'УЗД' || c === 'УЗИ' || c === 'USG') {
    if (lang === 'RUS') return 'УЗИ';
    if (lang === 'ENG') return 'USG (Ultrasound)';
    if (lang === 'TUR') return 'Ultrason (USG)';
    if (lang === 'KGZ') return 'УЗИ (УЗД)';
    return 'UZD (UTT)';
  }
  if (c === 'ГРУППА' || c === 'GRUPPA' || c === 'GROUP') {
    if (lang === 'RUS') return 'Группа';
    if (lang === 'ENG') return 'Group';
    if (lang === 'TUR') return 'Grup';
    if (lang === 'KGZ') return 'Топ';
    return 'Guruh';
  }
  if (c === 'РЕНТГЕН' || c === 'RENTGEN' || c === 'X-RAY') {
    if (lang === 'RUS') return 'Рентген';
    if (lang === 'ENG') return 'X-Ray';
    if (lang === 'TUR') return 'Röntgen';
    if (lang === 'KGZ') return 'Рентген';
    return 'Rentgen';
  }
  if (c === 'МРТ' || c === 'MRT' || c === 'MRI') {
    if (lang === 'RUS') return 'МРТ';
    if (lang === 'ENG') return 'MRI';
    if (lang === 'TUR') return 'MR (Emar)';
    if (lang === 'KGZ') return 'МРТ';
    return 'MRT';
  }
  if (c === 'ФГДС' || c === 'FGDS' || c === 'ENDOSCOPY') {
    if (lang === 'RUS') return 'ФГДС';
    if (lang === 'ENG') return 'Endoscopy';
    if (lang === 'TUR') return 'Endoskopi (FGDS)';
    if (lang === 'KGZ') return 'ФГДС (Эндоскопия)';
    return 'FGDS';
  }
  if (c === 'МСКТ' || c === 'MSKT' || c === 'CT SCAN' || c === 'КТ') {
    if (lang === 'RUS') return 'МСКТ';
    if (lang === 'ENG') return 'CT Scan';
    if (lang === 'TUR') return 'Tomografi (BT/MSKT)';
    if (lang === 'KGZ') return 'МСКТ (КТ)';
    return 'MSKT';
  }
  if (c.includes('ОАМ') || c.includes('МОЧ') || c.includes('URINE') || c.includes('PESHOB') || c.includes('İDRAR') || c.includes('ЗАРАП')) {
    if (lang === 'RUS') return 'АНАЛИЗ МОЧИ (ОАМ)';
    if (lang === 'ENG') return 'URINE ANALYSIS (OAM)';
    if (lang === 'TUR') return 'İDRAR ANALİZİ (TIT)';
    if (lang === 'KGZ') return 'ЗАРАП АНАЛИЗИ (ОАМ)';
    return 'PESHOB TAHLILI (OAM)';
  }
  if (c.includes('ОАК') || c.includes('КРОВ') || c.includes('BLOOD') || c.includes('QON') || c.includes('KAN')) {
    if (lang === 'RUS') return 'Общий анализ крови (ОАК) и Лейкоформула';
    if (lang === 'ENG') return 'Complete Blood Count (CBC)';
    if (lang === 'TUR') return 'Tam Kan Sayımı (Hemogram / CBC)';
    if (lang === 'KGZ') return 'Жалпы кан анализи (ОАК) жана Лейкоформула';
    return 'Umumiy qon tahlili (OAK) va Leykoformula';
  }
  if (c.includes('ИФА') || c.includes('ТОРЧ') || c.includes('TORCH') || c.includes('ELISA') || c.includes('ИНФЕКЦИ')) {
    if (lang === 'RUS') return 'ТОРЧ И ИНФЕКЦИИ';
    if (lang === 'ENG') return 'TORCH & INFECTIONS';
    if (lang === 'TUR') return 'TORCH VE ENFEKSİYONLAR';
    if (lang === 'KGZ') return 'ТОРЧ ЖАНА ИНФЕКЦИЯЛАР';
    return 'TORCH VA INFEKSIYALAR';
  }
  if (c.includes('БИОХИМИ') || c.includes('BIOCHEM') || c.includes('BİYOKİMYA')) {
    if (lang === 'RUS') return 'БИОХИМИЯ КРОВИ';
    if (lang === 'ENG') return 'BLOOD BIOCHEMISTRY';
    if (lang === 'TUR') return 'KAN BİYOKİMYASI';
    if (lang === 'KGZ') return 'КАНДЫН БИОХИМИЯСЫ';
    return 'BIOXIMIYA (QON)';
  }
  if (c.includes('ОНКОМАРКЕР') || c.includes('TUMOR MARKER') || c.includes('ОПУХОЛЕВ')) {
    if (lang === 'RUS') return 'ОПУХОЛЕВЫЕ МАРКЕРЫ';
    if (lang === 'ENG') return 'TUMOR MARKERS';
    if (lang === 'TUR') return 'TÜMÖR MARKÖRLERİ';
    if (lang === 'KGZ') return 'ОНКОМАРКЕРЛЕР';
    return 'ONKOMARKERLAR';
  }
  if (c.includes('ГОРМОН') || c.includes('HORMONE')) {
    if (lang === 'RUS') return 'ГОРМОНЫ';
    if (lang === 'ENG') return 'HORMONES';
    if (lang === 'TUR') return 'HORMONLAR';
    if (lang === 'KGZ') return 'ГОРМОНДОР';
    return 'GORMONLAR';
  }
  if (c.includes('ЭКСПРЕСС') || c.includes('EXPRESS') || c.includes('EKSPRES')) {
    if (lang === 'RUS') return 'ЭКСПРЕСС-ТЕСТ';
    if (lang === 'ENG') return 'EXPRESS TEST';
    if (lang === 'TUR') return 'EKSPRES TEST';
    if (lang === 'KGZ') return 'ЭКСПРЕСС-ТЕСТ';
    return 'EKSPRESS-TEST';
  }
  if (c.includes('МИКРОСКОП') || c.includes('MICROSCOPY') || c.includes('MİKROSKOBİ')) {
    if (lang === 'RUS') return 'МИКРОСКОПИЯ';
    if (lang === 'ENG') return 'MICROSCOPY';
    if (lang === 'TUR') return 'MİKROSKOBİ';
    if (lang === 'KGZ') return 'МИКРОСКОПИЯ';
    return 'MIKROSKOPIYA';
  }
  if (c.includes('ПЦР') || c.includes('PCR') || c.includes('ПТС-Р') || c.includes('PZR') || c.includes('ПЗР')) {
    if (lang === 'RUS') return 'ПЦР (ДНК/РНК)';
    if (lang === 'ENG') return 'PCR (DNA/RNA)';
    if (lang === 'TUR') return 'PCR (DNA/RNA)';
    if (lang === 'KGZ') return 'ПЦР (ДНК/РНК)';
    return 'PZR (DNK/RNK)';
  }
  if (c.includes('ПОСЕВ') || c.includes('CULTURE') || c.includes('EKISH') || c.includes('POSIV') || c.includes('KÜLTÜR') || c.includes('ЭГҮҮ')) {
    if (lang === 'RUS') return 'БАК. ПОСЕВ';
    if (lang === 'ENG') return 'BACTERIAL CULTURE';
    if (lang === 'TUR') return 'BAKTERİYOLOJİK KÜLTÜR';
    if (lang === 'KGZ') return 'БАК. ЭГҮҮ';
    return 'BAK. POSIV (EKISH)';
  }
  if (c.includes('КОАГУЛО') || c.includes('COAGULO')) {
    if (lang === 'RUS') return 'КОАГУЛОГРАММА';
    if (lang === 'ENG') return 'COAGULOGRAM';
    if (lang === 'TUR') return 'KOAGÜLOGRAM';
    if (lang === 'KGZ') return 'КОАГУЛОГРАММА';
    return 'KOAGULOGRAMMA';
  }
  if (c.includes('АУТОИММУН') || c.includes('AUTOIMMUNE') || c.includes('OTOİMMÜN')) {
    if (lang === 'RUS') return 'АУТОИММУННЫЕ ЗАБОЛЕВАНИЯ';
    if (lang === 'ENG') return 'AUTOIMMUNE DISEASES';
    if (lang === 'TUR') return 'OTOİMMÜN HASTALIKLAR';
    if (lang === 'KGZ') return 'АУТОИММУНДУК ООРУЛАР';
    return 'AUTOIMMUN KASALLIKLAR';
  }
  if (c.includes('ДРУГИЕ') || c.includes('OTHER') || c.includes('BOSHQA') || c.includes('DİĞER') || c.includes('БАШКА')) {
    if (lang === 'RUS') return 'ДРУГИЕ ИССЛЕДОВАНИЯ';
    if (lang === 'ENG') return 'OTHER INVESTIGATIONS';
    if (lang === 'TUR') return 'DİĞER TESTLER';
    if (lang === 'KGZ') return 'БАШКА АНАЛИЗДЕР';
    return 'BOSHQA TAHLILLAR';
  }

  return categoryName;
};

/**
 * Universal classifier to assign a specific test parameter to its target department category.
 */
export const getCategoryForParameter = (name: string, id: string = '', lang: LanguageCode = 'UZB'): string => {
  const n = (name || '').toLowerCase();
  const i = (id || '').toLowerCase();

  // 1. Peshob tahlili (OAM / Umumiy siydik)
  if (
    i.startsWith('oam-') || 
    n.includes('моч') || 
    n.includes('оам') || 
    n.includes('удельный вес') || 
    n.includes('эпителий') || 
    n.includes('цилиндры') || 
    n.includes('слизь') || 
    n.includes('пешоб') ||
    n.includes('проба реберга') ||
    n.includes('протеинурия') ||
    n.includes('ацетон в')
  ) {
    return translateCategoryName('ОАМ', lang);
  }

  // 2. Umumiy qon tahlili (OAK)
  if (
    i.startsWith('oak-') || 
    i.startsWith('leuko-') || 
    n.includes('общий анализ крови') || 
    n.includes('оак') || 
    n.includes('гемоглобин') || 
    n.includes('эритроциты') || 
    n.includes('соэ') || 
    n.includes('тромбоциты') || 
    n.includes('лейкоцит') || 
    n.includes('лейко формула') || 
    n.includes('лимфоцит') || 
    n.includes('моноцит') || 
    n.includes('эозинофил') || 
    n.includes('палочкояд')
  ) {
    return translateCategoryName('ОАК', lang);
  }

  // 3. PZR (ПЦР / PCR)
  if (
    i.startsWith('pcr-') || 
    i.startsWith('pzr-') || 
    n.includes('пцр') || 
    n.includes('pcr') || 
    n.includes('pzr') || 
    n.includes('птс-р') || 
    n.includes('днк') || 
    n.includes('рнк')
  ) {
    return translateCategoryName('ПЦР', lang);
  }

  // 4. Bak. posiv (Bacterial Culture)
  if (
    i.startsWith('bak-') || 
    n.includes('посев') || 
    n.includes('посив') || 
    n.includes('экиш') || 
    n.includes('эгүүн') || 
    n.includes('культура') || 
    n.includes('бакт') || 
    n.includes('микрофлор')
  ) {
    return translateCategoryName('ПОСЕВ', lang);
  }

  // 5. Onkomarkerlar (Tumor markers)
  if (
    i.startsWith('tm-') || 
    i.startsWith('onko-') || 
    n.includes('онко') || 
    n.includes('опухолев') || 
    n.includes('афп') || 
    n.includes('рэа') || 
    n.includes('пса') || 
    n.includes('са 15-3') || 
    n.includes('са 19-9') || 
    n.includes('са 125') || 
    n.includes('са 72-4') || 
    n.includes('nse') || 
    n.includes('he4') || 
    n.includes('индекс рома') || 
    n.includes('cyfra') || 
    n.includes('s-100')
  ) {
    return translateCategoryName('ОНКОМАРКЕР', lang);
  }

  // 6. Gormonlar (Hormones)
  if (
    i.startsWith('hm-') || 
    i.startsWith('hormone-') || 
    n.includes('ттг') || 
    n.includes('т3') || 
    n.includes('т4') || 
    n.includes('кортизол') || 
    n.includes('пролактин') || 
    n.includes('прогестерон') || 
    n.includes('эстрадиол') || 
    n.includes('тестостерон') || 
    n.includes('инсулин') || 
    n.includes('ферритин') || 
    n.includes('дгеа') || 
    n.includes('dhea') || 
    n.includes('акктг') || 
    n.includes('гормон') || 
    n.includes('фсг') || 
    n.includes('лг') || 
    n.includes('стг') || 
    n.includes('соматотроп') || 
    n.includes('альдостерон') || 
    n.includes('ренин') || 
    n.includes('амг')
  ) {
    return translateCategoryName('ГОРМОН', lang);
  }

  // 7. Autoimmun kasalliklari
  if (
    i.startsWith('auto-') || 
    n.includes('аутоиммун') || 
    n.includes('autoimmun') || 
    n.includes('anti-gad') || 
    n.includes('anti-ia2') || 
    n.includes('ат-тпо') || 
    n.includes('ат-тг') || 
    n.includes('волчаноч') || 
    n.includes('ревматоид')
  ) {
    return translateCategoryName('АУТОИММУН', lang);
  }

  // 8. Mikroskopiya
  if (
    i.startsWith('micro-') || 
    n.includes('микроскоп') || 
    n.includes('мазок') || 
    n.includes('соскоб') || 
    n.includes('выделени') || 
    n.includes('демодекс') || 
    n.includes('грибок') || 
    n.includes('спермограмма')
  ) {
    return translateCategoryName('МИКРОСКОП', lang);
  }

  // 9. Ekspress-test
  if (
    i.startsWith('exp-') || 
    n.includes('экспресс') || 
    n.includes('express') || 
    n.includes('быстрый тест')
  ) {
    return translateCategoryName('ЭКСПРЕСС', lang);
  }

  // 10. Bioximiya (Qon)
  if (
    i.startsWith('bio-') || 
    n.includes('алт') || 
    n.includes('аст') || 
    n.includes('билирубин') || 
    n.includes('глюкоза') || 
    n.includes('мочевина') || 
    n.includes('креатинин') || 
    n.includes('холестерин') || 
    n.includes('общий белок') || 
    n.includes('альбумин') || 
    n.includes('амилаза') || 
    n.includes('щелочная фосфатаза') || 
    n.includes('липид') || 
    n.includes('электролит') || 
    n.includes('биохим')
  ) {
    return translateCategoryName('БИОХИМИЯ', lang);
  }

  // 11. TORCH va Infeksiyalar
  if (
    i.startsWith('torch-') || 
    i.startsWith('inf-') || 
    n.includes('igm') || 
    n.includes('igg') || 
    n.includes('covid') || 
    n.includes('вирус') || 
    n.includes('лямбли') || 
    n.includes('аскарид') || 
    n.includes('эхинокок') || 
    n.includes('трихинелл') || 
    n.includes('toxoplasma') || 
    n.includes('cytomegalo') || 
    n.includes('rubella') || 
    n.includes('herpes') || 
    n.includes('candida') || 
    n.includes('trichomonas') || 
    n.includes('hbsag') || 
    n.includes('hcv') || 
    n.includes('ифа') || 
    n.includes('торч') || 
    n.includes('torch') || 
    n.includes('вич') || 
    n.includes('hiv') || 
    n.includes('сифилис') || 
    n.includes('бруцелл')
  ) {
    return translateCategoryName('ТОРЧ И ИНФЕКЦИИ', lang);
  }

  // 12. Koagulogramma
  if (i.startsWith('coag-') || n.includes('коагуло') || n.includes('фибриноген') || n.includes('протромбин') || n.includes('ачтв')) {
    return translateCategoryName('КОАГУЛОГРАММА', lang);
  }

  return translateCategoryName('ДРУГИЕ', lang);
};

/**
 * Maps subgroup titles (e.g. ГЕМАТОЛОГИЯ, ОПУХОЛЕВЫЕ МАРКЕРЫ, ГЛЮКОЗО-ТОЛЕРАНТНЫЙ ТЕСТ) to target language.
 */
export const translateSubGroupTitle = (groupTitle: string, lang: LanguageCode): string => {
  if (!groupTitle) return '';
  const g = groupTitle.trim().toUpperCase();

  const map: Record<string, Record<LanguageCode, string>> = {
    'ГЕМАТОЛОГИЯ': { UZB: 'GEMATOLOGIYA', RUS: 'ГЕМАТОЛОГИЯ', ENG: 'HEMATOLOGY', TUR: 'HEMATOLOJİ', KGZ: 'ГЕМАТОЛОГИЯ' },
    'ЭКСПРЕСС-ТЕСТ': { UZB: 'EKSPRESS-TEST', RUS: 'ЭКСПРЕСС-ТЕСТ', ENG: 'EXPRESS TEST', TUR: 'EKSPRES TEST', KGZ: 'ЭКСПРЕСС-ТЕСТ' },
    'ГЛЮКОЗО-ТОЛЕРАНТНЫЙ ЭКСПРЕСС ТЕСТ': { UZB: 'GLYUKOZA-TOLERANT EKSPRESS TEST', RUS: 'ГЛЮКОЗО-ТОЛЕРАНТНЫЙ ЭКСПРЕСС ТЕСТ', ENG: 'GLUCOSE TOLERANCE EXPRESS TEST', TUR: 'GLİKOZ TOLERANS EKSPRES TESTİ', KGZ: 'ГЛЮКОЗА-ТОЛЕРАНТТЫК ЭКСПРЕСС ТЕСТ' },
    'ОАК': { UZB: 'UMUMIY QON TAHLILI (OAK)', RUS: 'ОАК (ОБЩИЙ АНАЛИЗ КРОВИ)', ENG: 'CBC (COMPLETE BLOOD COUNT)', TUR: 'TAM KAN SAYIMI (HEMOGRAM)', KGZ: 'ЖАЛПЫ КАН АНАЛИЗИ (ОАК)' },
    'ГОРМОНЫ': { UZB: 'GORMONLAR', RUS: 'ГОРМОНЫ', ENG: 'HORMONES', TUR: 'HORMONLAR', KGZ: 'ГОРМОНДОР' },
    'ОПУХОЛЕВЫЕ МАРКЕРЫ': { UZB: 'ONKOMARKERLAR', RUS: 'ОПУХОЛЕВЫЕ МАРКЕРЫ', ENG: 'TUMOR MARKERS', TUR: 'TÜMÖR MARKÖRLERİ', KGZ: 'ОНКОМАРКЕРЛЕР' },
    'ИММУНОЛОГИЧЕСКИЕ ИССЛЕДОВАНИЯ': { UZB: 'IMMUNOLOGIK TEKSHIRUVLAR', RUS: 'ИММУНОЛОГИЧЕСКИЕ ИССЛЕДОВАНИЯ', ENG: 'IMMUNOLOGICAL TESTS', TUR: 'İMMÜNOLOJİK TESTLER', KGZ: 'ИММУНОЛОГИЯЛЫК ИЗИЛДӨӨЛӨР' },
    'КАРДИОСПЕЦИФИЧЕСКИЕ МАРКЕРЫ': { UZB: 'KARDIOSPETSIFIK MARKERLAR', RUS: 'КАРДИОСПЕЦИФИЧЕСКИЕ МАРКЕРЫ', ENG: 'CARDIAC MARKERS', TUR: 'KARDİYAK MARKÖRLER', KGZ: 'КАРДИОСПЕЦИФИКАЛЫК МАРКЕРЛЕР' },
    'ТОРЧ-ИНФЕКЦИИ IGG (ИХЛА)': { UZB: 'TORCH-INFEKSIYALAR IgG (IXLA)', RUS: 'ТОРЧ-ИНФЕКЦИИ IgG (ИХЛА)', ENG: 'TORCH INFECTIONS IgG (CLIA)', TUR: 'TORCH ENFEKSİYONLARI IgG (CLIA)', KGZ: 'ТОРЧ-ИНФЕКЦИЯЛАР IgG (ИХЛА)' },
    'ТОРЧ-ИНФЕКЦИИ IGM (ИХЛА)': { UZB: 'TORCH-INFEKSIYALAR IgM (IXLA)', RUS: 'ТОРЧ-ИНФЕКЦИИ IgM (ИХЛА)', ENG: 'TORCH INFECTIONS IgM (CLIA)', TUR: 'TORCH ENFEKSİYONLARI IgM (CLIA)', KGZ: 'ТОРЧ-ИНФЕКЦИЯЛАР IgM (ИХЛА)' },
    'ИНФЕКЦИИ': { UZB: 'INFEKSIYALAR', RUS: 'ИНФЕКЦИИ', ENG: 'INFECTIONS', TUR: 'ENFEKSİYONLAR', KGZ: 'ИНФЕКЦИЯЛАР' },
    'ТОРЧ-ИНФЕКЦИИ IGG (ИФА)': { UZB: 'TORCH-INFEKSIYALAR IgG (IFA)', RUS: 'ТОРЧ-ИНФЕКЦИИ IgG (ИФА)', ENG: 'TORCH INFECTIONS IgG (ELISA)', TUR: 'TORCH ENFEKSİYONLARI IgG (ELISA)', KGZ: 'ТОРЧ-ИНФЕКЦИЯЛАР IgG (ИФА)' },
    'ТОРЧ-ИНФЕКЦИИ IGM (ИФА)': { UZB: 'TORCH-INFEKSIYALAR IgM (IFA)', RUS: 'ТОРЧ-ИНФЕКЦИИ IgM (ИФА)', ENG: 'TORCH INFECTIONS IgM (ELISA)', TUR: 'TORCH ENFEKSİYONLARI IgM (ELISA)', KGZ: 'ТОРЧ-ИНФЕКЦИЯЛАР IgM (ИФА)' },
    'ПАРАЗИТЫ': { UZB: 'PARAZITLAR', RUS: 'ПАРАЗИТЫ', ENG: 'PARASITES', TUR: 'PARAZİTLER', KGZ: 'ПАРАЗИТТЕР' },
    'ВИРУСНЫЕ ГЕПАТИТЫ': { UZB: 'VIRUSLI GEPATITLAR', RUS: 'ВИРУСНЫЕ ГЕПАТИТЫ', ENG: 'VIRAL HEPATITIS', TUR: 'VİRAL HEPATİTLER', KGZ: 'ВИРУСТУК ГЕПАТИТТЕР' },
    'ГЕПАТИТ В ПАНЕЛ': { UZB: 'Gepatit B paneli', RUS: 'Панель гепатита B', ENG: 'Hepatitis B Panel', TUR: 'Hepatit B Paneli', KGZ: 'Гепатит B панели' },
    'БИОХИМИЧЕСКИЕ АНАЛИЗЫ': { UZB: 'BIOXIMIK TAHLILLAR', RUS: 'БИОХИМИЧЕСКИЕ АНАЛИЗЫ', ENG: 'BIOCHEMICAL ANALYSES', TUR: 'BİYOKİMYASAL ANALİZLER', KGZ: 'БИОХИМИЯЛЫК АНАЛИЗДЕР' },
    'ЛИПИДНЫЙ СПЕКТР': { UZB: 'LIPID SPEKTRI', RUS: 'ЛИПИДНЫЙ СПЕКТР', ENG: 'LIPID PROFILE', TUR: 'LİPİD PROFİLİ', KGZ: 'ЛИПИДДИК СПЕКТР' },
    'ОБЩИЙ БИЛИРУБИН': { UZB: 'UMUMIY BILIRUBIN', RUS: 'ОБЩИЙ БИЛИРУБИН', ENG: 'TOTAL BILIRUBIN', TUR: 'TOPLAM BİLİRUBİN', KGZ: 'ЖАЛПЫ БИЛИРУБИН' },
    'ГЛЮКОЗО-ТОЛЕРАНТНЫЙ ТЕСТ 2': { UZB: 'GLYUKOZA-TOLERANT TEST 2', RUS: 'ГЛЮКОЗО-ТОЛЕРАНТНЫЙ ТЕСТ 2', ENG: 'GLUCOSE TOLERANCE TEST 2', TUR: 'GLİKOZ TOLERANS TESTİ 2', KGZ: 'ГЛЮКОЗА-ТОЛЕРАНТТЫК ТЕСТ 2' },
    'ГЛЮКОЗО-ТОЛЕРАНТНЫЙ ТЕСТ': { UZB: 'GLYUKOZA-TOLERANT TEST', RUS: 'ГЛЮКОЗО-ТОЛЕРАНТНЫЙ ТЕСТ', ENG: 'GLUCOSE TOLERANCE TEST', TUR: 'GLİKOZ TOLERANS TESTİ', KGZ: 'ГЛЮКОЗА-ТОЛЕРАНТТЫК ТЕСТ' },
    'ЭЛЕКТРОЛИТЫ': { UZB: 'ELEKTROLITLAR', RUS: 'ЭЛЕКТРОЛИТЫ', ENG: 'ELECTROLYTES', TUR: 'ELEKTROLİTLER', KGZ: 'ЭЛЕКТРОЛИТТЕР' },
    'МИКРОСКОПИЧЕСКИЕ АНАЛИЗЫ': { UZB: 'MIKROSKOPIK TAHLILLAR', RUS: 'МИКРОСКОПИЧЕСКИЕ АНАЛИЗЫ', ENG: 'MICROSCOPIC ANALYSES', TUR: 'MİKROSKOBİK ANALİZLER', KGZ: 'МИКРОСКОПИЯЛЫК АНАЛИЗДЕР' },
    'АНАЛИЗЫ ВЫДЕЛЕНИЙ': { UZB: 'AJRATMALAR TAHLILI', RUS: 'АНАЛИЗЫ ВЫДЕЛЕНИЙ', ENG: 'DISCHARGE ANALYSES', TUR: 'SÜRÜNTÜ VE AKINTI ANALİZLERİ', KGZ: 'БӨЛҮНҮҮЛӨРДҮН АНАЛИЗДЕРИ' },
    'ДЕРМАТОЛОГИЧЕСКИЕ ИССЛЕДОВАНИЯ': { UZB: 'DERMATOLOGIK TEKSHIRUVLAR', RUS: 'ДЕРМАТОЛОГИЧЕСКИЕ ИССЛЕДОВАНИЯ', ENG: 'DERMATOLOGICAL TESTS', TUR: 'DERMATOLOJİK TESTLER', KGZ: 'ДЕРМАТОЛОГИЯЛЫК ИЗИЛДӨӨЛӨР' },
    'ПЦР КРОВЬ': { UZB: 'PTS-R QON', RUS: 'ПЦР КРОВЬ', ENG: 'PCR BLOOD', TUR: 'PCR KAN', KGZ: 'ПЦР КАН' },
    'ПЦР МАЗОК': { UZB: 'PTS-R SURTMA', RUS: 'ПЦР МАЗОК', ENG: 'PCR SWAB', TUR: 'PCR SÜRÜNTÜ', KGZ: 'ПЦР СҮРТҮМ' },
    'TUBERCULOSIS': { UZB: 'Tuberkulyoz (Tuberculosis)', RUS: 'Туберкулез (Tuberculosis)', ENG: 'Tuberculosis', TUR: 'Tüberküloz (Verem)', KGZ: 'Туберкулез (Tuberculosis)' },
    'БАК. ПОСЕВ': { UZB: 'BAK. EKISH', RUS: 'БАК. ПОСЕВ', ENG: 'BACTERIAL CULTURE', TUR: 'BAKTERİYOLOJİK KÜLTÜR', KGZ: 'БАК. ЭГҮҮ' },
    'АНАЛИЗ МОЧИ': { UZB: 'PESHOB TAHLILI', RUS: 'АНАЛИЗ МОЧИ', ENG: 'URINE ANALYSIS', TUR: 'İDRAR ANALİZİ', KGZ: 'ЗАРАП АНАЛИЗИ' },
    'БИОХИМИЯ МОЧИ': { UZB: 'PESHOB BIOXIMIYASI', RUS: 'БИОХИМИЯ МОЧИ', ENG: 'URINE BIOCHEMISTRY', TUR: 'İDRAR BİYOKİMYASI', KGZ: 'ЗАРАП БИОХИМИЯСЫ' },
    'КОАГУЛОГРАММА': { UZB: 'KOAGULOGRAMMA', RUS: 'КОАГУЛОГРАММА', ENG: 'COAGULOGRAM', TUR: 'KOAGÜLOGRAM', KGZ: 'КОАГУЛОГРАММА' },
    'АУТОИММУННЫЙ ПРОФИЛЬ': { UZB: 'AUTOIMMUN PROFIL', RUS: 'АУТОИММУННЫЙ ПРОФИЛЬ', ENG: 'AUTOIMMUNE PROFILE', TUR: 'OTOİMMÜN PROFİL', KGZ: 'АУТОИММУНДУК ПРОФИЛЬ' },
    'ВИЧ/HIV': { UZB: 'OIV/HIV', RUS: 'ВИЧ/HIV', ENG: 'HIV', TUR: 'HIV / AIDS', KGZ: 'ВИЧ/HIV' },
    'КАРДИОЛОГИЯ': { UZB: 'KARDIOLOGIYA', RUS: 'КАРДИОЛОГИЯ', ENG: 'CARDIOLOGY', TUR: 'KARDİYOLOJİ', KGZ: 'КАРДИОЛОГИЯ' },
    'ЭНДОКРИНОЛОГИЯ': { UZB: 'ENDOKRINOLOGIYA', RUS: 'ЭНДОКРИНОЛОГИЯ', ENG: 'ENDOCRINOLOGY', TUR: 'ENDOKRİNOLOJİ', KGZ: 'ЭНДОКРИНОЛОГИЯ' },
    'ТЕРАПИЯ': { UZB: 'TERAPIYA', RUS: 'ТЕРАПИЯ', ENG: 'THERAPY', TUR: 'DAHİLİYE / TERAPİ', KGZ: 'ТЕРАПИЯ' },
    'НЕВРОЛОГИЯ': { UZB: 'NEVROLOGIYA', RUS: 'НЕВРОЛОГИЯ', ENG: 'NEUROLOGY', TUR: 'NÖROLOJİ', KGZ: 'НЕВРОЛОГИЯ' },
    'ГАСТРОЭНТЕРОЛОГИЯ': { UZB: 'GASTROENTEROLOGIYA', RUS: 'ГАСТРОЭНТЕРОЛОГИЯ', ENG: 'GASTROENTEROLOGY', TUR: 'GASTROENTEROLOJİ', KGZ: 'ГАСТРОЭНТЕРОЛОГИЯ' },
    'ГИНЕКОЛОГИЯ': { UZB: 'GINEKOLOGIYA & AKUSHERLIK', RUS: 'ГИНЕКОЛОГИЯ И АКУШЕРСТВО', ENG: 'GYNECOLOGY & OBSTETRICS', TUR: 'JİNEKOLOJİ VE DOĞUM', KGZ: 'ГИНЕКОЛОГИЯ ЖАНА АКУШЕРЛИК' },
    'УРОЛОГИЯ': { UZB: 'UROLOGIYA & ANDROLOGIYA', RUS: 'УРОЛОГИЯ И АНДРОЛОГИЯ', ENG: 'UROLOGY & ANDROLOGY', TUR: 'ÜROLOJİ VE ANDROLOJİ', KGZ: 'УРОЛОГИЯ ЖАНА АНДРОЛОГИЯ' },
    'ОФТАЛЬМОЛОГИЯ': { UZB: 'OFTALMOLOGIYA (KO\'Z KASALLIKLARI)', RUS: 'ОФТАЛЬМОЛОГИЯ', ENG: 'OPHTHALMOLOGY', TUR: 'GÖZ HASTALIKLARI (OFTALMOLOJİ)', KGZ: 'ОФТАЛЬМОЛОГИЯ' },
    'ОТОРИНОЛАРИНГОЛОГИЯ': { UZB: 'OTORINOLARINGOLOGIYA (LOR)', RUS: 'ОТОРИНОЛАРИНГОЛОГИЯ (ЛОР)', ENG: 'ENT (OTOLARYNGOLOGY)', TUR: 'KULAK BURUN BOĞAZ (KBB)', KGZ: 'ОТОРИНОЛАРИНГОЛОГИЯ (ЛОР)' },
    'ЖАРРОҲЛИК': { UZB: 'JARROHLIK & TRAVMATOLOGIYA', RUS: 'ХИРУРГИЯ И ТРАВМАТОЛОГИЯ', ENG: 'SURGERY & TRAUMATOLOGY', TUR: 'CERRAHİ VE TRAVMATOLOJİ', KGZ: 'ХИРУРГИЯ ЖАНА ТРАВМАТОЛОГИЯ' },
    'ПЕДИАТРИЯ': { UZB: 'PEDIATRIYA (BOLALAR SHIFOKORI)', RUS: 'ПЕДИАТРИЯ (ДЕТСКИЙ ВРАЧ)', ENG: 'PEDIATRICS', TUR: 'PEDİATRİ (ÇOCUK SAĞLIĞI)', KGZ: 'ПЕДИАТРИЯ (БАЛДАР ДАРЫГЕРИ)' }
  };

  for (const [key, val] of Object.entries(map)) {
    if (g.includes(key)) {
      return val[lang] || val.UZB;
    }
  }

  return groupTitle;
};

/**
 * Maps test item names (Russian/Uzbek/English/Turkish/Kyrgyz) to translated strings depending on active language.
 */
export const translateTestName = (testName: string, lang: LanguageCode): string => {
  if (!testName) return '';
  const tStr = testName.trim();

  const testMap: Record<string, Record<LanguageCode, string>> = {
    // --- PESHOB BIOXIMIYASI (Urine Biochemistry) ---
    'Проба Реберга': { UZB: "Reberg sinamasi (Kreatinin klirensi)", RUS: "Проба Реберга", ENG: "Reberg Test (Creatinine Clearance)", TUR: "Reberg Testi (Kreatinin Klerensi)", KGZ: "Реберг сынамы (Креатинин клиренси)" },
    'Глюкоза в моче': { UZB: "Peshobda glyukoza", RUS: "Глюкоза в моче", ENG: "Urine Glucose", TUR: "İdrarda Glikoz", KGZ: "Зараптагы глюкоза" },
    'Ацетон в суточной моче': { UZB: "Sutkalik peshobda aseton", RUS: "Ацетон в суточной моче", ENG: "24h Urine Acetone", TUR: "24 Saatlik İdrarda Aseton", KGZ: "Суткалык зараптагы ацетон" },
    'Мочевина в суточной моче': { UZB: "Sutkalik peshobda mochevina", RUS: "Мочевина в суточной моче", ENG: "24h Urine Urea", TUR: "24 Saatlik İdrarda Üre", KGZ: "Суткалык зараптагы мочевина" },
    'Креатинин в суточной моче': { UZB: "Sutkalik peshobda kreatinin", RUS: "Креатинин в суточной моче", ENG: "24h Urine Creatinine", TUR: "24 Saatlik İdrarda Kreatinin", KGZ: "Суткалык зараптагы креатинин" },
    'Микроальбумин в суточной моче': { UZB: "Sutkalik peshobda mikroalbumin", RUS: "Микроальбумин в суточной моче", ENG: "24h Urine Microalbumin", TUR: "24 Saatlik İdrarda Mikroalbumin", KGZ: "Суткалык зараптагы микроальбумин" },
    'Суточная протеинурия (Белок в сут. моче)': { UZB: "Sutkalik proteinuriya (Sutkalik peshobda oqsil)", RUS: "Суточная протеинурия (Белок в сут. моче)", ENG: "24h Proteinuria (Urine Protein)", TUR: "24 Saatlik Proteinüri (İdrarda Protein)", KGZ: "Суткалык протеинурия (Суткалык зараптагы белок)" },
    'Мочевая кислота в суточной моче': { UZB: "Sutkalik peshobda moch kislotasi", RUS: "Мочевая кислота в суточной моче", ENG: "24h Urine Uric Acid", TUR: "24 Saatlik İdrarda Ürik Asit", KGZ: "Суткалык зараптагы зарап кислотасы" },
    'Альфа-Амилаза (Диастаза) в суточной моче': { UZB: "Sutkalik peshobda Alfa-Amilaza (Diastaza)", RUS: "Альфа-Амилаза (Диастаза) в суточной моче", ENG: "24h Urine Alpha-Amylase (Diastase)", TUR: "24 Saatlik İdrarda Alfa-Amilaz (Diastaz)", KGZ: "Суткалык зараптагы Альфа-Амилаза (Диастаза)" },
    'Мед в суточной моче': { UZB: "Sutkalik peshobda mis (Cu)", RUS: "Медь в суточной моче", ENG: "24h Urine Copper", TUR: "24 Saatlik İdrarda Bakır", KGZ: "Суткалык зараптагы жез (Cu)" },
    'Са(кальций) в суточной моче': { UZB: "Sutkalik peshobda Ca (Kaltsiy)", RUS: "Са(кальций) в суточной моче", ENG: "24h Urine Calcium", TUR: "24 Saatlik İdrarda Kalsiyum", KGZ: "Суткалык зараптагы Са (Кальций)" },
    'Магний в суточной моче': { UZB: "Sutkalik peshobda magniy", RUS: "Магний в суточной моче", ENG: "24h Urine Magnesium", TUR: "24 Saatlik İdrarda Magnezyum", KGZ: "Суткалык зараптагы магний" },
    'Фосфор в суточной моче': { UZB: "Sutkalik peshobda fosfor", RUS: "Фосфор в суточной моче", ENG: "24h Urine Phosphorus", TUR: "24 Saatlik İdrarda Fosfor", KGZ: "Суткалык зараптагы фосфор" },
    'Хлор[Cl] в суточной моче': { UZB: "Sutkalik peshobda Xlor [Cl]", RUS: "Хлор[Cl] в суточной моче", ENG: "24h Urine Chloride [Cl]", TUR: "24 Saatlik İdrarda Klor [Cl]", KGZ: "Суткалык зараптагы Хлор [Cl]" },

    // --- AUTOIMMUN PROFIL (Autoimmune Profile) ---
    'Антинуклеарные антитела (ANA)': { UZB: "Antinuklear antitellar (ANA)", RUS: "Антинуклеарные антитела (ANA)", ENG: "Antinuclear Antibodies (ANA)", TUR: "Antinükleer Antikorlar (ANA)", KGZ: "Антинуклеардык антителолор (ANA)" },
    'Ревматоидный фактор (РФ)': { UZB: "Revmatoid omil (RF)", RUS: "Ревматоидный фактор (РФ)", ENG: "Rheumatoid Factor (RF)", TUR: "Romatoid Faktör (RF)", KGZ: "Ревматоиддик фактор (РФ)" },
    'Антистрептолизин-О (АСЛО)': { UZB: "Antistreptolizin-O (ASLO)", RUS: "Антистрептолизин-О (АСЛО)", ENG: "Antistreptolysin O (ASO)", TUR: "Antistreptolizin O (ASO/ASLO)", KGZ: "Антистрептолизин-О (АСЛО)" },
    'С-реактивный белок (СРБ)': { UZB: "S-reaktiv oqsil (SRB)", RUS: "С-реактивный белок (СРБ)", ENG: "C-Reactive Protein (CRP)", TUR: "C-Reaktif Protein (CRP)", KGZ: "С-реактивдүү белок (СРБ)" },
    'Антитела к АЦЦП (Anti-CCP)': { UZB: "ATSCP ga antitellar (Anti-CCP)", RUS: "Антитела к АЦЦП (Anti-CCP)", ENG: "Anti-CCP Antibodies", TUR: "Anti-CCP Antikorları", KGZ: "АЦЦПга антителолор (Anti-CCP)" },

    // --- OIV/HIV & OTHERS ---
    'ВИЧ/HIV (Ифа)': { UZB: "OIV/HIV (IFA)", RUS: "ВИЧ/HIV (ИФА)", ENG: "HIV (ELISA)", TUR: "HIV (ELISA)", KGZ: "ВИЧ/HIV (ИФА)" },
    'ВИЧ (для нерезидентов РУз )': { UZB: "OIV (O'zR rezidenti bo'lmaganlar uchun)", RUS: "ВИЧ (для нерезидентов РУз)", ENG: "HIV (Non-residents of RUz)", TUR: "HIV (Yabancılar İçin)", KGZ: "ВИЧ (ӨЗб резиденттери эместер үчүн)" },
    'ВИЧ (экспресс)': { UZB: "OIV (Ekspress)", RUS: "ВИЧ (экспресс)", ENG: "HIV (Express)", TUR: "HIV (Ekspres)", KGZ: "ВИЧ (экспресс)" },
    'ВИЧ Экспресс (для нерезидентов РУз )': { UZB: "OIV Ekspress (O'zR rezidenti bo'lmaganlar uchun)", RUS: "ВИЧ Экспресс (для нерезидентов РУз)", ENG: "HIV Express (Non-residents)", TUR: "HIV Ekspres (Yabancılar İçin)", KGZ: "ВИЧ Экспресс (резидент эместер үчүн)" },

    // --- HEPATITIS B PANEL ---
    'Поверхностный антиген вируса гепатита B (HBs Ag)': { UZB: "Gepatit B virusining yuza antigeni (HBsAg)", RUS: "Поверхностный антиген вируса гепатита B (HBs Ag)", ENG: "Hepatitis B Surface Antigen (HBsAg)", TUR: "Hepatit B Yüzey Antijeni (HBsAg)", KGZ: "Гепатит B вирусунун беттик антигени (HBsAg)" },
    'Антитела к поверхностному антигену вируса гепатита B (HBs Ab)': { UZB: "HBsAg ga antitellar (HBsAb)", RUS: "Антитела к поверхностному антигену вируса гепатита B (HBs Ab)", ENG: "Anti-HBs Antibodies", TUR: "Anti-HBs Antikorları", KGZ: "HBsAg ге антителолор (HBsAb)" },
    'HBe-антигена вируса гепатита B (HBeAg)': { UZB: "Gepatit B virusining HBe-antigeni (HBeAg)", RUS: "HBe-антиген вируса гепатита B (HBeAg)", ENG: "Hepatitis B e-Antigen (HBeAg)", TUR: "Hepatit B e-Antijeni (HBeAg)", KGZ: "Гепатит B вирусунун HBe-антигени (HBeAg)" },
    'Антитела к HBe-антигену вируса гепатита B (HBeAb)': { UZB: "HBeAg ga antitellar (HBeAb)", RUS: "Антитела к HBe-антигену вируса гепатита B (HBeAb)", ENG: "Anti-HBe Antibodies", TUR: "Anti-HBe Antikorları", KGZ: "HBeAg ге антителолор (HBeAb)" },
    'Антитела к HB-core антигену вируса гепатита B (HBc Ab)': { UZB: "HB-core antigeniga antitellar (HBcAb)", RUS: "Антитела к HB-core антигену вируса гепатита B (HBc Ab)", ENG: "Anti-HBc Antibodies", TUR: "Anti-HBc Antikorları", KGZ: "HB-core антигенине антителолор (HBcAb)" },

    // --- GENERAL TESTS ---
    'Группа крови-резус фактор': { UZB: "Qon guruhi-rezus omil", RUS: "Группа крови-резус фактор", ENG: "Blood Group & Rh Factor", TUR: "Kan Grubu ve Rh Faktörü", KGZ: "Кан тобу жана резус фактор" },
    'Обследование на резус-антитела (RH)': { UZB: "Rezus-antitellar (RH) tekshiruvi", RUS: "Обследование на резус-антитела (RH)", ENG: "Rh Antibody Screening (RH)", TUR: "Rh Antikor Taraması (RH)", KGZ: "Резус-антителаларды изилдөө (RH)" },
    'Время свертываемости крови': { UZB: "Qon ivish vaqti", RUS: "Время свертываемости крови", ENG: "Blood Clotting Time", TUR: "Kan Pıhtılaşma Süresi", KGZ: "Кандын уюу убактысы" },
    'Глюкоза': { UZB: "Glyukoza", RUS: "Глюкоза", ENG: "Glucose", TUR: "Glikoz", KGZ: "Глюкоза" },
    'Экспресс-HBsAg': { UZB: "Ekspress-HBsAg", RUS: "Экспресс-HBsAg", ENG: "Express HBsAg", TUR: "Ekspres HBsAg", KGZ: "Экспресс-HBsAg" },
    'Экспресс-HCV': { UZB: "Ekspress-HCV", RUS: "Экспресс-HCV", ENG: "Express HCV", TUR: "Ekspres HCV", KGZ: "Экспресс-HCV" },
    'Хорионический гонадотропин в моче': { UZB: "Peshobda xorionik gonadotrop (XG)", RUS: "Хорионический гонадотропин в моче", ENG: "Urine hCG Test", TUR: "İdrarda hCG Testi", KGZ: "Зараптагы хорионикалык гонадотропин" },
    'Реакция Вассермана (RW)': { UZB: "Vasserman reaksiyasi (RW)", RUS: "Реакция Вассермана (RW)", ENG: "Wassermann Reaction (RW)", TUR: "Wassermann Reaksiyonu (RW)", KGZ: "Вассерман реакциясы (RW)" },
    'Brucella abortus': { UZB: "Brutsellyoz (Brucella abortus)", RUS: "Бруцеллез (Brucella abortus)", ENG: "Brucella Abortus", TUR: "Brusella (Brucella abortus)", KGZ: "Бруцеллез (Brucella abortus)" },
    'Тропонин': { UZB: "Troponin", RUS: "Тропонин", ENG: "Troponin", TUR: "Troponin", KGZ: "Тропонин" },
    'Экспресс SARS-Cov-2 Ig M / Ig G': { UZB: "Ekspress SARS-Cov-2 Ig M / Ig G", RUS: "Экспресс SARS-Cov-2 Ig M / Ig G", ENG: "Express SARS-Cov-2 IgM / IgG", TUR: "Ekspres SARS-Cov-2 IgM / IgG", KGZ: "Экспресс SARS-Cov-2 Ig M / Ig G" },
    'Глюкоза натощак': { UZB: "Och qoringa glyukoza", RUS: "Глюкоза натощак", ENG: "Fasting Glucose", TUR: "Açlık Glikozu", KGZ: "Ач карындагы глюкоза" },
    'Глюкоза через 1 час после нагрузки': { UZB: "Yuklamadan 1 soat keyingi glyukoza", RUS: "Глюкоза через 1 час после нагрузки", ENG: "Glucose 1h post-load", TUR: "Yükлеmeden 1 Saat Sonra Glikoz", KGZ: "Жүктөмдөн 1 сааттан кийинки глюкоза" },
    'Глюкоза через 2 часа после нагрузки': { UZB: "Yuklamadan 2 soat keyingi glyukoza", RUS: "Глюкоза через 2 часа после нагрузки", ENG: "Glucose 2h post-load", TUR: "Yükлеmeden 2 Saat Sonra Glikoz", KGZ: "Жүктөмдөн 2 сааттан кийинки глюкоза" },
    'Общий анализ крови': { UZB: "Umumiy qon tahlili", RUS: "Общий анализ крови", ENG: "Complete Blood Count", TUR: "Tam Kan Sayımı", KGZ: "Жалпы кан анализи" },
    'Лейко формула': { UZB: "Leykoformula", RUS: "Лейкоцитарная формула", ENG: "Leukocyte Formula", TUR: "Lökosit Formülü", KGZ: "Лейкоцитардык формула" },
    'Кортизол': { UZB: "Kortizol", RUS: "Кортизол", ENG: "Cortisol", TUR: "Kortizol", KGZ: "Кортизол" },
    'Прогестерон': { UZB: "Progesteron", RUS: "Прогестерон", ENG: "Progesterone", TUR: "Progesteron", KGZ: "Прогестерон" },
    'Пролактин': { UZB: "Prolaktin", RUS: "Пролактин", ENG: "Prolactin", TUR: "Prolaktin", KGZ: "Prolaktin" },
    'Лютеинизирующий гормон (LH)': { UZB: "Lyuteinlashtiruvchi gormon (LH)", RUS: "Лютеинизирующий гормон (LH)", ENG: "Luteinizing Hormone (LH)", TUR: "Lüteinleştiren Hormon (LH)", KGZ: "Лютеиндештирүүчү гормон (LH)" },
    'Фолликулостимулирующий гормон ФСГ (FSH)': { UZB: "Follikulostimullovchi gormon FSG (FSH)", RUS: "Фолликулостимулирующий гормон ФСГ (FSH)", ENG: "Follicle-Stimulating Hormone (FSH)", TUR: "Follikül Uyarıcı Hormon (FSH)", KGZ: "Фолликуланы стимулдаштыруучу гормон (FSH)" },
    'Эстрадиол Е2 (Эстроген)': { UZB: "Estradiol E2 (Estrogen)", RUS: "Эстрадиол Е2 (Эстроген)", ENG: "Estradiol E2 (Estradiol)", TUR: "Östradiol E2 (Östrojen)", KGZ: "Эстрадиол Е2 (Эстроген)" },
    'Эстриол Е3 (Эстроген)': { UZB: "Estriol E3 (Estrogen)", RUS: "Эстриол Е3 (Эстроген)", ENG: "Estriol E3 (Estriol)", TUR: "Östriol E3 (Östrojen)", KGZ: "Эстриол Е3 (Эстроген)" },
    'Соматотропный гормон СТГ (GH)': { UZB: "Somatotrop gormon STG (GH)", RUS: "Соматотропный гормон СТГ (GH)", ENG: "Growth Hormone (GH)", TUR: "Büyüme Hormonu (STH/GH)", KGZ: "Соматотроптук гормон (STH/GH)" },
    'Трансферрин': { UZB: "Transferrin", RUS: "Трансферрин", ENG: "Transferrin", TUR: "Transferrin", KGZ: "Трансферрин" },
    'Тиреотропный гормон ТТГ': { UZB: "Tireotrop gormon TTG", RUS: "Тиреотропный гормон ТТГ", ENG: "Thyroid-Stimulating Hormone (TSH)", TUR: "Tiroid Uyarıcı Hormon (TSH)", KGZ: "Тиреотроптук гормон (ТТГ)" },
    'Антитела к рецепторам ТТГ (анти-рТТГ)': { UZB: "TTG retseptorlariga antitellar (anti-rTTG)", RUS: "Антитела к рецепторам ТТГ (анти-рТТГ)", ENG: "Anti-TSH Receptor Antibodies", TUR: "TSH Reseptör Antikorları", KGZ: "ТТГ рецепторлоруна антителолор" },
    'Трийодтиронин свободный Т3 св': { UZB: "Erkin triyodtironin T3 erkin", RUS: "Трийодтиронин свободный Т3 св", ENG: "Free Triiodothyronine (Free T3)", TUR: "Serbest T3 (sT3)", KGZ: "Эркин трийодтиронин (Т3 эркин)" },
    'Тироксин свободный Т4 св': { UZB: "Erkin tiroksin T4 erkin", RUS: "Тироксин свободный Т4 св", ENG: "Free Thyroxine (Free T4)", TUR: "Serbest T4 (sT4)", KGZ: "Эркин тироксин (Т4 эркин)" },
    'Трийодтиронин общий Т3': { UZB: "Umumiy triyodtironin T3", RUS: "Трийодтиронин общий Т3", ENG: "Total Triiodothyronine (Total T3)", TUR: "Total T3", KGZ: "Жалпы трийодтиронин Т3" },
    'Тироксин общий Т4': { UZB: "Umumiy tiroksin T4", RUS: "Тироксин общий Т4", ENG: "Total Thyroxine (Total T4)", TUR: "Total T4", KGZ: "Жалпы тироксин Т4" },
    'Тестостерон': { UZB: "Testosteron", RUS: "Тестостерон", ENG: "Testosterone", TUR: "Testosteron", KGZ: "Тестостерон" },
    'Свободный тестостерон': { UZB: "Erkin testosteron", RUS: "Свободный тестостерон", ENG: "Free Testosterone", TUR: "Serbest Testosteron", KGZ: "Эркин тестостерон" },
    'Дегидроэпиандростерона Сульфат [DHEA-S]': { UZB: "Degidroepiandrosteron Sulfat [DHEA-S]", RUS: "Дегидроэпиандростерона Сульфат [DHEA-S]", ENG: "DHEA-S", TUR: "DHEA-S", KGZ: "Дегидроэпиандростерон Сульфат [DHEA-S]" },
    'Инсулин': { UZB: "Insulin", RUS: "Инсулин", ENG: "Insulin", TUR: "İnsülin", KGZ: "Инсулин" },
    'Инсулиноподобный фактор роста [ИФР]': { UZB: "Insulinga o'xshash o'sish omili [IFR]", RUS: "Инсулиноподобный фактор роста [ИФР]", ENG: "Insulin-like Growth Factor [IGF]", TUR: "İnsülin Benzeri Büyüme Faktörü [IGF]", KGZ: "Инсулин сыяктуу өсүү фактору [ИФР]" },
    'Хорионический гонадотропин (HCG/B-HCG)': { UZB: "Xorionik gonadotrop (HCG/B-HCG)", RUS: "Хорионический гонадотропин (HCG/B-HCG)", ENG: "hCG / Beta-hCG", TUR: "Beta-hCG", KGZ: "Хорионикалык гонадотропин (HCG/B-HCG)" },
    '17-Оксипрогестерон': { UZB: "17-Oksiprogesteron", RUS: "17-Оксипрогестерон", ENG: "17-Hydroxyprogesterone", TUR: "17-OH Progesteron", KGZ: "17-Оксипрогестерон" },
    'Антитела к тиреоглобулину (АТ-ТГ)': { UZB: "Tireoglobulin antitellari (AT-TG)", RUS: "Антитела к тиреоглобулину (АТ-ТГ)", ENG: "Anti-Thyroglobulin Antibodies", TUR: "Anti-Tiroglobulin Antikorları", KGZ: "Тиреоглобулинге антителолор (АТ-ТГ)" },
    'Антитела к ТиреоПероксидазе (АТ-ТПО)': { UZB: "Tireoperoksidaza antitellari (AT-TPO)", RUS: "Антитела к ТиреоПероксидазе (АТ-ТПО)", ENG: "Anti-TPO Antibodies", TUR: "Anti-TPO Antikorları", KGZ: "ТиреоПероксидазага антителолор (АТ-ТПО)" },
    'Ферритин': { UZB: "Ferritin", RUS: "Ферритин", ENG: "Ferritin", TUR: "Ferritin", KGZ: "Ферритин" },
    'С-пептид': { UZB: "S-peptid", RUS: "С-пептид", ENG: "C-Peptide", TUR: "C-Peptid", KGZ: "С-пептид" },
    'Адренокортикотропный гормон АККТГ (ACTH)': { UZB: "Adrenokortikotrop gormon AKTG (ACTH)", RUS: "Адренокортикотропный гормон АККТГ (ACTH)", ENG: "ACTH", TUR: "ACTH", KGZ: "АКТГ (ACTH)" },
    'Мозговой натрийуретический пропептид (NT-proBNP)': { UZB: "Miya natriyuretik propeptidi (NT-proBNP)", RUS: "Мозговой натрийуретический пропептид (NT-proBNP)", ENG: "NT-proBNP", TUR: "NT-proBNP", KGZ: "NT-proBNP" },
    'Паратиреоидный гормон (PTH)': { UZB: "Paratireoid gormon (PTH)", RUS: "Паратиреоидный гормон (PTH)", ENG: "Parathyroid Hormone (PTH)", TUR: "Paratormon (PTH)", KGZ: "Паратиреоиддик гормон (PTH)" },
    'Тиреоглобулин': { UZB: "Tireoglobulin", RUS: "Тиреоглобулин", ENG: "Thyroglobulin", TUR: "Tiroglobulin", KGZ: "Тиреоглобулин" },
    'Кальцитонин': { UZB: "Kaltsitonin", RUS: "Кальцитонин", ENG: "Calcitonin", TUR: "Kalsitonin", KGZ: "Кальцитонин" },
    'Антимюллеров гормон (АМГ)': { UZB: "Antimyuller gormoni (AMG)", RUS: "Антимюллеров гормон (АМГ)", ENG: "Anti-Müllerian Hormone (AMH)", TUR: "Anti-Müllerian Hormon (AMH)", KGZ: "Антимюллеров гормону (АМГ)" },
    'Глобулин связывающий половые гормоны': { UZB: "Jinsiy gormonlarni bog'lovchi globulin (SHBG)", RUS: "Глобулин связывающий половые гормоны (ГСПГ)", ENG: "SHBG", TUR: "SHBG", KGZ: "Жыныстык гормондорду байланыштыруучу глобулин" },
    'Ингибин В': { UZB: "Ingibin B", RUS: "Ингибин В", ENG: "Inhibin B", TUR: "İnhibin B", KGZ: "Ингибин В" },
    'Витамин В12': { UZB: "Vitamin B12", RUS: "Витамин В12", ENG: "Vitamin B12", TUR: "B12 Vitamini", KGZ: "Витамин В12" },
    'Фолиевая кислота': { UZB: "Foliya kislotasi", RUS: "Фолиевая кислота", ENG: "Folic Acid", TUR: "Folik Asit", KGZ: "Фолий кислотасы" },
    'Кортизол в моче': { UZB: "Peshobdagi kortizol", RUS: "Кортизол в моче", ENG: "Urine Cortisol", TUR: "İdrarda Kortizol", KGZ: "Зараптагы кортизол" },
    'Норадреналин (кровь)': { UZB: "Noradrenalin (qon)", RUS: "Норадреналин (кровь)", ENG: "Norepinephrine (blood)", TUR: "Noradrenalin (kan)", KGZ: "Норадреналин (кан)" },
    'Индекс НОМА (инсулин*глюкоза/22,5)': { UZB: "NOMA indeksi (insulin*glyukoza/22,5)", RUS: "Индекс НОМА (инсулин*глюкоза/22,5)", ENG: "HOMA Index", TUR: "HOMA Endeksi", KGZ: "НОМА индекси" },
    'Гомоцистеин': { UZB: "Gomotsistein", RUS: "Гомоцистеин", ENG: "Homocysteine", TUR: "Homosistein", KGZ: "Гомоцистеин" },
    'D-димер': { UZB: "D-dimer", RUS: "D-димер", ENG: "D-Dimer", TUR: "D-Dimer", KGZ: "D-димер" },
    'Интерлейкин-6': { UZB: "Interleykin-6", RUS: "Интерлейкин-6", ENG: "Interleukin-6", TUR: "İnterlökin-6", KGZ: "Интерлейкин-6" },
    'Прокальцитонин': { UZB: "Prokaltsitonin", RUS: "Прокальцитонин", ENG: "Procalcitonin", TUR: "Prokalsitonin", KGZ: "Прокальцитонин" },
    'Адреналин (кровь)': { UZB: "Adrenalin (qon)", RUS: "Адреналин (кровь)", ENG: "Epinephrine (blood)", TUR: "Adrenalin (kan)", KGZ: "Адреналин (кан)" },
    'Vitamin D - 25 OH (Витамин Д )': { UZB: "Vitamin D - 25 OH (Vitamin D)", RUS: "Витамин D - 25 OH (Витамин Д)", ENG: "Vitamin D - 25 OH", TUR: "D Vitamini (25-OH)", KGZ: "Витамин D - 25 OH" },
    'Такралимус': { UZB: "Takrolimus", RUS: "Такролимус", ENG: "Tacrolimus", TUR: "Takrolimus", KGZ: "Такролимус" },
    'Anti-GAD (анти-Глутаматдекарбоксилаза)': { UZB: "Anti-GAD (anti-Glutamatdekarboksilaza)", RUS: "Anti-GAD (анти-Глутаматдекарбоксилаза)", ENG: "Anti-GAD", TUR: "Anti-GAD", KGZ: "Anti-GAD" },
    'Anti-IA2 (Антитела к тирозинфосфатаза)': { UZB: "Anti-IA2 (Tirozinfosfataza antitellari)", RUS: "Anti-IA2 (Антитела к тирозинфосфатазе)", ENG: "Anti-IA2", TUR: "Anti-IA2", KGZ: "Anti-IA2" },
    'Витамин А (ретинол)': { UZB: "Vitamin A (retinol)", RUS: "Витамин А (ретинол)", ENG: "Vitamin A (retinol)", TUR: "A Vitamini (Retinol)", KGZ: "Витамин А (ретинол)" },
    'Цистатин С': { UZB: "Tsistatin S", RUS: "Цистатин С", ENG: "Cystatin C", TUR: "Sistatin C", KGZ: "Цистатин С" },
    'Альдостерон': { UZB: "Aldosteron", RUS: "Альдостерон", ENG: "Aldosterone", TUR: "Aldosteron", KGZ: "Альдостерон" },
    'Ренин': { UZB: "Renin", RUS: "Ренин", ENG: "Renin", TUR: "Renin", KGZ: "Ренин" },
    'АФР Альфа - фетопротеин (АФП)': { UZB: "Alfa-fetoprotein (AFP)", RUS: "Альфа-фетопротеин (АФП)", ENG: "Alpha-Fetoprotein (AFP)", TUR: "Alfa-Fetoprotein (AFP)", KGZ: "Альфа-фетопротеин (АФП)" },
    'СЕА Раково-эмбриональный антиген (РЭА )': { UZB: "Rak-embrional antigen (CEA/REA)", RUS: "Раково-эмбриональный антиген (РЭА)", ENG: "Carcinoembryonic Antigen (CEA)", TUR: "Karsinoembriyonik Antijen (CEA)", KGZ: "Раково-эмбрионалдык антиген (РЭА)" },
    'PSA Простатспецифический антиген общий (ПСА)': { UZB: "Prostatspetsifik antigen umumiy (PSA)", RUS: "Простатспецифический антиген общий (ПСА)", ENG: "PSA Total", TUR: "Total PSA", KGZ: "Простата-спецификалык антиген жалпы (ПСА)" },
    'fPSA Простатспецифический антиген свободный (с ПСА)': { UZB: "Prostatspetsifik antigen erkin (fPSA)", RUS: "Простатспецифический антиген свободный (с ПСА)", ENG: "Free PSA", TUR: "Serbest PSA (fPSA)", KGZ: "Простата-спецификалык антиген эркин (fPSA)" },
    'Углеводный антиген СА 15-3': { UZB: "Uglevod antigeni CA 15-3", RUS: "Углеводный антиген СА 15-3", ENG: "Carbohydrate Antigen CA 15-3", TUR: "Karbonhidrat Antijeni CA 15-3", KGZ: "Углеводдук антиген СА 15-3" },
    'Углеводный антиген СА 19-9': { UZB: "Uglevod antigeni CA 19-9", RUS: "Углеводный антиген СА 19-9", ENG: "Carbohydrate Antigen CA 19-9", TUR: "Karbonhidrat Antijeni CA 19-9", KGZ: "Углеводдук антиген СА 19-9" },
    'Углеводный антиген СА 125': { UZB: "Uglevod antigeni CA 125", RUS: "Углеводный антиген СА 125", ENG: "Carbohydrate Antigen CA 125", TUR: "Karbonhidrat Antijeni CA 125", KGZ: "Углеводдук антиген СА 125" },
    'Углеводный антиген СА 72-4': { UZB: "Uglevod antigeni CA 72-4", RUS: "Углеводный антиген СА 72-4", ENG: "Carbohydrate Antigen CA 72-4", TUR: "Karbonhidrat Antijeni CA 72-4", KGZ: "Углеводдук антиген СА 72-4" },
    'Нейронспецифическая энолаза (NSE)': { UZB: "Neyronspetsifik enolaza (NSE)", RUS: "Нейронспецифическая энолаза (NSE)", ENG: "Neuron-Specific Enolase (NSE)", TUR: "Nöron Spesifik Enolaz (NSE)", KGZ: "Нейрон-спецификалык энолаза (NSE)" },
    'S-100 онкомаркер меланомы': { UZB: "S-100 melanoma onkomarkeri", RUS: "S-100 онкомаркер меланомы", ENG: "S-100 Melanoma Marker", TUR: "S-100 Melanom Markörü", KGZ: "S-100 меланома онкомаркери" },
    'Онкомаркёр рака яичников HE4': { UZB: "Tuxumdon saratoni onkomarkeri HE4", RUS: "Онкомаркёр рака яичников HE4", ENG: "Ovarian Cancer Marker HE4", TUR: "Yumurtalık Kanseri Markörü HE4", KGZ: "Жумуртка бези рагынын онкомаркери HE4" },
    'Антиген плоскоклеточной карциномы (SCC Ag)': { UZB: "Yassi hujayrali kartsinoma antigeni (SCC)", RUS: "Антиген плоскоклеточной карциномы (SCC)", ENG: "Squamous Cell Carcinoma Antigen (SCC)", TUR: "Yassı Hücreli Karsinom Antijeni (SCC)", KGZ: "Жалпак клеткалуу карцинома антигени (SCC)" },
    'Индекс Рома (HE4+CA125 )': { UZB: "ROMA indeksi (HE4+CA125)", RUS: "Индекс Рома (HE4+CA125)", ENG: "ROMA Index (HE4+CA125)", TUR: "ROMA Endeksi (HE4+CA125)", KGZ: "ROMA индекси (HE4+CA125)" },
    'Иммуноглобулин Е': { UZB: "Immunoglobulin E (IgE)", RUS: "Иммуноглобулин Е (IgE)", ENG: "Immunoglobulin E (IgE)", TUR: "İmmünoglobulin E (IgE)", KGZ: "Иммуноглобулин Е (IgE)" },
    'Иммуноглобулин G (IgG)': { UZB: "Immunoglobulin G (IgG)", RUS: "Иммуноглобулин G (IgG)", ENG: "Immunoglobulin G (IgG)", TUR: "İmmünoglobulin G (IgG)", KGZ: "Иммуноглобулин G (IgG)" },
    'Troponin I': { UZB: "Troponin I", RUS: "Тропонин I", ENG: "Troponin I", TUR: "Troponin I", KGZ: "Тропонин I" },
    'Лямблии суммарные': { UZB: "Lyambliyalar (jami)", RUS: "Лямблии суммарные", ENG: "Giardia Total", TUR: "Giardia Toplam", KGZ: "Лямблиялар жалпы" },
    'Лямблии IgG': { UZB: "Lyambliyalar IgG", RUS: "Лямблии IgG", ENG: "Giardia IgG", TUR: "Giardia IgG", KGZ: "Лямблиялар IgG" },
    'Лямблии IgM': { UZB: "Lyambliyalar IgM", RUS: "Лямблии IgM", ENG: "Giardia IgM", TUR: "Giardia IgM", KGZ: "Лямблиялар IgM" },
    'Аскарида IgG': { UZB: "Askarida IgG", RUS: "Аскарида IgG", ENG: "Ascaris IgG", TUR: "Ascaris IgG", KGZ: "Аскарида IgG" },
    'Эхинококкоз IgG': { UZB: "Exinokokkoz IgG", RUS: "Эхинококкоз IgG", ENG: "Echinococcus IgG", TUR: "Ekinokok IgG", KGZ: "Эхинококкоз IgG" },
    'Трихинелла IgG': { UZB: "Trixinella IgG", RUS: "Трихинелла IgG", ENG: "Trichinella IgG", TUR: "Trişinella IgG", KGZ: "Трихинелла IgG" },
    'HAV IgM (Гепатит А)': { UZB: "HAV IgM (Gepatit A)", RUS: "HAV IgM (Гепатит А)", ENG: "HAV IgM (Hepatitis A)", TUR: "HAV IgM (Hepatit A)", KGZ: "HAV IgM (Гепатит А)" },
    'HAV IgG (Гепатит А)': { UZB: "HAV IgG (Gepatit A)", RUS: "HAV IgG (Гепатит А)", ENG: "HAV IgG (Hepatitis A)", TUR: "HAV IgG (Hepatit A)", KGZ: "HAV IgG (Гепатит А)" },
    'HBsAg (Гепатит В)': { UZB: "HBsAg (Gepatit B)", RUS: "HBsAg (Гепатит В)", ENG: "HBsAg (Hepatitis B)", TUR: "HBsAg (Hepatit B)", KGZ: "HBsAg (Гепатит В)" },
    'HCV Ab (Гепатит С)': { UZB: "HCV Ab (Gepatit C)", RUS: "HCV Ab (Гепатит С)", ENG: "HCV Ab (Hepatitis C)", TUR: "HCV Ab (Hepatit C)", KGZ: "HCV Ab (Гепатит С)" },
    'HDV - Ab (Гепатит D)': { UZB: "HDV - Ab (Gepatit D)", RUS: "HDV - Ab (Гепатит D)", ENG: "HDV Ab (Hepatitis D)", TUR: "HDV Ab (Hepatit D)", KGZ: "HDV Ab (Гепатит D)" },
    'HBsAg количественный': { UZB: "HBsAg miqdoriy", RUS: "HBsAg количественный", ENG: "HBsAg Quantitative", TUR: "Kantitatif HBsAg", KGZ: "HBsAg сандык" },
    'Общий белок': { UZB: "Umumiy oqsil", RUS: "Общий белок", ENG: "Total Protein", TUR: "Total Protein", KGZ: "Жалпы белок" },
    'Альбумин': { UZB: "Albumin", RUS: "Альбумин", ENG: "Albumin", TUR: "Albumin", KGZ: "Альбумин" },
    'Аланинаминотрансфераза (АЛТ)': { UZB: "Alaninaminotransferaza (ALT)", RUS: "Аланинаминотрансфераза (АЛТ)", ENG: "ALT", TUR: "ALT (Alanin Aminotransferaz)", KGZ: "Аланинаминотрансфераза (АЛТ)" },
    'Аспартатаминотрансфераза (АСТ)': { UZB: "Aspartataminotransferaza (AST)", RUS: "Аспартатаминотрансфераза (АСТ)", ENG: "AST", TUR: "AST (Aspartat Aminotransferaz)", KGZ: "Аспартатаминотрансфераза (АСТ)" },
    'Мочевина': { UZB: "Mochevina", RUS: "Мочевина", ENG: "Urea", TUR: "Üre", KGZ: "Мочевина" },
    'Креатинин': { UZB: "Kreatinin", RUS: "Креатинин", ENG: "Creatinine", TUR: "Creatinine", KGZ: "Креатинин" },
    'Мочевая кислота': { UZB: "Moch kislotasi", RUS: "Мочевая кислота", ENG: "Uric Acid", TUR: "Ürik Asit", KGZ: "Зарап кислотасы" },
    'Щелочная фосфатаза': { UZB: "Ishqoriy fosfataza", RUS: "Щелочная фосфатаза", ENG: "Alkaline Phosphatase", TUR: "Alkalen Fosfataz (ALP)", KGZ: "Шелочтук фосфатаза" },
    'С-реактивный белок': { UZB: "S-reaktiv oqsil (SRB)", RUS: "С-реактивный белок (СРБ)", ENG: "C-Reactive Protein (CRP)", TUR: "C-Reaktif Protein (CRP)", KGZ: "С-реактивдүү белок (СРБ)" },
    'Общий билирубин': { UZB: "Umumiy bilirubin", RUS: "Общий билирубин", ENG: "Total Bilirubin", TUR: "Total Bilirubin", KGZ: "Жалпы билирубин" },
    'Прямой билирубин': { UZB: "To'g'ri bilirubin", RUS: "Прямой билирубин", ENG: "Direct Bilirubin", TUR: "Direkt Bilirubin", KGZ: "Түз билирубин" },
    'Калий': { UZB: "Kaliy (K)", RUS: "Калий (K)", ENG: "Potassium (K)", TUR: "Potasyum (K)", KGZ: "Калий (K)" },
    'Натрий': { UZB: "Natriy (Na)", RUS: "Натрий (Na)", ENG: "Sodium (Na)", TUR: "Sodyum (Na)", KGZ: "Натрий (Na)" },
    'Хлор': { UZB: "Xlor (Cl)", RUS: "Хлор (Cl)", ENG: "Chloride (Cl)", TUR: "Klor (Cl)", KGZ: "Хлор (Cl)" },
    'Кальций общий': { UZB: "Umumiy kaltsiy", RUS: "Кальций общий", ENG: "Total Calcium", TUR: "Total Kalsiyum", KGZ: "Жалпы кальций" },
    'Фосфор': { UZB: "Fosfor", RUS: "Фосфор", ENG: "Phosphorus", TUR: "Fosfor", KGZ: "Фосфор" },
    'Магний': { UZB: "Magniy", RUS: "Магний", ENG: "Magnesium", TUR: "Magnezyum", KGZ: "Магний" },
    'Копрология': { UZB: "Koprologiya", RUS: "Копрология", ENG: "Coprology", TUR: "Koproloji (Gaita Tahlili)", KGZ: "Копрология" },
    'Кал на яйца глист': { UZB: "Glist tuxumlariga najas", RUS: "Кал на яйца глист", ENG: "Stool for Helminth Eggs", TUR: "Gaitada Parazit Yumurtası", KGZ: "Заңдагы мите жумурткалары" },
    'Спермограмма': { UZB: "Spermogramma", RUS: "Спермограмма", ENG: "Spermogram", TUR: "Spermiogram", KGZ: "Спермограмма" }
  };

  if (testMap[tStr]) {
    return testMap[tStr][lang] || testMap[tStr].UZB;
  }

  for (const [key, val] of Object.entries(testMap)) {
    if (tStr.toLowerCase() === key.toLowerCase()) {
      return val[lang] || val.UZB;
    }
  }

  return testName;
};
