"""
Database utilities for MongoDB connection and operations
"""

import os
from datetime import datetime
from typing import Dict, List, Any
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()


class DatabaseManager:
    """Manages MongoDB operations for the job market platform"""
    
    def __init__(self):
        """Initialize database connection"""
        self.mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
        self.client = MongoClient(self.mongo_uri)
        self.db = self.client['african_job_market']
        
        # Collections
        self.jobs_collection = self.db['jobs']
        self.skills_collection = self.db['skills']
        self.salaries_collection = self.db['salaries']
        self.predictions_collection = self.db['predictions']
    
    def store_job_data(self, job_data: Dict[str, Any]) -> str:
        """Store analyzed job data in database"""
        try:
            # Store individual jobs
            if 'jobs' in job_data:
                for job in job_data['jobs']:
                    job['created_at'] = datetime.utcnow()
                    self.jobs_collection.replace_one(
                        {'job_id': job.get('job_id')},
                        job,
                        upsert=True
                    )
            
            # Store skills data
            if 'skills' in job_data:
                skills_doc = {
                    'skills': job_data['skills'],
                    'updated_at': datetime.utcnow()
                }
                self.skills_collection.replace_one(
                    {'type': 'skill_frequency'},
                    skills_doc,
                    upsert=True
                )
            
            # Store salary data
            if 'salary_analysis' in job_data:
                salary_doc = {
                    'analysis': job_data['salary_analysis'],
                    'updated_at': datetime.utcnow()
                }
                self.salaries_collection.replace_one(
                    {'type': 'salary_stats'},
                    salary_doc,
                    upsert=True
                )
            
            return "Data stored successfully"
            
        except Exception as e:
            print(f"Error storing job data: {e}")
            return f"Error: {e}"
    
    def store_predictions(self, predictions: Dict[str, Any]) -> str:
        """Store AI predictions in database"""
        try:
            prediction_doc = {
                'predictions': predictions,
                'created_at': datetime.utcnow(),
                'model_version': '1.0'
            }
            
            self.predictions_collection.insert_one(prediction_doc)
            return "Predictions stored successfully"
            
        except Exception as e:
            print(f"Error storing predictions: {e}")
            return f"Error: {e}"
    
    def get_jobs(self, limit: int = 100) -> List[Dict]:
        """Retrieve job postings from database"""
        return list(self.jobs_collection.find().limit(limit))
    
    def get_top_skills(self, limit: int = 20) -> List[Dict]:
        """Get top demanded skills"""
        skills_doc = self.skills_collection.find_one({'type': 'skill_frequency'})
        if skills_doc and 'skills' in skills_doc:
            return skills_doc['skills'][:limit]
        return []
    
    def get_salary_analytics(self) -> Dict:
        """Get salary analysis data"""
        salary_doc = self.salaries_collection.find_one({'type': 'salary_stats'})
        if salary_doc and 'analysis' in salary_doc:
            return salary_doc['analysis']
        return {}
    
    def get_predictions(self) -> Dict:
        """Get latest AI predictions"""
        latest_prediction = self.predictions_collection.find_one(
            sort=[('created_at', -1)]
        )
        if latest_prediction and 'predictions' in latest_prediction:
            return latest_prediction['predictions']
        return {}
    
    def close_connection(self):
        """Close database connection"""
        self.client.close()
