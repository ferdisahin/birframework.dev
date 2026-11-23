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

## Multipart File Uploads

BirFramework natively parses `multipart/form-data` uploads with zero external dependencies. In your controllers, access uploaded files via `ctx.file('field_name')`:

```html
<!-- views/profile.html -->
<form action="/profile/avatar" method="POST" enctype="multipart/form-data">
  {!! csrfField() !!}
  <input type="file" name="avatar" accept="image/*" required />
  <button type="submit">Upload Avatar</button>
</form>
```

```typescript
// app/controllers/ProfileController.ts
import { Route } from 'birframework';

export class ProfileController {
  public async uploadAvatar(ctx) {
    const file = await ctx.file('avatar');

    if (!file || !file.isValid()) {
      return ctx.json({ error: 'Please choose a valid file' }, 422);
    }

    // Inspect file metadata
    console.log(file.originalName); // "photo.png"
    console.log(file.mimeType);     // "image/png"
    console.log(file.extension());    // "png"
    console.log(file.size);         // Size in bytes

    // 1. Store with auto-generated unique filename:
    const storedPath = await file.store('avatars'); 
    // -> "avatars/a7f8b9...png" in storage/app/avatars/

    // 2. Or store on the public web disk with a custom name:
    const customPath = await file.storeAs('avatars', `user-${ctx.user?.id}.png`, 'public');

    return ctx.json({ success: true, path: storedPath });
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
