const ErrorConstant = {
	message: {
		FORBIDDEN_ERR_MSG: "You don't have access",
		CLIENT_ERR_MSG: 'Client error',
		NOT_FOUND_ERR_MSG: 'Not found error',
	},
	type: {
		CLIENT_ERR: 'CLIENT_ERR',
		NOT_FOUND_ERR: 'NOT_FOUND_ERR',
		FORBIDDEN_ERR: 'FORBIDDEN_ERR',
	},
} as const;

export default ErrorConstant;
