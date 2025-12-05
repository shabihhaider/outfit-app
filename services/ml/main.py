"""
Outfit App - ML Services
========================
Modal.com serverless GPU functions for:
- Image classification (FashionCLIP)
- Background removal (rembg)
- Color extraction

Sprint 0: Stubs only - verifies infrastructure
Sprint 3: Implement remove_background
Sprint 4: Implement classify_item
"""

import modal
from typing import Optional
from pydantic import BaseModel

# -----------------------------------------------------
# CONFIGURATION
# -----------------------------------------------------
APP_NAME = "outfit-app-ml"
GPU_TYPE = "T4"  # Options: "T4", "A10G", "A100" (T4 is cheapest)
TIMEOUT_SECONDS = 300

# -----------------------------------------------------
# RESPONSE MODELS (Type Safety)
# -----------------------------------------------------
class HealthCheckResponse(BaseModel):
    status: str
    gpu_available: bool
    gpu_name: Optional[str] = None
    message: str

class ClassificationResponse(BaseModel):
    category: str
    subcategory: Optional[str] = None
    confidence: float
    primary_color: Optional[str] = None
    secondary_colors: Optional[list[str]] = None
    pattern: Optional[str] = None
    style_tags: Optional[list[str]] = None
    warmth_level: Optional[str] = None
    source: str  # 'fashionclip', 'vlm', 'stub'

class BackgroundRemovalResponse(BaseModel):
    success: bool
    original_url: str
    processed_url: Optional[str] = None
    error: Optional[str] = None

# -----------------------------------------------------
# MODAL SETUP
# -----------------------------------------------------

# Base image for all functions
base_image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "fastapi>=0.109.0",
        "pydantic>=2.0",
        "httpx>=0.26.0",
        "Pillow>=10.0.0",
    )
)

# GPU image (extends base with ML libraries) - for Sprint 4
gpu_image = (
    base_image
    .pip_install(
        "torch>=2.1.0",
        "transformers>=4.36.0",
        "numpy>=1.24.0",
    )
)

# Background removal image - for Sprint 3
rembg_image = (
    base_image
    .pip_install(
        "rembg>=2.0.50",
        "onnxruntime>=1.16.0",
    )
)

# Create the Modal App
app = modal.App(APP_NAME)

