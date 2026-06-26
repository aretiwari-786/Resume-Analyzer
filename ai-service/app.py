from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.pdf_extractor import extract_text_from_pdf
from utils.skill_extractor import extract_all
from utils.matcher import calculate_match_score
from utils.role_classifier import predict_role, train_model

app = Flask(__name__)
CORS(app)

# Train model on startup
print("Training role classifier model...")
train_model()
print("Model ready! ✅")

@app.route('/')
def home():
    return jsonify({"message": "ML Service Running! ✅"})

@app.route('/extract', methods=['POST'])
def extract():
    try:
        data = request.json
        pdf_path = data.get('pdf_path')

        if not pdf_path:
            return jsonify({"error": "No PDF path provided"}), 400

        text = extract_text_from_pdf(pdf_path)

        if not text:
            return jsonify({"error": "Could not extract text from PDF"}), 400

        return jsonify({
            "success": True,
            "text": text,
            "word_count": len(text.split())
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/extract-skills', methods=['POST'])
def extract_skills_route():
    try:
        data = request.json
        text = data.get('text', '')

        if not text:
            return jsonify({"error": "No text provided"}), 400

        result = extract_all(text)

        return jsonify({
            "success": True,
            **result
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/match', methods=['POST'])
def match():
    try:
        data = request.json
        resume_text = data.get('resume_text', '')
        job_description = data.get('job_description', '')

        if not resume_text or not job_description:
            return jsonify({"error": "Both resume text and job description required"}), 400

        result = calculate_match_score(resume_text, job_description)

        return jsonify({
            "success": True,
            **result
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict-role', methods=['POST'])
def predict_role_route():
    try:
        data = request.json
        resume_text = data.get('resume_text', '')

        if not resume_text:
            return jsonify({"error": "No resume text provided"}), 400

        result = predict_role(resume_text)

        return jsonify({
            "success": True,
            **result
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=8000, debug=True)