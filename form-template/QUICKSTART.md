# ⚡ Quick Start - Form Template

> **Get started in 2 minutes!**

---

## Option 1: Fat Bundle (Fastest) ⚡

```bash
# 1. Install
npm install

# 2. Build
npm run build

# 3. Serve
cd dist
python3 -m http.server 8080

# 4. Open
open http://localhost:8080/dev.html
```

**Done!** Your form is running.

**Use this for**:
- ✅ Quick UI testing
- ✅ Styling changes
- ✅ Component testing
- ✅ Fast iterations

---

## Option 2: Runtime Testing (Production-like) 🧪

```bash
# 1. Setup dev credentials (one-time)
cd ../../runtime-app
cp dev-credentials.example.js dev-credentials.js
# Edit dev-credentials.js with your credentials

# 2. Enable dev mode
# Edit runtime-app/.env.local
ALLOW_DEV_MODE=true

# 3. Start services
cd ../../
./start-all.sh

# 4. Build and upload
cd forms-examples/form-template
npm run build
open http://localhost:3001/admin/upload-forms
# Upload form-template-deployment-*.zip

# 5. Test
open http://localhost:3001/form/form-template
```

**Use this for**:
- ✅ SDK integration testing
- ✅ Process calls
- ✅ Database loading
- ✅ Final validation

---

## Need Help?

- **Full README**: [README.md](README.md)
- **Dev Credentials Setup**: [DEV_CREDENTIALS_SETUP.md](DEV_CREDENTIALS_SETUP.md)
- **Documentation**: `http://localhost:3001/docs`
