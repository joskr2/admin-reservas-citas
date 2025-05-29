"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { crearCita } from "@/lib/api";
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
} from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { MOCK_USERS, MOCK_HABITACIONES } from "@/lib/mockData";

// Validation schema for the form
const appointmentFormSchema = z.object({
	clientName: z.string().min(2, {
		message: "El nombre del cliente debe tener al menos 2 caracteres.",
	}),
	clientEmail: z.string().email({
		message: "Por favor ingresa un correo electrónico válido.",
	}),
	appointmentDate: z.date({
		required_error: "Por favor selecciona una fecha.",
		invalid_type_error: "Eso no es una fecha válida.",
	}),
	startTime: z.string().min(1, {
		message: "Por favor selecciona una hora de inicio.",
	}),
	room: z.string().min(1, {
		message: "Por favor selecciona una habitación.",
	}),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

// Available rooms (using mock data)
const AVAILABLE_ROOMS = MOCK_HABITACIONES.map((h) => ({
	value: h.numero,
	label: `Sala ${h.numero}`,
}));

// Define available time slots
const TIME_SLOTS = [
	"09:00",
	"10:00",
	"11:00",
	"12:00",
	"13:00",
	"14:00",
	"15:00",
	"16:00",
	"17:00",
	"18:00",
	"19:00",
	"20:00",
];

export default function CreateAppointmentForm() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [currentPsychologist, setCurrentPsychologist] = useState<any>(null);
	const [isDateTimePopoverOpen, setIsDateTimePopoverOpen] = useState(false);
	const [selectedDateInPopover, setSelectedDateInPopover] = useState<
		Date | undefined
	>(undefined);

	// Get selected psychologist from localStorage
	useEffect(() => {
		const psychologistId = localStorage.getItem("selectedProfile");
		const psychologist = MOCK_USERS.find((p) => p.id === psychologistId);

		if (psychologist) {
			setCurrentPsychologist({
				id: psychologist.id,
				name: psychologist.nombre,
				email: psychologist.correo,
			});
		} else {
			// If no profile selected, redirect to profiles
			router.push("/admin/profiles");
		}
	}, [router]);

	// Initialize the form
	const form = useForm<AppointmentFormValues>({
		resolver: zodResolver(appointmentFormSchema),
		defaultValues: {
			clientName: "",
			clientEmail: "",
			startTime: "",
			room: "",
		},
	});

	// Watch for changes in appointmentDate or startTime to update the popover display
	const watchedAppointmentDate = form.watch("appointmentDate");
	const watchedStartTime = form.watch("startTime");

	// Form submission handler
	async function onSubmit(values: AppointmentFormValues) {
		if (!currentPsychologist) {
			toast.error("No se ha seleccionado un psicólogo");
			return;
		}

		setIsSubmitting(true);

		try {
			// Calculate end time (1 hour after start time)
			const startDateObject = new Date(values.appointmentDate);
			const [hours, minutes] = values.startTime.split(":").map(Number);
			startDateObject.setHours(hours, minutes, 0, 0);

			const endDateObject = addHours(startDateObject, 1);

			// Prepare appointment data
			const appointmentDataPayload = {
				psicologo: {
					id: currentPsychologist.id,
					nombre: currentPsychologist.name,
					correo: currentPsychologist.email,
				},
				cliente: {
					id: `client_${Date.now()}`, // Generate temporary client ID
					nombre: values.clientName,
					correo: values.clientEmail,
				},
				fecha: format(values.appointmentDate, "yyyy-MM-dd"),
				hora_inicio: values.startTime,
				hora_fin: format(endDateObject, "HH:mm"),
				habitacion: values.room, // This is already the room number/name
			};

			console.log("Enviando datos de cita:", appointmentDataPayload);

			// Call API to create appointment
			const response = await crearCita(appointmentDataPayload);

			if (response.success) {
				toast.success("Cita creada con éxito");
				router.push("/admin/citas");
				router.refresh();
			} else {
				toast.error(response.message || "Error al crear la cita.");
			}
		} catch (error) {
			console.error("Error al crear cita:", error);
			toast.error("Ha ocurrido un error al crear la cita.");
		} finally {
			setIsSubmitting(false);
		}
	}

	// Show loading while psychologist profile is loading
	if (!currentPsychologist) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
					<p className="text-gray-600 dark:text-gray-400">Cargando perfil...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			<div className="max-w-4xl mx-auto py-8 px-4">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
						Nueva Cita
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Agendar una nueva cita
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Psychologist Information */}
					<div className="lg:col-span-1">
						<Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
							<CardHeader className="text-center pb-2">
								<div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
									<UserIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
								</div>
								<CardTitle className="text-xl text-gray-900 dark:text-gray-100">
									Psicólogo/a Asignado
								</CardTitle>
							</CardHeader>
							<CardContent className="text-center">
								<h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">
									{currentPsychologist.name}
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
									{currentPsychologist.email}
								</p>
								<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
									<p className="text-green-800 dark:text-green-200 text-sm font-medium">
										✓ Disponible
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Appointment Form */}
					<div className="lg:col-span-2">
						<Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
							<CardHeader>
								<CardTitle className="text-2xl flex items-center gap-2 text-gray-900 dark:text-gray-100">
									<LucideCalendarIcon className="w-6 h-6 text-blue-600" />
									Detalles de la Cita
								</CardTitle>
								<CardDescription className="text-gray-600 dark:text-gray-400">
									Complete la información necesaria para agendar su consulta.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className="space-y-8"
									>
										{/* Patient Information */}
										<div className="space-y-6">
											<div className="flex items-center gap-2 mb-4">
												<UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
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
																Nombres
															</FormLabel>
															<FormControl>
																<Input
																	placeholder="ingresa los nombres del paciente"
																	className="h-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
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
																Correo Electrónico
															</FormLabel>
															<FormControl>
																<Input
																	type="email"
																	placeholder="correo@email.com"
																	className="h-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</div>

										{/* Combined Date and Time Picker Section */}
										<div className="space-y-6">
											<div className="flex items-center gap-2 mb-4">
												<LucideCalendarIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
												<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
													Fecha y Hora de la Cita
												</h3>
											</div>

											<FormField
												control={form.control}
												name="appointmentDate"
												render={({ field }) => (
													<FormItem className="flex flex-col">
														<FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
															Fecha y Hora Seleccionada
														</FormLabel>
														<Popover
															open={isDateTimePopoverOpen}
															onOpenChange={setIsDateTimePopoverOpen}
														>
															<PopoverTrigger asChild>
																<FormControl>
																	<Button
																		variant={"outline"}
																		className={cn(
																			"w-full h-12 pl-3 text-left font-normal bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500",
																			!watchedAppointmentDate &&
																				"text-muted-foreground",
																			isDateTimePopoverOpen
																				? "ring-2 ring-blue-500 ring-offset-2"
																				: "",
																		)}
																		disabled={isSubmitting}
																	>
																		{watchedAppointmentDate &&
																		watchedStartTime ? (
																			<span className="flex items-center">
																				<LucideCalendarIcon className="mr-2 h-4 w-4 opacity-70" />
																				{format(watchedAppointmentDate, "PPP", {
																					locale: es,
																				})}
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
																className="w-auto p-0 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
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
																	disabled={(date) =>
																		date <
																		new Date(
																			new Date().setDate(
																				new Date().getDate() - 1,
																			),
																		)
																	}
																	initialFocus
																/>
																{selectedDateInPopover && (
																	<div className="p-4 border-t border-gray-200 dark:border-gray-700">
																		<p className="text-sm font-medium mb-3 text-center text-gray-900 dark:text-gray-100">
																			Horas disponibles para{" "}
																			<span className="font-semibold">
																				{format(selectedDateInPopover, "PPP", {
																					locale: es,
																				})}
																			</span>
																			:
																		</p>
																		<div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
																			{TIME_SLOTS.map((time) => (
																				<Button
																					key={time}
																					variant={
																						form.getValues("startTime") ===
																							time &&
																						form
																							.getValues("appointmentDate")
																							?.toDateString() ===
																							selectedDateInPopover.toDateString()
																							? "default"
																							: "outline"
																					}
																					size="sm"
																					className="text-xs sm:text-sm"
																					onClick={() => {
																						if (selectedDateInPopover) {
																							form.setValue(
																								"appointmentDate",
																								selectedDateInPopover,
																								{ shouldValidate: true },
																							);
																							form.setValue("startTime", time, {
																								shouldValidate: true,
																							});
																							setSelectedDateInPopover(
																								undefined,
																							);
																							setIsDateTimePopoverOpen(false);
																						}
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
														{form.formState.errors.startTime && (
															<p className="text-sm font-medium text-destructive">
																{form.formState.errors.startTime.message}
															</p>
														)}
													</FormItem>
												)}
											/>
										</div>

										{/* Location */}
										<div className="space-y-6">
											<div className="flex items-center gap-2 mb-4">
												<BuildingIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
												<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
													Sala
												</h3>
											</div>

											<FormField
												control={form.control}
												name="room"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
															Selecciona una sala disponible
														</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger className="h-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500">
																	<SelectValue placeholder="Selecciona una sala" />
																</SelectTrigger>
															</FormControl>
															<SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
																{AVAILABLE_ROOMS.map((roomItem) => (
																	<SelectItem
																		key={roomItem.value}
																		value={roomItem.value}
																		className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/50 text-gray-900 dark:text-gray-100"
																	>
																		{roomItem.label}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														<FormDescription className="text-gray-600 dark:text-gray-400">
															Selecciona la habitación donde se realizará la
															consulta
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<div className="pt-6 border-t border-gray-200 dark:border-gray-700">
											<Button
												type="submit"
												size="lg"
												className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
												disabled={isSubmitting}
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
	);
}
