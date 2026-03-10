const User = require('../models/User');
const Job = require('../models/Job');
const aiCareerAdvisor = require('./aiCareerAdvisor');

/**
 * AI Resume Analyzer - Advanced resume analysis system
 */
class AIResumeAnalyzer {
  constructor() {
    this.skillWeights = {
      // Programming Languages
      'Python': 0.95, 'JavaScript': 0.90, 'Java': 0.85, 'C#': 0.80, 'Go': 0.75,
      'TypeScript': 0.88, 'Ruby': 0.70, 'PHP': 0.75, 'Rust': 0.80, 'Swift': 0.82,
      'Kotlin': 0.80, 'C++': 0.78, 'Scala': 0.72, 'Dart': 0.70,

      // Frontend Technologies
      'React': 0.92, 'Angular': 0.88, 'Vue.js': 0.85, 'HTML': 0.95, 'CSS': 0.95,
      'SASS': 0.80, 'Tailwind': 0.82, 'Bootstrap': 0.78, 'Next.js': 0.88,

      // Backend Technologies
      'Node.js': 0.90, 'Express': 0.85, 'Django': 0.88, 'Flask': 0.82,
      'Spring': 0.85, 'Laravel': 0.80, 'Rails': 0.78, 'NestJS': 0.86,

      // Databases
      'MongoDB': 0.85, 'MySQL': 0.88, 'PostgreSQL': 0.90, 'Redis': 0.82,
      'Elasticsearch': 0.80, 'Cassandra': 0.75, 'DynamoDB': 0.78,

      // Cloud & DevOps
      'AWS': 0.92, 'Azure': 0.88, 'GCP': 0.85, 'Docker': 0.90, 'Kubernetes': 0.92,
      'CI/CD': 0.85, 'Jenkins': 0.82, 'Terraform': 0.86, 'Ansible': 0.80,
      'Linux': 0.88, 'Nginx': 0.82, 'Apache': 0.78,

      // Data Science & AI
      'Machine Learning': 0.95, 'TensorFlow': 0.92, 'PyTorch': 0.90, 'Data Science': 0.94,
      'Pandas': 0.88, 'NumPy': 0.86, 'Scikit-learn': 0.88, 'Deep Learning': 0.92,
      'NLP': 0.90, 'Computer Vision': 0.88, 'Statistics': 0.85,

      // Mobile Development
      'React Native': 0.86, 'Flutter': 0.84, 'Swift': 0.88, 'Kotlin': 0.86,
      'Android': 0.82, 'iOS': 0.84, 'Xamarin': 0.75,

      // Other Important Skills
      'REST API': 0.88, 'GraphQL': 0.82, 'Microservices': 0.86, 'Git': 0.92,
      'Agile': 0.80, 'Scrum': 0.78, 'Jira': 0.75, 'Testing': 0.82,
      'Unit Testing': 0.84, 'Integration Testing': 0.80, 'E2E Testing': 0.78,
      'Security': 0.85, 'Performance': 0.82, 'Optimization': 0.80
    };

    this.experienceLevels = {
      'intern': 0.5,
      'junior': 0.7,
      'mid-level': 0.85,
      'senior': 1.0,
      'lead': 1.1,
      'principal': 1.2,
      'architect': 1.15,
      'manager': 1.1
    };

    this.educationLevels = {
      'high school': 0.6,
      'diploma': 0.7,
      'bachelor': 0.85,
      'master': 0.95,
      'phd': 1.0,
      'mba': 0.92
    };

    this.certificationWeights = {
      'AWS Certified': 0.9,
      'Google Cloud': 0.88,
      'Microsoft Certified': 0.85,
      'Oracle Certified': 0.82,
      'Cisco Certified': 0.80,
      'PMP': 0.88,
      'Scrum Master': 0.82,
      'Certified Kubernetes': 0.90,
      'Docker Certified': 0.85
    };
  }

