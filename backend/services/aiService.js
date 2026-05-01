const axios = require('axios');

/**
 * AI Service for extracting skills from job descriptions
 */
class AIService {
  constructor() {
    // Predefined skill patterns for basic extraction
    this.skillPatterns = {
      programming: [
        'javascript', 'python', 'java', 'typescript', 'c++', 'c#', 'php', 'ruby',
        'go', 'rust', 'swift', 'kotlin', 'scala', 'perl', 'r', 'matlab'
      ],
      frontend: [
        'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt.js', 'html', 'css',
        'scss', 'sass', 'tailwind', 'bootstrap', 'jquery', 'webpack', 'vite'
      ],
      backend: [
        'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails',
        'fastapi', 'nest.js', 'graphql', 'rest api', 'microservices'
      ],
      database: [
        'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra',
        'dynamodb', 'firebase', 'sql', 'nosql', 'oracle', 'sql server'
      ],
      cloud: [
        'aws', 'azure', 'gcp', 'google cloud', 'heroku', 'digitalocean',
        'vercel', 'netlify', 'cloudflare', 'serverless'
      ],
      devops: [
        'docker', 'kubernetes', 'jenkins', 'gitlab ci', 'github actions',
        'terraform', 'ansible', 'puppet', 'chef', 'ci/cd', 'devops'
      ],
      mobile: [
        'react native', 'flutter', 'ios', 'android', 'swift', 'kotlin',
        'xamarin', 'cordova', 'ionic', 'unity'
      ],
      ai_ml: [
        'machine learning', 'artificial intelligence', 'deep learning', 'tensorflow',
        'pytorch', 'keras', 'scikit-learn', 'nlp', 'computer vision', 'pandas',
        'numpy', 'jupyter', 'data science'
      ],
      tools: [
        'git', 'github', 'gitlab', 'jira', 'trello', 'slack', 'vs code',
        'intellij', 'eclipse', 'postman', 'figma', 'sketch'
      ],
      methodologies: [
        'agile', 'scrum', 'kanban', 'waterfall', 'tdd', 'bdd', 'devops',
        'continuous integration', 'continuous deployment'
      ]
    };
  }

  /**
   * Extract skills from job description using AI
   * @param {string} description - Job description text
   * @returns {Promise<Array>} - Array of extracted skills
   */
  async extractSkills(description) {
    if (!description || typeof description !== 'string') {
      return [];
    }

    try {
      // First try local pattern matching
      const localSkills = this.extractSkillsLocally(description);
      
      // If OpenAI API is available, enhance with AI extraction
      if (process.env.OPENAI_API_KEY) {
        try {
          const aiSkills = await this.extractSkillsWithAI(description);
          // Merge and deduplicate skills
          const mergedSkills = [...new Set([...localSkills, ...aiSkills])];
          return mergedSkills;
        } catch (error) {
          console.log('AI extraction failed, using local patterns:', error.message);
          return localSkills;
        }
      }
      
      return localSkills;
      
    } catch (error) {
      console.error('Error extracting skills:', error);
      return [];
    }
  }

