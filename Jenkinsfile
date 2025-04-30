pipeline {
  agent any

  environment {
    dockerHubRegistry = 'dongjukim123/soundory-be'
    dockerHubRegistryCredential = 'dockerhub-token'
    githubCredential = 'github-token'
    GITHUB_USERNAME = 'rlaehdwn0105'
    GITHUB_REPO = 'Sondory-Service-BE'
  }

  stages {
    stage('Checkout from GitHub') {
      steps {
        checkout([$class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[
            url: "https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git",
            credentialsId: githubCredential
          ]]
        ])
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

    stage('Update values.yaml and Git Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: githubCredential, usernameVariable: 'GH_USER', passwordVariable: 'GH_TOKEN')]) {
          sh """
            git checkout main
            git pull --rebase origin main

            sed -i 's/^  tag: .*/  tag: canary/' helm-chart/my-backend/values.yaml

            git config --global user.name "jenkins-bot"
            git config --global user.email "jenkins@ci.local"

            git add helm-chart/my-backend/values.yaml
            git commit -m "ci: rollout to canary image for build #${BUILD_NUMBER}" || echo "No changes to commit"

            git config credential.helper '!f() { echo "username=${GH_USER}"; echo "password=${GH_TOKEN}"; }; f'
            git push origin main
          """
        }
      }
    }
  }

  post {
    success {
      echo '✅ 성공: Docker 빌드 및 GitOps values.yaml 업데이트 완료'
    }
    failure {
      echo '❌ 실패: 빌드 또는 Git 푸시 확인 필요'
    }
  }
}
