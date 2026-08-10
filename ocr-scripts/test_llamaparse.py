"""
Quick standalone test for LlamaParse — run this to confirm your API key
works and see raw output quality on a real HTI document (invoice, PO,
packing list, etc), before wiring into the main app.

This version uses `llama-cloud-services`, which is compatible with
Python 3.8 (the newer standalone `llama-cloud` package requires Python 3.9+).

Setup:
    pip install llama-cloud-services
    export LLAMA_CLOUD_API_KEY="your-key-here"

Usage:
    python3 test_llamaparse.py /path/to/document.pdf
"""

import sys
import os


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 test_llamaparse.py /path/to/document.pdf")
        sys.exit(1)

    api_key = os.environ.get("LLAMA_CLOUD_API_KEY")
    if not api_key:
        print("ERROR: set LLAMA_CLOUD_API_KEY environment variable first.")
        print('  export LLAMA_CLOUD_API_KEY="your-key-here"')
        sys.exit(1)

    file_path = sys.argv[1]

    # llama-cloud-services is the package compatible with Python 3.8.
    # Docs: https://developers.llamaindex.ai/llamaparse
    from llama_cloud_services import LlamaParse

    parser = LlamaParse(api_key=api_key, result_type="markdown")

    print(f"Uploading {file_path} to LlamaParse...")
    documents = parser.load_data(file_path)

    print("\n--- PARSED MARKDOWN OUTPUT ---\n")
    for doc in documents:
        print(doc.text[:3000])
    print("\n--- (truncated if longer than 3000 chars) ---")


if __name__ == "__main__":
    main()