  /**
   * Extract skills using local pattern matching
   * @param {string} description - Job description text
   * @returns {Array} - Array of extracted skills
   */
  extractSkillsLocally(description) {
    const foundSkills = new Set();
    const text = description.toLowerCase();

    // Check each skill category
    for (const [category, skills] of Object.entries(this.skillPatterns)) {
      for (const skill of skills) {
        // Check for exact skill matches
        if (text.includes(skill)) {
          foundSkills.add(this.normalizeSkill(skill));
        }
        
        // Check for variations
        const variations = this.getSkillVariations(skill);
        for (const variation of variations) {
          if (text.includes(variation)) {
            foundSkills.add(this.normalizeSkill(skill));
          }
        }
      }
    }

    // Extract years of experience requirements
    const experienceMatches = description.match(/(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/gi);
    if (experienceMatches) {
      foundSkills.add('Experience Required');
    }

    // Extract degree requirements
    if (text.includes('bachelor') || text.includes('degree') || text.includes('bsc') || text.includes('b.s.')) {
      foundSkills.add('Bachelor Degree');
    }
    if (text.includes('master') || text.includes('msc') || text.includes('m.s.') || text.includes('graduate')) {
      foundSkills.add('Master Degree');
    }
    if (text.includes('phd') || text.includes('doctorate')) {
      foundSkills.add('PhD');
    }

    return Array.from(foundSkills).sort();
  }

  /**
   * Extract skills using OpenAI API
   * @param {string} description - Job description text
   * @returns {Promise<Array>} - Array of extracted skills
   */
  async extractSkillsWithAI(description) {
    const prompt = `
You are a technical recruiter assistant. Extract ONLY technical skills from this job description.

RULES:
1. Return ONLY a JSON array of skill names
2. NO explanation or commentary
3. NO soft skills (communication, teamwork, etc.)
4. Focus on: programming languages, frameworks, libraries, tools, platforms, methodologies
5. Use standard skill names (e.g., "JavaScript" not "js", "Node.js" not "nodejs")
6. Maximum 15 skills per job
7. Remove duplicates

Job Description:
${description}

Example output: ["JavaScript", "React", "Node.js", "AWS", "Docker", "MongoDB", "REST API", "Git", "Agile"]
`;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a technical recruiter assistant. Extract only technical skills from job descriptions and return them as a JSON array.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content.trim();
      
      // Parse JSON response
      try {
        const skills = JSON.parse(content);
        return Array.isArray(skills) ? skills : [];
      } catch (parseError) {
        // If JSON parsing fails, try to extract array-like content
        const arrayMatch = content.match(/\[(.*?)\]/);
        if (arrayMatch) {
          const items = arrayMatch[1].split(',').map(item => 
            item.replace(/['"]/g, '').trim()
          ).filter(item => item.length > 0);
          return items;
        }
        return [];
      }
      
    } catch (error) {
      console.error('OpenAI API error:', error.message);
      throw error;
    }
  }

  /**
   * Get variations of a skill name
   * @param {string} skill - Base skill name
   * @returns {Array} - Array of skill variations
   */
  getSkillVariations(skill) {
    const variations = [skill];
    
    // Add common variations
    if (skill.includes('.')) {
      variations.push(skill.replace('.', ''));
      variations.push(skill.replace('.', ' '));
    }
    
    if (skill.includes(' ')) {
      variations.push(skill.replace(' ', ''));
      variations.push(skill.replace(' ', '.'));
    }
    
    // Add case variations
    variations.push(skill.toUpperCase());
    variations.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    
    return variations;
  }

  /**
   * Normalize skill name
   * @param {string} skill - Raw skill name
   * @returns {string} - Normalized skill name
   */
  normalizeSkill(skill) {
    // Capitalize first letter of each word
    return skill.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }

  /**
   * Categorize skills
   * @param {Array} skills - Array of skills
   * @returns {Object} - Categorized skills
   */
  categorizeSkills(skills) {
    const categorized = {};
    
    for (const [category, categorySkills] of Object.entries(this.skillPatterns)) {
      categorized[category] = skills.filter(skill => 
        categorySkills.some(catSkill => 
          skill.toLowerCase().includes(catSkill.toLowerCase())
        )
      );
    }
    
    // Add uncategorized skills
    const allCategorySkills = Object.values(this.skillPatterns).flat();
    categorized.other = skills.filter(skill => 
      !allCategorySkills.some(catSkill => 
        skill.toLowerCase().includes(catSkill.toLowerCase())
      )
    );
    
    return categorized;
  }

  /**
   * Get skill popularity score
   * @param {string} skill - Skill name
   * @returns {number} - Popularity score (0-100)
   */
  getSkillPopularity(skill) {
    const popularSkills = [
      'javascript', 'python', 'java', 'react', 'node.js', 'aws', 'docker',
      'git', 'sql', 'html', 'css', 'typescript', 'angular', 'vue', 'mongodb'
    ];
    
    const index = popularSkills.findIndex(s => 
      s.toLowerCase() === skill.toLowerCase()
    );
    
    return index === -1 ? 50 : Math.max(0, 100 - (index * 5));
  }
}

const aiService = new AIService();
module.exports = {
  extractSkills: (description) => aiService.extractSkills(description),
  categorizeSkills: (skills) => aiService.categorizeSkills(skills),
  getSkillPopularity: (skill) => aiService.getSkillPopularity(skill)
};
