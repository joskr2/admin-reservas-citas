import {
	addDays,
	subDays,
	format,
	addHours,
	setHours,
	setMinutes,
	startOfWeek,
	addWeeks,
} from "date-fns";

export interface MockUser {
	id: string;
	nombre: string;
	correo: string;
	password: string;
	rol: "admin" | "psicologo" | "cliente";
	profileId?: string;
}

export interface MockHabitacion {
	id: number;
	numero: string;
	disponible: boolean;
}

export interface MockCita {
	id: string;
	psicologo: {
		id: string;
		nombre: string;
		correo: string;
	};
	cliente: {
		id: string;
		nombre: string;
		correo: string;
	};
	fecha: string;
	hora_inicio: string;
	hora_fin: string;
	habitacion: {
		id: number;
		numero: string;
		disponible: boolean;
	};
	estado: "pendiente" | "en_progreso" | "terminada" | "cancelada";
	notas?: string;
	created_at: string;
	updated_at: string;
}


export const MOCK_USERS: MockUser[] = [
	{
		id: "1",
		nombre: "Dr. Ana María González",
		correo: "ana.gonzalez@psicologia.com",
		password: "123456",
		rol: "admin", // Superadmin
		profileId: "1",
	},
	{
		id: "2",
		nombre: "Dr. Carlos Mendoza",
		correo: "carlos.mendoza@psicologia.com",
		password: "123456",
		rol: "psicologo",
		profileId: "2",
	},
	{
		id: "3",
		nombre: "Dra. Laura Jiménez",
		correo: "laura.jimenez@psicologia.com",
		password: "123456",
		rol: "psicologo",
		profileId: "3",
	},
	{
		id: "4",
		nombre: "Dr. Miguel Torres",
		correo: "miguel.torres@psicologia.com",
		password: "123456",
		rol: "psicologo",
		profileId: "4",
	},
	{
		id: "5",
		nombre: "Dra. Elena Vásquez",
		correo: "elena.vasquez@psicologia.com",
		password: "123456",
		rol: "psicologo",
		profileId: "5",
	},
];

// Habitaciones mock
export const MOCK_HABITACIONES: MockHabitacion[] = [
	{ id: 1, numero: "A-101", disponible: true },
	{ id: 2, numero: "A-102", disponible: true },
	{ id: 3, numero: "A-103", disponible: true },
	{ id: 4, numero: "B-201", disponible: true },
	{ id: 5, numero: "B-202", disponible: true },
];

// Clientes mock
const MOCK_CLIENTES = [
	{ id: "c1", nombre: "María José Pérez", correo: "maria.perez@email.com" },
	{ id: "c2", nombre: "Juan Carlos Silva", correo: "juan.silva@email.com" },
	{ id: "c3", nombre: "Carmen Rosa López", correo: "carmen.lopez@email.com" },
	{
		id: "c4",
		nombre: "Roberto Martínez",
		correo: "roberto.martinez@email.com",
	},
	{ id: "c5", nombre: "Ana Sofía García", correo: "ana.garcia@email.com" },
	{ id: "c6", nombre: "Luis Fernando Torres", correo: "luis.torres@email.com" },
	{ id: "c7", nombre: "Patricia Valdez", correo: "patricia.valdez@email.com" },
	{
		id: "c8",
		nombre: "Miguel Ángel Castro",
		correo: "miguel.castro@email.com",
	},
	{
		id: "c9",
		nombre: "Gabriela Mendoza",
		correo: "gabriela.mendoza@email.com",
	},
	{ id: "c10", nombre: "Fernando Ruiz", correo: "fernando.ruiz@email.com" },
	{ id: "c11", nombre: "Isabella Santos", correo: "isabella.santos@email.com" },
	{ id: "c12", nombre: "Diego Herrera", correo: "diego.herrera@email.com" },
	{
		id: "c13",
		nombre: "Valentina Morales",
		correo: "valentina.morales@email.com",
	},
	{ id: "c14", nombre: "Santiago Vega", correo: "santiago.vega@email.com" },
	{ id: "c15", nombre: "Camila Jiménez", correo: "camila.jimenez@email.com" },
];

