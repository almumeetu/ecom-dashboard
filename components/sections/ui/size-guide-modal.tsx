'use client';

import { useState } from 'react';
import { IoCloseOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { LuRuler } from 'react-icons/lu';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export default function SizeGuideModal({
  isOpen,
  onClose,
  category = '',
}: SizeGuideModalProps) {
  const isFootwear = category.toLowerCase().includes('footwear') || category.toLowerCase().includes('shoe');
  const [activeTab, setActiveTab] = useState<'footwear' | 'men' | 'women'>(
    isFootwear ? 'footwear' : 'men'
  );
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
              <LuRuler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 font-sans tracking-tight">
                Size & Fit Guide
              </h3>
              <p className="text-xs text-zinc-500">
                Standard international measurements to find your perfect fit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-stone-200 text-zinc-500 hover:text-zinc-900 hover:bg-stone-100 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close size guide"
          >
            <IoCloseOutline className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs & Unit Toggle */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-stone-100 bg-white">
          <div className="flex gap-1.5 p-1 bg-stone-100 rounded-xl">
            <button
              onClick={() => setActiveTab('footwear')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'footwear'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Footwear
            </button>
            <button
              onClick={() => setActiveTab('men')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'men'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Men's Apparel
            </button>
            <button
              onClick={() => setActiveTab('women')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'women'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Women's Apparel
            </button>
          </div>

          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <span>Unit:</span>
            <button
              onClick={() => setUnit('cm')}
              className={`px-2 py-1 rounded font-semibold cursor-pointer ${
                unit === 'cm' ? 'bg-zinc-900 text-white' : 'hover:text-zinc-900'
              }`}
            >
              CM
            </button>
            <span>/</span>
            <button
              onClick={() => setUnit('in')}
              className={`px-2 py-1 rounded font-semibold cursor-pointer ${
                unit === 'in' ? 'bg-zinc-900 text-white' : 'hover:text-zinc-900'
              }`}
            >
              IN
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-zinc-700">
          {activeTab === 'footwear' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-zinc-900 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">EU</th>
                      <th className="px-4 py-3">US Men</th>
                      <th className="px-4 py-3">US Women</th>
                      <th className="px-4 py-3">UK</th>
                      <th className="px-4 py-3">{unit === 'cm' ? 'Foot Length (cm)' : 'Foot Length (in)'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {[
                      { eu: '39', usM: '6.5', usW: '8.0', uk: '6.0', cm: '24.5', in: '9.6' },
                      { eu: '40', usM: '7.0', usW: '8.5', uk: '6.5', cm: '25.0', in: '9.8' },
                      { eu: '41', usM: '8.0', usW: '9.5', uk: '7.5', cm: '26.0', in: '10.2' },
                      { eu: '42', usM: '8.5', usW: '10.0', uk: '8.0', cm: '26.5', in: '10.4' },
                      { eu: '43', usM: '9.5', usW: '11.0', uk: '9.0', cm: '27.5', in: '10.8' },
                      { eu: '44', usM: '10.0', usW: '11.5', uk: '9.5', cm: '28.0', in: '11.0' },
                      { eu: '45', usM: '11.0', usW: '12.5', uk: '10.5', cm: '29.0', in: '11.4' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-stone-50/60 transition-colors">
                        <td className="px-4 py-2.5 font-bold text-zinc-900">{row.eu}</td>
                        <td className="px-4 py-2.5">{row.usM}</td>
                        <td className="px-4 py-2.5">{row.usW}</td>
                        <td className="px-4 py-2.5">{row.uk}</td>
                        <td className="px-4 py-2.5 font-medium text-emerald-700">{unit === 'cm' ? row.cm : row.in}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                  <IoCheckmarkCircleOutline className="w-4 h-4 text-emerald-600" />
                  How to Measure Foot Length:
                </div>
                <p className="text-zinc-600">
                  Stand on a piece of paper with your heel against the wall. Mark the longest toe on the paper and measure the distance from the wall to the mark. If between sizes, we recommend sizing up.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'men' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-zinc-900 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">{unit === 'cm' ? 'Chest (cm)' : 'Chest (in)'}</th>
                      <th className="px-4 py-3">{unit === 'cm' ? 'Waist (cm)' : 'Waist (in)'}</th>
                      <th className="px-4 py-3">{unit === 'cm' ? 'Hips (cm)' : 'Hips (in)'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {[
                      { size: 'S', chestCm: '88-94', chestIn: '35-37', waistCm: '76-81', waistIn: '30-32', hipsCm: '89-94', hipsIn: '35-37' },
                      { size: 'M', chestCm: '95-102', chestIn: '38-40', waistCm: '82-87', waistIn: '33-35', hipsCm: '95-102', hipsIn: '38-40' },
                      { size: 'L', chestCm: '103-110', chestIn: '41-43', waistCm: '88-95', waistIn: '36-38', hipsCm: '103-110', hipsIn: '41-43' },
                      { size: 'XL', chestCm: '111-118', chestIn: '44-46', waistCm: '96-103', waistIn: '39-41', hipsCm: '111-118', hipsIn: '44-46' },
                      { size: 'XXL', chestCm: '119-126', chestIn: '47-50', waistCm: '104-112', waistIn: '42-44', hipsCm: '119-126', hipsIn: '47-50' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-stone-50/60 transition-colors">
                        <td className="px-4 py-2.5 font-bold text-zinc-900">{row.size}</td>
                        <td className="px-4 py-2.5">{unit === 'cm' ? row.chestCm : row.chestIn}</td>
                        <td className="px-4 py-2.5">{unit === 'cm' ? row.waistCm : row.waistIn}</td>
                        <td className="px-4 py-2.5">{unit === 'cm' ? row.hipsCm : row.hipsIn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'women' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-zinc-900 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">UK / BD</th>
                      <th className="px-4 py-3">{unit === 'cm' ? 'Bust (cm)' : 'Bust (in)'}</th>
                      <th className="px-4 py-3">{unit === 'cm' ? 'Waist (cm)' : 'Waist (in)'}</th>
                      <th className="px-4 py-3">{unit === 'cm' ? 'Hips (cm)' : 'Hips (in)'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {[
                      { size: 'XS', uk: '6', bustCm: '78-82', bustIn: '31-32', waistCm: '60-64', waistIn: '24-25', hipsCm: '86-90', hipsIn: '34-35' },
                      { size: 'S', uk: '8-10', bustCm: '83-88', bustIn: '33-35', waistCm: '65-70', waistIn: '26-28', hipsCm: '91-96', hipsIn: '36-38' },
                      { size: 'M', uk: '12', bustCm: '89-94', bustIn: '36-37', waistCm: '71-76', waistIn: '29-30', hipsCm: '97-102', hipsIn: '39-40' },
                      { size: 'L', uk: '14-16', bustCm: '95-101', bustIn: '38-40', waistCm: '77-83', waistIn: '31-33', hipsCm: '103-109', hipsIn: '41-43' },
                      { size: 'XL', uk: '18', bustCm: '102-109', bustIn: '41-43', waistCm: '84-90', waistIn: '34-36', hipsCm: '110-116', hipsIn: '44-46' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-stone-50/60 transition-colors">
                        <td className="px-4 py-2.5 font-bold text-zinc-900">{row.size}</td>
                        <td className="px-4 py-2.5">{row.uk}</td>
                        <td className="px-4 py-2.5">{unit === 'cm' ? row.bustCm : row.bustIn}</td>
                        <td className="px-4 py-2.5">{unit === 'cm' ? row.waistCm : row.waistIn}</td>
                        <td className="px-4 py-2.5">{unit === 'cm' ? row.hipsCm : row.hipsIn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            Need custom fitting advice? Contact our customer support team anytime.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
