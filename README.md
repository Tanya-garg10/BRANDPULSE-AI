<div align="center">
  <h1>BRANDPULSE AI</h1>
  <h3>AI-Powered Brand Strategy & Development Platform</h3>
  <p>Transform your brand ideas into comprehensive strategies with AI-driven insights</p>
</div>

## Overview

BRANDPULSE AI is an intelligent brand development platform that guides you through a systematic workflow to transform rough brand concepts into comprehensive, actionable strategies. Powered by OpenAI's GPT models, it provides strategic insights, market analysis, and creative guidance across multiple development stages.

## Features

- **6-Stage Brand Development Pipeline**: Discover → Position → Shape → Visualize → Challenge → Launch
- **AI-Powered Strategic Insights**: Real-time market analysis and brand recommendations
- **Interactive Workspace**: Asymmetric editorial layout with Brand DNA sidebar and AI signals panel
- **Project Management**: Create, manage, and export multiple brand projects
- **Demo & Benchmark Projects**: Learn from pre-built examples
- **Export Capabilities**: Generate comprehensive brand dossiers and strategy documents

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4
- **AI Integration**: OpenAI SDK (GPT-4)
- **Backend**: Express.js server
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Package Manager**: Bun

## Prerequisites

- Node.js (v18+) or Bun
- OpenAI API Key

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Tanya-garg10/BRANDPULSE-AI.git
   cd BRANDPULSE-AI
   ```

2. Install dependencies:
   ```bash
   # Using npm
   npm install
   
   # Or using bun
   bun install
   ```

3. Set up environment variables:
   ```bash
   # On Linux/Mac
   cp .env.example .env
   # On Windows
   copy .env.example .env
   ```
   Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## Running the Application

Start the development server:
```bash
# Using npm
npm run dev

# Or using bun
bun run dev
```

The application will be available at `http://localhost:3000`

## Build for Production

```bash
# Using npm
npm run build

# Or using bun
bun run build
```

## Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```

4. **Set environment variables** in Vercel dashboard:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NODE_ENV`: `production`

5. **Deploy production**:
   ```bash
   vercel --prod
   ```

### Option 2: Railway

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize project**:
   ```bash
   railway init
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

5. **Add environment variables** in Railway dashboard:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `PORT`: `3000`
   - `NODE_ENV`: `production`

### Option 3: Render

1. **Create a `render.yaml` file**:
   ```yaml
   services:
     - type: web
       name: brandpulse-ai
       env: node
       buildCommand: npm install && npm run build
       startCommand: npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: PORT
           value: 3000
   ```

2. **Push to GitHub** and connect your repository to Render

3. **Add environment variables** in Render dashboard:
   - `OPENAI_API_KEY`: Your OpenAI API key

### Option 4: Docker Deployment

1. **Create a `Dockerfile`**:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build Docker image**:
   ```bash
   docker build -t brandpulse-ai .
   ```

3. **Run container**:
   ```bash
   docker run -p 3000:3000 -e OPENAI_API_KEY=your_key brandpulse-ai
   ```

### Option 5: Traditional VPS (DigitalOcean, AWS, etc.)

1. **SSH into your server**

2. **Clone the repository**:
   ```bash
   git clone https://github.com/Tanya-garg10/BRANDPULSE-AI.git
   cd BRANDPULSE-AI
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Build the project**:
   ```bash
   npm run build
   ```

5. **Set up environment variables**:
   ```bash
   echo "OPENAI_API_KEY=your_api_key_here" > .env
   echo "NODE_ENV=production" >> .env
   echo "PORT=3000" >> .env
   ```

6. **Install PM2 for process management**:
   ```bash
   npm install -g pm2
   ```

7. **Start the application with PM2**:
   ```bash
   pm2 start npm --name "brandpulse-ai" -- start
   pm2 save
   pm2 startup
   ```

8. **Set up Nginx reverse proxy** (recommended):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Environment Variables Required

Regardless of deployment method, ensure these environment variables are set:

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `NODE_ENV`: Set to `production` for production deployments
- `PORT`: Port number (default: 3000)
- `APP_URL`: Your application's URL (optional, for self-referential links)

## Project Structure

```
BRANDPULSE-AI/
├── src/
│   ├── components/        # React components
│   │   ├── stages/       # Workflow stage components
│   │   ├── AiSignalsPanel.tsx
│   │   ├── BrandDnaSidebar.tsx
│   │   └── ...
│   ├── data/             # Sample data and demo projects
│   ├── services/         # API and storage services
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Entry point
├── server.ts             # Express server
├── index.html            # HTML template
└── package.json          # Dependencies and scripts
```

## Workflow Stages

1. **Discover**: Define your brand concept and initial ideas
2. **Position**: Analyze market positioning and competitive landscape
3. **Shape**: Develop brand identity, voice, and personality
4. **Visualize**: Create visual brand elements and guidelines
5. **Challenge**: Test and validate your brand strategy
6. **Launch**: Prepare comprehensive launch kits and go-to-market strategies

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the GitHub repository.
