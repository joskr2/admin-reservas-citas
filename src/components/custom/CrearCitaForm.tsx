// src/components/custom/CrearCitaForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, addHours } from "date-fns";
import { es } from "date-fns/locale";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
	crearCita,
	verificarDisponibilidad,
	obtenerHabitaciones,
} from "@/lib/api";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	ClockIcon,
	CalendarIcon as LucideCalendarIcon,
	UserIcon,
	BuildingIcon,
	Phone,
	Mail,
	AlertCircle,
	CheckCircle2,
	Loader2,
} from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { useAuth } from "@/contexts/AuthContext";
import {
	appointmentFormSchema,
	type AppointmentFormData,
} from "@/lib/validations/appointment";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Define available time slots
const TIME_SLOTS = [
	"09:00",
	"09:15",
	"09:30",
	"09:45",
	"10:00",
	"10:15",
	"10:30",
	"10:45",
	"11:00",
	"11:15",
	"11:30",
	"11:45",
	"12:00",
	"12:15",
	"12:30",
	"12:45",
	// Skip lunch hour
	"14:00",
	"14:15",
	"14:30",
	"14:45",
	"15:00",
	"15:15",
	"15:30",
	"15:45",
	"16:00",
	"16:15",
	"16:30",
	"16:45",
	"17:00",
	"17:15",
	"17:30",
	"17:45",
	"18:00",
	"18:15",
	"18:30",
	"18:45",
	"19:00",
	"19:15",
	"19:30",
	"19:45",
];

// Duraciones disponibles
const DURATION_OPTIONS = [
	{ value: 30, label: "30 minutos" },
	{ value: 45, label: "45 minutos" },
	{ value: 60, label: "1 hora" },
	{ value: 75, label: "1 hora 15 minutos" },
	{ value: 90, label: "1 hora 30 minutos" },
	{ value: 105, label: "1 hora 45 minutos" },
	{ value: 120, label: "2 horas" },
];

