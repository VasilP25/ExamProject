import * as dotenv from "dotenv";
import * as path from "path";

let loaded = false;

export function loadRootEnv(): void {
  if (loaded || process.env.JWT_SECRET) {
    loaded = true;
    return;
  }

  dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
  loaded = true;
}
