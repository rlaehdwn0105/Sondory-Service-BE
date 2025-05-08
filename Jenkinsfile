pipeline {
  agent any
  environment {
    DOCKER_REGISTRY    = 'dongjukim123/soundory-be'
    DOCKER_CREDENTIALS = 'dockerhub-token'
    GITHUB_CREDENTIALS = 'github-token'
    GITHUB_REPO_URL    = 'https://github.com/rlaehdwn0105/Sondory-Service-BE.git'
    GITHUB_BRANCH      = 'main'
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
          docker tag ${env.DOCKER_REGISTRY}:${BUILD_NUMBER} ${env.DOCKER_REGISTRY}:canary
          docker tag ${env.DOCKER_REGISTRY}:${BUILD_NUMBER} ${env.DOCKER_REGISTRY}:latest
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
        sh 'mkdir -p gitOpsRepo'
        dir('gitOpsRepo') {
          git branch: "${env.GITHUB_BRANCH}",
              credentialsId: "${env.GITHUB_CREDENTIALS}",
              url: "${env.GITHUB_REPO_URL}"

          sh "git config --global user.email 'dongju08@naver.com'"
          sh "git config --global user.name 'rlaehdwn0105'"

          // values.yaml의 태그 버전 갱신
          sh "sed -i 's|tag: .*|tag: ${BUILD_NUMBER}|' helm-chart/my-backend/values.yaml"

          // 수정된 파일을 add, commit
          sh "git add helm-chart/my-backend/values.yaml"
          sh "git commit -m 'ci: rollout to canary image for build #${BUILD_NUMBER}' || echo 'No changes to commit'"

          withCredentials([gitUsernamePassword(credentialsId: "${env.GITHUB_CREDENTIALS}", gitToolName: 'git-tool')]) {
            sh "git remote set-url origin https://${env.GITHUB_CREDENTIALS}@github.com/rlaehdwn0105/Sondory-Service-BE.git"
            sh "git push origin ${env.GITHUB_BRANCH}"
          }
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
