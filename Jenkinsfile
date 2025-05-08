pipeline {
  agent any
  environment {
    DOCKER_REGISTRY         = 'dongjukim123/soundory-be'
    DOCKER_CREDENTIALS      = 'dockerhub-token'
    GITHUB_CREDENTIALS      = 'github-token'
    GITHUB_REPO_URL         = 'https://github.com/rlaehdwn0105/Sondory-Service-BE.git'
    GITHUB_BRANCH           = 'main'
  }
  stages {
    stage('Checkout') {
      steps {
        checkout([$class: 'GitSCM',
          branches: [[name: "refs/heads/${env.GITHUB_BRANCH}"]],
          userRemoteConfigs: [[
            url: "${env.GITHUB_REPO_URL}",
            credentialsId: "${env.GITHUB_CREDENTIALS}"
          ]]
        ])
      }
    }
    stage('Build & Push Docker') {
      steps {
        sh """
          docker build -t ${env.DOCKER_REGISTRY}:${BUILD_NUMBER} .
          docker tag  ${env.DOCKER_REGISTRY}:${BUILD_NUMBER} ${env.DOCKER_REGISTRY}:canary
          docker tag  ${env.DOCKER_REGISTRY}:${BUILD_NUMBER} ${env.DOCKER_REGISTRY}:latest
        """
        withDockerRegistry(credentialsId: "${env.DOCKER_CREDENTIALS}", url: '') {
          sh """
            docker push ${env.DOCKER_REGISTRY}:${BUILD_NUMBER}
            docker push ${env.DOCKER_REGISTRY}:canary
            docker push ${env.DOCKER_REGISTRY}:latest
          """
        }
      }
    }
    stage('Update Helm values & Git Push') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: "${env.GITHUB_CREDENTIALS}",
          usernameVariable: 'GIT_USER',
          passwordVariable: 'GIT_TOKEN'
        )]) {
          sh """
            set -euxo pipefail

            git config user.name  "jenkins-bot"
            git config user.email "jenkins@ci.local"

            git checkout ${env.GITHUB_BRANCH}
            git pull --rebase origin ${env.GITHUB_BRANCH}

            # Helm values.yaml의 tag 수정
            sed -i'' -e "s|^  tag: .*\$|  tag: ${BUILD_NUMBER}|" \\
              helm-chart/my-backend/values.yaml

            # 변경사항이 있을 때만 커밋 및 푸시
            if ! git diff --quiet helm-chart/my-backend/values.yaml; then
              git add helm-chart/my-backend/values.yaml
              git commit -m "ci: update helm image tag to ${BUILD_NUMBER}"
              git push https://${GIT_USER}:${GIT_TOKEN}@github.com/rlaehdwn0105/Sondory-Service-BE.git \\
                ${env.GITHUB_BRANCH}
            else
              echo "values.yaml is already up-to-date."
            fi
          """
        }
      }
    }
  }
  post {
    success {
      echo '✅ 성공: 이미지 빌드·푸시 및 values.yaml 업데이트 완료'
    }
    failure {
      echo '❌ 실패: 파이프라인 실행 중 오류 발생'
    }
  }
}
