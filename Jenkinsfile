pipeline {
    agent any

    environment {
        GITHUB_USERNAME = 'mickeydoe' // GitHub username
        IMAGE_NAME = 'projecttwo_back-end' // Docker image name
        GIT_REPO_URL = "https://github.com/${env.GITHUB_USERNAME}/LMS.git"
        GIT_BRANCH = 'main' 
    }

    stages {
        stage('Cleanup Workspace') {
            steps {
                script {
                    dir('/var/lib/jenkins/workspace/Laravel-Backend-CI-CD') {
                        sh 'rm -rf * || true'  // Ensure a clean workspace before cloning
                    }
                }
            }
        }

        stage('Clone Repository') {
            steps {
                script {
                    timeout(time: 10, unit: 'MINUTES') {  // Set a 10-minute timeout for cloning
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

        stage('Push Docker Image') {
            steps {
                script {
                    // Use withCredentials to securely retrieve the GitHub PAT
                    withCredentials([string(credentialsId: 'GITHUB_PAT', variable: 'TOKEN')]) {
                        sh 'echo $TOKEN | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin'
                        
                        // Tag and push the Docker image
                        sh "docker tag ${env.IMAGE_NAME}:latest ghcr.io/${env.GITHUB_USERNAME}/${env.IMAGE_NAME}:latest"
                        sh "docker push ghcr.io/${env.GITHUB_USERNAME}/${env.IMAGE_NAME}:latest"
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
