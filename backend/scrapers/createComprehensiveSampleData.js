const mongoose = require('mongoose');
require('dotenv').config();

// All 54 African countries with major companies
const africanCountries = [
  {
    name: 'South Africa',
    companies: ['Naspers', 'Standard Bank', 'MTN Group', 'Sasol', 'Shoprite Holdings'],
    currency: 'ZAR',
    cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth']
  },
  {
    name: 'Nigeria',
    companies: ['Dangote Group', 'MTN Nigeria', 'Guaranty Trust Bank', 'First Bank', 'Zenith Bank'],
    currency: 'NGN',
    cities: ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt']
  },
  {
    name: 'Kenya',
    companies: ['Safaricom', 'Equity Bank', 'Kenya Airways', 'KCB Group', 'East African Breweries'],
    currency: 'KES',
    cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret']
  },
  {
    name: 'Egypt',
    companies: ['Orascom Construction', 'CIB', 'Telecom Egypt', 'Egyptian Exchange', 'Ezz Steel'],
    currency: 'EGP',
    cities: ['Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said']
  },
  {
    name: 'Ghana',
    companies: ['Ghana Commercial Bank', 'MTN Ghana', 'Tullow Oil', 'Newmont Mining', 'Gold Fields Ghana'],
    currency: 'GHS',
    cities: ['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Ashiaman']
  },
  {
    name: 'Algeria',
    companies: ['Sonatrach', 'Algerie Telecom', 'Bank of Algeria', 'CEVITAL', 'Naftal'],
    currency: 'DZD',
    cities: ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida']
  },
  {
    name: 'Morocco',
    companies: ['OCP Group', 'Maroc Telecom', 'Attijariwafa Bank', 'BMCE Bank', 'LafargeHolcim Morocco'],
    currency: 'MAD',
    cities: ['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier']
  },
  {
    name: 'Ethiopia',
    companies: ['Ethiopian Airlines', 'Ethio Telecom', 'Commercial Bank of Ethiopia', 'Mekelle University', 'Hawassa University'],
    currency: 'ETB',
    cities: ['Addis Ababa', 'Dire Dawa', 'Mekelle', 'Bahir Dar', 'Gondar']
  },
  {
    name: 'Tanzania',
    companies: ['Vodacom Tanzania', 'CRDB Bank', 'NMB Bank', 'Tigo Tanzania', 'Airtel Tanzania'],
    currency: 'TZS',
    cities: ['Dar es Salaam', 'Dodoma', 'Mwanza', 'Arusha', 'Mbeya']
  },
  {
    name: 'Angola',
    companies: ['Sonangol', 'Unitel', 'BFA', 'Banco de Poupança e Crédito', 'Banco Millennium'],
    currency: 'AOA',
    cities: ['Luanda', 'Huambo', 'Lubango', 'Kuito', 'Malanje']
  },
  {
    name: 'Uganda',
    companies: ['MTN Uganda', 'Airtel Uganda', 'Stanbic Bank', 'Centenary Bank', 'DFCU Bank'],
    currency: 'UGX',
    cities: ['Kampala', 'Gulu', 'Lira', 'Mbarara', 'Jinja']
  },
  {
    name: 'Sudan',
    companies: ['Sudan Telecom', 'Bank of Sudan', 'Kenana Sugar', 'GIAD', 'DAL Group'],
    currency: 'SDG',
    cities: ['Khartoum', 'Omdurman', 'Nyala', 'Port Sudan', 'Kassala']
  },
  {
    name: 'Libya',
    companies: ['Libyan National Oil', 'Libyan Telecom', 'Bank of Commerce', 'Libyan Iron & Steel', 'Libyan Cement'],
    currency: 'LYD',
    cities: ['Tripoli', 'Benghazi', 'Misrata', 'Zawiya', 'Bayda']
  },
  {
    name: 'Mozambique',
    companies: ['Vodacom Mozambique', 'BIM', 'Standard Bank Mozambique', 'Total Mozambique', 'Mozal'],
    currency: 'MZN',
    cities: ['Maputo', 'Matola', 'Nampula', 'Beira', 'Chimoio']
  },
  {
    name: 'DR Congo',
    companies: ['Vodacom DRC', 'Airtel DRC', 'Rawbank', 'BCDC', 'Mining Company Katanga'],
    currency: 'CDF',
    cities: ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Kisangani', 'Bukavu']
  },
  {
    name: 'Cameroon',
    companies: ['Cameroon Telecom', 'MTN Cameroon', 'Orange Cameroon', 'BICEC', 'SCB'],
    currency: 'XAF',
    cities: ['Douala', 'Yaoundé', 'Garoua', 'Kousséri', 'Bamenda']
  },
  {
    name: 'Côte d\'Ivoire',
    companies: ['MTN Côte d\'Ivoire', 'Orange Côte d\'Ivoire', 'SIB', 'BIAO-CI', 'NSIA Banque'],
    currency: 'XOF',
    cities: ['Abidjan', 'Yamoussoukro', 'Bouaké', 'Daloa', 'San Pedro']
  },
  {
    name: 'Niger',
    companies: ['Sonitel', 'Airtel Niger', 'Orange Niger', 'BIAO Niger', 'Ecobank Niger'],
    currency: 'XOF',
    cities: ['Niamey', 'Zinder', 'Maradi', 'Agadez', 'Tahoua']
  },
  {
    name: 'Burkina Faso',
    companies: ['Orange Burkina', 'MTN Burkina', 'BIAO Burkina', 'Ecobank Burkina', 'Bank of Africa'],
    currency: 'XOF',
    cities: ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Ouahigouya', 'Banfora']
  },
  {
    name: 'Mali',
    companies: ['Orange Mali', 'Malitel', 'BIAO Mali', 'Ecobank Mali', 'BNDA'],
    currency: 'XOF',
    cities: ['Bamako', 'Sikasso', 'Mopti', 'Koutiala', 'Ségou']
  },
  {
    name: 'Chad',
    companies: ['Airtel Chad', 'Tigo Chad', 'BIAO Chad', 'Ecobank Chad', 'SHT'],
    currency: 'XAF',
    cities: ['N\'Djamena', 'Moundou', 'Sarh', 'Abéché', 'Doba']
  },
  {
    name: 'Senegal',
    companies: ['Orange Senegal', 'Tigo Senegal', 'Expresso', 'BIAO Senegal', 'Ecobank Senegal'],
    currency: 'XOF',
    cities: ['Dakar', 'Touba', 'Thiès', 'Kaolack', 'Saint-Louis']
  },
  {
    name: 'Guinea',
    companies: ['Orange Guinea', 'MTN Guinea', 'BIAO Guinea', 'Ecobank Guinea', 'BSIC'],
    currency: 'GNF',
    cities: ['Conakry', 'Nzérékoré', 'Kankan', 'Kindia', 'Boké']
  },
  {
    name: 'Rwanda',
    companies: ['MTN Rwanda', 'Airtel Rwanda', 'Bank of Kigali', 'BPR', 'COGEBANQUE'],
    currency: 'RWF',
    cities: ['Kigali', 'Gitarama', 'Ruhengeri', 'Musanze', 'Gisenyi']
  },
  {
    name: 'Benin',
    companies: ['MTN Benin', 'Moov Benin', 'BIAO Benin', 'Ecobank Benin', 'BOA Benin'],
    currency: 'XOF',
    cities: ['Porto-Novo', 'Cotonou', 'Parakou', 'Djougou', 'Abomey-Calavi']
  },
  {
    name: 'Burundi',
    companies: ['MTN Burundi', 'Airtel Burundi', 'BIAO Burundi', 'Ecobank Burundi', 'BNDE'],
    currency: 'BIF',
    cities: ['Bujumbura', 'Gitega', 'Ngozi', 'Rumonge', 'Kayanza']
  },
  {
    name: 'Togo',
    companies: ['Togocel', 'Moov Togo', 'BIAO Togo', 'Ecobank Togo', 'BOA Togo'],
    currency: 'XOF',
    cities: ['Lomé', 'Sokodé', 'Kara', 'Kpalimé', 'Atakpamé']
  },
  {
    name: 'Sierra Leone',
    companies: ['Airtel Sierra Leone', 'Orange Sierra Leone', 'Ecobank Sierra Leone', 'Rokel Commercial Bank', 'Standard Chartered Sierra Leone'],
    currency: 'SLL',
    cities: ['Freetown', 'Bo', 'Kenema', 'Makeni', 'Koidu']
  },
  {
    name: 'Somalia',
    companies: ['Telesom', 'Hormuud Telecom', 'Golis', 'Somtel', 'Somalia Bank'],
    currency: 'SOS',
    cities: ['Mogadishu', 'Hargeisa', 'Bosaso', 'Kismayo', 'Garowe']
  },
  {
    name: 'Zambia',
    companies: ['MTN Zambia', 'Airtel Zambia', 'Zamtel', 'Zanaco', 'Standard Chartered Zambia'],
    currency: 'ZMW',
    cities: ['Lusaka', 'Kitwe', 'Ndola', 'Kabwe', 'Chingola']
  },
  {
    name: 'Malawi',
    companies: ['Airtel Malawi', 'TNM', 'National Bank of Malawi', 'Standard Bank Malawi', 'FDH Bank'],
    currency: 'MWK',
    cities: ['Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Kasungu']
  },
  {
    name: 'Madagascar',
    companies: ['Telma', 'Orange Madagascar', 'Airtel Madagascar', 'BNI Madagascar', 'BFV-SG'],
    currency: 'MGA',
    cities: ['Antananarivo', 'Toamasina', 'Antsirabe', 'Mahajanga', 'Fianarantsoa']
  },
  {
    name: 'Zimbabwe',
    companies: ['Econet Wireless', 'NetOne', 'Telecel Zimbabwe', 'CBZ Bank', 'Steward Bank'],
    currency: 'ZWL',
    cities: ['Harare', 'Bulawayo', 'Chitungwiza', 'Mutare', 'Gweru']
  },
  {
    name: 'Botswana',
    companies: ['Botswana Telecommunications', 'Mobile Telephone Network', 'Barclays Bank Botswana', 'First National Bank Botswana', 'Bank Gaborone'],
    currency: 'BWP',
    cities: ['Gaborone', 'Francistown', 'Molepolole', 'Maun', 'Serowe']
  },
  {
    name: 'Namibia',
    companies: ['MTC Namibia', 'Telecom Namibia', 'Bank Windhoek', 'First National Bank Namibia', 'Standard Bank Namibia'],
    currency: 'NAD',
    cities: ['Windhoek', 'Swakopmund', 'Walvis Bay', 'Oshakati', 'Rundu']
  },
  {
    name: 'Eswatini',
    companies: ['MTN Eswatini', 'Eswatini Mobile', 'Standard Bank Eswatini', 'First National Bank Eswatini', 'Nedbank Eswatini'],
    currency: 'SZL',
    cities: ['Mbabane', 'Manzini', 'Lobamba', 'Siteki', 'Piggs Peak']
  },
  {
    name: 'Lesotho',
    companies: ['Econet Lesotho', 'Vodacom Lesotho', 'Standard Bank Lesotho', 'First National Bank Lesotho', 'Nedbank Lesotho'],
    currency: 'LSL',
    cities: ['Maseru', 'Teyateyaneng', 'Mafeteng', 'Mohale\'s Hoek', 'Quthing']
  },
  {
    name: 'Mauritius',
    companies: ['MTN Mauritius', 'Orange Mauritius', 'MCB', 'HSBC Mauritius', 'Barclays Mauritius'],
    currency: 'MUR',
    cities: ['Port Louis', 'Curepipe', 'Quatre Bornes', 'Vacoas', 'Phoenix']
  },
  {
    name: 'Seychelles',
    companies: ['Airtel Seychelles', 'Cable & Wireless Seychelles', 'Bank of Seychelles', 'MCB Seychelles', 'NBS Seychelles'],
    currency: 'SCR',
    cities: ['Victoria', 'Anse Royale', 'Beau Vallon', 'Takamaka', 'La Digue']
  },
  {
    name: 'Gabon',
    companies: ['Gabon Telecom', 'Airtel Gabon', 'BGFIBank', 'UGB', 'Ecobank Gabon'],
    currency: 'XAF',
    cities: ['Libreville', 'Port-Gentil', 'Franceville', 'Oyem', 'Moanda']
  },
  {
    name: 'Equatorial Guinea',
    companies: ['GETESA', 'Muni', 'BGE', 'CCEI Bank', 'BANGE'],
    currency: 'XAF',
    cities: ['Malabo', 'Bata', 'Ebebiyin', 'Aconibe', 'Anisoc']
  },
  {
    name: 'Congo',
    companies: ['Congo Telecom', 'MTN Congo', 'Brazaville Telecom', 'BIAO Congo', 'Ecobank Congo'],
    currency: 'XAF',
    cities: ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Owando']
  },
  {
    name: 'Central African Republic',
    companies: ['Moov CAR', 'Orange CAR', 'BIAO CAR', 'Ecobank CAR', 'BEAC'],
    currency: 'XAF',
    cities: ['Bangui', 'Bimbo', 'Berbérati', 'Carnot', 'Bouar']
  },
  {
    name: 'South Sudan',
    companies: ['Zain South Sudan', 'MTN South Sudan', 'BIAO South Sudan', 'Ecobank South Sudan', 'Kenya Commercial Bank South Sudan'],
    currency: 'SSP',
    cities: ['Juba', 'Wau', 'Malakal', 'Aweil', 'Yei']
  },
  {
    name: 'Gambia',
    companies: ['Africell Gambia', 'Gamcel', 'QCell', 'Trust Bank Gambia', 'Standard Chartered Gambia'],
    currency: 'GMD',
    cities: ['Banjul', 'Serekunda', 'Brikama', 'Bakau', 'Lamin']
  },
  {
    name: 'Guinea-Bissau',
    companies: ['MTN Guinea-Bissau', 'Orange Bissau', 'BIAO Guinea-Bissau', 'Ecobank Guinea-Bissau', 'BAI'],
    currency: 'XOF',
    cities: ['Bissau', 'Bafatá', 'Gabú', 'Bissorã', 'Cacheu']
  },
  {
    name: 'Cabo Verde',
    companies: ['Cabo Verde Telecom', 'Unitel T+', 'Banco Cabo Verde', 'Caixa Económica', 'BCE'],
    currency: 'CVE',
    cities: ['Praia', 'Mindelo', 'Santa Maria', 'Assomada', 'Tarrafal']
  },
  {
    name: 'Comoros',
    companies: ['Comores Telecom', 'Huri', 'BIAO Comores', 'Exim Bank Comores', 'Banque Fédérale'],
    currency: 'KMF',
    cities: ['Moroni', 'Moutsamoudou', 'Fomboni', 'Domoni', 'Mitsamiouli']
  },
  {
    name: 'Mauritania',
    companies: ['Mauritel', 'Chinguitel', 'BIAO Mauritania', 'Ecobank Mauritania', 'BAMIS'],
    currency: 'MRU',
    cities: ['Nouakchott', 'Nouadhibou', 'Kaédi', 'Rosso', 'Atar']
  },
  {
    name: 'Djibouti',
    companies: ['Djibouti Telecom', 'Evatis', 'BIAO Djibouti', 'Ecobank Djibouti', 'Salaam Bank'],
    currency: 'DJF',
    cities: ['Djibouti', 'Ali Sabieh', 'Tadjourah', 'Obock', 'Dikhil']
  },
  {
    name: 'Eritrea',
    companies: ['EriTel', 'Commercial Bank of Eritrea', 'Housing and Commerce Bank', 'Eritrean Investment Bank', 'Development Bank'],
    currency: 'ERN',
    cities: ['Asmara', 'Keren', 'Massawa', 'Mendefera', 'Barentu']
  },
  {
    name: 'São Tomé and Príncipe',
    companies: ['CST', 'Unitel STP', 'BIAO STP', 'Ecobank STP', 'BISTP'],
    currency: 'STN',
    cities: ['São Tomé', 'Santo António', 'Trindade', 'Neves', 'Guadalupe']
  }
];