  /**
   * Analyze resume text comprehensively
   */
  async analyzeResume(resumeText, targetCareer = null, country = 'Nigeria') {
    try {
      // Extract information from resume
      const extractedData = this.extractResumeData(resumeText);
      
      // Analyze skills
      const skillAnalysis = this.analyzeSkills(extractedData.skills);
      
      // Analyze experience
      const experienceAnalysis = this.analyzeExperience(extractedData.experience);
      
      // Analyze education
      const educationAnalysis = this.analyzeEducation(extractedData.education);
      
      // Analyze certifications
      const certificationAnalysis = this.analyzeCertifications(extractedData.certifications);
      
      // Calculate overall scores
      const scores = this.calculateScores(skillAnalysis, experienceAnalysis, educationAnalysis, certificationAnalysis);
      
      // Generate job recommendations
      const jobRecommendations = await this.generateJobRecommendations(extractedData.skills, targetCareer, country);
      
      // Identify skill gaps
      const skillGaps = this.identifySkillGaps(extractedData.skills, targetCareer);
      
      // Generate improvement suggestions
      const improvementSuggestions = this.generateImprovementSuggestions(skillGaps, extractedData);
      
      // Calculate market fit
      const marketFit = await this.calculateMarketFit(extractedData, country);

      return {
        extractedData,
        skillAnalysis,
        experienceAnalysis,
        educationAnalysis,
        certificationAnalysis,
        scores,
        jobRecommendations,
        skillGaps,
        improvementSuggestions,
        marketFit,
        targetCareer,
        country,
        analyzedAt: new Date()
      };

    } catch (error) {
      console.error('Resume analysis error:', error);
      throw error;
    }
  }

  /**
   * Extract data from resume text
   */
  extractResumeData(resumeText) {
    const text = resumeText.toLowerCase();
    
    return {
      skills: this.extractSkills(text),
      experience: this.extractExperience(text),
      education: this.extractEducation(text),
      certifications: this.extractCertifications(text),
      contact: this.extractContactInfo(text),
      summary: this.extractSummary(text),
      languages: this.extractLanguages(text),
      projects: this.extractProjects(text)
    };
  }

  /**
   * Extract skills from resume text
   */
  extractSkills(text) {
    const foundSkills = [];
    
    Object.keys(this.skillWeights).forEach(skill => {
      const regex = new RegExp(`\\b${skill.toLowerCase().replace(/\./g, '\\.')}\\b`, 'gi');
      if (regex.test(text)) {
        foundSkills.push(skill);
      }
    });

    // Also look for variations and related terms
    const skillVariations = {
      'js': 'JavaScript',
      'ts': 'TypeScript',
      'py': 'Python',
      'node': 'Node.js',
      'reactjs': 'React',
      'vuejs': 'Vue.js',
      'ml': 'Machine Learning',
      'ai': 'Artificial Intelligence',
      'nosql': 'NoSQL',
      'sql': 'SQL',
      'ci': 'CI/CD',
      'cd': 'CI/CD',
      'aws': 'AWS',
      'azure': 'Azure',
      'gcp': 'GCP',
      'git': 'Git',
      'docker': 'Docker',
      'k8s': 'Kubernetes',
      'k8': 'Kubernetes'
    };

    Object.entries(skillVariations).forEach(([variation, skill]) => {
      const regex = new RegExp(`\\b${variation}\\b`, 'gi');
      if (regex.test(text) && !foundSkills.includes(skill)) {
        foundSkills.push(skill);
      }
    });

    return [...new Set(foundSkills)];
  }

