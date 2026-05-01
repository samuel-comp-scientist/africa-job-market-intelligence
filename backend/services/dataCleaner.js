/**
 * Data Cleaning Pipeline Service
 * Normalizes and cleans scraped job data for consistent analytics
 */

class DataCleaner {
  constructor() {
    // Skill normalization mapping
    this.skillMap = {
      // Programming Languages
      'js': 'JavaScript',
      'javascript': 'JavaScript',
      'ts': 'TypeScript',
      'typescript': 'TypeScript',
      'py': 'Python',
      'python': 'Python',
      'java': 'Java',
      'c#': 'C#',
      'csharp': 'C#',
      'c++': 'C++',
      'cpp': 'C++',
      'php': 'PHP',
      'rb': 'Ruby',
      'ruby': 'Ruby',
      'go': 'Go',
      'golang': 'Go',
      'rust': 'Rust',
      'rs': 'Rust',
      'swift': 'Swift',
      'kt': 'Kotlin',
      'kotlin': 'Kotlin',
      'scala': 'Scala',
      'r': 'R',
      'matlab': 'MATLAB',
      
      // Frontend Frameworks
      'react': 'React',
      'reactjs': 'React',
      'react.js': 'React',
      'react native': 'React Native',
      'reactnative': 'React Native',
      'vue': 'Vue.js',
      'vuejs': 'Vue.js',
      'vue.js': 'Vue.js',
      'angular': 'Angular',
      'angularjs': 'Angular',
      'angular.js': 'Angular',
      'svelte': 'Svelte',
      'next': 'Next.js',
      'nextjs': 'Next.js',
      'next.js': 'Next.js',
      'nuxt': 'Nuxt.js',
      'nuxtjs': 'Nuxt.js',
      'nuxt.js': 'Nuxt.js',
      
      // Backend Frameworks
      'node': 'Node.js',
      'nodejs': 'Node.js',
      'node.js': 'Node.js',
      'express': 'Express.js',
      'expressjs': 'Express.js',
      'express.js': 'Express.js',
      'django': 'Django',
      'flask': 'Flask',
      'spring': 'Spring Boot',
      'spring boot': 'Spring Boot',
      'laravel': 'Laravel',
      'rails': 'Ruby on Rails',
      'ruby on rails': 'Ruby on Rails',
      'fastapi': 'FastAPI',
      'nest': 'NestJS',
      'nestjs': 'NestJS',
      'nest.js': 'NestJS',
      
      // Databases
      'mysql': 'MySQL',
      'postgresql': 'PostgreSQL',
      'postgres': 'PostgreSQL',
      'mongodb': 'MongoDB',
      'mongo': 'MongoDB',
      'redis': 'Redis',
      'sqlite': 'SQLite',
      'oracle': 'Oracle',
      'sql server': 'SQL Server',
      'sqlserver': 'SQL Server',
      'elasticsearch': 'Elasticsearch',
      'cassandra': 'Cassandra',
      'dynamodb': 'DynamoDB',
      'firebase': 'Firebase',
      
      // Cloud & DevOps
      'aws': 'AWS',
      'amazon web services': 'AWS',
      'azure': 'Azure',
      'microsoft azure': 'Azure',
      'gcp': 'Google Cloud',
      'google cloud': 'Google Cloud',
      'gcloud': 'Google Cloud',
      'docker': 'Docker',
      'kubernetes': 'Kubernetes',
      'k8s': 'Kubernetes',
      'jenkins': 'Jenkins',
      'gitlab ci': 'GitLab CI',
      'gitlab-ci': 'GitLab CI',
      'github actions': 'GitHub Actions',
      'github-actions': 'GitHub Actions',
      'terraform': 'Terraform',
      'ansible': 'Ansible',
      'puppet': 'Puppet',
      'chef': 'Chef',
      'ci/cd': 'CI/CD',
      'cicd': 'CI/CD',
      'devops': 'DevOps',
      
      // Tools & Libraries
      'git': 'Git',
      'github': 'GitHub',
      'gitlab': 'GitLab',
      'webpack': 'Webpack',
      'vite': 'Vite',
      'babel': 'Babel',
      'eslint': 'ESLint',
      'prettier': 'Prettier',
      'jest': 'Jest',
      'mocha': 'Mocha',
      'cypress': 'Cypress',
      'selenium': 'Selenium',
      'postman': 'Postman',
      'figma': 'Figma',
      'sketch': 'Sketch',
      'jira': 'Jira',
      'trello': 'Trello',
      'slack': 'Slack',
      
      // Mobile
      'ios': 'iOS',
      'android': 'Android',
      'xamarin': 'Xamarin',
      'cordova': 'Cordova',
      'ionic': 'Ionic',
      'unity': 'Unity',
      'unreal engine': 'Unreal Engine',
      
      // AI/ML
      'machine learning': 'Machine Learning',
      'ml': 'Machine Learning',
      'artificial intelligence': 'Artificial Intelligence',
      'ai': 'Artificial Intelligence',
      'deep learning': 'Deep Learning',
      'dl': 'Deep Learning',
      'tensorflow': 'TensorFlow',
      'pytorch': 'PyTorch',
      'keras': 'Keras',
      'scikit-learn': 'Scikit-learn',
      'sklearn': 'Scikit-learn',
      'nlp': 'Natural Language Processing',
      'natural language processing': 'Natural Language Processing',
      'computer vision': 'Computer Vision',
      'cv': 'Computer Vision',
      'pandas': 'Pandas',
      'numpy': 'NumPy',
      'jupyter': 'Jupyter',
      'jupyter notebook': 'Jupyter Notebook',
      
      // Other
      'html': 'HTML',
      'css': 'CSS',
      'scss': 'SCSS',
      'sass': 'Sass',
      'rest': 'REST API',
      'rest api': 'REST API',
      'restful': 'REST API',
      'graphql': 'GraphQL',
      'api': 'API',
      'microservices': 'Microservices',
      'agile': 'Agile',
      'scrum': 'Scrum',
      'kanban': 'Kanban',
      'tdd': 'Test-Driven Development',
      'bdd': 'Behavior-Driven Development',
      'unit testing': 'Unit Testing',
      'integration testing': 'Integration Testing',
      'e2e testing': 'E2E Testing'
    };

    // Country/City mapping for African locations
    this.locationMap = {
      // Nigeria
      'nigeria': 'Nigeria',
      'lagos': 'Nigeria',
      'abuja': 'Nigeria',
      'kano': 'Nigeria',
      'ibadan': 'Nigeria',
      'port harcourt': 'Nigeria',
      'benin city': 'Nigeria',
      'maiduguri': 'Nigeria',
      'zaria': 'Nigeria',
      'jos': 'Nigeria',
      'ile-ife': 'Nigeria',
      'oyo': 'Nigeria',
      'enugu': 'Nigeria',
      'aba': 'Nigeria',
      'onitsha': 'Nigeria',
      'warri': 'Nigeria',
      'akure': 'Nigeria',
      'makurdi': 'Nigeria',
      
      // Kenya
      'kenya': 'Kenya',
      'nairobi': 'Kenya',
      'mombasa': 'Kenya',
      'kisumu': 'Kenya',
      'nakuru': 'Kenya',
      'eldoret': 'Kenya',
      'kitale': 'Kenya',
      'thika': 'Kenya',
      'malindi': 'Kenya',
      'garissa': 'Kenya',
      'kakamega': 'Kenya',
      
      // South Africa
      'south africa': 'South Africa',
      'johannesburg': 'South Africa',
      'cape town': 'South Africa',
      'pretoria': 'South Africa',
      'durban': 'South Africa',
      'port elizabeth': 'South Africa',
      'bloemfontein': 'South Africa',
      'east london': 'South Africa',
      'pietermaritzburg': 'South Africa',
      'nelson mandela bay': 'South Africa',
      'polokwane': 'South Africa',
      'rustenburg': 'South Africa',
      'witbank': 'South Africa',
      'klerksdorp': 'South Africa',
      'paarl': 'South Africa',
      'tshwane': 'South Africa',
      
      // Ghana
      'ghana': 'Ghana',
      'accra': 'Ghana',
      'kumasi': 'Ghana',
      'tamale': 'Ghana',
      'sekondi-takoradi': 'Ghana',
      'sunyani': 'Ghana',
      'cape coast': 'Ghana',
      'koforidua': 'Ghana',
      'obuasi': 'Ghana',
      'tema': 'Ghana',
      
      // Rwanda
      'rwanda': 'Rwanda',
      'kigali': 'Rwanda',
      'butare': 'Rwanda',
      'gitarama': 'Rwanda',
      'rubavu': 'Rwanda',
      'nyagatare': 'Rwanda',
      'muhanga': 'Rwanda',
      
      // Uganda
      'uganda': 'Uganda',
      'kampala': 'Uganda',
      'gulu': 'Uganda',
      'lira': 'Uganda',
      'mbarara': 'Uganda',
      'jinja': 'Uganda',
      'entebbe': 'Uganda',
      'mbale': 'Uganda',
      
      // Tanzania
      'tanzania': 'Tanzania',
      'dar es salaam': 'Tanzania',
      'dodoma': 'Tanzania',
      'mwanza': 'Tanzania',
      'arusha': 'Tanzania',
      'mbeya': 'Tanzania',
      'morogoro': 'Tanzania',
      'tanga': 'Tanzania',
      'kigoma': 'Tanzania',
      
      // Ethiopia
      'ethiopia': 'Ethiopia',
      'addis ababa': 'Ethiopia',
      'dire dawa': 'Ethiopia',
      'mekelle': 'Ethiopia',
      'bahir dar': 'Ethiopia',
      'gondar': 'Ethiopia',
      
      // Egypt
      'egypt': 'Egypt',
      'cairo': 'Egypt',
      'alexandria': 'Egypt',
      'giza': 'Egypt',
      'shubra el kheima': 'Egypt',
      'port said': 'Egypt',
      'suez': 'Egypt',
      'luxor': 'Egypt',
      'aswan': 'Egypt',
      
      // Morocco
      'morocco': 'Morocco',
      'casablanca': 'Morocco',
      'rabat': 'Morocco',
      'marrakech': 'Morocco',
      'fes': 'Morocco',
      'meknes': 'Morocco',
      'tangier': 'Morocco',
      'oujda': 'Morocco',
      'kenitra': 'Morocco',
      
      // Other African countries
      'zimbabwe': 'Zimbabwe',
      'harare': 'Zimbabwe',
      'bulawayo': 'Zimbabwe',
      'chitungwiza': 'Zimbabwe',
      
      'botswana': 'Botswana',
      'gaborone': 'Botswana',
      'francistown': 'Botswana',
      
      'namibia': 'Namibia',
      'windhoek': 'Namibia',
      'swakopmund': 'Namibia',
      
      'zambia': 'Zambia',
      'lusaka': 'Zambia',
      'kitwe': 'Zambia',
      'ndola': 'Zambia',
      
      'malawi': 'Malawi',
      'lilongwe': 'Malawi',
      'blantyre': 'Malawi',
      
      'mozambique': 'Mozambique',
      'maputo': 'Mozambique',
      'matola': 'Mozambique',
      
      'senegal': 'Senegal',
      'dakar': 'Senegal',
      
      'ivory coast': 'Ivory Coast',
      "côte d'ivoire": 'Ivory Coast',
      'abidjan': 'Ivory Coast',
      
      'cameroon': 'Cameroon',
      'douala': 'Cameroon',
      'yaoundé': 'Cameroon',
      
      'angola': 'Angola',
      'luanda': 'Angola',
      
      'sudan': 'Sudan',
      'khartoum': 'Sudan',
      
      'algeria': 'Algeria',
      'algiers': 'Algeria',
      
      'libya': 'Libya',
      'tripoli': 'Libya',
      
      'tunisia': 'Tunisia',
      'tunis': 'Tunisia'
    };

    // Currency mapping
    this.currencyMap = {
      '$': 'USD',
      'usd': 'USD',
      'ksh': 'KES',
      'kshs': 'KES',
      'kes': 'KES',
      'ksh.': 'KES',
      'kenyan shilling': 'KES',
      'kenya shillings': 'KES',
      'r': 'ZAR',
      'zar': 'ZAR',
      'rand': 'ZAR',
      'r.': 'ZAR',
      'south african rand': 'ZAR',
      'ghs': 'GHS',
      'gh₵': 'GHS',
      'cedi': 'GHS',
      'ghana cedi': 'GHS',
      '₦': 'NGN',
      'ngn': 'NGN',
      'naira': 'NGN',
      'nigerian naira': 'NGN',
      'frw': 'RWF',
      'rf': 'RWF',
      'rwandan franc': 'RWF',
      'ugx': 'UGX',
      'ush': 'UGX',
      'ugandan shilling': 'UGX',
      'tzs': 'TZS',
      'tsh': 'TZS',
      'tanzanian shilling': 'TZS',
      'etb': 'ETB',
      'birr': 'ETB',
      'ethiopian birr': 'ETB',
      'egp': 'EGP',
      'egyptian pound': 'EGP',
      'mad': 'MAD',
      'moroccan dirham': 'MAD',
      'dh': 'MAD',
      'dzd': 'DZD',
      'algerian dinar': 'DZD',
      'lyd': 'LYD',
      'libyan dinar': 'LYD',
      'tnd': 'TND',
      'tunisian dinar': 'TND',
      'xof': 'XOF',
      'cfa franc': 'XOF',
      'xaf': 'XAF',
      'xof': 'XOF',
      'aoa': 'AOA',
      'kwanza': 'AOA',
      'sdg': 'SDG',
      'sudanese pound': 'SDG'
    };
  }

