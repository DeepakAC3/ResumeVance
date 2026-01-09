/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes - The size in bytes
 * @returns A formatted string with the appropriate unit (KB, MB, GB)
 */
export function formatSize(bytes: number): string {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export const generateUUID = () => crypto.randomUUID();
