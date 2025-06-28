# 🐼 PingPanda – A Modern Fullstack Event Monitoring SaaS

Built using **Next.js App Router**, **TypeScript**, **PostgreSQL**, **Prisma**, **Clerk**, and **Stripe**

![PingPanda Banner](https://github.com/user-attachments/assets/f21ab434-9579-4688-a4b9-2f29849ff102)

---

## 🚀 Overview

**PingPanda** is a plug-and-play SaaS platform that allows developers and businesses to log custom events and receive real-time Discord alerts.  
It offers a simple yet powerful API to integrate event tracking into any product and delivers rich Discord notifications, usage quotas, and billing.

---

## ✨ Features

- 🛠️ Full-stack SaaS built with the **Next.js App Router**
- 📩 Real-time Discord notifications with custom event fields
- 🧠 Schema-less event logging via flexible API endpoints
- 🔐 Multi-tenant API key access with scoped routing
- 🛍️ Usage-based plans:
  - **Free:** 3 event categories, 100 alerts/month
  - **PRO:** 10 categories, 1000 alerts/month
- 💳 Stripe-powered checkout, billing & upgrade flow
- 🔑 Secure authentication with **Clerk**
- 📊 Modern UI using **shadcn/ui** & **Tailwind CSS**
- 💬 Clean dashboard to track categorized events
- 🧾 Built-in support for filtering, alerts, and custom fields
- 💯 100% TypeScript codebase

---

## 🧑‍💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yugaldekate/pingpanda.git
cd pingpanda
```
### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Copy the .env.example file and fill in your keys:
```bash
cp .env.example .env
```

### 4. Run the development server
```bash
npm run dev
```

Your app should now be running at: [http://localhost:3000](http://localhost:3000)

---

## 🧱 Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| Frontend     | Next.js (App Router), Tailwind CSS, shadcn/ui |
| Auth         | Clerk.dev                      |
| Backend      | tRPC, Prisma ORM               |
| Database     | PostgreSQL                     |
| Payments     | Stripe                         |
| Notifications| Discord API                    |
| State Mgmt   | Zustand                        |
| Deployment   | Vercel                         |

---

## 📸 Screenshots

![Dashboard Preview](https://github.com/user-attachments/assets/32691d72-b290-4631-8e3a-72e08ad15f52)
![Demo](https://github.com/user-attachments/assets/b1f54ca3-7aeb-4fa7-a53d-fe8ae3f2206b)
![Pricing Page](https://github.com/user-attachments/assets/b8791ce8-85a3-4656-9306-4c07e6896472)

---

## 📄 License

MIT © [Yugal Dekate](https://github.com/yugaldekate)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 💬 Feedback

If you have any feedback or ideas, feel free to reach out on GitHub or open an issue.
