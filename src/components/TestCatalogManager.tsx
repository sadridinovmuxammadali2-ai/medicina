import React, { useState, useMemo } from 'react';
import type { TestCatalogItem, IndividualTestItem } from '../types/lab';
import { Search, Plus, Trash2, Edit3, X, Save, Layers, DollarSign, FolderPlus, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { FullCKEditorToolbar } from './FullCKEditorToolbar';
import { useLanguage } from '../context/LanguageContext';
import { translateCategoryName, translateSubGroupTitle, translateTestName } from '../utils/categoryTranslator';

interface TestCatalogManagerProps {
  testCatalog: TestCatalogItem[];
  onAddTestCatalog: (newCatalogItem: TestCatalogItem) => void;
  onUpdateTestCatalog: (updatedCatalog: TestCatalogItem[]) => void;
  onDeleteTestCatalog: (id: string) => void;
}

export const TestCatalogManager: React.FC<TestCatalogManagerProps> = React.memo(({
  testCatalog,
  onAddTestCatalog,
  onUpdateTestCatalog,
  onDeleteTestCatalog
}) => {
  const { currentLanguage } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubGroup, setSelectedSubGroup] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [subGroupSearchTerm, setSubGroupSearchTerm] = useState('');
  
  // Modal Edit state
  const [editingItem, setEditingItem] = useState<{
    catId: string;
    subGroupId: string;
    item: IndividualTestItem;
  } | null>(null);

  // Modal Add state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTestCategory, setNewTestCategory] = useState('ГОРМОНЫ');
  const [newSubGroupTitle, setNewSubGroupTitle] = useState('ГОРМОНЫ');
  const [newTestName, setNewTestName] = useState('');
  const [newTestPrice, setNewTestPrice] = useState(90000);
  const [newTestUnit, setNewTestUnit] = useState('нмоль/л');
  const [newRefMin, setNewRefMin] = useState(0);
  const [newRefMax, setNewRefMax] = useState(100);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editUnit, setEditUnit] = useState('');
  const [editRefMin, setEditRefMin] = useState(0);
  const [editRefMax, setEditRefMax] = useState(0);

  // OAM Blank Template Editor Modal State
  const [isOAMModalOpen, setIsOAMModalOpen] = useState(false);
  const [oamTemplateTitle, setOamTemplateTitle] = useState('Общий анализ мочи (ОАМ)');
  const [oamParams, setOamParams] = useState<Array<{ id: string; name: string; unit: string; norm: string; group: string }>>([
    { id: '1', name: 'Количество', unit: 'мл', norm: '100 - 200 мл', group: 'Физико-химические свойства' },
    { id: '2', name: 'Цвет', unit: '-', norm: 'соломенно-желтый', group: 'Физико-химические свойства' },
    { id: '3', name: 'Прозрачность', unit: '-', norm: 'прозрачная', group: 'Физико-химические свойства' },
    { id: '4', name: 'Относительная плотность', unit: 'г/л', norm: '1010 - 1025', group: 'Физико-химические свойства' },
    { id: '5', name: 'pH', unit: '-', norm: '4.8 - 7.5 (слабокислая)', group: 'Физико-химические свойства' },
    { id: '6', name: 'Белок', unit: 'г/л', norm: 'не обнаружено (< 0.033)', group: 'Химическое исследование' },
    { id: '7', name: 'Глюкоза', unit: 'ммоль/л', norm: 'не обнаружено', group: 'Химическое исследование' },
    { id: '8', name: 'Билирубин', unit: '-', norm: 'отрицательный', group: 'Химическое исследование' },
    { id: '9', name: 'Уробилиноген', unit: 'мкмоль/л', norm: 'в норме (5 - 10)', group: 'Химическое исследование' },
    { id: '10', name: 'Кетоновые тела', unit: 'ммоль/л', norm: 'отрицательный', group: 'Химическое исследование' },
    { id: '11', name: 'Нитриты', unit: '-', norm: 'отрицательный', group: 'Химическое исследование' },
    { id: '12', name: 'Плоский эпителий', unit: 'в п/з', norm: '0 - 3 в п/з', group: 'Микроскопия осадка' },
    { id: '13', name: 'Лейкоциты', unit: 'в п/з', norm: '0 - 5 (муж) / 0 - 6 (жен)', group: 'Микроскопия осадка' },
    { id: '14', name: 'Эритроциты', unit: 'в п/з', norm: '0 - 2 в п/з', group: 'Микроскопия осадка' },
    { id: '15', name: 'Цилиндры гиалиновые', unit: 'в п/з', norm: 'единичные или отсутствуют', group: 'Микроскопия осадка' },
    { id: '16', name: 'Слизь', unit: '-', norm: 'незначительное количество', group: 'Микроскопия осадка' },
    { id: '17', name: 'Соли (Оксалаты / Ураты)', unit: '-', norm: 'не обнаружены', group: 'Микроскопия осадка' },
    { id: '18', name: 'Бактерии', unit: '-', norm: 'отсутствуют', group: 'Микроскопия осадка' }
  ]);

  // OAK (Общий анализ крови) Blank Template Editor Modal State
  const [isOAKModalOpen, setIsOAKModalOpen] = useState(false);
  const [oakTemplateTitle, setOakTemplateTitle] = useState('Общий анализ крови (ОАК)');
  const [oakParams, setOakParams] = useState<Array<{ id: string; name: string; unit: string; norm: string; group: string }>>([
    { id: '1', name: 'Гемоглобин (HGB)', unit: 'г/л', norm: '120 - 160 (жен) / 130 - 170 (муж)', group: 'Эритроцитарные показатели' },
    { id: '2', name: 'Эритроциты (RBC)', unit: '10^12/л', norm: '3.8 - 5.0 (жен) / 4.0 - 5.5 (муж)', group: 'Эритроцитарные показатели' },
    { id: '3', name: 'Цветовой показатель', unit: '-', norm: '0.85 - 1.05', group: 'Эритроцитарные показатели' },
    { id: '4', name: 'Гематокрит (HCT)', unit: '%', norm: '35 - 45 (жен) / 40 - 50 (муж)', group: 'Эритроцитарные показатели' },
    { id: '5', name: 'Средний объем эритроцита (MCV)', unit: 'фл', norm: '80 - 100', group: 'Эритроцитарные показатели' },
    { id: '6', name: 'Среднее содержание HGB в эритроците (MCH)', unit: 'пг', norm: '27 - 34', group: 'Эритроцитарные показатели' },
    { id: '7', name: 'Тромбоциты (PLT)', unit: '10^9/л', norm: '150 - 400', group: 'Тромбоцитарные показатели' },
    { id: '8', name: 'Лейкоциты (WBC)', unit: '10^9/л', norm: '4.0 - 9.0', group: 'Лейкоцитарные показатели' },
    { id: '9', name: 'СОЭ (Скорость оседания эритроцитов)', unit: 'мм/ч', norm: '2 - 15 (жен) / 2 - 10 (муж)', group: 'Общие показатели' }
  ]);

  // Leukoformula (Лейкоцитарная формула) Blank Template Editor Modal State
  const [isLeukoModalOpen, setIsLeukoModalOpen] = useState(false);
  const [leukoTemplateTitle, setLeukoTemplateTitle] = useState('Лейкоцитарная формула (Лейко формула)');
  const [leukoParams, setLeukoParams] = useState<Array<{ id: string; name: string; unit: string; norm: string; group: string }>>([
    { id: '1', name: 'Миелоциты', unit: '%', norm: '0 (не обнаружено)', group: 'Гранулоциты' },
    { id: '2', name: 'Метамиелоциты (юные)', unit: '%', norm: '0 (не обнаружено)', group: 'Гранулоциты' },
    { id: '3', name: 'Палочкоядерные нейтрофилы', unit: '%', norm: '1 - 6 %', group: 'Гранулоциты' },
    { id: '4', name: 'Сегментоядерные нейтрофилы', unit: '%', norm: '47 - 72 %', group: 'Гранулоциты' },
    { id: '5', name: 'Эозинофилы', unit: '%', norm: '0.5 - 5.0 %', group: 'Гранулоциты' },
    { id: '6', name: 'Базофилы', unit: '%', norm: '0 - 1.0 %', group: 'Гранулоциты' },
    { id: '7', name: 'Лимфоциты', unit: '%', norm: '19 - 37 %', group: 'Агранулоциты' },
    { id: '8', name: 'Моноциты', unit: '%', norm: '3 - 11 %', group: 'Агранулоциты' },
    { id: '9', name: 'Плазматические клетки', unit: '%', norm: '0 (единичные)', group: 'Агранулоциты' }
  ]);

  // Custom Table Builder (Maxsus Jadval Tuzuvchi) Modal State
  const [isCustomTableModalOpen, setIsCustomTableModalOpen] = useState(false);
  const [customTemplateTitle, setCustomTemplateTitle] = useState('Maxsus Laboratoriya Jadval Blanka Shabloni');
  const [customParams, setCustomParams] = useState<Array<{ id: string; name: string; unit: string; norm: string; group: string }>>([
    { id: '1', name: 'Ko\'rsatkich №1', unit: 'ед.', norm: 'в норме (0 - 100)', group: 'Asosiy guruh' },
    { id: '2', name: 'Ko\'rsatkich №2', unit: 'мг/дл', norm: '10 - 50', group: 'Asosiy guruh' },
    { id: '3', name: 'Ko\'rsatkich №3', unit: '%', norm: '90 - 100 %', group: 'Qo\'shimcha guruh' }
  ]);

  // Dynamic Table Custom Columns State with Renamable Headers & Inputs
  const [tableCustomColumns, setTableCustomColumns] = useState<Array<{ id: string; headerTitle: string }>>([
    { id: 'col-1', headerTitle: 'QO\'SHIMCHA IZOH / METOD' }
  ]);

  const addCustomColumn = () => {
    const newColId = `col-${Date.now()}`;
    const newColNum = tableCustomColumns.length + 1;
    setTableCustomColumns([
      ...tableCustomColumns,
      { id: newColId, headerTitle: `QO'SHIMCHA USTUN №${newColNum}` }
    ]);
  };

  const deleteCustomColumn = (colId: string) => {
    setTableCustomColumns(tableCustomColumns.filter(c => c.id !== colId));
  };

  const updateColumnHeaderTitle = (colId: string, newTitle: string) => {
    setTableCustomColumns(tableCustomColumns.map(c => c.id === colId ? { ...c, headerTitle: newTitle } : c));
  };

  // Saved Template Presets database (Pre-loaded with popular lab templates + custom template creation)
  const [templatePresets, setTemplatePresets] = useState<Array<{
    id: string;
    categoryType: 'OAK' | 'OAM' | 'LEUKO' | 'CUSTOM';
    title: string;
    description: string;
    params: Array<{ id: string; name: string; unit: string; norm: string; group: string }>;
  }>>([
    // OAK Presets
    {
      id: 'oak-preset-1',
      categoryType: 'OAK',
      title: 'Общий анализ крови (ОАК - Стандартный)',
      description: 'Стандартный 9-параметрический бланк крови',
      params: [
        { id: '1', name: 'Гемоглобин (HGB)', unit: 'г/л', norm: '120 - 160 (жен) / 130 - 170 (муж)', group: 'Эритроцитарные показатели' },
        { id: '2', name: 'Эритроциты (RBC)', unit: '10^12/л', norm: '3.8 - 5.0 (жен) / 4.0 - 5.5 (муж)', group: 'Эритроцитарные показатели' },
        { id: '3', name: 'Цветовой показатель', unit: '-', norm: '0.85 - 1.05', group: 'Эритроцитарные показатели' },
        { id: '4', name: 'Гематокрит (HCT)', unit: '%', norm: '35 - 45 (жен) / 40 - 50 (муж)', group: 'Эритроцитарные показатели' },
        { id: '5', name: 'Средний объем эритроцита (MCV)', unit: 'фл', norm: '80 - 100', group: 'Эритроцитарные показатели' },
        { id: '6', name: 'Среднее содержание HGB в эритроците (MCH)', unit: 'пг', norm: '27 - 34', group: 'Эритроцитарные показатели' },
        { id: '7', name: 'Тромбоциты (PLT)', unit: '10^9/л', norm: '150 - 400', group: 'Тромбоцитарные показатели' },
        { id: '8', name: 'Лейкоциты (WBC)', unit: '10^9/л', norm: '4.0 - 9.0', group: 'Лейкоцитарные показатели' },
        { id: '9', name: 'СОЭ (Скорость оседания эритроцитов)', unit: 'мм/ч', norm: '2 - 15 (жен) / 2 - 10 (муж)', group: 'Общие показатели' }
      ]
    },
    {
      id: 'oak-preset-2',
      categoryType: 'OAK',
      title: 'Расширенный ОАК с Лейкоформулой (12 показателей)',
      description: 'Полный развернутый гематологический бланк',
      params: [
        { id: '1', name: 'Гемоглобин (HGB)', unit: 'г/л', norm: '120 - 160', group: 'Эритроцитарные показатели' },
        { id: '2', name: 'Эритроциты (RBC)', unit: '10^12/л', norm: '3.8 - 5.5', group: 'Эритроцитарные показатели' },
        { id: '3', name: 'Цветовой показатель', unit: '-', norm: '0.85 - 1.05', group: 'Эритроцитарные показатели' },
        { id: '4', name: 'Гематокрит (HCT)', unit: '%', norm: '35 - 50', group: 'Эритроцитарные показатели' },
        { id: '5', name: 'Тромбоциты (PLT)', unit: '10^9/л', norm: '150 - 400', group: 'Тромбоцитарные показатели' },
        { id: '6', name: 'Лейкоциты (WBC)', unit: '10^9/л', norm: '4.0 - 9.0', group: 'Лейкоцитарные показатели' },
        { id: '7', name: 'Палочкоядерные нейтрофилы', unit: '%', norm: '1 - 6 %', group: 'Лейкоцитарная формула' },
        { id: '8', name: 'Сегментоядерные нейтрофилы', unit: '%', norm: '47 - 72 %', group: 'Лейкоцитарная формула' },
        { id: '9', name: 'Эозинофилы', unit: '%', norm: '0.5 - 5.0 %', group: 'Лейкоцитарная формула' },
        { id: '10', name: 'Лимфоциты', unit: '%', norm: '19 - 37 %', group: 'Лейкоцитарная формула' },
        { id: '11', name: 'Моноциты', unit: '%', norm: '3 - 11 %', group: 'Лейкоцитарная формула' },
        { id: '12', name: 'СОЭ (по Вестергрену)', unit: 'мм/ч', norm: '2 - 20', group: 'Общие показатели' }
      ]
    },
    {
      id: 'oak-preset-3',
      categoryType: 'OAK',
      title: 'Педиатрический ОАК (Детский бланк крови)',
      description: 'Нормы с учетом возраста ребенка',
      params: [
        { id: '1', name: 'Гемоглобин (HGB)', unit: 'г/л', norm: '110 - 145 (дети)', group: 'Эритроцитарные показатели' },
        { id: '2', name: 'Эритроциты (RBC)', unit: '10^12/л', norm: '3.6 - 4.9', group: 'Эритроцитарные показатели' },
        { id: '3', name: 'Лейкоциты (WBC)', unit: '10^9/л', norm: '5.0 - 12.0', group: 'Лейкоцитарные показатели' },
        { id: '4', name: 'Лимфоциты', unit: '%', norm: '30 - 60 %', group: 'Лейкоцитарная формула' },
        { id: '5', name: 'СОЭ', unit: 'мм/ч', norm: '4 - 12', group: 'Общие показатели' }
      ]
    },

    // OAM Presets
    {
      id: 'oam-preset-1',
      categoryType: 'OAM',
      title: 'Общий анализ мочи (ОАМ - Стандартный)',
      description: 'Полный 18-параметрический бланк мочи',
      params: [
        { id: '1', name: 'Количество', unit: 'мл', norm: '100 - 200 мл', group: 'Физико-химические свойства' },
        { id: '2', name: 'Цвет', unit: '-', norm: 'соломенно-желтый', group: 'Физико-химические свойства' },
        { id: '3', name: 'Прозрачность', unit: '-', norm: 'полная', group: 'Физико-химические свойства' },
        { id: '4', name: 'Относительная плотность', unit: 'г/мл', norm: '1015 - 1025', group: 'Физико-химические свойства' },
        { id: '5', name: 'Реакция (pH)', unit: '-', norm: 'кислая (5.0 - 7.0)', group: 'Физико-химические свойства' },
        { id: '6', name: 'Белок', unit: 'г/л', norm: 'отсутствует (не обн.)', group: 'Химическое исследование' },
        { id: '7', name: 'Глюкоза', unit: 'ммоль/л', norm: 'отсутствует', group: 'Химическое исследование' },
        { id: '8', name: 'Кетоновые тела', unit: '-', norm: 'отсутствуют', group: 'Химическое исследование' },
        { id: '9', name: 'Билирубин', unit: '-', norm: 'отсутствует', group: 'Химическое исследование' },
        { id: '10', name: 'Лейкоциты', unit: 'в п/з', norm: '0 - 5 в п/з', group: 'Микроскопия осадка' },
        { id: '11', name: 'Эритроциты', unit: 'в п/з', norm: '0 - 2 в п/з', group: 'Микроскопия осадка' },
        { id: '12', name: 'Бактерии', unit: '-', norm: 'отсутствуют', group: 'Микроскопия осадка' }
      ]
    },
    {
      id: 'oam-preset-2',
      categoryType: 'OAM',
      title: 'Анализ мочи по Нечипоренко',
      description: 'Количественное исследование осадка мочи',
      params: [
        { id: '1', name: 'Лейкоциты', unit: 'в 1 мл', norm: 'до 2000 в 1 мл', group: 'Количественное исследование' },
        { id: '2', name: 'Эритроциты', unit: 'в 1 мл', norm: 'до 1000 в 1 мл', group: 'Количественное исследование' },
        { id: '3', name: 'Цилиндры гиалиновые', unit: 'в 1 мл', norm: 'до 200 в 1 мл', group: 'Количественное исследование' }
      ]
    },

    // LEUKO Presets
    {
      id: 'leuko-preset-1',
      categoryType: 'LEUKO',
      title: 'Лейкоцитарная формула (Стандартная)',
      description: 'Подсчет лейкоцитарных клеток 100%',
      params: [
        { id: '1', name: 'Миелоциты', unit: '%', norm: '0 (не обнаружено)', group: 'Гранулоциты' },
        { id: '2', name: 'Метамиелоциты (юные)', unit: '%', norm: '0 (не обнаружено)', group: 'Гранулоциты' },
        { id: '3', name: 'Палочкоядерные нейтрофилы', unit: '%', norm: '1 - 6 %', group: 'Гранулоциты' },
        { id: '4', name: 'Сегментоядерные нейтрофилы', unit: '%', norm: '47 - 72 %', group: 'Гранулоциты' },
        { id: '5', name: 'Эозинофилы', unit: '%', norm: '0.5 - 5.0 %', group: 'Гранулоциты' },
        { id: '6', name: 'Базофилы', unit: '%', norm: '0 - 1.0 %', group: 'Гранулоциты' },
        { id: '7', name: 'Лимфоциты', unit: '%', norm: '19 - 37 %', group: 'Агранулоциты' },
        { id: '8', name: 'Моноциты', unit: '%', norm: '3 - 11 %', group: 'Агранулоциты' }
      ]
    },

    // CUSTOM Presets
    {
      id: 'custom-preset-1',
      categoryType: 'CUSTOM',
      title: 'Биохимический профиль (Печеночные пробы)',
      description: 'АЛТ, АСТ, Билирубин, ГГТП, ЩФ',
      params: [
        { id: '1', name: 'АЛТ (Аланинаминотрансфераза)', unit: 'Ед/л', norm: 'до 40 (жен) / до 41 (муж)', group: 'Печеночный профиль' },
        { id: '2', name: 'АСТ (Аспартатаминотрансфераза)', unit: 'Ед/л', norm: 'до 32 (жен) / до 40 (муж)', group: 'Печеночный профиль' },
        { id: '3', name: 'Общий билирубин', unit: 'мкмоль/л', norm: '5.0 - 21.0', group: 'Печеночный профиль' },
        { id: '4', name: 'Прямой билирубин', unit: 'мкмоль/л', norm: '0 - 5.0', group: 'Печеночный профиль' }
      ]
    },
    {
      id: 'custom-preset-2',
      categoryType: 'CUSTOM',
      title: 'Коагулограмма (Свертывающая система)',
      description: 'ПТИ, МНО, Фибриноген, ТВ, АЧТВ',
      params: [
        { id: '1', name: 'Протромбиновый индекс (ПТИ)', unit: '%', norm: '80 - 105 %', group: 'Гемостаз' },
        { id: '2', name: 'МНО (INR)', unit: '-', norm: '0.85 - 1.15', group: 'Гемостаз' },
        { id: '3', name: 'Фибриноген', unit: 'г/л', norm: '2.0 - 4.0', group: 'Гемостаз' },
        { id: '4', name: 'АЧТВ', unit: 'сек', norm: '24 - 35', group: 'Гемостаз' }
      ]
    }
  ]);

  // Selected Preset IDs for active modals
  const [selectedOamPresetId, setSelectedOamPresetId] = useState<string>('oam-preset-1');
  const [selectedOakPresetId, setSelectedOakPresetId] = useState<string>('oak-preset-1');
  const [selectedLeukoPresetId, setSelectedLeukoPresetId] = useState<string>('leuko-preset-1');
  const [selectedCustomPresetId, setSelectedCustomPresetId] = useState<string>('custom-preset-1');

  const renameTemplatePreset = (presetId: string, currentTitle: string, updateModalTitleFn: (t: string) => void) => {
    if (!presetId) {
      alert('⚠️ Iltimos, avval nomini o\'zgartirmoqchi bo\'lgan shablonni tanlang!');
      return;
    }
    const targetPreset = templatePresets.find(p => p.id === presetId);
    const initialName = targetPreset ? targetPreset.title : currentTitle;

    const newName = prompt('Shablon uchun yangi nom kiriting:', initialName);
    if (!newName || newName.trim() === '') return;

    setTemplatePresets(prev => prev.map(p => p.id === presetId ? { ...p, title: newName } : p));
    updateModalTitleFn(newName);
    alert(`✏️ Shablon nomi ("${newName}") ga muvaffaqiyatli o'zgartirildi!`);
  };

  const deleteTemplatePreset = (presetId: string, resetPresetFn: () => void) => {
    if (!presetId) {
      alert('⚠️ Iltimos, avval o\'chirmoqchi bo\'lgan shablonni tanlang!');
      return;
    }
    const preset = templatePresets.find(p => p.id === presetId);
    if (!preset) return;

    if (confirm(`🗑️ "${preset.title}" shablonini ro'yxatdan o'chirib tashlamoqchimisiz?`)) {
      setTemplatePresets(prev => prev.filter(p => p.id !== presetId));
      resetPresetFn();
      alert(`🗑️ "${preset.title}" shabloni o'chirildi!`);
    }
  };

  // Uploaded MS Word Blank Templates State
  const [uploadedWordTemplates, setUploadedWordTemplates] = useState<Array<{ id: string; name: string; size: string; uploadDate: string }>>(() => {
    const saved = localStorage.getItem('smartlab_word_templates');
    return saved ? JSON.parse(saved) : [
      { id: 'wt-1', name: 'OAM_Standard_Blanka_Template.docx', size: '24.5 KB', uploadDate: '2026-08-16 20:55' }
    ];
  });

  const handleWordFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const newTemplate = {
      id: `wt-${Date.now()}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const updated = [newTemplate, ...uploadedWordTemplates];
    setUploadedWordTemplates(updated);
    localStorage.setItem('smartlab_word_templates', JSON.stringify(updated));
    alert(`📄 MS Word blanka fayli ("${file.name}") muvaffaqiyatli yuklandi! Laborant Kabineti va Rasmiy Blankda ko'rinadi.`);
  };

  const handleDeleteWordTemplate = (id: string) => {
    const updated = uploadedWordTemplates.filter(w => w.id !== id);
    setUploadedWordTemplates(updated);
    localStorage.setItem('smartlab_word_templates', JSON.stringify(updated));
  };

  const categories = useMemo(() => Array.from(new Set(testCatalog.map(c => c.category))), [testCatalog]);

  // Available Subgroups for the currently active Category
  const availableSubGroups = useMemo(() => {
    const activeCategoryObj = testCatalog.find(c => c.category === selectedCategory);
    return activeCategoryObj
      ? activeCategoryObj.subGroups.map(sg => sg.groupTitle)
      : Array.from(new Set(testCatalog.flatMap(c => c.subGroups.map(sg => sg.groupTitle))));
  }, [testCatalog, selectedCategory]);

  const filteredSubGroups = useMemo(() => {
    const q = subGroupSearchTerm.toLowerCase();
    return availableSubGroups.filter(sg => sg.toLowerCase().includes(q));
  }, [availableSubGroups, subGroupSearchTerm]);

  const openAddModalForGroup = (catName: string, subGroupTitle: string) => {
    setNewTestCategory(catName);
    setNewSubGroupTitle(subGroupTitle);
    setNewTestName('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (catId: string, subGroupId: string, item: IndividualTestItem) => {
    setEditingItem({ catId, subGroupId, item });
    setEditName(item.name);
    setEditPrice(item.price);
    setEditUnit(item.unit || '');
    setEditRefMin(item.refMin || 0);
    setEditRefMax(item.refMax || 100);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updatedCatalog = testCatalog.map(cat => {
      if (cat.id !== editingItem.catId) return cat;

      return {
        ...cat,
        subGroups: cat.subGroups.map(sg => {
          if (sg.id !== editingItem.subGroupId) return sg;

          return {
            ...sg,
            items: sg.items.map(it => {
              if (it.id !== editingItem.item.id) return it;

              return {
                ...it,
                name: editName,
                price: Number(editPrice),
                unit: editUnit,
                refMin: Number(editRefMin),
                refMax: Number(editRefMax)
              };
            })
          };
        })
      };
    });

    onUpdateTestCatalog(updatedCatalog);
    setEditingItem(null);
    alert('✅ Tahlil turi va narxi muvaffaqiyatli o\'zgartirildi!');
  };

  const handleSaveNewTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim()) return;

    let targetCat = testCatalog.find(c => c.category === newTestCategory);
    let updatedCatalog: TestCatalogItem[];

    const newItem: IndividualTestItem = {
      id: `test-${Date.now()}`,
      name: newTestName,
      price: Number(newTestPrice),
      unit: newTestUnit,
      refMin: Number(newRefMin),
      refMax: Number(newRefMax)
    };

    if (targetCat) {
      updatedCatalog = testCatalog.map(cat => {
        if (cat.category !== newTestCategory) return cat;
        
        let sgFound = cat.subGroups.find(sg => sg.groupTitle === newSubGroupTitle);
        let updatedSubGroups;
        
        if (sgFound) {
          updatedSubGroups = cat.subGroups.map(sg => {
            if (sg.groupTitle !== newSubGroupTitle) return sg;
            return { ...sg, items: [...sg.items, newItem] };
          });
        } else {
          updatedSubGroups = [
            ...cat.subGroups,
            { id: `sg-${Date.now()}`, groupTitle: newSubGroupTitle, items: [newItem] }
          ];
        }

        return { ...cat, subGroups: updatedSubGroups };
      });
    } else {
      const newCatItem: TestCatalogItem = {
        id: `cat-${Date.now()}`,
        category: newTestCategory,
        subGroups: [
          { id: `sg-${Date.now()}`, groupTitle: newSubGroupTitle, items: [newItem] }
        ]
      };
      updatedCatalog = [...testCatalog, newCatItem];
      onAddTestCatalog(newCatItem);
    }

    onUpdateTestCatalog(updatedCatalog);
    setIsAddModalOpen(false);
    setNewTestName('');
    alert('✅ Yangi tahlil turi muvaffaqiyatli qo\'shildi!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-400" />
            Tahlillar Spravochnigi (Nav-bar va Qulay Navigatsiya)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Nav-bardagi kategoriyalarni tanlab, har bir guruhga tahlillarni osongina qo'shishingiz va tahrirlashingiz mumkin.
          </p>
        </div>

        <button
          onClick={() => openAddModalForGroup(selectedCategory === 'all' ? 'БИОХИМИЯ' : selectedCategory, 'ОБЩИЕ ИССЛЕДОВАНИЯ')}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          Yangi Tahlil Qo'shish
        </button>
      </div>

      {/* Main Category Navigation Bar (Top Nav-bar) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            📂 Bosh Kategoriya Nav-bari (Category Navigation):
          </span>
          <span className="text-[11px] text-slate-400">
            Jami kategoriyalar: {categories.length} ta
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSubGroup('all');
            }}
            className={`px-3.5 py-2 rounded-xl font-extrabold uppercase transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-teal-500 text-slate-950 shadow ring-2 ring-teal-400/40'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            БАРЧАСИ (ALL)
          </button>

          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSubGroup('all');
              }}
              className={`px-3.5 py-2 rounded-xl font-extrabold uppercase transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-teal-500 text-slate-950 shadow ring-2 ring-teal-400/40'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {translateCategoryName(cat, currentLanguage)}
            </button>
          ))}
        </div>
      </div>

      {/* SubGroup Navigation Bar (Secondary Nav-bar - Tartibli va Ixcham) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-teal-400">🏷️</span> Pod-Kategoriya (Guruh) Nav-bari:
            </span>
            <span className="text-[10px] bg-slate-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
              {availableSubGroups.length} ta guruh
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick search input inside subgroups */}
            <div className="relative">
              <input
                type="text"
                placeholder="Guruh nomini qidirish..."
                value={subGroupSearchTerm}
                onChange={(e) => setSubGroupSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 w-48 focus:outline-none focus:border-teal-500 font-sans"
              />
              {subGroupSearchTerm && (
                <button
                  onClick={() => setSubGroupSearchTerm('')}
                  className="absolute right-2.5 top-1.5 text-slate-400 hover:text-white font-bold text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {selectedCategory !== 'all' && (
              <button
                onClick={() => openAddModalForGroup(selectedCategory, availableSubGroups[0] || 'ОБЩИЕ ИССЛЕДОВАНИЯ')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20 shadow-sm"
              >
                <FolderPlus className="w-3.5 h-3.5" /> + [{selectedCategory}]ga tahlil
              </button>
            )}
          </div>
        </div>

        {/* Clean Scrollable Horizontal Pills Container with Count Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 text-xs scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
          <button
            onClick={() => setSelectedSubGroup('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedSubGroup === 'all'
                ? 'bg-gradient-to-r from-lime-500 via-emerald-500 to-teal-500 text-slate-950 font-black shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400/40'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>🌐 Barcha Pod-Guruhlar</span>
            <span className="text-[10px] bg-black/20 px-1.5 py-0.2 rounded font-mono">ALL</span>
          </button>

          {filteredSubGroups.map((sgTitle, index) => {
            // Count total tests inside this subGroup
            const count = testCatalog.reduce((acc, cat) => {
              const sg = cat.subGroups.find(s => s.groupTitle === sgTitle);
              return acc + (sg ? sg.items.length : 0);
            }, 0);

            return (
              <button
                key={`${sgTitle}-${index}`}
                onClick={() => setSelectedSubGroup(sgTitle)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedSubGroup === sgTitle
                    ? 'bg-gradient-to-r from-lime-500 to-emerald-500 text-slate-950 font-extrabold shadow-md shadow-lime-500/20 ring-2 ring-lime-400/40 scale-105'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{sgTitle}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    selectedSubGroup === sgTitle ? 'bg-black/30 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔎 Tahlil ko'rsatkichi nomini izlash..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Test Catalog Tables grouped by Category */}
      <div className="space-y-6">
        {testCatalog
          .filter(cat => selectedCategory === 'all' || cat.category === selectedCategory)
          .map(cat => (
            <div key={cat.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-teal-300 uppercase tracking-wider">
                  {cat.category}
                </h3>
                <button
                  onClick={() => openAddModalForGroup(cat.category, cat.subGroups[0]?.groupTitle || 'ОБЩИЕ')}
                  className="text-xs text-emerald-400 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1 rounded-lg border border-emerald-500/20 transition-all flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> + Shu kategoriyaga tahlil qo'shish
                </button>
              </div>

              {/* Subgroup Tables */}
              <div className="space-y-4">
                {cat.subGroups
                  .filter(sg => selectedSubGroup === 'all' || sg.groupTitle === selectedSubGroup)
                  .map(sg => {
                    const filteredItems = sg.items.filter(it =>
                      it.name.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    if (filteredItems.length === 0) return null;

                    return (
                      <div key={sg.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                            📁 {translateSubGroupTitle(sg.groupTitle, currentLanguage)} ({filteredItems.length} ta)
                          </h4>
                          <button
                            onClick={() => openAddModalForGroup(cat.category, sg.groupTitle)}
                            className="text-[11px] text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> + Tahlil qo'shish
                          </button>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead className="text-slate-500 font-semibold border-b border-slate-800/60 text-[11px]">
                              <tr>
                                <th className="py-2 px-3">Tahlil Nomi</th>
                                <th className="py-2 px-3">Narxi (so'm)</th>
                                <th className="py-2 px-3">Birligi</th>
                                <th className="py-2 px-3">Me'yor (Min - Max)</th>
                                <th className="py-2 px-3 text-right">Amallar</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/40">
                              {filteredItems.map(item => (
                                <tr key={item.id} className="hover:bg-slate-900/60 transition-colors group">
                                  <td className="py-2.5 px-3 font-semibold text-white">
                                    {translateTestName(item.name, currentLanguage)}
                                  </td>
                                  <td className="py-2.5 px-3 font-bold text-emerald-400 font-mono">
                                    {item.price.toLocaleString()} so'm
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-400 font-medium">
                                    {item.unit || '—'}
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-400 font-mono">
                                    {item.refMin !== undefined ? `${item.refMin} - ${item.refMax}` : '—'}
                                  </td>
                                  <td className="py-2.5 px-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      {/* EDIT ICON BUTTON */}
                                      <button
                                        onClick={() => openEditModal(cat.id, sg.id, item)}
                                        className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center gap-1 font-semibold text-[11px]"
                                        title="Tahlilni va narxni tahrirlash"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>Tahrirlash</span>
                                      </button>

                                      {/* DELETE BUTTON */}
                                      <button
                                        onClick={() => onDeleteTestCatalog(item.id)}
                                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-all"
                                        title="O'chirish"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
              </div>

            </div>
          ))}
      </div>

      {/* POPUP MODAL 1: EDIT TEST ITEM */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-scaleIn">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                Tahlil Turini Tahrirlash (Oyna)
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Tahlil Ko'rsatkichi Nomi:</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Narxi (so'm):</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      required
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-emerald-400 font-extrabold text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Birligi (Unit):</label>
                  <input
                    type="text"
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    placeholder="ммоль/л, нг/мл va h.k."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Tahlil Turi Selector in Edit Modal: Raqamli vs Sifatli vs Blanka tayyorlash */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-3">
                <label className="block font-bold text-slate-300">Tahlil Natija Turi (Kolleksion Normativ):</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditUnit('нмоль/л')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all border text-center ${
                      editUnit !== 'Качество' && editUnit !== 'Kachestvo' && editUnit !== 'Индекс' && editUnit !== 'Титр' && editUnit !== 'Таблица' && editUnit !== 'Бланк'
                        ? 'bg-teal-500 text-slate-950 border-teal-400 font-extrabold shadow-lg ring-2 ring-teal-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="block font-black text-xs">🔢 Raqamli</span>
                    <span className="text-[9px] font-normal opacity-80 block">(Количественный)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditUnit('Качество')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all border text-center ${
                      editUnit === 'Качество' || editUnit === 'Kachestvo' || editUnit === 'Индекс' || editUnit === 'Титр'
                        ? 'bg-teal-500 text-slate-950 border-teal-400 font-extrabold shadow-lg ring-2 ring-teal-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="block font-black text-xs">🧪 Sifatli</span>
                    <span className="text-[9px] font-normal opacity-80 block">(Musbat/Manfiy)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditUnit('Таблица')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all border text-center ${
                      editUnit === 'Таблица' || editUnit === 'Бланк'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-lg ring-2 ring-emerald-500/40 scale-105'
                        : 'bg-slate-900 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10'
                    }`}
                  >
                    <span className="block font-black text-xs">📄 Blanka tayyorlash</span>
                    <span className="text-[9px] font-normal opacity-80 block">(Сложный бланк)</span>
                  </button>
                </div>

                {/* If Blank Template (Blanka tayyorlash) */}
                {(editUnit === 'Таблица' || editUnit === 'Бланк') ? (
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                        <span>📄</span>
                        <span>Murakkab Jadval va Blank Shabloni Sozlami:</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        Ushbu tahlil uchun tayyor blanka shabloni (masalan: <b>Общий анализ мочи / OAM</b>, <b>Общий анализ крови / ОАК</b>, <b>Лейко формула</b>) biriktiriladi.
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsOAMModalOpen(true)}
                          className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[11px] font-extrabold hover:bg-emerald-500/30 text-left transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          📋 OAM (Общий анализ мочи - Tahrirlash)
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsOAKModalOpen(true)}
                          className="p-2 rounded-lg bg-rose-500/20 border border-rose-400 text-rose-300 text-[11px] font-extrabold hover:bg-rose-500/30 text-left transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          🩸 ОАК (Общий анализ крови - Tahrirlash)
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsLeukoModalOpen(true)}
                          className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-[11px] font-extrabold hover:bg-cyan-500/30 text-left transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          🔬 Лейко формула (Tahrirlash)
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCustomTableModalOpen(true)}
                          className="p-2 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-300 text-[11px] font-extrabold hover:bg-amber-500/30 text-left transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          ✏️ Maxsus Jadval Tuzuvchi (Ochish)
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (editUnit === 'Качество' || editUnit === 'Kachestvo' || editUnit === 'Индекс' || editUnit === 'Титр') ? (
                  <div className="space-y-2 pt-1 border-t border-slate-800">
                    <span className="text-[11px] font-bold text-slate-300 block">
                      Tahlil uchun odatiy (norma) holatni tanlang (Ustiga bosing):
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setEditRefMin(0)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          editRefMin === 0
                            ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-500/50 shadow-lg scale-105 font-black'
                            : 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 text-slate-400'
                        }`}
                      >
                        <span className="text-[12px] font-extrabold text-emerald-400 block">✓ Манфий</span>
                        <span className="text-[10px] text-slate-300 font-medium">Отрицательный</span>
                        <span className="text-[9px] text-emerald-400/80 block mt-0.5 font-bold">
                          {editRefMin === 0 ? '● Tanlangan Norma' : 'Tanlash uchun bosing'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditRefMin(1)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          editRefMin === 1
                            ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-500/50 shadow-lg scale-105 font-black'
                            : 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10 text-slate-400'
                        }`}
                      >
                        <span className="text-[12px] font-extrabold text-amber-400 block">⚠️ Серая зона</span>
                        <span className="text-[10px] text-slate-300 font-medium">Chegarada</span>
                        <span className="text-[9px] text-amber-400/80 block mt-0.5 font-bold">
                          {editRefMin === 1 ? '● Tanlangan Status' : 'Tanlash uchun bosing'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditRefMin(2)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          editRefMin === 2
                            ? 'bg-rose-500/20 border-rose-400 ring-2 ring-rose-500/50 shadow-lg scale-105 font-black'
                            : 'bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10 text-slate-400'
                        }`}
                      >
                        <span className="text-[12px] font-extrabold text-rose-400 block">🚨 Мусбат</span>
                        <span className="text-[10px] text-slate-300 font-medium">Положительный</span>
                        <span className="text-[9px] text-rose-400/80 block mt-0.5 font-bold">
                          {editRefMin === 2 ? '● Tanlangan Status' : 'Tanlash uchun bosing'}
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* If Quantitative (Raqamli) */
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block font-bold text-slate-400 mb-1">Norma Min (Minimal):</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editRefMin}
                        onChange={(e) => setEditRefMin(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-400 mb-1">Norma Max (Maksimal):</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editRefMax}
                        onChange={(e) => setEditRefMax(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" />
                  O'zgarishlarni Saqlash
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* POPUP MODAL 2: ADD NEW TEST ITEM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-scaleIn">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                Yangi Tahlil Qo'shish Oynasi
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewTest} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Kategoriya:</label>
                  <input
                    type="text"
                    required
                    value={newTestCategory}
                    onChange={(e) => setNewTestCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Pod-Kategoriya (Guruh):</label>
                  <input
                    type="text"
                    required
                    value={newSubGroupTitle}
                    onChange={(e) => setNewSubGroupTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Tahlil Ko'rsatkichi Nomi:</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Витамин D - 25 OH"
                  value={newTestName}
                  onChange={(e) => setNewTestName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Narxi (so'm):</label>
                  <input
                    type="number"
                    required
                    value={newTestPrice}
                    onChange={(e) => setNewTestPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-extrabold text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Birligi (Unit):</label>
                  <input
                    type="text"
                    value={newTestUnit}
                    onChange={(e) => setNewTestUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Tahlil Turi Selector in Add Modal: Raqamli vs Sifatli vs Blanka tayyorlash */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-3">
                <label className="block font-bold text-slate-300">Tahlil Natija Turi (Kolleksion Normativ):</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTestUnit('нмоль/л')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all border text-center ${
                      newTestUnit !== 'Качество' && newTestUnit !== 'Kachestvo' && newTestUnit !== 'Индекс' && newTestUnit !== 'Титр' && newTestUnit !== 'Таблица' && newTestUnit !== 'Бланк'
                        ? 'bg-teal-500 text-slate-950 border-teal-400 font-extrabold shadow-lg ring-2 ring-teal-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="block font-black text-xs">🔢 Raqamli</span>
                    <span className="text-[9px] font-normal opacity-80 block">(Количественный)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewTestUnit('Качество')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all border text-center ${
                      newTestUnit === 'Качество' || newTestUnit === 'Kachestvo' || newTestUnit === 'Индекс' || newTestUnit === 'Титр'
                        ? 'bg-teal-500 text-slate-950 border-teal-400 font-extrabold shadow-lg ring-2 ring-teal-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="block font-black text-xs">🧪 Sifatli</span>
                    <span className="text-[9px] font-normal opacity-80 block">(Musbat/Manfiy)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewTestUnit('Таблица')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all border text-center ${
                      newTestUnit === 'Таблица' || newTestUnit === 'Бланк'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-lg ring-2 ring-emerald-500/40 scale-105'
                        : 'bg-slate-900 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10'
                    }`}
                  >
                    <span className="block font-black text-xs">📄 Blanka tayyorlash</span>
                    <span className="text-[9px] font-normal opacity-80 block">(Сложный бланк)</span>
                  </button>
                </div>

                {/* If Blank Template (Blanka tayyorlash) in Add Modal */}
                {(newTestUnit === 'Таблица' || newTestUnit === 'Бланк') ? (
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                        <span>📄</span>
                        <span>Murakkab Jadval va Blank Shabloni Sozlami:</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        Ushbu tahlil uchun tayyor blanka shabloni (masalan: <b>Общий анализ мочи / OAM</b>, <b>Общий анализ крови / ОАК</b>, <b>Лейко формула</b>) biriktiriladi.
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsOAMModalOpen(true)}
                          className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[11px] font-extrabold hover:bg-emerald-500/30 text-left transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          📋 OAM (Общий анализ мочи - Tahrirlash)
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsOAKModalOpen(true)}
                          className="p-2 rounded-lg bg-rose-500/20 border border-rose-400 text-rose-300 text-[11px] font-extrabold hover:bg-rose-500/30 text-left transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          🩸 ОАК (Общий анализ крови - Tahrirlash)
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsLeukoModalOpen(true)}
                          className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-[11px] font-extrabold hover:bg-cyan-500/30 text-left transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          🔬 Лейко формула (Tahrirlash)
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCustomTableModalOpen(true)}
                          className="p-2 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-300 text-[11px] font-extrabold hover:bg-amber-500/30 text-left transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          ✏️ Maxsus Jadval Tuzuvchi (Ochish)
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (newTestUnit === 'Качество' || newTestUnit === 'Kachestvo' || newTestUnit === 'Индекс' || newTestUnit === 'Титр') ? (
                  <div className="space-y-2 pt-1 border-t border-slate-800">
                    <span className="text-[11px] font-bold text-slate-300 block">
                      Tahlil uchun odatiy (norma) holatni tanlang (Ustiga bosing):
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setNewRefMin(0)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          newRefMin === 0
                            ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-500/50 shadow-lg scale-105 font-black'
                            : 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 text-slate-400'
                        }`}
                      >
                        <span className="text-[12px] font-extrabold text-emerald-400 block">✓ Манфий</span>
                        <span className="text-[10px] text-slate-300 font-medium">Отрицательный</span>
                        <span className="text-[9px] text-emerald-400/80 block mt-0.5 font-bold">
                          {newRefMin === 0 ? '● Tanlangan Norma' : 'Tanlash uchun bosing'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setNewRefMin(1)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          newRefMin === 1
                            ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-500/50 shadow-lg scale-105 font-black'
                            : 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10 text-slate-400'
                        }`}
                      >
                        <span className="text-[12px] font-extrabold text-amber-400 block">⚠️ Серая зона</span>
                        <span className="text-[10px] text-slate-300 font-medium">Chegarada</span>
                        <span className="text-[9px] text-amber-400/80 block mt-0.5 font-bold">
                          {newRefMin === 1 ? '● Tanlangan Status' : 'Tanlash uchun bosing'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setNewRefMin(2)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          newRefMin === 2
                            ? 'bg-rose-500/20 border-rose-400 ring-2 ring-rose-500/50 shadow-lg scale-105 font-black'
                            : 'bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10 text-slate-400'
                        }`}
                      >
                        <span className="text-[12px] font-extrabold text-rose-400 block">🚨 Мусбат</span>
                        <span className="text-[10px] text-slate-300 font-medium">Положительный</span>
                        <span className="text-[9px] text-rose-400/80 block mt-0.5 font-bold">
                          {newRefMin === 2 ? '● Tanlangan Status' : 'Tanlash uchun bosing'}
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* If Quantitative (Raqamli) */
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block font-bold text-slate-400 mb-1">Norma Min:</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newRefMin}
                        onChange={(e) => setNewRefMin(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-400 mb-1">Norma Max:</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newRefMax}
                        onChange={(e) => setNewRefMax(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2 rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  + Qo'shish
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* POPUP MODAL 3: OAM (Общий анализ мочи) BLANK TEMPLATE CONFIGURATOR & EDITOR */}
      {isOAMModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-4xl w-full p-6 space-y-5 shadow-2xl animate-scaleIn max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span className="text-emerald-400 text-lg">📋</span>
                  OAM (Общий анализ мочи) Blanka Shablonini Tahrirlash va Sozlash
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ushbu shablon bo'yicha laboratoriyada bemorlar uchun siydik tahlili blankasi yaratiladi va chop etiladi.
                </p>
              </div>
              <button
                onClick={() => setIsOAMModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              
              {/* Full Interactive CKEditor 4 Toolbar */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2 font-bold text-slate-300">
                  <label>Blanka Sarlavhasi & Interaktiv CKEditor Muharriri:</label>
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-emerald-400 font-extrabold">Название: *</span>
                    <input
                      type="text"
                      value={oamTemplateTitle}
                      onChange={(e) => setOamTemplateTitle(e.target.value)}
                      className="bg-slate-950 border border-emerald-500/50 rounded px-2.5 py-1 text-white font-bold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 min-w-[200px]"
                    />

                    {/* Preset Template Selector & Renamer */}
                    <div className="flex items-center gap-1.5 bg-slate-950 border border-emerald-500/50 rounded-xl px-2 py-1 shadow-inner">
                      <span className="text-[10px] text-amber-400 font-extrabold uppercase font-mono">📋 Shablon:</span>
                      <select
                        value={selectedOamPresetId}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          setSelectedOamPresetId(selectedId);
                          const preset = templatePresets.find(p => p.id === selectedId);
                          if (preset) {
                            setOamTemplateTitle(preset.title);
                            setOamParams(preset.params);
                            alert(`✅ "${preset.title}" shabloni yuklandi!`);
                          }
                        }}
                        className="bg-slate-900 text-white font-bold text-xs border border-slate-700 rounded px-2 py-0.5 focus:outline-none focus:border-amber-400 cursor-pointer max-w-[220px] truncate"
                      >
                        <option value="">-- Shablonni Tanlang --</option>
                        {templatePresets.filter(p => p.categoryType === 'OAM').map(p => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                      </select>

                      {/* Rename Selected Preset Button */}
                      <button
                        type="button"
                        onClick={() => renameTemplatePreset(selectedOamPresetId, oamTemplateTitle, setOamTemplateTitle)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] shadow flex items-center gap-0.5"
                        title="Tanlangan shablon nomini o'zgartirish"
                      >
                        ✏️ Nomini o'zgartirish
                      </button>

                      {/* Delete Selected Preset Button */}
                      <button
                        type="button"
                        onClick={() => deleteTemplatePreset(selectedOamPresetId, () => setSelectedOamPresetId(''))}
                        className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 font-bold px-1.5 py-0.5 rounded text-[10px]"
                        title="Tanlangan shablonni o'chirish"
                      >
                        🗑️
                      </button>

                      {/* Save as New Preset Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const newTitle = prompt('Yangi OAM Shablon nomini kiriting:', oamTemplateTitle);
                          if (!newTitle) return;
                          const newId = `custom-preset-${Date.now()}`;
                          const newPreset = {
                            id: newId,
                            categoryType: 'OAM' as const,
                            title: newTitle,
                            description: 'Foydalanuvchi tomonidan saqlangan OAM shablon',
                            params: [...oamParams]
                          };
                          setTemplatePresets([...templatePresets, newPreset]);
                          setSelectedOamPresetId(newId);
                          alert(`💾 Yangi "${newTitle}" OAM shabloni ro'yxatga saqlandi!`);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] shadow"
                        title="Joriy OAM blankasini yangi tayyor shablon sifatida saqlash"
                      >
                        + Saqlash
                      </button>
                    </div>
                  </div>
                </div>
                <FullCKEditorToolbar
                  onInsertSymbol={(sym) => {
                    const newId = (oamParams.length + 1).toString();
                    setOamParams([...oamParams, { id: newId, name: `Belgi (${sym})`, unit: sym, norm: 'в норме', group: 'Физико-химические свойства' }]);
                  }}
                  onAddRow={() => {
                    const newId = (oamParams.length + 1).toString();
                    setOamParams([...oamParams, { id: newId, name: 'Yangi parametr', unit: '-', norm: 'в норме', group: 'Физико-химические свойства' }]);
                  }}
                />
              </div>

              {/* MS Word (.docx / .doc) Blanka Shablonini Yuklash Section */}
              <div className="bg-slate-950/90 border border-blue-500/40 rounded-xl p-4 space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-base border border-blue-500/40 shadow-inner">
                      📄
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-xs flex items-center gap-2">
                        <span>MS Word (.docx / .doc) Blanka Shablonini Yuklash</span>
                        <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded font-mono font-extrabold border border-blue-500/30">
                          WORD FILE UPLOADER
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                        Shaxsiy MS Word fayl blankasini yuklang. Yuklangan blankalar <b>Laborant Kabineti</b> hamda <b>Rasmiy Blank</b> bo'limlarida avtomatik ko'rinadi va chop etish uchun foydalaniladi.
                      </p>
                    </div>
                  </div>

                  {/* File Input Upload Button */}
                  <label className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all flex-shrink-0">
                    <UploadCloud className="w-4 h-4" />
                    <span>Word Blank Yuklash (.docx)</span>
                    <input
                      type="file"
                      accept=".doc,.docx,.pdf"
                      className="hidden"
                      onChange={handleWordFileUpload}
                    />
                  </label>
                </div>

                {/* List of Uploaded Word Templates */}
                {uploadedWordTemplates.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    <span className="text-[10px] text-blue-300 font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      Yuklangan Word Blanka Shabloni Fayllari ({uploadedWordTemplates.length} ta):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {uploadedWordTemplates.map((wt) => (
                        <div key={wt.id} className="bg-slate-900 border border-blue-500/40 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-mono text-blue-200 shadow-md">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="font-extrabold">{wt.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({wt.size} • {wt.uploadDate})</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteWordTemplate(wt.id)}
                            className="ml-1 text-slate-400 hover:text-rose-400 font-black p-0.5 rounded hover:bg-rose-500/20"
                            title="Faylni o'chirish"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* OAM Parameter Rows & Dynamic Columns Manager */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-extrabold text-slate-200 text-xs">
                    Tahlil Ko'rsatkichlari Ro'yxati ({oamParams.length} ta parametr):
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={addCustomColumn}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-3 py-1 rounded-lg text-xs flex items-center gap-1 shadow transition-all"
                      title="Jadvalga yangi input ustun qo'shish va nomini o'zgartirish"
                    >
                      <Plus className="w-3.5 h-3.5" /> + Qo'shimcha Ustun (Input) Qo'shish
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const newId = (oamParams.length + 1).toString();
                        setOamParams([...oamParams, { id: newId, name: 'Yangi ko\'rsatkich', unit: '-', norm: 'в норме', group: 'Физико-химические свойства' }]);
                      }}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-3 py-1 rounded-lg text-xs flex items-center gap-1 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" /> + Yangi Parametr Qo'shish
                    </button>
                  </div>
                </div>

                {/* Table Editor */}
                <div className="border border-slate-800 rounded-xl overflow-x-auto bg-slate-950/70">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[10px]">
                      <tr>
                        <th className="py-2 px-3 w-10 text-center">№</th>
                        <th className="py-2 px-3">Ko'rsatkich Nomi (Показатель)</th>
                        <th className="py-2 px-3 w-28">Birligi (Ед. изм.)</th>
                        <th className="py-2 px-3">Norma (Референтные значения)</th>
                        <th className="py-2 px-3">Guruh (Подгруппа)</th>

                        {/* Dynamic Custom Column Headers with Live Renaming */}
                        {tableCustomColumns.map((col) => (
                          <th key={col.id} className="py-1 px-2 border-l border-slate-800 bg-blue-950/40 min-w-[150px]">
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={col.headerTitle}
                                onChange={(e) => updateColumnHeaderTitle(col.id, e.target.value)}
                                className="w-full bg-slate-900 border border-blue-500/50 rounded px-1.5 py-0.5 text-blue-300 font-extrabold text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-400 uppercase font-mono shadow-inner"
                                placeholder="Ustun nomini o'zgartiring..."
                              />
                              <button
                                type="button"
                                onClick={() => deleteCustomColumn(col.id)}
                                className="text-slate-400 hover:text-rose-400 font-bold px-1 rounded hover:bg-rose-500/20"
                                title="Ushbu ustunni o'chirish"
                              >
                                ✕
                              </button>
                            </div>
                          </th>
                        ))}

                        <th className="py-2 px-3 w-12 text-center">Amal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {oamParams.map((p, idx) => (
                        <tr key={p.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-2 px-3 text-center text-slate-500 font-bold">{idx + 1}</td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={p.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                setOamParams(oamParams.map(item => item.id === p.id ? { ...item, name: val } : item));
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-sans text-xs focus:border-emerald-500"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={p.unit}
                              onChange={(e) => {
                                const val = e.target.value;
                                setOamParams(oamParams.map(item => item.id === p.id ? { ...item, unit: val } : item));
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300 text-xs focus:border-emerald-500"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={p.norm}
                              onChange={(e) => {
                                const val = e.target.value;
                                setOamParams(oamParams.map(item => item.id === p.id ? { ...item, norm: val } : item));
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-emerald-300 font-semibold text-xs focus:border-emerald-500"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={p.group}
                              onChange={(e) => {
                                const val = e.target.value;
                                setOamParams(oamParams.map(item => item.id === p.id ? { ...item, group: val } : item));
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-slate-300 text-[10px]"
                            >
                              <option value="Физико-химические свойства">Физико-химические свойства</option>
                              <option value="Химическое исследование">Химическое исследование</option>
                              <option value="Микроскопия осадка">Микроскопия осадка</option>
                            </select>
                          </td>

                          {/* Editable Input Cell for each Dynamic Custom Column */}
                          {tableCustomColumns.map((col) => (
                            <td key={col.id} className="py-2 px-2 border-l border-slate-800 bg-blue-950/20">
                              <input
                                type="text"
                                placeholder={`${col.headerTitle.toLowerCase()}...`}
                                className="w-full bg-slate-900 border border-blue-500/30 rounded px-2 py-1 text-blue-200 font-sans text-xs focus:border-blue-400 focus:outline-none"
                              />
                            </td>
                          ))}
                          <td className="py-2 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => setOamParams(oamParams.filter(item => item.id !== p.id))}
                              className="text-slate-400 hover:text-rose-400 font-bold p-1 rounded hover:bg-rose-500/20"
                              title="Ushbu parametrni o'chirish"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">
                ✅ OAM Blanka formati saqlashga tayyor.
              </span>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOAMModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Bekor qilish
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOAMModalOpen(false);
                    alert(`✅ OAM (Общий анализ мочи) blanka shabloni muvaffaqiyatli saqlandi!`);
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold px-6 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <Save className="w-4 h-4" />
                  OAM Shablonini Saqlash
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* POPUP MODAL 4: OAK (Общий анализ крови) BLANK TEMPLATE CONFIGURATOR & EDITOR */}
      {isOAKModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-4xl w-full p-6 space-y-5 shadow-2xl animate-scaleIn max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span className="text-rose-400 text-lg">🩸</span>
                  OAK (Общий анализ крови) Blanka Shablonini Tahrirlash va Sozlash
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ushbu shablon bo'yicha laboratoriyada bemorlar uchun umumiy qon tahlili (ОАК) blankasi yaratiladi va chop etiladi.
                </p>
              </div>
              <button
                onClick={() => setIsOAKModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              
              {/* Full Interactive CKEditor 4 Toolbar */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2 font-bold text-slate-300">
                  <label>Blanka Sarlavhasi & Interaktiv CKEditor Muharriri:</label>
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-rose-400 font-extrabold">Название: *</span>
                    <input
                      type="text"
                      value={oakTemplateTitle}
                      onChange={(e) => setOakTemplateTitle(e.target.value)}
                      className="bg-slate-950 border border-rose-500/50 rounded px-2.5 py-1 text-white font-bold text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 min-w-[200px]"
                    />

                    {/* Preset Template Selector & Renamer */}
                    <div className="flex items-center gap-1.5 bg-slate-950 border border-rose-500/50 rounded-xl px-2 py-1 shadow-inner">
                      <span className="text-[10px] text-amber-400 font-extrabold uppercase font-mono">📋 Shablon:</span>
                      <select
                        value={selectedOakPresetId}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          setSelectedOakPresetId(selectedId);
                          const preset = templatePresets.find(p => p.id === selectedId);
                          if (preset) {
                            setOakTemplateTitle(preset.title);
                            setOakParams(preset.params);
                            alert(`✅ "${preset.title}" shabloni yuklandi!`);
                          }
                        }}
                        className="bg-slate-900 text-white font-bold text-xs border border-slate-700 rounded px-2 py-0.5 focus:outline-none focus:border-amber-400 cursor-pointer max-w-[220px] truncate"
                      >
                        <option value="">-- Shablonni Tanlang --</option>
                        {templatePresets.filter(p => p.categoryType === 'OAK').map(p => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                      </select>

                      {/* Rename Selected Preset Button */}
                      <button
                        type="button"
                        onClick={() => renameTemplatePreset(selectedOakPresetId, oakTemplateTitle, setOakTemplateTitle)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] shadow flex items-center gap-0.5"
                        title="Tanlangan shablon nomini o'zgartirish"
                      >
                        ✏️ Nomini o'zgartirish
                      </button>

                      {/* Delete Selected Preset Button */}
                      <button
                        type="button"
                        onClick={() => deleteTemplatePreset(selectedOakPresetId, () => setSelectedOakPresetId(''))}
                        className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 font-bold px-1.5 py-0.5 rounded text-[10px]"
                        title="Tanlangan shablonni o'chirish"
                      >
                        🗑️
                      </button>

                      {/* Save as New Preset Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const newTitle = prompt('Yangi OAK Shablon nomini kiriting:', oakTemplateTitle);
                          if (!newTitle) return;
                          const newId = `custom-preset-${Date.now()}`;
                          const newPreset = {
                            id: newId,
                            categoryType: 'OAK' as const,
                            title: newTitle,
                            description: 'Foydalanuvchi tomonidan saqlangan OAK shablon',
                            params: [...oakParams]
                          };
                          setTemplatePresets([...templatePresets, newPreset]);
                          setSelectedOakPresetId(newId);
                          alert(`💾 Yangi "${newTitle}" OAK shabloni ro'yxatga saqlandi!`);
                        }}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-black px-2 py-0.5 rounded text-[10px] shadow"
                        title="Joriy OAK blankasini yangi tayyor shablon sifatida saqlash"
                      >
                        + Saqlash
                      </button>
                    </div>
                  </div>
                </div>
                <FullCKEditorToolbar
                  onInsertSymbol={(sym) => {
                    const newId = (oakParams.length + 1).toString();
                    setOakParams([...oakParams, { id: newId, name: `Belgi (${sym})`, unit: sym, norm: 'в норме', group: 'Эритроцитарные показатели' }]);
                  }}
                  onAddRow={() => {
                    const newId = (oakParams.length + 1).toString();
                    setOakParams([...oakParams, { id: newId, name: 'Yangi ОАК parametr', unit: '-', norm: 'в норме', group: 'Эритроцитарные показатели' }]);
                  }}
                />
              </div>

              {/* MS Word (.docx / .doc) Blanka Shablonini Yuklash Section for OAK */}
              <div className="bg-slate-950/90 border border-blue-500/40 rounded-xl p-4 space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-base border border-blue-500/40 shadow-inner">
                      📄
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-xs flex items-center gap-2">
                        <span>MS Word (.docx / .doc) OAK Blanka Shablonini Yuklash</span>
                        <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded font-mono font-extrabold border border-blue-500/30">
                          OAK WORD UPLOADER
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                        Shaxsiy MS Word ОАК blankasini yuklang. Yuklangan blankalar <b>Laborant Kabineti</b> hamda <b>Rasmiy Blank</b> bo'limlarida avtomatik birikadi.
                      </p>
                    </div>
                  </div>

                  {/* File Input Upload Button */}
                  <label className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all flex-shrink-0">
                    <UploadCloud className="w-4 h-4" />
                    <span>Word OAK Blank Yuklash</span>
                    <input
                      type="file"
                      accept=".doc,.docx,.pdf"
                      className="hidden"
                      onChange={handleWordFileUpload}
                    />
                  </label>
                </div>

                {/* List of Uploaded Word Templates */}
                {uploadedWordTemplates.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    <span className="text-[10px] text-blue-300 font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      Yuklangan Word Blanka Shabloni Fayllari ({uploadedWordTemplates.length} ta):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {uploadedWordTemplates.map((wt) => (
                        <div key={wt.id} className="bg-slate-900 border border-blue-500/40 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-mono text-blue-200 shadow-md">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="font-extrabold">{wt.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({wt.size} • {wt.uploadDate})</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteWordTemplate(wt.id)}
                            className="ml-1 text-slate-400 hover:text-rose-400 font-black p-0.5 rounded hover:bg-rose-500/20"
                            title="Faylni o'chirish"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* OAK Parameter Rows & Dynamic Columns Manager */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-extrabold text-slate-200 text-xs">
                    ОАК Tahlil Ko'rsatkichlari Ro'yxati ({oakParams.length} ta parametr):
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={addCustomColumn}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-3 py-1 rounded-lg text-xs flex items-center gap-1 shadow transition-all"
                      title="Jadvalga yangi input ustun qo'shish va nomini o'zgartirish"
                    >
                      <Plus className="w-3.5 h-3.5" /> + Qo'shimcha Ustun (Input) Qo'shish
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const newId = (oakParams.length + 1).toString();
                        setOakParams([...oakParams, { id: newId, name: 'Yangi ОАК ko\'rsatkich', unit: '-', norm: 'в норме', group: 'Эритроцитарные показатели' }]);
                      }}
                      className="bg-rose-500 hover:bg-rose-400 text-slate-950 font-extrabold px-3 py-1 rounded-lg text-xs flex items-center gap-1 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" /> + Yangi ОАК Parametr Qo'shish
                    </button>
                  </div>
                </div>

                {/* Table Editor */}
                <div className="border border-slate-800 rounded-xl overflow-x-auto bg-slate-950/70">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[10px]">
                      <tr>
                        <th className="py-2 px-3 w-10 text-center">№</th>
                        <th className="py-2 px-3">Ko'rsatkich Nomi (Показатель)</th>
                        <th className="py-2 px-3 w-28">Birligi (Ед. изм.)</th>
                        <th className="py-2 px-3">Norma (Референтные значения)</th>
                        <th className="py-2 px-3">Guruh (Подгруппа)</th>

                        {/* Dynamic Custom Column Headers with Live Renaming */}
                        {tableCustomColumns.map((col) => (
                          <th key={col.id} className="py-1 px-2 border-l border-slate-800 bg-blue-950/40 min-w-[150px]">
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={col.headerTitle}
                                onChange={(e) => updateColumnHeaderTitle(col.id, e.target.value)}
                                className="w-full bg-slate-900 border border-blue-500/50 rounded px-1.5 py-0.5 text-blue-300 font-extrabold text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-400 uppercase font-mono shadow-inner"
                                placeholder="Ustun nomini o'zgartiring..."
                              />
                              <button
                                type="button"
                                onClick={() => deleteCustomColumn(col.id)}
                                className="text-slate-400 hover:text-rose-400 font-bold px-1 rounded hover:bg-rose-500/20"
                                title="Ushbu ustunni o'chirish"
                              >
                                ✕
                              </button>
                            </div>
                          </th>
                        ))}
                        <th className="py-2 px-3 w-12 text-center">Amal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {oakParams.map((p, idx) => (
                        <tr key={p.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-2 px-3 text-center text-slate-500 font-bold">{idx + 1}</td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={p.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                setOakParams(oakParams.map(item => item.id === p.id ? { ...item, name: val } : item));
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-sans text-xs focus:border-rose-500"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={p.unit}
                              onChange={(e) => {
                                const val = e.target.value;
                                setOakParams(oakParams.map(item => item.id === p.id ? { ...item, unit: val } : item));
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300 text-xs focus:border-rose-500"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={p.norm}
                              onChange={(e) => {
                                const val = e.target.value;
                                setOakParams(oakParams.map(item => item.id === p.id ? { ...item, norm: val } : item));
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-rose-300 font-semibold text-xs focus:border-rose-500"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={p.group}
                              onChange={(e) => {
                                const val = e.target.value;
                                setOakParams(oakParams.map(item => item.id === p.id ? { ...item, group: val } : item));
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-slate-300 text-[10px]"
                            >
                              <option value="Эритроцитарные показатели">Эритроцитарные показатели</option>
                              <option value="Тромбоцитарные показатели">Тромбоцитарные показатели</option>
                              <option value="Лейкоцитарные показатели">Лейкоцитарные показатели</option>
                              <option value="Общие показатели">Общие показатели</option>
                            </select>
                          </td>

                          {/* Editable Input Cell for each Dynamic Custom Column */}
                          {tableCustomColumns.map((col) => (
                            <td key={col.id} className="py-2 px-2 border-l border-slate-800 bg-blue-950/20">
                              <input
                                type="text"
                                placeholder={`${col.headerTitle.toLowerCase()}...`}
                                className="w-full bg-slate-900 border border-blue-500/30 rounded px-2 py-1 text-blue-200 font-sans text-xs focus:border-blue-400 focus:outline-none"
                              />
                            </td>
                          ))}
                          <td className="py-2 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => setOakParams(oakParams.filter(item => item.id !== p.id))}
                              className="text-slate-400 hover:text-rose-400 font-bold p-1 rounded hover:bg-rose-500/20"
                              title="Ushbu parametrni o'chirish"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">
                ✅ ОАК (Общий анализ крови) Blanka formati saqlashga tayyor.
              </span>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOAKModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Bekor qilish
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOAKModalOpen(false);
                    alert(`✅ ОАК (Общий анализ крови) blanka shabloni muvaffaqiyatli saqlandi!`);
                  }}
                  className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white font-extrabold px-6 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-rose-500/20"
                >
                  <Save className="w-4 h-4" />
                  ОАК Shablonini Saqlash
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* POPUP MODAL 5: LEUKOFORMULA (Лейкоцитарная формула) BLANK TEMPLATE CONFIGURATOR & EDITOR */}
      {isLeukoModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-4xl w-full p-6 space-y-5 shadow-2xl animate-scaleIn max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span className="text-cyan-400 text-lg">🔬</span>
                  Лейкоцитарная формула (Лейко формула) Blanka Shablonini Tahrirlash va Sozlash
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ushbu shablon bo'yicha laboratoriyada bemorlar uchun leykoцитлар формуласи blankasi yaratiladi va chop etiladi.
                </p>
              </div>
              <button
                onClick={() => setIsLeukoModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              
              {/* Full Interactive CKEditor 4 Toolbar */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2 font-bold text-slate-300">
                  <label>Blanka Sarlavhasi & Interaktiv CKEditor Muharriri:</label>
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-cyan-400 font-extrabold">Название: *</span>
                    <input
                      type="text"
                      value={leukoTemplateTitle}
                      onChange={(e) => setLeukoTemplateTitle(e.target.value)}
                      className="bg-slate-950 border border-cyan-500/50 rounded px-2.5 py-1 text-white font-bold text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400 min-w-[200px]"
                    />

                    {/* Preset Template Selector & Renamer */}
                    <div className="flex items-center gap-1.5 bg-slate-950 border border-cyan-500/50 rounded-xl px-2 py-1 shadow-inner">
                      <span className="text-[10px] text-amber-400 font-extrabold uppercase font-mono">📋 Shablon:</span>
                      <select
                        value={selectedLeukoPresetId}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          setSelectedLeukoPresetId(selectedId);
                          const preset = templatePresets.find(p => p.id === selectedId);
                          if (preset) {
                            setLeukoTemplateTitle(preset.title);
                            setLeukoParams(preset.params);
                            alert(`✅ "${preset.title}" shabloni yuklandi!`);
                          }
                        }}
                        className="bg-slate-900 text-white font-bold text-xs border border-slate-700 rounded px-2 py-0.5 focus:outline-none focus:border-amber-400 cursor-pointer max-w-[220px] truncate"
                      >
                        <option value="">-- Shablonni Tanlang --</option>
                        {templatePresets.filter(p => p.categoryType === 'LEUKO').map(p => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                      </select>

                      {/* Rename Selected Preset Button */}
                      <button
                        type="button"
                        onClick={() => renameTemplatePreset(selectedLeukoPresetId, leukoTemplateTitle, setLeukoTemplateTitle)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] shadow flex items-center gap-0.5"
                        title="Tanlangan shablon nomini o'zgartirish"
                      >
                        ✏️ Nomini o'zgartirish
                      </button>

                      {/* Delete Selected Preset Button */}
                      <button
                        type="button"
                        onClick={() => deleteTemplatePreset(selectedLeukoPresetId, () => setSelectedLeukoPresetId(''))}
                        className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 font-bold px-1.5 py-0.5 rounded text-[10px]"
                        title="Tanlangan shablonni o'chirish"
                      >
                        🗑️
                      </button>

                      {/* Save as New Preset Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const newTitle = prompt('Yangi Лейко Shablon nomini kiriting:', leukoTemplateTitle);
                          if (!newTitle) return;
                          const newId = `custom-preset-${Date.now()}`;
                          const newPreset = {
                            id: newId,
                            categoryType: 'LEUKO' as const,
                            title: newTitle,
                            description: 'Foydalanuvchi tomonidan saqlangan Лейко shablon',
                            params: [...leukoParams]
                          };
                          setTemplatePresets([...templatePresets, newPreset]);
                          setSelectedLeukoPresetId(newId);
                          alert(`💾 Yangi "${newTitle}" Лейко shabloni ro'yxatga saqlandi!`);
                        }}
                        className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] shadow"
                        title="Joriy Лейко blankasini yangi tayyor shablon sifatida saqlash"
                      >
                        + Saqlash
                      </button>
                    </div>
                  </div>
                </div>
                <FullCKEditorToolbar
                  onInsertSymbol={(sym) => {
                    const newId = (leukoParams.length + 1).toString();
                    setLeukoParams([...leukoParams, { id: newId, name: `Belgi (${sym})`, unit: sym, norm: 'в норме', group: 'Гранулоциты' }]);
                  }}
                  onAddRow={() => {
                    const newId = (leukoParams.length + 1).toString();
                    setLeukoParams([...leukoParams, { id: newId, name: 'Yangi Лейко parametr', unit: '%', norm: 'в норме', group: 'Гранулоциты' }]);
                  }}
                />
              </div>

              {/* MS Word (.docx / .doc) Blanka Shablonini Yuklash Section for Leukoformula */}
              <div className="bg-slate-950/90 border border-blue-500/40 rounded-xl p-4 space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-base border border-blue-500/40 shadow-inner">
                      📄
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-xs flex items-center gap-2">
                        <span>MS Word (.docx / .doc) Лейко Формула Blanka Shablonini Yuklash</span>
                        <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded font-mono font-extrabold border border-blue-500/30">
                          LEUKO WORD UPLOADER
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                        Shaxsiy MS Word Лейко формула blankasini yuklang. Yuklangan blankalar <b>Laborant Kabineti</b> hamda <b>Rasmiy Blank</b> bo'limlarida avtomatik birikadi.
                      </p>
                    </div>
                  </div>

                  {/* File Input Upload Button */}
                  <label className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all flex-shrink-0">
                    <UploadCloud className="w-4 h-4" />
                    <span>Word Leuko Blank Yuklash</span>
                    <input
                      type="file"
                      accept=".doc,.docx,.pdf"
                      className="hidden"
                      onChange={handleWordFileUpload}
                    />
                  </label>
                </div>

                {/* List of Uploaded Word Templates */}
                {uploadedWordTemplates.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    <span className="text-[10px] text-blue-300 font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      Yuklangan Word Blanka Shabloni Fayllari ({uploadedWordTemplates.length} ta):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {uploadedWordTemplates.map((wt) => (
                        <div key={wt.id} className="bg-slate-900 border border-blue-500/40 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-mono text-blue-200 shadow-md">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="font-extrabold">{wt.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({wt.size} • {wt.uploadDate})</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteWordTemplate(wt.id)}
                            className="ml-1 text-slate-400 hover:text-rose-400 font-black p-0.5 rounded hover:bg-rose-500/20"
                            title="Faylni o'chirish"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Leukoformula Parameter Rows & Dynamic Columns Manager */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-extrabold text-slate-200 text-xs">
                    Лейко Формула Tahlil Ko'rsatkichlari Ro'yxati ({leukoParams.length} ta parametr):
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={addCustomColumn}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-3 py-1 rounded-lg text-xs flex items-center gap-1 shadow transition-all"
                      title="Jadvalga yangi input ustun qo'shish va nomini o'zgartirish"
                    >
                      <Plus className="w-3.5 h-3.5" /> + Qo'shimcha Ustun (Input) Qo'shish
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const newId = (leukoParams.length + 1).toString();
                        setLeukoParams([...leukoParams, { id: newId, name: 'Yangi Лейко ko\'rsatkich', unit: '%', norm: 'в норме', group: 'Гранулоциты' }]);
                      }}
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold px-3 py-1 rounded-lg text-xs flex items-center gap-1 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" /> + Yangi Лейко Parametr Qo'shish
                    </button>
                  </div>
                </div>

                {/* Table Editor */}
                <div className="border border-slate-800 rounded-xl overflow-x-auto bg-slate-950/70">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[10px]">
                      <tr>
                        <th className="py-2 px-3 w-10 text-center">№</th>
                        <th className="py-2 px-3">Ko'rsatkich Nomi (Показатель)</th>
                        <th className="py-2 px-3 w-28">Birligi (Ед. изм.)</th>
                        <th className="py-2 px-3">Norma (Референтные значения)</th>
                        <th className="py-2 px-3">Guruh (Подгруппа)</th>

                        {/* Dynamic Custom Column Headers with Live Renaming */}
                        {tableCustomColumns.map((col) => (
                          <th key={col.id} className="py-1 px-2 border-l border-slate-800 bg-blue-950/40 min-w-[150px]">
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={col.headerTitle}
                                onChange={(e) => updateColumnHeaderTitle(col.id, e.target.value)}
                                className="w-full bg-slate-900 border border-blue-500/50 rounded px-1.5 py-0.5 text-blue-300 font-extrabold text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-400 uppercase font-mono shadow-inner"
                                placeholder="Ustun nomini o'zgartiring..."
                              />
                              <button
                                type="button"
                                onClick={() => deleteCustomColumn(col.id)}
                                className="text-slate-400 hover:text-rose-400 font-bold px-1 rounded hover:bg-rose-500/20"
                                title="Ushbu ustunni o'chirish"
                              >
                                ✕
                              </button>
                            </div>
                          </th>
                        ))}
                        <th className="py-2 px-3 w-12 text-center">Amal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {leukoParams.map((p, idx) => (
                        <tr key={p.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-2 px-3 text-center text-slate-500 font-bold">{idx + 1}</td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={p.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                setLeukoParams(leukoParams.map(item => item.id === p.id ? { ...item, name: val } : item));
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-sans text-xs focus:border-cyan-500"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={p.unit}
                              onChange={(e) => {
                                const val = e.target.value;
                                setLeukoParams(leukoParams.map(item => item.id === p.id ? { ...item, unit: val } : item));
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300 text-xs focus:border-cyan-500"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={p.norm}
                              onChange={(e) => {
                                const val = e.target.value;
                                setLeukoParams(leukoParams.map(item => item.id === p.id ? { ...item, norm: val } : item));
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-cyan-300 font-semibold text-xs focus:border-cyan-500"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={p.group}
                              onChange={(e) => {
                                const val = e.target.value;
                                setLeukoParams(leukoParams.map(item => item.id === p.id ? { ...item, group: val } : item));
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-slate-300 text-[10px]"
                            >
                              <option value="Гранулоциты">Гранулоциты</option>
                              <option value="Агранулоциты">Агранулоциты</option>
                            </select>
                          </td>

                          {/* Editable Input Cell for each Dynamic Custom Column */}
                          {tableCustomColumns.map((col) => (
                            <td key={col.id} className="py-2 px-2 border-l border-slate-800 bg-blue-950/20">
                              <input
                                type="text"
                                placeholder={`${col.headerTitle.toLowerCase()}...`}
                                className="w-full bg-slate-900 border border-blue-500/30 rounded px-2 py-1 text-blue-200 font-sans text-xs focus:border-blue-400 focus:outline-none"
                              />
                            </td>
                          ))}
                          <td className="py-2 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => setLeukoParams(leukoParams.filter(item => item.id !== p.id))}
                              className="text-slate-400 hover:text-rose-400 font-bold p-1 rounded hover:bg-rose-500/20"
                              title="Ushbu parametrni o'chirish"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">
                ✅ Лейкоцитарная формула (Лейко формула) Blanka formati saqlashga tayyor.
              </span>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsLeukoModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Bekor qilish
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsLeukoModalOpen(false);
                    alert(`✅ Лейкоцитарная формула (Лейко формула) blanka shabloni muvaffaqiyatli saqlandi!`);
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold px-6 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                >
                  <Save className="w-4 h-4" />
                  Лейко Shablonini Saqlash
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* POPUP MODAL 6: CUSTOM TABLE BUILDER (Maxsus Jadval & Rich Text Builder) */}
      {isCustomTableModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-4xl w-full p-6 space-y-5 shadow-2xl animate-scaleIn max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span className="text-amber-400 text-lg">✏️</span>
                  Maxsus Jadval Tuzuvchi & CKEditor Blanka Shablon Muharriri
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ixtiyoriy laboratoriya tahlillari uchun o'zingizning maxsus jadvalingizni va blanka ko'rinishini yarating va sozlang.
                </p>
              </div>
              <button
                onClick={() => setIsCustomTableModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              
              {/* Full Interactive CKEditor 4 Toolbar */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2 font-bold text-slate-300">
                  <label>Blanka Sarlavhasi & Interaktiv CKEditor Muharriri:</label>
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-amber-400 font-extrabold">Название: *</span>
                    <input
                      type="text"
                      value={customTemplateTitle}
                      onChange={(e) => setCustomTemplateTitle(e.target.value)}
                      className="bg-slate-950 border border-amber-500/50 rounded px-2.5 py-1 text-white font-bold text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 min-w-[200px]"
                    />

                    {/* Preset Template Selector & Renamer */}
                    <div className="flex items-center gap-1.5 bg-slate-950 border border-amber-500/50 rounded-xl px-2 py-1 shadow-inner">
                      <span className="text-[10px] text-amber-400 font-extrabold uppercase font-mono">📋 Shablon:</span>
                      <select
                        value={selectedCustomPresetId}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          setSelectedCustomPresetId(selectedId);
                          const preset = templatePresets.find(p => p.id === selectedId);
                          if (preset) {
                            setCustomTemplateTitle(preset.title);
                            setCustomParams(preset.params);
                            alert(`✅ "${preset.title}" shabloni yuklandi!`);
                          }
                        }}
                        className="bg-slate-900 text-white font-bold text-xs border border-slate-700 rounded px-2 py-0.5 focus:outline-none focus:border-amber-400 cursor-pointer max-w-[220px] truncate"
                      >
                        <option value="">-- Shablonni Tanlang --</option>
                        {templatePresets.filter(p => p.categoryType === 'CUSTOM').map(p => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                      </select>

                      {/* Rename Selected Preset Button */}
                      <button
                        type="button"
                        onClick={() => renameTemplatePreset(selectedCustomPresetId, customTemplateTitle, setCustomTemplateTitle)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] shadow flex items-center gap-0.5"
                        title="Tanlangan shablon nomini o'zgartirish"
                      >
                        ✏️ Nomini o'zgartirish
                      </button>

                      {/* Delete Selected Preset Button */}
                      <button
                        type="button"
                        onClick={() => deleteTemplatePreset(selectedCustomPresetId, () => setSelectedCustomPresetId(''))}
                        className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 font-bold px-1.5 py-0.5 rounded text-[10px]"
                        title="Tanlangan shablonni o'chirish"
                      >
                        🗑️
                      </button>

                      {/* Save as New Preset Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const newTitle = prompt('Yangi Maxsus Shablon nomini kiriting:', customTemplateTitle);
                          if (!newTitle) return;
                          const newId = `custom-preset-${Date.now()}`;
                          const newPreset = {
                            id: newId,
                            categoryType: 'CUSTOM' as const,
                            title: newTitle,
                            description: 'Foydalanuvchi tomonidan saqlangan maxsus shablon',
                            params: [...customParams]
                          };
                          setTemplatePresets([...templatePresets, newPreset]);
                          setSelectedCustomPresetId(newId);
                          alert(`💾 Yangi "${newTitle}" Maxsus shabloni ro'yxatga saqlandi!`);
                        }}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] shadow"
                        title="Joriy Maxsus blankani yangi tayyor shablon sifatida saqlash"
                      >
                        + Saqlash
                      </button>
                    </div>
                  </div>
                </div>
                <FullCKEditorToolbar
                  onInsertSymbol={(sym) => {
                    const newId = (customParams.length + 1).toString();
                    setCustomParams([...customParams, { id: newId, name: `Maxsus belgi (${sym})`, unit: sym, norm: 'в норме', group: 'Asosiy guruh' }]);
                  }}
                  onAddRow={() => {
                    const newId = (customParams.length + 1).toString();
                    setCustomParams([...customParams, { id: newId, name: 'Yangi maxsus parametr', unit: 'ед.', norm: 'в норме', group: 'Asosiy guruh' }]);
                  }}
                />
              </div>

              {/* MS Word (.docx / .doc) Blanka Shablonini Yuklash Section */}
              <div className="bg-slate-950/90 border border-blue-500/40 rounded-xl p-4 space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-base border border-blue-500/40 shadow-inner">
                      📄
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-xs flex items-center gap-2">
                        <span>MS Word (.docx / .doc) Maxsus Blanka Shablonini Yuklash</span>
                        <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded font-mono font-extrabold border border-blue-500/30">
                          CUSTOM WORD UPLOADER
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                        Shaxsiy MS Word maxsus blankangizni yuklang. Yuklangan blankalar <b>Laborant Kabineti</b> hamda <b>Rasmiy Blank</b> bo'limlarida avtomatik birikadi.
                      </p>
                    </div>
                  </div>

                  {/* File Input Upload Button */}
                  <label className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all flex-shrink-0">
                    <UploadCloud className="w-4 h-4" />
                    <span>Word Maxsus Blank Yuklash</span>
                    <input
                      type="file"
                      accept=".doc,.docx,.pdf"
                      className="hidden"
                      onChange={handleWordFileUpload}
                    />
                  </label>
                </div>

                {/* List of Uploaded Word Templates */}
                {uploadedWordTemplates.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    <span className="text-[10px] text-blue-300 font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      Yuklangan Word Blanka Shabloni Fayllari ({uploadedWordTemplates.length} ta):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {uploadedWordTemplates.map((wt) => (
                        <div key={wt.id} className="bg-slate-900 border border-blue-500/40 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-mono text-blue-200 shadow-md">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="font-extrabold">{wt.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({wt.size} • {wt.uploadDate})</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteWordTemplate(wt.id)}
                            className="ml-1 text-slate-400 hover:text-rose-400 font-black p-0.5 rounded hover:bg-rose-500/20"
                            title="Faylni o'chirish"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Parameter Rows & Dynamic Columns Manager */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-extrabold text-slate-200 text-xs">
                    Maxsus Tahlil Ko'rsatkichlari Ro'yxati ({customParams.length} ta parametr):
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {/* Add Custom Column Button */}
                    <button
                      type="button"
                      onClick={addCustomColumn}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-3 py-1 rounded-lg text-xs flex items-center gap-1 shadow transition-all"
                      title="Jadvalga yangi input ustun qo'shish va nomini o'zgartirish"
                    >
                      <Plus className="w-3.5 h-3.5" /> + Qo'shimcha Ustun (Input) Qo'shish
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const newId = (customParams.length + 1).toString();
                        setCustomParams([...customParams, { id: newId, name: 'Yangi maxsus parametr', unit: 'ед.', norm: 'в норме', group: 'Asosiy guruh' }]);
                      }}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-3 py-1 rounded-lg text-xs flex items-center gap-1 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" /> + Yangi Parametr Qo'shish
                    </button>
                  </div>
                </div>

                {/* Table Editor */}
                <div className="border border-slate-800 rounded-xl overflow-x-auto bg-slate-950/70">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[10px]">
                      <tr>
                        <th className="py-2 px-3 w-10 text-center">№</th>
                        <th className="py-2 px-3">Ko'rsatkich Nomi (Показатель)</th>
                        <th className="py-2 px-3 w-28">Birligi (Ед. изм.)</th>
                        <th className="py-2 px-3">Norma (Референтные значения)</th>
                        <th className="py-2 px-3">Guruh (Подгруппа)</th>

                        {/* Dynamic Custom Column Headers with Live Renaming */}
                        {tableCustomColumns.map((col) => (
                          <th key={col.id} className="py-1 px-2 border-l border-slate-800 bg-blue-950/40 min-w-[150px]">
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={col.headerTitle}
                                onChange={(e) => updateColumnHeaderTitle(col.id, e.target.value)}
                                className="w-full bg-slate-900 border border-blue-500/50 rounded px-1.5 py-0.5 text-blue-300 font-extrabold text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-400 uppercase font-mono shadow-inner"
                                placeholder="Ustun nomini o'zgartiring..."
                                title="Ustun sarlavhasini tahrirlash uchun bosing"
                              />
                              <button
                                type="button"
                                onClick={() => deleteCustomColumn(col.id)}
                                className="text-slate-400 hover:text-rose-400 font-bold px-1 rounded hover:bg-rose-500/20"
                                title="Ushbu ustunni o'chirish"
                              >
                                ✕
                              </button>
                            </div>
                          </th>
                        ))}

                        <th className="py-2 px-3 w-12 text-center">Amal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {customParams.map((p, idx) => (
                        <tr key={p.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-2 px-3 text-center text-slate-500 font-bold">{idx + 1}</td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={p.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCustomParams(customParams.map(item => item.id === p.id ? { ...item, name: val } : item));
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-sans text-xs focus:border-amber-500"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={p.unit}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCustomParams(customParams.map(item => item.id === p.id ? { ...item, unit: val } : item));
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300 text-xs focus:border-amber-500"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={p.norm}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCustomParams(customParams.map(item => item.id === p.id ? { ...item, norm: val } : item));
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-amber-300 font-semibold text-xs focus:border-amber-500"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={p.group}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCustomParams(customParams.map(item => item.id === p.id ? { ...item, group: val } : item));
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300 text-xs focus:border-amber-500"
                            />
                          </td>

                          {/* Editable Input Cell for each Dynamic Custom Column */}
                          {tableCustomColumns.map((col) => (
                            <td key={col.id} className="py-2 px-2 border-l border-slate-800 bg-blue-950/20">
                              <input
                                type="text"
                                placeholder={`${col.headerTitle.toLowerCase()}...`}
                                className="w-full bg-slate-900 border border-blue-500/30 rounded px-2 py-1 text-blue-200 font-sans text-xs focus:border-blue-400 focus:outline-none"
                              />
                            </td>
                          ))}
                          <td className="py-2 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => setCustomParams(customParams.filter(item => item.id !== p.id))}
                              className="text-slate-400 hover:text-rose-400 font-bold p-1 rounded hover:bg-rose-500/20"
                              title="Ushbu parametrni o'chirish"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">
                ✅ Maxsus Jadval va Blanka shabloni saqlashga tayyor.
              </span>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCustomTableModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Bekor qilish
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCustomTableModalOpen(false);
                    alert(`✅ Maxsus Jadval va Blanka shabloni muvaffaqiyatli saqlandi!`);
                  }}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold px-6 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" />
                  Maxsus Shablonni Saqlash
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
});

