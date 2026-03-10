"""
Job scraper for African job boards
"""

import requests
import time
import random
from typing import List, Dict, Any
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import json
from datetime import datetime


class JobScraper:
    """Scrapes job postings from various African job boards"""
    
    def __init__(self):
        """Initialize scraper with configuration"""
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # African job boards to scrape
        self.job_sources = {
            'jobberman': {
                'base_url': 'https://www.jobberman.com',
                'search_url': 'https://www.jobberman.com/search'
            },
            'careers24': {
                'base_url': 'https://www.careers24.com',
                'search_url': 'https://www.careers24.com/jobs'
            },
            'ngcareers': {
                'base_url': 'https://www.ngcareers.com',
                'search_url': 'https://www.ngcareers.com/jobs'
            }
        }
        
        # Tech keywords to filter relevant jobs
        self.tech_keywords = [
            'software', 'developer', 'engineer', 'data', 'python', 'javascript',
            'react', 'node', 'aws', 'cloud', 'devops', 'mobile', 'web',
            'frontend', 'backend', 'fullstack', 'ai', 'machine learning',
            'database', 'api', 'testing', 'ui', 'ux', 'product'
        ]
    
    def scrape_all_sources(self) -> List[Dict[str, Any]]:
        """Scrape job data from all configured sources"""
        all_jobs = []
        
        for source_name, source_config in self.job_sources.items():
            print(f"Scraping {source_name}...")
            try:
                jobs = self._scrape_source(source_name, source_config)
                all_jobs.extend(jobs)
                print(f"Found {len(jobs)} jobs from {source_name}")
                
                # Random delay to avoid being blocked
                time.sleep(random.uniform(1, 3))
                
            except Exception as e:
                print(f"Error scraping {source_name}: {e}")
                continue
        
        # Filter for tech jobs
        tech_jobs = self._filter_tech_jobs(all_jobs)
        print(f"Found {len(tech_jobs)} tech jobs total")
        
        return tech_jobs
    
    def _scrape_source(self, source_name: str, source_config: Dict) -> List[Dict[str, Any]]:
        """Scrape jobs from a specific source"""
        if source_name == 'jobberman':
            return self._scrape_jobberman(source_config)
        elif source_name == 'careers24':
            return self._scrape_careers24(source_config)
        elif source_name == 'ngcareers':
            return self._scrape_ngcareers(source_config)
        else:
            return []
    
    def _scrape_jobberman(self, config: Dict) -> List[Dict[str, Any]]:
        """Scrape jobs from Jobberman"""
        jobs = []
        
        # Search for tech jobs
        search_params = {
            'q': 'software developer',
            'page': 1
        }
        
        try:
            response = self.session.get(config['search_url'], params=search_params)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find job listings (this is a generic structure - would need actual inspection)
            job_cards = soup.find_all('div', class_='job-listing') or soup.find_all('article')
            
            for card in job_cards[:10]:  # Limit to 10 jobs for demo
                job = self._extract_job_data(card, config['base_url'])
                if job:
                    jobs.append(job)
                    
        except Exception as e:
            print(f"Error scraping Jobberman: {e}")
        
        return jobs
    
    def _scrape_careers24(self, config: Dict) -> List[Dict[str, Any]]:
        """Scrape jobs from Careers24"""
        jobs = []
        
        # Similar implementation for Careers24
        try:
            response = self.session.get(config['search_url'])
            soup = BeautifulSoup(response.content, 'html.parser')
            
            job_cards = soup.find_all('div', class_='job-card') or soup.find_all('li', class_='job')
            
            for card in job_cards[:10]:
                job = self._extract_job_data(card, config['base_url'])
                if job:
                    jobs.append(job)
                    
        except Exception as e:
            print(f"Error scraping Careers24: {e}")
        
        return jobs
    
    def _scrape_ngcareers(self, config: Dict) -> List[Dict[str, Any]]:
        """Scrape jobs from NG Careers"""
        jobs = []
        
        try:
            response = self.session.get(config['search_url'])
            soup = BeautifulSoup(response.content, 'html.parser')
            
            job_cards = soup.find_all('div', class_='job-item') or soup.find_all('tr')
            
            for card in job_cards[:10]:
                job = self._extract_job_data(card, config['base_url'])
                if job:
                    jobs.append(job)
                    
        except Exception as e:
            print(f"Error scraping NG Careers: {e}")
        
        return jobs
    
    def _extract_job_data(self, card, base_url: str) -> Dict[str, Any]:
        """Extract job data from a job card element"""
        try:
            # Generic extraction - would need to be adapted per site
            title_elem = card.find('h2') or card.find('h3') or card.find('a')
            company_elem = card.find('span', class_='company') or card.find('div', class_='company')
            location_elem = card.find('span', class_='location') or card.find('div', class_='location')
            salary_elem = card.find('span', class_='salary') or card.find('div', class_='salary')
            desc_elem = card.find('p') or card.find('div', class_='description')
            
            job = {
                'job_id': f"job_{hash(str(title_elem.text) + str(datetime.now()))}",
                'title': title_elem.text.strip() if title_elem else 'Unknown',
                'company': company_elem.text.strip() if company_elem else 'Unknown',
                'location': location_elem.text.strip() if location_elem else 'Unknown',
                'salary': salary_elem.text.strip() if salary_elem else None,
                'description': desc_elem.text.strip() if desc_elem else '',
                'scraped_at': datetime.utcnow().isoformat(),
                'source': base_url
            }
            
            # Extract country from location
            job['country'] = self._extract_country(job['location'])
            
            return job
            
        except Exception as e:
            print(f"Error extracting job data: {e}")
            return None
    
    def _extract_country(self, location: str) -> str:
        """Extract country from location string"""
        # African countries mapping
        countries = ['nigeria', 'kenya', 'south africa', 'ghana', 'egypt', 'morocco', 
                     'tanzania', 'ethiopia', 'uganda', 'algeria', 'sudan', 'zimbabwe']
        
        location_lower = location.lower()
        for country in countries:
            if country in location_lower:
                return country.title()
        
        return 'Unknown'
    
    def _filter_tech_jobs(self, jobs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Filter jobs to only include tech-related positions"""
        tech_jobs = []
        
        for job in jobs:
            title_lower = job.get('title', '').lower()
            desc_lower = job.get('description', '').lower()
            
            # Check if any tech keyword is in title or description
            is_tech_job = any(keyword in title_lower or keyword in desc_lower 
                            for keyword in self.tech_keywords)
            
            if is_tech_job:
                # Extract skills from description
                job['skills'] = self._extract_skills(job.get('description', ''))
                tech_jobs.append(job)
        
        return tech_jobs
    
    def _extract_skills(self, description: str) -> List[str]:
        """Extract technical skills from job description"""
        # Common tech skills to look for
        skill_patterns = [
            'python', 'java', 'javascript', 'react', 'nodejs', 'node.js', 'angular',
            'vue', 'html', 'css', 'sql', 'nosql', 'mongodb', 'mysql', 'postgresql',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'linux', 'ubuntu',
            'rest api', 'graphql', 'microservices', 'agile', 'scrum', 'ci/cd',
            'jenkins', 'terraform', 'ansible', 'typescript', 'php', 'ruby', 'rails',
            'django', 'flask', 'spring', 'laravel', 'express', 'next.js', 'nuxt.js'
        ]
        
        description_lower = description.lower()
        found_skills = []
        
        for skill in skill_patterns:
            if skill in description_lower:
                found_skills.append(skill.title())
        
        return list(set(found_skills))  # Remove duplicates
