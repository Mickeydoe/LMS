pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'mickeydoe' //  Docker Hub username
        IMAGE_NAME = 'projecttwo_back-end' // Docker image name
        GITHUB_USERNAME = 'mickeydoe' // GitHub username
        GIT_REPO_URL = "https://github.com/${env.GITHUB_USERNAME}/LMS.git"
        GIT_BRANCH = 'main' 
    }

    stages {
        stage('Cleanup Workspace') {
            steps {
                script {
                    dir('/var/lib/jenkins/workspace/Laravel-Backend-CI-CD') {
                        sh 'rm -rf * || true'
                    }
                }
            }
        }

        stage('Clone Repository') {
            steps {
                script {
                    timeout(time: 10, unit: 'MINUTES') {
                        checkout([
                            $class: 'GitSCM',
                            branches: [[name: "*/${env.GIT_BRANCH}"]],
                            userRemoteConfigs: [[
                                url: env.GIT_REPO_URL,
                                credentialsId: 'GITHUB_PAT'
                            ]]
                        ])
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dir('back-end') {
                        sh "DOCKER_BUILDKIT=0 docker build -t ${env.IMAGE_NAME}:latest ."
                    }
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CREDENTIALS', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                        sh "docker tag ${IMAGE_NAME}:latest $DOCKER_USER/${IMAGE_NAME}:latest"
                        sh "docker push $DOCKER_USER/${IMAGE_NAME}:latest"
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo "Deployment steps can be added here"
            }
        }
    }

    post {
        success {
            echo "Pipeline executed successfully!"
        }
        failure {
            echo "Pipeline failed. Check logs for details."
        }
    }
}
