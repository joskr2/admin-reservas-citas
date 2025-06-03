// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoading } from "@/components/ui/loading";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Users,
	Calendar,
	UserCheck,
	Building2,
	TrendingUp,
	Clock,
	AlertCircle,
	CheckCircle2,
	BarChart3,
	PieChart,
	Activity,
} from "lucide-react";
import { mockDataManager, MOCK_USERS, MOCK_HABITACIONES } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import StatsCards from "@/components/dashboard/StatsCards";
import CitasOverview from "@/components/dashboard/CitasOverview";
import PacientesTable from "@/components/dashboard/PacientesTable";
import PsicologosTable from "@/components/dashboard/PsicologosTable";

// 🆕 Componentes específicos del dashboard

// import SalasTable from "@/components/dashboard/SalasTable";

export default function DashboardPage() {
	const { user, isAuthenticated, loading } = useAuth();
	const router = useRouter();
	const [dashboardData, setDashboardData] = useState({
		totalCitas: 0,
		citasPendientes: 0,
		citasHoy: 0,
		totalPsicologos: 0,
		totalPacientes: 0,
		totalSalas: 0,
		citasEsteMes: 0,
		ocupacionSalas: 0,
	});
	const [isLoadingData, setIsLoadingData] = useState(true);

	// 🔐 Verificar acceso
	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.push("/login");
			return;
		}

		if (!loading && user && !["admin", "psicologo"].includes(user.role)) {
			router.push("/");
			return;
		}
	}, [loading, isAuthenticated, user, router]);

	// 📊 Cargar datos del dashboard
	useEffect(() => {
		if (user) {
			loadDashboardData();
		}
	}, [user]);

	const loadDashboardData = async () => {
		setIsLoadingData(true);
		try {
			// Simular carga de datos
			await new Promise((resolve) => setTimeout(resolve, 800));

			// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
			let allCitas;
			if (user?.role === "admin") {
				// Admin ve todas las citas
				allCitas = Object.values(MOCK_USERS)
					.filter((u) => u.rol === "psicologo" || u.rol === "admin")
					.flatMap((psicologo) =>
						mockDataManager.getCitasByUsuario(psicologo.id),
					);
			} else {
				// Psicólogo ve solo sus citas
				allCitas = mockDataManager.getCitasByUsuario(user?.id || "");
			}

			const today = new Date().toISOString().split("T")[0];
			const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

			// 📈 Calcular estadísticas
			const stats = {
				totalCitas: allCitas.length,
				citasPendientes: allCitas.filter((c) => c.estado === "pendiente")
					.length,
				citasHoy: allCitas.filter((c) => c.fecha === today).length,
				totalPsicologos:
					user?.role === "admin"
						? MOCK_USERS.filter(
								(u) => u.rol === "psicologo" || u.rol === "admin",
							).length
						: 1,
				totalPacientes: new Set(allCitas.map((c) => c.cliente.id)).size,
				totalSalas: MOCK_HABITACIONES.length,
				citasEsteMes: allCitas.filter((c) => c.fecha.startsWith(thisMonth))
					.length,
				ocupacionSalas: Math.round(
					(allCitas.filter((c) => c.fecha === today).length /
						MOCK_HABITACIONES.length) *
						100,
				),
			};

			setDashboardData(stats);
		} catch (error) {
			console.error("Error cargando datos del dashboard:", error);
		} finally {
			setIsLoadingData(false);
		}
	};

	// 🔄 Loading states
	if (loading) {
		return <PageLoading text="Verificando acceso..." />;
	}

	if (!isAuthenticated || !user) {
		return null;
	}

	if (!["admin", "psicologo"].includes(user.role)) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
				<Card className="max-w-md">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-red-600">
							<AlertCircle className="w-6 h-6" />
							Acceso Denegado
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p>No tienes permisos para acceder al dashboard administrativo.</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	const isAdmin = user.role === "admin";

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			<div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
				{/* 🎯 Header del Dashboard */}
				<div className="space-y-4">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div>
							<h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
								<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
									<BarChart3 className="w-6 h-6 text-white" />
								</div>
								Dashboard Administrativo
							</h1>
							<p className="text-gray-600 dark:text-gray-400 mt-2">
								{isAdmin
									? "Panel de control completo del sistema"
									: "Tu panel de control personal"}
							</p>
						</div>

						<div className="flex items-center gap-3">
							<Badge variant="outline" className="px-4 py-2">
								<Activity className="w-4 h-4 mr-2" />
								{isAdmin ? "Super Administrador" : "Psicólogo"}
							</Badge>
							<Badge variant="secondary" className="px-4 py-2">
								<Clock className="w-4 h-4 mr-2" />
								Actualizado hace unos segundos
							</Badge>
						</div>
					</div>
				</div>

				{/* 📊 Tarjetas de Estadísticas */}
				<StatsCards
					data={dashboardData}
					isLoading={isLoadingData}
					isAdmin={isAdmin}
				/>

				{/* 📋 Contenido Principal en Tabs */}
				<Tabs defaultValue="overview" className="space-y-6">
					<TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white dark:bg-gray-800 shadow-sm">
						<TabsTrigger value="overview" className="flex items-center gap-2">
							<PieChart className="w-4 h-4" />
							<span className="hidden sm:inline">Resumen</span>
						</TabsTrigger>
						<TabsTrigger value="citas" className="flex items-center gap-2">
							<Calendar className="w-4 h-4" />
							<span className="hidden sm:inline">Citas</span>
						</TabsTrigger>
						<TabsTrigger value="pacientes" className="flex items-center gap-2">
							<Users className="w-4 h-4" />
							<span className="hidden sm:inline">Pacientes</span>
						</TabsTrigger>
						{isAdmin && (
							<TabsTrigger
								value="psicologos"
								className="flex items-center gap-2"
							>
								<UserCheck className="w-4 h-4" />
								<span className="hidden sm:inline">Psicólogos</span>
							</TabsTrigger>
						)}
					</TabsList>

					{/* 📈 Tab: Resumen General */}
					<TabsContent value="overview" className="space-y-6">
						<CitasOverview
							userId={user.id}
							isAdmin={isAdmin}
							onDataUpdate={loadDashboardData}
						/>
					</TabsContent>

					{/* 📅 Tab: Gestión de Citas */}
					<TabsContent value="citas" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Calendar className="w-6 h-6 text-blue-600" />
									Gestión de Citas
								</CardTitle>
								<CardDescription>
									{isAdmin
										? "Administra todas las citas del sistema"
										: "Administra tus citas programadas"}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<CitasOverview
									userId={user.id}
									isAdmin={isAdmin}
									onDataUpdate={loadDashboardData}
									showFullTable={true}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					{/* 👥 Tab: Gestión de Pacientes */}
					<TabsContent value="pacientes" className="space-y-6">
						<PacientesTable
							userId={user.id}
							isAdmin={isAdmin}
							onDataUpdate={loadDashboardData}
						/>
					</TabsContent>

					{/* 👨‍⚕️ Tab: Gestión de Psicólogos (Solo Admin) */}
					{isAdmin && (
						<TabsContent value="psicologos" className="space-y-6">
							<PsicologosTable onDataUpdate={loadDashboardData} />
						</TabsContent>
					)}

					{/* 🏢 Tab: Gestión de Salas (Solo Admin) */}
					{/* {isAdmin && (
						<TabsContent value="salas" className="space-y-6">
							<SalasTable onDataUpdate={loadDashboardData} />
						</TabsContent>
					)} */}
				</Tabs>
			</div>
		</div>
	);
}
