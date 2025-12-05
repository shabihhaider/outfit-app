"""
Local testing script - runs without Modal deployment.
Useful for quick iteration during development.
"""

from main import (
    ClassificationResponse,
    BackgroundRemovalResponse,
    HealthCheckResponse,
)

def test_classification_response():
    """Test that classification response model works."""
    response = ClassificationResponse(
        category="T-Shirt",
        confidence=0.95,
        source="test"
    )
    assert response.category == "T-Shirt"
    print("✅ Classification response model OK")

def test_background_removal_response():
    """Test that background removal response model works."""
    response = BackgroundRemovalResponse(
        success=True,
        original_url="https://example.com/img.jpg",
        processed_url="https://example.com/img_nobg.png"
    )
    assert response.success == True
    print("✅ Background removal response model OK")

if __name__ == "__main__":
    test_classification_response()
    test_background_removal_response()
    print("\n✅ All local tests passed!")