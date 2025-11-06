import { create } from "@storacha/client";

const USER_EMAIL = "wasimfwk@gmail.com"; // your email
let client;

async function init() {
  client = await create();

  const account = await client.login(USER_EMAIL);
  await account.plan.wait();

  const space = await client.createSpace("my-mini-dapp-space", { account });
  await client.setCurrentSpace(space.did());

  console.log("Storacha client initialized, space ready");
}

async function uploadFile(file) {
  try {
    const cid = await client.uploadFile(file);
    const url = `https://${cid}.ipfs.storacha.link`;
    displayFile(file.name, cid, url);
    console.log(`Uploaded ${file.name} - CID: ${cid}`);
  } catch (err) {
    console.error("Upload failed:", err);
  }
}

function displayFile(name, cid, url) {
  const fileList = document.getElementById("fileList");
  const div = document.createElement("div");
  div.innerHTML = `<strong>${name}</strong> - CID: ${cid} - <a href="${url}" target="_blank">View</a>`;
  fileList.appendChild(div);
}

document.getElementById("uploadBtn").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  if (fileInput.files.length > 0) {
    uploadFile(fileInput.files[0]);
  }
});

init();


