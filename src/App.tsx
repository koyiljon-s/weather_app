// src/App.tsx
import { HomePage } from "@/pages/home/ui/HomePage";

export function App() {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center w-full">
      <div className="w-full max-w-7xl mx-auto">
        <HomePage />
      </div>
    </div>
  );
}