// Generar citas mock
function generateMockCitas(): MockCita[] {
	const citas: MockCita[] = [];
	const today = new Date();
	const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Lunes

	let citaId = 1;

	// Función helper para crear una cita
	const createCita = (
		fecha: Date,
		horaInicio: string,
		psicologoId: string,
		clienteIndex: number,
		habitacionId: number,
		estado: MockCita["estado"] = "pendiente",
	): MockCita => {
		const psicologo = MOCK_USERS.find((u) => u.id === psicologoId) || MOCK_USERS[0];
		const cliente = MOCK_CLIENTES[clienteIndex % MOCK_CLIENTES.length];
		const [hour, minute] = horaInicio.split(":").map(Number);
		const horaFin = format(
			addHours(setMinutes(setHours(new Date(), hour), minute), 1),
			"HH:mm",
		);
		const habitacion = MOCK_HABITACIONES.find((h) => h.id === habitacionId) || MOCK_HABITACIONES[0];

		return {
			id: (citaId++).toString(),
			psicologo: {
				id: psicologo.id,
				nombre: psicologo.nombre,
				correo: psicologo.correo,
			},
			cliente: {
				id: cliente.id,
				nombre: cliente.nombre,
				correo: cliente.correo,
			},
			fecha: format(fecha, "yyyy-MM-dd"),
			hora_inicio: horaInicio,
			hora_fin: horaFin,
			habitacion: {
				id: habitacion.id,
				numero: habitacion.numero,
				disponible: habitacion.disponible,
			},
			estado,
			created_at: format(subDays(fecha, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
			updated_at: format(subDays(fecha, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
		};
	};

	// 4 citas para hoy
	const todayCitas = [
		createCita(today, "09:00", "1", 0, 1, "pendiente"),
		createCita(today, "11:00", "2", 1, 2, "en_progreso"),
		createCita(today, "14:00", "3", 2, 3, "pendiente"),
		createCita(today, "16:00", "4", 3, 4, "terminada"),
	];
	citas.push(...todayCitas);

	// Citas para esta semana (4 por semana, distribuidas)
	for (let dayOffset = 1; dayOffset <= 4; dayOffset++) {
		const fecha = addDays(startOfCurrentWeek, dayOffset);
		if (fecha.getDay() !== 0 && fecha.getDay() !== 6) {
			// No fines de semana
			const citasDelDia = [
				createCita(
					fecha,
					"10:00",
					((dayOffset % 5) + 1).toString(),
					dayOffset * 2,
					(dayOffset % 5) + 1,
				),
				createCita(
					fecha,
					"15:00",
					((dayOffset % 5) + 1).toString(),
					dayOffset * 2 + 1,
					(dayOffset % 5) + 1,
				),
			];
			citas.push(...citasDelDia);
		}
	}

	// Citas para las próximas 3 semanas (completar hasta 28 por mes)
	for (let week = 1; week <= 3; week++) {
		const weekStart = addWeeks(startOfCurrentWeek, week);

		for (let day = 0; day < 5; day++) {
			// Lunes a viernes
			const fecha = addDays(weekStart, day);
			const numCitasDelDia = Math.floor(Math.random() * 3) + 2; // 2-4 citas por día

			for (let citaIndex = 0; citaIndex < numCitasDelDia; citaIndex++) {
				const horas = [
					"09:00",
					"10:00",
					"11:00",
					"14:00",
					"15:00",
					"16:00",
					"17:00",
					"18:00",
				];
				const horaAleatoria = horas[Math.floor(Math.random() * horas.length)];
				const psicologoId = (((day + citaIndex) % 5) + 1).toString();
				const clienteIndex =
					(week * 10 + day * 5 + citaIndex) % MOCK_CLIENTES.length;
				const habitacionId = (citaIndex % 5) + 1;

				// Evitar duplicados en la misma fecha/hora/habitación
				const existeCita = citas.some(
					(c) =>
						c.fecha === format(fecha, "yyyy-MM-dd") &&
						c.hora_inicio === horaAleatoria &&
						c.habitacion.id === habitacionId,
				);

				if (!existeCita) {
					const estados: MockCita["estado"][] = [
						"pendiente",
						"terminada",
						"en_progreso",
					];
					const estadoAleatorio =
						estados[Math.floor(Math.random() * estados.length)];

					citas.push(
						createCita(
							fecha,
							horaAleatoria,
							psicologoId,
							clienteIndex,
							habitacionId,
							estadoAleatorio,
						),
					);
				}
			}
		}
	}

	return citas;
}

// Generar y exportar citas
export const MOCK_CITAS = generateMockCitas();

// Funciones helper para el mock
export class MockDataManager {
	private static instance: MockDataManager;
	private citas: MockCita[] = [...MOCK_CITAS];

	static getInstance(): MockDataManager {
		if (!MockDataManager.instance) {
			MockDataManager.instance = new MockDataManager();
		}
		return MockDataManager.instance;
	}

	// Autenticación
	authenticateUser(email: string, password: string): MockUser | null {
		return (
			MOCK_USERS.find((u) => u.correo === email && u.password === password) ||
			null
		);
	}

	// Citas
	getCitasByUsuario(usuarioId: string): MockCita[] {
		return this.citas.filter((c) => c.psicologo.id === usuarioId);
	}

	getCitaById(citaId: string): MockCita | null {
		return this.citas.find((c) => c.id === citaId) || null;
	}

	createCita(citaData: {
		psicologo: { id: string; nombre: string; correo: string };
		cliente: { id: string; nombre: string; correo: string };
		fecha: string;
		hora_inicio: string;
		hora_fin: string;
		habitacion: string;
		notas?: string;
	}): MockCita {
		// Verificar disponibilidad
		const existingCita = this.citas.find(
			(c) =>
				c.fecha === citaData.fecha &&
				c.hora_inicio === citaData.hora_inicio &&
				c.habitacion.numero === citaData.habitacion,
		);

		if (existingCita) {
			throw new Error("Ya existe una cita en ese horario y habitación");
		}

		const habitacion =
			MOCK_HABITACIONES.find((h) => h.numero === citaData.habitacion) ||
			MOCK_HABITACIONES[0];

		const newCita: MockCita = {
			id: (this.citas.length + 1).toString(),
			psicologo: citaData.psicologo,
			cliente: citaData.cliente,
			fecha: citaData.fecha,
			hora_inicio: citaData.hora_inicio,
			hora_fin: citaData.hora_fin,
			habitacion: {
				id: habitacion.id,
				numero: habitacion.numero,
				disponible: habitacion.disponible,
			},
			estado: "pendiente",
			notas: citaData.notas,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		this.citas.push(newCita);
		return newCita;
	}

	updateCitaEstado(
		citaId: string,
		nuevoEstado: MockCita["estado"],
	): MockCita | null {
		const citaIndex = this.citas.findIndex((c) => c.id === citaId);
		if (citaIndex === -1) return null;

		this.citas[citaIndex] = {
			...this.citas[citaIndex],
			estado: nuevoEstado,
			updated_at: new Date().toISOString(),
		};

		return this.citas[citaIndex];
	}

	cancelarCita(citaId: string, motivo?: string): MockCita | null {
		const citaIndex = this.citas.findIndex((c) => c.id === citaId);
		if (citaIndex === -1) return null;

		this.citas[citaIndex] = {
			...this.citas[citaIndex],
			estado: "cancelada",
			notas: motivo ? `Cancelada: ${motivo}` : "Cancelada",
			updated_at: new Date().toISOString(),
		};

		return this.citas[citaIndex];
	}

	// Habitaciones
	getHabitaciones(): MockHabitacion[] {
		return MOCK_HABITACIONES;
	}

	isHabitacionAvailable(
		habitacionId: string,
		fecha: string,
		horaInicio: string,
		horaFin: string,
	): boolean {
		return !this.citas.some(
			(c) =>
				c.habitacion.numero === habitacionId &&
				c.fecha === fecha &&
				c.estado !== "cancelada" &&
				((horaInicio >= c.hora_inicio && horaInicio < c.hora_fin) ||
					(horaFin > c.hora_inicio && horaFin <= c.hora_fin) ||
					(horaInicio <= c.hora_inicio && horaFin >= c.hora_fin)),
		);
	}
}

// Exportar instancia singleton
export const mockDataManager = MockDataManager.getInstance();
