// app/page.tsx
"use client";

import dynamic from 'next/dynamic';

// Dynamically import the component and disable SSR
const InteractiveAvatar = dynamic(() => import("@/components/InteractiveAvatar").then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="w-screen h-screen flex items-center justify-center text-white">Loading Avatar...</div> // Optional loading component
});

export default function App() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-[900px] flex flex-col items-start justify-start gap-5 mx-auto pt-4 pb-20">
        <div className="w-full">
          <InteractiveAvatar />
        </div>
      </div>
    </div>
  );
}