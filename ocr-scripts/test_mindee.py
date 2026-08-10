"""
Quick standalone test for Mindee — run this BEFORE wiring into the app.
Mindee has a Bill of Lading endpoint that's directly relevant to HTI's
trade documents (invoice, packing list, B/L).

Setup:
    pip install mindee
    export MINDEE_API_KEY="your-key-here"

Usage:
    python3 test_mindee.py /path/to/invoice.pdf
"""

import sys
import os


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 test_mindee.py /path/to/document.pdf")
        sys.exit(1)

    api_key = os.environ.get("MINDEE_API_KEY")
    if not api_key:
        print("ERROR: set MINDEE_API_KEY environment variable first.")
        print('  export MINDEE_API_KEY="your-key-here"')
        sys.exit(1)

    file_path = sys.argv[1]

    from mindee import Client, product

    mindee_client = Client(api_key=api_key)
    input_doc = mindee_client.source_from_path(file_path)

    # Using the generic Invoice product as a starting point — Mindee also has
    # a purpose-built Bill of Lading endpoint (product.BillOfLadingV1), worth
    # trying too since HTI's documents include B/L. Check current product
    # names at https://developers.mindee.com/docs before relying on this.
    result = mindee_client.parse(product.InvoiceV4, input_doc)

    print("\n--- MINDEE EXTRACTION RESULT ---\n")
    print(result.document)


if __name__ == "__main__":
    main()
