from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle
import os

# Training Data — resume keywords mapped to job roles
# More data = better accuracy
TRAINING_DATA = [
    # Full Stack Developer
    ("react node express mongodb javascript html css rest api jwt", "Full Stack Developer"),
    ("mern stack react.js node.js express.js mongodb javascript", "Full Stack Developer"),
    ("full stack react node mongodb express javascript tailwind", "Full Stack Developer"),
    ("react redux node.js mongodb rest api javascript html css", "Full Stack Developer"),
    ("next.js react node express mongodb javascript typescript", "Full Stack Developer"),

    # Frontend Developer
    ("react javascript html css tailwind bootstrap ui ux", "Frontend Developer"),
    ("vue.js angular react javascript html css sass frontend", "Frontend Developer"),
    ("react.js redux html css javascript responsive design", "Frontend Developer"),
    ("javascript typescript react html css bootstrap figma", "Frontend Developer"),
    ("next.js react typescript tailwind css javascript frontend", "Frontend Developer"),

    # Backend Developer
    ("python flask django rest api postgresql mysql backend", "Backend Developer"),
    ("java spring boot microservices rest api mysql docker", "Backend Developer"),
    ("node.js express mongodb rest api jwt authentication", "Backend Developer"),
    ("python fastapi postgresql redis docker kubernetes backend", "Backend Developer"),
    ("java spring microservices kafka postgresql docker aws", "Backend Developer"),

    # ML Engineer
    ("python machine learning deep learning tensorflow pytorch", "ML Engineer"),
    ("neural networks computer vision nlp transformers bert", "ML Engineer"),
    ("scikit-learn pandas numpy matplotlib machine learning", "ML Engineer"),
    ("deep learning cnn rnn lstm pytorch tensorflow keras", "ML Engineer"),
    ("natural language processing nlp huggingface transformers", "ML Engineer"),
    ("computer vision yolo opencv image classification detection", "ML Engineer"),
    ("machine learning scikit-learn feature engineering model", "ML Engineer"),

    # Data Analyst
    ("sql excel powerbi tableau data analysis visualization", "Data Analyst"),
    ("python pandas numpy matplotlib seaborn data analysis", "Data Analyst"),
    ("sql mysql postgresql data analysis business intelligence", "Data Analyst"),
    ("excel powerbi data visualization dashboard reporting", "Data Analyst"),
    ("tableau power bi sql data analytics business insights", "Data Analyst"),

    # DevOps Engineer
    ("docker kubernetes aws azure ci/cd jenkins devops", "DevOps Engineer"),
    ("aws ec2 s3 lambda docker kubernetes terraform devops", "DevOps Engineer"),
    ("linux bash docker kubernetes jenkins ci/cd pipeline", "DevOps Engineer"),
    ("azure devops docker kubernetes terraform ansible cloud", "DevOps Engineer"),

    # Mobile Developer
    ("android kotlin java mobile app development firebase", "Mobile Developer"),
    ("ios swift xcode mobile app development objective-c", "Mobile Developer"),
    ("react native flutter mobile android ios javascript", "Mobile Developer"),
    ("flutter dart android ios mobile app firebase", "Mobile Developer"),
]

MODEL_PATH = 'models/role_classifier.pkl'

def train_model():
    texts = [item[0] for item in TRAINING_DATA]
    labels = [item[1] for item in TRAINING_DATA]

    # Split data for training and testing
    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.2, random_state=42
    )

    # Pipeline: TF-IDF + Logistic Regression
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            max_features=500
        )),
        ('clf', LogisticRegression(
            max_iter=1000,
            random_state=42
        ))
    ])

    # Train the model
    pipeline.fit(X_train, y_train)

    # Check accuracy
    y_pred = pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy * 100:.1f}%")

    # Save model to disk
    os.makedirs('models', exist_ok=True)
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(pipeline, f)

    print("Model saved successfully! ✅")
    return pipeline

def load_model():
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'rb') as f:
            return pickle.load(f)
    else:
        print("No model found, training new model...")
        return train_model()

def predict_role(resume_text):
    pipeline = load_model()

    # Predict the role
    predicted_role = pipeline.predict([resume_text])[0]

    # Get confidence scores for all roles
    probabilities = pipeline.predict_proba([resume_text])[0]
    classes = pipeline.classes_

    # Top 3 predictions with confidence
    top_indices = probabilities.argsort()[-3:][::-1]
    top_roles = [
        {
            "role": classes[i],
            "confidence": round(float(probabilities[i]) * 100, 1)
        }
        for i in top_indices
    ]

    return {
        "predicted_role": predicted_role,
        "top_roles": top_roles
    }