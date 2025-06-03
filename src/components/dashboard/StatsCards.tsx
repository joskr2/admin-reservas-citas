// src/components/dashboard/StatsCards.tsx
"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Users,
	Calendar,
	UserCheck,
	Building2,
	TrendingUp,
	Clock,
	CalendarCheck,
	AlertTriangle,
	Activity,
	Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardsProps {
	data: {
		totalCitas: number;
		citasPendientes: number;
		citasHoy: number;
		totalPsicologos: number;
		totalPacientes: number;
		totalSalas: number;
		citasEsteMes: number;
		ocupacionSalas: number;
	};
	isLoading: boolean;
	isAdmin: boolean;
}

export default function StatsCards({
	data,
	isLoading,
	isAdmin,
}: StatsCardsProps) {
	// 📊 Configuración de las tarjetas
	const statsConfig = [
		{
			title: "Citas de Hoy",
			value: data.citasHoy,
			description: "Consultas programadas para hoy",
			icon: CalendarCheck,
			color: "text-blue-600 dark:text-blue-400",
			bgColor: "bg-blue-100 dark:bg-blue-900/50",
			trend: data.citasHoy > 3 ? "high" : data.citasHoy > 1 ? "medium" : "low",
			showAlways: true,
		},
		{
			title: "Citas Pendientes",
			value: data.citasPendientes,
			description: "Esperando confirmación",
			icon: Clock,
			color: "text-amber-600 dark:text-amber-400",
			bgColor: "bg-amber-100 dark:bg-amber-900/50",
			trend: data.citasPendientes > 5 ? "warning" : "normal",
			showAlways: true,
		},
		{
			title: "Total de Citas",
			value: data.totalCitas,
			description: "Todas las citas programadas",
			icon: Calendar,
			color: "text-green-600 dark:text-green-400",
			bgColor: "bg-green-100 dark:bg-green-900/50",
			trend: "stable",
			showAlways: true,
		},
		{
			title: "Pacientes",
			value: data.totalPacientes,
			description: isAdmin ? "Total en el sistema" : "Tus pacientes",
			icon: Users,
			color: "text-purple-600 dark:text-purple-400",
			bgColor: "bg-purple-100 dark:bg-purple-900/50",
			trend: data.totalPacientes > 20 ? "high" : "medium",
			showAlways: true,
		},
		{
			title: "Psicólogos",
			value: data.totalPsicologos,
			description: "Profesionales activos",
			icon: UserCheck,
			color: "text-indigo-600 dark:text-indigo-400",
			bgColor: "bg-indigo-100 dark:bg-indigo-900/50",
			trend: "stable",
			showAlways: isAdmin,
		},
		{
			title: "Salas Disponibles",
			value: data.totalSalas,
			description: `${data.ocupacionSalas}% ocupación hoy`,
			icon: Building2,
			color: "text-teal-600 dark:text-teal-400",
			bgColor: "bg-teal-100 dark:bg-teal-900/50",
			trend: data.ocupacionSalas > 80 ? "warning" : "normal",
			showAlways: isAdmin,
		},
		{
			title: "Citas Este Mes",
			value: data.citasEsteMes,
			description: "Actividad mensual",
			icon: TrendingUp,
			color: "text-rose-600 dark:text-rose-400",
			bgColor: "bg-rose-100 dark:bg-rose-900/50",
			trend: data.citasEsteMes > 50 ? "high" : "medium",
			showAlways: true,
		},
	];

	// 🎯 Filtrar tarjetas según el rol
	const visibleStats = statsConfig.filter((stat) => stat.showAlways);

	// 🎨 Función para obtener el color del trend
	const getTrendColor = (trend: string) => {
		switch (trend) {
			case "high":
				return "text-green-600 dark:text-green-400";
			case "warning":
				return "text-amber-600 dark:text-amber-400";
			case "low":
				return "text-red-600 dark:text-red-400";
			default:
				return "text-gray-600 dark:text-gray-400";
		}
	};

	// 🎨 Función para obtener el icono del trend
	const getTrendIcon = (trend: string) => {
		switch (trend) {
			case "high":
				return <TrendingUp className="w-4 h-4" />;
			case "warning":
				return <AlertTriangle className="w-4 h-4" />;
			case "low":
				return <Activity className="w-4 h-4" />;
			default:
				return <Target className="w-4 h-4" />;
		}
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{visibleStats.map((stat) => {
				const Icon = stat.icon;

				return (
					<Card
						key={stat.title}
						className="relative overflow-hidden shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105"
					>
						{/* 🎨 Decorative gradient */}
						<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16" />

						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
							<div className="space-y-1">
								<CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
									{stat.title}
								</CardTitle>
								<CardDescription className="text-xs text-gray-500 dark:text-gray-500">
									{stat.description}
								</CardDescription>
							</div>
							<div
								className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center relative z-10`}
							>
								<Icon className={`w-6 h-6 ${stat.color}`} />
							</div>
						</CardHeader>

						<CardContent className="relative z-10">
							<div className="space-y-3">
								{/* 📊 Valor principal */}
								<div className="flex items-baseline gap-2">
									{isLoading ? (
										<Skeleton className="h-8 w-16" />
									) : (
										<div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
											{stat.value.toLocaleString()}
										</div>
									)}

									{/* 📈 Indicador de trend */}
									<div
										className={`flex items-center gap-1 ${getTrendColor(stat.trend)}`}
									>
										{getTrendIcon(stat.trend)}
									</div>
								</div>

								{/* 🏷️ Badge adicional */}
								{stat.title === "Salas Disponibles" && (
									<Badge
										variant={
											data.ocupacionSalas > 80 ? "destructive" : "secondary"
										}
										className="text-xs"
									>
										{data.ocupacionSalas}% ocupación
									</Badge>
								)}

								{stat.title === "Citas Pendientes" &&
									data.citasPendientes > 0 && (
										<Badge variant="outline" className="text-xs">
											Requiere atención
										</Badge>
									)}

								{stat.title === "Citas de Hoy" && data.citasHoy === 0 && (
									<Badge variant="secondary" className="text-xs">
										Sin actividad
									</Badge>
								)}
							</div>
						</CardContent>
					</Card>
				);
			})}

			{/* 📊 Tarjeta especial de resumen para Admin */}
			{isAdmin && (
				<Card className="relative overflow-hidden shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 backdrop-blur-sm lg:col-span-2 xl:col-span-1">
					<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200/30 to-transparent rounded-full -translate-y-16 translate-x-16" />

					<CardHeader className="relative z-10">
						<CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
							<Activity className="w-4 h-4" />
							Estado del Sistema
						</CardTitle>
					</CardHeader>

					<CardContent className="relative z-10 space-y-3">
						{isLoading ? (
							<div className="space-y-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
							</div>
						) : (
							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600 dark:text-gray-400">
										Sistema:
									</span>
									<Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
										✅ Activo
									</Badge>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600 dark:text-gray-400">
										Ocupación:
									</span>
									<span className="text-sm font-medium">
										{data.ocupacionSalas}%
									</span>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600 dark:text-gray-400">
										Actividad:
									</span>
									<Badge variant={data.citasHoy > 5 ? "default" : "secondary"}>
										{data.citasHoy > 5
											? "Alta"
											: data.citasHoy > 2
												? "Media"
												: "Baja"}
									</Badge>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