// Job titles and skills
const jobTitles = [
  'Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'DevOps Engineer',
  'Mobile Developer', 'Backend Developer', 'Frontend Developer', 'Full Stack Developer', 'Cloud Architect',
  'Cybersecurity Analyst', 'Machine Learning Engineer', 'AI Research Scientist', 'Blockchain Developer', 'Game Developer',
  'Database Administrator', 'Network Engineer', 'Systems Administrator', 'IT Manager', 'Technical Lead',
  'QA Engineer', 'Test Engineer', 'Automation Engineer', 'Security Engineer', 'Performance Engineer'
];

const skills = [
  ['Python', 'JavaScript', 'React', 'Node.js', 'AWS'],
  ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Docker'],
  ['React Native', 'Flutter', 'TypeScript', 'Mobile Development', 'Firebase'],
  ['Machine Learning', 'TensorFlow', 'PyTorch', 'Data Science', 'Python'],
  ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes'],
  ['Cybersecurity', 'Network Security', 'Penetration Testing', 'SIEM', 'Risk Assessment'],
  ['Blockchain', 'Solidity', 'Web3.js', 'Ethereum', 'Smart Contracts'],
  ['UI Design', 'UX Research', 'Figma', 'Adobe XD', 'Prototyping'],
  ['DevOps', 'CI/CD', 'Jenkins', 'GitLab', 'Docker'],
  ['Data Analysis', 'SQL', 'Excel', 'Tableau', 'Power BI']
];

