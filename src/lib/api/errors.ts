export const ERRORS_MAP: Record<string, string> = {
	VALIDATION_ERROR: "Ошибка валидации данных",
	INVALID_CREDENTIALS: "Данные неверны",
	AUTH_PROVIDER_ERROR: "Ошибка при взаимодействии с провайдером",

	USER_NOT_FOUND: "Пользователь не найден",
	USER_ALREADY_CONFIRMED: "Пользователь уже подтвержден",
	USER_PENDING_CONFIRMATION: "Пользователь ожидает подтверждения",
	USER_BLOCKED: "Пользователь заблокирован",
	USER_DELETED: "Пользователь удален",
	USER_USERNAME_EXISTS: "Пользователь с таким username уже существует",
	USER_EMAIL_EXISTS: "Пользователь с таким email уже существует",

	TOKEN_INVALID: "Токен невалидный",
	NO_AUTHENTICATED: "Не аутентифицирован",
	FORBIDDEN: "Доступ запрещен"
}
