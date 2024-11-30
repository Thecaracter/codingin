const { PrismaClient } = require('@prisma/client')

const prismadb = new PrismaClient()

async function main() {
    await prismadb.user.create({
        data: {
            email: 'admin@gmail.com',
            name: 'Admin',
            role: 'ADMIN',
            image: 'https://picsum.photos/200/200',
            accounts: {
                create: {
                    type: "oauth",
                    provider: "google",
                    providerAccountId: "default_admin_id",
                }
            }
        }
    })

    await prismadb.portofolio.createMany({
        data: [
            {
                nama: 'Modern E-Commerce Platform',
                deskripsi: 'Full-stack e-commerce solution with advanced features',
                techStack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe'],
                link: 'https://ecommerce.example.com',
                image: 'https://picsum.photos/800/600'
            },
            {
                nama: 'Real Estate Management System',
                deskripsi: 'Comprehensive property management application',
                techStack: ['React', 'Node.js', 'MongoDB', 'AWS'],
                link: 'https://realestate.example.com',
                image: 'https://picsum.photos/800/600'
            },
            {
                nama: 'Social Media Dashboard',
                deskripsi: 'Analytics and management platform for social media',
                techStack: ['Vue.js', 'Express', 'MySQL', 'Redis'],
                link: 'https://dashboard.example.com',
                image: 'https://picsum.photos/800/600'
            },
            {
                nama: 'Learning Management System',
                deskripsi: 'Educational platform with interactive features',
                techStack: ['Next.js', 'Django', 'PostgreSQL', 'WebSocket'],
                link: 'https://lms.example.com',
                image: 'https://picsum.photos/800/600'
            },
            {
                nama: 'Healthcare Management Portal',
                deskripsi: 'Patient and medical records management system',
                techStack: ['React', 'Java Spring', 'Oracle', 'Docker'],
                link: 'https://health.example.com',
                image: 'https://picsum.photos/800/600'
            },
            {
                nama: 'Portfolio Website Generator',
                deskripsi: 'Dynamic portfolio website builder with themes',
                techStack: ['Next.js', 'Three.js', 'TailwindCSS', 'Prisma'],
                link: 'https://portfolio.example.com',
                image: 'https://picsum.photos/800/600'
            },
            {
                nama: 'Project Management Tool',
                deskripsi: 'Agile project management and collaboration platform',
                techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
                link: 'https://project.example.com',
                image: 'https://picsum.photos/800/600'
            },
            {
                nama: 'Financial Analytics Platform',
                deskripsi: 'Investment and financial data analysis tool',
                techStack: ['Vue.js', 'Python Flask', 'PostgreSQL', 'Redis'],
                link: 'https://finance.example.com',
                image: 'https://picsum.photos/800/600'
            },
            {
                nama: 'Inventory Management System',
                deskripsi: 'Warehouse and stock management solution',
                techStack: ['React', 'Node.js', 'MySQL', 'Docker'],
                link: 'https://inventory.example.com',
                image: 'https://picsum.photos/800/600'
            },
            {
                nama: 'AI-Powered Content Generator',
                deskripsi: 'Content creation tool with AI integration',
                techStack: ['Next.js', 'Python', 'TensorFlow', 'MongoDB'],
                link: 'https://content.example.com',
                image: 'https://picsum.photos/800/600'
            }
        ]
    })
}

main()
    .catch(e => {
        console.error('Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prismadb.$disconnect()
    })