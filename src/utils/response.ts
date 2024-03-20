const OK = 200;
const CREATED = 201;
const OK_NO_CONTENT = 204;

const SUCCESS = [OK, CREATED, OK_NO_CONTENT];

export const isSuccess = (code: number): boolean => SUCCESS.includes(code);

export const isError = (code: number): boolean => !SUCCESS.includes(code);