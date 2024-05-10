import {config} from "dotenv";
import {neon} from "@neondatabase/serverless";
import {drizzle} from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

config( {path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// created every time the script is run
const main = async () => {
    try {
        await migrate(db, { migrationsFolder: 'drizzle' })
    } catch (e) {
        console.error('Error migrating database', e)
        process.exit(1)
    }
}

main()