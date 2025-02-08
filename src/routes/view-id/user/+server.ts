import { json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db/index";
import { usersTable } from "$lib/server/db/schema";

function formatDate(date: Date): string {
    const day: string = date.getDate().toString().padStart(2, '0');
    const month: string = date.toLocaleString('default', { month: 'long' });
    const year: number = date.getFullYear();
    return `${day} ${month} ${year}`;
}

function generateQRCode(user: any): string {
	const dob: Date = new Date(user.dateOfBirth);
	const formattedDOB: string = new Date(dob.getTime() + Math.abs(dob.getTimezoneOffset() * 60000))
		.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

	return JSON.stringify({
		DateIssued: formatDate(new Date()),
		Issuer: "PSA",
		subject: {
			Suffix: user.suffix,
			lName: user.lastName.toUpperCase(),
			fName: user.firstName.toUpperCase(),
			mName: user.middleName.toUpperCase(),
			sex: user.sex,
			BF: "[1,1]",
			DOB: formattedDOB,
			POB: user.placeOfBirth,
			PCN: user.pcn,
		},
		alg: "EDDSA",
		signature: "gbmFAsdp09KL2dsalTYnC32OP",
	});
}

export const GET: RequestHandler = async ({ url }) => {
	const pcn = url.searchParams.get("pcn");

	if (!pcn) {
		return json({ error: "PCN is required" }, { status: 400 });
	}

	try {
		const result = await db.select().from(usersTable).where(eq(usersTable.pcn, pcn));

		if (result.length === 0) {
			return json({ error: "User not found" }, { status: 404 });
		}

		const user = result[0];

		const qrCodeData = generateQRCode(user);

		return json({ user, qrCodeData });
	} catch (error) {
		console.error("Database error:", error);
		return json({ error: "Internal Server Error" }, { status: 500 });
	}
};
