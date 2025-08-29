# Smart CRM SaaS Platform

A modern, scalable React frontend for a Smart CRM SaaS platform with multi-tenant architecture, role-based access control, and AI-powered features.

## 🚀 Features

### Core Functionality
- **Multi-tenant Architecture**: Complete organization isolation
- **Role-based Access Control**: System Admin, Org Admin, Employee, Customer roles
- **Dashboard**: KPIs, analytics, and activity tracking
- **Lead Management**: CRUD operations, lead scoring, pipeline management
- **Complaint Management**: Issue tracking, categorization, priority handling
- **AI Chatbot**: RAG-powered customer support assistant
- **User Management**: Team member administration
- **Subscription Management**: Free/Premium tier handling

### Technical Features
- **Modern React**: Hooks, Context API, TypeScript
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Modular Architecture**: Scalable component structure
- **API Integration**: Axios-based service layer
- **Route Protection**: Role-based navigation guards
- **Loading States**: Skeleton loaders and spinners
- **Empty States**: User-friendly placeholder content

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/
│   ├── common/          # Shared components
│   ├── leads/           # Lead-specific components
│   ├── complaints/      # Complaint-specific components
│   └── users/           # User management components
├── pages/               # Route components
├── context/             # React Context providers
├── services/            # API service layer
├── types/               # TypeScript definitions
└── utils/               # Helper functions
```

### Role-based Access
- **System Admin**: Platform-wide management, all organizations
- **Organization Admin**: Team management, subscription control
- **Employee**: Lead and complaint management within organization
- **Customer**: Complaint submission, chatbot access

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Actions, links, primary buttons
- **Secondary**: Gray (#6B7280) - Text, borders, subtle elements
- **Success**: Green (#10B981) - Positive actions, success states
- **Warning**: Yellow (#F59E0B) - Warnings, pending states
- **Error**: Red (#EF4444) - Errors, destructive actions

### Typography
- **Headings**: Inter font family, bold weights
- **Body**: Inter font family, regular weight
- **Code**: Monospace for technical content

### Spacing
- **Base Unit**: 8px grid system
- **Component Padding**: 16px, 24px for cards
- **Section Margins**: 24px, 32px between major sections

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd smart-crm-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Demo Accounts
The application includes demo accounts for testing:

- **System Admin**: admin@crm.com / demo123
- **Org Admin**: org@company.com / demo123  
- **Employee**: employee@company.com / demo123
- **Customer**: customer@email.com / demo123

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Collapsible sidebar navigation
- Touch-friendly button sizes
- Optimized form layouts
- Responsive data tables

## 🔮 Future Enhancements

### AI Features (Ready for Integration)
- **Advanced Lead Scoring**: ML-powered lead qualification
- **Complaint Classification**: Automatic categorization and routing
- **Predictive Analytics**: Customer behavior insights
- **Workflow Automation**: AI-driven process optimization

### Integrations (Placeholder Ready)
- **SerpAPI**: Automated lead generation
- **CRM Connectors**: Salesforce, HubSpot integration
- **Communication**: Email, SMS, WhatsApp
- **Analytics**: Advanced reporting and dashboards

### Premium Features
- **White-label Options**: Custom branding
- **Advanced Permissions**: Granular access control
- **API Access**: Custom integrations
- **Priority Support**: Enhanced customer service

## 🛠️ Development

### Code Style
- **ESLint**: Configured for React and TypeScript
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking

### Component Guidelines
- **Single Responsibility**: One purpose per component
- **Props Interface**: TypeScript interfaces for all props
- **Error Boundaries**: Graceful error handling
- **Accessibility**: ARIA labels and keyboard navigation

### State Management
- **React Context**: Authentication and global state
- **Local State**: Component-specific state with useState
- **API State**: Service layer with loading/error states

## 🚀 Deployment

### Build Process
```bash
# Production build
npm run build

# Preview build
npm run preview
```

### Environment Variables
```env
VITE_API_URL=https://api.yourcrm.com
VITE_APP_NAME=Smart CRM
VITE_SUPPORT_EMAIL=support@yourcrm.com
```

## 📊 Performance

### Optimization Features
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Responsive images with proper sizing
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Caching**: Service worker for offline functionality

### Metrics Targets
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔒 Security

### Frontend Security
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Token-based requests
- **Secure Storage**: Encrypted local storage for sensitive data
- **Route Guards**: Protected routes based on authentication

### Data Privacy
- **GDPR Compliance**: User data handling
- **Data Encryption**: Sensitive information protection
- **Audit Logging**: User action tracking
- **Session Management**: Secure token handling

## 📞 Support

For technical support or questions:
- **Documentation**: [docs.yourcrm.com](https://docs.yourcrm.com)
- **Support Email**: support@yourcrm.com
- **Community**: [community.yourcrm.com](https://community.yourcrm.com)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.