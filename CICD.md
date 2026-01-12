# CI/CD Pipeline Documentation

## Overview

This repository uses GitHub Actions for continuous integration and deployment. The pipeline is defined in `.github/workflows/ci.yml`.

## Workflow Features

### Backend Build and Test
- **Build**: Compiles the Spring Boot backend using Gradle
- **Test**: Runs all backend tests with JUnit
- **Database**: Uses PostgreSQL 15 as a service container for integration tests
- **Caching**: Gradle dependencies are cached to optimize build times

### Frontend Build and Test
- **Build**: Compiles the React frontend using Node.js 18 and npm
- **Test**: Runs frontend tests (if configured)
- **Caching**: npm dependencies are cached to optimize build times
- **Artifacts**: Frontend build artifacts are uploaded for review

### Docker Integration
- **Build**: Creates Docker images for both backend and frontend applications
- **Push**: Optionally pushes images to DockerHub (only on push to `main` branch, if credentials are configured)
- **Tagging**: Images are tagged with branch name, commit SHA, and `latest` for main branch
- **Flexibility**: Works without DockerHub credentials - builds images locally for testing

## Triggers

The pipeline runs on:
- **Push** to the `main` branch
- **Pull requests** targeting the `main` branch

## Required Secrets (Optional)

Docker image publishing is **optional**. The pipeline will work without these secrets by building images locally.

To enable Docker image publishing to DockerHub, configure the following secrets in your GitHub repository:

### Setting Up Secrets

1. Go to your repository on GitHub
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `DOCKERHUB_USERNAME` | Your DockerHub username | `myusername` |
| `DOCKERHUB_TOKEN` | DockerHub access token | `dckr_pat_xxxxxxxxxxxx` |

### Creating a DockerHub Access Token

