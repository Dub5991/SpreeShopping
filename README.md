# 🛍️ Spree Shopping

<div align="center">

  <img src="https://readme-typing-svg.demolab.com?font=Montserrat&size=28&duration=2500&pause=800&color=6366F1&center=true&vCenter=true&width=500&lines=Shop+Smarter.+Shop+Spree!;Gamified+Rewards+%F0%9F%8E%81;Modern+UI+%F0%9F%92%BB;Lightning+Fast+%F0%9F%94%A5" alt="Typing SVG" />
  <br/><br/>
  <b>Modern, animated, and gamified e-commerce built with React, TypeScript, Vite, and Firebase.</b>
  <br/><br/>

  ![CI/CD](https://github.com/Dub5991/SpreeShopping/actions/workflows/main.yml/badge.svg)
  [![codecov](https://codecov.io/gh/Dub5991/SpreeShopping/branch/main/graph/badge.svg)](https://codecov.io/gh/Dub5991/SpreeShopping)
  ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

</div>

## 📝 Overview

**Spree Shopping** is a modern, animated, and gamified e-commerce platform. Shop smarter with a playful UI, earn rewards as you shop, and enjoy lightning-fast performance. Built with React 19, TypeScript, Vite, and Firebase, Spree offers a seamless shopping experience with secure authentication and robust state management.

- **Live Site:** [https://spree-shopping.vercel.app/](https://spree-shopping.vercel.app/)

---

## ✨ Features

- 🎨 **Animated backgrounds** and playful, modern UI
- 🏆 **Gamified shopping** with XP, levels, and rewards
- 🔒 **Secure authentication** (login, register, password reset)
- 📱 **Responsive design** for all devices
- ♿ **Accessible** — keyboard navigation with skip-to-content link and ARIA labels
- ⚡ **Lightning-fast** with Vite and React 19
- 🛒 **Product catalog, cart, and orders**
- 🧩 **Redux Toolkit** for robust state management
- 🔥 **Firebase** for authentication and data
- 💡 **Framer Motion** for smooth transitions
- 🖼️ **Custom SVG branding** and logo

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open your browser
http://localhost:5173
```

---

## 🧪 Testing

The project uses [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit and integration tests.

```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage
```

### Test coverage includes:
- **Unit tests** — Redux slices (`productSlice`, `orderSlice`, `userSlice`)
- **Component tests** — `SpreeLogo`, `ProductCategoryFilter`, `Profile`
- **Integration tests** — Cart flow, `ProductList` rendering & add-to-cart behaviour

Coverage reports are uploaded to [Codecov](https://codecov.io/gh/Dub5991/SpreeShopping) on every CI run.

---

## ⚙️ CI/CD

This project uses [GitHub Actions](https://github.com/features/actions) for continuous integration and [Vercel](https://vercel.com/) for continuous deployment.

### Workflow: `build-and-test` → `deploy`

| Step | Description |
|------|-------------|
| Checkout | Fetch latest code |
| Setup Node.js 20 | With npm dependency caching |
| Install dependencies | `npm ci` |
| Lint | `npm run lint` (ESLint) |
| Test with coverage | `npm test -- --coverage` |
| Upload coverage | Codecov integration |
| Deploy (main branch only) | Vercel production deployment |

- **Triggers:** Push to `main`/`master` and all pull requests.
- **Caching:** npm dependencies are cached between runs for faster builds.
- **Preview Deployments:** Pull requests generate preview URLs on Vercel.

---

## 🖼️ Screenshots

<div align="center">
  <img src="https://user-images.githubusercontent.com/placeholder/spree-hero.png" alt="Spree Hero" width="80%" />
  <br/>
  <img src="https://user-images.githubusercontent.com/placeholder/spree-cart.png" alt="Spree Cart" width="80%" />
</div>

---

## 🧩 Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite](https://vitejs.dev/) | Fast dev/build tool |
| [Redux Toolkit](https://redux-toolkit.js.org/) | State management |
| [Firebase](https://firebase.google.com/) | Auth & database |
| [React Bootstrap](https://react-bootstrap.github.io/) | UI components |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [Jest](https://jestjs.io/) + [RTL](https://testing-library.com/) | Testing |
| [Codecov](https://codecov.io/) | Coverage reporting |

---

## 🎨 Design & Accessibility

- **Animated Spree Logo** with custom SVG branding
- **Background Orbs & Waves** — subtle, animated SVG and CSS backgrounds
- **Motion Transitions** — page and component transitions via Framer Motion
- **Skip-to-content link** — improves keyboard and screen-reader navigation
- **ARIA labels** — all interactive and decorative elements labelled

---

## 🛠️ Development

### Linting

```bash
npm run lint
```

### ESLint (React & TypeScript)

```js
// eslint.config.js
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
```

---

## 🤝 Contributing

Pull requests and suggestions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request — the CI pipeline will run automatically

Please ensure all tests pass (`npm test`) before submitting.

---

## 📄 License

MIT

---

<div align="center">
  <img src="/SpreeLogo.svg" alt="Spree Logo" width="60" /><br/>
  <b>Happy Spree Shopping!</b>
</div>

