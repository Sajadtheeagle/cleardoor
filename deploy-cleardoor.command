#!/bin/bash
# ╔══════════════════════════════════════════════════════════════╗
# ║  ClearDoor Deploy Script — Double-click to go LIVE!        ║
# ║  Pushes ALL files (html + css/ + js/ + images/) to GitHub  ║
# ║  → cleardoor.ca updates in ~60 seconds                     ║
# ╚══════════════════════════════════════════════════════════════╝

TOKEN=""  # Paste your GitHub Personal Access Token here before running
REPO="Sajadtheeagle/cleardoor"
BRANCH="main"
API_BASE="https://api.github.com/repos/$REPO"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║        🚀 ClearDoor Deploy Script            ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── Step 1: Find the project root (folder containing index.html + css/ + js/) ──
echo "🔍 Locating project files..."

PROJECT_DIR=$(python3 << 'PYFIND'
import os, glob

search_roots = [
    os.path.expanduser("~/Library/Application Support/Claude"),
    os.path.expanduser("~/Library/Application Support/Claude Code"),
    os.path.expanduser("~/Documents"),
    os.path.expanduser("~/Desktop"),
    os.path.expanduser("~/Downloads"),
]

for root in search_roots:
    if not os.path.isdir(root):
        continue
    for html_file in glob.glob(os.path.join(root, "**", "index.html"), recursive=True):
        d = os.path.dirname(html_file)
        # Must have css/ and js/ alongside index.html to be a real project folder
        if os.path.isdir(os.path.join(d, "css")) and os.path.isdir(os.path.join(d, "js")):
            if os.path.getsize(html_file) > 20000:
                print(d)
                break
    else:
        continue
    break
PYFIND)

if [ -z "$PROJECT_DIR" ]; then
  echo "❌  Could not find the ClearDoor project folder."
  echo "    Make sure index.html, css/, and js/ are all in the same folder."
  read -p "Press Enter to close..."
  exit 1
fi

echo "✅  Found project at: $PROJECT_DIR"
echo ""

# ── Step 2: Collect all deployable files ──
python3 - "$PROJECT_DIR" "$TOKEN" "$REPO" "$BRANCH" "$API_BASE" << 'PYDEPLOY'
import sys, os, json, base64, urllib.request, urllib.error, ssl

# Fix macOS SSL certificate issue (common with Python installed outside Xcode)
ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

project_dir = sys.argv[1]
token       = sys.argv[2]
repo        = sys.argv[3]
branch      = sys.argv[4]
api_base    = sys.argv[5]

# ── Files to include ──
INCLUDE_FOLDERS = ['css', 'js', 'images', 'data', 'components', 'pages', 'api', 'docs']
INCLUDE_ROOT    = ['index.html', 'README.md', '.gitignore']
SKIP_DIRS       = {'official plan', '.git', '.claude', '.skills', '.local-plugins', '__pycache__'}
SKIP_EXTS       = {'.DS_Store', '.tmp', '.bak', '.command', '.xlsx', '.txt'}
SKIP_NAMES      = {'cleardoor.html', 'deploy-cleardoor.command'}
ALLOW_DOTFILES  = {'.gitkeep', '.gitignore'}   # hidden files to include despite startswith('.')

def api_call(method, path, data=None):
    url = f"{api_base}/{path}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(
        url, data=body, method=method,
        headers={
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json",
            "User-Agent": "ClearDoor-Deploy/2.0"
        }
    )
    with urllib.request.urlopen(req, context=ssl_ctx) as r:
        return json.loads(r.read())

