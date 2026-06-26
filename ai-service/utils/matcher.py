from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def calculate_match_score(resume_text, job_description):
    # Step 1: TF-IDF Vectorization
    # Convert both texts into numerical vectors
    vectorizer = TfidfVectorizer(
        stop_words='english',    # ignore common words like 'the', 'is'
        ngram_range=(1, 2),      # single words AND two-word phrases
        lowercase=True
    )

    # Fit vectorizer on both texts together
    tfidf_matrix = vectorizer.fit_transform([
        resume_text, 
        job_description
    ])

    # Step 2: Cosine Similarity
    # Measures angle between two vectors (0 = no match, 1 = perfect match)
    similarity_score = cosine_similarity(
        tfidf_matrix[0:1],   # resume vector
        tfidf_matrix[1:2]    # job description vector
    )[0][0]

    match_percentage = round(float(similarity_score) * 100, 2)

    # Step 3: Find Missing Keywords
    # Get all feature names (words) from vectorizer
    feature_names = vectorizer.get_feature_names_out()

    # Get TF-IDF scores for job description
    job_tfidf = tfidf_matrix[1].toarray()[0]

    # Get TF-IDF scores for resume
    resume_tfidf = tfidf_matrix[0].toarray()[0]

    # Find top 30 important words from job description
    top_indices = np.argsort(job_tfidf)[-30:][::-1]
    important_job_keywords = [feature_names[i] for i in top_indices]

    # Find which important job keywords are missing from resume
    missing_keywords = []
    for keyword in important_job_keywords:
        if keyword.lower() not in resume_text.lower():
            # Skip very short words
            if len(keyword) > 2:
                missing_keywords.append(keyword)

    # Return top 10 missing keywords
    missing_keywords = missing_keywords[:10]

    return {
        "match_percentage": match_percentage,
        "missing_keywords": missing_keywords
    }