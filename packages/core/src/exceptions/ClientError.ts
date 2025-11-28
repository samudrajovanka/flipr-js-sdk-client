import ErrorConstant from '../constants/error';

interface ClientErrorOptions {
	type?: string;
	validations?: Record<string, string>;
}

class ClientError extends Error {
	type: string;
	validations?: Record<string, string>;

	constructor(
		message: string = ErrorConstant.message.CLIENT_ERR_MSG,
		options?: ClientErrorOptions,
	) {
		super(message);

		this.type = options?.type ?? ErrorConstant.type.CLIENT_ERR;
		this.name = 'ClientError';
		this.validations = options?.validations;
	}
}

export default ClientError;
