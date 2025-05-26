"use client";

import { HeartHandshakeIcon, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <HeartHandshakeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Horizonte
                </h3>
                <p className="text-sm text-gray-400">Sistema de Citas</p>
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Plataforma integral para la gestión profesional de citas médicas y consultas psicológicas. 
              Facilitamos la conexión entre profesionales y pacientes.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Enlaces Rápidos</h4>
            <nav className="space-y-2">
              <Link 
                href="/" 
                className="block text-gray-300 hover:text-blue-400 transition-colors text-sm"
              >
                Inicio
              </Link>
              <Link 
                href="/admin/citas" 
                className="block text-gray-300 hover:text-blue-400 transition-colors text-sm"
              >
                Calendario de Citas
              </Link>
              <Link 
                href="/admin/citas/nueva" 
                className="block text-gray-300 hover:text-blue-400 transition-colors text-sm"
              >
                Programar Nueva Cita
              </Link>
            </nav>
          </div>

          {/* Información de contacto */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-gray-300">soporte@horizonte.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-gray-300">Centro Médico Horizonte</span>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Horizonte. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                href="#" 
                className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
              >
                Política de Privacidad
              </Link>
              <Link 
                href="#" 
                className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
              >
                Términos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}