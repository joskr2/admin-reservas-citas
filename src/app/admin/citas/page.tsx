"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type Cita,
  obtenerCitasUsuario,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, ChevronLeft, ChevronRight, Calendar, Clock, User, CalendarDays, CalendarCheck, CalendarRange } from "lucide-react";
import { toast } from "sonner";
import CitaModal from "@/components/custom/CitaModal";
import { PageLoading } from "@/components/ui/loading";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import { cn } from "@/lib/utils";

const MOCK_PROFILES = [
  { id: 1, nombre: "Dr. Ana María González", correo: "ana.gonzalez@psicologia.com", tipo: "psicologo" },
  { id: 2, nombre: "Dr. Carlos Mendoza", correo: "carlos.mendoza@psicologia.com", tipo: "psicologo" },
  { id: 3, nombre: "Dra. Laura Jiménez", correo: "laura.jimenez@psicologia.com", tipo: "psicologo" },
  { id: 4, nombre: "Dr. Miguel Torres", correo: "miguel.torres@psicologia.com", tipo: "psicologo" },
  { id: 5, nombre: "Dra. Elena Vásquez", correo: "elena.vasquez@psicologia.com", tipo: "psicologo" }
];

type VistaCalendario = "hoy" | "semana" | "mes";

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [vistaActual, setVistaActual] = useState<VistaCalendario>("mes");
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Obtener perfil seleccionado
    const profileId = localStorage.getItem("selectedProfile");
    if (profileId) {
      const profile = MOCK_PROFILES.find(p => p.id === Number(profileId));
      setCurrentProfile(profile);
    } else {
      router.push("/admin/profiles");
      return;
    }
  }, [router]);

  useEffect(() => {
    if (currentProfile) {
      cargarCitas();
    }
  }, [currentProfile]);

  const cargarCitas = async () => {
    if (!currentProfile) return;
    
    setIsLoading(true);
    try {
      const response = await obtenerCitasUsuario(currentProfile.id.toString());
      if (response.success && response.data) {
        setCitas(response.data);
      } else {
        toast.error("Error al cargar las citas");
        setCitas([]); // Set empty array if error
      }
    } catch (error) {
      console.error("Error al cargar citas:", error);
      toast.error("Ha ocurrido un error al cargar las citas");
      setCitas([]); // Set empty array if error
    } finally {
      setIsLoading(false);
    }
  };

  const handleNuevaCita = () => {
    router.push("/admin/citas/nueva");
  };

  const handleCitaClick = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCitaSeleccionada(null);
  };

  const handleUpdateCita = () => {
    cargarCitas();
  };

  // Funciones para obtener datos según la vista
  const obtenerCitasDelDia = (fecha: Date): Cita[] => {
    const fechaStr = fecha.toISOString().split('T')[0];
    return citas.filter(cita => cita.fecha === fechaStr);
  };

  const obtenerDiasDelMes = (fecha: Date) => {
    const año = fecha.getFullYear();
    const mes = fecha.getMonth();
    
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const primerDiaSemana = primerDia.getDay();
    
    const diasAMostrar: Date[] = [];
    
    // Días del mes anterior
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
      diasAMostrar.push(new Date(año, mes, -i));
    }
    
    // Días del mes actual
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      diasAMostrar.push(new Date(año, mes, dia));
    }
    
    // Días del mes siguiente
    const diasRestantes = 42 - diasAMostrar.length;
    for (let dia = 1; dia <= diasRestantes; dia++) {
      diasAMostrar.push(new Date(año, mes + 1, dia));
    }
    
    return diasAMostrar;
  };

  const obtenerDiasDeLaSemana = (): Date[] => {
    const inicioSemana = new Date(fechaActual);
    inicioSemana.setDate(fechaActual.getDate() - fechaActual.getDay());
    
    const dias = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicioSemana);
      dia.setDate(inicioSemana.getDate() + i);
      dias.push(dia);
    }
    return dias;
  };

  const navegarPeriodo = (direccion: "anterior" | "siguiente") => {
    const nuevaFecha = new Date(fechaActual);
    
    if (vistaActual === "hoy") {
      nuevaFecha.setDate(fechaActual.getDate() + (direccion === "siguiente" ? 1 : -1));
    } else if (vistaActual === "semana") {
      nuevaFecha.setDate(fechaActual.getDate() + (direccion === "siguiente" ? 7 : -7));
    } else {
      nuevaFecha.setMonth(fechaActual.getMonth() + (direccion === "siguiente" ? 1 : -1));
    }
    
    setFechaActual(nuevaFecha);
  };

  const esMesActual = (fecha: Date): boolean => {
    return fecha.getMonth() === fechaActual.getMonth();
  };

  const esHoy = (fecha: Date): boolean => {
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
  };

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const formatearTituloPeriodo = () => {
    if (vistaActual === "hoy") {
      return fechaActual.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } else if (vistaActual === "semana") {
      const inicioSemana = new Date(fechaActual);
      inicioSemana.setDate(fechaActual.getDate() - fechaActual.getDay());
      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6);
      
      return `${inicioSemana.getDate()} - ${finSemana.getDate()} de ${meses[fechaActual.getMonth()]} ${fechaActual.getFullYear()}`;
    } else {
      return `${meses[fechaActual.getMonth()]} ${fechaActual.getFullYear()}`;
    }
  };

  if (!currentProfile || isLoading) {
    return <PageLoading text="Cargando calendario..." />;
  }

  const renderVistaHoy = () => {
    const citasHoy = obtenerCitasDelDia(fechaActual);
    
    return (
      <div className="space-y-6">
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CalendarCheck className="w-6 h-6 text-blue-600" />
              Citas de Hoy
            </CardTitle>
            <CardDescription>
              {citasHoy.length} citas programadas para {fechaActual.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {citasHoy.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay citas programadas</h3>
                <p className="text-gray-600 mb-4">No tienes citas programadas para hoy</p>
                <Button onClick={handleNuevaCita} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Programar Cita
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {citasHoy.map((cita) => (
                  <div 
                    key={cita.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 cursor-pointer hover:shadow-md transition-all duration-200 transform hover:scale-105"
                    onClick={() => handleCitaClick(cita)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{cita.cliente.nombre}</h3>
                        <p className="text-sm text-gray-600">{cita.cliente.correo}</p>
                        <p className="text-sm text-gray-500">Habitación {cita.habitacion.numero}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right mt-4 sm:mt-0">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{cita.hora_inicio} - {cita.hora_fin}</span>
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        cita.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        cita.estado === 'en_progreso' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {cita.estado === 'pendiente' ? 'Pendiente' :
                         cita.estado === 'en_progreso' ? 'En Progreso' : 'Terminada'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderVistaSemana = () => {
    const diasSemana = obtenerDiasDeLaSemana();
    
    return (
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarRange className="w-6 h-6 text-purple-600" />
            Vista Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {diasSemana.map((dia, index) => {
              const citasDelDia = obtenerCitasDelDia(dia);
              const esHoyDia = esHoy(dia);
              
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    esHoyDia 
                      ? 'bg-blue-50 border-blue-300 shadow-md' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`text-center mb-3 ${esHoyDia ? 'text-blue-600' : 'text-gray-900'}`}>
                    <p className="text-xs font-medium uppercase tracking-wide">
                      {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][index]}
                    </p>
                    <p className={`text-lg font-bold ${esHoyDia ? 'text-blue-600' : 'text-gray-900'}`}>
                      {dia.getDate()}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {citasDelDia.slice(0, 3).map((cita) => (
                      <div
                        key={cita.id}
                        className="text-xs p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                        onClick={() => handleCitaClick(cita)}
                      >
                        <div className="font-medium">{cita.hora_inicio}</div>
                        <div className="truncate">{cita.cliente.nombre}</div>
                      </div>
                    ))}
                    {citasDelDia.length > 3 && (
                      <div className="text-xs text-gray-600 text-center py-1">
                        +{citasDelDia.length - 3} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderVistaMes = () => {
    return (
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-green-600" />
            Vista Mensual
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(dia => (
              <div key={dia} className="p-2 sm:p-3 text-center font-semibold text-gray-600 bg-gray-50 rounded-lg text-xs sm:text-sm">
                <span className="hidden sm:inline">{dia}</span>
                <span className="sm:hidden">{dia.slice(0, 1)}</span>
              </div>
            ))}
          </div>

          {/* Grilla del calendario */}
          <div className="grid grid-cols-7 gap-1">
            {obtenerDiasDelMes(fechaActual).map((fecha, index) => {
              const citasDelDia = obtenerCitasDelDia(fecha);
              const esDelMesActual = esMesActual(fecha);
              const esEsteHoy = esHoy(fecha);
              
              return (
                <div
                  key={index}
                  className={`min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border rounded-lg transition-all duration-200 hover:shadow-md ${
                    esDelMesActual 
                      ? esEsteHoy 
                        ? 'bg-blue-50 border-blue-300 shadow-md' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                      : 'bg-gray-50 border-gray-100 text-gray-400'
                  }`}
                >
                  <div className={`text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
                    esEsteHoy ? 'text-blue-600' : esDelMesActual ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {fecha.getDate()}
                  </div>
                  
                  {citasDelDia.length > 0 && (
                    <div className="space-y-1">
                      {citasDelDia.slice(0, 2).map((cita) => (
                        <div
                          key={cita.id}
                          className="text-[10px] sm:text-xs p-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded truncate cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                          onClick={() => handleCitaClick(cita)}
                        >
                          <div className="hidden sm:flex items-center gap-1">
                            <Clock className="w-2 h-2" />
                            <span>{cita.hora_inicio}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-2 h-2" />
                            <span className="truncate">{cita.cliente.nombre.split(' ')[0]}</span>
                          </div>
                        </div>
                      ))}
                      {citasDelDia.length > 2 && (
                        <div className="text-[10px] sm:text-xs text-gray-600 text-center py-1">
                          +{citasDelDia.length - 2} más
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <AppHeader 
        title="Calendario de Citas"
        subtitle="Gestiona tu agenda de manera visual y eficiente"
      />
      
      <main className="flex-1 p-3 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Controles superiores */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Selector de vista */}
            <div className="flex items-center gap-2 p-1 bg-white rounded-lg shadow-sm border border-gray-200">
              {([
                { key: "hoy", label: "Hoy", icon: CalendarCheck },
                { key: "semana", label: "Semana", icon: CalendarRange },
                { key: "mes", label: "Mes", icon: CalendarDays }
              ] as const).map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={vistaActual === key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setVistaActual(key)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2",
                    vistaActual === key
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Button>
              ))}
            </div>

            {/* Navegación y botón nueva cita */}
            <div className="flex items-center gap-4 w-full lg:w-auto">
              {/* Navegación */}
              <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navegarPeriodo("anterior")}
                  className="p-2 hover:bg-blue-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="px-3 py-1 min-w-[200px] text-center">
                  <h2 className="font-semibold text-gray-900 text-sm sm:text-base">
                    {formatearTituloPeriodo()}
                  </h2>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navegarPeriodo("siguiente")}
                  className="p-2 hover:bg-blue-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Botón nueva cita */}
              <Button 
                onClick={handleNuevaCita}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Nueva Cita</span>
                <span className="sm:hidden">Nueva</span>
              </Button>
            </div>
          </div>

          {/* Contenido del calendario */}
          {vistaActual === "hoy" && renderVistaHoy()}
          {vistaActual === "semana" && renderVistaSemana()}
          {vistaActual === "mes" && renderVistaMes()}

          {/* Modal de cita */}
          <CitaModal
            cita={citaSeleccionada}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onUpdate={handleUpdateCita}
            esPsicologo={currentProfile?.tipo === "psicologo"}
          />
        </div>
      </main>

      <AppFooter />
    </div>
  );
}