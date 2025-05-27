"use client";

import { HeartHandshakeIcon, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="relative z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <HeartHandshakeIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Horizonte
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sistema de Citas</p>
            </div>
          </Link>

          {/* Copyright */}
          <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} Horizonte. Todos los derechos reservados.
          </p>

        </div>
      </div>
    </footer>
  );
}
