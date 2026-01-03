import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        }
    }),
    emailAndPassword: {
        enabled: true
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "donor",
                input: false,
            },
            bloodType: {
                type: "string",
                required: false,
            },
            dateOfBirth: {
                type: "date",
                required: false,
            },
            phone: {
                type: "string",
                required: false,
            },
            address: {
                type: "string",
                required: false,
            },
            city: {
                type: "string",
                required: false,
            },
            citizenId: {
                type: "string",
                required: false,
            },
        }
    }
});
