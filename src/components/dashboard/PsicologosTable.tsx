// src/components/dashboard/PsicologosTable.tsx
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
	UserCheck,
	User,
	Mail,
	Calendar,
	Search,
	MoreHorizontal,
	Eye,
	Edit,
	Trash2,
	Plus,
	Crown,
	Activity,
	Users,
	Shield,
	Clock,
	TrendingUp,
	Settings,
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { mockDataManager, MOCK_USERS, type MockUser } from "@/lib/mockData";
import { toast } from "sonner";

interface PsicologoExtendido {
	id: string;
	nombre: string;
	correo: string;
	rol: "admin" | "psicologo";
	totalCitas: number;
	citasHoy: number;
	citasPendientes: number;
	totalPacientes: number;
	ultimaActividad?: string;
	estado: "activo" | "inactivo";
	especialidad: string;
}

interface PsicologosTableProps {
	onDataUpdate?: () => void;
}

export default function PsicologosTable({
	onDataUpdate,
}: PsicologosTableProps) {
	const [psicologos, setPsicologos] = useState<PsicologoExtendido[]>([]);
	const [filteredPsicologos, setFilteredPsicologos] = useState<
		PsicologoExtendido[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterRole, setFilterRole] = useState<"all" | "admin" | "psicologo">(
		"all",
	);
	const [isNewPsicologoDialogOpen, setIsNewPsicologoDialogOpen] =
		useState(false);
	const [newPsicologoData, setNewPsicologoData] = useState({
		nombre: "",
		correo: "",
		rol: "psicologo" as "admin" | "psicologo",
		especialidad: "",
	});

	// 📊 Cargar psicólogos
	useEffect(() => {
		loadPsicologos();
	}, []);

	// 🔍 Aplicar filtros y búsqueda
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		useEffect(() => {
		applyFilters();
	}, [psicologos, searchTerm, filterRole]);

	const loadPsicologos = async () => {
		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 500));

			const allPsicologos = MOCK_USERS.filter(
				(u) => u.rol === "psicologo" || u.rol === "admin",
			);
			const today = new Date().toISOString().split("T")[0];

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const psicologosExtendidos:any = allPsicologos.map(
				(psicologo) => {
					const citas = mockDataManager.getCitasByUsuario(psicologo.id);
					const pacientesUnicos = new Set(citas.map((c) => c.psicologo.id)).size;
					const citasHoy = citas.filter((c) => c.fecha === today).length;
					const citasPendientes = citas.filter(
						(c) => c.estado === "pendiente",
					).length;

					// Encontrar última actividad
					const citasOrdenadas = citas.sort(
						(a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
					);
					const ultimaActividad =
						citasOrdenadas.length > 0 ? citasOrdenadas[0].fecha : undefined;

					return {
						id: psicologo.id,
						nombre: psicologo.nombre,
						correo: psicologo.correo,
						rol: psicologo.rol,
						totalCitas: citas.length,
						citasHoy,
						citasPendientes,
						totalPacientes: pacientesUnicos,
						ultimaActividad,
						estado: citasHoy > 0 || citasPendientes > 0 ? "activo" : "inactivo",
						especialidad: getEspecialidad(psicologo.nombre),
					};
				},
			);

			// Ordenar por número de citas (más activos primero)
			psicologosExtendidos.sort((a: { totalCitas: number; }, b: { totalCitas: number; }) => b.totalCitas - a.totalCitas);

			setPsicologos(psicologosExtendidos);
		} catch (error) {
			console.error("Error cargando psicólogos:", error);
			toast.error("Error al cargar la información de psicólogos");
		} finally {
			setIsLoading(false);
		}
	};

	const applyFilters = () => {
		let filtered = [...psicologos];

		// 🔍 Búsqueda por nombre o correo
		if (searchTerm) {
			filtered = filtered.filter(
				(psicologo) =>
					psicologo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
					psicologo.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
					psicologo.especialidad
						.toLowerCase()
						.includes(searchTerm.toLowerCase()),
			);
		}

		// 🏷️ Filtro por rol
		if (filterRole !== "all") {
			filtered = filtered.filter((p) => p.rol === filterRole);
		}

		setFilteredPsicologos(filtered);
	};

	// 🎮 Acciones de psicólogos
	const handleViewPsicologo = (psicologoId: string) => {
		toast.info("Vista detallada del psicólogo en desarrollo");
		// TODO: Implementar modal o página de detalles
	};

	const handleEditPsicologo = (psicologoId: string) => {
		toast.info("Edición de psicólogo en desarrollo");
		// TODO: Implementar formulario de edición
	};

	const handleDeletePsicologo = (psicologoId: string) => {
		toast.info("Eliminación de psicólogo en desarrollo");
		// TODO: Implementar confirmación y eliminación
	};

	const handleCreatePsicologo = async () => {
		if (
			!newPsicologoData.nombre ||
			!newPsicologoData.correo ||
			!newPsicologoData.especialidad
		) {
			toast.error("Por favor completa todos los campos");
			return;
		}

		try {
			// TODO: Implementar creación real
			toast.success("Psicólogo creado exitosamente");
			setIsNewPsicologoDialogOpen(false);
			setNewPsicologoData({
				nombre: "",
				correo: "",
				rol: "psicologo",
				especialidad: "",
			});
			loadPsicologos();
			onDataUpdate?.();
		} catch (error) {
			toast.error("Error al crear el psicólogo");
		}
	};

	const handleToggleRole = (psicologoId: string) => {
		toast.info("Cambio de rol en desarrollo");
		// TODO: Implementar cambio de rol
	};

	// 🎨 Obtener especialidad (mock)
	function getEspecialidad(nombre: string): string {
		const especialidades = {
			"Dr. Ana María González": "Psicología Clínica",
			"Dr. Carlos Mendoza": "Terapia Familiar",
			"Dra. Laura Jiménez": "Psicología Infantil",
			"Dr. Miguel Torres": "Terapia Cognitiva",
			"Dra. Elena Vásquez": "Psicología de Parejas",
		};
		return (
			especialidades[nombre as keyof typeof especialidades] ||
			"Psicología General"
		);
	}

	// 🎨 Obtener color del estado
	const getEstadoColor = (estado: string) => {
		return estado === "activo"
			? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
			: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
					<div>
						<CardTitle className="flex items-center gap-2">
							<UserCheck className="w-6 h-6 text-indigo-600" />
							Gestión de Psicólogos
						</CardTitle>
						<CardDescription>
							Administra el equipo de profesionales del sistema (
							{psicologos.length} total)
						</CardDescription>
					</div>

					<div className="flex flex-col sm:flex-row gap-2">
						<Dialog
							open={isNewPsicologoDialogOpen}
							onOpenChange={setIsNewPsicologoDialogOpen}
						>
							<DialogTrigger asChild>
								<Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700">
									<Plus className="w-4 h-4 mr-2" />
									Nuevo Psicólogo
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Agregar Nuevo Psicólogo</DialogTitle>
									<DialogDescription>
										Completa la información del nuevo profesional
									</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4 py-4">
									<div className="grid gap-2">
										<Label htmlFor="nombre">Nombre completo</Label>
										<Input
											id="nombre"
											value={newPsicologoData.nombre}
											onChange={(e) =>
												setNewPsicologoData((prev) => ({
													...prev,
													nombre: e.target.value,
												}))
											}
											placeholder="Dr. Juan Pérez"
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="correo">Correo electrónico</Label>
										<Input
											id="correo"
											type="email"
											value={newPsicologoData.correo}
											onChange={(e) =>
												setNewPsicologoData((prev) => ({
													...prev,
													correo: e.target.value,
												}))
											}
											placeholder="juan.perez@psicologia.com"
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="especialidad">Especialidad</Label>
										<Input
											id="especialidad"
											value={newPsicologoData.especialidad}
											onChange={(e) =>
												setNewPsicologoData((prev) => ({
													...prev,
													especialidad: e.target.value,
												}))
											}
											placeholder="Terapia Cognitiva"
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="rol">Rol</Label>
										<Select
											value={newPsicologoData.rol}
											onValueChange={(value) =>
												setNewPsicologoData((prev) => ({
													...prev,
													rol: value as "admin" | "psicologo",
												}))
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="psicologo">Psicólogo</SelectItem>
												<SelectItem value="admin">Administrador</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<DialogFooter>
									<Button
										variant="outline"
										onClick={() => setIsNewPsicologoDialogOpen(false)}
									>
										Cancelar
									</Button>
									<Button onClick={handleCreatePsicologo}>
										Crear Psicólogo
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* 🔍 Controles de búsqueda y filtros */}
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<Input
							placeholder="Buscar por nombre, correo o especialidad..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>

					<div className="flex gap-2">
						<Button
							variant={filterRole === "all" ? "default" : "outline"}
							size="sm"
							onClick={() => setFilterRole("all")}
						>
							Todos ({psicologos.length})
						</Button>
						<Button
							variant={filterRole === "admin" ? "default" : "outline"}
							size="sm"
							onClick={() => setFilterRole("admin")}
						>
							<Crown className="w-4 h-4 mr-1" />
							Admins ({psicologos.filter((p) => p.rol === "admin").length})
						</Button>
						<Button
							variant={filterRole === "psicologo" ? "default" : "outline"}
							size="sm"
							onClick={() => setFilterRole("psicologo")}
						>
							Psicólogos (
							{psicologos.filter((p) => p.rol === "psicologo").length})
						</Button>
					</div>
				</div>

				{/* 📊 Estadísticas rápidas */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg">
					<div className="text-center">
						<div className="text-2xl font-bold text-indigo-600">
							{psicologos.length}
						</div>
						<div className="text-sm text-gray-600">Total Profesionales</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-green-600">
							{psicologos.filter((p) => p.estado === "activo").length}
						</div>
						<div className="text-sm text-gray-600">Activos Hoy</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-600">
							{psicologos.reduce((sum, p) => sum + p.totalCitas, 0)}
						</div>
						<div className="text-sm text-gray-600">Total de Citas</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-purple-600">
							{psicologos.reduce((sum, p) => sum + p.totalPacientes, 0)}
						</div>
						<div className="text-sm text-gray-600">Total Pacientes</div>
					</div>
				</div>

				{/* 📋 Tabla de psicólogos */}
				{isLoading ? (
					<div className="flex justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
					</div>
				) : filteredPsicologos.length === 0 ? (
					<div className="text-center py-8">
						<UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
						<p className="text-gray-500">
							{searchTerm
								? "No se encontraron psicólogos con ese criterio"
								: "No hay psicólogos registrados"}
						</p>
					</div>
				) : (
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Profesional</TableHead>
									<TableHead>Especialidad</TableHead>
									<TableHead>Actividad Hoy</TableHead>
									<TableHead>Estadísticas</TableHead>
									<TableHead>Última Actividad</TableHead>
									<TableHead>Estado</TableHead>
									<TableHead>Rol</TableHead>
									<TableHead className="w-[50px]">Acciones</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredPsicologos.map((psicologo) => (
									<TableRow
										key={psicologo.id}
										className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
									>
										<TableCell>
											<div className="flex items-center gap-3">
												<div
													className={`w-10 h-10 rounded-full flex items-center justify-center ${
														psicologo.rol === "admin"
															? "bg-yellow-100 dark:bg-yellow-900/50"
															: "bg-indigo-100 dark:bg-indigo-900/50"
													}`}
												>
													{psicologo.rol === "admin" ? (
														<Crown className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
													) : (
														<UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
													)}
												</div>
												<div>
													<div className="font-medium">{psicologo.nombre}</div>
													<div className="text-sm text-gray-500">
														{psicologo.correo}
													</div>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div className="text-sm">{psicologo.especialidad}</div>
										</TableCell>
										<TableCell>
											<div className="space-y-1">
												<div className="flex items-center gap-2">
													<Calendar className="w-4 h-4 text-gray-400" />
													<span className="text-sm">
														{psicologo.citasHoy} citas
													</span>
												</div>
												{psicologo.citasPendientes > 0 && (
													<Badge variant="secondary" className="text-xs">
														{psicologo.citasPendientes} pendientes
													</Badge>
												)}
											</div>
										</TableCell>
										<TableCell>
											<div className="space-y-1">
												<div className="flex items-center gap-2 text-sm">
													<TrendingUp className="w-4 h-4 text-gray-400" />
													{psicologo.totalCitas} citas totales
												</div>
												<div className="flex items-center gap-2 text-sm text-gray-500">
													<Users className="w-4 h-4 text-gray-400" />
													{psicologo.totalPacientes} pacientes
												</div>
											</div>
										</TableCell>
										<TableCell>
											{psicologo.ultimaActividad ? (
												<div className="flex items-center gap-2 text-sm">
													<Clock className="w-4 h-4 text-gray-400" />
													{new Date(
														psicologo.ultimaActividad,
													).toLocaleDateString("es-ES", {
														day: "2-digit",
														month: "short",
													})}
												</div>
											) : (
												<span className="text-gray-400 text-sm">
													Sin actividad
												</span>
											)}
										</TableCell>
										<TableCell>
											<Badge className={getEstadoColor(psicologo.estado)}>
												<Activity className="w-3 h-3 mr-1" />
												{psicologo.estado === "activo" ? "Activo" : "Inactivo"}
											</Badge>
										</TableCell>
										<TableCell>
											<Badge
												variant={
													psicologo.rol === "admin" ? "default" : "secondary"
												}
												className={
													psicologo.rol === "admin"
														? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
														: ""
												}
											>
												{psicologo.rol === "admin" ? (
													<>
														<Crown className="w-3 h-3 mr-1" />
														Admin
													</>
												) : (
													<>
														<Shield className="w-3 h-3 mr-1" />
														Psicólogo
													</>
												)}
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
														onClick={() => handleViewPsicologo(psicologo.id)}
													>
														<Eye className="mr-2 h-4 w-4" />
														Ver detalles
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleEditPsicologo(psicologo.id)}
													>
														<Edit className="mr-2 h-4 w-4" />
														Editar perfil
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleToggleRole(psicologo.id)}
													>
														<Settings className="mr-2 h-4 w-4" />
														Cambiar rol
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => handleDeletePsicologo(psicologo.id)}
														className="text-red-600"
													>
														<Trash2 className="mr-2 h-4 w-4" />
														Eliminar
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
