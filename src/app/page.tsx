'use client';

import { useState } from 'react';
import Link from 'next/link';
import PublicGamesExplorer from '@/components/public-games-explorer';
import PublicDevelopersExplorer from '@/components/public-developers-explorer';

type TabType = 'games' | 'developers';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('games');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                GameAPI
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/login"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
              >
                Comenzar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Explora el Mundo de los Videojuegos
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Descubre miles de videojuegos y desarrolladoras sin necesidad de registrarte
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/login"
                className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl"
              >
                Crear Cuenta Gratis
              </Link>
              <button
                onClick={() => {
                  const exploreSection = document.getElementById('explore-section');
                  exploreSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Explorar Ahora
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Búsqueda Avanzada</h3>
            <p className="text-gray-600">
              Filtra por categoría, precio, valoración y más
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sin Registro</h3>
            <p className="text-gray-600">
              Explora todo el catálogo sin necesidad de cuenta
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Rápido y Eficiente</h3>
            <p className="text-gray-600">
              API optimizada para respuestas instantáneas
            </p>
          </div>
        </div>

        {/* Explore Section */}
        <div id="explore-section" className="scroll-mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Explora Nuestro Catálogo
          </h2>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg shadow-md p-1 inline-flex gap-2">
              <button
                onClick={() => setActiveTab('games')}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'games'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Videojuegos
              </button>
              <button
                onClick={() => setActiveTab('developers')}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'developers'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Desarrolladoras
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'games' ? (
              <PublicGamesExplorer />
            ) : (
              <PublicDevelopersExplorer />
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-16 sm:px-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para más funcionalidades?
            </h2>
            <p className="text-xl mb-8 text-indigo-100">
              Crea una cuenta para acceder a funciones exclusivas y gestionar videojuegos
            </p>
            <Link
              href="/login"
              className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl"
            >
              Crear Cuenta Ahora
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">GameAPI - Plataforma de Gestión de Videojuegos</p>
            <p className="text-sm">
              Desarrollado con Next.js 15 y React 19
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
