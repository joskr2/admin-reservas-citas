// src/components/dashboard/CitasOverview.tsx
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Calendar,
	Clock,
	User,
	MapPin,
	MoreHorizontal,
	Play,
	Square,
	CheckCircle2,
	XCircle,
	Filter,
	Download,
	Plus,
	Eye,
	Edit,
	Trash2,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { mockDataManager, MOCK_USERS } from "@/lib/mockData";
import { type Cita, iniciarCita, terminarCita } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CitaModal from "@/components/custom/CitaModal";

interface CitasOverviewProps {
	userId: string;
	isAdmin: boolean;
	onDataUpdate?: () => void;
	showFullTable?: boolean;
}

export default function CitasOverview({
	userId,
	isAdmin,
	onDataUpdate,
	showFullTable = false,
}: CitasOverviewProps) {
	const router = useRouter();
	const [citas, setCitas] = useState<Cita[]>([]);
	const [filteredCitas, setFilteredCitas] = useState<Cita[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filterEstado, setFilterEstado] = useState<string>("all");
	const [filterFecha, setFilterFecha] = useState<string>("all");
	const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// 📅 Cargar citas
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		useEffect(() => {
		loadCitas();
	}, [userId, isAdmin]);

	// 🔍 Aplicar filtros
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		useEffect(() => {
		applyFilters();
	}, [citas, filterEstado, filterFecha]);

	const loadCitas = async () => {
		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 500));

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			let allCitas: any[] = [];

			if (isAdmin) {
				// Admin ve todas las citas
				const allPsicologos = MOCK_USERS.filter(
					(u) => u.rol === "psicologo" || u.rol === "admin",
				);
				allCitas = allPsicologos.flatMap((psicologo) =>
					mockDataManager.getCitasByUsuario(psicologo.id),
				);
			} else {
				// Psicólogo ve solo sus citas
				allCitas = mockDataManager.getCitasByUsuario(userId);
			}

			// Convertir a formato Cita
			const citasFormateadas: Cita[] = allCitas.map((mockCita) => ({
				id: mockCita.id,
				psicologo: mockCita.psicologo,
				cliente: mockCita.cliente,
				fecha: mockCita.fecha,
				hora_inicio: mockCita.hora_inicio,
				hora_fin: mockCita.hora_fin,
				habitacion: mockCita.habitacion,
				estado: mockCita.estado,
				notas: mockCita.notas,
				created_at: mockCita.created_at,
				updated_at: mockCita.updated_at,
			}));

			// Ordenar por fecha y hora
			citasFormateadas.sort((a, b) => {
				const dateA = new Date(`${a.fecha} ${a.hora_inicio}`);
				const dateB = new Date(`${b.fecha} ${b.hora_inicio}`);
				return dateB.getTime() - dateA.getTime();
			});

			setCitas(citasFormateadas);
		} catch (error) {
			console.error("Error cargando citas:", error);
			toast.error("Error al cargar las citas");
		} finally {
			setIsLoading(false);
		}
	};

	const applyFilters = () => {
		let filtered = [...citas];

		// Filtro por estado
		if (filterEstado !== "all") {
			filtered = filtered.filter((cita) => cita.estado === filterEstado);
		}

		// Filtro por fecha
		const today = new Date().toISOString().split("T")[0];
		const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0];
		const thisWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0];

		switch (filterFecha) {
			case "today":
				filtered = filtered.filter((cita) => cita.fecha === today);
				break;
			case "tomorrow":
				filtered = filtered.filter((cita) => cita.fecha === tomorrow);
				break;
			case "week":
				filtered = filtered.filter(
					(cita) => cita.fecha >= today && cita.fecha <= thisWeek,
				);
				break;
			case "past":
				filtered = filtered.filter((cita) => cita.fecha < today);
				break;
		}

		setFilteredCitas(filtered);
	};

	// 🎮 Acciones de citas
	const handleCitaAction = async (action: string, citaId: string) => {
		try {
			// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
			let response;
			switch (action) {
				case "iniciar":
					response = await iniciarCita(citaId);
					break;
				case "terminar":
					response = await terminarCita(citaId);
					break;
				default:
					return;
			}

			if (response.success) {
				loadCitas();
				onDataUpdate?.();
			}
		} catch (error) {
			console.error(`Error al ${action} cita:`, error);
			toast.error(`Error al ${action} la cita`);
		}
	};

	const handleViewCita = (cita: Cita) => {
		setSelectedCita(cita);
		setIsModalOpen(true);
	};

	const handleEditCita = (citaId: string) => {
		// TODO: Implementar edición de cita
		toast.info("Función de edición en desarrollo");
	};

	const handleDeleteCita = (citaId: string) => {
		// TODO: Implementar eliminación de cita
		toast.info("Función de eliminación en desarrollo");
	};

	// 🎨 Obtener color del estado
	const getEstadoColor = (estado: string) => {
		switch (estado) {
			case "pendiente":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
			case "en_progreso":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
			case "terminada":
				return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
			case "cancelada":
				return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
		}
	};

	// 🎨 Obtener icono del estado
	const getEstadoIcon = (estado: string) => {
		switch (estado) {
			case "pendiente":
				return <Clock className="w-4 h-4" />;
			case "en_progreso":
				return <Play className="w-4 h-4" />;
			case "terminada":
				return <CheckCircle2 className="w-4 h-4" />;
			case "cancelada":
				return <XCircle className="w-4 h-4" />;
			default:
				return <Calendar className="w-4 h-4" />;
		}
	};

	const citasAMostrar = showFullTable
		? filteredCitas
		: filteredCitas.slice(0, 5);

	return (
		<div className="space-y-6">
			{/* 🎛️ Controles y filtros */}
			<Card>
				<CardHeader>
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div>
							<CardTitle className="flex items-center gap-2">
								<Calendar className="w-6 h-6 text-blue-600" />
								{showFullTable ? "Todas las Citas" : "Citas Recientes"}
							</CardTitle>
							<CardDescription>
								{isAdmin
									? "Gestiona todas las citas del sistema"
									: "Administra tus citas programadas"}
							</CardDescription>
						</div>

						<div className="flex flex-col sm:flex-row gap-2">
							{/* 🔍 Filtros */}
							<Select value={filterEstado} onValueChange={setFilterEstado}>
								<SelectTrigger className="w-full sm:w-[180px]">
									<SelectValue placeholder="Estado" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Todos los estados</SelectItem>
									<SelectItem value="pendiente">Pendientes</SelectItem>
									<SelectItem value="en_progreso">En progreso</SelectItem>
									<SelectItem value="terminada">Terminadas</SelectItem>
									<SelectItem value="cancelada">Canceladas</SelectItem>
								</SelectContent>
							</Select>

							<Select value={filterFecha} onValueChange={setFilterFecha}>
								<SelectTrigger className="w-full sm:w-[180px]">
									<SelectValue placeholder="Fecha" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Todas las fechas</SelectItem>
									<SelectItem value="today">Hoy</SelectItem>
									<SelectItem value="tomorrow">Mañana</SelectItem>
									<SelectItem value="week">Esta semana</SelectItem>
									<SelectItem value="past">Pasadas</SelectItem>
								</SelectContent>
							</Select>

							{/* ➕ Nueva cita */}
							<Button
								onClick={() => router.push("/admin/citas/nueva")}
								className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
							>
								<Plus className="w-4 h-4 mr-2" />
								Nueva Cita
							</Button>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					{isLoading ? (
						<div className="flex justify-center py-8">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
						</div>
					) : citasAMostrar.length === 0 ? (
						<div className="text-center py-8">
							<Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
							<p className="text-gray-500">No se encontraron citas</p>
						</div>
					) : (
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Paciente</TableHead>
										{isAdmin && <TableHead>Psicólogo</TableHead>}
										<TableHead>Fecha</TableHead>
										<TableHead>Hora</TableHead>
										<TableHead>Sala</TableHead>
										<TableHead>Estado</TableHead>
										<TableHead className="w-[50px]">Acciones</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{citasAMostrar.map((cita) => (
										<TableRow
											key={cita.id}
											className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
										>
											<TableCell>
												<div className="flex items-center gap-2">
													<User className="w-4 h-4 text-gray-400" />
													<div>
														<div className="font-medium">
															{cita.cliente.nombre}
														</div>
														<div className="text-sm text-gray-500">
															{cita.cliente.correo}
														</div>
													</div>
												</div>
											</TableCell>
											{isAdmin && (
												<TableCell>
													<div className="font-medium">
														{cita.psicologo.nombre}
													</div>
												</TableCell>
											)}
											<TableCell>
												<div className="flex items-center gap-2">
													<Calendar className="w-4 h-4 text-gray-400" />
													{new Date(cita.fecha).toLocaleDateString("es-ES", {
														day: "2-digit",
														month: "short",
														year: "numeric",
													})}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<Clock className="w-4 h-4 text-gray-400" />
													{cita.hora_inicio} - {cita.hora_fin}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<MapPin className="w-4 h-4 text-gray-400" />
													{cita.habitacion.numero}
												</div>
											</TableCell>
											<TableCell>
												<Badge className={getEstadoColor(cita.estado)}>
													{getEstadoIcon(cita.estado)}
													<span className="ml-1 capitalize">
														{cita.estado.replace("_", " ")}
													</span>
												</Badge>
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
															onClick={() => handleViewCita(cita)}
														>
															<Eye className="mr-2 h-4 w-4" />
															Ver detalles
														</DropdownMenuItem>
														{cita.estado === "pendiente" && (
															<DropdownMenuItem
																onClick={() =>
																	handleCitaAction("iniciar", cita.id)
																}
															>
																<Play className="mr-2 h-4 w-4" />
																Iniciar
															</DropdownMenuItem>
														)}
														{cita.estado === "en_progreso" && (
															<DropdownMenuItem
																onClick={() =>
																	handleCitaAction("terminar", cita.id)
																}
															>
																<CheckCircle2 className="mr-2 h-4 w-4" />
																Terminar
															</DropdownMenuItem>
														)}
														{isAdmin && (
															<>
																<DropdownMenuSeparator />
																<DropdownMenuItem
																	onClick={() => handleEditCita(cita.id)}
																>
																	<Edit className="mr-2 h-4 w-4" />
																	Editar
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() => handleDeleteCita(cita.id)}
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
									))}
								</TableBody>
							</Table>
						</div>
					)}

					{/* 👀 Ver todas las citas */}
					{!showFullTable && filteredCitas.length > 5 && (
						<div className="mt-4 text-center">
							<Button
								variant="outline"
								onClick={() => router.push("/dashboard?tab=citas")}
							>
								Ver todas las citas ({filteredCitas.length})
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* 🔍 Modal de detalles de cita */}
			<CitaModal
				cita={selectedCita}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onUpdate={() => {
					loadCitas();
					onDataUpdate?.();
				}}
				esPsicologo={true}
			/>
		</div>
	);
}
