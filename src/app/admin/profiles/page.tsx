"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { User, Plus, ChevronRight } from "lucide-react";
import  { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const MOCK_PROFILES = [
  {
    id: 1,
    nombre: "Dr. Ana María González",
    especialidad: "Psicología Clínica",
    avatar: "👩‍⚕️",
    color: "from-pink-400 to-rose-500"
  },
  {
    id: 2,
    nombre: "Dr. Carlos Mendoza",
    especialidad: "Terapia Familiar",
    avatar: "👨‍⚕️",
    color: "from-blue-400 to-indigo-500"
  },
  {
    id: 3,
    nombre: "Dra. Laura Jiménez",
    especialidad: "Psicología Infantil",
    avatar: "👩‍🏫",
    color: "from-green-400 to-emerald-500"
  },
  {
    id: 4,
    nombre: "Dr. Miguel Torres",
    especialidad: "Terapia Cognitiva",
    avatar: "🧑‍⚕️",
    color: "from-purple-400 to-violet-500"
  },
  {
    id: 5,
    nombre: "Dra. Elena Vásquez",
    especialidad: "Psicología de Parejas",
    avatar: "👩‍💼",
    color: "from-amber-400 to-orange-500"
  }
];

export default function ProfilesPage() {
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);
  const router = useRouter();

  const handleProfileSelect = (profileId: number) => {
    setSelectedProfile(profileId);
    localStorage.setItem("selectedProfile", profileId.toString());
    document.cookie = `selectedProfile=${profileId}; path=/`;
    setTimeout(() => {
      router.push("/admin");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            ¿Quién está trabajando hoy?
          </h1>
          <p className="text-lg text-gray-300">
            Selecciona tu perfil para continuar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {MOCK_PROFILES.map((profile) => (
            <Card 
              key={profile.id}
              className={`group cursor-pointer transition-all duration-300 transform hover:scale-105 border-0 bg-gradient-to-br ${profile.color} shadow-2xl ${
                selectedProfile === profile.id ? 'ring-4 ring-white scale-105' : ''
              }`}
              onClick={() => handleProfileSelect(profile.id)}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="relative mx-auto w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl group-hover:bg-white/30 transition-all duration-300">
                  {profile.avatar}
                  {selectedProfile === profile.id && (
                    <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {profile.nombre}
                  </h3>
                  <p className="text-sm text-white/80">
                    {profile.especialidad}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ChevronRight className="w-6 h-6 text-white mx-auto" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            onClick={() => router.push("/login")}
          >
            <User className="w-4 h-4 mr-2" />
            Cambiar Usuario
          </Button>
        </div>
      </div>
    </div>
  );
}
