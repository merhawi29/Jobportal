# Job Portal

A modern job portal application built with Laravel and React/TypeScript, designed to connect job seekers with employers through a seamless and intuitive platform.

## 🚀 Features

- User authentication (Job seekers and Employers)
- Job posting and management
- Advanced job search and filtering
- Profile management for both job seekers and employers
- Real-time notifications
- Responsive design for all devices

## 🛠️ Tech Stack

- **Frontend:**
  - React
  - TypeScript
  - Tailwind CSS
  - Vite

- **Backend:**
  - Laravel
  - PHP
  - MySQL

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- PHP >= 8.1
- Node.js >= 16.x
- Composer
- MySQL

## 🔧 Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd Jobportal
```

2. Install PHP dependencies:
```bash
composer install
```

3. Install Node.js dependencies:
```bash
npm install
```

4. Configure environment variables:
```bash
cp .env.example .env
php artisan key:generate
```

5. Set up the database:
```bash
php artisan migrate
php artisan db:seed # if you want to seed the database with sample data
```

6. Start the development servers:

For Laravel:
```bash
php artisan serve
```

For React/Vite:
```bash
npm run dev
```

## 🔍 Usage

Visit `http://localhost:8000` to access the application.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Your Name - merhawinguse29@gmail.com

Project Link: https://github.com/yourusername/Jobportal
