// Mock data layer for EstateFlow Real Estate CRM Dashboard
// Clean structured mock data that gracefully complements live API responses

export const mockDashboardStats = {
  activeLeads: {
    value: 18,
    change: '+18.4%',
    isPositive: true,
    description: 'vs last month',
  },
  activeListings: {
    value: 12,
    change: '+8.2%',
    isPositive: true,
    description: '8 available now',
  },
  pipelineValue: {
    value: '₹4.82 Cr',
    change: '+12.5%',
    isPositive: true,
    description: '24 open deals',
  },
  grossRevenue: {
    value: '₹1.45 Cr',
    change: '+24.5%',
    isPositive: true,
    description: 'H1 target on track',
  },
  dealsClosed: {
    value: 8,
    change: '+12.0%',
    isPositive: true,
    description: 'Avg closing: 18 days',
  }
};

export const mockRevenueData = [
  { month: 'Jan', revenue2026: 4200000, revenue2025: 3500000, deals: 4 },
  { month: 'Feb', revenue2026: 6100000, revenue2025: 4800000, deals: 6 },
  { month: 'Mar', revenue2026: 5800000, revenue2025: 5200000, deals: 5 },
  { month: 'Apr', revenue2026: 8600000, revenue2025: 6900000, deals: 7 },
  { month: 'May', revenue2026: 11200000, revenue2025: 8400000, deals: 9 },
  { month: 'Jun', revenue2026: 14500000, revenue2025: 10500000, deals: 11 },
];

export const mockMarketTrends = [
  { period: 'Q1', y2025: 280000, y2026: 260000 },
  { period: 'Q2', y2025: 310000, y2026: 290000 },
  { period: 'Q3', y2025: 330000, y2026: 300000 },
  { period: 'Q4', y2025: 350000, y2026: 350000 },
];

export const mockMarketSummary = {
  avg2025: '₹350,875',
  avg2026: '₹290,475',
  trendText: 'Stabilizing inventory demand in luxury micro-markets',
  yoyDelta: '+14.2% YoY Demand'
};

export const mockOccupancyData = [
  { name: 'Rented', value: 62, count: 46, color: '#8b5cf6' },
  { name: 'Maintenance', value: 25, count: 18, color: '#f59e0b' },
  { name: 'Vacant', value: 13, count: 10, color: '#10b981' },
];

export const mockFeaturedProperties = [
  {
    id: 'prop-1',
    title: 'Azure Horizon Villa',
    location: 'Malibu / Sea Facing',
    price: '₹5.4 L/mo',
    rawPrice: 540000,
    specs: '4 BHK • 4,200 sq.ft',
    status: 'Under Offer',
    statusColor: 'amber',
    imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    type: 'Luxury Villa'
  },
  {
    id: 'prop-2',
    title: 'The Cedar Pavilion',
    location: 'Aspen Hills / Mountain Ridge',
    price: '₹4.8 L/mo',
    rawPrice: 480000,
    specs: '3 BHK • 3,100 sq.ft',
    status: 'Under Offer',
    statusColor: 'amber',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    type: 'Alpine Estate'
  },
  {
    id: 'prop-3',
    title: 'Metropolitan Edge Penthouse',
    location: 'Brooklyn Heights / Skyline View',
    price: '₹3.2 L/mo',
    rawPrice: 320000,
    specs: '2 BHK • 2,450 sq.ft',
    status: 'Rented',
    statusColor: 'purple',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    type: 'Penthouse'
  },
  {
    id: 'prop-4',
    title: 'Skyline Luxury Residency',
    location: 'Golf Course Road, Gurgaon',
    price: '₹1.2 Cr',
    rawPrice: 12000000,
    specs: '3 BHK • 2,200 sq.ft',
    status: 'Available',
    statusColor: 'emerald',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    type: 'High-Rise Condo'
  },
];

export const mockTopAgents = [
  {
    id: 'agent-1',
    name: 'Emily Gray',
    role: 'Principal Partner',
    revenue: '₹42.1L',
    badge: 'Top Performer',
    dealsClosed: 9,
    projectedDeals: 12,
    progress: 88,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 'agent-2',
    name: 'Bruce Walker',
    role: 'Senior Broker',
    revenue: '₹24.2L',
    badge: 'Consistent Closer',
    dealsClosed: 6,
    projectedDeals: 8,
    progress: 75,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 'agent-3',
    name: 'Rahul Sharma',
    role: 'Luxury Specialist',
    revenue: '₹21.8L',
    badge: 'Rising Star',
    dealsClosed: 5,
    projectedDeals: 7,
    progress: 68,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 'agent-4',
    name: 'Priya Mehta',
    role: 'Commercial Lead',
    revenue: '₹18.4L',
    badge: 'High Conversion',
    dealsClosed: 4,
    projectedDeals: 6,
    progress: 62,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
  }
];

