"""
AI prediction model for skill demand trends
"""

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score
from datetime import datetime, timedelta
from typing import Dict, List, Any, Tuple
import joblib
import os


class SkillPredictor:
    """Predicts future skill demand trends using machine learning"""
    
    def __init__(self):
        """Initialize the predictor with models"""
        self.models = {}
        self.scalers = {}
        self.feature_columns = []
        self.predictions = {}
        
        # Model storage path
        self.model_path = os.path.join(os.path.dirname(__file__), 'saved_models')
        os.makedirs(self.model_path, exist_ok=True)
    
    def train(self, analyzed_data: Dict[str, Any]) -> Dict[str, Any]:
        """Train prediction models on historical data"""
        print("Training skill prediction models...")
        
        # Prepare training data
        training_data = self._prepare_training_data(analyzed_data)
        
        if training_data.empty:
            print("No training data available")
            return {}
        
        # Train models for different prediction horizons
        prediction_results = {}
        
        # 3-month prediction
        prediction_results['3_months'] = self._train_model(training_data, months_ahead=3)
        
        # 6-month prediction
        prediction_results['6_months'] = self._train_model(training_data, months_ahead=6)
        
        # 12-month prediction
        prediction_results['12_months'] = self._train_model(training_data, months_ahead=12)
        
        self.predictions = prediction_results
        return prediction_results
    
    def _prepare_training_data(self, analyzed_data: Dict[str, Any]) -> pd.DataFrame:
        """Prepare training data from analyzed job data"""
        jobs = analyzed_data.get('jobs', [])
        
        if not jobs:
            return pd.DataFrame()
        
        df = pd.DataFrame(jobs)
        
        # Create time-based features
        if 'scraped_at' in df.columns:
            df['date'] = pd.to_datetime(df['scraped_at'])
            df['year'] = df['date'].dt.year
            df['month'] = df['date'].dt.month
            df['quarter'] = df['date'].dt.quarter
            df['day_of_week'] = df['date'].dt.dayofweek
        else:
            # Generate synthetic time data for demo
            base_date = datetime.now() - timedelta(days=30)
            df['date'] = [base_date + timedelta(days=i) for i in range(len(df))]
            df['year'] = df['date'].dt.year
            df['month'] = df['date'].dt.month
            df['quarter'] = df['date'].dt.quarter
            df['day_of_week'] = df['date'].dt.dayofweek
        
        # Create skill features
        skill_data = []
        for _, row in df.iterrows():
            skills = row.get('skills', [])
            if isinstance(skills, list):
                for skill in skills:
                    skill_data.append({
                        'skill': skill.lower(),
                        'year': row['year'],
                        'month': row['month'],
                        'quarter': row['quarter'],
                        'day_of_week': row['day_of_week'],
                        'country': row.get('country', 'unknown'),
                        'seniority': self._extract_seniority(row.get('title', '')),
                        'demand': 1  # Each job posting represents 1 unit of demand
                    })
        
        if not skill_data:
            return pd.DataFrame()
        
        skill_df = pd.DataFrame(skill_data)
        
        # Aggregate by skill and time period
        skill_trends = skill_df.groupby(['skill', 'year', 'month', 'quarter']).agg({
            'demand': 'sum',
            'country': 'nunique',
            'seniority': lambda x: (x == 'senior').sum()
        }).reset_index()
        
        # Create lag features
        skill_trends = self._create_lag_features(skill_trends)
        
        return skill_trends
    
    def _extract_seniority(self, title: str) -> str:
        """Extract seniority level from job title"""
        title_lower = title.lower()
        
        if any(keyword in title_lower for keyword in ['junior', 'intern', 'trainee', 'entry']):
            return 'junior'
        elif any(keyword in title_lower for keyword in ['senior', 'lead', 'principal', 'architect']):
            return 'senior'
        else:
            return 'mid'
    
    def _create_lag_features(self, df: pd.DataFrame, lags: List[int] = [1, 2, 3]) -> pd.DataFrame:
        """Create lag features for time series prediction"""
        df_sorted = df.sort_values(['skill', 'year', 'month'])
        
        for lag in lags:
            df_sorted[f'demand_lag_{lag}'] = df_sorted.groupby('skill')['demand'].shift(lag)
            df_sorted[f'country_lag_{lag}'] = df_sorted.groupby('skill')['country'].shift(lag)
        
        # Fill NaN values with 0
        df_sorted = df_sorted.fillna(0)
        
        return df_sorted
    
    def _train_model(self, training_data: pd.DataFrame, months_ahead: int) -> Dict[str, Any]:
        """Train a prediction model for a specific time horizon"""
        if training_data.empty:
            return {}
        
        # Prepare features
        feature_cols = ['year', 'month', 'quarter', 'demand_lag_1', 'demand_lag_2', 'demand_lag_3']
        available_features = [col for col in feature_cols if col in training_data.columns]
        
        if not available_features:
            return {}
        
        predictions = {}
        
        # Train model for each skill separately
        for skill in training_data['skill'].unique():
            skill_data = training_data[training_data['skill'] == skill].copy()
            
            if len(skill_data) < 6:  # Need minimum data points
                continue
            
            X = skill_data[available_features]
            y = skill_data['demand']
            
            try:
                # Split data (use last 20% for testing)
                split_idx = int(len(X) * 0.8)
                X_train, X_test = X[:split_idx], X[split_idx:]
                y_train, y_test = y[:split_idx], y[split_idx:]
                
                # Train model
                model = RandomForestRegressor(n_estimators=100, random_state=42)
                model.fit(X_train, y_train)
                
                # Evaluate model
                y_pred = model.predict(X_test)
                mae = mean_absolute_error(y_test, y_pred)
                r2 = r2_score(y_test, y_pred)
                
                # Make future prediction
                future_features = self._create_future_features(skill_data, months_ahead, available_features)
                future_demand = model.predict(future_features)
                
                predictions[skill] = {
                    'current_demand': float(skill_data['demand'].iloc[-1]) if len(skill_data) > 0 else 0,
                    'predicted_demand': float(future_demand[0]) if len(future_demand) > 0 else 0,
                    'growth_rate': ((future_demand[0] - skill_data['demand'].iloc[-1]) / skill_data['demand'].iloc[-1] * 100) if len(skill_data) > 0 and skill_data['demand'].iloc[-1] > 0 else 0,
                    'confidence': float(r2),
                    'mae': float(mae),
                    'months_ahead': months_ahead
                }
                
            except Exception as e:
                print(f"Error training model for skill {skill}: {e}")
                continue
        
        return predictions
    
    def _create_future_features(self, skill_data: pd.DataFrame, months_ahead: int, feature_cols: List[str]) -> pd.DataFrame:
        """Create feature set for future prediction"""
        last_row = skill_data.iloc[-1].copy()
        
        # Calculate future date
        future_year = last_row['year']
        future_month = last_row['month'] + months_ahead
        
        while future_month > 12:
            future_month -= 12
            future_year += 1
        
        future_quarter = (future_month - 1) // 3 + 1
        
        # Create future features
        future_features = {}
        for col in feature_cols:
            if col == 'year':
                future_features[col] = future_year
            elif col == 'month':
                future_features[col] = future_month
            elif col == 'quarter':
                future_features[col] = future_quarter
            elif 'lag' in col:
                # Use recent lag values as approximation
                future_features[col] = last_row.get(col, 0)
            else:
                future_features[col] = last_row.get(col, 0)
        
        return pd.DataFrame([future_features])
    
    def get_predictions(self) -> Dict[str, Any]:
        """Get all predictions"""
        return self.predictions
    
    def get_top_growing_skills(self, horizon: str = '6_months', top_n: int = 10) -> List[Dict[str, Any]]:
        """Get top growing skills for a specific time horizon"""
        if horizon not in self.predictions:
            return []
        
        horizon_predictions = self.predictions[horizon]
        
        # Sort by growth rate
        sorted_skills = sorted(
            [(skill, data) for skill, data in horizon_predictions.items()],
            key=lambda x: x[1]['growth_rate'],
            reverse=True
        )
        
        return [
            {
                'skill': skill.title(),
                'current_demand': data['current_demand'],
                'predicted_demand': data['predicted_demand'],
                'growth_rate': data['growth_rate'],
                'confidence': data['confidence']
            }
            for skill, data in sorted_skills[:top_n]
        ]
    
    def save_models(self):
        """Save trained models to disk"""
        for skill, model in self.models.items():
            model_path = os.path.join(self.model_path, f'{skill}_model.joblib')
            joblib.dump(model, model_path)
    
    def load_models(self):
        """Load trained models from disk"""
        model_files = [f for f in os.listdir(self.model_path) if f.endswith('_model.joblib')]
        
        for model_file in model_files:
            skill = model_file.replace('_model.joblib', '')
            model_path = os.path.join(self.model_path, model_file)
            try:
                self.models[skill] = joblib.load(model_path)
            except Exception as e:
                print(f"Error loading model for {skill}: {e}")