const jobTypes = ['full-time', 'contract', 'part-time', 'internship', 'freelance'];
const seniorityLevels = ['junior', 'mid-level', 'senior', 'lead', 'architect', 'manager'];

// Generate salary ranges based on currency
function getSalaryRange(currency) {
  const ranges = {
    'ZAR': { min: 300000, max: 2000000 },
    'NGN': { min: 2000000, max: 15000000 },
    'KES': { min: 800000, max: 6000000 },
    'EGP': { min: 15000, max: 100000 },
    'GHS': { min: 50000, max: 400000 },
    'DZD': { min: 80000, max: 600000 },
    'MAD': { min: 8000, max: 60000 },
    'ETB': { min: 15000, max: 120000 },
    'TZS': { min: 1500000, max: 12000000 },
    'AOA': { min: 500000, max: 4000000 },
    'UGX': { min: 1500000, max: 12000000 },
    'SDG': { min: 50000, max: 400000 },
    'LYD': { min: 2000, max: 15000 },
    'MZN': { min: 40000, max: 300000 },
    'CDF': { min: 200000, max: 1500000 },
    'XAF': { min: 200000, max: 1500000 },
    'XOF': { min: 200000, max: 1500000 },
    'RWF': { min: 500000, max: 4000000 },
    'GNF': { min: 5000000, max: 40000000 },
    'BIF': { min: 500000, max: 4000000 },
    'SLL': { min: 2000000, max: 15000000 },
    'SOS': { min: 200000, max: 1500000 },
    'ZMW': { min: 20000, max: 150000 },
    'MWK': { min: 500000, max: 4000000 },
    'MGA': { min: 2000000, max: 15000000 },
    'ZWL': { min: 500000, max: 4000000 },
    'BWP': { min: 8000, max: 60000 },
    'NAD': { min: 8000, max: 60000 },
    'SZL': { min: 8000, max: 60000 },
    'LSL': { min: 8000, max: 60000 },
    'MUR': { min: 30000, max: 250000 },
    'SCR': { min: 30000, max: 250000 },
    'SSP': { min: 50000, max: 400000 },
    'GMD': { min: 30000, max: 250000 },
    'MRU': { min: 20000, max: 150000 },
    'DJF': { min: 100000, max: 800000 },
    'ERN': { min: 100000, max: 800000 },
    'STN': { min: 5000, max: 40000 },
    'KMF': { min: 200000, max: 1500000 },
    'CVE': { min: 50000, max: 400000 }
  };
  
  const range = ranges[currency] || ranges['XAF'];
  return {
    min: Math.floor(Math.random() * (range.max - range.min) + range.min),
    max: Math.floor(Math.random() * (range.max - range.min) + range.min)
  };
}

