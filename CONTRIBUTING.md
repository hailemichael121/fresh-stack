# 🤝 Contributing to Fresh Stack CLI

Thanks for considering contributing to Fresh Stack! Here’s how to get started:

## 🧱 Project Structure

````

fresh-stack/
├── bin/
│   └── fresh-stack.js         # CLI entry point
├── lib/
│   ├── generators/            # Stack-specific project creators
│   ├── utils/                 # Utilities (deps check, version, installer)
│   └── constants.js           # All stack configs here

````

## 🚀 Add New Tech Stack

1. Create a file in `lib/generators/yourstack.js`
2. Export it like:

```js
export default async function generateYourStack(appName, version) {
  // your logic
}
````

3. Add it to `lib/constants.js` like:

```js
yourstack: {
  title: "Your Stack",
  deps: ["your-dep"],
  minVersions: {
    "your-dep": "x.x.x",
  },
}
```

4. Import & attach it in `lib/generators/index.js`

---

## 📦 Run Locally

```bash
npm install
npm run dev
```

Run CLI locally with:

```bash
node ./bin/fresh-stack.js
```

Or:

```bash
npm link
start-project
```

---

## ✅ PR Checklist

* [ ] Follow ES module syntax
* [ ] Add minimal error handling
* [ ] Keep UX clean & colorized (chalk)
* [ ] Include fallback if needed
* [ ] Comment any tricky logic
