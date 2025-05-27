"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
	id: string;
	email: string;
	name: string;
	role: "admin" | "psicologo" | "cliente";
	profileId?: string;
}

interface LoginCredentials {
	email: string;
	password: string;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	error: string | null;
	login: (credentials: LoginCredentials) => Promise<boolean>;
	logout: () => Promise<void>;
	isAuthenticated: boolean;
	checkAuth: () => Promise<void>;
	clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	// Verificar autenticación al cargar
	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		try {
			setLoading(true);
			setError(null);

			// Verificar token almacenado
			const token = localStorage.getItem("authToken");
			if (!token) {
				setUser(null);
				setLoading(false);
				return;
			}

			// Validar token con el backend
			const response = await fetch(`${API_URL}/auth/verify`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				credentials: "include",
			});

			if (response.ok) {
				const data = await response.json();
				if (data.success && data.user) {
					setUser(data.user);

					// Si tiene profileId, guardarlo para las citas
					if (data.user.profileId) {
						localStorage.setItem("selectedProfile", data.user.profileId);
					}
				} else {
					// Token inválido
					localStorage.removeItem("authToken");
					localStorage.removeItem("selectedProfile");
					setUser(null);
				}
			} else {
				// Token inválido o expirado
				localStorage.removeItem("authToken");
				localStorage.removeItem("selectedProfile");
				setUser(null);

				if (response.status === 401) {
					// No mostrar error si simplemente no está autenticado
					console.log("Usuario no autenticado");
				} else {
					setError("Error al verificar la sesión");
				}
			}
		} catch (err) {
			console.error("Error verificando autenticación:", err);
			setError("Error de conexión al verificar la sesión");
			setUser(null);
			localStorage.removeItem("authToken");
			localStorage.removeItem("selectedProfile");
		} finally {
			setLoading(false);
		}
	};

	const login = async (credentials: LoginCredentials): Promise<boolean> => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(`${API_URL}/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(credentials),
				credentials: "include",
			});

			const data = await response.json();

			if (response.ok && data.success) {
				// Guardar token
				if (data.token) {
					localStorage.setItem("authToken", data.token);
				}

				// Guardar usuario
				setUser(data.user);

				// Si tiene profileId, guardarlo
				if (data.user.profileId) {
					localStorage.setItem("selectedProfile", data.user.profileId);
				}

				toast.success("Inicio de sesión exitoso");

				// Redirigir según el rol
				if (data.user.role === "psicologo") {
					router.push("/admin/citas");
				} else if (data.user.role === "admin") {
					router.push("/admin");
				} else {
					router.push("/");
				}

				return true;
			}
				// Error de autenticación
				const errorMessage = data.message || "Credenciales incorrectas";
				setError(errorMessage);
				toast.error(errorMessage);
				return false;
		} catch (err) {
			console.error("Error en login:", err);
			const errorMessage =
				err instanceof Error
					? err.message
					: "Error de conexión con el servidor";
			setError(errorMessage);
			toast.error("Error al conectar con el servidor. Verifica tu conexión.");
			return false;
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			setLoading(true);

			const token = localStorage.getItem("authToken");

			// Llamar al endpoint de logout
			if (token) {
				try {
					await fetch(`${API_URL}/auth/logout`, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
						credentials: "include",
					});
				} catch (err) {
					// Continuar con el logout local aunque falle la petición
					console.error("Error al cerrar sesión en el servidor:", err);
				}
			}

			// Limpiar estado local
			setUser(null);
			setError(null);
			localStorage.removeItem("authToken");
			localStorage.removeItem("selectedProfile");

			toast.success("Sesión cerrada correctamente");
			router.push("/login");
		} catch (err) {
			console.error("Error en logout:", err);
			toast.error("Error al cerrar sesión");
		} finally {
			setLoading(false);
		}
	};

	const clearError = () => {
		setError(null);
	};

	const isAuthenticated = !!user && !loading;

	const contextValue: AuthContextType = {
		user,
		loading,
		error,
		login,
		logout,
		isAuthenticated,
		checkAuth,
		clearError,
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth debe usarse dentro de AuthProvider");
	}
	return context;
}
