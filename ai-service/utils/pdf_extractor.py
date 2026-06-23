import pdfplumber
import re

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return ""
    
    # Clean the text
    text = clean_text(text)
    return text.strip()

def clean_text(text):
    # Add space before capital letters (fixes joined words)
    text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters but keep important ones
    text = re.sub(r'[^\w\s\.\,\+\#\-\@]', ' ', text)
    return text