pipeline {
  agent any

  environment {
    dockerHubRegistry = 'dongjukim123/soundory-be'
    dockerHubRegistryCredential = 'dockerhub-token'
    githubCredential = 'github-token'
    GITHUB_USERNAME = 'rlaehdwn0105'
    GITHUB_REPO = 'https://github.com/rlaehdwn0105/Sondory-Service-BE.git'
  }

  stages {

    stage('Checkout from GitHub') {
      steps {
        checkout([$class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[
            url: "${env.GITHUB_REPO}",
            credentialsId: githubCredential
          ]]
        ])
        sh 'git checkout main'  // detached HEAD 방지
      }
    }

    stage('Docker Build & Tag') {
      steps {
        sh """
          docker build -t ${dockerHubRegistry}:${BUILD_NUMBER} .
          docker tag ${dockerHubRegistry}:${BUILD_NUMBER} ${dockerHubRegistry}:latest
          docker tag ${dockerHubRegistry}:${BUILD_NUMBER} ${dockerHubRegistry}:canary
        """
      }
    }

    stage('Push Docker Images') {
      steps {
        withDockerRegistry(credentialsId: dockerHubRegistryCredential, url: '') {
          sh """
            docker push ${dockerHubRegistry}:${BUILD_NUMBER}
            docker push ${dockerHubRegistry}:latest
            docker push ${dockerHubRegistry}:canary
          """
        }
      }
    }

    stage('Update values.yaml & Git Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: githubCredential, usernameVariable: 'GH_USER', passwordVariable: 'GH_TOKEN')]) {
          sh """
            git checkout main

            sed -i 's/^  tag: .*/  tag: canary/' helm-chart/my-backend/values.yaml

            git config --global user.name "jenkins-bot"
            git config --global user.email "jenkins@ci.local"

            git add helm-chart/my-backend/values.yaml
            git commit -m "ci: rollout to canary image for build #${BUILD_NUMBER}" || echo "No changes to commit"
            git push https://${GH_USER}:${GH_TOKEN}@github.com/${GITHUB_USERNAME}/Sondory-Service-BE.git main
          """
        }
      }
    }
  }

  post {
    success {
      echo '✅ CI/CD 완료 - Docker 이미지 푸시 및 GitOps 업데이트 완료'
    }
    failure {
      echo '❌ 실패 - Docker 빌드 또는 Git 푸시 실패, 로그 확인 필요'
    }
  }
}