  /**
   * Extract experience information
   */
  extractExperience(text) {
    const experiencePatterns = [
      /(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/gi,
      /(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?work/gi,
      /worked\s*(?:for\s*)?(\d+)\s*(?:years?|yrs?)/gi,
      /experience\s*:?\s*(\d+)\s*(?:years?|yrs?)/gi
    ];

    let totalExperience = 0;
    experiencePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const years = parseInt(match.match(/\d+/)[0]);
          totalExperience = Math.max(totalExperience, years);
        });
      }
    });

    // Extract experience level
    let experienceLevel = 'junior';
    if (totalExperience >= 8) experienceLevel = 'senior';
    else if (totalExperience >= 5) experienceLevel = 'mid-level';
    else if (totalExperience >= 2) experienceLevel = 'junior';
    else if (totalExperience >= 1) experienceLevel = 'junior';
    else experienceLevel = 'entry-level';

    // Look for specific titles
    const titles = ['intern', 'junior', 'mid-level', 'senior', 'lead', 'principal', 'architect', 'manager'];
    titles.forEach(title => {
      if (text.includes(title)) {
        experienceLevel = title;
      }
    });

    return {
      totalYears: totalExperience,
      level: experienceLevel,
      weight: this.experienceLevels[experienceLevel] || 0.7
    };
  }

  /**
   * Extract education information
   */
  extractEducation(text) {
    let educationLevel = 'high school';
    let degree = null;
    let field = null;

    const educationPatterns = [
      { pattern: /ph\.?d\.?|doctorate/gi, level: 'phd' },
      { pattern: /master'?s?|msc|m\.?s\.?|mba/gi, level: 'master' },
      { pattern: /bachelor'?s?|bsc|b\.?s\.?|b\.?a\.?|ba/gi, level: 'bachelor' },
      { pattern: /diploma|associate/gi, level: 'diploma' },
      { pattern: /high school|secondary/gi, level: 'high school' }
    ];

    educationPatterns.forEach(({ pattern, level }) => {
      if (pattern.test(text)) {
        educationLevel = level;
      }
    });

    // Extract field of study
    const fieldPatterns = [
      /computer science|cs|software engineering/gi,
      /information technology|it/gi,
      /data science|machine learning|ai/gi,
      /business administration|mba/gi,
      /electrical engineering|ee/gi,
      /mathematics|statistics/gi
    ];

    fieldPatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match) {
        field = match[0];
      }
    });

    return {
      level: educationLevel,
      degree,
      field,
      weight: this.educationLevels[educationLevel] || 0.6
    };
  }

  /**
   * Extract certifications
   */
  extractCertifications(text) {
    const certifications = [];
    
    Object.keys(this.certificationWeights).forEach(cert => {
      const regex = new RegExp(`\\b${cert.toLowerCase()}\\b`, 'gi');
      if (regex.test(text)) {
        certifications.push({
          name: cert,
          weight: this.certificationWeights[cert]
        });
      }
    });

    return certifications;
  }

  /**
   * Extract contact information
   */
  extractContactInfo(text) {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phonePattern = /\+?(\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const linkedinPattern = /linkedin\.com\/in\/[\w-]+/gi;

    return {
      email: text.match(emailPattern)?.[0] || null,
      phone: text.match(phonePattern)?.[0] || null,
      linkedin: text.match(linkedinPattern)?.[0] || null
    };
  }

  /**
   * Extract summary/profile
   */
  extractSummary(text) {
    const summaryPatterns = [
      /summary\s*:?\s*([^]+?)(?:\n\n|\n[A-Z]|\n[0-9])/gi,
      /profile\s*:?\s*([^]+?)(?:\n\n|\n[A-Z]|\n[0-9])/gi,
      /about\s*:?\s*([^]+?)(?:\n\n|\n[A-Z]|\n[0-9])/gi,
      /objective\s*:?\s*([^]+?)(?:\n\n|\n[A-Z]|\n[0-9])/gi
    ];

    for (const pattern of summaryPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim().substring(0, 500); // Limit to 500 chars
      }
    }

    return null;
  }

  /**
   * Extract languages
   */
  extractLanguages(text) {
    const languages = [];
    const commonLanguages = [
      'english', 'french', 'spanish', 'portuguese', 'arabic', 'swahili',
      'hausa', 'yoruba', 'igbo', 'zulu', 'afrikaans', 'amharic'
    ];

    commonLanguages.forEach(lang => {
      const regex = new RegExp(`\\b${lang}\\b`, 'gi');
      if (regex.test(text)) {
        languages.push(lang);
      }
    });

    return languages;
  }

  /**
   * Extract projects
   */
  extractProjects(text) {
    const projectPatterns = [
      /projects?\s*:?\s*([^]+?)(?:\n\n|\n[A-Z]|\n[0-9])/gi,
      /portfolio\s*:?\s*([^]+?)(?:\n\n|\n[A-Z]|\n[0-9])/gi
    ];

    for (const pattern of projectPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim().substring(0, 300);
      }
    }

    return null;
  }

  /**
   * Analyze extracted skills
   */
  analyzeSkills(skills) {
    const skillScores = skills.map(skill => ({
      skill,
      weight: this.skillWeights[skill] || 0.5,
      category: this.getSkillCategory(skill)
    }));

    const totalWeight = skillScores.reduce((sum, skill) => sum + skill.weight, 0);
    const averageWeight = skillScores.length > 0 ? totalWeight / skillScores.length : 0;

    const categoryBreakdown = {};
    skillScores.forEach(({ skill, weight, category }) => {
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = { skills: [], totalWeight: 0, count: 0 };
      }
      categoryBreakdown[category].skills.push(skill);
      categoryBreakdown[category].totalWeight += weight;
      categoryBreakdown[category].count++;
    });

    // Calculate category averages
    Object.keys(categoryBreakdown).forEach(category => {
      categoryBreakdown[category].averageWeight = 
        categoryBreakdown[category].totalWeight / categoryBreakdown[category].count;
    });

    return {
      skills,
      totalSkills: skills.length,
      totalWeight: Math.round(totalWeight * 100) / 100,
      averageWeight: Math.round(averageWeight * 100) / 100,
      categoryBreakdown,
      topSkills: skillScores.sort((a, b) => b.weight - a.weight).slice(0, 10),
      strength: this.getSkillStrength(averageWeight)
    };
  }

  /**
   * Analyze experience
   */
  analyzeExperience(experience) {
    return {
      ...experience,
      level: this.getExperienceLevel(experience.totalYears),
      score: Math.round(experience.weight * 100),
      insights: this.generateExperienceInsights(experience)
    };
  }

  /**
   * Analyze education
   */
  analyzeEducation(education) {
    return {
      ...education,
      score: Math.round(education.weight * 100),
      insights: this.generateEducationInsights(education)
    };
  }

  /**
   * Analyze certifications
   */
  analyzeCertifications(certifications) {
    const totalWeight = certifications.reduce((sum, cert) => sum + cert.weight, 0);
    const averageWeight = certifications.length > 0 ? totalWeight / certifications.length : 0;

    return {
      certifications,
      totalCertifications: certifications.length,
      totalWeight: Math.round(totalWeight * 100) / 100,
      averageWeight: Math.round(averageWeight * 100) / 100,
      score: Math.round(averageWeight * 100),
      insights: this.generateCertificationInsights(certifications)
    };
  }

  /**
   * Calculate overall scores
   */
  calculateScores(skillAnalysis, experienceAnalysis, educationAnalysis, certificationAnalysis) {
    const skillScore = skillAnalysis.averageWeight * 100;
    const experienceScore = experienceAnalysis.score;
    const educationScore = educationAnalysis.score;
    const certificationScore = certificationAnalysis.score;

    // Weighted average (skills are most important)
    const overallScore = Math.round(
      (skillScore * 0.4) + 
      (experienceScore * 0.3) + 
      (educationScore * 0.2) + 
      (certificationScore * 0.1)
    );

    return {
      overall: overallScore,
      skills: skillScore,
      experience: experienceScore,
      education: educationScore,
      certifications: certificationScore,
      grade: this.getGrade(overallScore),
      level: this.getScoreLevel(overallScore)
    };
  }

  /**
   * Generate job recommendations
   */
  async generateJobRecommendations(skills, targetCareer, country) {
    try {
      let jobMatches = [];

      if (targetCareer) {
        // Get jobs matching target career
        jobMatches = await Job.find({
          jobTitle: { $regex: targetCareer, $options: 'i' },
          country: country,
          isActive: true
        }).select('jobTitle company salaryMin salaryMax skills').lean();
      } else {
        // Get jobs based on skill matching
        const skillRegex = skills.map(skill => new RegExp(skill, 'i'));
        jobMatches = await Job.find({
          $or: [
            { skills: { $in: skills } },
            { jobTitle: { $in: skillRegex } }
          ],
          country: country,
          isActive: true
        }).select('jobTitle company salaryMin salaryMax skills').lean();
      }

      // Calculate match scores
      const scoredJobs = jobMatches.map(job => {
        const jobSkills = job.skills || [];
        const matchingSkills = skills.filter(skill => 
          jobSkills.some(jobSkill => 
            jobSkill.toLowerCase() === skill.toLowerCase()
          )
        );

        const matchScore = matchingSkills.length / Math.max(skills.length, jobSkills.length);
        const avgSalary = job.salaryMin && job.salaryMax ? 
          (job.salaryMin + job.salaryMax) / 2 : 0;

        return {
          ...job,
          matchScore: Math.round(matchScore * 100),
          matchingSkills,
          averageSalary: Math.round(avgSalary)
        };
      });

      // Sort by match score and salary
      scoredJobs.sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
        return b.averageSalary - a.averageSalary;
      });

      return {
        recommendations: scoredJobs.slice(0, 10),
        totalMatches: scoredJobs.length,
        averageMatchScore: scoredJobs.length > 0 ? 
          Math.round(scoredJobs.reduce((sum, job) => sum + job.matchScore, 0) / scoredJobs.length) : 0
      };

    } catch (error) {
      console.error('Job recommendations error:', error);
      return { recommendations: [], totalMatches: 0, averageMatchScore: 0 };
    }
  }

  /**
   * Identify skill gaps
   */
  identifySkillGaps(userSkills, targetCareer) {
    if (!targetCareer) {
      return { gaps: [], recommendations: [] };
    }

    // Get career requirements from AI Career Advisor
    const careerRequirements = this.getCareerRequirements(targetCareer);
    
    const userSkillSet = new Set(userSkills.map(s => s.toLowerCase()));
    const missingSkills = careerRequirements.requiredSkills.filter(skill => 
      !userSkillSet.has(skill.toLowerCase())
    );

    const gaps = missingSkills.map(skill => ({
      skill,
      importance: this.getSkillImportance(skill, targetCareer),
      category: this.getSkillCategory(skill),
      learningTime: this.getLearningTime(skill)
    }));

    return {
      gaps: gaps.sort((a, b) => b.importance - a.importance),
      totalGaps: gaps.length,
      completionRate: Math.round(((careerRequirements.requiredSkills.length - gaps.length) / careerRequirements.requiredSkills.length) * 100)
    };
  }

  /**
   * Generate improvement suggestions
   */
  generateImprovementSuggestions(skillGaps, extractedData) {
    const suggestions = [];

    // Skill improvement suggestions
    skillGaps.gaps.forEach(gap => {
      suggestions.push({
        type: 'skill',
        priority: gap.importance > 8 ? 'high' : gap.importance > 6 ? 'medium' : 'low',
        title: `Learn ${gap.skill}`,
        description: `Add ${gap.skill} to improve your profile`,
        estimatedTime: `${gap.learningTime} months`,
        resources: this.getLearningResources(gap.skill)
      });
    });

    // Experience suggestions
    if (extractedData.experience.totalYears < 2) {
      suggestions.push({
        type: 'experience',
        priority: 'high',
        title: 'Gain More Experience',
        description: 'Consider internships or freelance projects to build experience',
        estimatedTime: '6-12 months'
      });
    }

    // Certification suggestions
    if (extractedData.certifications.length === 0) {
      suggestions.push({
        type: 'certification',
        priority: 'medium',
        title: 'Get Certified',
        description: 'Add relevant certifications to validate your skills',
        estimatedTime: '3-6 months',
        resources: this.getRecommendedCertifications(extractedData.skills)
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Calculate market fit
   */
  async calculateMarketFit(extractedData, country) {
    try {
      // Get market data for the country
      const countryJobs = await Job.find({ country, isActive: true })
        .select('skills salaryMin salaryMax').lean();

      if (countryJobs.length === 0) {
        return { score: 50, level: 'moderate', insights: ['Limited market data available'] };
      }

      // Calculate skill demand match
      const marketSkills = {};
      countryJobs.forEach(job => {
        if (job.skills) {
          job.skills.forEach(skill => {
            marketSkills[skill] = (marketSkills[skill] || 0) + 1;
          });
        }
      });

      const userSkillDemand = extractedData.skills.reduce((sum, skill) => {
        return sum + (marketSkills[skill] || 0);
      }, 0);

      const maxPossibleDemand = extractedData.skills.length * Math.max(...Object.values(marketSkills));
      const skillFitScore = maxPossibleDemand > 0 ? (userSkillDemand / maxPossibleDemand) * 100 : 50;

      // Calculate salary fit
      const salaries = countryJobs
        .filter(job => job.salaryMin && job.salaryMax)
        .map(job => (job.salaryMin + job.salaryMax) / 2);

      const marketAvgSalary = salaries.length > 0 ? 
        salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length : 0;

      // Estimate user's potential salary based on skills and experience
      const estimatedSalary = this.estimateSalary(extractedData);

      const salaryFitScore = marketAvgSalary > 0 ? 
        Math.min(100, (estimatedSalary / marketAvgSalary) * 100) : 50;

      // Overall market fit
      const overallFit = Math.round((skillFitScore * 0.7) + (salaryFitScore * 0.3));

      return {
        score: overallFit,
        skillFit: Math.round(skillFitScore),
        salaryFit: Math.round(salaryFitScore),
        level: this.getMarketFitLevel(overallFit),
        estimatedSalary,
        marketAverageSalary: Math.round(marketAvgSalary),
        insights: this.generateMarketFitInsights(overallFit, skillFitScore, salaryFitScore)
      };

    } catch (error) {
      console.error('Market fit calculation error:', error);
      return { score: 50, level: 'moderate', insights: ['Error calculating market fit'] };
    }
  }

  /**
   * Helper methods
   */
  getSkillCategory(skill) {
    const categories = {
      'Frontend': ['React', 'Angular', 'Vue.js', 'TypeScript', 'HTML', 'CSS', 'JavaScript', 'SASS', 'Tailwind'],
      'Backend': ['Python', 'Node.js', 'Java', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Express', 'Django', 'Flask'],
      'Database': ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Elasticsearch', 'SQL', 'NoSQL'],
      'Cloud/DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Terraform', 'Linux'],
      'Data Science/AI': ['Machine Learning', 'TensorFlow', 'PyTorch', 'Data Science', 'Pandas', 'NumPy', 'NLP'],
      'Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Android', 'iOS']
    };

    for (const [category, skills] of Object.entries(categories)) {
      if (skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
        return category;
      }
    }
    return 'Other';
  }

  getSkillStrength(averageWeight) {
    if (averageWeight >= 0.85) return 'Excellent';
    if (averageWeight >= 0.75) return 'Strong';
    if (averageWeight >= 0.65) return 'Good';
    if (averageWeight >= 0.55) return 'Moderate';
    return 'Needs Improvement';
  }

  getExperienceLevel(years) {
    if (years >= 8) return 'senior';
    if (years >= 5) return 'mid-level';
    if (years >= 2) return 'junior';
    return 'entry-level';
  }

  generateExperienceInsights(experience) {
    const insights = [];
    if (experience.totalYears >= 5) {
      insights.push('Strong experience level - eligible for senior positions');
    } else if (experience.totalYears >= 2) {
      insights.push('Good experience level - eligible for mid-level positions');
    } else {
      insights.push('Entry-level experience - focus on gaining more experience');
    }
    return insights;
  }

  generateEducationInsights(education) {
    const insights = [];
    if (education.level === 'master' || education.level === 'phd') {
      insights.push('Advanced education - strong foundation for technical roles');
    } else if (education.level === 'bachelor') {
      insights.push('Standard education - meets most job requirements');
    } else {
      insights.push('Consider additional education or certifications');
    }
    return insights;
  }

  generateCertificationInsights(certifications) {
    const insights = [];
    if (certifications.length >= 3) {
      insights.push('Well-certified - demonstrates commitment to professional development');
    } else if (certifications.length >= 1) {
      insights.push('Good certification foundation');
    } else {
      insights.push('Consider adding relevant certifications');
    }
    return insights;
  }

  getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  getScoreLevel(score) {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 55) return 'Average';
    return 'Needs Improvement';
  }

  getCareerRequirements(career) {
    // This would typically come from AI Career Advisor
    const requirements = {
      'Data Scientist': {
        requiredSkills: ['Python', 'Machine Learning', 'Data Science', 'SQL', 'Statistics']
      },
      'Frontend Developer': {
        requiredSkills: ['JavaScript', 'React', 'CSS', 'HTML', 'TypeScript']
      },
      'Backend Developer': {
        requiredSkills: ['Python', 'Node.js', 'SQL', 'API', 'Docker']
      },
      'DevOps Engineer': {
        requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'Linux', 'CI/CD']
      },
      'Machine Learning Engineer': {
        requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'Deep Learning', 'Statistics']
      },
      'Full Stack Developer': {
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Python']
      }
    };

    return requirements[career] || { requiredSkills: [] };
  }

  getSkillImportance(skill, career) {
    const requirements = this.getCareerRequirements(career);
    const skillIndex = requirements.requiredSkills.indexOf(skill);
    return skillIndex === -1 ? 5 : (requirements.requiredSkills.length - skillIndex) * 10;
  }

  getLearningTime(skill) {
    const timeMap = {
      'Python': 2, 'JavaScript': 2, 'React': 3, 'Machine Learning': 4,
      'AWS': 3, 'Docker': 2, 'SQL': 1, 'Node.js': 2, 'TypeScript': 2
    };
    return timeMap[skill] || 3;
  }

  getLearningResources(skill) {
    return [
      { title: `${skill} - Complete Guide`, platform: 'Udemy', duration: '2-4 months' },
      { title: `${skill} Certification`, platform: 'Coursera', duration: '3-6 months' }
    ];
  }

  getRecommendedCertifications(skills) {
    const certMap = {
      'AWS': 'AWS Certified Solutions Architect',
      'Python': 'Python Institute Certification',
      'JavaScript': 'JavaScript Certification',
      'Docker': 'Docker Certified Associate'
    };

    return skills
      .filter(skill => certMap[skill])
      .map(skill => certMap[skill]);
  }

  estimateSalary(extractedData) {
    const baseSalary = 2000; // Base salary in USD
    const skillBonus = extractedData.skills.length * 200;
    const experienceBonus = extractedData.experience.totalYears * 300;
    const educationBonus = extractedData.education.weight * 500;
    const certificationBonus = extractedData.certifications.length * 300;

    return baseSalary + skillBonus + experienceBonus + educationBonus + certificationBonus;
  }

  getMarketFitLevel(score) {
    if (score >= 80) return 'Excellent Fit';
    if (score >= 65) return 'Good Fit';
    if (score >= 50) return 'Moderate Fit';
    return 'Poor Fit';
  }

  generateMarketFitInsights(overall, skillFit, salaryFit) {
    const insights = [];
    if (skillFit >= 75) {
      insights.push('Your skills match market demand well');
    } else {
      insights.push('Consider developing more in-demand skills');
    }
    
    if (salaryFit >= 75) {
      insights.push('Your salary expectations align with market rates');
    } else {
      insights.push('Research market rates for your skill level');
    }

    return insights;
  }
}

module.exports = new AIResumeAnalyzer();
