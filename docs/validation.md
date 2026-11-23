# Request Validation

BirFramework includes a zero-dependency schema validation engine featuring Laravel-style pipe validation rules.

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

## Error Handling

When validation fails, BirFramework automatically stops request execution:
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
