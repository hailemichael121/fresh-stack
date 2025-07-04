
# 🚀 Fresh Stack CLI

![npm](https://img.shields.io/npm/v/@hailemichael121/start-project?color=green)
![License](https://img.shields.io/npm/l/@hailemichael121/start-project)
![Made With Love](https://img.shields.io/badge/made%20by-Yihun%20-red)

> The fastest way to spin up production-ready apps in **React**, **Flutter**, **NestJS**, **Node.js**, **Python**, **Spring Boot**, and more — with just one command.

---

## 📦 Installation

```bash
npm install -g @hailemichael121/start-project
````

---

## ⚙️ Usage

```bash
start-project
```

You'll be guided through an interactive prompt to:

1. Select a tech stack
2. Choose a version (system, latest, or custom)
3. Name your app
4. Create & scaffold the project
5. Optionally open in VS Code and run the dev server

---

## 💡 Supported Tech Stacks

| Stack        | Tool/Scaffold                           |
| ------------ | --------------------------------------- |
| React        | `create-react-app`                      |
| React Native | `react-native init`                     |
| Flutter      | `flutter create` (with Gradle patching) |
| NestJS       | `@nestjs/cli`                           |
| Spring Boot  | `start.spring.io` + `curl`              |
| Node.js      | `npm init -y`                           |
| Python       | `main.py` starter file                  |

---

## 🔥 Features

* 🔍 System dependency/version checks
* 🎛️ Choose version: system, latest, or custom
* 🧠 Smart fallback & error recovery
* 🧰 macOS auto dependency installer (via Homebrew)
* 💻 Open in VS Code
* 🚀 Auto-run development server
* 🗃️ Backup existing folders before overwrite
* 🌈 Interactive CLI with emoji & color output
* 📁 Project-agnostic, easily extendable

---

## 🧠 Why Use This?

Instead of memorizing 10+ commands for each stack every time, just do:

```bash
start-project
```

It’s like `create-react-app`, but for **every** major stack.

---

## 📚 Contribution Guide

Wanna make this even better? PRs are welcome!

### 🛠️ Setup

```bash
git clone https://github.com/hailemichael121/fresh-stack
cd fresh-stack
npm install
npm run dev
```

### 🌱 Add New Stack

1. Create a generator file in `lib/generators/yourstack.js`
2. Add your stack entry in `constants.js`
3. Export your generator in `lib/generators/index.js`
4. It will be auto-detected and added to the CLI prompt

---

## ☕ Support the Dev

If you like this tool and want to support me building more:

> [![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-%E2%98%95-yellow?style=for-the-badge\&logo=buymeacoffee)](https://buymeacoffee.com/yihuna121)

Every coin helps me build tools that help more devs! 🙏

---

## 📃 License

MIT © [Yihun Shekuri](https://github.com/hailemichael121)

---

## 🌍 Let's Connect

| Platform | Link                                                           |
| -------- | -------------------------------------------------------------- |
| GitHub   | [hailemichael121](https://github.com/hailemichael121)          |
| Twitter  | [@hailemichael121](https://twitter.com/hailemichael121)        |
| LinkedIn | [Yihun Shekuri](https://linkedin.com/in/hailemichael121) |
