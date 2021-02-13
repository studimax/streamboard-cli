import PluginBuilder from "../lib/PluginBuilder";
import { green, red } from "colors/safe";

export default async function build (options: any): Promise<void> {
	const builder = new PluginBuilder(process.cwd(), process.cwd());
	return builder.run().then(() => {
		console.log(green("Build success !"));
	}).catch(reason => {
		console.error(red("ERROR"));
		console.error(red(reason.message));
	});
}
