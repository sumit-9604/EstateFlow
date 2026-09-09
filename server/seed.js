require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Client = require('./models/Client');
const Property = require('./models/Property');
const Lead = require('./models/Lead');
const Deal = require('./models/Deal');

const seedDatabase = async () => {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected successfully.');

        // Clean existing collections
        console.log('Clearing old collections...');
        await Promise.all([
            User.deleteMany({}),
            Client.deleteMany({}),
            Property.deleteMany({}),
            Lead.deleteMany({}),
            Deal.deleteMany({})
        ]);
        console.log('Cleared existing data.');

        // 1. Create Team Users
        console.log('Seeding team members...');
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);
        const managerPassword = await bcrypt.hash('manager123', salt);
        const agentPassword = await bcrypt.hash('agent123', salt);

        const users = await User.insertMany([
            {
                name: 'Sumit Sharma',
                email: 'admin@estateflow.com',
                password: adminPassword,
                role: 'Admin'
            },
            {
                name: 'Priya Nair',
                email: 'priya.nair@estateflow.com',
                password: managerPassword,
                role: 'Manager'
            },
            {
                name: 'Rohit Verma',
                email: 'rohit.verma@estateflow.com',
                password: agentPassword,
                role: 'Agent'
            },
            {
                name: 'Ananya Deshmukh',
                email: 'ananya.deshmukh@estateflow.com',
                password: agentPassword,
                role: 'Agent'
            },
            {
                name: 'Kabir Singh',
                email: 'kabir.singh@estateflow.com',
                password: agentPassword,
                role: 'Agent'
            }
        ]);
        console.log(`Created ${users.length} team members.`);

        const [admin, manager, agent1, agent2, agent3] = users;

        // 2. Create Clients
        console.log('Seeding clients...');
        const clients = await Client.insertMany([
            {
                name: 'Vikramaditya Singhania',
                email: 'vikram.singhania@gmail.com',
                phone: '+91 98112 34567',
                type: 'Buyer',
                preferences: {
                    budget: 30000000,
                    location: 'Golf Course Road, Gurgaon',
                    propertyType: 'Penthouse / 4BHK'
                },
                assignedAgent: agent1._id,
                interactionHistory: [
                    {
                        date: new Date(Date.now() - 2 * 86400000),
                        note: 'Completed physical walkthrough of DLF Phase 5 penthouse. Client showed strong enthusiasm for the terrace garden.',
                        interactionType: 'Visit'
                    },
                    {
                        date: new Date(Date.now() - 5 * 86400000),
                        note: 'Discussed payment milestones and verified bank pre-sanction letter for ₹2.5Cr.',
                        interactionType: 'Call'
                    }
                ]
            },
            {
                name: 'Dr. Sunita Kulkarni',
                email: 'sunita.kulkarni@apollo.org',
                phone: '+91 98220 89100',
                type: 'Buyer',
                preferences: {
                    budget: 48000000,
                    location: 'Worli, Mumbai',
                    propertyType: 'Sea Facing Apartment'
                },
                assignedAgent: agent2._id,
                interactionHistory: [
                    {
                        date: new Date(Date.now() - 1 * 86400000),
                        note: 'Agreement draft reviewed by legal counsel. Token amount transfer scheduled for Monday.',
                        interactionType: 'Visit'
                    },
                    {
                        date: new Date(Date.now() - 8 * 86400000),
                        note: 'Shared architectural floor plans and sunset orientation photos.',
                        interactionType: 'Email'
                    }
                ]
            },
            {
                name: 'Rajesh Mehra',
                email: 'rajesh.mehra@techcorp.in',
                phone: '+91 98450 12345',
                type: 'Seller',
                preferences: {
                    budget: 35000000,
                    location: 'Whitefield, Bangalore',
                    propertyType: 'Gated Villa'
                },
                assignedAgent: agent1._id,
                interactionHistory: [
                    {
                        date: new Date(Date.now() - 3 * 86400000),
                        note: 'Finalized sale deed registration with buyer Dr. Anand. Keys handed over.',
                        interactionType: 'Visit'
                    }
                ]
            },
            {
                name: 'Meera Chawla',
                email: 'meera.chawla@venturecap.com',
                phone: '+91 99100 88221',
                type: 'Buyer',
                preferences: {
                    budget: 70000000,
                    location: 'Financial District, Hyderabad',
                    propertyType: 'Commercial Grade-A Office'
                },
                assignedAgent: agent3._id,
                interactionHistory: [
                    {
                        date: new Date(Date.now() - 4 * 86400000),
                        note: 'Site visit with facility manager. Evaluating 9-year rental lease model.',
                        interactionType: 'Visit'
                    }
                ]
            },
            {
                name: 'Arjun Oberoi',
                email: 'arjun.oberoi@oberoigroup.co',
                phone: '+91 97111 65432',
                type: 'Buyer',
                preferences: {
                    budget: 40000000,
                    location: 'Civil Lines, Jaipur',
                    propertyType: 'Heritage Bungalow'
                },
                assignedAgent: agent2._id,
                interactionHistory: [
                    {
                        date: new Date(Date.now() - 2 * 86400000),
                        note: 'Submitted formal written offer of ₹3.75Cr. Seller verbal consent received.',
                        interactionType: 'Call'
                    }
                ]
            },
            {
                name: 'Kavita Jindal',
                email: 'kavita.jindal@gmail.com',
                phone: '+91 98109 43210',
                type: 'Seller',
                preferences: {
                    budget: 90000000,
                    location: 'Chattarpur, New Delhi',
                    propertyType: 'Farmhouse Acre'
                },
                assignedAgent: manager._id,
                interactionHistory: [
                    {
                        date: new Date(Date.now() - 7 * 86400000),
                        note: 'Exclusive listing mandate signed for 90 days with EstateFlow.',
                        interactionType: 'Visit'
                    }
                ]
            }
        ]);
        console.log(`Created ${clients.length} clients.`);

        // 3. Create Properties
        console.log('Seeding properties...');
        const properties = await Property.insertMany([
            {
                title: 'Skyline Panorama 4BHK Penthouse',
                location: 'Sector 54, Golf Course Road, Gurgaon',
                price: 28000000,
                size: '3,450 sqft',
                amenities: ['Private Elevator', 'Infinity Pool', '3 Covered Parkings', 'Clubhouse', 'Concierge'],
                status: 'Available',
                images: [],
                agent: agent1._id
            },
            {
                title: 'The Bayview Azure Luxury Residence',
                location: 'Worli Sea Face, South Mumbai',
                price: 45000000,
                size: '2,400 sqft',
                amenities: ['Arabian Sea View', 'Italian Marble', 'Smart Automation', 'Gymnasium', 'Valet'],
                status: 'Under Offer',
                images: [],
                agent: agent2._id
            },
            {
                title: 'Greenwood Manor Independent Villa',
                location: 'Prestige Boulevard, Whitefield, Bangalore',
                price: 32000000,
                size: '4,100 sqft',
                amenities: ['Private Lawn', 'Solar Power Backup', 'EV Charging', 'Home Theatre Room'],
                status: 'Sold',
                images: [],
                agent: agent1._id
            },
            {
                title: 'Apex CyberTower Grade-A Commercial Floor',
                location: 'Financial District, Gachibowli, Hyderabad',
                price: 68000000,
                size: '5,600 sqft',
                amenities: ['100% DG Backup', 'High Speed Elevators', 'LEED Gold Certified', 'Central HVAC'],
                status: 'Available',
                images: [],
                agent: agent3._id
            },
            {
                title: 'The Grandeur Golf Course Duplex',
                location: 'Sector 128, Wish Town, Noida',
                price: 19500000,
                size: '2,800 sqft',
                amenities: ['18-Hole Golf View', 'Double Height Living', 'Heated Indoor Pool', 'Spa'],
                status: 'Available',
                images: [],
                agent: agent2._id
            },
            {
                title: 'Royal Palm Green Oasis Farmhouse',
                location: 'Ansal Villas, Chattarpur, New Delhi',
                price: 85000000,
                size: '1.25 Acres',
                amenities: ['Swimming Pool', 'Landscaped Lawns', 'Security Guard Post', 'Gazebo', 'Fruit Orchard'],
                status: 'Available',
                images: [],
                agent: manager._id
            },
            {
                title: 'Heritage Rajputana Courtyard Haveli',
                location: 'Civil Lines, Jaipur',
                price: 37500000,
                size: '4,500 sqft',
                amenities: ['Antique Sandstone Pillars', 'Courtyard Garden', 'Modern Modular Kitchen', 'Bespoke Lighting'],
                status: 'Under Offer',
                images: [],
                agent: agent2._id
            },
            {
                title: 'Metro Luxe Designer Studio Suite',
                location: '100ft Road, Indiranagar, Bangalore',
                price: 8500000,
                size: '850 sqft',
                amenities: ['Fully Furnished', 'Metro Station 200m', 'Rooftop Lounge', 'Biometric Security'],
                status: 'Rented',
                images: [],
                agent: agent3._id
            }
        ]);
        console.log(`Created ${properties.length} properties.`);

        // 4. Create Leads
        console.log('Seeding leads...');
        const leads = await Lead.insertMany([
            {
                name: 'Karan Mehra',
                phone: '+91 98765 43210',
                email: 'karan.mehra@deloitte.com',
                budget: 25000000,
                preferences: '3BHK or 4BHK near Cyber City, Gurgaon',
                status: 'Qualified',
                assignedTo: agent1._id
            },
            {
                name: 'Ananya Roy Chowdhury',
                phone: '+91 98301 22334',
                email: 'ananya.roy@tatamotors.com',
                budget: 45000000,
                preferences: 'Sea facing 3BHK in Worli or Bandra',
                status: 'Contacted',
                assignedTo: agent2._id
            },
            {
                name: 'Siddharth Varma',
                phone: '+91 99400 55667',
                email: 'siddharth@startup.io',
                budget: 18000000,
                preferences: 'Ready to move apartment in Whitefield or Sarjapur',
                status: 'New',
                assignedTo: agent3._id
            },
            {
                name: 'Deepak & Shalini Singhal',
                phone: '+91 98111 88990',
                email: 'singhal.deepak@gmail.com',
                budget: 85000000,
                preferences: '1-2 Acre Farmhouse plot in South Delhi / Mehrauli',
                status: 'Qualified',
                assignedTo: manager._id
            },
            {
                name: 'Harsh Vardhan Bansal',
                phone: '+91 97170 33445',
                email: 'harsh.bansal@bansalsteel.in',
                budget: 65000000,
                preferences: 'Commercial IT space minimum 5000 sqft in Hyderabad',
                status: 'Contacted',
                assignedTo: agent3._id
            },
            {
                name: 'Ritika Sengupta',
                phone: '+91 98200 99881',
                email: 'ritika.s@consultant.com',
                budget: 20000000,
                preferences: 'Noida expressway high-rise golf view property',
                status: 'New',
                assignedTo: agent2._id
            },
            {
                name: 'Vikramaditya Singhania',
                phone: '+91 98112 34567',
                email: 'vikram.singhania@gmail.com',
                budget: 30000000,
                preferences: 'DLF Phase 5 luxury penthouse',
                status: 'Closed',
                assignedTo: agent1._id
            },
            {
                name: 'Dr. Sunita Kulkarni',
                phone: '+91 98220 89100',
                email: 'sunita.kulkarni@apollo.org',
                budget: 48000000,
                preferences: 'Worli Sea Face Luxury 3BHK',
                status: 'Closed',
                assignedTo: agent2._id
            },
            {
                name: 'Amitabh Jha',
                phone: '+91 99880 11223',
                email: 'amitabh.jha@outlook.com',
                budget: 12000000,
                preferences: '2BHK in Central Delhi (Budget mismatch)',
                status: 'Lost',
                assignedTo: agent1._id
            }
        ]);
        console.log(`Created ${leads.length} leads.`);

        // 5. Create Deals
        console.log('Seeding deal pipeline...');
        const deals = await Deal.insertMany([
            {
                client: clients[1]._id, // Dr. Sunita Kulkarni
                property: properties[1]._id, // Worli Azure
                agent: agent2._id,
                finalPrice: 45000000,
                commissionRate: 3.0,
                commissionAmount: 1350000,
                stage: 'Closed',
                documents: [
                    { name: 'Sale_Deed_Signed.pdf', url: '/uploads/sale_deed.pdf' },
                    { name: 'NOC_Society.pdf', url: '/uploads/noc.pdf' }
                ]
            },
            {
                client: clients[2]._id, // Rajesh Mehra
                property: properties[2]._id, // Greenwood Villa Whitefield
                agent: agent1._id,
                finalPrice: 32000000,
                commissionRate: 3.0,
                commissionAmount: 960000,
                stage: 'Closed',
                documents: [
                    { name: 'Possession_Letter.pdf', url: '/uploads/possession.pdf' }
                ]
            },
            {
                client: clients[4]._id, // Arjun Oberoi
                property: properties[6]._id, // Heritage Haveli Jaipur
                agent: agent2._id,
                finalPrice: 37500000,
                commissionRate: 3.0,
                commissionAmount: 1125000,
                stage: 'Agreement',
                documents: [
                    { name: 'MOU_Agreement_Draft.pdf', url: '/uploads/mou.pdf' }
                ]
            },
            {
                client: clients[0]._id, // Vikramaditya Singhania
                property: properties[0]._id, // Skyline Penthouse Gurgaon
                agent: agent1._id,
                finalPrice: 28000000,
                commissionRate: 3.0,
                commissionAmount: 840000,
                stage: 'Negotiation',
                documents: []
            },
            {
                client: clients[3]._id, // Meera Chawla
                property: properties[3]._id, // Apex CyberTower Hyderabad
                agent: agent3._id,
                finalPrice: 68000000,
                commissionRate: 2.5,
                commissionAmount: 1700000,
                stage: 'Negotiation',
                documents: []
            }
        ]);
        console.log(`Created ${deals.length} deals in pipeline.`);

        console.log('\n=============================================');
        console.log('ESTATEFLOW DATABASE SEEDED SUCCESSFULLY!');
        console.log('=============================================');
        console.log('Demo Credentials:');
        console.log('  Admin:   admin@estateflow.com / admin123');
        console.log('  Manager: priya.nair@estateflow.com / manager123');
        console.log('  Agent:   rohit.verma@estateflow.com / agent123');
        console.log('=============================================');

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedDatabase();