1. Log in to [DockerHub](https://hub.docker.com/)
2. Go to **Account Settings** → **Security**
3. Click **New Access Token**
4. Give it a descriptive name (e.g., "GitHub Actions")
5. Copy the token and add it as `DOCKERHUB_TOKEN` secret in GitHub

**Note**: If these secrets are not configured, the pipeline will still build Docker images but will not push them to DockerHub. This allows development teams to use the pipeline without requiring DockerHub accounts.

## Jobs

### 1. backend-build-test

This job builds and tests the Spring Boot backend:
- Checks out the code
- Sets up JDK 17 (Eclipse Temurin distribution)
- Caches Gradle dependencies for faster subsequent builds
- Builds the application (without running tests first to separate concerns)
- Runs all tests with PostgreSQL service container
- Uploads test results as artifacts (even on failure for debugging)

**Environment Variables:**
- `SPRING_DATASOURCE_URL`: Points to the PostgreSQL service container
- `SPRING_DATASOURCE_USERNAME`: Database user for tests
- `SPRING_DATASOURCE_PASSWORD`: Database password for tests

### 2. frontend-build-test

This job builds and tests the React frontend:
- Checks out the code
- Sets up Node.js 18
- Caches npm dependencies for faster subsequent builds
- Installs dependencies using `npm ci` (clean install for reproducibility)
- Builds the React application
- Runs frontend tests (with `--passWithNoTests` to not fail if no tests exist yet)
- Uploads frontend build artifacts

### 3. docker-build-push

This job builds Docker images for deployment:
- Runs only after successful backend and frontend builds
- Only executes on push to `main` (not on pull requests)
- Checks if DockerHub credentials are available
- Sets up Docker Buildx for advanced features (caching, multi-platform support)
- Logs into DockerHub (only if credentials are configured)
- Builds backend Docker image from `./Dockerfile`
- Builds frontend Docker image from `./frontend/Dockerfile`
- Pushes images to DockerHub (only if credentials are available)
- Uses GitHub Actions cache for Docker layers to speed up builds
- Provides a summary of what was built and pushed

**Conditional Push Logic:**
- If DockerHub secrets are configured: Builds and pushes images with proper tags
- If DockerHub secrets are NOT configured: Builds images locally for validation (tagged as `local`)

## Docker Image Tags

When pushed to DockerHub, images are tagged with:
- `main` - the branch name
- `main-<commit-sha>` - branch with commit SHA
- `latest` - only for the default branch (main)

Two separate images are created:
- `ferry-booking-app-backend` - Spring Boot backend
- `ferry-booking-app-frontend` - React frontend with Nginx

## Local Testing

To test the workflow components locally:

### Backend Build and Test
```bash
# Build without tests
./gradlew build -x test

# Run tests
./gradlew test
```

### Frontend Build and Test
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm ci

# Build the frontend
npm run build

# Run tests
npm test -- --watchAll=false
```

### Docker Build
```bash
# Build the backend Docker image
docker build -t ferry-booking-app-backend:local .

# Build the frontend Docker image
docker build -t ferry-booking-app-frontend:local ./frontend

# Test both with docker-compose
docker-compose up
```

## Troubleshooting

### Gradle Build Fails
- Check that JDK 17 is properly configured
- Ensure Gradle wrapper has execute permissions (`chmod +x gradlew`)
- Verify PostgreSQL service is healthy
- Check database connection settings in application properties

### Frontend Build Fails
- Verify Node.js 18 is installed
- Check that `package-lock.json` exists (run `npm install` if missing)
- Review build errors in the logs
- Ensure all dependencies are compatible

### Docker Build Fails
- **Backend**: Verify Gradle build succeeds first
- **Frontend**: Verify npm build succeeds first
- Check that Dockerfiles exist in correct locations
- Review Docker build logs for specific errors

### Docker Push Fails (if using DockerHub)
- Verify DockerHub secrets are correctly configured in GitHub repository settings
- Check that the DockerHub token has write permissions
- Ensure the repository name matches your DockerHub username
- Verify you're not exceeding DockerHub rate limits

### Tests Fail
- Check PostgreSQL service logs in the GitHub Actions run
- Verify database connection settings match the service configuration
- Ensure test database is properly initialized
- Review test output in uploaded artifacts

### No DockerHub Credentials
This is **not an error**! The pipeline is designed to work without DockerHub:
- Docker images will be built successfully for validation
- Images will be tagged as `local` instead of being pushed
- All other pipeline steps will complete normally
- To enable pushing, simply add the DockerHub secrets as described above

## Monitoring

After each workflow run:
1. Check the **Actions** tab in your GitHub repository
2. Review build logs for any errors or warnings
3. Download test result artifacts for detailed test reports
4. Check the job summary for Docker build status
5. If DockerHub is configured, monitor DockerHub for successfully pushed images

## Best Practices

1. **Run tests locally** before pushing to ensure quick feedback
2. **Keep dependencies updated** to get security patches and bug fixes
3. **Review failed builds promptly** to maintain code quality
4. **Use meaningful commit messages** to track changes in workflow runs
5. **Monitor resource usage** to optimize build times
6. **Cache effectively** - the pipeline uses caching for Gradle, npm, and Docker layers
7. **Test Docker builds locally** using `docker-compose` before pushing

## Advanced Configuration

### Customizing Build Steps

You can customize the workflow by modifying `.github/workflows/ci.yml`:

```yaml
# Add environment-specific builds
- name: Build for production
  run: ./gradlew build -Pprofile=prod

# Add code quality checks
- name: Run linter
  working-directory: frontend
  run: npm run lint

# Add security scanning
- name: Run security audit
  run: npm audit --audit-level=moderate
```

### Multi-Platform Docker Builds

If you need to build for multiple platforms (e.g., AMD64 and ARM64):

```yaml
- name: Build multi-platform backend image
  uses: docker/build-push-action@v5
  with:
    context: .
    platforms: linux/amd64,linux/arm64
    push: ${{ steps.dockerhub-check.outputs.available == 'true' }}
    tags: ${{ steps.meta-backend.outputs.tags }}
```

### Deployment Steps

To add automated deployment (e.g., to Kubernetes, AWS, Azure):

```yaml
deploy:
  name: Deploy to Production
  runs-on: ubuntu-latest
  needs: docker-build-push
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  
  steps:
    - name: Deploy to environment
      run: |
        # Add your deployment commands here
        echo "Deploying to production..."
```

## Pipeline Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   Push to main or PR                     │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ├──────────────┬─────────────────────┐
                      ▼              ▼                     ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │   Backend    │  │   Frontend   │  │              │
            │ Build & Test │  │ Build & Test │  │              │
            │  (Gradle)    │  │    (npm)     │  │              │
            └──────┬───────┘  └──────┬───────┘  │              │
                   │                 │           │              │
                   └────────┬────────┘           │              │
                            ▼                    │              │
                    (on main push only)          │              │
                   ┌─────────────────┐           │              │
                   │ Check DockerHub │           │              │
                   │   Credentials   │           │              │
                   └────────┬────────┘           │              │
                            │                    │              │
                   ┌────────┴────────┐           │              │
                   ▼                 ▼           │              │
           ┌──────────────┐   ┌──────────────┐  │              │
           │  Build & Push│   │  Build Only  │  │              │
           │  to DockerHub│   │   (Local)    │  │              │
           │   Backend +  │   │  Backend +   │  │              │
           │   Frontend   │   │   Frontend   │  │              │
           └──────────────┘   └──────────────┘  │              │
                   │                 │           │              │
                   └────────┬────────┘           │              │
                            ▼                    │              │
                    ┌──────────────┐             │              │
                    │   Success!   │             │              │
                    └──────────────┘             │              │
```

## Support

For issues or questions about the CI/CD pipeline:
1. Check the [GitHub Actions documentation](https://docs.github.com/en/actions)
2. Review workflow run logs in the Actions tab
3. Consult this documentation and `DOCKER.md` for Docker-specific issues
4. Open an issue in the repository for team discussion
