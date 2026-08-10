#!/bin/bash
# Install script for the HTI PoC demo stack — VERIFIED working commands,
# tested in a matching Linux sandbox before handing over.
#
# Run this INSIDE your MobaXterm SSH session on the VPS.
# Requires: Node.js 18+, Python 3.x already on the VPS.
# (You already have n8n self-hosted, so Node.js is presumably already there.)

set -e

echo "== 1/5: Installing ui-ux-pro-max-skill (global CLI) =="
npm install -g ui-ux-pro-max-cli

echo "== 2/5: Node deps check =="
node -v
npm -v

echo "== 3/5: Python venv for OCR test scripts =="
python3 -m venv ~/hti-demo-venv
. ~/hti-demo-venv/bin/activate
pip install --quiet --upgrade pip
pip install --quiet "llama-cloud>=1.0" "mindee>=5.1"
echo "Python OCR SDKs installed in ~/hti-demo-venv"
deactivate

echo "== 4/5: Done — next steps =="
cat <<'EOF'

Next steps on this VPS:

1. Upload/clone the demo project folder (the "app/" directory from the zip
   I gave you) to this VPS, e.g. via MobaXterm's SFTP panel, or:
     git clone <your-repo-url>   (if you push it to a repo first)

2. Inside the app/ folder:
     npm install
     uipro init --ai claude          # activates the design skill for Claude Code here too
     cp .env.local.example .env.local
     # (optional) fill in LLAMA_CLOUD_API_KEY / MINDEE_API_KEY in .env.local

3. Run it:
     npm run build
     npm run start -- -p 3000        # or any free port

4. Keep it running persistently (pick one):
     pm2 start "npm run start -- -p 3000" --name hti-demo
     # or a systemd service, or a Docker container since you already use Docker

5. (Optional) put nginx in front for a clean URL, e.g. demo.yourdomain.com

6. For shadcn/ui or Tremor CLI (need normal internet, which your VPS has —
   my sandbox blocked these registries, so I hand-built the components
   instead; you don't need to run these unless you want to add MORE
   components later):
     npx shadcn@latest init -d -y
     npx @tremor/cli@latest init     # interactive — choose "Next" when asked

EOF

echo "== 5/5: All done =="
