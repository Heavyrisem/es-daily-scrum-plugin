export const getMonthString = (date: Date) =>
	String(date.getMonth() + 1).padStart(2, "0");
export const getDateString = (date: Date) =>
	String(date.getDate()).padStart(2, "0");

export const formatDateToYYYYMMDD = (date: Date) => {
	const year = date.getFullYear();
	const month = getMonthString(date);
	const day = getDateString(date);

	return `${year}-${month}-${day}`;
};
