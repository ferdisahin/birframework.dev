# Request Validation

BirJS includes a zero-dependency schema validation engine featuring Laravel-style pipe validation rules.

---

## Basic Validation

Call `ctx.validate(rules)` inside any controller action or route closure:

```ts
import { Route } from 'birframework';

Route.post('/register', async (ctx) => {
  const data = ctx.validate({
    name: 'required|min:3|max:50',
    email: 'required|email',
    password: 'required|min:8',
    age: 'numeric|min:18',
  });

  // `data` contains only validated and sanitized fields
  return ctx.json({ status: 'ok', user: data });
});
```

---

## Form Request Classes

For complex validation scenarios or to keep controllers thin and focused, use **Form Requests**:

```bash
npx birframework make:request StoreUserRequest
```

This generates `app/requests/StoreUserRequest.ts`:

```typescript
import { FormRequest, type ValidationRules } from 'birframework';

export class StoreUserRequest extends FormRequest<{ name: string; email: string }> {
  /**
   * Determine if the user is authorized to perform this action.
   */
  public override async authorize(): Promise<boolean> {
    return this.ctx.session?.has('user_id') === true;
  }

  /**
   * Mutate or prepare inputs prior to validation.
   */
  public override async prepareForValidation(): Promise<void> {
    const body = (await this.ctx.body()) || {};
    if (body.email) {
      body.email = body.email.trim().toLowerCase();
    }
  }

  /**
   * Get the validation rules.
   */
  public override rules(): ValidationRules {
    return {
      name: 'required|min:3',
      email: 'required|email',
    };
  }
}
```

### Using Form Requests in Controllers

Use `ctx.validateWith(RequestClass)`:

```typescript
export class UserController {
  public async store(ctx: RequestContext) {
    // 1. Checks authorize() -> throws 403 Forbidden if false
    // 2. Runs prepareForValidation()
    // 3. Runs rules() -> throws 422 Unprocessable if invalid
    // 4. Returns strictly typed validated data:
    const validated = await ctx.validateWith(StoreUserRequest);

    const user = await User.create(validated);
    return ctx.json({ user }, 201);
  }
}
```

---

## Error Handling

When validation fails, BirJS automatically stops request execution:
- **API / JSON Requests**: Returns a `422 Unprocessable Content` response with structured error messages.
- **Web Form Requests**: Flashes error messages to the session and redirects back to the previous form URL.

Example JSON error response:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email must be a valid email address."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

---

## Available Validation Rules

| Rule | Description | Example |
| --- | --- | --- |
| `required` | Field must be present and not empty | `'title': 'required'` |
| `email` | Must be a valid email address | `'email': 'required\|email'` |
| `min:n` | Minimum string length or numeric value | `'password': 'min:8'` |
| `max:n` | Maximum string length or numeric value | `'username': 'max:20'` |
| `numeric` | Value must be a valid number | `'price': 'numeric'` |
| `boolean` | Must be true, false, 0, or 1 | `'terms': 'required\|boolean'` |
| `in:a,b,c` | Value must be in the specified list | `'status': 'in:draft,published'` |
