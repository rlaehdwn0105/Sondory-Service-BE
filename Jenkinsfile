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
    stage('Checkout from GitHub') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: "refs/heads/${GITHUB_BRANCH}"]],
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

    stage('Push Docker Images to Hub') {
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

    stage('Update Helm values.yaml & Git Push') {
      steps {
        // 깃 사용자명/토큰 바인딩
        withCredentials([usernamePassword(
          credentialsId: githubCredential,
          usernameVariable: 'GIT_USER',
          passwordVariable: 'GIT_TOKEN'
        )]) {
          sh '''
            set -e

            # Git 설정
            git config --global user.name "jenkins-bot"
            git config --global user.email "jenkins@ci.local"

            # 최신 main 브랜치 가져오기
            git checkout ${GITHUB_BRANCH}
            git pull --rebase origin ${GITHUB_BRANCH}

            # values.yaml 의 tag 값을 BUILD_NUMBER 로 교체
            sed -i "s|^  tag: .*|  tag: ${BUILD_NUMBER}|" helm-chart/my-backend/values.yaml

            # 변경사항 커밋
            if git diff --quiet; then
              echo "No changes to commit"
            else
              git commit -am "ci: update helm image tag to ${BUILD_NUMBER}"
            fi

            # 인증 토큰을 포함한 원격 URL로 변경 후 푸시
            git remote set-url origin "https://${GIT_USER}:${GIT_TOKEN}@github.com/rlaehdwn0105/Sondory-Service-BE.git"
            git push origin ${GITHUB_BRANCH}
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