  /**
   * Normalize and clean skills array
   * @param {Array} skills - Raw skills array
   * @returns {Array} - Normalized skills array
   */
  static cleanSkills(skills) {
    if (!Array.isArray(skills)) return [];
    
    const cleaner = new DataCleaner();
    const normalizedSkills = skills
      .filter(skill => skill && typeof skill === 'string')
      .map(skill => cleaner.normalizeSkill(skill))
      .filter(skill => skill && skill.length > 0)
      .map(skill => skill.charAt(0).toUpperCase() + skill.slice(1));
    
    // Remove duplicates while preserving order
    return [...new Set(normalizedSkills)];
  }

  /**
   * Normalize a single skill
   * @param {string} skill - Raw skill string
   * @returns {string} - Normalized skill
   */
  normalizeSkill(skill) {
    if (!skill || typeof skill !== 'string') return '';
    
    const normalized = skill.toLowerCase().trim();
    
    // Check exact matches first
    if (this.skillMap[normalized]) {
      return this.skillMap[normalized];
    }
    
    // Check partial matches
    for (const [key, value] of Object.entries(this.skillMap)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return value;
      }
    }
    
    // Return original if no match found
    return skill.trim();
  }

  /**
   * Normalize country from location string
   * @param {string} location - Raw location string
   * @returns {string} - Normalized country
   */
  static normalizeCountry(location) {
    if (!location || typeof location !== 'string') return 'Unknown';
    
    const cleaner = new DataCleaner();
    const normalized = location.toLowerCase().trim();
    
    // Check exact matches first
    if (cleaner.locationMap[normalized]) {
      return cleaner.locationMap[normalized];
    }
    
    // Check partial matches
    for (const [key, value] of Object.entries(cleaner.locationMap)) {
      if (normalized.includes(key)) {
        return value;
      }
    }
    
    // Check if it already looks like a country name
    const countries = ['nigeria', 'kenya', 'south africa', 'ghana', 'egypt', 'morocco', 
                      'tanzania', 'ethiopia', 'uganda', 'algeria', 'sudan', 'zimbabwe',
                      'botswana', 'namibia', 'zambia', 'malawi', 'mozambique', 'rwanda',
                      'senegal', 'ivory coast', 'cameroon', 'angola', 'libya', 'tunisia'];
    
    for (const country of countries) {
      if (normalized.includes(country)) {
        return country.charAt(0).toUpperCase() + country.slice(1);
      }
    }
    
    return 'Unknown';
  }

  /**
   * Parse and normalize salary
   * @param {string} salaryText - Raw salary text
   * @returns {Object|null} - Structured salary object
   */
  static normalizeSalary(salaryText) {
    if (!salaryText || typeof salaryText !== 'string') return null;
    
    const cleaner = new DataCleaner();
    const text = salaryText.toLowerCase().trim();
    
    // Extract currency
    let currency = 'USD'; // Default
    for (const [symbol, code] of Object.entries(cleaner.currencyMap)) {
      if (text.includes(symbol)) {
        currency = code;
        break;
      }
    }
    
    // Extract numbers
    const numberMatches = text.match(/[\d,]+/g);
    if (!numberMatches || numberMatches.length === 0) return null;
    
    const amounts = numberMatches.map(num => parseInt(num.replace(/,/g, '')));
    
    // Determine salary range
    let minAmount = null;
    let maxAmount = null;
    
    if (amounts.length === 1) {
      // Single number - could be min or exact amount
      if (text.includes('from') || text.includes('starting') || text.includes('minimum')) {
        minAmount = amounts[0];
      } else if (text.includes('up to') || text.includes('maximum') || text.includes('max')) {
        maxAmount = amounts[0];
      } else {
        // Assume it's a range or exact amount
        minAmount = amounts[0];
        maxAmount = amounts[0];
      }
    } else if (amounts.length >= 2) {
      // Range
      minAmount = Math.min(...amounts);
      maxAmount = Math.max(...amounts);
    }
    
    // Convert to annual if it appears to be monthly/hourly
    const isHourly = text.includes('/hr') || text.includes('/hour') || text.includes('per hour');
    const isMonthly = text.includes('/mo') || text.includes('/month') || text.includes('per month');
    const isWeekly = text.includes('/wk') || text.includes('/week') || text.includes('per week');
    
    if (isHourly && minAmount) {
      minAmount = minAmount * 40 * 52; // 40 hours/week * 52 weeks
    }
    if (isHourly && maxAmount) {
      maxAmount = maxAmount * 40 * 52;
    }
    if (isMonthly && minAmount) {
      minAmount = minAmount * 12;
    }
    if (isMonthly && maxAmount) {
      maxAmount = maxAmount * 12;
    }
    if (isWeekly && minAmount) {
      minAmount = minAmount * 52;
    }
    if (isWeekly && maxAmount) {
      maxAmount = maxAmount * 52;
    }
    
    return {
      min: minAmount,
      max: maxAmount,
      currency: currency,
      frequency: 'annual',
      originalText: salaryText.trim()
    };
  }

  /**
   * Compute data quality score for a job
   * @param {Object} job - Job object
   * @returns {number} - Quality score (0-10)
   */
  static computeQualityScore(job) {
    let score = 0;
    
    // Required fields (4 points)
    if (job.jobTitle && job.jobTitle.length > 5) score += 1;
    if (job.company && job.company.length > 2) score += 1;
    if (job.jobDescription && job.jobDescription.length > 50) score += 1;
    if (job.country && job.country !== 'Unknown') score += 1;
    
    // Enhanced fields (3 points)
    if (job.skills && job.skills.length > 0) score += 1;
    if (job.salary && (job.salary.min || job.salary.max)) score += 1;
    if (job.jobUrl && job.jobUrl.startsWith('http')) score += 1;
    
    // Quality indicators (2 points)
    if (job.postedDate) score += 1;
    if (job.jobType && ['full-time', 'part-time', 'contract', 'remote'].includes(job.jobType)) score += 1;
    
    // Bonus points (1 point)
    if (job.seniorityLevel && ['junior', 'mid-level', 'senior', 'lead'].includes(job.seniorityLevel)) score += 1;
    
    return Math.min(score, 10);
  }

  /**
   * Validate job data before saving
   * @param {Object} job - Job object
   * @returns {Object} - Validation result
   */
  static validateJob(job) {
    const errors = [];
    const warnings = [];
    
    // Required fields
    if (!job.jobTitle || job.jobTitle.trim().length < 3) {
      errors.push('Job title is required and must be at least 3 characters');
    }
    
    if (!job.company || job.company.trim().length < 2) {
      errors.push('Company name is required and must be at least 2 characters');
    }
    
    if (!job.jobDescription || job.jobDescription.trim().length < 20) {
      errors.push('Job description is required and must be at least 20 characters');
    }
    
    // Warnings for data quality
    if (!job.skills || job.skills.length === 0) {
      warnings.push('No skills detected - job may be difficult to categorize');
    }
    
    if (!job.country || job.country === 'Unknown') {
      warnings.push('Country not detected - job may not be included in geographic analytics');
    }
    
    if (!job.salary || (!job.salary.min && !job.salary.max)) {
      warnings.push('No salary information - job will not be included in salary analytics');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      qualityScore: this.computeQualityScore(job)
    };
  }

  /**
   * Clean and normalize a complete job object
   * @param {Object} job - Raw job object
   * @returns {Object} - Cleaned job object
   */
  static cleanJob(job) {
    if (!job || typeof job !== 'object') return null;
    
    const cleanedJob = { ...job };
    
    // Normalize skills
    if (cleanedJob.skills) {
      cleanedJob.skills = this.cleanSkills(cleanedJob.skills);
    }
    
    // Normalize country
    if (cleanedJob.location) {
      cleanedJob.country = this.normalizeCountry(cleanedJob.location);
    }
    
    // Normalize salary
    if (cleanedJob.salary && typeof cleanedJob.salary === 'string') {
      cleanedJob.salary = this.normalizeSalary(cleanedJob.salary);
    }
    
    // Clean up text fields
    const textFields = ['jobTitle', 'company', 'jobDescription'];
    textFields.forEach(field => {
      if (cleanedJob[field] && typeof cleanedJob[field] === 'string') {
        cleanedJob[field] = cleanedJob[field].trim().replace(/\s+/g, ' ');
      }
    });
    
    // Add quality score
    cleanedJob.qualityScore = this.computeQualityScore(cleanedJob);
    
    // Add cleaning timestamp
    cleanedJob.cleanedAt = new Date();
    
    return cleanedJob;
  }

  /**
   * Check if a job is likely a duplicate
   * @param {Object} job - Job to check
   * @param {Array} existingJobs - Array of existing jobs
   * @returns {boolean} - True if likely duplicate
   */
  static isDuplicate(job, existingJobs = []) {
    if (!Array.isArray(existingJobs) || existingJobs.length === 0) return false;
    
    const jobTitle = (job.jobTitle || '').toLowerCase().trim();
    const company = (job.company || '').toLowerCase().trim();
    const country = (job.country || '').toLowerCase().trim();
    
    return existingJobs.some(existingJob => {
      const existingTitle = (existingJob.jobTitle || '').toLowerCase().trim();
      const existingCompany = (existingJob.company || '').toLowerCase().trim();
      const existingCountry = (existingJob.country || '').toLowerCase().trim();
      
      // Check for high similarity
      const titleSimilar = this.calculateSimilarity(jobTitle, existingTitle) > 0.8;
      const companySame = company === existingCompany;
      const countrySame = country === existingCountry;
      
      return titleSimilar && companySame && countrySame;
    });
  }

  /**
   * Calculate string similarity (simple implementation)
   * @param {string} str1 - First string
   * @param {string} str2 - Second string
   * @returns {number} - Similarity score (0-1)
   */
  static calculateSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance
   * @param {string} str1 - First string
   * @param {string} str2 - Second string
   * @returns {number} - Distance
   */
  static levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}

module.exports = DataCleaner;
