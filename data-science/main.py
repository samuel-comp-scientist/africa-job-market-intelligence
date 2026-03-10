#!/usr/bin/env python3
"""
African Job Market Intelligence Platform - Main Entry Point
Data Science Pipeline
"""

import os
import sys
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from scraper.job_scraper import JobScraper
from analysis.data_analyzer import DataAnalyzer
from models.skill_predictor import SkillPredictor
from utils.database import DatabaseManager


def main():
    """Main pipeline execution"""
    print("🚀 Starting African Job Market Intelligence Pipeline")
    
    # Initialize database connection
    db_manager = DatabaseManager()
    
    # Step 1: Scrape job data
    print("\n📊 Step 1: Scraping job postings...")
    scraper = JobScraper()
    job_data = scraper.scrape_all_sources()
    
    # Step 2: Analyze data
    print("\n🔍 Step 2: Analyzing job data...")
    analyzer = DataAnalyzer()
    analyzed_data = analyzer.analyze_jobs(job_data)
    
    # Step 3: Train prediction model
    print("\n🤖 Step 3: Training prediction model...")
    predictor = SkillPredictor()
    predictor.train(analyzed_data)
    
    # Step 4: Store results in database
    print("\n💾 Step 4: Storing results in database...")
    db_manager.store_job_data(analyzed_data)
    db_manager.store_predictions(predictor.get_predictions())
    
    print("\n✅ Pipeline completed successfully!")
    print(f"📈 Processed {len(job_data)} job postings")
    print(f"🎯 Identified {len(analyzed_data.get('skills', []))} unique skills")


if __name__ == "__main__":
    main()
