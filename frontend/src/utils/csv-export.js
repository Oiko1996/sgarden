const escapeCell = (value) => {
	if (value === null || value === undefined) return "";
	const stringValue = String(value);
	if (stringValue.includes(",") || stringValue.includes("\"") || stringValue.includes("\n") || stringValue.includes("\r")) {
		return `"${stringValue.replaceAll("\"", "\"\"")}"`;
	}

	return stringValue;
};

const buildCsv = (headers, rows) => {
	const lines = [];
	if (Array.isArray(headers) && headers.length > 0) {
		lines.push(headers.map((cell) => escapeCell(cell)).join(","));
	}

	for (const row of rows || []) {
		lines.push((row || []).map((cell) => escapeCell(cell)).join(","));
	}

	return lines.join("\n");
};

export const downloadCsv = (filename, rows, headers) => {
	const csv = buildCsv(headers, rows);
	if (typeof document === "undefined" || typeof URL === "undefined") return;
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename || "export.csv";
	document.body.append(anchor);
	anchor.click();
	anchor.remove();
	URL.revokeObjectURL(url);
};

export default downloadCsv;
