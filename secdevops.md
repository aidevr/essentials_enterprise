# Express API Docker Lambda Deployment

A complete Node.js Express API application with Docker containerization and GitHub Actions deployment to AWS Lambda.

## 🚀 Features

- **Express.js API** with health check and user management endpoints
- **Docker containerization** for local development and cloud deployment  
- **AWS Lambda deployment** using container images
- **GitHub Actions CI/CD** pipeline for automated deployment
- **Security best practices** with non-root user in Docker

## 📁 Project Structure

```
├── app.js                          # Main Express application
├── lambda.js                       # Lambda handler wrapper
├── package.json                    # Node.js dependencies
├── Dockerfile                      # Docker image for local/general use
├── Dockerfile.lambda               # Docker image optimized for Lambda
├── .github/workflows/deploy.yml    # GitHub Actions workflow
└── README.md                       # This file
```

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- Docker
- Git

### Run Locally
```bash
# Clone the repository
git clone <your-repo-url>
cd express-api-docker

# Install dependencies
npm install

# Run the application
npm start

# Or run in development mode
npm run dev
```

**API Endpoints:**
- `GET /health` - Health check
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user

## 🐳 Docker Development

### Build and Run with Docker
```bash
# Build the image
docker build -t express-api .

# Run the container
docker run -p 3000:3000 express-api

# Access the API
curl http://localhost:3000/health
```

### Lambda Docker Image
```bash
# Build Lambda-specific image
docker build -f Dockerfile.lambda -t express-api-lambda .

# Test locally with Lambda Runtime Interface Emulator
docker run -p 9000:8080 express-api-lambda

# Test the function
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" \
  -d '{"httpMethod":"GET","path":"/health","headers":{}}'
```

## ☁️ AWS Lambda Deployment

### Prerequisites

1. **AWS Account** with appropriate permissions
2. **GitHub Repository** with the code
3. **GitHub Secrets** configured:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY` 
   - `AWS_ACCOUNT_ID`

### Required AWS Resources

#### 1. Create Lambda Execution Role
```bash
aws iam create-role \
  --role-name lambda-execution-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {"Service": "lambda.amazonaws.com"},
        "Action": "sts:AssumeRole"
      }
    ]
  }'

aws iam attach-role-policy \
  --role-name lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

#### 2. GitHub Secrets Setup
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key  
- `AWS_ACCOUNT_ID`: Your 12-digit AWS account ID

### Deployment Process

1. **Push to main branch** triggers the GitHub Actions workflow
2. **Workflow steps:**
   - Run tests
   - Build Docker image for Lambda
   - Push image to Amazon ECR
   - Update/create Lambda function
   - Configure API Gateway (optional)

### Manual Deployment Commands

```bash
# Configure AWS CLI
aws configure

# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

docker build -f Dockerfile.lambda -t express-api-lambda .
docker tag express-api-lambda:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/express-api-lambda:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/express-api-lambda:latest

# Create/update Lambda function
aws lambda create-function \
  --function-name express-api-function \
  --package-type Image \
  --code ImageUri=<account-id>.dkr.ecr.us-east-1.amazonaws.com/express-api-lambda:latest \
  --role arn:aws:iam::<account-id>:role/lambda-execution-role \
  --timeout 30 \
  --memory-size 256
```

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

### Customization
- Modify `app.js` to add your API endpoints
- Update `package.json` dependencies as needed
- Adjust Docker configurations in Dockerfiles
- Customize GitHub Actions workflow in `.github/workflows/deploy.yml`

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Repo   │───▶│ GitHub Actions  │───▶│   Amazon ECR    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        │
                       ┌─────────────────┐              │
                       │   Docker Build  │◀─────────────┘
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  AWS Lambda     │◀───│  API Gateway    │
                       │  (Container)    │    │   (Optional)    │
                       └─────────────────┘    └─────────────────┘
```

## 🧪 Testing

### Local Testing
```bash
# Health check
curl http://localhost:3000/health

# Get users
curl http://localhost:3000/api/users

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

### Lambda Testing
After deployment, test your Lambda function:
```bash
# Using AWS CLI
aws lambda invoke \
  --function-name express-api-function \
  --payload '{"httpMethod":"GET","path":"/health","headers":{}}' \
  response.json

cat response.json
```

## 🔒 Security Best Practices

- Non-root user in Docker containers
- Minimal base images (Alpine)
- Health checks configured
- IAM roles with least privilege
- Environment-specific configurations
- Secrets managed via GitHub Secrets

## 📊 Monitoring

- CloudWatch logs automatic for Lambda
- Health check endpoint for monitoring
- Container health checks configured
- GitHub Actions deployment notifications

## 🚨 Troubleshooting

### Common Issues:
1. **ECR repository doesn't exist**: Workflow creates it automatically
2. **Lambda function not found**: Workflow creates it automatically  
3. **Permission denied**: Check IAM role and GitHub secrets
4. **Image too large**: Optimize Dockerfile and dependencies

### Debug Commands:
```bash
# Check Lambda logs
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/express-api-function

# Test Docker image locally
docker run -it --entrypoint sh express-api-lambda

# Check ECR repositories
aws ecr describe-repositories
```

## 📝 License

MIT License - feel free to use this in your projects!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Happy coding! 🎉**