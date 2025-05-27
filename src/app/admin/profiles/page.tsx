"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const MOCK_PROFILES = [
  {
    id: 1,
    nombre: "Dr. Ana María González",
    especialidad: "Psicología Clínica",
    avatar: "👩‍⚕️",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 2,
    nombre: "Dr. Carlos Mendoza",
    especialidad: "Terapia Familiar",
    avatar: "👨‍⚕️",
    color: "from-blue-400 to-indigo-500",
  },
  {
    id: 3,
    nombre: "Dra. Laura Jiménez",
    especialidad: "Psicología Infantil",
    avatar: "👩‍🏫",
    color: "from-green-400 to-emerald-500",
  },
  {
    id: 4,
    nombre: "Dr. Miguel Torres",
    especialidad: "Terapia Cognitiva",
    avatar: "🧑‍⚕️",
    color: "from-purple-400 to-violet-500",
  },
  {
    id: 5,
    nombre: "Dra. Elena Vásquez",
    especialidad: "Psicología de Parejas",
    avatar: "👩‍💼",
    color: "from-amber-400 to-orange-500",
  },
];

export default function ProfilesPage() {
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);
  const router = useRouter();

  const handleProfileSelect = (profileId: number) => {
    setSelectedProfile(profileId);
    localStorage.setItem("selectedProfile", profileId.toString());
    document.cookie = `selectedProfile=${profileId}; path=/`;
    setTimeout(() => {
      router.push("/admin/citas/nueva");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¿Quién está trabajando hoy?
          </h1>
          <p className="text-lg text-gray-600">
            Selecciona tu perfil para continuar
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {MOCK_PROFILES.map((profile) => (
            <Card
              key={profile.id}
              className={`group cursor-pointer transition-all duration-300 transform hover:scale-105 border-0 bg-gradient-to-br ${
                profile.color
              } shadow-2xl ${
                selectedProfile === profile.id
                  ? "ring-4 ring-blue-500 scale-105"
                  : ""
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
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {profile.nombre}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {profile.especialidad}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ChevronRight className="w-6 h-6 text-gray-600 mx-auto" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            className="bg-white/80 border-gray-300 text-gray-700 hover:bg-white/90 backdrop-blur-sm hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
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
