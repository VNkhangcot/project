const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../src/models/User');
const Role = require('../src/models/Role');
const Enterprise = require('../src/models/Enterprise');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Role.deleteMany({});
    await Enterprise.deleteMany({});

    // Create default roles
    console.log('👥 Creating default roles...');
    await Role.createDefaultRoles();

    // Get roles for user creation
    const superAdminRole = await Role.findByName('super_admin');
    const adminRole = await Role.findByName('admin');
    const enterpriseOwnerRole = await Role.findByName('enterprise_owner');
    const managerRole = await Role.findByName('manager');
    const employeeRole = await Role.findByName('employee');

    // Create default users
    console.log('👤 Creating default users...');
    
    // Super Admin
    const superAdmin = new User({
      name: 'Super Administrator',
      email: 'superadmin@system.com',
      password: 'SuperAdmin123!',
      role: superAdminRole._id,
      status: 'active',
      emailVerified: true,
      preferences: {
        language: 'vi',
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      }
    });
    await superAdmin.save();
    console.log('✅ Super Admin created');

    // System Admin
    const admin = new User({
      name: 'System Administrator',
      email: 'admin@system.com',
      password: 'Admin123!',
      role: adminRole._id,
      status: 'active',
      emailVerified: true,
      preferences: {
        language: 'vi',
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      }
    });
    await admin.save();
    console.log('✅ System Admin created');

    // Enterprise Owner
    const enterpriseOwner = new User({
      name: 'Nguyễn Văn Doanh',
      email: 'owner@enterprise.com',
      password: 'Owner123!',
      role: enterpriseOwnerRole._id,
      status: 'active',
      emailVerified: true,
      preferences: {
        language: 'vi',
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          sms: true
        }
      }
    });
    await enterpriseOwner.save();
    console.log('✅ Enterprise Owner created');

    // Manager
    const manager = new User({
      name: 'Trần Thị Quản Lý',
      email: 'manager@enterprise.com',
      password: 'Manager123!',
      role: managerRole._id,
      status: 'active',
      emailVerified: true,
      preferences: {
        language: 'vi',
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      }
    });
    await manager.save();
    console.log('✅ Manager created');

    // Employee
    const employee = new User({
      name: 'Lê Văn Nhân Viên',
      email: 'employee@enterprise.com',
      password: 'Employee123!',
      role: employeeRole._id,
      status: 'active',
      emailVerified: true,
      preferences: {
        language: 'vi',
        theme: 'light',
        notifications: {
          email: true,
          push: false,
          sms: false
        }
      }
    });
    await employee.save();
    console.log('✅ Employee created');

    // Create sample enterprises
    console.log('🏢 Creating sample enterprises...');

    const sampleEnterprises = [
      {
        name: 'Công ty TNHH Công nghệ ABC',
        code: 'ABC001',
        businessType: 'Technology',
        taxCode: '0123456789',
        address: {
          street: '123 Đường Nguyễn Văn Linh',
          city: 'Hồ Chí Minh',
          state: 'Hồ Chí Minh',
          zipCode: '700000',
          country: 'Vietnam'
        },
        phone: '0901234567',
        email: 'info@abc-tech.com',
        website: 'https://abc-tech.com',
        contactPerson: {
          name: 'Nguyễn Văn Doanh',
          position: 'Giám đốc',
          phone: '0901234567',
          email: 'owner@enterprise.com'
        },
        owner: enterpriseOwner._id,
        status: 'active',
        subscriptionPlan: 'premium',
        userLimit: 50,
        features: [
          'user_management',
          'hr_management',
          'finance_management',
          'inventory_management',
          'sales_management',
          'analytics',
          'reports',
          'api_access'
        ],
        settings: {
          currency: 'VND',
          timezone: 'Asia/Ho_Chi_Minh',
          language: 'vi',
          dateFormat: 'DD/MM/YYYY',
          workingHours: {
            start: '08:00',
            end: '17:00'
          },
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        }
      },
      {
        name: 'Công ty Cổ phần Thương mại XYZ',
        code: 'XYZ002',
        businessType: 'Retail',
        taxCode: '0987654321',
        address: {
          street: '456 Đường Lê Lợi',
          city: 'Hà Nội',
          state: 'Hà Nội',
          zipCode: '100000',
          country: 'Vietnam'
        },
        phone: '0912345678',
        email: 'contact@xyz-retail.com',
        website: 'https://xyz-retail.com',
        contactPerson: {
          name: 'Trần Thị Bình',
          position: 'Tổng Giám đốc',
          phone: '0912345678',
          email: 'binh@xyz-retail.com'
        },
        owner: enterpriseOwner._id,
        status: 'active',
        subscriptionPlan: 'basic',
        userLimit: 20,
        features: [
          'user_management',
          'inventory_management',
          'sales_management',
          'reports'
        ],
        settings: {
          currency: 'VND',
          timezone: 'Asia/Ho_Chi_Minh',
          language: 'vi',
          dateFormat: 'DD/MM/YYYY',
          workingHours: {
            start: '08:30',
            end: '17:30'
          },
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        }
      }
    ];

    for (const enterpriseData of sampleEnterprises) {
      const enterprise = new Enterprise(enterpriseData);
      await enterprise.save();
      
      // Add enterprise to owner's enterprises list
      await User.findByIdAndUpdate(
        enterpriseOwner._id,
        { $push: { enterprises: enterprise._id } }
      );
      
      console.log(`✅ Enterprise "${enterprise.name}" created`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Default accounts created:');
    console.log('┌─────────────────────┬─────────────────────────┬─────────────────┐');
    console.log('│ Role                │ Email                   │ Password        │');
    console.log('├─────────────────────┼─────────────────────────┼─────────────────┤');
    console.log('│ Super Admin         │ superadmin@system.com   │ SuperAdmin123!  │');
    console.log('│ System Admin        │ admin@system.com        │ Admin123!       │');
    console.log('│ Enterprise Owner    │ owner@enterprise.com    │ Owner123!       │');
    console.log('│ Manager             │ manager@enterprise.com  │ Manager123!     │');
    console.log('│ Employee            │ employee@enterprise.com │ Employee123!    │');
    console.log('└─────────────────────┴─────────────────────────┴─────────────────┘');
    console.log('\n🚀 You can now start the server with: npm run dev');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await seedData();
    console.log('\n✅ Seeding process completed successfully');
  } catch (error) {
    console.error('\n❌ Seeding process failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Database connection closed');
    process.exit(0);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

// Run the seeding process
if (require.main === module) {
  main();
}

module.exports = { seedData, connectDB };
