
import crypto from "crypto";

const generateKey = () => {
    return crypto.randomBytes(64).toString("hex");
}


function main() {
    console.log("Generated Key:", generateKey());
}

main();
