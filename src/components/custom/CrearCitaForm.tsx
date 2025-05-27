"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
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
import { crearCita } from "@/lib/api";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ClockIcon, UserIcon, BuildingIcon } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";

// Esquema de validación del formulario
const formSchema = z.object({
	nombreCliente: z.string().min(2, {
		message: "El nombre del cliente debe tener al menos 2 caracteres.",
	}),
	correoCliente: z.string().email({
		message: "Por favor ingresa un correo electrónico válido.",
	}),
	fecha: z.string().min(1, {
		message: "Por favor selecciona una fecha.",
	}),
	horaInicio: z.string().min(1, {
		message: "Por favor selecciona la hora de inicio.",
	}),
	horaFin: z.string().min(1, {
		message: "Por favor selecciona la hora de finalización.",
	}),
	habitacion: z.string().min(1, {
		message: "Por favor selecciona una habitación.",
	}),
});

type FormValues = z.infer<typeof formSchema>;

export default function CrearCitaForm() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [currentProfile, setCurrentProfile] = useState<any>(null);
	
	// Obtener perfil seleccionado del localStorage
	const getSelectedProfile = () => {
		const profileId = localStorage.getItem("selectedProfile");
		const MOCK_PROFILES = [
			{ id: 1, nombre: "Dr. Ana María González", correo: "ana.gonzalez@psicologia.com" },
			{ id: 2, nombre: "Dr. Carlos Mendoza", correo: "carlos.mendoza@psicologia.com" },
			{ id: 3, nombre: "Dra. Laura Jiménez", correo: "laura.jimenez@psicologia.com" },
			{ id: 4, nombre: "Dr. Miguel Torres", correo: "miguel.torres@psicologia.com" },
			{ id: 5, nombre: "Dra. Elena Vásquez", correo: "elena.vasquez@psicologia.com" }
		];
		return MOCK_PROFILES.find(p => p.id === Number(profileId)) || MOCK_PROFILES[0];
	};
	
	useEffect(() => {
		const profile = getSelectedProfile();
		setCurrentProfile(profile);
	}, []);
	
	const HABITACIONES = [
		{ value: "sala-a", label: "Sala A" },
		{ value: "sala-b", label: "Sala B" },
		{ value: "sala-c", label: "Sala C" },
		{ value: "sala-d", label: "Sala D" },
		{ value: "sala-e", label: "Sala E" }
	];

	// Inicializar el formulario
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nombreCliente: "",
			correoCliente: "",
			fecha: "",
			horaInicio: "",
			horaFin: "",
			habitacion: "",
		},
	});

	// Función para enviar el formulario
	async function onSubmit(values: FormValues) {
		setIsSubmitting(true);

		try {
			// Validar que la hora de fin sea después de la hora de inicio
			if (values.horaFin <= values.horaInicio) {
				toast.error("La hora de fin debe ser posterior a la hora de inicio");
				setIsSubmitting(false);
				return;
			}

			// Preparar los datos para enviar a la API
			const selectedRoom = HABITACIONES.find(h => h.value === values.habitacion);
			const citaData = {
				psicologo: {
					id: currentProfile?.id || 1,
					nombre: currentProfile?.nombre || "Dr. Desconocido",
					correo: currentProfile?.correo || "desconocido@ejemplo.com",
				},
				cliente: {
					id: `cliente_${Date.now()}`,
					nombre: values.nombreCliente,
					correo: values.correoCliente,
				},
				fecha: values.fecha,
				hora_inicio: values.horaInicio,
				hora_fin: values.horaFin,
				habitacion: {
					numero: selectedRoom?.label || values.habitacion
				},
			};

			console.log("Enviando datos de cita:", citaData);

			// Llamar a la API para crear la cita
			const response = await crearCita(citaData);

			if (response.success) {
				toast.success("Cita creada con éxito");
				// Redirigir al listado de citas
				router.push("/admin/citas");
				router.refresh();
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

	// Mostrar loading mientras carga el perfil
	if (!currentProfile) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Cargando perfil...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
			<AppHeader
				showBackButton={true}
				title="Nueva Cita"
				subtitle="Programa una nueva consulta"
			/>
			<main className="flex-1 py-8 px-4">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold text-gray-900 mb-2">
							Nueva Cita Médica
						</h1>
						<p className="text-gray-600">
							Programa una consulta con tu psicólogo
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Información del psicólogo */}
						<div className="lg:col-span-1">
							<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
								<CardHeader className="text-center pb-2">
									<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<UserIcon className="w-8 h-8 text-blue-600" />
									</div>
									<CardTitle className="text-xl">Psicólogo Asignado</CardTitle>
								</CardHeader>
								<CardContent className="text-center">
									<h3 className="font-semibold text-lg text-gray-900 mb-1">
										{currentProfile?.nombre || "Cargando..."}
									</h3>
									<p className="text-sm text-gray-600 mb-4">
										{currentProfile?.correo || "Cargando..."}
									</p>
									<div className="bg-green-50 border border-green-200 rounded-lg p-3">
										<p className="text-green-800 text-sm font-medium">
											✓ Disponible para consultas
										</p>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Formulario de cita */}
						<div className="lg:col-span-2">
							<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
								<CardHeader>
									<CardTitle className="text-2xl flex items-center gap-2">
										<CalendarIcon className="w-6 h-6 text-blue-600" />
										Detalles de la Cita
									</CardTitle>
									<CardDescription>
										Complete la información necesaria para agendar su consulta
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Form {...form}>
										<form
											onSubmit={form.handleSubmit(onSubmit)}
											className="space-y-8"
										>
											{/* Información del cliente */}
											<div className="space-y-6">
												<div className="flex items-center gap-2 mb-4">
													<UserIcon className="w-5 h-5 text-gray-600" />
													<h3 className="text-lg font-semibold text-gray-900">
														Información del Paciente
													</h3>
												</div>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<FormField
														control={form.control}
														name="nombreCliente"
														render={({ field }) => (
															<FormItem>
																<FormLabel className="text-sm font-medium text-gray-700">
																	Nombre Completo
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Ingrese el nombre completo"
																		className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="correoCliente"
														render={({ field }) => (
															<FormItem>
																<FormLabel className="text-sm font-medium text-gray-700">
																	Correo Electrónico
																</FormLabel>
																<FormControl>
																	<Input
																		type="email"
																		placeholder="ejemplo@correo.com"
																		className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
											</div>

											{/* Detalles de la cita */}
											<div className="space-y-6">
												<div className="flex items-center gap-2 mb-4">
													<CalendarIcon className="w-5 h-5 text-gray-600" />
													<h3 className="text-lg font-semibold text-gray-900">
														Programación
													</h3>
												</div>

												<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
													<FormField
														control={form.control}
														name="fecha"
														render={({ field }) => (
															<FormItem>
																<FormLabel className="text-sm font-medium text-gray-700">
																	Fecha de la Cita
																</FormLabel>
																<FormControl>
																	<Input
																		type="date"
																		className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="horaInicio"
														render={({ field }) => (
															<FormItem>
																<FormLabel className="text-sm font-medium text-gray-700">
																	Hora de Inicio
																</FormLabel>
																<FormControl>
																	<Input
																		type="time"
																		className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="horaFin"
														render={({ field }) => (
															<FormItem>
																<FormLabel className="text-sm font-medium text-gray-700">
																	Hora de Finalización
																</FormLabel>
																<FormControl>
																	<Input
																		type="time"
																		className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
											</div>

											{/* Ubicación */}
											<div className="space-y-6">
												<div className="flex items-center gap-2 mb-4">
													<BuildingIcon className="w-5 h-5 text-gray-600" />
													<h3 className="text-lg font-semibold text-gray-900">
														Ubicación
													</h3>
												</div>

												<FormField
													control={form.control}
													name="habitacion"
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-sm font-medium text-gray-700">
																Habitación
															</FormLabel>
															<Select onValueChange={field.onChange} defaultValue={field.value}>
																<FormControl>
																	<SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
																		<SelectValue placeholder="Selecciona una habitación" />
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	{HABITACIONES.map((habitacion) => (
																		<SelectItem 
																			key={habitacion.value} 
																			value={habitacion.value}
																			className="cursor-pointer hover:bg-blue-50"
																		>
																			{habitacion.label}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
															<FormDescription className="text-gray-600">
																Selecciona la habitación donde se realizará la consulta
															</FormDescription>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>

											<div className="pt-6 border-t border-gray-200">
												<Button
													type="submit"
													size="lg"
													className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
													disabled={isSubmitting}
												>
													{isSubmitting ? (
														<Loading size="sm" text="Programando Cita..." />
													) : (
														<div className="flex items-center gap-2">
															<CalendarIcon className="w-5 h-5" />
															Programar Cita Médica
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
			</main>
			<AppFooter />
		</div>
	);
}
