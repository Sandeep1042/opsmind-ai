import React from "react";
import { Brain } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full bg-gray-900/90 border-b border-gray-800 px-6 py-3 flex items-center justify-between backdrop-blur-md navbar-glow">
      
      {/* Left: OpsMind Logo + Name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center float">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">OpsMind AI</h1>
          <p className="text-xs text-gray-400">RAG Assistant</p>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-4 text-sm">
        <button className="hover:text-purple-400 transition">Docs</button>
        <button className="hover:text-purple-400 transition">Support</button>
        <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-2 rounded-lg font-semibold text-sm shadow-md">
          Dashboard
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
