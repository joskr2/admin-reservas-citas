// src/lib/api.ts
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";

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

// Función para obtener el token
function getAuthToken(): string | null {
	return localStorage.getItem("authToken");
}

// Interceptor global para manejar errores y autenticación
async function fetchWithAuth(
	url: string,
	options: RequestInit = {},
): Promise<Response> {
	try {
		const token = getAuthToken();

		const headers: HeadersInit = {
			"Content-Type": "application/json",
			...options.headers,
		};

		if (token) {
			//@ts-ignore
			// biome-ignore lint/complexity/useLiteralKeys: <explanation>
			headers["Authorization"] = `Bearer ${token}`;
		}

		const response = await fetch(url, {
			...options,
			headers,
			credentials: "include",
		});

		// Manejar errores HTTP
		if (!response.ok) {
			let errorMessage = "Error en la solicitud";
			let errorDetails = null;
			let errorCode = "UNKNOWN_ERROR";

			try {
				const errorData = await response.json();
				errorMessage = errorData.message || errorMessage;
				errorDetails = errorData.details;
				errorCode = errorData.code || errorCode;
			} catch {
				// Si no se puede parsear el error como JSON
				errorMessage = `Error ${response.status}: ${response.statusText}`;
			}

			// Manejar casos específicos
			switch (response.status) {
				case 401:
					// Token expirado o inválido
					localStorage.removeItem("authToken");
					localStorage.removeItem("selectedProfile");
					window.location.href = "/login?session=expired";
					throw new APIError("Sesión expirada", 401, "UNAUTHORIZED");

				case 403:
					throw new APIError(
						"No tienes permisos para esta acción",
						403,
						"FORBIDDEN",
					);

				case 404:
					throw new APIError("Recurso no encontrado", 404, "NOT_FOUND");

				case 409:
					throw new APIError(
						errorMessage || "Conflicto: El recurso ya existe",
						409,
						"CONFLICT",
						errorDetails,
					);

				case 422:
					throw new APIError(
						errorMessage || "Datos inválidos",
						422,
						"VALIDATION_ERROR",
						errorDetails,
					);

				case 429:
					throw new APIError(
						"Demasiadas solicitudes. Intenta más tarde",
						429,
						"RATE_LIMITED",
					);

				case 500:
				case 502:
				case 503:
					throw new APIError(
						"Error del servidor. Intenta más tarde",
						response.status,
						"SERVER_ERROR",
					);

				default:
					throw new APIError(
						errorMessage,
						response.status,
						errorCode,
						errorDetails,
					);
			}
		}

		return response;
	} catch (error) {
		// Manejar errores de red
		if (error instanceof TypeError && error.message === "Failed to fetch") {
			throw new APIError(
				"Error de conexión. Verifica tu internet",
				0,
				"NETWORK_ERROR",
			);
		}

		throw error;
	}
}

// Función helper para manejar respuestas
async function handleApiResponse<T>(
	response: Response,
): Promise<ApiResponse<T>> {
	try {
		const data = await response.json();
		return {
			success: true,
			message: data.message || "Operación exitosa",
			data: data.data || data,
		};
	} catch (error) {
		throw new APIError("Error al procesar la respuesta", 500, "PARSE_ERROR");
	}
}

// ============ FUNCIONES DE LA API ============

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
		console.log("Creando cita con datos:", data);

		const response = await fetchWithAuth(`${API_URL}/citas/`, {
			method: "POST",
			body: JSON.stringify(data),
		});

		const result = await handleApiResponse<Cita>(response);
		toast.success("Cita creada exitosamente");
		return result;
	} catch (error) {
		if (error instanceof APIError) {
			// Mostrar toast específico según el tipo de error
			if (error.code === "CONFLICT") {
				toast.error("Ya existe una cita en ese horario");
			} else if (error.code === "VALIDATION_ERROR") {
				toast.error("Por favor verifica los datos ingresados");
			} else {
				toast.error(error.message);
			}

			return {
				success: false,
				message: error.message,
				error: {
					code: error.code,
					details: error.details,
				},
			};
		}

		// Error inesperado
		console.error("Error inesperado:", error);
		toast.error("Ha ocurrido un error inesperado");

		return {
			success: false,
			message: "Error inesperado. Por favor contacta soporte.",
		};
	}
}

// Obtener citas de un usuario
export async function obtenerCitasUsuario(
	usuarioId: string,
): Promise<ApiResponse<Cita[]>> {
	try {
		const response = await fetchWithAuth(
			`${API_URL}/citas/usuario/${usuarioId}`,
		);
		return await handleApiResponse<Cita[]>(response);
	} catch (error) {
		if (error instanceof APIError) {
			console.error(`Error al obtener citas: ${error.message}`);
			return {
				success: false,
				message: error.message,
				data: [],
				error: {
					code: error.code,
					details: error.details,
				},
			};
		}

		console.error("Error inesperado al obtener citas:", error);
		return {
			success: false,
			message: "Error al obtener las citas",
			data: [],
		};
	}
}

