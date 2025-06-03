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
		// TODO: Implementar modal o página de detalles
	};

	const handleEditPaciente = (pacienteId: string) => {
		toast.info("Edición de paciente en desarrollo");
		// TODO: Implementar formulario de edición
	};

	const handleDeletePaciente = (pacienteId: string) => {
		if (!isAdmin) {
			toast.error("Solo los administradores pueden eliminar pacientes");
			return;
		}
		toast.info("Eliminación de paciente en desarrollo");
		// TODO: Implementar confirmación y eliminación
	};

	const handleNewPaciente = () => {
		toast.info("Creación de paciente en desarrollo");
		// TODO: Implementar formulario de nuevo paciente
	};

	// 🎨 Obtener estado del paciente
	const getPacienteStatus = (paciente: Paciente) => {
		if (paciente.citasPendientes > 0) {
			return {
				label: "Activo",
				color:
					"bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
			};
		}
		if (paciente.proximaCita) {
			return {
				label: "Programado",
				color:
					"bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
			};
		}
		if (paciente.ultimaCita) {
			return {
				label: "Inactivo",
				color:
					"bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
			};
		}
		return {
			label: "Nuevo",
			color:
				"bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
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
		<Card>
			<CardHeader>
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
					<div>
						<CardTitle className="flex items-center gap-2">
							<Users className="w-6 h-6 text-purple-600" />
							Gestión de Pacientes
						</CardTitle>
						<CardDescription>
							{isAdmin
								? `Administra todos los pacientes del sistema (${pacientes.length} total)`
								: `Gestiona tus pacientes asignados (${pacientes.length} total)`}
						</CardDescription>
					</div>

					<div className="flex flex-col sm:flex-row gap-2">
						<Button
							onClick={handleNewPaciente}
							className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
						>
							<Plus className="w-4 h-4 mr-2" />
							Nuevo Paciente
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* 🔍 Controles de búsqueda y filtros */}
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<Input
							placeholder="Buscar por nombre o correo..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>

					<div className="flex gap-2">
						<Button
							variant={filterType === "all" ? "default" : "outline"}
							size="sm"
							onClick={() => setFilterType("all")}
							className="whitespace-nowrap"
						>
							Todos ({pacientes.length})
						</Button>
						<Button
							variant={filterType === "active" ? "default" : "outline"}
							size="sm"
							onClick={() => setFilterType("active")}
							className="whitespace-nowrap"
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
							className="whitespace-nowrap"
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
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-600">
							{pacientes.length}
						</div>
						<div className="text-sm text-gray-600">Total Pacientes</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-green-600">
							{pacientes.filter((p) => p.citasPendientes > 0).length}
						</div>
						<div className="text-sm text-gray-600">Con Citas Pendientes</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-purple-600">
							{pacientes.reduce((sum, p) => sum + p.totalCitas, 0)}
						</div>
						<div className="text-sm text-gray-600">Total de Citas</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-amber-600">
							{Math.round(
								pacientes.reduce((sum, p) => sum + p.totalCitas, 0) /
									Math.max(pacientes.length, 1),
							)}
						</div>
						<div className="text-sm text-gray-600">Promedio por Paciente</div>
					</div>
				</div>

				{/* 📋 Tabla de pacientes */}
				{isLoading ? (
					<div className="flex justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
					</div>
				) : filteredPacientes.length === 0 ? (
					<div className="text-center py-8">
						<Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
						<p className="text-gray-500">
							{searchTerm
								? "No se encontraron pacientes con ese criterio"
								: "No hay pacientes registrados"}
						</p>
					</div>
				) : (
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Paciente</TableHead>
									<TableHead>Contacto</TableHead>
									<TableHead>Citas</TableHead>
									<TableHead>Última Consulta</TableHead>
									<TableHead>Próxima Cita</TableHead>
									{isAdmin && <TableHead>Psicólogo</TableHead>}
									<TableHead>Estado</TableHead>
									<TableHead className="w-[50px]">Acciones</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredPacientes.map((paciente) => {
									const status = getPacienteStatus(paciente);

									return (
										<TableRow
											key={paciente.id}
											className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
										>
											<TableCell>
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
														<User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
													</div>
													<div>
														<div className="font-medium">{paciente.nombre}</div>
														<div className="text-sm text-gray-500">
															ID: {paciente.id}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="space-y-1">
													<div className="flex items-center gap-2 text-sm">
														<Mail className="w-4 h-4 text-gray-400" />
														{paciente.correo}
													</div>
													<div className="flex items-center gap-2 text-sm text-gray-500">
														<Phone className="w-4 h-4 text-gray-400" />
														{paciente.telefono}
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="space-y-1">
													<div className="flex items-center gap-2">
														<TrendingUp className="w-4 h-4 text-gray-400" />
														<span className="font-medium">
															{paciente.totalCitas}
														</span>
													</div>
													{paciente.citasPendientes > 0 && (
														<Badge variant="secondary" className="text-xs">
															{paciente.citasPendientes} pendientes
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell>
												{paciente.ultimaCita ? (
													<div className="flex items-center gap-2 text-sm">
														<Clock className="w-4 h-4 text-gray-400" />
														{new Date(paciente.ultimaCita).toLocaleDateString(
															"es-ES",
															{
																day: "2-digit",
																month: "short",
															},
														)}
													</div>
												) : (
													<span className="text-gray-400 text-sm">
														Sin citas
													</span>
												)}
											</TableCell>
											<TableCell>
												{paciente.proximaCita ? (
													<div className="flex items-center gap-2 text-sm">
														<Calendar className="w-4 h-4 text-gray-400" />
														{new Date(paciente.proximaCita).toLocaleDateString(
															"es-ES",
															{
																day: "2-digit",
																month: "short",
															},
														)}
													</div>
												) : (
													<span className="text-gray-400 text-sm">
														Sin programar
													</span>
												)}
											</TableCell>
											{isAdmin && (
												<TableCell>
													<div className="text-sm">
														{paciente.psicologoAsignado}
													</div>
												</TableCell>
											)}
											<TableCell>
												<Badge className={status.color}>{status.label}</Badge>
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" className="h-8 w-8 p-0">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuLabel>Acciones</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() => handleViewPaciente(paciente.id)}
														>
															<Eye className="mr-2 h-4 w-4" />
															Ver historial
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleEditPaciente(paciente.id)}
														>
															<Edit className="mr-2 h-4 w-4" />
															Editar datos
														</DropdownMenuItem>
														{isAdmin && (
															<>
																<DropdownMenuSeparator />
																<DropdownMenuItem
																	onClick={() =>
																		handleDeletePaciente(paciente.id)
																	}
																	className="text-red-600"
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