export default function CreateAppointmentForm() {
	const router = useRouter();
	const { user } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDateTimePopoverOpen, setIsDateTimePopoverOpen] = useState(false);
	const [selectedDateInPopover, setSelectedDateInPopover] = useState<
		Date | undefined
	>(undefined);
	const [availableRooms, setAvailableRooms] = useState<
		Array<{ value: string; label: string }>
	>([]);
	const [isLoadingRooms, setIsLoadingRooms] = useState(false);
	const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
	const [availabilityStatus, setAvailabilityStatus] = useState<
		"available" | "unavailable" | null
	>(null);

	// Initialize the form
	const form = useForm<AppointmentFormData>({
		resolver: zodResolver(appointmentFormSchema),
		defaultValues: {
			clientName: "",
			clientEmail: "",
			clientPhone: "",
			startTime: "",
			duration: 60,
			room: "",
			notes: "",
			reminderEnabled: true,
			reminderTime: "2hours",
		},
	});

	// Cargar habitaciones disponibles
	useEffect(() => {
		const loadRooms = async () => {
			setIsLoadingRooms(true);
			try {
				const response = await obtenerHabitaciones();
				if (response.success && response.data) {
					const rooms = response.data
						.filter((room) => room.disponible)
						.map((room) => ({
							value: room.id.toString(),
							label: room.numero,
						}));
					setAvailableRooms(rooms);
				} else {
					toast.error("Error al cargar las habitaciones");
				}
			} catch (error) {
				console.error("Error cargando habitaciones:", error);
				toast.error("Error al cargar las habitaciones disponibles");
			} finally {
				setIsLoadingRooms(false);
			}
		};

		loadRooms();
	}, []);

	// Verificar disponibilidad cuando cambian fecha, hora o duración
	useEffect(() => {
		const subscription = form.watch(async (value, { name }) => {
			if (
				(name === "appointmentDate" ||
					name === "startTime" ||
					name === "duration") &&
				value.appointmentDate &&
				value.startTime &&
				user
			) {
				setIsCheckingAvailability(true);
				setAvailabilityStatus(null);

				try {
					const endTime = addHours(
						new Date(`2000-01-01 ${value.startTime}`),
						(value.duration || 60) / 60,
					);

					const response = await verificarDisponibilidad({
						psicologoId: user.id,
						fecha: format(value.appointmentDate, "yyyy-MM-dd"),
						horaInicio: value.startTime,
						horaFin: format(endTime, "HH:mm"),
					});

					if (response.success && response.data) {
						setAvailabilityStatus(
							response.data.disponible ? "available" : "unavailable",
						);
						if (!response.data.disponible && response.data.conflictos) {
							toast.error("Ya existe una cita en ese horario");
						}
					}
				} catch (error) {
					console.error("Error verificando disponibilidad:", error);
				} finally {
					setIsCheckingAvailability(false);
				}
			}
		});

		return () => subscription.unsubscribe();
	}, [form, user]);

	// Watch for changes
	const watchedAppointmentDate = form.watch("appointmentDate");
	const watchedStartTime = form.watch("startTime");
	const watchedDuration = form.watch("duration");

	// Form submission handler
	async function onSubmit(values: AppointmentFormData) {
		if (!user) {
			toast.error("Debes iniciar sesión para crear una cita");
			return;
		}

		if (availabilityStatus === "unavailable") {
			toast.error("El horario seleccionado no está disponible");
			return;
		}

		setIsSubmitting(true);

		try {
			// Calcular hora de fin
			const startDateObject = new Date(values.appointmentDate);
			const [hours, minutes] = values.startTime.split(":").map(Number);
			startDateObject.setHours(hours, minutes, 0, 0);

			const endDateObject = addHours(startDateObject, values.duration / 60);

			const selectedRoom = availableRooms.find((r) => r.value === values.room);

			const appointmentData = {
				psicologo: {
					id: user.id,
					nombre: user.name,
					correo: user.email,
				},
				cliente: {
					id: `client_${Date.now()}`,
					nombre: values.clientName,
					correo: values.clientEmail,
				},
				fecha: format(values.appointmentDate, "yyyy-MM-dd"),
				hora_inicio: values.startTime,
				hora_fin: format(endDateObject, "HH:mm"),
				habitacion: selectedRoom?.label || values.room,
				notas: values.notes,
			};

			const response = await crearCita(appointmentData);

			if (response.success) {
				toast.success("Cita creada exitosamente");
				router.push("/admin/citas");
			} else {
				toast.error(response.message || "Error al crear la cita");
			}
		} catch (error) {
			console.error("Error al crear cita:", error);
			toast.error("Ha ocurrido un error al crear la cita");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<ProtectedRoute requiredRole="psicologo">
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
				<div className="max-w-4xl mx-auto py-8 px-4">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
							Nueva Cita
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Agendar una nueva cita con un paciente
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Información del Psicólogo */}
						<div className="lg:col-span-1">
							<Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
								<CardHeader className="text-center pb-2">
									<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<UserIcon className="w-8 h-8 text-blue-600" />
									</div>
									<CardTitle className="text-xl text-gray-900 dark:text-gray-100">
										Psicólogo/a Asignado
									</CardTitle>
								</CardHeader>
								<CardContent className="text-center">
									<h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">
										{user?.name || "Cargando..."}
									</h3>
									<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
										{user?.email || "Cargando..."}
									</p>
									<div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
										<p className="text-green-800 dark:text-green-200 text-sm font-medium">
											✓ Disponible
										</p>
									</div>
								</CardContent>
							</Card>

							{/* Estado de disponibilidad */}
							{watchedAppointmentDate && watchedStartTime && (
								<Card className="mt-4 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
									<CardContent className="pt-6">
										<div className="flex items-center gap-3">
											{isCheckingAvailability ? (
												<>
													<Loader2 className="w-5 h-5 animate-spin text-blue-600" />
													<span className="text-sm text-gray-600 dark:text-gray-400">
														Verificando disponibilidad...
													</span>
												</>
											) : availabilityStatus === "available" ? (
												<>
													<CheckCircle2 className="w-5 h-5 text-green-600" />
													<span className="text-sm text-green-800 dark:text-green-200 font-medium">
														Horario disponible
													</span>
												</>
											) : availabilityStatus === "unavailable" ? (
												<>
													<AlertCircle className="w-5 h-5 text-red-600" />
													<span className="text-sm text-red-800 dark:text-red-200 font-medium">
														Horario no disponible
													</span>
												</>
											) : null}
										</div>
									</CardContent>
								</Card>
							)}
						</div>

						{/* Formulario de Cita */}
						<div className="lg:col-span-2">
							<Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
								<CardHeader>
									<CardTitle className="text-2xl flex items-center gap-2 text-gray-900 dark:text-gray-100">
										<LucideCalendarIcon className="w-6 h-6 text-blue-600" />
										Detalles de la Cita
									</CardTitle>
									<CardDescription className="text-gray-600 dark:text-gray-400">
										Complete la información necesaria para agendar la consulta
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Form {...form}>
										<form
											onSubmit={form.handleSubmit(onSubmit)}
											className="space-y-8"
										>
											{/* Información del Paciente */}
											<div className="space-y-6">
												<div className="flex items-center gap-2 mb-4">
													<UserIcon className="w-5 h-5 text-gray-600" />
													<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
														Información del Paciente
													</h3>
												</div>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<FormField
														control={form.control}
														name="clientName"
														render={({ field }) => (
															<FormItem>
																<FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
																	Nombre Completo*
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Juan Pérez García"
																		className="h-12 bg-white dark:bg-gray-800"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="clientEmail"
														render={({ field }) => (
															<FormItem>
																<FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
																	<Mail className="w-4 h-4 inline mr-1" />
																	Correo Electrónico*
																</FormLabel>
																<FormControl>
																	<Input
																		type="email"
																		placeholder="correo@ejemplo.com"
																		className="h-12 bg-white dark:bg-gray-800"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="clientPhone"
														render={({ field }) => (
															<FormItem>
																<FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
																	<Phone className="w-4 h-4 inline mr-1" />
																	Teléfono (Opcional)
																</FormLabel>
																<FormControl>
																	<Input
																		type="tel"
																		placeholder="999 999 999"
																		className="h-12 bg-white dark:bg-gray-800"
																		{...field}
																	/>
																</FormControl>
																<FormDescription>
																	Número de celular para recordatorios
																</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
											</div>

											{/* Fecha y Hora */}
											<div className="space-y-6">
												<div className="flex items-center gap-2 mb-4">
													<LucideCalendarIcon className="w-5 h-5 text-gray-600" />
													<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
														Fecha y Hora
													</h3>
												</div>

												<FormField
													control={form.control}
													name="appointmentDate"
													render={({ field }) => (
														<FormItem className="flex flex-col">
															<FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
																Selecciona Fecha y Hora*
															</FormLabel>
															<Popover
																open={isDateTimePopoverOpen}
																onOpenChange={setIsDateTimePopoverOpen}
															>
																<PopoverTrigger asChild>
																	<FormControl>
																		<Button
																			variant="outline"
																			className={cn(
																				"w-full h-12 pl-3 text-left font-normal",
																				!watchedAppointmentDate &&
																					"text-muted-foreground",
																			)}
																			disabled={isSubmitting}
																		>
																			{watchedAppointmentDate &&
																			watchedStartTime ? (
																				<span className="flex items-center">
																					<LucideCalendarIcon className="mr-2 h-4 w-4 opacity-70" />
																					{format(
																						watchedAppointmentDate,
																						"PPP",
																						{ locale: es },
																					)}
																					<ClockIcon className="ml-3 mr-2 h-4 w-4 opacity-70" />
																					{watchedStartTime}
																				</span>
																			) : (
																				<span>Selecciona fecha y hora</span>
																			)}
																		</Button>
																	</FormControl>
																</PopoverTrigger>
																<PopoverContent
																	className="w-auto p-0"
																	align="start"
																>
																	<Calendar
																		mode="single"
																		selected={
																			selectedDateInPopover ?? field.value
																		}
																		onSelect={(date) => {
																			setSelectedDateInPopover(date);
																		}}
																		disabled={(date) => {
																			const today = new Date();
																			today.setHours(0, 0, 0, 0);
																			return (
																				date < today ||
																				date.getDay() === 0 ||
																				date.getDay() === 6
																			);
																		}}
																		initialFocus
																	/>
																	{selectedDateInPopover && (
																		<div className="p-4 border-t">
																			<p className="text-sm font-medium mb-3 text-center">
																				Horarios disponibles:
																			</p>
																			<div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
																				{TIME_SLOTS.map((time) => (
																					<Button
																						key={time}
																						variant={
																							form.getValues("startTime") ===
																							time
																								? "default"
																								: "outline"
																						}
																						size="sm"
																						className="text-xs"
																						onClick={() => {
																							form.setValue(
																								"appointmentDate",
																								selectedDateInPopover,
																								{
																									shouldValidate: true,
																								},
																							);
																							form.setValue("startTime", time, {
																								shouldValidate: true,
																							});
																							setSelectedDateInPopover(
																								undefined,
																							);
																							setIsDateTimePopoverOpen(false);
																						}}
																					>
																						{time}
																					</Button>
																				))}
																			</div>
																		</div>
																	)}
																</PopoverContent>
															</Popover>
															<FormMessage />
														</FormItem>
													)}
												/>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<FormField
														control={form.control}
														name="duration"
														render={({ field }) => (
															<FormItem>
																<FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
																	Duración*
																</FormLabel>
																<Select
																	onValueChange={(value) =>
																		field.onChange(Number(value))
																	}
																	value={field.value?.toString()}
																>
																	<FormControl>
																		<SelectTrigger className="h-12">
																			<SelectValue placeholder="Selecciona duración" />
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent>
																		{DURATION_OPTIONS.map((option) => (
																			<SelectItem
																				key={option.value}
																				value={option.value.toString()}
																			>
																				{option.label}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="room"
														render={({ field }) => (
															<FormItem>
																<FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
																	<BuildingIcon className="w-4 h-4 inline mr-1" />
																	Habitación*
																</FormLabel>
																<Select
																	onValueChange={field.onChange}
																	defaultValue={field.value}
																	disabled={isLoadingRooms}
																>
																	<FormControl>
																		<SelectTrigger className="h-12">
																			<SelectValue placeholder="Selecciona una habitación" />
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent>
																		{isLoadingRooms ? (
																			<div className="p-2 text-center">
																				<Loader2 className="w-4 h-4 animate-spin mx-auto" />
																			</div>
																		) : availableRooms.length > 0 ? (
																			availableRooms.map((room) => (
																				<SelectItem
																					key={room.value}
																					value={room.value}
																				>
																					{room.label}
																				</SelectItem>
																			))
																		) : (
																			<div className="p-2 text-center text-gray-500">
																				No hay habitaciones disponibles
																			</div>
																		)}
																	</SelectContent>
																</Select>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
											</div>

											{/* Notas y Recordatorios */}
											<div className="space-y-6">
												<FormField
													control={form.control}
													name="notes"
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
																Notas Adicionales (Opcional)
															</FormLabel>
															<FormControl>
																<Textarea
																	placeholder="Información relevante sobre la cita..."
																	className="resize-none"
																	rows={3}
																	{...field}
																/>
															</FormControl>
															<FormDescription>
																Máximo 500 caracteres. No incluyas información
																sensible.
															</FormDescription>
															<FormMessage />
														</FormItem>
													)}
												/>

												<div className="flex items-center space-x-4">
													<FormField
														control={form.control}
														name="reminderEnabled"
														render={({ field }) => (
															<FormItem className="flex items-center space-x-2">
																<FormControl>
																	<Checkbox
																		checked={field.value}
																		onCheckedChange={field.onChange}
																	/>
																</FormControl>
																<FormLabel className="text-sm font-normal cursor-pointer">
																	Enviar recordatorio al paciente
																</FormLabel>
															</FormItem>
														)}
													/>

													{form.watch("reminderEnabled") && (
														<FormField
															control={form.control}
															name="reminderTime"
															render={({ field }) => (
																<FormItem>
																	<Select
																		onValueChange={field.onChange}
																		defaultValue={field.value}
																	>
																		<FormControl>
																			<SelectTrigger className="w-40">
																				<SelectValue />
																			</SelectTrigger>
																		</FormControl>
																		<SelectContent>
																			<SelectItem value="30min">
																				30 minutos antes
																			</SelectItem>
																			<SelectItem value="2hours">
																				2 horas antes
																			</SelectItem>
																			<SelectItem value="1day">
																				1 día antes
																			</SelectItem>
																		</SelectContent>
																	</Select>
																</FormItem>
															)}
														/>
													)}
												</div>
											</div>

											{/* Botón de envío */}
											<div className="pt-6 border-t border-gray-200 dark:border-gray-700">
												<Button
													type="submit"
													size="lg"
													className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600"
													disabled={
														isSubmitting || availabilityStatus === "unavailable"
													}
												>
													{isSubmitting ? (
														<Loading size="sm" text="Programando cita..." />
													) : (
														<div className="flex items-center gap-2">
															<LucideCalendarIcon className="w-5 h-5" />
															Programar Cita
														</div>
													)}
												</Button>
											</div>
										</form>
									</Form>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</ProtectedRoute>
	);
}
