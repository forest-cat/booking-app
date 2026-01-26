# Docker Build and Deployment Guide

## Overview

This document provides additional information about building and deploying the ferry booking application with Docker.

## Docker Build Configuration

### Frontend NPM Dependencies Configuration

The frontend Dockerfile has been configured to handle dependency installation intelligently:

#### Lock File Strategy

The frontend uses a conditional installation approach that checks for the presence of a lock file:

```dockerfile
RUN if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then \
      echo "Lock file found, using npm ci for clean install..."; \
      npm ci; \
    else \
      echo "No lock file found, using npm install..."; \
      npm install; \
    fi
```

#### Why This Matters

- **`npm ci`** (Clean Install): Requires a `package-lock.json` or `npm-shrinkwrap.json` file. It's faster and more reliable for production builds as it installs exact versions from the lock file and removes the node_modules directory before installation.

- **`npm install`**: Works without a lock file but may install different dependency versions over time. Used as a fallback when no lock file is present.

#### Best Practices

1. **Always commit package-lock.json**: The `package-lock.json` file is now tracked in the repository to ensure consistent builds across all environments (local, CI/CD, Docker).

2. **Lock file benefits**:
   - Guarantees deterministic builds
   - Faster installation in Docker (npm ci is optimized for CI/CD)
   - Prevents "works on my machine" issues caused by dependency version differences

3. **If you need to update dependencies**:
   ```bash
   cd frontend
   npm install <package-name>
   git add package.json package-lock.json
   git commit -m "Update frontend dependencies"
   ```

### Spring Boot JAR Configuration

The application uses Spring Boot Gradle plugin which by default creates two JAR files:
1. `ferry-booking-app-0.0.1-SNAPSHOT.jar` - The executable JAR with all dependencies (Spring Boot fat JAR)
2. `ferry-booking-app-0.0.1-SNAPSHOT-plain.jar` - Plain JAR with only application classes (without dependencies)

For Docker deployment, we only need the executable JAR. To avoid conflicts when copying JAR files in the Dockerfile, the plain JAR generation has been disabled in `build.gradle`:

```gradle
tasks.named('jar') {
    enabled = false
}
```

This ensures that `COPY --from=build /app/build/libs/*.jar app.jar` in the Dockerfile will only match one file.

### Alternative Solutions

If you need to keep both JARs for other purposes, you can modify the Dockerfile COPY command to handle multiple files:

**Option 1**: Copy to a directory (add trailing slash)
```dockerfile
COPY --from=build /app/build/libs/*.jar ./jars/
```

**Option 2**: Copy all JARs and select the correct one with RUN command
```dockerfile
COPY --from=build /app/build/libs/*.jar ./
# The executable JAR is much larger than the plain JAR
RUN mv $(ls -S *.jar | grep -v plain | head -1) app.jar && rm -f *-plain.jar
```

**Option 3**: Use an exact filename pattern (requires knowing the version)
```dockerfile
COPY --from=build /app/build/libs/ferry-booking-app-0.0.1-SNAPSHOT.jar app.jar
```

Note: Option 3 requires updating the Dockerfile whenever the version changes, so it's less flexible.

## Docker Buildx

### What is Docker Buildx?

Docker Buildx is an extended build capabilities plugin that comes with Docker and provides:
- Multi-platform image building
- Advanced caching mechanisms
- Build optimization features
- Support for Docker Compose build enhancements

### Buildx Warning in Docker Compose

When running `docker-compose up --build` or `docker compose build`, you might see a warning about buildx not being installed. This warning is informational and doesn't prevent the build from succeeding.

#### Understanding the Warning

The warning typically appears as:
```
WARNING: buildx: git was not found or not configured. Plugin functionality may be limited.
```

This occurs because:
1. Docker Compose V2 integrates with Docker Buildx for improved build performance
2. The warning appears when buildx features are requested but not fully available
3. Standard docker builds still work fine without buildx

#### Fix Options

**Option 1: Install Docker Buildx** (Recommended for production)

Buildx is included in Docker Desktop by default. For Docker Engine on Linux:

```bash
# Install buildx plugin
mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/buildx/releases/download/v0.12.0/buildx-v0.12.0.linux-amd64 -o ~/.docker/cli-plugins/docker-buildx
chmod +x ~/.docker/cli-plugins/docker-buildx

# Verify installation
docker buildx version
```

**Option 2: Use Standard Docker Build**

For development, you can use standard docker build commands which don't require buildx:

```bash
# Build the Docker image directly
docker build -t ferry-booking-app .

# Run with docker-compose using the pre-built image
docker compose up
```

**Option 3: Suppress the Warning**

The warning is informational and can be safely ignored during development. The standard Docker build process will still work correctly.

### Using Buildx Features

If buildx is installed, you can leverage its advanced features:

```bash
# Create and use a builder instance
docker buildx create --name mybuilder --use
docker buildx inspect --bootstrap

# Build with caching
docker buildx build --cache-from=type=local,src=/tmp/.buildx-cache --cache-to=type=local,dest=/tmp/.buildx-cache -t ferry-booking-app .

# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -t ferry-booking-app .
```

## Troubleshooting

### Frontend Build Issues

#### npm ci Requires Lock File

If you see an error like:
```
npm ERR! `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync
```
or
```
npm ERR! `npm ci` requires a package-lock.json or npm-shrinkwrap.json
```

**Solution**: The frontend Dockerfile now automatically handles this by checking for the lock file and falling back to `npm install` if needed. However, for production builds, ensure `package-lock.json` is committed to the repository:

```bash
cd frontend
npm install  # This will generate package-lock.json if missing
git add package-lock.json
git commit -m "Add package-lock.json for consistent builds"
```

#### Frontend Dependencies Out of Sync

If the frontend build fails with dependency-related errors, try:

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
# Test the build locally
npm run build
# If successful, commit the new lock file
git add package-lock.json
git commit -m "Update package-lock.json"
```

### Backend Build Issues

### Build Fails with SSL Certificate Errors

If you encounter SSL certificate errors during the Gradle build inside Docker:

```
Exception in thread "main" javax.net.ssl.SSLHandshakeException: PKIX path building failed
```

This typically occurs in restrictive network environments. Solutions:

1. **Check network proxy settings** - Ensure proxy configuration is correct
2. **Add CA certificates** - Add required CA certificates to the Docker image
3. **Use Gradle cache** - Pre-download dependencies before building the Docker image

### Multiple JAR Files Error

If you see an error like:
```
When using COPY with more than one source file, the destination must be a directory and end with a /
```

This means the Gradle build created multiple JAR files. Follow the Spring Boot JAR Configuration section above to resolve this.

## Best Practices

1. **Use Multi-Stage Builds**: The Dockerfile uses multi-stage builds to minimize the final image size
2. **Disable Plain JAR**: For Docker deployments, disable the plain JAR generation to avoid conflicts
3. **Cache Dependencies**: Use Docker layer caching and buildx cache features for faster builds
4. **Security**: Regularly update base images (`eclipse-temurin:17-jdk-alpine`, `eclipse-temurin:17-jre-alpine`)
5. **Build locally first**: Test Gradle builds locally before building in Docker to catch issues earlier

## CI/CD Considerations

In the CI/CD pipeline (`.github/workflows/ci.yml`):
- Buildx is properly configured using `docker/setup-buildx-action@v3`
- Build caching is enabled with GitHub Actions cache
- No warnings should appear in CI environment

For local development, buildx is optional and the warning can be safely ignored.
