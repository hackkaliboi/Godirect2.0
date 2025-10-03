# GoDirect - Real Estate Platform

**Find Your Dream Home in Nigeria** 🏡

GoDirect is a comprehensive real estate platform that connects buyers, sellers, and agents across Nigeria. Our platform specializes in premium properties in major Nigerian cities including Enugu, Calabar, and Lagos.

## ✨ Features

### For Property Seekers
- 🔍 **Advanced Property Search** - Filter by location, price, property type, and amenities
- 🏘️ **Featured Listings** - Handpicked premium properties across Nigeria
- 📍 **Location Spotlight** - Explore properties in Enugu, Calabar, Lagos, and more
- 💰 **Investment Calculator** - Calculate potential returns and mortgage estimates
- 📱 **Interactive Map** - Visual property browsing with location-based search
- 💌 **Save Favorites** - Keep track of properties you're interested in

### For Real Estate Agents
- 📊 **Agent Dashboard** - Comprehensive management tools for listings and clients
- 👥 **Lead Management** - Track and manage potential buyers
- 📅 **Calendar Integration** - Schedule and manage property viewings
- 💵 **Commission Tracking** - Monitor earnings and transaction history
- 📧 **Client Communication** - Built-in messaging system
- 📈 **Performance Analytics** - Track your success metrics

### For Administrators
- 🎛️ **Admin Dashboard** - Complete platform oversight and management
- ✅ **Property Approval System** - Quality control for all listings
- 👤 **User Management** - Manage agents, buyers, and platform users
- 📊 **Analytics & Reporting** - Comprehensive platform insights
- ⚙️ **System Configuration** - Platform settings and customization

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account (for backend services)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Godirect-realty
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```
Add your Supabase credentials and other required environment variables.

4. **Database Setup**
For a fresh start (recommended):
- Follow the guide in `NEW_SUPABASE_PROJECT_SETUP.md` to create a new Supabase project
- This will permanently resolve the admin login issue

For existing projects:
- Open `CONSOLIDATED_DATABASE_FIX.sql` 
- Copy the contents into your Supabase SQL Editor
- Run the SQL to set up your database with all fixes and improvements

5. **Storage Setup**
The database setup includes storage bucket configuration:
- **avatars**: For user profile pictures
- **property-images**: For property photos and galleries
- **documents**: For KYC documents and private files

See `STORAGE_BUCKET_GUIDE.md` for detailed usage instructions.

6. **Start the development server**
```bash
npm run dev
```

7. **Open your browser**
Navigate to `http://localhost:5173` to see the application.

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful and accessible UI components
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **React Hook Form** - Performant forms with validation
- **React Query** - Server state management
- **Recharts** - Data visualization and charts

### Backend & Database
- **Supabase** - PostgreSQL database with real-time features
- **Supabase Auth** - User authentication and authorization
- **Supabase Storage** - File upload and management

### Development Tools
- **ESLint** - Code linting and quality checks
- **TypeScript** - Static type checking

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── agents/         # Agent-related components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── home/           # Homepage components
│   ├── layout/         # Layout components (header, footer)
│   ├── properties/     # Property-related components
│   └── ui/             # Base UI components (shadcn/ui)
├── pages/              # Page components
│   ├── admin/          # Admin dashboard pages
│   ├── agent/          # Agent dashboard pages
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # User dashboard pages
│   └── user/           # User-specific pages
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
└── styles/             # Global styles and Tailwind config
```

## 🌟 Key Features in Detail

### Multi-Role Authentication
- **Users**: Browse and save properties, schedule viewings
- **Agents**: Manage listings, track leads, handle client communications
- **Admins**: Full platform oversight and management

### Property Management
- Comprehensive property listing system
- Image galleries with multiple photos per property
- Advanced filtering and search capabilities
- Property comparison tools
- Detailed property information and amenities

### Location Focus
- **Enugu** - The 'Coal City' with urban amenities and natural beauty
- **Calabar** - The 'Canaan City' known for cleanliness and cultural heritage
- **Lagos** - Nigeria's economic hub with premium waterfront properties

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development environment
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Contact our support team

---

**GoDirect** - Making Nigerian real estate accessible to everyone. 🇳🇬