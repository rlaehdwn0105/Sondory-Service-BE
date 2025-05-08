pipeline {
  agent any

  environment {
    dockerHubRegistry             = 'dongjukim123/soundory-be'
    dockerHubRegistryCredential   = 'dockerhub-token'
    githubCredential              = 'github-token'
    GITHUB_REPO_URL               = 'https://github.com/rlaehdwn0105/Sondory-Service-BE.git'
    GITHUB_BRANCH                 = 'main'
  }

  stages {
    // … 이전 스테이지 생략 …

    stage('Update Helm values.yaml & Git Push') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: githubCredential,
          usernameVariable: 'GIT_USER',
          passwordVariable: 'GIT_TOKEN'
        )]) {
          sh '''
            set -e

            git config --global user.name "jenkins-bot"
            git config --global user.email "jenkins@ci.local"

            git checkout ${GITHUB_BRANCH}
            git pull --rebase origin ${GITHUB_BRANCH}

            sed -i "s|^  tag: .*|  tag: ${BUILD_NUMBER}|" helm-chart/my-backend/values.yaml

            if git diff --quiet; then
              echo "No changes to commit"
            else
              git commit -am "ci: update helm image tag to ${BUILD_NUMBER}"
            fi

            # -- 여기서 직접 Push --
            git push "https://${GIT_USER}:${GIT_TOKEN}@github.com/rlaehdwn0105/Sondory-Service-BE.git" HEAD:${GITHUB_BRANCH}
          '''
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
