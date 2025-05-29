// src/lib/api.ts
import { toast } from "sonner";
import {
	mockDataManager,
	type MockCita,
	type MockHabitacion,
} from "./mockData";

// Tipos
export type Usuario = {
	id: string;
	nombre: string;
	correo: string;
	rol?: "admin" | "psicologo" | "cliente";
};

export type Habitacion = {
	id: number;
	numero: string;
	disponible: boolean;
};

export type Cita = {
	id: string;
	psicologo: Usuario;
	cliente: Usuario;
	fecha: string;
	hora_inicio: string;
	hora_fin: string;
	habitacion: Habitacion;
	estado: "pendiente" | "en_progreso" | "terminada" | "cancelada";
	notas?: string;
	created_at?: string;
	updated_at?: string;
};

export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data?: T;
	error?: {
		code?: string;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		details?: any;
	};
}

// Clase de error personalizada
export class APIError extends Error {
	constructor(
		message: string,
		public statusCode: number,
		public code?: string,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		public details?: any,
	) {
		super(message);
		this.name = "APIError";
	}
}

// Función para simular delay de red
const simulateNetworkDelay = (): Promise<void> => {
	return new Promise((resolve) =>
		setTimeout(resolve, Math.random() * 500 + 200),
	);
};

// Función para convertir MockCita a Cita
const convertMockCita = (mockCita: MockCita): Cita => ({
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
});

// ============ FUNCIONES DE LA API (MOCK) ============

// Crear una cita
export async function crearCita(data: {
	psicologo: Usuario;
	cliente: Usuario;
	fecha: string;
	hora_inicio: string;
	hora_fin: string;
	habitacion: string;
	notas?: string;
}): Promise<ApiResponse<Cita>> {
	try {
		await simulateNetworkDelay();

		console.log("Creando cita con datos:", data);

		const nuevaCita = mockDataManager.createCita(data);
		const citaConvertida = convertMockCita(nuevaCita);

		toast.success("Cita creada exitosamente");

		return {
			success: true,
			message: "Cita creada exitosamente",
			data: citaConvertida,
		};
	} catch (error) {
		console.error("Error al crear cita:", error);

		const errorMessage =
			error instanceof Error ? error.message : "Error desconocido";

		if (errorMessage.includes("Ya existe una cita")) {
			toast.error("Ya existe una cita en ese horario y habitación");
			return {
				success: false,
				message: "Ya existe una cita en ese horario y habitación",
				error: {
					code: "CONFLICT",
					details: error,
				},
			};
		}

		toast.error("Ha ocurrido un error al crear la cita");
		return {
			success: false,
			message: "Error al crear la cita",
			error: {
				code: "UNKNOWN_ERROR",
				details: error,
			},
		};
	}
}

// Obtener citas de un usuario
export async function obtenerCitasUsuario(
	usuarioId: string,
): Promise<ApiResponse<Cita[]>> {
	try {
		await simulateNetworkDelay();

		const citas = mockDataManager.getCitasByUsuario(usuarioId);
		const citasConvertidas = citas.map(convertMockCita);

		return {
			success: true,
			message: "Citas obtenidas exitosamente",
			data: citasConvertidas,
		};
	} catch (error) {
		console.error("Error al obtener citas:", error);

		return {
			success: false,
			message: "Error al obtener las citas",
			data: [],
			error: {
				code: "FETCH_ERROR",
				details: error,
			},
		};
	}
}

// Obtener todas las habitaciones
export async function obtenerHabitaciones(): Promise<
	ApiResponse<Habitacion[]>
> {
	try {
		await simulateNetworkDelay();

		const habitaciones = mockDataManager.getHabitaciones();

		return {
			success: true,
			message: "Habitaciones obtenidas exitosamente",
			data: habitaciones,
		};
	} catch (error) {
		console.error("Error al obtener habitaciones:", error);

		return {
			success: false,
			message: "Error al obtener las habitaciones",
			data: [],
			error: {
				code: "FETCH_ERROR",
				details: error,
			},
		};
	}
}

// Iniciar una cita
export async function iniciarCita(citaId: string): Promise<ApiResponse<Cita>> {
	try {
		await simulateNetworkDelay();

		const citaActualizada = mockDataManager.updateCitaEstado(
			citaId,
			"en_progreso",
		);

		if (!citaActualizada) {
			throw new Error("Cita no encontrada");
		}

		const citaConvertida = convertMockCita(citaActualizada);
		toast.success("Cita iniciada correctamente");

		return {
			success: true,
			message: "Cita iniciada correctamente",
			data: citaConvertida,
		};
	} catch (error) {
		console.error("Error al iniciar cita:", error);

		const errorMessage =
			error instanceof Error ? error.message : "Error al iniciar la cita";
		toast.error(errorMessage);

		return {
			success: false,
			message: errorMessage,
			error: {
				code: "UPDATE_ERROR",
				details: error,
			},
		};
	}
}

