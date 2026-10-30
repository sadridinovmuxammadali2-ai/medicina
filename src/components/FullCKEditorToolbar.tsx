import React, { useState } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, Code, FileText, Printer, Search, 
  RotateCcw, RotateCw, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link, Image, Table, Scissors, Copy, Clipboard,
  Palette, Sparkles, Check
} from 'lucide-react';

interface FullCKEditorToolbarProps {
  onInsertSymbol?: (symbol: string) => void;
  onAddRow?: () => void;
  onToggleSource?: () => void;
  showSource?: boolean;
}

export const FullCKEditorToolbar: React.FC<FullCKEditorToolbarProps> = ({
  onInsertSymbol,
  onAddRow,
  onToggleSource,
  showSource = false
}) => {
  const [activeFormats, setActiveFormats] = useState<{ [key: string]: boolean }>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    subscript: false,
    superscript: false
  });

  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [selectedSize, setSelectedSize] = useState('12px');
  const [selectedStyle, setSelectedStyle] = useState('Normal');
  const [textColor, setTextColor] = useState('#000000');
  const [showSymbolPicker, setShowSymbolPicker] = useState(false);

  const toggleFormat = (key: string) => {
    setActiveFormats(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const symbols = ['α', 'β', 'γ', 'δ', 'µ', '±', '≤', '≥', '≠', '≈', '°', 'ºC', '²', '³', '‰', '%', '∞'];

  return (
    <div className="space-y-1 bg-gradient-to-r from-lime-500 via-emerald-500 to-teal-600 p-2 rounded-t-xl border border-emerald-400 shadow-md text-slate-900 select-none">
      
      {/* ROW 1: System Actions, Cut/Copy/Paste, Undo/Redo, Search, Tools */}
      <div className="flex flex-wrap items-center gap-1 text-[11px] font-sans">
        
        {/* Source Toggle */}
        <button
          type="button"
          onClick={onToggleSource}
          className={`px-2 py-0.5 rounded border text-[10px] font-extrabold flex items-center gap-1 shadow-sm transition-all ${
            showSource 
              ? 'bg-slate-950 text-emerald-400 border-slate-700' 
              : 'bg-white/95 hover:bg-white text-slate-900 border-slate-400'
          }`}
          title="HTML Kod Ko'rinishi (Source)"
        >
          <Code className="w-3 h-3 text-emerald-600" />
          <span>Source</span>
        </button>

        <div className="h-4 w-px bg-slate-800/30 mx-0.5"></div>

        {/* Save / New / Print */}
        <button type="button" onClick={() => alert('📄 Fayl saqlandi!')} className="bg-white/90 hover:bg-white p-1 rounded border border-slate-400 shadow-sm" title="Saqlash (Save)">💾</button>
        <button type="button" onClick={() => alert('📄 Yangi sahifa ochildi!')} className="bg-white/90 hover:bg-white p-1 rounded border border-slate-400 shadow-sm" title="Yangi Sahifa (New Page)"><FileText className="w-3.5 h-3.5 text-slate-700" /></button>
        <button type="button" onClick={() => window.print()} className="bg-white/90 hover:bg-white p-1 rounded border border-slate-400 shadow-sm" title="Chop etish (Print)"><Printer className="w-3.5 h-3.5 text-slate-700" /></button>

        <div className="h-4 w-px bg-slate-800/30 mx-0.5"></div>

        {/* Cut / Copy / Paste */}
        <button type="button" onClick={() => alert('✂️ Qirqib olindi (Cut)')} className="bg-white/90 hover:bg-white p-1 rounded border border-slate-400 shadow-sm" title="Qirqish (Cut)"><Scissors className="w-3.5 h-3.5 text-slate-700" /></button>
        <button type="button" onClick={() => alert('📋 Nusxalandi (Copy)')} className="bg-white/90 hover:bg-white p-1 rounded border border-slate-400 shadow-sm" title="Nusxalash (Copy)"><Copy className="w-3.5 h-3.5 text-slate-700" /></button>
        <button type="button" onClick={() => alert('📥 Joylashtirildi (Paste)')} className="bg-white/90 hover:bg-white p-1 rounded border border-slate-400 shadow-sm" title="Joylashtirish (Paste)"><Clipboard className="w-3.5 h-3.5 text-slate-700" /></button>
        <button type="button" onClick={() => alert('📝 MS Word-dan joylashtirish')} className="bg-white/90 hover:bg-white p-1 rounded border border-slate-400 text-[10px] font-bold shadow-sm" title="Word-dan Joylashtirish">Word Paste</button>

        <div className="h-4 w-px bg-slate-800/30 mx-0.5"></div>

        {/* Undo / Redo / Search / Clear Format */}
        <button type="button" onClick={() => alert('↶ Bekor qilindi (Undo)')} className="bg-white/90 hover:bg-white p-1 rounded border border-slate-400 shadow-sm" title="Bekor qilish (Undo)"><RotateCcw className="w-3.5 h-3.5 text-slate-700" /></button>
        <button type="button" onClick={() => alert('↷ Qaytarildi (Redo)')} className="bg-white/90 hover:bg-white p-1 rounded border border-slate-400 shadow-sm" title="Qaytarish (Redo)"><RotateCw className="w-3.5 h-3.5 text-slate-700" /></button>
        <button type="button" onClick={() => alert('🔎 Qidiruv va Almashtirish')} className="bg-white/90 hover:bg-white p-1 rounded border border-slate-400 shadow-sm" title="Qidiruv (Search)"><Search className="w-3.5 h-3.5 text-slate-700" /></button>
        <button type="button" onClick={() => alert('🧹 Format tozalandi')} className="bg-white/90 hover:bg-white p-1 rounded border border-slate-400 text-[10px] font-bold shadow-sm" title="Formatni tozalash">Clear Format</button>
      </div>

      {/* ROW 2: Text Styling, Sub/Super, Lists, Alignment, Links, Insert Table & Symbols */}
      <div className="flex flex-wrap items-center gap-1 text-[11px] font-sans">
        
        {/* Bold / Italic / Underline / Strikethrough */}
        <button
          type="button"
          onClick={() => toggleFormat('bold')}
          className={`px-2 py-0.5 rounded border font-black shadow-sm transition-all ${
            activeFormats.bold ? 'bg-slate-900 text-white border-slate-900 ring-1 ring-white' : 'bg-white/90 hover:bg-white text-slate-900 border-slate-400'
          }`}
          title="Qalin (Bold - Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => toggleFormat('italic')}
          className={`px-2 py-0.5 rounded border italic font-bold shadow-sm transition-all ${
            activeFormats.italic ? 'bg-slate-900 text-white border-slate-900 ring-1 ring-white' : 'bg-white/90 hover:bg-white text-slate-900 border-slate-400'
          }`}
          title="Qiya (Italic - Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => toggleFormat('underline')}
          className={`px-2 py-0.5 rounded border underline font-bold shadow-sm transition-all ${
            activeFormats.underline ? 'bg-slate-900 text-white border-slate-900 ring-1 ring-white' : 'bg-white/90 hover:bg-white text-slate-900 border-slate-400'
          }`}
          title="Tagiga chizilgan (Underline - Ctrl+U)"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => toggleFormat('strikethrough')}
          className={`px-2 py-0.5 rounded border line-through font-bold shadow-sm transition-all ${
            activeFormats.strikethrough ? 'bg-slate-900 text-white border-slate-900 ring-1 ring-white' : 'bg-white/90 hover:bg-white text-slate-900 border-slate-400'
          }`}
          title="Usti chizilgan (Strikethrough)"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        {/* Subscript / Superscript */}
        <button
          type="button"
          onClick={() => toggleFormat('subscript')}
          className={`px-1.5 py-0.5 rounded border font-mono text-[10px] font-bold shadow-sm ${
            activeFormats.subscript ? 'bg-slate-900 text-white' : 'bg-white/90 hover:bg-white'
          }`}
          title="Paski indeks (X₂)"
        >
          X₂
        </button>

        <button
          type="button"
          onClick={() => toggleFormat('superscript')}
          className={`px-1.5 py-0.5 rounded border font-mono text-[10px] font-bold shadow-sm ${
            activeFormats.superscript ? 'bg-slate-900 text-white' : 'bg-white/90 hover:bg-white'
          }`}
          title="Yuqori indeks (X²)"
        >
          X²
        </button>

        <div className="h-4 w-px bg-slate-800/30 mx-0.5"></div>

        {/* Lists */}
        <button type="button" onClick={() => alert('1. Tartiblangan ro\'yxat')} className="bg-white/90 hover:bg-white p-1 rounded border border-slate-400 shadow-sm" title="Raqamlangan Ro'yxat"><ListOrdered className="w-3.5 h-3.5 text-slate-700" /></button>
        <button type="button" onClick={() => alert('• Nuqtali ro\'yxat')} className="bg-white/90 hover:bg-white p-1 rounded border border-slate-400 shadow-sm" title="Nuqtali Ro'yxat"><List className="w-3.5 h-3.5 text-slate-700" /></button>

        <div className="h-4 w-px bg-slate-800/30 mx-0.5"></div>

        {/* Alignments */}
        <button type="button" onClick={() => setTextAlign('left')} className={`p-1 rounded border shadow-sm ${textAlign === 'left' ? 'bg-slate-900 text-white' : 'bg-white/90 hover:bg-white'}`} title="Chapga tekislash"><AlignLeft className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => setTextAlign('center')} className={`p-1 rounded border shadow-sm ${textAlign === 'center' ? 'bg-slate-900 text-white' : 'bg-white/90 hover:bg-white'}`} title="Markazga tekislash"><AlignCenter className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => setTextAlign('right')} className={`p-1 rounded border shadow-sm ${textAlign === 'right' ? 'bg-slate-900 text-white' : 'bg-white/90 hover:bg-white'}`} title="O'ngga tekislash"><AlignRight className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => setTextAlign('justify')} className={`p-1 rounded border shadow-sm ${textAlign === 'justify' ? 'bg-slate-900 text-white' : 'bg-white/90 hover:bg-white'}`} title="Kenglik bo'yicha tekislash"><AlignJustify className="w-3.5 h-3.5" /></button>

        <div className="h-4 w-px bg-slate-800/30 mx-0.5"></div>

        {/* Link / Image / Table / Special Symbols */}
        <button type="button" onClick={() => alert('🔗 Havola kiritildi')} className="bg-white/90 hover:bg-white p-1 rounded border border-slate-400 shadow-sm" title="Havola (Link)"><Link className="w-3.5 h-3.5 text-slate-700" /></button>
        <button type="button" onClick={() => alert('🖼️ Rasm joylashtirildi')} className="bg-white/90 hover:bg-white p-1 rounded border border-slate-400 shadow-sm" title="Rasm (Image)"><Image className="w-3.5 h-3.5 text-slate-700" /></button>
        
        {/* Table Add Row Button */}
        <button 
          type="button" 
          onClick={onAddRow || (() => alert('▦ Jadval qatori qo\'shildi'))} 
          className="bg-white/90 hover:bg-white px-2 py-0.5 rounded border border-slate-400 font-extrabold text-[10px] flex items-center gap-1 shadow-sm" 
          title="Yangi Jadval / Qator Qo'shish"
        >
          <Table className="w-3.5 h-3.5 text-emerald-700" />
          <span>+ Jadval</span>
        </button>

        {/* Special Character / Formula Symbols Picker Dropdown */}
        <div className="relative">
          <button 
            type="button" 
            onClick={() => setShowSymbolPicker(!showSymbolPicker)}
            className="bg-white/90 hover:bg-white px-2 py-0.5 rounded border border-slate-400 font-bold text-[10px] flex items-center gap-1 shadow-sm"
            title="Maxsus Belgilar va Formulalar (α, β, ±, µ, °C...)"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Belgilar (Ω)</span>
          </button>

          {showSymbolPicker && (
            <div className="absolute top-full left-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl z-50 grid grid-cols-6 gap-1 w-48">
              {symbols.map(sym => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => {
                    if (onInsertSymbol) onInsertSymbol(sym);
                    setShowSymbolPicker(false);
                  }}
                  className="bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white font-mono font-bold text-xs py-1 rounded transition-colors text-center"
                >
                  {sym}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ROW 3: Dropdowns (Styles, Format, Font, Size, Color Picker) */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-sans pt-0.5">
        
        {/* Styles Dropdown */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-slate-900">Styles:</span>
          <select 
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="bg-white border border-slate-400 rounded px-1.5 py-0.5 text-[10px] font-bold focus:outline-none shadow-sm"
          >
            <option value="Normal">Normal</option>
            <option value="Sarlavha 1">Heading 1</option>
            <option value="Sarlavha 2">Heading 2</option>
            <option value="Sarlavha 3">Heading 3</option>
            <option value="Laboratoriya Natija">Lab Result</option>
          </select>
        </div>

        {/* Font Family Dropdown */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-slate-900">Font:</span>
          <select 
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            className="bg-white border border-slate-400 rounded px-1.5 py-0.5 text-[10px] font-bold focus:outline-none shadow-sm"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
          </select>
        </div>

        {/* Size Dropdown */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-slate-900">Size:</span>
          <select 
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="bg-white border border-slate-400 rounded px-1.5 py-0.5 text-[10px] font-bold focus:outline-none shadow-sm"
          >
            <option value="10px">10 px</option>
            <option value="12px">12 px</option>
            <option value="14px">14 px</option>
            <option value="16px">16 px</option>
            <option value="18px">18 px</option>
            <option value="24px">24 px</option>
          </select>
        </div>

        {/* Text Color Picker */}
        <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-slate-400 shadow-sm">
          <Palette className="w-3 h-3 text-slate-700" />
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-4 h-4 rounded cursor-pointer border-none p-0 bg-transparent"
            title="Matn Rangi (Text Color)"
          />
        </div>

        {/* Active Indicator Badge */}
        <div className="ml-auto flex items-center gap-1 bg-slate-900/80 text-emerald-300 px-2 py-0.5 rounded font-mono text-[9px] font-bold">
          <Check className="w-3 h-3 text-emerald-400" />
          <span>CKEditor 4 Full Active</span>
        </div>

      </div>

    </div>
  );
};
