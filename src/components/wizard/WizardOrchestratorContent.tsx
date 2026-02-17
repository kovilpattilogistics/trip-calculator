'use client';

import React from 'react';
import { WizardProvider, useWizard } from './WizardManager';
import { Step0Landing } from '../steps/Step0_Landing';
import { Step1TypeSelection } from '../steps/Step1_TypeSelection';
import { Step2Location } from '../steps/Step2_Location';
import { Step3Details } from '../steps/Step3_Details';
import { Step4Quote } from '../steps/Step4_Quote';
import { AnimatePresence, motion } from 'framer-motion';

function WizardContent() {
    const { currentStep } = useWizard();

    const renderStep = () => {
        switch (currentStep) {
            case 0: return <Step0Landing />;
            case 1: return <Step1TypeSelection />;
            case 2: return <Step2Location />;
            case 3: return <Step3Details />;
            case 4: return <Step4Quote />;
            default: return <Step0Landing />;
        }
    };

    return (
        <div className="h-[100dvh] w-full max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 h-full overflow-hidden"
                >
                    {renderStep()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default function WizardOrchestratorContent() {
    return (
        <WizardProvider>
            <WizardContent />
        </WizardProvider>
    );
}
