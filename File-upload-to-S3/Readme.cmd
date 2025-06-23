# Create project
mkdir nodejs-ts-app && cd nodejs-ts-app

# Initialize and install
npm init -y
npm install express cors dotenv multer aws-sdk multer-s3 uuid
npm install -D typescript @types/node @types/express @types/cors @types/multer ts-node-dev

# Create folder structure
mkdir -p src/{controllers,services,routes,middlewares,utils,types}

# Create TS configuration file
tsc --init


# Run development server
npm run dev