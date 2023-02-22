import { isDate } from "util/types";

export interface Scrum {
	date: Date;
	health: string;
	yesterday: {
		workType: string;
		data: string;
	};
	today: {
		workType: string;
		data: string;
	};
	additional?: string;
}

export const parseScrum = (input: string): Scrum => {
	let [date, health, yesterday, today, ...additional] = input.split("\n\n");

	const parsedDate = new Date(
		`${new Date().getFullYear()}-${date
			.replace("월", "-")
			.replace("일", "")}`
	);
	health = health.split("\n")[1].trim();

	let yesterdayString = yesterday.replace("한 일\n", "").trim();
	const yesterdayWorkType = yesterdayString.split("\n")[0].trim();
	yesterdayString = yesterdayString
		.replace(`${yesterdayWorkType}\n`, "")
		.trim();

	let todayString = today.replace("할 일\n", "").trim();
	const todayWorkType = todayString.split("\n")[0].trim();
	todayString = todayString.replace(`${todayWorkType}\n`, "").trim();

	return {
		date: parsedDate,
		health,
		yesterday: {
			workType: yesterdayWorkType,
			data: yesterdayString,
		},
		today: {
			workType: todayWorkType,
			data: todayString,
		},
		additional: additional.join("\n\n"),
	};
};

export const isScrum = (input: string): boolean => {
	const scrum = parseScrum(input);

	const isDateValid = isDate(scrum.date);
	const isHealthValid = scrum?.health?.length > 0;
	const isYesterdayValid =
		Boolean(scrum?.yesterday?.data) && Boolean(scrum?.yesterday?.workType);
	const isTodayValid =
		Boolean(scrum?.today?.data) && Boolean(scrum?.today?.workType);

	return isDateValid && isHealthValid && isYesterdayValid && isTodayValid;
};
