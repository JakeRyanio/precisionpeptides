/**
 * Seed Admin User Script
 * 
 * Creates the admin user account for the admin portal.
 * Run with: npx tsx prisma/seed-admin.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedAdmin() {
  console.log('🔐 Seeding admin user...\n')

  const adminEmail = 'precisionpep@proton.me'
  const adminPassword = 'PepSynergy23!'

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists. Updating password...')
      
      const hashedPassword = await bcrypt.hash(adminPassword, 12)
      
      await prisma.user.update({
        where: { email: adminEmail },
        data: {
          password: hashedPassword,
          role: 'ADMIN',
          name: 'Admin'
        }
      })
      
      console.log('✅ Admin user password updated!')
    } else {
      console.log('Creating new admin user...')
      
      const hashedPassword = await bcrypt.hash(adminPassword, 12)
      
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Admin',
          role: 'ADMIN'
        }
      })
      
      console.log('✅ Admin user created!')
    }

    console.log('\n' + '='.repeat(50))
    console.log('Admin Login Credentials:')
    console.log('='.repeat(50))
    console.log(`Email:    ${adminEmail}`)
    console.log(`Password: ${adminPassword}`)
    console.log('='.repeat(50))

  } catch (error) {
    console.error('❌ Error seeding admin user:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedAdmin()
  .then(() => {
    console.log('\n✅ Admin seeding complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Admin seeding failed:', error)
    process.exit(1)
  })
