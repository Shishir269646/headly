"use client";

import { AlertTriangle, Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden relative">

      {/* Animated Gradient Background */}
      <div className="absolute inset-0 mix-blend-screen animate-moveGradient 
                            bg-[radial-gradient(circle_at_50%_50%,#ffc107,transparent_70%),radial-gradient(circle_at_50%_50%,#e91e63,transparent_70%)]
                            bg-[length:40vmin_40vmin,40vmin_40vmin]
                            bg-no-repeat
                            bg-[position:-100vmin_20vmin,100vmin_-25vmin]">
      </div>

      {/* 404 number */}
      <h1
        className="relative font-extrabold text-[30vmin] tracking-[5vmin] text-white drop-shadow-[2px_-1px_0_#000] shadow-404"
      >
        404
      </h1>

      {/* Message */}
      <div className="text-center mt-4">
        <div className="flex flex-col items-center gap-2">
          <Ghost size={48} className="text-yellow-300" />
          <AlertTriangle size={38} className="text-red-400" />
        </div>

        <p className="text-[10vmin] font-normal font-[Courgette] leading-none mt-4">
          Ooops...
        </p>
        <p className="text-[5vmin] font-[Courgette] opacity-90 -mt-2">
          page not found
        </p>
      </div>

      {/* Link */}
      <a
        href="https://codepen.io/uzcho_/pens/popular/?grid_type=list"
        target="_blank"
        className="mt-10 text-sm text-blue-300 hover:underline"
      >
        Visit original creator →
      </a>
    </div>
  );
}
