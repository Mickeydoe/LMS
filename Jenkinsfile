pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'mickeydoe/projecttwo_backend:latest'
        DOCKER_HUB_USERNAME = credentials('docker-username')  // Store DockerHub credentials in Jenkins
        DOCKER_HUB_PASSWORD = credentials('docker-password')
    }

    stages {
        stage('Clone Repository') {
            steps {
                checkout scmGit(
                    branches: [[name: '*/main']], 
                    extensions: [cloneOption(noTags: false, reference: '', shallow: false, timeout: 30)], 
                    userRemoteConfigs: [[url: 'https://github.com/Mickeydoe/LMS.git']]
                )
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh 'echo $DOCKER_HUB_PASSWORD | docker login -u $DOCKER_HUB_USERNAME --password-stdin'
                sh 'docker push $DOCKER_IMAGE'
            }
        }

        stage('Deploy Backend') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
}
