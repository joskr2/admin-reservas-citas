
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";

export type Usuario = {
  id: string;
  nombre: string;
  correo: string;
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
  estado: "pendiente" | "en_progreso" | "terminada";
};

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Crear una cita
export async function crearCita(data: {
  psicologo: Usuario;
  cliente: Usuario;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  habitacion: string;
}): Promise<ApiResponse<Cita>> {
  try {
    console.log("Enviando datos:", JSON.stringify(data));

    const response = await fetch(`${API_URL}/citas/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include", // Incluir cookies en solicitudes cross-origin
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error ${response.status}: ${errorText}`);
      return {
        success: false,
        message: `Error al crear la cita: ${response.statusText}. ${errorText}`,
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error al crear cita:", error);
    return {
      success: false,
      message: "Error al crear la cita. Inténtalo de nuevo más tarde.",
    };
  }
}

// Obtener citas de un usuario
export async function obtenerCitasUsuario(
  usuarioId: string
): Promise<ApiResponse<Cita[]>> {
  try {
    const response = await fetch(`${API_URL}/citas/usuario/${usuarioId}`, {
      credentials: "include", // Incluir cookies en solicitudes cross-origin
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error ${response.status}: ${errorText}`);
      return {
        success: false,
        message: `Error al obtener citas: ${response.statusText}`,
        data: [],
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return {
      success: false,
      message: "Error al obtener las citas. Inténtalo de nuevo más tarde.",
      data: [],
    };
  }
}

// Obtener todas las habitaciones
export async function obtenerHabitaciones(): Promise<
  ApiResponse<Habitacion[]>
> {
  try {
    const response = await fetch(`${API_URL}/habitaciones/`, {
      credentials: "include", // Incluir cookies en solicitudes cross-origin
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error ${response.status}: ${errorText}`);
      return {
        success: false,
        message: `Error al obtener habitaciones: ${response.statusText}`,
        data: [],
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener habitaciones:", error);
    return {
      success: false,
      message:
        "Error al obtener las habitaciones. Inténtalo de nuevo más tarde.",
      data: [],
    };
  }
}

// Iniciar una cita
export async function iniciarCita(citaId: string): Promise<ApiResponse<Cita>> {
  try {
    const response = await fetch(`${API_URL}/citas/${citaId}/iniciar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Incluir cookies en solicitudes cross-origin
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error ${response.status}: ${errorText}`);
      return {
        success: false,
        message: `Error al iniciar la cita: ${response.statusText}`,
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error al iniciar cita:", error);
    return {
      success: false,
      message: "Error al iniciar la cita. Inténtalo de nuevo más tarde.",
    };
  }
}

// Terminar una cita
export async function terminarCita(citaId: string): Promise<ApiResponse<Cita>> {
  try {
    const response = await fetch(`${API_URL}/citas/${citaId}/terminar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Incluir cookies en solicitudes cross-origin
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error ${response.status}: ${errorText}`);
      return {
        success: false,
        message: `Error al terminar la cita: ${response.statusText}`,
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error al terminar cita:", error);
    return {
      success: false,
      message: "Error al terminar la cita. Inténtalo de nuevo más tarde.",
    };
  }
}

// Función para obtener información del usuario autenticado
export function obtenerUsuarioAutenticado(userId?: string | null) {
  // Aquí simularemos datos del usuario
  // En una implementación real, estos datos vendrían de Clerk
  return {
    id: userId || "user_123456789",
    nombre: "Dr. Juan Pérez",
    correo: "juan.perez@ejemplo.com",
    tipo: "psicologo",
  };
}
