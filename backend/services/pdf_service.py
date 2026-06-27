import fitz # PyMuPDF

class PDFService:

    @staticmethod
    def extract_text(filepath):
        pdf = fitz.open(filepath)

        text = []

        try:
            for page in pdf:
                text.append(page.get_text())
        finally:
            pdf.close()
            
        return "\n".join(text)