from flask import Flask, jsonify, request
from flask_cors import CORS
from fpdf import FPDF
import io
from supabase import create_client
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Supabase Configuration
SUPABASE_URL = 'https://ufernctpquewhxmrjyjr.supabase.co'
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZXJuY3RwcXVld2h4bXJqeWpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDI5MTAyNywiZXhwIjoyMDU1ODY3MDI3fQ.RQfd2TxV-mF_hTX_2-oj7ghkZZHRhpJCiuoUroYQ0lg"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Generate PDF Function
def generate_pdf(boq_data, boq_name):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    
    pdf.set_font("Arial", style="B", size=16)
    pdf.cell(200, 10, f"{boq_name} - Bill of Quantities", ln=True, align="C")
    pdf.ln(10)

    pdf.set_font("Arial", size=12)
    for category, materials in boq_data.items():
        pdf.set_font("Arial", style="B", size=14)
        pdf.cell(200, 10, category, ln=True, align="L")
        pdf.set_font("Arial", size=12)
        
        for material, details in materials.items():
            quantity = details.get("quantity", "N/A")
            unit = details.get("unit", "N/A")
            price = details.get("price", "N/A")
            cost = details.get("cost", "N/A")

            pdf.cell(0, 10, f"{material}: {quantity} {unit}, Price: {price}, Cost: {cost}", ln=True)

        pdf.ln(5)

    pdf_output = io.BytesIO()
    pdf.output(pdf_output, "F")
    pdf_output.seek(0)

    return pdf_output

# Upload PDF to Supabase Storage
def upload_pdf_to_supabase(pdf_file, project_id, cad_file_id, boq_name):
    boq_id = str(uuid.uuid4())  # Unique ID for each BOQ
    file_name = f"{project_id}/{cad_file_id}/{boq_id}.pdf"
    
    response = supabase.storage.from_("boq-files").upload(file_name, pdf_file, {"content-type": "application/pdf"})

    if response.status_code == 200:
        pdf_url = f"{SUPABASE_URL}/storage/v1/object/public/boq-files/{file_name}"
        print(pdf_url)

        supabase.table("generated_boq").insert({
            "id": boq_id,
            "project_id": project_id,
            "cad_file_id": cad_file_id,
            "boq_pdf_url": pdf_url,
        }).execute()

        return pdf_url
    return None

@app.route("/api/boqPdf", methods=["POST"])
def upload_boq_pdf():
    data = request.json
    project_id = data["project_id"]
    cad_file_id = data["cad_file_id"]
    boq_data = data["boq_data"]
    boq_name = data["boq_name"]

    pdf_file = generate_pdf(boq_data, boq_name)
    pdf_url = upload_pdf_to_supabase(pdf_file, project_id, cad_file_id, boq_name)

    if pdf_url:
        return jsonify({"status": "success", "pdf_url": pdf_url})

    return jsonify({"status": "error", "message": "Failed to upload PDF"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

