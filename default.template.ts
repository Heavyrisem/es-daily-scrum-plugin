import { Scrum } from "scrum.parser";

export const defaultTemplate = ({
	date,
	health,
	yesterday,
	today,
	additional,
}: Scrum) => `${date.getMonth() + 1}월 ${date.getDate()}일

건강
${health}

한 일
${yesterday.workType}
${yesterday.data}

할 일
${today.workType}
${today.data}


${additional}`;
