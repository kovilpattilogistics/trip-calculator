'use client';

import React from 'react';
import { useWizard } from '@/components/wizard/WizardManager';
import { Store, Truck, ChevronRight, ChevronLeft, Calendar, Zap, TruckIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { translations } from '@/lib/translations';

export function Step1TypeSelection() {
    const { data, updateData, goToNextStep, goToPreviousStep, language, toggleLanguage } = useWizard();
    const [showInfo, setShowInfo] = React.useState<string | null>(null);
    const t = translations[language];

    const handleDeliverySelect = (type: 'single' | 'multiple') => {
        updateData({ deliveryType: type });
    };

    const handleServiceSelect = (type: 'scheduled' | 'dedicated' | 'express') => {
        updateData({ serviceType: type });
    };

    const toggleInfo = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setShowInfo(showInfo === id ? null : id);
    };

    const serviceTypes = [
        {
            id: 'scheduled' as const,
            label: t.std_label,
            desc: t.std_desc,
            icon: Calendar,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            bgSolid: 'bg-blue-600',
            ring: 'ring-blue-500',
            border: 'border-blue-500',
            gradient: 'from-blue-50 to-blue-100/50',
            badge: t.std_badge,
            info: t.std_info,
        },
        {
            id: 'dedicated' as const,
            label: t.full_vehicle_label,
            desc: t.full_vehicle_desc,
            icon: TruckIcon,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            bgSolid: 'bg-orange-600',
            ring: 'ring-orange-500',
            border: 'border-orange-500',
            gradient: 'from-orange-50 to-orange-100/50',
            badge: t.full_vehicle_badge,
            info: t.full_vehicle_info,
        },
        {
            id: 'express' as const,
            label: t.urgent_label,
            desc: t.urgent_desc,
            icon: TruckIcon, // Using TruckIcon as placeholder if Zap not available or keep Zap
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            bgSolid: 'bg-purple-600',
            ring: 'ring-purple-500',
            border: 'border-purple-500',
            gradient: 'from-purple-50 to-purple-100/50',
            badge: t.urgent_badge,
            info: t.urgent_info,
        },
    ];

    return (
        <div className="flex flex-col h-full bg-gray-50 relative">
            {/* Language Toggle - Absolute Position Top Right */}
            <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2">
                <button
                    onClick={toggleLanguage}
                    className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 rounded-full px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                    <span>{language === 'en' ? '🇺🇸 EN' : '🇮🇳 தமிழ்'}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-400 font-normal">{language === 'en' ? 'தமிழ்' : 'English'}</span>
                </button>

                {/* Floating Prompt - Moving Animation */}
                <div
                    onClick={toggleLanguage}
                    className="cursor-pointer bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg animate-bounce hover:scale-105 transition-transform"
                >
                    {t.switch_promo}
                </div>
            </div>

            {/* Header */}
            <div className="bg-white px-6 py-4 shadow-sm z-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600" />
                <div className="flex items-center justify-between mb-2">
                    <button onClick={goToPreviousStep} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step 1 of 4</span>
                    <div className="w-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 leading-tight pr-16">
                    {t.step1_title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{t.step1_subtitle}</p>
            </div>

            <div className="flex-1 p-6 space-y-8 overflow-y-auto">

                {/* Delivery Type */}
                <section>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block flex items-center gap-2">
                        {t.trip_type_label}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Direct Trip */}
                        <button
                            onClick={() => handleDeliverySelect('single')}
                            className={clsx(
                                'flex flex-col text-left bg-white p-4 rounded-2xl shadow-sm border-2 transition-all duration-300 relative overflow-hidden',
                                data.deliveryType === 'single'
                                    ? 'border-[var(--primary)] bg-green-50/50 shadow-md ring-1 ring-[var(--primary)] scale-[1.02]'
                                    : 'border-transparent hover:border-gray-200 hover:shadow-md'
                            )}
                        >
                            {data.deliveryType === 'single' && <div className="absolute top-0 right-0 w-8 h-8 bg-[var(--primary)] -mr-4 -mt-4 rotate-45" />}
                            <div className={clsx(
                                "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors",
                                data.deliveryType === 'single' ? "bg-[var(--primary)] text-white" : "bg-gray-100 text-gray-400"
                            )}>
                                <Store className="w-6 h-6" />
                            </div>
                            <h3 className={clsx("font-bold text-base leading-tight", data.deliveryType === 'single' ? "text-[var(--primary)]" : "text-gray-900")}>
                                {t.direct_trip_label}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">{t.direct_trip_desc}</p>
                        </button>

                        {/* Multi-Stop */}
                        <button
                            onClick={() => handleDeliverySelect('multiple')}
                            className={clsx(
                                'flex flex-col text-left bg-white p-4 rounded-2xl shadow-sm border-2 transition-all duration-300 relative overflow-hidden',
                                data.deliveryType === 'multiple'
                                    ? 'border-[var(--primary)] bg-green-50/50 shadow-md ring-1 ring-[var(--primary)] scale-[1.02]'
                                    : 'border-transparent hover:border-gray-200 hover:shadow-md'
                            )}
                        >
                            {data.deliveryType === 'multiple' && <div className="absolute top-0 right-0 w-8 h-8 bg-[var(--primary)] -mr-4 -mt-4 rotate-45" />}
                            <div className={clsx(
                                "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors",
                                data.deliveryType === 'multiple' ? "bg-[var(--primary)] text-white" : "bg-gray-100 text-gray-400"
                            )}>
                                <Truck className="w-6 h-6" />
                            </div>
                            <h3 className={clsx("font-bold text-base leading-tight", data.deliveryType === 'multiple' ? "text-[var(--primary)]" : "text-gray-900")}>
                                {t.multi_stop_label}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">{t.multi_stop_desc}</p>
                        </button>
                    </div>
                </section>

                {/* Service Type */}
                <section>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block flex items-center gap-2">
                        {t.service_level_label}
                    </label>
                    <div className="space-y-3">
                        {serviceTypes.map((svc) => {
                            const Icon = svc.icon;
                            // Fix for Zap icon mapping if needed, otherwise rely on import
                            const ValidIcon = Icon === Zap ? Zap : Icon;

                            const isSelected = data.serviceType === svc.id;
                            const isInfoOpen = showInfo === svc.id;

                            return (
                                <div key={svc.id}>
                                    <button
                                        onClick={() => handleServiceSelect(svc.id)}
                                        className={clsx(
                                            'w-full text-left bg-white p-4 rounded-2xl shadow-sm border-2 transition-all duration-300 relative group',
                                            isSelected
                                                ? `${svc.border} bg-gradient-to-r ${svc.gradient} shadow-md ring-1 ${svc.ring}`
                                                : 'border-transparent hover:border-gray-200 hover:shadow-md'
                                        )}
                                    >
                                        {/* Badge */}
                                        {svc.badge && (
                                            <div className="absolute top-0 right-0 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg shadow-sm z-10">
                                                {svc.badge}
                                            </div>
                                        )}

                                        <div className="flex items-start gap-4">
                                            <div className={clsx(
                                                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all shadow-sm",
                                                isSelected ? `${svc.bgSolid} text-white` : "bg-gray-100 text-gray-400"
                                            )}>
                                                <ValidIcon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0 pt-0.5">
                                                <div className="flex items-center gap-2">
                                                    <h3 className={clsx("font-bold text-base", isSelected ? svc.color : "text-gray-900")}>
                                                        {svc.label}
                                                    </h3>
                                                    <div
                                                        role="button"
                                                        onClick={(e) => toggleInfo(e, svc.id)}
                                                        className="text-gray-300 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                                    >
                                                        <span className="text-xs border border-gray-300 rounded-full w-4 h-4 flex items-center justify-center font-serif italic">i</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500 leading-tight mt-1">{svc.desc}</p>
                                            </div>
                                            {isSelected && (
                                                <div className={clsx("w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md self-center", svc.bgSolid)}>
                                                    ✓
                                                </div>
                                            )}
                                        </div>
                                    </button>

                                    {/* Inline Info Expansion */}
                                    {isInfoOpen && (
                                        <div className="mt-2 mx-2 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <span className="text-lg">💡</span>
                                            <p>{svc.info}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white border-t border-gray-100">
                <button
                    onClick={goToNextStep}
                    disabled={!data.deliveryType}
                    className={clsx(
                        'w-full flex items-center justify-center gap-2 py-4 rounded-xl text-lg font-bold transition-all shadow-md',
                        data.deliveryType
                            ? 'bg-gradient-to-r from-[var(--primary)] to-emerald-600 text-white hover:from-[#1b5e20] hover:to-emerald-700 transform active:scale-95 shadow-green-200/50'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                    )}
                >
                    {t.continue_btn}
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
