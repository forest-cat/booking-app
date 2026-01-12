# CI/CD Pipeline Documentation

## Overview

This repository uses GitHub Actions for continuous integration and deployment. The pipeline is defined in `.github/workflows/ci.yml`.

## Workflow Features

### Backend Build and Test
- **Build**: Compiles the Spring Boot backend using Gradle
- **Test**: Runs all backend tests with JUnit
- **Database**: Uses PostgreSQL 15 as a service container for integration tests
- **Caching**: Gradle dependencies are cached to optimize build times

### Docker Integration
- **Build**: Creates Docker images for the backend application
- **Push**: Pushes images to DockerHub (only on push to `main` branch)
- **Tagging**: Images are tagged with branch name, commit SHA, and `latest` for main branch

## Triggers

The pipeline runs on:
- **Push** to the `main` branch
- **Pull requests** targeting the `main` branch

## Required Secrets

To enable Docker image publishing, you need to configure the following secrets in your GitHub repository:

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

## Jobs

### 1. backend-build-test

This job:
- Checks out the code
- Sets up JDK 17
- Caches Gradle dependencies
- Builds the application (without running tests first)
- Runs all tests with PostgreSQL service
- Uploads test results as artifacts

**Environment Variables:**
- `SPRING_DATASOURCE_URL`: Points to the PostgreSQL service container
- `SPRING_DATASOURCE_USERNAME`: Database user
- `SPRING_DATASOURCE_PASSWORD`: Database password

### 2. docker-build-push

This job:
- Runs only after successful backend build and test
- Only executes on push to `main` (not on pull requests)
- Builds the Docker image using the existing `Dockerfile`
- Pushes the image to DockerHub with appropriate tags
- Uses GitHub Actions cache for Docker layers

## Docker Image Tags

Images are tagged with:
- `main` - the branch name
- `main-<commit-sha>` - branch with commit SHA
- `latest` - only for the default branch (main)

## Future Enhancements

### Frontend Integration

When a React frontend is added to the repository, the workflow can be extended with:

```yaml
frontend-build-test:
  name: Frontend Build and Test
  runs-on: ubuntu-latest

  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json

    - name: Install dependencies
      working-directory: frontend
      run: npm ci

    - name: Build frontend
      working-directory: frontend
      run: npm run build

    - name: Run frontend tests
      working-directory: frontend
      run: npm test -- --watchAll=false
```

And a separate Docker build step for the frontend if needed.

## Local Testing

To test the workflow components locally:

### Backend Build and Test
```bash
# Build without tests
./gradlew build -x test

# Run tests
./gradlew test
```

### Docker Build
```bash
# Build the Docker image
docker build -t ferry-booking-app:local .

# Test the image
docker-compose up
```

## Troubleshooting

### Gradle Build Fails
- Check that JDK 17 is properly configured
- Ensure Gradle wrapper has execute permissions
- Verify PostgreSQL service is healthy

### Docker Push Fails
- Verify DockerHub secrets are correctly configured
- Check that the DockerHub token has write permissions
- Ensure the repository name matches your DockerHub username

### Tests Fail
- Check PostgreSQL service logs
- Verify database connection settings
- Ensure test database is properly initialized

## Monitoring

After each workflow run:
1. Check the **Actions** tab in your GitHub repository
2. Review build logs for any errors
3. Download test result artifacts for detailed test reports
4. Monitor DockerHub for successfully pushed images
