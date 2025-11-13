import { create } from '@storacha/client';

async function listUploads() {
  // Initialize client (persistent environment)
  const client = await create();

  // Login only if needed (click email link once)
  // await client.login('youremail@example.com');

  // Optional: set the space if not default
  // await client.setCurrentSpace('did:key:YOUR_SPACE_DID');

  console.log('Your uploaded files:\n');

  let cursor = '';
  do {
    const { results, cursor: nextCursor } = await client.capability.upload.list({ cursor, size: 25 });

    for (const upload of results) {
      if (!upload.cid) {
        console.log('Skipping upload with no CID.\n');
        continue;
      }

      console.log('Content CID:', upload.cid);
      console.log('Name:', upload.name || 'N/A');
      console.log('Size:', upload.size || 'N/A');
      console.log('Created At:', upload.insertedAt);
      console.log('Status:', upload.status || 'N/A');

      if (upload.shards && upload.shards.length > 0) {
        console.log('Shards:');
        for (const shard of upload.shards) {
          console.log('  ', shard.cid);
        }
      }
      console.log('----------------------------------');
    }

    cursor = nextCursor;
  } while (cursor);
}

listUploads().catch(console.error);
