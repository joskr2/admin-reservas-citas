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
import { mockDataManager, type MockUser } from "@/lib/mockData";

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

// Función para simular delay de red
const simulateNetworkDelay = (): Promise<void> => {
	return new Promise((resolve) =>
		setTimeout(resolve, Math.random() * 800 + 300),
	);
};

// Función para convertir MockUser a User
const convertMockUser = (mockUser: MockUser): User => ({
	id: mockUser.id,
	email: mockUser.correo,
	name: mockUser.nombre,
	role: mockUser.rol,
	profileId: mockUser.profileId,
});

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

			// Simular delay de red
			await simulateNetworkDelay();

			// Verificar token almacenado
			const token = localStorage.getItem("authToken");
			const userJson = localStorage.getItem("currentUser");

			if (!token || !userJson) {
				setUser(null);
				setLoading(false);
				return;
			}

			// Validar que el usuario existe en nuestros datos mock
			const userData = JSON.parse(userJson);
			const mockUser = mockDataManager.authenticateUser(
				userData.email,
				userData.originalPassword || "123456",
			);

			if (mockUser) {
				const convertedUser = convertMockUser(mockUser);
				setUser(convertedUser);

				// Si tiene profileId, guardarlo para las citas
				if (convertedUser.profileId) {
					localStorage.setItem("selectedProfile", convertedUser.profileId);
				}
			} else {
				// Usuario no válido, limpiar storage
				localStorage.removeItem("authToken");
				localStorage.removeItem("currentUser");
				localStorage.removeItem("selectedProfile");
				setUser(null);
			}
		} catch (err) {
			console.error("Error verificando autenticación:", err);
			setError("Error de conexión al verificar la sesión");
			setUser(null);
			localStorage.removeItem("authToken");
			localStorage.removeItem("currentUser");
			localStorage.removeItem("selectedProfile");
		} finally {
			setLoading(false);
		}
	};

	const login = async (credentials: LoginCredentials): Promise<boolean> => {
		try {
			setLoading(true);
			setError(null);

			// Simular delay de red
			await simulateNetworkDelay();

			// Autenticar con mock data
			const mockUser = mockDataManager.authenticateUser(
				credentials.email,
				credentials.password,
			);

			if (mockUser) {
				// Crear token simulado
				const token = `mock_token_${mockUser.id}_${Date.now()}`;

				// Guardar en localStorage
				localStorage.setItem("authToken", token);

				// Guardar usuario completo (incluyendo password para re-validación)
				const userWithPassword = {
					...mockUser,
					originalPassword: credentials.password,
				};
				localStorage.setItem("currentUser", JSON.stringify(userWithPassword));

				// Convertir y establecer usuario
				const convertedUser = convertMockUser(mockUser);
				setUser(convertedUser);

				// Si tiene profileId, guardarlo
				if (convertedUser.profileId) {
					localStorage.setItem("selectedProfile", convertedUser.profileId);
				}

				toast.success("Inicio de sesión exitoso");

				// Redirigir según el rol
				if (
					convertedUser.role === "psicologo" ||
					convertedUser.role === "admin"
				) {
					router.push("/admin/citas");
				} else {
					router.push("/");
				}

				return true;
			}
				// Credenciales incorrectas
				const errorMessage = "Correo electrónico o contraseña incorrectos";
				setError(errorMessage);
				toast.error(errorMessage);
				return false;
		} catch (err) {
			console.error("Error en login:", err);
			const errorMessage = "Error de conexión con el servidor";
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

			// Simular delay de red
			await simulateNetworkDelay();

			// Limpiar estado local
			setUser(null);
			setError(null);
			localStorage.removeItem("authToken");
			localStorage.removeItem("currentUser");
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