// Terminar una cita
export async function terminarCita(citaId: string): Promise<ApiResponse<Cita>> {
	try {
		await simulateNetworkDelay();

		const citaActualizada = mockDataManager.updateCitaEstado(
			citaId,
			"terminada",
		);

		if (!citaActualizada) {
			throw new Error("Cita no encontrada");
		}

		const citaConvertida = convertMockCita(citaActualizada);
		toast.success("Cita finalizada correctamente");

		return {
			success: true,
			message: "Cita finalizada correctamente",
			data: citaConvertida,
		};
	} catch (error) {
		console.error("Error al terminar cita:", error);

		const errorMessage =
			error instanceof Error ? error.message : "Error al terminar la cita";
		toast.error(errorMessage);

		return {
			success: false,
			message: errorMessage,
			error: {
				code: "UPDATE_ERROR",
				details: error,
			},
		};
	}
}

// Cancelar una cita
export async function cancelarCita(
	citaId: string,
	motivo?: string,
): Promise<ApiResponse<Cita>> {
	try {
		await simulateNetworkDelay();

		const citaActualizada = mockDataManager.cancelarCita(citaId, motivo);

		if (!citaActualizada) {
			throw new Error("Cita no encontrada");
		}

		const citaConvertida = convertMockCita(citaActualizada);
		toast.success("Cita cancelada correctamente");

		return {
			success: true,
			message: "Cita cancelada correctamente",
			data: citaConvertida,
		};
	} catch (error) {
		console.error("Error al cancelar cita:", error);

		const errorMessage =
			error instanceof Error ? error.message : "Error al cancelar la cita";
		toast.error(errorMessage);

		return {
			success: false,
			message: errorMessage,
			error: {
				code: "UPDATE_ERROR",
				details: error,
			},
		};
	}
}

// Obtener información del usuario autenticado
export async function obtenerUsuarioAutenticado(): Promise<
	ApiResponse<Usuario>
> {
	try {
		await simulateNetworkDelay();

		// En un entorno real, esto obtendría el usuario del token
		// Para mock, obtenemos del localStorage si está disponible
		const userJson = localStorage.getItem("currentUser");
		if (!userJson) {
			throw new Error("Usuario no autenticado");
		}

		const user = JSON.parse(userJson);

		return {
			success: true,
			message: "Usuario obtenido exitosamente",
			data: {
				id: user.id,
				nombre: user.nombre,
				correo: user.correo,
				rol: user.rol,
			},
		};
	} catch (error) {
		console.error("Error al obtener usuario:", error);

		return {
			success: false,
			message: "Error al obtener información del usuario",
			error: {
				code: "AUTH_ERROR",
				details: error,
			},
		};
	}
}

// Función para verificar disponibilidad de horario
export async function verificarDisponibilidad(params: {
	psicologoId: string;
	fecha: string;
	horaInicio: string;
	horaFin: string;
	habitacionId?: string;
}): Promise<ApiResponse<{ disponible: boolean; conflictos?: Cita[] }>> {
	try {
		await simulateNetworkDelay();

		const disponible = mockDataManager.isHabitacionAvailable(
			params.habitacionId || "A-101",
			params.fecha,
			params.horaInicio,
			params.horaFin,
		);

		let conflictos: Cita[] = [];
		if (!disponible) {
			// Obtener citas que entran en conflicto
			const todasLasCitas = mockDataManager.getCitasByUsuario(
				params.psicologoId,
			);
			conflictos = todasLasCitas
				.filter(
					(cita) =>
						cita.fecha === params.fecha &&
						cita.estado !== "cancelada" &&
						((params.horaInicio >= cita.hora_inicio &&
							params.horaInicio < cita.hora_fin) ||
							(params.horaFin > cita.hora_inicio &&
								params.horaFin <= cita.hora_fin) ||
							(params.horaInicio <= cita.hora_inicio &&
								params.horaFin >= cita.hora_fin)),
				)
				.map(convertMockCita);
		}

		return {
			success: true,
			message: "Disponibilidad verificada",
			data: {
				disponible,
				conflictos: conflictos.length > 0 ? conflictos : undefined,
			},
		};
	} catch (error) {
		console.error("Error verificando disponibilidad:", error);

		return {
			success: false,
			message: "Error al verificar disponibilidad",
			error: {
				code: "AVAILABILITY_ERROR",
				details: error,
			},
		};
	}
}
