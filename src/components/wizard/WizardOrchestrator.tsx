'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const WizardOrchestratorContent = dynamic(() => import('./WizardOrchestratorContent'), {
    ssr: false,
    loading: () => <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading Wizard...</div>
});

export function WizardOrchestrator() {
    return <WizardOrchestratorContent />;
}
