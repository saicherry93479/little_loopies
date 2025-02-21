type WriteStream = {
	write: (data: string) => void;
}

// logToFile.path = "./realeastate.log";
logToFile.stream = null as unknown as WriteStream;

export function logToFile(...args: any[]) {
	const date = new Date();
	const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

	logToFile.stream.write(`[${time}] `);
	logToFile.stream.write(args.join(" "));
	logToFile.stream.write("\n");
}

const encoder = new TextEncoder();
logToFile.init = function() {

	if (import.meta.env.PROD) {
		logToFile.stream = {
			write: (data: string) => {
				// @ts-ignore
				Deno.stdout.writeSync(encoder.encode(data));
			}
		}
		return;
	}
	// @ts-ignore
	logToFile.stream = process.stdout;
	const date = new Date();
	const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
	logToFile.stream.write(`[${time}] Quickhyre started\n`);
};
