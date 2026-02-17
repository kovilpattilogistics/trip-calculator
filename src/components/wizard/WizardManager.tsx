'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { getCookie, setCookie } from '@/lib/cookies';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

// Define the shape of our wizard state
interface WizardData {
    deliveryType: 'single' | 'multiple' | null;
    serviceType: 'scheduled' | 'dedicated' | 'express';
    pickupLocation: string;
    pickupLatLng: { lat: number; lng: number } | null;
    dropLocation: string; // for single
    dropLatLng: { lat: number; lng: number } | null;
    stops: string[]; // for multiple - intermediate stops
    stopsLatLng: ({ lat: number; lng: number } | null)[]; // lat/lng for each stop
    stopsCount: number;
    endLocation: string; // for multiple
    endLatLng: { lat: number; lng: number } | null;
    weight: number;
    expectedWaitingHours: number;
    productType?: string;
}

interface WizardContextType {
    currentStep: number;
    data: WizardData;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    goToStep: (step: number) => void;
    updateData: (partialData: Partial<WizardData>) => void;
    resetWizard: () => void;
    language: 'en' | 'ta';
    toggleLanguage: () => void;
}

const defaultData: WizardData = {
    deliveryType: null,
    serviceType: 'scheduled',
    pickupLocation: 'Kovilpatti Hub',
    pickupLatLng: null,
    dropLocation: '',
    dropLatLng: null,
    stops: [],
    stopsLatLng: [],
    stopsCount: 0,
    endLocation: '',
    endLatLng: null,
    weight: 50,
    expectedWaitingHours: 1,
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [data, setData] = useState<WizardData>(defaultData);
    const [language, setLanguage] = useState<'en' | 'ta'>('en'); // Default to 'en' initially

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize Language from URL -> LocalStorage -> Cookie -> Default
    useEffect(() => {
        const queryLang = searchParams?.get('lang');
        if (queryLang === 'ta' || queryLang === 'en') {
            setLanguage(queryLang); // URL overrides everything
            // Persist to storage + cookies immediately
            localStorage.setItem('eco_lang', queryLang);
            setCookie('eco_lang', queryLang, 365);
            return;
        }

        const storedLang = localStorage.getItem('eco_lang');
        if (storedLang === 'ta' || storedLang === 'en') {
            setLanguage(storedLang);
            return;
        }

        const cookieLang = getCookie('eco_lang');
        if (cookieLang === 'ta' || cookieLang === 'en') {
            setLanguage(cookieLang);
            // Sync to local storage if missing
            localStorage.setItem('eco_lang', cookieLang);
        }
    }, [searchParams]);

    const goToNextStep = useCallback(() => setCurrentStep((prev) => Math.min(prev + 1, 4)), []);
    const goToPreviousStep = useCallback(() => setCurrentStep((prev) => Math.max(prev - 1, 0)), []);
    const goToStep = useCallback((step: number) => setCurrentStep(step), []);

    const updateData = useCallback((partialData: Partial<WizardData>) => {
        setData((prev) => ({ ...prev, ...partialData }));
    }, []);

    const resetWizard = useCallback(() => {
        setData(defaultData);
        setCurrentStep(0);
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguage((prev) => {
            const newLang = prev === 'en' ? 'ta' : 'en';

            // 1. Update Persistent Storage
            localStorage.setItem('eco_lang', newLang);
            setCookie('eco_lang', newLang, 365);

            // 2. Update URL Query Param (without reload)
            const params = new URLSearchParams(window.location.search);
            params.set('lang', newLang);
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });

            return newLang;
        });
    }, [pathname, router]);

    const value = useMemo(() => ({
        currentStep,
        data,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        updateData,
        resetWizard,
        language,
        toggleLanguage,
    }), [currentStep, data, goToNextStep, goToPreviousStep, goToStep, updateData, resetWizard, language, toggleLanguage]);

    return (
        <WizardContext.Provider value={value}>
            {children}
        </WizardContext.Provider>
    );
}

export function useWizard() {
    const context = useContext(WizardContext);
    if (context === undefined) {
        throw new Error('useWizard must be used within a WizardProvider');
    }
    return context;
}
