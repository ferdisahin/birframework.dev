# File Storage

BirFramework provides an expressive file storage abstraction layer for local disks and cloud drivers.

---

## Basic File Operations

Use the `Storage` facade to store, retrieve, and delete files:

```ts
import { Storage } from 'birframework';

// Write content to a file
await Storage.put('avatars/user-1.jpg', fileBuffer);

// Check if a file exists
if (await Storage.exists('avatars/user-1.jpg')) {
  // Read file contents
  const content = await Storage.get('avatars/user-1.jpg');
}

// Delete a file
await Storage.delete('avatars/user-1.jpg');
```

---

## File Upload Handling

In a controller action, easily store incoming uploaded files:

```ts
export class AvatarController {
  public async upload(ctx) {
    const file = ctx.file('avatar');

    if (!file) {
      return ctx.badRequest('No file uploaded');
    }

    const path = await Storage.put(`avatars/${Date.now()}-${file.name}`, file.data);

    return ctx.json({ success: true, path });
  }
}
```

---

## Storage Directory Structure

By default, files are stored under the `storage/app/` directory:

```
storage/
├── app/
│   ├── public/          # Publicly accessible static assets
│   └── private/         # Private files & documents
├── logs/                # Application error logs
└── database.sqlite      # Default SQLite database
```
