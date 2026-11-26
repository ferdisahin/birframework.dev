# File Storage

BirJS provides an expressive file storage abstraction layer for local disks and cloud drivers.

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

BirJS natively parses `multipart/form-data` uploads with zero external dependencies. In your controllers, access uploaded files via `ctx.file('field_name')`:

```tsx
export function AvatarForm({ csrfToken }: { csrfToken: string }) {
  return <form action="/profile/avatar" method="POST" encType="multipart/form-data">
    <input type="hidden" name="_token" value={csrfToken} />
    <input type="file" name="avatar" accept="image/*" required />
    <button type="submit">Upload Avatar</button>
  </form>;
}
```

Pass the current CSRF token from the controller to the page.


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

---

## Mailing & Email System

BirJS provides a clean email delivery API modeled directly on Laravel Mailables:

### 1. Generating a Mailable Class

Use the CLI generator:

```bash
bir make:mail WelcomeMail
```

This generates `app/mail/WelcomeMail.ts`:

```typescript
import { Mailable } from 'birframework';

export class WelcomeMail extends Mailable {
  constructor(public user: { name: string; email: string }) {
    super();
    this.subject('Welcome to BirJS!')
        .from('hello@birjs.com', 'BirJS Team');
  }

  public async content(): Promise<string> {
    // Renders views/emails/welcome.tsx with data
    return this.view('emails/welcome', { user: this.user });
  }
}
```

### 2. Sending Emails

Send emails from anywhere in your application:

```typescript
import { Mail } from 'birframework';
import { WelcomeMail } from './mail/WelcomeMail.js';

// Send a class-based Mailable:
await Mail.to('jane@example.com').send(new WelcomeMail(user));

// Or send a quick raw HTML email:
await Mail.to('jane@example.com').raw('<h1>Your verification code is 123456</h1>', {
  subject: 'Verify your account'
});
```

### 3. Testing with `Mail.fake()`

Verify emails are sent in automated tests without actually delivering to SMTP:

```typescript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Mail } from 'birframework';

test('registration sends welcome email', async () => {
  Mail.fake();

  await registerUserAction({ email: 'test@example.com' });

  const sent = Mail.sent();
  assert.strictEqual(sent.length, 1);
  assert.strictEqual(sent[0].to, 'test@example.com');

  Mail.restore();
});
```

### 4. Production Mail Drivers (`Resend` & `SMTP`) & Attachments

BirJS ships with zero-dependency **Resend API** and **raw SMTP (TCP/TLS)** drivers, plus `.attach()` support for PDF invoices:

```typescript
import { Mail, Mailable } from 'birframework';

// Configure automatically from .env (MAIL_MAILER=resend|smtp|log)
Mail.configureFromEnv();

// Or configure explicitly:
Mail.useResend(process.env.RESEND_API_KEY!);
// Mail.useSmtp({ host: 'smtp.example.com', port: 465, user: '...', pass: '...', secure: true });

class InvoiceMail extends Mailable {
  content() {
    return '<p>Your invoice PDF is attached.</p>';
  }
}

await Mail.to('customer@example.com').send(
  new InvoiceMail()
    .subject('Invoice #1042')
    .attach({ filename: 'invoice-1042.pdf', content: pdfBuffer, contentType: 'application/pdf' })
);
```

