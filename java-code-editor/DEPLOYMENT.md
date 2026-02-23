# Deployment Guide

## Quick Start with Docker Compose

The easiest way to run the entire application:

```bash
# Clone the repository
git clone <your-repo-url>
cd java-code-editor

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

## Production Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Deploy Frontend to Vercel

1. **Prepare Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Vercel Setup**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

3. **Environment Variables**
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your frontend will be live at `https://your-app.vercel.app`

#### Deploy Backend to Railway

1. **Railway Setup**
   - Visit [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Service**
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

3. **Environment Variables**
   ```
   PORT=3001
   NODE_ENV=production
   DOCKER_ENABLED=true
   EXECUTION_TIMEOUT=5000
   MAX_MEMORY_MB=256
   FRONTEND_URL=https://your-app.vercel.app
   ```

4. **Enable Docker**
   - Railway supports Docker out of the box
   - Ensure Docker socket access is enabled
   - The Dockerfile will be automatically detected

5. **Deploy**
   - Railway will automatically deploy
   - Get your backend URL: `https://your-backend.railway.app`
   - Update Vercel environment variable with this URL

### Option 2: Render (Full Stack)

#### Deploy Backend

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your repository

2. **Configure**
   - **Name**: java-executor-backend
   - **Root Directory**: `backend`
   - **Environment**: Docker
   - **Region**: Choose closest to your users
   - **Instance Type**: Starter or higher

3. **Environment Variables**
   ```
   PORT=3001
   NODE_ENV=production
   DOCKER_ENABLED=true
   EXECUTION_TIMEOUT=5000
   MAX_MEMORY_MB=256
   FRONTEND_URL=https://your-frontend.onrender.com
   ```

4. **Advanced Settings**
   - Enable Docker
   - Health Check Path: `/health`

#### Deploy Frontend

1. **Create Static Site**
   - Click "New +" → "Static Site"
   - Connect repository

2. **Configure**
   - **Name**: java-executor-frontend
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `.next`

3. **Environment Variables**
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
   ```

### Option 3: AWS (EC2 + Docker)

#### Prerequisites
- AWS Account
- EC2 instance (t2.medium or higher recommended)
- Security groups configured (ports 22, 80, 443, 3000, 3001)

#### Setup Steps

1. **Launch EC2 Instance**
   ```bash
   # Choose Amazon Linux 2 or Ubuntu 22.04
   # Instance type: t2.medium (minimum)
   # Storage: 20GB minimum
   ```

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ec2-user@your-instance-ip
   ```

3. **Install Docker & Docker Compose**
   ```bash
   # Update system
   sudo yum update -y
   
   # Install Docker
   sudo yum install docker -y
   sudo service docker start
   sudo usermod -a -G docker ec2-user
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   
   # Verify installation
   docker --version
   docker-compose --version
   ```

4. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd java-code-editor
   ```

5. **Configure Environment**
   ```bash
   # Edit backend/.env
   nano backend/.env
   # Set production values
   
   # Edit frontend/.env.local
   nano frontend/.env.local
   # Set NEXT_PUBLIC_BACKEND_URL to your EC2 public IP or domain
   ```

6. **Start Services**
   ```bash
   docker-compose up -d --build
   ```

7. **Configure Nginx (Optional - for production)**
   ```bash
   sudo yum install nginx -y
   
   # Create Nginx config
   sudo nano /etc/nginx/conf.d/java-editor.conf
   ```

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

       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
       }
   }
   ```

   ```bash
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

8. **Setup SSL with Let's Encrypt**
   ```bash
   sudo yum install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your-domain.com
   ```

9. **Configure Auto-restart**
   ```bash
   # Create systemd service
   sudo nano /etc/systemd/system/java-editor.service
   ```

   ```ini
   [Unit]
   Description=Java Code Editor
   Requires=docker.service
   After=docker.service

   [Service]
   Type=oneshot
   RemainAfterExit=yes
   WorkingDirectory=/home/ec2-user/java-code-editor
   ExecStart=/usr/local/bin/docker-compose up -d
   ExecStop=/usr/local/bin/docker-compose down

   [Install]
   WantedBy=multi-user.target
   ```

   ```bash
   sudo systemctl enable java-editor
   sudo systemctl start java-editor
   ```

### Option 4: DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Click "Create App"
   - Connect GitHub repository

2. **Configure Backend Component**
   - Type: Web Service
   - Source Directory: `backend`
   - Dockerfile: `backend/Dockerfile`
   - HTTP Port: 3001
   - Environment Variables: (same as above)

3. **Configure Frontend Component**
   - Type: Static Site
   - Source Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Output Directory: `.next`
   - Environment Variables: `NEXT_PUBLIC_BACKEND_URL`

4. **Deploy**
   - Review and deploy
   - DigitalOcean will provide URLs for both services

## Environment-Specific Configurations

### Development
```env
# frontend/.env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# backend/.env
PORT=3001
NODE_ENV=development
DOCKER_ENABLED=false  # Use local Java if available
EXECUTION_TIMEOUT=5000
```

### Staging
```env
# frontend/.env.local
NEXT_PUBLIC_BACKEND_URL=https://staging-backend.your-domain.com

# backend/.env
PORT=3001
NODE_ENV=staging
DOCKER_ENABLED=true
EXECUTION_TIMEOUT=5000
MAX_MEMORY_MB=256
```

### Production
```env
# frontend/.env.local
NEXT_PUBLIC_BACKEND_URL=https://api.your-domain.com

# backend/.env
PORT=3001
NODE_ENV=production
DOCKER_ENABLED=true
EXECUTION_TIMEOUT=5000
MAX_MEMORY_MB=512  # Increase for production
MAX_CPU_CORES=2     # Increase for production
```

## Monitoring & Logging

### Health Checks

**Backend Health Endpoint:**
```bash
curl https://your-backend.com/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-02-21T16:12:00.000Z"
}
```

### Logging

**View Docker Compose Logs:**
```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

