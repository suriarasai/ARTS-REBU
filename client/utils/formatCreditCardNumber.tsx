export function formatCreditCardNumber(value) {
	return '**** **** **** ' + value.substring(value.length - 4, value.length);
}
