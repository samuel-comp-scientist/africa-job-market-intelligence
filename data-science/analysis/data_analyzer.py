"""
Data analysis module for job market intelligence
"""

import pandas as pd
import numpy as np
import re
from typing import Dict, List, Any, Tuple
from collections import Counter
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta


class DataAnalyzer:
    """Analyzes job data to extract insights and trends"""
    
    def __init__(self):
        """Initialize analyzer with configuration"""
        self.skill_categories = {
            'Programming Languages': ['python', 'java', 'javascript', 'typescript', 'php', 'ruby', 'go', 'rust'],
            'Frontend': ['react', 'angular', 'vue', 'html', 'css', 'sass', 'tailwind', 'bootstrap'],
            'Backend': ['nodejs', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'fastapi'],
            'Databases': ['sql', 'nosql', 'mongodb', 'mysql', 'postgresql', 'redis', 'elasticsearch'],
            'Cloud & DevOps': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins'],
            'Mobile': 'react native flutter swift kotlin android ios'.split(),
            'Data Science': ['machine learning', 'ai', 'data analysis', 'pandas', 'numpy', 'tensorflow', 'pytorch'],
            'Tools & Others': ['git', 'linux', 'agile', 'scrum', 'ci/cd', 'rest api', 'graphql', 'microservices']
        }
    
    def analyze_jobs(self, job_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Perform comprehensive analysis of job data"""
        if not job_data:
            return self._create_empty_analysis()
        
        # Convert to DataFrame for easier analysis
        df = pd.DataFrame(job_data)
        
        analysis = {
            'jobs': job_data,
            'summary': self._generate_summary(df),
            'skills': self._analyze_skills(df),
            'salary_analysis': self._analyze_salaries(df),
            'location_analysis': self._analyze_locations(df),
            'trends': self._analyze_trends(df),
            'job_categories': self._categorize_jobs(df)
        }
        
        return analysis
    
    def _create_empty_analysis(self) -> Dict[str, Any]:
        """Return empty analysis structure"""
        return {
            'jobs': [],
            'summary': {'total_jobs': 0, 'countries': 0, 'avg_salary': 0},
            'skills': [],
            'salary_analysis': {},
            'location_analysis': {},
            'trends': {},
            'job_categories': {}
        }
    
    def _generate_summary(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Generate summary statistics"""
        return {
            'total_jobs': len(df),
            'unique_companies': df['company'].nunique(),
            'countries': df['country'].nunique(),
            'top_countries': df['country'].value_counts().head(5).to_dict(),
            'date_range': {
                'earliest': df.get('scraped_at', pd.Series([datetime.now()])).min(),
                'latest': df.get('scraped_at', pd.Series([datetime.now()])).max()
            }
        }
    
    def _analyze_skills(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Analyze skill frequency and demand"""
        all_skills = []
        
        # Extract all skills from job listings
        for skills_list in df.get('skills', []):
            if isinstance(skills_list, list):
                all_skills.extend([skill.lower() for skill in skills_list])
        
        # Count skill frequency
        skill_counts = Counter(all_skills)
        
        # Categorize skills
        categorized_skills = {}
        for category, skills in self.skill_categories.items():
            category_count = sum(skill_counts.get(skill, 0) for skill in skills)
            categorized_skills[category] = category_count
        
        # Create skill ranking
        skill_ranking = []
        for skill, count in skill_counts.most_common(50):  # Top 50 skills
            category = self._get_skill_category(skill)
            skill_ranking.append({
                'skill': skill.title(),
                'count': count,
                'percentage': (count / len(df)) * 100 if len(df) > 0 else 0,
                'category': category
            })
        
        return skill_ranking
    
    def _get_skill_category(self, skill: str) -> str:
        """Get category for a given skill"""
        skill_lower = skill.lower()
        for category, skills in self.skill_categories.items():
            if any(skill_lower in s.lower() for s in skills):
                return category
        return 'Other'
    
    def _analyze_salaries(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze salary data"""
        salary_data = df[df['salary'].notna()].copy()
        
        if len(salary_data) == 0:
            return {'message': 'No salary data available'}
        
        # Extract numeric salary values
        salary_data['salary_numeric'] = salary_data['salary'].apply(self._extract_salary)
        salary_data = salary_data[salary_data['salary_numeric'].notna()]
        
        if len(salary_data) == 0:
            return {'message': 'No valid salary data found'}
        
        salary_stats = {
            'count': len(salary_data),
            'mean': float(salary_data['salary_numeric'].mean()),
            'median': float(salary_data['salary_numeric'].median()),
            'min': float(salary_data['salary_numeric'].min()),
            'max': float(salary_data['salary_numeric'].max()),
            'std': float(salary_data['salary_numeric'].std()),
            'by_country': salary_data.groupby('country')['salary_numeric'].agg(['mean', 'count']).to_dict(),
            'by_skill': self._analyze_salary_by_skill(salary_data)
        }
        
        return salary_stats
    
    def _extract_salary(self, salary_text: str) -> float:
        """Extract numeric salary from text"""
        if pd.isna(salary_text):
            return np.nan
        
        # Remove common currency symbols and text
        cleaned = re.sub(r'[^\d.]', '', str(salary_text))
        
        try:
            # Handle different salary formats (monthly, annual)
            salary_num = float(cleaned)
            
            # Convert to annual if it appears to be monthly
            if 'month' in str(salary_text).lower() or salary_num < 5000:
                salary_num *= 12
            
            return salary_num
        except:
            return np.nan
    
    def _analyze_salary_by_skill(self, salary_data: pd.DataFrame) -> Dict[str, Dict]:
        """Analyze average salary by skill"""
        skill_salaries = {}
        
        for _, row in salary_data.iterrows():
            skills = row.get('skills', [])
            salary = row['salary_numeric']
            
            if isinstance(skills, list):
                for skill in skills:
                    skill_lower = skill.lower()
                    if skill_lower not in skill_salaries:
                        skill_salaries[skill_lower] = []
                    skill_salaries[skill_lower].append(salary)
        
        # Calculate averages
        skill_salary_stats = {}
        for skill, salaries in skill_salaries.items():
            if len(salaries) >= 3:  # Only include skills with 3+ data points
                skill_salary_stats[skill] = {
                    'mean': float(np.mean(salaries)),
                    'median': float(np.median(salaries)),
                    'count': len(salaries)
                }
        
        return skill_salary_stats
    
    def _analyze_locations(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze job distribution by location"""
        location_stats = {
            'by_country': df['country'].value_counts().to_dict(),
            'top_cities': self._extract_top_cities(df),
            'country_distribution': (df['country'].value_counts(normalize=True) * 100).round(2).to_dict()
        }
        
        return location_stats
    
    def _extract_top_cities(self, df: pd.DataFrame) -> Dict[str, int]:
        """Extract top cities from location data"""
        cities = []
        
        for location in df.get('location', []):
            if pd.notna(location):
                # Extract city names (simplified)
                parts = str(location).split(',')
                if len(parts) > 0:
                    city = parts[0].strip()
                    if city and len(city) > 2:
                        cities.append(city)
        
        return dict(Counter(cities).most_common(10))
    
    def _analyze_trends(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze job market trends"""
        trends = {}
        
        # Skill trends over time (if we have time data)
        if 'scraped_at' in df.columns:
            df['date'] = pd.to_datetime(df['scraped_at']).dt.date
            trends['daily_postings'] = df.groupby('date').size().to_dict()
        
        # Emerging skills (skills in junior positions)
        junior_jobs = df[df['title'].str.contains('junior|intern|trainee|entry', case=False, na=False)]
        if len(junior_jobs) > 0:
            junior_skills = []
            for skills in junior_jobs.get('skills', []):
                if isinstance(skills, list):
                    junior_skills.extend([skill.lower() for skill in skills])
            
            trends['emerging_skills'] = dict(Counter(junior_skills).most_common(10))
        
        # High-demand skills (skills in senior positions)
        senior_jobs = df[df['title'].str.contains('senior|lead|principal|architect', case=False, na=False)]
        if len(senior_jobs) > 0:
            senior_skills = []
            for skills in senior_jobs.get('skills', []):
                if isinstance(skills, list):
                    senior_skills.extend([skill.lower() for skill in skills])
            
            trends['high_demand_skills'] = dict(Counter(senior_skills).most_common(10))
        
        return trends
    
    def _categorize_jobs(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Categorize jobs by type and seniority"""
        categories = {
            'by_seniority': {},
            'by_type': {},
            'by_category': {}
        }
        
        # Seniority classification
        seniority_keywords = {
            'Junior': ['junior', 'intern', 'trainee', 'entry', 'graduate'],
            'Mid-level': ['mid', 'intermediate', 'associate'],
            'Senior': ['senior', 'lead', 'principal', 'architect', 'head', 'director']
        }
        
        for level, keywords in seniority_keywords.items():
            jobs = df[df['title'].str.contains('|'.join(keywords), case=False, na=False)]
            categories['by_seniority'][level] = len(jobs)
        
        # Job type classification
        job_types = {
            'Full-time': ['full-time', 'permanent'],
            'Contract': ['contract', 'freelance'],
            'Remote': ['remote', 'work from home', 'wfh']
        }
        
        for job_type, keywords in job_types.items():
            jobs = df[df['title'].str.contains('|'.join(keywords), case=False, na=False) | 
                     df['description'].str.contains('|'.join(keywords), case=False, na=False)]
            categories['by_type'][job_type] = len(jobs)
        
        return categories
