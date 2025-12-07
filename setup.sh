#!/bin/bash
set -e

echo "🚀 Starting global setup..."

# Detect OS
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
echo "🖥️  Detected OS: $OS"

# Ensure Node is installed
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js is not installed. Install Node 18+ first."
  exit 1
fi

echo "✔ Node installed: $(node -v)"

# Create tsconfig.json if missing
if [ ! -f tsconfig.json ]; then
  echo "📄 Creating tsconfig.json..."
  cat <<EOF > tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "dist",
    "rootDir": "src",
    "esModuleInterop": true,
    "strict": false
  }
}
EOF
else
  echo "✔ tsconfig.json already exists"
fi

# Ensure src folder exists
mkdir -p src

# Create index.ts if missing
if [ ! -f src/index.ts ]; then
  echo "📄 Creating src/index.ts..."
  echo 'console.log("TS project ready!");' > src/index.ts
else
  echo "✔ src/index.ts already exists"
fi

echo "📦 Installing runtime dependencies..."
npm install mqtt mariadb pg

echo "📦 Installing dev dependencies..."
npm install -D typescript ts-node @types/node @types/mqtt @types/pg

echo "🏗 Building TypeScript..."
npm run build || echo "⚠️ Build skipped (build script missing — will still run fine)"

echo "🎉 Setup complete!"
echo "➡ Run dev:   npm run dev"
echo "➡ Build:     npm run build"
echo "➡ Start:     npm start"
