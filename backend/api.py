from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import json
import random
import os
from PIL import Image, ImageDraw, ImageFont
import boto3
from io import BytesIO
import base64
import tempfile

app = Flask(__name__)
CORS(app)

# S3 Configuration (placeholder credentials)
S3_ACCESS_KEY = "YOUR_ACCESS_KEY"
S3_SECRET_KEY = "YOUR_SECRET_KEY"
S3_REGION = "YOUR_REGION"
S3_BUCKET_NAME = "YOUR_BUCKET_NAME"

def load_greetings():
    """Load greetings from JSON file"""
    try:
        with open('greetings.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return ["كل عام ووطني بخير", "اليوم الوطني السعودي ٩٥"]

def get_arabic_font(size=60):
    """Get Arabic-compatible font"""
    font_paths = [
        "/usr/share/fonts/truetype/noto/NotoSansArabic-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/System/Library/Fonts/Arial.ttf",
        "/Windows/Fonts/arial.ttf"
    ]
    
    for font_path in font_paths:
        if os.path.exists(font_path):
            try:
                return ImageFont.truetype(font_path, size)
            except:
                continue
    
    # Fallback to default font
    try:
        return ImageFont.load_default()
    except:
        return None

@app.route('/api/generate-greeting', methods=['POST'])
def generate_greeting():
    """Generate greeting based on user prompt"""
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        
        # Check if prompt contains custom greeting
        if 'بتهنئة:' in prompt:
            # Extract custom greeting after "بتهنئة:"
            custom_greeting = prompt.split('بتهنئة:')[1].strip()
            return jsonify({
                'success': True,
                'greeting': custom_greeting,
                'type': 'custom'
            })
        else:
            # Return random greeting from JSON file
            greetings = load_greetings()
            random_greeting = random.choice(greetings)
            return jsonify({
                'success': True,
                'greeting': random_greeting,
                'type': 'random'
            })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/generate-poster', methods=['POST'])
def generate_poster():
    """Generate poster with greeting and background color"""
    try:
        data = request.get_json()
        greeting = data.get('greeting', 'كل عام ووطني بخير')
        bg_color = data.get('background_color', '#2e7d32')  # Saudi green
        
        # Create 1080x1080 image
        img = Image.new('RGB', (1080, 1080), bg_color)
        draw = ImageDraw.Draw(img)
        
        # Get Arabic font
        font = get_arabic_font(80)
        
        # Calculate text position (centered)
        # For Arabic text, we need to handle RTL properly
        bbox = draw.textbbox((0, 0), greeting, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (1080 - text_width) // 2
        y = (1080 - text_height) // 2
        
        # Draw text in white
        draw.text((x, y), greeting, font=font, fill='white')
        
        # Save to temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.png')
        img.save(temp_file.name, 'PNG')
        
        # Upload to S3 (placeholder implementation)
        try:
            s3_client = boto3.client(
                's3',
                aws_access_key_id=S3_ACCESS_KEY,
                aws_secret_access_key=S3_SECRET_KEY,
                region_name=S3_REGION
            )
            
            # Generate unique filename
            filename = f"poster_{random.randint(1000, 9999)}.png"
            
            # Upload file
            s3_client.upload_file(temp_file.name, S3_BUCKET_NAME, filename)
            
            # Generate S3 URL
            s3_url = f"https://{S3_BUCKET_NAME}.s3.{S3_REGION}.amazonaws.com/{filename}"
            
            # Clean up temp file
            os.unlink(temp_file.name)
            
            return jsonify({
                'success': True,
                'poster_url': s3_url,
                'filename': filename
            })
            
        except Exception as s3_error:
            # If S3 upload fails, return base64 encoded image
            img_buffer = BytesIO()
            img.save(img_buffer, format='PNG')
            img_buffer.seek(0)
            
            # Convert to base64
            img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
            
            # Clean up temp file
            os.unlink(temp_file.name)
            
            return jsonify({
                'success': True,
                'poster_base64': f"data:image/png;base64,{img_base64}",
                'note': 'S3 upload failed, returning base64 image',
                's3_error': str(s3_error)
            })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Tuwaiq 007 API'
    })

@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    return jsonify({
        'message': 'Tuwaiq 007 API - AI-powered poster generator for Saudi National Day',
        'version': '1.0.0',
        'endpoints': [
            '/api/generate-greeting',
            '/api/generate-poster',
            '/api/health'
        ]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

