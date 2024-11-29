const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prismadb = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('password', 10)

    await prismadb.admin.create({
        data: {
            email: 'admin@gmail.com',
            password: hashedPassword,
            name: 'Admin'
        }
    })

    await prismadb.portofolio.createMany({
        data: [
            {
                nama: 'Modern E-Commerce Platform',
                deskripsi: 'Full-stack e-commerce solution with advanced features',
                techStack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe'],
                link: 'https://ecommerce.example.com'
            },
            {
                nama: 'Real Estate Management System',
                deskripsi: 'Comprehensive property management application',
                techStack: ['React', 'Node.js', 'MongoDB', 'AWS'],
                link: 'https://realestate.example.com'
            },
            {
                nama: 'Social Media Dashboard',
                deskripsi: 'Analytics and management platform for social media',
                techStack: ['Vue.js', 'Express', 'MySQL', 'Redis'],
                link: 'https://dashboard.example.com'
            },
            {
                nama: 'Learning Management System',
                deskripsi: 'Educational platform with interactive features',
                techStack: ['Next.js', 'Django', 'PostgreSQL', 'WebSocket'],
                link: 'https://lms.example.com'
            },
            {
                nama: 'Healthcare Management Portal',
                deskripsi: 'Patient and medical records management system',
                techStack: ['React', 'Java Spring', 'Oracle', 'Docker'],
                link: 'https://health.example.com'
            },
            {
                nama: 'Portfolio Website Generator',
                deskripsi: 'Dynamic portfolio website builder with themes',
                techStack: ['Next.js', 'Three.js', 'TailwindCSS', 'Prisma'],
                link: 'https://portfolio.example.com'
            },
            {
                nama: 'Project Management Tool',
                deskripsi: 'Agile project management and collaboration platform',
                techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
                link: 'https://project.example.com'
            },
            {
                nama: 'Financial Analytics Platform',
                deskripsi: 'Investment and financial data analysis tool',
                techStack: ['Vue.js', 'Python Flask', 'PostgreSQL', 'Redis'],
                link: 'https://finance.example.com'
            },
            {
                nama: 'Inventory Management System',
                deskripsi: 'Warehouse and stock management solution',
                techStack: ['React', 'Node.js', 'MySQL', 'Docker'],
                link: 'https://inventory.example.com'
            },
            {
                nama: 'AI-Powered Content Generator',
                deskripsi: 'Content creation tool with AI integration',
                techStack: ['Next.js', 'Python', 'TensorFlow', 'MongoDB'],
                link: 'https://content.example.com'
            }
        ]
    })
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prismadb.$disconnect())