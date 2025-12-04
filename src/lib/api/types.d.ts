export interface ApiResponse<T> {
	success: boolean;
	data: T;
	error?: ErrorResponse;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
	data: {
		total: number;
		hasNext: boolean;
		list: T
	};
}

export interface ErrorResponse {
	code: string;
	message: string;
	detail: string[];
}