# -----------------------------------------------------
# 1. HEALTH CHECK - Verify Infrastructure
# -----------------------------------------------------
@app.function(
    image=base_image,
    gpu=GPU_TYPE,
    timeout=60,
)
def health_check() -> dict:
    """
    Verifies that we can access a GPU on Modal.
    Run with: modal run main.py::health_check
    """
    import subprocess
    
    print("🏥 Running ML Infrastructure Health Check...")
    
    try:
        # Check if nvidia-smi is available (proves GPU access)
        result = subprocess.run(
            ["nvidia-smi", "--query-gpu=name,memory.total,driver_version", "--format=csv,noheader"],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            gpu_info = result.stdout.strip()
            print(f"✅ GPU Detected: {gpu_info}")
            return HealthCheckResponse(
                status="healthy",
                gpu_available=True,
                gpu_name=gpu_info.split(",")[0].strip(),
                message=f"GPU ready: {gpu_info}"
            ).model_dump()
        else:
            print(f"❌ nvidia-smi failed: {result.stderr}")
            return HealthCheckResponse(
                status="error",
                gpu_available=False,
                message=f"nvidia-smi error: {result.stderr}"
            ).model_dump()
            
    except subprocess.TimeoutExpired:
        return HealthCheckResponse(
            status="error",
            gpu_available=False,
            message="nvidia-smi timed out"
        ).model_dump()
    except FileNotFoundError:
        return HealthCheckResponse(
            status="error",
            gpu_available=False,
            message="nvidia-smi not found - GPU drivers not installed"
        ).model_dump()
    except Exception as e:
        return HealthCheckResponse(
            status="error",
            gpu_available=False,
            message=str(e)
        ).model_dump()

# -----------------------------------------------------
# 2. CLASSIFY ITEM - FashionCLIP (Stub for Sprint 4)
# -----------------------------------------------------
@app.function(
    image=gpu_image,
    gpu=GPU_TYPE,
    timeout=TIMEOUT_SECONDS,
)
def classify_item(image_url: str) -> dict:
    """
    Classifies a clothing item using FashionCLIP.
    
    Sprint 0: Returns stub data
    Sprint 4: Will load patrickjohncyh/fashion-clip model
    
    Args:
        image_url: URL of the clothing image to classify
        
    Returns:
        ClassificationResponse with category, colors, etc.
    """
    print(f"🧥 [STUB] Classifying image: {image_url}")
    
    # TODO Sprint 4: Replace with actual FashionCLIP inference
    # from transformers import CLIPProcessor, CLIPModel
    # model = CLIPModel.from_pretrained("patrickjohncyh/fashion-clip")
    # processor = CLIPProcessor.from_pretrained("patrickjohncyh/fashion-clip")
    
    return ClassificationResponse(
        category="T-Shirt",
        subcategory="Crew Neck",
        confidence=0.95,
        primary_color="#2563eb",
        secondary_colors=["#ffffff"],
        pattern="solid",
        style_tags=["casual", "everyday"],
        warmth_level="light",
        source="stub"
    ).model_dump()

# -----------------------------------------------------
# 3. REMOVE BACKGROUND (Stub for Sprint 3)
# -----------------------------------------------------
@app.function(
    image=rembg_image,
    timeout=TIMEOUT_SECONDS,
    # Note: rembg can run on CPU, no GPU needed
)
def remove_background(image_url: str) -> dict:
    """
    Removes background from a clothing image using rembg.
    
    Sprint 0: Returns stub data
    Sprint 3: Will use rembg library
    
    Args:
        image_url: URL of the image to process
        
    Returns:
        BackgroundRemovalResponse with processed image URL
    """
    print(f"✂️ [STUB] Removing background for: {image_url}")
    
    # TODO Sprint 3: Replace with actual rembg processing
    # from rembg import remove
    # import httpx
    # from PIL import Image
    # from io import BytesIO
    #
    # response = httpx.get(image_url)
    # input_image = Image.open(BytesIO(response.content))
    # output_image = remove(input_image)
    # ... upload to R2 and return URL
    
    # Generate stub URL
    stub_url = image_url.replace(".jpg", "_nobg.png").replace(".jpeg", "_nobg.png")
    
    return BackgroundRemovalResponse(
        success=True,
        original_url=image_url,
        processed_url=stub_url
    ).model_dump()

# -----------------------------------------------------
# 4. VLM FALLBACK (Stub for Sprint 4)
# -----------------------------------------------------
@app.function(
    image=base_image,
    timeout=TIMEOUT_SECONDS,
    # secrets=[modal.Secret.from_name("anthropic-api-key")],  # Add in Modal dashboard
)
def classify_with_vlm(image_url: str) -> dict:
    """
    Fallback classifier using Claude Vision API.
    Used when FashionCLIP confidence < 0.75.
    
    Sprint 0: Returns stub data
    Sprint 4: Will call Anthropic API
    """
    print(f"🤖 [STUB] VLM classification for: {image_url}")
    
    # TODO Sprint 4: Implement Claude API call
    # import anthropic
    # import os
    # client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    
    return ClassificationResponse(
        category="Dress",
        subcategory="Midi Dress",
        confidence=0.88,
        primary_color="#1e3a5f",
        pattern="floral",
        style_tags=["formal", "elegant"],
        warmth_level="light",
        source="stub_vlm"
    ).model_dump()

# -----------------------------------------------------
# LOCAL TESTING (Without deploying to Modal)
# -----------------------------------------------------
if __name__ == "__main__":
    # For local testing without Modal
    print("Running local tests...")
    
    # Test classification stub
    result = classify_item.local("https://example.com/shirt.jpg")
    print(f"Classification: {result}")
    
    # Test background removal stub
    result = remove_background.local("https://example.com/shirt.jpg")
    print(f"Background removal: {result}")