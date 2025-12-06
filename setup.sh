#!/usr/bin/env bash

set -e

echo "🚀 Starting global setup..."


# ==============================================
# Detect OS
# ==============================================
OS="unknown"

case "$OSTYPE" in
  linux*)   OS="linux" ;;
  darwin*)  OS="mac" ;;
  msys*)    OS="windows" ;; # Git Bash
  mingw*)   OS="windows" ;;
  cygwin*)  OS="windows" ;;
  *)        OS="unknown" ;;
esac

echo "🖥️  Detected OS: $OS"


# ==============================================
# Install Node.js if missing
# ==============================================
if ! command -v node &> /dev/null; then
    echo "⚠ Node.js not found. Installing..."

    if [ "$OS" = "mac" ]; then
        if ! command -v brew &> /dev/null; then
            echo "🍺 Installing Homebrew..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        brew install node

    elif [ "$OS" = "linux" ]; then
        echo "🐧 Installing Node via apt..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt install -y nodejs

    elif [ "$OS" = "windows" ]; then
        echo "🪟 Installing Node using winget..."
        if command -v winget &> /dev/null; then
            winget install OpenJS.NodeJS.LTS -h --accept-package-agreements --accept-source-agreements
        else
            echo "❌ winget not available. Install Node manually."
            exit 1
        fi
    fi
else
    echo "✔ Node installed: $(node -v)"
fi


# ==============================================
# Create tsconfig.json if missing
# ==============================================
if [ ! -f tsconfig.json ]; then
    echo "📝 Creating tsconfig.json..."

cat <<EOF > tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
EOF

else
    echo "✔ tsconfig.json already exists"
fi


# ==============================================
# Create src folder + index.ts if missing
# ==============================================
if [ ! -d src ]; then
    echo "📁 Creating src folder..."
    mkdir src
fi

if [ ! -f src/index.ts ]; then
    echo "📝 Creating starter index.ts..."

cat <<EOF > src/index.ts
import mqtt from "mqtt";

const MQTT_URL = process.env.MQTT_URL || "mqtt://localhost:1883";

const client = mqtt.connect(MQTT_URL);

client.on("connect", () => {
  console.log("🟢 MQTT connected");
  client.subscribe("ssm/tracking/#");
});

client.on("message", (topic, payload) => {
  try {
    const data = JSON.parse(payload.toString());
    console.log("📥 Incoming:", topic, data);

    const unsPayload = {
      timestamp: Date.now(),
      event: topic,
      ...data,
    };

    const unsTopic = \`uns/product/\${data.id ?? "unknown"}\`;
    client.publish(unsTopic, JSON.stringify(unsPayload));
    console.log("📤 Published UNS:", unsTopic);

  } catch (err) {
    console.error("❌ Invalid JSON:", err);
  }
});
EOF

else
    echo "✔ src/index.ts already exists"
fi


# ==============================================
# Install dependencies
# ==============================================
echo "📦 Installing npm packages..."
npm install

echo "📦 Installing dev dependencies..."
npm install --save-dev typescript ts-node @types/node @types/mqtt


# ==============================================
# Build TS
# ==============================================
echo "🏗 Building TypeScript..."
npx tsc --project tsconfig.json


echo "🎉 Setup complete!"
echo "➡ Run dev:   npm run dev"
echo "➡ Build:     npm run build"
echo "➡ Start:     npm start"
