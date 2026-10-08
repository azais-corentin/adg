/** The interactive tools, in the order the home page and /tools list them. */
export const TOOLS = [
	{
		href: '/import',
		name: 'Save import',
		summary:
			'Open the save you export from Options, Save & Load. adg decodes it on your phone, detects your stage and lists your next goals.'
	},
	{
		href: '/checklists',
		name: 'Milestone checklists',
		summary: 'The goals of each stage, to tick off as you reach them.'
	},
	{
		href: '/tools/time-studies',
		name: 'Time Study planner',
		summary: 'Plan a Time Study tree and copy it as a string the game can import.'
	},
	{
		href: '/tools/eternity-challenges',
		name: 'Eternity Challenge planner',
		summary: 'Plan which Eternity Challenge to run next and how many completions to aim for.'
	},
	{
		href: '/tools/automator',
		name: 'Automator scripts',
		summary: 'Scripts for the Reality Automator, each one run in the game before it is listed.'
	}
] as const;

export type Tool = (typeof TOOLS)[number];
