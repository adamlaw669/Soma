# Soma - Deployment Guide

## 🚀 Production Deployment

### Backend Deployment (FastAPI)

#### Prerequisites
- Python 3.9+
- Virtual environment (recommended)
- Database (SQLite for development, PostgreSQL for production)

#### Environment Variables
Create a `.env` file based on `.env.example`:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost/soma_db

# CORS Configuration
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com

# Security (generate strong secrets)
JWT_SECRET_KEY=your-jwt-secret-key-here
ENCRYPTION_KEY=your-encryption-key-here

# Deployment
PORT=8000
HOST=0.0.0.0
WORKERS=4
```

#### Installation Steps
```bash
# 1. Clone repository
git clone <repository-url>
cd soma/backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run database migrations
python -c "from app.db import Base, engine; Base.metadata.create_all(bind=engine)"

# 5. Start production server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

### Frontend Deployment (Next.js)

#### Environment Variables
Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com
```

#### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Manual Deployment
```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Start production server
npm start
```

#### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 🔒 Security Checklist

### Backend Security
- ✅ CORS configured with specific origins
- ✅ Rate limiting (10 requests/minute per IP)
- ✅ Input validation with Pydantic schemas
- ✅ SQL injection prevention with SQLAlchemy ORM
- ✅ Environment variables for sensitive data
- ✅ HTTPS enforcement (configure in reverse proxy)

### Frontend Security
- ✅ No sensitive keys exposed in client code
- ✅ API calls use HTTPS in production
- ✅ Content Security Policy headers (configure in hosting)
- ✅ XSS protection with React's built-in sanitization

## 📊 Monitoring & Performance

### Health Checks
- Backend: `GET /` returns `{"message": "Welcome to Soma API"}`
- Frontend: Check homepage loads correctly

### Performance Optimizations
- ✅ Next.js static generation for marketing pages
- ✅ Image optimization with Next.js Image component
- ✅ Code splitting and lazy loading
- ✅ Gzip compression (configure in server)

### Monitoring Endpoints
Add these to your monitoring system:
- `GET /health` - Backend health check
- Monitor response times for `/predict` endpoint
- Track rate limit violations
- Monitor database connection pool

## 🚨 Production Checklist

### Pre-deployment
- [ ] All tests pass
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Domain DNS configured
- [ ] CDN configured (if applicable)

### Post-deployment
- [ ] Health checks passing
- [ ] SSL/HTTPS working
- [ ] API endpoints responding correctly
- [ ] Frontend loading properly
- [ ] Database connections working
- [ ] Rate limiting functioning
- [ ] Error reporting configured

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `ALLOWED_ORIGINS` environment variable
   - Ensure frontend domain is included

2. **Rate Limit Errors**
   - Expected behavior for >10 requests/minute
   - Consider increasing limits for production

3. **Database Connection Issues**
   - Verify `DATABASE_URL` format
   - Check database server is running
   - Ensure connection pool limits

4. **Build Failures**
   - Check Node.js version compatibility
   - Clear `node_modules` and reinstall
   - Verify all environment variables

## 📞 Support

For deployment issues or questions:
- Check logs first: `docker logs <container-name>`
- Review environment variable configuration
- Test API endpoints with curl/Postman
- Monitor resource usage (CPU, memory, disk)