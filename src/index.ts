import { readConfig, setUser } from "./config.js";

function main() {
  setUser("sayarg");
  const configs = readConfig();

  for (const [key, value] of Object.entries(configs)) {
    console.log(`${key}: ${value}`);
  }
}

main();
