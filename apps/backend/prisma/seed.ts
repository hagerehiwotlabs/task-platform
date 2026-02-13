import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  
  // Create test user with hashed password
  const hashedPassword = await hash('SecurePass123!', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@hagerehiwotlabs.dev' },
    update: {},
    create: {
      email: 'test@hagerehiwotlabs.dev',
      name: 'Test User',
      password: hashedPassword,
      lastLoginAt: new Date(),
    },
  })
  
  // Create sample project
  const project = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design',
      ownerId: user.id,
    },
  })
  
  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Design homepage',
        description: 'Create wireframes and mockups for new homepage',
        status: 'TODO',
        priority: 'HIGH',
        projectId: project.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Implement login system',
        description: 'Add JWT authentication with refresh tokens',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assigneeId: user.id,
        projectId: project.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    }),
    prisma.task.create({
      data: {
        title: 'Write API documentation',
        description: 'Generate OpenAPI documentation and user guides',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: project.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Setup CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        status: 'DONE',
        priority: 'MEDIUM',
        projectId: project.id,
      },
    }),
  ])
  
  console.log('✅ Database seeded successfully')
  console.log(`👤 User: ${user.email}`)
  console.log(`📁 Project: ${project.name}`)
  console.log(`📝 Tasks created: ${tasks.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
