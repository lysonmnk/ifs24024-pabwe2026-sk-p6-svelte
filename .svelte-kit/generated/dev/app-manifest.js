// empty during dev
export const immutable = [];
export const prerendered = [];

export const assets = [
	{"path":"logo.svg"}
];

export const routes = [
	{"id":"/","page":true,"endpoint":false},
	{"id":"/auth/login","page":true,"endpoint":false},
	{"id":"/auth/register","page":true,"endpoint":false},
	{"id":"/courses/[courseId]","page":true,"endpoint":false},
	{"id":"/courses/[courseId]/contents/[contentId]","page":true,"endpoint":false},
	{"id":"/profile","page":true,"endpoint":false},
	{"id":"/users","page":true,"endpoint":false}
];