'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle, MapPin, Sparkles, Truck, Shield, Leaf } from 'lucide-react';
import { useWizard } from '@/components/wizard/WizardManager';
import { translations } from '@/lib/translations';

export function Step0Landing() {
    const { goToNextStep, language, toggleLanguage } = useWizard();
    const t = translations[language];

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-green-50 via-white to-white relative overflow-hidden">
            {/* Language Toggle */}
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

            {/* Decorative background circles */}
            <div className="absolute top-[-60px] right-[-60px] w-48 h-48 rounded-full bg-green-100/50 blur-2xl" />
            <div className="absolute bottom-[30%] left-[-40px] w-32 h-32 rounded-full bg-emerald-100/40 blur-xl" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-5 relative z-10">
                {/* Logo with glow */}
                <div className="relative w-36 h-36 mb-2">
                    <div className="absolute inset-0 bg-green-200/30 rounded-full blur-xl animate-pulse" />
                    <Image
                        src="/trip-calculator/logo.png"
                        alt="EcoExpress Logo"
                        fill
                        className="object-contain drop-shadow-lg relative z-10"
                        priority
                        sizes="144px"
                    />
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                    Eco<span className="text-[var(--primary)]">Express</span>
                </h1>

                <div className="space-y-2 max-w-xs mx-auto">
                    <p className="text-lg font-medium text-gray-800 flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        {t.landing_subtitle_1} <span className="text-[var(--primary)] font-bold">{t.landing_subtitle_2}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                        {t.landing_desc}
                    </p>
                </div>

                {/* Start Button */}
                <button
                    onClick={goToNextStep}
                    className="group w-full max-w-xs bg-gradient-to-r from-[var(--primary)] to-emerald-600 hover:from-[#1b5e20] hover:to-emerald-700 text-white text-lg font-bold py-4 px-8 rounded-2xl shadow-lg shadow-green-200/50 transform transition-all active:scale-95 flex items-center justify-center gap-2 mt-6"
                >
                    {t.start_btn}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Trust badges */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-t-3xl border-t border-gray-100 relative z-10">
                <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                        { icon: Leaf, label: t.features_ev, color: 'text-green-600' },
                        { icon: Shield, label: t.features_fixed_price, color: 'text-blue-600' },
                        { icon: Truck, label: t.features_pod, color: 'text-orange-600' },
                        { icon: Sparkles, label: t.features_instant, color: 'text-purple-600' },
                    ].map((badge) => (
                        <div key={badge.label} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50/80">
                            <badge.icon className={`w-4 h-4 ${badge.color}`} />
                            <span className="text-sm text-gray-700 font-medium">{badge.label}</span>
                        </div>
                    ))}
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[var(--primary)] mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{t.coverage_title}</h3>
                            <p className="text-sm text-gray-800 font-medium leading-relaxed">
                                Kovilpatti • Kalugumalai • Sankarankoil • Tiruvengadam
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