// Generate comprehensive sample data
async function createComprehensiveSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/african_job_market');
    console.log('✅ Connected to MongoDB');

    // Get Job model
    const Job = require('../models/Job');
    
    // Clear existing jobs
    await Job.deleteMany({});
    console.log('🗑️ Cleared all existing jobs');

    const allJobs = [];
    
    // Generate jobs for each country
    for (const country of africanCountries) {
      console.log(`🌍 Generating jobs for ${country.name}...`);
      
      for (const company of country.companies) {
        for (let i = 0; i < 10; i++) {
          const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
          const jobSkills = skills[Math.floor(Math.random() * skills.length)];
          const salaryRange = getSalaryRange(country.currency);
          const city = country.cities[Math.floor(Math.random() * country.cities.length)];
          
          // Generate random date within last 30 days
          const daysAgo = Math.floor(Math.random() * 30);
          const postedDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
          
          const job = {
            jobTitle,
            company,
            country: country.name,
            city,
            salaryMin: Math.min(salaryRange.min, salaryRange.max),
            salaryMax: Math.max(salaryRange.min, salaryRange.max),
            currency: country.currency,
            skills: jobSkills,
            jobDescription: `${jobTitle} position at ${company} in ${city}. Looking for experienced professionals with expertise in ${jobSkills.slice(0, 3).join(', ')}.`,
            jobUrl: `https://example.com/jobs/${company.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
            postedDate,
            jobType: jobTypes[Math.floor(Math.random() * jobTypes.length)],
            seniorityLevel: seniorityLevels[Math.floor(Math.random() * seniorityLevels.length)],
            experienceRequired: `${Math.floor(Math.random() * 5) + 1}+ years experience`,
            educationRequired: ['High School', 'Bachelor degree', 'Masters degree', 'PhD'][Math.floor(Math.random() * 4)],
            applicationDeadline: Math.random() > 0.5 ? new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) : null,
            remote: Math.random() > 0.6,
            source: ['adzuna', 'linkedin', 'glassdoor'][Math.floor(Math.random() * 3)],
            scrapedAt: new Date(),
            isActive: true
          };
          
          allJobs.push(job);
        }
      }
    }
    
    // Insert all jobs in batches
    const batchSize = 100;
    for (let i = 0; i < allJobs.length; i += batchSize) {
      const batch = allJobs.slice(i, i + batchSize);
      await Job.insertMany(batch);
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allJobs.length / batchSize)} (${batch.length} jobs)`);
    }
    
    console.log(`🎉 Successfully created ${allJobs.length} comprehensive sample jobs!`);
    console.log(`📊 Data Summary:`);
    console.log(`   - Countries: ${africanCountries.length}`);
    console.log(`   - Companies: ${africanCountries.length * 5}`);
    console.log(`   - Jobs per company: 10`);
    console.log(`   - Total jobs: ${allJobs.length}`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Closed MongoDB connection');

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  }
}

createComprehensiveSampleData();
