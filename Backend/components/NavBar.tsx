// components/NavBar.tsx
"use client";

export default function NavBar() {
  return (
    <>
      <div className="flex flex-row justify-between items-center w-[1000px] m-auto p-6">
        {/* --- LEFT SIDE: YOUR LOGO AND APP NAME --- */}
        <div className="flex flex-row items-center gap-4">
          {/* 
            This is your actual logo image.
            - The `src` path starts with "/" because the file is in the "public" folder.
            - `alt` is important for accessibility.
            - `height="32"` makes it the same size as the placeholder (h-8 = 32px).
            - `width` and `height` prevent the page from shifting as the image loads.
          */}
          <img 
            src="/Testify-logo.png" 
            alt="Testify Logo" 
            height="32"
            width="32"
            className="rounded"
          />
          
          <p className="text-xl font-semibold text-white">
            Testify
          </p>
        </div>

        {/* --- RIGHT SIDE: EMPTY NAVIGATION --- */}
        <div className="flex flex-row items-center gap-6">
          {/* This area is intentionally empty */}
        </div>
      </div>
    </>
  );
}