const Job = require('../models/Job');
const User = require('../models/User');

/**
 * Job Market Forecasting - AI-powered predictions
 */
class JobMarketForecasting {
  constructor() {
    this.forecastModels = {
      linear: this.linearRegression,
      movingAverage: this.movingAverage,
      exponential: this.exponentialSmoothing,
      seasonal: this.seasonalDecomposition
    };

    this.skillCategories = {
      'AI/ML': ['Machine Learning', 'TensorFlow', 'PyTorch', 'Deep Learning', 'AI', 'NLP'],
      'Cloud Computing': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Cloud'],
      'Frontend': ['React', 'Angular', 'Vue.js', 'TypeScript', 'JavaScript'],
      'Backend': ['Python', 'Node.js', 'Java', 'C#', 'Go', 'Rust'],
      'DevOps': ['DevOps', 'CI/CD', 'Jenkins', 'Terraform', 'Linux'],
      'Data Science': ['Data Science', 'Pandas', 'NumPy', 'Statistics', 'Analytics'],
      'Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Android'],
      'Database': ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'SQL']
    };
  }

  /**
   * Generate comprehensive job market forecast
   */
  async generateMarketForecast(timeframe = '12months') {
    try {
      const historicalData = await this.getHistoricalData();
      
      // Skill demand forecasts
      const skillForecasts = await this.forecastSkillDemand(historicalData, timeframe);
      
      // Job market growth predictions
      const marketGrowth = await this.predictMarketGrowth(historicalData, timeframe);
      
      // Emerging technology predictions
      const emergingTech = await this.predictEmergingTech(historicalData, timeframe);
      
      // Regional forecasts
      const regionalForecasts = await this.generateRegionalForecasts(historicalData, timeframe);
      
      // Salary trend predictions
      const salaryForecasts = await this.predictSalaryTrends(historicalData, timeframe);

      return {
        timeframe,
        skillForecasts,
        marketGrowth,
        emergingTech,
        regionalForecasts,
        salaryForecasts,
        confidence: this.calculateForecastConfidence(historicalData),
        generatedAt: new Date()
      };

    } catch (error) {
      console.error('Forecast generation error:', error);
      throw error;
    }
  }

  /**
   * Get historical data for forecasting
   */
  async getHistoricalData() {
    const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
    
    const jobs = await Job.find({
      postedDate: { $gte: sixMonthsAgo },
      isActive: true
    }).select('postedDate skills salaryMin salaryMax country jobTitle').lean();

    // Group by month
    const monthlyData = {};
    
    jobs.forEach(job => {
      const month = new Date(job.postedDate).toISOString().substring(0, 7); // YYYY-MM
      
      if (!monthlyData[month]) {
        monthlyData[month] = {
          month,
          totalJobs: 0,
          skills: {},
          salaries: [],
          countries: {},
          categories: {}
        };
      }

      monthlyData[month].totalJobs++;
      
      // Track skills
      if (job.skills && Array.isArray(job.skills)) {
        job.skills.forEach(skill => {
          monthlyData[month].skills[skill] = (monthlyData[month].skills[skill] || 0) + 1;
          
          // Track categories
          const category = this.getSkillCategory(skill);
          if (category) {
            monthlyData[month].categories[category] = (monthlyData[month].categories[category] || 0) + 1;
          }
        });
      }
      
      // Track salaries
      if (job.salaryMin && job.salaryMax) {
        const avgSalary = (job.salaryMin + job.salaryMax) / 2;
        monthlyData[month].salaries.push(avgSalary);
      }
      
      // Track countries
      if (job.country) {
        monthlyData[month].countries[job.country] = (monthlyData[month].countries[job.country] || 0) + 1;
      }
    });

    // Convert to array and sort by month
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  }

  /**
   * Forecast skill demand
   */
  async forecastSkillDemand(historicalData, timeframe) {
    const skillForecasts = {};
    
    // Get all unique skills
    const allSkills = new Set();
    historicalData.forEach(month => {
      Object.keys(month.skills).forEach(skill => allSkills.add(skill));
    });

    // Forecast each skill
    for (const skill of allSkills) {
      const timeSeries = historicalData.map(month => ({
        month: month.month,
        count: month.skills[skill] || 0
      }));

      const forecast = this.applyForecastModel(timeSeries, timeframe);
      
      skillForecasts[skill] = {
        current: timeSeries[timeSeries.length - 1]?.count || 0,
        predicted: forecast.predicted,
        trend: forecast.trend,
        growthRate: forecast.growthRate,
        confidence: forecast.confidence,
        category: this.getSkillCategory(skill)
      };
    }

    // Sort by predicted demand
    const sortedSkills = Object.entries(skillForecasts)
      .sort(([,a], [,b]) => b.predicted - a.predicted)
      .slice(0, 20)
      .map(([skill, data]) => ({ skill, ...data }));

    return {
      topSkills: sortedSkills,
      byCategory: this.groupSkillsByCategory(skillForecasts),
      insights: this.generateSkillInsights(sortedSkills)
    };
  }

  /**
   * Predict overall market growth
   */
  async predictMarketGrowth(historicalData, timeframe) {
    const jobCounts = historicalData.map(month => month.totalJobs);
    const months = historicalData.map(month => month.month);
    
    const forecast = this.applyForecastModel(
      months.map((month, index) => ({ month, count: jobCounts[index] })),
      timeframe
    );

    // Calculate growth metrics
    const currentMonth = jobCounts[jobCounts.length - 1] || 0;
    const previousMonth = jobCounts[jobCounts.length - 2] || 0;
    const monthOverMonthGrowth = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;

    return {
      current: currentMonth,
      predicted: forecast.predicted,
      trend: forecast.trend,
      growthRate: forecast.growthRate,
      monthOverMonthGrowth: Math.round(monthOverMonthGrowth * 10) / 10,
      quarterlyProjection: Math.round(forecast.predicted * 3),
      annualProjection: Math.round(forecast.predicted * 12),
      marketPhase: this.determineMarketPhase(forecast.growthRate)
    };
  }

  /**
   * Predict emerging technologies
   */
  async predictEmergingTech(historicalData, timeframe) {
    const categoryTrends = {};
    
    // Calculate growth for each category
    Object.keys(this.skillCategories).forEach(category => {
      const categoryData = historicalData.map(month => ({
        month: month.month,
        count: month.categories[category] || 0
      }));

      const forecast = this.applyForecastModel(categoryData, timeframe);
      
      categoryTrends[category] = {
        current: categoryData[categoryData.length - 1]?.count || 0,
        predicted: forecast.predicted,
        growthRate: forecast.growthRate,
        trend: forecast.trend
      };
    });

    // Sort by growth rate
    const emergingCategories = Object.entries(categoryTrends)
      .sort(([,a], [,b]) => b.growthRate - a.growthRate)
      .slice(0, 5)
      .map(([category, data]) => ({ category, ...data }));

    return {
      emergingCategories,
      insights: this.generateEmergingTechInsights(emergingCategories),
      nextBigThings: this.predictNextBigThings(categoryTrends)
    };
  }

  /**
   * Generate regional forecasts
   */
  async generateRegionalForecasts(historicalData, timeframe) {
    const regionalData = {};
    
    // Aggregate data by region
    const regions = {
      'West Africa': ['Nigeria', 'Ghana', 'Ivory Coast'],
      'East Africa': ['Kenya', 'Uganda', 'Tanzania', 'Rwanda'],
      'Southern Africa': ['South Africa', 'Zimbabwe', 'Botswana'],
      'North Africa': ['Egypt', 'Morocco', 'Tunisia']
    };

    Object.entries(regions).forEach(([region, countries]) => {
      const regionTimeSeries = historicalData.map(month => {
        const regionCount = countries.reduce((sum, country) => 
          sum + (month.countries[country] || 0), 0
        );
        
        return {
          month: month.month,
          count: regionCount
        };
      });

      const forecast = this.applyForecastModel(regionTimeSeries, timeframe);
      
      regionalData[region] = {
        current: regionTimeSeries[regionTimeSeries.length - 1]?.count || 0,
        predicted: forecast.predicted,
        growthRate: forecast.growthRate,
        trend: forecast.trend,
        countries: countries
      };
    });

    return {
      regions: regionalData,
      fastestGrowing: Object.entries(regionalData)
        .sort(([,a], [,b]) => b.growthRate - a.growthRate)[0],
      insights: this.generateRegionalInsights(regionalData)
    };
  }

  /**
   * Predict salary trends
   */
  async predictSalaryTrends(historicalData, timeframe) {
    const salaryData = historicalData.map(month => {
      if (month.salaries.length === 0) return null;
      
      const avgSalary = month.salaries.reduce((sum, salary) => sum + salary, 0) / month.salaries.length;
      return {
        month: month.month,
        avgSalary: Math.round(avgSalary)
      };
    }).filter(Boolean);

    if (salaryData.length < 2) {
      return { current: 0, predicted: 0, trend: 'stable', growthRate: 0 };
    }

    const forecast = this.applyForecastModel(salaryData, timeframe);

    // Calculate skill-specific salary trends
    const skillSalaryTrends = await this.calculateSkillSalaryTrends();

    return {
      current: salaryData[salaryData.length - 1]?.avgSalary || 0,
      predicted: Math.round(forecast.predicted),
      trend: forecast.trend,
      growthRate: forecast.growthRate,
      bySkill: skillSalaryTrends,
      inflationAdjusted: this.calculateInflationAdjustedForecast(forecast.predicted, forecast.growthRate)
    };
  }

  /**
   * Apply forecasting model to time series data
   */
  applyForecastModel(timeSeries, timeframe) {
    if (timeSeries.length < 2) {
      return {
        predicted: timeSeries[0]?.count || 0,
        trend: 'stable',
        growthRate: 0,
        confidence: 0
      };
    }

    // Use linear regression for simplicity
    const n = timeSeries.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = timeSeries.map(point => point.count);

    // Calculate linear regression
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumX2 = x.reduce((sum, val) => sum + val * val, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predict future value
    const futureX = n + this.getTimeframeMonths(timeframe);
    const predicted = Math.max(0, slope * futureX + intercept);

    // Calculate trend and growth rate
    const current = y[y.length - 1];
    const previous = y[y.length - 2] || 1;
    const growthRate = ((current - previous) / previous) * 100;

    let trend = 'stable';
    if (growthRate > 10) trend = 'increasing';
    else if (growthRate < -10) trend = 'decreasing';

    // Calculate confidence based on data consistency
    const confidence = this.calculateModelConfidence(y, slope, intercept);

    return {
      predicted: Math.round(predicted),
      trend,
      growthRate: Math.round(growthRate * 10) / 10,
      confidence,
      model: 'linear_regression'
    };
  }

  /**
   * Linear regression implementation
   */
  linearRegression(data) {
    // Implementation for linear regression
    const n = data.length;
    if (n < 2) return { slope: 0, intercept: 0 };

    const x = Array.from({ length: n }, (_, i) => i);
    const y = data.map(point => point.count);

    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumX2 = x.reduce((sum, val) => sum + val * val, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  /**
   * Moving average implementation
   */
  movingAverage(data, window = 3) {
    const result = [];
    for (let i = window - 1; i < data.length; i++) {
      const avg = data.slice(i - window + 1, i + 1).reduce((sum, point) => sum + point.count, 0) / window;
      result.push({ month: data[i].month, count: Math.round(avg) });
    }
    return result;
  }

  /**
   * Exponential smoothing implementation
   */
  exponentialSmoothing(data, alpha = 0.3) {
    const result = [];
    let smoothed = data[0].count;

    data.forEach((point, index) => {
      if (index === 0) {
        smoothed = point.count;
      } else {
        smoothed = alpha * point.count + (1 - alpha) * smoothed;
      }
      result.push({ month: point.month, count: Math.round(smoothed) });
    });

    return result;
  }

  /**
   * Helper methods
   */
  getSkillCategory(skill) {
    for (const [category, skills] of Object.entries(this.skillCategories)) {
      if (skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
        return category;
      }
    }
    return 'Other';
  }

  groupSkillsByCategory(skillForecasts) {
    const grouped = {};
    Object.entries(skillForecasts).forEach(([skill, data]) => {
      const category = data.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push({ skill, ...data });
    });

    // Sort each category by predicted demand
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => b.predicted - a.predicted);
    });

    return grouped;
  }

  generateSkillInsights(topSkills) {
    const insights = [];

    // Top growing skill
    const topGrowing = topSkills.filter(skill => skill.growthRate > 10).slice(0, 3);
    if (topGrowing.length > 0) {
      insights.push(`Fastest growing skills: ${topGrowing.map(s => s.skill).join(', ')}`);
    }

    // High demand skills
    const highDemand = topSkills.filter(skill => skill.predicted > 50).slice(0, 3);
    if (highDemand.length > 0) {
      insights.push(`Highest demand: ${highDemand.map(s => s.skill).join(', ')}`);
    }

    return insights;
  }

  generateEmergingTechInsights(emergingCategories) {
    return emergingCategories.map(category => 
      `${category.category} is showing ${category.trend} trend with ${category.growthRate.toFixed(1)}% growth`
    );
  }

  predictNextBigThings(categoryTrends) {
    return Object.entries(categoryTrends)
      .filter(([, data]) => data.growthRate > 20)
      .sort(([,a], [,b]) => b.growthRate - a.growthRate)
      .slice(0, 3)
      .map(([category]) => category);
  }

  generateRegionalInsights(regionalData) {
    const insights = [];
    
    const fastestGrowing = Object.entries(regionalData)
      .sort(([,a], [,b]) => b.growthRate - a.growthRate)[0];
    
    if (fastestGrowing) {
      insights.push(`${fastestGrowing[0]} is the fastest growing region with ${fastestGrowing[1].growthRate.toFixed(1)}% growth`);
    }

    return insights;
  }

  async calculateSkillSalaryTrends() {
    // This would analyze salary trends by skill
    // For now, return placeholder data
    return {
      'Python': { current: 2500, predicted: 2800, growthRate: 12 },
      'React': { current: 2200, predicted: 2400, growthRate: 9 },
      'AWS': { current: 3000, predicted: 3400, growthRate: 13 }
    };
  }

  calculateInflationAdjustedForecast(predicted, growthRate) {
    const inflationRate = 0.06; // 6% inflation assumption
    const realGrowthRate = growthRate - inflationRate;
    return Math.round(predicted * (1 + realGrowthRate / 100));
  }

  getTimeframeMonths(timeframe) {
    const mapping = {
      '3months': 3,
      '6months': 6,
      '12months': 12,
      '24months': 24
    };
    return mapping[timeframe] || 12;
  }

  determineMarketPhase(growthRate) {
    if (growthRate > 15) return 'Rapid Expansion';
    if (growthRate > 5) return 'Growth';
    if (growthRate > -5) return 'Stable';
    return 'Contraction';
  }

  calculateModelConfidence(y, slope, intercept) {
    // Calculate R-squared as confidence measure
    const n = y.length;
    if (n < 3) return 50;

    const mean = y.reduce((sum, val) => sum + val, 0) / n;
    const totalSumSquares = y.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
    
    let residualSumSquares = 0;
    y.forEach((val, i) => {
      const predicted = slope * i + intercept;
      residualSumSquares += Math.pow(val - predicted, 2);
    });

    const rSquared = 1 - (residualSumSquares / totalSumSquares);
    return Math.max(0, Math.min(100, rSquared * 100));
  }

  calculateForecastConfidence(historicalData) {
    if (historicalData.length < 3) return 50;
    if (historicalData.length >= 6) return 85;
    return 70;
  }
}

module.exports = new JobMarketForecasting();
