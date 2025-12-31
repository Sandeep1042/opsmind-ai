import React, { useEffect, useRef } from 'react';
import { ArrowRight, Brain, FileText, Zap, Shield, Sparkles } from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  const heroRef = useRef(null);

  useEffect(() => {
    // Add fade-in animation on mount
    if (heroRef.current) {
      setTimeout(() => {
        heroRef.current.style.opacity = '1';
        heroRef.current.style.transition = 'opacity 0.8s ease-out';
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-4 md:px-12 md:py-6 border-b border-gray-800/50 backdrop-blur-sm bg-gray-950/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center float shadow-lg shadow-purple-500/30">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">OpsMind AI</span>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-gray-800/50">
          Docs
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24 lg:py-32">
        <div ref={heroRef} className="text-center mb-20 md:mb-24 opacity-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-gray-900/50 border border-gray-800 rounded-full text-sm text-gray-300 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Powered by Advanced RAG Technology</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
            Your Enterprise
            <span className="block mt-2 bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
              Knowledge Brain
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop wasting hours searching through documents. OpsMind AI instantly answers your employees' questions about SOPs, policies, and procedures with precise, cited answers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 active:scale-95"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="inline-flex items-center gap-2 text-gray-400 hover:text-white px-6 py-4 rounded-xl font-medium transition-colors duration-200 hover:bg-gray-900/50">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">transform</span> your knowledge base
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Powerful features designed for enterprise teams
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <FeatureCard
              delay="0"
              icon={<FileText className="w-8 h-8" />}
              title="Smart Document Processing"
              description="Automatically ingest and index PDFs, policies, and internal documents with intelligent chunking and embedding."
            />
            <FeatureCard
              delay="100"
              icon={<Zap className="w-8 h-8" />}
              title="Lightning-Fast Answers"
              description="Get accurate, context-aware responses in milliseconds with our RAG-powered architecture."
            />
            <FeatureCard
              delay="200"
              icon={<Shield className="w-8 h-8" />}
              title="Hallucination Guardrails"
              description="Complete transparency. The AI explicitly states when it doesn't know something, building trust with precise citations."
            />
            <FeatureCard
              delay="300"
              icon={<Brain className="w-8 h-8" />}
              title="Knowledge Analytics"
              description="Visual dashboards reveal which documents and topics are most frequently accessed, guiding your knowledge base improvements."
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative z-10 mt-24 md:mt-32">
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-800 rounded-3xl p-10 md:p-16 text-center shadow-2xl shadow-black/50 overflow-hidden">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Ready to transform your knowledge management?
              </h2>
              <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto leading-relaxed">
                Join enterprise teams that are already saving hours per week with OpsMind AI
              </p>
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 active:scale-95"
              >
                Launch OpsMind AI
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 mt-24 py-10 px-6 md:px-12 text-center">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-400 text-sm">Infotact Solutions - AI Innovation Lab © 2025. Confidential.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay = "0" }) {
  return (
    <div 
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 group shadow-lg shadow-black/20 hover:shadow-purple-500/10 hover:shadow-xl hover:-translate-y-1"
      style={{ 
        animation: `fadeInUp 0.6s ease-out ${delay}ms both`
      }}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-purple-500/20">
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
        {title}
      </h3>
      <p className="text-gray-300 leading-relaxed text-[15px]">{description}</p>
    </div>
  );
}

