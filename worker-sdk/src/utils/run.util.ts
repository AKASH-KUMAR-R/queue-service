export const wait = async (time: number = 300) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};
