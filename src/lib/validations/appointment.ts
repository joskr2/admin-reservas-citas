import * as z from "zod";
import {
	isAfter,
	isBefore,
	parse,
	isValid,
	startOfDay,
	endOfDay,
	addMinutes,
} from "date-fns";

// Expresiones regulares para validación
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
const phoneRegex = /^(\+?51)?[9]\d{8}$/; // Formato peruano
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

// Validación de nombre completo
export const nameValidation = z
	.string()
	.min(3, "El nombre debe tener al menos 3 caracteres")
	.max(100, "El nombre no puede exceder 100 caracteres")
	.regex(
		nameRegex,
		"El nombre solo puede contener letras, espacios, guiones y apóstrofes",
	)
	.transform((name) => {
		// Capitalizar cada palabra
		return name
			.trim()
			.split(/\s+/)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(" ");
	})
	.refine((name) => {
		const words = name.split(" ").filter((word) => word.length > 0);
		return words.length >= 2;
	}, "Debe incluir al menos nombre y apellido");

// Validación de email mejorada
export const emailValidation = z
	.string()
	.email("Correo electrónico inválido")
	.toLowerCase()
	.trim()
	.refine((email) => {
		// Validar que no sea un email temporal
		const tempDomains = [
			"tempmail",
			"throwaway",
			"10minutemail",
			"guerrillamail",
		];
		const domain = email.split("@")[1];
		return !tempDomains.some((temp) => domain.includes(temp));
	}, "No se permiten correos temporales")
	.refine((email) => {
		// Validar formato más estricto
		const strictEmailRegex =
			/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
		return strictEmailRegex.test(email);
	}, "Formato de correo inválido");

// Validación de teléfono
export const phoneValidation = z
	.string()
	.optional()
	.refine(
		(phone) => !phone || phoneRegex.test(phone.replace(/\s/g, "")),
		"Número de teléfono inválido. Debe ser un número peruano válido",
	)
	.transform((phone) => {
		if (!phone) return undefined;
		// Normalizar formato
		const cleaned = phone.replace(/\s/g, "");
		if (cleaned.startsWith("+51")) {
			return cleaned;
		}if (cleaned.startsWith("51")) {
			return `+${cleaned}`;
		}
			return `+51${cleaned}`;
	});

// Validación de fecha
export const dateValidation = z
	.date({
		required_error: "La fecha es requerida",
		invalid_type_error: "Fecha inválida",
	})
	.refine((date) => {
		// No permitir fechas pasadas
		const today = startOfDay(new Date());
		return !isBefore(date, today);
	}, "No se pueden agendar citas en fechas pasadas")
	.refine((date) => {
		// No permitir citas con más de 6 meses de anticipación
		const maxDate = new Date();
		maxDate.setMonth(maxDate.getMonth() + 6);
		return !isAfter(date, maxDate);
	}, "No se pueden agendar citas con más de 6 meses de anticipación")
	.refine((date) => {
		const dayOfWeek = date.getDay();
		// 0 = Domingo, 6 = Sábado
		return dayOfWeek !== 0 && dayOfWeek !== 6;
	}, "No se permiten citas los fines de semana")
	.refine((date) => {
		// Verificar si no es día festivo (ejemplo básico)
		// En producción, esto debería consultar una API de días festivos
		const holidays = [
			"01-01", // Año nuevo
			"05-01", // Día del trabajo
			"07-28", // Fiestas patrias
			"07-29", // Fiestas patrias
			"12-25", // Navidad
		];
		const monthDay = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
		return !holidays.includes(monthDay);
	}, "No se permiten citas en días festivos");

// Validación de hora
export const timeValidation = z
	.string()
	.regex(timeRegex, "Formato de hora inválido (HH:MM)")
	.refine((time) => {
		const [hours, minutes] = time.split(":").map(Number);
		const totalMinutes = hours * 60 + minutes;
		const minTime = 9 * 60; // 9:00 AM
		const maxTime = 20 * 60; // 8:00 PM
		return totalMinutes >= minTime && totalMinutes < maxTime;
	}, "Las citas solo están disponibles entre 9:00 AM y 8:00 PM")
	.refine((time) => {
		const [hours, minutes] = time.split(":").map(Number);
		// Solo permitir intervalos de 15 minutos
		return minutes % 15 === 0;
	}, "Las citas solo pueden iniciar en intervalos de 15 minutos (00, 15, 30, 45)");

// Validación de duración
export const durationValidation = z
	.number()
	.min(30, "La duración mínima es 30 minutos")
	.max(120, "La duración máxima es 2 horas")
	.multipleOf(15, "La duración debe ser en intervalos de 15 minutos")
	.default(60);

