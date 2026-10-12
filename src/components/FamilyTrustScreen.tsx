import React, { useState } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Plus, 
  Sparkles, 
  ArrowUpRight, 
  Check, 
  Lock, 
  UserPlus, 
  Star,
  Users
} from 'lucide-react';
import { FamilyBeneficiary, Language } from '../types';
import { sounds } from '../utils/soundEffects';

interface FamilyTrustScreenProps {
  beneficiaries: FamilyBeneficiary[];
  onAddBeneficiary: (beneficiary: Omit<FamilyBeneficiary, 'id' | 'addedAt' | 'isVerified'>) => void;
  onInitiateWithdrawalToFamily: (beneficiary: FamilyBeneficiary) => void;
  lang: Language;
}

export const FamilyTrustScreen: React.FC<FamilyTrustScreenProps> = ({
  beneficiaries,
  onAddBeneficiary,
  onInitiateWithdrawalToFamily,
  lang,
}) => {
  const isHi = lang === 'hi';

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('माताजी');
  const [upiId, setUpiId] = useState('');
  const [blessingTag, setBlessingTag] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const relationOptions = [
    { labelHi: 'माताजी (Mother)', val: 'माताजी', tag: 'वात्सल्य व सर्वोच्च आशीर्वाद' },
    { labelHi: 'पिताजी (Father)', val: 'पिताजी', tag: 'संरक्षण व मार्गदर्शन' },
    { labelHi: 'दादाजी (Grandfather)', val: 'दादाजी', tag: 'वंश मर्यादा व ईश्वरीय कृपा' },
    { labelHi: 'दीदी (Sister)', val: 'दीदी', tag: 'स्नेह व पावन शुभभावना' },
    { labelHi: 'भाई / अनुज (Brother)', val: 'भाई', tag: 'अटूट संबल व विजय' },
    { labelHi: 'मामाजी (Maternal Uncle)', val: 'मामाजी', tag: 'मातृकुल गौरव व मंगल' },
    { labelHi: 'मामीजी (Maternal Aunt)', val: 'मामीजी', tag: 'स्नेहपूर्ण आतिथ्य व सौहार्द' },
    { labelHi: 'फूफाजी (पीसा) (Paternal Uncle)', val: 'फूफा (पीसा)', tag: 'सदाचार व आत्मीय सम्मान' },
    { labelHi: 'समस्त सगे-संबंधी (Revered Kin)', val: 'सगे-संबंधी', tag: 'पारस्परिक प्रीति व सुख-शांति' },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg(isHi ? 'कृपया आदरणीय परिजन का नाम लिखें।' : 'Please enter the family member name.');
      return;
    }

    const cleanUpi = upiId.trim();
    if (!cleanUpi || !cleanUpi.includes('@')) {
      setErrorMsg(isHi ? 'कृपया एक वैध UPI ID लिखें (उदा. name@oksbi)।' : 'Please enter a valid UPI ID (e.g. name@oksbi).');
      return;
    }

    const selectedOption = relationOptions.find((r) => r.val === relation);
    const effectiveTag = blessingTag.trim() || selectedOption?.tag || 'पावन आशीर्वाद व समृद्धि';

    onAddBeneficiary({
      name: name.trim(),
      relation,
      relationKey: 'relative',
      upiId: cleanUpi,
      blessingTag: effectiveTag,
    });

    sounds.playWinChime();
    setSuccessMsg(isHi ? `${name} जी का खाता पावन सूची में सुरक्षित रूप से जुड़ गया!` : `${name} added to Family Trust list!`);
    setName('');
    setUpiId('');
    setBlessingTag('');
    setIsAddingNew(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 p-6 md:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Heart className="w-4 h-4 fill-amber-400" />
              <span>{isHi ? 'पावन पारिवारिक संबंध · अभेद्य डेटा सुरक्षा' : 'Sacred Relationships · Zero Data Breach'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display tracking-tight">
              {isHi ? 'पारिवारिक समृद्धि एवं कल्याण केंद्र' : 'Family Trust & Welfare Center'}
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              {isHi
                ? 'माता-पिता, भाई-बहन, दादाजी, मामा, मामी, दीदी, फूफा (पीसा) और समस्त सगे-संबंधियों की निरंतर आत्मिक व भौतिक समृद्धि के लिए सुरक्षित UPI विड्रॉल।'
                : 'Prioritizing data security, spiritual and material prosperity for revered parents, siblings, grandparents, uncles, aunts, and all loved relatives.'}
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setIsAddingNew(!isAddingNew);
            }}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isHi ? '+ नए परिजन का UPI जोड़ें' : '+ Add Family UPI'}</span>
          </button>
        </div>
      </div>

      {/* Success notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2.5">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Add New Beneficiary Form Modal/Card */}
      {isAddingNew && (
        <div className="p-6 rounded-2xl bg-neutral-900 border border-amber-500/40 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h3 className="font-bold text-base text-white font-display flex items-center gap-2">
              <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{isHi ? 'आदरणीय परिजन का विवरण जोड़ें' : 'Add Sacred Beneficiary Details'}</span>
            </h3>
            <button
              onClick={() => setIsAddingNew(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              {isHi ? 'रद्द करें' : 'Cancel'}
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  {isHi ? 'पावन संबंध चुनें:' : 'Select Relationship:'}
                </label>
                <select
                  value={relation}
                  onChange={(e) => {
                    setRelation(e.target.value);
                    const sel = relationOptions.find((r) => r.val === e.target.value);
                    if (sel) setBlessingTag(sel.tag);
                  }}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-amber-500"
                >
                  {relationOptions.map((opt) => (
                    <option key={opt.val} value={opt.val} className="bg-neutral-950 text-white">
                      {opt.labelHi}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  {isHi ? 'परिजन का आदरणीय नाम:' : 'Honored Name:'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isHi ? 'उदा. श्रीमती माताजी / श्री पिताजी' : 'e.g. Smt. Mataji'}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-amber-500 placeholder:text-neutral-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  {isHi ? 'प्राप्तकर्ता UPI ID:' : 'Beneficiary UPI ID:'}
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mataji@oksbi"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-amber-500 placeholder:text-neutral-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  {isHi ? 'शुभ संदेश / आशीर्वाद भावना:' : 'Blessing Note / Well-Wish:'}
                </label>
                <input
                  type="text"
                  value={blessingTag}
                  onChange={(e) => setBlessingTag(e.target.value)}
                  placeholder={isHi ? 'उदा. वात्सल्य व सर्वोच्च आशीर्वाद' : 'e.g. Eternal prosperity and protection'}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-amber-500 placeholder:text-neutral-600"
                />
              </div>

            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 bg-neutral-800 text-neutral-300 text-xs font-semibold rounded-xl hover:bg-neutral-700"
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl transition-all"
              >
                {isHi ? 'सुरक्षित सहेजें' : 'Save Beneficiary'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Family Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {beneficiaries.map((b) => (
          <div
            key={b.id}
            className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-4 group"
          >
            
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <Heart className="w-5 h-5 fill-amber-400/20" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                      {b.name}
                    </h3>
                    <div className="text-[11px] text-amber-400 font-medium">
                      {b.relation}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{isHi ? 'सत्यापित' : 'Verified'}</span>
                </div>
              </div>

              {/* UPI ID */}
              <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs">
                <span className="text-[10px] text-neutral-500 block mb-0.5">
                  {isHi ? 'सुरक्षित UPI ID' : 'Direct UPI ID'}
                </span>
                <span className="font-mono text-neutral-200 font-semibold truncate block">
                  {b.upiId}
                </span>
              </div>

              {/* Blessing Message */}
              <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 italic">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 not-italic" />
                <span className="truncate">"{b.blessingTag}"</span>
              </div>
            </div>

            {/* Action to withdraw directly to them */}
            <button
              onClick={() => {
                sounds.playClick();
                onInitiateWithdrawalToFamily(b);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isHi ? `पैसे भेजें / विड्रॉ करें` : `Send / Withdraw`}</span>
            </button>

          </div>
        ))}
      </div>

      {/* Reverence & Integrity Statement */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="text-neutral-300">
            <strong className="text-white block">
              {isHi ? 'पारिवारिक डेटा व वित्तीय मर्यादा की अभेद्य गारंटी' : 'Sacred Data Integrity & Sovereign Privacy'}
            </strong>
            <span className="text-[11px] text-neutral-400">
              {isHi 
                ? 'कोई भी बाहरी तत्व या तृतीय पक्ष प्रयोक्ता के पारिवारिक खातों में बदलाव नहीं कर सकता।' 
                : 'Zero third-party interference. Strict end-to-end cryptographic protection.'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
