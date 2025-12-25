# LifeFlow - Modern Blood Donation Platform 🩸

LifeFlow is a comprehensive, open-source blood donation management system designed to bridge the gap between donors, hospitals, and blood banks. It streamlines the donation process, manages inventory in real-time, and provides actionable insights for healthcare administrators.

![LifeFlow Banner](/public/demo.mp4)

## 🚀 Features

### For Donors

- **Smart Scheduling**: Easy appointment booking with real-time availability.
- **Health Tracking**: View vital history (BP, hemoglobin, etc.) from past donations.
- **Impact Journey**: Track your blood donation from collection to the patient who receives it.
- **Gamification**: Earn badges and track your "lives saved" impact.
- **Eligibility Assistant**: AI-powered chat to check donation eligibility.

### For Hospitals & Staff

- **Inventory Management**: Real-time tracking of blood units by type and status.
- **Digital Screening**: Streamlined donor intake and health screening forms.
- **Appointment Management**: Check-in donors and manage daily schedules.

### For Admins

- **Dashboard Analytics**: High-level KPIs on donations, donors, and inventory health.
- **Facility Management**: Manage donation centers, hospitals, and mobile camps.
- **User Management**: Role-based access control and user verification.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: Custom Auth (Better Auth pattern)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/lifeflow.git
   cd lifeflow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/lifeflow"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   # Add other secrets as needed
   ```

4. **Database Setup**
   Run migrations and push schema:

   ```bash
   npx drizzle-kit push
   ```

5. **Seed Data (Optional)**
   Populate the database with test users, centers, and appointments:

   ```bash
   # Visit http://localhost:3000/api/seed in your browser after starting the server
   # OR
   curl http://localhost:3000/api/seed
   ```

6. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔐 Default Login Credentials (Seed Data)

**Admin Portal**

- Email: `admin@vitals.com`
- Password: `Admin123!`

**Hospital Staff**

- Email: `sarah.smith@hospital.com`
- Password: `Staff123!`

**Donor Portal**

- Register a new account or use `alex.mercer@example.com` / `Donor123!`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ for saving lives.