// Validación de notas
export const notesValidation = z
	.string()
	.max(500, "Las notas no pueden exceder 500 caracteres")
	.optional()
	.transform((notes) => notes?.trim() || undefined)
	.refine((notes) => {
		if (!notes) return true;
		// Verificar que no contenga información sensible común
		const sensitivePatterns = [
			/\b\d{3}-?\d{2}-?\d{4}\b/, // SSN
			/\b\d{16}\b/, // Tarjetas de crédito
			/\b\d{8}\b/, // DNI
		];
		return !sensitivePatterns.some((pattern) => pattern.test(notes));
	}, "Las notas no deben contener información sensible como números de identificación");

// Schema completo del formulario de cita
export const appointmentFormSchema = z
	.object({
		clientName: nameValidation,
		clientEmail: emailValidation,
		clientPhone: phoneValidation,
		appointmentDate: dateValidation,
		startTime: timeValidation,
		duration: durationValidation,
		room: z
			.string({
				required_error: "Debe seleccionar una habitación",
			})
			.min(1, "Debe seleccionar una habitación"),
		notes: notesValidation,
		reminderEnabled: z.boolean().default(true),
		reminderTime: z
			.enum(["1day", "2hours", "30min"])
			.default("2hours")
			.optional(),
	})
	.refine(
		(data) => {
			// Validar que la cita no termine después del horario de atención
			const [hours, minutes] = data.startTime.split(":").map(Number);
			const startMinutes = hours * 60 + minutes;
			const endMinutes = startMinutes + data.duration;
			const maxEndTime = 20 * 60; // 8:00 PM

			return endMinutes <= maxEndTime;
		},
		{
			message: "La cita debe terminar antes de las 8:00 PM",
			path: ["startTime"],
		},
	)
	.refine(
		(data) => {
			// Validar que no se agende en hora de almuerzo (ejemplo: 1-2 PM)
			const [hours] = data.startTime.split(":").map(Number);
			const [endHours] = addMinutes(
				new Date(`2000-01-01 ${data.startTime}`),
				data.duration,
			)
				.toTimeString()
				.split(":")
				.map(Number);

			// Si la cita cruza la hora de almuerzo
			const lunchStart = 13; // 1 PM
			const lunchEnd = 14; // 2 PM

			if (hours < lunchStart && endHours > lunchStart) {
				return false;
			}

			return !(hours >= lunchStart && hours < lunchEnd);
		},
		{
			message:
				"No se pueden agendar citas durante la hora de almuerzo (1:00 PM - 2:00 PM)",
			path: ["startTime"],
		},
	);

// Schema para edición de cita (permite algunos campos opcionales)
// @ts-ignore
export const appointmentEditSchema = appointmentFormSchema.partial({
	clientPhone: true,
	notes: true,
	reminderEnabled: true,
	reminderTime: true,
});

// Schema para cancelación de cita
export const appointmentCancelSchema = z.object({
	reason: z
		.string()
		.min(10, "El motivo debe tener al menos 10 caracteres")
		.max(200, "El motivo no puede exceder 200 caracteres"),
	notifyClient: z.boolean().default(true),
});

// Tipos inferidos
export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;
export type AppointmentEditData = z.infer<typeof appointmentEditSchema>;
export type AppointmentCancelData = z.infer<typeof appointmentCancelSchema>;

// Función helper para validar disponibilidad de horario
export function isTimeSlotAvailable(
	startTime: string,
	duration: number,
	existingAppointments: Array<{ hora_inicio: string; hora_fin: string }>,
): boolean {
	const [startHours, startMinutes] = startTime.split(":").map(Number);
	const startTotalMinutes = startHours * 60 + startMinutes;
	const endTotalMinutes = startTotalMinutes + duration;

	return !existingAppointments.some((appointment) => {
		const [appStartHours, appStartMinutes] = appointment.hora_inicio
			.split(":")
			.map(Number);
		const [appEndHours, appEndMinutes] = appointment.hora_fin
			.split(":")
			.map(Number);

		const appStartTotal = appStartHours * 60 + appStartMinutes;
		const appEndTotal = appEndHours * 60 + appEndMinutes;

		// Verificar si hay solapamiento
		return (
			(startTotalMinutes >= appStartTotal && startTotalMinutes < appEndTotal) ||
			(endTotalMinutes > appStartTotal && endTotalMinutes <= appEndTotal) ||
			(startTotalMinutes <= appStartTotal && endTotalMinutes >= appEndTotal)
		);
	});
}
