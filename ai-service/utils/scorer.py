def calculate_resume_score(skills, experience_years, education, match_percentage):
    score_breakdown = {}

    # 1. Skills Score (30 points)
    # More relevant skills = higher score
    skills_score = min(len(skills) * 2, 30)
    score_breakdown['skills'] = round(skills_score, 1)

    # 2. Experience Score (25 points)
    if experience_years >= 5:
        exp_score = 25
    elif experience_years >= 3:
        exp_score = 20
    elif experience_years >= 1:
        exp_score = 15
    else:
        # Fresher — check if they have projects
        exp_score = 10
    score_breakdown['experience'] = exp_score

    # 3. Education Score (20 points)
    education_scores = {
        'PHD': 20,
        'MASTER': 18,
        'BACHELOR': 15,
        'DIPLOMA': 10,
        'NOT FOUND': 5
    }
    edu_score = education_scores.get(education.upper(), 10)
    score_breakdown['education'] = edu_score

    # 4. Job Match Score (25 points)
    # Based on cosine similarity match percentage
    match_score = round((match_percentage / 100) * 25, 1)
    score_breakdown['job_match'] = match_score

    # Total Score
    total = sum([
        score_breakdown['skills'],
        score_breakdown['experience'],
        score_breakdown['education'],
        score_breakdown['job_match']
    ])
    total = round(total, 1)
    score_breakdown['total'] = total

    # Grade
    if total >= 80:
        grade = 'Excellent'
        emoji = '⭐⭐⭐'
    elif total >= 60:
        grade = 'Good'
        emoji = '⭐⭐'
    elif total >= 40:
        grade = 'Average'
        emoji = '⭐'
    else:
        grade = 'Needs Improvement'
        emoji = '📈'

    score_breakdown['grade'] = grade
    score_breakdown['emoji'] = emoji

    return score_breakdown