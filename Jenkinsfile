pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'mickeydoe/projecttwo_backend:latest'
        DOCKER_HUB_USERNAME = credentials('docker-username')  
        DOCKER_HUB_PASSWORD = credentials('docker-password')
    }

    stages {
        stage('Cleanup Workspace') {
            steps {
                deleteDir()  // Delete previous files to avoid corruption
            }
        }

        stage('Prepare Git') {
            steps {
                sh 'git config --global http.postBuffer 524288000'
                sh 'git config --global core.compression 0'
            }
        }

        stage('Clone Repository') {
            steps {
                checkout scmGit(
                    branches: [[name: '*/main']], 
                    extensions: [cloneOption(shallow: true, depth: 1, timeout: 120)],  
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