**View Individual Container Logs:**
```bash
docker logs -f <container-id>
```

### Monitoring Tools

1. **Uptime Monitoring**: Use UptimeRobot or Pingdom
2. **Error Tracking**: Integrate Sentry
3. **Performance**: Use Vercel Analytics or Google Analytics
4. **Infrastructure**: AWS CloudWatch, Datadog, or New Relic

## Scaling Considerations

### Horizontal Scaling

**Load Balancer Setup (Nginx):**
```nginx
upstream backend_servers {
    least_conn;
    server backend1:3001;
    server backend2:3001;
    server backend3:3001;
}

server {
    location /api {
        proxy_pass http://backend_servers;
    }
}
```

### Database Integration (Future)

For user authentication and code storage:
```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: java_editor
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## Troubleshooting Deployment

### Docker Issues
```bash
# Check Docker daemon
sudo systemctl status docker

# Restart Docker
sudo systemctl restart docker

# Check disk space
df -h

# Clean up Docker
docker system prune -a
```

### Port Conflicts
```bash
# Check what's using port 3000/3001
sudo lsof -i :3000
sudo lsof -i :3001

# Kill process
sudo kill -9 <PID>
```

### Memory Issues
```bash
# Check memory usage
free -h

# Check Docker container memory
docker stats

# Increase swap space (if needed)
sudo dd if=/dev/zero of=/swapfile bs=1G count=4
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## Security Checklist

- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable firewall rules
- [ ] Use environment variables for secrets
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity
- [ ] Implement authentication (if needed)
- [ ] Set up backup strategy
- [ ] Configure DDoS protection

## Backup Strategy

```bash
# Backup Docker volumes
docker run --rm -v java-code-editor_postgres_data:/data -v $(pwd):/backup ubuntu tar czf /backup/postgres-backup.tar.gz /data

# Backup configuration files
tar czf config-backup.tar.gz docker-compose.yml backend/.env frontend/.env.local

# Automated backups (cron)
0 2 * * * /path/to/backup-script.sh
```

## Cost Estimation

### Vercel + Railway
- **Vercel**: Free tier (Hobby) or $20/month (Pro)
- **Railway**: ~$5-20/month depending on usage
- **Total**: $0-40/month

### AWS EC2
- **t2.medium**: ~$30/month
- **Storage**: ~$2/month (20GB)
- **Data Transfer**: Variable
- **Total**: ~$35-50/month

### DigitalOcean
- **Basic Droplet**: $12-24/month
- **App Platform**: $5-12/month per component
- **Total**: ~$20-40/month

## Support & Maintenance

- Monitor error logs daily
- Update dependencies monthly
- Review security advisories
- Test deployments in staging first
- Keep documentation updated
- Maintain backup schedule

---

**Need help?** Check the main README.md or open an issue on GitHub.
