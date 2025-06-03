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
	// 📊 Configuración de las tarjetas con colores mejorados para modo oscuro
	const statsConfig = [
		{
			title: "Citas de Hoy",
			value: data.citasHoy,
			description: "Consultas programadas para hoy",
			icon: CalendarCheck,
			color: "text-blue-600 dark:text-blue-400",
			bgColor: "bg-blue-100 dark:bg-blue-900/50",
			cardBg:
				"bg-gradient-to-br from-blue-50/80 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/30",
			borderColor: "border-blue-200/50 dark:border-blue-800/50",
			shadowColor: "shadow-blue-500/10 dark:shadow-blue-400/20",
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
			cardBg:
				"bg-gradient-to-br from-amber-50/80 to-orange-100/50 dark:from-amber-950/40 dark:to-orange-900/30",
			borderColor: "border-amber-200/50 dark:border-amber-800/50",
			shadowColor: "shadow-amber-500/10 dark:shadow-amber-400/20",
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
			cardBg:
				"bg-gradient-to-br from-green-50/80 to-emerald-100/50 dark:from-green-950/40 dark:to-emerald-900/30",
			borderColor: "border-green-200/50 dark:border-green-800/50",
			shadowColor: "shadow-green-500/10 dark:shadow-green-400/20",
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
			cardBg:
				"bg-gradient-to-br from-purple-50/80 to-violet-100/50 dark:from-purple-950/40 dark:to-violet-900/30",
			borderColor: "border-purple-200/50 dark:border-purple-800/50",
			shadowColor: "shadow-purple-500/10 dark:shadow-purple-400/20",
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
			cardBg:
				"bg-gradient-to-br from-indigo-50/80 to-blue-100/50 dark:from-indigo-950/40 dark:to-blue-900/30",
			borderColor: "border-indigo-200/50 dark:border-indigo-800/50",
			shadowColor: "shadow-indigo-500/10 dark:shadow-indigo-400/20",
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
			cardBg:
				"bg-gradient-to-br from-teal-50/80 to-cyan-100/50 dark:from-teal-950/40 dark:to-cyan-900/30",
			borderColor: "border-teal-200/50 dark:border-teal-800/50",
			shadowColor: "shadow-teal-500/10 dark:shadow-teal-400/20",
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
			cardBg:
				"bg-gradient-to-br from-rose-50/80 to-pink-100/50 dark:from-rose-950/40 dark:to-pink-900/30",
			borderColor: "border-rose-200/50 dark:border-rose-800/50",
			shadowColor: "shadow-rose-500/10 dark:shadow-rose-400/20",
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
						className={`
							relative overflow-hidden border
							${stat.cardBg} ${stat.borderColor} ${stat.shadowColor}
							backdrop-blur-sm hover:shadow-xl dark:hover:shadow-2xl
							transition-all duration-300 transform hover:scale-105
							hover:border-opacity-70 dark:hover:border-opacity-70
						`}
					>
						{/* 🎨 Elementos decorativos mejorados para modo oscuro */}
						<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent dark:from-white/10 dark:to-transparent rounded-full -translate-y-16 translate-x-16" />
						<div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent dark:from-white/5 dark:to-transparent rounded-full" />

						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
							<div className="space-y-1">
								<CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
									{stat.title}
								</CardTitle>
								<CardDescription className="text-xs text-gray-500 dark:text-gray-400">
									{stat.description}
								</CardDescription>
							</div>
							<div
								className={`
									w-12 h-12 ${stat.bgColor} rounded-xl 
									flex items-center justify-center relative z-10
									shadow-sm dark:shadow-lg
									border border-white/20 dark:border-white/10
								`}
							>
								<Icon className={`w-6 h-6 ${stat.color}`} />
							</div>
						</CardHeader>

						<CardContent className="relative z-10">
							<div className="space-y-3">
								{/* 📊 Valor principal */}
								<div className="flex items-baseline gap-2">
									{isLoading ? (
										<Skeleton className="h-8 w-16 bg-gray-200 dark:bg-gray-700" />
									) : (
										<div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
											{stat.value.toLocaleString()}
										</div>
									)}

									{/* 📈 Indicador de trend mejorado para modo oscuro */}
									<div
										className={`
											flex items-center gap-1 
											${getTrendColor(stat.trend)}
											drop-shadow-sm
										`}
									>
										{getTrendIcon(stat.trend)}
									</div>
								</div>

								{/* 🏷️ Badges adicionales con mejor contraste */}
								{stat.title === "Salas Disponibles" && (
									<Badge
										variant={
											data.ocupacionSalas > 80 ? "destructive" : "secondary"
										}
										className={`
											text-xs
											${
												data.ocupacionSalas > 80
													? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
													: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
											}
										`}
									>
										{data.ocupacionSalas}% ocupación
									</Badge>
								)}

								{stat.title === "Citas Pendientes" &&
									data.citasPendientes > 0 && (
										<Badge
											variant="outline"
											className="text-xs bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800"
										>
											Requiere atención
										</Badge>
									)}

								{stat.title === "Citas de Hoy" && data.citasHoy === 0 && (
									<Badge
										variant="secondary"
										className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
									>
										Sin actividad
									</Badge>
								)}
							</div>
						</CardContent>
					</Card>
				);
			})}

			{/* 📊 Tarjeta especial de resumen para Admin con modo oscuro mejorado */}
			{isAdmin && (
				<Card
					className={`
					relative overflow-hidden border
					bg-gradient-to-br from-yellow-50/80 to-orange-100/50 
					dark:from-yellow-950/40 dark:to-orange-900/30
					border-yellow-200/50 dark:border-yellow-800/50
					shadow-yellow-500/10 dark:shadow-yellow-400/20
					backdrop-blur-sm lg:col-span-2 xl:col-span-1
					hover:shadow-xl dark:hover:shadow-2xl
					transition-all duration-300
				`}
				>
					<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200/30 dark:from-yellow-400/20 to-transparent rounded-full -translate-y-16 translate-x-16" />

					<CardHeader className="relative z-10">
						<CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
							<Activity className="w-4 h-4" />
							Estado del Sistema
						</CardTitle>
					</CardHeader>

					<CardContent className="relative z-10 space-y-3">
						{isLoading ? (
							<div className="space-y-2">
								<Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
								<Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700" />
								<Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700" />
							</div>
						) : (
							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600 dark:text-gray-400">
										Sistema:
									</span>
									<Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800">
										✅ Activo
									</Badge>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600 dark:text-gray-400">
										Ocupación:
									</span>
									<span className="text-sm font-medium text-gray-900 dark:text-gray-100">
										{data.ocupacionSalas}%
									</span>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600 dark:text-gray-400">
										Actividad:
									</span>
									<Badge
										variant={data.citasHoy > 5 ? "default" : "secondary"}
										className={
											data.citasHoy > 5
												? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
												: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
										}
									>
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
