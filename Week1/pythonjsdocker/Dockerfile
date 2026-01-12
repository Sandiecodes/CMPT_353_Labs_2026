# Base image
FROM python:latest
# Set working directory
WORKDIR /app
# Copy files
COPY hello.py /app
# Install dependencies
RUN pip install Flask
EXPOSE 5000
CMD ["/bin/bash"]
