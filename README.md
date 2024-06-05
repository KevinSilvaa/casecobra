# Casecobra

![CaseCobra Home](https://github.com/KevinSilvaa/casecobra/assets/143517496/b85650dc-b882-4548-b48f-7d93db688774)

## Project Overview

Casecobra is a place that allows users to customize and purchase phone cases directly from the website. Users can personalize their phone cases with their own photos, choose different colors, materials, case finishes or even the phone model to create unique products tailored to their preferences.

## Key Features

- **Customization Tools**: Upload personal photos and apply them to phone cases.
- **Color Options**: Choose from a variety of colors for different parts of the phone case.
- **Material Choices**: Select from different materials for the phone case.
- **Finish Options**: Customize the finish of the phone case to match personal style.
- **E-commerce Integration**: Seamlessly purchase customized phone cases directly from the website.
- **Admin Dashboard**: Manage orders, monthly and weekly revenue, and search by orders through a custom table filter.
- **Order Confirmation Emails**: Custom email notifications sent to users when their orders are approved.

## Technologies Used

- **TypeScript**: For static typing to reduce potential errors.
- **Next.js**: For server-side rendering and better performance.
- **Prisma**: As the ORM for database interactions.
- **PostgreSQL**: For the database.
- **Kinde**: For authentication with Google or email.
- **Tailwind CSS**: For styling the application.
- **React Hook Form**: For handling form data.
- **Zod**: For schema validation.
- **React Query**: For data fetching and state management.
- **Uploadthing**: For storing the files uploaded by the users.
- **React-rnd**: To offer users the flexibility to resize or change the image position as desired..
- **Shadcn/ui**: As the UI Library for the components.
- **Stripe**: As the payment gateway used for processing purchases.
- **React Email**: For constructing the custom email templates.
- **Resend**: For sending the emails to the users when the order is approved.
- **Framer Motion**: To make custom animations in the marketing page.

### Custom Admin Dashboard

You can log in to the custom admin dashboard going to your `.env` file and changing the `ADMIN_EMAIL` variable to your desired email:

```bash
ADMIN_EMAIL="admin@admin.com"
```

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Docker (optional, for database setup)

### Installation

1. **Clone the Repository**

    ```bash
    git clone git@github.com:KevinSilvaa/casecobra.git
    cd casecobra
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Set Up Environment Variables**

    Rename `.env.example` to `.env` and update the variables as needed.

4. **Run Database Migrations**

    ```bash
    npx prisma migrate dev
    ```

5. **Start the Application**

    ```bash
    npm run dev
    ```

6. **Access the Application**

    Open your browser and go to [http://localhost:3000](http://localhost:3000).

## Deployment

Instructions for deploying the application will vary based on your hosting environment. Common options include Vercel, Heroku, and DigitalOcean.

## Author

**Kevin Silva**

- [LinkedIn](https://www.linkedin.com/in/kevinsilvaa)
- [GitHub](https://github.com/KevinSilvaa)

For any questions or suggestions, please feel free to contact me.
