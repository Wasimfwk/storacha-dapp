import { create } from "@storacha/client";
import { filesFromPaths } from "files-from-path";

const client = await create();
const account = await client.login("wasimfwk@gmail.com"); // confirm email first

// Wait for payment plan selection if prompted
await account.plan.wait();

// Select or create space
let space;
const spaces = await client.spaces.list();
if (spaces.results.length === 0) {
    space = await client.createSpace("mini-dapp-space", { account });
} else {
    space = spaces.results[0];
    await client.setCurrentSpace(space.did());
}

const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const resultDiv = document.getElementById("result");

uploadBtn.addEventListener("click", async () => {
    if (fileInput.files.length === 0) return alert("Select a file first!");

    const files = [];
    for (const file of fileInput.files) {
        files.push(file);
    }

    try {
        const cid = await client.uploadDirectory(files);
        const url = `https://${cid}.ipfs.storacha.link`;
        resultDiv.innerHTML = `Upload successful! <a href="${url}" target="_blank">View file</a>`;
    } catch (err) {
        resultDiv.textContent = `Upload failed: ${err.message}`;
        console.error(err);
    }
});
