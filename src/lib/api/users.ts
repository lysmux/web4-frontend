export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export interface LoginRequest {
	usernameOrEmail: string;
	password: string;
}

export interface VKCallbackRequest {
	code: string;
	deviceId: string;
	challengeVerifier: string;
}

export interface AuthResponse {
	accessToken: string;
	expiresIn: number;
}

export interface User {
	id: string;
	username: string;
	email: string;
}