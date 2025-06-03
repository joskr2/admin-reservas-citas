// src/components/dashboard/PacientesTable.tsx
"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Users,
	User,
	Mail,
	Calendar,
	Search,
	Filter,
	MoreHorizontal,
	Eye,
	Edit,
	Trash2,
	Plus,
	Phone,
	MapPin,
	Clock,
	TrendingUp,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockDataManager, MOCK_USERS } from "@/lib/mockData";
import { toast } from "sonner";

interface Paciente {
	id: string;
	nombre: string;
	correo: string;
	telefono?: string;
	totalCitas: number;
	citasPendientes: number;
	ultimaCita?: string;
	proximaCita?: string;
	psicologoAsignado?: string;
}

interface PacientesTableProps {
	userId: string;
	isAdmin: boolean;
	onDataUpdate?: () => void;
}

export default function PacientesTable({
	userId,
	isAdmin,
	onDataUpdate,
}: PacientesTableProps) {
	const [pacientes, setPacientes] = useState<Paciente[]>([]);
	const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState<"all" | "active" | "inactive">(
		"all",
	);

	// 📊 Cargar pacientes
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		useEffect(() => {
		loadPacientes();
	}, [userId, isAdmin]);

	// 🔍 Aplicar filtros y búsqueda
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		useEffect(() => {
		applyFilters();
	}, [pacientes, searchTerm, filterType]);

	const loadPacientes = async () => {
		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 500));

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			let todasLasCitas: any[] = [];

			if (isAdmin) {
				// Admin ve todos los pacientes
				const allPsicologos = MOCK_USERS.filter(
					(u) => u.rol === "psicologo" || u.rol === "admin",
				);
				todasLasCitas = allPsicologos.flatMap((psicologo) =>
					mockDataManager.getCitasByUsuario(psicologo.id),
				);
			} else {
				// Psicólogo ve solo sus pacientes
				todasLasCitas = mockDataManager.getCitasByUsuario(userId);
			}

			// 📈 Agrupar por paciente y calcular estadísticas
			const pacientesMap = new Map<string, Paciente>();

			// biome-ignore lint/complexity/noForEach: <explanation>
			todasLasCitas.forEach((cita) => {
				const pacienteId = cita.cliente.id;

				if (!pacientesMap.has(pacienteId)) {
					pacientesMap.set(pacienteId, {
						id: pacienteId,
						nombre: cita.cliente.nombre,
						correo: cita.cliente.correo,
						telefono: generateMockPhone(pacienteId), // Generar teléfono mock
						totalCitas: 0,
						citasPendientes: 0,
						psicologoAsignado: cita.psicologo.nombre,
					});
				}

				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				const paciente = pacientesMap.get(pacienteId)!;
				paciente.totalCitas++;

				if (cita.estado === "pendiente") {
					paciente.citasPendientes++;
				}

				// Encontrar última cita (más reciente)
				if (!paciente.ultimaCita || cita.fecha > paciente.ultimaCita) {
					if (new Date(cita.fecha) <= new Date()) {
						paciente.ultimaCita = cita.fecha;
					}
				}

				// Encontrar próxima cita (más cercana en el futuro)
				if (new Date(cita.fecha) > new Date()) {
					if (!paciente.proximaCita || cita.fecha < paciente.proximaCita) {
						paciente.proximaCita = cita.fecha;
					}
				}
			});

			const pacientesArray = Array.from(pacientesMap.values());

			// Ordenar por número de citas (más activos primero)
			pacientesArray.sort((a, b) => b.totalCitas - a.totalCitas);

			setPacientes(pacientesArray);
		} catch (error) {
			console.error("Error cargando pacientes:", error);
			toast.error("Error al cargar la información de pacientes");
		} finally {
			setIsLoading(false);
		}
	};

	const applyFilters = () => {
		let filtered = [...pacientes];

		// 🔍 Búsqueda por nombre o correo
		if (searchTerm) {
			filtered = filtered.filter(
				(paciente) =>
					paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
					paciente.correo.toLowerCase().includes(searchTerm.toLowerCase()),
			);
		}

		// 🏷️ Filtro por tipo
		switch (filterType) {
			case "active":
				filtered = filtered.filter(
					(p) => p.citasPendientes > 0 || p.proximaCita,
				);
				break;
			case "inactive":
				filtered = filtered.filter(
					(p) => p.citasPendientes === 0 && !p.proximaCita,
				);
				break;
		}

		setFilteredPacientes(filtered);
	};

	// 🎮 Acciones de pacientes
	const handleViewPaciente = (pacienteId: string) => {
		toast.info("Vista detallada del paciente en desarrollo");
	};

	const handleEditPaciente = (pacienteId: string) => {
		toast.info("Edición de paciente en desarrollo");
	};

	const handleDeletePaciente = (pacienteId: string) => {
		if (!isAdmin) {
			toast.error("Solo los administradores pueden eliminar pacientes");
			return;
		}
		toast.info("Eliminación de paciente en desarrollo");
	};

	const handleNewPaciente = () => {
		toast.info("Creación de paciente en desarrollo");
	};

	// 🎨 Obtener estado del paciente
	const getPacienteStatus = (paciente: Paciente) => {
		if (paciente.citasPendientes > 0) {
			return {
				label: "Activo",
				color:
					"bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
			};
		}
		if (paciente.proximaCita) {
			return {
				label: "Programado",
				color:
					"bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
			};
		}
		if (paciente.ultimaCita) {
			return {
				label: "Inactivo",
				color:
					"bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700",
			};
		}
		return {
			label: "Nuevo",
			color:
				"bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800",
		};
	};

	// 📱 Generar teléfono mock (para demo)
	const generateMockPhone = (id: string): string => {
		const hash = id
			.split("")
			.reduce((acc, char) => acc + char.charCodeAt(0), 0);
		const phoneNumber = `9${String(hash % 100000000).padStart(8, "0")}`;
		return `+51 ${phoneNumber}`;
	};

	return (
		<Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg transition-all duration-300">
			<CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-b border-purple-100 dark:border-purple-800/50">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
					<div>
						<CardTitle className="flex items-center gap-3 text-2xl">
							<div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
								<Users className="w-6 h-6 text-white" />
							</div>
							<span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
								Gestión de Pacientes
							</span>
						</CardTitle>
						<CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
							{isAdmin
								? `Administra todos los pacientes del sistema (${pacientes.length} total)`
								: `Gestiona tus pacientes asignados (${pacientes.length} total)`}
						</CardDescription>
					</div>

					<div className="flex flex-col sm:flex-row gap-3">
						<Button
							onClick={handleNewPaciente}
							className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600"
						>
							<Plus className="w-4 h-4 mr-2" />
							Nuevo Paciente
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-6 space-y-6">
				{/* 🔍 Controles de búsqueda y filtros */}
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
						<Input
							placeholder="Buscar por nombre o correo..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
						/>
					</div>

					<div className="flex gap-2">
						<Button
							variant={filterType === "all" ? "default" : "outline"}
							size="sm"
							onClick={() => setFilterType("all")}
							className={`whitespace-nowrap ${
								filterType === "all"
									? "bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600"
									: "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/50"
							}`}
						>
							Todos ({pacientes.length})
						</Button>
						<Button
							variant={filterType === "active" ? "default" : "outline"}
							size="sm"
							onClick={() => setFilterType("active")}
							className={`whitespace-nowrap ${
								filterType === "active"
									? "bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600"
									: "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/50"
							}`}
						>
							Activos (
							{
								pacientes.filter((p) => p.citasPendientes > 0 || p.proximaCita)
									.length
							}
							)
						</Button>
						<Button
							variant={filterType === "inactive" ? "default" : "outline"}
							size="sm"
							onClick={() => setFilterType("inactive")}
							className={`whitespace-nowrap ${
								filterType === "inactive"
									? "bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600"
									: "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/50"
							}`}
						>
							Inactivos (
							{
								pacientes.filter(
									(p) => p.citasPendientes === 0 && !p.proximaCita,
								).length
							}
							)
						</Button>
					</div>
				</div>

				{/* 📊 Estadísticas rápidas */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-100 dark:border-purple-800/50">
					<div className="text-center">
						<div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
							{pacientes.length}
						</div>
						<div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
							Total Pacientes
						</div>
					</div>
					<div className="text-center">
						<div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
							{pacientes.filter((p) => p.citasPendientes > 0).length}
						</div>
						<div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
							Con Citas Pendientes
						</div>
					</div>
					<div className="text-center">
						<div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
							{pacientes.reduce((sum, p) => sum + p.totalCitas, 0)}
						</div>
						<div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
							Total de Citas
						</div>
					</div>
					<div className="text-center">
						<div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
							{Math.round(
								pacientes.reduce((sum, p) => sum + p.totalCitas, 0) /
									Math.max(pacientes.length, 1),
							)}
						</div>
						<div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
							Promedio por Paciente
						</div>
					</div>
				</div>

				{/* 📋 Tabla de pacientes */}
				{isLoading ? (
					<div className="flex justify-center py-12">
						<div className="relative">
							<div className="w-12 h-12 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin" />
						</div>
					</div>
				) : filteredPacientes.length === 0 ? (
					<div className="text-center py-12 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
						<Users className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
						<p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
							{searchTerm
								? "No se encontraron pacientes con ese criterio"
								: "No hay pacientes registrados"}
						</p>
					</div>
				) : (
					<div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800/50 shadow-sm">
						<Table>
							<TableHeader>
								<TableRow className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
									<TableHead className="text-gray-700 dark:text-gray-300 font-semibold">
										Paciente
									</TableHead>
									<TableHead className="text-gray-700 dark:text-gray-300 font-semibold">
										Contacto
									</TableHead>
									<TableHead className="text-gray-700 dark:text-gray-300 font-semibold">
										Citas
									</TableHead>
									<TableHead className="text-gray-700 dark:text-gray-300 font-semibold">
										Última Consulta
									</TableHead>
									<TableHead className="text-gray-700 dark:text-gray-300 font-semibold">
										Próxima Cita
									</TableHead>
									{isAdmin && (
										<TableHead className="text-gray-700 dark:text-gray-300 font-semibold">
											Psicólogo
										</TableHead>
									)}
									<TableHead className="text-gray-700 dark:text-gray-300 font-semibold">
										Estado
									</TableHead>
									<TableHead className="w-[50px] text-gray-700 dark:text-gray-300 font-semibold">
										Acciones
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredPacientes.map((paciente) => {
									const status = getPacienteStatus(paciente);

									return (
										<TableRow
											key={paciente.id}
											className="hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700/50"
										>
											<TableCell>
												<div className="flex items-center gap-3">
													<div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-full flex items-center justify-center shadow-sm">
														<User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
													</div>
													<div>
														<div className="font-semibold text-gray-900 dark:text-gray-100">
															{paciente.nombre}
														</div>
														<div className="text-sm text-gray-500 dark:text-gray-400">
															ID: {paciente.id}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="space-y-1">
													<div className="flex items-center gap-2 text-sm">
														<Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
														<span className="text-gray-700 dark:text-gray-300">
															{paciente.correo}
														</span>
													</div>
													<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
														<Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
														{paciente.telefono}
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="space-y-2">
													<div className="flex items-center gap-2">
														<TrendingUp className="w-4 h-4 text-gray-400 dark:text-gray-500" />
														<span className="font-semibold text-gray-900 dark:text-gray-100">
															{paciente.totalCitas}
														</span>
													</div>
													{paciente.citasPendientes > 0 && (
														<Badge
															variant="secondary"
															className="text-xs bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
														>
															{paciente.citasPendientes} pendientes
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell>
												{paciente.ultimaCita ? (
													<div className="flex items-center gap-2 text-sm">
														<Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
														<span className="text-gray-700 dark:text-gray-300">
															{new Date(paciente.ultimaCita).toLocaleDateString(
																"es-ES",
																{
																	day: "2-digit",
																	month: "short",
																},
															)}
														</span>
													</div>
												) : (
													<span className="text-gray-400 dark:text-gray-500 text-sm">
														Sin citas
													</span>
												)}
											</TableCell>
											<TableCell>
												{paciente.proximaCita ? (
													<div className="flex items-center gap-2 text-sm">
														<Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
														<span className="text-gray-700 dark:text-gray-300">
															{new Date(
																paciente.proximaCita,
															).toLocaleDateString("es-ES", {
																day: "2-digit",
																month: "short",
															})}
														</span>
													</div>
												) : (
													<span className="text-gray-400 dark:text-gray-500 text-sm">
														Sin programar
													</span>
												)}
											</TableCell>
											{isAdmin && (
												<TableCell>
													<div className="text-sm font-medium text-gray-700 dark:text-gray-300">
														{paciente.psicologoAsignado}
													</div>
												</TableCell>
											)}
											<TableCell>
												<Badge className={`${status.color} border font-medium`}>
													{status.label}
												</Badge>
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
														>
															<MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="end"
														className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl"
													>
														<DropdownMenuLabel className="text-gray-900 dark:text-gray-100">
															Acciones
														</DropdownMenuLabel>
														<DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
														<DropdownMenuItem
															onClick={() => handleViewPaciente(paciente.id)}
															className="text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 cursor-pointer"
														>
															<Eye className="mr-2 h-4 w-4" />
															Ver historial
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleEditPaciente(paciente.id)}
															className="text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 cursor-pointer"
														>
															<Edit className="mr-2 h-4 w-4" />
															Editar datos
														</DropdownMenuItem>
														{isAdmin && (
															<>
																<DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
																<DropdownMenuItem
																	onClick={() =>
																		handleDeletePaciente(paciente.id)
																	}
																	className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer"
																>
																	<Trash2 className="mr-2 h-4 w-4" />
																	Eliminar
																</DropdownMenuItem>
															</>
														)}
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
