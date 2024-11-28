'use client';

import React from 'react';
import CodeAnimation from '../components/three/CodeParticles';

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative bg-[#0a0a0a]">
            <div className="fixed inset-0 z-0">
                <CodeAnimation />
            </div>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}