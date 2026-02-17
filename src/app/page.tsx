import { Suspense } from 'react';
import { WizardOrchestrator } from "@/components/wizard/WizardOrchestrator";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400">Loading...</div>}>
      <WizardOrchestrator />
    </Suspense>
  );
}
