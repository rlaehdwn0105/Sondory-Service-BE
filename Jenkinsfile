pipeline {
  agent any

  environment {
    dockerHubRegistry = 'dongjukim123/soundory-be'
    dockerHubRegistryCredential = 'dockerhub-token'       // DockerHub 로그인용
    githubCredential = 'github-token'                     // GitHub Token (usernamePassword 타입)
    GITHUB_REPO_URL = 'https://github.com/rlaehdwn0105/Sondory-Service-BE.git'
    GITHUB_BRANCH = 'main'
  }

  stages {
    stage('Checkout from GitHub') {
      steps {
        checkout([$class: 'GitSCM',
          branches: [[name: "*/${GITHUB_BRANCH}"]],
          userRemoteConfigs: [[
            url: "${GITHUB_REPO_URL}",
            credentialsId: githubCredential
          ]]
        ])
      }
    }

    stage('Docker Build & Tag') {
      steps {
        sh """
          docker build -t ${dockerHubRegistry}:${BUILD_NUMBER} .
          docker tag ${dockerHubRegistry}:${BUILD_NUMBER} ${dockerHubRegistry}:canary
          docker tag ${dockerHubRegistry}:${BUILD_NUMBER} ${dockerHubRegistry}:latest
        """
      }
    }

    stage('Push Docker Images') {
      steps {
        withDockerRegistry(credentialsId: dockerHubRegistryCredential, url: '') {
          sh """
            docker push ${dockerHubRegistry}:${BUILD_NUMBER}
            docker push ${dockerHubRegistry}:canary
            docker push ${dockerHubRegistry}:latest
          """
        }
      }
    }

    stage('Update values.yaml and Git Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: githubCredential, usernameVariable: 'GH_USER', passwordVariable: 'GH_TOKEN')]) {
          sh '''
            git pull --rebase origin ${GITHUB_BRANCH}

            sed -i 's/^  tag: .*/  tag: canary/' helm-chart/my-backend/values.yaml

            git add helm-chart/my-backend/values.yaml
            git commit -m "ci: rollout to canary image for build #${BUILD_NUMBER}" || echo "No changes to commit"

            git remote set-url origin https://${GH_USER}:${GH_TOKEN}@github.com/rlaehdwn0105/Sondory-Service-BE.git
            git push origin ${GITHUB_BRANCH}
          '''
        }
      }
    }
  }

  post {
    success {
      echo '✅ 성공: Docker 이미지 빌드 및 values.yaml 업데이트 완료'
    }
    failure {
      echo '❌ 실패: 빌드 또는 Git 푸시에 문제가 발생했습니다.'
    }
  }
}