def collect_files():
    """Collect all files that should be deployed."""
    files = {}

    # Root files
    for name in INCLUDE_ROOT:
        path = os.path.join(project_dir, name)
        if os.path.isfile(path):
            files[name] = path

    # Folder files
    for folder in INCLUDE_FOLDERS:
        folder_path = os.path.join(project_dir, folder)
        if not os.path.isdir(folder_path):
            continue
        for root, dirs, filenames in os.walk(folder_path):
            # Skip hidden and unwanted dirs
            dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith('.')]
            for fname in filenames:
                if fname in SKIP_NAMES or (fname.startswith('.') and fname not in ALLOW_DOTFILES):
                    continue
                _, ext = os.path.splitext(fname)
                if ext in SKIP_EXTS:
                    continue
                abs_path = os.path.join(root, fname)
                rel_path = os.path.relpath(abs_path, project_dir).replace('\\', '/')
                files[rel_path] = abs_path

    return files

print("📦 Collecting files...")
files = collect_files()
print(f"   Found {len(files)} files to deploy:")
for p in sorted(files.keys()):
    size = os.path.getsize(files[p])
    print(f"   ├─ {p}  ({size:,} bytes)")

print()

# ── Get current branch SHA (head commit) ──
print("🔗 Connecting to GitHub...")
try:
    ref_data = api_call("GET", f"git/ref/heads/{branch}")
    base_tree_sha = ref_data["object"]["sha"]
    # Get the tree sha from the commit
    commit_data = api_call("GET", f"git/commits/{base_tree_sha}")
    base_tree = commit_data["tree"]["sha"]
    print(f"   Current HEAD: {base_tree_sha[:10]}...")
    print(f"   Base tree:    {base_tree[:10]}...")
except Exception as e:
    print(f"❌ Could not connect to GitHub: {e}")
    sys.exit(1)

print()
print("⬆️  Creating file blobs...")

# ── Create blobs for each file ──
tree_items = []
binary_exts = {'.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.svg', '.woff', '.woff2', '.ttf'}

for rel_path, abs_path in sorted(files.items()):
    _, ext = os.path.splitext(abs_path)
    is_binary = ext.lower() in binary_exts

    with open(abs_path, 'rb') as f:
        raw = f.read()

    if is_binary:
        blob_data = {"content": base64.b64encode(raw).decode(), "encoding": "base64"}
    else:
        try:
            blob_data = {"content": raw.decode('utf-8'), "encoding": "utf-8"}
        except UnicodeDecodeError:
            blob_data = {"content": base64.b64encode(raw).decode(), "encoding": "base64"}

    blob = api_call("POST", "git/blobs", blob_data)
    tree_items.append({
        "path": rel_path,
        "mode": "100644",
        "type": "blob",
        "sha": blob["sha"]
    })
    print(f"   ✓  {rel_path}")

print()
print("🌳 Creating tree...")
new_tree = api_call("POST", "git/trees", {
    "base_tree": base_tree,
    "tree": tree_items
})
print(f"   New tree: {new_tree['sha'][:10]}...")

print()
print("💾 Creating commit...")
new_commit = api_call("POST", "git/commits", {
    "message": "🏗️ ClearDoor infrastructure — modular css/ js/ + full folder structure + docs",
    "tree": new_tree["sha"],
    "parents": [base_tree_sha]
})
print(f"   Commit:   {new_commit['sha'][:10]}...")

print()
print("📌 Updating branch...")
api_call("PATCH", f"git/refs/heads/{branch}", {
    "sha": new_commit["sha"],
    "force": False
})

print()
print("╔══════════════════════════════════════════════╗")
print("║  ✅  DEPLOYED! Live in ~60 seconds           ║")
print("║  🌐  https://cleardoor.ca                    ║")
print("╚══════════════════════════════════════════════╝")
print()
print(f"  🔗 Commit: https://github.com/{repo}/commit/{new_commit['sha']}")

PYDEPLOY

# ── Done ──
echo ""
read -p "Open https://cleardoor.ca in browser? (y/n): " OPEN_BROWSER
if [[ "$OPEN_BROWSER" == "y" || "$OPEN_BROWSER" == "Y" ]]; then
  open "https://cleardoor.ca"
fi
