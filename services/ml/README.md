# ML Services (Modal.com)

Serverless GPU functions for the Outfit App.

## Setup

```bash
# 1. Create virtual environment
python -m venv .venv

# 2. Activate (Windows)
.venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Authenticate with Modal
python -m modal setup
```

## Functions

| Function            | Purpose                    | GPU | Sprint |
| ------------------- | -------------------------- | --- | ------ |
| `health_check`      | Verify infrastructure      | T4  | 0      |
| `classify_item`     | FashionCLIP classification | T4  | 4      |
| `remove_background` | Remove image background    | CPU | 3      |
| `classify_with_vlm` | Claude Vision fallback     | CPU | 4      |

## Commands

```bash
# Run health check
modal run main.py::health_check

# Run classification stub
modal run main.py::classify_item --image-url "https://example.com/shirt.jpg"

# Deploy as persistent service
modal deploy main.py
```

## Secrets Setup

In Modal Dashboard (modal.com), add these secrets:

- `anthropic-api-key`: Your Anthropic API key for Claude VLM fallback

## Cost Estimates

| GPU  | Cost/hour | Use Case             |
| ---- | --------- | -------------------- |
| T4   | ~$0.59    | Development, testing |
| A10G | ~$1.10    | Production           |
| A100 | ~$2.78    | High throughput      |

For MVP, T4 is sufficient. Expect ~$0.001 per classification.
