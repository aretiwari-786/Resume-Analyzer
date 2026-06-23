import spacy
import re
from utils.skills_db import SKILLS_DB

nlp = spacy.load("en_core_web_sm")

def extract_skills(text):
    text_lower = text.lower()
    found_skills = []
    
    for skill in SKILLS_DB:
        # Check if skill exists in text
        if skill.lower() in text_lower:
            found_skills.append(skill)
    
    # Remove duplicates and sort
    found_skills = list(set(found_skills))
    found_skills.sort()
    
    return found_skills

def extract_experience_years(text):
    text_lower = text.lower()
    
    # Patterns to find experience
    patterns = [
        r'(\d+)\+?\s*years?\s*of\s*experience',
        r'(\d+)\+?\s*years?\s*experience',
        r'experience\s*of\s*(\d+)\+?\s*years?',
        r'(\d+)\+?\s*yrs?\s*of\s*experience',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text_lower)
        if match:
            return int(match.group(1))
    
    # Check for fresher/student keywords
    fresher_keywords = ['fresher', 'student', 'intern', 
                        'graduate', 'pursuing', 'b.tech', 'bachelor']
    for keyword in fresher_keywords:
        if keyword in text_lower:
            return 0  # fresher
    
    return 0

def extract_education(text):
    text_lower = text.lower()
    
    education_levels = {
        'phd': ['phd', 'ph.d', 'doctorate'],
        'MASTER': ['master', 'm.tech', 'mtech', 'mba', 
                   'm.sc', 'msc', 'me ', 'm.e'],
        'BACHELOR': ['bachelor', 'b.tech', 'btech', 'b.e', 
                     'be ', 'b.sc', 'bsc', 'b.ca', 'bca'],
        'DIPLOMA': ['diploma', 'polytechnic'],
    }
    
    for level, keywords in education_levels.items():
        for keyword in keywords:
            if keyword in text_lower:
                return level
    
    return 'NOT FOUND'

def extract_all(text):
    skills = extract_skills(text)
    experience_years = extract_experience_years(text)
    education = extract_education(text)
    
    return {
        "skills": skills,
        "skills_count": len(skills),
        "experience_years": experience_years,
        "education": education
    }