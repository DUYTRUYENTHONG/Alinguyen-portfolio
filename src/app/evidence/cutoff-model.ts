// Date-only synthetic events; matches the project's inclusive snapshot rule.
export const cutoffDates = [
	"2017-02-26",
	"2017-02-27",
	"2017-02-28",
	"2017-03-01",
	"2017-03-02",
];
export const listeningEvents = [
	{ id: "a", date: "2017-02-26", seconds: 50 },
	{ id: "b", date: "2017-02-27", seconds: 120 },
	{ id: "c", date: "2017-02-28", seconds: 80 },
	{ id: "d", date: "2017-03-01", seconds: 500 },
];
export function snapshot(events: typeof listeningEvents, cutoff: string) {
	const eligible = events.filter((event) => event.date <= cutoff);
	return {
		count: eligible.length,
		seconds: eligible.reduce((sum, event) => sum + event.seconds, 0),
	};
}
