export function formatCreditCardNumber(value: string) {
	return '**** **** **** ' + value.substring(value.length - 4, value.length);
}
