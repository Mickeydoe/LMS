pipeline {
    agent any

    environment {
        GITHUB_PAT = credentials('GITHUB_PAT')  // Fetch from Jenkins credentials
        GITHUB_USERNAME = 'mickeydoe' // Your GitHub username
        IMAGE_NAME = 'projecttwo_back-end' // Your correct Docker image name
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/main']],  // Adjust if using another branch
                        userRemoteConfigs: [[
                            url: "https://github.com/${env.GITHUB_USERNAME}/LMS.git",
                            credentialsId: 'GITHUB_PAT'
                        ]]
                    ])
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