// Obtener todas las habitaciones
export async function obtenerHabitaciones(): Promise<
	ApiResponse<Habitacion[]>
> {
	try {
		const response = await fetchWithAuth(`${API_URL}/habitaciones/`);
		return await handleApiResponse<Habitacion[]>(response);
	} catch (error) {
		if (error instanceof APIError) {
			console.error(`Error al obtener habitaciones: ${error.message}`);
			return {
				success: false,
				message: error.message,
				data: [],
				error: {
					code: error.code,
					details: error.details,
				},
			};
		}

		console.error("Error inesperado al obtener habitaciones:", error);
		return {
			success: false,
			message: "Error al obtener las habitaciones",
			data: [],
		};
	}
}

// Iniciar una cita
export async function iniciarCita(citaId: string): Promise<ApiResponse<Cita>> {
	try {
		const response = await fetchWithAuth(`${API_URL}/citas/${citaId}/iniciar`, {
			method: "PATCH",
		});

		const result = await handleApiResponse<Cita>(response);
		toast.success("Cita iniciada correctamente");
		return result;
	} catch (error) {
		if (error instanceof APIError) {
			toast.error(error.message);
			return {
				success: false,
				message: error.message,
				error: {
					code: error.code,
					details: error.details,
				},
			};
		}

		console.error("Error inesperado al iniciar cita:", error);
		toast.error("Error al iniciar la cita");
		return {
			success: false,
			message: "Error al iniciar la cita",
		};
	}
}

// Terminar una cita
export async function terminarCita(citaId: string): Promise<ApiResponse<Cita>> {
	try {
		const response = await fetchWithAuth(
			`${API_URL}/citas/${citaId}/terminar`,
			{
				method: "PATCH",
			},
		);

		const result = await handleApiResponse<Cita>(response);
		toast.success("Cita finalizada correctamente");
		return result;
	} catch (error) {
		if (error instanceof APIError) {
			toast.error(error.message);
			return {
				success: false,
				message: error.message,
				error: {
					code: error.code,
					details: error.details,
				},
			};
		}

		console.error("Error inesperado al terminar cita:", error);
		toast.error("Error al terminar la cita");
		return {
			success: false,
			message: "Error al terminar la cita",
		};
	}
}

// Cancelar una cita
export async function cancelarCita(
	citaId: string,
	motivo?: string,
): Promise<ApiResponse<Cita>> {
	try {
		const response = await fetchWithAuth(
			`${API_URL}/citas/${citaId}/cancelar`,
			{
				method: "PATCH",
				body: JSON.stringify({ motivo }),
			},
		);

		const result = await handleApiResponse<Cita>(response);
		toast.success("Cita cancelada correctamente");
		return result;
	} catch (error) {
		if (error instanceof APIError) {
			toast.error(error.message);
			return {
				success: false,
				message: error.message,
				error: {
					code: error.code,
					details: error.details,
				},
			};
		}

		console.error("Error inesperado al cancelar cita:", error);
		toast.error("Error al cancelar la cita");
		return {
			success: false,
			message: "Error al cancelar la cita",
		};
	}
}

// Obtener información del usuario autenticado
export async function obtenerUsuarioAutenticado(): Promise<
	ApiResponse<Usuario>
> {
	try {
		const response = await fetchWithAuth(`${API_URL}/auth/me`);
		return await handleApiResponse<Usuario>(response);
	} catch (error) {
		if (error instanceof APIError) {
			return {
				success: false,
				message: error.message,
				error: {
					code: error.code,
					details: error.details,
				},
			};
		}

		console.error("Error inesperado al obtener usuario:", error);
		return {
			success: false,
			message: "Error al obtener información del usuario",
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
		const queryParams = new URLSearchParams({
			psicologo_id: params.psicologoId,
			fecha: params.fecha,
			hora_inicio: params.horaInicio,
			hora_fin: params.horaFin,
			...(params.habitacionId && { habitacion_id: params.habitacionId }),
		});

		const response = await fetchWithAuth(
			`${API_URL}/citas/verificar-disponibilidad?${queryParams}`,
		);

		return await handleApiResponse<{
			disponible: boolean;
			conflictos?: Cita[];
		}>(response);
	} catch (error) {
		if (error instanceof APIError) {
			return {
				success: false,
				message: error.message,
				error: {
					code: error.code,
					details: error.details,
				},
			};
		}

		console.error("Error verificando disponibilidad:", error);
		return {
			success: false,
			message: "Error al verificar disponibilidad",
		};
	}
}
