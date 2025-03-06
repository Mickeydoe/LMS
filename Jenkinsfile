pipeline {
    agent any

    environment {
        GITHUB_PAT = credentials('GITHUB_PAT')  // Fetch from Jenkins credentials
        GITHUB_USERNAME = 'mickeydoe' // GitHub username
        IMAGE_NAME = 'projecttwo_back-end' // Docker image name
        GIT_REPO_URL = "https://github.com/${env.GITHUB_USERNAME}/LMS.git"
        GIT_BRANCH = 'main' 
    }

    stages {
        stage('Cleanup Workspace') {
            steps {
                script {
                    sh 'rm -rf * || true'  // Ensure a clean workspace before cloning
                }
            }
        }

        stage('Clone Repository') {
            steps {
                script {
                    timeout(time: , unit: 'MINUTES') {  // Set a 10-minute timeout for cloning
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
                    sh "docker build -t ${env.IMAGE_NAME}:latest ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    sh "echo ${env.GITHUB_PAT} | docker login ghcr.io -u ${env.GITHUB_USERNAME} --password-stdin"
                    sh "docker tag ${env.IMAGE_NAME}:latest ghcr.io/${env.GITHUB_USERNAME}/${env.IMAGE_NAME}:latest"
                    sh "docker push ghcr.io/${env.GITHUB_USERNAME}/${env.IMAGE_NAME}:latest"
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
