"use client";

import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BuildingIcon,
  BellIcon,
  BarChart3Icon,
  ArrowRightIcon,
  SparklesIcon,
  HeartHandshakeIcon,
  ShieldCheckIcon,
  PlusCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <AppHeader />
      <main className="flex-1 overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-32 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-300/20 to-purple-500/20 rounded-full blur-3xl" />
        </div>

        {/* Hero Section */}
        <motion.div
          className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <motion.div
                className="flex items-center justify-center mb-8"
                variants={fadeInUp}
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3">
                    <HeartHandshakeIcon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <SparklesIcon className="w-4 h-4 text-yellow-800" />
                  </div>
                </div>
              </motion.div>

              <motion.h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
                variants={fadeInUp}
              >
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Bienvenido a{" "}
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Horizonte
                </span>
              </motion.h1>

              <motion.p
                className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed"
                variants={fadeInUp}
              >
                Tu plataforma integral para la gestión profesional de{" "}
                <span className="text-purple-600 font-semibold">
                  consultas psicológicas
                </span>
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                variants={fadeInUp}
              >
                <Button
                  size="lg"
                  className="hidden sm:inline-flex h-16 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25"
                  onClick={() => router.push("/admin/citas/nueva")}
                >
                  <CalendarIcon className="w-6 h-6 mr-3" />
                  Programar Nueva Cita
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-16 px-8 border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-semibold rounded-xl transition-all duration-300 hover:bg-blue-50"
                  onClick={() => router.push("/admin/citas")}
                >
                  Ver Calendario
                  <ArrowRightIcon className="w-5 h-5 ml-3" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8"
              variants={staggerChildren}
            >
              {/* Gestión de Citas */}
              <motion.div variants={fadeInUp}>
                <Card
                  className="group h-full shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/90 cursor-pointer"
                  onClick={() => router.push("/admin/citas")}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <CalendarIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Calendario de Citas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                      Visualiza y administra todas tus citas en un calendario
                      intuitivo y moderno.
                    </CardDescription>
                    <div className="flex items-center justify-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                      Acceder
                      <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Nueva Cita */}
              <motion.div variants={fadeInUp}>
                <Card
                  className="group h-full shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/90 cursor-pointer"
                  onClick={() => router.push("/admin/citas/nueva")}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <PlusCircle className="w-8 h-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Nueva Cita
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                      Programa una nueva consulta de forma rápida y sencilla.
                    </CardDescription>
                    <div className="flex items-center justify-center text-purple-600 font-medium group-hover:text-purple-700 transition-colors">
                      Programar
                      <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <AppFooter />
    </div>
  );
}
