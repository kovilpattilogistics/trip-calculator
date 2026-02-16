'use client';

import React from 'react';
import { useWizard } from '@/components/wizard/WizardManager';
import { Store, Truck, ChevronRight, ChevronLeft, Calendar, Zap, TruckIcon } from 'lucide-react';
import { clsx } from 'clsx';

export function Step1TypeSelection() {
    const { data, updateData, goToNextStep, goToPreviousStep } = useWizard();
    const [showInfo, setShowInfo] = React.useState<string | null>(null);

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
            label: 'Standard (Shared)',
            desc: 'Cheapest option. Goods share the truck.',
            icon: Calendar,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            bgSolid: 'bg-blue-600',
            ring: 'ring-blue-500',
            border: 'border-blue-500',
            gradient: 'from-blue-50 to-blue-100/50',
            badge: '💰 Best Value',
            info: 'We combine your goods with others. It takes a bit longer but saves you money!',
        },
        {
            id: 'dedicated' as const,
            label: 'Full Vehicle',
            desc: 'Private truck just for you.',
            icon: TruckIcon,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            bgSolid: 'bg-orange-600',
            ring: 'ring-orange-500',
            border: 'border-orange-500',
            gradient: 'from-orange-50 to-orange-100/50',
            badge: '⭐ Private',
            info: 'You get the whole truck. No sharing. Best for large loads or sensitive items.',
        },
        {
            id: 'express' as const,
            label: 'Urgent',
            desc: 'Priority speed. Same day delivery.',
            icon: Zap,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            bgSolid: 'bg-purple-600',
            ring: 'ring-purple-500',
            border: 'border-purple-500',
            gradient: 'from-purple-50 to-purple-100/50',
            badge: '⚡ Fastest',
            info: 'We drop everything to deliver your goods immediately. Costs a bit more.',
        },
    ];

    return (
        <div className="flex flex-col h-full bg-gray-50">
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
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                    What are you sending?
                </h2>
                <p className="text-sm text-gray-500 mt-1">Choose the best option for your goods.</p>
            </div>

            <div className="flex-1 p-6 space-y-8 overflow-y-auto">

                {/* Delivery Type */}
                <section>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block flex items-center gap-2">
                        1. Trip Type <span className="text-gray-300 font-normal normal-case">(Click one)</span>
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
                                Direct Trip
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">Pickup ➔ Drop</p>
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
                                Multi-Stop
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">Many Drops (2+)</p>
                        </button>
                    </div>
                </section>

                {/* Service Type */}
                <section>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block flex items-center gap-2">
                        2. Service Level <span className="text-gray-300 font-normal normal-case">(Choose speed/cost)</span>
                    </label>
                    <div className="space-y-3">
                        {serviceTypes.map((svc) => {
                            const Icon = svc.icon;
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
                                                <Icon className="w-6 h-6" />
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
                    CONTINUE
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