export const mockTodaysTasks = [
  {
    id: 'task-1',
    time: '10:30 AM',
    title: 'Call Rajesh Mehra',
    type: 'Call',
    badge: 'Hot Lead',
    badgeColor: 'rose',
    detail: '3 BHK • ₹1.2 Cr Budget',
    completed: false,
  },
  {
    id: 'task-2',
    time: '12:00 PM',
    title: 'Site Visit — Skyline Residency',
    type: 'Visit',
    badge: 'In Person',
    badgeColor: 'purple',
    detail: 'Client: Priya Kapoor • Unit 14B',
    completed: false,
  },
  {
    id: 'task-3',
    time: '02:30 PM',
    title: 'Send Sales Agreement Draft',
    type: 'Document',
    badge: 'Deal Closing',
    badgeColor: 'blue',
    detail: 'Amit Verma • Metro Heights',
    completed: false,
  },
  {
    id: 'task-4',
    time: '04:00 PM',
    title: 'Follow Up on Counter Offer',
    type: 'Follow-up',
    badge: 'Negotiation',
    badgeColor: 'amber',
    detail: 'Neha Singh • Green Valley Villa',
    completed: true,
  }
];

export const mockConversionFunnel = [
  { stage: 'New Leads', count: 42, rate: '100%', color: '#8b5cf6' },
  { stage: 'Contacted', count: 31, rate: '73.8%', color: '#7c3aed' },
  { stage: 'Qualified', count: 22, rate: '52.3%', color: '#6d28d9' },
  { stage: 'Site Visits', count: 14, rate: '33.3%', color: '#4f46e5' },
  { stage: 'Negotiation', count: 9, rate: '21.4%', color: '#2563eb' },
  { stage: 'Closed Won', count: 6, rate: '14.2%', color: '#10b981' },
];

export const mockHotLeads = [
  {
    id: 'hl-1',
    name: 'Rajesh Mehra',
    temp: 'Hot 🔥',
    budget: '₹1.2 Cr',
    property: '3 BHK Skyline Residency',
    nextAction: 'Site Visit Tomorrow',
    phone: '+91 98110 44210',
    avatarLetter: 'R'
  },
  {
    id: 'hl-2',
    name: 'Priya Kapoor',
    temp: 'Very Hot 🔥🔥',
    budget: '₹2.4 Cr',
    property: 'Green Valley Luxury Villa',
    nextAction: 'Negotiation Stage',
    phone: '+91 98722 19830',
    avatarLetter: 'P'
  },
  {
    id: 'hl-3',
    name: 'Amit Verma',
    temp: 'Hot 🔥',
    budget: '₹85 L',
    property: '2 BHK Metro Heights',
    nextAction: 'Follow-up Today 4 PM',
    phone: '+91 99201 55642',
    avatarLetter: 'A'
  }
];

export const mockLiveActivities = [
  {
    id: 'act-1',
    type: 'Lead',
    title: 'New lead recorded: Rajesh Mehra',
    time: '10 mins ago',
    tag: 'Lead',
    link: '/leads'
  },
  {
    id: 'act-2',
    type: 'Property',
    title: 'Property listing status updated to "Under Offer"',
    time: '1 hour ago',
    tag: 'Property',
    link: '/properties'
  },
  {
    id: 'act-3',
    type: 'Deal',
    title: 'Deal stage updated to Agreement draft',
    time: '3 hours ago',
    tag: 'Deal',
    link: '/deals'
  },
  {
    id: 'act-4',
    type: 'Visit',
    title: 'Site visit scheduled with Client Priya Kapoor',
    time: '5 hours ago',
    tag: 'Visit',
    link: '/leads'
  },
  {
    id: 'act-5',
    type: 'Client',
    title: 'KYC & token payment confirmed for Amit Verma',
    time: '6 hours ago',
    tag: 'Payment',
    link: '/clients'
  }
];
