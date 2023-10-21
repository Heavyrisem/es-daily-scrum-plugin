import { DailyScrum, Scrum } from "scrum.parser";
import { getMonthString, getDateString } from "utils";

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

export const dailyScrumTemplate = (prev: DailyScrum, current: DailyScrum) => `
${getMonthString(current.date)}월 ${getDateString(current.date)}일

건강
- ${current.health}

한 일
- ${prev.location}
${prev.content}
					
할 일
- ${current.location}
${current.content}   
`;
