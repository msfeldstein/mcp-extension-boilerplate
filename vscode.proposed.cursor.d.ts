declare module 'vscode' {
	export namespace cursor {
		export namespace mcp {
			export const registerServer: (serverName: string, url: string) => void;
			export const unregisterServer: (serverName: string) => void;
		}
	}
}
